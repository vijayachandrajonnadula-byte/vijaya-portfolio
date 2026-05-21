/**
 * Scan pixel columns from the right to find where the scrollbar starts.
 * The scrollbar track color on Windows/Chrome is approximately (240,238,233).
 * Content colors will vary. Find the leftmost column that is uniform (scrollbar).
 */
import { Jimp } from 'jimp';

async function findScrollbarEdge(path) {
  const img = await Jimp.read(path);
  const { width, height } = img.bitmap;

  // For each column from right, check if it looks like scrollbar
  // Scrollbar = uniform light beige/gray column with low color variance
  let scrollbarStartX = width; // assume none

  for (let x = width - 1; x > width - 80; x--) {
    let rSum = 0, gSum = 0, bSum = 0;
    let rMin = 255, rMax = 0;
    const samples = 20;
    for (let i = 0; i < samples; i++) {
      const y = Math.floor((height / (samples + 1)) * (i + 1));
      const hex = img.getPixelColor(x, y);
      const r = (hex >>> 24) & 0xff;
      const g = (hex >>> 16) & 0xff;
      const b = (hex >>> 8) & 0xff;
      rSum += r; gSum += g; bSum += b;
      if (r < rMin) rMin = r;
      if (r > rMax) rMax = r;
    }
    const rAvg = rSum / samples;
    const gAvg = gSum / samples;
    const bAvg = bSum / samples;
    const variance = rMax - rMin;

    // Scrollbar columns are:
    // - Uniform color (low variance)
    // - Light beige/gray color (R,G,B all between 220-245)
    if (variance < 20 && rAvg > 215 && rAvg < 250 && gAvg > 213 && bAvg > 208) {
      scrollbarStartX = x;
    } else {
      // First non-scrollbar column from right — stop
      break;
    }
  }

  const scrollbarWidth = width - scrollbarStartX;
  const name = path.split('/').pop();
  console.log(`${name} (${width}x${height}): scrollbar starts at x=${scrollbarStartX}, width=${scrollbarWidth}px`);
  return scrollbarWidth;
}

// Also scan bottom rows
async function findBottomScrollbar(path) {
  const img = await Jimp.read(path);
  const { width, height } = img.bitmap;

  let scrollbarStartY = height;

  for (let y = height - 1; y > height - 40; y--) {
    let rSum = 0, rMin = 255, rMax = 0;
    const samples = 20;
    for (let i = 0; i < samples; i++) {
      const x = Math.floor((width / (samples + 1)) * (i + 1));
      const hex = img.getPixelColor(x, y);
      const r = (hex >>> 24) & 0xff;
      const g = (hex >>> 16) & 0xff;
      const b = (hex >>> 8) & 0xff;
      rSum += r;
      if (r < rMin) rMin = r;
      if (r > rMax) rMax = r;
    }
    const rAvg = rSum / samples;
    const variance = rMax - rMin;
    if (variance < 20 && rAvg > 215 && rAvg < 250) {
      scrollbarStartY = y;
    } else {
      break;
    }
  }

  const scrollbarHeight = height - scrollbarStartY;
  const name = path.split('/').pop();
  console.log(`  bottom scrollbar height: ${scrollbarHeight}px`);
  return scrollbarHeight;
}

const paths = [
  'public/images/projects/riverside/ui-screens/hi-find-doctors.png',
  'public/images/projects/riverside/ui-screens/hi-book-appointment.png',
  'public/images/projects/riverside/ui-screens/hi-confirmation.png',
  'public/images/projects/riverside/ui-screens/hi-manage.png',
  'public/images/projects/riverside/mobile/hi-m-home.png',
  'public/images/projects/riverside/mobile/hi-m-find-doctors.png',
  'public/images/projects/riverside/mobile/hi-m-doctor-profile.png',
  'public/images/projects/riverside/mobile/hi-m-book-appointment.png',
  'public/images/projects/riverside/mobile/hi-m-confirmation.png',
];

for (const p of paths) {
  await findScrollbarEdge(p);
  await findBottomScrollbar(p);
}
