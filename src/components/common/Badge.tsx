import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
}) => {
  const variantStyles = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200/80',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/70',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/70',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/70',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/70',
  };

  const dotStyles = {
    neutral: 'bg-slate-400',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    rose: 'bg-rose-500',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border tracking-wide transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotStyles[variant])} />
      )}
      {children}
    </span>
  );
};
