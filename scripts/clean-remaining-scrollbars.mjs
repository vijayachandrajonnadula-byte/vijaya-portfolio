// Second pass: fixes scrollbars missed by the first pass.
// Uses a relative-brightness approach: scrollbar rows are darker/greyer than their neighbours.
import { Jimp } from 'jimp';

const BASE = 'public/images/projects/riverside/clean/';

function rowAvgBrightness(data, w, y, x0, x1) {
  let sum = 0, n = 0;
  for (let x = x0; x < x1; x++) {
    const i = (y * w + x) * 4;
    sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    n++;
  }
  return sum / n;
}

// Finds horizontal scrollbar strips in scanRange by comparing each row brightness
// to its neighbours. scrollbars are darker (more grey) than white content rows.
function findScrollbarStrips(data, w, h, scanRange, x0, x1) {
  const [yMin, yMax] = scanRange;
  // Pre-compute brightness for each row in a wider window
  const bMap = {};
  for (let y = Math.max(0, yMin - 20); y <= Math.min(h - 1, yMax + 20); y++) {
    bMap[y] = rowAvgBrightness(data, w, y, x0, x1);
  }

  const strips = [];
  let inStrip = false, stripStart = -1;

  for (let y = yMin; y <= yMax; y++) {
    // Average brightness of neighbours (skip the immediate ±1 rows)
    let nbSum = 0, nbCount = 0;
    for (let dy = 3; dy <= 12; dy++) {
      if (bMap[y - dy] !== undefined) { nbSum += bMap[y - dy]; nbCount++; }
      if (bMap[y + dy] !== undefined) { nbSum += bMap[y + dy]; nbCount++; }
    }
    const nbAvg = nbCount > 0 ? nbSum / nbCount : 240;
    const rowB = bMap[y];

    // A scrollbar row: darker than neighbours by ≥8, not too dark (not text), not too bright
    const isScroll = (nbAvg - rowB) >= 8 && rowB > 100 && rowB < 235;

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

function paintOverStrips(data, w, strips) {
  for (const { y0, y1 } of strips) {
    // Sample from row just above the strip start (content above the scrollbar)
    const srcRow = Math.max(0, y0 - 2);
    console.log(`  Painting rows ${y0}–${y1} with row ${srcRow}`);
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

// Each entry: filename + list of y-ranges where scrollbars are likely.
// Ranges are generous — the algorithm finds exact rows within each range.
const targets = [
  {
    file: 'mobile-find-doctors.png',
    ranges: [[140, 230]],   // filter chip scrollbar
  },
  {
    file: 'mobile-doctor-profile.png',
    ranges: [[580, 630]],   // date carousel scrollbar
  },
  {
    file: 'mobile-booking.png',
    ranges: [[340, 395]],   // date picker scrollbar
  },
];

for (const { file, ranges } of targets) {
  const path = BASE + file;
  const img = await Jimp.read(path);
  const { bitmap: { data, width: w, height: h } } = img;
  const x0 = Math.floor(w * 0.05);
  const x1 = Math.floor(w * 0.95);

  console.log(`\n${file} (${w}x${h})`);

  let changed = false;
  for (const range of ranges) {
    const strips = findScrollbarStrips(data, w, h, range, x0, x1);
    console.log(`  Range ${range}: found strips`, strips);
    if (strips.length > 0) {
      paintOverStrips(data, w, strips);
      changed = true;
    }
  }

  if (changed) {
    await img.write(path);
    console.log(`  Saved ${path}`);
  } else {
    console.log(`  No strips found — no changes`);
  }
}

console.log('\nDone.');
