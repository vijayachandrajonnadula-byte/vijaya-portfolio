import { useEffect, useRef, useState } from 'react';
import { useBeat } from '../Beat';

/**
 * "signal vs noise", drawn literally. Behind the words: a field of broken, jittering dashes. As the words light up (scrubbed by the
 * beat's `read`) the dashes close into lines, the jitter dies down and the lines settle into straight, evenly spaced parallels.
 * One line never wavers: it runs into Clay's LED eye, the single steady dot, and a ring tightens around it as everything resolves.
 *
 * SVG only. The jitter is time-based but runs at ~24fps, only while the beat is on screen and only until the field has resolved;
 * scrolling back un-resolves it (the loop restarts). Decorative (aria-hidden); the real text is in the article.
 */
const K = 52; // points per line

const hash = (a: number) => { const s = Math.sin(a * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const smooth = (t: number) => { const x = Math.min(1, Math.max(0, t)); return x * x * (3 - 2 * x); };

export default function SignalField() {
  const { read, active, leave, enter } = useBeat();
  const box = useRef<HTMLDivElement>(null);
  const lines = useRef<(SVGPathElement | null)[]>([]);
  const sig = useRef<SVGPathElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const [size, setSize] = useState({ w: 1440, h: 900 });
  const act = useRef(active);
  const raf = useRef(0);
  const draw = useRef<(t: number) => boolean>(() => false);

  const narrow = size.w < 700;
  const N = narrow ? 11 : 15;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => { const r = e!.contentRect; if (r.width) setSize({ w: Math.round(r.width), h: Math.round(r.height) }); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // one draw function, rebuilt when the size changes; returns true while it still needs frames
  useEffect(() => {
    const { w, h } = size;
    const top = h * 0.1, bottom = h * 0.9;
    const amp0 = Math.min(34, h * 0.045);
    const rows = Array.from({ length: N }, (_, i) => ({
      even: top + ((bottom - top) * i) / (N - 1),
      wander: (hash(i * 7.7) - 0.5) * (bottom - top) * 0.11,
      ph: hash(i * 3.1) * 6.28, f: 0.006 + hash(i * 5.3) * 0.006, sp: 0.5 + hash(i * 2.9) * 0.9, dash: 7 + hash(i * 9.1) * 12,
    }));
    draw.current = (t: number) => {
      const c = smooth((read.get() - 0.08) / 0.8); // 0 noise .. 1 signal
      const fr = Math.floor(t / 42);
      for (let i = 0; i < N; i++) {
        const p = lines.current[i];
        if (!p) continue;
        const r = rows[i]!;
        const base = r.even + r.wander * (1 - c);
        const amp = amp0 * (1 - c) * (1 - c * 0.4);
        let d = '';
        for (let k = 0; k < K; k++) {
          const x = (w * k) / (K - 1);
          const wave = Math.sin(x * r.f + r.ph + (t / 1000) * r.sp) * 0.7 + Math.sin(x * r.f * 2.7 - r.ph - (t / 1000) * r.sp * 1.3) * 0.3;
          const spike = (hash(i * 97 + k * 13 + fr * 7.31) - 0.5) * 2;
          const y = base + amp * (wave * 0.8 + spike * 0.55);
          d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
        }
        p.setAttribute('d', d);
        const gap = r.dash * 1.5 * Math.pow(1 - c, 1.2);
        if (gap < 0.4) p.removeAttribute('stroke-dasharray'); else { p.setAttribute('stroke-dasharray', `${(r.dash + c * 60).toFixed(1)} ${gap.toFixed(1)}`); p.setAttribute('stroke-dashoffset', ((t / 1000) * 30 * (1 - c)).toFixed(1)); }
        p.style.opacity = String(0.55 + 0.45 * c);
      }
      // the steady line into the eye
      const scene = box.current?.parentElement, stage = box.current;
      const eye = scene?.querySelector('.clay__look') as SVGGElement | null;
      if (eye && stage && sig.current && ring.current) {
        const a = eye.getBoundingClientRect(), s = stage.getBoundingClientRect();
        const ex = a.left + a.width / 2 - s.left, ey = a.top + a.height / 2 - s.top;
        const start = Math.max(0, ex - Math.min(420, Math.max(110, w * 0.3)));
        sig.current.setAttribute('d', `M${start.toFixed(1)} ${ey.toFixed(1)}L${(ex - a.width * (1.1 - 0.5 * c)).toFixed(1)} ${ey.toFixed(1)}`);
        const fade = 1 - Math.min(1, leave.get() * 2.5); // the steady parts leave first, before Clay hops away
        sig.current.style.opacity = String((0.35 + 0.65 * c) * fade);
        const rr = a.width * (1.1 - 0.5 * c);
        ring.current.setAttribute('cx', ex.toFixed(1)); ring.current.setAttribute('cy', ey.toFixed(1)); ring.current.setAttribute('r', rr.toFixed(1));
        ring.current.style.opacity = String((0.25 + 0.55 * c) * fade);
      }
      const lv = leave.get(), en = enter.get();
      return c < 0.995 || (lv > 0 && lv < 1) || en < 1;
    };
    draw.current(performance.now());
  }, [size, N, read, leave, enter]);

  useEffect(() => {
    act.current = active;
    let last = 0;
    const tick = (t: number) => {
      raf.current = 0;
      if (!act.current) return;
      if (t - last < 40) { raf.current = requestAnimationFrame(tick); return; } // ~24fps
      last = t;
      if (draw.current(t)) raf.current = requestAnimationFrame(tick);
    };
    const go = () => { if (act.current && !raf.current) raf.current = requestAnimationFrame(tick); };
    if (active) go();
    const offs = [read.on('change', go), leave.on('change', go), enter.on('change', go)];
    return () => { offs.forEach(f => f()); if (raf.current) { cancelAnimationFrame(raf.current); raf.current = 0; } };
  }, [active, read, leave, enter]);

  return (
    <>
      <div ref={box} className="v2-signal" aria-hidden="true">
        <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} focusable="false">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {Array.from({ length: N }, (_, i) => <path key={i} ref={el => { lines.current[i] = el; }} />)}
          </g>
        </svg>
      </div>
      {/* above Clay: the one line that never wavers, and the ring that tightens around the eyes */}
      <div className="v2-signal v2-signal--top" aria-hidden="true">
        <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} focusable="false">
          <g fill="none" stroke="currentColor">
            <path ref={sig} strokeWidth="2.6" strokeLinecap="round" />
            <circle ref={ring} strokeWidth="1.8" />
          </g>
        </svg>
      </div>
    </>
  );
}
