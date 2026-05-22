// Scans column brightness for a range of x values (right edge analysis)
import { Jimp } from 'jimp';

const file = process.argv[2];
const xMin = parseInt(process.argv[3] ?? '0');
const xMax = parseInt(process.argv[4] ?? '50');

const img = await Jimp.read(file);
const { bitmap: { data, width: w, height: h } } = img;

const y0 = 50, y1 = Math.min(h, 800);

console.log(`File: ${file} (${w}x${h})`);
console.log(`Scanning cols x=${w - xMax} to x=${w - xMin}, rows ${y0}-${y1}\n`);
console.log('x        avg     variance');

for (let dx = xMax; dx >= xMin; dx--) {
  const x = w - dx;
  let sum = 0, n = 0;
  for (let y = y0; y < y1; y++) {
    const i = (y * w + x) * 4;
    sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    n++;
  }
  const avg = sum / n;
  let varSum = 0;
  for (let y = y0; y < y1; y++) {
    const i = (y * w + x) * 4;
    const b = (data[i] + data[i + 1] + data[i + 2]) / 3;
    varSum += (b - avg) * (b - avg);
  }
  const variance = varSum / n;
  const flag = avg > 175 && avg < 240 && variance < 500 ? ' <--- grey uniform' : '';
  console.log(`x=${String(x).padStart(5)} (w-${String(dx).padStart(3)})  avg=${avg.toFixed(1).padStart(6)}  var=${variance.toFixed(0).padStart(8)}${flag}`);
}
