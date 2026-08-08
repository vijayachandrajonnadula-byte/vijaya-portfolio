import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp, VIEWPORT } from './motion-presets';

/**
 * Reveals its children once, when scrolled into view.
 *
 * `as` exists so a reveal can BE a grid/flex child rather than wrapping one:
 * inserting a plain <div> inside a grid would demote the real child to a
 * grandchild and drop it out of the grid layout.
 *
 * Under prefers-reduced-motion we pass `initial={false}`, which renders the
 * element directly in its final state. The DOM and CSS are then identical to
 * the animated version — only the motion is skipped.
 */
const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  span: motion.span,
} as const;

interface RevealProps {
  children: ReactNode;
  as?: keyof typeof TAGS;
  className?: string;
  /** Seconds to wait before this element starts. */
  delay?: number;
  /** Travel distance in px; 0 gives a pure fade. */
  y?: number;
  id?: string;
}

export default function Reveal({
  children,
  as = 'div',
  className,
  delay = 0,
  y = 18,
  id,
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = TAGS[as] ?? motion.div;

  return (
    <Tag
      id={id}
      className={className}
      variants={fadeUp(y, delay)}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  );
}
