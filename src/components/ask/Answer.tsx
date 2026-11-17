import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { isFiction, kindLabel, type Entry, type Kind } from '../../data/knowledge';

const arrow = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
);

export const kindShort: Record<Kind, string> = { true: 'From my notes', parable: 'Parable', 'tall-tale': 'Tall tale', analogy: 'Analogy' };

/** The line above an answer. Facts say where they come from; stories say they are stories. */
export function kindTag(e: Entry): string {
  const k = e.kind ?? 'true';
  return k === 'true' ? 'Written by Vijay, found in this portfolio. Not generated.' : `${kindLabel[k]}. Written by Vijay. Not generated.`;
}

/** A link that is a route, a hash on this site, or a mailto / file. */
export function EntryLink({ link }: { link: NonNullable<Entry['link']> }) {
  const external = link.href.startsWith('mailto:') || link.href.endsWith('.pdf') || link.href.startsWith('http');
  return external
    ? <a className="btn-c" href={link.href} {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{link.label}</a>
    : <Link className="btn-c" to={link.href}>{link.label}</Link>;
}

/** The answer text on its own, for the browse list. Same copy, same link, same label as the thread. */
export function AnswerCard({ entry }: { entry: Entry }) {
  const k = entry.kind ?? 'true';
  const fic = isFiction(entry);
  return (
    <div className="ask2-card" data-kind={k} role="group" aria-label={`${kindShort[k]}: ${entry.q}`}>
      {k !== 'true' && <p className="ask2-kind">{kindLabel[k]}</p>}
      {entry.answer.map((p, i) => <p key={i} className={i === 0 && !fic ? 'ask2-card__lead' : undefined}>{p}</p>)}
      {entry.link && <EntryLink link={entry.link} />}
    </div>
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};

interface Props {
  q: string;
  entry: Entry | null;
  /** Real entries to try when nothing matched. */
  doors: Entry[];
  /** Related questions for an answered entry. */
  next: Entry[];
  reduced: boolean;
  onOpen: (id: string) => void;
}

/**
 * One resolved answer. It "streams in": the tag, paragraphs, link and chips rise 12px with a 60ms stagger.
 * Under reduced motion it simply appears. The heading is the focus target after an answer resolves.
 */
const Answer = forwardRef<HTMLHeadingElement, Props>(function Answer({ q, entry, doors, next, reduced, onOpen }, headingRef) {
  const Item = (reduced ? 'div' : motion.div) as typeof motion.div;
  const itemProps = reduced ? {} : { variants: item };
  const k = entry?.kind ?? 'true';
  const fic = entry ? isFiction(entry) : false;
  return (
    <motion.div
      className="turn__body ask2-answer"
      data-kind={k}
      variants={container}
      initial={reduced ? false : 'hidden'}
      animate="show"
    >
      <h2 ref={headingRef} tabIndex={-1} className="ask2-answer__h">{entry ? <><span className="sr-only">{kindShort[k]}: </span>{entry.q}</> : `No match for: ${q}`}</h2>
      {entry && (
        <Item className="ask2-row" {...itemProps}>
          <p className={`turn__tag${k !== 'true' ? ' turn__tag--story' : ''}`}>{kindTag(entry)}</p>
        </Item>
      )}
      {entry ? (
        <>
          {entry.answer.map((p, i) => (
            <Item key={i} className="ask2-row" {...itemProps}><p className={i === 0 && !fic ? 'turn__lead' : undefined}>{p}</p></Item>
          ))}
          {entry.link && <Item className="ask2-row" {...itemProps}><EntryLink link={entry.link} /></Item>}
        </>
      ) : (
        <Item className="ask2-row" {...itemProps}>
          <p className="turn__lead">Hm, that one isn’t in my notes. I would rather say so than guess. Try asking it another way, or pick one of these.</p>
        </Item>
      )}
      {entry ? (
        next.length > 0 && (
          <Item className="ask2-row ask2-next" {...itemProps}>
            <p className="ask2-next__label" id={`next-${entry.id}`}>Next question <span>picked from related notes on this site</span></p>
            <div role="group" aria-labelledby={`next-${entry.id}`}>
              {next.map(d => <button key={d.id} type="button" className="ask2-next__chip" onClick={() => onOpen(d.id)}><span>{d.q}</span>{arrow}</button>)}
            </div>
          </Item>
        )
      ) : (
        <Item className="ask2-row turn__doors" {...itemProps}>
          <p>Questions I can answer</p>
          <div>{doors.map(d => <button key={d.id} type="button" onClick={() => onOpen(d.id)}>{d.chip ?? d.q}</button>)}</div>
        </Item>
      )}
    </motion.div>
  );
});

export default Answer;
