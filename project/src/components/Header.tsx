import { Stethoscope, Heart, User } from 'lucide-react';
import type { Role } from '@/types';

interface HeaderProps {
  role: Role;
  patientName?: string;
  onSwitchRole: () => void;
}

export function Header({ role, patientName, onSwitchRole }: HeaderProps) {
  const Icon = role === 'health_worker' ? Stethoscope : role === 'family_member' ? Heart : User;
  const roleLabel = role === 'health_worker' ? 'Health Worker' : role === 'family_member' ? 'Family Member' : patientName ?? 'Patient';

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 sm:text-base">Follow-Through Tracker</h1>
            <p className="text-xs text-gray-500">{roleLabel}</p>
          </div>
        </div>
        <button
          onClick={onSwitchRole}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 active:bg-gray-100 sm:text-sm"
        >
          {role === 'patient' ? 'Sign Out' : 'Switch Role'}
        </button>
      </div>
    </header>
  );
}
