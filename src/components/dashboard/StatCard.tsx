import React from 'react';
import { Target, CheckCircle2, Flame, Users, Activity, Swords } from 'lucide-react';
import type { StatItem } from '../../types';
import { cn } from '../../utils/cn';

interface StatCardProps {
  stat: StatItem;
}

const iconMap = {
  target: Target,
  checkCircle: CheckCircle2,
  flame: Flame,
  users: Users,
  activity: Activity,
  swords: Swords,
};

const colorConfig: Record<string, { bg: string; text: string; ring: string }> = {
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    ring: 'border-indigo-100',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    ring: 'border-emerald-100',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    ring: 'border-amber-100',
  },
  sky: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    ring: 'border-sky-100',
  },
};

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const Icon = iconMap[stat.iconName] || Target;
  const config = colorConfig[stat.highlightColor || 'indigo'] || colorConfig.indigo;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft-sm hover:shadow-soft hover:border-slate-300/80 transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {stat.label}
        </span>
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105',
            config.bg,
            config.text,
            config.ring
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {stat.value}
          </span>
          {stat.trend && (
            <span className="text-xs font-medium text-slate-500">
              {stat.trend}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1 font-normal">
          {stat.subtext}
        </p>
      </div>
    </div>
  );
};
