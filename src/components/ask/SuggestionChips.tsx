import { useState } from 'react';
import { suggestionPool } from '../../data/knowledge';

/**
 * Three curated suggestions out of eight, tied to entry ids (never to text), so a click always opens its own
 * answer. The refresh button cycles to the next three.
 */
export default function SuggestionChips({ onPick, className = 'ask__chips', offset = 0, count = 3, label = 'Suggested questions' }: {
  onPick: (id: string) => void; className?: string; offset?: number; count?: number; label?: string;
}) {
  const [page, setPage] = useState(0);
  const n = suggestionPool.length;
  const shown = Array.from({ length: count }, (_, i) => suggestionPool[(offset + page * count + i) % n]!);
  return (
    <div className={className} role="group" aria-label={label}>
      {shown.map(s => <button key={s.id} type="button" data-id={s.id} onClick={() => onPick(s.id)}>{s.label}</button>)}
      <button type="button" className="ask__refresh" aria-label="Show different suggestions" onClick={() => setPage(p => p + 1)}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14-4M4 4v4h4M4 13a8 8 0 0 0 14 4m2 3v-4h-4" /></svg>
      </button>
    </div>
  );
}
