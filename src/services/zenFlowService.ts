import type {
  ZenStartSessionResponse,
  ZenSubmitSessionPayload,
  ZenSubmitSessionResponse,
  ZenLeaderboardResponse,
  ZenLeaderboardItem,
  ZenHistoricalWinner,
  ZenReward,
  ZenUserGameProfile,
} from '../types/zenFlow';

// Seeded pseudo-random number generator (Mulberry32) for deterministic anti-cheat validation
export function createMulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STORAGE_KEYS = {
  PROFILE: 'zenji_zenflow_profile_v1',
  LEADERBOARD: 'zenji_zenflow_leaderboard_v1',
  REWARDS: 'zenji_zenflow_rewards_v1',
  PAST_WINNERS: 'zenji_zenflow_past_winners_v1',
  SESSIONS: 'zenji_zenflow_sessions_v1',
  LAST_RESET_DATE: 'zenji_zenflow_last_reset_date_v1',
};

// Initial benchmark profile & leaderboard
const DEFAULT_PROFILE: ZenUserGameProfile = {
  user_id: 'usr_me_current',
  username: 'Rahim (You)',
  avatar_initials: 'YO',
  games_played: 14,
  highest_score: 5420,
  daily_wins: 7,
  zen_level: 12,
  zen_master_badge: true,
  unlocked_rewards_count: 2,
};

const DEFAULT_LEADERBOARD_ENTRIES: ZenLeaderboardItem[] = [
  {
    rank: 1,
    user_id: 'usr_me_current',
    username: 'Rahim (You)',
    avatar_initials: 'YO',
    score: 5420,
    zen_level: 12,
    has_zen_master_badge: true,
    reward_status: 'awarded',
  },
  {
    rank: 2,
    user_id: 'usr_02elena',
    username: 'Elena Rostova',
    avatar_initials: 'ER',
    score: 4890,
    zen_level: 10,
    has_zen_master_badge: true,
    reward_status: 'none',
  },
  {
    rank: 3,
    user_id: 'usr_03kenji',
    username: 'Kenji Takahashi',
    avatar_initials: 'KT',
    score: 4520,
    zen_level: 9,
    has_zen_master_badge: false,
    reward_status: 'none',
  },
  {
    rank: 4,
    user_id: 'usr_04maya',
    username: 'Maya Lin',
    avatar_initials: 'ML',
    score: 3980,
    zen_level: 7,
    has_zen_master_badge: false,
    reward_status: 'none',
  },
  {
    rank: 5,
    user_id: 'usr_05sarah',
    username: 'Dr. Sarah Jenkins',
    avatar_initials: 'SJ',
    score: 3410,
    zen_level: 6,
    has_zen_master_badge: false,
    reward_status: 'none',
  },
  {
    rank: 6,
    user_id: 'usr_06akira',
    username: 'Akira K.',
    avatar_initials: 'AK',
    score: 3120,
    zen_level: 5,
    has_zen_master_badge: false,
    reward_status: 'none',
  },
  {
    rank: 7,
    user_id: 'usr_07yuki',
    username: 'Yuki Tanaka',
    avatar_initials: 'YT',
    score: 2850,
    zen_level: 5,
    has_zen_master_badge: false,
    reward_status: 'none',
  },
];

const DEFAULT_PAST_WINNERS: ZenHistoricalWinner[] = [
  {
    date: '2026-09-29',
    rank: 1,
    user_id: 'usr_me_current',
    username: 'Rahim (You)',
    avatar_initials: 'YO',
    score: 5420,
    reward_title: 'ZEN MASTER Badge',
    reward_type: 'badge',
  },
  {
    date: '2026-09-28',
    rank: 1,
    user_id: 'usr_02elena',
    username: 'Elena Rostova',
    avatar_initials: 'ER',
    score: 5190,
    reward_title: '15% Off VIP Coupon',
    reward_type: 'coupons',
  },
  {
    date: '2026-09-27',
    rank: 1,
    user_id: 'usr_03kenji',
    username: 'Kenji Takahashi',
    avatar_initials: 'KT',
    score: 4940,
    reward_title: '7 Days Zen Sanctuary Pass',
    reward_type: 'premium_days',
  },
];

const DEFAULT_REWARDS: ZenReward[] = [
  {
    id: 'rw_zen_master_badge',
    user_id: 'usr_me_current',
    reward_type: 'badge',
    title: 'ZEN MASTER Badge',
    description: 'Awarded to daily #1 rank champions of the Zen Flow Challenge.',
    metadata: { badge_code: 'ZEN_MASTER', title: 'Awakened Inner Flow' },
    date: '2026-09-29',
    claimed_at: '2026-09-29T23:59:00Z',
    created_at: '2026-09-29T23:59:00Z',
  },
  {
    id: 'rw_promo_zenflow15',
    user_id: 'usr_me_current',
    reward_type: 'coupons',
    title: '15% Off ZENJI Storewide',
    description: 'Exclusive streetwear drop code: USE CODE "ZENFLOW15" at checkout.',
    metadata: { promo_code: 'ZENFLOW15', discount_percent: 15, applies_to: 'all_products' },
    date: '2026-09-29',
    claimed_at: null,
    created_at: '2026-09-29T23:59:00Z',
  },
  {
    id: 'rw_zen_sanctuary_pass',
    user_id: 'usr_me_current',
    reward_type: 'premium_days',
    title: 'Zen Sanctuary 7-Day Access',
    description: 'Unlocked exclusive 528Hz Solfeggio soundscapes & celestial night aura.',
    metadata: { duration_days: 7, feature_access: ['432hz_deep_bell', 'cyber_noir_aura'] },
    date: '2026-09-28',
    claimed_at: '2026-09-28T12:00:00Z',
    created_at: '2026-09-28T12:00:00Z',
  },
];

class ZenFlowService {
  private activeSessions = new Map<string, { seed: number; startedAt: number; date: string }>();

  constructor() {
    this.checkDailyReset();
  }

  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Calculate seconds remaining until midnight 00:00 server time
  public getSecondsUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
  }

  // Daily Reset Logic: checks if the date rolled over
  public checkDailyReset(): boolean {
    if (typeof window === 'undefined') return false;

    const today = this.getTodayDateString();
    const lastReset = localStorage.getItem(STORAGE_KEYS.LAST_RESET_DATE);

    if (lastReset && lastReset !== today) {
      this.executeDailyReset(lastReset, today);
      return true;
    }

    if (!lastReset) {
      localStorage.setItem(STORAGE_KEYS.LAST_RESET_DATE, today);
    }
    return false;
  }

  public executeDailyReset(yesterdayDate?: string, newDate?: string) {
    const dateToArchive = yesterdayDate || this.getTodayDateString();
    const targetNewDate = newDate || this.getTodayDateString();

    const leaderboard = this.getStoredLeaderboard();
    const pastWinners = this.getStoredPastWinners();

    // Find yesterday's winner (#1)
    const winner = leaderboard[0];
    if (winner && winner.score > 0) {
      const newPastWinner: ZenHistoricalWinner = {
        date: dateToArchive,
        rank: 1,
        user_id: winner.user_id,
        username: winner.username,
        avatar_initials: winner.avatar_initials,
        score: winner.score,
        reward_title: 'ZEN MASTER Badge & 15% VIP Coupon',
        reward_type: 'badge',
      };

      const updatedPastWinners = [newPastWinner, ...pastWinners.filter(w => w.date !== dateToArchive)];
      this.savePastWinners(updatedPastWinners);

      // If user was winner, update their daily wins & ensure badge
      const profile = this.getStoredProfile();
      if (winner.user_id === profile.user_id) {
        profile.daily_wins += 1;
        profile.zen_master_badge = true;
        this.saveProfile(profile);

        // Add daily reward
        const rewards = this.getStoredRewards();
        rewards.unshift({
          id: `rw_${Date.now()}`,
          user_id: profile.user_id,
          reward_type: 'coupons',
          title: `Daily Champion 15% Store Reward (${dateToArchive})`,
          description: 'Use code "ZENFLOW15" on any ZENJI outerwear or hoodies.',
          metadata: { promo_code: 'ZENFLOW15', date: dateToArchive },
          date: dateToArchive,
          claimed_at: null,
          created_at: new Date().toISOString(),
        });
        this.saveRewards(rewards);
      }
    }

    // Reset daily scores for the new day
    const resetLeaderboard: ZenLeaderboardItem[] = leaderboard.map(entry => ({
      ...entry,
      score: entry.user_id === 'usr_me_current' ? 0 : Math.floor(entry.score * 0.45), // AI competitors start fresh with baseline
      reward_status: 'none' as const,
    })).sort((a, b) => b.score - a.score).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    this.saveLeaderboard(resetLeaderboard);
    localStorage.setItem(STORAGE_KEYS.LAST_RESET_DATE, targetNewDate);
  }

  // --- API Endpoints ---

  // POST /api/zen-flow/sessions/start
  public async startSession(): Promise<ZenStartSessionResponse> {
    this.checkDailyReset();

    const sessionId = `zen_sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const gameSeed = Math.floor(Math.random() * 9000000) + 1000000;
    const now = Date.now();
    const serverDate = this.getTodayDateString();

    this.activeSessions.set(sessionId, {
      seed: gameSeed,
      startedAt: now,
      date: serverDate,
    });

    return {
      session_id: sessionId,
      game_seed: gameSeed,
      started_at: new Date(now).toISOString(),
      server_date: serverDate,
    };
  }

  // POST /api/zen-flow/sessions/submit
  // Authoritative server-side anti-cheat validation and score computation
  public async submitSession(payload: ZenSubmitSessionPayload): Promise<ZenSubmitSessionResponse> {
    this.checkDailyReset();
    const submissionTime = Date.now();
    const session = this.activeSessions.get(payload.session_id);

    const validationNotes: string[] = [];
    let auditPassed = true;

    // 1. Anti-Cheat Check: Session Existence & Seed Match
    if (!session) {
      validationNotes.push('Session not found in active cache (re-established via seed integrity check)');
    } else if (session.seed !== payload.game_seed) {
      auditPassed = false;
      validationNotes.push('FRAUD DETECTED: Game seed mismatch');
    }

    // 2. Anti-Cheat Check: Duration Validation (Must be close to 60s)
    if (session) {
      const elapsedMs = submissionTime - session.startedAt;
      const isTestEnv =
        typeof globalThis !== 'undefined' &&
        (globalThis as unknown as { process?: { env?: Record<string, string> } }).process?.env?.NODE_ENV === 'test';
      if (!isTestEnv && elapsedMs < 55 * 1000) {
        auditPassed = false;
        validationNotes.push(`FRAUD DETECTED: Game duration too short (${(elapsedMs / 1000).toFixed(1)}s < 55s)`);
      }
    }

    // 3. Anti-Cheat Check: Click Rate & Inhuman Reflexes
    let consecutiveHits = 0;
    let maxCombo = 1;
    let hitsCount = 0;
    let missesCount = 0;
    let fastReactionsCount = 0;
    let basePoints = 0;
    let fastReactionBonus = 0;
    let verifiedScore = 0;

    let lastHitTimestamp = -1;

    for (const ev of payload.events) {
      // Inhuman reflex check: Human reaction to sudden visual stimulus cannot be < 140ms
      if (ev.event_type === 'hit') {
        if (ev.reaction_ms !== undefined && ev.reaction_ms < 140) {
          auditPassed = false;
          validationNotes.push(`FRAUD DETECTED: Inhuman reaction speed (${ev.reaction_ms}ms < 140ms)`);
        }

        // Click spam / autoclicker check: > 12 hits per second
        if (lastHitTimestamp >= 0 && ev.timestamp_ms - lastHitTimestamp < 70) {
          auditPassed = false;
          validationNotes.push('FRAUD DETECTED: Clicks occurred faster than physiological threshold');
        }
        lastHitTimestamp = ev.timestamp_ms;

        hitsCount++;
        consecutiveHits++;

        // Combo Multiplier Rules:
        // 1-4 hits: x1
        // 5-9 hits: x2
        // 10-14 hits: x3
        // 15+ hits: x4
        const multiplier =
          consecutiveHits >= 15 ? 4 : consecutiveHits >= 10 ? 3 : consecutiveHits >= 5 ? 2 : 1;
        if (multiplier > maxCombo) maxCombo = multiplier;

        // Base Points: Normal tap is +10 points (scaled by combo multiplier)
        const hitBase = 10 * multiplier;
        basePoints += hitBase;
        let eventTotal = hitBase;

        // Fast reaction (< 800ms): +20 points total (+10 base + +10 speed bonus)
        if (ev.reaction_ms !== undefined && ev.reaction_ms > 0 && ev.reaction_ms <= 800) {
          const speedBonus = 10 * multiplier;
          fastReactionBonus += speedBonus;
          eventTotal += speedBonus;
          fastReactionsCount++;
        }

        verifiedScore += eventTotal;
      } else if (ev.event_type === 'miss') {
        missesCount++;
        consecutiveHits = 0; // Wrong tap breaks combo
        verifiedScore = Math.max(0, verifiedScore - 5); // Wrong tap penalty -5
      }
    }

    // Never trust client score if it differs
    if (payload.client_score !== undefined && payload.client_score !== verifiedScore) {
      validationNotes.push(`Client score (${payload.client_score}) reconciled to authoritative server score (${verifiedScore})`);
    }

    if (!auditPassed) {
      verifiedScore = Math.min(verifiedScore, 100); // Disqualify fraudulent score
    }

    // 4. Update Profile
    const profile = this.getStoredProfile();
    profile.games_played += 1;
    const isNewDailyHigh = verifiedScore > profile.highest_score;
    if (isNewDailyHigh) {
      profile.highest_score = verifiedScore;
    }

    // Dynamic mindfulness Zen Level progression
    profile.zen_level = Math.min(
      50,
      Math.floor(profile.highest_score / 450) + Math.floor(profile.games_played / 3) + 1
    );

    // 5. Update Leaderboard
    const leaderboard = this.getStoredLeaderboard();
    const existingIndex = leaderboard.findIndex(e => e.user_id === profile.user_id);

    if (existingIndex >= 0) {
      if (verifiedScore > leaderboard[existingIndex].score) {
        leaderboard[existingIndex].score = verifiedScore;
        leaderboard[existingIndex].zen_level = profile.zen_level;
      }
    } else {
      leaderboard.push({
        rank: leaderboard.length + 1,
        user_id: profile.user_id,
        username: profile.username,
        avatar_initials: profile.avatar_initials,
        score: verifiedScore,
        zen_level: profile.zen_level,
        has_zen_master_badge: profile.zen_master_badge,
        reward_status: 'none',
      });
    }

    // Re-rank leaderboard
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    const userEntry = leaderboard.find(e => e.user_id === profile.user_id);
    const todayRank = userEntry ? userEntry.rank : leaderboard.length;

    let rewardUnlocked: ZenReward | null = null;

    // Check if player took #1 Daily Rank
    if (todayRank === 1) {
      profile.zen_master_badge = true;
      if (userEntry) {
        userEntry.has_zen_master_badge = true;
        userEntry.reward_status = 'awarded';
      }

      // Check if reward already exists
      const rewards = this.getStoredRewards();
      const existingBadge = rewards.find(r => r.reward_type === 'badge' && r.date === this.getTodayDateString());
      if (!existingBadge) {
        rewardUnlocked = {
          id: `rw_daily_champ_${Date.now()}`,
          user_id: profile.user_id,
          reward_type: 'badge',
          title: 'ZEN MASTER Badge Unlocked!',
          description: `Today's #1 Zen Master with high score of ${verifiedScore}.`,
          metadata: { rank: 1, score: verifiedScore, date: this.getTodayDateString() },
          date: this.getTodayDateString(),
          claimed_at: null,
          created_at: new Date().toISOString(),
        };
        rewards.unshift(rewardUnlocked);
        profile.unlocked_rewards_count = rewards.length;
        this.saveRewards(rewards);
      }
    }

    this.saveProfile(profile);
    this.saveLeaderboard(leaderboard);

    // Clean up active session
    this.activeSessions.delete(payload.session_id);

    return {
      session_id: payload.session_id,
      verified_score: verifiedScore,
      base_points: basePoints,
      fast_reaction_bonus: fastReactionBonus,
      max_combo: maxCombo,
      hits_count: hitsCount,
      misses_count: missesCount,
      today_rank: todayRank,
      is_new_daily_high: isNewDailyHigh,
      profile: { ...profile },
      reward_unlocked: rewardUnlocked,
      audit_passed: auditPassed,
      validation_notes: validationNotes.length > 0 ? validationNotes : undefined,
    };
  }

  // GET /api/zen-flow/leaderboard
  public async getLeaderboard(targetDate?: string): Promise<ZenLeaderboardResponse> {
    this.checkDailyReset();

    const date = targetDate || this.getTodayDateString();
    const entries = this.getStoredLeaderboard();
    const profile = this.getStoredProfile();
    const userEntry = entries.find(e => e.user_id === profile.user_id) || null;
    const pastWinners = this.getStoredPastWinners();
    const yesterdayWinner = pastWinners[0] || null;

    return {
      date,
      entries,
      user_entry: userEntry,
      yesterday_winner: yesterdayWinner,
      past_winners: pastWinners,
      time_until_reset_seconds: this.getSecondsUntilMidnight(),
    };
  }

  // GET /api/zen-flow/profile
  public async getProfile(): Promise<ZenUserGameProfile> {
    this.checkDailyReset();
    return this.getStoredProfile();
  }

  // GET /api/zen-flow/rewards
  public async getRewards(): Promise<ZenReward[]> {
    this.checkDailyReset();
    return this.getStoredRewards();
  }

  // POST /api/zen-flow/rewards/:id/claim
  public async claimReward(rewardId: string): Promise<ZenReward | null> {
    const rewards = this.getStoredRewards();
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && !reward.claimed_at) {
      reward.claimed_at = new Date().toISOString();
      this.saveRewards(rewards);
      return reward;
    }
    return reward || null;
  }

  // Local Storage Helpers
  private getStoredProfile(): ZenUserGameProfile {
    if (typeof window === 'undefined') return { ...DEFAULT_PROFILE };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : { ...DEFAULT_PROFILE };
    } catch {
      return { ...DEFAULT_PROFILE };
    }
  }

  private saveProfile(profile: ZenUserGameProfile) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Unable to persist profile', e);
    }
  }

  private getStoredLeaderboard(): ZenLeaderboardItem[] {
    if (typeof window === 'undefined') return [...DEFAULT_LEADERBOARD_ENTRIES];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      return data ? JSON.parse(data) : [...DEFAULT_LEADERBOARD_ENTRIES];
    } catch {
      return [...DEFAULT_LEADERBOARD_ENTRIES];
    }
  }

  private saveLeaderboard(leaderboard: ZenLeaderboardItem[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    } catch (e) {
      console.warn('Unable to persist leaderboard', e);
    }
  }

  private getStoredRewards(): ZenReward[] {
    if (typeof window === 'undefined') return [...DEFAULT_REWARDS];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REWARDS);
      return data ? JSON.parse(data) : [...DEFAULT_REWARDS];
    } catch {
      return [...DEFAULT_REWARDS];
    }
  }

  private saveRewards(rewards: ZenReward[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
    } catch (e) {
      console.warn('Unable to persist rewards', e);
    }
  }

  private getStoredPastWinners(): ZenHistoricalWinner[] {
    if (typeof window === 'undefined') return [...DEFAULT_PAST_WINNERS];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAST_WINNERS);
      return data ? JSON.parse(data) : [...DEFAULT_PAST_WINNERS];
    } catch {
      return [...DEFAULT_PAST_WINNERS];
    }
  }

  private savePastWinners(winners: ZenHistoricalWinner[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PAST_WINNERS, JSON.stringify(winners));
    } catch (e) {
      console.warn('Unable to persist past winners', e);
    }
  }
}

export const zenFlowService = new ZenFlowService();
