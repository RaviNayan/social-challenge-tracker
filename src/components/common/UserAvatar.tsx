import React from 'react';
import { cn } from '../../utils/cn';

interface UserAvatarProps {
  name?: string;
  initials?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  showStatus?: boolean;
  isOnline?: boolean;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = 'User',
  initials,
  avatarUrl,
  size = 'md',
  color = 'bg-indigo-100 text-indigo-700 border-indigo-200',
  showStatus = false,
  isOnline = true,
  className,
}) => {
  const getInitials = () => {
    if (initials) return initials;
    if (!name) return 'U';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2 && parts[0][0] && parts[1][0]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name.slice(0, 2) || 'U').toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs font-medium',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-semibold',
    xl: 'w-14 h-14 text-lg font-bold',
  };

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5 border',
    sm: 'w-2 h-2 border',
    md: 'w-2.5 h-2.5 border-2',
    lg: 'w-3 h-3 border-2',
    xl: 'w-3.5 h-3.5 border-2',
  };

  return (
    <div className={cn('relative inline-flex flex-shrink-0 items-center justify-center select-none', className)}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className={cn(
            'rounded-full object-cover border border-slate-200/60 shadow-xs',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-medium border shadow-xs transition-transform',
            color,
            sizeClasses[size]
          )}
          title={name}
        >
          {getInitials()}
        </div>
      )}

      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-white',
            isOnline ? 'bg-emerald-500' : 'bg-slate-300',
            statusDotSizes[size]
          )}
        />
      )}
    </div>
  );
};
