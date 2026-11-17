import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Character, { type Pose } from './Character';
import { profile } from '../../data/profile';
import { quirks } from '../../data/quirks';
import { askHref, entryById } from '../../data/knowledge';
import { guideStarterIds } from '../../data/topics';
import '../../styles/ask.css';

interface Line { text: string; pose: Pose; action?: { label: string; href: string } }

const HOME: Record<string, Line> = {
  top: { text: quirks.guide.top, pose: 'wave' },
  work: { text: quirks.guide.work, pose: 'point' },
  more: { text: quirks.guide.more, pose: 'rest' },
  about: { text: quirks.guide.about, pose: 'think' },
  contact: { text: quirks.guide.contact, pose: 'wave', action: { label: 'Draft email', href: `mailto:${profile.email}` } },
};
const CASE: Line = { text: quirks.guide.page, pose: 'think' };

/**
 * The guide: Clay sits in the corner. The launcher opens a small, non-modal "Ask Clay" popover: one line, the field
 * and two starter questions (Hick's law). Esc closes it and hands focus back to the launcher; opening it moves focus
 * to the field. It never opens by itself. While the home hero (`[data-hero]`) is on screen the launcher fades out,
 * because the hero has its own ask box, and returns once the hero has scrolled away.
 */
export default function Guide() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const reduced = useReducedMotion();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [away, setAway] = useState(false); // the home hero is on screen
  const [section, setSection] = useState('top');
  const [hop, setHop] = useState(0);
  const [value, setValue] = useState('');
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const onHome = pathname === '/';
  const hidden = pathname === '/ask';

  // which home section is in the middle of the screen
  useEffect(() => {
    if (!onHome) return;
    const ids = ['top', 'work', 'more', 'about', 'contact'];
    const els = ids.map(i => document.getElementById(i)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(es => { const v = es.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (v) setSection(v.target.id); }, { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.2, 0.5] });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => { setHop(h => h + 1); }, [section, pathname]);
  useEffect(() => { setOpen(false); }, [pathname]);

  // hide the launcher while the home hero is on screen; the hero may mount a moment after the route changes
  useEffect(() => {
    setAway(false);
    if (!onHome) return;
    let io: IntersectionObserver | undefined;
    let tries = 0;
    let raf = 0;
    const find = () => {
      const hero = document.querySelector('[data-hero]');
      if (hero) {
        io = new IntersectionObserver(([en]) => { const on = !!en?.isIntersecting; setAway(on); if (on) setOpen(false); }, { threshold: 0.15 });
        io.observe(hero);
      } else if (tries++ < 60) raf = window.requestAnimationFrame(find);
    };
    find();
    return () => { io?.disconnect(); window.cancelAnimationFrame(raf); };
  }, [onHome]);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) window.requestAnimationFrame(() => launcher.current?.focus());
  }, []);

  const toggle = () => {
    if (open) { close(true); return; }
    setOpen(true);
  };

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
  const line = onHome ? (HOME[section] ?? HOME.top!) : CASE;
  const placeholder = onHome ? quirks.guide.placeholders[hop % quirks.guide.placeholders.length]! : quirks.guide.pagePlaceholder;
  const starters = guideStarterIds.map(id => entryById(id)).filter((e): e is NonNullable<typeof e> => !!e);

  return (
    <div className="guide" data-hop={hop} data-away={away ? 'true' : undefined}>
      <AnimatePresence>
        {open && (
          <motion.div
            className="guide__bubble ask2-pop"
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            initial={reduced ? false : { opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ask2-pop__head">
              <h2 id={titleId} className="ask2-pop__title">{quirks.guide.title}</h2>
              <button type="button" className="ask2-pop__x" aria-label="Close" onClick={() => close(true)}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>
            <p>{line.text}</p>
            {line.action && <a className="guide__act" href={line.action.href}>{line.action.label}</a>}
            <div className="guide__chips" role="group" aria-label="Starter questions">
              {starters.map(e => <button key={e.id} type="button" onClick={() => { setOpen(false); nav(askHref(e.id)); }}>{e.chip ?? e.q}</button>)}
            </div>
            <form onSubmit={e => { e.preventDefault(); const q = value.trim(); if (q) { setValue(''); nav(`/ask?q=${encodeURIComponent(q)}`); } }}>
              <label className="sr-only" htmlFor="guide-q">{onHome ? 'Ask Clay a question' : 'Ask about this project'}</label>
              <input ref={input} id="guide-q" value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} maxLength={140} autoComplete="off" enterKeyHint="send" />
              <button type="submit" aria-label="Send" disabled={!value.trim()}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
              </button>
            </form>
            <p className="ask2-note">{quirks.guide.honest}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <button ref={launcher} type="button" className="guide__btn" aria-expanded={open} aria-label="Ask Clay" onClick={toggle}>
        <Character size={64} pose={open ? line.pose : 'rest'} peek track />
      </button>
    </div>
  );
}
