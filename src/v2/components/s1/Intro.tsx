import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { animate, useMotionValue, type MotionValue } from 'framer-motion';

/**
 * The opening, about 1.2 seconds. The page loads as an ink screen with one glowing dot (the full stop of "VIJAY."), an iris grows out
 * of that dot and uncovers the title, which assembles itself. It never blocks: the real text is in the DOM from the first paint, the
 * overlay ignores pointer events, and ANY key, pointer, wheel or scroll skips it (everything jumps to its final state).
 *
 * Time-based on purpose, but only once, only at the top of the page, and never in reduced-motion (the film is not mounted then).
 */
export interface Intro {
  /** 'play' while the sequence runs, 'done' after it ended or was skipped. Also set as data-intro on the scene root. */
  phase: 'play' | 'done';
  /** 0..1, drives the three prompt lines (the paced word light). */
  lit: MotionValue<number>;
  /** Clay waves once, then rests. */
  waving: boolean;
  /** true when the visitor skipped it (the scene root gets data-skip) */
  skipped: boolean;
  /** viewport position of the period dot (null until measured) */
  dot: { x: number; y: number; d: number } | null;
  measure: () => void;
}

const TOTAL = 1250; // ms until the sequence is over (iris + letters + md); prompts and the wave run a little longer

export function useIntro(dotRef: RefObject<HTMLElement>): Intro {
  const [phase, setPhase] = useState<'play' | 'done'>(() => (typeof window !== 'undefined' && window.scrollY < 40 ? 'play' : 'done'));
  const [waving, setWaving] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [dot, setDot] = useState<Intro['dot']>(null);
  const lit = useMotionValue(phase === 'play' ? 0 : 1);
  const ctl = useRef<{ stop: () => void } | null>(null);

  const measure = useCallback(() => {
    const el = dotRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width) return;
    setDot(d => (d && Math.abs(d.x - (r.left + r.width / 2)) < 0.5 && Math.abs(d.y - (r.top + r.height / 2)) < 0.5 ? d : { x: r.left + r.width / 2, y: r.top + r.height / 2, d: r.width }));
  }, [dotRef]);

  useLayoutEffect(() => { measure(); }, [measure]);
  useEffect(() => {
    window.addEventListener('resize', measure);
    (document.fonts?.ready ?? Promise.resolve()).then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  // run the timeline
  useEffect(() => {
    const timers: number[] = [];
    if (phase === 'play') {
      ctl.current = animate(lit, 1, { duration: 1.5, delay: 0.75, ease: 'linear' });
      timers.push(window.setTimeout(() => setPhase('done'), TOTAL));
    }
    timers.push(window.setTimeout(() => setWaving(true), phase === 'play' ? 1350 : 700));
    timers.push(window.setTimeout(() => setWaving(false), phase === 'play' ? 3500 : 2700));
    return () => { timers.forEach(clearTimeout); ctl.current?.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // skip on any interaction
  useEffect(() => {
    if (phase !== 'play') return;
    const skip = () => { ctl.current?.stop(); lit.set(1); setSkipped(true); setPhase('done'); };
    const ev = ['keydown', 'pointerdown', 'wheel', 'touchstart', 'scroll'] as const;
    ev.forEach(e => window.addEventListener(e, skip, { passive: true, once: true }));
    return () => ev.forEach(e => window.removeEventListener(e, skip));
  }, [phase, lit]);

  return { phase, lit, waving, skipped, dot, measure };
}

/** The ink screen with a hole that grows from the dot. Portalled to <body>, so no transform on any ancestor can trap it. */
export function Iris({ intro }: { intro: Intro }) {
  const { phase, dot } = intro;
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (phase !== 'done') return;
    const t = window.setTimeout(() => setGone(true), 420);
    return () => window.clearTimeout(t);
  }, [phase]);
  if (gone || typeof document === 'undefined') return null;
  const x = dot ? dot.x : window.innerWidth * 0.5;
  const y = dot ? dot.y : window.innerHeight * 0.5;
  const size = Math.max(14, dot?.d ?? 24);
  // the hole must end just past the farthest corner, so the whole motion is spent on screen
  const end = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 48;
  return createPortal(
    <div className="v2-iris" data-phase={phase} aria-hidden="true" style={{ ['--ix' as string]: `${x}px`, ['--iy' as string]: `${y}px`, ['--ir-end' as string]: `${Math.round(end)}px` }}>
      <span className="v2-iris__dot" style={{ left: x, top: y, width: size, height: size }} />
    </div>,
    document.body,
  );
}
