import { useEffect } from 'react';

declare global {
  interface Window {
    /** Legacy: Lenis was removed (no scroll hijacking). Always undefined; App.tsx still checks it. */
    __lenis?: { scrollTo: (target: number | HTMLElement, options?: Record<string, unknown>) => void };
  }
}

/**
 * Native scrolling only. This used to run Lenis (inertial scroll); the brief forbids scroll
 * hijacking, so it now only enables CSS smooth scrolling for anchor links, and only when the
 * visitor has not asked for reduced motion. Renders nothing.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      document.documentElement.style.scrollBehavior = mq.matches ? 'auto' : 'smooth';
    };
    apply();
    mq.addEventListener('change', apply);
    return () => {
      mq.removeEventListener('change', apply);
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
  return null;
}
