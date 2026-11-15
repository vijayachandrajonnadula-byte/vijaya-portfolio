import { useEffect, useRef, useState } from 'react';
import './../../styles/story.css';
import { useCircuit } from './circuitStore';

const OPEN = 'Circuit open. Keep scrolling, I do not bite.';
const DONE = 'Circuit complete. Now you can hire me.';

/**
 * Footer closing line. The LED lights once the Trace has reached it; before that it stays dim.
 * The first time it completes: a glow ring (scale 1 to 2.4, 600ms) and the line types in at ~24ms a character.
 * Reduced motion: the final state, static. Screen readers get the full sentence at once.
 */
export default function CircuitLed() {
  const { active, complete } = useCircuit();
  const [typed, setTyped] = useState(OPEN.length);
  const [ring, setRing] = useState(false);
  const played = useRef(false);

  useEffect(() => {
    if (!complete) { setTyped(OPEN.length); return; }
    if (played.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTyped(DONE.length); return; }
    played.current = true;
    setRing(true);
    setTyped(0);
    let i = 0;
    const id = window.setInterval(() => { i += 1; setTyped(i); if (i >= DONE.length) window.clearInterval(id); }, 24);
    const r = window.setTimeout(() => setRing(false), 700);
    return () => { window.clearInterval(id); window.clearTimeout(r); };
  }, [complete]);

  if (!active) return null;
  const full = complete ? DONE : OPEN;
  const typing = complete && typed < DONE.length;
  return (
    <div className="circuit-end" data-node-led>
      <span className="led-wrap">
        <span className={`led${complete ? ' is-on' : ''}`} aria-hidden="true" data-led />
        {ring ? <span className="led-ring" aria-hidden="true" /> : null}
      </span>
      <p className="circuit-end__line" role="status" aria-live="polite">
        <span className="sr-only">{full}</span>
        <span aria-hidden="true">{typing ? full.slice(0, typed) : full}{typing ? <i className="caret" /> : null}</span>
      </p>
    </div>
  );
}
