import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Character from '../studio/Character';
import { workImage } from '../../data/home';
import type { spotlight } from '../../data/home';
import { getProject, roleOf, statusLabel, isExternal } from './workMeta';
import { useCardFx } from './useCardFx';
import ArrowIcon from './ArrowIcon';
import '../../styles/work.css';

type Item = (typeof spotlight)[number];

/**
 * One featured project. The title is the only link in the card's flow; its ::after covers the whole
 * card, so a click or tap anywhere opens the case study (stretched-link pattern). The optional
 * "Open prototype" link sits above that overlay. Everything a visitor needs to choose is visible
 * without hover: status, title, summary, meta and the call to action.
 */
export default function WorkCard({ item, index }: { item: Item; index: number }) {
  const p = getProject(item.id);
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState(false);
  const reduced = useReducedMotion();
  useCardFx(ref);

  const status = statusLabel(p);
  const role = roleOf(p);
  const proto = p.prototypeUrl;
  const external = proto ? isExternal(proto) : false;
  const size = index === 0 || index === 3 ? 'wide' : 'narrow';

  return (
    <motion.article
      ref={ref}
      className={`wk-card wk-card--${size}${hover ? ' is-hover' : ''}`}
      style={{ ['--tint' as string]: item.tint }}
      onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(true); }}
      onPointerLeave={() => setHover(false)}
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 90, damping: 20, mass: 0.9, delay: (index % 2) * 0.09 }}
    >
      <div className="wk-media" aria-hidden="true">
        <div className="wk-media__shot"><img src={workImage(p.id)} alt="" loading="lazy" draggable={false} /></div>
        <div className="wk-media__char"><Character size={112} pose={hover ? 'wave' : 'hold'} prop={item.prop} /></div>
      </div>

      <div className="wk-body">
        <div className="wk-body__top">
          <span className={`wk-chip wk-chip--${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
          <ul className="wk-meta" aria-label="Project details">
            <li>{p.year}</li>
            <li>{p.category.split(' / ')[0]}</li>
            {role && size === 'wide' && <li>{role.split(',')[0]}</li>}
          </ul>
        </div>
        <h3 className="wk-title">
          <Link to={p.href} className="wk-link">{p.title}<span className="wk-sr"> case study</span></Link>
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
