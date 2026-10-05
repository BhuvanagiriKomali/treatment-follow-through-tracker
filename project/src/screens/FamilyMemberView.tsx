import { ArrowLeft, CheckCircle2, XCircle, Clock, Calendar, Heart, BellRing, AlertCircle } from 'lucide-react';
import type { Patient, DoseStatus } from '@/types';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { StatusBadge } from '@/components/StatusBadge';
import {
  progressPercent,
  todayStatus,
  formatDate,
  formatReminderTime,
  formatDayLabel,
  daysElapsed,
  isPastReminderTime,
  isPastDeadline,
  deadlineTime,
} from '@/utils/doseUtils';

interface FamilyMemberViewProps {
  patient: Patient;
  role?: 'family_member' | 'patient';
  onMarkDose: (status: DoseStatus) => void;
  onSwitchRole: () => void;
  onBack: () => void;
}

export function FamilyMemberView({ patient, role = 'family_member', onMarkDose, onSwitchRole, onBack }: FamilyMemberViewProps) {
  const status = todayStatus(patient);
  const progress = progressPercent(patient);
  const elapsed = daysElapsed(patient.startDate);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const recentHistory = [...patient.doseHistory].reverse().slice(0, 7);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header role={role} patientName={patient.name} onSwitchRole={onSwitchRole} />
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Switch Role
        </button>

        {/* Today's reminder card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-teal-600">
            <BellRing className="h-5 w-5" />
            <h2 className="text-sm font-semibold uppercase tracking-wide">Today's Reminder</h2>
          </div>
          <p className="mt-1 text-xs text-gray-500">{today}</p>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <Heart className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">{patient.name}</p>
              <p className="text-sm text-gray-500">{patient.treatmentName}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 rounded-lg bg-teal-50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal-600" />
              <p className="text-sm text-teal-800">
                Reminder set for <span className="font-semibold">{formatReminderTime(patient.reminderTime)}</span> daily
              </p>
            </div>
            {isPastReminderTime(patient.reminderTime) && !isPastDeadline(patient.reminderTime) && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                <AlertCircle className="h-3.5 w-3.5" />
                Confirm by {deadlineTime(patient.reminderTime)} or it's marked missed
              </p>
            )}
          </div>

          {/* Dose action area */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Today's Dose</p>
              <StatusBadge status={status} />
            </div>

            {status === 'pending' ? (
              <button
                onClick={() => onMarkDose('taken')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                <CheckCircle2 className="h-6 w-6" />
                Mark as Taken
              </button>
            ) : status === 'taken' ? (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                Dose marked as taken for today.
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
                <XCircle className="h-5 w-5" />
                Dose was missed — not confirmed before the deadline.
              </div>
            )}
          </div>
        </div>

        {/* Progress card */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Calendar className="h-4 w-4 text-teal-600" />
            Treatment Progress
          </h3>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
              <span>Day {Math.min(elapsed, patient.durationDays)} of {patient.durationDays}</span>
              <span className="font-medium text-gray-700">{progress}%</span>
            </div>
            <ProgressBar percent={progress} />
          </div>
          <p className="mt-2 text-xs text-gray-500">Started on {formatDate(patient.startDate)}</p>
        </div>

        {/* Recent history */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Recent Doses</h3>
          <ul className="mt-2 divide-y divide-gray-100">
            {recentHistory.map((d) => (
              <li key={d.date} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">{formatDayLabel(d.date)}</span>
                <StatusBadge status={d.status} size="sm" />
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          This is a tracking reminder, not medical advice. Consult your health worker for treatment questions.
        </p>
      </main>
    </div>
  );
}
