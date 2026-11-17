import { Reveal, Take, Words, ranges, useBeat } from '../components/Beat';
import { ClayActor, MarkGlyph, Mark } from '../components/SceneBits';
import CloseTheCircuit from '../../components/home/CloseTheCircuit';
import type { SceneProps } from './types';

/** PLACEHOLDER scene (foundation). The scene agent replaces this file; keep the props contract in ./types.ts. */
export default function ContactScene({ beat }: SceneProps) {
  const { read } = useBeat();
  const r = ranges(beat.paragraphs, 0, 0.5);
  return (
    <div className="v2-scene v2-scene--contact">
      <MarkGlyph>{beat.mark}</MarkGlyph>
      <Take range={[0.9, 1]} dir="up" distance={80} className="v2-scene__col">
        <Mark>## {beat.section}</Mark>
        <div className="v2-h2" aria-hidden="true">{beat.heading}</div>
        {beat.paragraphs.map((p, i) => <Words key={i} text={p} source={read} range={r[i]} className="v2-body" />)}
        <Reveal at={0.45} source={read}>
          <ul className="v2-links">
            {(beat.links ?? []).map(l => (
              <li key={l.href}>
                <a href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.label}</a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal at={0.55} source={read} className="v2-paper"><CloseTheCircuit /></Reveal>
      </Take>
      <ClayActor beat={beat} className="v2-clay--contact" drift={10} />
    </div>
  );
}
