import React from 'react';
import { X, LayoutDashboard, Activity, Target, Users } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { cn } from '../../utils/cn';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeNav: string;
  setActiveNav: (id: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  activeNav,
  setActiveNav,
}) => {
  return (
    <>
      {/* Slide-over drawer backdrop & drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onClose}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            <Sidebar
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              className="w-full border-r-0 pt-3"
              onClose={onClose}
            />
          </div>
        </div>
      )}

      {/* Quick bottom mobile navigation bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 flex justify-around items-center">
        <button
          onClick={() => setActiveNav('dashboard')}
          className={cn(
            'flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg transition-colors',
            activeNav === 'dashboard' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveNav('activities')}
          className={cn(
            'flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg transition-colors',
            activeNav === 'activities' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          )}
        >
          <Activity className="w-5 h-5" />
          <span>Activities</span>
        </button>

        <button
          onClick={() => setActiveNav('challenges')}
          className={cn(
            'flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg transition-colors',
            activeNav === 'challenges' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          )}
        >
          <Target className="w-5 h-5" />
          <span>Challenges</span>
        </button>

        <button
          onClick={() => setActiveNav('friends')}
          className={cn(
            'flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg transition-colors',
            activeNav === 'friends' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          )}
        >
          <Users className="w-5 h-5" />
          <span>Friends</span>
        </button>
      </nav>
    </>
  );
};
