import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Character from './Character';
import '../../styles/home-v2.css';
import '../../styles/hero-signal.css';

/** The wave and the straight line have exactly the same commands, so one path can morph from the first to the second. */
const WAVE = 'M0 7 C 3 0, 7 0, 10 7 S 17 14, 20 7 S 27 0, 30 7 S 37 14, 40 7 S 47 0, 50 7 S 57 14, 60 7 S 67 0, 70 7 S 77 14, 80 7 S 87 0, 90 7 S 97 14, 100 7';
const LINE = 'M0 7 C 3 7, 7 7, 10 7 S 17 7, 20 7 S 27 7, 30 7 S 37 7, 40 7 S 47 7, 50 7 S 57 7, 60 7 S 67 7, 70 7 S 77 7, 80 7 S 87 7, 90 7 S 97 7, 100 7';

/**
 * The one moment of motion in the hero: a hand-drawn-looking wave under "clear" that settles into a straight line,
 * once, a beat after the headline arrives. Signal to clean line, the same idea as the electronics background.
 * It never loops. Under reduced motion it is simply drawn straight.
 */
function SignalLine({ reduced }: { reduced: boolean }) {
  return (
    <svg className="hhero__line" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {/* A native SVG animation: one run, no JavaScript timers, nothing left running afterwards. */}
      <path d={reduced ? LINE : WAVE} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke">
        {!reduced && (
          <animate attributeName="d" dur="1.1s" begin="0.9s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.22 1 0.36 1" values={`${WAVE};${LINE}`} />
        )}
      </path>
    </svg>
  );
}

/**
 * The first screen: what I do, who I am, and ONE thing to do next.
 * Job of the screen: a recruiter decides in under 10 seconds whether to look at the work.
 * - Von Restorff + Hick: one primary button ("See the work"), one quiet text link ("Ask me anything"). The ask input,
 *   its label and the chips are gone; the Ask page and the floating Ask launcher are where people ask.
 * - Interactive elements above the fold besides the nav: two.
 * - Visual hierarchy: serif headline first, one sentence second, the action row last (serial position).
 * - Composition: headline left, Clay on a quiet stage at the right (desktop); a centred stack on phones.
 * - Selective attention: Clay blinks and breathes only while on screen and never under reduced motion; nothing else moves.
 * `data-hero` lets the floating Ask launcher hide itself while this section is on screen.
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
          <motion.h1 className="hhero__title" {...fade(0.05)}>
            Enterprise software, made <em className="hhero__clear">clear<SignalLine reduced={!!reduced} /></em> enough to build.
          </motion.h1>
          <motion.p className="hhero__sub" {...fade(0.15)}>
            I’m Vijay, a Senior UX Designer in Hyderabad. I take dense workflows from first sketch to a working prototype and the design system behind it.
          </motion.p>
          <motion.div className="hhero__act" {...fade(0.25)}>
            <a className="btn-c btn-c--lg" href="#work" onClick={goWork}>See the work</a>
            <Link className="link-q" to="/ask">
              Ask me anything
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </motion.div>
        </div>
        <div className="hhero__art">
          <div className="hhero__stage">
            <Character pose="rest" size={248} track boot label="Clay, the site’s mascot" />
          </div>
        </div>
      </div>
    </section>
  );
}
