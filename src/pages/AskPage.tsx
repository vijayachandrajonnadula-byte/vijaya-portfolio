import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AskBox from '../components/studio/AskBox';
import Answer from '../components/ask/Answer';
import { AnswerNav, BackButton, Overview, TopicList } from '../components/ask/TopicBrowser';
import SignalsToScreens from '../components/story/SignalsToScreens';
import { bestMatch, entryById, relatedQuestions, suggestionPool, type Entry } from '../data/knowledge';
import { topicById, topicEntries, topicOfEntry, type Topic } from '../data/topics';
import { quirks } from '../data/quirks';
import '../styles/ask.css';

type View =
  | { kind: 'overview' }
  | { kind: 'topic'; topic: Topic }
  | { kind: 'timeline' }
  | { kind: 'answer'; entry: Entry; topic: Topic; typed?: string }
  | { kind: 'nomatch'; q: string; doors: Entry[] };

/** Typed question: the best entry if one is close enough, else "no match" with at most 4 doors that really exist. */
function resolveText(q: string): View {
  const { entry, hits } = bestMatch(q);
  if (entry) return { kind: 'answer', entry, topic: topicOfEntry(entry), typed: q };
  const rest = hits.filter(h => h.score >= 1).map(h => h.entry);
  const fallback = suggestionPool.map(s => entryById(s.id)!).filter(e => !rest.includes(e));
  return { kind: 'nomatch', q, doors: [...rest, ...fallback].slice(0, 4) };
}

/** The view is a pure function of the URL: ?id=<id> answer, ?topic=<topic> list, ?view=timeline, ?q=<typed>. */
function viewFromUrl(p: URLSearchParams): View {
  const id = p.get('id');
  const e = entryById(id);
  if (e) return { kind: 'answer', entry: e, topic: topicOfEntry(e) };
  const q = p.get('q');
  if (q && q.trim()) return resolveText(q.trim());
  if (p.get('view') === 'timeline') return { kind: 'timeline' };
  const t = topicById(p.get('topic'));
  if (t) return { kind: 'topic', topic: t };
  return { kind: 'overview' };
}

const viewKey = (v: View) => (v.kind === 'answer' ? `a:${v.entry.id}:${v.typed ?? ''}` : v.kind === 'topic' ? `t:${v.topic.id}` : v.kind === 'nomatch' ? `n:${v.q}` : v.kind);

const message = (v: View): string => {
  switch (v.kind) {
    case 'answer': return `Showing answer: ${v.entry.q}`;
    case 'topic': return `Showing topic: ${v.topic.title}, ${topicEntries(v.topic).length} questions`;
    case 'timeline': return 'Showing my timeline';
    case 'nomatch': return `No match for ${v.q}. Showing ${v.doors.length} questions I can answer.`;
    default: return 'Showing all topics';
  }
};

/**
 * The ask page, calm and single column. Answers are retrieved from the site's own notes, not generated, and the
 * page says so. Overview (4 start questions, 6 topics) -> a topic (6 questions at a time) -> one answer.
 * State lives in the URL so the browser Back button, deep links (?id=, ?topic=, #q=) and reloads all work.
 * Focus moves to the new view's heading; Esc and the Back button go up one level; a polite live region announces it.
 */
export default function AskPage() {
  const [params, setParams] = useSearchParams();
  const { hash } = useLocation();
  const nav = useNavigate();
  const reduced = !!useReducedMotion();
  const view = useMemo(() => viewFromUrl(params), [params]);
  const key = viewKey(view);
  const [status, setStatus] = useState('');
  const prev = useRef<View | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  const go = (next: Record<string, string>, replace = false) => setParams(next, { replace });
  const toOverview = (replace = true) => go({}, replace);
  const toTopic = (t: Topic, replace = false) => go({ topic: t.id }, replace);
  const open = (id: string, replace = false) => { if (entryById(id)) go({ id }, replace); };

  // #q=<id> deep links open that answer; the hash is replaced by ?id= so Back does not loop
  useEffect(() => {
    const m = /^#q=(.+)$/.exec(decodeURIComponent(hash));
    if (m && entryById(m[1])) nav(`/ask?id=${encodeURIComponent(m[1]!)}`, { replace: true });
  }, [hash, nav]);

  // after a view change: announce it, and put focus where the visitor expects it
  useEffect(() => {
    const before = prev.current;
    prev.current = view;
    if (!before || viewKey(before) === key) return; // first paint (also under StrictMode's second run): do not steal focus
    setStatus(message(view));
    const q = <T extends HTMLElement>(s: string) => stage.current?.querySelector<T>(s) ?? null;
    const raf = window.requestAnimationFrame(() => {
      let el: HTMLElement | null = null;
      if (view.kind === 'overview') {
        const from = before.kind === 'topic' ? before.topic : before.kind === 'answer' ? before.topic : null;
        el = (from && q(`[data-topic="${from.id}"]`)) || q('#tb-start-h');
      } else if (view.kind === 'topic') {
        if (before.kind === 'answer') el = q(`[data-qid="${before.entry.id}"]`);
        else if (before.kind === 'timeline') el = q('[data-timeline]');
      }
      const target = el ?? heading.current ?? q('h2');
      const fromItem = view.kind === 'overview' || (view.kind === 'topic' && before.kind !== 'overview');
      if (!fromItem && stage.current) {
        // a new view starts at its top: Back button and heading in view, not mid-page
        window.scrollTo({ top: Math.max(0, stage.current.getBoundingClientRect().top + window.scrollY - 96), behavior: 'auto' });
        target?.focus({ preventScroll: true });
      } else target?.focus();
    });
    return () => window.cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Esc goes up one level (a filled field clears itself first and swallows the key)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented || view.kind === 'overview') return;
      e.preventDefault();
      back();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  /** One level up: answer -> its topic (or all topics after a typed search), topic -> all topics, timeline -> Stories and fun. */
  const back = () => {
    if (view.kind === 'answer' && !view.typed) toTopic(view.topic, true);
    else if (view.kind === 'timeline') toTopic(topicById('fun')!, true);
    else toOverview();
  };

  // when a list is re-opened from an answer, show enough rows for that question to be visible
  const initialShown = useMemo(() => {
    const b = prev.current;
    if (view.kind !== 'topic' || !b || b.kind !== 'answer') return 6;
    const i = topicEntries(view.topic).findIndex(e => e.id === b.entry.id);
    return Math.max(6, Math.ceil((i + 1) / 6) * 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const backLabel = view.kind === 'answer' && !view.typed ? `Back to ${view.topic.title}` : view.kind === 'timeline' ? 'Back to Stories and fun' : 'All topics';

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="askpage tb-page">
        <div className="tb-col">
          <header className="tb-head">
            <h1 className="tb-h1">Ask Vijay</h1>
            <AskBox id="ask-field" onAsk={q => go({ q })} compact nudges={quirks.askNudges} label="Ask a question, or search my notes" placeholder="Ask me anything…" />
            <p className="tb-honest">{quirks.guide.honest} Stories are labelled as stories.</p>
          </header>
        </div>

        <div ref={stage} className={view.kind === 'timeline' ? 'tb-wide' : 'tb-col'}>
          {view.kind === 'overview' && <Overview onOpen={id => open(id)} onTopic={t => toTopic(t)} />}

          {view.kind === 'topic' && (
            <TopicList key={view.topic.id} topic={view.topic} initialShown={initialShown} headingRef={heading} onBack={() => toOverview()} onOpen={id => open(id)} onTimeline={() => go({ view: 'timeline' })} />
          )}

          {view.kind === 'timeline' && (
            <section aria-label="My timeline" className="tb-timeline">
              <div className="tb-col"><BackButton onClick={back} data-back="up">{backLabel}</BackButton></div>
              <TimelineFocus headingRef={heading} />
            </section>
          )}

          {(view.kind === 'answer' || view.kind === 'nomatch') && (
            <section className="tb-ans" aria-label="Answer">
              <BackButton onClick={back} data-back="up">{backLabel}</BackButton>
              {view.kind === 'answer' ? (
                <>
                  <Answer ref={heading} q={view.typed ?? view.entry.q} entry={view.entry} doors={[]} next={[]} reduced={reduced} onOpen={id => open(id)} />
                  <AnswerNav entry={view.entry} related={relatedQuestions(view.entry, [view.entry.id], 2)} onOpen={(id, how) => open(id, how === 'step')} />
                </>
              ) : (
                <Answer ref={heading} q={view.q} entry={null} doors={view.doors} next={[]} reduced={reduced} onOpen={id => open(id)} />
              )}
            </section>
          )}
        </div>
        <div id="tb-live" className="sr-only" role="status" aria-live="polite" aria-atomic="true">{status}</div>
      </main>
      <Footer />
    </>
  );
}

/** The timeline as its own view. Its own heading takes focus when the view opens. */
function TimelineFocus({ headingRef }: { headingRef: React.RefObject<HTMLHeadingElement> }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = box.current?.querySelector<HTMLHeadingElement>('h2');
    if (h) { h.tabIndex = -1; (headingRef as React.MutableRefObject<HTMLHeadingElement | null>).current = h; }
  }, [headingRef]);
  return <div ref={box}><SignalsToScreens /></div>;
}
