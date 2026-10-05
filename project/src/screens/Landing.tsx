import { Stethoscope, Heart, Activity, User } from 'lucide-react';
import type { Role } from '@/types';

interface LandingProps {
  onSelectRole: (role: Role) => void;
}

export function Landing({ onSelectRole }: LandingProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-white px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
          <Activity className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Treatment Follow-Through Tracker</h1>
        <p className="mt-2 max-w-md text-sm text-gray-500 sm:text-base">
          A simple tool to track daily treatment doses and alert health workers and families when doses are missed.
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <h2 className="text-center text-sm font-medium uppercase tracking-wide text-gray-400">Choose a demo role</h2>
        <button
          onClick={() => onSelectRole('health_worker')}
          className="group flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-teal-300 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 transition group-hover:bg-teal-600 group-hover:text-white">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Health Worker</p>
            <p className="text-sm text-gray-500">View patient list, treatment progress, and missed-dose alerts</p>
          </div>
        </button>

        <button
          onClick={() => onSelectRole('family_member')}
          className="group flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-teal-300 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 transition group-hover:bg-rose-500 group-hover:text-white">
            <Heart className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Family Member</p>
            <p className="text-sm text-gray-500">See today's reminder and mark doses as taken or missed</p>
          </div>
        </button>

        <button
          onClick={() => onSelectRole('patient')}
          className="group flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-teal-300 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white">
            <User className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Patient</p>
            <p className="text-sm text-gray-500">Sign in with your patient ID to view and track your own treatment</p>
          </div>
        </button>
      </div>

      <p className="mt-10 text-center text-xs text-gray-400">
        Demo prototype &middot; No real medical advice is provided or generated.
      </p>
    </div>
  );
}
