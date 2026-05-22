// Copies new reference screenshots to the clean/ folder, no processing.
import { copyFileSync, mkdirSync } from 'fs';

const REF = 'references/project-01-riverside';
const DEST = 'public/images/projects/riverside/clean';
mkdirSync(DEST, { recursive: true });

const copies = [
  [`${REF}/mobile-screens/01-home.png`,             `${DEST}/mobile-home.png`],
  [`${REF}/mobile-screens/02-find-doctors.png`,     `${DEST}/mobile-find-doctors.png`],
  [`${REF}/mobile-screens/03-doctor-profile.png`,   `${DEST}/mobile-doctor-profile.png`],
  [`${REF}/mobile-screens/04-book-appointment.png`, `${DEST}/mobile-booking.png`],
  [`${REF}/mobile-screens/05-confirmation.png`,     `${DEST}/mobile-confirmation.png`],
  [`${REF}/mobile-screens/06-manage.png`,           `${DEST}/mobile-manage.png`],
  [`${REF}/ui-screens/01-home.png`,             `${DEST}/desktop-home.png`],
  [`${REF}/ui-screens/02-find-doctors.png`,     `${DEST}/desktop-find-doctors.png`],
  [`${REF}/ui-screens/03-doctor-profile.png`,   `${DEST}/desktop-doctor-profile.png`],
  [`${REF}/ui-screens/04-book-appointment.png`, `${DEST}/desktop-booking.png`],
  [`${REF}/ui-screens/05-confirmation.png`,     `${DEST}/desktop-confirmation.png`],
  [`${REF}/ui-screens/06-manage.png`,           `${DEST}/desktop-manage.png`],
];

for (const [src, dest] of copies) {
  copyFileSync(src, dest);
  console.log(`Copied → ${dest}`);
}
console.log('\nDone.');
