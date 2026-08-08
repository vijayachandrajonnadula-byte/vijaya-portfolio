/**
 * Generates low-fidelity wireframes for the CareSync case study as SVG.
 *
 * These are authored from the captured UI screens in
 * public/images/projects/caresync/desktop/, reduced to structure only: what
 * region owns what, and in what order. No colour decisions, no real content.
 * Aubergine appears only on the card badge and the active nav item, matching
 * the product's own rule that brand colour marks identity and selection.
 *
 * Run: node scripts/generate-caresync-wireframes.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../public/images/projects/caresync/wireframes');
fs.mkdirSync(OUT, { recursive: true });

const W = 480, H = 360;
const HEAD = 34;          // card header strip
const SB = 58;            // sidebar width
const TOP = 66;           // bottom of topbar
const CX = 70;            // content left edge
const CW = W - CX - 12;   // content width

const C = {
  paper: '#FFFFFF',
  stroke: '#E2DEDA',
  head: '#FCFBFA',
  brand: '#553052',
  brandSoft: '#C8A8C6',
  side: '#F0EEEB',
  sideBar: '#CFC9C6',
  top: '#FAF9F8',
  block: '#E7E4E1',
  light: '#F1EFED',
  dark: '#D5D0CD',
  darker: '#BDB7B3',
  label: '#8A8385',
  title: '#201C20',
};

const FONT = 'Segoe UI, system-ui, -apple-system, sans-serif';

const r = (x, y, w, h, fill, rx = 3) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const line = (x1, y1, x2, y2, stroke = C.stroke, dash = '') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="1"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const box = (x, y, w, h, rx = 5) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${C.paper}" stroke="${C.stroke}"/>`;
const cap = (x, y, t) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="7.5" font-weight="700" letter-spacing="0.9" fill="${C.label}">${t}</text>`;
const dot = (cx, cy, rad, fill) => `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${fill}"/>`;

/** Repeating table rows: label block + secondary block + trailing pill. */
function rows(x, y, w, n, step = 26, opts = {}) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const yy = y + i * step;
    if (opts.zebra && i % 2 === 1) out += r(x, yy - 6, w, step - 4, C.light, 2);
    out += r(x + 8, yy, 46, 6, C.darker, 2);
    out += r(x + 62, yy, 40, 6, C.dark, 2);
    if (opts.mid) out += r(x + 112, yy, 56, 6, C.block, 2);
    out += r(x + w - 46, yy - 3, 36, 12, C.block, 6);
    if (i < n - 1) out += line(x, yy + step - 12, x + w, yy + step - 12);
  }
  return out;
}

/** Shell: card, header with badge + title, sidebar, topbar. */
function shell(letter, title, activeNav = 1) {
  let s = '';
  s += `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="8" fill="${C.paper}" stroke="${C.stroke}"/>`;
  s += `<path d="M8 0.5 H${W - 8} a7.5 7.5 0 0 1 7.5 7.5 V${HEAD} H0.5 V8 a7.5 7.5 0 0 1 7.5 -7.5 z" fill="${C.head}"/>`;
  s += line(0, HEAD, W, HEAD);
  s += dot(21, 17, 9, C.brand);
  s += `<text x="21" y="20.5" font-family="${FONT}" font-size="9" font-weight="700" fill="#FFFFFF" text-anchor="middle">${letter}</text>`;
  s += `<text x="38" y="21" font-family="${FONT}" font-size="10.5" font-weight="600" fill="${C.title}">${title}</text>`;

  // sidebar
  s += r(0, HEAD, SB, H - HEAD, C.side, 0);
  s += line(SB, HEAD, SB, H);
  s += r(10, HEAD + 12, 30, 6, C.darker, 2);           // wordmark
  for (let i = 0; i < 8; i++) {
    const yy = HEAD + 34 + i * 20;
    s += r(10, yy, i === activeNav ? 38 : 26 + (i % 3) * 6, 6, i === activeNav ? C.brandSoft : C.sideBar, 2);
  }

  // topbar
  s += r(SB, HEAD, W - SB, TOP - HEAD, C.top, 0);
  s += line(SB, TOP, W, TOP);
  s += r(CX, HEAD + 10, 116, 12, C.block, 6);
  s += dot(W - 22, HEAD + 16, 8, C.block);
  return s;
}

/** Page title + optional subtitle. */
function pageTitle(y = 78, wide = 96) {
  return r(CX, y, wide, 9, C.darker, 2) + r(CX, y + 15, 64, 6, C.block, 2);
}

const screens = [
  {
    file: 'shift-briefing',
    letter: 'A',
    title: 'Shift Briefing',
    nav: 0,
    body: () => {
      let s = pageTitle();
      // status chips
      const chips = [52, 60, 46];
      let cx = CX;
      chips.forEach((w, i) => {
        s += r(cx, 108, w, 13, i === 0 ? '#EFE6D2' : C.block, 6.5);
        cx += w + 7;
      });
      // NOW - main action card
      s += box(CX, 132, 246, 200);
      s += cap(CX + 10, 148, 'NOW');
      s += r(CX + 10, 156, 226, 12, '#F2E9D6', 2);          // review-required strip
      s += r(CX + 10, 176, 150, 7, C.darker, 2);            // patient headline
      s += r(CX + 10, 190, 60, 10, C.block, 5) + r(CX + 76, 190, 66, 10, '#F0DEDD', 5);
      s += line(CX + 10, 210, CX + 236, 210);
      s += r(CX + 10, 220, 100, 6, C.dark, 2);
      s += rows(CX + 4, 240, 238, 3, 24, {});
      // NEXT - operational rail
      s += box(CX + 258, 132, 140, 122);
      s += cap(CX + 268, 148, 'NEXT');
      for (let i = 0; i < 3; i++) {
        const yy = 158 + i * 32;
        if (i === 0) s += r(CX + 259, yy - 2, 138, 30, '#F6EFF5', 2) + r(CX + 259, yy - 2, 3, 30, C.brand, 0);
        s += r(CX + 268, yy + 4, 22, 6, C.darker, 2);
        s += r(CX + 296, yy + 4, 54, 6, C.dark, 2);
        s += r(CX + 268, yy + 16, 70, 5, C.block, 2);
        s += r(CX + 356, yy + 6, 32, 12, C.block, 6);
      }
      // LATER
      s += box(CX + 258, 262, 140, 70);
      s += cap(CX + 268, 278, 'LATER');
      for (let i = 0; i < 3; i++) s += r(CX + 268, 288 + i * 14, 108 - i * 14, 6, C.block, 2);
      return s;
    },
  },
  {
    file: 'patients',
    letter: 'B',
    title: 'Patients',
    nav: 1,
    body: () => {
      let s = pageTitle();
      // filter tabs
      let cx = CX;
      [62, 70, 58, 62].forEach((w, i) => {
        s += r(cx, 108, w, 15, i === 0 ? C.brandSoft : C.block, 7.5);
        cx += w + 6;
      });
      // table
      s += box(CX, 136, CW, 196);
      s += r(CX + 1, 137, CW - 2, 20, C.light, 0);
      [10, 70, 130, 200, 268, 330].forEach(o => { s += r(CX + o, 144, o > 300 ? 26 : 34, 5, C.dark, 2); });
      s += line(CX, 157, CX + CW, 157);
      s += rows(CX, 172, CW, 5, 32, { zebra: true, mid: true });
      return s;
    },
  },
  {
    file: 'appointments',
    letter: 'C',
    title: 'Appointments',
    nav: 2,
    body: () => {
      let s = pageTitle();
      // queue stat strip
      s += box(CX, 106, CW, 46);
      for (let i = 0; i < 5; i++) {
        const x = CX + 12 + i * (CW / 5);
        s += r(x, 118, 24, 11, C.darker, 2);
        s += r(x, 134, 40, 5, C.block, 2);
        if (i > 0) s += line(x - 12, 108, x - 12, 150);
      }
      // queue table
      s += box(CX, 164, CW, 168);
      s += r(CX + 1, 165, CW - 2, 20, C.light, 0);
      [10, 56, 120, 200, 270, 330].forEach(o => { s += r(CX + o, 172, 30, 5, C.dark, 2); });
      s += line(CX, 185, CX + CW, 185);
      s += r(CX + 1, 186, CW - 2, 32, '#F7F1E3', 0);   // first row flagged
      s += rows(CX, 200, CW, 4, 32, { mid: true });
      return s;
    },
  },
  {
    file: 'medical-records',
    letter: 'D',
    title: 'Medical Records',
    nav: 3,
    body: () => {
      let s = pageTitle();
      // review-state chips
      let cx = CX;
      [78, 92, 86].forEach(w => { s += r(cx, 108, w, 13, '#F2E9D6', 6.5); cx += w + 7; });
      // tabs
      cx = CX;
      [46, 54, 62, 50].forEach((w, i) => { s += r(cx, 130, w, 13, i === 0 ? C.brandSoft : C.block, 6.5); cx += w + 6; });
      // worklist
      s += box(CX, 154, CW, 178);
      s += r(CX + 1, 155, CW - 2, 20, C.light, 0);
      [10, 80, 160, 250, 330].forEach(o => { s += r(CX + o, 162, 32, 5, C.dark, 2); });
      s += line(CX, 175, CX + CW, 175);
      // two "new" rows highlighted at top
      s += r(CX + 1, 176, CW - 2, 60, '#FAF6EE', 0);
      s += r(CX + 1, 176, 3, 60, C.brandSoft, 0);
      s += rows(CX, 190, CW, 4, 34, { mid: true });
      return s;
    },
  },
  {
    file: 'messages',
    letter: 'E',
    title: 'Messages',
    nav: 4,
    body: () => {
      let s = '';
      const y0 = TOP + 8, hh = H - y0 - 12;
      const p1 = 78, p2 = 118;
      // severity nav
      s += box(CX, y0, p1, hh);
      s += cap(CX + 8, y0 + 16, 'NAV');
      for (let i = 0; i < 5; i++) {
        const yy = y0 + 26 + i * 22;
        if (i === 0) s += r(CX + 1, yy - 4, p1 - 2, 18, '#F6EFF5', 2) + r(CX + 1, yy - 4, 3, 18, C.brand, 0);
        s += r(CX + 10, yy, 40 - i * 3, 6, i === 0 ? C.darker : C.sideBar, 2);
      }
      // thread list
      s += box(CX + p1 + 8, y0, p2, hh);
      s += cap(CX + p1 + 16, y0 + 16, 'THREADS');
      for (let i = 0; i < 4; i++) {
        const yy = y0 + 26 + i * 40;
        if (i === 0) s += r(CX + p1 + 9, yy - 4, p2 - 2, 36, C.light, 2);
        s += dot(CX + p1 + 20, yy + 6, 4, i < 2 ? C.darker : C.sideBar);
        s += r(CX + p1 + 30, yy + 3, 60, 6, C.darker, 2);
        s += r(CX + p1 + 30, yy + 15, 76, 5, C.block, 2);
        if (i < 3) s += line(CX + p1 + 9, yy + 30, CX + p1 + 8 + p2, yy + 30);
      }
      // conversation
      const cx3 = CX + p1 + p2 + 16;
      const w3 = CX + CW - cx3;
      s += box(cx3, y0, w3, hh);
      s += cap(cx3 + 8, y0 + 16, 'CONVERSATION');
      s += r(cx3 + 8, y0 + 26, 84, 26, C.block, 5);
      s += r(cx3 + w3 - 96, y0 + 60, 88, 20, C.light, 5);
      s += r(cx3 + 8, y0 + 90, 76, 22, C.block, 5);
      s += r(cx3 + 8, y0 + hh - 30, w3 - 16, 20, C.light, 5);
      s += r(cx3 + w3 - 34, y0 + hh - 27, 16, 14, C.dark, 3);
      return s;
    },
  },
  {
    file: 'tasks',
    letter: 'F',
    title: 'Tasks',
    nav: 5,
    body: () => {
      let s = pageTitle();
      let y = 112;
      [['NOW', 2], ['DUE THIS SHIFT', 2], ['HANDED OVER', 2]].forEach(([label, n]) => {
        s += cap(CX, y, label);
        s += dot(CX - 8, y - 3, 3, C.brandSoft);
        y += 8;
        for (let i = 0; i < n; i++) {
          s += box(CX, y, CW, 30);
          s += r(CX + 10, y + 8, 26, 6, C.dark, 2);
          s += r(CX + 44, y + 8, 108, 6, C.darker, 2);
          s += r(CX + 44, y + 19, 66, 5, C.block, 2);
          s += r(CX + CW - 52, y + 10, 42, 11, C.block, 5.5);
          y += 36;
        }
        y += 8;
      });
      return s;
    },
  },
  {
    file: 'operational-insights',
    letter: 'G',
    title: 'Operational Insights',
    nav: 6,
    body: () => {
      let s = pageTitle();
      // KPI cards
      for (let i = 0; i < 3; i++) {
        const x = CX + i * ((CW + 8) / 3);
        s += box(x, 106, (CW - 16) / 3, 46);
        s += r(x + 10, 116, 44, 5, C.block, 2);
        s += r(x + 10, 128, 30, 11, C.darker, 2);
      }
      // chart with threshold
      s += box(CX, 164, CW, 118);
      s += cap(CX + 10, 180, 'QUEUE PRESSURE');
      const bars = [26, 34, 30, 46, 54, 62, 74, 58, 44, 36, 30];
      const base = 268, bw = 22;
      bars.forEach((bh, i) => {
        s += r(CX + 14 + i * (bw + 8), base - bh, bw, bh, i === 6 ? C.darker : C.dark, 2);
      });
      s += line(CX + 8, base - 56, CX + CW - 8, base - 56, C.brandSoft, '4 3');
      s += line(CX + 8, base + 2, CX + CW - 8, base + 2);
      // narrative strip
      s += box(CX, 292, CW, 40);
      s += r(CX + 10, 302, 150, 6, C.dark, 2);
      s += r(CX + 10, 314, 220, 5, C.block, 2);
      return s;
    },
  },
  {
    file: 'settings',
    letter: 'H',
    title: 'Settings',
    nav: 7,
    body: () => {
      let s = pageTitle();
      s += box(CX, 108, CW, 224);
      // left settings nav
      s += r(CX + 1, 109, 106, 222, C.light, 0);
      s += line(CX + 107, 108, CX + 107, 332);
      for (let i = 0; i < 5; i++) {
        const yy = 124 + i * 26;
        if (i === 1) s += r(CX + 1, yy - 6, 106, 20, '#F6EFF5', 0) + r(CX + 1, yy - 6, 3, 20, C.brand, 0);
        s += r(CX + 14, yy, 62 - (i % 3) * 8, 6, i === 1 ? C.darker : C.sideBar, 2);
      }
      // right content cards
      for (let i = 0; i < 3; i++) {
        const yy = 124 + i * 66;
        s += box(CX + 120, yy, CW - 132, 54);
        s += r(CX + 132, yy + 12, 70, 6, C.dark, 2);
        s += r(CX + 132, yy + 26, 120, 5, C.block, 2);
        s += r(CX + CW - 68, yy + 18, 44, 16, C.block, 8);
      }
      return s;
    },
  },
];

for (const s of screens) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${s.title} wireframe">` +
    shell(s.letter, s.title, s.nav) +
    s.body() +
    `</svg>`;
  fs.writeFileSync(path.join(OUT, `${s.file}.svg`), svg, 'utf8');
  console.log(`${s.file}.svg  ${(svg.length / 1024).toFixed(1)} KB`);
}
console.log(`\n${screens.length} wireframes written to ${OUT}`);
