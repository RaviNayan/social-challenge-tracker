import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Target,
  Users,
  Bell,
  User,
  Settings,
  Flame,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { navItems } from '../../data/mockData';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (id: string) => void;
  className?: string;
  onClose?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Bell: <Bell className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  setActiveNav,
  className,
  onClose,
}) => {
  return (
    <aside
      className={cn(
        'w-64 h-full bg-white border-r border-slate-200/80 flex flex-col justify-between py-6 px-4 select-none',
        className
      )}
    >
      {/* Top section: Logo & Nav */}
      <div className="space-y-7">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Flame className="w-5 h-5 fill-white/20 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Challenge
            </span>
            <span className="text-[10px] ml-1.5 font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              Beta
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  if (onClose) onClose();
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'transition-colors',
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  >
                    {iconMap[item.icon]}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      isActive
                        ? 'bg-indigo-200/60 text-indigo-800'
                        : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: Active Streak Card */}
      <div className="pt-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-indigo-50/70 to-slate-50 border border-indigo-100/80 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-indigo-950 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Product Philosophy</span>
          </div>
          <p className="text-[12px] text-slate-600 leading-relaxed italic">
            "Track yourself. Challenge your friends."
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>12-Day Streak Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
