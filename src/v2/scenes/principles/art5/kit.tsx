import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import type { MotionValue } from 'framer-motion';
import { useBeat } from '../../../components/Beat';
import '../../../styles/s2b-kit.css';

/**
 * Shared by the S2b arts (5, 6, 7): a fixed-size design stage that scales uniformly to the art slot,
 * and a scrub hook that only listens while the beat is on screen and never re-renders React.
 */
export function Fit({ W, H, children, className = '' }: { W: number; H: number; children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      el.style.setProperty('--k', String(Math.min(r.width / W, r.height / H, 1.7)));
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [W, H]);
  return (
    <div ref={box} className="s2b-fit">
      <div className={`s2b-fit__in ${className}`} style={{ width: W, height: H }}>{children}</div>
    </div>
  );
}

/** Calls `fn(value)` on every change of `mv` while the beat is active. `fn` may change every render. */
export function useScrub(mv: MotionValue<number>, fn: (v: number) => void) {
  const { active } = useBeat();
  const f = useRef(fn);
  f.current = fn;
  useEffect(() => {
    if (!active) return;
    f.current(mv.get());
    return mv.on('change', v => f.current(v));
  }, [active, mv]);
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** 0..1 across [a, b]. */
export const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
