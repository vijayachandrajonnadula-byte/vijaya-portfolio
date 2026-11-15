import { useEffect, useRef } from 'react';

const W = 1000;
const H = 36;
const N = 90;
const MID = H / 2;

// deterministic jitter so SSR/refresh never differ
const noise = Array.from({ length: N + 1 }, (_, i) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
});

function pathAt(t: number) {
  let d = '';
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * W;
    const sine = Math.sin((i / N) * Math.PI * 2 * 4) * 7;
    // envelope: noise settles from left to right as t advances
    const settle = Math.min(1, Math.max(0, t * 1.6 - (i / N) * 0.6));
    const y = MID + sine + (1 - settle) * noise[i]! * 15;
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
}

/**
 * "Noise to signal" chapter divider: a jagged line that settles into a clean sine once, when it
 * scrolls into view. Static clean wave under reduced motion. Purely decorative (aria-hidden).
 */
export default function SignalDivider({ className }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const line = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = svg.current;
    const p = line.current;
    if (!el || !p) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') { p.setAttribute('d', pathAt(1)); return; }
    p.setAttribute('d', pathAt(0));
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / 1400);
        const eased = 1 - Math.pow(1 - k, 3);
        p.setAttribute('d', pathAt(eased));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <svg
      ref={svg}
      className={`cs-signal${className ? ` ${className}` : ''}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path ref={line} d={pathAt(1)} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
