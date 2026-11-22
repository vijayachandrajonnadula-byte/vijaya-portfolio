// Account Fit Score: slow pan across the real Figma screens, in task order
// landing -> choose data source -> configure with account preview -> processing -> results.
import { kenburns } from './kenburns.mjs';

const P = 'public/images/projects/afs/screens/';
await kenburns('afs-enterprise-workflow', [
  { img: P + 'afs-01-landing.png', w: 1472, h: 822,
    from: { cx: 860, cy: 400, w: 1300 }, to: { cx: 800, cy: 470, w: 1000 },
    ring: { x: 724, y: 545, w: 155, h: 36 } },
  { img: P + 'afs-03-import.png', w: 1472, h: 822,
    from: { cx: 736, cy: 400, w: 1100 }, to: { cx: 736, cy: 420, w: 820 },
    ring: [{ x: 452, y: 332, w: 568, h: 116 }, { x: 452, y: 464, w: 568, h: 116 }] },
  { img: P + 'afs-05-preview.png', w: 1440, h: 790,
    from: { cx: 760, cy: 300, w: 1200 }, to: { cx: 900, cy: 300, w: 1000 },
    ring: [{ x: 272, y: 346, w: 800, h: 52 }, { x: 1104, y: 140, w: 320, h: 96 }] },
  { img: P + 'afs-08-processing.png', w: 1440, h: 790,
    from: { cx: 700, cy: 400, w: 1200 }, to: { cx: 640, cy: 500, w: 1000 },
    ring: [{ x: 614, y: 204, w: 90, h: 28 }, { x: 16, y: 676, w: 426, h: 98 }] },
  { img: P + 'afs-11-results.png', w: 1440, h: 842,
    from: { cx: 740, cy: 430, w: 1300 }, to: { cx: 760, cy: 400, w: 1000 },
    ring: [{ x: 320, y: 332, w: 1072, h: 42 }, { x: 320, y: 428, w: 530, h: 200 }] },
]);
