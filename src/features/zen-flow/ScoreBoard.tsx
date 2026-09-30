import React from 'react';
import { Sparkles, Zap, Volume2, VolumeX } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  comboHits: number;
  multiplier: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  comboHits,
  multiplier,
  isMuted,
  onToggleMute,
}) => {
  const currentStep = comboHits % 5;
  const progressPercent = multiplier >= 4 ? 100 : (currentStep / 5) * 100;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Score Card */}
      <div className="flex items-center gap-2.5 bg-white/80 dark:bg-[#141418]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-white/10 shadow-xs transition-colors">
        <div className="w-7 h-7 rounded-full bg-neutral-950 dark:bg-[#ccff00] text-white dark:text-black flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 leading-tight">
            Zen Score
          </span>
          <span className="text-base font-bold font-mono tracking-tight text-neutral-950 dark:text-white leading-none">
            {score.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Combo Multiplier Card */}
      <div
        className={`flex items-center gap-2.5 bg-white/80 dark:bg-[#141418]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border transition-all ${
          multiplier > 1
            ? 'border-[#ccff00] shadow-xs'
            : 'border-neutral-200 dark:border-white/10'
        }`}
      >
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
            multiplier > 1
              ? 'bg-[#ccff00] text-black scale-105 zen-combo-glow'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 leading-tight">
              Combo
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                multiplier > 1 ? 'text-black dark:text-[#ccff00]' : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              x{multiplier}
            </span>
          </div>

          {/* Mini 5-dot progress bar towards next combo */}
          <div className="w-14 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mt-0.5">
            <div
              className="h-full bg-[#ccff00] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Audio Mute / Unmute Button */}
      <button
        onClick={onToggleMute}
        className="w-8 h-8 rounded-full bg-white/80 dark:bg-[#141418]/85 backdrop-blur-md border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        aria-label={isMuted ? 'Unmute Zen Sounds' : 'Mute Zen Sounds'}
        title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#ccff00]" />}
      </button>
    </div>
  );
};
