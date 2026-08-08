import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp, staggerParent, VIEWPORT } from './motion-presets';

const TAGS = {
  div: motion.div,
  ul: motion.ul,
  li: motion.li,
  section: motion.section,
  article: motion.article,
} as const;

interface StaggerProps {
  children: ReactNode;
  as?: keyof typeof TAGS;
  className?: string;
  /** Gap between children, in seconds. */
  stagger?: number;
  delayChildren?: number;
  id?: string;
}

/**
 * Releases its children one after another when scrolled into view.
 * Pair with <StaggerItem> for each child that should animate.
 *
 * Under reduced motion the parent starts at its final state, which propagates
 * to every child variant, so nothing moves and the DOM is unchanged.
 */
export function Stagger({
  children,
  as = 'div',
  className,
  stagger = 0.07,
  delayChildren = 0,
  id,
}: StaggerProps) {
  const reduced = useReducedMotion();
  const Tag = TAGS[as] ?? motion.div;

  return (
    <Tag
      id={id}
      className={className}
      variants={staggerParent(stagger, delayChildren)}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  as?: keyof typeof TAGS;
  className?: string;
  y?: number;
}

/** A single child of <Stagger>. Timing comes from the parent. */
export function StaggerItem({ children, as = 'div', className, y = 16 }: StaggerItemProps) {
  const Tag = TAGS[as] ?? motion.div;
  return (
    <Tag className={className} variants={fadeUp(y)}>
      {children}
    </Tag>
  );
}
