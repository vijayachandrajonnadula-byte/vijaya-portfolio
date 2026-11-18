import type { MouseEvent } from 'react';

/** A blinking block caret. Blinks with CSS steps; static when motion is reduced (see v2.css and a11y.css). */
export function Caret({ className = '' }: { className?: string }) {
  return <span className={`v2-caret ${className}`} aria-hidden="true">▌</span>;
}

/** Film grain: a fixed SVG feTurbulence tile at 5% opacity. It only steps (shifts) when motion is allowed. */
const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;
export function Grain() {
  return <div className="v2-grain" aria-hidden="true" style={{ backgroundImage: GRAIN }} />;
}

/** First focusable thing on the page. Moves focus to the article (visible in reading mode, read aloud in the film). */
export function SkipLink() {
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    const a = document.getElementById('the-text');
    if (!a) return;
    e.preventDefault();
    a.focus({ preventScroll: true });
    a.scrollIntoView({ block: 'start' });
  };
  return <a className="v2-skip" href="#the-text" onClick={go}>Skip to the text</a>;
}
