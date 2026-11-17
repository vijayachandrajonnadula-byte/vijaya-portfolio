import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCalm } from '../../lib/calm';
import { useFinePointer } from './useOnScreen';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
}

/**
 * Pointer-driven 3D tilt with a moving specular glare. Pure CSS 3D transforms
 * driven by springs. No-ops on touch devices and under reduced motion.
 */
export default function TiltCard({ children, className, max = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useCalm();
  const fine = useFinePointer();
  const enabled = fine && !reduced;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 22, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 220, damping: 22, mass: 0.5 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glare = useTransform(
    [sx, sy],
    ([x, y]: number[]) =>
      `radial-gradient(520px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.20), transparent 55%)`,
  );

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <div className="tilt-perspective" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div ref={ref} className={`tilt-card ${className ?? ''}`} style={{ rotateX, rotateY }}>
        {children}
        <motion.span className="tilt-card__glare" style={{ background: glare }} aria-hidden="true" />
      </motion.div>
    </div>
  );
}
