import { useEffect, useState, type RefObject } from 'react';

/**
 * True while the referenced element intersects the viewport.
 *
 * Used to pause continuous animation (aurora drift, marquee, rAF loops) when
 * the element is off-screen, so nothing keeps burning frames below the fold.
 */
export function useOnScreen<T extends Element>(ref: RefObject<T>, rootMargin = '0px') {
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return onScreen;
}

/** True when the primary input can hover (mouse / trackpad), false on touch. */
export function useFinePointer() {
  const [fine, setFine] = useState(true);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return fine;
}
