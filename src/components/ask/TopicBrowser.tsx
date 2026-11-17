/**
 * The ask page's question browser. It replaces the old "all 63 questions" accordion with progressive disclosure:
 * overview (4 + 6 choices) -> topic (6 at a time) -> one answer.
 *
 * UX laws applied
 * - Hick's law: never more than 6 choices of a kind on screen (4 start questions, 6 topics, 6 questions + "Show 6 more").
 * - Miller's law and chunking: 63 questions become 6 topics; a topic shows 6 questions at a time.
 * - Progressive disclosure: overview -> topic -> question; the timeline and the random buttons sit inside "Stories and fun".
 * - Jakob's law: a familiar topic-card grid plus list-detail pattern, breadcrumb-style back button, Previous / Next.
 * - Serial position: the most wanted question (who) is first and the way to get in touch is last in "Start here".
 * - Pareto: "Start here" is the ~20% of questions most visitors want.
 * - Doherty: every choice answers at once, there is no fake "thinking" delay.
 * - Recognition over recall: full questions are visible as buttons; the current topic and position ("3 of 13") are always shown.
 * - WCAG 2.2: 1.4.12 text spacing (no fixed heights), 2.4.7 focus visible, 2.5.8 targets >= 44px,
 *   4.1.3 status messages (polite live region owned by the page), 3.2.x predictable (buttons never navigate away from /ask
 *   without saying so, Esc and Back always go up one level).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { entryById, isFiction, knowledge, relatedQuestions, type Entry } from '../../data/knowledge';
import { kindShort } from './Answer';
import { Chev, TopicIcon } from './icons';
import { startHereIds, topicEntries, topicOfEntry, topics, type Topic } from '../../data/topics';

const PAGE = 6;

const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').split(' ').filter(Boolean);
const haystack = new Map(knowledge.map(e => [e.id, ` ${words([e.q, ...e.keys].join(' ')).join(' ')} `]));

export function BackButton({ children, onClick, ...rest }: { children: React.ReactNode; onClick: () => void } & Record<string, unknown>) {
  return <button type="button" className="tb-back" onClick={onClick} {...rest}><Chev dir="left" /><span>{children}</span></button>;
}

/** State A: "What people usually ask" (4 plain rows) and "Browse by topic" (6 cards with an icon). Nothing else. */
export function Overview({ onOpen, onTopic }: { onOpen: (id: string) => void; onTopic: (t: Topic) => void }) {
  const starts = startHereIds.map(id => entryById(id)!).filter(Boolean);
  return (
    <>
      <section className="tb-sec" aria-labelledby="tb-start-h">
        <h2 id="tb-start-h" tabIndex={-1} className="tb-h">What people usually ask</h2>
        <ul className="tb-list tb-list--plain">
          {starts.map(e => (
            <li key={e.id}>
              <button type="button" className="tb-q" data-qid={e.id} onClick={() => onOpen(e.id)}><span>{e.q}</span><Chev /></button>
            </li>
          ))}
        </ul>
      </section>
      <section className="tb-sec" aria-labelledby="tb-topics-h">
        <h2 id="tb-topics-h" className="tb-h">Or browse by topic</h2>
        <ul className="tb-topics">
          {topics.map(t => (
            <li key={t.id}>
              <button type="button" className="tb-card" data-topic={t.id} onClick={() => onTopic(t)}>
                <span className="tb-card__ic"><TopicIcon id={t.id} /></span>
                <span className="tb-card__t">{t.title}</span>
                <span className="tb-card__d">{t.blurb}</span>
                <span className="tb-card__n">{topicEntries(t).length} questions<Chev /></span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/** A focused list for one topic: at most 6 questions at a time, a filter only when the topic is long. */
export function TopicList({ topic, initialShown = PAGE, headingRef, onBack, onOpen, onTimeline }: {
  topic: Topic;
  /** How many to show at first; larger when returning from an answer far down the list. */
  initialShown?: number;
  headingRef: React.Ref<HTMLHeadingElement>;
  onBack: () => void;
  onOpen: (id: string) => void;
  onTimeline: () => void;
}) {
  const all = useMemo(() => topicEntries(topic), [topic]);
  const fun = topic.id === 'fun';
  const [filter, setFilter] = useState('');
  // in "Stories and fun" the timeline card takes one of the 6 slots
  const first = fun ? PAGE - 1 : PAGE;
  const [shown, setShown] = useState(Math.max(first, initialShown));
  const matches = useMemo(() => {
    const w = words(filter);
    return w.length ? all.filter(e => w.every(x => haystack.get(e.id)!.includes(' ' + x))) : all;
  }, [all, filter]);
  const visible = matches.slice(0, shown);
  const left = matches.length - visible.length;
  const more = Math.min(PAGE, left);

  // after Show 6 more, keyboard focus moves to the first new question so nobody has to tab back through the list
  const list = useRef<HTMLUListElement>(null);
  const prevShown = useRef(shown);
  useEffect(() => {
    if (shown > prevShown.current) list.current?.querySelectorAll<HTMLButtonElement>('button.tb-q')[prevShown.current]?.focus();
    prevShown.current = shown;
  }, [shown]);

  // announce list changes (Show more, filtering) politely; nothing is announced on first render
  const [note, setNote] = useState('');
  const first_ = useRef(true);
  useEffect(() => {
    if (first_.current) { first_.current = false; return; }
    setNote(`Showing ${Math.min(shown, matches.length)} of ${matches.length} questions`);
  }, [shown, matches.length]);

  const random = (pool: Entry[]) => { const p = pool[Math.floor(Math.random() * pool.length)]; if (p) onOpen(p.id); };

  return (
    <section className="tb-sec" aria-labelledby="tb-topic-h">
      <BackButton onClick={onBack} data-back="overview">All topics</BackButton>
      <h2 id="tb-topic-h" ref={headingRef} tabIndex={-1} className="tb-h tb-h--big">{topic.title}</h2>
      <p className="tb-sub">{all.length} questions. {topic.blurb}</p>

      {all.length > 8 && (
        <div className="tb-filter">
          <label htmlFor="tb-filter">Filter these {all.length} questions</label>
          <input id="tb-filter" type="search" value={filter} onChange={e => { setFilter(e.target.value); setShown(PAGE); }} autoComplete="off" maxLength={60} placeholder="A word, like “AI” or “React”" />
        </div>
      )}

      {fun && !filter && (
        <>
          <button type="button" className="tb-q tb-q--feature" data-timeline onClick={onTimeline}>
            <span><strong>My timeline</strong> <em>From signals to screens: the true timeline, drawn like a circuit.</em></span><Chev />
          </button>
        </>
      )}

      {matches.length === 0 ? (
        <p className="tb-none">No question here has “{filter}” in it. Try one word, or clear the filter.</p>
      ) : (
        <ul ref={list} className="tb-list">
          {visible.map(e => {
            const k = e.kind ?? 'true';
            return (
              <li key={e.id}>
                <button type="button" className="tb-q" data-qid={e.id} onClick={() => onOpen(e.id)}>
                  <span>{k !== 'true' && <span className="sr-only">{kindShort[k]}: </span>}{e.q}</span>
                  {k !== 'true' && <em className="tb-kind" aria-hidden="true">{kindShort[k]}</em>}
                  <Chev />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="sr-only" role="status" aria-live="polite">{note}</div>

      {left > 0 && (
        <button type="button" className="tb-more" data-more onClick={() => setShown(s => s + PAGE)}>
          Show {more} more <span>({left} left)</span>
        </button>
      )}

      {fun && !filter && (
        <div className="tb-rand" role="group" aria-label="Pick one for me">
          <button type="button" onClick={() => random(all)}>Surprise me</button>
          <button type="button" onClick={() => random(all.filter(isFiction))}>Random story</button>
        </div>
      )}
    </section>
  );
}

/** Back, Previous / Next inside the topic, and at most 2 related questions. Sits under one answer. */
export function AnswerNav({ entry, onOpen }: {
  entry: Entry;
  onOpen: (id: string, how: 'step' | 'jump') => void;
}) {
  const topic = topicOfEntry(entry);
  const list = useMemo(() => topicEntries(topic), [topic]);
  const i = list.findIndex(e => e.id === entry.id);
  const prev = i > 0 ? list[i - 1] : undefined;
  const next = i >= 0 && i < list.length - 1 ? list[i + 1] : undefined;
  // never offer the same question twice: Related skips whatever Previous / Next already show
  const related = useMemo(() => relatedQuestions(entry, [entry.id, ...(prev ? [prev.id] : []), ...(next ? [next.id] : [])], 2), [entry, prev, next]);
  return (
    <>
      <nav className="tb-pn" aria-label={`More in ${topic.title}`}>
        <button type="button" className="tb-step" disabled={!prev} onClick={() => prev && onOpen(prev.id, 'step')}>
          <small>Previous</small><span>{prev ? prev.q : 'This is the first one'}</span>
        </button>
        <p className="tb-pos">{i + 1} of {list.length}<span className="sr-only"> in {topic.title}</span></p>
        <button type="button" className="tb-step tb-step--next" disabled={!next} onClick={() => next && onOpen(next.id, 'step')}>
          <small>Next</small><span>{next ? next.q : 'This is the last one'}</span>
        </button>
      </nav>
      {related.length > 0 && (
        <section className="tb-rel" aria-labelledby="tb-rel-h">
          <h3 id="tb-rel-h" className="tb-h tb-h--small">You might also ask</h3>
          <ul className="tb-list">
            {related.slice(0, 2).map(r => (
              <li key={r.id}><button type="button" className="tb-q" onClick={() => onOpen(r.id, 'jump')}><span>{r.q}</span><Chev /></button></li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
