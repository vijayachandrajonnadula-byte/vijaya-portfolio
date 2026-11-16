import { W, ZONE, type El, type K, type S } from './elements';

/** Colour keys resolve to the site tokens, so light and dark both work. */
export const COL: Record<K, string> = {
  none: 'transparent',
  ink: 'var(--c-ink)',
  ink2: 'var(--c-ink2)',
  mute: 'var(--c-mute)',
  line: 'var(--c-line)',
  tile: 'var(--c-tile)',
  tile2: 'var(--c-tile2)',
  obj: 'var(--c-obj)',
  bg: 'var(--c-bg)',
  clay: 'var(--c-clay)',
  deep: 'var(--c-deep)',
  cu: 'var(--tr-cu)',
  onclay: 'var(--c-accent-ink)',
};

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
export const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const n = (v: number) => (Math.round(v * 100) / 100).toString();

/** The lens position (0..100) mapped so that 0 is pure board and 100 is pure screen across the whole sheet. */
export const lensCentre = (v: number) => -ZONE / 2 + (v / 100) * (W + ZONE);

/** 0 = board, 1 = screen, for an element whose centre is at cx. Elements the lens has passed are screen. */
export const screenAmount = (cx: number, lens: number) => smooth(clamp((lens + ZONE / 2 - cx) / ZONE));

const mix = (A: K, B: K, t: number) => {
  if (A === B) return COL[A];
  if (t <= 0) return COL[A];
  if (t >= 1) return COL[B];
  return `color-mix(in srgb, ${COL[A]} ${n((1 - t) * 100)}%, ${COL[B]})`;
};

/** Writes one element's attributes for morph amount t. Direct DOM writes: no React work per frame. */
export function paint(node: SVGRectElement, e: El, t: number) {
  const a: S = e.a, b: S = e.b;
  node.setAttribute('x', n(lerp(a.x, b.x, t)));
  node.setAttribute('y', n(lerp(a.y, b.y, t)));
  node.setAttribute('width', n(Math.max(0, lerp(a.w, b.w, t))));
  node.setAttribute('height', n(Math.max(0, lerp(a.h, b.h, t))));
  node.setAttribute('rx', n(lerp(a.r, b.r, t)));
  const st = node.style;
  st.fill = mix(a.f, b.f, t);
  st.stroke = mix(a.s, b.s, t);
  st.strokeWidth = n(lerp(a.sw, b.sw, t));
  st.opacity = n(lerp(a.o, b.o, t));
}

/** Silkscreen label opacity: the board word fades out first, the screen word fades in second. */
export const boardTextOpacity = (t: number) => clamp(1 - t * 2);
export const screenTextOpacity = (t: number) => clamp(t * 2 - 1);
