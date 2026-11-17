import { useMemo, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { beats } from '../data/brief';
import { useDialog } from './useDialog';

/** Seeded so the tilt of each card is stable between renders and between visits. */
function seeded(i: number): number {
  let t = (i + 1) * 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const FILE_CARD = 'the-file';

/**
 * The index: a spread of collectible cards, one per beat plus "the file". Opens with a circular clip-path reveal that
 * grows out of the index pill. Click or Enter on a card jumps to that beat (native scroll); "the file" opens the raw .md.
 */
export default function IndexOverlay({ open, origin, onClose, onPick, calm = false }: {
  open: boolean; origin: { x: number; y: number }; onClose: () => void; onPick: (id: string) => void; calm?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const cards = useMemo(() => [
    ...beats.map((b, i) => ({ id: b.id, mark: b.mark, title: b.heading === 'VIJAY.md' ? 'the top' : b.heading, line: b.cardLine, chapter: b.chapter, a: (seeded(i) - 0.5) * 7 })),
    { id: FILE_CARD, mark: '.md', title: 'the file', line: 'the raw markdown. copy it, download it.', chapter: 'ink', a: (seeded(40) - 0.5) * 7 },
  ], []);
  useDialog(open, box, onClose);

  const R = Math.hypot(Math.max(origin.x, window.innerWidth - origin.x), Math.max(origin.y, window.innerHeight - origin.y)) + 40;
  const from = `circle(0px at ${origin.x}px ${origin.y}px)`;
  const to = `circle(${R}px at ${origin.x}px ${origin.y}px)`;

  const onKeys = (e: KeyboardEvent<HTMLElement>) => {
    const list = Array.from(box.current?.querySelectorAll<HTMLElement>('.v2-card') ?? []);
    const at = list.indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    let to = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (at + 1) % list.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (at - 1 + list.length) % list.length;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = list.length - 1;
    if (to >= 0) { e.preventDefault(); list[to]!.focus(); }
  };
  // fine pointers: the card tilts toward the pointer a little
  const tilt = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== 'mouse' || calm) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--rx', `${(((e.clientY - r.top) / r.height) - 0.5) * -8}deg`);
    e.currentTarget.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width) - 0.5) * 10}deg`);
  };
  const untilt = (e: PointerEvent<HTMLButtonElement>) => { e.currentTarget.style.removeProperty('--rx'); e.currentTarget.style.removeProperty('--ry'); };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div ref={box} className="v2-index" role="dialog" aria-modal="true" aria-label="Index of VIJAY.md"
          initial={calm ? false : { clipPath: from }} animate={{ clipPath: to }} exit={calm ? { opacity: 0, transition: { duration: 0 } } : { clipPath: from }}
          transition={{ duration: calm ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }} onKeyDown={onKeys}>
          <div className="v2-index__in">
            <p className="v2-index__h"><span aria-hidden="true">## </span>index <span className="v2-index__sub">pick a card. it jumps there.</span></p>
            <ol className="v2-cards">
              {cards.map((c, i) => (
                <li key={c.id}>
                  <button type="button" className="v2-card" data-chapter={c.chapter} style={{ '--a': `${c.a.toFixed(2)}deg`, '--i': i } as CSSProperties}
                    onClick={() => onPick(c.id)} onPointerMove={tilt} onPointerLeave={untilt}>
                    <span className="v2-card__mark" aria-hidden="true">{c.mark}</span>
                    <span className="v2-card__t">{c.title}</span>
                    <span className="v2-card__l">{c.line}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
