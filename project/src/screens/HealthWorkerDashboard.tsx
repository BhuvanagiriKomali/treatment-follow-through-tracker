import { Plus, AlertTriangle, ChevronRight, Users, Clock } from 'lucide-react';
import type { Patient } from '@/types';
import { ProgressBar } from '@/components/ProgressBar';
import { StatusBadge } from '@/components/StatusBadge';
import { Header } from '@/components/Header';
import { progressPercent, todayStatus, hasRecentMiss, formatDate, daysElapsed } from '@/utils/doseUtils';

interface HealthWorkerDashboardProps {
  patients: Patient[];
  onAddPatient: () => void;
  onPatientClick: (patientId: string) => void;
  onSwitchRole: () => void;
}

export function HealthWorkerDashboard({ patients, onAddPatient, onPatientClick, onSwitchRole }: HealthWorkerDashboardProps) {
  const alertPatients = patients.filter(hasRecentMiss);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header role="health_worker" onSwitchRole={onSwitchRole} />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Patient Overview</h2>
            <p className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              {today}
            </p>
          </div>
          <button
            onClick={onAddPatient}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Patient
          </button>
        </div>

        {/* Alerts section */}
        {alertPatients.length > 0 && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Missed-Dose Alerts ({alertPatients.length})</h3>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-red-700">
              {alertPatients.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2">
                  <span>
                    <span className="font-medium">{p.name}</span> ({p.id}) — missed a dose in the last 3 days
                  </span>
                  <button onClick={() => onPatientClick(p.id)} className="shrink-0 text-xs font-medium underline hover:text-red-900">
                    View
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Summary stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <StatCard label="Total Patients" value={patients.length} Icon={Users} color="teal" />
          <StatCard label="Pending Today" value={patients.filter((p) => todayStatus(p) === 'pending').length} Icon={Clock} color="amber" />
          <StatCard label="Missed Recent" value={alertPatients.length} Icon={AlertTriangle} color="red" />
        </div>

        {/* Patient list */}
        <div className="space-y-3">
          {patients.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-400">
              No patients yet. Click "Add Patient" to get started.
            </div>
          ) : (
            patients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} onClick={() => onPatientClick(patient.id)} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, Icon, color }: { label: string; value: number; Icon: typeof Users; color: 'teal' | 'amber' | 'red' }) {
  const colors = {
    teal: 'bg-teal-50 text-teal-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
  };
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${colors[color]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function PatientCard({ patient, onClick }: { patient: Patient; onClick: () => void }) {
  const status = todayStatus(patient);
  const progress = progressPercent(patient);
  const elapsed = daysElapsed(patient.startDate);
  const missed = patient.doseHistory.filter((d) => d.status === 'missed').length;

  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-teal-300 hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-gray-900">{patient.name}</h3>
            <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-500">{patient.id}</span>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">{patient.treatmentName}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
          <span>Day {Math.min(elapsed, patient.durationDays)} of {patient.durationDays}</span>
          <span className="font-medium text-gray-700">{progress}%</span>
        </div>
        <ProgressBar percent={progress} />
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span>Started {formatDate(patient.startDate)}</span>
        {missed > 0 && <span className="text-red-600">{missed} missed dose{missed > 1 ? 's' : ''}</span>}
      </div>

      <div className="mt-2 flex items-center justify-end gap-1 text-xs font-medium text-teal-600">
        View details
        <ChevronRight className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}
