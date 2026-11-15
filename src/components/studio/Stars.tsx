import { useEffect, useRef } from 'react';

/**
 * A quiet star field behind dark sections: small white points that twinkle, and a few orange
 * crosses. Canvas 2D, pixel ratio 1, runs only while on screen, one still frame under
 * prefers-reduced-motion.
 */
export default function Stars({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0;
    type Star = { x: number; y: number; r: number; a: number; s: number; p: number; cross: boolean };
    let stars: Star[] = [];

    const build = () => {
      w = parent.clientWidth; h = parent.clientHeight;
      canvas.width = w; canvas.height = h;
      const n = Math.round((w * h) / 9000 * density);
      stars = Array.from({ length: n }, () => {
        const cross = Math.random() < 0.035;
        return { x: Math.random() * w, y: Math.random() * h, r: cross ? 4 : Math.random() < 0.06 ? 1.8 : Math.random() * 1.1 + 0.3, a: Math.random() * 0.6 + 0.25, s: Math.random() * 1.2 + 0.3, p: Math.random() * 6.28, cross };
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = reduced ? 1 : 0.6 + 0.4 * Math.sin(t * 0.001 * s.s + s.p);
        if (s.cross) {
          ctx.strokeStyle = `rgba(255,92,58,${0.55 * tw})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(s.x - s.r, s.y); ctx.lineTo(s.x + s.r, s.y); ctx.moveTo(s.x, s.y - s.r); ctx.lineTo(s.x, s.y + s.r); ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(255,255,255,${s.a * tw})`;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
        }
      }
    };

    build(); draw(0);
    const ro = new ResizeObserver(() => { build(); draw(0); });
    ro.observe(parent);

    let raf = 0;
    const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => {
      if (reduced) return;
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);
      if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(parent);
    return () => { io.disconnect(); ro.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [density]);

  return <canvas ref={ref} className="stars" aria-hidden="true" />;
}
