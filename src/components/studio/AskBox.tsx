import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { askHref } from '../../data/knowledge';
import SuggestionChips from '../ask/SuggestionChips';

/** The question box and its suggestion chips. The refresh icon cycles to the next three. */
export default function AskBox({ onAsk, onPick, placeholder = 'Ask me anything…', chips = true, label = 'Ask a question', compact = false, nudges, id }: {
  onAsk: (q: string) => void;
  /** Called with an entry id when a suggestion chip is clicked. Defaults to opening that answer on /ask. */
  onPick?: (id: string) => void; placeholder?: string; chips?: boolean; label?: string; compact?: boolean;
  /** Input id, so two boxes on one page never share one. Defaults to the old per-variant id. */
  id?: string;
  /** Placeholder lines to rotate through while the box is empty, idle and on screen (never under reduced motion). */
  nudges?: readonly string[];
}) {
  const [value, setValue] = useState('');
  const nav = useNavigate();
  const [nudge, setNudge] = useState(0);
  const inputId = id ?? `ask-${compact ? 'c' : 'h'}`;
  const wrap = useRef<HTMLDivElement>(null);
  const focused = useRef(false);

  useEffect(() => {
    if (!nudges || nudges.length < 2) return;
    const el = wrap.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let visible = false, id = 0;
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; });
    io.observe(el);
    id = window.setInterval(() => { if (visible && !focused.current && !document.hidden) setNudge(n => (n + 1) % nudges.length); }, 4500);
    return () => { io.disconnect(); window.clearInterval(id); };
  }, [nudges]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q) { onAsk(q); setValue(''); }
  };

  return (
    <div ref={wrap} className={`ask${compact ? ' ask--compact' : ''}`}>
      <form className="ask__form" onSubmit={submit} role="search">
        <label className="sr-only" htmlFor={inputId}>{label}</label>
        <svg className="ask__ic" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>
        <input id={inputId} value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => { if (e.key === 'Escape' && value) { e.preventDefault(); setValue(''); } }} enterKeyHint="send" onFocus={() => { focused.current = true; }} onBlur={() => { focused.current = false; }} placeholder={nudges && nudges.length ? nudges[nudge % nudges.length] : placeholder} maxLength={140} autoComplete="off" />
        <button type="submit" className="ask__go" aria-label="Ask" disabled={!value.trim()}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        </button>
      </form>
      {chips && <SuggestionChips onPick={id => (onPick ? onPick(id) : nav(askHref(id)))} />}
    </div>
  );
}
