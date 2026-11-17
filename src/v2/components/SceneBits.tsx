import type { ReactNode } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import Character, { type Pose } from '../../components/studio/Character';
import type { Beat } from '../data/brief';
import { useBeat } from './Beat';

/**
 * Shared pieces for scenes. Clay is the protagonist: it appears in every scene, in the pose and with the prop the data gives it,
 * and its glowing LED eye is the "dot" of the film.
 *
 * Between rooms Clay HOPS: on the way out it jumps up and away (leave), on arrival it lands from the other side (enter) with a
 * small squash. Both arcs are scrubbed by scroll, so scrolling back un-hops it. While the stage is pinned it drifts a little.
 * Nothing runs unless the beat is on screen (the motion values only change with scroll; the eyes follow only while active).
 */
export function ClayActor({ beat, className = '', drift = 24, label, pose, size = 400, hop = true, boot = false }: {
  beat: Beat; className?: string; drift?: number; label?: string;
  /** Override the pose from the data (e.g. the title waves once, then rests). */
  pose?: Pose;
  /** Internal art size in px (the CSS width of .v2-clay still decides what you see). */
  size?: number;
  /** Set false for a scene where Clay must stand still (e.g. the title). */
  hop?: boolean;
  /** Play the LED power-on flicker once when it mounts. */
  boot?: boolean;
}) {
  const { progress, enter, leave, active } = useBeat();
  const spring = { stiffness: 210, damping: 18, mass: 0.6 }; // a little overshoot: it lands, it does not slide
  const y = useSpring(useTransform([progress, enter, leave] as const, ([p, e, l]: number[]) => {
    const drifty = (0.5 - p!) * 2 * drift;
    if (!hop) return drifty;
    const arrive = e! < 1 ? -Math.sin(Math.PI * Math.min(1, Math.max(0, (e! - 0.35) / 0.65))) * 70 : 0; // arc over the incoming stage
    const go = -Math.sin(Math.PI * 0.5 * l!) * 120 - 0; // jump up and away
    return drifty + arrive + go;
  }), spring);
  const x = useSpring(useTransform([enter, leave] as const, ([e, l]: number[]) => {
    if (!hop) return 0;
    const a = (1 - Math.min(1, Math.max(0, (e! - 0.35) / 0.65))) * -90; // lands from the left
    return a + l! * 70;
  }), spring);
  const rotate = useSpring(useTransform([enter, leave] as const, ([e, l]: number[]) => {
    if (!hop) return 0;
    const a = (1 - Math.min(1, Math.max(0, (e! - 0.35) / 0.65))) * -12;
    return a + l! * 14;
  }), spring);
  // squash a hair as it touches down
  const scaleY = useTransform(enter, [0.8, 0.94, 1], [1, hop ? 0.94 : 1, 1]);
  const scaleX = useTransform(enter, [0.8, 0.94, 1], [1, hop ? 1.04 : 1, 1]);
  return (
    <motion.div className={`v2-clay ${className}`} style={{ x, y, rotate, scaleX, scaleY, transformOrigin: '50% 96%' }}>
      <Character pose={pose ?? beat.pose} prop={beat.prop ?? 'none'} size={size} track={active} power={active ? 'bright' : 'on'} label={label} boot={boot} />
    </motion.div>
  );
}

/** The glyph of a beat (H ? 1..7 ± # .), set big and quiet behind the text. It leaves a little ahead of the text. */
export function MarkGlyph({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { progress, leave } = useBeat();
  const base = useTransform(progress, [0, 1], [30, -60]);
  const out = useTransform(leave, [0, 1], [0, -90]);
  const y = useTransform([base, out] as const, ([a, b]: number[]) => a! + b!);
  const r = useTransform(leave, [0, 1], [0, 5]);
  return <motion.div className={`v2-glyph ${className}`} aria-hidden="true" style={{ y, rotate: r }}>{children}</motion.div>;
}

/** Small mono marker line: "## section" or "### 3". */
export function Mark({ children }: { children: ReactNode }) {
  return <p className="v2-markline" aria-hidden="true">{children}</p>;
}
