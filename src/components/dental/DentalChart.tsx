import React, { useState } from 'react';
import { Tooth } from './Tooth';
import { ToothModal } from './ToothModal';
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
      <CardHeader className="border-b bg-card">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-heading text-xl">
              {patient.firstName} {patient.lastName}
            </CardTitle>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Дата народження: {new Date(patient.dateOfBirth).toLocaleDateString('uk-UA')}
              </span>
              <span>{patient.phone}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {issueCount > 0 && (
              <Badge variant="destructive">{issueCount} проблем</Badge>
            )}
            <Badge variant="secondary">32 зуби</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 overflow-auto">
        <div className="min-w-[700px]">
          {/* Upper teeth */}
          <div className="mb-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 text-center">Верхня щелепа</div>
            <div className="flex justify-center gap-1">
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
          <div className="flex items-center justify-center my-4">
            <div className="flex-1 h-px bg-border" />
            <div className="px-4 text-xs text-muted-foreground font-medium">ЗУБНА КАРТА</div>
            <div className="flex-1 h-px bg-border" />
          </div>
          
          {/* Lower teeth */}
          <div>
            <div className="flex justify-center gap-1">
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
            <div className="text-xs font-medium text-muted-foreground mt-2 text-center">Нижня щелепа</div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-tooth-healthy border border-border" />
            <span className="text-muted-foreground">Здоровий</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-tooth-issue border border-tooth-issue-border" />
            <span className="text-muted-foreground">Є записи/файли</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-tooth-selected border-2 border-tooth-selected-border" />
            <span className="text-muted-foreground">Обраний</span>
          </div>
        </div>
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
