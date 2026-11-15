# Building Pulse components from the .fig

## Where the truth is

| What | Where |
|---|---|
| Component specs (every variant, exact px, colours, text styles, layout) | `figma-tokens/pulse/components/*.json`, read with `node scripts/figma/pulse-spec.mjs` (see its header) |
| Figma variables (names, modes, values) | `figma-tokens/pulse/variables.json` |
| Palette, radius, shadow, spacing, per-component tokens (same palette as Figma) | `src/theme/pulseTokens.ts` -> `pt` |
| Button measurements | `figma-tokens/pulse-button.json` via `src/theme/buttonTokens.ts` |
| Prop names the Pulse app actually used | `grep -rn "<Name" pulse/src` (the app imports the real Pulse components, so its call sites show the intended API) |
| Original .fig (do not edit, do not read the whole thing) | `pulse 2.0.fig`, decoded by `scripts/figma/fig-load.mjs` |

Spec CLI cheatsheet:

```
node scripts/figma/pulse-spec.mjs list
node scripts/figma/pulse-spec.mjs <page> props
node scripts/figma/pulse-spec.mjs <page> <set> tree "Size=Small,State=Default"
node scripts/figma/pulse-spec.mjs <page> <set> diff <Prop> "Size=Small"      # how each value of <Prop> changes the layout
node scripts/figma/pulse-spec.mjs <page> notes                                 # usage text written on the Figma page
```

In a tree line: `WxH`, `row|col gapN pad[top,right,bottom,left] mainAlign/crossAlign`, `r=` radius, `fill`/`stroke` (CSS colour, `[Variable/Name]` when bound to a Figma variable), `fx` shadows, text as `"chars" Font Style size/lineHeight`, `<Set / Variant>` for nested component instances (look those up on their own page).

## Rules

1. **Fidelity.** Reproduce sizes, paddings, gaps, radii, colours, shadows and text styles from the spec. Never invent values. If something is ambiguous or missing, pick the closest spec value and note it in the final report.
2. **Tokens.** Use `pt` / `focusRing` / `disabledOpacity` / `textStyle()` from `src/theme/pulseTokens.ts` when a Figma value equals a token. A literal value is fine when no token matches.
3. **States.** Map Figma `Interaction`/`State` variants to CSS: Hover -> `:hover`, Focus -> `:focus-visible` / `.Mui-focusVisible` (focus ring = `focusRing`), Disabled -> disabled attribute + opacity from the spec, Active/Selected -> state props. Check each state in the spec, they differ per component.
4. **Build on MUI 9** (`@mui/material`, plus `@mui/x-*` already installed) rather than re-implementing behaviour. Style with `sx`/`styled` inside the component. Accessibility: real roles, labels, keyboard support.
5. **API.** Use the Pulse prop names from the app's call sites where they exist; otherwise idiomatic names with `variant`/`size`/`color` mirroring the Figma variant properties (lower camel-case values, e.g. `size="xsmall"`). Export `XxxProps` types. Strict TS: `noUncheckedIndexedAccess`, `verbatimModuleSyntax` (use `import type`), `erasableSyntaxOnly`, no unused locals.
6. **Files.** Components live at `src/components/<category>/<Name>/<Name>.tsx` (+ extra files) with a demo `<Name>.demo.tsx` next to it (default-exported component showing every variant/size/state the Figma has; see `actions/Button/Button.demo.tsx`; the gallery finds demos by the glob `src/components/*/*/*.demo.tsx`, so depth matters). Categories: `actions`, `form`, `data-display`, `navigation`, `feedback`, `containers`, `documents`, `patterns`, `foundations`. Start each component file with a short comment naming the Figma page/set it implements.
7. **Shared files are off limits** to build agents: `src/components/index.ts` (generated: `node scripts/dev/gen-index.mjs`, which you MAY run), `src/index.ts`, `src/showcase/*`, `src/theme/*`, `package.json`, `vite.config.ts`. Do not move or rename existing folders. If the theme needs something, style inside your component. Keep existing export names working unless the task says to remove them.
8. **No invented API.** Only variants, sizes, colours and states that exist in the Figma sets. If a prop is not a Figma variant property, a Pulse-app prop (grep `pulse/src`), or required for accessibility/behaviour, do not add it. If you find already-built code with invented variants (not in Figma), remove them.
9. **Verify** each component: `npx tsc -b` (ignore errors in files you do not own, other agents are editing at the same time), then screenshot with `node scripts/dev/shot-component.mjs <Name> <out.png> 1100 <yourDebugPort>`; tag key elements with `data-spec="..."` and compare the printed sizes to the spec. Look at the PNG.
