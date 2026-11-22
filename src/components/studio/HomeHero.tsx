import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import SplitFlap, { BOARD_LINES } from './SplitFlap';
import Receiver from './Receiver';
import '../../styles/home-v2.css';

/**
 * The first screen: a departure board and a drifting wall of work on one dark ground.
 *  - Left: who, the headline as a split-flap board (every tile flips through noise and lands on the line; press it for
 *    another line), one sentence, one primary action ("See the work") and one quiet link.
 *  - Right: a tuning receiver. Turn the dial: static between projects, a clip locks in on each one (Receiver).
 * The idea is the person: noise in, signal out, said with two objects an electronics engineer would recognise.
 *
 * The h1 is real text for screen readers and search (the board's tiles are decorative). `data-hero` lets the floating
 * Ask launcher hide while this section is on screen. Reduced motion: lines change without flipping, the wall stands still.
 */
export default function HomeHero() {
  const reduced = useReducedMotion();

  const goWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('work');
    if (!el) return;
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('vj:anchor', { detail: { target: 'work' } }));
    history.replaceState(null, '', '#work');
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -8 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  const fade = (d: number) => ({ initial: reduced ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: d } });

  return (
    <section className="hhero" id="top" aria-label="Introduction" data-hero>
      <div className="hhero__in">
        <div className="hhero__copy">
          <motion.p className="hhero__who" {...fade(0.05)}>Vijaya Chandra Jonnadula · Senior UX Designer · Hyderabad</motion.p>
          <h1 className="hhero__h1">{BOARD_LINES[0].say}</h1>
          <SplitFlap />
          <motion.p className="hhero__sub" {...fade(1.4)}>
            I started as an electronics engineer, so I design the same way I debug: find the signal, remove the noise, then build a working prototype to prove it.
          </motion.p>
          <motion.div className="hhero__act" {...fade(1.6)}>
            <a className="btn-c btn-c--lg" href="#work" onClick={goWork}>See the work</a>
            <Link className="link-q" to="/ask">
              Ask me anything
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </motion.div>
        </div>
        <Receiver />
      </div>
    </section>
  );
}
