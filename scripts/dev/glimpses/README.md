# Glimpse clips

Short silent looping clips (960x600, VP8 webm, 6 to 9 s, under 700 KB each) shown on the home page work cards by
`src/components/studio/GlimpseVideo.tsx`. List: `src/data/glimpses.ts`. Output: `public/videos/projects/<id>.webm`.

## Re-record

1. Start the dev server (`npm run dev`, port 5173). The PULSE clips use `/pulse-gallery/`, which is served from `public/`.
2. From the repo root run any script, for example:

```
node scripts/dev/glimpses/caresync.mjs
```

Each script records with Playwright (real time, a drawn cursor dot), then trims and re-encodes with ffmpeg.

- `SITE_URL` sets the site base for the PULSE clips (default `http://localhost:5173`).
- `FFMPEG` sets the ffmpeg path. Default: Playwright's bundled build,
  `%LOCALAPPDATA%\ms-playwright\ffmpeg-1011\ffmpeg-win64.exe`. It is VP8 only: no ffprobe, no h264, no JPEG, no `fps` filter.
  If your Playwright version has a different folder name, set `FFMPEG`.
- `GLIMPSE_WORK` sets the scratch folder for raw recordings and harness pages (default: `%TEMP%\glimpses-work`). Nothing is written to the repo except the webm.
- Timing depends on network speed for the hosted prototypes. A warning is printed if a clip falls outside 6 to 9 s; shorten the `sleep()` / move durations in that script.

## Clips

| id | script | what it shows |
| --- | --- | --- |
| `pulse-design-system` | `pulse-design-system.mjs` | The hosted PULSE gallery: hover Button variants, open Chip, open DataGrid and hover its Document header, back to Button. |
| `electronic-execution` | `electronic-execution.mjs` | The Electronic execution prototype: type an actual result, Pass, Record, fill the e-sign dialog (any password; only presence is checked), Submit, step status updates. The evidence snapshot (a generated sample still the app requires) is attached off camera. Fades from and to white to loop. |
| `afs-enterprise-workflow` | `afs-enterprise-workflow.mjs` + `kenburns.mjs` | No live prototype: slow pan over the real Figma screens in task order (landing, data source, configure with preview, processing, results) with an accent ring on the control being discussed. |
| `zoominfo-schedule` | `zoominfo-schedule.mjs` + `kenburns.mjs` | Same treatment for the Schedule screens (empty state, split shifts, reminder limit, reminder email editor, meeting type card). |
| `caresync` | `caresync.mjs` | Hosted prototype `care-sync-two-mu.vercel.app/shift-briefing`: calm scroll, one hover, back to the top. |
| `renewly` | `renewly.mjs` | Hosted prototype `renewly-ux.vercel.app`: dashboard scroll, hover a Review action and a renewal card, back to the top. |
| `riverside-general` | `riverside-general.mjs` | Hosted prototype `hospital-booking-portfolio.vercel.app`: search a doctor, View Availability, pick a slot, back to the home page. Never presses Book Appointment. |
| `ai-workflow` | `ai-workflow.mjs` | Motion graphic. Phase numbers and titles are read from `src/data/workflowCaseStudy.ts` (a 7-step subset of the 13 phases: 01, 02, 06, 07, 08, 09, 12). A clay dot travels the line and each step lights. |

`lib.mjs` has the shared recorder (cursor overlay, eased mouse moves and scrolls, trim and encode). `kenburns.mjs` builds the
pan-and-zoom harness page; screens are shown as they are, never redrawn.

## Notes

- The hosted prototypes can change or go down; if one does, re-record from the screenshots under `public/images/projects/<id>/` with `kenburns.mjs`.
- Renewly's sample data includes a person's name (Approval queue); the Riverside and CareSync prototypes show sample doctor and patient names. They are the prototypes' own sample data. Check them before shipping.
