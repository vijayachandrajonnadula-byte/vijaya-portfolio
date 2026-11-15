import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import './../../styles/story.css';
import ChapterLabel from './ChapterLabel';
import { useOnScreen } from '../motion/useOnScreen';

const W = 800, H = 200, N = 200;

/** A fixed pseudo-random table, so the mess is the same on every load. */
function table(n: number) {
  let s = 7;
  return Array.from({ length: n }, () => { s = (s * 16807) % 2147483647; return (s / 2147483647) * 2 - 1; });
}

function wave(noise: number, t: number, jag: number[], phase: number[]) {
  const k = noise / 100;
  let d = '';
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * W;
    const base = Math.sin((i / N) * Math.PI * 4 + t * 0.8) * 38;
    // jagged part: spikes that breathe slowly, plus a fast ripple
    const spike = jag[i]! * Math.sin(t * 1.3 + phase[i]!) * 36 * k * k;
    const ripple = Math.sin(i * 1.7 + t * 2.1) * 8 * k + Math.sin(i * 0.63 - t) * 12 * k;
    const y = H / 2 + base + spike + ripple;
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

function label(v: number) {
  if (v <= 4) return 'clear experience';
  if (v <= 35) return 'getting clearer';
  if (v <= 70) return 'still a bit noisy';
  return 'messy user journey';
}

/** Chapter 02. The manifesto as a toy: turn the noise down and the journey becomes a clean line. */
export default function SignalInterlude() {
  const [v, setV] = useState(100);
  const reduced = !!useReducedMotion();
  const card = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const onScreen = useOnScreen(card);
  const vRef = useRef(v);
  vRef.current = v;
  const jag = useMemo(() => table(N + 1), []);
  const phase = useMemo(() => table(N + 1).map(p => p * Math.PI), []);
  const t0 = useRef(0);

  const draw = useCallback((t: number) => { line.current?.setAttribute('d', wave(vRef.current, t, jag, phase)); }, [jag, phase]);

  // redraw on slider change (also the only draw under reduced motion)
  useEffect(() => { draw(t0.current); }, [v, draw]);

  // gentle animation, only while on screen, the tab is visible and motion is allowed
  useEffect(() => {
    if (reduced || !onScreen) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      if (!document.hidden) { t0.current += (now - last) / 1000; draw(t0.current); }
      last = now; raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, onScreen, draw]);

  const clean = v <= 3;
  return (
    <section className="signal" id="signal" aria-labelledby="signal-h">
      <div className="signal__in">
        <ChapterLabel n="02" name="signal" />
        <h2 id="signal-h" className="signal__h">Every product is a noisy signal.</h2>
        <p className="signal__sub">Turn the knob.</p>
        <div className="signal__card" ref={card} data-clean={clean || undefined}>
          <svg className="signal__wave" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false" style={{ ['--n' as string]: v }}>
            <line x1="0" x2={W} y1={H / 2} y2={H / 2} className="signal__base" />
            <path className="signal__ghost" d={wave(0, 0, jag, phase)} />
            <path ref={line} className="signal__line" d={wave(v, 0, jag, phase)} />
          </svg>
          <div className="signal__read">
            <span className="signal__tag" aria-live="polite">{label(v)}</span>
            <span className="signal__quip" aria-live="polite">
              <span className={`led led--sm${clean ? ' is-on' : ''}`} aria-hidden="true" />
              {clean ? 'Signal clean. That is the whole job.' : 'Right now this is somebody’s Monday morning.'}
            </span>
          </div>
          <div className="signal__ctl">
            <label htmlFor="noise">Noise</label>
            <input
              id="noise" type="range" min={0} max={100} step={1} value={v}
              onChange={e => setV(Number(e.target.value))}
              style={{ ['--v' as string]: `${v}%` }}
              aria-valuetext={`${v} percent noise, ${label(v)}`}
            />
            <output htmlFor="noise">{v}%</output>
          </div>
        </div>
      </div>
    </section>
  );
}
