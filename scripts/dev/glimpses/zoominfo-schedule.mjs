// Schedule: slow pan across the real Figma screens, in task order
// empty state -> availability (split shifts) -> create meeting type (reminder limit) -> reminder email editor -> meeting type card.
import { kenburns } from './kenburns.mjs';

const P = 'public/images/projects/schedule/screens/';
await kenburns('zoominfo-schedule', [
  { img: P + 'schedule-01-empty-state.png', w: 1440, h: 806,
    from: { cx: 720, cy: 350, w: 1300 }, to: { cx: 720, cy: 440, w: 1000 },
    ring: { x: 448, y: 514, w: 544, h: 52 } },
  { img: P + 'schedule-03-availability-split.png', w: 1440, h: 1015,
    from: { cx: 400, cy: 330, w: 1100 }, to: { cx: 340, cy: 470, w: 800 },
    ring: [{ x: 48, y: 338, w: 420, h: 24 }, { x: 60, y: 420, w: 480, h: 96 }] },
  { img: P + 'schedule-07-create-filled.png', w: 1440, h: 997,
    from: { cx: 400, cy: 600, w: 1000 }, to: { cx: 340, cy: 700, w: 820 },
    ring: [{ x: 48, y: 610, w: 568, h: 64 }, { x: 48, y: 815, w: 206, h: 34 }] },
  { img: P + 'schedule-08-email-editor-1.png', w: 1440, h: 997,
    from: { cx: 720, cy: 440, w: 1250 }, to: { cx: 800, cy: 430, w: 950 },
    ring: [{ x: 224, y: 244, w: 360, h: 40 }, { x: 608, y: 254, w: 608, h: 494 }] },
  { img: P + 'schedule-12-meeting-created.png', w: 1440, h: 806,
    from: { cx: 520, cy: 300, w: 1200 }, to: { cx: 400, cy: 270, w: 850 },
    ring: { x: 32, y: 176, w: 448, h: 172 } },
]);
