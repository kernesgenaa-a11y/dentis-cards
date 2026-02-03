import React, { useState, useMemo } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, User, Phone, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { PatientModal } from './PatientModal';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PatientListProps {
  onPatientSelect?: () => void;
}

export function PatientList({ onPatientSelect }: PatientListProps) {
  const { 
    patients, 
    selectedDoctorId, 
    selectedPatientId, 
    setSelectedPatientId,
    deletePatient,
    getPatientsByDoctor 
  } = useClinic();
  const { canPerformAction } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [editingPatient, setEditingPatient] = useState<string | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<string | null>(null);

  const filteredPatients = useMemo(() => {
    if (!selectedDoctorId) return [];
    const doctorPatients = getPatientsByDoctor(selectedDoctorId);
    
    if (!searchQuery.trim()) return doctorPatients;
    
    const query = searchQuery.toLowerCase();
    return doctorPatients.filter(p => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      const matchesName = fullName.includes(query);
      const matchesDate = p.visits.some(v => v.date.includes(searchQuery));
      return matchesName || matchesDate;
    });
  }, [selectedDoctorId, patients, searchQuery, getPatientsByDoctor]);

  const handlePatientClick = (patientId: string) => {
    setSelectedPatientId(patientId);
    onPatientSelect?.();
  };

  const handleDeleteConfirm = () => {
    if (deletingPatient) {
      deletePatient(deletingPatient);
      setDeletingPatient(null);
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <Card className="w-full md:w-80 flex flex-col h-full animate-slide-in border-0 md:border shadow-none md:shadow-sm">
      <CardHeader className="border-b shrink-0">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="font-heading text-lg">Пацієнти</CardTitle>
          {canPerformAction('add', 'patient') && (
            <Button size="sm" onClick={() => setIsAddingPatient(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Додати
            </Button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Пошук за ім'ям або датою..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Пацієнтів не знайдено' : 'Пацієнтів ще немає'}
                </p>
              </div>
            ) : (
              filteredPatients.map(patient => {
                const issueCount = patient.dentalChart.filter(t => t.description || t.files.length > 0).length;
                const isSelected = selectedPatientId === patient.id;
                
                return (
                  <div key={patient.id} className="animate-fade-in">
                    <div
                      className={cn(
                        'p-3 rounded-lg cursor-pointer transition-all duration-200',
                        'hover:bg-muted/50 group',
                        isSelected && 'bg-primary/10 border border-primary/20'
                      )}
                      onClick={() => handlePatientClick(patient.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium truncate">
                              {patient.firstName} {patient.lastName}
                            </h4>
                            {issueCount > 0 && (
                              <Badge variant="destructive" className="text-[10px] h-5">
                                {issueCount}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {patient.phone}
                            </span>
                          </div>
                        </div>
                        
                        {/* Three-dot menu */}
                        {(canPerformAction('edit', 'patient') || canPerformAction('delete', 'patient')) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {canPerformAction('edit', 'patient') && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingPatient(patient.id);
                                  }}
                                >
                                  <Edit2 className="w-4 h-4 mr-2" />
                                  Редагувати
                                </DropdownMenuItem>
                              )}
                              {canPerformAction('delete', 'patient') && (
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingPatient(patient.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Видалити
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Add/Edit Patient Modal */}
      <PatientModal
        isOpen={isAddingPatient || editingPatient !== null}
        onClose={() => {
          setIsAddingPatient(false);
          setEditingPatient(null);
        }}
        patientId={editingPatient}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deletingPatient !== null} onOpenChange={() => setDeletingPatient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Видалити пацієнта</AlertDialogTitle>
            <AlertDialogDescription>
              Ви впевнені, що хочете видалити цього пацієнта? Цю дію неможливо скасувати. Будуть видалені всі пов'язані стоматологічні записи та візити.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Видалити
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
