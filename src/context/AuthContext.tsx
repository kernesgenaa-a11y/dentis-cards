import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole } from '@/types/dental';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  canPerformAction: (action: 'add' | 'edit' | 'delete', resource: 'patient' | 'dental' | 'user') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USERS: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    password: 'admin123',
    name: 'Супер Адміністратор',
    role: 'super-admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doctor-1',
    username: 'verkhovskyi',
    password: 'doctor123',
    name: 'Верховський Олександр',
    role: 'doctor',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doctor-2',
    username: 'anton',
    password: 'doctor123',
    name: 'Антон Євгенійович',
    role: 'doctor',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'receptionist-1',
    username: 'reception',
    password: 'reception123',
    name: 'Адміністратор Клініки',
    role: 'administrator',
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>('dental_users', DEFAULT_USERS);
  const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>('dental_current_user', null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (currentUserId) {
      const user = users.find(u => u.id === currentUserId);
      setCurrentUser(user || null);
    } else {
      setCurrentUser(null);
    }
  }, [currentUserId, users]);

  const login = useCallback((username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUserId(user.id);
      return { success: true };
    }
    return { success: false, error: 'Невірний логін або пароль' };
  }, [users, setCurrentUserId]);

  const logout = useCallback(() => {
    setCurrentUserId(null);
  }, [setCurrentUserId]);

  const addUser = useCallback((userData: Omit<User, 'id' | 'createdAt'>) => {
    if (users.some(u => u.username === userData.username)) {
      return { success: false, error: 'Такий логін вже існує' };
    }
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true };
  }, [users, setUsers]);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  }, [setUsers]);

  const deleteUser = useCallback((id: string) => {
    if (id === currentUserId) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  }, [currentUserId, setUsers]);

  const canPerformAction = useCallback((action: 'add' | 'edit' | 'delete', resource: 'patient' | 'dental' | 'user') => {
    if (!currentUser) return false;
    
    const permissions: Record<UserRole, Record<string, string[]>> = {
      'super-admin': {
        patient: ['add', 'edit', 'delete'],
        dental: ['add', 'edit', 'delete'],
        user: ['add', 'edit', 'delete'],
      },
      'doctor': {
        patient: ['add', 'edit', 'delete'],
        dental: ['add', 'edit', 'delete'],
        user: [],
      },
      'administrator': {
        patient: ['add', 'edit'],
        dental: [],
        user: [],
      },
    };

    return permissions[currentUser.role][resource]?.includes(action) ?? false;
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      canPerformAction,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
