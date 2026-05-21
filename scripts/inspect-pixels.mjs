import { Jimp } from 'jimp';

// Inspect right edge columns of desktop and mobile images to locate scrollbar strips
async function inspectEdge(path, label) {
  const img = await Jimp.read(path);
  const { width, height } = img.bitmap;
  const midY = Math.floor(height / 2);

  // Sample 10 columns from right edge, at mid-height
  const cols = [];
  for (let i = 1; i <= 20; i++) {
    const x = width - i;
    const hex = img.getPixelColor(x, midY);
    const r = (hex >> 24) & 0xff;
    const g = (hex >> 16) & 0xff;
    const b = (hex >> 8) & 0xff;
    cols.push(`-${i}:(${r},${g},${b})`);
  }
  console.log(`\n${label} (${width}x${height})`);
  console.log('Right edge columns at mid-height:', cols.join('  '));

  // Also check bottom edge at mid-width
  const midX = Math.floor(width / 2);
  const rows = [];
  for (let i = 1; i <= 20; i++) {
    const y = height - i;
    const hex = img.getPixelColor(midX, y);
    const r = (hex >> 24) & 0xff;
    const g = (hex >> 16) & 0xff;
    const b = (hex >> 8) & 0xff;
    rows.push(`-${i}:(${r},${g},${b})`);
  }
  console.log('Bottom edge rows at mid-width:', rows.join('  '));
}

await inspectEdge('public/images/projects/riverside/ui-screens/hi-find-doctors.png', 'DESKTOP hi-find-doctors');
await inspectEdge('public/images/projects/riverside/mobile/hi-m-home.png', 'MOBILE hi-m-home');
await inspectEdge('public/images/projects/riverside/mobile/hi-m-manage.png', 'MOBILE hi-m-manage (clean reference)');
