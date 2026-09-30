import React from 'react';
import { ShieldCheck, Flame, Trophy, PlayCircle, Award, Sparkles } from 'lucide-react';
import type { ZenUserGameProfile } from '../../types/zenFlow';

interface UserProfileCardProps {
  profile: ZenUserGameProfile;
  todayRank?: number;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile, todayRank }) => {
  // Level progression: each level is ~450 score points
  const pointsInCurrentLevel = profile.highest_score % 450;
  const levelProgressPct = Math.min(100, Math.floor((pointsInCurrentLevel / 450) * 100));

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 text-white dark:from-[#141418] dark:to-[#0c0c0e] border border-neutral-800 shadow-xl relative overflow-hidden">
      {/* Background ambient lighting aura */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Profile Summary */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 flex items-center justify-center font-heading font-black text-2xl text-[#ccff00] shadow-inner">
              {profile.avatar_initials}
            </div>
            {profile.zen_master_badge && (
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#ccff00] text-black flex items-center justify-center shadow-md"
                title="Zen Master Badge Awarded"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-xl sm:text-2xl tracking-tight text-white">
                {profile.username}
              </h3>
              {profile.zen_master_badge && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Zen Master
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 mt-1">
              <span className="text-[#ccff00] font-bold">
                ZEN LEVEL {profile.zen_level}
              </span>
              <span>•</span>
              <span>Mindfulness Practitioner</span>
            </div>
          </div>
        </div>

        {todayRank && (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl self-start sm:self-auto">
            <Trophy className="w-4 h-4 text-[#ccff00]" />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">
                Today's Standing
              </span>
              <span className="font-mono font-bold text-sm text-white">
                #{todayRank} Today
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 4 Core Mindfulness Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 relative z-10">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-mono uppercase tracking-wider mb-2">
            <PlayCircle className="w-3.5 h-3.5 text-neutral-400" />
            <span>Games Played</span>
          </div>
          <span className="text-2xl font-mono font-black text-white">
            {profile.games_played}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-mono uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>Highest Score</span>
          </div>
          <span className="text-2xl font-mono font-black text-[#ccff00]">
            {profile.highest_score.toLocaleString()}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-mono uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Wins</span>
          </div>
          <span className="text-2xl font-mono font-black text-white">
            {profile.daily_wins}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-mono uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-pink-400" />
            <span>Rewards</span>
          </div>
          <span className="text-2xl font-mono font-black text-white">
            {profile.unlocked_rewards_count}
          </span>
        </div>
      </div>

      {/* Zen Level Progress Meter */}
      <div className="relative z-10 pt-2">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-neutral-400">Progression to Zen Level {profile.zen_level + 1}</span>
          <span className="text-[#ccff00] font-bold">{levelProgressPct}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ccff00] to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${levelProgressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};
