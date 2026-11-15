import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from './motion-presets';
import { isJumping, JVIEWPORT } from '../case-study/jump';

interface BlurRevealProps {
  /** Words to reveal. Wrap a word in {{double braces}} to apply the highlight style. */
  text: string;
  className?: string;
  delay?: number;
  /** Reveal on mount (hero) rather than on scroll. */
  immediate?: boolean;
}

/**
 * Word-by-word blur-in. Each word sits in an inline-block so line wrapping is
 * unchanged. Reduced motion renders the final state directly.
 */
export default function BlurReveal({ text, className, delay = 0, immediate = false }: BlurRevealProps) {
  const reduced = useReducedMotion();
  const words = text.split(' ');
  let highlight = false;

  const trigger = immediate
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: JVIEWPORT };

  return (
    <motion.span
      className={className}
      initial={reduced ? false : 'hidden'}
      variants={{
        hidden: {},
        show: () => ({
          transition: !immediate && isJumping() ? { staggerChildren: 0, delayChildren: 0 } : { staggerChildren: 0.055, delayChildren: delay },
        }),
      }}
      {...trigger}
    >
      {words.map((raw, i) => {
        if (raw.startsWith('{{')) highlight = true;
        const word = raw.replace('{{', '').replace('}}', '');
        const cls = highlight ? 'blur-word blur-word--hl' : 'blur-word';
        if (raw.endsWith('}}')) highlight = false;
        return (
          <motion.span
            key={i}
            className={cls}
            variants={{
              hidden: { opacity: 0, y: 14, filter: 'blur(10px)' },
              show: () => ({
                opacity: 1, y: 0, filter: 'blur(0px)',
                transition: !immediate && isJumping() ? { duration: 0 } : { duration: 0.7, ease: EASE },
              }),
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        );
      })}
    </motion.span>
  );
}
