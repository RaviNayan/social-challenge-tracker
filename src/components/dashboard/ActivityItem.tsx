import React from 'react';
import { Sparkles, Flame, BookOpen, Clock, Activity as ActivityIcon } from 'lucide-react';
import type { ActivityItemData } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { cn } from '../../utils/cn';

interface ActivityItemProps {
  activity: ActivityItemData;
}

const iconTypeMap = {
  chanting: <Sparkles className="w-3 h-3 text-purple-600" />,
  fitness: <Flame className="w-3 h-3 text-blue-600" />,
  reading: <BookOpen className="w-3 h-3 text-emerald-600" />,
  general: <ActivityIcon className="w-3 h-3 text-indigo-600" />,
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0 group">
      {/* Avatar with category icon micro-badge */}
      <div className="relative flex-shrink-0">
        <UserAvatar
          name={activity.userName}
          initials={activity.initials}
          size="sm"
          color={activity.avatarColor}
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs">
          {iconTypeMap[activity.iconType] || iconTypeMap.general}
        </div>
      </div>

      {/* Narrative & Details */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-slate-700 leading-snug">
          <strong className={cn('font-semibold', activity.isCurrentUser ? 'text-indigo-600' : 'text-slate-900')}>
            {activity.userName}
          </strong>{' '}
          <span className="text-slate-600">{activity.action}</span>{' '}
          <span className="font-medium text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-xs">
            {activity.challengeName}
          </span>
        </p>

        <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{activity.timestamp}</span>
        </div>
      </div>
    </div>
  );
};
