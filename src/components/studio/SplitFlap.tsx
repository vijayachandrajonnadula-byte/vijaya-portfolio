import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useCalm } from '../../lib/calm';

const COLS = 13;
const ROWS = 4;
const STEP_MS = 78;
const NOISE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ.-/+#';

/** The lines the board can show. Each row is at most 13 characters. `accent` is the row drawn in clay. */
export const BOARD_LINES: { rows: string[]; accent: number; say: string }[] = [
  { rows: ['I MAKE', 'COMPLICATED', 'SOFTWARE', 'FEEL OBVIOUS.'], accent: 3, say: 'I make complicated software feel obvious.' },
  { rows: ['AN ENGINEER', 'WHO LEARNED', 'TO DESIGN', 'FOR PEOPLE.'], accent: 3, say: 'An engineer who learned to design for people.' },
  { rows: ['FROM MESSY', 'FLOWS TO', 'WORKING', 'PROTOTYPES.'], accent: 3, say: 'From messy flows to working prototypes.' },
];

interface CellState { cur: string; prev: string; tick: number }

/**
 * One tile. It flips through a few random characters and lands on `target`, like a mechanical board:
 * the upper flap of the old character falls away while the lower flap of the new one swings down.
 */
const Cell = memo(function Cell({ target, delay, accent, calm }: { target: string; delay: number; accent: boolean; calm: boolean }) {
  const [s, setS] = useState<CellState>({ cur: ' ', prev: ' ', tick: 0 });
  const cur = useRef(' ');

  useEffect(() => {
    if (cur.current === target) return;
    if (calm) { cur.current = target; setS({ cur: target, prev: target, tick: 0 }); return; }
    const seq: string[] = [];
    const n = target === ' ' ? 1 + Math.floor(Math.random() * 3) : 3 + Math.floor(Math.random() * 5);
    for (let i = 0; i < n; i++) seq.push(NOISE[Math.floor(Math.random() * NOISE.length)]);
    seq.push(target);
    const timers: number[] = [];
    seq.forEach((ch, i) => {
      timers.push(window.setTimeout(() => {
        cur.current = ch;
        setS(p => ({ cur: ch, prev: p.cur, tick: p.tick + 1 }));
      }, delay + i * STEP_MS));
    });
    return () => timers.forEach(window.clearTimeout);
  }, [target, delay, calm]);

  const blank = s.cur === ' ';
  return (
    <span className={`sf__cell${blank ? ' is-blank' : ''}${accent ? ' is-accent' : ''}`}>
      <span className="sf__half sf__half--t"><b>{s.cur}</b></span>
      <span className="sf__half sf__half--b"><b>{s.prev}</b></span>
      {s.tick > 0 && !calm && (
        <>
          <span key={`t${s.tick}`} className="sf__flip sf__flip--t"><b>{s.prev}</b></span>
          <span key={`b${s.tick}`} className="sf__flip sf__flip--b"><b>{s.cur}</b></span>
        </>
      )}
    </span>
  );
});

/** Where each cell's target character comes from: the chosen line, row by row, left aligned. */
function targetsFor(i: number): string[] {
  const rows = BOARD_LINES[i].rows;
  const out: string[] = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) out.push(rows[r]?.[c] ?? ' ');
  return out;
}

/**
 * A split-flap board: the headline is a mechanical object. On load every tile flips through noise and lands on the
 * first line. Pressing the board flips it to the next line (three in all). Nothing flips on its own after that, so
 * there is no auto-updating content to pause (WCAG 2.2.2). Under reduced motion the lines change without flipping.
 * The tiles are decorative (aria-hidden); a polite live region announces the line in plain text.
 */
export default function SplitFlap() {
  const calm = useCalm();
  const [line, setLine] = useState(0);
  const [armed, setArmed] = useState(false);
  const [announce, setAnnounce] = useState('');
  const blank = useRef<string[]>(Array(ROWS * COLS).fill(' '));
  const targets = armed ? targetsFor(line) : blank.current;

  useEffect(() => {
    const t = window.setTimeout(() => setArmed(true), calm ? 0 : 450);
    return () => window.clearTimeout(t);
  }, [calm]);

  const next = useCallback(() => {
    const n = (line + 1) % BOARD_LINES.length;
    setLine(n);
    setAnnounce(BOARD_LINES[n].say);
  }, [line]);

  return (
    <div className="sfw">
      <button type="button" className="sf" onClick={next}>
        <span className="sfw__live">{`Flip the board to another line about me. Showing line ${line + 1} of ${BOARD_LINES.length}.`}</span>
        <span className="sf__screws" aria-hidden="true"><i /><i /><i /><i /></span>
        <span className="sf__grid" aria-hidden="true">
          {targets.map((ch, i) => {
            const r = Math.floor(i / COLS), c = i % COLS;
            return <Cell key={i} target={ch} delay={c * 34 + r * 70 + ((i * 37) % 90)} accent={r === BOARD_LINES[line].accent} calm={calm} />;
          })}
        </span>
      </button>
      <p className="sfw__hint" aria-hidden="true"><span className="sfw__key">Press</span> the board for another line</p>
      <p className="sfw__live" role="status" aria-live="polite">{announce}</p>
    </div>
  );
}
