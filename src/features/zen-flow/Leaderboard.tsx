import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Sparkles, Clock, Calendar, ShieldCheck } from 'lucide-react';
import type { ZenLeaderboardResponse } from '../../types/zenFlow';
import { zenFlowService } from '../../services/zenFlowService';

interface LeaderboardProps {
  onPlayClick?: () => void;
  onViewRewards?: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onPlayClick, onViewRewards }) => {
  const [data, setData] = useState<ZenLeaderboardResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [loading, setLoading] = useState(true);
  const [secondsUntilMidnight, setSecondsUntilMidnight] = useState<number>(0);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await zenFlowService.getLeaderboard();
      setData(res);
      setSecondsUntilMidnight(res.time_until_reset_seconds);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();

    // 1-second countdown timer for daily reset at 00:00
    const interval = setInterval(() => {
      setSecondsUntilMidnight(zenFlowService.getSecondsUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format seconds to HH:MM:SS
  const formatTimeRemaining = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading || !data) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3 text-neutral-400">
        <div className="w-8 h-8 rounded-full border-2 border-[#ccff00] border-t-transparent animate-spin" />
        <span className="text-xs font-mono tracking-widest uppercase">Consulting Zen Masters...</span>
      </div>
    );
  }

  const topThree = data.entries.slice(0, 3);
  const restEntries = data.entries.slice(3);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Daily Reset Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs font-mono uppercase tracking-[0.2em]">
            <Crown className="w-4 h-4 text-[#ccff00]" />
            <span>Daily Competition</span>
          </div>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-neutral-950 dark:text-white uppercase tracking-tight">
            Today's Zen Masters
          </h3>
        </div>

        {/* Midnight Reset Clock */}
        <div className="flex items-center gap-2.5 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-neutral-500 dark:text-[#ccff00]" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Resets in</span>
            <span className="font-bold text-neutral-900 dark:text-white leading-none">
              {formatTimeRemaining(secondsUntilMidnight)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Today vs History */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'today'
              ? 'bg-neutral-950 text-white dark:bg-[#ccff00] dark:text-black font-bold shadow-xs'
              : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Today's Board ({data.date})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-neutral-950 text-white dark:bg-[#ccff00] dark:text-black font-bold shadow-xs'
              : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Historical Winners
        </button>
      </div>

      {activeTab === 'today' ? (
        <>
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topThree.map((entry, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1;

              return (
                <div
                  key={entry.user_id}
                  className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isFirst
                      ? 'bg-gradient-to-b from-[#ccff00]/15 to-transparent border-[#ccff00]/60 dark:bg-gradient-to-b dark:from-[#ccff00]/10 dark:to-transparent dark:border-[#ccff00]/50 shadow-md md:-translate-y-1'
                      : 'bg-white/80 dark:bg-[#121216]/80 border-neutral-200 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    {/* Rank Badge */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs ${
                        isFirst
                          ? 'bg-[#ccff00] text-black shadow-xs'
                          : isSecond
                          ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200'
                      }`}
                    >
                      #{entry.rank}
                    </div>

                    {isFirst && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#ccff00] text-black">
                        <Sparkles className="w-3 h-3" />
                        Zen Master
                      </span>
                    )}
                  </div>

                  <div className="my-4 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-neutral-900 text-white dark:bg-neutral-800 flex items-center justify-center font-mono font-bold text-sm">
                      {entry.avatar_initials}
                    </div>
                    <div>
                      <div className="font-heading font-bold text-base text-neutral-950 dark:text-white flex items-center gap-1.5">
                        <span>{entry.username}</span>
                        {entry.has_zen_master_badge && (
                          <span title="Zen Master Badge Holder">
                            <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
                        ZEN LEVEL {entry.zen_level}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-white/5 flex items-baseline justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Score
                    </span>
                    <span className="text-xl font-mono font-black text-neutral-950 dark:text-white">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ranks 4 to Top 10 Table */}
          {restEntries.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/60 dark:bg-[#121216]/60 backdrop-blur-md overflow-hidden">
              <div className="px-5 py-3 border-b border-neutral-100 dark:border-white/5 text-[10px] font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400 grid grid-cols-12 gap-2">
                <span className="col-span-2 sm:col-span-1">Rank</span>
                <span className="col-span-7 sm:col-span-8">Player</span>
                <span className="col-span-3 text-right">Score</span>
              </div>

              <div className="divide-y divide-neutral-100 dark:divide-white/5">
                {restEntries.map((entry) => (
                  <div
                    key={entry.user_id}
                    className={`px-5 py-3.5 grid grid-cols-12 gap-2 items-center text-xs transition-colors hover:bg-neutral-50 dark:hover:bg-white/5 ${
                      entry.user_id === data.user_entry?.user_id
                        ? 'bg-[#ccff00]/10 dark:bg-[#ccff00]/5'
                        : ''
                    }`}
                  >
                    <span className="col-span-2 sm:col-span-1 font-mono font-bold text-neutral-500">
                      #{entry.rank}
                    </span>
                    <div className="col-span-7 sm:col-span-8 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[10px] flex items-center justify-center font-bold">
                        {entry.avatar_initials}
                      </div>
                      <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {entry.username}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400 hidden sm:inline">
                        LVL {entry.zen_level}
                      </span>
                    </div>
                    <span className="col-span-3 text-right font-mono font-bold text-neutral-950 dark:text-white">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User's Current Daily Standing Banner */}
          {data.user_entry && (
            <div className="p-4 rounded-2xl bg-neutral-950 text-white dark:bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ccff00] text-black font-mono font-black text-sm flex items-center justify-center">
                  #{data.user_entry.rank}
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                    Your Daily Standing
                  </div>
                  <div className="font-heading font-bold text-sm sm:text-base">
                    {data.user_entry.score > 0
                      ? `${data.user_entry.score.toLocaleString()} Zen Points`
                      : 'No games recorded today'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onViewRewards && (
                  <button
                    onClick={onViewRewards}
                    className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Rewards
                  </button>
                )}
                {onPlayClick && (
                  <button
                    onClick={onPlayClick}
                    className="px-4 py-2 rounded-full bg-[#ccff00] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#b8e600] transition-transform active:scale-95 cursor-pointer shadow-sm"
                  >
                    Improve Score
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Historical Winners Tab */
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-300/30 text-neutral-900 dark:text-white flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Daily Champion Hall of Fame:</span> Every midnight (00:00), the #1 player is crowned as the Zen Master and awarded exclusive streetwear rewards.
            </div>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-white/5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121216]/70 overflow-hidden">
            {data.past_winners.map((winner) => (
              <div
                key={winner.date}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#ccff00] text-black font-mono font-black text-xs flex items-center justify-center">
                    #1
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-neutral-950 dark:text-white text-base">
                        {winner.username}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                        {winner.reward_title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{winner.date} Victor</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block">
                      Winning Score
                    </span>
                    <span className="text-lg font-mono font-black text-[#ccff00] dark:text-[#ccff00]">
                      {winner.score.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
