import React, { useState, useEffect } from 'react';
import { X, Swords, Calendar, Clock } from 'lucide-react';
import type { Activity, Challenge } from '../../types';
import { cn } from '../../utils/cn';

interface CreateChallengeModalProps {
  isOpen: boolean;
  activities: Activity[];
  initialActivity?: Activity | null;
  onClose: () => void;
  onCreate: (newChallenge: Challenge) => void;
}

const mockFriends = [
  { id: 'f1', name: 'Rohan', initials: 'RO', color: 'bg-blue-100 text-blue-800' },
  { id: 'f2', name: 'Amit', initials: 'AM', color: 'bg-amber-100 text-amber-800' },
  { id: 'f3', name: 'Ankit', initials: 'AK', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'f4', name: 'Priya', initials: 'PR', color: 'bg-purple-100 text-purple-800' },
];

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  isOpen,
  activities,
  initialActivity,
  onClose,
  onCreate,
}) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [selectedFriend, setSelectedFriend] = useState(mockFriends[0]);
  const [challengeTarget, setChallengeTarget] = useState('4');
  const [durationType, setDurationType] = useState<'7' | '14' | '30' | 'custom' | 'no_end_date'>('30');
  const [startDate, setStartDate] = useState('Sep 5');
  const [customDays, setCustomDays] = useState('45');

  // When initialActivity changes or modal opens, update selected activity
  useEffect(() => {
    if (initialActivity) {
      setSelectedActivityId(initialActivity.id);
      setChallengeTarget(initialActivity.personalDailyTarget.toString());
    } else if (activities.length > 0 && !selectedActivityId) {
      setSelectedActivityId(activities[0].id);
      setChallengeTarget(activities[0].personalDailyTarget.toString());
    }
  }, [initialActivity, activities, selectedActivityId]);

  if (!isOpen) return null;

  const currentActivity = activities.find((a) => a.id === selectedActivityId) || activities[0];

  const handleActivityChange = (actId: string) => {
    setSelectedActivityId(actId);
    const act = activities.find((a) => a.id === actId);
    if (act) {
      setChallengeTarget(act.personalDailyTarget.toString());
    }
  };

  const getDurationDays = (): number | undefined => {
    if (durationType === '7') return 7;
    if (durationType === '14') return 14;
    if (durationType === '30') return 30;
    if (durationType === 'custom') return parseInt(customDays) || 30;
    return undefined; // no end date
  };

  const getEndDateStr = (days?: number): string | undefined => {
    if (!days) return undefined;
    return `Oct ${5 + (days > 30 ? days - 30 : 0)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentActivity) return;

    const days = getDurationDays();
    const newChallenge: Challenge = {
      id: `ch-${Date.now()}`,
      activityId: currentActivity.id,
      activityName: currentActivity.name,
      category: currentActivity.category,
      opponent: {
        id: selectedFriend.id,
        name: selectedFriend.name,
        initials: selectedFriend.initials,
        color: selectedFriend.color,
        statusText: 'Duel invitation accepted',
      },
      challengeDailyTarget: parseFloat(challengeTarget) || 1,
      unit: currentActivity.unit,
      durationDays: days,
      durationType: durationType,
      startDate: startDate || 'Sep 5',
      endDate: getEndDateStr(days),
      currentDayNumber: 1,
      status: 'active',
      opponentActualProgress: 0,
    };

    onCreate(newChallenge);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-soft-lg border border-slate-200 p-6 z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Compete With Friends
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Create a Challenge
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Challenges evaluate reality against a required target during a specific duration.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {/* Activity Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Activity to Challenge On
            </label>
            <select
              value={selectedActivityId}
              onChange={(e) => handleActivityChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            >
              {activities.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.name} (Personal target: {act.personalDailyTarget} {act.unit}/day)
                </option>
              ))}
            </select>
          </div>

          {/* Challenge With: Friend Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Challenge With (Friend)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {mockFriends.map((f) => {
                const isSelected = selectedFriend.id === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFriend(f)}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-xl border text-xs transition-all text-left',
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-900 ring-1 ring-indigo-600/30'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    )}
                  >
                    <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold', f.color)}>
                      {f.initials}
                    </div>
                    <span className="truncate">{f.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Challenge Target (independent of personal target) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Challenge Target ({currentActivity?.unit}/day)
              </label>
              {currentActivity && (
                <span className="text-[11px] text-slate-400">
                  (Personal target: {currentActivity.personalDailyTarget} {currentActivity.unit})
                </span>
              )}
            </div>
            <input
              type="number"
              min="0.1"
              step="any"
              required
              value={challengeTarget}
              onChange={(e) => setChallengeTarget(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Duration Selector: Finite is default (30 days default) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Duration
              </label>
              <span className="text-[11px] text-indigo-600 font-medium">
                Default: 30 days
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { type: '7', label: '7 days' },
                { type: '14', label: '14 days' },
                { type: '30', label: '30 days' },
                { type: 'custom', label: 'Custom' },
                { type: 'no_end_date', label: 'No end date' },
              ].map((item) => {
                const isSelected = durationType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setDurationType(item.type as any)}
                    className={cn(
                      'px-2.5 py-2 rounded-xl border text-xs font-medium text-center transition-all',
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold ring-1 ring-indigo-600/30'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {durationType === 'custom' && (
              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  placeholder="Custom number of days"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs w-28 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <span className="text-xs text-slate-500">days duration</span>
              </div>
            )}
          </div>

          {/* Start Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Challenge Start Date
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent focus:outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                End Date
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{getEndDateStr(getDurationDays()) || 'Ongoing'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs text-slate-600">
            🛡️ <strong>Start Date Rule:</strong> Challenge history strictly begins on {startDate}. Your previous personal {currentActivity?.name} records prior to {startDate} are preserved in your personal history and will never be retroactively included.
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
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm transition-colors"
            >
              <Swords className="w-4 h-4" />
              Start Challenge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
