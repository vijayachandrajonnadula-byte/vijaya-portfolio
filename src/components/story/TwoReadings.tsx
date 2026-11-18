import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { animate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import './../../styles/story.css';
import './../../styles/two-readings.css';
import ChapterLabel from './ChapterLabel';
import { ELEMENTS, H, PULSE_END, PULSE_PATH, REST, TEXTS, W, ZONE, textCentre } from './twoReadings/elements';
import { boardTextOpacity, lensCentre, paint, screenAmount, screenTextOpacity } from './twoReadings/morph';

const FADE = [[0, 1], [0.25, 0.84], [0.5, 0.5], [0.75, 0.16], [1, 0]] as const;

const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, v));
const PERIOD = 7000;

/**
 * Chapter 02. One drawing, two readings: a layout that is a circuit board on one side of the lens and an app screen on
 * the other. Elements morph as the lens passes. All per-frame work is direct attribute writes driven by one motion value.
 */
export default function TwoReadings() {
  const reduced = !!useReducedMotion();
  const raw = useMotionValue(reduced ? REST : 0);
  const spring = useSpring(raw, { stiffness: 190, damping: 30, mass: 0.8 });
  const lens = reduced ? raw : spring;

  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const lensG = useRef<SVGGElement>(null);
  const rects = useRef<(SVGRectElement | null)[]>([]);
  const wideB = useRef<(SVGRectElement | null)[]>([]);
  const wideS = useRef<(SVGRectElement | null)[]>([]);
  const gradS = useRef<SVGLinearGradientElement>(null);
  const gradB = useRef<SVGLinearGradientElement>(null);
  const labels = useRef<(SVGTextElement | null)[]>([]);
  const last = useRef<number[]>([]);
  const dragging = useRef(false);
  const touched = useRef(false);
  const sweep = useRef<ReturnType<typeof animate> | null>(null);
  const [tag, setTag] = useState<{ text: string; x: number; y: number } | null>(null);

  const paintAll = useCallback((v: number) => {
    const c = lensCentre(v);
    ELEMENTS.forEach((e, i) => {
      if (e.wide) return;
      const node = rects.current[i];
      if (!node) return;
      const t = screenAmount(e.cx, c);
      if (last.current[i] !== undefined && Math.abs(last.current[i]! - t) < 0.0004) return;
      last.current[i] = t;
      paint(node, e, t);
    });
    TEXTS.forEach((x, i) => {
      const t = screenAmount(textCentre(x), c);
      const a = labels.current[i * 2], b = labels.current[i * 2 + 1];
      if (a) a.style.opacity = String(boardTextOpacity(t));
      if (b) b.style.opacity = String(screenTextOpacity(t));
    });
    const tf = `translate(${c.toFixed(1)} 0)`;
    lensG.current?.setAttribute('transform', tf);
    if (lensG.current) lensG.current.style.opacity = String(Math.min(1, v / 3, (100 - v) / 3));
    gradS.current?.setAttribute('gradientTransform', tf);
    gradB.current?.setAttribute('gradientTransform', tf);
    track.current?.style.setProperty('--v', `${(v).toFixed(2)}%`);
  }, []);

  useLayoutEffect(() => {
    ELEMENTS.forEach((e, i) => { if (!e.wide) return; const b = wideB.current[i], s = wideS.current[i]; if (b) paint(b, e, 0); if (s) paint(s, e, 1); });
    paintAll(lens.get());
    return lens.on('change', paintAll);
  }, [lens, paintAll]);

  // slider semantics follow the target value, not the spring
  const aria = useCallback((v: number) => {
    const h = handle.current; if (!h) return;
    const r = Math.round(v);
    h.setAttribute('aria-valuenow', String(r));
    h.setAttribute('aria-valuetext', r <= 4 ? 'circuit board' : r >= 96 ? 'app screen' : `${r} percent screen`);
  }, []);
  useLayoutEffect(() => { aria(raw.get()); return raw.on('change', aria); }, [raw, aria]);

  const stopAuto = useCallback(() => { touched.current = true; sweep.current?.stop(); sweep.current = null; }, []);
  const setValue = useCallback((v: number) => raw.set(clamp(v)), [raw]);
  const fromX = (clientX: number) => {
    const r = track.current?.getBoundingClientRect();
    if (!r || r.width === 0) return raw.get();
    return ((clientX - r.left) / r.width) * 100;
  };

  // in view: teach the gesture once (board, screen, centre), and gate the signal pulse
  const inView = useRef(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = section.current; if (!el || !('IntersectionObserver' in window)) { setVisible(true); return; }
    let played = false;
    const io = new IntersectionObserver(([e]) => {
      const on = !!e?.isIntersecting;
      inView.current = on; setVisible(on);
      if (on && !played && !reduced && !touched.current) {
        played = true;
        sweep.current = animate(raw, [0, 100, REST], { duration: 2.6, times: [0, 0.55, 1], ease: 'easeInOut' });
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); sweep.current?.stop(); };
  }, [raw, reduced]);

  // the signal: a clay dot runs the live trace, then rings the primary pad (a click, on the screen side). Loops slowly.
  const route = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  useEffect(() => {
    if (reduced || !visible) return;
    const p = route.current, d = dot.current, r = ring.current;
    if (!p || !d || !r) return;
    const len = p.getTotalLength();
    let raf = 0, t0 = 0, alive = true;
    const tick = (now: number) => {
      if (!alive) return;
      if (!t0) t0 = now + 3200; // let the first sweep finish
      const el = now - t0;
      if (el < 0) { raf = requestAnimationFrame(tick); return; }
      const k = (el % PERIOD) / PERIOD;
      if (k < 0.34) {
        const q = k / 0.34, e = q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2;
        const pt = p.getPointAtLength(e * len);
        d.setAttribute('cx', pt.x.toFixed(1)); d.setAttribute('cy', pt.y.toFixed(1));
        d.style.opacity = String(Math.min(1, q * 8, (1 - q) * 14));
        r.style.opacity = '0';
      } else if (k < 0.52) {
        const q = (k - 0.34) / 0.18;
        d.style.opacity = '0';
        r.setAttribute('r', (8 + 30 * (1 - Math.pow(1 - q, 3))).toFixed(1));
        r.style.opacity = String(0.85 * (1 - q));
      } else { d.style.opacity = '0'; r.style.opacity = '0'; }
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; d.style.opacity = '0'; r.style.opacity = '0'; t0 = 0; };
    const vis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', vis);
    start();
    return () => { alive = false; document.removeEventListener('visibilitychange', vis); stop(); };
  }, [reduced, visible]);

  // pointer: drag from the handle, the track or the drawing itself. pan-y keeps vertical page scroll on touch.
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    stopAuto();
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setTag(null);
    setValue(fromX(e.clientX));
    handle.current?.focus({ preventScroll: true });
  };
  const move = (e: PointerEvent<HTMLDivElement>) => { if (dragging.current) setValue(fromX(e.clientX)); };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const v = raw.get();
    const map: Record<string, number> = { ArrowLeft: v - 5, ArrowDown: v - 5, ArrowRight: v + 5, ArrowUp: v + 5, PageUp: v + 20, PageDown: v - 20, Home: 0, End: 100 };
    const nv = map[e.key];
    if (nv === undefined) return;
    e.preventDefault();
    stopAuto();
    setValue(nv);
  };

  // hover names both readings of a part (fine pointers only)
  const hover = (e: PointerEvent<SVGSVGElement>) => {
    if (e.pointerType !== 'mouse' || dragging.current) return;
    const node = (e.target as Element).closest?.('[data-tag]') as SVGRectElement | null;
    const box = stage.current?.getBoundingClientRect();
    if (!node || !box) { setTag(t => (t ? null : t)); return; }
    const r = node.getBoundingClientRect();
    const text = node.getAttribute('data-tag') ?? '';
    const x = ((r.left + r.width / 2 - box.left) / box.width) * 100;
    const y = ((r.top - box.top) / box.height) * 100;
    setTag(t => (t && t.text === text && Math.abs(t.x - x) < 0.2 && Math.abs(t.y - y) < 0.2 ? t : { text, x, y }));
  };

  return (
    <section className="signal two" id="signal" aria-labelledby="signal-h" ref={section}>
      <div className="signal__in">
        <ChapterLabel n="02" name="two readings" />
        <h2 id="signal-h" className="two__h">
          <span>A circuit board and an app screen can share one layout.</span>{' '}
          <span>Drag to read one drawing both ways.</span>
        </h2>

        <div className="two__stage" ref={stage} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <svg className="two__art" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false" onPointerMove={hover} onPointerLeave={() => setTag(null)}>
            <defs>
              {(['s', 'b'] as const).map(k => (
                <linearGradient key={k} id={`two-g${k}`} ref={k === 's' ? gradS : gradB} gradientUnits="userSpaceOnUse" x1={-ZONE / 2} y1="0" x2={ZONE / 2} y2="0">
                  {FADE.map(([o, l]) => <stop key={o} offset={o} stopColor={`hsl(0 0% ${(k === 's' ? l : 1 - l) * 100}%)`} />)}
                </linearGradient>
              ))}
              {(['s', 'b'] as const).map(k => (
                <mask key={k} id={`two-m${k}`} maskUnits="userSpaceOnUse" x="-400" y="0" width={W + 800} height={H}>
                  <rect x="-400" y="0" width={W + 800} height={H} fill={`url(#two-g${k})`} />
                </mask>
              ))}
              <linearGradient id="two-band" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" className="two__bs" stopOpacity="0" />
                <stop offset="0.5" className="two__bs" stopOpacity="0.13" />
                <stop offset="1" className="two__bs" stopOpacity="0" />
              </linearGradient>
              <clipPath id="two-clip"><rect x="0" y="0" width={W} height={H} /></clipPath>
            </defs>
            {ELEMENTS.map((e, i) => e.wide ? (
              <g key={i}>
                <g mask="url(#two-mb)"><rect ref={el => { wideB.current[i] = el; }} className="two__el" /></g>
                <g mask="url(#two-ms)"><rect ref={el => { wideS.current[i] = el; }} className="two__el" data-tag={e.tag} /></g>
              </g>
            ) : (
              <rect key={i} ref={el => { rects.current[i] = el; }} className="two__el" data-tag={e.tag} x={e.a.x} y={e.a.y} width={e.a.w} height={e.a.h} rx={e.a.r} />
            ))}
            <g className="two__silk">
              {TEXTS.map((x, i) => (
                <g key={i}>
                  <text ref={el => { labels.current[i * 2] = el; }} x={x.x} y={x.y} textAnchor={x.anchor} className="two__lbl">{x.a}</text>
                  <text ref={el => { labels.current[i * 2 + 1] = el; }} x={x.x} y={x.y} textAnchor={x.anchor} className="two__lbl two__lbl--ui" style={{ opacity: 0 }}>{x.b}</text>
                </g>
              ))}
            </g>
            <path ref={route} d={PULSE_PATH} fill="none" stroke="none" />
            <circle ref={dot} r="4.5" cx="36" cy="216" className="two__dot" style={{ opacity: 0 }} />
            <circle ref={ring} cx={PULSE_END.x} cy={PULSE_END.y} r="8" className="two__ring" style={{ opacity: 0 }} />
            <g clipPath="url(#two-clip)">
              <g ref={lensG} className="two__lens">
                <rect x={-ZONE / 2} y="20" width={ZONE} height="520" className="two__band" fill="url(#two-band)" />
                <line x1="0" y1="20" x2="0" y2="540" className="two__edge" />
              </g>
            </g>
          </svg>
          {tag && <span className="two__tag" style={{ left: `${tag.x}%`, top: `${tag.y}%` }}>{tag.text}</span>}
        </div>

        <div className="two__track" ref={track} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <div
            ref={handle} className="two__handle" role="slider" tabIndex={0}
            aria-label="Reveal: circuit board to app screen" aria-valuemin={0} aria-valuemax={100} aria-orientation="horizontal"
            aria-valuenow={Math.round(raw.get())} onKeyDown={key}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
              <rect x="3" y="9" width="6" height="6" rx="1" fill="currentColor" />
              <path d="M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="18" cy="12" r="3.2" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div className="two__foot">
          <span>board</span>
          <span className="two__quiet">Same drawing. Two readings.</span>
          <span>screen</span>
        </div>
      </div>
    </section>
  );
}
