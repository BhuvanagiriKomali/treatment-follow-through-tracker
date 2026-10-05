import { useState } from 'react';
import { ArrowLeft, UserPlus, Calendar, Clock, Pill, KeyRound } from 'lucide-react';
import type { Patient } from '@/types';
import { Header } from '@/components/Header';

interface AddPatientFormProps {
  onBack: () => void;
  onSave: (patient: Patient) => void;
  onSwitchRole: () => void;
}

export function AddPatientForm({ onBack, onSave, onSwitchRole }: AddPatientFormProps) {
  const [name, setName] = useState('');
  const [treatmentName, setTreatmentName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationDays, setDurationDays] = useState('180');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [pin, setPin] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Patient name or ID is required';
    if (!treatmentName.trim()) e.treatmentName = 'Treatment name is required';
    if (!startDate) e.startDate = 'Start date is required';
    const dur = parseInt(durationDays, 10);
    if (!dur || dur <= 0) e.durationDays = 'Enter a valid number of days';
    if (!reminderTime) e.reminderTime = 'Reminder time is required';
    if (!/\d{4}/.test(pin.trim())) e.pin = 'Enter a 4-digit PIN for the patient';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newPatient: Patient = {
      id: `P-${String(Date.now()).slice(-4)}`,
      name: name.trim(),
      treatmentName: treatmentName.trim(),
      startDate,
      durationDays: parseInt(durationDays, 10),
      reminderTime,
      doseHistory: [{ date: todayStr, status: 'pending' }],
      pin: pin.trim(),
    };
    onSave(newPatient);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header role="health_worker" onSwitchRole={onSwitchRole} />
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patient List
        </button>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <UserPlus className="h-5 w-5 text-teal-600" />
            Add New Patient
          </h2>
          <p className="mt-1 text-sm text-gray-500">Enter the treatment details below to start tracking daily doses.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <Field label="Patient Name or ID" error={errors.name} Icon={UserPlus}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amara Okafor or P-005"
                className="input"
              />
            </Field>

            <Field label="Treatment Name" error={errors.treatmentName} Icon={Pill}>
              <input
                type="text"
                value={treatmentName}
                onChange={(e) => setTreatmentName(e.target.value)}
                placeholder="e.g. TB Treatment (6-month course)"
                className="input"
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Start Date" error={errors.startDate} Icon={Calendar}>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
              </Field>

              <Field label="Duration (days)" error={errors.durationDays} Icon={Calendar}>
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  min={1}
                  className="input"
                />
              </Field>
            </div>

            <Field label="Daily Reminder Time" error={errors.reminderTime} Icon={Clock}>
              <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="input" />
            </Field>

            <Field label="Patient Login PIN (4 digits)" error={errors.pin} Icon={KeyRound}>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="e.g. 5678"
                maxLength={4}
                inputMode="numeric"
                className="input"
              />
            </Field>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-[0.98]"
              >
                <UserPlus className="h-4 w-4" />
                Add Patient
              </button>
              <button
                type="button"
                onClick={onBack}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  error,
  Icon,
  children,
}: {
  label: string;
  error?: string;
  Icon: typeof UserPlus;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <Icon className="h-4 w-4 text-gray-400" />
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
