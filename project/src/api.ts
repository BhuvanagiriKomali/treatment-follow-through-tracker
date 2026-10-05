import type { Patient, DoseRecord } from './types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_BASE = BASE_URL.endsWith('/api')
  ? BASE_URL
  : `${BASE_URL.replace(/\/+$/, '')}/api`;

export const familyMemberPatientId = 'P-002';

/**
 * 1. GET /api/patients
 * Fetch all patients.
 */
export async function getPatients(): Promise<Patient[]> {
  const res = await fetch(`${API_BASE}/patients`);
  if (!res.ok) {
    throw new Error(`Failed to fetch patients: ${res.statusText}`);
  }
  return res.json();
}

/**
 * 2. GET /api/patients/:id
 * Fetch a single patient by ID.
 */
export async function getPatientById(id: string): Promise<Patient> {
  const res = await fetch(`${API_BASE}/patients/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch patient ${id}: ${res.statusText}`);
  }
  return res.json();
}

/**
 * 3. POST /api/patients
 * Create a new patient.
 */
export async function createPatient(patient: {
  name: string;
  treatmentName: string;
  startDate: string;
  durationDays: number;
  reminderTime: string;
  pin: string;
  id?: string;
  doseHistory?: DoseRecord[];
}): Promise<Patient> {
  const res = await fetch(`${API_BASE}/patients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patient),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to create patient: ${res.statusText}`);
  }
  return res.json();
}

/**
 * 4. POST /api/patients/:id/dose
 * Update today's dose for that patient.
 */
export async function recordDose(patientId: string, status: 'taken' | 'missed'): Promise<Patient> {
  const res = await fetch(`${API_BASE}/patients/${patientId}/dose`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to record dose: ${res.statusText}`);
  }
  return res.json();
}
