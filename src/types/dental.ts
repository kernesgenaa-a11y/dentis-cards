export type UserRole = 'super-admin' | 'doctor' | 'administrator';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface ToothRecord {
  toothNumber: number;
  description: string;
  templateId: string;
  files: FileAttachment[];
  notes: string;
  updatedAt: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  data: string;
  uploadedAt: string;
}

export interface Visit {
  id: string;
  date: string;
  type: 'past' | 'future';
  notes: string;
  doctorId: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  doctorId: string;
  dentalChart: ToothRecord[];
  visits: Visit[];
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export interface Clinic {
  name: string;
  doctors: Doctor[];
}

export interface AppState {
  currentUser: User | null;
  selectedDoctorId: string | null;
  selectedPatientId: string | null;
  patients: Patient[];
  users: User[];
  clinic: Clinic;
  lastBackup: string | null;
}

export const DENTAL_TEMPLATES = [
  { id: 'cavity', label: 'Cavity', description: 'Tooth decay requiring treatment' },
  { id: 'filling', label: 'Filling', description: 'Existing or needed filling' },
  { id: 'crown', label: 'Crown', description: 'Crown placement or needed' },
  { id: 'root-canal', label: 'Root Canal', description: 'Root canal treatment' },
  { id: 'extraction', label: 'Extraction', description: 'Tooth extraction needed or done' },
  { id: 'implant', label: 'Implant', description: 'Dental implant' },
  { id: 'bridge', label: 'Bridge', description: 'Dental bridge' },
  { id: 'periodontal', label: 'Periodontal Issue', description: 'Gum disease or treatment' },
  { id: 'sensitivity', label: 'Sensitivity', description: 'Tooth sensitivity' },
  { id: 'fracture', label: 'Fracture', description: 'Cracked or fractured tooth' },
  { id: 'missing', label: 'Missing', description: 'Missing tooth' },
  { id: 'healthy', label: 'Healthy', description: 'No issues detected' },
];

// Adult dentition numbering (Universal Numbering System)
export const UPPER_TEETH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
export const LOWER_TEETH = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];
