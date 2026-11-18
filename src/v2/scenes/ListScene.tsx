import { useCallback, useEffect, useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { Take, useBeat } from '../components/Beat';
import { ClayActor, MarkGlyph, Mark } from '../components/SceneBits';
import { lastEdited } from '../data/brief';
import Item, { type Line } from './list/Item';
import { span } from './principles/art5/kit';
import '../styles/s2b-list.css';
import type { SceneProps } from './types';

/**
 * Both list beats: a ruled notepad that settles out of a tilt. Items light one by one as the reader scrolls. The "stop" list is struck
 * through in ink (a wobbly stroke per wrapped line); the "do more" list gets a highlighter swipe and a tick. A pencil follows the
 * work. All of it is decoration: the real text is in the hidden article. Motion is scrubbed by scroll and gated on the beat being on screen.
 */
export default function ListScene({ beat }: SceneProps) {
  const { read, progress, active } = useBeat();
  const items = beat.items ?? [];
  const stop = beat.id.includes('stop');
  const ol = useRef<HTMLOListElement>(null);
  const geo = useRef<Line[][]>([]);
  const onLines = useCallback((i: number, l: Line[]) => { geo.current[i] = l; }, []);

  const rx = useTransform(progress, [0, 0.3], [20, 2]);
  const rz = useTransform(progress, [0, 0.3], [-2.4, -0.6]);
  const y = useTransform(progress, [0, 0.3], [46, 0]);

  useEffect(() => {
    const el = ol.current;
    if (!active || !el) return;
    const n = items.length;
    const paint = (p: number) => {
      for (let i = 0; i < n; i++) {
        const li = el.children[i] as HTMLElement | undefined; if (!li) continue;
        const a = 0.05 + (i * 0.84) / n, b = a + 0.84 / n;
        const l = span(p, a - 0.02, a + 0.04);
        const s = span(p, a + (b - a) * 0.3, b + 0.01);
        li.style.setProperty('--l', l.toFixed(3));
        li.style.setProperty('--s', s.toFixed(3));
        const lines = geo.current[i];
        const live = l > 0 && (s < 1 || p < b + 0.05);
        li.style.setProperty('--pen', live ? '1' : '0');
        if (lines?.length && live) {
          const t = s * lines.length, k = Math.min(lines.length - 1, Math.floor(t)), f = Math.min(1, t - k), ln = lines[k]!;
          li.style.setProperty('--px', `${(ln.x0 + (ln.x1 - ln.x0) * f).toFixed(1)}px`);
          li.style.setProperty('--py', `${(ln.y + ln.h * 0.6).toFixed(1)}px`);
        }
      }
    };
    paint(read.get());
    return read.on('change', paint);
  }, [active, read, items.length]);

  return (
    <div className={`v2-scene v2-scene--list s2b-ls s2b-ls--${stop ? 'stop' : 'more'}`}>
      <MarkGlyph>{beat.mark}</MarkGlyph>
      <Take range={[0.82, 1]} dir="up" distance={100} className="v2-scene__col">
        <Mark>## {beat.section}</Mark>
        <div className="v2-h2 v2-h2--list" aria-hidden="true">{beat.heading}</div>
        <div className="s2b-pad" aria-hidden="true">
          <motion.div className="s2b-paper" style={{ rotateX: rx, rotate: rz, y }}>
            <p className="s2b-date">{lastEdited}</p>
            <ol ref={ol} className="s2b-lines">
              {items.map((it, i) => <Item key={it} text={it} i={i} stop={stop} onLines={onLines} />)}
            </ol>
          </motion.div>
        </div>
      </Take>
      <ClayActor beat={beat} />
    </div>
  );
}
