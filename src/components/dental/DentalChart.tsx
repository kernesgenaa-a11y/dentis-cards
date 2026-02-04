import React, { useState } from 'react';
import { Tooth } from './Tooth';
import { ToothModal } from './ToothModal';
import { VisitHistory } from './VisitHistory';
import { UPPER_TEETH, LOWER_TEETH, ToothRecord } from '@/types/dental';
import { useClinic } from '@/context/ClinicContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar } from 'lucide-react';

export function DentalChart() {
  const { patients, selectedPatientId, updateToothRecord } = useClinic();
  const { canPerformAction } = useAuth();
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  
  const patient = patients.find(p => p.id === selectedPatientId);
  
  if (!patient) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-xl">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Пацієнт не обраний</h3>
          <p className="text-muted-foreground">Оберіть пацієнта зі списку для перегляду зубної карти</p>
        </div>
      </div>
    );
  }

  const getToothRecord = (toothNumber: number): ToothRecord | undefined => {
    return patient.dentalChart.find(t => t.toothNumber === toothNumber);
  };

  const handleToothClick = (toothNumber: number) => {
    if (canPerformAction('edit', 'dental')) {
      setSelectedTooth(toothNumber);
    }
  };

  const handleSaveRecord = (record: Partial<ToothRecord>) => {
    if (selectedTooth !== null) {
      updateToothRecord(patient.id, selectedTooth, record);
    }
  };

  const issueCount = patient.dentalChart.filter(t => t.description || t.files.length > 0).length;

  return (
    <Card className="flex-1 overflow-hidden animate-fade-in">
      <CardHeader className="border-b bg-card p-3 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <CardTitle className="font-heading text-lg md:text-xl">
              {patient.firstName} {patient.lastName}
            </CardTitle>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-1 text-xs md:text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                {new Date(patient.dateOfBirth).toLocaleDateString('uk-UA')}
              </span>
              <span>{patient.phone}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {issueCount > 0 && (
              <Badge variant="destructive" className="text-xs">{issueCount} проблем</Badge>
            )}
            <Badge variant="secondary" className="text-xs">32 зуби</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-2 md:p-6 overflow-auto">
        <div className="min-w-[280px] md:min-w-[520px]">
          {/* Upper teeth */}
          <div className="mb-2">
            <div className="text-[10px] md:text-xs font-medium text-muted-foreground mb-1 text-center">Верхня щелепа</div>
            <div className="flex justify-center">
              {UPPER_TEETH.map((num) => (
                <Tooth
                  key={num}
                  number={num}
                  isUpper={true}
                  record={getToothRecord(num)}
                  isSelected={selectedTooth === num}
                  onClick={() => handleToothClick(num)}
                />
              ))}
            </div>
          </div>
          
          {/* Divider */}
          <div className="flex items-center justify-center my-2 md:my-3">
            <div className="flex-1 h-px bg-border" />
            <div className="px-2 md:px-4 text-[10px] md:text-xs text-muted-foreground font-medium">ЗУБНА КАРТА</div>
            <div className="flex-1 h-px bg-border" />
          </div>
          
          {/* Lower teeth - reversed order for mirroring from center */}
          <div>
            <div className="flex justify-center">
              {LOWER_TEETH.map((num) => (
                <Tooth
                  key={num}
                  number={num}
                  isUpper={false}
                  record={getToothRecord(num)}
                  isSelected={selectedTooth === num}
                  onClick={() => handleToothClick(num)}
                />
              ))}
            </div>
            <div className="text-[10px] md:text-xs font-medium text-muted-foreground mt-1 text-center">Нижня щелепа</div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 md:mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-6 text-[10px] md:text-xs">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-4 h-4 rounded bg-destructive/20" />
            <span className="text-muted-foreground">Зуб із записом</span>
          </div>
        </div>

        {/* Visit History */}
        <VisitHistory patientId={patient.id} />
      </CardContent>

      {/* Tooth Modal */}
      <ToothModal
        isOpen={selectedTooth !== null}
        onClose={() => setSelectedTooth(null)}
        toothNumber={selectedTooth || 0}
        record={selectedTooth ? getToothRecord(selectedTooth) : undefined}
        onSave={handleSaveRecord}
      />
    </Card>
  );
}
