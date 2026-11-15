import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { groups, isFiction, knowledge, type Entry, type Group } from '../../data/knowledge';
import { AnswerCard, kindShort } from './Answer';

const HASH = /^#q=(.+)$/;
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').split(' ').filter(Boolean);
const haystack = new Map(knowledge.map(e => [e.id, ` ${words([e.q, e.group, ...e.keys, ...e.answer].join(' ')).join(' ')} `]));

const chev = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);

/**
 * "Browse all questions": every note the ask box can answer, grouped, filterable and deep-linkable (#q=<id>).
 * The same entries and the same AnswerCard as the ask thread, so an answer never differs between the two.
 */
export default function QaBrowser({ onShown }: { onShown?: (id: string) => void }) {
  const reduced = !!useReducedMotion();
  const { hash } = useLocation();
  const uid = useId();
  const [filter, setFilter] = useState('');
  const [group, setGroup] = useState<Group | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState('');
  const root = useRef<HTMLElement>(null);

  const counts = useMemo(() => Object.fromEntries(groups.map(g => [g, knowledge.filter(e => e.group === g).length])) as Record<Group, number>, []);

  const visible = useMemo(() => {
    const w = words(filter);
    return knowledge.filter(e => (!group || e.group === group) && w.every(x => haystack.get(e.id)!.includes(' ' + x)));
  }, [filter, group]);

  const toggle = (id: string) => setOpen(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  /** Open an entry, clear any filter that would hide it, and bring it into view. */
  const reveal = (id: string, focus: boolean) => {
    setFilter(''); setGroup(null);
    setOpen(s => new Set(s).add(id));
    onShown?.(id);
    window.setTimeout(() => {
      const li = document.getElementById(`q=${id}`);
      if (!li) return;
      li.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      if (focus) li.querySelector<HTMLButtonElement>('.qa__q')?.focus({ preventScroll: true });
    }, 60);
  };

  // #q=<id> deep links, on arrival and when the hash changes
  useEffect(() => {
    const m = HASH.exec(decodeURIComponent(hash));
    if (m && knowledge.some(e => e.id === m[1])) reveal(m[1]!, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  const random = (pool: Entry[], label: string) => {
    const choices = pool.filter(e => !open.has(e.id));
    const list = choices.length ? choices : pool;
    const pick = list[Math.floor(Math.random() * list.length)]!;
    setStatus(`${label}: ${pick.q}`);
    reveal(pick.id, true);
  };

  const copy = async (id: string) => {
    const url = `${window.location.origin}/ask#q=${id}`;
    try { await navigator.clipboard.writeText(url); setStatus('Link copied'); }
    catch { setStatus(`Copy this link: ${url}`); }
    window.setTimeout(() => setStatus(''), 2600);
  };

  return (
    <section id="browse" ref={root} className="qa" aria-labelledby={`${uid}-h`}>
      <header className="qa__head">
        <h2 id={`${uid}-h`} className="qa__title">Browse all questions</h2>
        <p className="qa__sub">{knowledge.length} questions, written by me from my resume and this site. Stories are labelled as stories.</p>
      </header>

      <div className="qa__tools">
        <div className="qa__find">
          <label className="sr-only" htmlFor={`${uid}-f`}>Filter the questions</label>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>
          <input id={`${uid}-f`} type="search" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter questions…" autoComplete="off" maxLength={80} />
        </div>
        <div className="qa__rand">
          <button type="button" onClick={() => random(knowledge, 'Surprise')}>Surprise me</button>
          <button type="button" onClick={() => random(knowledge.filter(isFiction), 'Random story')}>Random story</button>
        </div>
      </div>

      <div className="qa__groups" role="group" aria-label="Filter by category">
        <button type="button" aria-pressed={group === null} onClick={() => setGroup(null)}>All <span>{knowledge.length}</span></button>
        {groups.map(g => <button key={g} type="button" aria-pressed={group === g} onClick={() => setGroup(group === g ? null : g)}>{g} <span>{counts[g]}</span></button>)}
      </div>

      <p className="qa__status" role="status" aria-live="polite">{status || `${visible.length} of ${knowledge.length} shown`}</p>

      {visible.length === 0 && <p className="qa__none">Nothing here matches “{filter}”. Try one word, or clear the filter.</p>}

      {groups.filter(g => visible.some(e => e.group === g)).map(g => (
        <div key={g} className="qa__group">
          <h3 className="qa__gh">{g} <span>{visible.filter(e => e.group === g).length}</span></h3>
          <ul className="qa__list">
            {visible.filter(e => e.group === g).map(e => {
              const isOpen = open.has(e.id);
              const k = e.kind ?? 'true';
              return (
                <li key={e.id} id={`q=${e.id}`} className="qa__item" data-open={isOpen || undefined}>
                  <h4 className="qa__h">
                    <button type="button" id={`${uid}-b-${e.id}`} className="qa__q" aria-expanded={isOpen} aria-controls={`${uid}-p-${e.id}`} onClick={() => toggle(e.id)}>
                      <span>{k !== 'true' && <span className="sr-only">{kindShort[k]}: </span>}{e.q}</span>
                      {k !== 'true' && <em className="qa__kind" data-kind={k} aria-hidden="true">{kindShort[k]}</em>}
                      {chev}
                    </button>
                  </h4>
                  {isOpen && (
                    <div id={`${uid}-p-${e.id}`} role="region" aria-labelledby={`${uid}-b-${e.id}`} className="qa__panel">
                      <AnswerCard entry={e} />
                      <button type="button" className="qa__copy" onClick={() => copy(e.id)}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>
                        Copy link
                        <span className="sr-only"> to this answer</span>
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
