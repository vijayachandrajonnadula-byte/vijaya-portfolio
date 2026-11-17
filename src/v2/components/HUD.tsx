import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { beats, principles } from '../data/brief';
import { goTo, useCurrentBeat } from '../film';
import { Caret } from './bits';

/**
 * The film's chrome. Top left: the file name (back to the top). Top right: the index pill (burger turns into an X).
 * Centre: a breadcrumb pill with the current "## section". Bottom: the plain-version link and a key hint.
 * Pills are opaque in the colour of the chapter you are in and switch with it over .6s, so they stay legible (AA) everywhere.
 */
export default function HUD({ indexOpen, onIndex, onRaw }: { indexOpen: boolean; onIndex: (origin: { x: number; y: number }) => void; onRaw: () => void }) {
  const i = useCurrentBeat();
  const b = beats[i]!;
  const btn = useRef<HTMLButtonElement>(null);
  const [idle, setIdle] = useState(false);

  // "space" hint after 4 seconds without scrolling or keys
  useEffect(() => {
    let t = window.setTimeout(() => setIdle(true), 4000);
    const reset = () => { setIdle(false); window.clearTimeout(t); t = window.setTimeout(() => setIdle(true), 4000); };
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('keydown', reset);
    return () => { window.clearTimeout(t); window.removeEventListener('scroll', reset); window.removeEventListener('keydown', reset); };
  }, []);

  const crumb = b.kind === 'title' ? '# VIJAY.md' : `## ${b.section}`;
  const count = b.kind === 'principle' ? ` ${b.n}/${principles.length}` : '';
  const open = () => {
    const r = btn.current?.getBoundingClientRect();
    onIndex(r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: window.innerWidth - 60, y: 30 });
  };

  return (
    <>
      <header className="v2-hud" data-chapter={indexOpen ? 'ink' : b.chapter}>
        <a className="v2-pill v2-pill--file" href="#title" onClick={e => { e.preventDefault(); goTo(0); }} aria-label="VIJAY.md, back to the top">
          <span aria-hidden="true">VIJAY.md</span><Caret />
        </a>
        <div className="v2-crumb-slot" aria-hidden="true">
          <span key={crumb + count} className="v2-pill v2-crumb"><span className="v2-crumb__t">{crumb}</span>{count ? <span className="v2-crumb__n">{count}</span> : null}</span>
        </div>
        <button ref={btn} type="button" className="v2-pill v2-pill--index" aria-haspopup="dialog" aria-expanded={indexOpen} onClick={open}>
          <span>index</span>
          <span className={`v2-burger${indexOpen ? ' is-x' : ''}`} aria-hidden="true"><i /><i /></span>
        </button>
      </header>
      <footer className="v2-foot" data-hide={indexOpen ? 'true' : undefined} data-chapter={indexOpen ? 'ink' : b.chapter}>
        <Link className="v2-foot__link" to={{ search: '?read' }}>Read the plain version</Link>
        <button type="button" className="v2-foot__link v2-foot__raw" onClick={onRaw}>raw .md</button>
        <span className={`v2-hint${idle ? ' is-idle' : ''}`}><kbd>space</kbd> = next <span aria-hidden="true">·</span> <kbd>i</kbd> = index</span>
      </footer>
    </>
  );
}
