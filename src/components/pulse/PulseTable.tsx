import type { ReactNode } from 'react';

/** A small table in the page's style. Scrollable region on wide content; stacks at phone width (see audit-pulse.css). */
export default function PulseTable({ label, head, rows }: { label: string; head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="pk-table" role="region" aria-label={`${label}, scrollable`} tabIndex={0}>
      <table>
        <caption className="sr-only">{label}</caption>
        <thead><tr>{head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j} data-label={head[j]}>{c}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
