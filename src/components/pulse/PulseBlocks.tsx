import type { ReactNode } from 'react';
import audit from '../../data/pulse-audit.json';

/** "In 60 seconds": five lines with in-page jump links. */
export function Tldr({ title = 'In 60 seconds', rows }: { title?: string; rows: { k: string; body: ReactNode; to: string; toLabel: string }[] }) {
  return (
    <aside className="pk-tldr" aria-labelledby="pk-tldr-h">
      <h2 id="pk-tldr-h">{title}</h2>
      <ol>
        {rows.map(r => (
          <li key={r.k}>
            <b>{r.k}</b>
            <span>{r.body} <a href={`#${r.to}`}>{r.toLabel}</a></span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

const fmtDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const n = (v: number) => v.toLocaleString('en-US');

/** The axe-core before/after scan. Every number comes from src/data/pulse-audit.json. */
export function AuditBlock() {
  const { before, after } = audit;
  const items = [
    { l: 'Colour-contrast failures (elements)', b: before.contrastNodes, a: after.contrastNodes },
    { l: 'Demos with a contrast failure', b: before.contrastDemos, a: after.contrastDemos },
    { l: 'Elements scanned', b: before.nodes, a: after.nodes },
    { l: 'Demos scanned', b: before.demos, a: after.demos },
  ];
  return (
    <section className="pk-audit" aria-label="Accessibility scan, before and after">
      <dl className="pk-audit__grid">
        {items.map(i => (
          <div key={i.l}>
            <dd><small>{n(i.b)} →</small>{n(i.a)}</dd>
            <dt>{i.l}, before → after</dt>
          </div>
        ))}
      </dl>
      <p className="pk-audit__note">{audit.afterBreakdown}</p>
      <p className="pk-audit__meta">
        Run with {audit.tool}, on {fmtDate(audit.scanned)}, over every component demo. This is an automated scan. It is not a screen reader
        test or a keyboard test, and it cannot say whether the system is usable.
      </p>
    </section>
  );
}
