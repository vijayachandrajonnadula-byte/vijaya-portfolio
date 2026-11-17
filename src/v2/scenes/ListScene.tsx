import { motion, useTransform } from 'framer-motion';
import { Take, Words, useBeat } from '../components/Beat';
import { ClayActor, MarkGlyph, Mark } from '../components/SceneBits';
import type { SceneProps } from './types';

/** PLACEHOLDER scene (foundation). The scene agent replaces this file; keep the props contract in ./types.ts. */
export default function ListScene({ beat }: SceneProps) {
  const { read } = useBeat();
  const items = beat.items ?? [];
  const stop = beat.id.includes('stop');
  return (
    <div className="v2-scene v2-scene--list">
      <MarkGlyph>{beat.mark}</MarkGlyph>
      <Take range={[0.8, 1]} dir="up" distance={100} className="v2-scene__col">
        <Mark>## {beat.section}</Mark>
        <div className="v2-h2 v2-h2--list" aria-hidden="true">{beat.heading}</div>
        <ol className="v2-list" aria-hidden="true">
          {items.map((it, i) => {
            const a = 0.04 + (i * 0.86) / items.length, b = a + 0.86 / items.length;
            return <Item key={it} text={it} a={a} b={b} stop={stop} />;
          })}
        </ol>
      </Take>
      <ClayActor beat={beat} />
    </div>
  );
}

function Item({ text, a, b, stop }: { text: string; a: number; b: number; stop: boolean }) {
  const { read } = useBeat();
  const strike = useTransform(read, [b - 0.02, b + 0.07], [0, 1]);
  return (
    <li className="v2-item">
      <span className="v2-item__sign">{stop ? '−' : '+'}</span>
      <motion.span className="v2-item__t" style={{ '--s': stop ? strike : 0 } as never}>
        <Words text={text} source={read} range={[a, b]} as="span" />
      </motion.span>
    </li>
  );
}
