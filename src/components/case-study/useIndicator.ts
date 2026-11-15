import { useLayoutEffect, type RefObject } from 'react';

/**
 * Keeps --ind-y / --ind-h on a list element in step with its active link, so a single
 * indicator element can slide between items with a transform transition.
 * `list` must be position: relative; the active link is found with `selector`.
 */
export function useIndicator(list: RefObject<HTMLElement>, selector: string, dep: unknown) {
  useLayoutEffect(() => {
    const box = list.current;
    if (!box) return;
    const measure = () => {
      const a = box.querySelector<HTMLElement>(selector);
      if (!a) { box.style.setProperty('--ind-h', '0px'); return; }
      let y = 0;
      let n: HTMLElement | null = a;
      while (n && n !== box) { y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
      box.style.setProperty('--ind-y', `${y}px`);
      box.style.setProperty('--ind-h', `${a.offsetHeight}px`);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [list, selector, dep]);
}
