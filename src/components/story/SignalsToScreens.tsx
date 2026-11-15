import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { journey, trackMeta, type Track } from '../../data/journey';
import '../../styles/journey.css';

const LANE: Record<Track, number> = { study: 10, learning: 32, practice: 54 };
const DOT_Y = 22;

/**
 * "From signals to screens": the true timeline as a signal chain on three tracks (study, learning, practice).
 * One node is open at a time. A small pulse travels the rails to the node you open. Arrow keys, Home/End and
 * the buttons all move along it, and an ordered list carries the order for screen readers. The fiction layer is
 * off by default; when on, it adds playful lines between nodes, each labelled as fiction.
 */
export default function SignalsToScreens() {
  const reduced = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [fiction, setFiction] = useState(false);
  const [pulse, setPulse] = useState({ x: LANE[journey[0]!.track], y: DOT_Y });
  const [ping, setPing] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const moved = useRef(false);
  const last = journey.length - 1;

  const measure = useCallback(() => {
    const li = items.current[active];
    if (!li) return;
    setPulse({ x: LANE[journey[active]!.track], y: li.offsetTop + DOT_Y });
  }, [active]);

  useLayoutEffect(() => { measure(); }, [measure, fiction]);
  useEffect(() => {
    const el = list.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const go = (i: number, focus = false) => {
    const n = Math.max(0, Math.min(last, i));
    moved.current = true;
    setActive(n);
    setPing(p => p + 1);
    window.requestAnimationFrame(() => {
      const b = btns.current[n];
      if (focus) b?.focus({ preventScroll: true });
      b?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
    });
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); go(i + 1, true); }
    else if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); go(i - 1, true); }
    else if (k === 'Home') { e.preventDefault(); go(0, true); }
    else if (k === 'End') { e.preventDefault(); go(last, true); }
  };

  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 120, damping: 20, mass: 0.8 };

  return (
    <section id="story" className="jny" aria-labelledby="jny-h">
      <header className="jny__head">
        <p className="jny__kicker">The long answer</p>
        <h2 id="jny-h" className="jny__title">From signals to screens</h2>
        <p className="jny__lede">The true timeline, drawn as a signal chain. Study, learning and practice ran on three tracks at once, so they are drawn side by side. Every node comes from my resume.</p>
        <div className="jny__bar">
          <div className="jny__step" role="group" aria-label="Move along the chain">
            <button type="button" onClick={() => go(active - 1, true)} disabled={active === 0} aria-label="Previous node">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
            </button>
            <span className="jny__count" aria-live="polite">Node {active + 1} of {journey.length}</span>
            <button type="button" onClick={() => go(active + 1, true)} disabled={active === last} aria-label="Next node">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </button>
          </div>
          <button type="button" role="switch" aria-checked={fiction} className="jny__switch" onClick={() => setFiction(f => !f)}>
            <span className="jny__sw" aria-hidden="true"><i /></span>
            <span>Fiction layer <em>{fiction ? 'on' : 'off'}</em></span>
          </button>
        </div>
        <ul className="jny__legend" aria-label="Tracks">
          {(Object.keys(trackMeta) as Track[]).map(t => (
            <li key={t} data-track={t}><i aria-hidden="true" />{trackMeta[t].label}<span> · {trackMeta[t].hint}</span></li>
          ))}
        </ul>
        {fiction && <p className="jny__fnote"><strong>Fiction layer.</strong> The playful lines between nodes are invented and labelled. The nodes themselves stay true.</p>}
      </header>

      <div className="jny__chain">
        <div className="jny__rails" aria-hidden="true">
          {(Object.keys(LANE) as Track[]).map(t => <i key={t} data-track={t} style={{ left: LANE[t] }} />)}
          <motion.span className="jny__pulse" initial={false} animate={{ x: pulse.x, y: pulse.y }} transition={spring}>
            {!reduced && <motion.b key={ping} initial={{ scale: 0.5, opacity: 0.7 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />}
          </motion.span>
        </div>

        <ol className="jny__list" ref={list}>
          {journey.map((n, i) => {
            const open = i === active;
            return (
              <li key={n.id} ref={el => { items.current[i] = el; }} className="jny__node" data-track={n.track} data-open={open || undefined} data-done={i < active || undefined}>
                <i className={`jny__dot${n.course ? ' is-course' : ''}`} aria-hidden="true" style={{ '--lx': `${LANE[n.track]}px` } as CSSProperties} />
                <button
                  ref={el => { btns.current[i] = el; }}
                  id={`jny-b-${n.id}`}
                  type="button"
                  className="jny__btn"
                  aria-expanded={open}
                  aria-controls={`jny-c-${n.id}`}
                  aria-current={open ? 'step' : undefined}
                  onClick={() => go(i)}
                  onKeyDown={e => onKey(e, i)}
                >
                  <span className="jny__year">{n.year}</span>
                  <span className="jny__name">{n.title}</span>
                  <span className="jny__tag">{n.course ? 'Course' : trackMeta[n.track].label}<span className="sr-only"> track</span></span>
                </button>
                {open && (
                  <motion.div
                    id={`jny-c-${n.id}`}
                    role="group"
                    aria-labelledby={`jny-b-${n.id}`}
                    className="jny__card"
                    initial={reduced ? false : { opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26 }}
                  >
                    <p className="jny__when">{n.when}</p>
                    <p className="jny__doing"><b>What I was doing.</b> {n.doing}</p>
                    <p className="jny__carried">{n.carried}</p>
                    <p className="jny__wink">{n.wink}</p>
                  </motion.div>
                )}
                {fiction && i < last && (
                  <p className="jny__fiction"><span className="jny__ftag">Fiction</span><span className="sr-only">: </span>{n.fiction}</p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
