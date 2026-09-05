import React from 'react';
import {
  Sparkles,
  Flame,
  BookOpen,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Swords,
} from 'lucide-react';
import type { Challenge } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';

interface ChallengeCardProps {
  challenge: Challenge;
  userActualProgress: number;
  onUpdateProgress: (challenge: Challenge) => void;
  onViewChallenge: (challenge: Challenge) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Chanting: <Sparkles className="w-3.5 h-3.5" />,
  Fitness: <Flame className="w-3.5 h-3.5" />,
  Reading: <BookOpen className="w-3.5 h-3.5" />,
};

const categoryBadgeVariants: Record<string, 'purple' | 'amber' | 'blue' | 'emerald'> = {
  Chanting: 'purple',
  Fitness: 'blue',
  Reading: 'emerald',
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  userActualProgress,
  onUpdateProgress,
  onViewChallenge,
}) => {
  const isUserCompleted = userActualProgress >= challenge.challengeDailyTarget;
  const isOpponentCompleted = challenge.opponentActualProgress >= challenge.challengeDailyTarget;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-soft-sm hover:shadow-soft hover:border-slate-300/80 transition-all duration-200 flex flex-col justify-between">
      {/* Top row: Category, Timeline, and Duration */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Badge
            variant={categoryBadgeVariants[challenge.category] || 'indigo'}
            className="flex items-center gap-1.5 font-medium"
          >
            {categoryIcons[challenge.category]}
            {challenge.activityName}
          </Badge>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
            Target: {challenge.challengeDailyTarget} {challenge.unit}/day
          </span>
        </div>

        {/* Duration & Day Counter */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{challenge.startDate} – {challenge.endDate || 'Ongoing'}</span>
          {challenge.currentDayNumber && challenge.durationDays && (
            <>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-800">
                Day {challenge.currentDayNumber} of {challenge.durationDays}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Challenge Title: Ravi vs Opponent */}
      <div className="py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Ravi vs {challenge.opponent.name}
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Challenge Target: <strong className="text-slate-900">{challenge.challengeDailyTarget} {challenge.unit}</strong>
          </span>
        </div>

        {/* Head to Head Participant Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Ravi's Box */}
          <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span className="text-xs font-bold text-slate-900">Ravi (You)</span>
              </div>
              {isUserCompleted ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Completed ✅
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  <XCircle className="w-3 h-3 text-rose-500" />
                  Not completed ❌
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-2xl font-extrabold text-slate-900">
                  {userActualProgress}
                </span>
                <span className="text-xs font-medium text-slate-500 ml-1">
                  {challenge.unit} actual
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Target: {challenge.challengeDailyTarget} {challenge.unit}
              </span>
            </div>

            <ProgressBar
              value={userActualProgress}
              max={challenge.challengeDailyTarget}
              color={isUserCompleted ? 'emerald' : 'indigo'}
              size="sm"
            />
          </div>

          {/* Opponent's Box */}
          <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserAvatar
                  name={challenge.opponent.name}
                  initials={challenge.opponent.initials}
                  size="xs"
                  color={challenge.opponent.color}
                />
                <span className="text-xs font-bold text-slate-900">{challenge.opponent.name}</span>
              </div>
              {isOpponentCompleted ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Completed ✅
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  <XCircle className="w-3 h-3 text-rose-500" />
                  Not completed ❌
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-2xl font-extrabold text-slate-900">
                  {challenge.opponentActualProgress}
                </span>
                <span className="text-xs font-medium text-slate-500 ml-1">
                  {challenge.unit} actual
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Target: {challenge.challengeDailyTarget} {challenge.unit}
              </span>
            </div>

            <ProgressBar
              value={challenge.opponentActualProgress}
              max={challenge.challengeDailyTarget}
              color={isOpponentCompleted ? 'emerald' : 'slate'}
              size="sm"
            />
          </div>
        </div>

        {/* Explanatory callout showing the actual vs required target distinction */}
        <div className="text-xs text-slate-600 bg-indigo-50/50 border border-indigo-100/80 rounded-xl px-3.5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {isUserCompleted
                ? `Ravi completed today's challenge with ${userActualProgress} ${challenge.unit} actual.`
                : `Ravi is at ${userActualProgress} ${challenge.unit} (needs ${(challenge.challengeDailyTarget - userActualProgress).toFixed(challenge.unit === 'km' ? 1 : 0)} ${challenge.unit} more).`}
            </span>
          </div>
          <span className="font-semibold text-indigo-900 hidden sm:inline">
            {challenge.opponent.name} can view this
          </span>
        </div>
      </div>

      {/* Card Footer: Action buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Duration: {challenge.durationDays ? `${challenge.durationDays} days` : 'Ongoing'}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChallenge(challenge)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span>View Challenge</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => onUpdateProgress(challenge)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-xs shadow-indigo-200"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Update Progress
          </button>
        </div>
      </div>
    </div>
  );
};
