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
            {isEditing ? 'Edit Patient' : 'Add New Patient'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
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
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Add Patient'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
