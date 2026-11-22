import { forwardRef, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { kindLabel, type Entry, type Kind } from '../../data/knowledge';
import { profile } from '../../data/profile';
import { isFile, kindBadge, type Suggestion } from '../../data/siteIndex';
import { topics, type Topic } from '../../data/topics';
import { Chev, CheckIcon, LinkIcon, PenIcon, TopicIcon } from './icons';
import '../../styles/ask-finder.css';

export const kindShort: Record<Kind, string> = { true: 'From my notes', parable: 'Parable', 'tall-tale': 'Tall tale', analogy: 'Analogy' };

/** The line above an answer. Facts say who wrote them; stories say they are stories. */
export function kindTag(e: Entry): string {
  const k = e.kind ?? 'true';
  return k === 'true' ? 'Written by Vijay. Not generated.' : `${kindLabel[k]}. Written by Vijay. Not generated.`;
}

/** The source link of an answer: a route on this site, a mailto, a file or another site. The one primary action of the answer. */
export function EntryLink({ link }: { link: NonNullable<Entry['link']> }) {
  const external = link.href.startsWith('mailto:') || link.href.endsWith('.pdf') || link.href.startsWith('http');
  return external
    ? <a className="ask2-btn" href={link.href} {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{link.label}</a>
    : <Link className="ask2-btn" to={link.href}>{link.label}</Link>;
}

/** "Copy link to this answer": the deep link is /ask?id=<id>, so it opens the same answer for anyone. */
function CopyLink({ id, onStatus }: { id: string; onStatus: (s: string) => void }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => { setState('idle'); }, [id]);
  const copy = async () => {
    const url = `${window.location.origin}/ask?id=${encodeURIComponent(id)}`;
    let ok = false;
    try { await navigator.clipboard.writeText(url); ok = true; } catch {
      try { const t = document.createElement('textarea'); t.value = url; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); ok = document.execCommand('copy'); t.remove(); } catch { ok = false; }
    }
    setState(ok ? 'copied' : 'failed');
    onStatus(ok ? 'Link copied' : 'Could not copy. The link is in the address bar.');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2600);
  };
  return (
    <button type="button" className="ask2-btn ask2-btn--ghost" data-state={state} onClick={copy}>
      {state === 'copied' ? <CheckIcon /> : <LinkIcon />}
      <span>{state === 'copied' ? 'Link copied' : state === 'failed' ? 'Copy failed. Use the address bar' : 'Copy link to this answer'}</span>
    </button>
  );
}

/** One line at the end of every answer: the next useful action after reading is to say hello. */
export function EmailNudge({ lead = 'Still curious?' }: { lead?: string }) {
  return <p className="ask2-nudge">{lead} <Link to="/#contact">Email me</Link> <span className="sr-only">at {profile.email}</span></p>;
}

interface Props {
  /** What the visitor typed, when this answer was found by typing. */
  typed?: string;
  entry: Entry | null;
  /** Up to 3 plausibly related questions, case studies or pages, when nothing matched. */
  closest?: Suggestion[];
  onOpen: (id: string) => void;
  /** Opens a topic (the no-match page offers all six). */
  onTopic?: (t: Topic) => void;
  onStatus: (s: string) => void;
}

/**
 * One resolved answer. Direct answer large, details smaller, one source link, a quiet copy-link button and one line to email.
 * It appears at once (retrieval, no fake thinking); the page fades the view in. The heading is the focus target.
 */
const Answer = forwardRef<HTMLHeadingElement, Props>(function Answer({ typed, entry, closest, onOpen, onTopic = () => {}, onStatus }, headingRef) {
  const k = entry?.kind ?? 'true';
  return (
    <article className="ask2-answer" data-kind={entry ? k : 'none'}>
      {typed && entry && <p className="ask2-asked">You asked: <q>{typed}</q>. Closest note:</p>}
      {entry ? (
        <>
          <h2 ref={headingRef} tabIndex={-1} className="ask2-answer__h"><span className="sr-only">{kindShort[k]}: </span>{entry.q}</h2>
          <p className={`ask2-prov${k !== 'true' ? ' ask2-prov--story' : ''}`}><PenIcon /><span>{kindTag(entry)}</span></p>
          <div className="ask2-body">
            {entry.answer.map((p, i) => <p key={i} className={i === 0 && !(k === 'parable' || k === 'tall-tale') ? 'ask2-lead' : undefined}>{p}</p>)}
          </div>
          <div className="ask2-actions">
            {entry.link && <EntryLink link={entry.link} />}
            <CopyLink id={entry.id} onStatus={onStatus} />
          </div>
          <EmailNudge />
        </>
      ) : (
        <NoMatch headingRef={headingRef} typed={typed ?? ''} closest={closest ?? []} onOpen={onOpen} onTopic={onTopic} onStatus={onStatus} />
      )}
    </article>
  );
});

/** The visitor's own mail app, with their question in the body. Nothing is sent from this page. */
export const mailtoFor = (question: string) => {
  const q = question.trim().slice(0, 300);
  return `mailto:${profile.email}?subject=${encodeURIComponent('A question from your portfolio')}&body=${encodeURIComponent(q)}`;
};

function CopyEmail({ onStatus }: { onStatus: (s: string) => void }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(profile.email); ok = true; } catch {
      try { const t = document.createElement('textarea'); t.value = profile.email; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); ok = document.execCommand('copy'); t.remove(); } catch { ok = false; }
    }
    setState(ok ? 'copied' : 'failed');
    onStatus(ok ? 'Copied' : `Could not copy. My email is ${profile.email}`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2600);
  };
  return (
    <button type="button" className="ask2-btn ask2-btn--secondary" data-state={state} onClick={copy}>
      {state === 'copied' ? <CheckIcon /> : <LinkIcon />}
      <span>{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy email address'}</span>
    </button>
  );
}

/**
 * Nothing in the notes answers this text. The page still has something useful to show, in this order: the closest
 * places on this site, a way to send the question to Vijay (his own mail app, nothing stored or sent from here), and
 * the six topics to start from. The typed text is only ever rendered as text.
 */
function NoMatch({ headingRef, typed, closest, onOpen, onTopic, onStatus }: {
  headingRef: React.Ref<HTMLHeadingElement>; typed: string; closest: Suggestion[];
  onOpen: (id: string) => void; onTopic: (t: Topic) => void; onStatus: (s: string) => void;
}) {
  const shown = closest.slice(0, 3);
  const quote = typed.trim().slice(0, 300);
  return (
    <div className="nm">
      <h2 ref={headingRef} tabIndex={-1} className="ask2-answer__h nm-head">I don’t have a written answer to that yet.</h2>
      <p className="ask2-prov"><PenIcon /><span>Every answer is written by Vijay, not generated.</span></p>

      {shown.length > 0 && (
        <section className="nm-sec" aria-labelledby="nm-close-h">
          <h3 id="nm-close-h" className="nm-h">Closest on this site</h3>
          <ul className="nm-list">
            {shown.map(s => {
              const inner = (
                <>
                  <span className="nm-row__t"><b>{s.title}</b>{s.desc && <small>{s.desc}</small>}</span>
                  <span className="sg__tag">{kindBadge[s.kind]}</span>
                  <Chev />
                </>
              );
              return (
                <li key={`${s.kind}:${s.id}`}>
                  {s.kind === 'question'
                    ? <button type="button" className="nm-row" onClick={() => onOpen(s.id)}>{inner}</button>
                    : isFile(s.href)
                      ? <a className="nm-row" href={s.href} target="_blank" rel="noreferrer">{inner}</a>
                      : <Link className="nm-row" to={s.href}>{inner}</Link>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="nm-sec" aria-labelledby="nm-send-h">
        <h3 id="nm-send-h" className="nm-h">Send it to me</h3>
        <p className="nm-sub">Ask me directly. Your question will already be in the message.</p>
        {quote && <p className="nm-mail__quote"><span className="sr-only">Your question: </span>{quote}</p>}
        <div className="nm-mail">
          <a className="ask2-btn ask2-btn--lg" href={mailtoFor(typed)}>Email me this question</a>
          <CopyEmail onStatus={onStatus} />
        </div>
        <p className="nm-fine">This opens your email app. Nothing is sent from this page.</p>
      </section>

      <section className="nm-sec" aria-labelledby="nm-topics-h">
        <h3 id="nm-topics-h" className="nm-h">Or start from a topic</h3>
        <ul className="nm-topics">
          {topics.map(t => (
            <li key={t.id}>
              <button type="button" className="nm-topic" onClick={() => onTopic(t)}>
                <span className="nm-topic__ic"><TopicIcon id={t.id} /></span>
                <span>{t.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Answer;
