export type Role = 'health_worker' | 'family_member' | 'patient';

export type DoseStatus = 'taken' | 'missed' | 'pending';

export interface DoseRecord {
  date: string; // YYYY-MM-DD
  status: DoseStatus;
}

export interface Patient {
  id: string;
  name: string;
  treatmentName: string;
  startDate: string; // YYYY-MM-DD
  durationDays: number;
  reminderTime: string; // HH:MM 24h
  doseHistory: DoseRecord[];
  pin: string; // 4-digit demo PIN
}

export type View =
  | { name: 'landing' }
  | { name: 'hw_dashboard' }
  | { name: 'hw_patient_detail'; patientId: string }
  | { name: 'hw_add_patient' }
  | { name: 'patient_login' }
  | { name: 'patient_view'; patientId: string };
