# UX/UI audit of the 9 case studies (2026-11-22)

Scope: /projects/riverside-general, renewly, caresync, afs-enterprise-workflow, zoominfo-schedule, illustration-systems, pulse-design-system, electronic-execution, ai-assisted-product-workflow.
Method: automated scan (axe-core 4, WCAG 2 A/AA, 2.1/2.2 AA and best practice) plus DOM measurements at 1440x900 and 390x844 on the dev server, then three reviewers looking at screenshots, Tab-through focus, source and content. Dev-mode load times were NOT used as findings.
Status labels: [measured] = script output; [seen] = reviewer looked at screenshots or source; [checked] = confirmed again by the lead.
Not covered: dark mode on the older pages; screen readers; real devices; production performance.

## Measured, all pages
- No horizontal overflow at 390 on any page. One h1 per page, no heading-level skips, lang set, landmarks present, skip link first in Tab order. No images missing alt, none broken.
- axe: 0 violations on most pages. 'scrollable-region-focusable' (serious) at 390 on Renewly (type-scale specimen), CareSync (same class), AI workflow (6 code and file-tree blocks). 'color-contrast' (serious) once on Schedule at 390: 2.51:1 on disabled text inside a mini tile.
- Text under 12px (real nodes): AFS 183, Schedule 227, PULSE 121, CareSync 90, AI workflow 77, Renewly 74, Execution 63, Riverside 42, Illustration 14. Many on AFS and Schedule are inside HTML re-creations of the product UI (6 to 9px), which is aria-hidden for wireframes but NOT for the "design-system tiles".
- Targets under 44px at 1440: PULSE 48, Renewly 30, AI workflow 26, Execution 15, AFS and Schedule 24, Riverside and CareSync 23. At 390 PULSE has 37.
- Images are 2 to 6 times larger than displayed on Riverside, Renewly, CareSync and Illustration (no srcset).

## P0: fix before the interview
1. [checked] A deployed file shows three named colleagues. public/images/projects/afs/screens/afs-file-details.png shows names, job titles and "Dev team" for the AFS project. The page does not use it, but it is served at its URL. Delete it and its entry in src/data/imageSizes.ts. Check afs-cover.png and afs-canvas-overview.png too.
2. [checked] PULSE axe before/after numbers are not on the page. src/data/pulse-audit.json holds them (429 to 108 contrast nodes; 44 to 8 demos; 106 of the remaining 108 explained) but nothing imports it. Add a four-number block with the explanation. This is the strongest WCAG evidence you have for this role.
3. [seen] PULSE hero frames "AI can use it", not "one system across many products". Add one line naming what it unifies, and one outcome line you can back up. Counts (92, 99, 5,814) are outputs, not outcomes.
4. [seen] Electronic Execution does not say who authored the original prototype or what you designed versus ported. Add one line. Group the limits (not validated, not tested with real users, tables not keyboard-selectable) in one visible block.
5. [seen] AFS and Schedule: no role or outcome in the hero (role is two screens down); status reads "Shipped" from a generic map while the body says "Ready for Dev". Add "My part" plus one line; fix the status. Tag each decision "designed" or "observed from the screens", because the pages are reconstructed.
6. [seen] AFS/Schedule claims without a source: "Reduce no-shows up to 60%", "answer to Calendly", token palette values (page elsewhere says values were not extracted).
7. [seen] Illustration page shows 47 colleagues' likenesses with first names. Confirm consent for portfolio use, or remove the names. It is a gallery, not a case study: move it to About or keep only the system story.
8. [seen, NOT verified by the lead] Riverside hero/desktop mock may contain a banned placeholder name and invented stats ("Trusted by 24,000+ patients"). Open the image and check.
9. [seen] Renewly: green check marks on 12 untested questions, while Limitations says no usability testing. Use empty checkboxes and say "found in design review". CareSync "Validated at 390px" while four screens clip; say so.

## P1: soon
- Dead controls: AFS/Schedule mini tiles contain real Save/Cancel buttons (tab stops 24 and 25, 54x23 and 110x21px at 390); Renewly specimen buttons are live and do nothing. Make them inert/aria-hidden, or non-interactive spans.
- Scrollable code, file-tree and type-scale regions: add tabindex="0", role="region" and an aria-label (WCAG 2.1.1).
- 390: the Sections pill, Ask button and bottom nav overlap body text and CTAs (WCAG 2.4.11, Fitts). Add bottom padding and hide the pill when the nav is open.
- Screens are unzoomable. Real Figma screens render at about 0.25 scale at 390 (UI text about 3px); Riverside screens are cropped to 16:9 and miss the part the caption describes. Add click-to-zoom with the full image and crop to the decision.
- Length: 21 to 23 template sections, 25k to 45k px. Fold to about 12 story-led sections; move checklists (IA, design system, handoff, patterns) to a collapsed "Details" block. CareSync: put the reframe (Now/Next/Later, red reserved for safety) directly under the hero.
- Text floor: raise 10 to 11.5px real content (min read, datasheet labels, nav numbers, hex values, "Issue/Design response") to 12px or more. 68 PULSE paragraphs run over 75 characters per line at 1440.
- Confidentiality is stated about six times on AFS; state it once, and fix it in the artwork (workspace name, logo, first names).
- Alt text is just the label ("Home", "Team portrait N"). Write what the image shows; use long descriptions for diagrams.
- Reconstructed case studies: reframe "reconstructed from final screens" as a design audit with rationale, alternatives, risks and metrics you would instrument.
- AI workflow page: a different template, a different role label ("UX/UI Designer + Product Builder"), and process rather than outcomes. Do not lead with it; pull one paragraph as your AI-driven UX evidence.

## P2: polish
- Sticky nav pill covers the first line of content on desktop; scroll-spy lags in tall sections.
- Illustration images: add 320px variants, a lightbox, fix the orphan row; label fan art; 5-item in-page nav on a 1-minute page is excessive.
- Duplicated "why it matters" and "most consequential IA decision" lines; boilerplate openers; many em dashes; mixed British/American spelling.
- Accessibility sections are lists of "Recommended"/"should" items; retitle as notes for build and cite success criteria.
- PULSE: "PageBodyContentPanel" breaks mid-word; hover-only anatomy diagram excludes touch/keyboard; a fake ControlsPlayground duplicates Storybook (link to Button/Playground instead).

## Strongest material, for the interview
- Electronic Execution: the clearest story on the site (six moments, six decisions, a "why" for each rule, "the assistant never signs"). Axe clean.
- PULSE: candid limits and real governance thinking; best once the hero and axe block are fixed.
- CareSync: strongest design reasoning (reframing "dashboard" as "what must happen before the next patient").
- Schedule: its handoff section lists real open questions, a senior signal.
- AFS: the async-feedback reasoning (24h toast, imported-count reassurance, email, results loop).

## Suggested order
1. Delete the leaking image. 2. PULSE axe block, hero outcome and framing. 3. Execution authorship and limits. 4. Hero role/outcome and honest status on AFS and Schedule. 5. Inert dead buttons and focusable scrollers (small code changes). 6. 390 overlays. 7. Zoom for screens. 8. Length and template rework.
