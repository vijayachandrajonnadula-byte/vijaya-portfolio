import { Link } from 'react-router-dom';
import { motion, useTransform } from 'framer-motion';
import Character from '../../components/studio/Character';
import { Reveal, Words, ranges, useBeat } from '../components/Beat';
import { Mark } from '../components/SceneBits';
import { goTo } from '../film';
import { HelpCard, useSignoffEggs } from './signoff/Eggs';
import type { SceneProps } from './types';
import '../styles/s3-signoff.css';

/** "_thanks for reading it._" -> "thanks for reading it" (the full stop is drawn as the film's dot). */
const sentence = (s: string) => s.replace(/_/g, '').replace(/\.\s*$/, '').trim();

/** Opens the raw file through the same key the conductor listens for (the overlay lives in V2App). */
const openRaw = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true }));

/**
 * ## sign-off: the human ending. A plain paragraph, the last sentence in the serif italic with a hand-drawn underline that
 * draws itself, the full stop as Clay's dot, then the giant file name with its blinking caret, and Clay waving on top of it.
 */
export default function SignoffScene({ beat }: SceneProps) {
  const { read, active } = useBeat();
  const [plainP, lastP] = [beat.paragraphs[0] ?? '', beat.paragraphs[beat.paragraphs.length - 1] ?? ''];
  const r = ranges([plainP], 0.02, 0.4);

  const thanksO = useTransform(read, [0.34, 0.46], [0, 1]);
  const thanksY = useTransform(read, [0.34, 0.46], [26, 0]);
  const dotS = useTransform(read, [0.5, 0.6, 0.68], [0, 1.35, 1]);
  const draw = useTransform(read, [0.56, 0.74], [0, 1]);
  const fileO = useTransform(read, [0.66, 0.8], [0, 1]);
  const fileY = useTransform(read, [0.66, 0.8], [40, 0]);

  const { help, setHelp, note } = useSignoffEggs(active);

  return (
    <div className="v2-scene s3-end">
      <div className="s3-end__col">
        <Mark>## {beat.section}</Mark>
        <Words text={plainP} source={read} range={r[0]} className="v2-body s3-end__p" />

        <motion.div className="s3-end__thanks" aria-hidden="true" style={{ opacity: thanksO, y: thanksY }}>
          <span className="s3-end__sent">
            {sentence(lastP)}
            <motion.i className="s3-end__dot" style={{ scale: dotS }} />
            <svg className="s3-end__squig" viewBox="0 0 400 22" focusable="false">
              <motion.path d="M3 13 C 34 3, 58 21, 92 11 S 150 4, 184 13 S 246 20, 282 10 S 350 5, 397 12" style={{ pathLength: draw }} />
            </svg>
          </span>
        </motion.div>

        <motion.div className="s3-end__filewrap" style={{ opacity: fileO, y: fileY }}>
          <div className="s3-end__file" aria-hidden="true">
            <span>VIJAY</span><span className="s3-end__ext">.md</span><i className={`s3-end__caret${active ? ' is-on' : ''}`} />
          </div>
          <div className="s3-end__clay" aria-hidden="true">
            <Character pose="wave" size={190} track={active} power={active ? 'bright' : 'on'} />
          </div>
        </motion.div>

        <Reveal at={0.62} span={0.1} source={read}>
          <p className="s3-end__links">
            <button type="button" onClick={() => goTo(0)}>back to the top</button>
            <button type="button" onClick={openRaw}>view the raw file</button>
            <Link to={{ search: '?read' }}>read the plain version</Link>
            <Link to="/classic" className="s3-end__quiet">the classic portfolio</Link>
            <Link to="/ask" className="s3-end__quiet">ask</Link>
          </p>
          <p className="s3-end__hint">type <kbd>help</kbd> for the manual. press <kbd>c</kbd> to copy my email.</p>
        </Reveal>
      </div>

      <HelpCard open={help} onClose={() => setHelp(false)} />
      <p className="s3-toast" role="status" data-on={note ? 'true' : undefined}>{note}</p>
    </div>
  );
}
