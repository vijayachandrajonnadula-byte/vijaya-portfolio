import { useEffect, useRef, useState } from 'react';
import './../../styles/story.css';
import { useCircuit } from './circuitStore';

const OPEN = 'Circuit still open. Scroll up and close it: that is the whole trick.';
const DONE = 'Circuit closed. Thanks for stopping by.';

/** Smooth-scroll to the contact switch and move focus onto it (the footer link is a shortcut to the one action). */
function goToSwitch(e: React.MouseEvent<HTMLAnchorElement>) {
  const sw = document.querySelector<HTMLElement>('[data-switch]');
  if (!sw) return;
  e.preventDefault();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const y = sw.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.55;
  if (window.__lenis) window.__lenis.scrollTo(Math.max(0, y), reduced ? { immediate: true } : undefined);
  else window.scrollTo({ top: Math.max(0, y), behavior: reduced ? 'auto' : 'smooth' });
  window.setTimeout(() => sw.focus({ preventScroll: true }), reduced ? 0 : 700);
}

/**
 * Footer end of the circuit. The LED is the "message sent" light: it stays dim until the visitor has closed the
 * switch in the contact section, and lights only then (not by scroll depth). If they reach the bottom without
 * closing it, the line invites them back up with a link to the switch. Reduced motion: no ring, no fade.
 */
export default function CircuitLed() {
  const { active, closed } = useCircuit();
  const [ring, setRing] = useState(false);
  const prev = useRef(closed);

  useEffect(() => {
    if (closed && !prev.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRing(true);
      const r = window.setTimeout(() => setRing(false), 700);
      prev.current = closed;
      return () => window.clearTimeout(r);
    }
    prev.current = closed;
  }, [closed]);

  if (!active) return null;
  return (
    <div className="circuit-end" data-node-led>
      <span className="led-wrap">
        <span className={`led${closed ? ' is-on' : ''}`} aria-hidden="true" />
        {ring ? <span className="led-ring" aria-hidden="true" /> : null}
      </span>
      <p className="circuit-end__line" role="status" aria-live="polite">
        {closed ? DONE : <>{OPEN} <a className="circuit-end__go" href="#contact" onClick={goToSwitch}>Take me to the switch</a></>}
      </p>
    </div>
  );
}
