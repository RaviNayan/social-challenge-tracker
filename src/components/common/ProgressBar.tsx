import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple' | 'slate';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPercent?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  color = 'indigo',
  size = 'md',
  className,
  showPercent = false,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const colorClasses = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    slate: 'bg-slate-600',
  };

  const bgClasses = {
    indigo: 'bg-indigo-100/70',
    emerald: 'bg-emerald-100/70',
    amber: 'bg-amber-100/70',
    blue: 'bg-blue-100/70',
    purple: 'bg-purple-100/70',
    slate: 'bg-slate-200/70',
  };

  return (
    <div className={cn('w-full flex items-center gap-2', className)}>
      <div
        className={cn(
          'w-full rounded-full overflow-hidden relative',
          sizeClasses[size],
          bgClasses[color]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercent && (
        <span className="text-xs font-semibold text-slate-500 min-w-[36px] text-right">
          {percentage}%
        </span>
      )}
    </div>
  );
};
