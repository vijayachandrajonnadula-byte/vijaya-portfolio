import type { ReactNode } from 'react';

/** 16 small UI parts. All of them read the same three tokens (--rad, --c, --pad) from their tile; none has its own value. */
const bar = (w: number) => <i className="a2-bar" style={{ width: `${w}%` }} />;

export const TILES: ReactNode[] = [
  <b className="a2-btn"><i className="a2-lbl" /></b>,
  <b className="a2-tog"><i /></b>,
  <b className="a2-chip"><i className="a2-dot" /><i className="a2-lbl a2-lbl--s" /></b>,
  <b className="a2-chk"><svg viewBox="0 0 12 12"><path d="M2.5 6.4 5 8.8 9.6 3.4" /></svg></b>,
  <b className="a2-card"><i className="a2-av" /><span>{bar(90)}{bar(55)}</span></b>,
  <b className="a2-sld"><i className="a2-sld__f" /><i className="a2-sld__t" /></b>,
  <b className="a2-inp"><i className="a2-caret" /></b>,
  <b className="a2-badge"><i className="a2-lbl a2-lbl--s" /></b>,
  <b className="a2-tabs"><i className="a2-tabs__on" /><i /></b>,
  <b className="a2-prog"><i /></b>,
  <b className="a2-av2"><i /></b>,
  <b className="a2-rad"><i /></b>,
  <b className="a2-btn a2-btn--land"><i className="a2-lbl" /></b>,
  <b className="a2-btn a2-btn--ghost"><i className="a2-lbl" /></b>,
  <b className="a2-step"><i /><i className="a2-step__v" /><i /></b>,
  <b className="a2-tag"><i className="a2-lbl a2-lbl--s" /></b>,
];
