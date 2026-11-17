import { createContext, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion';
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

  const state = useMemo<BeatState>(() => ({ progress, enter, read, active, length: L, chapter: colour }), [progress, enter, read, active, L, colour]);
  return (
    <section ref={ref} id={id} className="v2-beat" data-chapter={colour} data-active={active ? 'true' : 'false'} aria-label={label}
      style={{ height: `calc(${L} * 100svh)` }}>
      <Stage prev={prev ?? colour} enter={enter}>
        <Ctx.Provider value={state}>{children}</Ctx.Provider>
      </Stage>
    </section>
  );
}

/** The sticky stage: the chapter colour arrives as a circular wash that grows out of the previous colour. */
function Stage({ prev, enter, children }: { prev: ChapterKey; enter: MotionValue<number>; children: ReactNode }) {
  const clip = useTransform(enter, [0, 0.92], ['circle(0% at 50% 78%)', 'circle(150% at 50% 78%)'], { clamp: true });
  const fade = useTransform(enter, [0.5, 0.95], [0, 1]);
  return (
    <div className="v2-stage" style={{ '--prev': `var(--bg-${prev})` } as CSSProperties}>
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
  const x = useTransform(mv, range, [0, d[0]!]);
  const y = useTransform(mv, range, [0, d[1]!]);
  const r = useTransform(mv, range, [0, rotate]);
  const opacity = useTransform(mv, [range[0], range[1] - (range[1] - range[0]) * 0.1], [1, 0]);
  return <motion.div className={className} style={{ x, y, rotate: r, opacity }}>{children}</motion.div>;
}
