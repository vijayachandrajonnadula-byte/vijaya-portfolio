import { useEffect, useRef } from 'react';
import Character from '../../../components/studio/Character';
import { useBeat } from '../../components/Beat';
import { Fit, span, useScrub } from './art5/kit';
import '../../styles/s2b-art7.css';
import type { ArtProps } from './types';

/**
 * 7: close the loop. A wire loop with a button and a lamp side by side. Pressing sends a clay dot round the loop; it comes back to the
 * lamp, the lamp lights, "sent / used / saved" tick on the way. Scroll scrubs one lap (reversible); the press button runs a lap by hand.
 * An open circuit does nothing: the gap in the wire closes at the button, the same switch that ends the film.
 */
const LOOP = 'M50 232V274Q50 300 76 300H404Q430 300 430 274V66Q430 40 404 40H76Q50 40 50 66V188';

export default function Art7({ beat }: ArtProps) {
  const { progress, active } = useBeat();
  const root = useRef<HTMLDivElement>(null);
  const hand = useRef<{ raf: number; run: boolean; hold: number | null }>({ raf: 0, run: false, hold: null });

  const set = (d: number) => {
    const el = root.current; if (!el) return;
    const st = el.style;
    st.setProperty('--d', d.toFixed(4));
    st.setProperty('--sw', d > 0.001 ? '1' : '0');
    st.setProperty('--t1', d > 0.05 ? '1' : '0');
    st.setProperty('--t2', d > 0.45 ? '1' : '0');
    st.setProperty('--t3', d > 0.965 ? '1' : '0');
    st.setProperty('--cl', String(1 - span(d, 0.02, 0.22)));
    el.dataset.on = d > 0.965 ? '1' : '0';
  };
  useScrub(progress, p => {
    const h = hand.current;
    if (h.run) return;
    // after a hand-run lap, keep the lit lamp until the visitor really scrolls away
    if (h.hold !== null && Math.abs(p - h.hold) < 0.04) return;
    h.hold = null;
    set(span(p, 0.2, 0.8));
  });

  useEffect(() => { if (!active && hand.current.raf) { cancelAnimationFrame(hand.current.raf); hand.current = { raf: 0, run: false, hold: null }; } }, [active]);
  useEffect(() => () => cancelAnimationFrame(hand.current.raf), []);

  const press = () => {
    const h = hand.current;
    cancelAnimationFrame(h.raf);
    const dur = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 500 : 2600;
    const t0 = performance.now();
    h.run = true; h.hold = null; set(0);
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      set(t);
      if (t < 1) h.raf = requestAnimationFrame(tick); else { h.run = false; h.raf = 0; h.hold = progress.get(); }
    };
    h.raf = requestAnimationFrame(tick);
  };

  return (
    <Fit W={480} H={360}>
      <div ref={root} className="a7" style={{ '--d': 0, '--cl': 1 } as never}>
        <svg className="a7__wire" width="480" height="360" viewBox="0 0 480 360" aria-hidden="true">
          <path className="g" d={LOOP} />
          <path className="d" pathLength={1} d={LOOP} />
          <path className="br" d="M50 188V232" />
        </svg>

        <div className="a7__lamp"><i className="a7__halo" /><b /><span>heard back</span></div>
        <button type="button" className="a7__btn" onClick={press} aria-label="press the button: send a signal round the loop"><span>press</span></button>
        <i className="a7__ring" />

        <span className="a7__tick a7__tick--1">sent ✓</span>
        <span className="a7__tick a7__tick--2">used ✓</span>
        <span className="a7__tick a7__tick--3">saved ✓</span>

        <div className="a7__dot" style={{ offsetPath: `path("${LOOP}")` }} />
        <div className="a7__clay"><Character pose={beat.pose} prop="none" size={150} track={false} power="bright" /></div>
      </div>
    </Fit>
  );
}
