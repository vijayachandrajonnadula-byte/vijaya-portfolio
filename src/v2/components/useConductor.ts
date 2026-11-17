import { useEffect } from 'react';
import { beats } from '../data/brief';
import { goTo, next, prev, measure } from '../film';

/**
 * The keyboard conductor. Space / PageDown / ArrowDown: next beat. Shift+Space / PageUp / ArrowUp: previous.
 * Home / End: first / last. I: index. R: raw file. It never acts while an overlay is open, while typing, on key
 * repeat, with Ctrl/Meta/Alt, and Space is left alone on buttons and links (so they still activate).
 * Everything goes through window.scrollTo (native); nothing intercepts the wheel or touch.
 */
export function useConductor({ blocked, onIndex, onRaw }: { blocked: boolean; onIndex: () => void; onRaw: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (blocked || e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const onControl = !!t?.closest?.('button, a[href], summary, [role="button"]');
      const k = e.key;
      let handled = true;
      if (k === ' ' || k === 'Spacebar') { if (onControl) return; e.shiftKey ? prev() : next(); }
      else if (k === 'PageDown' || k === 'ArrowDown') next();
      else if (k === 'PageUp' || k === 'ArrowUp') prev();
      else if (k === 'Home') goTo(0);
      else if (k === 'End') goTo(beats.length - 1);
      else if (!e.shiftKey && (k === 'i' || k === 'I')) onIndex();
      else if (!e.shiftKey && (k === 'r' || k === 'R')) onRaw();
      else handled = false;
      if (handled) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [blocked, onIndex, onRaw]);

  // keep the "current beat" up to date from plain scroll position
  useEffect(() => {
    let raf = 0;
    const tick = () => { raf = 0; measure(); };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
  }, []);
}
