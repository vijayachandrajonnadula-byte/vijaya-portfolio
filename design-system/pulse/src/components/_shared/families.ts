import { pt } from '../../theme/pulseTokens';

/**
 * Colour families shared by Chip, Status, Notification, KPICard and friends.
 * Values come from pt.uiElements.Chip.color; a family that lacks a token falls back to the next
 * closest token of the same family (noted per case) rather than an invented colour.
 */
export type FamilyColor =
  | 'default'
  | 'gray'
  | 'dark_gray'
  | 'blue'
  | 'green'
  | 'orange'
  | 'red'
  | 'brand'
  | 'ai'
  | 'yellow'
  | 'purple'
  | 'amber'
  | 'cyan'
  | 'teal';

export interface FamilyColors {
  /** Light tint, used as a chip/notification background. */
  bg: string;
  /** Hairline border colour. */
  border: string;
  /** Text colour on `bg`. */
  text: string;
  /** Saturated colour: dots, icons, filled backgrounds. */
  strong: string;
}

const chip = pt.uiElements.Chip.color as Record<string, string>;
const first = (...keys: string[]): string => {
  for (const k of keys) {
    const v = chip[k];
    if (v) return v;
  }
  throw new Error(`pulse-designkit: none of the Chip colour tokens exist: ${keys.join(', ')}`);
};

const prefix: Record<Exclude<FamilyColor, 'ai'>, string> = {
  default: 'gray',
  gray: 'gray',
  dark_gray: 'darkGray',
  blue: 'blue',
  green: 'green',
  orange: 'orange',
  red: 'red',
  brand: 'brand',
  yellow: 'yellow',
  purple: 'purple',
  amber: 'amber',
  cyan: 'cyan',
  teal: 'teal',
};

const g = pt.colors.gradient;
/** AI colour: a three-stop gradient (designkit colors.gradient). */
export const aiGradient = `linear-gradient(135deg, ${g.gradient1.stop1} 0%, ${g.gradient1.stop2} 50%, ${g.gradient1.stop3} 100%)`;
export const aiGradientSoft = `linear-gradient(135deg, ${g.gradient1XLight.stop1} 0%, ${g.gradient1XLight.stop2} 50%, ${g.gradient1XLight.stop3} 100%)`;

export function familyColors(color: FamilyColor): FamilyColors {
  if (color === 'ai') {
    return { bg: aiGradientSoft, border: g.gradient1Light.stop2, text: g.gradient1.stop2, strong: g.gradient1.stop2 };
  }
  const p = prefix[color];
  if (color === 'default') {
    return {
      bg: first('grayBackground'),
      border: first('grayBorder'),
      text: first('defaultTextColor'),
      strong: first('grayFillTextColor', 'defaultFillTextColor'),
    };
  }
  return {
    bg: first(`${p}Background`, `${p}SolidBackground`, 'graySolidBackground'),
    border: first(`${p}StrokeBorder`, `${p}Border`, 'grayBorder'),
    text: first(`${p}TextColor`, 'darkGrayTextColor'),
    strong: first(`${p}FillTextColor`, `${p}TextColor`, 'grayTextColor'),
  };
}

/**
 * pulse-2.0 Chip palette, read from the Figma Chip set (Style=Stroke / Style=Fill, Color=*).
 * These differ slightly from the designkit Chip tokens (e.g. gray bg #f4f7fa vs #F8FAFC), Figma wins.
 * `fill` is the text/icon colour of Style=Fill (Fill chips keep the tinted bg, no border).
 */
export interface ChipPaletteEntry {
  bg: string;
  border: string;
  text: string;
  fill: string;
  /** Saturated dot / accent colour (badges/color tokens). */
  dot: string;
}
export const chipPalette: Record<Exclude<FamilyColor, 'yellow' | 'amber' | 'ai'>, ChipPaletteEntry> = {
  default: { bg: '#ffffff', border: '#e2e8f0', text: '#0f172a', fill: '#566680', dot: '#cbd5e1' },
  gray: { bg: '#f4f7fa', border: '#e2e8f0', text: '#566680', fill: '#566680', dot: '#cbd5e1' },
  dark_gray: { bg: '#f4f7fa', border: '#e2e8f0', text: '#334155', fill: '#334155', dot: '#566680' },
  blue: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', fill: '#3b82f6', dot: '#3b82f6' },
  green: { bg: '#f0fdf4', border: '#bbf7d0', text: '#047857', fill: '#10b981', dot: '#22c55e' },
  orange: { bg: '#fffbeb', border: '#fde68a', text: '#b45309', fill: '#f59e0b', dot: '#f59e0b' },
  red: { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', fill: '#ef4444', dot: '#ef4444' },
  brand: { bg: '#eef3fb', border: '#bfdbfe', text: '#152a4f', fill: '#02216e', dot: '#1e3a6e' },
  purple: { bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9', fill: '#8b5cf6', dot: '#8b5cf6' },
  cyan: { bg: '#ecfeff', border: '#a5f3fc', text: '#0e7490', fill: '#06b6d4', dot: '#06b6d4' },
  teal: { bg: '#f0fdfa', border: '#99f6e4', text: '#0f766e', fill: '#14b8a6', dot: '#14b8a6' },
};
/** AI chip: brand-blue text on white, gradient on focus (Figma Chip Color=AI). */
export const chipAi = { bg: '#ffffff', border: '#b5c9e7', text: '#02216e', fillBg: '#eef3fb', gradientBg: 'linear-gradient(45deg, #f8e6f8 0%, #f0ecfb 50%, #e8f4fd 100%)', gradientBorder: 'linear-gradient(45deg, #bd06be 0%, #653fda 50%, #158eef 100%)' };
