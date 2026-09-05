import React from 'react';
import { X, CheckCircle2, XCircle, Trophy, Swords, Calendar, Flame } from 'lucide-react';
import type { Challenge } from '../../types';
import { ProgressBar } from '../common/ProgressBar';

interface ViewChallengeModalProps {
  challenge: Challenge | null;
  userActualProgress: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewChallengeModal: React.FC<ViewChallengeModalProps> = ({
  challenge,
  userActualProgress,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !challenge) return null;

  const isUserCompleted = userActualProgress >= challenge.challengeDailyTarget;
  const isOpponentCompleted = challenge.opponentActualProgress >= challenge.challengeDailyTarget;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-soft-lg border border-slate-200 p-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Challenge Details
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Ravi vs {challenge.opponent.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Target Banner */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
                Required Challenge Target
              </span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {challenge.challengeDailyTarget} {challenge.unit} / day
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Duration</span>
              <span className="text-xs font-semibold text-slate-800">
                {challenge.durationDays ? `${challenge.durationDays} Days` : 'Ongoing'} ({challenge.startDate} – {challenge.endDate || 'Present'})
              </span>
            </div>
          </div>

          {/* Actual Results vs Target */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-indigo-600" /> Head-to-Head Today
              </span>
              <span className="text-indigo-600">
                {userActualProgress > challenge.opponentActualProgress ? 'Ravi is leading' : 'Tied or behind'}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {/* Ravi */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-bold text-slate-900">Ravi (You)</span>
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
                <div className="text-xs text-slate-600 mb-1.5">
                  Actually logged: <strong className="text-slate-900 font-bold">{userActualProgress} {challenge.unit}</strong> (Target: {challenge.challengeDailyTarget} {challenge.unit})
                </div>
                <ProgressBar value={userActualProgress} max={challenge.challengeDailyTarget} color={isUserCompleted ? 'emerald' : 'indigo'} size="sm" />
              </div>

              {/* Opponent */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-bold text-slate-900">{challenge.opponent.name}</span>
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
                <div className="text-xs text-slate-600 mb-1.5">
                  Actually logged: <strong className="text-slate-900 font-bold">{challenge.opponentActualProgress} {challenge.unit}</strong> (Target: {challenge.challengeDailyTarget} {challenge.unit})
                </div>
                <ProgressBar value={challenge.opponentActualProgress} max={challenge.challengeDailyTarget} color={isOpponentCompleted ? 'emerald' : 'slate'} size="sm" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-[11px] text-slate-400">Start Date</div>
                <div className="font-semibold text-slate-800">{challenge.startDate}</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-[11px] text-slate-400">Timeline</div>
                <div className="font-semibold text-slate-800">Day {challenge.currentDayNumber || 1} of {challenge.durationDays || '∞'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
