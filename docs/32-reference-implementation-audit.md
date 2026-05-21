# Reference Implementation Audit

## Audit date: 2026-05-21

---

## 1. Reference HTML/image files

| File | Size | Type | Readable? |
|------|------|------|-----------|
| references/portfolio-design/claude-home/01 _ Home _ Desktop.html | 10.7 MB | Figma export (base64 SVG/PNG) | No — encoded |
| references/portfolio-design/claude-home/01 _ Home _ Desktop (5).png | 9.9 MB | PNG reference | View only |
| references/portfolio-design/claude-case-study/02 _ Case study _ Desktop.html | 32.9 MB | Figma export | No — encoded |
| references/portfolio-design/claude-case-study/02 _ Case study _ Desktop (6).png | 24 MB | PNG reference | View only |
| references/portfolio-design/mobile/03 _ Home _ Mobile.html | 6.6 MB | Figma export | No — encoded |
| references/portfolio-design/mobile/03 _ Home _ Mobile.png | 5.2 MB | PNG reference | View only |
| references/portfolio-design/mobile/04 _ Case study _ Mobile.html | 24.3 MB | Figma export | No — encoded |
| references/portfolio-design/mobile/Case study - Mobile.png | 2.6 MB | PNG reference | View only |

**Conclusion:** HTML files are 100% base64-encoded Figma exports. No readable HTML layout patterns can be extracted from them. The PNG files are the visual references. Implementation must match the visual reference by intent, not by DOM inspection.

---

## 2. Riverside project assets — what exists

### references/project-01-riverside/wireframes/
| File | Size | Real content? |
|------|------|---------------|
| wireframe-home.png | 109 KB | Real wireframe |
| wireframe-find-doctors.png | 118 KB | Real wireframe |
| wireframe-booking-flow.png | 342 KB | Real wireframe |
| ia-map.png | 234 KB | Real IA diagram |
| flow-map.png | 328 KB | Real flow diagram |

All 5 wireframe/IA/flow images are real and usable.

### references/project-01-riverside/production-screenshots/
**EMPTY — no files.** This folder has no production screenshots.

### references/project-01-riverside/ui-screens/
| File | Size |
|------|------|
| hi-home.png | 188 KB |
| hi-find-doctors.png | 137 KB |
| hi-doctor-profile.png | 125 KB |
| hi-book-appointment.png | 123 KB |
| hi-confirmation.png | 118 KB |
| hi-manage.png | 104 KB |

All 6 desktop UI screens exist. These are the real built prototype screenshots.

### references/project-01-riverside/mobile-screens/
6 mobile screens exist (55–83 KB each). All real.

### references/project-01-riverside/Design System/
9 design system images (58–112 KB each). All real.

---

## 3. Public images — current serving paths

All assets are mirrored in `public/images/projects/riverside/`:
- `home.png` (188 KB) — homepage featured image, copy of hi-home.png
- `design-system/` — 9 images
- `mobile/` — 6 images
- `ui-screens/` — 6 images
- `wireframes/` — 5 images (all real content)

**Path correctness:**
- Data files point to `/images/projects/riverside/...` ✓
- Files exist at `public/images/projects/riverside/...` ✓
- Vite serves `public/` at the root ✓

---

## 4. Components that render screenshots

| Component | File | What it renders |
|-----------|------|----------------|
| FeaturedWork | src/components/home/FeaturedWork.tsx | Homepage featured card with browser frame + project image |
| ScreenshotGallery | src/components/case-study/ScreenshotGallery.tsx | Desktop/mobile screenshot grids |
| CaseStudyPage sections | src/pages/CaseStudyPage.tsx | Wireframe grid, IA image, flow image, design system grid |

---

## 5. Root cause of "internal scrollbar" problem

**Finding:** The CSS does NOT use `overflow: auto` anywhere. There are no iframes. The `overflow: hidden` is set correctly on all containers.

**Actual cause:** The `.screenshot-item__img` uses `height: 100%` inside a parent with `aspect-ratio: 16/10`. In some browser rendering contexts, `height: 100%` on an image inside an `aspect-ratio` container is not reliably constrained — the image can render at its natural pixel height and overflow the container, which then shows a scrollbar at the container level.

**Fix:** Change `.screenshot-item__img` to use `position: absolute; inset: 0` inside a `position: relative` container. This is the proven approach used already for `.project-card__img`.

---

## 6. Wireframes showing as empty/placeholder

**Finding:** All 5 wireframe images exist and are real (109–342 KB). The paths in `caseStudies.ts` match the files in `public/images/projects/riverside/wireframes/`.

**Actual cause:** The `.wireframe-item__img` uses `object-fit: cover; object-position: top center` inside a `4/3` aspect-ratio frame. Wireframe diagrams (white backgrounds, flow arrows, boxes) cropped to top-center look almost blank — the most visually distinct content (the flow lines, arrows, labels) is distributed across the full diagram, not concentrated at the top. Cover+crop hides most of the diagram content.

**Fix:** Change to `object-fit: contain` so the full wireframe diagram is visible within the frame. The background fill color will show around the edges if the aspect ratio doesn't match, which is acceptable for diagram images.

---

## 7. Homepage featured image

**Current:** `projects.ts` points to `/images/projects/riverside/home.png` (188 KB, real screenshot of the built hospital app homepage).

**Frame:** `FeaturedWork.tsx` renders a browser-frame card with three colored dots, URL bar, and the image below.

**Issue:** The `project-card__image-wrap` uses `min-height: 420px` (featured variant). The image is `position: absolute; top: 36px; left: 0; right: 0; bottom: 0; height: calc(100% - 36px)`. This should display correctly, but the card needs a consistent height to crop the image cleanly.

**Status:** Correct image, correct component structure. May need height/crop adjustment.

---

## 8. Files that need changes

| File | Change needed |
|------|--------------|
| src/styles/global.css | Fix `.screenshot-item__img` to use position:absolute inset:0 |
| src/styles/global.css | Fix `.wireframe-item__img` to use object-fit:contain |
| src/styles/global.css | Fix `.wireframe-item__frame` background for contain mode |
| src/styles/global.css | Fix project-card featured card height for better image crop |
| src/pages/CaseStudyPage.tsx | Verify all section IDs and rendering |
| src/data/caseStudies.ts | Verify all image paths |

---

## 9. Reference vs implementation comparison table

| Reference element | Current use | Correct use | Action |
|-------------------|-------------|-------------|--------|
| Homepage browser-frame mockup | Browser-frame card in FeaturedWork.tsx | ✓ Already implemented | Review CSS crop |
| Screenshot gallery (no scrollbar) | aspect-ratio + overflow:hidden + height:100% | Use position:absolute inset:0 | Fix CSS |
| Wireframe section (real diagrams) | object-fit:cover crops most of diagram | Use object-fit:contain | Fix CSS |
| Mobile screenshot frames | Same issue as desktop gallery | Fix with absolute positioning | Fix CSS |
| Production screenshots | Empty folder — no assets | Skip section, use ui-screens for "Final UI" | No change needed |
| Design system images | object-fit:contain already applied | ✓ Correct | No change |
| AI workflow dark section | Implemented in AiWorkflowSection.tsx | ✓ Matches reference structure | No change |
| Case study nav 24 sections | CaseStudyNav.tsx with 22 items | ✓ Close enough | Minor label check |
