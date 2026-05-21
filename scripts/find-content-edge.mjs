/**
 * For each image, scan columns from the right to find where HIGH-variance
 * content actually starts (meaning real app content, not uniform scrollbar).
 */
import { Jimp } from 'jimp';

async function findContentEdge(path) {
  const img = await Jimp.read(path);
  const { width, height } = img.bitmap;

  // Scan columns from right to left.
  // Report color variance for each column using 30 sample points.
  const results = [];
  for (let x = width - 1; x > width - 90; x--) {
    const samples = 30;
    let rVals = [];
    for (let i = 0; i < samples; i++) {
      const y = Math.floor((height * 0.1) + (height * 0.8 / samples) * i);
      const hex = img.getPixelColor(x, y);
      const r = (hex >>> 24) & 0xff;
      rVals.push(r);
    }
    const min = Math.min(...rVals);
    const max = Math.max(...rVals);
    const variance = max - min;
    const avg = rVals.reduce((a, b) => a + b, 0) / rVals.length;
    results.push({ x, variance, avg: Math.round(avg) });
  }

  // Find first column from right that has high variance (= real content)
  const contentStart = results.find(r => r.variance > 30);
  const name = path.split('/').pop();
  if (contentStart) {
    const stripWidth = width - contentStart.x;
    console.log(`${name}: content starts at x=${contentStart.x} → strip to crop = ${stripWidth}px (avg=${contentStart.avg}, var=${contentStart.variance})`);
  } else {
    console.log(`${name}: no high-variance column found in right 90px`);
  }

  // Also scan bottom rows
  const bottomResults = [];
  for (let y = height - 1; y > height - 55; y--) {
    const samples = 30;
    let rVals = [];
    for (let i = 0; i < samples; i++) {
      const x = Math.floor((width * 0.05) + (width * 0.9 / samples) * i);
      const hex = img.getPixelColor(x, y);
      const r = (hex >>> 24) & 0xff;
      rVals.push(r);
    }
    const min = Math.min(...rVals);
    const max = Math.max(...rVals);
    const variance = max - min;
    bottomResults.push({ y, variance });
  }
  const bottomContent = bottomResults.find(r => r.variance > 30);
  if (bottomContent) {
    const stripH = height - bottomContent.y;
    console.log(`  bottom content starts at y=${bottomContent.y} → strip to crop = ${stripH}px`);
  } else {
    console.log(`  bottom: no high-variance row found in bottom 55px`);
  }
}

const paths = [
  'public/images/projects/riverside/ui-screens/hi-find-doctors.png',
  'public/images/projects/riverside/ui-screens/hi-book-appointment.png',
  'public/images/projects/riverside/ui-screens/hi-manage.png',
  'public/images/projects/riverside/mobile/hi-m-home.png',
  'public/images/projects/riverside/mobile/hi-m-find-doctors.png',
  'public/images/projects/riverside/mobile/hi-m-doctor-profile.png',
];

for (const p of paths) {
  await findContentEdge(p);
}
