import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import GlimpseVideo from './GlimpseVideo';
import ScopeField from './ScopeField';
import ResolveText from './ResolveText';
import Signature from './Signature';
import { glimpseOf } from '../../data/glimpses';
import '../../styles/home-v2.css';

/** The three cards on the stage. Positions are percentages of the stage so it scales as one piece. */
const WINDOWS = [
  { id: 'pulse-design-system', title: 'PULSE Storybook', w: '68%', l: '31%', t: '1%', z: 1, d: 10, r: '1.2deg', tone: 'a', delay: 1.0 },
  { id: 'electronic-execution', title: 'Working prototype', w: '52%', l: '0%', t: '31%', z: 2, d: 22, r: '-2.4deg', tone: 'b', delay: 1.2 },
  { id: 'afs-enterprise-workflow', title: 'Account Fit Score', w: '45%', l: '50%', t: '55%', z: 3, d: 34, r: '2deg', tone: 'a', delay: 1.4 },
] as const;

/**
 * The first screen is an oscilloscope. The idea is the person: an electronics engineer who became a UX designer and
 * still works the same way, find the signal, remove the noise.
 *
 * What happens, in order (all once, nothing loops except the live scope, which runs only while on screen):
 *  - The glass shows nine noisy traces. Around the pointer they flatten into clean glowing lines (ScopeField).
 *  - A scan line crosses the screen; the headline resolves letter by letter as it passes (ResolveText).
 *  - The signature is written from a noisy trace that settles into its underline (Signature).
 *  - Three real project clips arrive as cards that lean toward the pointer.
 *
 * One primary action ("See the work") and one quiet link. `data-hero` lets the floating Ask launcher hide here.
 * Reduced motion: still lines, finished headline and signature, still cards with play buttons, no tilt.
 */
export default function HomeHero() {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);

  // The scan line travels the width of the screen.
  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    const set = () => el.style.setProperty('--sw', `${Math.max(0, el.clientWidth - 2)}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pointer lean: write two CSS variables, no React state, only for a mouse or pen and when motion is allowed.
  useEffect(() => {
    const el = stage.current;
    const host = screen.current;
    if (!el || !host || reduced || !window.matchMedia('(pointer: fine)').matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = host.getBoundingClientRect();
        el.style.setProperty('--mx', String(((e.clientX - r.left) / r.width - 0.5) * 2));
        el.style.setProperty('--my', String(((e.clientY - r.top) / r.height - 0.5) * 2));
      });
    };
    const leave = () => { el.style.setProperty('--mx', '0'); el.style.setProperty('--my', '0'); };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    return () => { cancelAnimationFrame(raf); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); };
  }, [reduced]);

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
      <div className="hhero__screen" ref={screen}>
        <ScopeField />
        <div className="hhero__sweep" aria-hidden="true" />
        <div className="hhero__in">
          <div className="hhero__copy">
            <div className="hhero__id">
              <Signature />
              <p className="hhero__who">Vijaya Chandra Jonnadula · Senior UX Designer · Hyderabad</p>
            </div>
            <h1 className="hhero__title"><ResolveText text="I make complicated software feel obvious." /></h1>
            <motion.p className="hhero__sub" {...fade(1.1)}>
              I started as an electronics engineer, so I design the same way I debug: find the signal, remove the noise, then build a working prototype to prove it.
            </motion.p>
            <motion.div className="hhero__act" {...fade(1.3)}>
              <a className="btn-c btn-c--lg" href="#work" onClick={goWork}>See the work</a>
              <Link className="link-q" to="/ask">
                Ask me anything
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </motion.div>
          </div>

          <div className="hstage" ref={stage}>
            <div className="hstage__tilt">
              {WINDOWS.map(w => {
                const g = glimpseOf(w.id);
                if (!g) return null;
                return (
                  <motion.div
                    key={w.id}
                    className="hw-slot"
                    style={{ '--w': w.w, '--l': w.l, '--t': w.t, '--z': w.z } as React.CSSProperties}
                    initial={reduced ? false : { opacity: 0, y: 40, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: w.delay }}
                  >
                    <div className={`hw hw--${w.tone}`} style={{ '--d': w.d, '--r': w.r } as React.CSSProperties}>
                      <div className="hw__frame">
                        <GlimpseVideo id={g.clip ?? g.id} poster={g.poster} label={g.label} eager />
                        <span className="hw__tag"><i aria-hidden="true" />{w.title}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
