import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginPage } from '@/components/auth/LoginPage';
import { Header } from '@/components/layout/Header';
import { PatientList } from '@/components/patients/PatientList';
import { DentalChart } from '@/components/dental/DentalChart';

const Index = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex p-4 gap-4 overflow-hidden">
        <PatientList />
        <DentalChart />
      </main>
    </div>
  );
};

export default Index;
