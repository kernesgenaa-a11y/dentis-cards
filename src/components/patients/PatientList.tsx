import React, { useState, useMemo } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, User, Phone, MoreVertical, Trash2, Edit2, History, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PatientModal, formatPhoneForDisplay } from './PatientModal';
import { PatientHistoryModal } from './PatientHistoryModal';
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
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [newOldFilter, setNewOldFilter] = useState<string>('all');
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [editingPatient, setEditingPatient] = useState<string | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<string | null>(null);
  const [historyPatient, setHistoryPatient] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const filteredPatients = useMemo(() => {
    const doctorPatients = selectedDoctorId === 'all' 
      ? patients 
      : selectedDoctorId 
        ? getPatientsByDoctor(selectedDoctorId) 
        : [];
    
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    return doctorPatients.filter(p => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const fullName = `${p.firstName} ${p.lastName} ${p.middleName || ''}`.toLowerCase();
        if (!fullName.includes(query) && !p.visits.some(v => v.date.includes(searchQuery))) return false;
      }
      // Gender filter
      if (genderFilter !== 'all' && p.gender !== genderFilter) return false;
      // New/Old filter
      if (newOldFilter === 'new' && new Date(p.createdAt) < twoWeeksAgo) return false;
      if (newOldFilter === 'old' && new Date(p.createdAt) >= twoWeeksAgo) return false;
      return true;
    });
  }, [selectedDoctorId, patients, searchQuery, genderFilter, newOldFilter, getPatientsByDoctor]);

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
    <Card className="w-full flex flex-col h-full animate-slide-in border-0 md:border shadow-none md:shadow-sm bg-muted/10">
      <CardHeader className="border-b shrink-0">
        <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-2 md:gap-0 mb-3">
          <CardTitle className="font-heading text-lg order-2 md:order-1">Пацієнти</CardTitle>
          {canPerformAction('add', 'patient') && (
            <Button size="sm" onClick={() => setIsAddingPatient(true)} className="order-1 md:order-2">
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
        <div className="flex gap-2 mt-2">
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue placeholder="Стать" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Усі</SelectItem>
              <SelectItem value="male">Ч</SelectItem>
              <SelectItem value="female">Ж</SelectItem>
            </SelectContent>
          </Select>
          <Select value={newOldFilter} onValueChange={setNewOldFilter}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue placeholder="Новий/Старий" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Усі</SelectItem>
              <SelectItem value="new">Новий</SelectItem>
              <SelectItem value="old">Старий</SelectItem>
            </SelectContent>
          </Select>
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
                          <h4 className="font-medium truncate">
                            {patient.lastName} {patient.firstName} {patient.middleName || ''}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {formatPhoneForDisplay(patient.phone)}
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
                              {(currentUser?.role === 'super-admin' || currentUser?.role === 'doctor') && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setHistoryPatient(patient.id);
                                  }}
                                >
                                  <History className="w-4 h-4 mr-2" />
                                  Історія змін
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

      {/* History Modal */}
      <PatientHistoryModal
        isOpen={historyPatient !== null}
        onClose={() => setHistoryPatient(null)}
        patientId={historyPatient}
      />
    </Card>
  );
}
