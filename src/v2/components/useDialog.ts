import { useEffect, type RefObject } from 'react';

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

/**
 * A small focus trap for a modal dialog: moves focus in on open, keeps Tab inside, closes on Esc, and hands focus
 * back to whatever opened it. `onClose` should be stable or the effect re-binds (harmless).
 */
export function useDialog(open: boolean, ref: RefObject<HTMLElement>, onClose: () => void, firstFocus?: () => HTMLElement | null) {
  useEffect(() => {
    if (!open) return;
    const root = ref.current;
    const opener = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => {
      const target = firstFocus?.() ?? root?.querySelector<HTMLElement>(FOCUSABLE) ?? root;
      target?.focus({ preventScroll: true });
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); return; }
      if (e.key !== 'Tab' || !root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => el.offsetParent !== null || el === document.activeElement);
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0]!, last = items[items.length - 1]!;
      const act = document.activeElement as HTMLElement | null;
      if (!act || !root.contains(act)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return; }
      if (e.shiftKey && act === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && act === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey, true);
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
}
