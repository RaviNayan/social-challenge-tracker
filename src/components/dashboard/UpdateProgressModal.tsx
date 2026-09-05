import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Plus, Minus, Swords, Activity as ActivityIcon } from 'lucide-react';
import type { Activity, Challenge } from '../../types';

interface UpdateProgressModalProps {
  activity: Activity | null;
  linkedChallenge?: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (activityId: string, newActualProgress: number) => void;
}

export const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  activity,
  linkedChallenge,
  isOpen,
  onClose,
  onSave,
}) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (activity) {
      setProgress(activity.todayActualProgress);
    }
  }, [activity]);

  if (!isOpen || !activity) return null;

  const isDecimal = activity.unit === 'km';
  const step = isDecimal ? 0.5 : 1;

  const handleIncrement = () => {
    setProgress((prev) => Math.min(activity.personalDailyTarget * 2.5, +(prev + step).toFixed(1)));
  };

  const handleDecrement = () => {
    setProgress((prev) => Math.max(0, +(prev - step).toFixed(1)));
  };

  const handleSave = () => {
    onSave(activity.id, progress);
    onClose();
  };

  const isPersonalTargetMet = progress >= activity.personalDailyTarget;
  const isChallengeTargetMet = linkedChallenge ? progress >= linkedChallenge.challengeDailyTarget : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-soft-lg border border-slate-200 p-6 z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Log Today's Reality
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              {activity.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Updates your actual progress for both personal tracking and active challenges.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Input */}
        <div className="py-4 space-y-4">
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 text-center space-y-3">
            <span className="text-xs font-semibold text-indigo-900">
              What did you actually do today?
            </span>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={progress <= 0}
                className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-soft-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="min-w-[120px]">
                <div className="text-3xl font-extrabold text-slate-900">
                  {progress} <span className="text-sm font-medium text-slate-500">{activity.unit}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Actual completed amount
                </div>
              </div>

              <button
                type="button"
                onClick={handleIncrement}
                className="w-11 h-11 rounded-2xl bg-indigo-600 border border-transparent shadow-soft-sm flex items-center justify-center text-white hover:bg-indigo-700 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dual Evaluation Breakdown */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Independent Target Evaluation
            </span>

            {/* 1. Personal Goal Evaluation */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-indigo-600" />
                <div>
                  <div className="font-semibold text-slate-800">Personal Goal</div>
                  <div className="text-slate-500 text-[11px]">
                    Target: {activity.personalDailyTarget} {activity.unit}
                  </div>
                </div>
              </div>

              {isPersonalTargetMet ? (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  100% Met ✅
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded-full">
                  {Math.round((progress / activity.personalDailyTarget) * 100)}% ({+(activity.personalDailyTarget - progress).toFixed(1)} {activity.unit} left)
                </span>
              )}
            </div>

            {/* 2. Challenge Target Evaluation (if active challenge exists) */}
            {linkedChallenge ? (
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-semibold text-slate-800">
                      Duel vs {linkedChallenge.opponent.name}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Challenge target: {linkedChallenge.challengeDailyTarget} {linkedChallenge.unit}
                    </div>
                  </div>
                </div>

                {isChallengeTargetMet ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Completed ✅
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    <XCircle className="w-3 h-3 text-rose-500" />
                    Not completed ❌
                  </span>
                )}
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 px-1">
                No active challenge linked to this activity yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm transition-colors"
          >
            Save Progress
          </button>
        </div>
      </div>
    </div>
  );
};
