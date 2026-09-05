import React, { useState } from 'react';
import { X, Sparkles, Flame, BookOpen, Heart, GraduationCap, PlusCircle } from 'lucide-react';
import type { Activity, ChallengeCategory } from '../../types';
import { cn } from '../../utils/cn';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newActivity: Activity) => void;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ChallengeCategory>('Fitness');
  const [unit, setUnit] = useState('km');
  const [target, setTarget] = useState('5');

  if (!isOpen) return null;

  const categories: { label: ChallengeCategory; icon: React.ReactNode; defaultUnit: string; defaultTarget: string; placeholder: string }[] = [
    { label: 'Fitness', icon: <Flame className="w-4 h-4" />, defaultUnit: 'km', defaultTarget: '5', placeholder: 'e.g. Daily Running, Cycling' },
    { label: 'Chanting', icon: <Sparkles className="w-4 h-4" />, defaultUnit: 'rounds', defaultTarget: '4', placeholder: 'e.g. Morning Chanting, Japa' },
    { label: 'Reading', icon: <BookOpen className="w-4 h-4" />, defaultUnit: 'pages', defaultTarget: '30', placeholder: 'e.g. Daily Book Reading' },
    { label: 'Mindfulness', icon: <Heart className="w-4 h-4" />, defaultUnit: 'mins', defaultTarget: '20', placeholder: 'e.g. Meditation, Breathwork' },
    { label: 'Study', icon: <GraduationCap className="w-4 h-4" />, defaultUnit: 'hours', defaultTarget: '2', placeholder: 'e.g. Deep Work, Coding' },
  ];

  const handleCategorySelect = (cat: typeof categories[0]) => {
    setCategory(cat.label);
    setUnit(cat.defaultUnit);
    setTarget(cat.defaultTarget);
    if (!name) {
      setName(cat.label === 'Fitness' ? 'Daily Running' : `${cat.label} Practice`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTarget = parseFloat(target) || 1;
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      name: name.trim() || 'New Activity',
      category: category,
      unit: unit.trim() || 'units',
      personalDailyTarget: finalTarget,
      todayActualProgress: 0,
      streak: 1,
      historicalLogs: [
        { date: 'Today', value: 0 },
      ],
    };

    onAdd(newActivity);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-soft-lg border border-slate-200 p-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Personal Goal Tracking
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Create Personal Activity
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Track yourself without challenging anyone. You can challenge a friend later.
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
          {/* Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {categories.map((cat) => {
                const isSelected = category === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border text-xs font-medium transition-all',
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/20'
                        : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    <span className={isSelected ? 'text-indigo-600' : 'text-slate-500'}>
                      {cat.icon}
                    </span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Activity Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Running, Daily Chanting, Meditation"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* What do you want to track? Target & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Personal Daily Target
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                required
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Unit of Measure
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="km, rounds, pages, mins"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs text-slate-600">
            💡 <strong>Pro-tip:</strong> Activities keep your historical logs permanently. If you challenge a friend later, that challenge will start from its own start date and won't retroactively pull previous logs.
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
              <PlusCircle className="w-4 h-4" />
              Create Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
