import type { Variants } from 'framer-motion';

/**
 * Shared motion language for the portfolio.
 *
 * Deliberately restrained: short durations, small travel, one easing curve, and
 * nothing that moves on a loop. AGENTS.md rules out heavy animation and
 * parallax, so these are entrance and reveal cues only — they help the eye find
 * reading order, they are not the content.
 *
 * Every consumer must honour prefers-reduced-motion. The components in this
 * folder do that via framer-motion's useReducedMotion().
 */

/** Gentle deceleration. Feels considered rather than bouncy. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.28,
  base: 0.5,
  slow: 0.7,
} as const;

/** Reveal once, when the element is comfortably in view. */
export const VIEWPORT = { once: true, margin: '-72px 0px -72px 0px' } as const;

export const fadeUp = (y = 18, delay = 0): Variants => ({
  hidden: { opacity: 0, y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE, delay },
  },
});

export const fadeIn = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.base, ease: EASE, delay } },
});

/** Parent that releases its children one after another. */
export const staggerParent = (stagger = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});
