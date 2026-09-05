import React from 'react';
import { Flame, CheckCircle2, TrendingUp } from 'lucide-react';
import type { DayProgress } from '../../types';
import { cn } from '../../utils/cn';

interface WeeklyProgressProps {
  days: DayProgress[];
  streakDays?: number;
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({
  days,
  streakDays = 12,
}) => {
  const totalCompleted = days.reduce((acc, d) => acc + d.completedCount, 0);
  const totalPossible = days.reduce((acc, d) => acc + d.totalCount, 0);
  const completionRate = Math.round((totalCompleted / totalPossible) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-soft-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Your Progress
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Consistency over the last 7 days
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-semibold text-amber-700">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{streakDays} Day Streak</span>
        </div>
      </div>

      {/* 7-Day Visual Representation */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end pt-2 pb-1">
        {days.map((item) => {
          const isFull = item.percentage === 100;
          return (
            <div key={item.day} className="flex flex-col items-center gap-2 group">
              {/* Daily completion fraction tooltip/label */}
              <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-800 transition-colors">
                {item.completedCount}/{item.totalCount}
              </span>

              {/* Bar track */}
              <div className="w-full max-w-[32px] h-24 bg-slate-100 rounded-lg p-1 flex flex-col justify-end relative">
                <div
                  className={cn(
                    'w-full rounded-md transition-all duration-500 ease-out',
                    isFull
                      ? 'bg-emerald-500 shadow-xs'
                      : item.isToday
                      ? 'bg-indigo-600 shadow-xs'
                      : 'bg-indigo-400/80'
                  )}
                  style={{ height: `${item.percentage}%` }}
                />
              </div>

              {/* Day Name & Indicator */}
              <div className="text-center">
                <span
                  className={cn(
                    'text-xs font-medium block',
                    item.isToday
                      ? 'text-indigo-600 font-bold'
                      : 'text-slate-600'
                  )}
                >
                  {item.day}
                </span>
                {item.isToday && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600 mx-auto" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-medium">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Weekly Completion: <strong className="text-slate-900">{completionRate}%</strong></span>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>{totalCompleted} of {totalPossible} goals met</span>
        </div>
      </div>
    </div>
  );
};
