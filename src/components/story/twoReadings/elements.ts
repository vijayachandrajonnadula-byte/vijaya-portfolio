/**
 * "Two readings": one layout, drawn twice. Every element is a rect with a board state (a) and a screen state (b);
 * the lens interpolates between them. Edit the numbers here, never the component.
 * Grid: 20 units. Canvas 1060 x 560, panel 20..1040 x 20..540.
 */
export const W = 1060;
export const H = 560;
export const ZONE = 140; // width of the transition zone around the lens

export type K =
  | 'none' | 'ink' | 'ink2' | 'mute' | 'line' | 'tile' | 'tile2' | 'obj' | 'bg' | 'clay' | 'deep' | 'cu' | 'onclay';

export type S = { x: number; y: number; w: number; h: number; r: number; f: K; s: K; sw: number; o: number };
export type El = { a: S; b: S; tag?: string; cx: number; wide?: boolean };
export type Tx = { x: number; y: number; anchor: 'start' | 'middle' | 'end'; a: string; b: string };
/** Where a label really sits (anchor x plus half its width), so it flips when the lens reaches its middle. */
export const textCentre = (t: Tx) => t.x + (t.anchor === 'middle' ? 0 : (t.anchor === 'start' ? 1 : -1) * Math.max(t.a.length * 7.5, t.b.length * 6.6) / 2);
/** Where the lens rests after the first sweep: chosen so no label sits inside the transition zone. */
export const REST = 57;

const s = (x: number, y: number, w: number, h: number, r = 0, f: K = 'none', st: K = 'none', sw = 0, o = 1): S => ({ x, y, w, h, r, f, s: st, sw, o });
const gone = (v: S): S => ({ ...v, o: 0 });

export const ELEMENTS: El[] = [];
/** board state, screen state, optional two-word tag "pad / button" shown on hover */
const add = (tag: string | undefined, a: S, b: S, wide = false) => {
  const e: El = { a, b, cx: (a.x + a.w / 2 + b.x + b.w / 2) / 2 };
  if (wide) e.wide = true;
  if (tag) e.tag = tag;
  ELEMENTS.push(e);
};

// the sheet itself
add('board / screen', s(20, 20, 1020, 520, 14, 'tile', 'mute', 1), s(20, 20, 1020, 520, 28, 'obj', 'line', 1), true);
for (const [cx, cy] of [[40, 40], [1020, 40], [40, 520], [1020, 520]] as const) {
  add(undefined, s(cx - 7, cy - 7, 14, 14, 7, 'bg', 'cu', 3), s(cx - 3, cy - 3, 6, 6, 3, 'line', 'none', 0, 0));
}

// traces that become dividers and lines (drawn first, so parts sit on top)
add('bus / nav bar', s(72, 66, 808, 4, 2, 'ink2'), s(60, 44, 940, 48, 16, 'tile', 'line', 1), true);
add('trace / divider', s(380, 240, 4, 260, 2, 'ink2'), s(380, 124, 1, 376, 0, 'line'));
add('rail / divider', s(420, 398, 580, 4, 2, 'ink2'), s(420, 400, 580, 1, 0, 'line'), true);
add(undefined, s(384, 296, 36, 4, 2, 'ink2'), gone(s(384, 296, 36, 4, 2, 'ink2')));
add(undefined, s(620, 296, 80, 4, 2, 'ink2'), gone(s(660, 296, 40, 4, 2, 'ink2')));
add(undefined, s(752, 296, 20, 4, 2, 'ink2'), gone(s(752, 296, 20, 4, 2, 'ink2')));
add('trace / headline', s(344, 174, 316, 4, 2, 'ink2'), s(420, 128, 320, 16, 8, 'ink'));
add('live trace / subtitle', s(344, 214, 76, 4, 2, 'clay'), s(420, 158, 224, 8, 4, 'mute'));
add(undefined, s(36, 214, 40, 4, 2, 'ink2'), gone(s(36, 214, 40, 4, 2, 'ink2')));

// the chip that becomes a card
add('IC / card', s(100, 140, 220, 240, 6, 'deep', 'ink2', 1), s(60, 124, 300, 260, 20, 'obj', 'line', 1));
add('die / image', s(160, 180, 100, 100, 2, 'none', 'mute', 1), s(84, 148, 252, 112, 14, 'tile2'));
add('pin 1 / badge', s(108, 148, 10, 10, 5, 'none', 'mute', 1), s(96, 160, 52, 22, 11, 'bg'));
const legY = [176, 216, 256, 296, 336];
const left: S[] = [
  s(84, 280, 150, 12, 6, 'ink'),
  s(84, 304, 210, 6, 3, 'mute'),
  s(84, 320, 170, 6, 3, 'mute'),
  s(84, 344, 64, 24, 12, 'none', 'mute', 1),
  s(156, 344, 64, 24, 12, 'none', 'mute', 1),
];
legY.forEach((y, i) => add(i === 0 ? 'leg / title' : undefined, s(76, y - 4, 24, 8, 1, 'ink2'), left[i]!));
legY.forEach((y, i) => add(i === 0 ? 'leg / save' : undefined, s(320, y - 4, 24, 8, 1, 'ink2'), i === 0 ? s(300, 156, 28, 28, 14, 'bg') : gone(s(312, y - 4, 8, 8, 1, 'ink2'))));

// navigation
add('via / logo', s(76, 58, 20, 20, 10, 'bg', 'cu', 3), s(72, 54, 28, 28, 14, 'ink'));
[240, 340, 440, 540].forEach((cx, i) => {
  if (i === 0) {
    add('pad / tab', s(cx - 20, 62, 40, 12, 2, 'cu'), s(cx - 32, 54, 64, 28, 14, 'ink'));
    add(undefined, s(cx - 14, 66, 28, 4, 2, 'bg', 'none', 0, 0.7), s(cx - 14, 66, 28, 4, 2, 'bg'));
  } else {
    add('pad / link', s(cx - 20, 62, 40, 12, 2, 'cu'), s(cx - 24, 65, 48, 6, 3, 'mute'));
  }
});
add('connector / account', s(880, 52, 120, 32, 3, 'none', 'ink2', 1.5), s(880, 52, 120, 32, 16, 'obj', 'line', 1));
add('pin / avatar', s(892, 62, 12, 12, 1, 'cu'), s(888, 58, 20, 20, 10, 'ink2'));
add(undefined, s(916, 62, 12, 12, 1, 'cu'), s(918, 64, 40, 4, 2, 'mute'));
add(undefined, s(940, 62, 12, 12, 1, 'cu'), s(918, 72, 24, 4, 2, 'mute'));
add(undefined, s(964, 62, 12, 12, 1, 'cu'), s(974, 65, 6, 6, 3, 'mute'));

// buttons
add('pad / button', s(420, 196, 132, 40, 2, 'clay'), s(420, 196, 132, 40, 20, 'clay'));
add(undefined, s(432, 212, 8, 8, 4, 'bg', 'ink2', 1), s(444, 214, 56, 4, 2, 'onclay'));
add(undefined, s(532, 212, 8, 8, 4, 'bg', 'ink2', 1), s(527, 211, 10, 10, 5, 'onclay'));
add('pad / button', s(570, 196, 104, 40, 2, 'cu'), s(570, 196, 104, 40, 20, 'none', 'ink2', 1));
add('test point / cursor', s(694, 220, 14, 14, 7, 'cu', 'ink2', 1), s(688, 214, 26, 26, 13, 'none', 'clay', 1.5));

// resistor to progress bar
add('resistor / progress', s(420, 284, 200, 28, 14, 'tile2', 'ink2', 1), s(420, 292, 240, 12, 6, 'tile2'));
[456, 492, 528, 584].forEach((x, k) => {
  add(k === 0 ? 'bands / segments' : undefined, s(x, 284, 8, 28, 0, k % 2 ? 'cu' : 'ink2'), s(420 + k * 60, 292, 56, 12, 6, k < 3 ? 'ink' : 'tile2'));
});

// switches to toggles
add('switch / toggle', s(700, 284, 52, 28, 3, 'none', 'ink2', 1.5), s(700, 284, 52, 28, 14, 'ink'));
add(undefined, s(704, 288, 20, 20, 2, 'ink2'), s(724, 288, 20, 20, 10, 'bg'));
add('switch / toggle', s(772, 284, 52, 28, 3, 'none', 'ink2', 1.5), s(772, 284, 52, 28, 14, 'tile2'));
add(undefined, s(776, 288, 20, 20, 2, 'ink2'), s(776, 288, 20, 20, 10, 'obj', 'line', 1));

// vias to radios
[420, 452, 484].forEach((x, k) => {
  add(k === 0 ? 'via / radio' : undefined, s(x, 356, 16, 16, 8, 'bg', 'cu', 3), s(x, 356, 16, 16, 8, 'none', 'ink2', 1.5));
});
add(undefined, s(456, 360, 8, 8, 4, 'ink2'), s(456, 360, 8, 8, 4, 'ink'));

// capacitors to stat cards
[420, 618, 816].forEach((x, k) => {
  const cx = x + 92;
  add(k === 0 ? 'capacitor / card' : undefined, s(cx - 22, 434, 44, 44, 22, 'tile2', 'ink2', 1), s(x, 424, 184, 64, 16, 'tile', 'line', 1));
  add(undefined, s(cx - 3, 440, 6, 32, 3, 'ink2', 'none', 0, 0.55), s(x + 16, 444, 56, 8, 4, 'ink'));
});

// SMD pads to bars
const barH = [40, 64, 52, 92, 76];
[870, 898, 926, 954, 982].forEach((x, k) => {
  add(k === 0 ? 'SMD pad / bar' : undefined, s(x, 380, 18, 10, 2, 'cu'), s(x, 390 - barH[k]!, 18, barH[k]!, 6, k === 3 ? 'ink' : 'tile2'));
});

// a crystal becomes the search field
add('crystal / search', s(100, 436, 120, 32, 16, 'tile2', 'ink2', 1), s(84, 436, 252, 40, 20, 'tile', 'line', 1));
add(undefined, s(76, 448, 24, 8, 1, 'ink2'), s(100, 448, 16, 16, 8, 'none', 'mute', 1.5));
add(undefined, s(220, 448, 24, 8, 1, 'ink2'), s(128, 454, 110, 4, 2, 'mute'));

// LED to notification badge
add(undefined, s(944, 114, 72, 72, 36, 'clay', 'none', 0, 0.16), s(944, 114, 72, 72, 36, 'clay', 'none', 0, 0));
add('LED / notification', s(960, 130, 40, 40, 20, 'none', 'ink2', 1.5), s(960, 130, 40, 40, 20, 'tile', 'line', 1));
add(undefined, s(973, 147, 14, 12, 6, 'none', 'ink2', 1.5, 0), s(973, 147, 14, 12, 6, 'none', 'ink2', 1.5, 1));
add(undefined, s(973, 143, 14, 14, 7, 'clay'), s(986, 134, 12, 12, 6, 'clay', 'tile', 2));

// silkscreen labels become microcopy
export const TEXTS: Tx[] = [
  { x: 100, y: 402, anchor: 'start', a: 'U2', b: 'Overview' },
  { x: 420, y: 270, anchor: 'start', a: 'R1', b: 'Progress' },
  { x: 700, y: 270, anchor: 'start', a: 'SW1', b: 'Sync' },
  { x: 512, y: 368, anchor: 'start', a: 'V1-V3', b: 'Options' },
  { x: 100, y: 494, anchor: 'start', a: 'Y1', b: 'Search' },
  { x: 880, y: 110, anchor: 'start', a: 'J1', b: 'Account' },
  { x: 870, y: 270, anchor: 'start', a: 'R4-R8', b: 'Weekly' },
  { x: 724, y: 231, anchor: 'start', a: 'TP1', b: 'Click' },
  { x: 980, y: 192, anchor: 'middle', a: 'D1', b: 'Inbox' },
  { x: 512, y: 512, anchor: 'middle', a: 'C1', b: 'Tasks' },
  { x: 710, y: 512, anchor: 'middle', a: 'C2', b: 'Notes' },
  { x: 908, y: 512, anchor: 'middle', a: 'C3', b: 'Done' },
];

/** The signal's route along the live trace: in through the chip, out to the primary pad. */
export const PULSE_PATH = 'M36 216H420';
export const PULSE_END = { x: 486, y: 216 };
