-- ============================================================================
-- Social Challenge Tracker: Initial Database Foundation Schema
-- Migration: 20260911000000_initial_schema.sql
-- Description: Creates foundational tables for profiles, activities,
--              activity_logs, friendships, challenges, and challenge_progress
--              with Row Level Security (RLS), constraints, and performance indexes.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ----------------------------------------------------------------------------
-- Extends auth.users. The username serves as the public platform identifier
-- for finding friends. Email remains private within auth.users.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Username constraints: alphanumeric + underscores, 3 to 30 characters
  -- Note: UNIQUE constraint implicitly creates a unique b-tree index on username.
  CONSTRAINT profiles_username_key UNIQUE (username),
  CONSTRAINT profiles_username_length_check CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT profiles_username_format_check CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

COMMENT ON TABLE public.profiles IS 'Application user profiles tied 1:1 to auth.users.';
COMMENT ON COLUMN public.profiles.username IS 'Unique public handle used for friend discovery.';
COMMENT ON COLUMN public.profiles.display_name IS 'Friendly display name shown across the UI.';

-- ----------------------------------------------------------------------------
-- 2. ACTIVITIES TABLE (Personal Goals)
-- ----------------------------------------------------------------------------
-- Activities tracked personally by users. A user tracks reality independently
-- of whether they choose to challenge an opponent.
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  daily_target NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT activities_daily_target_positive CHECK (daily_target > 0),
  -- Composite unique constraint required for relational challenge activity ownership
  CONSTRAINT activities_id_user_id_key UNIQUE (id, user_id)
);

COMMENT ON TABLE public.activities IS 'Personal activity definitions and daily targets.';
COMMENT ON COLUMN public.activities.daily_target IS 'Personal goal target (e.g. 5 km, 4 rounds). Independent from challenge targets.';

-- ----------------------------------------------------------------------------
-- 3. ACTIVITY LOGS TABLE (Personal Progress History)
-- ----------------------------------------------------------------------------
-- Daily measurable logs for personal activities. Exactly one log per day per activity.
-- TodayActualProgress and streaks are computed dynamically from these logs.
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  value NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT activity_logs_value_non_negative CHECK (value >= 0),
  CONSTRAINT unique_activity_daily_log UNIQUE (activity_id, date)
);

COMMENT ON TABLE public.activity_logs IS 'Historical daily logs for personal activities.';

-- ----------------------------------------------------------------------------
-- 4. FRIENDSHIPS TABLE
-- ----------------------------------------------------------------------------
-- Tracks bidirectional social relationships.
-- Statuses: pending, accepted, rejected.
-- Prevent duplicate active relationships regardless of who initiated.
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT friendships_status_check CHECK (status IN ('pending', 'accepted', 'rejected')),
  CONSTRAINT friendships_not_self CHECK (requester_id <> receiver_id)
);

-- Unique pair index: ensures user A and user B have at most one relationship row
-- regardless of whether A requested B or B requested A.
CREATE UNIQUE INDEX IF NOT EXISTS unique_friendship_pair
  ON public.friendships (LEAST(requester_id, receiver_id), GREATEST(requester_id, receiver_id));

COMMENT ON TABLE public.friendships IS 'Friendship connections between users.';

-- ----------------------------------------------------------------------------
-- 5. CHALLENGES TABLE (Social Duels)
-- ----------------------------------------------------------------------------
-- Head-to-head competitions between two participants during a specific time period.
-- Challenge daily target is independent of personal daily targets.
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opponent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  daily_target NUMERIC NOT NULL,
  duration_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Database-level guarantee: challenge can only reference an activity owned by the challenge creator
  CONSTRAINT challenges_activity_creator_fkey
    FOREIGN KEY (activity_id, creator_id)
    REFERENCES public.activities (id, user_id)
    ON DELETE CASCADE,

  CONSTRAINT challenges_daily_target_positive CHECK (daily_target > 0),
  CONSTRAINT challenges_duration_type_check CHECK (duration_type IN ('7', '14', '30', 'custom', 'no_end_date')),
  CONSTRAINT challenges_status_check CHECK (status IN ('upcoming', 'active', 'completed', 'expired', 'cancelled')),
  CONSTRAINT challenges_not_self CHECK (creator_id <> opponent_id),
  CONSTRAINT challenges_date_order CHECK (end_date IS NULL OR end_date >= start_date)
);

COMMENT ON TABLE public.challenges IS 'Social challenges evaluating participants against a required target.';

-- ----------------------------------------------------------------------------
-- 6. CHALLENGE PROGRESS TABLE
-- ----------------------------------------------------------------------------
-- Tracks daily progress logged specifically within the boundaries of a challenge.
-- Separate from personal activity logs because challenge dates and scopes are distinct.
CREATE TABLE IF NOT EXISTS public.challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  value NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT challenge_progress_value_non_negative CHECK (value >= 0),
  CONSTRAINT unique_challenge_user_daily_progress UNIQUE (challenge_id, user_id, date)
);

COMMENT ON TABLE public.challenge_progress IS 'Daily progress records for challenge participants.';

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================
-- Note: profiles(username) is omitted because profiles_username_key UNIQUE constraint already indexes it.
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON public.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_activity_date ON public.activity_logs(activity_id, date);
CREATE INDEX IF NOT EXISTS idx_friendships_requester ON public.friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_receiver ON public.friendships(receiver_id);
CREATE INDEX IF NOT EXISTS idx_challenges_creator ON public.challenges(creator_id);
CREATE INDEX IF NOT EXISTS idx_challenges_opponent ON public.challenges(opponent_id);
CREATE INDEX IF NOT EXISTS idx_challenges_activity ON public.challenges(activity_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenge_progress_challenge_date ON public.challenge_progress(challenge_id, date);
CREATE INDEX IF NOT EXISTS idx_challenge_progress_user ON public.challenge_progress(user_id);

-- ============================================================================
-- IMMUTABILITY & AUTOMATION TRIGGERS
-- ============================================================================

-- When a user signs up through Supabase Auth (auth.users), this trigger
-- automatically provisions a profile in public.profiles.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'username',
      'user_' || substr(replace(new.id::text, '-', ''), 1, 8)
    ),
    COALESCE(
      new.raw_user_meta_data->>'display_name',
      'Challenger'
    ),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to strictly guarantee friendship endpoints (requester_id, receiver_id) cannot be modified after creation
CREATE OR REPLACE FUNCTION public.check_friendship_immutability()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.requester_id <> NEW.requester_id OR OLD.receiver_id <> NEW.receiver_id THEN
    RAISE EXCEPTION 'Friendship endpoints (requester_id, receiver_id) are immutable';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_friendship_immutable ON public.friendships;
CREATE TRIGGER trg_friendship_immutable
  BEFORE UPDATE ON public.friendships
  FOR EACH ROW EXECUTE FUNCTION public.check_friendship_immutability();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_progress ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
-- Any authenticated user can view profiles to find friends by username.
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can only insert their own profile matching auth.uid()
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- ----------------------------------------------------------------------------
-- ACTIVITIES POLICIES
-- ----------------------------------------------------------------------------
-- Users can view their own activities, or activities linked to active challenges they are in.
CREATE POLICY "Users can view their own activities or challenged activities"
  ON public.activities
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = user_id
    OR EXISTS (
      SELECT 1 FROM public.challenges
      WHERE challenges.activity_id = activities.id
        AND (challenges.creator_id = (select auth.uid()) OR challenges.opponent_id = (select auth.uid()))
    )
  );

-- Users can only create their own activities
CREATE POLICY "Users can create their own activities"
  ON public.activities
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- Users can only update their own activities
CREATE POLICY "Users can update their own activities"
  ON public.activities
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Users can only delete their own activities
CREATE POLICY "Users can delete their own activities"
  ON public.activities
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ----------------------------------------------------------------------------
-- ACTIVITY LOGS POLICIES
-- ----------------------------------------------------------------------------
-- Users can view logs belonging to their own activities
CREATE POLICY "Users can view their own activity logs"
  ON public.activity_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_logs.activity_id
        AND activities.user_id = (select auth.uid())
    )
  );

-- Users can only insert logs for their own activities
CREATE POLICY "Users can insert their own activity logs"
  ON public.activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_logs.activity_id
        AND activities.user_id = (select auth.uid())
    )
  );

-- Users can only update logs for their own activities
CREATE POLICY "Users can update their own activity logs"
  ON public.activity_logs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_logs.activity_id
        AND activities.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_logs.activity_id
        AND activities.user_id = (select auth.uid())
    )
  );

-- Users can only delete logs for their own activities
CREATE POLICY "Users can delete their own activity logs"
  ON public.activity_logs
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_logs.activity_id
        AND activities.user_id = (select auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- FRIENDSHIPS POLICIES
-- ----------------------------------------------------------------------------
-- Users can view friendships they are a part of (as requester or receiver)
CREATE POLICY "Users can view their own friendships"
  ON public.friendships
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = requester_id
    OR (select auth.uid()) = receiver_id
  );

-- Users can initiate a friend request where they are the requester
CREATE POLICY "Users can send friend requests as requester"
  ON public.friendships
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = requester_id);

-- Restrictive policy: Only the receiver can update a pending friendship (e.g. accept or reject).
-- Friendship endpoints (requester_id, receiver_id) are enforced immutable via database trigger.
-- Additional state transitions will be implemented during the dedicated friendship feature milestone.
CREATE POLICY "Receivers can respond to pending friendships"
  ON public.friendships
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) = receiver_id
    AND status = 'pending'
  )
  WITH CHECK (
    (select auth.uid()) = receiver_id
    AND status IN ('accepted', 'rejected')
  );

-- Participants can remove/cancel a friendship
CREATE POLICY "Participants can delete a friendship"
  ON public.friendships
  FOR DELETE
  TO authenticated
  USING (
    (select auth.uid()) = requester_id
    OR (select auth.uid()) = receiver_id
  );

-- ----------------------------------------------------------------------------
-- CHALLENGES POLICIES
-- ----------------------------------------------------------------------------
-- Participants (creator or opponent) can view their challenges
CREATE POLICY "Participants can view their challenges"
  ON public.challenges
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = creator_id
    OR (select auth.uid()) = opponent_id
  );

-- Users can only create challenges where they are the creator and own the referenced activity
CREATE POLICY "Users can create challenges as creator"
  ON public.challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = creator_id
    AND EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_id
        AND activities.user_id = (select auth.uid())
    )
  );

-- Only the creator can update the challenge configuration.
-- Note: Opponent-specific state changes (such as accepting, declining, or resigning)
-- will be handled via dedicated secure RPC functions or specific status-transition
-- policies during the challenge feature milestone.
CREATE POLICY "Creators can update their challenges"
  ON public.challenges
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = creator_id)
  WITH CHECK ((select auth.uid()) = creator_id);

-- Creators can delete a challenge they created
CREATE POLICY "Creators can delete their challenges"
  ON public.challenges
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = creator_id);

-- ----------------------------------------------------------------------------
-- CHALLENGE PROGRESS POLICIES
-- ----------------------------------------------------------------------------
-- Both participants in a challenge can view each other's progress
CREATE POLICY "Challenge participants can view challenge progress"
  ON public.challenge_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.challenges
      WHERE challenges.id = challenge_progress.challenge_id
        AND (challenges.creator_id = (select auth.uid()) OR challenges.opponent_id = (select auth.uid()))
    )
  );

-- Users can only insert their own progress for challenges they are in
CREATE POLICY "Participants can insert their own challenge progress"
  ON public.challenge_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM public.challenges
      WHERE challenges.id = challenge_progress.challenge_id
        AND (challenges.creator_id = (select auth.uid()) OR challenges.opponent_id = (select auth.uid()))
    )
  );

-- Users can only update their own progress within a challenge where they are a participant (creator or opponent).
-- Protects both the existing row being updated (USING) and the resulting row after update (WITH CHECK),
-- preventing challenge_id or user_id tampering across challenges or users.
CREATE POLICY "Users can update their own challenge progress"
  ON public.challenge_progress
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM public.challenges
      WHERE challenges.id = challenge_progress.challenge_id
        AND (challenges.creator_id = (select auth.uid()) OR challenges.opponent_id = (select auth.uid()))
    )
  )
  WITH CHECK (
    (select auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM public.challenges
      WHERE challenges.id = challenge_progress.challenge_id
        AND (challenges.creator_id = (select auth.uid()) OR challenges.opponent_id = (select auth.uid()))
    )
  );

-- Users can only delete their own challenge progress
CREATE POLICY "Users can delete their own challenge progress"
  ON public.challenge_progress
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);
