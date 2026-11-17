import { Take, Words, ranges, useBeat } from '../components/Beat';
import { ClayActor, MarkGlyph, Mark } from '../components/SceneBits';
import type { SceneProps } from './types';

/** PLACEHOLDER scene (foundation). The scene agent replaces this file; keep the props contract in ./types.ts. */
export default function StatementScene({ beat }: SceneProps) {
  const { read } = useBeat();
  const r = ranges(beat.paragraphs);
  return (
    <div className="v2-scene v2-scene--statement">
      <MarkGlyph>{beat.mark}</MarkGlyph>
      <Take range={[0.8, 1]} dir="up" distance={100} className="v2-scene__col">
        <Mark>## {beat.section}</Mark>
        <div className="v2-h2" aria-hidden="true">{beat.heading}</div>
        {beat.paragraphs.map((p, i) => <Words key={i} text={p} source={read} range={r[i]} className="v2-body" />)}
      </Take>
      <ClayActor beat={beat} />
    </div>
  );
}
