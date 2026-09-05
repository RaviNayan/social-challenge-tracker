import { useState } from 'react';
import {
  Plus,
  Swords,
  Activity as ActivityIcon,
} from 'lucide-react';
import { Header } from './components/navigation/Header';
import { Sidebar } from './components/navigation/Sidebar';
import { MobileNav } from './components/navigation/MobileNav';
import { StatCard } from './components/dashboard/StatCard';
import { ActivityCard } from './components/dashboard/ActivityCard';
import { ChallengeCard } from './components/dashboard/ChallengeCard';
import { ActivityItem } from './components/dashboard/ActivityItem';
import { WeeklyProgress } from './components/dashboard/WeeklyProgress';
import { AddActivityModal } from './components/dashboard/AddActivityModal';
import { CreateChallengeModal } from './components/dashboard/CreateChallengeModal';
import { UpdateProgressModal } from './components/dashboard/UpdateProgressModal';
import { ViewChallengeModal } from './components/dashboard/ViewChallengeModal';
import {
  currentUser,
  overviewStats as initialStats,
  initialActivities,
  initialChallenges,
  initialActivitiesFeed,
  weeklyPerformance,
} from './data/mockData';
import type { Activity, Challenge, ActivityItemData } from './types';

export function App() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data States
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [feedItems, setFeedItems] = useState<ActivityItemData[]>(initialActivitiesFeed);

  // Modals state
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);
  const [preselectedActivityForChallenge, setPreselectedActivityForChallenge] = useState<Activity | null>(null);

  // Active modal targets
  const [activeActivityForUpdate, setActiveActivityForUpdate] = useState<Activity | null>(null);
  const [activeChallengeForView, setActiveChallengeForView] = useState<Challenge | null>(null);

  // Synchronized Progress Update
  const handleSaveProgress = (activityId: string, newActualProgress: number) => {
    // 1. Update personal activity state
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id !== activityId) return act;
        return {
          ...act,
          todayActualProgress: newActualProgress,
        };
      })
    );

    // 2. Lookup activity details for feed item
    const targetAct = activities.find((a) => a.id === activityId);
    if (targetAct) {
      const linkedCh = challenges.find((c) => c.activityId === activityId);
      const isPersonalMet = newActualProgress >= targetAct.personalDailyTarget;
      const isChallengeMet = linkedCh ? newActualProgress >= linkedCh.challengeDailyTarget : false;

      let actionDesc = `logged ${newActualProgress} ${targetAct.unit} in`;
      if (isPersonalMet) {
        actionDesc = `completed personal goal (${newActualProgress} ${targetAct.unit}) in`;
      }
      if (linkedCh && isChallengeMet) {
        actionDesc += ` & met challenge target vs ${linkedCh.opponent.name} in`;
      }

      const newFeedItem: ActivityItemData = {
        id: `act-${Date.now()}`,
        userName: 'You',
        isCurrentUser: true,
        initials: 'R',
        avatarColor: 'bg-indigo-100 text-indigo-800',
        action: actionDesc,
        challengeName: targetAct.name,
        timestamp: 'Just now',
        iconType: targetAct.category.toLowerCase() as any,
      };

      setFeedItems((prev) => [newFeedItem, ...prev]);
    }
  };

  // Add new Activity
  const handleAddActivity = (newActivity: Activity) => {
    setActivities((prev) => [newActivity, ...prev]);

    const newFeedItem: ActivityItemData = {
      id: `act-${Date.now()}`,
      userName: 'You',
      isCurrentUser: true,
      initials: 'R',
      avatarColor: 'bg-indigo-100 text-indigo-800',
      action: 'started tracking personal goal',
      challengeName: newActivity.name,
      timestamp: 'Just now',
      iconType: newActivity.category.toLowerCase() as any,
    };
    setFeedItems((prev) => [newFeedItem, ...prev]);
  };

  // Create new Challenge
  const handleCreateChallenge = (newChallenge: Challenge) => {
    setChallenges((prev) => [newChallenge, ...prev]);

    const newFeedItem: ActivityItemData = {
      id: `act-${Date.now()}`,
      userName: 'You',
      isCurrentUser: true,
      initials: 'R',
      avatarColor: 'bg-indigo-100 text-indigo-800',
      action: `challenged ${newChallenge.opponent.name} for ${newChallenge.durationDays || '∞'} days in`,
      challengeName: newChallenge.activityName,
      timestamp: 'Just now',
      iconType: newChallenge.category.toLowerCase() as any,
    };
    setFeedItems((prev) => [newFeedItem, ...prev]);
  };

  // Triggers challenge modal pre-selecting a specific activity
  const handleChallengeFromActivity = (activity: Activity) => {
    setPreselectedActivityForChallenge(activity);
    setIsCreateChallengeOpen(true);
  };

  // Triggers progress update from ChallengeCard
  const handleUpdateFromChallenge = (challenge: Challenge) => {
    const act = activities.find((a) => a.id === challenge.activityId);
    if (act) {
      setActiveActivityForUpdate(act);
    }
  };

  // Compute live overview stats
  const completedActivitiesCount = activities.filter(
    (a) => a.todayActualProgress >= a.personalDailyTarget
  ).length;

  const currentStats = initialStats.map((stat) => {
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

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0 z-40">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      </div>

      {/* Mobile Drawer & Bottom Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-12">
        {/* Top Header */}
        <Header
          user={currentUser}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Dashboard Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-9">
          {/* Header section with Greeting and Actions */}
          <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Good evening, Ravi 👋
              </h1>
              <p className="text-sm sm:text-base text-slate-500 mt-1">
                Track yourself. Challenge your friends.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                onClick={() => {
                  setPreselectedActivityForChallenge(null);
                  setIsCreateChallengeOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-soft-sm transition-all cursor-pointer"
              >
                <Swords className="w-4 h-4 text-indigo-600" />
                <span>Challenge a Friend</span>
              </button>

              <button
                onClick={() => setIsAddActivityOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-soft-sm shadow-indigo-200 transition-all group cursor-pointer"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
                <span>+ Add Activity</span>
              </button>
            </div>
          </section>

          {/* Overview Statistics */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {currentStats.map((stat) => (
                <StatCard key={stat.id} stat={stat} />
              ))}
            </div>
          </section>

          {/* Main 2-Column Grid: Left (My Activities & Active Challenges), Right (Progress & Activity) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Personal Activities & Active Challenges */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-10">
              {/* SECTION 1: MY ACTIVITIES */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                      <ActivityIcon className="w-5 h-5 text-indigo-600" />
                      My Activities
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Track your personal goals
                    </p>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {completedActivitiesCount} of {activities.length} Met Today
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onUpdateProgress={(act) => setActiveActivityForUpdate(act)}
                      onChallengeFriend={handleChallengeFromActivity}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 2: ACTIVE CHALLENGES */}
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                      <Swords className="w-5 h-5 text-amber-600" />
                      Active Challenges
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Compete with your friends
                    </p>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {challenges.length} Live Duels
                  </span>
                </div>

                <div className="space-y-4">
                  {challenges.map((challenge) => {
                    const linkedActivity = activities.find(
                      (a) => a.id === challenge.activityId
                    );
                    const raviActual = linkedActivity
                      ? linkedActivity.todayActualProgress
                      : 0;

                    return (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        userActualProgress={raviActual}
                        onUpdateProgress={handleUpdateFromChallenge}
                        onViewChallenge={(ch) => setActiveChallengeForView(ch)}
                      />
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Right Column: Performance Analytics & Recent Activity Feed */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              {/* Challenge Performance: Your Progress */}
              <section>
                <WeeklyProgress
                  days={weeklyPerformance}
                  streakDays={12}
                />
              </section>

              {/* Recent Activity Feed */}
              <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-soft-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-1">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      Recent Activity
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Live accountability feed from friends
                    </p>
                  </div>

                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {feedItems.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddActivityModal
        isOpen={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        onAdd={handleAddActivity}
      />

      <CreateChallengeModal
        isOpen={isCreateChallengeOpen}
        activities={activities}
        initialActivity={preselectedActivityForChallenge}
        onClose={() => {
          setIsCreateChallengeOpen(false);
          setPreselectedActivityForChallenge(null);
        }}
        onCreate={handleCreateChallenge}
      />

      <UpdateProgressModal
        activity={activeActivityForUpdate}
        linkedChallenge={
          activeActivityForUpdate
            ? challenges.find((c) => c.activityId === activeActivityForUpdate.id)
            : null
        }
        isOpen={!!activeActivityForUpdate}
        onClose={() => setActiveActivityForUpdate(null)}
        onSave={handleSaveProgress}
      />

      <ViewChallengeModal
        challenge={activeChallengeForView}
        userActualProgress={
          activeChallengeForView
            ? activities.find((a) => a.id === activeChallengeForView.activityId)
                ?.todayActualProgress ?? 0
            : 0
        }
        isOpen={!!activeChallengeForView}
        onClose={() => setActiveChallengeForView(null)}
      />
    </div>
  );
}

export default App;
