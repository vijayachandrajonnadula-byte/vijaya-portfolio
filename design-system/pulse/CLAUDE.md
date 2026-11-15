# CLAUDE.md: Pulse design system

React 19 + MUI 9 + TypeScript components built from the **pulse-2.0 Figma file** (`pulse 2.0.fig` in the repo root).
The goal is a **100% match with the Figma design system**. Read this file before changing anything.

## Non-negotiable rules

1. **Figma is the source of truth. Never invent values.** Every size, padding, gap, radius, colour, weight, shadow and state comes from the extracted Figma spec, not from memory, screenshots, taste, or "what looks right". If Figma is silent or contradictory, **ask the user or record a deviation**; do not guess silently.
2. **Never claim something is verified unless you measured or looked at it.** Say "checked in the browser", "read from the spec", or "not checked". A type-check passing says nothing about visual fidelity.
3. **Pages and templates use only design-system components.** `src/pages/**` and `src/templates/**` must not import `@mui/*` (the lint rule in `.oxlintrc.json` enforces this: `npm run lint`). Use components from `src/components/<category>/<Name>`, or layout primitives and style types from `src/components/mui` (`Box`, `Stack`, `Grid`, `SxProps`, `Theme`). If a page needs something the design system lacks, **build it as a component first** (from the Figma spec if it exists; if Figma has no spec, label it `NOT FROM FIGMA` in a header comment and list it in `docs/figma-deviations.md`).
4. **When the user gives feedback, fix the component, not the page.** A page that looks wrong means a component is wrong. Fix it in `src/components`, so every use is fixed. Never patch with page-level `sx` or hard-coded colours.
5. **Record every deviation from Figma** (user-directed, inferred, or forced by missing data) in `docs/figma-deviations.md` with the reason and the Figma value. Do not leave a silent difference.
6. **Do not reuse the Figma token or paste secrets** into any file. The Figma REST API is rate-limited for this account (4+ day lockout): do not use it. Everything is read from the local `.fig`.

## How to implement or change a component (the process)

1. Read the spec: `npm run figma:spec -- <page> <set> tree "Prop=Value,..."` and `... diff <Prop> "Prop=Value"` (also `props`, `notes`). Page names: `npm run figma:spec -- list`.
2. Read **every state** (Default, Hover, Focus, Active/Selected, Disabled) and every size. Different states have different colours and weights.
3. Check pitfalls below, then check what the Pulse app / live screenshots show.
4. Implement in `src/components/<category>/<Name>/<Name>.tsx` with a demo `<Name>.demo.tsx` showing every variant and state (gallery picks up `src/components/*/*/*.demo.tsx`).
5. Verify in a real browser: `npm run demos:shot -- <DemoName> out.png` (prints sizes of `data-spec` elements), look at the PNG, and check hover/focus (CDP mouse moves; see `scripts/dev/`). Run `npx tsc -b`, `npm run lint`, `npm run demos:sweep`.
6. `npm run components:index` regenerates `src/components/index.ts`.

## Pitfalls that have caused wrong output before (read these)

- **Extraction blind spots.** `figma-tokens/pulse/components/*.json` does not capture instance font/style overrides, only fills and text. Use `node --max-old-space-size=8192 scripts/dev/inspect-overrides.mjs "<symbol part>" "<instance part>"` to see raw overrides.
- **`ovrFill=` on an instance is an override of that instance, and Default/Hover pairs can look swapped.** Tab labels: Default reads `#090909`, Hover `#8f969d` in the extraction, but the design and the live app have the **unselected tab muted grey and darker on hover**. When an extracted value looks backwards, compare against the Pulse app screenshot and ask.
- **Stale design-kit tokens.** `pulse-designkit.json` (from `@pulse/designkit`) is older than the .fig: some form border colours differ (e.g. warning = blue in the kit). Prefer `.fig` values; shared field styles live in `src/components/_shared/fieldStyles.tsx`.
- **Fonts.** Some master frames say Figtree at 14px; instances resolve to Inter 12px. **Inter is the font** (Typography page). Do not copy master text styles (size/weight) blindly: check the instance and the live app.
- **Font weights are defined in ONE place: `src/theme/typography.ts`** (`fw.*` raw scale, `role.*` per kind of text with its Figma source). Never write a numeric `fontWeight` anywhere else: `npm run check:weights` (part of `npm run lint`) fails on it. To change how a kind of text looks, change its role there and log it in `docs/figma-deviations.md`. Roles: title SemiBold 18/28 · subtitle/body/grid cell Regular · grid header Regular (Figma; live app heavier: open) · link SemiBold (no underline) / hover Regular + underline · chip SemiBold · tab Medium, selected SemiBold (user-directed) · breadcrumb Medium 12/20 · button SemiBold · filter label Medium, count Bold · nav Medium.
- **MUI X DataGrid quirks.** The `filler` element is used both in the header row and as the empty area under rows: never paint it with the header colour outside the header. Sort/menu icon buttons get a white base background from MUI: reset it.
- **Gallery loading.** `src/main.tsx` imports only the theme (`./theme/theme`), never `./index`, so one broken component cannot blank the app. Keep it that way. `React.StrictMode` is off (MUI X tree throws under React 19.3.1). After large file moves, restart `npm run dev` (stale module cache). Dev server is IPv4+IPv6 (`vite.config.ts` `server.host: true`), port 5173.
- **Windows/PowerShell.** `npm run` scripts, no `&&`. Use `-LiteralPath` for deletes; complex quoting in `node -e` breaks, use a script file.
- **Light theme only.** Pulse defines no dark mode; do not add one.

## Layout

```
src/components/<category>/<Name>/   actions form data-display navigation feedback containers documents patterns foundations
src/components/_shared/             shared helpers (FormField, fieldStyles, overlay, families)
src/components/index.ts             GENERATED (npm run components:index)
src/icons/                          398 icons (393 from the published pulse-icons package, 5 from Figma vectors)
src/templates/                      page panels from the Pulse app + AppShell (NOT from Figma: header comments say so)
src/pages/<Name>/<Name>.page.tsx    full pages, opened full-screen at /#/<Name>
src/theme/                          MUI theme (light), pulseTokens (designkit), buttonTokens (Button set), componentStyles
figma-tokens/pulse/                 extracted specs (components/*.json) and variables.json
scripts/figma/ generate/ dev/       .fig reading, generators (icons, symbols, loaders, logos), dev tools
docs/                               conventions, inventory, usage guide, foundations, figma-deviations
```

## Commands

`npm run dev` (gallery, port 5173) · `npm run build` · `npm run lint` · `npm run figma:spec -- ...` · `npm run components:index` · `npm run demos:shot -- <Demo> out.png` · `npm run demos:sweep` · `npm run symbols:build` / `loaders:build` / `icons:build` · `npm run figma:extract` (re-extract specs from the .fig)


## The AI-readable layer (use it to choose components)

Given an image, a text request or a Figma frame, follow .claude/skills/build-from-design/SKILL.md. In short: split the input into regions, match each region's cues in i/intents.json, read the contract in i/components.json (props, demo), resolve Figma instance names with i/figma-map.json or run 
pm run figma:frame -- <node-id>, and compose with AppShell + templates (recipes in i/patterns.md). Full description: i/README.md. After adding or changing a component run `npm run components:index && npm run ai:build` (the second fails if i/intents.json references a component that no longer exists). Storybook mirrors the gallery: `npm run stories:build` then `npm run storybook`.

## Current open questions (ask before assuming)

- Page-body surface: the layer around the table now uses Figma `templates/color/surfaceBGCanvas` (neutral 50, `#F8FAFC`) with 16px padding on all sides. The user did not name which `surfaceBG*` variant (white, canvas, brand, gray, complementary exist in `surfaceBg` in `pulseTokens.ts`): confirm if it looks wrong.
- "Use status filters instead of chips for status": which Figma component? (Today the Status column uses `Status type="chip"`.)
- Grid header weight: Figma says Regular; the live app shows SemiBold.
- Avatars in the page are initials (no photo data).

## Working with the user

- They compare against the Figma design system and against screenshots of the live Pulse app. Treat their "this looks wrong" as correct and find the Figma evidence; if the evidence disagrees, say so and ask.
- Report what was checked and what was not. List anything inferred.
- Keep `docs/figma-deviations.md` and `docs/pulse-component-inventory.md` current when behaviour changes.
