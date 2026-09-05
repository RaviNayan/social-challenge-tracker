import React from 'react';
import {
  Sparkles,
  Flame,
  BookOpen,
  Heart,
  CheckCircle2,
  Clock,
  Swords,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import type { Activity } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';

interface ActivityCardProps {
  activity: Activity;
  onUpdateProgress: (activity: Activity) => void;
  onChallengeFriend: (activity: Activity) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Chanting: <Sparkles className="w-3.5 h-3.5" />,
  Fitness: <Flame className="w-3.5 h-3.5" />,
  Reading: <BookOpen className="w-3.5 h-3.5" />,
  Mindfulness: <Heart className="w-3.5 h-3.5" />,
};

const categoryBadgeVariants: Record<string, 'purple' | 'amber' | 'blue' | 'emerald'> = {
  Chanting: 'purple',
  Fitness: 'blue',
  Reading: 'emerald',
  Mindfulness: 'purple',
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onUpdateProgress,
  onChallengeFriend,
}) => {
  const isTargetMet = activity.todayActualProgress >= activity.personalDailyTarget;
  const percentage = Math.min(100, Math.round((activity.todayActualProgress / activity.personalDailyTarget) * 100));
  const remaining = Math.max(0, +(activity.personalDailyTarget - activity.todayActualProgress).toFixed(activity.unit === 'km' ? 1 : 0));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft-sm hover:shadow-soft hover:border-slate-300/80 transition-all duration-200 flex flex-col justify-between group">
      {/* Top row: Category, Target & Status */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Badge
            variant={categoryBadgeVariants[activity.category] || 'indigo'}
            className="flex items-center gap-1.5 font-medium"
          >
            {categoryIcons[activity.category]}
            {activity.category}
          </Badge>
          <span className="text-[11px] font-medium text-slate-400">Personal Goal</span>
        </div>

        {isTargetMet ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed ✅
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {percentage}%
          </span>
        )}
      </div>

      {/* Main content: Activity title, actual vs personal target */}
      <div className="py-4 space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            {activity.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Personal target: <strong className="text-slate-700 font-semibold">{activity.personalDailyTarget} {activity.unit}/day</strong>
          </p>
        </div>

        {/* Today's actual progress meter */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Today's actual progress:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-slate-900">
                {activity.todayActualProgress}
              </span>
              <span className="text-slate-500 text-xs">
                / {activity.personalDailyTarget} {activity.unit}
              </span>
            </div>
          </div>

          <ProgressBar
            value={activity.todayActualProgress}
            max={activity.personalDailyTarget}
            color={isTargetMet ? 'emerald' : 'indigo'}
            size="md"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>
              {isTargetMet
                ? 'Daily goal achieved!'
                : `${remaining} ${activity.unit} remaining today`}
            </span>
            <span className="flex items-center gap-1 font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/40">
              <TrendingUp className="w-3 h-3 text-amber-500" />
              {activity.streak}d streak
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions: Update Progress & Challenge a Friend */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onChallengeFriend(activity)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-transparent transition-colors"
          title="Challenge a friend using this activity"
        >
          <Swords className="w-3.5 h-3.5 text-indigo-500" />
          <span>Challenge a Friend</span>
        </button>

        <button
          onClick={() => onUpdateProgress(activity)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-xs shadow-indigo-200"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Update Progress</span>
        </button>
      </div>
    </div>
  );
};
