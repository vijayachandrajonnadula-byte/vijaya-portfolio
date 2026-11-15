# Design tokens

Identity: "Engineered to think. Designed to feel. Built to interact." Neutral base plus one accent, signal orange.
Source: `src/styles/vj-tokens.css` (tokens), `src/styles/vj-utilities.css` (utilities). Theme: `html[data-theme='dark']`, set from `vj-theme` in localStorage, else the system setting. Case-study pages pin the light set (`html[data-page='case']`).

## Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--vj-bg` | #F3F1EC | #0E0F11 | page background |
| `--vj-bg-raised` | #FBFAF7 | #17191C | cards, panels |
| `--vj-bg-raised-2` | #FFFFFF | #1F2226 | popovers, inputs on raised |
| `--vj-bg-sunken` | #E8E5DE | #0A0B0C | wells, code, inset areas |
| `--vj-bg-overlay` | rgba(243,241,236,.88) | rgba(14,15,17,.86) | nav pill, scrims |
| `--vj-text` | #15130F | #EDEEF0 | primary text |
| `--vj-text-2` | #4A463E | #A5A9B0 | secondary text |
| `--vj-text-3` | #6B665A | #8A8F97 | tertiary, metadata |
| `--vj-text-inverse` | #F3F1EC | #0E0F11 | text on `--vj-bg-inverse` |
| `--vj-border` / `--vj-border-strong` | #DAD6CB / #B8B2A3 | #25282D / #3A3F46 | hairlines / emphasised edges |
| `--vj-accent` | #FF5A1F | #FF5A1F | fills, glows, indicators (never small text on light) |
| `--vj-accent-text` | #B93A08 | #FF7A45 | accent used as text or links |
| `--vj-accent-hover` / `-active` | #FF7340 / #E64A10 | same | states |
| `--vj-accent-soft` | rgba(255,90,31,.12) | rgba(255,90,31,.16) | tinted backgrounds |
| `--vj-on-accent` | #15130F | #0E0F11 | text on an accent fill |
| `--vj-focus` | #B93A08 | #FF7A45 | focus ring |
| `--vj-btn-bg` / `--vj-btn-text` / `--vj-btn-hover` | #15130F / #F3F1EC / #2C2923 | #FF5A1F / #0E0F11 / #FF7340 | primary button (ink in light, signal in dark) |
| `--vj-success` / `-soft` | #0E7A4F | #3DD68C | feedback |
| `--vj-warning` / `-soft` | #8F5400 | #F2B33D | feedback |
| `--vj-error` / `-soft` | #C0262D | #FF6B6B | feedback |
| `--vj-grid-line`, `--vj-grid-dot`, `--vj-noise-opacity` | 7% / 16% / .05 ink | 5.5% / 16% / .07 light | texture |

Legacy `--c-*` names (`--c-bg`, `--c-tile`, `--c-ink`, `--c-accent`, `--c-clay`, ...) are aliases of these. `--c-accent` now means the primary button colour (ink in light, signal in dark).

## Contrast (WCAG 2.x, computed)

| Pair | Ratio | Result |
|---|---|---|
| ink #15130F on #F3F1EC | 16.4 | AAA |
| accent text #B93A08 on #F3F1EC | 5.07 | AA |
| accent text #B93A08 on sunken #E8E5DE | 4.55 | AA |
| signal #FF5A1F on #F3F1EC | 2.76 | fails 3:1 and 4.5:1: fills and glows only, never text on light |
| text-2 #4A463E on #F3F1EC | ~8 | AAA |
| text-3 #6B665A on #F3F1EC / sunken | 5.06 / 4.54 | AA |
| on-accent #15130F on #FF5A1F | 5.95 | AA |
| light button text #F3F1EC on #15130F | 16.4 | AAA |
| signal #FF5A1F on #0E0F11 / #17191C | 6.15 / 5.65 | AA |
| accent text #FF7A45 on #0E0F11 / #1F2226 | 7.42 / 6.18 | AA |
| dark button text #0E0F11 on #FF5A1F | 6.15 | AA |
| text #EDEEF0 on #0E0F11 | 16.5 | AAA |
| text-2 #A5A9B0 on #0E0F11 / #1F2226 | 8.13 / 6.77 | AAA / AA |
| text-3 #8A8F97 on #0E0F11 / #1F2226 | 5.90 / 4.91 | AA |
| success #0E7A4F, warning #8F5400, error #C0262D on #F3F1EC | 4.75, 4.81+, 5.23 | AA |
| success, warning, error (dark) on #0E0F11 | 10.2, 10.3, 6.9 | AA+ |

Case-study legacy button: white on #C2410C is 5.18 (AA).

## Type

Fonts (self-hosted from `/public/fonts`, latin subset, `font-display: swap`): `--vj-font-display` Bricolage Grotesque, `--vj-font-sans` Instrument Sans, `--vj-font-mono` JetBrains Mono.
Fluid scale (clamp): `--vj-text-xs/sm/base/lg/xl/2xl/3xl/4xl/display`. Classes: `.vj-display .vj-h1-.vj-h4 .vj-lead .vj-body .vj-small .vj-meta .vj-mono .vj-eyebrow`.

## Other scales

- Spacing (4px base): `--vj-space-0..10` (0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 144); `--vj-gutter`, `--vj-max` (1240px).
- Radius: `--vj-radius-xs/sm/md/lg/xl/pill` (4, 8, 12, 18, 28, 999).
- Motion: `--vj-dur-instant/fast/base/slow/slower` (90, 160, 280, 480, 800 ms); `--vj-ease-out/in-out/standard/snap`. JS mirror in `components/motion/primitives.ts`.
- Elevation: `--vj-shadow-sm/md/lg/glow`.
- Z-index: `--vj-z-base 0, raised 10, sticky 100, header 450, progress 460, overlay 500, modal 600, toast 700, cursor 800`.

## Utilities

`.vj-grid-bg` (+ `--fade`), `.vj-dots-bg`, `.vj-noise` (inline SVG noise, no image file), `.vj-focus`, `.vj-kbd`, `.vj-skip` (skip link), `.vj-sr-only`. Global `:where(a, button, ...):focus-visible` already shows the focus ring.
