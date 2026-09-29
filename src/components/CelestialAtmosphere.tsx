import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const CelestialAtmosphere: React.FC = () => {
  const { isTransitioning, transitionType, theme } = useTheme();

  return (
    <>
      {/* Ambient background sky glow that gently shifts with the active theme */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-[2800ms] ease-in-out ${
          theme === 'night'
            ? 'opacity-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))]'
            : 'opacity-60 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(251,191,36,0.12),rgba(255,255,255,0))]'
        }`}
        aria-hidden="true"
      />

      {/* Dynamic 2.8s Celestial Transition Sweep (Dawn or Dusk wave) */}
      <div
        className={`fixed inset-0 pointer-events-none z-40 transition-all duration-[2600ms] ease-out ${
          isTransitioning ? 'opacity-100 backdrop-blur-[2px]' : 'opacity-0 backdrop-blur-0'
        }`}
        aria-hidden="true"
      >
        {transitionType === 'dawn' && (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-200/25 via-rose-100/20 to-transparent animate-pulse" />
        )}
        {transitionType === 'dusk' && (
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-purple-900/20 to-transparent animate-pulse" />
        )}
      </div>
    </>
  );
};
