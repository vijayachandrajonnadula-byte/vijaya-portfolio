import { useEffect, type RefObject } from 'react';
import type { MotionValue } from 'framer-motion';

/** Shared helpers for the S2a arts (1 to 4): scroll progress is written straight to CSS custom properties, never to React state. */
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const outCubic = (t: number) => 1 - (1 - t) ** 3;
export const outBack = (t: number) => { const c = 1.9; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; };
/** 0 -> 1 -> 0 over [0,1] */
export const tri = (t: number) => Math.sin(Math.PI * clamp01(t));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Vars = Record<string, number | string>;

/** Calls `fn(progress)` and writes the returned CSS variables on `ref` while `active` (one write on mount/inactive so the resting state is right). */
export function useScrub(ref: RefObject<HTMLElement>, mv: MotionValue<number>, active: boolean, fn: (p: number) => Vars) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const paint = (p: number) => {
      const v = fn(p);
      for (const k in v) { const x = v[k]!; el.style.setProperty(k, typeof x === 'number' ? String(Math.round(x * 1000) / 1000) : x); }
    };
    paint(mv.get());
    if (!active) return;
    return mv.on('change', paint);
  }, [ref, mv, active, fn]);
}

/** Seeded random so the art is identical on every load. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
