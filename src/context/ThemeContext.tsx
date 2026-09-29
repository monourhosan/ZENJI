import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type ThemeMode = 'night' | 'day';

export interface ThemeContextType {
  theme: ThemeMode;
  secondsRemaining: number;
  cycleDuration: number;
  progressPercent: number;
  isAutoCycling: boolean;
  isTransitioning: boolean;
  transitionType: 'dawn' | 'dusk' | null;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  toggleAutoCycle: () => void;
  resetTimer: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const CYCLE_DURATION = 27; // 27 seconds requirement
const THEME_STORAGE_KEY = 'zenji_theme_mode';
const AUTOCYCLE_STORAGE_KEY = 'zenji_autocycle_active';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with night as specified ("UI should be go to night to day every 27 seconds")
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'night' || saved === 'day') return saved;
    } catch {
      // fallback
    }
    return 'night';
  });

  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTOCYCLE_STORAGE_KEY);
      if (saved !== null) return saved === 'true';
    } catch {
      // fallback
    }
    return true;
  });

  const [secondsRemaining, setSecondsRemaining] = useState<number>(CYCLE_DURATION);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionType, setTransitionType] = useState<'dawn' | 'dusk' | null>(null);

  const transitionTimeoutRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(Date.now() + CYCLE_DURATION * 1000);

  // Apply theme to DOM
  const applyThemeToDOM = useCallback((newTheme: ThemeMode, withTransition = true) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', newTheme);
    root.classList.toggle('dark', newTheme === 'night');
    root.classList.toggle('theme-night', newTheme === 'night');
    root.classList.toggle('theme-day', newTheme === 'day');

    // Update meta theme-color for mobile chrome/safari
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newTheme === 'night' ? '#080808' : '#fbfbfb');
    }

    if (withTransition) {
      root.classList.add('zenji-transitioning');
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = window.setTimeout(() => {
        root.classList.remove('zenji-transitioning');
        setIsTransitioning(false);
        setTransitionType(null);
      }, 3200);
    }
  }, []);

  const triggerThemeSwitch = useCallback((nextTheme: ThemeMode) => {
    const type = nextTheme === 'day' ? 'dawn' : 'dusk';
    setIsTransitioning(true);
    setTransitionType(type);
    setThemeState(nextTheme);
    applyThemeToDOM(nextTheme, true);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // ignore
    }

    // Reset countdown target
    targetTimeRef.current = Date.now() + CYCLE_DURATION * 1000;
    setSecondsRemaining(CYCLE_DURATION);
  }, [applyThemeToDOM]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'night' ? 'day' : 'night';
    triggerThemeSwitch(next);
  }, [theme, triggerThemeSwitch]);

  const setTheme = useCallback((mode: ThemeMode) => {
    if (mode === theme) return;
    triggerThemeSwitch(mode);
  }, [theme, triggerThemeSwitch]);

  const toggleAutoCycle = useCallback(() => {
    setIsAutoCycling((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(AUTOCYCLE_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      if (next) {
        targetTimeRef.current = Date.now() + CYCLE_DURATION * 1000;
        setSecondsRemaining(CYCLE_DURATION);
      }
      return next;
    });
  }, []);

  const resetTimer = useCallback(() => {
    targetTimeRef.current = Date.now() + CYCLE_DURATION * 1000;
    setSecondsRemaining(CYCLE_DURATION);
  }, []);

  // Initialize DOM theme on mount
  useEffect(() => {
    applyThemeToDOM(theme, false);
    targetTimeRef.current = Date.now() + CYCLE_DURATION * 1000;
  }, [applyThemeToDOM, theme]);

  // Main 27-second cycle interval ticker
  useEffect(() => {
    if (!isAutoCycling) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diffMs = targetTimeRef.current - now;
      const secs = Math.max(0, Math.ceil(diffMs / 1000));
      setSecondsRemaining(secs);

      if (diffMs <= 0) {
        // Time to flip!
        setThemeState((currentTheme) => {
          const next = currentTheme === 'night' ? 'day' : 'night';
          const type = next === 'day' ? 'dawn' : 'dusk';
          setIsTransitioning(true);
          setTransitionType(type);
          applyThemeToDOM(next, true);

          try {
            localStorage.setItem(THEME_STORAGE_KEY, next);
          } catch {
            // ignore
          }

          targetTimeRef.current = Date.now() + CYCLE_DURATION * 1000;
          return next;
        });
        setSecondsRemaining(CYCLE_DURATION);
      }
    }, 250); // Frequent poll for buttery progress animation

    return () => clearInterval(interval);
  }, [isAutoCycling, applyThemeToDOM]);

  const progressPercent = Math.min(
    100,
    Math.max(0, ((CYCLE_DURATION - secondsRemaining) / CYCLE_DURATION) * 100)
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        secondsRemaining,
        cycleDuration: CYCLE_DURATION,
        progressPercent,
        isAutoCycling,
        isTransitioning,
        transitionType,
        toggleTheme,
        setTheme,
        toggleAutoCycle,
        resetTimer,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
