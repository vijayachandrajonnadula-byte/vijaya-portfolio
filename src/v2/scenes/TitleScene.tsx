import { Reveal, Take, Words, useBeat } from '../components/Beat';
import { Caret } from '../components/bits';
import { ClayActor } from '../components/SceneBits';
import type { SceneProps } from './types';

/** PLACEHOLDER scene (foundation). The scene agent replaces this file; keep the props contract in ./types.ts. */
export default function TitleScene({ beat }: SceneProps) {
  const { read } = useBeat();
  const lines = beat.prompts ?? [];
  return (
    <div className="v2-scene v2-scene--title">
      <Take range={[0.7, 1]} dir="up" distance={120} className="v2-scene__col">
        <div className="v2-title" aria-hidden="true">
          <span className="v2-title__a">VIJAY</span><span className="v2-title__b">.md</span><Caret className="v2-title__caret" />
        </div>
        <Reveal at={0.02} y={12} source={read}><p className="v2-meta" aria-hidden="true">{beat.meta}</p></Reveal>
        <div className="v2-prompts">
          {lines.map((p, i) => (
            <div key={p} className="v2-prompt">
              <span className="v2-prompt__gt" aria-hidden="true">&gt;</span>
              <Words text={p} source={read} range={[0.05 + i * 0.25, 0.3 + i * 0.25]} as="span" />
            </div>
          ))}
        </div>
      </Take>
      <ClayActor beat={beat} className="v2-clay--title" />
    </div>
  );
}
