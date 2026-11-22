import { useState } from 'react';
import { useCalm } from '../../lib/calm';
import '../../styles/signature.css';

interface VJLogoProps {
  size?: number;
  variant?: 'dark' | 'light';
  /** Draw the mark with a pen on load. Off for static uses. Default on. */
  animate?: boolean;
}

/**
 * The VJ monogram as one continuous pen stroke: the V flows into the J and ends in a small tail.
 * It draws itself once when it first appears and again when a mouse passes over it (CSS only, runs once each time).
 * Under reduced motion it is drawn finished.
 */
export default function VJLogo({ size = 36, variant = 'dark', animate = true }: VJLogoProps) {
  const calm = useCalm();
  const [run, setRun] = useState(0);
  const still = calm || !animate;
  const bg = variant === 'light' ? '#FFFFFF' : '#0B1627';
  const letterStroke = variant === 'light' ? '#0B1627' : '#FFFFFF';
  const borderColor = variant === 'light' ? 'rgba(11,22,39,0.12)' : 'rgba(255,255,255,0.07)';

  return (
    <svg
      key={run}
      className={still ? 'vjl vjl--static' : 'vjl'}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VJ logo"
      onPointerEnter={() => { if (!still && window.matchMedia('(hover: hover)').matches) setRun(r => r + 1); }}
    >
      {/* Background rounded square */}
      <rect width="40" height="40" rx="10" fill={bg} stroke={borderColor} strokeWidth="1" />

      {/*
        Connected V·J monogram, one stroke: V left arm, round bottom, V right arm,
        down the J stem and out through the hook into a small tail.
      */}
      <path
        className="vjl__p"
        pathLength={1}
        d="M 8 10.5 C 11 19.5, 15 28.5, 19.5 29 C 25 28.5, 30 19, 32.5 10.5 C 32 19.5, 33 28.5, 30.5 32.5 C 28 36.5, 22 36.5, 18.5 32.5"
        stroke={letterStroke}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Accent dot, the V's point: pops in when the stroke is done */}
      <circle className="vjl__dot" cx="19.5" cy="29" r="2.4" fill="#2563EB" />
    </svg>
  );
}
