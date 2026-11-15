# Pulse usage guide (from the "General Documentation Guide", "Keyboard Focus State" and "Typography/Color" pages)

Source: `node scripts/figma/pulse-spec.mjs general-documentation-guide notes` and siblings. The Figma pages are
instructions for designers working in the .fig file; the rules below are what carries over to code.

## Finding a value (the "Essentials" guide, translated to code)

| In Figma you ... | In code you ... |
|---|---|
| Select an atom and read height / width / radius / padding / colour in the right panel | `node scripts/figma/pulse-spec.mjs <page> <set> tree "<variant>"` |
| Click the padding / colour / radius chip to see the local variable | Spec lines show `[Variable/Name]` after a bound value; look it up in `figma-tokens/pulse/variables.json` or `pt` |
| Open Local variables to see every token of a component | `pt.uiElements.<component>`, `pt.formElements`, `pt.colors`, `pt.spacing`, `pt.radius`, `pt.shadow` |
| Switch states, sizes and other variant properties of an atom | `props` / `diff <Prop>` subcommands |
| Select a molecule and read the atoms' sizes | Nested `<Set / Variant>` entries in the tree; read those sets on their own page |

Rules stated on the page:

1. Build screens from atoms (a single component or icon) combined into molecules; read an atom's size from the atom, not from the molecule that wraps it.
2. Spacing, colour and radius must come from the local variables (padding / colour / radius chips). Do not type free-hand values; if the library has no variable, adjust the variable's configuration rather than overriding the instance.
3. A component documents its Size, Interaction States and Anatomy ("Anatomy of a Screen" lists these three as the standard sections of every component page); implement all three, not only the default state.
4. Components are shown with every combination of states, sizes and variants in the right-hand panel: treat each variant property as a prop (`size`, `variant`, `color`, `state`).

## Keyboard focus (Keyboard Focus State page, "AUGUST 2026")

Each component below has a DEFAULT and a FOCUS rendering; focus must be visible on every one:

Button, IconButton, Checkbox, Radio, Switch, Chip, Link, Tab, Accordion Header, Breadcrumb Item,
Calendar Cell, ListItem, Nav Rail item, Slider knobs, Color Picker, ToggleButtonGroup, Stepper,
Expand/Collapse, Tree.

- Use `:focus-visible` (or `.Mui-focusVisible`), never plain `:focus`, so mouse clicks do not show the ring.
- The ring is `focusRing` from `src/theme/pulseTokens.ts` (`0 0 0 1px #fff, 0 0 0 3px #3B82F6`), the same on every component.
- Disabled controls are not focusable and use `disabledOpacity` (0.38).

## Typography and colour usage notes

- Typeface is Inter (all weights Regular 400, Medium 500, Semibold 600, Bold 700). Pick a text style, then a weight; do not set raw font sizes.
- Open a component's text layer to see which style it uses: components reference named styles (textContent, textListItem, textLabel, textHeading ...) which are listed on the TextFormat page.
- Colours are chosen by role: brand ramp for primary identity, CTAs and active states; complementary ramp for secondary / supporting UI; neutral ramp for text, borders and surfaces; accent families (red, green, blue, purple, yellow, orange, cyan, teal) for status and data. Check the contrast figures printed on the Color page when pairing text with a fill (a swatch shows contrast vs black and vs white; WCAG AA needs 4.5:1 for body text).
- Four brand themes exist as modes of the Primitives collection (Brand Blue, Blue, Green, Purple). The default is Brand Blue.

## Page-level conventions seen in the templates

- Page chrome is stacked panels (context bar, list header, toolbar, tabs/status filter, body, footer); the body owns the scroll region and the header/footer stay fixed. See `src/templates/panels.tsx`.
- The page body tint is `#F0F1FA`; panels are white with a 1px `neutral/100` divider.
- Template spacing tokens: column spacing 64px, row spacing 16px, flyout column spacing 28px (`pt.templates.spacing`).
