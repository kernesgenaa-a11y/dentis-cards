import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

export function useBackup(data: unknown, lastBackup: string | null, setLastBackup: (date: string) => void) {
  useEffect(() => {
    const checkBackup = () => {
      const now = new Date();
      const lastBackupDate = lastBackup ? new Date(lastBackup) : null;
      
      if (!lastBackupDate || (now.getTime() - lastBackupDate.getTime()) > 7 * 24 * 60 * 60 * 1000) {
        // Create backup
        const backupData = {
          timestamp: now.toISOString(),
          data: data,
        };
        
        // Store backup in localStorage with timestamp
        const backupKey = `dental_backup_${now.toISOString().split('T')[0]}`;
        localStorage.setItem(backupKey, JSON.stringify(backupData));
        setLastBackup(now.toISOString());
        
        // Clean old backups (keep last 4)
        const backupKeys = Object.keys(localStorage)
          .filter(k => k.startsWith('dental_backup_'))
          .sort()
          .reverse();
        
        backupKeys.slice(4).forEach(k => localStorage.removeItem(k));
      }
    };

    checkBackup();
    const interval = setInterval(checkBackup, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(interval);
  }, [data, lastBackup, setLastBackup]);
}
