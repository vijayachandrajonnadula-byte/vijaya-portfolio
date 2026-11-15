import { useEffect, type RefObject } from 'react';

/**
 * Fine-pointer only polish for a card: a soft cursor-follow highlight (--mx, --my) and a tilt of at
 * most 2deg (--rx, --ry). Handlers run only while the pointer is over the card, are rAF-throttled and
 * do nothing under reduced motion or on touch. Nothing runs continuously.
 */
export function useCardFx(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window.matchMedia !== 'function') return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || calm.matches) return;

    let raf = 0;
    let last: PointerEvent | null = null;
    let visible = true;
    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 })
      : null;
    io?.observe(el);

    const paint = () => {
      raf = 0;
      if (!last || !visible) return;
      const r = el.getBoundingClientRect();
      const px = (last.clientX - r.left) / r.width;
      const py = (last.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      el.style.setProperty('--ry', `${((px - 0.5) * 4).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${((0.5 - py) * 3).toFixed(2)}deg`);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      last = e;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const leave = () => {
      last = null;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      io?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
}
