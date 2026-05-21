// Directly paints over the filter-chip horizontal scrollbar in mobile-find-doctors.png.
// Scrollbar confirmed at rows 177-190 by pixel inspection.
import { Jimp } from 'jimp';

const path = 'public/images/projects/riverside/clean/mobile-find-doctors.png';
const img = await Jimp.read(path);
const { bitmap: { data, width: w } } = img;

// Paint rows 177-190 with content from row 175 (pure white, brightness=253.1)
const srcRow = 175;
const y0 = 177, y1 = 190;
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
console.log(`Painted rows ${y0}-${y1} with row ${srcRow}`);

await img.write(path);
console.log('Saved', path);
