# The AI-readable layer

An AI picks components from three kinds of input. Each has a defined path through the same four artifacts.

| Artifact | What it is | Made by |
|---|---|---|
| `CLAUDE.md` | Rules, pitfalls, process. Read first. | by hand |
| `ai/intents.json` | UI intent + visual cues -> components (the decision layer). Validated against the code. | by hand, checked by `npm run ai:build` |
| `ai/components.json` | Every component: exports, props (types, docs, defaults), Figma page/sets, demo, story. | generated |
| `ai/figma-map.json` | Every Figma page and set -> the component that implements it. | generated |
| `ai/patterns.md` | Page recipes (list, wizard, detail, form, dashboard). | by hand |
| `figma-tokens/pulse/components/*.json` | Every Figma variant: sizes, spacing, colours, text styles. | generated from the `.fig` |
| `.claude/skills/build-from-design/SKILL.md` | The procedure for image / text / Figma frame. | by hand |

## Paths
- **Image**: split into regions -> match cues in `intents.json` -> read props in `components.json` -> compose with `AppShell` + templates.
- **Text**: nouns/verbs -> intents -> same.
- **Figma frame**: `npm run figma:frame -- <node-id>` prints `<Figma set> -> Component, props` for every instance.

## Guards (the AI cannot quietly drift)
- `no-restricted-imports` lint: pages and templates cannot import `@mui/*`.
- `npm run check:weights`: no numeric font weights outside `src/theme/typography.ts`.
- `npm run ai:build` fails if `intents.json` names a component that no longer exists.
- `docs/figma-deviations.md`: every difference from Figma is written down.

Regenerate after adding or changing a component: `npm run components:index && npm run ai:build`.
