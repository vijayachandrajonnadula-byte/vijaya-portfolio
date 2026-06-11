// Generates FieldFlow PWA icons and cover image using jimp (already installed)
import Jimp from 'jimp';
import { writeFileSync } from 'fs';

const PRIMARY = 0x2457D6FF;
const BG = 0xF7F8FCFF;
const WHITE = 0xFFFFFFFF;

async function makeIcon(size, outPath) {
  const img = new Jimp({ width: size, height: size, color: PRIMARY });
  // Simple white square "F" logo centered
  const margin = Math.floor(size * 0.2);
  const barH = Math.floor(size * 0.08);
  const barW = Math.floor(size * 0.45);
  const x = Math.floor(size * 0.25);
  const y = Math.floor(size * 0.22);
  // Vertical bar
  for (let py = y; py < y + Math.floor(size * 0.56); py++) {
    for (let px = x; px < x + barH; px++) {
      img.setPixelColor(WHITE, px, py);
    }
  }
  // Top horizontal bar
  for (let py = y; py < y + barH; py++) {
    for (let px = x; px < x + barW; px++) {
      img.setPixelColor(WHITE, px, py);
    }
  }
  // Middle horizontal bar
  const midY = Math.floor(y + size * 0.24);
  for (let py = midY; py < midY + barH; py++) {
    for (let px = x; px < x + Math.floor(barW * 0.75); px++) {
      img.setPixelColor(WHITE, px, py);
    }
  }
  await img.write(outPath);
  console.log(`Created ${outPath}`);
}

async function makeCover(outPath) {
  const w = 800, h = 500;
  const img = new Jimp({ width: w, height: h, color: 0x1A2A6CFF });
  // Lighter strip at bottom
  for (let y = h - 80; y < h; y++) {
    for (let x = 0; x < w; x++) {
      img.setPixelColor(0x2457D6FF, x, y);
    }
  }
  // White text placeholder strip
  for (let y = Math.floor(h * 0.3); y < Math.floor(h * 0.38); y++) {
    for (let x = Math.floor(w * 0.1); x < Math.floor(w * 0.6); x++) {
      img.setPixelColor(0xFFFFFFCC, x, y);
    }
  }
  await img.write(outPath);
  console.log(`Created ${outPath}`);
}

try {
  await makeIcon(192, 'public/icons/fieldflow-192.png');
  await makeIcon(512, 'public/icons/fieldflow-512.png');
  await makeCover('public/images/projects/field-flow/cover.png');
  console.log('FieldFlow icons generated successfully.');
} catch (e) {
  console.error('Icon generation failed (non-critical):', e.message);
  // Create minimal placeholder PNGs using raw bytes
  // 1x1 blue PNG
  const bluePng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  writeFileSync('public/icons/fieldflow-192.png', bluePng);
  writeFileSync('public/icons/fieldflow-512.png', bluePng);
  writeFileSync('public/images/projects/field-flow/cover.png', bluePng);
  console.log('Created placeholder icon files.');
}
