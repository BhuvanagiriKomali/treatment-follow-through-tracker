import type { Patient, DoseRecord, DoseStatus } from '@/types';

export function daysElapsed(startDate: string): number {
  const start = new Date(startDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000);
  return Math.max(0, diff);
}

export function progressPercent(patient: Patient): number {
  const elapsed = daysElapsed(patient.startDate);
  return Math.min(100, Math.round((elapsed / patient.durationDays) * 100));
}

export const GRACE_PERIOD_HOURS = 4;

export function isPastReminderTime(reminderTime: string): boolean {
  const now = new Date();
  const [h, m] = reminderTime.split(':').map(Number);
  const reminder = new Date();
  reminder.setHours(h, m, 0, 0);
  return now.getTime() > reminder.getTime();
}

export function isPastDeadline(reminderTime: string): boolean {
  const now = new Date();
  const [h, m] = reminderTime.split(':').map(Number);
  const deadline = new Date();
  deadline.setHours(h, m, 0, 0);
  deadline.setHours(deadline.getHours() + GRACE_PERIOD_HOURS);
  return now.getTime() > deadline.getTime();
}

export function deadlineTime(reminderTime: string): string {
  const [h, m] = reminderTime.split(':').map(Number);
  const deadline = new Date();
  deadline.setHours(h, m, 0, 0);
  deadline.setHours(deadline.getHours() + GRACE_PERIOD_HOURS);
  const period = deadline.getHours() >= 12 ? 'PM' : 'AM';
  const hour12 = deadline.getHours() % 12 === 0 ? 12 : deadline.getHours() % 12;
  return `${hour12}:${deadline.getMinutes().toString().padStart(2, '0')} ${period}`;
}

export function todayStatus(patient: Patient): DoseStatus {
  const today = new Date().toISOString().split('T')[0];
  const record = patient.doseHistory.find((d) => d.date === today);
  if (!record) return 'pending';
  if (record.status === 'pending' && isPastDeadline(patient.reminderTime)) {
    return 'missed';
  }
  return record.status;
}

export function missedDoseCount(history: DoseRecord[]): number {
  return history.filter((d) => d.status === 'missed').length;
}

export function hasRecentMiss(patient: Patient): boolean {
  const today = new Date();
  const recent = new Date(today);
  recent.setDate(recent.getDate() - 3);
  const recentStr = recent.toISOString().split('T')[0];
  return patient.doseHistory.some((d) => d.status === 'missed' && d.date >= recentStr);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatReminderTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}
