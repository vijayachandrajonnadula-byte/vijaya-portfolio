# AGENTS.md

## Project

This repo is the personal UX/UI portfolio website for Vijaya Chandra Jonnadula.

Short name: Vijay  
Location: Hyderabad, India  
Email: vijayachandrajonnadula@gmail.com

The portfolio presents UX/UI product case studies, working prototypes, design systems, AI-assisted workflows, testing/iteration, and implementation-ready product thinking.

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- React Router
- Vercel deployment

## Important Personal Branding

Use:
- Vijaya Chandra Jonnadula
- Vijay
- VJ initials logo
- vijayachandrajonnadula@gmail.com
- Hyderabad, India

Do not use placeholder names:
- Maya
- Bhargav
- Kay Taylor
- Eli
- John Doe

## Portfolio Positioning

Vijay designs practical digital products that turn messy user journeys into clear, testable experiences.

The portfolio must show:
- product thinking
- UX strategy
- user journeys
- information architecture
- UI craft
- design systems
- AI-assisted workflow
- working prototypes
- GitHub/PR workflow
- testing and iteration
- responsive QA
- deployment/sharing process

## AI-Assisted Workflow Positioning

Do not present AI as replacing design judgement.

Correct framing:
AI tools accelerate research framing, visual exploration, implementation, and review, but Vijay remains responsible for product decisions, UX critique, testing, responsive quality, and final acceptance.

Tools to mention where relevant:
- ChatGPT
- Claude
- Perplexity
- Miro
- FigJam
- Figma
- Figma AI
- Claude Design
- Roo Code
- Cline
- Codex
- React
- TypeScript
- GitHub PRs
- Storybook
- Maze
- Preview environments

## Repository Layout

- docs/ contains strategy, design system, case study templates, workflow notes, and deployment checklists.
- references/ contains Claude designs, screenshots, wireframes, UI screens, production screenshots, and project notes.
- public/images/ contains final optimized images used by the portfolio website.
- src/data/ contains structured profile/project/case-study content.
- src/components/ contains reusable UI sections.
- src/pages/ contains route-level pages.
- src/styles/ contains tokens and global CSS.
- design-system/pulse/ is the PULSE design system itself (its own app and dependencies). Its hosted gallery is in public/pulse-gallery/. See "PULSE design system" below.

## Design Direction

Style:
- modern product-builder portfolio
- clean but not boring
- premium bento sections
- strong typography
- large screenshots
- one strong dark workflow section
- recruiter-friendly
- easy to scan
- easy to build

Avoid:
- CMS complexity
- looping animation that keeps running off-screen
- scroll-jacking parallax
- masonry layouts
- hard-to-code custom effects
- random irrelevant dashboards
- tool-first portfolio messaging

## Look and Motion (site layer)

Reference: han1.ai (a conversational home, a mascot as guide, a bento board of tiles). Follow its structure and interaction ideas with our own content, art and words. Never copy his text, images or mascot.

- Themes: light (warm paper #FAF9F7) and dark (#121214), chosen by system setting, switchable in the nav, saved in localStorage as `vj-theme`. English only. Tokens are the `--c-*` variables in `src/styles/site.css`. Case-study pages are light only (`html[data-page='case']` pins light tokens and keeps the older dark opening); the theme switch is hidden there. The PULSE and Electronic execution case studies follow the theme (`PageMode` in `src/App.tsx`).
- Colour: clay (#E2705A) for the mascot and small accents, deep blue (#1E3A6E, light-blue in dark) for actions. Type: Instrument Sans, Newsreader for big editorial lines.
- Clay is an original SVG mascot (`src/components/studio/Character.tsx`) with poses (rest, wave, point, hold, think) and props. It blinks, breathes and follows the pointer only while on screen and when reduced motion is off.
- Home: greeting + ask box (`HomeHero`, `AskBox`), bento work groups (`WorkBento`, `Objects`), more projects list, About board, contact composer. The guide bubble (`Guide`) is on every page except `/ask`.
- The ask box is retrieval, not generation. Answers live in `src/data/knowledge.ts`, are written from facts already on the site, and the ask page says so. To teach it something, add an entry. Do not make answers up and do not label retrieval as AI.
- Q&A (`src/data/knowledge.ts`, 70 entries in groups: journey, work, how I work, career, skills, hiring, fun, stories, tall tales). Every entry has a `kind`: `true` (resume/site facts), `parable`, `tall-tale` or `analogy`; non-true kinds are labelled on the card and in the accessible name, and factual questions must never return one (tested). Chips and list items carry exact entry ids (`/ask?id=<id>`, deep link `/ask#q=<id>`); typed text goes through a scored `search()` with a minimum score (it folds plurals and synonyms and fixes typos of 5+ letters). `src/data/siteIndex.ts` is the second index (case studies and pages): it feeds the live suggestions under the ask field (a combobox, `src/components/ask/Suggest.tsx`) and the "Closest on this site" block of the no-match page, which also offers an email-this-question link (opens the visitor's mail app, sends nothing) and the six topics. Entries for pay, notice period, remote/relocation and visa are plain "ask me directly" answers with no invented facts. The paraphrase test is `scratchpad\verify-K\search-test.mjs` style: bundle knowledge.ts with esbuild and assert ids. Facts come from `public/Vijaya_Chandra_Jonnadula.pdf` (ECE at RGUKT-IIIT Nuzvid 2017 to 2021, CalArts UI/UX Specialisation Oct 2020 to Feb 2021, Google Professional UX Design Certificate Mar to Sep 2021). No phone number anywhere. "From signals to screens" (`src/components/story/SignalsToScreens.tsx`, `src/data/journey.ts`) is the true timeline on three tracks; its fiction layer is off by default and tagged.
- Declutter rules (friend feedback: "feels very cluttered"): one primary action per view (Hick), at most 5 things in the hero (Miller): Clay, headline, one subline, the ask box, "See the work"; no chips, résumé link, strips or asides in the hero. /ask uses progressive disclosure: 4 "Start here" questions + 6 topic cards (`src/data/topics.ts`), a topic opens at most 6 questions, one answer per view with Previous/Next/Back; never list all 70 at once. About is a story plus 4 rows plus a collapsed "More about how I work". Work cards show image, year · category, title, one sentence, CTA.
- Accessibility: body 18px/1.6, 68ch measure, 44px targets, 3px focus ring, mute text >= 7:1. There is NO "Calm" toggle (it had no visible effect, which breaks visibility of system status): motion follows the OS reduced-motion setting only, through `src/lib/calm.ts` (`useCalm()`/`isCalm()`); new motion code must use it. Hero = name line, headline ("I make complicated software feel obvious."), one subline, ONE primary "See the work" button and a quiet "Ask me anything" link to /ask (no in-hero input), beside a stage of three looping project clips in windows (`HomeHero.tsx`, `.hstage` in `bands.css`; Clay is not in the hero any more; pointer parallax on fine pointers only). Page order: hero, work, two readings, about, contact. Case-study pages still have many sub-44px targets and sub-12px text (pending).
- No backend and no contact form: the contact section lists email, LinkedIn, GitHub and the resume, plus a copy-email button. Do not add forms that collect input.
- No Three.js or WebGL on the site. Requirements for any motion: pause or skip continuous animation off-screen and under `prefers-reduced-motion`; pointer effects only on fine pointers; no scroll-jacking.
- FieldFlow is hidden: its entry, routes and links are removed, the code stays in `src/fieldflow/`.
- Story layer on the clean look (`src/components/story/`, `src/styles/story.css`): "The Trace" is one scroll-linked SVG circuit trace in the left gutter (desktop >= 1200px) with a node per chapter (01 power on, 02 signal, 03 prototypes, 04 datasheet, 05 pinout) that completes into a footer LED; the Signal interlude is a noise slider that cleans a waveform. No scroll-jacking; reduced motion draws it static.
- Electronics-background layer (`src/components/electro/`, `src/styles/electro.css`, `src/data/quirks.ts`): the theme toggle is a power switch, Clay has LED eyes, About is a "datasheet" (real facts: ECE at IIIT Nuzvid, 2017 to 2021, stated in About only, not in the hero), the 404 is an "open circuit". Humour is about electronics and UX puns, never invented biography. Class names are `el-` prefixed to avoid collisions with the legacy global.css (`.about` paints a light surface; site.css overrides it).
- The header nav is Work, About, Contact only (the design-system link was removed; the PULSE case study is reached from the Work section).
- A copy of the short-lived "electronics / circuit lab / game" redesign (signal-orange accent, Design Circuit Lab hero, XP pause menu, Playground) is kept outside the repo at `C:\Users\Admin\Documents\vijaya-portfolio-electronics-backup`. It is not part of the site.

## PULSE design system (design-system/pulse/)

The real PULSE design system, with the original components, structure and behaviour intact. It differs from the production copy in three ways, all logged in `design-system/pulse/docs/figma-deviations.md`: it keeps the original palette with a few same-tone text adjustments for contrast, company logos and product names are removed, and sample people are roles.

It is a self-contained app (React 19, MUI 9, Vite 8), separate from the portfolio (React 18). Do not import from it into `src/`.

- Run it: `cd design-system/pulse && npm ci && npm run dev` (gallery on 5173).
- The hosted gallery is a static build in `public/pulse-gallery/`: `cd design-system/pulse && node node_modules/vite/bin/vite.js build --base /pulse-gallery/ --outDir ../../public/pulse-gallery --emptyOutDir`. It is excluded from the PWA precache and navigation fallback in `vite.config.ts`. Rebuild it after any change to the system.
- The hosted Storybook is a static build in `public/pulse-storybook/`: `cd design-system/pulse && node node_modules/storybook/dist/bin/dispatcher.js build -o ../../public/pulse-storybook`. Also excluded from the PWA precache and navigation fallback. Rebuild it with the gallery.
- Case study: `src/pages/PulseCaseStudyPage.tsx` (blocks in `src/components/pulse/PulseKit.tsx`), content in `src/data/pulseCaseStudy.ts`. Counts come from `src/data/pulse-metrics.json` (`node scripts/dev/public-metrics.mjs` in the system folder) and `src/data/pulse-audit.json` (the axe-core scan).

### Electronic execution (second case study on PULSE)

A working app that runs a validation protocol on screen, built only from PULSE components: `design-system/pulse/src/pages/ElectronicExecution/` (state and rules in `model.ts`/`store.ts`, UI state in `ui.ts`, dialogs in `dialogs/`, side panels in `actions/`). It is hosted with the gallery at `/pulse-gallery/index.html#/ElectronicExecution`. Case study: `src/pages/ExecutionCaseStudyPage.tsx`, content in `src/data/executionCaseStudy.ts`, images in `public/images/projects/execution/`. Public copy is de-branded (no company or product names, roles not people, generic ids). It is a prototype: not validated, AI output scripted, password only checked for presence. Keep those limits honest. Rebuild the gallery after any change (command below).

Rules:
- **Keep the system as it is.** Fix components, never pages. Do not redesign it to look better; the brief is a faithful copy of the original, including its palette.
- Colours: the ORIGINAL palette is restored. The earlier re-map (scripts/recolour/) is retired; do not run it. Contrast fixes are small same-tone darkenings, each logged in the deviations file; light text on the dark nav rail stays light.
- Never add company logos, product names (Smart GxP and its module names), the favicon mark, or real-looking people. Use roles.
- Do not state a test as done unless it was run. The case study lists its limits; keep them honest.
- The source zip (`pulse-design-system-share.zip`) is gitignored and must stay out of the repo.
- Never edit files with PowerShell Get-Content/Set-Content (it corrupts UTF-8). Use the Edit tool or a Node script.

## Case Study Requirements

Each case study should include:
1. Hero
2. Project snapshot
3. What this case study demonstrates
4. Overview
5. Problem
6. Goal
7. Research insights
8. User journey
9. Information architecture
10. Key UX decisions
11. Design system
12. AI-assisted workflow
13. Technical implementation
14. Repository and PR workflow
15. Testing and usability review
16. Feedback and iteration log
17. Responsive QA
18. Final prototype screens
19. Accessibility
20. Technical stack
21. Limitations
22. Final validation
23. Reflection
24. CTA

## Codex Working Rules

Before coding:
- Read AGENTS.md.
- Read relevant docs.
- Inspect relevant reference screenshots.
- Make a short plan.
- Keep changes scoped.

When coding:
- Do not redesign unrelated sections.
- Do not invent personal details.
- Do not add backend/auth/CMS.
- Use reusable components.
- Keep content easy to edit in src/data.
- Keep layouts responsive.
- Use image placeholders if files are missing.
- Avoid broken imports for missing images.

Testing:
- Run npm run build.
- Check desktop and mobile responsiveness.
- Ensure no horizontal overflow at 390px.
- Ensure all links and routes work.

Done means:
- Build passes.
- No TypeScript errors.
- Home page works.
- Case study pages work.
- Mobile layout is usable.
- Content is easy to edit.
- Screenshots have fallbacks.