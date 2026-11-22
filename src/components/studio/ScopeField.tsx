import { useEffect, useRef } from 'react';
import { useCalm } from '../../lib/calm';

const TRACES = 9;
const STEP = 7; // px between points

interface Pulse { x: number; y: number; t0: number }

/**
 * The hero's oscilloscope. Nine signal traces run across the glass, noisy by nature.
 * Around the pointer there is a "clean zone": traces flatten into straight lines and glow clay, which is the whole
 * idea of the site (signal first, then quiet). A click or tap sends a pulse through the traces.
 * Touch screens and idle mice get the clean zone driven along a slow path so the screen is never dead.
 *
 * Rules kept (AGENTS.md: no looping animation off-screen, respect reduced motion):
 * - The loop runs only while the hero is on screen and the tab is visible; otherwise it is cancelled.
 * - Under reduced motion it draws one still frame (calm lines, no noise) and never animates.
 * - Pointer input is read from the hero section itself and only from fine pointers (mouse or pen) plus taps.
 * - Canvas is decorative (aria-hidden) and is capped at 2x pixel ratio.
 */
export default function ScopeField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const calm = useCalm();

  useEffect(() => {
    const canvas = ref.current;
    const host = (canvas?.closest('.hhero__screen') ?? canvas?.closest('section')) as HTMLElement | null;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !host || !ctx) return;

    let w = 0, h = 0, dpr = 1;
    let raf = 0, running = false, onScreen = true;
    let px = -1, py = -1, lastMove = -1e9; // pointer target (css px, relative to canvas)
    let cx = 0, cy = 0, zone = 0; // smoothed clean-zone centre and strength
    const pulses: Pulse[] = [];
    const t0 = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (cx === 0 && cy === 0) { cx = w * 0.7; cy = h * 0.45; }
      if (!running) draw(0);
    };

    const rail = (i: number) => h * (0.1 + (0.8 * i) / (TRACES - 1));

    function draw(time: number) {
      const t = time / 1000;
      ctx!.clearRect(0, 0, w, h);
      const sigma = Math.max(150, Math.min(w, h) * 0.28);
      // the pointer's clean zone glow
      if (zone > 0.01) {
        const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, sigma * 1.5);
        g.addColorStop(0, `rgba(240,138,116,${0.16 * zone})`); g.addColorStop(1, 'rgba(240,138,116,0)');
        ctx!.fillStyle = g; ctx!.fillRect(0, 0, w, h);
      }
      for (let i = 0; i < TRACES; i++) {
        const y0 = rail(i);
        const amp = 10 + (i % 3) * 7;
        const dim = new Path2D();
        let run: Path2D | null = null;
        let started = false;
        for (let x = -STEP; x <= w + STEP; x += STEP) {
          const dx = x - cx, dy = y0 - cy;
          const clean = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma)) * zone;
          // sum of sines plus a little high-frequency chatter: the "noise"
          let n =
            Math.sin(x * 0.011 + t * (0.6 + i * 0.07) + i * 1.7) * amp +
            Math.sin(x * 0.027 - t * 1.1 + i * 0.9) * amp * 0.55 +
            Math.sin(x * 0.083 + t * 3.1 + i) * amp * 0.22 +
            Math.sin(x * 0.4 + t * 9 + i * 2) * 1.4;
          for (const p of pulses) {
            const age = t - p.t0, d = Math.hypot(x - p.x, y0 - p.y);
            const front = age * 520;
            if (d < front + 60) n += Math.sin((d - front) * 0.07) * 30 * Math.exp(-age * 1.5) * Math.exp(-Math.abs(d - front) / 90);
          }
          const y = y0 + n * (1 - clean * 0.97);
          if (x === -STEP) dim.moveTo(x, y); else dim.lineTo(x, y);
          if (clean > 0.12) {
            if (!started) { run = run ?? new Path2D(); run.moveTo(x, y); started = true; } else run!.lineTo(x, y);
          } else started = false;
        }
        ctx!.lineWidth = 1.2;
        ctx!.strokeStyle = `rgba(127,157,255,${0.12 + (i % 3) * 0.04})`;
        ctx!.stroke(dim);
        if (run && zone > 0.02) {
          ctx!.lineWidth = 3; ctx!.strokeStyle = `rgba(240,138,116,${0.18 * zone})`; ctx!.stroke(run);
          ctx!.lineWidth = 1.4; ctx!.strokeStyle = `rgba(255,214,200,${0.85 * zone})`; ctx!.stroke(run);
        }
      }
    }

    function frame(now: number) {
      raf = 0;
      if (!running) return;
      const t = (now - t0) / 1000;
      const idle = now - lastMove > 2200;
      let tx = px, ty = py, target = 1;
      if (px < 0 || idle) { // no pointer yet, a touch screen, or a still mouse: drive the zone along a slow path
        tx = w * (0.62 + 0.3 * Math.sin(t * 0.23));
        ty = h * (0.5 + 0.3 * Math.sin(t * 0.31 + 1.2));
        target = 0.9;
      }
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07; zone += (target - zone) * 0.05;
      for (let i = pulses.length - 1; i >= 0; i--) if (t - pulses[i].t0 > 3) pulses.splice(i, 1);
      draw(now - t0);
      raf = requestAnimationFrame(frame);
    }

    const start = () => { if (running || calm || !onScreen || document.visibilityState !== 'visible') return; running = true; raf = requestAnimationFrame(frame); };
    const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };

    const local = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
    const move = (e: PointerEvent) => { if (e.pointerType === 'touch') return; [px, py] = local(e); lastMove = performance.now(); };
    const leave = () => { px = -1; py = -1; };
    const down = (e: PointerEvent) => { if ((e.target as HTMLElement).closest('a,button,[role="button"]')) return; const [x, y] = local(e); pulses.push({ x, y, t0: (performance.now() - t0) / 1000 }); if (e.pointerType === 'touch') { px = x; py = y; lastMove = performance.now(); } };

    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { onScreen = !!e?.isIntersecting; onScreen ? start() : stop(); });
    io.observe(host);
    const vis = () => (document.visibilityState === 'visible' ? start() : stop());
    document.addEventListener('visibilitychange', vis);

    if (calm) { zone = 0.9; cx = w * 0.7; cy = h * 0.45; draw(0); }
    else {
      host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave); host.addEventListener('pointerdown', down);
      resize(); start();
    }
    if (calm) resize();

    return () => {
      stop(); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', vis);
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); host.removeEventListener('pointerdown', down);
    };
  }, [calm]);

  return <canvas ref={ref} className="scope" aria-hidden="true" />;
}
