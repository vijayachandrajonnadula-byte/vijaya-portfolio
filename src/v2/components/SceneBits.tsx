import type { ReactNode } from 'react';
import { motion, useTransform } from 'framer-motion';
import Character from '../../components/studio/Character';
import type { Beat } from '../data/brief';
import { useBeat } from './Beat';

/**
 * Shared pieces for scenes. Clay is the protagonist: it appears in every scene, in the pose and with the prop the data gives it,
 * and its glowing LED eye is the "dot" of the film. It drifts a little while the stage is pinned and only animates on screen.
 */
export function ClayActor({ beat, className = '', drift = 24, label }: { beat: Beat; className?: string; drift?: number; label?: string }) {
  const { progress, active } = useBeat();
  const y = useTransform(progress, [0, 1], [drift, -drift]);
  return (
    <motion.div className={`v2-clay ${className}`} style={{ y }}>
      <Character pose={beat.pose} prop={beat.prop ?? 'none'} size={400} track={active} power={active ? 'bright' : 'on'} label={label} />
    </motion.div>
  );
}

/** The glyph of a beat (H ? 1..7 ± # .), set big and quiet behind the text. */
export function MarkGlyph({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { progress } = useBeat();
  const y = useTransform(progress, [0, 1], [30, -60]);
  return <motion.div className={`v2-glyph ${className}`} aria-hidden="true" style={{ y }}>{children}</motion.div>;
}

/** Small mono marker line: "## section" or "### 3". */
export function Mark({ children }: { children: ReactNode }) {
  return <p className="v2-markline" aria-hidden="true">{children}</p>;
}
