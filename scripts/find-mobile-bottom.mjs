import { Jimp } from 'jimp';

// Scan bottom 120px rows of mobile image looking for scrollbar
async function scan(path) {
  const img = await Jimp.read(path);
  const { width, height } = img.bitmap;

  console.log(`\n${path.split('/').pop()} (${width}x${height})`);
  console.log('y-pos | variance | avg-R | avg-G | avg-B');

  for (let y = height - 1; y > height - 120; y--) {
    const samples = 30;
    let rVals = [], gVals = [], bVals = [];
    for (let i = 0; i < samples; i++) {
      const x = Math.floor((width * 0.05) + (width * 0.9 / samples) * i);
      const hex = img.getPixelColor(x, y);
      rVals.push((hex >>> 24) & 0xff);
      gVals.push((hex >>> 16) & 0xff);
      bVals.push((hex >>> 8) & 0xff);
    }
    const variance = Math.max(...rVals) - Math.min(...rVals);
    const avgR = Math.round(rVals.reduce((a,b)=>a+b)/samples);
    const avgG = Math.round(gVals.reduce((a,b)=>a+b)/samples);
    const avgB = Math.round(bVals.reduce((a,b)=>a+b)/samples);

    // Only print rows that look like scrollbar (low variance, light color) or transition rows
    if (variance < 40) {
      const dist = height - y;
      console.log(`  -${String(dist).padStart(3)} (y=${y}): var=${String(variance).padStart(3)}  rgb=(${avgR},${avgG},${avgB})  ← scrollbar?`);
    } else {
      const dist = height - y;
      console.log(`  -${String(dist).padStart(3)} (y=${y}): var=${String(variance).padStart(3)}  rgb=(${avgR},${avgG},${avgB})  ← CONTENT`);
      break; // first content row from bottom
    }
  }
}

await scan('public/images/projects/riverside/mobile/hi-m-home.png');
await scan('public/images/projects/riverside/mobile/hi-m-confirmation.png');
