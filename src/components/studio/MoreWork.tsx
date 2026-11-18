import { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { moreIds, thumbImage } from '../../data/home';
import { getProject, statusLabel } from '../work/workMeta';
import ArrowIcon from '../work/ArrowIcon';
import '../../styles/work.css';

/**
 * "More projects": collapsed by default, expands in place. Each row is one big link (stretched
 * title link). On a mouse the project's screen follows the pointer; on touch and narrow screens the
 * thumbnail is shown inline so nothing depends on hover.
 */
export default function MoreWork() {
  const rows = moreIds.map(getProject);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const panelId = useId();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  // A link such as /#more or /#more-renewly opens the list instead of pointing at nothing.
  useEffect(() => {
    const check = () => {
      const h = window.location.hash;
      if (h === '#more' || h.startsWith('#more-')) setOpen(true);
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);

  return (
    <section className="wk-more" id="more" aria-labelledby="more-h">
      <div className="wk-more__head">
        <h2 id="more-h" className="wk-more__h">
          More projects <span className="wk-more__count" aria-label={`${rows.length} more`}>· {rows.length}</span>
        </h2>
        <button
          type="button"
          className="wk-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => { setOpen(o => !o); setHover(null); }}
        >
          <span>{open ? 'Show fewer' : 'Show more'}</span>
          <svg className="wk-toggle__chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            className="wk-more__panel"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { height: { type: 'spring', stiffness: 170, damping: 26 }, opacity: { duration: 0.25 } }}
          >
            <ul className="wk-rows" onPointerMove={e => { if (e.pointerType === 'mouse') { x.set(e.clientX - 150); y.set(e.clientY - 100); } }} onPointerLeave={() => setHover(null)}>
              {rows.map((p, i) => (
                <li key={p.id} id={`more-${p.id}`} className="wk-row" onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(p.id); }} onFocus={() => setHover(p.id)} onBlur={() => setHover(null)}>
                  <span className="wk-row__n" aria-hidden="true">{String(i + 5).padStart(2, '0')}</span>
                  <img className="wk-row__thumb" src={thumbImage(p.id)} alt="" loading="lazy" draggable={false} />
                  <div className="wk-row__main">
                    <h3 className="wk-row__title"><Link to={p.href} className="wk-link">{p.title}<span className="wk-sr"> case study</span></Link></h3>
                    <p className="wk-row__line">{p.subtitle}</p>
                  </div>
                  <span className="wk-row__meta">{p.category.split(' / ')[0]} · {p.year}</span>
                  <span className="wk-chip">{statusLabel(p)}</span>
                  <span className="wk-row__go" aria-hidden="true"><ArrowIcon size={20} /></span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="wk-peek" style={{ x: sx, y: sy }} aria-hidden="true">
        <AnimatePresence>
          {open && hover && (
            <motion.img key={hover} src={thumbImage(hover)} alt="" initial={{ opacity: 0, scale: 0.86, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }} />
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
