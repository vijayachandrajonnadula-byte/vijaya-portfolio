import type { CSSObject } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { gradientMid, isGradient, pulseButton } from './buttonTokens';
import type { ButtonColorKey, ButtonSizeKey, ButtonStateTokens, ButtonVariantKey } from './buttonTokens';

/** Class on the label wrapper rendered by the design-system Button (needed for gradient text). */
export const BUTTON_LABEL_CLASS = 'PulseButton-label';
const ICONS = '& .MuiButton-startIcon, & .MuiButton-endIcon';

const tk = pulseButton;
const isColor = (c: string): c is ButtonColorKey => c in tk.color;
const isSize = (s: string): s is ButtonSizeKey => s in tk.size;

/** A CSS <image> from a paint, so solid colours can sit in a multi-layer background. */
const layer = (p: string) => (isGradient(p) ? p : `linear-gradient(${p}, ${p})`);

function state(theme: Theme, variant: ButtonVariantKey, t: ButtonStateTokens): CSSObject {
  const css: CSSObject = { boxShadow: 'none' };
  const stroke = t.stroke;
  if (stroke && isGradient(stroke)) {
    // Gradient border: transparent border over two clipped background layers.
    const paper = (theme.vars ?? theme).palette.background.default;
    css.borderColor = 'transparent';
    css.background = `${layer(t.fill === 'transparent' ? paper : t.fill)} padding-box, ${stroke} border-box`;
    css.backgroundOrigin = 'border-box';
  } else {
    css.background = t.fill;
    if (variant === 'outlined') css.borderColor = stroke ?? 'transparent';
  }
  css.color = gradientMid(t.label);
  css[ICONS] = { color: gradientMid(t.icon) };
  if (isGradient(t.label)) {
    // Gradient text: clip the gradient to the label glyphs.
    css[`& .${BUTTON_LABEL_CLASS}`] = {
      color: 'transparent',
      backgroundImage: t.label,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
    };
  }
  return css;
}

/** styleOverrides.root for MuiButton, generated from the pulse-2.0 Button tokens. */
export function buttonRoot(theme: Theme, variant: ButtonVariantKey, color: string, size: string): CSSObject {
  const s = isSize(size) ? tk.size[size] : tk.size.medium;
  const bw = tk.borderWidth;
  const outlined = variant === 'outlined';
  const css: CSSObject = {
    boxSizing: 'border-box',
    minWidth: 0,
    height: s.height,
    // Figma strokes sit inside the layout box; compensate so label position matches.
    padding: `0 ${s.paddingX - (outlined ? bw : 0)}px`,
    gap: s.gap,
    borderRadius: s.radius,
    // Set per size: MUI's built-in sizeSmall/sizeLarge font sizes would otherwise win over typography.button.
    fontSize: `${s.fontSize / 16}rem`,
    lineHeight: `${s.lineHeight}px`,
    border: outlined ? `${bw}px solid` : 0,
    boxShadow: 'none',
  };
  if (!isColor(color)) return css; // secondary / info / inherit: size only, MUI colours untouched
  const c = tk.color[color][variant];
  Object.assign(css, state(theme, variant, c.default));
  css['&:hover'] = state(theme, variant, c.hover);
  const ring = tk.focusRing;
  css['&.Mui-focusVisible'] = {
    ...state(theme, variant, c.focus),
    boxShadow: `0 0 0 ${ring.inner.spread}px ${ring.inner.color}, 0 0 0 ${ring.outer.spread}px ${ring.outer.color}`,
  };
  css['&.Mui-disabled'] = { ...state(theme, variant, c.disabled), opacity: tk.disabledOpacity };
  return css;
}

/** styleOverrides for startIcon / endIcon. */
export function buttonIcon(variant: ButtonVariantKey, size: string): CSSObject {
  const s = isSize(size) ? tk.size[size] : tk.size.medium;
  const px = s.iconSize[variant];
  return { margin: 0, '& > *:nth-of-type(1)': { fontSize: px }, '& svg': { width: px, height: px } };
}

export const buttonTypography = {
  // Figma names "Inter"; the bundled variable font registers as "Inter Variable".
  fontFamily: `"${tk.typography.fontFamily}", "Inter Variable", sans-serif`,
  fontWeight: tk.typography.fontWeight,
  fontSize: `${tk.size.medium.fontSize / 16}rem`,
  lineHeight: tk.size.medium.lineHeight / tk.size.medium.fontSize,
  letterSpacing: `${tk.typography.letterSpacing}em`,
  textTransform: 'none' as const,
};
