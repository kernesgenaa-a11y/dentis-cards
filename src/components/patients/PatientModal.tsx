import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClinic } from '@/context/ClinicContext';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string | null;
}

export function PatientModal({ isOpen, onClose, patientId }: PatientModalProps) {
  const { patients, selectedDoctorId, addPatient, updatePatient } = useClinic();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const isEditing = !!patientId;
  const existingPatient = patientId ? patients.find(p => p.id === patientId) : null;

  useEffect(() => {
    if (existingPatient) {
      setFirstName(existingPatient.firstName);
      setLastName(existingPatient.lastName);
      setPhone(existingPatient.phone);
      setDateOfBirth(existingPatient.dateOfBirth);
    } else {
      setFirstName('');
      setLastName('');
      setPhone('');
      setDateOfBirth('');
    }
  }, [existingPatient, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctorId) return;

    if (isEditing && patientId) {
      updatePatient(patientId, {
        firstName,
        lastName,
        phone,
        dateOfBirth,
      });
    } else {
      addPatient({
        firstName,
        lastName,
        phone,
        dateOfBirth,
        doctorId: selectedDoctorId,
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {isEditing ? 'Редагувати пацієнта' : 'Додати нового пацієнта'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ім'я</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Іван"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Прізвище</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Петренко"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Номер телефону</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+380 (50) 123-4567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Дата народження</Label>
            <Input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Скасувати
            </Button>
            <Button type="submit">
              {isEditing ? 'Зберегти зміни' : 'Додати пацієнта'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
