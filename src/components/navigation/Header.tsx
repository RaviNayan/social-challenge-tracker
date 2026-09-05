import React from 'react';
import { Menu } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';
import { NotificationButton } from '../common/NotificationButton';
import type { UserProfile } from '../../types';

interface HeaderProps {
  user: UserProfile;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenMobileMenu }) => {
  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 hidden sm:inline-block">
            Challenge Tracker
          </span>
          <span className="hidden sm:inline-block text-slate-300">/</span>
          <span className="text-sm font-medium text-slate-500">Dashboard</span>
        </div>
      </div>

      {/* Right: Notifications, User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        <NotificationButton count={user.unreadNotificationsCount} />

        <div className="h-6 w-px bg-slate-200" />

        {/* User profile with avatar and name */}
        <div className="flex items-center gap-2.5 pl-1 select-none">
          <UserAvatar
            name={user.name}
            initials={user.initials}
            avatarUrl={user.avatarUrl}
            size="sm"
            color="bg-indigo-600 text-white border-transparent"
            showStatus={true}
            isOnline={true}
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-slate-800 leading-tight">
              {user.name}
            </span>
            <span className="text-[11px] text-slate-400 font-medium leading-tight">
              Pro Challenger
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
