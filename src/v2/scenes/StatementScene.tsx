import { Take, Words, ranges, useBeat } from '../components/Beat';
import { ClayActor, MarkGlyph, Mark } from '../components/SceneBits';
import SignalField from '../components/s1/SignalField';
import type { SceneProps } from './types';

/**
 * A statement ("## what this file is"). The words light up one by one as you read (paced by the beat's `read`), and behind them a
 * field of jittering dashes resolves into straight parallel lines as the sentences land: signal vs noise, drawn literally.
 * The one steady line runs into Clay's eyes. See components/s1/SignalField.tsx.
 */
export default function StatementScene({ beat }: SceneProps) {
  const { read } = useBeat();
  const r = ranges(beat.paragraphs);
  return (
    <div className="v2-scene v2-scene--statement">
      <SignalField />
      <MarkGlyph>{beat.mark}</MarkGlyph>
      <Take range={[0.8, 1]} dir="up" distance={110} className="v2-scene__col">
        <Mark>## {beat.section}</Mark>
        <div className="v2-h2" aria-hidden="true">{beat.heading}</div>
        {beat.paragraphs.map((p, i) => <Words key={i} text={p} source={read} range={r[i]} className="v2-body" />)}
      </Take>
      <ClayActor beat={beat} />
    </div>
  );
}
