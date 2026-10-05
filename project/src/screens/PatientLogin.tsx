import { useState } from 'react';
import { ArrowLeft, LogIn, User, KeyRound, Activity } from 'lucide-react';
import type { Patient } from '@/types';

interface PatientLoginProps {
  patients: Patient[];
  onLogin: (patientId: string) => void;
  onBack: () => void;
}

export function PatientLogin({ patients, onLogin, onBack }: PatientLoginProps) {
  const [patientId, setPatientId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const patient = patients.find(
      (p) => p.id.toLowerCase() === patientId.trim().toLowerCase()
    );

    if (!patient) {
      setError('No patient found with that ID. Try P-001, P-002, P-003, or P-004.');
      return;
    }

    if (patient.pin !== pin.trim()) {
      setError('Incorrect PIN. Please try again.');
      return;
    }

    onLogin(patient.id);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-white px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
          <Activity className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Patient Sign In</h1>
        <p className="mt-1 text-sm text-gray-500">Enter your patient ID and PIN to view your treatment tracker.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <User className="h-4 w-4 text-gray-400" />
            Patient ID
          </label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="e.g. P-002"
            autoComplete="off"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <KeyRound className="h-4 w-4 text-gray-400" />
            PIN
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="4-digit PIN"
            maxLength={4}
            inputMode="numeric"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</div>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-[0.98]"
        >
          <LogIn className="h-4 w-4" />
          Sign In
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </form>

      <div className="mt-6 w-full max-w-sm rounded-lg border border-gray-200 bg-white/70 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Demo Credentials</p>
        <ul className="space-y-1 text-xs text-gray-500">
          {patients.map((p) => (
            <li key={p.id} className="flex items-center justify-between">
              <span>{p.name} — {p.id}</span>
              <span className="font-medium text-gray-700">PIN: {p.pin}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 text-center text-xs text-gray-400">
        Demo prototype &middot; No real medical advice is provided or generated.
      </p>
    </div>
  );
}
