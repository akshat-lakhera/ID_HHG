import { useEffect, useRef } from 'react';
import type { BadgeData } from '../types';

const KEY = 'hhg-pass-v1';

type Persisted = Pick<
  BadgeData,
  'name' | 'role' | 'team' | 'badgeId' | 'scale' | 'offsetX' | 'offsetY' | 'rotation' | 'filter'
>;

const DEFAULTS: Persisted = {
  name: 'AKSHAT LAKHERA',
  role: 'RESIDENT',
  team: 'TEAM DOOM',
  badgeId: 'HHG-8829-X',
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
  filter: 'none',
};

export function loadPersistedBadge(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      ...DEFAULTS,
      ...parsed,
      name: String(parsed.name ?? DEFAULTS.name).slice(0, 36),
      role: String(parsed.role ?? DEFAULTS.role).slice(0, 22),
      team: String(parsed.team ?? DEFAULTS.team).slice(0, 22),
      badgeId: String(parsed.badgeId ?? DEFAULTS.badgeId).slice(0, 18),
      scale: clamp(Number(parsed.scale) || 1, 0.5, 3),
      offsetX: clamp(Number(parsed.offsetX) || 0, -250, 250),
      offsetY: clamp(Number(parsed.offsetY) || 0, -250, 250),
      rotation: clamp(Number(parsed.rotation) || 0, -180, 180),
      filter: ['none', 'vivid', 'cyber', 'vintage', 'bw'].includes(parsed.filter as string)
        ? (parsed.filter as Persisted['filter'])
        : 'none',
    };
  } catch {
    return DEFAULTS;
  }
}

export function useBadgePersistence(badgeData: BadgeData) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const payload: Persisted = {
      name: badgeData.name,
      role: badgeData.role,
      team: badgeData.team,
      badgeId: badgeData.badgeId,
      scale: badgeData.scale,
      offsetX: badgeData.offsetX,
      offsetY: badgeData.offsetY,
      rotation: badgeData.rotation,
      filter: badgeData.filter,
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(payload));
    } catch {
      /* quota / private mode */
    }
  }, [
    badgeData.name,
    badgeData.role,
    badgeData.team,
    badgeData.badgeId,
    badgeData.scale,
    badgeData.offsetX,
    badgeData.offsetY,
    badgeData.rotation,
    badgeData.filter,
  ]);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
