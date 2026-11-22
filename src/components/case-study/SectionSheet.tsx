import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { markJump } from './jump';
import '../../styles/audit-shared.css';

export interface SheetSection { id: string; label: string }

const HERO_TEXT = '.cs-hero__subtitle, .cs-hero__brief, .cs-hero__tags, .cs-hero__actions, .cs-hero__meta, .pk-hero__sum, .pk-hero__actions, .pk-hero__meta';
const CHAPTERS = ['Context', 'Research', 'Design', 'Build', 'Result'];
const RING_R = 15;
const RING_C = 2 * Math.PI * RING_R;

/** Group into at most 5 ordered chapters when the list is long; otherwise one flat group. */
function groupSections(sections: SheetSection[]) {
  if (sections.length <= 8) return [{ name: '', items: sections.map((s, i) => ({ ...s, n: i + 1 })) }];
  const size = Math.ceil(sections.length / CHAPTERS.length);
  const out: { name: string; items: (SheetSection & { n: number })[] }[] = [];
  for (let c = 0; c * size < sections.length; c++) {
    out.push({
      name: CHAPTERS[c] ?? `Part ${c + 1}`,
      items: sections.slice(c * size, (c + 1) * size).map((s, i) => ({ ...s, n: c * size + i + 1 })),
    });
  }
  return out;
}

/**
 * Mobile / tablet section navigation for every case study.
 * Fed by the same section list as the desktop rail (CaseStudyNav or the PULSE rail).
 * `variant` only decides at which width the chip takes over from the rail.
 */
export default function SectionSheet({ sections, variant }: { sections: SheetSection[]; variant: 'cs' | 'pk' }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const chipRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const idsKey = sections.map(s => s.id).join('|');

  // scroll-spy + overall progress (own listener so it works for both template families)
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const els = sections.map(s => document.getElementById(s.id));
      const line = window.innerHeight * 0.3;
      let idx = 0;
      els.forEach((el, i) => { if (el && el.getBoundingClientRect().top <= line) idx = i; });
      setCurrent(prev => (prev === idx ? prev : idx));
      const first = els.find(Boolean);
      const last = [...els].reverse().find(Boolean);
      if (first && last) {
        const top = first.getBoundingClientRect().top + window.scrollY;
        const bottom = last.getBoundingClientRect().bottom + window.scrollY;
        const span = Math.max(1, bottom - top - window.innerHeight * 0.6);
        const p = Math.min(1, Math.max(0, (window.scrollY + line - top) / span));
        setProgress(prev => (Math.abs(prev - p) < 0.004 ? prev : p));
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  // on phones the chip stays off the opening's text, strip and buttons (audit-shared.css reads data-hero)
  const [heroOn, setHeroOn] = useState(false);
  useEffect(() => {
    let io: IntersectionObserver | undefined;
    let tries = 0;
    let raf = 0;
    const find = () => {
      const parts = document.querySelectorAll(HERO_TEXT);
      if (parts.length) {
        const live = new Set<Element>();
        io = new IntersectionObserver(entries => {
          entries.forEach(en => { if (en.isIntersecting) live.add(en.target); else live.delete(en.target); });
          setHeroOn(live.size > 0);
        }, { threshold: 0 });
        parts.forEach(el => io!.observe(el));
      } else if (tries++ < 30) raf = window.requestAnimationFrame(find);
    };
    find();
    return () => { io?.disconnect(); window.cancelAnimationFrame(raf); };
  }, [idsKey]);

  // while the sheet is open the floating chip and the Ask launcher step out of the way (audit-shared.css)
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.classList.add('cs-sheet-open');
    return () => html.classList.remove('cs-sheet-open');
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => chipRef.current?.focus({ preventScroll: true }), 0);
  }, []);

  // focus entry, Esc, focus trap
  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    const active = sheet?.querySelector<HTMLElement>('[aria-current="location"]');
    (active ?? sheet?.querySelector<HTMLElement>('button, a'))?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab' || !sheet) return;
      const f = Array.from(sheet.querySelectorAll<HTMLElement>('button, a[href]')).filter(el => !el.hasAttribute('disabled'));
      if (!f.length) return;
      const first = f[0]!, last = f[f.length - 1]!;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!sheet.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  // the sheet is a mobile affordance: close it if the viewport grows past the breakpoint
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia(variant === 'pk' ? '(min-width: 1101px)' : '(min-width: 1025px)');
    const on = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [open, variant]);

  const pick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    markJump();
    setOpen(false);
    if (el) {
      window.setTimeout(() => {
        if (window.__lenis) window.__lenis.scrollTo(el, { offset: -88 });
        else {
          const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        }
        history.replaceState(null, '', `#${id}`);
      }, 30);
    }
    window.setTimeout(() => chipRef.current?.focus({ preventScroll: true }), 60);
  };

  if (sections.length === 0) return null;
  const groups = groupSections(sections);
  const total = sections.length;
  const here = Math.min(current, total - 1);

  return (
    <>
      <button
        ref={chipRef}
        type="button"
        className={`cs-sheet-chip cs-sheet-chip--${variant}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-open={open ? 'true' : undefined}
        data-hero={heroOn ? 'true' : undefined}
        onClick={() => setOpen(true)}
      >
        <svg className="cs-sheet-ring" viewBox="0 0 36 36" width="32" height="32" aria-hidden="true">
          <circle cx="18" cy="18" r={RING_R} className="cs-sheet-ring__bg" />
          <circle
            cx="18" cy="18" r={RING_R}
            className="cs-sheet-ring__fg"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - progress)}
            transform="rotate(-90 18 18)"
          />
        </svg>
        <span className="cs-sheet-chip__txt">
          <b>Sections</b>
          <span>{here + 1} of {total}</span>
        </span>
      </button>

      {open && createPortal(
        <div className={`cs-sheet-root cs-sheet-root--${variant}`}>
          <button type="button" className="cs-sheet-scrim" aria-label="Close sections" tabIndex={-1} onClick={close} />
          <div ref={sheetRef} className="cs-sheet" role="dialog" aria-modal="true" aria-label="Case study sections">
            <div className="cs-sheet__grab" aria-hidden="true" />
            <div className="cs-sheet__head">
              <div>
                <p className="cs-sheet__here">You are here: {here + 1} of {total}</p>
                <p className="cs-sheet__name">{sections[here]?.label}</p>
              </div>
              <button type="button" className="cs-sheet__x" onClick={close} aria-label="Close sections">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>
            <div className="cs-sheet__bar" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>
            <div className="cs-sheet__list" data-lenis-prevent>
              {groups.map(g => (
                <section key={g.name || 'all'} className="cs-sheet__group" aria-label={g.name || undefined}>
                  {g.name && <h2 className="cs-sheet__chapter">{g.name}</h2>}
                  <ol>
                    {g.items.map(s => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          onClick={pick(s.id)}
                          aria-current={s.n - 1 === here ? 'location' : undefined}
                        >
                          <span className="cs-sheet__n">{String(s.n).padStart(2, '0')}</span>
                          <span>{s.label}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
