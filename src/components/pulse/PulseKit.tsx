import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Character from '../studio/Character';
import type { Slot } from '../../data/pulseImages';
import SectionSheet from '../case-study/SectionSheet';
import Img from '../case-study/Img';
import { useIndicator } from '../case-study/useIndicator';
import { isJumping } from '../case-study/jump';
import '../../styles/case-v2.css';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- icons (small, stroked, 20px) ---------- */
const paths: Record<string, string> = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4',
  layers: 'm12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5',
  unlock: 'M7 11V8a5 5 0 0 1 9.5-2M5 11h14v9H5z',
  check: 'm5 12 4.5 4.5L19 7',
  cross: 'M6 6l12 12M18 6 6 18',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  code: 'm8 8-4 4 4 4m8-8 4 4-4 4M14 5l-4 14',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  book: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Zm0 13a3 3 0 0 1 3-3h11',
  spark: 'M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M18 6l-2.5 2.5m-7 7L6 18',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  flag: 'M5 21V4m0 0h12l-2 4 2 4H5',
};
export function Icon({ name }: { name: keyof typeof paths | string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] ?? paths.spark} />
    </svg>
  );
}

/* ---------- motion primitives ---------- */

/** Fade and rise into place when scrolled into view. Static for reduced motion. */
export function Rise({ children, delay = 0, y = 28, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: { opacity: 0, y },
        show: () => ({ opacity: 1, y: 0, transition: isJumping() ? { duration: 0 } : { duration: 0.9, ease: EASE, delay } }),
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A heading whose words rise out of a mask, one after another. The wrapper is what gets observed:
 * a word sitting below its own mask has no visible area, so it could never report that it is in view.
 */
function Words({ text, immediate = false, delay = 0 }: { text: string; immediate?: boolean; delay?: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.15 });
  const go = immediate || seen || reduced;
  const instant = !immediate && isJumping();
  const words = text.split(' ');
  return (
    <span ref={ref} className="pk-words">
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="pk-w">
            <motion.span
              className="pk-w__in"
              initial={reduced ? false : { y: '112%' }}
              animate={go ? { y: 0 } : { y: '112%' }}
              transition={instant ? { duration: 0 } : { duration: 0.85, ease: EASE, delay: delay + i * 0.045 }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  );
}

/** A number that counts up once when it appears. Strings with no leading number pass through. */
function Num({ value }: { value: string | number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduced = useReducedMotion();
  const str = String(value).replace(/,/g, '');
  const m = /^(-?\d+(?:\.\d+)?)(.*)$/.exec(str);
  const target = m ? parseFloat(m[1]!) : NaN;
  const suffix = m ? m[2] ?? '' : '';
  const [shown, setShown] = useState(reduced || Number.isNaN(target) ? String(value) : '0');

  useEffect(() => {
    if (!inView || reduced || Number.isNaN(target)) return;
    const c = animate(0, target, { duration: 1.4, ease: EASE, onUpdate: v => setShown(Math.round(v).toLocaleString('en-US') + suffix) });
    return () => c.stop();
  }, [inView, reduced, target, suffix]);

  return <b ref={ref} style={{ fontWeight: 'inherit' }}>{inView || reduced || Number.isNaN(target) ? (Number.isNaN(target) ? value : shown) : `0${suffix}`}</b>;
}

/* ---------- hero ---------- */
export function CaseHero({ kicker, minutes, title, summary, evidence, meta, actions }: {
  kicker: string; minutes: number | null; title: string; summary: string; evidence?: ReactNode; meta: { k: string; v: string }[]; actions?: ReactNode;
}) {
  const reduced = useReducedMotion();
  const fade = (d: number) => ({ initial: reduced ? false : { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
  return (
    <header className="pk-hero">
      <div className="pk-hero__in">
        <motion.div className="pk-hero__char" initial={reduced ? false : { y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 12, delay: 0.5 }}>
          <Character size={130} pose="hold" prop="blocks" track />
        </motion.div>
        <motion.p className="pk-hero__top" {...fade(0.05)}><span>{kicker}</span>{minutes && <span>{minutes} min read</span>}</motion.p>
        <h1><Words text={title} immediate delay={0.15} /></h1>
        <motion.p className="pk-hero__sum" {...fade(0.55)}>{summary}</motion.p>
        {evidence && <motion.p className="pk-hero__evidence" {...fade(0.6)}>{evidence}</motion.p>}
        {actions && <motion.div className="pk-hero__actions" {...fade(0.7)}>{actions}</motion.div>}
        <dl className="pk-hero__meta">
          {meta.map((m, i) => (
            <motion.div key={m.k} {...fade(0.85 + i * 0.08)}><dt>{m.k}</dt><dd>{m.v}</dd></motion.div>
          ))}
        </dl>
      </div>
    </header>
  );
}

/* ---------- shell: sticky side column + content ---------- */
export interface Section { id: string; label: string }

export function CaseShell({ side, sections, children }: { side: { k: string; v: string }[]; sections: Section[]; children: ReactNode }) {
  const [active, setActive] = useState(sections[0]?.id);
  const lock = useRef(false);
  const list = useRef<HTMLOListElement>(null);
  useIndicator(list, 'a.is-active', active);

  // keep the active entry visible when the list is taller than the screen
  useEffect(() => {
    const a = list.current?.querySelector<HTMLElement>('a.is-active');
    const box = a?.closest('aside');
    if (a && box) { const r = a.getBoundingClientRect(), b = box.getBoundingClientRect(); if (r.top < b.top + 8 || r.bottom > b.bottom - 8) a.scrollIntoView({ block: 'nearest' }); }
  }, [active]);

  useEffect(() => {
    const els = sections.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(entries => {
      if (lock.current) return;
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActive(vis.target.id);
    }, { rootMargin: '-18% 0px -70% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, [sections]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id); lock.current = true; window.setTimeout(() => { lock.current = false; }, 900);
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -110 }); else el.scrollIntoView({ behavior: 'smooth' });
  };

  const skip = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector<HTMLElement>('.pk-main');
    if (!target) return;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  return (
    <div className="pk-shell">
      <aside className="pk-side" aria-label="Case study details">
        <dl>
          {side.map(m => <div key={m.k}><dt>{m.k}</dt><dd>{m.v}</dd></div>)}
        </dl>
        <nav aria-label="On this page">
          <a href="#main" className="cs-skip" onClick={skip}>Skip to case study</a>
          <p className="pk-side__h">On this page</p>
          <ol ref={list}>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} onClick={go(s.id)} onFocus={e => e.currentTarget.scrollIntoView({ block: 'nearest' })} className={active === s.id ? 'is-active' : undefined} aria-current={active === s.id ? 'true' : undefined}>
                  <span>{String(i + 1).padStart(2, '0')}</span>{s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
      <div className="pk-main">{children}</div>
      <SectionSheet sections={sections} variant="pk" />
    </div>
  );
}

/* ---------- section wrapper: number, drawing rule, label, word-by-word heading ---------- */
export function Sec({ id, n, label, title, intro, children }: { id: string; n: number; label: string; title: string; intro?: ReactNode; children?: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <section className="pk-sec" id={id} aria-labelledby={`${id}-h`}>
      <p className="pk-sec__eyebrow">
        <b>{String(n).padStart(2, '0')}</b>
        <motion.i
          aria-hidden="true"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        {label}
      </p>
      <h2 id={`${id}-h`}><Words text={title} /></h2>
      {intro && <Rise className="pk-sec__intro" delay={0.1}>{intro}</Rise>}
      {children}
    </section>
  );
}

/* ---------- blocks ---------- */
export function Cards3({ cards }: { cards: { icon: string; title: string; items: string[] }[] }) {
  return (
    <div className="pk-cards">
      {cards.map((c, i) => (
        <Rise key={c.title} delay={i * 0.12} className="pk-cards__cell">
          <article className="pk-card">
            <span className="pk-card__ic"><Icon name={c.icon} /></span>
            <span className="pk-card__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3>{c.title}</h3>
            <ul>{c.items.map((t, j) => <li key={t}><b>{String(j + 1).padStart(2, '0')}</b>{t}</li>)}</ul>
          </article>
        </Rise>
      ))}
    </div>
  );
}

export function Grid4({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="pk-grid4">
      {items.map((it, i) => (
        <Rise key={it.title} delay={(i % 4) * 0.08}>
          <div className="pk-grid4__item">
            <span className="pk-grid4__n">{String(i + 1).padStart(2, '0')}</span>
            <h3>{it.title}</h3>
            <p>{it.body}</p>
          </div>
        </Rise>
      ))}
    </div>
  );
}

/** A numbered track. The orange line fills as you scroll, and each dot lights when you reach it. */
function useTrack(ref: React.RefObject<HTMLElement>) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.5'] });
  return useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
}

function TrackItem({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const on = useInView(ref, { margin: '0px 0px -42% 0px' });
  const [seen, setSeen] = useState(false);
  useEffect(() => { if (on) setSeen(true); }, [on]);
  const reduced = useReducedMotion();
  return (
    <motion.li
      ref={ref}
      className={`${className}${seen || reduced ? ' is-on' : ''}`}
      initial={reduced ? false : { opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      {children}
    </motion.li>
  );
}

export function Timeline({ steps }: { steps: { title: string; body: string; tag?: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const h = useTrack(ref);
  return (
    <div className="pk-time" ref={ref}>
      <motion.span className="pk-track" style={{ height: h }} aria-hidden="true" />
      <ol className="pk-list">
      {steps.map((s, i) => (
        <TrackItem key={s.title} className="pk-time__item">
          <span className="pk-time__dot">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <h3>{s.title}</h3>
            {s.body && <p>{s.body}</p>}
            {s.tag && <p className="pk-time__tag">{s.tag}</p>}
          </div>
        </TrackItem>
      ))}
      </ol>
    </div>
  );
}

export function Layered({ rows }: { rows: { step: string; kicker: string; title: string; body: string; hands?: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const h = useTrack(ref);
  return (
    <div className="pk-layers" ref={ref}>
      <motion.span className="pk-track" style={{ height: h }} aria-hidden="true" />
      <ol className="pk-list">
      {rows.map(r => (
        <TrackItem key={r.title} className="pk-layers__item">
          <span className="pk-layers__n">{r.step}</span>
          <div>
            <p className="pk-layers__k">{r.kicker}</p>
            <h3>{r.title}</h3>
            <p>{r.body}</p>
            {r.hands && <p className="pk-layers__hands">{r.hands}</p>}
          </div>
        </TrackItem>
      ))}
      </ol>
    </div>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="pk-dots">
      {items.map((t, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
        >
          {t}
        </motion.li>
      ))}
    </ul>
  );
}

/** A framed image. It settles into place and drifts slightly against the scroll. */
export function Panel({ slot, tone = 'soft' }: { slot: Slot; tone?: 'soft' | 'plain' }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [18, -18]);
  return (
    <motion.figure
      ref={ref}
      className={`pk-panel pk-panel--${tone}`}
      initial={reduced ? false : { opacity: 0, scale: 0.965 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, ease: EASE }}
    >
      <div className="pk-panel__frame">
        {slot.src
          ? <motion.div style={{ y }}><Img src={slot.src} alt={slot.alt} loading="lazy" zoom /></motion.div>
          : <div className="pk-ph" role="img" aria-label={`Image to come: ${slot.alt}`}><span>Image to come</span><small>{slot.hint}</small></div>}
      </div>
      <figcaption>{slot.caption}</figcaption>
    </motion.figure>
  );
}

export function Stats({ items }: { items: { v: string | number; l: string }[] }) {
  return (
    <dl className="pk-stats">
      {items.map((s, i) => (
        <motion.div
          key={s.l}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
        >
          <dd><Num value={s.v} /></dd><dt>{s.l}</dt>
        </motion.div>
      ))}
    </dl>
  );
}
