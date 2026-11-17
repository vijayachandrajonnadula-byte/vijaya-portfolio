import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Character from './Character';
import AskBox from './AskBox';
import { quirks } from '../../data/quirks';
import { profile } from '../../data/profile';
import '../../styles/home-v2.css';

/**
 * The first screen holds five things and one obvious action: Clay, the headline, one subline, the ask box and
 * "See the work". Laws applied:
 * - Hick's law: three focusable controls (input, send, See the work) and one primary action.
 * - Miller's law + chunking: five items, in two groups (who I am / what to do).
 * - Occam's razor + Tesler: chips, Resume, the aside, the featured strip, the scroll cue and the pointer glow are gone;
 *   each already lives further down (Work, Contact, footer, Ask answers).
 * - Law of Pragnanz + proximity: one centred column; 48px between the "who" group and the "do" group, 24px inside.
 * - Von Restorff: only "See the work" is saturated; the ask box stays a quiet tile.
 * - Aesthetic-usability: generous space, one serif headline, one body size.
 * - Fitts: the primary button is 56px tall and wide, the ask row 56px tall.
 * - Serial position: the headline is first, the primary button is last.
 * - Selective attention: no competing motion; Clay sits still apart from its single boot flicker and blink.
 * `data-hero` lets the floating Ask launcher hide itself while this section is on screen.
 */
export default function HomeHero() {
  const nav = useNavigate();
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
      <div className="hhero__char">
        <Character pose="rest" size={112} track boot label="Clay, the site’s mascot" />
      </div>
      <div className="hhero__who">
        <motion.h1 className="hhero__title" {...fade(0.1)}>
          Hi, I’m Vijay. I turn messy user journeys into <em>clear</em> ones.
        </motion.h1>
        <motion.p className="hhero__sub" {...fade(0.2)}>{profile.title} in Hyderabad, designing enterprise software.</motion.p>
      </div>
      <motion.div className="hhero__do" {...fade(0.3)}>
        <div className="hhero__ask">
          <AskBox
            id="ask-hero"
            label="Ask me anything"
            onAsk={q => nav(`/ask?q=${encodeURIComponent(q)}`)}
            nudges={quirks.askNudges.slice(1)}
          />
        </div>
        <a className="btn-c hhero__go" href="#work" onClick={goWork}>See the work</a>
      </motion.div>
    </section>
  );
}
