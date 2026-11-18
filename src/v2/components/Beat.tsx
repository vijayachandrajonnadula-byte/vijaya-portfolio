import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import type { ChapterKey } from '../data/brief';

/**
 * The scene framework. Native scroll, no hijacking.
 *
 *   <Beat id colour prev length>        a section `length` viewports tall with ONE sticky 100svh stage inside
 *     scene content ...                 reads useBeat(): { progress, enter, read, active, length }
 *
 * Three motion values, all 0..1, all driven by plain scroll position:
 *   enter     the beat arriving (its top travels from the bottom of the screen to the top). The chapter colour washes in here.
 *   read      a paced reading ramp: starts while the stage is still arriving, ends just before it leaves. <Words> follows this.
 *   progress  the pinned part only (0 when the stage sticks, 1 when it lets go). Use it for things that happen WHILE pinned.
 */
export interface BeatState {
  progress: MotionValue<number>;
  enter: MotionValue<number>;
  read: MotionValue<number>;
  /** 0..1 over the last stretch of the pinned part: the scene is being taken apart (additive; used by Clay's hop and the art slot). */
  leave: MotionValue<number>;
  /** True while the beat is on screen (cheap to read; changes twice per pass). */
  active: boolean;
  length: number;
  chapter: ChapterKey;
}

const Ctx = createContext<BeatState | null>(null);
export function useBeat(): BeatState {
  const c = useContext(Ctx);
  if (!c) throw new Error('useBeat() must be used inside <Beat>');
  return c;
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function Beat({ id, colour, prev, length, children, label }: {
  id: string; colour: ChapterKey; prev?: ChapterKey; length: number; children: ReactNode; label?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  // 0 when the section's top is at the bottom of the screen, 1 when its bottom is at the top of the screen
  const { scrollYProgress: through } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const L = length;
  const progress = useTransform(through, v => clamp((v * (L + 1) - 1) / (L - 1)));
  const enter = useTransform(through, v => clamp(v * (L + 1)));
  const read = useTransform(through, v => clamp((v * (L + 1) - 0.5) / (L - 0.6)));
  useMotionValueEvent(through, 'change', v => { const on = v > 0.001 && v < 0.999; setActive(a => (a === on ? a : on)); });
  useEffect(() => { const v = through.get(); setActive(v > 0.001 && v < 0.999); }, [through]);

  const leave = useTransform(progress, v => clamp((v - 0.8) / 0.2));

  const state = useMemo<BeatState>(() => ({ progress, enter, read, leave, active, length: L, chapter: colour }), [progress, enter, read, leave, active, L, colour]);
  return (
    <section ref={ref} id={id} className="v2-beat" data-chapter={colour} data-active={active ? 'true' : 'false'} aria-label={label}
      style={{ height: `calc(${L} * 100svh)` }}>
      <Stage prev={prev ?? colour} enter={enter} leave={leave}>
        <Ctx.Provider value={state}>{children}</Ctx.Provider>
      </Stage>
    </section>
  );
}

/**
 * The sticky stage. The chapter colour arrives as a circular wash that grows out of the DOT (the midpoint between Clay's eyes,
 * measured once per layout; falls back to the lower right). Everything is scrubbed by scroll, so it reverses with it.
 * It also publishes --leave (0..1) on the stage so art slots can be taken apart in CSS (see v2.css .v2-pa).
 */
function Stage({ prev, enter, leave, children }: { prev: ChapterKey; enter: MotionValue<number>; leave: MotionValue<number>; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const dot = useRef<{ x: number; y: number } | null>(null);
  // The stage rises from the bottom of the screen, so a circle centred on the dot (far down the stage) would only show at the very end.
  // The circle is born on the rising top edge, right above the dot, and its centre slides down to the dot as the stage lands:
  // a dome of the new colour comes up out of the floor, widens, and settles on Clay's eyes.
  const clip = useTransform(enter, v => {
    const t = clamp((v - 0.03) / 0.9);
    const r = Math.pow(t, 1.5) * 150;
    const d = dot.current;
    const cx = d ? `${d.x}px` : '80%';
    const cy = d ? `${(d.y * clamp(v)).toFixed(0)}px` : `${(70 * clamp(v)).toFixed(0)}%`;
    return `circle(${r.toFixed(2)}% at ${cx} ${cy})`;
  });
  const fade = useTransform(enter, [0.5, 0.95], [0, 1]);

  // where is the dot? (centre between Clay's eyes, in stage coordinates)
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const place = () => {
      const eye = el.querySelector('.clay__look') as SVGGElement | null;
      if (!eye) { dot.current = null; return; }
      const a = eye.getBoundingClientRect(), s = el.getBoundingClientRect();
      if (!a.width || !s.width) return;
      let x = a.left + a.width / 2 - s.left, y = a.top + a.height / 2 - s.top;
      // Clay may be mid-hop when measured: place the dot from its un-transformed layout box instead
      const cl = eye.closest('.v2-clay') as HTMLElement | null;
      if (cl && cl.offsetParent && cl.offsetParent.classList.contains('v2-scene')) {
        const cr = cl.getBoundingClientRect();
        if (cr.width) {
          x = cl.offsetLeft + ((a.left + a.width / 2 - cr.left) / cr.width) * cl.offsetWidth;
          y = cl.offsetTop + ((a.top + a.height / 2 - cr.top) / cr.height) * cl.offsetHeight;
        }
      }
      dot.current = { x, y };
    };
    place();
    const t = window.setTimeout(place, 600); // after fonts / lazy art settle
    window.addEventListener('resize', place);
    return () => { window.clearTimeout(t); window.removeEventListener('resize', place); };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = (v: number) => el.style.setProperty('--leave', v.toFixed(3));
    set(leave.get());
    return leave.on('change', set);
  }, [leave]);

  return (
    <div ref={ref} className="v2-stage" style={{ '--prev': `var(--bg-${prev})` } as CSSProperties}>
      <ChapterWash clip={clip} />
      <motion.div className="v2-stage__in" style={{ opacity: fade }}>{children}</motion.div>
    </div>
  );
}

/** A flat colour layer revealed through a growing circle. Used by the stage; scenes can reuse it for inner washes. */
export function ChapterWash({ clip, colour, className = '' }: { clip: MotionValue<string>; colour?: ChapterKey; className?: string }) {
  return <motion.div aria-hidden="true" className={`v2-wash ${className}`} data-chapter={colour} style={{ clipPath: clip, WebkitClipPath: clip }} />;
}

// ---------------------------------------------------------------- Words

/** Splits `text` into words, remembering which were wrapped in _underscores_ (emotion words, italic serif). */
export function tokenize(text: string): { w: string; em: boolean }[] {
  const out: { w: string; em: boolean }[] = [];
  let em = false;
  for (const raw of text.split(/(\s+)/)) {
    if (!raw.trim()) continue;
    let w = raw;
    if (w.startsWith('_')) { em = true; w = w.slice(1); }
    const endsEm = w.endsWith('_') || /_[.,;:!?)"]*$/.test(w);
    w = w.replace(/_/g, '');
    out.push({ w, em });
    if (endsEm) em = false;
  }
  return out;
}

/** Splits [from, to] among paragraphs by word count so they light one after the other. */
export function ranges(texts: string[], from = 0, to = 0.92): [number, number][] {
  const n = texts.map(t => tokenize(t).length);
  const total = n.reduce((a, b) => a + b, 0) || 1;
  let at = from;
  return n.map(c => { const a = at; at += ((to - from) * c) / total; return [a, at] as [number, number]; });
}

/**
 * Words light up as the reader passes. Each word has --l (0 unlit .. 1 lit); colour = mix(ink, dim, --l).
 * `dim` is a per-chapter colour that still passes AA, so even unlit text is readable (see tokens.css).
 */
export function Words({ text, source, range = [0, 0.92], as: Tag = 'p', className = '' }: {
  text: string; source?: MotionValue<number>; range?: [number, number]; as?: 'p' | 'div' | 'span' | 'li'; className?: string;
}) {
  const beat = useContext(Ctx);
  const mv = source ?? beat?.read;
  const words = useMemo(() => tokenize(text), [text]);
  const box = useRef<HTMLElement>(null);
  const [a, b] = range;
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const spans = Array.from(el.children) as HTMLElement[];
    const n = spans.length;
    let last = -1;
    const paint = (p: number) => {
      const t = clamp((p - a) / Math.max(0.0001, b - a)) * n; // words passed so far (fractional)
      const key = Math.round(t * 8);
      if (key === last) return;
      last = key;
      for (let i = 0; i < n; i++) spans[i]!.style.setProperty('--l', String(clamp(t - i)));
    };
    if (!mv) { spans.forEach(s => s.style.setProperty('--l', '1')); return; }
    paint(mv.get());
    return mv.on('change', paint);
  }, [mv, a, b, words]);
  const C = Tag as 'p';
  return (
    <C ref={box as React.RefObject<HTMLParagraphElement>} className={`v2-words ${className}`} aria-hidden="true">
      {words.map((x, i) => <span key={i} className={`v2-w${x.em ? ' v2-w--em' : ''}`}>{x.w} </span>)}
    </C>
  );
}

// ---------------------------------------------------------------- Reveal and Take

/** Fades and lifts its children in when `source` (default: read) passes `at`. */
export function Reveal({ at = 0, span = 0.12, y = 28, source, children, className = '', style }: {
  at?: number; span?: number; y?: number; source?: MotionValue<number>; children: ReactNode; className?: string; style?: CSSProperties;
}) {
  const beat = useBeat();
  const mv = source ?? beat.read;
  const opacity = useTransform(mv, [at, at + span], [0, 1]);
  const ty = useTransform(mv, [at, at + span], [y, 0]);
  return <motion.div className={className} style={{ ...style, opacity, y: ty }}>{children}</motion.div>;
}

/**
 * "Take apart": as `progress` passes `range` the children fly off (and fade), so the next scene can enter.
 * dir: where the parts go. Use several <Take> with different dirs/ranges for a staggered exit.
 */
export function Take({ range = [0.8, 1], dir = 'up', distance = 90, rotate = 0, source, children, className = '' }: {
  range?: [number, number]; dir?: 'up' | 'down' | 'left' | 'right'; distance?: number; rotate?: number; source?: MotionValue<number>;
  children: ReactNode; className?: string;
}) {
  const beat = useBeat();
  const mv = source ?? beat.progress;
  const d = dir === 'up' ? [0, -distance] : dir === 'down' ? [0, distance] : dir === 'left' ? [-distance, 0] : [distance, 0];
  // a touch of tilt by default so the pieces feel taken apart, not slid off; springs give the stagger when several Takes differ in range
  const tilt = rotate || (dir === 'left' ? -2.5 : dir === 'right' ? 2.5 : dir === 'up' ? -1.6 : 1.6);
  const spring = { stiffness: 190, damping: 27, mass: 0.7 };
  const x = useSpring(useTransform(mv, range, [0, d[0]!]), spring);
  const y = useSpring(useTransform(mv, range, [0, d[1]!]), spring);
  const r = useSpring(useTransform(mv, range, [0, tilt]), spring);
  // stay fully opaque for the first half of the exit, fade in the second (keeps text readable while it travels)
  const mid = range[0] + (range[1] - range[0]) * 0.5;
  const opacity = useTransform(mv, [mid, range[1] - (range[1] - range[0]) * 0.05], [1, 0]);
  return <motion.div className={className} style={{ x, y, rotate: r, opacity, transformOrigin: '0% 100%' }}>{children}</motion.div>;
}
