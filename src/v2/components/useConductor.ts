import { useEffect, useRef } from 'react';
import { isCalm } from '../../lib/calm';
import { beats } from '../data/brief';
import { goTo, landing, measure } from '../film';

/**
 * The keyboard conductor. Space / PageDown / ArrowDown: next. Shift+Space / PageUp / ArrowUp: previous.
 * Home / End: first / last. I: index. R: raw file. It never acts while an overlay is open, while typing, on key
 * repeat, with Ctrl/Meta/Alt, and Space is left alone on buttons and links (so they still activate).
 * Everything goes through window.scrollTo (native); nothing intercepts the wheel or touch.
 *
 * Space is predictable:
 *  - inside a long beat whose words are not all lit yet, the first press reads on to the end of the beat (everything lit);
 *  - the next press goes to the next beat (its landing point). Shift+Space walks the same steps backwards.
 *  - presses made while a smooth scroll is still travelling continue from where it is GOING, not from where it is now,
 *    so three quick presses are three steps, never two and a half.
 */
const vh = () => window.innerHeight;
const top = (i: number) => { const el = document.getElementById(beats[i]!.id); return el ? el.getBoundingClientRect().top + window.scrollY : 0; };
/** scroll position where the beat's text is fully lit (read = 1) */
const fullY = (i: number) => top(i) + (beats[i]!.length - 1.1) * vh();
/** which beat covers the middle of the viewport when scrolled to y */
const indexAt = (y: number) => { const mid = y + vh() * 0.5; let idx = 0; for (let i = 0; i < beats.length; i++) if (top(i) <= mid) idx = i; return idx; };
const maxY = () => document.documentElement.scrollHeight - vh();

export function useConductor({ blocked, onIndex, onRaw }: { blocked: boolean; onIndex: () => void; onRaw: () => void }) {
  const target = useRef<{ y: number; until: number } | null>(null);

  useEffect(() => {
    const scrollTo = (y: number) => {
      const yy = Math.max(0, Math.min(maxY(), Math.round(y)));
      target.current = { y: yy, until: performance.now() + 1100 };
      window.scrollTo({ top: yy, behavior: isCalm() ? 'auto' : 'smooth' });
    };
    const here = () => (target.current && performance.now() < target.current.until ? target.current.y : window.scrollY);

    const step = (dir: 1 | -1) => {
      const y = here();
      const i = indexAt(y);
      const land = landing(i);
      if (dir === 1) {
        const full = Math.min(fullY(i), maxY());
        if (i > 0 && y < land - 40) { scrollTo(land); return; } // entered the beat from above: settle on it first
        // a long beat, not yet fully read: read on first
        if (i > 0 && full - Math.max(y, land) > vh() * 0.3 && y < full - 40) { scrollTo(Math.max(full, land)); return; }
        if (i >= beats.length - 1) return;
        scrollTo(landing(i + 1));
      } else {
        const full = Math.min(fullY(i), maxY());
        if (i > 0 && y > full + 40 && full > land + vh() * 0.3) { scrollTo(full); return; } // from beyond the read point back to it
        if (i > 0 && y > land + 40 && full - land > vh() * 0.3 && y <= full + 40) { scrollTo(land); return; }
        if (i > 0 && y > land + 60) { scrollTo(land); return; }
        if (i === 0) { scrollTo(0); return; }
        // back to the previous beat: its fully-read point if it is a long one (that is where you left it), else its landing
        const p = i - 1;
        scrollTo(p > 0 && fullY(p) - landing(p) > vh() * 0.3 ? Math.min(fullY(p), maxY()) : landing(p));
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (blocked || e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const onControl = !!t?.closest?.('button, a[href], summary, [role="button"]');
      const k = e.key;
      let handled = true;
      if (k === ' ' || k === 'Spacebar') { if (onControl) return; step(e.shiftKey ? -1 : 1); }
      else if (k === 'PageDown' || k === 'ArrowDown') step(1);
      else if (k === 'PageUp' || k === 'ArrowUp') step(-1);
      else if (k === 'Home') scrollTo(0);
      else if (k === 'End') goTo(beats.length - 1);
      else if (!e.shiftKey && (k === 'i' || k === 'I')) onIndex();
      else if (!e.shiftKey && (k === 'r' || k === 'R')) onRaw();
      else handled = false;
      if (handled) e.preventDefault();
    };
    // a manual scroll (wheel, touch, scrollbar) cancels the remembered target
    const forget = () => { target.current = null; };
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', forget, { passive: true });
    window.addEventListener('touchstart', forget, { passive: true });
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('wheel', forget); window.removeEventListener('touchstart', forget); };
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
