export interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
  language: string;
  invite_code: string;
  privacy_share_exact_numbers: boolean;
  created_at: string;
  updated_at: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
}

export interface FriendRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Nudge {
  id: string;
  from_user_id: string;
  to_user_id: string;
  nudge_type: 'hydrate' | 'walk' | 'sleep' | 'encourage';
  created_at: string;
}

export interface UserStatsHistory {
  id: string;
  user_id: string;
  date: string;
  daily_score: number;
  fasting_hours: number;
  water_ml: number;
  sleep_hours: number;
  mindfulness_minutes: number;
  steps: number;
  fasting_streak: number;
  sleep_streak: number;
  mindfulness_streak: number;
  steps_streak: number;
  created_at: string;
}

export interface FriendWithStats extends Profile {
  stats?: UserStatsHistory;
}
