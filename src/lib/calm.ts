import { useSyncExternalStore } from 'react';

/**
 * Calm mode: one switch that turns off decorative motion everywhere (WCAG 2.3.3 Animation from Interactions,
 * Selective Attention: nothing competes for the eye unless the visitor wants it).
 *
 * Default: on when the operating system asks for reduced motion, otherwise off. A choice made with the header
 * switch is remembered in localStorage (`vj-calm`) and wins over the system setting.
 * Effects: `html[data-calm='on']` (see src/styles/a11y.css), <MotionConfig reducedMotion='always'> in App.tsx,
 * and every script that used to read matchMedia('(prefers-reduced-motion: reduce)') now calls isCalm() / useCalm().
 */
const KEY = 'vj-calm';
const QUERY = '(prefers-reduced-motion: reduce)';
const EVENT = 'vj-calm';

function stored(): 'on' | 'off' | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'on' || v === 'off' ? v : null;
  } catch { return null; }
}

/** Does the operating system ask for reduced motion? */
export function osReduces(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches;
}

/** Is calm mode on right now? The stored choice wins, otherwise the system setting. */
export function isCalm(): boolean {
  if (typeof window === 'undefined') return false;
  const s = stored();
  return s ? s === 'on' : osReduces();
}

function paint() {
  if (typeof document !== 'undefined') document.documentElement.dataset.calm = isCalm() ? 'on' : 'off';
}

/** Turn calm mode on or off and remember the choice. */
export function setCalm(on: boolean) {
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* private window: it still applies for this visit */ }
  paint();
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const mq = typeof window.matchMedia === 'function' ? window.matchMedia(QUERY) : null;
  const onChange = () => { paint(); cb(); };
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onChange);
  mq?.addEventListener('change', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onChange);
    mq?.removeEventListener('change', onChange);
  };
}

/** Reactive calm flag. Use instead of framer's useReducedMotion in code that should honour the header switch. */
export function useCalm(): boolean {
  return useSyncExternalStore(subscribe, isCalm, () => false);
}

/** Pointer polish (tilt, follow, magnet) runs only with a mouse-like pointer and only when calm is off. */
export function canPlay(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !isCalm();
}

// set the attribute before the first render so there is no flash of motion
paint();
