import type { ZenObjectType } from '../../types/zenFlow';

export type GameView = 'start' | 'playing' | 'gameover' | 'leaderboard' | 'profile' | 'rewards';

export interface ActiveZenObject {
  id: string;
  type: ZenObjectType;
  x: number; // percentage (10 to 90)
  y: number; // percentage (15 to 85)
  size: number; // in pixels (e.g. 56 to 72)
  spawnTimeMs: number;
  durationMs: number;
  isExpiring: boolean;
  collected: boolean;
  speedBonusEligible: boolean;
}

export interface ScorePopup {
  id: string;
  x: number;
  y: number;
  points: number;
  type: 'hit' | 'fast' | 'miss';
  createdAt: number;
}

export interface ZenParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  lifespan: number;
  age: number;
}

export interface ZenEnergyOrb {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  auraIntensity: number;
}
