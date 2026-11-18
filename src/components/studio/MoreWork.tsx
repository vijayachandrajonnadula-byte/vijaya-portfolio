import { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { moreIds, thumbImage } from '../../data/home';
import { getProject } from '../work/workMeta';
import { useCalm } from '../../lib/calm';
import ArrowIcon from '../work/ArrowIcon';
import '../../styles/work.css';

/**
 * "More projects": collapsed by default (progressive disclosure, Hick), expands in place. Each row is one big link
 * (stretched title link) with only what helps a choice: title, one sentence, year. Status chips, categories, row numbers
 * and the cursor-following preview are gone (Occam, Selective Attention). On narrow screens a small thumbnail is shown inline.
 * The panel opens with a short tween, and instantly when the system asks for reduced motion.
 */
export default function MoreWork() {
  const rows = moreIds.map(getProject);
  const [open, setOpen] = useState(false);
  const calm = useCalm();
  const panelId = useId();

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
        <h3 id="more-h" className="wk-more__h">
          More projects <span className="wk-more__count"><span aria-hidden="true">· </span>{rows.length}<span className="sr-only"> more</span></span>
        </h3>
        <button
          type="button"
          className="wk-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(o => !o)}
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
            initial={calm ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={calm ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
            transition={calm ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="wk-rows">
              {rows.map(p => (
                <li key={p.id} id={`more-${p.id}`} className="wk-row">
                  <img className="wk-row__thumb" src={thumbImage(p.id)} alt="" loading="lazy" draggable={false} />
                  <div className="wk-row__main">
                    <h3 className="wk-row__title"><Link to={p.href} className="wk-link">{p.title}<span className="sr-only"> case study</span></Link></h3>
                    <p className="wk-row__line">{p.subtitle}</p>
                  </div>
                  <span className="wk-row__meta">{p.year}</span>
                  <span className="wk-row__go" aria-hidden="true"><ArrowIcon size={20} /></span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
