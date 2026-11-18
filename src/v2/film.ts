import { useSyncExternalStore } from 'react';
import { isCalm } from '../lib/calm';
import { beats } from './data/brief';

/**
 * The film's tiny store: which beat is current, and native scrolling to a beat.
 * Nothing here intercepts the wheel or touch. `goTo` calls window.scrollTo, the same thing a link does.
 */
let current = 0;
const subs = new Set<() => void>();
const emit = () => subs.forEach(f => f());

export const useCurrentBeat = () => useSyncExternalStore(cb => { subs.add(cb); return () => { subs.delete(cb); }; }, () => current, () => 0);
export const getCurrentBeat = () => current;

const sectionOf = (i: number) => document.getElementById(beats[i]!.id);

/** Reads which beat covers the middle of the viewport. */
export function measure(): number {
  const mid = window.scrollY + window.innerHeight * 0.5;
  let idx = 0;
  for (let i = 0; i < beats.length; i++) {
    const el = sectionOf(i);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (top <= mid) idx = i;
  }
  if (idx !== current) { current = idx; emit(); }
  return idx;
}

/** Scroll position that shows beat i with its text mostly lit (half-way through the pinned part). */
export function landing(i: number): number {
  const el = sectionOf(i);
  if (!el) return 0;
  const top = el.getBoundingClientRect().top + window.scrollY;
  if (i === 0) return 0;
  const vh = window.innerHeight;
  const pinned = Math.max(0, el.offsetHeight - vh);
  return Math.min(top + pinned * 0.5, document.documentElement.scrollHeight - vh);
}

export function goTo(i: number, opts: { instant?: boolean } = {}) {
  const n = Math.max(0, Math.min(beats.length - 1, i));
  window.scrollTo({ top: landing(n), behavior: opts.instant || isCalm() ? 'auto' : 'smooth' });
}

export function next() { goTo(measure() + 1); }
export function prev() {
  const i = measure();
  // deep inside a beat: first go back to its landing point; then to the one before
  if (window.scrollY > landing(i) + 60) goTo(i); else goTo(i - 1);
}
