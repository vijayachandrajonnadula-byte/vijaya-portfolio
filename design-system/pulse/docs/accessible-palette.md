# The accessible palette: what changed, and how to check it

The original colours are recorded in `pulse-foundations.md` and `figma-deviations.md`. The code in this repo uses a re-map of them.
This note says what the re-map is, what it fixed, and what it did not.

## Measured before and after

Method: axe-core 4.14, WCAG 2 A and AA rules, run against every gallery demo (`/?c=<Name>`) at 1200px wide.
The same script ran on the untouched system and on this one.

| | Original | Re-mapped |
|---|---|---|
| Demos scanned | 93 | 92 (the logo-mark demo is withheld) |
| Colour-contrast failures | 429 elements in 44 demos | 108 elements in 8 demos |

Of the 108 that remain, **106** are inside states the original draws at 38% opacity (disabled, stopped and drag-ghost samples).
WCAG exempts disabled controls from contrast rules, but axe cannot see that when a state is dimmed with opacity and has no `disabled`
attribute. They are left as the Figma file specifies. The other **2** are a Backdrop demo label: white text over a translucent scrim
drawn on a light panel.

The same scan reports about 1,500 other findings (missing labels, nested interactive elements, undersized targets, missing names on
progress bars and images). They are component problems, not palette problems, and they are **not** fixed here.

Axe tests text contrast. It does not test the contrast of borders, icons or focus rings (WCAG 1.4.11). One such failure was known from
the audit, the default text field border at 1.3:1, and was fixed by hand to 3.5:1. The rest has not been audited.

## The ramps

`scripts/recolour/ramps.mjs` generates eight ramps (blue, neutral, red, amber, green, teal, cyan, purple), eleven steps each, into
`figma-tokens/pulse-accessible-palette.json`. Each step is solved in OKLCH to a contrast ratio against white, so the step number says what
it can do:

| Step | Against white | Use |
|---|---|---|
| 500 | at least 3:1 | UI parts, large text |
| 600 | at least 4.5:1 | text |
| 700 | at least 7:1 | text with margin |

The script proves this on every run and fails if any step drops below its threshold.

## The mapping

`scripts/recolour/mapping.mjs` maps every original hex value (Tailwind v3 palettes plus the Brand Blue ramp) onto the new ramps, and
`scripts/recolour/apply.mjs` rewrites the files. It is a per-hex substitution, so **run it only on pristine source**.

1. Accent 50 and 100 move one step darker. The new tints are paler than Tailwind's, and an unshifted fill disappears on a near-white page.
2. Accent 400 to 900 move one step darker.
3. Slate 400 and 500 both become neutral 600, the lightest grey that is still legal for text. Two steps collapse into one.
4. Black, white and the AI gradient are untouched.
5. Generated domain art (flags, equipment, instruments, loaders) is untouched.

## What the rule cannot know

The mapping darkens greys, which is right on light surfaces and wrong on dark ones. Places where a colour needed a hand-made decision
are logged in `figma-deviations.md`: the LeftNav inactive label (light on navy), the Notification fill titles, two blue icons,
the Calendar outside-month days, and the default text field border.

## Re-running it

```
node scripts/recolour/ramps.mjs     # regenerate the ramps
node scripts/recolour/apply.mjs     # only on pristine source
```

To measure, serve the gallery and run axe-core against `/?c=<Name>` for each demo.
