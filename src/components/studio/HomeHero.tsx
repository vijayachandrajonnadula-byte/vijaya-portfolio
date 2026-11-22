import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import GlimpseVideo from './GlimpseVideo';
import { glimpseOf } from '../../data/glimpses';
import '../../styles/home-v2.css';

/** The three windows on the stage. Positions are percentages of the stage so it scales as one piece. */
const WINDOWS = [
  { id: 'pulse-storybook', title: 'PULSE Storybook', w: '68%', l: '31%', t: '1%', z: 1, d: 10, r: '1.2deg', tone: 'a', delay: 0.5 },
  { id: 'electronic-execution', title: 'Working prototype', w: '52%', l: '0%', t: '31%', z: 2, d: 22, r: '-2.4deg', tone: 'b', delay: 0.68 },
  { id: 'afs-enterprise-workflow', title: 'Account Fit Score', w: '45%', l: '50%', t: '55%', z: 3, d: 34, r: '2deg', tone: 'a', delay: 0.86 },
] as const;

/**
 * The first screen. One job: a recruiter sees, in a few seconds, what Vijay does and that it is real.
 * - Left: who, one plain sentence about the work, one primary action ("See the work"), one quiet link.
 * - Right: three of the project clips already moving, in windows. The proof is the hero, not a slogan.
 * - Motion: the windows arrive once, staggered. After that only pointer parallax, on fine pointers, and only while the
 *   pointer is over the hero. Nothing loops by itself; the clips follow the GlimpseVideo rules (on screen only, reduced motion off).
 * `data-hero` lets the floating Ask launcher hide itself while this section is on screen.
 */
export default function HomeHero() {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);

  // Pointer parallax: write two CSS variables, no React state, only for a mouse or pen and when motion is allowed.
  useEffect(() => {
    const el = stage.current;
    if (!el || reduced || !window.matchMedia('(pointer: fine)').matches) return;
    const host = el.closest('section');
    if (!host) return;
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
      <div className="hhero__in">
        <div className="hhero__copy">
          <motion.p className="hhero__who" {...fade(0.05)}>Vijay Jonnadula · Senior UX Designer · Hyderabad</motion.p>
          <motion.h1 className="hhero__title" {...fade(0.12)}>
            I make complicated software feel obvious.
          </motion.h1>
          <motion.p className="hhero__sub" {...fade(0.3)}>
            I started as an electronics engineer, so I design the same way I debug: find the signal, remove the noise, then build a working prototype to prove it.
          </motion.p>
          <motion.div className="hhero__act" {...fade(0.45)}>
            <a className="btn-c btn-c--lg" href="#work" onClick={goWork}>See the work</a>
            <Link className="link-q" to="/ask">
              Ask me anything
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </motion.div>
        </div>

        <div className="hstage" ref={stage}>
          {WINDOWS.map(w => {
            const g = glimpseOf(w.id);
            if (!g) return null;
            return (
              <motion.div
                key={w.id}
                className="hw-slot"
                style={{ '--w': w.w, '--l': w.l, '--t': w.t, '--z': w.z } as React.CSSProperties}
                initial={reduced ? false : { opacity: 0, y: 36, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: w.delay }}
              >
                <div className={`hw hw--${w.tone}`} style={{ '--d': w.d, '--r': w.r } as React.CSSProperties}>
                  <div className="hw__frame">
                    <div className="hw__bar" aria-hidden="true"><i /><i /><i /><span>{w.title}</span></div>
                    <GlimpseVideo id={g.id} poster={g.poster} label={g.label} eager />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
