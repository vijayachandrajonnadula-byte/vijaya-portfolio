import { useCallback, useEffect, useRef, useState } from 'react';
import { profile } from '../../../data/profile';

export const EMAIL = profile.email;
export const MAIL = `mailto:${profile.email}?subject=${encodeURIComponent('Hello from your portfolio')}`;

/** Writes to the clipboard. Resolves false when the browser blocks it. */
export async function writeClipboard(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

/** A message that clears itself. `say` shows it for `ms`. Used for polite status lines ("Copied"). */
export function useNote(ms = 3500) {
  const [note, setNote] = useState('');
  const t = useRef(0);
  useEffect(() => () => window.clearTimeout(t.current), []);
  const say = useCallback((m: string) => {
    window.clearTimeout(t.current);
    setNote(m);
    t.current = window.setTimeout(() => setNote(''), ms);
  }, [ms]);
  return { note, say };
}

/** Opens the visitor's mail app through a real anchor click, so it behaves exactly like a mailto link. */
export function openMail() {
  const a = document.createElement('a');
  a.href = MAIL;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
