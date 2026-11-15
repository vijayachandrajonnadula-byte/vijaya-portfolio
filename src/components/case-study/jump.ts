import type { Variants } from 'framer-motion';

/**
 * Jump-link awareness for scroll reveals.
 *
 * When the reader jumps to a section (rail click, Sections sheet, #hash in the URL)
 * the target should arrive fully visible, not half-faded. While a jump is "live" the
 * reveal variants below resolve to a zero-duration transition. The check runs when the
 * animation starts (variant resolvers are evaluated lazily), so it is always current.
 */
let until = 0;

export function markJump(ms = 1600) {
  until = Date.now() + ms;
}

export function isJumping() {
  return Date.now() < until;
}

if (typeof window !== 'undefined') {
  if (window.location.hash) markJump(2400);
  window.addEventListener('hashchange', () => markJump(), { passive: true });
  document.addEventListener(
    'click',
    e => {
      const a = (e.target as Element | null)?.closest?.('a[href*="#"]');
      if (a && (a.getAttribute('href') ?? '').includes('#')) markJump();
    },
    true,
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;
const INSTANT = { duration: 0 } as const;

export const jFadeUp = (y = 18, delay = 0): Variants => ({
  hidden: { opacity: 0, y },
  show: () => ({
    opacity: 1,
    y: 0,
    transition: isJumping() ? INSTANT : { duration: 0.5, ease: EASE, delay },
  }),
});

export const jStaggerParent = (stagger = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  show: () => ({
    transition: isJumping() ? { staggerChildren: 0, delayChildren: 0 } : { staggerChildren: stagger, delayChildren },
  }),
});

/** Reveal threshold: start when ~15% of the element is visible. */
export const JVIEWPORT = { once: true, amount: 0.15 } as const;
