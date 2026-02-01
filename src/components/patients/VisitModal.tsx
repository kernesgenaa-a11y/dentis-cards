import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useClinic } from '@/context/ClinicContext';

interface VisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

export function VisitModal({ isOpen, onClose, patientId }: VisitModalProps) {
  const { selectedDoctorId, addVisit } = useClinic();
  
  const [date, setDate] = useState('');
  const [type, setType] = useState<'past' | 'future'>('future');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctorId) return;

    addVisit(patientId, {
      date,
      type,
      notes,
      doctorId: selectedDoctorId,
    });
    
    setDate('');
    setType('future');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Add Visit</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="visitDate">Date</Label>
            <Input
              id="visitDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Visit Type</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as 'past' | 'future')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="future" id="future" />
                <Label htmlFor="future" className="font-normal">Scheduled (Future)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="past" id="past" />
                <Label htmlFor="past" className="font-normal">Completed (Past)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add visit notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Visit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
