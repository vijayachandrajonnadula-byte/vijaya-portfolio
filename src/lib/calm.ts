import { useSyncExternalStore } from 'react';

/**
 * Calm mode is the operating system's "reduce motion" setting and nothing else. There is no switch in the page:
 * a control that changes almost nothing you can see breaks "visibility of system status", and the OS already
 * owns this preference (WCAG 2.3.3 Animation from Interactions).
 *
 * Effects: `html[data-calm='on']` (see src/styles/a11y.css), <MotionConfig reducedMotion='always'> in App.tsx,
 * and every script that needs to skip decorative motion calls isCalm() / useCalm().
 * The old `vj-calm` localStorage key is removed on load so nobody is stuck with a choice they can no longer change.
 */
const QUERY = '(prefers-reduced-motion: reduce)';
const EVENT = 'vj-calm';

/** Does the operating system ask for reduced motion? */
export function osReduces(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches;
}

/** Is calm mode on right now? Only the system setting counts. */
export function isCalm(): boolean {
  return osReduces();
}

function paint() {
  if (typeof document !== 'undefined') document.documentElement.dataset.calm = isCalm() ? 'on' : 'off';
}

function subscribe(cb: () => void) {
  const mq = typeof window.matchMedia === 'function' ? window.matchMedia(QUERY) : null;
  const onChange = () => { paint(); window.dispatchEvent(new Event(EVENT)); cb(); };
  mq?.addEventListener('change', onChange);
  return () => mq?.removeEventListener('change', onChange);
}

/** Reactive calm flag: true while the system asks for reduced motion. */
export function useCalm(): boolean {
  return useSyncExternalStore(subscribe, isCalm, () => false);
}

/** Pointer polish (tilt, follow, magnet) runs only with a mouse-like pointer and only when motion is allowed. */
export function canPlay(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !isCalm();
}

// set the attribute before the first render so there is no flash of motion; drop the retired stored choice
try { localStorage.removeItem('vj-calm'); } catch { /* storage blocked: nothing to clean */ }
paint();
