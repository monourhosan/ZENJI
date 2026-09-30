export type ZenObjectType = 'lotus' | 'energy_circle' | 'crystal' | 'water_drop' | 'leaf';

export interface ZenClickEvent {
  event_id: string;
  object_id: string;
  object_type: ZenObjectType;
  event_type: 'hit' | 'miss';
  timestamp_ms: number; // millisecond offset from game start
  spawn_timestamp_ms: number;
  reaction_ms?: number;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
}

export interface ZenStartSessionResponse {
  session_id: string;
  game_seed: number;
  started_at: string;
  server_date: string;
}

export interface ZenSubmitSessionPayload {
  session_id: string;
  game_seed: number;
  duration_seconds: number;
  events: ZenClickEvent[];
  client_score?: number;
}

export interface ZenSubmitSessionResponse {
  session_id: string;
  verified_score: number;
  base_points: number;
  fast_reaction_bonus: number;
  max_combo: number;
  hits_count: number;
  misses_count: number;
  today_rank: number;
  is_new_daily_high: boolean;
  profile: ZenUserGameProfile;
  reward_unlocked: ZenReward | null;
  audit_passed: boolean;
  validation_notes?: string[];
}

export interface ZenLeaderboardItem {
  rank: number;
  user_id: string;
  username: string;
  avatar_initials: string;
  score: number;
  zen_level: number;
  has_zen_master_badge: boolean;
  reward_status: 'pending' | 'awarded' | 'claimed' | 'none';
}

export interface ZenHistoricalWinner {
  date: string;
  rank: number;
  user_id: string;
  username: string;
  avatar_initials: string;
  score: number;
  reward_title: string;
  reward_type: string;
}

export interface ZenLeaderboardResponse {
  date: string;
  entries: ZenLeaderboardItem[];
  user_entry: ZenLeaderboardItem | null;
  yesterday_winner: ZenHistoricalWinner | null;
  past_winners: ZenHistoricalWinner[];
  time_until_reset_seconds: number;
}

export type ZenRewardType = 'badge' | 'coins' | 'coupons' | 'nft' | 'premium_days';

export interface ZenReward {
  id: string;
  user_id: string;
  reward_type: ZenRewardType;
  title: string;
  description: string;
  metadata: Record<string, any>;
  date: string;
  claimed_at: string | null;
  created_at: string;
}

export interface ZenUserGameProfile {
  user_id: string;
  username: string;
  avatar_initials: string;
  games_played: number;
  highest_score: number;
  daily_wins: number;
  zen_level: number;
  zen_master_badge: boolean;
  unlocked_rewards_count: number;
}
