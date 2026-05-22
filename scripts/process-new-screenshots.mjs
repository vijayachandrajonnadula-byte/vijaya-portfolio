// Processes new reference screenshots:
// - Desktop: detects right-edge scrollbar, crops it, saves to clean/
// - Mobile: copies directly (already clean per visual inspection)
// Also detects mid-content horizontal scrollbar strips and paints them over.
import { Jimp } from 'jimp';
import { mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';

const REF = 'references/project-01-riverside';
const DEST = 'public/images/projects/riverside/clean';
mkdirSync(DEST, { recursive: true });

function rowAvgBrightness(data, w, y, x0, x1) {
  let sum = 0, n = 0;
  for (let x = x0; x < x1; x++) {
    const i = (y * w + x) * 4;
    sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    n++;
  }
  return sum / n;
}

function colAvgBrightness(data, w, h, x, y0, y1) {
  let sum = 0, n = 0;
  for (let y = y0; y < y1; y++) {
    const i = (y * w + x) * 4;
    sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    n++;
  }
  return sum / n;
}

// Returns the x-position of the right-edge scrollbar start, or -1 if none.
function findRightScrollbar(data, w, h) {
  // Scan from x=w-80 rightwards; scrollbar track is uniform light grey
  for (let x = w - 80; x < w - 2; x++) {
    const avg = colAvgBrightness(data, w, h, x, 30, Math.min(h, 600));
    let varSum = 0, n = 0;
    for (let y = 30; y < Math.min(h, 600); y++) {
      const i = (y * w + x) * 4;
      const b = (data[i] + data[i + 1] + data[i + 2]) / 3;
      varSum += (b - avg) * (b - avg);
      n++;
    }
    const variance = varSum / n;
    const isGrey = avg > 175 && avg < 240;
    const isUniform = variance < 500;
    if (isGrey && isUniform) return x;
  }
  return -1;
}

// Finds and returns horizontal scrollbar strips in range [yMin, yMax].
function findHScrollStrips(data, w, h, yMin, yMax) {
  const x0 = Math.floor(w * 0.05), x1 = Math.floor(w * 0.95);
  const bMap = {};
  for (let y = Math.max(0, yMin - 20); y <= Math.min(h - 1, yMax + 20); y++) {
    bMap[y] = rowAvgBrightness(data, w, y, x0, x1);
  }
  const strips = [];
  let inStrip = false, stripStart = -1;
  for (let y = yMin; y <= yMax; y++) {
    let nbSum = 0, nbCount = 0;
    for (let dy = 3; dy <= 12; dy++) {
      if (bMap[y - dy] != null) { nbSum += bMap[y - dy]; nbCount++; }
      if (bMap[y + dy] != null) { nbSum += bMap[y + dy]; nbCount++; }
    }
    const nbAvg = nbCount > 0 ? nbSum / nbCount : 240;
    const rowB = bMap[y];
    const isScroll = (nbAvg - rowB) >= 8 && rowB > 100 && rowB < 238;
    if (isScroll && !inStrip) { inStrip = true; stripStart = y; }
    else if (!isScroll && inStrip) {
      inStrip = false;
      const len = y - stripStart;
      if (len >= 3 && len <= 40) strips.push({ y0: stripStart, y1: y - 1 });
    }
  }
  if (inStrip) {
    const len = yMax - stripStart + 1;
    if (len >= 3 && len <= 40) strips.push({ y0: stripStart, y1: yMax });
  }
  return strips;
}

function paintStrips(data, w, strips) {
  for (const { y0, y1 } of strips) {
    const srcRow = Math.max(0, y0 - 2);
    for (let y = y0; y <= y1; y++) {
      for (let x = 0; x < w; x++) {
        const src = (srcRow * w + x) * 4;
        const dst = (y * w + x) * 4;
        data[dst] = data[src];
        data[dst + 1] = data[src + 1];
        data[dst + 2] = data[src + 2];
        data[dst + 3] = data[src + 3];
      }
    }
  }
}

const screens = [
  // [refPath, destName, isMobile]
  [`${REF}/mobile-screens/01 _ Home (2).png`,              'mobile-home.png',         true],
  [`${REF}/mobile-screens/02 _ Find Doctors (2).png`,      'mobile-find-doctors.png', true],
  [`${REF}/mobile-screens/03 _ Doctor Profile (2).png`,    'mobile-doctor-profile.png', true],
  [`${REF}/mobile-screens/04 _ Book Appointment (1).png`,  'mobile-booking.png',      true],
  [`${REF}/mobile-screens/05 _ Booking Confirmation (1).png`, 'mobile-confirmation.png', true],
  [`${REF}/mobile-screens/06 _ Manage Appointment (1).png`, 'mobile-manage.png',      true],
  [`${REF}/ui-screens/01 _ Home (3).png`,              'desktop-home.png',         false],
  [`${REF}/ui-screens/02 _ Find Doctors (3).png`,      'desktop-find-doctors.png', false],
  [`${REF}/ui-screens/03 _ Doctor Profile (3).png`,    'desktop-doctor-profile.png', false],
  [`${REF}/ui-screens/04 _ Book Appointment (2).png`,  'desktop-booking.png',      false],
  [`${REF}/ui-screens/05 _ Booking Confirmation (2).png`, 'desktop-confirmation.png', false],
  [`${REF}/ui-screens/06 _ Manage Appointment (2).png`, 'desktop-manage.png',      false],
];

for (const [src, dest, isMobile] of screens) {
  const destPath = join(DEST, dest);
  const img = await Jimp.read(src);
  const { bitmap: { data, width: w, height: h } } = img;
  const visH = Math.floor(w * (isMobile ? 16 / 9 : 10 / 16));

  console.log(`\n${dest} (${w}x${h}, visible≈${visH}px)`);

  let finalImg = img;

  // 1. Find and crop right-edge scrollbar (desktop mainly)
  const rightEdge = findRightScrollbar(data, w, h);
  if (rightEdge !== -1) {
    const newW = rightEdge - 2;
    console.log(`  Right scrollbar at x=${rightEdge} → crop to w=${newW}`);
    finalImg = img.crop({ x: 0, y: 0, w: newW, h });
  }

  // 2. Find and paint over mid-content horizontal scrollbar strips
  // Scan entire visible area in one pass
  const { bitmap: { data: d2, width: w2, height: h2 } } = finalImg;
  const strips = findHScrollStrips(d2, w2, h2, 100, Math.min(h2, visH + 30));
  if (strips.length > 0) {
    console.log(`  H-strips: ${JSON.stringify(strips)} → painting over`);
    paintStrips(d2, w2, strips);
  }

  await finalImg.write(destPath);
  console.log(`  → saved ${destPath}`);
}

console.log('\nAll done.');
