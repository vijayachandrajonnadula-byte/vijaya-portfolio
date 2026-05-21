// Quick pixel inspector: prints brightness + color stats per row for a range.
import { Jimp } from 'jimp';

const file = process.argv[2];
const yMin = parseInt(process.argv[3] ?? '130');
const yMax = parseInt(process.argv[4] ?? '230');

const img = await Jimp.read(file);
const { bitmap: { data, width: w, height: h } } = img;

const x0 = Math.floor(w * 0.05);
const x1 = Math.floor(w * 0.95);

console.log(`File: ${file} (${w}x${h})`);
console.log(`Scanning rows ${yMin}–${yMax}, columns ${x0}–${x1}\n`);
console.log('y    avgR  avgG  avgB  brightness  variance');

for (let y = yMin; y <= yMax; y++) {
  let sumR = 0, sumG = 0, sumB = 0, n = 0;
  for (let x = x0; x < x1; x++) {
    const i = (y * w + x) * 4;
    sumR += data[i]; sumG += data[i + 1]; sumB += data[i + 2];
    n++;
  }
  const aR = sumR / n, aG = sumG / n, aB = sumB / n;
  const brightness = (aR + aG + aB) / 3;

  let varSum = 0;
  for (let x = x0; x < x1; x++) {
    const i = (y * w + x) * 4;
    const dr = data[i] - aR, dg = data[i + 1] - aG, db = data[i + 2] - aB;
    varSum += dr * dr + dg * dg + db * db;
  }
  const variance = varSum / n;

  // Flag rows that look grey and uniform (potential scrollbars)
  const flag = variance < 1500 && brightness > 150 && brightness < 235 ? ' <--- grey' : '';

  console.log(`${String(y).padStart(3)}  ${aR.toFixed(0).padStart(4)}  ${aG.toFixed(0).padStart(4)}  ${aB.toFixed(0).padStart(4)}  ${brightness.toFixed(1).padStart(10)}  ${variance.toFixed(0).padStart(8)}${flag}`);
}
