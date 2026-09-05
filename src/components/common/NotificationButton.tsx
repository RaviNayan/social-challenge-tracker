import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

interface NotificationButtonProps {
  count?: number;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({ count = 2 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(count);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Amit finished Daily Chanting target (4 rounds)',
      time: '15m ago',
      read: false,
    },
    {
      id: '2',
      title: 'Rahul logged 4.5 km in Daily Running',
      time: '1h ago',
      read: false,
    },
    {
      id: '3',
      title: 'Ankit invited you to 7-Day Meditation Challenge',
      time: '1d ago',
      read: true,
    },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className={cn(
          'relative p-2.5 rounded-xl border border-slate-200/80 bg-white text-slate-600',
          'hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
          isOpen && 'bg-slate-100 text-slate-900 ring-2 ring-indigo-500/20'
        )}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] font-bold text-white items-center justify-center shadow-xs">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl border border-slate-200 shadow-soft-lg z-50 p-3 transition-all animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between px-2 pb-2.5 border-b border-slate-100 mb-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-rose-50 text-rose-600">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => setUnreadCount(0)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  'p-2.5 rounded-xl text-xs transition-colors flex flex-col gap-1',
                  n.read || unreadCount === 0
                    ? 'hover:bg-slate-50 text-slate-600'
                    : 'bg-indigo-50/50 hover:bg-indigo-50/80 text-slate-800'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium leading-relaxed">{n.title}</p>
                  {!n.read && unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
