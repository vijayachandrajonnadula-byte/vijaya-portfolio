import { Jimp } from 'jimp';
import { mkdirSync } from 'fs';

// Desktop: 50px right, 44px bottom (scrollbar + thumb region fully covered)
// Mobile: 67px right (62+5 extra to remove thumb indicator), 40px bottom
const D_R = 50, D_B = 44;
const M_R = 67, M_B = 40;

mkdirSync('public/images/projects/riverside/clean', { recursive: true });

const tasks = [
  { src: 'public/images/projects/riverside/ui-screens/hi-home.png',           dest: 'public/images/projects/riverside/clean/desktop-home.png',         r: 0,   b: 0   },
  { src: 'public/images/projects/riverside/ui-screens/hi-find-doctors.png',   dest: 'public/images/projects/riverside/clean/desktop-find-doctors.png',  r: D_R, b: D_B },
  { src: 'public/images/projects/riverside/ui-screens/hi-doctor-profile.png', dest: 'public/images/projects/riverside/clean/desktop-doctor-profile.png',r: 0,   b: 0   },
  { src: 'public/images/projects/riverside/ui-screens/hi-book-appointment.png',dest:'public/images/projects/riverside/clean/desktop-booking.png',        r: D_R, b: D_B },
  { src: 'public/images/projects/riverside/ui-screens/hi-confirmation.png',   dest: 'public/images/projects/riverside/clean/desktop-confirmation.png',   r: D_R, b: D_B },
  { src: 'public/images/projects/riverside/ui-screens/hi-manage.png',         dest: 'public/images/projects/riverside/clean/desktop-manage.png',         r: D_R, b: D_B },
  { src: 'public/images/projects/riverside/mobile/hi-m-home.png',             dest: 'public/images/projects/riverside/clean/mobile-home.png',            r: M_R, b: M_B },
  { src: 'public/images/projects/riverside/mobile/hi-m-find-doctors.png',     dest: 'public/images/projects/riverside/clean/mobile-find-doctors.png',    r: M_R, b: M_B },
  { src: 'public/images/projects/riverside/mobile/hi-m-doctor-profile.png',   dest: 'public/images/projects/riverside/clean/mobile-doctor-profile.png',  r: M_R, b: M_B },
  { src: 'public/images/projects/riverside/mobile/hi-m-book-appointment.png', dest: 'public/images/projects/riverside/clean/mobile-booking.png',         r: M_R, b: M_B },
  { src: 'public/images/projects/riverside/mobile/hi-m-confirmation.png',     dest: 'public/images/projects/riverside/clean/mobile-confirmation.png',     r: M_R, b: M_B },
  { src: 'public/images/projects/riverside/mobile/hi-m-manage.png',           dest: 'public/images/projects/riverside/clean/mobile-manage.png',           r: 0,   b: 0   },
];

for (const { src, dest, r, b } of tasks) {
  const img = await Jimp.read(src);
  const { width, height } = img.bitmap;
  if (r > 0 || b > 0) img.crop({ x: 0, y: 0, w: width - r, h: height - b });
  await img.write(dest);
  const label = r > 0 ? `CROPPED ${width}x${height} → ${width-r}x${height-b}` : `COPIED  ${width}x${height}`;
  console.log(`${label}  ${dest.split('/').pop()}`);
}
console.log('\nDone.');
