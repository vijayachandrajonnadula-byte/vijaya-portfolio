import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { workImage } from '../../data/home';
import type { spotlight } from '../../data/home';
import { glimpseOf } from '../../data/glimpses';
import { getProject, statusLabel, isExternal } from './workMeta';
import { canPlay, useCalm } from '../../lib/calm';
import Character from '../studio/Character';
import GlimpseVideo from '../studio/GlimpseVideo';
import ArrowIcon from './ArrowIcon';
import '../../styles/work.css';

type Item = (typeof spotlight)[number];

/** Only these two statuses say something a visitor can act on or should know; "Complete" is the default and is not shown. */
const SHOWN_STATUS = new Set(['Working prototype', 'Process']);

/**
 * One featured project as a big row: a short looping glimpse of the real work in a browser-style frame on the left or
 * right (alternating on wide screens, stacked on phones), and beside it the year and category, the title, one sentence
 * and one call to action.
 *
 * Structure (accessibility): the title link is the card's link and its ::after covers the whole row, so a click anywhere
 * opens the case study. The glimpse and its play/pause button sit ABOVE that overlay (z-index) with pointer-events off
 * except on the button, so the button stays separately operable and every other click falls through to the link.
 * Source order is text first, then the preview control, so Tab and screen readers meet the title before the button.
 *
 * Motion (all gated by useCalm / canPlay): the frame leans a few degrees toward a mouse pointer on a spring; the
 * tinted backdrop shape drifts slightly as the row scrolls past; the node on the spine lights when the row reaches the
 * middle of the screen. Nothing runs while the row is off-screen: scroll-linked values only change on scroll.
 */
export default function WorkCard({ item, index }: { item: Item; index: number }) {
  const p = getProject(item.id);
  const g = glimpseOf(p.id);
  const calm = useCalm();
  const row = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  const status = statusLabel(p);
  const proto = p.prototypeUrl;
  const external = proto ? isExternal(proto) : false;
  const flip = index % 2 === 1;

  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 16, mass: 0.6 });
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 16, mass: 0.6 });
  const { scrollYProgress } = useScroll({ target: row, offset: ['start end', 'end start'] });
  const drift = useTransform(scrollYProgress, [0, 1], [26, -26]);
  const peek = useRef<HTMLDivElement>(null);
  const peeked = useInView(peek, { once: true, amount: 0.8 });
  const lit = useInView(row, { margin: '0px 0px -45% 0px', once: true });

  const lean = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !canPlay()) return;
    const el = frame.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.75)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.75)));
    ry.set(nx * 5); rx.set(-ny * 4);
  };
  const settle = () => { rx.set(0); ry.set(0); };

  return (
    <motion.article
      ref={row}
      className={`wk-row2${flip ? ' wk-row2--flip' : ''}${lit || calm ? ' is-lit' : ''}`}
      style={{ ['--tint' as string]: item.tint }}
      onPointerMove={lean}
      onPointerLeave={settle}
    >
      <span className="wk-node" aria-hidden="true" />

      <div className="wk-text">
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

      <div className="wk-vis">
        <motion.span className="wk-back" aria-hidden="true" style={calm ? undefined : { y: drift }} />
        <motion.div ref={frame} className="wk-frame" style={calm ? undefined : { rotateX: rx, rotateY: ry }}>
          <div className="wk-frame__bar" aria-hidden="true"><i /><i /><i /></div>
          {g ? (
            <GlimpseVideo id={g.clip ?? g.id} poster={g.poster} label={g.label} ratio="16 / 10" eager={index === 0} />
          ) : (
            <div className="wk-still" style={{ aspectRatio: '16 / 10' }}><img src={workImage(p.id)} alt="" loading="lazy" draggable={false} /></div>
          )}
        </motion.div>
        {index === 0 && (
          <div className="wk-peek" aria-hidden="true" ref={peek}>
            <motion.div
              initial={calm ? false : { y: '100%' }}
              animate={{ y: peeked || calm ? 0 : '100%' }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.34, 1.4, 0.64, 1] }}
            >
              <Character pose="think" peek size={150} />
            </motion.div>
          </div>
        )}
      </div>
    </motion.article>
  );
}
