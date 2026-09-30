import React from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  remainingSeconds: number;
  totalSeconds?: number;
}

export const Timer: React.FC<TimerProps> = ({
  remainingSeconds,
  totalSeconds = 60,
}) => {
  const percentage = Math.max(0, Math.min(100, (remainingSeconds / totalSeconds) * 100));
  const isUrgent = remainingSeconds <= 10;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-3 bg-white/80 dark:bg-[#141418]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-white/10 shadow-xs transition-colors">
      {/* Circular breathing progress ring */}
      <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-neutral-200 dark:stroke-neutral-800"
            strokeWidth="3"
            fill="transparent"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            className={`transition-all duration-1000 ease-linear ${
              isUrgent ? 'stroke-amber-400' : 'stroke-[#ccff00]'
            }`}
            strokeWidth="3.2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <TimerIcon
          className={`w-3.5 h-3.5 absolute ${
            isUrgent ? 'text-amber-500 animate-pulse' : 'text-neutral-700 dark:text-[#ccff00]'
          }`}
        />
      </div>

      <div className="flex flex-col pr-1">
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 leading-tight">
          Meditation
        </span>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-base font-bold font-mono tracking-tight leading-none ${
              isUrgent ? 'text-amber-500' : 'text-neutral-950 dark:text-white'
            }`}
          >
            {remainingSeconds}
          </span>
          <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">sec</span>
        </div>
      </div>
    </div>
  );
};
