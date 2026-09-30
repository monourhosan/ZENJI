import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { ZenObjectType } from '../../types/zenFlow';
import type { ActiveZenObject, ScorePopup, ZenParticle, ZenEnergyOrb } from './types';
import { zenAudio } from './ZenAudio';

interface GameCanvasProps {
  isPlaying: boolean;
  gameStartTime?: number;
  onHitObject: (object: ActiveZenObject, reactionMs: number, screenX: number, screenY: number) => void;
  onMissTap: (screenX: number, screenY: number) => void;
}

const OBJECT_TYPES: ZenObjectType[] = ['lotus', 'energy_circle', 'crystal', 'water_drop', 'leaf'];

// Custom SVG geometries for the 5 sacred Zen objects
const ZenObjectIcon: React.FC<{ type: ZenObjectType; size: number }> = ({ type, size }) => {
  const iconSize = Math.floor(size * 0.58);

  switch (type) {
    case 'lotus':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-pink-300 dark:text-pink-200">
          <path d="M12 3c-2 4-5 7-9 9 4 1 7 2 9 6 2-4 5-5 9-6-4-2-7-5-9-9z" fill="currentColor" fillOpacity="0.25" />
          <path d="M12 10c-1.5 2.5-3.5 4.5-6 5.5 2.5.5 4.5 1.5 6 3.5 1.5-2 3.5-3 6-3.5-2.5-1-4.5-3-6-5.5z" />
          <circle cx="12" cy="13" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'energy_circle':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#ccff00]">
          <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
          <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.3" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );
    case 'crystal':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300 dark:text-cyan-200">
          <polygon points="12 2 20 8 20 16 12 22 4 16 4 8" fill="currentColor" fillOpacity="0.22" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="4" y1="8" x2="20" y2="8" />
          <line x1="4" y1="16" x2="20" y2="16" />
        </svg>
      );
    case 'water_drop':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-sky-300 dark:text-sky-200">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" fillOpacity="0.3" />
          <circle cx="10" cy="13" r="1.5" fill="white" fillOpacity="0.6" />
        </svg>
      );
    case 'leaf':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-300 dark:text-emerald-200">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="currentColor" fillOpacity="0.25" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      );
  }
};

export const GameCanvas: React.FC<GameCanvasProps> = ({
  isPlaying,
  onHitObject,
  onMissTap,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeObjects, setActiveObjects] = useState<ActiveZenObject[]>([]);
  const objectsRef = useRef<ActiveZenObject[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);

  // Zen Energy Orb state
  const orbRef = useRef<ZenEnergyOrb>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    radius: 16,
    auraIntensity: 0.8,
  });

  // Ambient particles & animation refs
  const particlesRef = useRef<ZenParticle[]>([]);
  const wavePhaseRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const spawnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameActiveRef = useRef<boolean>(isPlaying);
  const spawnObjectRef = useRef<() => void>(() => {});

  useEffect(() => {
    objectsRef.current = activeObjects;
  }, [activeObjects]);

  useEffect(() => {
    gameActiveRef.current = isPlaying;
  }, [isPlaying]);

  // Initialize Canvas Dimensions & Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Set initial orb position to center
      if (orbRef.current.x === 0 && orbRef.current.y === 0) {
        orbRef.current.x = rect.width / 2;
        orbRef.current.y = rect.height / 2;
        orbRef.current.targetX = rect.width / 2;
        orbRef.current.targetY = rect.height / 2;
      }

      // Generate ambient mindfulness particles
      const count = Math.min(28, Math.floor(rect.width / 25));
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.5, // Slow, tranquil upward drift
        size: 1.5 + Math.random() * 2.5,
        opacity: 0.15 + Math.random() * 0.45,
        hue: 70 + Math.random() * 80, // Soft sage & lime hues
        lifespan: 120 + Math.random() * 200,
        age: Math.random() * 120,
      }));
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // 60 FPS Render Loop (Canvas Background + Ethereal Waves + Ambient Particles + Orb Trail)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Check current theme mode (Dark or Light)
      const isNight = document.documentElement.getAttribute('data-theme') === 'night';

      // 1. Draw tranquil undulating wave layers at the bottom
      wavePhaseRef.current += 0.008;
      const phase = wavePhaseRef.current;

      const waveColors = isNight
        ? ['rgba(204, 255, 0, 0.03)', 'rgba(45, 212, 191, 0.04)', 'rgba(255, 255, 255, 0.02)']
        : ['rgba(0, 0, 0, 0.02)', 'rgba(45, 212, 191, 0.05)', 'rgba(0, 0, 0, 0.03)'];

      waveColors.forEach((color, idx) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        const baseHeight = height * (0.8 + idx * 0.06);
        ctx.moveTo(0, height);
        ctx.lineTo(0, baseHeight);

        for (let x = 0; x <= width; x += 15) {
          const y = baseHeight + Math.sin(x * 0.005 + phase * (idx + 1) * 0.8) * (12 + idx * 4);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
      });

      // 2. Render and update ambient floating particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.age += 1;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const pulse = Math.sin(p.age * 0.04) * 0.15 + 0.85;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = isNight
          ? `rgba(204, 255, 0, ${p.opacity * 0.6})`
          : `rgba(45, 212, 191, ${p.opacity * 0.7})`;
        ctx.fill();
      });

      // 3. Smoothly interpolate Zen Energy Orb towards target position
      const orb = orbRef.current;
      orb.x += (orb.targetX - orb.x) * 0.12;
      orb.y += (orb.targetY - orb.y) * 0.12;

      // Draw Zen Energy Orb Aura & Core
      if (orb.x > 0 && orb.y > 0) {
        // Outer radiant glow
        const glowRadius = orb.radius * 3.5;
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, glowRadius);
        if (isNight) {
          gradient.addColorStop(0, 'rgba(204, 255, 0, 0.35)');
          gradient.addColorStop(0.5, 'rgba(45, 212, 191, 0.15)');
          gradient.addColorStop(1, 'rgba(204, 255, 0, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(45, 212, 191, 0.45)');
          gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.2)');
          gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core orb
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = isNight ? '#ccff00' : '#09090b';
        ctx.shadowColor = isNight ? '#ccff00' : 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner light ring
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = isNight ? '#ffffff' : '#ffffff';
        ctx.fill();
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Procedural Object Spawner (Respects meditation pace — calm, graceful intervals)
  const spawnObject = useCallback(() => {
    if (!gameActiveRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const id = `zen_obj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const type = OBJECT_TYPES[Math.floor(Math.random() * OBJECT_TYPES.length)];

    // Generous clickable dimensions (58px to 72px)
    const size = Math.floor(60 + Math.random() * 14);

    // Keep within safe visual bounds (12% to 88% horizontally, 16% to 84% vertically)
    const x = Math.floor(12 + Math.random() * 76);
    const y = Math.floor(16 + Math.random() * 68);

    // Stays visible for 2.6 to 3.4 seconds
    const durationMs = Math.floor(2600 + Math.random() * 800);
    const spawnTimeMs = Date.now();

    const newObj: ActiveZenObject = {
      id,
      type,
      x,
      y,
      size,
      spawnTimeMs,
      durationMs,
      isExpiring: false,
      collected: false,
      speedBonusEligible: true,
    };

    setActiveObjects((prev) => {
      // Maximum 4 objects at a time to keep experience calm, not frantic
      if (prev.length >= 4) {
        return [...prev.slice(1), newObj];
      }
      return [...prev, newObj];
    });

    // Mark as expiring 400ms before disappearing
    setTimeout(() => {
      setActiveObjects((prev) =>
        prev.map((o) => (o.id === id ? { ...o, isExpiring: true } : o))
      );
    }, durationMs - 400);

    // Disappear naturally
    setTimeout(() => {
      setActiveObjects((prev) => prev.filter((o) => o.id !== id));
    }, durationMs);

    // Schedule next spawn with gentle jitter (850ms to 1400ms)
    if (gameActiveRef.current) {
      const nextDelay = Math.floor(850 + Math.random() * 550);
      spawnTimeoutRef.current = setTimeout(() => spawnObjectRef.current(), nextDelay);
    }
  }, []);

  useEffect(() => {
    spawnObjectRef.current = spawnObject;
  }, [spawnObject]);

  // Manage Spawning Lifecycle
  useEffect(() => {
    if (isPlaying) {
      // Play start singing bowl chime
      zenAudio.playBowlChime(432);

      // First object spawns quickly (400ms)
      spawnTimeoutRef.current = setTimeout(() => spawnObjectRef.current(), 400);
    }

    return () => {
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    };
  }, [isPlaying]);

  // Handle Touch / Mouse Move to direct the Zen Energy Orb
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    orbRef.current.targetX = e.clientX - rect.left;
    orbRef.current.targetY = e.clientY - rect.top;
  };

  // Add floating score popup
  const addScorePopup = (x: number, y: number, points: number, type: 'hit' | 'fast' | 'miss') => {
    const popupId = `popup_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    const newPopup: ScorePopup = {
      id: popupId,
      x,
      y,
      points,
      type,
      createdAt: Date.now(),
    };

    setScorePopups((prev) => [...prev.slice(-6), newPopup]);

    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== popupId));
    }, 950);
  };

  // Handle Clicking / Tapping an Object
  const handleObjectTap = (e: React.MouseEvent | React.TouchEvent, obj: ActiveZenObject) => {
    e.stopPropagation();
    if (!isPlaying || obj.collected) return;

    const now = Date.now();
    const reactionMs = now - obj.spawnTimeMs;

    // Get click coordinates for popups & feedback
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;

      // Update orb position immediately to tap location
      orbRef.current.targetX = relX;
      orbRef.current.targetY = relY;

      const isFast = reactionMs <= 800;
      const pts = isFast ? 20 : 10;
      addScorePopup(relX, relY, pts, isFast ? 'fast' : 'hit');
    }

    // Play appropriate sound
    if (obj.type === 'water_drop') {
      zenAudio.playWaterDrop();
    } else if (reactionMs <= 800) {
      zenAudio.playCrystal();
    } else {
      zenAudio.playBowlChime(528);
    }

    // Mark as collected immediately to prevent double-tap
    setActiveObjects((prev) =>
      prev.map((o) => (o.id === obj.id ? { ...o, collected: true, isExpiring: true } : o))
    );

    // Callback to parent game controller
    onHitObject(obj, reactionMs, clientX, clientY);

    // Remove from active list after brief burst
    setTimeout(() => {
      setActiveObjects((prev) => prev.filter((o) => o.id !== obj.id));
    }, 200);
  };

  // Handle Background Miss Tap (tapping empty space)
  const handleBackgroundTap = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlaying) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    orbRef.current.targetX = relX;
    orbRef.current.targetY = relY;

    // Subtle gentle miss tone
    zenAudio.playMissTone();

    // Floating -5 popup
    addScorePopup(relX, relY, -5, 'miss');

    onMissTap(e.clientX, e.clientY);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handleBackgroundTap}
      className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#f8f9fa] to-[#eceef1] dark:from-[#0d0d10] dark:to-[#08080a] border border-neutral-200 dark:border-white/10 select-none touch-none cursor-crosshair shadow-inner"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Background 60 FPS HTML5 Canvas for Waves, Particles, & Zen Orb */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Floating Zen Objects Layer */}
      {activeObjects.map((obj) => {
        if (obj.collected) return null;

        return (
          <div
            key={obj.id}
            onPointerDown={(e) => handleObjectTap(e, obj)}
            className={`absolute flex items-center justify-center cursor-pointer transition-all group z-10 ${
              obj.isExpiring ? 'zen-object-disappearing' : 'zen-object-spawn zen-object-float'
            }`}
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              width: `${obj.size}px`,
              height: `${obj.size}px`,
              transform: 'translate(-50%, -50%)',
            }}
            role="button"
            aria-label={`Zen ${obj.type}`}
          >
            {/* Depletion Progress Ring (indicates time remaining before disappearing) */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 72 72"
            >
              <circle
                cx="36"
                cy="36"
                r="32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-neutral-300/40 dark:text-white/15"
              />
              <circle
                cx="36"
                cy="36"
                r="32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="201"
                strokeDashoffset="0"
                strokeLinecap="round"
                className="text-[#ccff00] transition-all"
                style={{
                  animation: `depleteRing ${obj.durationMs}ms linear forwards`,
                }}
              />
            </svg>

            {/* Glowing Backdrop & Sacred Glass Orb */}
            <div className="w-[82%] h-[82%] rounded-full bg-white/90 dark:bg-[#16161b]/90 backdrop-blur-md border border-white/60 dark:border-white/20 shadow-md flex items-center justify-center transition-transform group-hover:scale-110 active:scale-95 group-hover:border-[#ccff00]">
              <ZenObjectIcon type={obj.type} size={obj.size} />
            </div>
          </div>
        );
      })}

      {/* Floating Score Popups (+10, +20 FAST!, -5) */}
      {scorePopups.map((popup) => (
        <div
          key={popup.id}
          className="absolute pointer-events-none font-mono font-black text-sm sm:text-base zen-score-popup z-20 flex items-center gap-1"
          style={{
            left: `${popup.x}px`,
            top: `${popup.y}px`,
          }}
        >
          {popup.type === 'fast' && (
            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[#ccff00] text-black shadow-xs tracking-wider">
              FAST +20
            </span>
          )}
          {popup.type === 'hit' && (
            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs">
              +{popup.points}
            </span>
          )}
          {popup.type === 'miss' && (
            <span className="px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              -5
            </span>
          )}
        </div>
      ))}

      {/* Subtle Bottom Ambient Instruction */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">
          Guide the Zen Orb • Breathe & Tap Calmly
        </span>
      </div>
    </div>
  );
};
