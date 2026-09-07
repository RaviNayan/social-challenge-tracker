import {
  currentUser,
  overviewStats,
  initialActivities,
  initialChallenges,
  initialActivitiesFeed,
  weeklyPerformance,
} from '../data/mockData';
import type {
  Activity,
  Challenge,
  StatItem,
  ActivityItemData,
  DayProgress,
  UserProfile,
} from '../types';

/**
 * Data access service providing clean access to application data.
 * Decouples consumer components from underlying static mock datasets.
 */

export const getCurrentUser = (): UserProfile => {
  return currentUser;
};

export const getInitialActivities = (): Activity[] => {
  return [...initialActivities];
};

export const getInitialChallenges = (): Challenge[] => {
  return [...initialChallenges];
};

export const getInitialActivityFeed = (): ActivityItemData[] => {
  return [...initialActivitiesFeed];
};

export const getWeeklyPerformance = (): DayProgress[] => {
  return [...weeklyPerformance];
};

export const getOverviewStats = (
  activities: Activity[],
  challenges: Challenge[]
): StatItem[] => {
  const completedActivitiesCount = activities.filter(
    (a) => a.todayActualProgress >= a.personalDailyTarget
  ).length;

  return overviewStats.map((stat) => {
    if (stat.id === 'stat-activities') {
      return {
        ...stat,
        value: activities.length,
        subtext: `${completedActivitiesCount} personal goals met today`,
      };
    }
    if (stat.id === 'stat-challenges') {
      return {
        ...stat,
        value: challenges.length,
        subtext: `${challenges.length} active friend duels`,
      };
    }
    return stat;
  });
};
