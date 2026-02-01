import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Patient, Doctor, ToothRecord, Visit, FileAttachment } from '@/types/dental';
import { useLocalStorage, useBackup } from '@/hooks/useLocalStorage';

interface ClinicContextType {
  clinicName: string;
  doctors: Doctor[];
  patients: Patient[];
  selectedDoctorId: string | null;
  selectedPatientId: string | null;
  setSelectedDoctorId: (id: string | null) => void;
  setSelectedPatientId: (id: string | null) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'dentalChart' | 'visits' | 'createdAt' | 'updatedAt'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  updateToothRecord: (patientId: string, toothNumber: number, record: Partial<ToothRecord>) => void;
  addVisit: (patientId: string, visit: Omit<Visit, 'id'>) => void;
  updateVisit: (patientId: string, visitId: string, updates: Partial<Visit>) => void;
  deleteVisit: (patientId: string, visitId: string) => void;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  getPatientsByDoctor: (doctorId: string) => Patient[];
  searchPatients: (query: string, doctorId: string) => Patient[];
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const DEFAULT_DOCTORS: Doctor[] = [
  { id: 'doctor-1', name: 'Dr. Smith', specialty: 'General Dentistry' },
  { id: 'doctor-2', name: 'Dr. Johnson', specialty: 'Orthodontics' },
];

const DEFAULT_PATIENTS: Patient[] = [
  {
    id: 'patient-1',
    firstName: 'John',
    lastName: 'Williams',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    doctorId: 'doctor-1',
    dentalChart: [
      { toothNumber: 3, description: 'Cavity detected', templateId: 'cavity', files: [], notes: '', updatedAt: new Date().toISOString() },
      { toothNumber: 14, description: 'Crown placed', templateId: 'crown', files: [], notes: '', updatedAt: new Date().toISOString() },
    ],
    visits: [
      { id: 'v1', date: '2025-01-15', type: 'past', notes: 'Regular checkup', doctorId: 'doctor-1' },
      { id: 'v2', date: '2025-02-15', type: 'future', notes: 'Follow-up appointment', doctorId: 'doctor-1' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'patient-2',
    firstName: 'Sarah',
    lastName: 'Davis',
    phone: '+1 (555) 987-6543',
    dateOfBirth: '1990-07-22',
    doctorId: 'doctor-1',
    dentalChart: [],
    visits: [
      { id: 'v3', date: '2025-01-20', type: 'past', notes: 'Cleaning', doctorId: 'doctor-1' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const [clinicName] = useLocalStorage('dental_clinic_name', 'DentalCare Clinic');
  const [doctors, setDoctors] = useLocalStorage<Doctor[]>('dental_doctors', DEFAULT_DOCTORS);
  const [patients, setPatients] = useLocalStorage<Patient[]>('dental_patients', DEFAULT_PATIENTS);
  const [selectedDoctorId, setSelectedDoctorId] = useLocalStorage<string | null>('dental_selected_doctor', 'doctor-1');
  const [selectedPatientId, setSelectedPatientId] = useLocalStorage<string | null>('dental_selected_patient', null);
  const [lastBackup, setLastBackup] = useLocalStorage<string | null>('dental_last_backup', null);

  useBackup({ patients, doctors }, lastBackup, setLastBackup);

  const addPatient = useCallback((patientData: Omit<Patient, 'id' | 'dentalChart' | 'visits' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `patient-${Date.now()}`,
      dentalChart: [],
      visits: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPatients(prev => [...prev, newPatient]);
  }, [setPatients]);

  const updatePatient = useCallback((id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ));
  }, [setPatients]);

  const deletePatient = useCallback((id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    if (selectedPatientId === id) {
      setSelectedPatientId(null);
    }
  }, [selectedPatientId, setPatients, setSelectedPatientId]);

  const updateToothRecord = useCallback((patientId: string, toothNumber: number, record: Partial<ToothRecord>) => {
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      
      const existingIndex = p.dentalChart.findIndex(t => t.toothNumber === toothNumber);
      let newChart: ToothRecord[];
      
      if (existingIndex >= 0) {
        newChart = p.dentalChart.map((t, i) => 
          i === existingIndex ? { ...t, ...record, updatedAt: new Date().toISOString() } : t
        );
      } else {
        const newRecord: ToothRecord = {
          toothNumber,
          description: '',
          templateId: '',
          files: [],
          notes: '',
          updatedAt: new Date().toISOString(),
          ...record,
        };
        newChart = [...p.dentalChart, newRecord];
      }
      
      return { ...p, dentalChart: newChart, updatedAt: new Date().toISOString() };
    }));
  }, [setPatients]);

  const addVisit = useCallback((patientId: string, visit: Omit<Visit, 'id'>) => {
    const newVisit: Visit = { ...visit, id: `visit-${Date.now()}` };
    setPatients(prev => prev.map(p => 
      p.id === patientId 
        ? { ...p, visits: [...p.visits, newVisit], updatedAt: new Date().toISOString() }
        : p
    ));
  }, [setPatients]);

  const updateVisit = useCallback((patientId: string, visitId: string, updates: Partial<Visit>) => {
    setPatients(prev => prev.map(p => 
      p.id === patientId 
        ? { 
            ...p, 
            visits: p.visits.map(v => v.id === visitId ? { ...v, ...updates } : v),
            updatedAt: new Date().toISOString(),
          }
        : p
    ));
  }, [setPatients]);

  const deleteVisit = useCallback((patientId: string, visitId: string) => {
    setPatients(prev => prev.map(p => 
      p.id === patientId 
        ? { ...p, visits: p.visits.filter(v => v.id !== visitId), updatedAt: new Date().toISOString() }
        : p
    ));
  }, [setPatients]);

  const addDoctor = useCallback((doctorData: Omit<Doctor, 'id'>) => {
    const newDoctor: Doctor = { ...doctorData, id: `doctor-${Date.now()}` };
    setDoctors(prev => [...prev, newDoctor]);
  }, [setDoctors]);

  const updateDoctor = useCallback((id: string, updates: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, [setDoctors]);

  const deleteDoctor = useCallback((id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  }, [setDoctors]);

  const getPatientsByDoctor = useCallback((doctorId: string) => {
    return patients.filter(p => p.doctorId === doctorId);
  }, [patients]);

  const searchPatients = useCallback((query: string, doctorId: string) => {
    const lowerQuery = query.toLowerCase();
    return patients.filter(p => {
      if (p.doctorId !== doctorId) return false;
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      const matchesName = fullName.includes(lowerQuery);
      const matchesDate = p.visits.some(v => v.date.includes(query));
      return matchesName || matchesDate;
    });
  }, [patients]);

  return (
    <ClinicContext.Provider value={{
      clinicName,
      doctors,
      patients,
      selectedDoctorId,
      selectedPatientId,
      setSelectedDoctorId,
      setSelectedPatientId,
      addPatient,
      updatePatient,
      deletePatient,
      updateToothRecord,
      addVisit,
      updateVisit,
      deleteVisit,
      addDoctor,
      updateDoctor,
      deleteDoctor,
      getPatientsByDoctor,
      searchPatients,
    }}>
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (context === undefined) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
}
