import { useEffect, useRef, useState } from 'react';
import { Take, Words, useBeat } from '../components/Beat';
import { Caret } from '../components/bits';
import { ClayActor } from '../components/SceneBits';
import { Iris, useIntro } from '../components/s1/Intro';
import type { SceneProps } from './types';

/**
 * The title. One composition: VIJAY. in a huge voice, a small mono "md" and Clay standing on the same baseline, as if it were
 * another character in the line. The full stop is a glowing dot (Clay's LED eye, in spirit): the opening iris grows out of it.
 *
 * Opening (see components/s1/Intro.tsx, styles/s1-title.css): iris from the dot, letters rise with a little overshoot, "md" types in,
 * the three > lines light word by word, Clay waves once. Any key or pointer skips it. The real text is in the DOM from the first paint
 * (the hidden article), everything here is decoration over it.
 */
const WORD = ['V', 'I', 'J', 'A', 'Y'];

export default function TitleScene({ beat }: SceneProps) {
  const { active } = useBeat();
  const lines = beat.prompts ?? [];
  const dotRef = useRef<HTMLSpanElement>(null);
  const intro = useIntro(dotRef);
  const [cue, setCue] = useState(false);

  // the HUD waits for the iris (CSS: html[data-v2-intro='play'])
  useEffect(() => {
    const root = document.documentElement;
    if (intro.phase === 'play') root.dataset.v2Intro = 'play'; else delete root.dataset.v2Intro;
    return () => { delete root.dataset.v2Intro; };
  }, [intro.phase]);

  // a quiet cue, only after 3 seconds of idle at the very top; gone for good at the first scroll, key or touch
  useEffect(() => {
    if (!active) { setCue(false); return; }
    let used = false;
    const t = window.setTimeout(() => { if (!used && window.scrollY < 24) setCue(true); }, 3000);
    const off = () => { used = true; window.clearTimeout(t); setCue(false); };
    window.addEventListener('scroll', off, { passive: true, once: true });
    window.addEventListener('keydown', off, { once: true });
    window.addEventListener('pointerdown', off, { once: true });
    return () => { window.clearTimeout(t); window.removeEventListener('scroll', off); window.removeEventListener('keydown', off); window.removeEventListener('pointerdown', off); };
  }, [active]);

  return (
    <div className="v2-scene v2-scene--title" data-intro={intro.phase} data-skip={intro.skipped ? 'true' : 'false'}>
      <Iris intro={intro} />
      <Take range={[0.7, 1]} dir="up" distance={140} className="v2-scene__col v2-scene__col--title">
        <div className="v2-hero">
          <div className="v2-title" aria-hidden="true">
            <span className="v2-title__a">
              {WORD.map((c, i) => <span key={i} className="v2-title__l" style={{ ['--i' as string]: i }}>{c}</span>)}
            </span>
            <span ref={dotRef} className="v2-title__stop"><span className="v2-title__dot" /></span>
            <span className="v2-title__b">
              <span style={{ ['--i' as string]: 0 }}>m</span><span style={{ ['--i' as string]: 1 }}>d</span>
            </span>
            <Caret className="v2-title__caret" />
          </div>
          <ClayActor beat={beat} className="v2-clay--title" pose={intro.waving ? 'wave' : 'rest'} hop={false} drift={0} size={400} boot />
        </div>
        <p className="v2-meta v2-meta--title" aria-hidden="true">{beat.meta}</p>
        <div className="v2-prompts">
          {lines.map((p, i) => (
            <div key={p} className="v2-prompt">
              <span className="v2-prompt__gt" aria-hidden="true">&gt;</span>
              <Words text={p} source={intro.lit} range={[0.02 + i * 0.3, 0.38 + i * 0.3]} as="span" />
            </div>
          ))}
        </div>
      </Take>
      <p className={`v2-cue${cue ? ' is-on' : ''}`} aria-hidden="true">
        <span className="v2-cue__line" /><span className="v2-cue__t"><span className="v2-cue__fine">scroll or press <kbd>space</kbd></span><span className="v2-cue__touch">scroll</span></span>
      </p>
    </div>
  );
}
