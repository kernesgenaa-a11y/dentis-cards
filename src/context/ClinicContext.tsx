import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Patient, Doctor, ToothRecord, Visit, ChangeHistoryEntry } from '@/types/dental';
import { useAuth } from './AuthContext';

interface ClinicContextType {
  clinicName: string;
  doctors: Doctor[];
  patients: Patient[];
  selectedDoctorId: string | null;
  selectedPatientId: string | null;
  setSelectedDoctorId: (id: string | null) => void;
  setSelectedPatientId: (id: string | null) => void;
  addPatient: (patient: any) => Promise<void>;
  updatePatient: (patientId: string, patient: any) => Promise<void>;
  deletePatient: (patientId: string) => Promise<void>;
  addVisit: (patientId: string, visit: any) => void;
  deleteVisit: (patientId: string, visitId: string) => void;
  updateToothRecord: (patientId: string, toothNumber: number, record: Partial<ToothRecord>) => Promise<void>;
  getPatients: () => Promise<void>;
  getPatientDetails: (id: string) => Promise<void>;
  getPatientsByDoctor: (doctorId: string) => Patient[];
  addHistoryEntry: (patientId: string, entry: any) => void;
}

const API_URL = 'https://dentis-cards-api.nesterenkovasil9.workers.dev';
const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [clinicName] = useState('Dentis');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const getDoctors = useCallback(async () => {
    if (!token) return;
    try {
      console.log('Fetching doctors with token:', token.substring(0, 10) + '...');
      const res = await fetch(`${API_URL}/api/doctors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Doctors API response status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('Doctors data received:', data);
        setDoctors(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0 && !selectedDoctorId) {
          setSelectedDoctorId(data[0].id.toString());
        }
      } else {
        console.error('Failed to fetch doctors:', await res.text());
      }
    } catch (err) {
      console.error('Fetch doctors error:', err);
    }
  }, [token, selectedDoctorId]);

  const getPatients = useCallback(async () => {
    if (!token) {
      setPatients([]);
      return;
    }
    try {
      console.log('Fetching patients with token:', token.substring(0, 10) + '...');
      const res = await fetch(`${API_URL}/api/patients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Patients API response status:', res.status);
      
      if (!res.ok) {
        console.error('Failed to fetch patients:', await res.text());
        setPatients([]);
        return;
      }
      
      const data = await res.json();
      console.log('Patients data received:', data);
      
      // Sanitizing data to ensure UI components don't crash
      const patientList = Array.isArray(data) ? data : [];
      const sanitized = patientList.map((p: any) => ({
        ...p,
        id: p.id.toString(),
        doctorId: p.doctor_id?.toString() || '',
        dentalChart: p.dentalChart || [],
        visits: p.visits || [],
        changeHistory: p.changeHistory || [],
        createdAt: p.created_at || new Date().toISOString(),
        updatedAt: p.updated_at || new Date().toISOString()
      }));
      
      setPatients(sanitized);
    } catch (err) {
      console.error('Fetch error:', err);
      setPatients([]);
    }
  }, [token]);

  useEffect(() => {
    getPatients();
    getDoctors();
  }, [getPatients, getDoctors]);

  const addPatient = useCallback(async (patientData: any) => {
    if (!token) return;
    await fetch(`${API_URL}/api/patients`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientData)
    });
    await getPatients();
  }, [token, getPatients]);

  const updatePatient = useCallback(async (patientId: string, patientData: any) => {
    if (!token) return;
    await fetch(`${API_URL}/api/patients/${patientId}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientData)
    });
    await getPatients();
  }, [token, getPatients]);

  const deletePatient = useCallback(async (patientId: string) => {
    if (!token) return;
    await fetch(`${API_URL}/api/patients/${patientId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    await getPatients();
  }, [token, getPatients]);

  const getPatientsByDoctor = useCallback((doctorId: string) => {
    return patients.filter(p => p.doctorId === doctorId);
  }, [patients]);

  const addHistoryEntry = useCallback((patientId: string, entry: any) => {
    // Update local patient history
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          changeHistory: [
            {
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              ...entry
            },
            ...p.changeHistory
          ]
        };
      }
      return p;
    }));
  }, []);

  const addVisit = useCallback((patientId: string, visit: any) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          visits: [
            {
              id: Date.now().toString(),
              ...visit
            },
            ...p.visits
          ]
        };
      }
      return p;
    }));
  }, []);

  const deleteVisit = useCallback((patientId: string, visitId: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          visits: p.visits.filter(v => v.id !== visitId)
        };
      }
      return p;
    }));
  }, []);

  const updateToothRecord = useCallback(async (patientId: string, toothNumber: number, record: any) => {
    if (!token) return;
    await fetch(`${API_URL}/api/patients/${patientId}/teeth`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tooth_number: toothNumber, ...record })
    });
  }, [token]);

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
      addVisit,
      deleteVisit,
      updateToothRecord,
      getPatients,
      getPatientDetails: async () => {},
      getPatientsByDoctor,
      addHistoryEntry,
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
