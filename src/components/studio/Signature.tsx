import { useEffect, useId, useMemo, useState } from 'react';
import { SIGNATURE } from '../../data/signature';
import { useCalm } from '../../lib/calm';
import '../../styles/signature.css';

const { w, h, d } = SIGNATURE;
/** Where the line runs: just under the baseline of the name, so it ends up as the underline of the signature. */
const LY = Math.round(h * 0.66);
const STEP = 5;

/** A noisy signal and a flat line with exactly the same commands, so one path can morph from the first to the second. */
function trace(amp: number): string {
  let s = `M0 ${LY}`;
  for (let x = STEP, i = 1; x <= w; x += STEP, i++) {
    const n = Math.sin(i * 1.9) * 0.55 + Math.sin(i * 4.7 + 1.3) * 0.3 + Math.sin(i * 9.1 + 0.4) * 0.15;
    const fade = Math.min(1, (w - x) / 40 + 0.15); // calms a little toward the right edge
    s += ` L${x} ${(LY + n * amp * fade).toFixed(1)}`;
  }
  return s;
}
const NOISY = trace(15);
const FLAT = trace(0);

const WRITE_DONE_MS = 4400;

/**
 * "Vijay", written by hand, from a signal.
 * The story in four beats, once, on load:
 *   0.2s  a noisy trace is drawn across (an oscilloscope; the electronics background)
 *   1.0s  the trace settles into a straight line (signal -> clear)
 *   1.5s  the name is written above it, as if with a pen
 *   3.6s  the ink fills in. The line stays as the underline.
 * Everything is a CSS or native SVG animation that runs once: nothing loops, nothing runs after it finishes.
 * Under reduced motion it is drawn finished. A mouse can hover it to watch it again (decorative; not focusable).
 * The glyphs are outlines of Mrs Saint Delafield (OFL) as a path: no font download.
 */
export default function Signature({ className, inkOnly }: { className?: string; inkOnly?: boolean }) {
  const calm = useCalm();
  const raw = useId();
  const id = useMemo(() => `sig${raw.replace(/[^a-zA-Z0-9]/g, '')}`, [raw]);
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (calm) { setDone(true); return; }
    setDone(false);
    const t = window.setTimeout(() => setDone(true), WRITE_DONE_MS);
    return () => window.clearTimeout(t);
  }, [run, calm]);

  const replay = () => {
    if (inkOnly || calm || !done || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setRun(r => r + 1);
  };

  return (
    // The whole svg is re-keyed so the native SVG animation timeline starts again too.
    <svg
      key={run}
      className={`sig${calm ? ' sig--static' : ''}${inkOnly ? ' sig--ink' : ''}${className ? ` ${className}` : ''}`}
      viewBox={`0 0 ${w} ${h + 8}`}
      aria-hidden="true"
      focusable="false"
      onPointerEnter={replay}
    >
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h + 8}>
          {/* a thick pen following the outline uncovers the ink; at the end the whole shape is uncovered */}
          <path className="sig__m" d={d} pathLength={1} fill="none" stroke="#fff" strokeWidth="15" strokeLinejoin="round" strokeLinecap="round" />
          <path className="sig__mf" d={d} fill="#fff" />
        </mask>
      </defs>
      <path className="sig__ink" d={d} fill="currentColor" mask={`url(#${id})`} />
      {!inkOnly && (
        <path className="sig__line" d={calm ? FLAT : NOISY} pathLength={1}>
          {!calm && (
            <animate attributeName="d" dur="0.9s" begin="1s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.22 1 0.36 1" values={`${NOISY};${FLAT}`} />
          )}
        </path>
      )}
    </svg>
  );
}
