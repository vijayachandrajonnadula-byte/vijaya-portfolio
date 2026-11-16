import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import './../../styles/story.css';
import './../../styles/parts.css';
import ChapterLabel from './ChapterLabel';
import { askHref } from '../../data/knowledge';
import { CapacitorSym, FuseSym, LedSym, ResistorSym, SwitchSym, ToleranceSym } from './parts/Symbols';
import { DebounceDemo, DefaultsDemo, FeedbackDemo, ForgivingDemo, SmoothDemo, UndoDemo } from './parts/Demos';

type Part = { id: string; part: string; sym: ReactNode; circuit: string; ui: string; pattern: string; demo: ReactNode };

const PARTS: Part[] = [
  {
    id: 'pullup', part: 'Pull-up resistor', sym: <ResistorSym />, pattern: 'Sensible defaults',
    circuit: 'A pull-up resistor gives a pin a calm starting value, so it never floats at random.',
    ui: 'Pre-select the safest, most common choice, so most people can simply continue.',
    demo: <DefaultsDemo />,
  },
  {
    id: 'fuse', part: 'Fuse', sym: <FuseSym />, pattern: 'Undo over “Are you sure?”',
    circuit: 'A fuse fails on purpose, so one mistake costs one cheap part, not the whole board.',
    ui: 'Let people act quickly and take it back, instead of questioning every click.',
    demo: <UndoDemo />,
  },
  {
    id: 'debounce', part: 'Switch debounce', sym: <SwitchSym />, pattern: 'Prevent double submits',
    circuit: 'A switch contact bounces, sending several pulses for one press. Debouncing counts it once.',
    ui: 'One tap should be one payment. Ignore repeats while the first is still working.',
    demo: <DebounceDemo />,
  },
  {
    id: 'lowpass', part: 'Low-pass filter', sym: <CapacitorSym />, pattern: 'Signal over noise',
    circuit: 'A capacitor soaks up fast jitter and lets the slow, real change through.',
    ui: 'In a dashboard, lead with the trend. Keep the raw detail one step away.',
    demo: <SmoothDemo />,
  },
  {
    id: 'led', part: 'Status LED', sym: <LedSym />, pattern: 'Immediate feedback',
    circuit: 'A status LED tells you, the moment it happens, that the board really is on.',
    ui: 'Answer every action right away: pressed, working, done.',
    demo: <FeedbackDemo />,
  },
  {
    id: 'tolerance', part: 'Tolerance (±5%)', sym: <ToleranceSym />, pattern: 'Forgiving inputs',
    circuit: 'No part is exact. A 100 ohm resistor may read 95 to 105, and the design still works.',
    ui: 'Accept the messy ways people type, then show how you read it.',
    demo: <ForgivingDemo />,
  },
];

/** Chapter 02. Electronics ideas next to the interface patterns they became, each with a tiny live demo. */
export default function PartsToPatterns() {
  const reduced = !!useReducedMotion();
  const [i, setI] = useState(0);
  const [vertical, setVertical] = useState(true);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = PARTS[i]!;

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(min-width: 860px)');
    const u = () => setVertical(mq.matches);
    u(); mq.addEventListener('change', u);
    return () => mq.removeEventListener('change', u);
  }, []);

  const go = (n: number, focus = true) => {
    const k = (n + PARTS.length) % PARTS.length;
    setI(k);
    if (focus) tabs.current[k]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    else if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
    else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(PARTS.length - 1); }
  };

  return (
    <section className="signal parts" id="signal" aria-labelledby="signal-h">
      <div className="signal__in">
        <ChapterLabel n="02" name="translate" />
        <h2 id="signal-h" className="signal__h">Electronics taught me UX.</h2>
        <p className="signal__sub">Same ideas, different material. Pick a part and see the interface pattern it became.</p>
        <div className="parts__card">
          <div className="parts__tabs" role="tablist" aria-label="Electronics parts" aria-orientation={vertical ? 'vertical' : 'horizontal'} onKeyDown={onKey}>
            {PARTS.map((x, k) => (
              <button
                key={x.id} ref={el => { tabs.current[k] = el; }} type="button" role="tab" id={`parts-tab-${x.id}`}
                aria-selected={k === i} aria-controls="parts-panel" tabIndex={k === i ? 0 : -1}
                className="parts__tab" onClick={() => setI(k)}
              >
                <span className="parts__sym">{x.sym}</span>
                <span className="parts__name">{x.part}</span>
              </button>
            ))}
          </div>
          <div className="parts__panel" id="parts-panel" role="tabpanel" aria-labelledby={`parts-tab-${p.id}`} tabIndex={-1}>
            <motion.div
              key={p.id} className="parts__body"
              initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 30 }}
            >
              <div className="parts__cols">
                <div className="parts__col">
                  <p className="parts__k">In the circuit</p>
                  <p className="parts__t">{p.circuit}</p>
                </div>
                <div className="parts__col parts__col--ui">
                  <p className="parts__k">In the interface <span className="parts__chip">{p.pattern}</span></p>
                  <p className="parts__t">{p.ui}</p>
                </div>
              </div>
              <div className="parts__demo">
                <p className="parts__k">Try it</p>
                {p.demo}
              </div>
            </motion.div>
          </div>
        </div>
        <p className="parts__foot">
          Analogies, not claims: this is how I think, not a history of any one project.{' '}
          <Link to={askHref('j-carried')}>Want the longer version? Ask: what carried over from electronics?</Link>
        </p>
      </div>
    </section>
  );
}
