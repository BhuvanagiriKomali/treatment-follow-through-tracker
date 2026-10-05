import type { DoseStatus } from '@/types';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: DoseStatus;
  size?: 'sm' | 'md';
}

const config: Record<DoseStatus, { label: string; bg: string; text: string; Icon: typeof CheckCircle2 }> = {
  taken: { label: 'Taken', bg: 'bg-emerald-100', text: 'text-emerald-700', Icon: CheckCircle2 },
  missed: { label: 'Missed', bg: 'bg-red-100', text: 'text-red-700', Icon: XCircle },
  pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700', Icon: Clock },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { label, bg, text, Icon } = config[status];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${bg} ${text} ${padding}`}>
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {label}
    </span>
  );
}
