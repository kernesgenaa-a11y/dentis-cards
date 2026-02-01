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
  { id: 'cavity', label: 'Карієс', description: 'Карієс, що потребує лікування' },
  { id: 'filling', label: 'Пломба', description: 'Наявна або необхідна пломба' },
  { id: 'crown', label: 'Коронка', description: 'Встановлена або необхідна коронка' },
  { id: 'root-canal', label: 'Лікування каналів', description: 'Ендодонтичне лікування' },
  { id: 'extraction', label: 'Видалення', description: 'Видалення зуба виконано або заплановано' },
  { id: 'implant', label: 'Імплант', description: 'Дентальний імплант' },
  { id: 'bridge', label: 'Міст', description: 'Зубний міст' },
  { id: 'periodontal', label: 'Пародонтит', description: 'Захворювання ясен або лікування' },
  { id: 'sensitivity', label: 'Чутливість', description: 'Підвищена чутливість зуба' },
  { id: 'fracture', label: 'Тріщина', description: 'Тріщина або скол зуба' },
  { id: 'missing', label: 'Відсутній', description: 'Відсутній зуб' },
  { id: 'healthy', label: 'Здоровий', description: 'Проблем не виявлено' },
];

// Adult dentition numbering (Universal Numbering System)
export const UPPER_TEETH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
export const LOWER_TEETH = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];
