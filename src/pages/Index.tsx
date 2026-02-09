import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginPage } from '@/components/auth/LoginPage';
import { Header } from '@/components/layout/Header';
import { PatientList } from '@/components/patients/PatientList';
import { DentalChart } from '@/components/dental/DentalChart';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex flex-col md:flex-row p-2 md:p-4 gap-2 md:gap-4 overflow-hidden">
        {/* Mobile: Sheet for patient list */}
        {isMobile ? (
          <>
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 w-full mb-2"
                >
                  <Users className="w-4 h-4" />
                  Список пацієнтів
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0">
                <PatientList onPatientSelect={() => setIsSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
            <DentalChart />
          </>
        ) : (
          <>
            <PatientList />
            <DentalChart />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
