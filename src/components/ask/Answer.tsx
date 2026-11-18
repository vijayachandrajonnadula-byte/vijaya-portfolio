import { forwardRef, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { kindLabel, type Entry, type Kind } from '../../data/knowledge';
import { profile } from '../../data/profile';
import { Chev, CheckIcon, LinkIcon, PenIcon } from './icons';

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
  /** Real entries to try when nothing matched. */
  doors: Entry[];
  onOpen: (id: string) => void;
  onStatus: (s: string) => void;
}

/**
 * One resolved answer. Direct answer large, details smaller, one source link, a quiet copy-link button and one line to email.
 * It appears at once (retrieval, no fake thinking); the page fades the view in. The heading is the focus target.
 */
const Answer = forwardRef<HTMLHeadingElement, Props>(function Answer({ typed, entry, doors, onOpen, onStatus }, headingRef) {
  const k = entry?.kind ?? 'true';
  return (
    <article className="ask2-answer" data-kind={entry ? k : 'none'}>
      {typed && <p className="ask2-asked">You asked: <q>{typed}</q>{entry ? '. Closest note:' : ''}</p>}
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
        <>
          <h2 ref={headingRef} tabIndex={-1} className="ask2-answer__h">That one isn’t in my notes yet.</h2>
          <div className="ask2-body">
            <p className="ask2-lead">I would rather say so than guess. Try asking it another way, or pick one of these.</p>
          </div>
          <ul className="tb-list ask2-doors" aria-label="Questions I can answer">
            {doors.map(d => (
              <li key={d.id}><button type="button" className="tb-q" onClick={() => onOpen(d.id)}><span>{d.q}</span><Chev /></button></li>
            ))}
          </ul>
          <EmailNudge lead="Want to ask me directly?" />
        </>
      )}
    </article>
  );
});

export default Answer;
