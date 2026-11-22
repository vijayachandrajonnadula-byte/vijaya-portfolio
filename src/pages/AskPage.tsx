import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AskBox from '../components/studio/AskBox';
import Answer from '../components/ask/Answer';
import { AnswerNav, BackButton, Overview, TopicList } from '../components/ask/TopicBrowser';
import SignalsToScreens from '../components/story/SignalsToScreens';
import { bestMatch, entryById, type Entry } from '../data/knowledge';
import { suggest, type Suggestion } from '../data/siteIndex';
import { topicById, topicEntries, topicOfEntry, type Topic } from '../data/topics';
import { quirks } from '../data/quirks';
import { PenIcon } from '../components/ask/icons';
import '../styles/ask.css';

type View =
  | { kind: 'overview' }
  | { kind: 'topic'; topic: Topic }
  | { kind: 'timeline' }
  | { kind: 'answer'; entry: Entry; topic: Topic; typed?: string }
  | { kind: 'nomatch'; q: string; closest: Suggestion[] };

/**
 * Typed question: the best entry if one is close enough. Otherwise "no match", and the page still has something
 * to show: up to 3 plausibly related questions, case studies or pages (never padding), a way to email the question,
 * and the six topics.
 */
function resolveText(q: string): View {
  const { entry } = bestMatch(q);
  if (entry) return { kind: 'answer', entry, topic: topicOfEntry(entry), typed: q };
  return { kind: 'nomatch', q, closest: suggest(q, 3, { loose: true }) };
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
    case 'nomatch': return v.closest.length ? `No written answer for ${v.q}. Showing closest pages and ways to reach me.` : `No written answer for ${v.q}. Showing ways to reach me and topics to start from.`;
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
  const view = useMemo(() => viewFromUrl(params), [params]);
  const key = viewKey(view);
  const [status, setStatus] = useState('');
  const beat = useRef(0);
  // the same sentence twice in a row would not be announced again; a zero-width space on every other call makes it new
  const say = (s: string) => { beat.current += 1; setStatus(beat.current % 2 ? s : `${s}​`); };
  const prev = useRef<View | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  const go = (next: Record<string, string>, replace = false) => setParams(next, { replace });
  const toOverview = (replace = true) => go({}, replace);
  const toTopic = (t: Topic, replace = false) => go({ topic: t.id }, replace);
  const open = (id: string, replace = false) => { if (entryById(id)) go({ id }, replace); };

  // the no-match page says so in the tab title too, and puts the old title back when it goes
  const nomatchQ = view.kind === 'nomatch' ? view.q : null;
  useEffect(() => {
    if (nomatchQ === null) return;
    const before = document.title;
    document.title = `No written answer for ${nomatchQ.slice(0, 60)} · Ask Vijay`;
    return () => { document.title = before; };
  }, [nomatchQ]);

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
    say(message(view));
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
          <header className={`tb-head${view.kind === 'overview' ? '' : ' tb-head--compact'}`}>
            <h1 className="tb-h1">Ask Vijay</h1>
            <AskBox id="ask-field" onAsk={q => go({ q })} onEmpty={() => say('Type a question or pick one')} describedBy="ask-trust" compact nudges={quirks.askNudges} label="What would you like to know?" placeholder="Ask me anything…" />
            <p id="ask-trust" className="tb-honest"><PenIcon /><span>Every answer is written by Vijay, not generated. Stories are labelled as stories.</span></p>
          </header>
        </div>

        <div ref={stage} className={view.kind === 'timeline' ? 'tb-wide' : 'tb-col'}>
          <div key={key} className="ask2-view">
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
                    <Answer ref={heading} typed={view.typed} entry={view.entry} onOpen={id => open(id)} onStatus={say} />
                    <AnswerNav entry={view.entry} onOpen={(id, how) => open(id, how === 'step')} />
                  </>
                ) : (
                  <Answer ref={heading} typed={view.q} entry={null} closest={view.closest} onOpen={id => open(id)} onTopic={t => toTopic(t)} onStatus={say} />
                )}
              </section>
            )}
          </div>
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
