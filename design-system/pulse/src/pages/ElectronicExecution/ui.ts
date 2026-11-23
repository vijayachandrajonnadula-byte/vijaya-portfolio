/**
 * NOT FROM FIGMA. UI state of the Electronic Execution page (which panel/overlay is open, layout mode).
 * Domain state lives in store.ts; this file only holds presentation state so the three UI groups
 * (shell, dialogs, actions) can open each other's surfaces without importing each other.
 */
import { useSyncExternalStore } from 'react';

/** Every overlay surface. Owners: shell = none; dialogs = sign..history; actions = status..aiAgent. */
export type OverlayName =
  | 'sign' // e-signature for recording a step (payload: { stepIds: string[] })
  | 'verify' // verify a table (payload: { table: number })
  | 'markNA' // mark steps N/A (payload: { stepIds: string[] })
  | 'editReason' // reason for editing a recorded step (payload: { stepId: string })
  | 'discrepancyPrompt' // "Raise a discrepancy?" after a Fail (payload: { stepId: string })
  | 'unsavedGuard' // unsaved changes guard (payload: { nextStepId: string })
  | 'evidence' // evidence drawer (payload: { stepId?: string })
  | 'evidenceViewer' // full-size viewer (payload: { evidenceId: string, ids?: string[] })
  | 'evidenceGallery' // full-viewport gallery with detail column (payload: { evidenceId?: string })
  | 'fileSlider' // 560px file slider (payload: { evidenceId: string, ids?: string[] })
  | 'capture' // sample capture modal (payload: { kind: 'screenshot' | 'snapshot' | 'video' })
  | 'upload' // upload attachment modal (payload: { tab?: 'external' | 'vault' })
  | 'history' // execution history of a step (payload: { stepId: string })
  | 'status' // execution status slider with KPI cards
  | 'details' // document details + audit table
  | 'metrics' // metrics donuts and bars
  | 'discrepancies' // view / create discrepancies
  | 'split' // split execution
  | 'verifyAssign' // verification assignment
  | 'aiAgent' // AI agent panel
  | 'annotations' // annotation report (UI-only: the sample keeps no annotations)
  | 'route' // route to peer review / review / approval confirm (payload: { to: 'peer' | 'review' | 'approval' }; UI-only)
  | 'editDocument' // floating edit-document bar (UI-only: the sample keeps no document edits)
  | 'taskTransfer' // task transfer panel (UI-only)
  | 'copyResult'; // copy result panel (UI-only)

export type PanelDock = 'left' | 'right' | 'top' | 'bottom';
export type ExecLayout = 'panel' | 'inline';

export interface OverlayState {
  name: OverlayName;
  payload?: Record<string, unknown>;
}

export interface UiState {
  overlay: OverlayState | null;
  /** More than one surface can stack (e.g. viewer over evidence drawer): last is on top. */
  stack: OverlayState[];
  layout: ExecLayout;
  dock: PanelDock;
  panelCollapsed: boolean;
  panelFullscreen: boolean;
  /** Table shown in the document pane (1-based) or 'all'. */
  tableFilter: number | 'all';
  zoom: number;
  toast: { id: number; kind: 'success' | 'error' | 'warn' | 'ai'; text: string } | null;
}

let state: UiState = { overlay: null, stack: [], layout: 'panel', dock: 'left', panelCollapsed: true, panelFullscreen: false, tableFilter: 'all', zoom: 100, toast: null };
const listeners = new Set<() => void>();
const emit = (next: UiState) => { state = next; listeners.forEach((l) => l()); };
let toastId = 0;

export const ui = {
  getState: () => state,
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
  open(name: OverlayName, payload?: Record<string, unknown>) {
    const o = { name, payload };
    emit({ ...state, overlay: o, stack: [...state.stack.filter((s) => s.name !== name), o] });
  },
  close(name?: OverlayName) {
    const stack = name ? state.stack.filter((s) => s.name !== name) : state.stack.slice(0, -1);
    emit({ ...state, stack, overlay: stack[stack.length - 1] ?? null });
  },
  closeAll() { emit({ ...state, stack: [], overlay: null }); },
  isOpen: (name: OverlayName) => state.stack.some((s) => s.name === name),
  payload: <T = Record<string, unknown>>(name: OverlayName) => state.stack.find((s) => s.name === name)?.payload as T | undefined,
  set(patch: Partial<Omit<UiState, 'overlay' | 'stack' | 'toast'>>) { emit({ ...state, ...patch }); },
  toast(kind: 'success' | 'error' | 'warn' | 'ai', text: string) { emit({ ...state, toast: { id: ++toastId, kind, text } }); },
  clearToast() { emit({ ...state, toast: null }); },
};

export const useUi = (): UiState => useSyncExternalStore(ui.subscribe, ui.getState, ui.getState);

/**
 * A step chosen by stepping through the document (the table and row steppers) is not a request to work on it, so it must not
 * open the collapsed execution panel. The navigator calls `quietSelect()` just before it selects; the page's "a new step opens
 * the panel" rule skips a selection made inside that short window. Picking a step directly (a row, a cell) still opens it.
 */
let quietSelectUntil = 0;
export const quietSelect = (ms = 400): void => { quietSelectUntil = Date.now() + ms; };
export const isQuietSelect = (): boolean => Date.now() < quietSelectUntil;
