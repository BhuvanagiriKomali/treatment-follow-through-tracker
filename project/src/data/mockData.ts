import type { Patient, DoseRecord } from '@/types';

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function makeHistory(days: number, pattern: 'good' | 'missed_recent' | 'intermittent'): DoseRecord[] {
  const records: DoseRecord[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const status = i === 0 ? 'pending' : null;
    if (status) {
      records.push({ date: dateStr(i), status });
      continue;
    }
    let s: 'taken' | 'missed' = 'taken';
    if (pattern === 'missed_recent' && i <= 2) {
      s = 'missed';
    } else if (pattern === 'intermittent' && i % 5 === 0) {
      s = 'missed';
    }
    records.push({ date: dateStr(i), status: s });
  }
  return records;
}

export const mockPatients: Patient[] = [
  {
    id: 'P-001',
    name: 'Amara Okafor',
    treatmentName: 'TB Treatment (6-month course)',
    startDate: dateStr(120),
    durationDays: 180,
    reminderTime: '08:00',
    doseHistory: makeHistory(14, 'good'),
    pin: '1234',
  },
  {
    id: 'P-002',
    name: 'Kwame Mensah',
    treatmentName: 'TB Treatment (6-month course)',
    startDate: dateStr(45),
    durationDays: 180,
    reminderTime: '09:30',
    doseHistory: makeHistory(14, 'missed_recent'),
    pin: '2345',
  },
  {
    id: 'P-003',
    name: 'Fatima Diallo',
    treatmentName: 'TB Treatment (6-month course)',
    startDate: dateStr(30),
    durationDays: 180,
    reminderTime: '07:00',
    doseHistory: makeHistory(14, 'intermittent'),
    pin: '3456',
  },
  {
    id: 'P-004',
    name: 'Joseph Mwangi',
    treatmentName: 'TB Treatment (6-month course)',
    startDate: dateStr(8),
    durationDays: 180,
    reminderTime: '10:00',
    doseHistory: makeHistory(8, 'good'),
    pin: '4567',
  },
];

// The patient assigned to the demo family member
export const familyMemberPatientId = 'P-002';

// Find a patient by ID
export function getPatientById(patients: Patient[], id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}
