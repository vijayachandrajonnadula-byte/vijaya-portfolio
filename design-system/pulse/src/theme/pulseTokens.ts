import data from '../../figma-tokens/pulse-designkit.json';

/**
 * Pulse design tokens, snapshotted from @pulse/designkit
 * (see scripts/generate/pull-designkit.mjs). Every component in src/components reads its measurements and
 * colours from here, so nothing is hand-copied from a screenshot.
 */
export const pt = data.designToken;
export const pulseTypography = data.typography;

export const palette = pt.colors;
export const neutral = pt.colors.neutral;
export const brand = pt.colors.brand;
export const accent = pt.colors.accent;

/** "12px" -> 12. Tokens are CSS strings; layout maths needs numbers. */
export const num = (v: string | number): number => (typeof v === 'number' ? v : parseFloat(v));

export type TextStyleName =
  | 'displayL'
  | 'displayXl'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'textS'
  | 'textM'
  | 'textL'
  | 'textXl';
export type TextWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

/** CSS for a Pulse text style (`typographyStyles.<name>.<weight>`). */
export function textStyle(name: TextStyleName, weight: TextWeight = 'regular') {
  const s = pt.typographyStyles[name][weight];
  return {
    fontFamily: s.fontFamily,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    fontWeight: s.fontWeight,
    letterSpacing: s.letterSpacing,
    textTransform: s.textTransform as 'none',
  };
}

/** Named colour families that Chip, Status, Badge, Notification and KPI all share. */
export type ColorFamily = 'gray' | 'blue' | 'green' | 'orange' | 'yellow' | 'red' | 'purple' | 'brand' | 'cyan' | 'teal' | 'amber';

/** Focus ring used by every focusable control (pt.shadow.focusStyle_1). */
export const focusRing = pt.shadow.focusStyle_1;
export const disabledOpacity = 0.38; // pt.uiElements.disabledState.opacity = "38%"

/** Figma variables templates/color/surfaceBG*: the surface (page-level) background colours. Canvas is the page body behind cards. */
export const surfaceBg = {
  white: pt.colors.base.white,
  canvas: neutral[50], // surfaceBGCanvas
  brand: pt.colors.brand[25], // surfaceBGBrand
  gray: neutral[75], // surfaceBGGray
  complementary: pt.colors.complementary[25], // surfaceBGComplementary
} as const;
