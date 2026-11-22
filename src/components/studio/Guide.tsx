import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Character from './Character';
import { SendIcon } from '../ask/icons';
import { askHref, entryById } from '../../data/knowledge';
import { guideStarterIds } from '../../data/topics';
import '../../styles/ask.css';

/** One line per place. The popover is a mini version of /ask, not a second personality. */
const LINE_HOME = 'Ask about my work, how I work, or how to get in touch.';
const LINE_PAGE = 'Questions about this project or how I work? Ask here.';
const TRUST = 'Written by Vijay, not generated.';
/** The text, strip and button blocks of a case-study opening (shared with SectionSheet's chip). */
const HERO_TEXT = '.cs-hero__subtitle, .cs-hero__brief, .cs-hero__tags, .cs-hero__actions, .cs-hero__meta, .pk-hero__sum, .pk-hero__actions, .pk-hero__meta';

/**
 * The guide: a small "Ask" launcher in the corner that opens a non-modal mini version of /ask: one line, the field,
 * two starter questions and a link to the full page. Esc closes it and hands focus back to the launcher; opening it moves
 * focus to the field. It never opens by itself.
 * The launcher is hidden (a fade, no layout change) while the home hero (`[data-hero]`) is on screen, and while the page
 * footer is on screen, so it never sits on top of primary content or the footer links. It is not rendered on /ask.
 * On small screens it sits above the bottom navigation pill (`--vj-pill-h`).
 */
export default function Guide() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const reduced = useReducedMotion();
  const titleId = useId();
  const popId = useId();
  const [open, setOpen] = useState(false);
  const [heroOn, setHeroOn] = useState(false); // the home hero is on screen
  const [footOn, setFootOn] = useState(false); // the footer is on screen
  const [caseHeroOn, setCaseHeroOn] = useState(false); // a case-study opening is on screen (phones hide the launcher then, see audit-shared.css)
  const [value, setValue] = useState('');
  const [hint, setHint] = useState('');
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const onHome = pathname === '/';
  const hidden = pathname === '/ask';

  useEffect(() => { setOpen(false); }, [pathname]);

  // hide the launcher while the home hero is on screen; the hero may mount a moment after the route changes
  useEffect(() => {
    setHeroOn(false);
    if (!onHome) return;
    let io: IntersectionObserver | undefined;
    let tries = 0;
    let raf = 0;
    const find = () => {
      const hero = document.querySelector('[data-hero]');
      if (hero) {
        io = new IntersectionObserver(([en]) => { const on = !!en?.isIntersecting; setHeroOn(on); if (on) setOpen(false); }, { threshold: 0.15 });
        io.observe(hero);
      } else if (tries++ < 60) raf = window.requestAnimationFrame(find);
    };
    find();
    return () => { io?.disconnect(); window.cancelAnimationFrame(raf); };
  }, [onHome]);

  // case-study pages: remember whether the opening (title, strip, buttons) is on screen so the launcher can stay off its buttons
  useEffect(() => {
    setCaseHeroOn(false);
    if (onHome) return;
    let io: IntersectionObserver | undefined;
    let tries = 0;
    let raf = 0;
    const find = () => {
      const parts = document.querySelectorAll(HERO_TEXT);
      if (parts.length) {
        const live = new Set<Element>();
        io = new IntersectionObserver(entries => {
          entries.forEach(en => { if (en.isIntersecting) live.add(en.target); else live.delete(en.target); });
          setCaseHeroOn(live.size > 0);
        }, { threshold: 0 });
        parts.forEach(el => io!.observe(el));
      } else if (tries++ < 30) raf = window.requestAnimationFrame(find);
    };
    find();
    return () => { io?.disconnect(); window.cancelAnimationFrame(raf); };
  }, [pathname, onHome]);

  // and while the footer is on screen
  useEffect(() => {
    setFootOn(false);
    let io: IntersectionObserver | undefined;
    let tries = 0;
    let raf = 0;
    const find = () => {
      const foot = document.querySelector('footer');
      if (foot) {
        io = new IntersectionObserver(([en]) => setFootOn(!!en?.isIntersecting), { threshold: 0 });
        io.observe(foot);
      } else if (tries++ < 60) raf = window.requestAnimationFrame(find);
    };
    find();
    return () => { io?.disconnect(); window.cancelAnimationFrame(raf); };
  }, [pathname]);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    setHint('');
    if (returnFocus) window.requestAnimationFrame(() => launcher.current?.focus());
  }, []);

  // opening moves focus to the field
  useEffect(() => {
    if (open) window.requestAnimationFrame(() => input.current?.focus());
  }, [open]);

  // Esc: clear the field first, then close and give focus back to the launcher
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const inside = !!(document.activeElement && document.activeElement.closest('.guide__bubble'));
      if (inside && value) { e.preventDefault(); setValue(''); return; }
      e.preventDefault();
      close(inside || document.activeElement === launcher.current);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, value, close]);

  if (hidden) return null;
  const starters = guideStarterIds.map(id => entryById(id)).filter((e): e is NonNullable<typeof e> => !!e).slice(0, 2);
  const away = heroOn || (footOn && !open);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) { setHint(h => (h === 'Type a question or pick one' ? 'Type a question or pick one​' : 'Type a question or pick one')); return; }
    setValue(''); setHint(''); setOpen(false);
    nav(`/ask?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="guide" data-away={away ? 'true' : undefined} data-case-hero={caseHeroOn && !open ? 'true' : undefined}>
      <AnimatePresence>
        {open && (
          <motion.div
            id={popId}
            className="guide__bubble ask2-pop"
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reduced ? 0 : 0.18, ease: 'easeOut' }}
          >
            <div className="ask2-pop__head">
              <h2 id={titleId} className="ask2-pop__title">Ask Vijay</h2>
              <button type="button" className="ask2-pop__x" aria-label="Close" onClick={() => close(true)}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>
            <p className="ask2-pop__line">{onHome ? LINE_HOME : LINE_PAGE}</p>
            <form onSubmit={submit} role="search">
              <label className="sr-only" htmlFor="guide-q">Your question</label>
              <input ref={input} id="guide-q" value={value} onChange={e => setValue(e.target.value)} placeholder="Ask me anything…" maxLength={140} autoComplete="off" enterKeyHint="send" aria-describedby={`${popId}-trust`} />
              <button type="submit" aria-label="Ask"><SendIcon /></button>
            </form>
            <div className="guide__chips" role="group" aria-label="Starter questions">
              {starters.map(e => <button key={e.id} type="button" onClick={() => { setOpen(false); nav(askHref(e.id)); }}>{e.chip ?? e.q}</button>)}
            </div>
            <div className="ask2-pop__foot">
              <p id={`${popId}-trust`} className="ask2-note">{TRUST}</p>
              <Link to="/ask" className="ask2-pop__more" onClick={() => setOpen(false)}>Open the full Ask page</Link>
            </div>
            <p className="sr-only" role="status" aria-live="polite">{hint}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <button ref={launcher} type="button" className="guide__btn ask2-launch" aria-expanded={open} aria-controls={open ? popId : undefined} aria-label="Ask a question" onClick={() => (open ? close(true) : setOpen(true))}>
        <Character size={34} pose="rest" />
        <span aria-hidden="true">Ask</span>
      </button>
    </div>
  );
}
