interface ProgressBarProps {
  percent: number;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({ percent, className = '', barClassName = '' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={`h-2.5 w-full rounded-full bg-gray-200 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full bg-teal-600 transition-all duration-500 ease-out ${barClassName}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
