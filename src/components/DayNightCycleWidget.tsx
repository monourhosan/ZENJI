import React, { useState } from 'react';
import { Moon, Sun, Play, Pause, RefreshCw, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const DayNightCycleWidget: React.FC = () => {
  const {
    theme,
    secondsRemaining,
    progressPercent,
    isAutoCycling,
    isTransitioning,
    toggleTheme,
    toggleAutoCycle,
    resetTimer,
  } = useTheme();

  const [isHovered, setIsHovered] = useState(false);

  // SVG circle geometry for timer
  const size = 32;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <aside
      aria-label="Zenji 27-second Day and Night Cycle Controller"
      className="fixed bottom-6 left-6 z-40 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`group relative flex items-center gap-3 p-1.5 pr-4 rounded-full transition-all duration-700 ease-out shadow-xl border ${
          theme === 'night'
            ? 'bg-[#121214]/90 text-white border-white/15 hover:border-[#ccff00]/60 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'bg-white/95 text-neutral-900 border-neutral-200/90 hover:border-neutral-400 shadow-[0_10px_25px_rgba(0,0,0,0.08)]'
        } backdrop-blur-md`}
      >
        {/* Toggle Theme Action Button with Live Progress Ring */}
        <button
          onClick={toggleTheme}
          className="relative flex items-center justify-center w-8 h-8 rounded-full focus:outline-none cursor-pointer"
          title={`Click to switch to ${theme === 'night' ? 'Day' : 'Night'} Mode now`}
          aria-label={`Current: ${theme} mode. Click to toggle.`}
        >
          {/* Animated SVG Progress Ring */}
          <svg className="absolute inset-0 w-8 h-8 -rotate-90 pointer-events-none" viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className={theme === 'night' ? 'text-white/15' : 'text-neutral-200'}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme === 'night' ? '#ccff00' : '#18181b'}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-[stroke-dashoffset] duration-300 ease-linear"
            />
          </svg>

          {/* Center Celestial Icon */}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-700 ${
              isTransitioning ? 'scale-110 rotate-180' : 'group-hover:rotate-12'
            }`}
          >
            {theme === 'night' ? (
              <Moon className="w-3.5 h-3.5 text-[#ccff00] fill-[#ccff00]/20" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20" />
            )}
          </div>
        </button>

        {/* Cycle Telemetry Details */}
        <div className="flex flex-col cursor-pointer" onClick={toggleTheme}>
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase font-semibold">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAutoCycling ? 'bg-emerald-500 animate-ping' : 'bg-neutral-400'
              }`}
            />
            <span>
              {theme === 'night' ? 'NIGHT' : 'DAY'}{' '}
              <span className={theme === 'night' ? 'text-[#ccff00]' : 'text-neutral-500'}>
                {secondsRemaining}s
              </span>
            </span>
            {isTransitioning && (
              <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-spin" />
            )}
          </div>
          <span className="font-mono text-[9px] text-neutral-400 tracking-tight">
            {theme === 'night' ? 'SHIBUYA 02:00' : 'TOKYO 14:00'} // 27s CYCLE
          </span>
        </div>

        {/* Expandable Controls on Hover */}
        <div
          className={`flex items-center gap-1 border-l pl-2 transition-all duration-300 ${
            theme === 'night' ? 'border-white/10' : 'border-neutral-200'
          } ${isHovered ? 'opacity-100 max-w-[80px]' : 'opacity-60 max-w-[80px]'}`}
        >
          {/* Pause / Resume Button */}
          <button
            onClick={toggleAutoCycle}
            className={`p-1 rounded-md transition-colors ${
              theme === 'night'
                ? 'hover:bg-white/10 text-neutral-400 hover:text-white'
                : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'
            }`}
            title={isAutoCycling ? 'Pause 27s Auto-Cycle' : 'Resume 27s Auto-Cycle'}
            aria-label={isAutoCycling ? 'Pause auto cycle' : 'Resume auto cycle'}
          >
            {isAutoCycling ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>

          {/* Reset Cycle Timer */}
          <button
            onClick={resetTimer}
            className={`p-1 rounded-md transition-colors ${
              theme === 'night'
                ? 'hover:bg-white/10 text-neutral-400 hover:text-white'
                : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'
            }`}
            title="Reset 27s Cycle"
            aria-label="Reset timer"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
