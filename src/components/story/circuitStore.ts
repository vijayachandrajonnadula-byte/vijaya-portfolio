import { useSyncExternalStore } from 'react';

/**
 * Tiny shared state for the one circuit on the home page.
 * - `active`: the Trace is mounted (home page only).
 * - `closed`: the visitor pressed the contact switch. The footer LED is the "message sent" light, so it follows this
 *   flag and nothing else. Persisted for the browser session so a reload does not reopen the circuit.
 */
type S = { active: boolean; closed: boolean };

const KEY = 'vj-circuit-closed';
const read = (): boolean => { try { return window.sessionStorage.getItem(KEY) === '1'; } catch { return false; } };
const write = (v: boolean) => { try { if (v) window.sessionStorage.setItem(KEY, '1'); else window.sessionStorage.removeItem(KEY); } catch { /* storage blocked: state still works in memory */ } };

let state: S = { active: false, closed: typeof window === 'undefined' ? false : read() };
const subs = new Set<() => void>();

export function setCircuit(p: Partial<S>) {
  const next = { ...state, ...p };
  if (next.active === state.active && next.closed === state.closed) return;
  state = next;
  subs.forEach(f => f());
}

export function closeCircuit() { write(true); setCircuit({ closed: true }); }
export function openCircuit() { write(false); setCircuit({ closed: false }); }

export function useCircuit(): S {
  return useSyncExternalStore(
    cb => { subs.add(cb); return () => { subs.delete(cb); }; },
    () => state,
    () => state,
  );
}
