import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  to: number;
  /** Start from this value instead of 0 (counts down if larger than `to`). */
  from?: number;
  suffix?: string;
  duration?: number;
}

/** Counts to a number once, when scrolled into view. Reduced motion shows the final value. */
export default function CountUp({ to, from = 0, suffix = '', duration = 1.6 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : from);

  useEffect(() => {
    if (reduced) { setValue(to); return; }
    if (!inView) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: v => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, from, to, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
}
