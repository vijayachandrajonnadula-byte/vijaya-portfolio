import { useEffect, useRef } from 'react';

/**
 * After about four quiet seconds at the very top, a short trace stub draws down below the hero once (900ms), then stays.
 * Any scroll, key or pointer press counts as activity and restarts the wait. Under reduced motion the stub is simply there.
 */
export default function ScrollCue() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('is-static'); return; }
    let t = 0, done = false;
    const arm = () => {
      clearTimeout(t);
      if (done || window.scrollY > 8) return;
      t = window.setTimeout(() => { if (window.scrollY <= 8 && !document.hidden) { done = true; el.classList.add('is-draw'); } }, 4000);
    };
    const act = () => { arm(); };
    arm();
    window.addEventListener('scroll', act, { passive: true });
    window.addEventListener('keydown', act);
    window.addEventListener('pointerdown', act);
    return () => { clearTimeout(t); window.removeEventListener('scroll', act); window.removeEventListener('keydown', act); window.removeEventListener('pointerdown', act); };
  }, []);
  return <span ref={ref} className="scue" aria-hidden="true"><i /><b /></span>;
}
