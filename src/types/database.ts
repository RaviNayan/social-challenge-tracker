/**
 * Database schema definitions for Supabase PostgreSQL tables.
 * Reflects normalized relational models created in supabase/migrations.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected';
export type ChallengeDurationType = '7' | '14' | '30' | 'custom' | 'no_end_date';
export type ChallengeDbStatus = 'upcoming' | 'active' | 'completed' | 'expired' | 'cancelled';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // references auth.users(id)
          username: string;
          display_name: string;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          unit: string;
          daily_target: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: string;
          unit: string;
          daily_target: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          unit?: string;
          daily_target?: number;
          created_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          activity_id: string;
          date: string; // YYYY-MM-DD
          value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          date: string;
          value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          activity_id?: string;
          date?: string;
          value?: number;
          created_at?: string;
        };
      };
      friendships: {
        Row: {
          id: string;
          requester_id: string;
          receiver_id: string;
          status: FriendshipStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          receiver_id: string;
          status?: FriendshipStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          requester_id?: string;
          receiver_id?: string;
          status?: FriendshipStatus;
          created_at?: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          activity_id: string;
          creator_id: string;
          opponent_id: string;
          daily_target: number;
          duration_type: ChallengeDurationType;
          start_date: string; // YYYY-MM-DD
          end_date: string | null; // YYYY-MM-DD
          status: ChallengeDbStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          creator_id: string;
          opponent_id: string;
          daily_target: number;
          duration_type: ChallengeDurationType;
          start_date: string;
          end_date?: string | null;
          status?: ChallengeDbStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          activity_id?: string;
          creator_id?: string;
          opponent_id?: string;
          daily_target?: number;
          duration_type?: ChallengeDurationType;
          start_date?: string;
          end_date?: string | null;
          status?: ChallengeDbStatus;
          created_at?: string;
        };
      };
      challenge_progress: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          date: string; // YYYY-MM-DD
          value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          date: string;
          value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          date?: string;
          value?: number;
          created_at?: string;
        };
      };
    };
  };
}
