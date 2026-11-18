import { rng } from './kit';

/** Art 1 geometry on a 400x400 board: dots that resolve into one person, plus noise dots and quote dashes that fall away. */
const r = rng(11);
const inShape = (x: number, y: number) => {
  const head = (x - 200) ** 2 + (y - 128) ** 2 <= 50 ** 2;
  const dy = y - 330;
  const body = y >= 204 && y <= 396 && (dy >= 0 ? Math.abs(x - 200) <= 104 : Math.abs((x - 200) / 104) ** 2.6 + Math.abs(dy / 126) ** 2.6 <= 1);
  return head || body;
};

export interface Dot { x: number; y: number; ox: number; oy: number; d: number; r: number }
export const shape: Dot[] = [];
for (let y = 84; y < 400; y += 15) for (let x = 60; x < 350; x += 15) {
  const px = x + (Math.floor((y - 84) / 15) % 2 ? 7 : 0);
  if (!inShape(px, y)) continue;
  const sx = 10 + r() * 380, sy = 10 + r() * 380;
  shape.push({ x: px, y, ox: sx - px, oy: sy - y, d: r(), r: 3.1 });
}

export const noise: { x: number; y: number; r: number; d: number }[] = [];
while (noise.length < 64) {
  const x = 14 + r() * 372, y = 14 + r() * 372;
  if (inShape(x, y) && r() < 0.8) continue;
  noise.push({ x, y, r: 1.6 + r() * 1.8, d: r() });
}

/** user quotes, as dashes (no real words) */
export const dashes: { x: number; y: number; w: number; rot: number; ox: number }[] = [];
for (let i = 0; i < 17; i++) {
  const x = 24 + r() * 330, y = 24 + r() * 352;
  dashes.push({ x, y, w: 16 + r() * 34, rot: (r() - 0.5) * 24, ox: (x < 200 ? -1 : 1) * (50 + r() * 70) });
}
