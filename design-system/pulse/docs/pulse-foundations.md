# Pulse foundations (Typography, Color, Grid/Spacing/Radius, Shadows)

Source: the four foundation pages (frames only) read with `node scripts/figma/pulse-spec.mjs <page> notes`, plus
`figma-tokens/pulse/variables.json` (collections Primitives, Typography, Components) compared with
`src/theme/pulseTokens.ts` (which reads `figma-tokens/pulse-designkit.json`).

> **Palette note.** The hex values in the Colour section below are the **original Figma values**, kept as the record of what was audited.
> The code in this repo uses the accessible re-map (`figma-tokens/pulse-accessible-palette.json`, applied by `scripts/recolour/apply.mjs`).
> See `docs/figma-deviations.md` for the rule set, and `docs/accessible-palette.md` for the before and after.

## Typography

Font: **Inter** (variable). Weights: Light 300, Regular 400, Medium 500, SemiBold 600, Bold 700, ExtraBold 800, Black 900 (the page shows Regular, Medium, Semibold, Bold per style).

| Style | Size / line height | Figma variable | In `textStyle()` |
|---|---|---|---|
| Display XL | 72 / 90 | fontSize/displayXl | displayXl |
| Display L | 60 / 72 | fontSize/displayL | displayL |
| Heading 1 | 48 / 60 | h1 | heading1 |
| Heading 2 | 40 / 50 | h2 | heading2 |
| Heading 3 | 36 / 44 | h3 | heading3 |
| Heading 4 | 32 / 40 | h4 | heading4 |
| Heading 5 | 24 / 32 | h5 | heading5 |
| Heading 6 | 18 / 28 | h6 | heading6 |
| Text 4XL | 16 / 28 | fontSize/4xl, lineHeight/4xl | none |
| Text 3XL | 15 / 26 | xxxl | none |
| Text 2XL | 14 / 24 | xxl | none |
| Text XL | 13 / 22 | xl | textXl |
| Text L | 12 / 20 | l | textL |
| Text M | 11 / 20 | m | textM |
| Text S | 10 / 18 | s | textS |
| Text XS | 9 / 16 | xs | none |

Differences / flags:
- The Figma page names the 16 / 15 px steps "Text 4XL" and "Text 3XL" (the notes show 4XL = 16px, no line height printed; the Typography variables give 28). `pulseTokens.ts` exposes `textS..textXl` only in `textStyle()`, so 14, 15, 16 and 9 px have no named style (`pt.typography.fontSize` has them as raw values: xs, xxl, xxxl, xxxxl).
- The Figma variable is named `4xl`, the token key is `xxxxl`.
- Component text layers use "textContent" (Primary 12/20, Secondary 12/20, Meta Data 14/20 in Figtree in one spec), "textListItem" (Medium 12/20), "textLabel", "textHeading"; these are on the TextFormat page. The meta-data layer in `textContent` uses **Figtree 14/20**, which is not Inter; treated as a Figma inconsistency.
- `pt.typographyStyles.*.regular` uses font family `'Inter Variable', Inter, sans-serif` and letter-spacing 0 for all styles.

## Colour

Structure (Primitives collection, 13 steps each: 25, 50, 75, 100, 200 ... 950):

- **Brand** (default mode "Brand Blue"): 25 #F6F8FC, 50 #EEF3FB, 75 #E3EBF8, 100 #D3E0F2, 200 #B5C9E7, 300 #87A8D3, 400 #4E73A8, 500 #1E3A6E, 600 #19325E, 700 #152A4F, 800 #10213F, 900 #0A162A, 950 #050B15. Used for identity, CTAs, active states.
- **Complementary**: identical values to Brand in the Brand Blue mode (secondary elements, supporting UI).
- **Neutral**: 25 #FCFCFD, 50 #F8FAFC, 75 #F4F7FA, 100 #F1F5F9, 200 #E2E8F0, 300 #CBD5E1, 400 #94A3B8, 500 #64748B, 600 #475569, 700 #334155, 800 #1E293B, 900 #0F172A, 950 #020617.
- **Base**: white #FFFFFF, black #090909.
- **Accent families (8)**: red, green, blue, purple, yellow, orange, cyan, teal, each 13 steps (e.g. green 200 #BBF7D0, red 500 #EF4444, blue 500 #3B82F6, orange 500 #F59E0B, cyan 500 #06B6D4, teal 500 #14B8A6, purple 500 #8B5CF6).
- **Alpha** scales (white and black), hyperlink palette, 11 gradient values, 45 chart colours.
- **Brand themes**: Brand Blue, Blue (500 #2742CC), Green (500 #2C8268), Purple (500 #442069).
- Semantic layers: `Components` collection (`uiElements/*`, `formElements/*`, `templates/*`, `textFormat/*`) hold per-component colours bound to primitives; these are what spec lines show in brackets. Dark-mode semantic variables (`Colors/Foreground/fg-primary` etc.) exist only in the `external` collection and are not used by components.

Differences / flags:
- Figma page lists "amber" nowhere (the orange family holds the amber values, orange 500 #F59E0B), but `ColorFamily` in `pulseTokens.ts` and `FamilyColor` in `_shared/families.ts` include `amber`; it maps to the orange/amber chip tokens. Fine, but not a separate Figma family.
- `pulseTokens.ts` only ships the Brand Blue mode; Blue / Green / Purple themes are not available in code.
- The Color page's contrast ratios (e.g. brand 500 vs white 11.14:1) can be recomputed from the hex values; they match the ramp above.

## Spacing (35 tokens) and radius

Spacing scale (Primitives `spacing/*`, 1:1 with `pt.spacing`): none 0, xxxs 1, xxs 2, xs 4, s 6, m 8, l 10, xl 12, xxl 14, xxxl 16,
4xl 18, 5xl 20, 6xl 22, 7xl 24, 8xl 26, 9xl 28, 10xl 30, 11xl 32, 12xl 34, 13xl 36, 14xl 38, 15xl 40, 16xl 44, 17xl 48, 18xl 52, 19xl 56,
20xl 64, 21xl 72, 22xl 80, 23xl 96, 24xl 112, 25xl 120, 26xl 160, 27xl 192, 28xl 224, 29xl 256. Rem = px / 16.

Radius scale (`radius/*`, 1:1 with `pt.radius`): none 0, xxs 2, xs 4, s 6, m 8, l 10, xl 12, xxl 14, xxxl 16, 4xl 20, 5xl 24, full 1000.

Flags:
- Figma has an old `external` collection with names like `Spacing/4 (16px)` and `spacing-md`; these duplicate the scale above and are not used by components.
- Note the spacing "4xl" is 18px but the radius "4xl" is 20px; same token name, different scale.
- Common component radii seen in the specs: 4 (xs) controls and list items, 6 (s) matrix cells, 8 (m) cards, 1000 chips/circles.

## Shadows

Three groups, all `#000000` drop shadows with the offset/blur/spread format X, Y, Blur, Spread:

- **Elevation** (Y only, no blur): S 0/2/0, M 0/4/0, L 0/8/0, XL 0/16/0.
- **Blur** (blur only): S 0/0/2, M 0/0/4, L 0/0/8, XL 0/0/16.
- **Composite** `shadow<Offset><Blur>`: Ss, Sm, Sl, Sxl (Y 2); Ms, Mm, Ml, Mxl (Y 4); Ls, Lm, Ll, Lxl (Y 8); Xls, Xlm, Xll, Xlxl (Y 16), plus Xl2xl (0/16/32). e.g. shadowSxl = `0 2px 16px` (used by the Workspace Card hover), shadowSl = `0 2px 8px` (used by Form Builder toolbars, Dragged card).
- Focus: `focusStyle_1` = `0 0 0 1px #fff, 0 0 0 3px #3B82F6`; hover: `hoverStyle_1` = `0 0 4px rgba(0,0,0,.1)`.

Differences / flags:
- The Shadows page text says **#000000 (20%)** for the elevation examples, while every effect in `pulseTokens.ts` (`pt.shadow.*`) and the component specs (e.g. `drop(0,2,8,0,#00000026)` = 15%, `#0000001a` = 10%) uses 10% or 15%. Component specs are consistent with the tokens (10%) except the form-builder toolbar and dragged card, which use 15% (`#00000026`); no 15% token exists, so `0 2px 8px rgba(0,0,0,.15)` is written as a literal where needed.
- The page lists the shadow set as "Apply overrides to instances / Resources" frames; there is no dark-background variant extracted.
