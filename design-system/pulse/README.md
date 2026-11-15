# Pulse design system

> **This is the public copy.** It is the real system, with the same components, structure and behaviour, and three deliberate differences,
> each logged in `docs/figma-deviations.md`: the palette is re-mapped to pass colour contrast (`scripts/recolour/`, `docs/accessible-palette.md`),
> the company's logos and product names are removed, and sample people are roles. The Figma file and the extracted specs are not included,
> so the extraction scripts in `scripts/figma/` are kept for reference but cannot run here.

React 19 + MUI 9 + TypeScript components built from the **pulse-2.0 Figma file** (`pulse 2.0.fig`, kept in the repo).
Every size, spacing, radius, colour, shadow and text style is read from the Figma export, not from screenshots.

```
npm install
npm run dev          # gallery at http://localhost:5173  (one component at a time; /#/Chip, /?c=Chip)
npm run build        # type-check + production build
npm run lint
```

## Layout

```
src/
  components/<category>/<Name>/   <Name>.tsx  +  <Name>.demo.tsx (shown in the gallery)
      actions  form  data-display  navigation  feedback  containers  documents  patterns  foundations
      _shared/                    helpers used by several components (FormField, fieldStyles, overlay, families)
      index.ts                    GENERATED barrel (npm run components:index)
  icons/                          398 icons (Hugeicons + custom Pulse icons), createPulseIcon
  symbols/                        runtime for generated P&ID / arrow / shape / flag sets (lazy, see foundations/)
  templates/                      page panels from the Pulse app (NOT Figma: see header comment)
  theme/                          MUI theme (light only), pulseTokens (designkit), button tokens, MUI overrides
  showcase/                       the gallery app
figma-tokens/
  pulse/components/*.json         every Figma component set, every variant (npm run figma:extract)
  pulse/variables.json            Figma variables (npm run figma:variables)
  pulse-designkit.json            snapshot of @pulse/designkit tokens
  pulse-button.json               resolved Button set (used by theme/buttonTokens)
scripts/
  figma/      fig-load, fig-decode, pulse-extract, pulse-variables, pulse-spec (read the .fig)
  generate/   pulse-icons, pulse-icons-figma, pulse-loaders, pulse-symbols, pull-designkit
  dev/        gen-index (barrel), shot-component (screenshot a demo), sweep-demos (error sweep)
docs/         component-conventions, pulse-component-inventory, pulse-usage-guide, pulse-foundations
```

## Everyday commands

| Task | Command |
|---|---|
| Read a Figma spec | `npm run figma:spec -- <page> <set> tree "Size=Small,Interaction=Hover"` (also `props`, `diff`, `notes`) |
| Regenerate the barrel after adding a component | `npm run components:index` |
| Screenshot one demo (dev server running) | `npm run demos:shot -- Chip out.png` |
| Load every demo and report runtime errors | `npm run demos:sweep` |
| Rebuild generated sets from the .fig | `npm run symbols:build`, `loaders:build`, `icons:build` |

## Notes

- **Light theme only.** The Figma file defines no dark appearance for Pulse.
- `main.tsx` imports the theme directly (not the library barrel): the gallery loads only the demo you open, and a broken component cannot blank the page.
- `React.StrictMode` is off because `@mui/x-tree-view` 9.17 throws in dev under React 19.3.1.
- What is built, partial, inferred or missing: `docs/pulse-component-inventory.md`.
