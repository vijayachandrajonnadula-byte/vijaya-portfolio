import { Link } from 'react-router-dom';
import { Reveal, Take, Words, ranges, useBeat } from '../components/Beat';
import { ClayActor, MarkGlyph, Mark } from '../components/SceneBits';
import { ARTS } from './principles';
import { plain } from '../data/brief';
import type { SceneProps } from './types';

/** Principle scene: text column + the principle's own art (principles/ArtN.tsx). Owned by the lead; do not edit from scene agents. */
export default function PrincipleScene({ beat }: SceneProps) {
  const { read } = useBeat();
  const r = ranges(beat.paragraphs, 0, 0.8);
  return (
    <div className="v2-scene v2-scene--principle">
      <MarkGlyph>{beat.mark}</MarkGlyph>
      <Take range={[0.8, 1]} dir="up" distance={100} className="v2-scene__col">
        <Mark>### {beat.n} of 7</Mark>
        <div className="v2-h3" aria-hidden="true">{beat.heading}</div>
        {beat.paragraphs.map((p, i) => <Words key={i} text={p} source={read} range={r[i]} className="v2-body" />)}
        {beat.analogy ? (
          <Reveal at={0.7} y={14} source={read}><p className="v2-analogy" aria-hidden="true"><span>// </span>{plain(beat.analogy)}</p></Reveal>
        ) : null}
        {beat.proof ? (
          <Reveal at={0.78} y={14} source={read}>
            <Link className="v2-proof" to={beat.proof.href}><span aria-hidden="true">proof&nbsp;&rarr;&nbsp;</span>{beat.proof.label}</Link>
          </Reveal>
        ) : null}
      </Take>
      {(() => { const Art = beat.n ? ARTS[beat.n] : undefined; return Art ? <div className="v2-pa" aria-hidden="true"><Art beat={beat} /></div> : <ClayActor beat={beat} />; })()}
    </div>
  );
}
