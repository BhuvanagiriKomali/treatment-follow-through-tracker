import { ArrowLeft, AlertTriangle, Calendar, Clock, Activity, ListChecks } from 'lucide-react';
import type { Patient, DoseStatus } from '@/types';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { StatusBadge } from '@/components/StatusBadge';
import {
  progressPercent,
  todayStatus,
  hasRecentMiss,
  formatDate,
  formatDayLabel,
  formatReminderTime,
  daysElapsed,
  missedDoseCount,
} from '@/utils/doseUtils';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onSwitchRole: () => void;
}

export function PatientDetail({ patient, onBack, onSwitchRole }: PatientDetailProps) {
  const progress = progressPercent(patient);
  const status = todayStatus(patient);
  const elapsed = daysElapsed(patient.startDate);
  const missed = missedDoseCount(patient.doseHistory);
  const hasMiss = hasRecentMiss(patient);

  const recentHistory = [...patient.doseHistory].reverse().slice(0, 14);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header role="health_worker" onSwitchRole={onSwitchRole} />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patient List
        </button>

        {/* Patient header card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">{patient.name}</h2>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">{patient.id}</span>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">{patient.treatmentName}</p>
            </div>
            <StatusBadge status={status} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <InfoTile Icon={Calendar} label="Start Date" value={formatDate(patient.startDate)} />
            <InfoTile Icon={Clock} label="Reminder Time" value={formatReminderTime(patient.reminderTime)} />
            <InfoTile Icon={Activity} label="Progress" value={`Day ${Math.min(elapsed, patient.durationDays)} / ${patient.durationDays}`} />
          </div>

          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
              <span>Treatment Progress</span>
              <span className="font-medium text-gray-700">{progress}%</span>
            </div>
            <ProgressBar percent={progress} />
          </div>
        </div>

        {/* Missed-dose warning */}
        {hasMiss && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
            <div>
              <p className="font-semibold text-sm text-red-800">Missed-Dose Warning</p>
              <p className="text-sm text-red-700">
                {patient.name} has missed one or more doses in the last 3 days. Follow-up is recommended.
              </p>
            </div>
          </div>
        )}

        {/* Recent dose history */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <ListChecks className="h-4 w-4 text-teal-600" />
            Recent Dose History (last 14 days)
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {recentHistory.map((d) => (
              <DoseDay key={d.date} date={d.date} status={d.status} />
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Taken</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Missed</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Pending</span>
            <span className="ml-auto font-medium text-red-600">{missed} total missed</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoTile({ Icon, label, value }: { Icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function DoseDay({ date, status }: { date: string; status: DoseStatus }) {
  const colors: Record<DoseStatus, string> = {
    taken: 'bg-emerald-500',
    missed: 'bg-red-500',
    pending: 'bg-amber-400',
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`h-9 w-9 rounded-lg ${colors[status]}`} title={`${formatDayLabel(date)} — ${status}`} />
      <span className="text-[10px] text-gray-400">{formatDayLabel(date)}</span>
    </div>
  );
}
