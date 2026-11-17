import { Link } from 'react-router-dom';
import { motion, useTransform } from 'framer-motion';
import { Reveal, Words, ranges, useBeat } from '../components/Beat';
import { ClayActor, Mark } from '../components/SceneBits';
import { goTo } from '../film';
import type { SceneProps } from './types';

/** PLACEHOLDER scene (foundation). The scene agent replaces this file; keep the props contract in ./types.ts. */
export default function SignoffScene({ beat }: SceneProps) {
  const { read } = useBeat();
  const r = ranges(beat.paragraphs, 0, 0.8);
  // the dot becomes the full stop: a clay disc that settles at the end
  const dot = useTransform(read, [0.6, 1], [0, 1]);
  return (
    <div className="v2-scene v2-scene--signoff">
      <div className="v2-scene__col">
        <Mark>## {beat.section}</Mark>
        {beat.paragraphs.map((p, i) => <Words key={i} text={p} source={read} range={r[i]} className="v2-body v2-body--big" />)}
        <Reveal at={0.8} source={read}>
          <p className="v2-endlinks">
            <button type="button" onClick={() => goTo(0)}>back to the top</button>
            <Link to="/classic">the classic portfolio</Link>
            <Link to="/ask">ask</Link>
          </p>
        </Reveal>
      </div>
      <motion.div className="v2-stop" aria-hidden="true" style={{ scale: dot, opacity: dot }} />
      <ClayActor beat={beat} drift={8} />
    </div>
  );
}
