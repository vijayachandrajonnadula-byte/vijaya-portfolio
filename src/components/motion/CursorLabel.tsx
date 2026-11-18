import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from './useOnScreen';
import { useCalm } from '../../lib/calm';

/**
 * A pill that trails the cursor over any element carrying `data-cursor="Label"`.
 * One instance, event delegation, springs for the follow. Touch devices and
 * reduced-motion users never see it; the underlying links stay fully usable.
 */
export default function CursorLabel() {
  const finePointer = useFinePointer();
  const calm = useCalm(); // Calm mode removes the cursor-follow label (Selective Attention, WCAG 2.3.3)
  const fine = finePointer && !calm;
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 32, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 420, damping: 32, mass: 0.4 });

  useEffect(() => {
    if (!fine) return;
    let last = { x: -100, y: -100 };
    const resolve = (el: Element | null) => {
      const target = el?.closest?.('[data-cursor]');
      setLabel(target ? target.getAttribute('data-cursor') : null);
    };
    const onMove = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
      x.set(e.clientX + 16);
      y.set(e.clientY + 16);
      resolve(e.target as Element | null);
    };
    // The page can scroll under a still pointer, so re-check what is beneath it.
    const onScroll = () => resolve(document.elementFromPoint(last.x, last.y));
    const onLeave = () => setLabel(null);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <motion.div className="cursor-label" style={{ x: sx, y: sy }} aria-hidden="true">
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            className="cursor-label__pill"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
