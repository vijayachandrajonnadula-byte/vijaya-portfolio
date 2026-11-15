import { useSyncExternalStore } from 'react';

/** Tiny shared state between the Trace (which measures scroll) and the footer LED. */
type S = { active: boolean; complete: boolean };
let state: S = { active: false, complete: false };
const subs = new Set<() => void>();

export function setCircuit(p: Partial<S>) {
  const next = { ...state, ...p };
  if (next.active === state.active && next.complete === state.complete) return;
  state = next;
  subs.forEach(f => f());
}

export function useCircuit(): S {
  return useSyncExternalStore(
    cb => { subs.add(cb); return () => { subs.delete(cb); }; },
    () => state,
    () => state,
  );
}
