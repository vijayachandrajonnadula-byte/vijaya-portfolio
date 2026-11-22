import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import { glimpseOf } from '../../data/glimpses';
import { useCalm } from '../../lib/calm';
import GlimpseVideo from './GlimpseVideo';

const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const SWEEP = 270; // degrees of knob travel, -135 to +135
/** Projects that stay in the Work section but are not stations on the hero receiver. */
const NOT_ON_HERO = new Set(['renewly', 'caresync']);

/**
 * A tuning receiver: each project is a station. Turn the dial and the screen fills with static between stations and
 * locks onto a clip when you land on one (the site's whole idea, signal first, as an object you can hold).
 *
 * - Drag the knob (mouse, pen or finger), press it with arrow keys / Home / End (it is a slider), use the two step
 *   buttons, or click the frequency scale. "Open case study" is a real link.
 * - It tunes itself in once on load, from static to the first station. After that it only moves when you do.
 * - Static is a tiny canvas drawn only while the dial is between stations and the hero is on screen. The clip is a
 *   GlimpseVideo (plays on screen only, has its own pause button). Reduced motion: no static, no tuning sweep, the
 *   dial jumps straight to a station, the clip stays a still until you press play.
 * - Knob angle, needle and static are written to the DOM directly (no React state per frame); React only knows
 *   which station is selected.
 */
export default function Receiver() {
  const calm = useCalm();
  const stations = useMemo(() => projects.flatMap(p => { if (NOT_ON_HERO.has(p.id)) return []; const g = glimpseOf(p.id); return g ? [{ p, g }] : []; }), []);
  const N = stations.length;
  const [st, setSt] = useState(0);

  const root = useRef<HTMLDivElement>(null);
  const face = useRef<HTMLSpanElement>(null);
  const needle = useRef<HTMLSpanElement>(null);
  const noise = useRef<HTMLCanvasElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const vRef = useRef(0);
  const stRef = useRef(0);
  const sAmt = useRef(0);
  const tweenRaf = useRef(0);
  const noiseRaf = useRef(0);
  const onScreen = useRef(true);
  const dragging = useRef(false);
  const calmRef = useRef(calm);
  calmRef.current = calm;

  const drawNoise = useCallback(() => {
    noiseRaf.current = 0;
    const c = noise.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    if (sAmt.current <= 0.02 || !onScreen.current || calmRef.current) { c.style.opacity = '0'; return; }
    const img = ctx.createImageData(c.width, c.height);
    for (let i = 0; i < img.data.length; i += 4) { const g = 30 + Math.random() * 200; img.data[i] = img.data[i + 1] = img.data[i + 2] = g; img.data[i + 3] = 255; }
    ctx.putImageData(img, 0, 0);
    c.style.opacity = String(Math.min(0.96, sAmt.current * 1.15));
    noiseRaf.current = requestAnimationFrame(drawNoise);
  }, []);

  /** Put the dial at v (0..1): knob angle, needle, static amount, and which station is nearest. */
  const apply = useCallback((v: number) => {
    vRef.current = v;
    const pos = v * (N - 1);
    const nearest = Math.min(N - 1, Math.max(0, Math.round(pos)));
    const s = calmRef.current ? 0 : smooth(0.1, 0.42, Math.abs(pos - nearest));
    sAmt.current = s;
    if (face.current) face.current.style.transform = `rotate(${-SWEEP / 2 + v * SWEEP}deg)`;
    if (needle.current) needle.current.style.left = `${v * 100}%`;
    root.current?.style.setProperty('--lock', String((1 - s).toFixed(3)));
    if (nearest !== stRef.current) { stRef.current = nearest; setSt(nearest); }
    if (s > 0.02 && !noiseRaf.current) noiseRaf.current = requestAnimationFrame(drawNoise);
  }, [N, drawNoise]);

  const tuneTo = useCallback((index: number) => {
    const i = Math.min(N - 1, Math.max(0, index));
    const from = vRef.current, to = i / (N - 1);
    cancelAnimationFrame(tweenRaf.current);
    if (calmRef.current || Math.abs(to - from) < 1e-4) { apply(to); return; }
    const dur = Math.min(1500, 420 + Math.abs(to - from) * (N - 1) * 170);
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      apply(from + (to - from) * ease(t));
      if (t < 1) tweenRaf.current = requestAnimationFrame(step);
    };
    tweenRaf.current = requestAnimationFrame(step);
  }, [N, apply]);

  // first paint: start between stations (static) and tune in to the first one
  useEffect(() => {
    if (calm) { apply(0); return; }
    apply(0.45 / (N - 1));
    const t = window.setTimeout(() => tuneTo(0), 700);
    return () => window.clearTimeout(t);
  }, [calm, N, apply, tuneTo]);

  // no static or tween while off screen or the tab is hidden
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      onScreen.current = !!e?.isIntersecting;
      if (onScreen.current && sAmt.current > 0.02 && !noiseRaf.current) noiseRaf.current = requestAnimationFrame(drawNoise);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(noiseRaf.current); noiseRaf.current = 0; cancelAnimationFrame(tweenRaf.current); };
  }, [drawNoise]);

  const fromPointer = (e: React.PointerEvent) => {
    const el = knob.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let a = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI; // 0 = straight up, clockwise +
    if (Math.abs(a) > SWEEP / 2) a = a > 0 ? SWEEP / 2 : -SWEEP / 2;
    apply((a + SWEEP / 2) / SWEEP);
  };
  const down = (e: React.PointerEvent) => { dragging.current = true; cancelAnimationFrame(tweenRaf.current); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); fromPointer(e); };
  const move = (e: React.PointerEvent) => { if (dragging.current) fromPointer(e); };
  const up = () => { if (!dragging.current) return; dragging.current = false; tuneTo(Math.round(vRef.current * (N - 1))); };
  const key = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: stRef.current + 1, ArrowUp: stRef.current + 1, ArrowLeft: stRef.current - 1, ArrowDown: stRef.current - 1, Home: 0, End: N - 1 };
    if (e.key in map) { e.preventDefault(); tuneTo(map[e.key]); }
  };
  const scaleClick = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    tuneTo(Math.round(((e.clientX - r.left) / r.width) * (N - 1)));
  };

  const cur = stations[st];
  if (!cur) return null;
  const freq = (88 + st * 2.6).toFixed(1);

  return (
    <div className="rx" ref={root} style={{ '--lock': 1 } as React.CSSProperties}>
      <div className="rx__top" aria-hidden="true">
        <span>VJ-1 · Prototype receiver</span>
        <span className="rx__lock"><i className="rx__led" />Signal</span>
      </div>

      <div className="rx__screen">
        <GlimpseVideo key={cur.p.id} id={cur.g.clip ?? cur.g.id} poster={cur.g.poster} label={cur.g.label} eager />
        <canvas ref={noise} className="rx__noise" width={160} height={100} aria-hidden="true" />
        <span className="rx__scan" aria-hidden="true" />
      </div>

      <div className="rx__deck">
        <div className="rx__info">
          <p className="rx__freq" aria-hidden="true"><b>{freq}</b> MHz</p>
          <p className="rx__name">{cur.p.title}</p>
          <div className="rx__scale" onClick={scaleClick} aria-hidden="true">
            {stations.map((s, i) => <i key={s.p.id} className={`rx__stop${i === st ? ' is-on' : ''}`} style={{ left: `${(i / (N - 1)) * 100}%` }} />)}
            <span className="rx__needle" ref={needle} />
          </div>
          <div className="rx__row">
            <button type="button" className="rx__step" onClick={() => tuneTo(st - 1)} disabled={st === 0} aria-label="Previous project">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <Link className="rx__open" to={cur.p.href}>Open case study</Link>
            <button type="button" className="rx__step" onClick={() => tuneTo(st + 1)} disabled={st === N - 1} aria-label="Next project">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>

        <div className="rx__knobwrap">
          <div
            className="rx__knob"
            ref={knob}
            role="slider"
            tabIndex={0}
            aria-label="Tune to a project"
            aria-valuemin={1}
            aria-valuemax={N}
            aria-valuenow={st + 1}
            aria-valuetext={`${cur.p.title}, project ${st + 1} of ${N}`}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onKeyDown={key}
          >
            <span className="rx__face" ref={face} />
          </div>
          <span className="rx__knoblabel" aria-hidden="true">Tune</span>
        </div>
      </div>
      <p className="sfw__live" role="status" aria-live="polite">{`Now showing ${cur.p.title}.`}</p>
    </div>
  );
}
