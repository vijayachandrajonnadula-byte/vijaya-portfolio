import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { beats, principles } from '../data/brief';
import { goTo, useCurrentBeat } from '../film';
import { Caret } from './bits';

/**
 * The film's chrome. Top left: the file name (back to the top). Top right: the index pill (burger morphs into an X).
 * Centre: a breadcrumb pill with the current "## section" that grows open with an expo ease (max-width, 0.9s).
 * Top edge: a slim progress hairline, scroll-linked and chapter-coloured. Bottom: the plain-version link, raw .md and a key hint.
 * Pills are opaque in the colour of the chapter you are in and recolour with it over .6s (cubic-bezier .16,1,.3,1), so they stay
 * legible (AA) everywhere. Scenes keep their text above the footer through --v2-safe-bottom (tokens.css).
 */
const KEYED = 'v2-keyed';
const readKeyed = () => { try { return sessionStorage.getItem(KEYED) === '1'; } catch { return false; } };

export default function HUD({ indexOpen, onIndex, onRaw }: { indexOpen: boolean; onIndex: (origin: { x: number; y: number }) => void; onRaw: () => void }) {
  const i = useCurrentBeat();
  const b = beats[i]!;
  const btn = useRef<HTMLButtonElement>(null);
  const [idle, setIdle] = useState(false);
  const [keyed, setKeyed] = useState(readKeyed);
  const { scrollYProgress } = useScroll();

  // the "space" hint: after 4 seconds without scrolling or keys; gone for good once a navigation key was used
  useEffect(() => {
    let t = window.setTimeout(() => setIdle(true), 4000);
    const reset = () => { setIdle(false); window.clearTimeout(t); t = window.setTimeout(() => setIdle(true), 4000); };
    const onKey = (e: KeyboardEvent) => {
      reset();
      if ([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.key)) {
        setKeyed(true);
        try { sessionStorage.setItem(KEYED, '1'); } catch { /* private mode */ }
      }
    };
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(t); window.removeEventListener('scroll', reset); window.removeEventListener('keydown', onKey); };
  }, []);

  const crumb = b.kind === 'title' ? '# VIJAY.md' : `## ${b.section}`;
  const count = b.kind === 'principle' ? ` ${b.n}/${principles.length}` : '';
  const open = () => {
    const r = btn.current?.getBoundingClientRect();
    onIndex(r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: window.innerWidth - 60, y: 30 });
  };
  // the title has its own cue; the hint would repeat it
  const showHint = idle && !keyed && b.kind !== 'title' && !indexOpen;

  return (
    <>
      <header className="v2-hud" data-chapter={indexOpen ? 'ink' : b.chapter}>
        <motion.i className="v2-prog" aria-hidden="true" style={{ scaleX: scrollYProgress }} />
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
        <span className={`v2-hint${showHint ? ' is-idle' : ''}`} aria-hidden="true"><kbd>space</kbd> = next <span>·</span> <kbd>i</kbd> = index</span>
      </footer>
    </>
  );
}
