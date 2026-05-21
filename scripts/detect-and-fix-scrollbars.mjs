// Detects and paints over baked-in scrollbar strips.
// Fixes horizontal scrollbar rows and right-edge vertical scrollbar columns.
import { Jimp } from 'jimp';
import { writeFileSync } from 'fs';

const BASE = 'public/images/projects/riverside/clean/';

// Checks whether a horizontal row is a scrollbar track row.
// A scrollbar track is: nearly uniform, neutral grey (no saturation), low variance.
function isScrollbarRow(data, w, y, x0, x1) {
  let sumR = 0, sumG = 0, sumB = 0, n = 0;
  for (let x = x0; x < x1; x++) {
    const i = (y * w + x) * 4;
    sumR += data[i]; sumG += data[i + 1]; sumB += data[i + 2];
    n++;
  }
  const aR = sumR / n, aG = sumG / n, aB = sumB / n;
  let varSum = 0;
  for (let x = x0; x < x1; x++) {
    const i = (y * w + x) * 4;
    const dr = data[i] - aR, dg = data[i + 1] - aG, db = data[i + 2] - aB;
    varSum += dr * dr + dg * dg + db * db;
  }
  const variance = varSum / n;
  // Scrollbar track: uniform, neutral grey (R≈G≈B ≈ 180–230)
  const isGrey = aR > 175 && aR < 235 && Math.abs(aR - aG) < 20 && Math.abs(aR - aB) < 20;
  const isUniform = variance < 600;
  return isGrey && isUniform;
}

// Checks whether a vertical column is a scrollbar track.
function isScrollbarCol(data, w, h, x, y0, y1) {
  let sumR = 0, sumG = 0, sumB = 0, n = 0;
  for (let y = y0; y < y1; y++) {
    const i = (y * w + x) * 4;
    sumR += data[i]; sumG += data[i + 1]; sumB += data[i + 2];
    n++;
  }
  const aR = sumR / n, aG = sumG / n, aB = sumB / n;
  let varSum = 0;
  for (let y = y0; y < y1; y++) {
    const i = (y * w + x) * 4;
    const dr = data[i] - aR, dg = data[i + 1] - aG, db = data[i + 2] - aB;
    varSum += dr * dr + dg * dg + db * db;
  }
  const variance = varSum / n;
  const isGrey = aR > 175 && aR < 235 && Math.abs(aR - aG) < 20 && Math.abs(aR - aB) < 20;
  return isGrey && variance < 600;
}

async function processImage(filename, opts = {}) {
  const path = BASE + filename;
  const img = await Jimp.read(path);
  const { bitmap: { data, width: w, height: h } } = img;
  const visH = opts.visibleH ?? Math.floor(w * (opts.mobileRatio ? 16 / 9 : 10 / 16));

  console.log(`\n=== ${filename} (${w}x${h}) visible≈${visH}px ===`);

  // 1. Find horizontal scrollbar strips (scan from y=100 to visibleH+20)
  const hStrips = [];
  let inStrip = false, stripStart = -1;
  for (let y = 100; y < Math.min(h, visH + 30); y++) {
    const scroll = isScrollbarRow(data, w, y, Math.floor(w * 0.1), Math.floor(w * 0.9));
    if (scroll && !inStrip) { inStrip = true; stripStart = y; }
    else if (!scroll && inStrip) {
      inStrip = false;
      const len = y - stripStart;
      if (len >= 4 && len <= 35) hStrips.push({ y0: stripStart, y1: y - 1 });
    }
  }
  if (inStrip) {
    const len = (Math.min(h, visH + 30) - 1) - stripStart;
    if (len >= 4 && len <= 35) hStrips.push({ y0: stripStart, y1: Math.min(h, visH + 30) - 1 });
  }
  console.log('  H-strips found:', hStrips);

  // 2. Find right-edge vertical scrollbar (scan from x = w-60 to w-5)
  const rightScrollStart = w - 60;
  let rightEdge = -1;
  for (let x = rightScrollStart; x < w - 2; x++) {
    if (isScrollbarCol(data, w, h, x, 50, Math.min(h, 500))) {
      rightEdge = x;
      break;
    }
  }
  if (rightEdge !== -1) console.log(`  Right scrollbar found starting at x=${rightEdge}`);

  // 3. Fix horizontal strips — copy from row just above each strip
  for (const { y0, y1 } of hStrips) {
    const srcRow = Math.max(0, y0 - 2);
    console.log(`  Painting over rows ${y0}-${y1} with content from row ${srcRow}`);
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

  // 4. Fix right-edge scrollbar — crop the image
  let finalImg = img;
  if (rightEdge !== -1) {
    const newW = rightEdge - 2; // leave 2px safety margin
    console.log(`  Cropping width from ${w} to ${newW}`);
    finalImg = img.crop({ x: 0, y: 0, w: newW, h });
  }

  await finalImg.write(path);
  console.log(`  Saved ${path}`);
  return { hStrips, rightEdge };
}

// Mobile screens: 9/16 frame, show y=0 to y≈(w*16/9)
const mobileScreens = [
  'mobile-home.png',
  'mobile-find-doctors.png',
  'mobile-doctor-profile.png',
  'mobile-booking.png',
  'mobile-confirmation.png',
];

// Desktop screens — also check for right-edge vertical scrollbar
const desktopScreens = [
  'desktop-home.png',
  'desktop-doctor-profile.png',
  'desktop-find-doctors.png',
  'desktop-booking.png',
  'desktop-confirmation.png',
  'desktop-manage.png',
];

console.log('=== MOBILE SCREENS ===');
for (const f of mobileScreens) {
  await processImage(f, { mobileRatio: true });
}

console.log('\n=== DESKTOP SCREENS ===');
for (const f of desktopScreens) {
  await processImage(f, { mobileRatio: false });
}

console.log('\nDone.');
