import { toPlainArticle, plain, type Beat } from '../data/brief';

/** `_word_` to <em>. The same marker the film uses for italic-serif emotion words. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(_[^_]+_)/g).filter(Boolean);
  return <>{parts.map((p, i) => (p.startsWith('_') ? <em key={i}>{p.slice(1, -1)}</em> : <span key={i}>{p}</span>))}</>;
}

const Mk = ({ children }: { children: string }) => <span className="v2-mk" aria-hidden="true">{children} </span>;

function BeatBlock({ b, film }: { b: Beat; film: boolean }) {
  const tab = film ? -1 : undefined; // in the film the visible scene owns the tab stops; this copy is for reading and find-in-page
  return (
    <div className="v2-art__beat" data-chapter={b.chapter}>
      {b.kind === 'principle' ? <h3><Mk>{`###`}</Mk><span className="v2-art__n" aria-hidden="true">{b.n}.</span><span className="sr-only">{b.n}. </span>{b.heading}</h3> : null}
      {b.paragraphs.map((p, i) => <p key={i}><Rich text={p} /></p>)}
      {b.items ? <ul>{b.items.map(i => <li key={i}><Rich text={i} /></li>)}</ul> : null}
      {b.analogy ? <p className="v2-art__analogy"><span aria-hidden="true">// </span>{plain(b.analogy)}</p> : null}
      {b.proof ? <p className="v2-art__proof">proof: <a href={b.proof.href} tabIndex={tab}>{b.proof.label}</a></p> : null}
      {b.links ? <ul className="v2-art__links">{b.links.map(l => <li key={l.href}><a href={l.href} tabIndex={tab} {...(l.href.startsWith('http') ? { rel: 'noopener noreferrer', target: '_blank' } : {})}>{l.label}</a></li>)}</ul> : null}
    </div>
  );
}

/**
 * The real document underneath the film, and the whole of the reading mode. One h1, h2 per section, h3 per principle.
 * `film`: visually hidden (still read aloud and searchable); its links are taken out of the tab order.
 */
export default function Article({ film = false }: { film?: boolean }) {
  const a = toPlainArticle();
  return (
    <article id="the-text" tabIndex={-1} className={film ? 'v2-art v2-sr' : 'v2-art'} aria-labelledby="v2-title">
      <h1 id="v2-title"><Mk>#</Mk>{a.title}</h1>
      <p className="v2-art__meta">{a.meta}</p>
      <blockquote className="v2-art__prompts">{a.prompts.map(p => <p key={p}><span aria-hidden="true">&gt; </span>{p}</p>)}</blockquote>
      {a.sections.map(s => (
        <section key={s.id} aria-labelledby={`h-${s.id}`}>
          <h2 id={`h-${s.id}`}><Mk>##</Mk>{s.h2}</h2>
          {s.intro ? <p className="v2-art__intro"><Rich text={s.intro} /></p> : null}
          {s.beats.map(b => <BeatBlock key={b.id} b={b} film={film} />)}
        </section>
      ))}
    </article>
  );
}
