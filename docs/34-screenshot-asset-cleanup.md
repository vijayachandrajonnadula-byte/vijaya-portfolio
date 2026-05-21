# Screenshot Asset Cleanup — Riverside General

## Audit date: 2026-05-21

---

## Section audit table

| Section | Current image path | Problem | Fix method | Clean path |
|---------|-------------------|---------|------------|------------|
| Desktop: Home | ui-screens/hi-home.png | **clean** | copy | clean/desktop-home.png |
| Desktop: Find Doctors | ui-screens/hi-find-doctors.png | baked vertical + horizontal scrollbar (28px right, 27px bottom) | pixel-crop | clean/desktop-find-doctors.png |
| Desktop: Doctor Profile | ui-screens/hi-doctor-profile.png | **clean** | copy | clean/desktop-doctor-profile.png |
| Desktop: Book Appointment | ui-screens/hi-book-appointment.png | baked vertical + horizontal scrollbar (28px right, 43px bottom) | pixel-crop | clean/desktop-booking.png |
| Desktop: Confirmation | ui-screens/hi-confirmation.png | baked vertical + horizontal scrollbar (28px right, 28px bottom) | pixel-crop | clean/desktop-confirmation.png |
| Desktop: Manage | ui-screens/hi-manage.png | baked vertical + horizontal scrollbar (28px right, 43px bottom) | pixel-crop | clean/desktop-manage.png |
| Mobile: Home | mobile/hi-m-home.png | baked vertical scrollbar + horizontal scrollbar (57px right, 39px bottom) | pixel-crop | clean/mobile-home.png |
| Mobile: Find Doctors | mobile/hi-m-find-doctors.png | baked vertical scrollbar + horizontal scrollbar | pixel-crop | clean/mobile-find-doctors.png |
| Mobile: Doctor Profile | mobile/hi-m-doctor-profile.png | baked vertical scrollbar + horizontal scrollbar | pixel-crop | clean/mobile-doctor-profile.png |
| Mobile: Booking | mobile/hi-m-book-appointment.png | baked vertical scrollbar + horizontal scrollbar | pixel-crop | clean/mobile-booking.png |
| Mobile: Confirmation | mobile/hi-m-confirmation.png | baked vertical scrollbar + horizontal scrollbar | pixel-crop | clean/mobile-confirmation.png |
| Mobile: Manage | mobile/hi-m-manage.png | **clean** | copy | clean/mobile-manage.png |
| Homepage featured card | ui-screens/hi-home.png (clean) | previously pointed to home.png | updated path | clean/desktop-home.png |
| Wireframes | wireframes/*.png | **clean** | no change | no change |
| IA diagram | wireframes/ia-map.png | **clean** | no change | no change |
| Flow diagram | wireframes/flow-map.png | **clean** | no change | no change |
| Design system | design-system/*.png | **clean** | no change | no change |

---

## Scrollbar detection method

Used pixel analysis (jimp) to scan columns from the right edge and rows from the bottom edge of each image. Identified uniform-color (low variance < 20) light-beige strips as the Windows/Chrome scrollbar track color (RGB ~236–240, 234–238, 229–233).

**Desktop scrollbar dimensions:**
- Right: 28px wide (Chrome scrollbar on Windows 11 at 1x DPR)
- Bottom: 27–43px tall
- Crop applied: 50px right, 44px bottom (+ safety margin)

**Mobile scrollbar dimensions:**
- Right: 57–61px wide (scrollbar track + right phone bezel + background — all uniform/light-colored)
- Bottom: 39px tall
- Crop applied: 67px right, 40px bottom (+ safety margin)

**Note on mobile:** The horizontal strip visible inside the phone content area (above the navigation bar in Home and Find Doctors screens) is the app's own horizontal scroll indicator for the department cards section. This is intentional app UI, not a browser artifact.

---

## Files produced

```
public/images/projects/riverside/clean/
  desktop-home.png        924x1291  (clean copy)
  desktop-find-doctors.png  874x880  (cropped)
  desktop-doctor-profile.png  924x951  (clean copy)
  desktop-booking.png     874x988  (cropped)
  desktop-confirmation.png  874x853  (cropped)
  desktop-manage.png      874x717  (cropped)
  mobile-home.png         403x884  (cropped)
  mobile-find-doctors.png   403x884  (cropped)
  mobile-doctor-profile.png  403x884  (cropped)
  mobile-booking.png      403x884  (cropped)
  mobile-confirmation.png   403x884  (cropped)
  mobile-manage.png       470x924  (clean copy)
```

---

## Data files updated

- `src/data/caseStudies.ts` — desktopScreenshots and mobileScreenshots arrays now point to /images/projects/riverside/clean/
- `src/data/projects.ts` — homepage featured card image updated to clean/desktop-home.png

---

## Other changes in this pass

- `src/styles/global.css` — sticky nav `top` reduced from `calc(64px + var(--space-8))` to `88px`
- `src/styles/global.css` — nav links changed from `color-text-muted` to `color-text-secondary` for better readability
- `src/styles/global.css` — active nav link now uses `font-weight: semibold`
- `src/components/case-study/CaseStudyNav.tsx` — section label "Final UI screens" → "Desktop screens"
- `src/pages/CaseStudyPage.tsx` — section headings updated to "Desktop prototype screens" and "Mobile prototype screens"
- `src/pages/CaseStudyPage.tsx` — section descriptions updated to clarify these are built prototype screens

---

## Remaining known issues / TODO if assets are recaptured

- Mobile `hi-m-find-doctors.png`: filter chip strip (All filters / Cardiology / Today) has a horizontal scroll indicator — this is app UI, cannot be cropped
- Desktop `hi-book-appointment.png` and `hi-confirmation.png`: "Maya Singh" appears as patient name in the booking form — this was the original prototype test data, not a real patient. Replace with a neutral name like "A. Sharma" if re-capturing
