import { useEffect } from 'react';
import { useCalm } from '../../lib/calm';

declare global {
  interface Window {
    /** Legacy: Lenis was removed (no scroll hijacking). Always undefined; App.tsx still checks it. */
    __lenis?: { scrollTo: (target: number | HTMLElement, options?: Record<string, unknown>) => void };
  }
}

/**
 * Native scrolling only. This used to run Lenis (inertial scroll); the brief forbids scroll
 * hijacking, so it now only enables CSS smooth scrolling for anchor links, and only when calm mode
 * is off (calm follows the visitor's reduced-motion setting unless they chose otherwise). Renders nothing.
 */
export default function SmoothScroll() {
  const calm = useCalm();
  useEffect(() => {
    document.documentElement.style.scrollBehavior = calm ? 'auto' : 'smooth';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, [calm]);
  return null;
}
