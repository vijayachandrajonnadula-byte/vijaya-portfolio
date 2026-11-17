import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { beats, type ChapterKey, type Proof } from '../data/brief';
import { useCurrentBeat } from '../film';
import { useDialog } from './useDialog';
import '../styles/s3-index.css';

/** Seeded so the tilt of each card is stable between renders and between visits. */
function seeded(i: number): number {
  let t = (i + 1) * 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const FILE_CARD = 'the-file';

interface CardData { id: string; mark: string; title: string; line: string; chapter: ChapterKey; a: number; proof?: Proof }

/** Cards flip only with a mouse-like pointer and when motion is allowed. Otherwise the proof is plain text under the card. */
const canFlip = (calm: boolean) => !calm && typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * The index: a spread of collectible cards, one per beat plus "the file". Opens with a circular clip-path reveal that
 * grows out of the index pill. A card is a polaroid: a flat chapter-coloured photo with the beat's mark, the title and one line.
 * Click or Enter jumps to that beat (native scroll); "the file" opens the raw .md. On a fine pointer a card with a project
 * behind it flips on hover (and on keyboard focus of its link) to show the proof and "open case study".
 */
export default function IndexOverlay({ open, origin, onClose, onPick, calm = false }: {
  open: boolean; origin: { x: number; y: number }; onClose: () => void; onPick: (id: string) => void; calm?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const cur = useCurrentBeat();
  const flip = useMemo(() => canFlip(calm), [calm, open]); // eslint-disable-line react-hooks/exhaustive-deps
  const cards = useMemo<CardData[]>(() => [
    ...beats.map((b, i) => ({ id: b.id, mark: b.mark, title: b.heading === 'VIJAY.md' ? 'the top' : b.heading, line: b.cardLine, chapter: b.chapter, a: (seeded(i) - 0.5) * 7, proof: b.proof })),
    { id: FILE_CARD, mark: '.md', title: 'the file', line: 'the raw markdown. copy it, download it.', chapter: 'ink' as ChapterKey, a: (seeded(40) - 0.5) * 7 },
  ], []);
  const hereId = beats[cur]?.id;
  useDialog(open, box, onClose, () => {
    const el = box.current?.querySelector<HTMLElement>('.s3-card__jump[aria-current="location"]') ?? null;
    el?.scrollIntoView({ block: 'center', behavior: 'auto' });
    return el;
  });

  const R = Math.hypot(Math.max(origin.x, window.innerWidth - origin.x), Math.max(origin.y, window.innerHeight - origin.y)) + 40;
  const from = `circle(0px at ${origin.x}px ${origin.y}px)`;
  const to = `circle(${R}px at ${origin.x}px ${origin.y}px)`;

  const onKeys = (e: KeyboardEvent<HTMLElement>) => {
    const list = Array.from(box.current?.querySelectorAll<HTMLElement>('.s3-card__jump') ?? []);
    const at = list.indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    const top0 = list[0]!.getBoundingClientRect().top;
    const cols = Math.max(1, list.filter(el => Math.abs(el.getBoundingClientRect().top - top0) < 6).length);
    let n = -1;
    if (e.key === 'ArrowRight') n = (at + 1) % list.length;
    else if (e.key === 'ArrowLeft') n = (at - 1 + list.length) % list.length;
    else if (e.key === 'ArrowDown') n = at + cols < list.length ? at + cols : at;
    else if (e.key === 'ArrowUp') n = at - cols >= 0 ? at - cols : at;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = list.length - 1;
    if (n >= 0) { e.preventDefault(); list[n]!.focus(); }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div ref={box} className="s3-index" role="dialog" aria-modal="true" aria-label="Index of VIJAY.md" data-calm={calm ? 'true' : undefined}
          initial={calm ? false : { clipPath: from }} animate={{ clipPath: to }} exit={calm ? { opacity: 0, transition: { duration: 0 } } : { clipPath: from }}
          transition={{ duration: calm ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }} onKeyDown={onKeys}>
          <div className="s3-index__in">
            <p className="s3-index__h"><span aria-hidden="true">## </span>index <span className="s3-index__sub">{flip ? 'pick a card and it jumps there. hover one to see the project behind it.' : 'pick a card and it jumps there.'}</span></p>
            <ol className="s3-cards">
              {cards.map((c, i) => <Card key={c.id} c={c} i={i} here={c.id === hereId} flip={flip} calm={calm} onPick={onPick} />)}
            </ol>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Card({ c, i, here, flip, calm, onPick }: { c: CardData; i: number; here: boolean; flip: boolean; calm: boolean; onPick: (id: string) => void }) {
  const [focused, setFocused] = useState(false); // keyboard focus is on the link on the back: show the back
  const back = flip && !!c.proof;
  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || calm) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--rx', `${(((e.clientY - r.top) / r.height) - 0.5) * -9}deg`);
    e.currentTarget.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width) - 0.5) * 11}deg`);
  };
  const untilt = (e: PointerEvent<HTMLDivElement>) => { e.currentTarget.style.removeProperty('--rx'); e.currentTarget.style.removeProperty('--ry'); };
  return (
    <li className="s3-cardli" style={{ '--i': i } as CSSProperties}>
      <div className={`s3-card${back ? ' has-back' : ''}${focused ? ' is-flipped' : ''}${here ? ' is-here' : ''}`}
        style={{ '--a': `${c.a.toFixed(2)}deg` } as CSSProperties} onPointerMove={tilt} onPointerLeave={untilt}>
        <div className="s3-card__flip">
          <div className="s3-card__front">
            <button type="button" className="s3-card__jump" aria-current={here ? 'location' : undefined} onClick={() => onPick(c.id)}>
              <span className="s3-card__photo" data-chapter={c.chapter}><span className="s3-card__mark" aria-hidden="true">{c.mark}</span></span>
              <span className="s3-card__t">{c.title}</span>
              <span className="s3-card__l">{c.line}</span>
            </button>
            {here ? <span className="s3-card__here" aria-hidden="true">you are here</span> : null}
          </div>
          {back ? (
            <div className="s3-card__back" data-chapter={c.chapter}>
              {/* mouse-only duplicate of the front button (the front button is the keyboard and screen reader route) */}
              <div className="s3-card__jumpb" aria-hidden="true" onClick={() => onPick(c.id)} />
              <span className="s3-card__proofname">{c.proof!.label}</span>
              <span className="s3-card__hint" aria-hidden="true">the project behind “{c.title}”</span>
              <Link className="s3-card__case" to={c.proof!.href} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>open case study</Link>
            </div>
          ) : null}
        </div>
      </div>
      {!flip && c.proof ? <Link className="s3-card__proof" to={c.proof.href}>case study: {c.proof.label}</Link> : null}
    </li>
  );
}
