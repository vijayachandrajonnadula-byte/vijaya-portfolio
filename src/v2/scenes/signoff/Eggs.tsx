import { useCallback, useEffect, useRef, useState } from 'react';
import { EMAIL, useNote, writeClipboard } from '../../components/s3/copy';
import '../../styles/s3-signoff.css';

/**
 * The two quiet easter eggs of the last room, both announced by one hint line in the scene:
 *   type "help"  -> a small `> man vijay` card listing the keyboard shortcuts
 *   press "c"    -> copies the email address, with a toast
 * They only listen while the sign-off is on screen, never inside inputs, never while a modal dialog is open, never with
 * modifier keys or on key repeat. The help card is a labelled, non-modal dialog: focus moves to its close button and Esc
 * hands it back.
 */

const KEYS: [string, string][] = [
  ['space', 'next scene'],
  ['shift + space', 'previous scene'],
  ['home / end', 'first / last scene'],
  ['i', 'the index of cards'],
  ['r', 'the raw VIJAY.md'],
  ['c', 'copy my email (here)'],
  ['esc', 'close what is open'],
];

export function useSignoffEggs(active: boolean) {
  const [help, setHelp] = useState(false);
  const { note, say } = useNote(3200);
  const buf = useRef('');
  const reset = useRef(0);

  const copy = useCallback(async () => {
    say((await writeClipboard(EMAIL)) ? `Copied ${EMAIL}` : `Copy is blocked here. The address is ${EMAIL}`);
  }, [say]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      const k = e.key.toLowerCase();
      window.clearTimeout(reset.current);
      reset.current = window.setTimeout(() => { buf.current = ''; }, 1600);
      buf.current = (buf.current + k).slice(-4);
      if (buf.current === 'help') { buf.current = ''; setHelp(true); }
      else if (k === 'c' && !e.shiftKey) void copy();
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); window.clearTimeout(reset.current); };
  }, [active, copy]);

  // leaving the scene closes the card
  useEffect(() => { if (!active) setHelp(false); }, [active]);
  return { help, setHelp, note, copy };
}

export function HelpCard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const x = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    x.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); }
      else if (e.key === 'Tab') { e.preventDefault(); x.current?.focus(); } // one control: keep focus on it until closed
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div ref={box} className="s3-man" role="dialog" aria-modal="false" aria-labelledby="s3-man-t">
      <p className="s3-man__t" id="s3-man-t"><span aria-hidden="true">&gt; </span>man vijay</p>
      <p className="s3-man__d">vijay: designer, ex-electronics. last room of the film.</p>
      <dl className="s3-man__k">
        {KEYS.map(([k, d]) => (<div key={k}><dt><kbd>{k}</kbd></dt><dd>{d}</dd></div>))}
      </dl>
      <button ref={x} type="button" className="s3-man__x" onClick={onClose}>close (esc)</button>
    </div>
  );
}
