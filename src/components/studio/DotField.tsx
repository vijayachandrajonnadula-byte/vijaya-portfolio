import { useEffect, useRef } from 'react';
import { useCalm } from '../../lib/calm';

interface Pulse { x: number; y: number; t0: number }

/**
 * The hero's background: a quiet grid of dots, like the pixels of a screen that has not been designed yet.
 * Around the pointer the dots swell, glow clay and lean away from it, as if a lens were resting on the glass.
 * A click or tap sends one ring through the grid. A very slow diagonal shimmer keeps it alive when nobody is touching it.
 * Touch screens and an idle mouse get the lens driven along a slow path, so the screen is never dead.
 *
 * Rules kept (AGENTS.md: no looping animation off-screen, respect reduced motion):
 * - The loop runs only while the hero is on screen and the tab is visible; otherwise it is cancelled.
 * - Under reduced motion it draws one still frame (a soft lens, no shimmer) and never animates.
 * - Pointer input is read from the hero screen only, and only from mouse or pen (plus taps for the ring).
 * - The canvas is decorative (aria-hidden), capped at 2x pixel ratio, and costs about 1,500 small circles per frame.
 */
export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const calm = useCalm();

  useEffect(() => {
    const canvas = ref.current;
    const host = (canvas?.closest('.hhero__screen') ?? canvas?.closest('section')) as HTMLElement | null;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !host || !ctx) return;

    let w = 0, h = 0, dpr = 1, gap = 30;
    let raf = 0, running = false, onScreen = true;
    let px = -1, py = -1, lastMove = -1e9;
    let cx = 0, cy = 0, zone = 0;
    const pulses: Pulse[] = [];
    const t0 = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
      gap = w < 700 ? 24 : 30;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (cx === 0 && cy === 0) { cx = w * 0.72; cy = h * 0.45; }
      if (!running) draw(0, true);
    };

    function draw(ms: number, still = false) {
      const t = ms / 1000;
      ctx!.clearRect(0, 0, w, h);
      const sigma = Math.max(170, Math.min(w, h) * 0.3);
      const cols = Math.ceil(w / gap) + 1, rows = Math.ceil(h / gap) + 1;
      const ox = (w - (cols - 1) * gap) / 2, oy = (h - (rows - 1) * gap) / 2;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const bx = ox + i * gap, by = oy + j * gap;
          const dx = bx - cx, dy = by - cy;
          const d2 = dx * dx + dy * dy;
          const lens = Math.exp(-d2 / (2 * sigma * sigma)) * zone;
          let ring = 0;
          for (const p of pulses) {
            const age = t - p.t0, d = Math.hypot(bx - p.x, by - p.y), front = age * 480;
            const e = (d - front) / 46;
            ring += Math.exp(-e * e) * Math.exp(-age * 1.3);
          }
          const shimmer = still ? 0 : 0.5 + 0.5 * Math.sin((bx + by) * 0.009 - t * 0.7);
          // lean away from the lens centre, a little
          const dist = Math.sqrt(d2) || 1;
          const push = (lens * 9 + ring * 7) / dist;
          const x = bx + dx * push, y = by + dy * push;
          const r = 1 + lens * 1.9 + ring * 1.7 + shimmer * 0.25;
          const a = 0.16 + shimmer * 0.07 + lens * 0.72 + ring * 0.5;
          // colour: cool blue-grey at rest, clay under the lens
          const k = Math.min(1, lens * 1.15 + ring);
          const rC = Math.round(150 + (240 - 150) * k), gC = Math.round(172 + (138 - 172) * k), bC = Math.round(255 + (116 - 255) * k);
          ctx!.fillStyle = `rgba(${rC},${gC},${bC},${Math.min(1, a).toFixed(3)})`;
          ctx!.beginPath(); ctx!.arc(x, y, r, 0, 6.2832); ctx!.fill();
        }
      }
    }

    function frame(now: number) {
      raf = 0;
      if (!running) return;
      const t = (now - t0) / 1000;
      const idle = now - lastMove > 2200;
      let tx = px, ty = py, target = 1;
      if (px < 0 || idle) {
        tx = w * (0.64 + 0.26 * Math.sin(t * 0.21));
        ty = h * (0.5 + 0.26 * Math.sin(t * 0.29 + 1.2));
        target = 0.85;
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
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a,button,[role="button"]')) return;
      const [x, y] = local(e);
      pulses.push({ x, y, t0: (performance.now() - t0) / 1000 });
      if (e.pointerType === 'touch') { px = x; py = y; lastMove = performance.now(); }
    };

    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { onScreen = !!e?.isIntersecting; if (onScreen) start(); else stop(); });
    io.observe(host);
    const vis = () => { if (document.visibilityState === 'visible') start(); else stop(); };
    document.addEventListener('visibilitychange', vis);

    zone = calm ? 0.9 : 0;
    if (!calm) {
      host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave); host.addEventListener('pointerdown', down);
    }
    resize();
    start();

    return () => {
      stop(); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', vis);
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); host.removeEventListener('pointerdown', down);
    };
  }, [calm]);

  return <canvas ref={ref} className="scope" aria-hidden="true" />;
}
