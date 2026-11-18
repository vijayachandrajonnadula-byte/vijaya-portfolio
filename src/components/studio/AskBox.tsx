import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

/**
 * The question box: a visible label, one input, one rotating example placeholder.
 * No suggestion chips here (Hick's law): suggestions live in the topic browser on /ask.
 * The send button is always enabled. Sending an empty box does nothing visible and calls `onEmpty`, so the page can say
 * "Type a question or pick one" to a screen reader instead of leaving a dead, greyed-out button (error prevention without a dead end).
 * The placeholder changes every 6 s only while the box is on screen, not focused, empty and motion is allowed.
 * Under reduced motion it stays on the first example.
 */
export default function AskBox({ onAsk, onEmpty, placeholder = 'Ask me anything…', label = 'Ask me anything', labelHidden = false, compact = false, nudges, id, describedBy }: {
  onAsk: (q: string) => void;
  /** Called when the visitor sends an empty box. */
  onEmpty?: () => void;
  placeholder?: string;
  /** Visible label above the field (WCAG 3.3.2). Pass labelHidden only where another visible label exists. */
  label?: string; labelHidden?: boolean; compact?: boolean;
  /** Input id, so two boxes on one page never share one. */
  id?: string;
  /** Id of a nearby sentence that describes the field (for example the trust line). */
  describedBy?: string;
  /** Example placeholders; the box rotates through them. */
  nudges?: readonly string[];
  /** Ignored. Kept so older callers still compile; the box never shows chips. */
  chips?: boolean;
  /** Ignored, see `chips`. */
  onPick?: (id: string) => void;
}) {
  const [value, setValue] = useState('');
  const [nudge, setNudge] = useState(0);
  const auto = useId();
  const inputId = id ?? `ask-${auto.replace(/:/g, '')}`;
  const wrap = useRef<HTMLDivElement>(null);
  const focused = useRef(false);
  const typing = useRef(false);
  typing.current = value.length > 0;

  useEffect(() => {
    if (!nudges || nudges.length < 2) return;
    const el = wrap.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; });
    io.observe(el);
    const t = window.setInterval(() => { if (visible && !focused.current && !typing.current && !document.hidden) setNudge(n => (n + 1) % nudges.length); }, 6000);
    return () => { io.disconnect(); window.clearInterval(t); };
  }, [nudges]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q) { onAsk(q); setValue(''); } else { setValue(''); onEmpty?.(); }
  };

  return (
    <div ref={wrap} className={`ask${compact ? ' ask--compact' : ''}`}>
      <label className={labelHidden ? 'sr-only' : 'ask__label'} htmlFor={inputId}>{label}</label>
      <form className="ask__form" onSubmit={submit} role="search">
        <svg className="ask__ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>
        <input id={inputId} value={value} aria-describedby={describedBy} onChange={e => setValue(e.target.value)} onKeyDown={e => { if (e.key === 'Escape' && value) { e.preventDefault(); setValue(''); } }} enterKeyHint="send" onFocus={() => { focused.current = true; }} onBlur={() => { focused.current = false; }} placeholder={nudges && nudges.length ? nudges[nudge % nudges.length] : placeholder} maxLength={140} autoComplete="off" />
        <button type="submit" className="ask__go" aria-label="Ask">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        </button>
      </form>
    </div>
  );
}
