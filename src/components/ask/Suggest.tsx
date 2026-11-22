import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { isFile, kindBadge, suggest, type Suggestion } from '../../data/siteIndex';
import '../../styles/ask-finder.css';

/**
 * Live suggestions for an ask field: a WAI-ARIA 1.2 combobox with a listbox popup.
 * As the visitor types (120 ms after the last key, from 2 characters) up to 5 rows appear: questions the notes really
 * answer, and case studies or pages of this site. Each row carries a text badge, so the kind never depends on colour.
 * The popup overlays the page below the field (no layout shift), has no animation, and closes on Esc, blur or a pick.
 * Focus stays in the input; the highlighted row is exposed with aria-activedescendant. This is retrieval over the
 * site's own notes and index: nothing is sent anywhere.
 */
/** Where a pick goes: a question opens its answer, a case study or page opens its route, the resume opens in a new tab. */
export function goToSuggestion(s: Suggestion, nav: NavigateFunction) {
  if (isFile(s.href)) window.open(s.href, '_blank', 'noopener');
  else nav(s.href);
}

export const SUGGEST_DELAY = 120;
export const SUGGEST_MAX = 5;

export function useSuggest({ value, onPick, listId }: { value: string; onPick: (s: Suggestion) => void; listId?: string }) {
  const auto = useId().replace(/:/g, '');
  const id = listId ?? `sg-${auto}`;
  const [debounced, setDebounced] = useState('');
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [active, setActive] = useState(-1);
  const pick = useRef(onPick);
  pick.current = onPick;

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value.trim()), value.trim() ? SUGGEST_DELAY : 0);
    return () => window.clearTimeout(t);
  }, [value]);

  const items = useMemo<Suggestion[]>(() => (debounced.length >= 2 ? suggest(debounced, SUGGEST_MAX) : []), [debounced]);

  // a new text means new rows: forget the highlight and show the list again
  useEffect(() => { setActive(-1); setDismissed(false); }, [debounced]);

  const open = focused && !dismissed && items.length > 0 && value.trim().length >= 2;
  const optId = (i: number) => `${id}-o${i}`;
  const close = useCallback(() => { setDismissed(true); setActive(-1); }, []);

  /** Returns true when the key was a combobox key and has been handled. */
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>): boolean => {
    if (e.altKey || e.ctrlKey || e.metaKey) return false;
    const n = items.length;
    switch (e.key) {
      case 'ArrowDown':
        if (!n) return false;
        e.preventDefault();
        if (!open) { setDismissed(false); setActive(0); } else setActive(a => (a + 1) % n);
        return true;
      case 'ArrowUp':
        if (!n) return false;
        e.preventDefault();
        if (!open) { setDismissed(false); setActive(n - 1); } else setActive(a => (a <= 0 ? n - 1 : a - 1));
        return true;
      case 'Home':
        if (!open || active < 0) return false;
        e.preventDefault(); setActive(0); return true;
      case 'End':
        if (!open || active < 0) return false;
        e.preventDefault(); setActive(n - 1); return true;
      case 'Enter':
        if (open && active >= 0 && items[active]) { e.preventDefault(); const s = items[active]!; close(); pick.current(s); return true; }
        return false;
      case 'Escape':
        if (open) { e.preventDefault(); close(); return true; }
        return false;
      default:
        return false;
    }
  };

  const inputProps = {
    role: 'combobox' as const,
    'aria-autocomplete': 'list' as const,
    'aria-expanded': open,
    'aria-controls': open ? id : undefined,
    'aria-activedescendant': open && active >= 0 ? optId(active) : undefined,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };

  const popup = (
    <>
      {open && (
        <ul id={id} role="listbox" aria-label="Suggestions" className="sg" onMouseDown={e => e.preventDefault()}>
          {items.map((s, i) => (
            <li
              key={`${s.kind}:${s.id}`}
              id={optId(i)}
              role="option"
              aria-selected={i === active}
              className="sg__opt"
              data-kind={s.kind}
              onMouseMove={() => { if (active !== i) setActive(i); }}
              onClick={() => { close(); pick.current(s); }}
            >
              <span className="sg__text">
                <span className="sg__title">{s.title}</span>
                {s.desc && <span className="sg__desc">{s.desc}</span>}
              </span>
              <span className="sg__tag">{kindBadge[s.kind]}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{open ? `${items.length} ${items.length === 1 ? 'suggestion' : 'suggestions'}` : ''}</div>
    </>
  );

  return { inputProps, onKeyDown, popup, open, close };
}
