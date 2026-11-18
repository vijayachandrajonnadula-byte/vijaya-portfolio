import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { workImage } from '../../data/home';
import type { spotlight } from '../../data/home';
import { getProject, statusLabel, isExternal } from './workMeta';
import { useCalm } from '../../lib/calm';
import ArrowIcon from './ArrowIcon';
import '../../styles/work.css';

type Item = (typeof spotlight)[number];

/** Only these two statuses say something a visitor can act on or should know; "Complete" is the default and is not shown. */
const SHOWN_STATUS = new Set(['Working prototype', 'Process']);

/**
 * One featured project, reduced to what a visitor needs to choose (Hick, Occam, Miller):
 * image, one meta line (year, category), title, one sentence, then the call to action.
 * The title is the only link in the card's flow; its ::after covers the whole card, so a click or tap anywhere opens
 * the case study (stretched link, Fitts). The optional "Open prototype" link sits above that overlay.
 * All four cards are the same size so the screens can be compared (Similarity, Common region).
 * Motion: a 2px lift on hover (fine pointer, reduced motion off) and nothing else: no tilt, no cursor-follow, no image zoom.
 */
export default function WorkCard({ item, index }: { item: Item; index: number }) {
  const p = getProject(item.id);
  const calm = useCalm();

  const status = statusLabel(p);
  const proto = p.prototypeUrl;
  const external = proto ? isExternal(proto) : false;

  return (
    <motion.article
      className="wk-card"
      data-index={index}
      style={{ ['--tint' as string]: item.tint }}
      initial={calm ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={calm ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="wk-media" aria-hidden="true">
        <div className="wk-media__shot"><img src={workImage(p.id)} alt="" loading="lazy" draggable={false} /></div>
      </div>

      <div className="wk-body">
        <p className="wk-meta">
          <span>{p.year} · {p.category.split(' / ')[0]}</span>
          {SHOWN_STATUS.has(status) && <span className="wk-chip">{status}</span>}
        </p>
        <h3 className="wk-title">
          <Link to={p.href} className="wk-link">{p.title}<span className="sr-only"> case study</span></Link>
        </h3>
        <p className="wk-line">{item.line}</p>
        <div className="wk-foot">
          <span className="wk-cta" aria-hidden="true">Read the case study <ArrowIcon /></span>
          {proto && (
            <a
              className="wk-proto"
              href={proto}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-label={`Open prototype: ${p.title}${external ? ' (opens in a new tab)' : ''}`}
            >
              Open prototype
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
