-- ============================================================================
-- ZENJI: Zen Flow Challenge — Relational Database Schema & Migrations
-- Compatible with PostgreSQL (13+) and SQLite (3.35+)
-- ============================================================================

-- 1. USER PROFILES TABLE (Mindfulness Gamification State)
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    avatar_initials VARCHAR(8) NOT NULL DEFAULT 'ZM',
    games_played INTEGER NOT NULL DEFAULT 0,
    highest_score INTEGER NOT NULL DEFAULT 0,
    daily_wins INTEGER NOT NULL DEFAULT 0,
    zen_level INTEGER NOT NULL DEFAULT 1,
    zen_master_badge BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. GAME SESSIONS TABLE (Authoritative Server-Validated Sessions)
CREATE TABLE IF NOT EXISTS game_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60, -- In seconds (validates ~60s)
    score INTEGER NOT NULL DEFAULT 0,    -- Authoritatively computed server-side
    client_score INTEGER DEFAULT 0,      -- For fraud audit comparison
    game_seed BIGINT NOT NULL,           -- Pseudo-random seed for deterministic reproduction
    max_combo INTEGER NOT NULL DEFAULT 1,
    hits_count INTEGER NOT NULL DEFAULT 0,
    misses_count INTEGER NOT NULL DEFAULT 0,
    fast_reactions_count INTEGER NOT NULL DEFAULT 0,
    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
    anti_cheat_flags TEXT DEFAULT NULL,  -- JSON or comma-separated audit flags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_user_date ON game_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_game_sessions_date_score ON game_sessions(date, score DESC);

-- 3. DAILY LEADERBOARDS TABLE (Daily Competition Table)
CREATE TABLE IF NOT EXISTS leaderboards (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    rank INTEGER NOT NULL DEFAULT 1,
    reward_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending' | 'awarded' | 'claimed' | 'none'
    zen_level INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_leaderboard_user_date UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_leaderboards_date_rank ON leaderboards(date, rank ASC);
CREATE INDEX IF NOT EXISTS idx_leaderboards_date_score ON leaderboards(date, score DESC);

-- 4. HISTORICAL DAILY WINNERS TABLE (Permanent Archive)
CREATE TABLE IF NOT EXISTS daily_winners (
    id VARCHAR(64) PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    user_id VARCHAR(64) NOT NULL REFERENCES user_profiles(user_id),
    username VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL,
    reward_id VARCHAR(64) NULL,
    reward_type VARCHAR(32) NOT NULL DEFAULT 'badge',
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_winners_date ON daily_winners(date DESC);

-- 5. SCALABLE REWARDS TABLE (Supports badges, coins, coupons, NFT, premium days)
CREATE TABLE IF NOT EXISTS rewards (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    reward_type VARCHAR(32) NOT NULL, -- 'badge' | 'coins' | 'coupons' | 'nft' | 'premium_days'
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb, -- Flexible payload (e.g., promo_code, discount_pct, token_id)
    date DATE NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rewards_user_claimed ON rewards(user_id, claimed_at);

-- ============================================================================
-- INITIAL SEED DATA FOR DEMO & BENCHMARKING
-- ============================================================================

INSERT INTO user_profiles (user_id, username, avatar_initials, games_played, highest_score, daily_wins, zen_level, zen_master_badge)
VALUES 
    ('usr_01demo', 'Rahim Khan', 'RK', 14, 5420, 7, 12, TRUE),
    ('usr_02elena', 'Elena Rostova', 'ER', 22, 4890, 4, 10, TRUE),
    ('usr_03kenji', 'Kenji Takahashi', 'KT', 18, 4520, 2, 9, FALSE),
    ('usr_04maya', 'Maya Lin', 'ML', 11, 3980, 1, 7, FALSE),
    ('usr_05sarah', 'Dr. Sarah Jenkins', 'SJ', 9, 3410, 0, 6, FALSE)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO daily_winners (id, date, user_id, username, score, reward_id, reward_type, awarded_at)
VALUES 
    ('win_2026_09_29', '2026-09-29', 'usr_01demo', 'Rahim Khan', 5420, 'rw_001', 'badge', '2026-09-29 23:59:59')
ON CONFLICT (date) DO NOTHING;

INSERT INTO rewards (id, user_id, reward_type, title, description, metadata, date, claimed_at)
VALUES
    ('rw_001', 'usr_01demo', 'badge', 'ZEN MASTER Badge', 'Achieved #1 rank in the Zen Flow Daily Challenge.', '{"badge_code": "ZEN_MASTER", "season": "AW26"}'::jsonb, '2026-09-29', '2026-09-29 23:59:59'),
    ('rw_002', 'usr_01demo', 'coupons', '15% Off ZENJI Storewide', 'Exclusive daily victor code for AW26 streetwear drop.', '{"promo_code": "ZENFLOW15", "discount_pct": 15, "min_spend": 50}'::jsonb, '2026-09-29', NULL)
ON CONFLICT (id) DO NOTHING;
