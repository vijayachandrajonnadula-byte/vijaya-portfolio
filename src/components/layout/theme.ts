import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'vj-theme';

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(KEY, t); } catch { /* private window: the theme still applies for this visit */ }
  window.dispatchEvent(new Event('vj-theme'));
}

type VTDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };

/**
 * Switch theme with a "power-on" reveal: a circle grows from the switch (View Transitions API).
 * No support: a short crossfade. Reduced motion: instant. Persistence is unchanged (applyTheme).
 */
export function applyThemeWithWipe(t: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { applyTheme(t); return; }
  const doc = document as VTDoc;
  if (typeof doc.startViewTransition === 'function' && origin) {
    const { x, y } = origin;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    let vt: ReturnType<NonNullable<VTDoc['startViewTransition']>>;
    try { vt = doc.startViewTransition(() => applyTheme(t)); } catch { applyTheme(t); return; }
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => { /* transition skipped: the theme is already applied */ });
    return;
  }
  root.classList.add('vj-xfade');
  applyTheme(t);
  window.setTimeout(() => root.classList.remove('vj-xfade'), 260);
}

/** The current theme, and a setter that also remembers the choice. */
export function useTheme() {
  const [t, setT] = useState<Theme>(currentTheme);
  useEffect(() => {
    const f = () => setT(currentTheme());
    window.addEventListener('vj-theme', f);
    return () => window.removeEventListener('vj-theme', f);
  }, []);
  return [t, applyTheme] as const;
}
