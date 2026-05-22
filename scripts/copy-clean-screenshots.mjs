// Copies new reference screenshots to the clean/ folder, no processing.
// The new screenshots are already clean — no baked scrollbars.
import { copyFileSync, mkdirSync } from 'fs';

const REF = 'references/project-01-riverside';
const DEST = 'public/images/projects/riverside/clean';
mkdirSync(DEST, { recursive: true });

const copies = [
  [`${REF}/mobile-screens/01 _ Home (2).png`,              `${DEST}/mobile-home.png`],
  [`${REF}/mobile-screens/02 _ Find Doctors (2).png`,      `${DEST}/mobile-find-doctors.png`],
  [`${REF}/mobile-screens/03 _ Doctor Profile (2).png`,    `${DEST}/mobile-doctor-profile.png`],
  [`${REF}/mobile-screens/04 _ Book Appointment (1).png`,  `${DEST}/mobile-booking.png`],
  [`${REF}/mobile-screens/05 _ Booking Confirmation (1).png`, `${DEST}/mobile-confirmation.png`],
  [`${REF}/mobile-screens/06 _ Manage Appointment (1).png`, `${DEST}/mobile-manage.png`],
  [`${REF}/ui-screens/01 _ Home (3).png`,              `${DEST}/desktop-home.png`],
  [`${REF}/ui-screens/02 _ Find Doctors (3).png`,      `${DEST}/desktop-find-doctors.png`],
  [`${REF}/ui-screens/03 _ Doctor Profile (3).png`,    `${DEST}/desktop-doctor-profile.png`],
  [`${REF}/ui-screens/04 _ Book Appointment (2).png`,  `${DEST}/desktop-booking.png`],
  [`${REF}/ui-screens/05 _ Booking Confirmation (2).png`, `${DEST}/desktop-confirmation.png`],
  [`${REF}/ui-screens/06 _ Manage Appointment (2).png`, `${DEST}/desktop-manage.png`],
];

for (const [src, dest] of copies) {
  copyFileSync(src, dest);
  console.log(`Copied → ${dest}`);
}
console.log('\nDone.');
