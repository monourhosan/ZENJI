import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy, User, Gift, Sparkles, ShieldCheck, ArrowLeft, Volume2, VolumeX, CheckCircle, X } from 'lucide-react';
import type { GameView, ActiveZenObject } from './types';
import type {
  ZenClickEvent,
  ZenStartSessionResponse,
  ZenSubmitSessionResponse,
  ZenUserGameProfile,
  ZenReward,
} from '../../types/zenFlow';
import { zenFlowService } from '../../services/zenFlowService';
import { zenAudio } from './ZenAudio';
import { Timer } from './Timer';
import { ScoreBoard } from './ScoreBoard';
import { GameCanvas } from './GameCanvas';
import { Leaderboard } from './Leaderboard';
import { RewardCard } from './RewardCard';
import { UserProfileCard } from './UserProfileCard';
import './animations.css';

interface ZenFlowGameProps {
  onClose?: () => void;
}

export const ZenFlowGame: React.FC<ZenFlowGameProps> = ({ onClose }) => {
  const [view, setView] = useState<GameView>('start');
  const [isMuted, setIsMuted] = useState<boolean>(zenAudio.getIsMuted());

  // Game active state
  const [session, setSession] = useState<ZenStartSessionResponse | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(60);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [comboHits, setComboHits] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [events, setEvents] = useState<ZenClickEvent[]>([]);

  // Submission / Results state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<ZenSubmitSessionResponse | null>(null);

  // User Profile & Rewards
  const [profile, setProfile] = useState<ZenUserGameProfile | null>(null);
  const [rewards, setRewards] = useState<ZenReward[]>([]);

  // Timer Ref
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameStartTimestampRef = useRef<number>(0);
  const eventsRef = useRef<ZenClickEvent[]>([]);
  const scoreRef = useRef<number>(0);

  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  useEffect(() => {
    scoreRef.current = currentScore;
  }, [currentScore]);

  // Subscribe to audio mute changes
  useEffect(() => {
    const unsub = zenAudio.subscribe((muted) => setIsMuted(muted));
    return () => unsub();
  }, []);

  // Fetch initial profile & rewards
  const loadData = useCallback(async () => {
    try {
      const [prof, rew] = await Promise.all([
        zenFlowService.getProfile(),
        zenFlowService.getRewards(),
      ]);
      setProfile(prof);
      setRewards(rew);
    } catch (e) {
      console.warn('Failed to load Zen Flow state', e);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Start Meditation Session
  const handleStartGame = async () => {
    try {
      const startRes = await zenFlowService.startSession();
      setSession(startRes);
      setRemainingSeconds(60);
      setCurrentScore(0);
      setComboHits(0);
      setMultiplier(1);
      setEvents([]);
      setGameResult(null);
      gameStartTimestampRef.current = Date.now();

      setView('playing');

      // Countdown loop
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            finishGame(eventsRef.current, scoreRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Failed to start Zen session', err);
    }
  };

  // Submit Session when timer reaches 0
  const finishGame = useCallback(
    async (collectedEvents: ZenClickEvent[], clientScore: number) => {
      if (!session) return;
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      setIsSubmitting(true);
      setView('gameover');

      try {
        const result = await zenFlowService.submitSession({
          session_id: session.session_id,
          game_seed: session.game_seed,
          duration_seconds: 60,
          events: collectedEvents,
          client_score: clientScore,
        });

        setGameResult(result);
        setProfile(result.profile);

        // Play victory bowl chime
        zenAudio.playBowlChime(432);

        // Refresh rewards list
        const updatedRewards = await zenFlowService.getRewards();
        setRewards(updatedRewards);
      } catch (e) {
        console.error('Failed to submit session', e);
      } finally {
        setIsSubmitting(false);
      }
    },
    [session]
  );

  // Handle Object Hit
  const handleHitObject = (
    obj: ActiveZenObject,
    reactionMs: number,
    _clientX: number,
    _clientY: number
  ) => {
    const now = Date.now();
    const relTimestamp = now - gameStartTimestampRef.current;

    const newComboHits = comboHits + 1;
    const newMultiplier =
      newComboHits >= 15 ? 4 : newComboHits >= 10 ? 3 : newComboHits >= 5 ? 2 : 1;

    const isFast = reactionMs <= 800;
    const pts = (isFast ? 20 : 10) * newMultiplier;

    setCurrentScore((prev) => prev + pts);
    setComboHits(newComboHits);
    setMultiplier(newMultiplier);

    const newEvent: ZenClickEvent = {
      event_id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      object_id: obj.id,
      object_type: obj.type,
      event_type: 'hit',
      timestamp_ms: relTimestamp,
      spawn_timestamp_ms: obj.spawnTimeMs - gameStartTimestampRef.current,
      reaction_ms: reactionMs,
      x: obj.x,
      y: obj.y,
    };

    setEvents((prev) => [...prev, newEvent]);
  };

  // Handle Miss Tap (clicking empty canvas)
  const handleMissTap = (clientX: number, clientY: number) => {
    const now = Date.now();
    const relTimestamp = now - gameStartTimestampRef.current;

    // Penalty: -5 points (not below 0), reset combo
    setCurrentScore((prev) => Math.max(0, prev - 5));
    setComboHits(0);
    setMultiplier(1);

    const newEvent: ZenClickEvent = {
      event_id: `ev_miss_${Date.now()}`,
      object_id: 'none',
      object_type: 'energy_circle',
      event_type: 'miss',
      timestamp_ms: relTimestamp,
      spawn_timestamp_ms: 0,
      x: clientX,
      y: clientY,
    };

    setEvents((prev) => [...prev, newEvent]);
  };

  const toggleMute = () => {
    zenAudio.toggleMute();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 text-neutral-900 dark:text-neutral-100">
      {/* Top Navigation Bar / Breadcrumbs */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          {view !== 'start' && view !== 'playing' ? (
            <button
              onClick={() => setView('start')}
              className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Back to Zen Flow Start"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-950 dark:bg-[#ccff00] text-white dark:text-black flex items-center justify-center font-heading font-black text-xs">
              禅
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-lg tracking-widest text-neutral-950 dark:text-white leading-none">
                ZEN FLOW
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400 font-bold uppercase tracking-wider">
                DAILY CHALLENGE
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              Find your inner rhythm • 60-Second Gamified Mindfulness
            </p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          {view !== 'playing' && (
            <>
              <button
                onClick={() => setView('leaderboard')}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer ${
                  view === 'leaderboard'
                    ? 'bg-neutral-950 text-white dark:bg-[#ccff00] dark:text-black border-transparent font-bold'
                    : 'bg-white/80 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100'
                }`}
                title="Leaderboard"
              >
                <Trophy className="w-3.5 h-3.5 text-[#ccff00]" />
                <span className="hidden sm:inline">Leaderboard</span>
              </button>

              <button
                onClick={() => setView('rewards')}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer ${
                  view === 'rewards'
                    ? 'bg-neutral-950 text-white dark:bg-[#ccff00] dark:text-black border-transparent font-bold'
                    : 'bg-white/80 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100'
                }`}
                title="Daily Rewards"
              >
                <Gift className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden sm:inline">Rewards</span>
                {rewards.filter((r) => !r.claimed_at).length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setView('profile')}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer ${
                  view === 'profile'
                    ? 'bg-neutral-950 text-white dark:bg-[#ccff00] dark:text-black border-transparent font-bold'
                    : 'bg-white/80 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100'
                }`}
                title="Zen Profile"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Profile</span>
              </button>
            </>
          )}

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-white/80 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#ccff00]" />}
          </button>

          {/* Optional Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/80 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close Zen Flow"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* VIEW: START SCREEN */}
      {view === 'start' && (
        <div className="flex flex-col items-center justify-center text-center py-6 sm:py-10 px-4">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#ccff00]/30 to-emerald-400/20 dark:from-[#ccff00]/20 dark:to-cyan-400/20 border border-[#ccff00]/50 flex items-center justify-center zen-orb-glow">
              <Sparkles className="w-10 h-10 text-neutral-950 dark:text-[#ccff00]" />
            </div>
          </div>

          <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-400 mb-2">
            ZEN FLOW CHALLENGE
          </span>

          <h2 className="font-heading font-black text-3xl sm:text-5xl text-neutral-950 dark:text-white uppercase tracking-tight max-w-lg mb-3">
            Find Your Inner Rhythm
          </h2>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mb-8 leading-relaxed">
            A 60-second mindfulness reaction challenge. Guide your Zen Energy Orb, tap harmonic objects as they bloom, maintain your combo streak, and ascend the daily leaderboard.
          </p>

          {/* Big CTA Button */}
          <button
            onClick={handleStartGame}
            className="group relative px-8 py-4 rounded-full bg-neutral-950 text-white dark:bg-[#ccff00] dark:text-black font-heading font-black text-base sm:text-lg uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-[#ccff00]/20 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
            <span>START MEDITATION</span>
          </button>

          {/* Daily Reward Teaser Pill */}
          <div className="mt-8 flex items-center gap-2.5 p-3 px-5 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
            <span className="text-neutral-700 dark:text-neutral-300">
              Today's #1 Victor Wins: <strong className="text-neutral-950 dark:text-white">ZEN MASTER Badge</strong> & 15% Off Drop 04
            </span>
          </div>

          {/* User Quick Stat strip */}
          {profile && (
            <div className="mt-6 flex items-center gap-6 text-xs font-mono text-neutral-500">
              <span>Games: <strong className="text-neutral-900 dark:text-white">{profile.games_played}</strong></span>
              <span>•</span>
              <span>Personal Best: <strong className="text-[#ccff00]">{profile.highest_score.toLocaleString()}</strong></span>
              <span>•</span>
              <span>Zen Level: <strong className="text-neutral-900 dark:text-white">{profile.zen_level}</strong></span>
            </div>
          )}
        </div>
      )}

      {/* VIEW: PLAYING SCREEN */}
      {view === 'playing' && (
        <div className="flex flex-col gap-4">
          {/* Top HUD (Timer & ScoreBoard) */}
          <div className="flex items-center justify-between gap-2 px-1">
            <Timer remainingSeconds={remainingSeconds} totalSeconds={60} />
            <ScoreBoard
              score={currentScore}
              comboHits={comboHits}
              multiplier={multiplier}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          </div>

          {/* 60 FPS Interactive Canvas & Zen Objects */}
          <GameCanvas
            isPlaying={view === 'playing'}
            gameStartTime={gameStartTimestampRef.current}
            onHitObject={handleHitObject}
            onMissTap={handleMissTap}
          />

          {/* Live Mindfulness Tips / Combo Feedback */}
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500 px-2">
            <span>Consecutive hits: {comboHits}</span>
            <span className="text-neutral-600 dark:text-neutral-400">
              {multiplier >= 4 ? '✦ MAXIMUM ZEN HARMONY (x4) ✦' : `Next multiplier at ${5 - (comboHits % 5)} hits`}
            </span>
          </div>
        </div>
      )}

      {/* VIEW: GAME OVER & AUTHORITATIVE RESULTS */}
      {view === 'gameover' && (
        <div className="flex flex-col items-center justify-center text-center py-6 px-4">
          {isSubmitting ? (
            <div className="py-16 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full border-3 border-[#ccff00] border-t-transparent animate-spin" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-heading font-bold text-lg text-neutral-950 dark:text-white">
                  Verifying Inner Flow...
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  Authoritative server-side anti-cheat verification in progress
                </span>
              </div>
            </div>
          ) : (
            gameResult && (
              <div className="w-full max-w-lg flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-[#ccff00] text-black flex items-center justify-center mb-4 shadow-lg">
                  <Sparkles className="w-8 h-8" />
                </div>

                <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 mb-1">
                  SESSION CONCLUDED
                </span>

                <h3 className="font-heading font-black text-2xl sm:text-3xl text-neutral-950 dark:text-white uppercase tracking-tight mb-2">
                  Your Zen Score
                </h3>

                {/* Score Number Display */}
                <div className="my-3 py-4 px-8 rounded-3xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 flex flex-col items-center">
                  <span className="font-mono font-black text-4xl sm:text-6xl text-neutral-950 dark:text-[#ccff00] tracking-tight">
                    {gameResult.verified_score.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-neutral-500">
                      Rank: <strong className="text-neutral-950 dark:text-white">#{gameResult.today_rank} Today</strong>
                    </span>
                    {gameResult.is_new_daily_high && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-[#ccff00] text-black">
                        NEW PERSONAL BEST!
                      </span>
                    )}
                  </div>
                </div>

                {/* Unlocked Reward Banner if #1 */}
                {gameResult.reward_unlocked && (
                  <div className="w-full my-4 p-4 rounded-2xl bg-gradient-to-r from-[#ccff00]/20 to-emerald-400/20 border border-[#ccff00] flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#ccff00] text-black flex items-center justify-center font-bold">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-heading font-bold text-sm text-neutral-950 dark:text-white">
                          {gameResult.reward_unlocked.title}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          {gameResult.reward_unlocked.description}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Metrics Breakdown */}
                <div className="w-full grid grid-cols-3 gap-2 my-4 text-left">
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
                    <span className="text-[9px] font-mono uppercase text-neutral-500 block">
                      Max Multiplier
                    </span>
                    <span className="text-base font-mono font-bold text-neutral-950 dark:text-white">
                      x{gameResult.max_combo}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
                    <span className="text-[9px] font-mono uppercase text-neutral-500 block">
                      Fast Reflexes
                    </span>
                    <span className="text-base font-mono font-bold text-[#ccff00]">
                      +{gameResult.fast_reaction_bonus} pts
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
                    <span className="text-[9px] font-mono uppercase text-neutral-500 block">
                      Hits / Misses
                    </span>
                    <span className="text-base font-mono font-bold text-neutral-950 dark:text-white">
                      {gameResult.hits_count} / {gameResult.misses_count}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
                  <button
                    onClick={handleStartGame}
                    className="w-full py-3.5 px-6 rounded-full bg-neutral-950 text-white dark:bg-[#ccff00] dark:text-black font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-transform active:scale-95 cursor-pointer shadow-md"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>PLAY AGAIN</span>
                  </button>

                  <button
                    onClick={() => setView('leaderboard')}
                    className="w-full py-3.5 px-6 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white border border-neutral-200 dark:border-white/10 font-heading font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-200 dark:hover:bg-white/20 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Trophy className="w-4 h-4 text-[#ccff00]" />
                    <span>VIEW LEADERBOARD</span>
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* VIEW: LEADERBOARD */}
      {view === 'leaderboard' && (
        <Leaderboard
          onPlayClick={handleStartGame}
          onViewRewards={() => setView('rewards')}
        />
      )}

      {/* VIEW: REWARDS */}
      {view === 'rewards' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                DAILY VICTOR REWARDS
              </span>
              <h3 className="font-heading font-black text-2xl text-neutral-950 dark:text-white uppercase tracking-tight">
                Zen Perks & Coupons
              </h3>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              {rewards.filter((r) => r.claimed_at).length} of {rewards.length} Claimed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                onClaimSuccess={(updated) => {
                  setRewards((prev) =>
                    prev.map((r) => (r.id === updated.id ? updated : r))
                  );
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* VIEW: USER PROFILE */}
      {view === 'profile' && profile && (
        <div className="flex flex-col gap-6">
          <UserProfileCard profile={profile} todayRank={gameResult?.today_rank} />

          <div className="flex justify-center mt-2">
            <button
              onClick={handleStartGame}
              className="py-3 px-8 rounded-full bg-[#ccff00] text-black font-heading font-black text-sm uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-transform active:scale-95 cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START TODAY'S SESSION</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
