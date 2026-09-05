export type ChallengeCategory = 'Chanting' | 'Fitness' | 'Reading' | 'Study' | 'Mindfulness' | 'General';

export type ChallengeStatus = 'active' | 'upcoming' | 'completed' | 'expired' | 'cancelled';

export interface Opponent {
  id: string;
  name: string;
  avatarUrl?: string;
  initials: string;
  color: string;
  statusText?: string;
}

export interface HistoricalLog {
  date: string;
  value: number;
}

export interface Activity {
  id: string;
  name: string;
  category: ChallengeCategory;
  unit: string;
  personalDailyTarget: number;
  todayActualProgress: number;
  streak: number;
  historicalLogs: HistoricalLog[];
}

export interface Challenge {
  id: string;
  activityId: string;
  activityName: string;
  category: ChallengeCategory;
  opponent: Opponent;
  challengeDailyTarget: number;
  unit: string;
  durationDays?: number;
  durationType: '7' | '14' | '30' | 'custom' | 'no_end_date';
  startDate: string;
  endDate?: string;
  currentDayNumber?: number;
  status: ChallengeStatus;
  opponentActualProgress: number;
}

export interface StatItem {
  id: string;
  label: string;
  value: string | number;
  subtext: string;
  iconName: 'target' | 'checkCircle' | 'flame' | 'users' | 'activity' | 'swords';
  trend?: string;
  highlightColor?: string;
}

export interface ActivityItemData {
  id: string;
  userName: string;
  isCurrentUser?: boolean;
  initials: string;
  avatarColor: string;
  action: string;
  challengeName: string;
  timestamp: string;
  iconType: 'chanting' | 'fitness' | 'reading' | 'general';
}

export interface DayProgress {
  day: string;
  fullDate: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
  isToday: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  initials: string;
  unreadNotificationsCount: number;
}
