import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Character from '../components/studio/Character';
import AskBox from '../components/studio/AskBox';
import Answer from '../components/ask/Answer';
import SuggestionChips from '../components/ask/SuggestionChips';
import QaBrowser from '../components/ask/QaBrowser';
import SignalsToScreens from '../components/story/SignalsToScreens';
import { useMedia } from '../components/ask/useMedia';
import { bestMatch, entryById, relatedQuestions, suggestionPool, type Entry } from '../data/knowledge';
import { quirks } from '../data/quirks';
import '../styles/ask.css';

interface Turn { id: number; q: string; status: 'thinking' | 'done'; entry: Entry | null; doors: Entry[]; next: Entry[] }

/** Typed question: the best entry if one is close enough, else "no match" with doors that really exist. */
function resolveText(q: string, asked: string[]): { entry: Entry | null; doors: Entry[]; next: Entry[] } {
  const { entry, hits } = bestMatch(q);
  const rest = hits.filter(h => h.entry !== entry && h.score >= 1).map(h => h.entry);
  const fallback = suggestionPool.map(s => entryById(s.id)!).filter(e => e !== entry && !rest.includes(e));
  return {
    entry,
    doors: [...rest, ...fallback].slice(0, 3),
    next: entry ? relatedQuestions(entry, [...asked, q]) : [],
  };
}

/**
 * The ask page. Answers are retrieved from the site's own notes, not generated, and the page says so.
 * A suggestion chip or a list question opens its own entry by id (no search). Typed text goes through the
 * stricter search and shows "no match" rather than a wrong answer. Below the thread: the full question list
 * and the signal chain ("The long answer"). One ask field at a time: sticky at the top on wide screens,
 * docked at the bottom (above the mobile pill) on small ones.
 */
export default function AskPage() {
  const [params, setParams] = useSearchParams();
  const reduced = !!useReducedMotion();
  const wide = useMedia('(min-width: 768px)');
  const [turns, setTurns] = useState<Turn[]>([]);
  const seq = useRef(0);
  const started = useRef(false);
  const timers = useRef<number[]>([]);
  const asked = useRef<string[]>([]);
  const end = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const ask = (q: string) => {
    const id = ++seq.current;
    const before = [...asked.current];
    asked.current.push(q);
    setTurns(t => [...t, { id, q, status: 'thinking', entry: null, doors: [], next: [] }]);
    setParams({ q }, { replace: true });
    const done = () => setTurns(t => t.map(x => (x.id === id ? { ...x, status: 'done', ...resolveText(q, before) } : x)));
    if (reduced) done(); else timers.current.push(window.setTimeout(done, 1100));
  };

  /** Open an entry by id: a direct lookup, so it is shown at once and is always the right answer. */
  const open = (entryId: string) => {
    const entry = entryById(entryId);
    if (!entry) return;
    const id = ++seq.current;
    const before = [...asked.current];
    asked.current.push(entry.id);
    setTurns(t => [...t, { id, q: entry.q, status: 'done', entry, doors: [], next: relatedQuestions(entry, before) }]);
    setParams({ id: entry.id }, { replace: true });
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const byId = params.get('id');
    const q = params.get('q');
    if (byId && entryById(byId)) open(byId);
    else if (q) ask(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const last = turns[turns.length - 1];
  const lastKey = last ? `${last.id}:${last.status}` : '';

  // while waiting keep the newest turn in view; once an answer lands, move focus to its heading
  useEffect(() => {
    if (!last) return;
    if (last.status === 'thinking') end.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
    else heading.current?.focus({ preventScroll: turns.length === 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastKey]);

  const fresh = turns.length === 0;
  const field = wide
    ? <div className="askpage__top"><AskBox id="ask-field" onAsk={ask} onPick={open} chips={fresh} compact placeholder="Ask something else…" label="Ask something else" /></div>
    : <div className="askpage__bar ask2-bar"><AskBox id="ask-field" onAsk={ask} onPick={open} chips={false} compact placeholder="Keep asking…" label="Keep asking" /></div>;

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="askpage ask2-page">
        <h1 className="ask2-h1">{fresh ? 'Ask me anything, or read the long answer.' : <span className="sr-only">Ask Vijay</span>}</h1>
        {wide && field}
        <p className="ask2-honest">{quirks.guide.honest}</p>
        {!wide && fresh && (
          <div className="ask2-mchips">
            <p>Try one of these</p>
            <SuggestionChips onPick={open} />
          </div>
        )}
        <div className="askpage__thread">
          {turns.map(t => {
            const newest = t.id === last?.id;
            return (
              <div key={t.id} className="turn">
                <p className="turn__q">{t.q}</p>
                <div className="turn__a" aria-live={newest ? 'polite' : undefined}>
                  <Character size={44} pose={t.status === 'thinking' ? 'think' : 'rest'} className="turn__char" />
                  {t.status === 'thinking' ? (
                    <div className="turn__wait"><span>pulling up the right material…</span><i aria-hidden="true" /></div>
                  ) : (
                    <Answer ref={newest ? heading : undefined} q={t.q} entry={t.entry} doors={t.doors} next={t.next} reduced={reduced} onOpen={open} />
                  )}
                </div>
              </div>
            );
          })}
          <div ref={end} />
        </div>
        <QaBrowser />
        <SignalsToScreens />
        {!wide && field}
      </main>
      <Footer />
    </>
  );
}

