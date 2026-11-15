import data from '../../figma-tokens/pulse-button.json';

/** A CSS colour, or a `linear-gradient(...)` string (AI colour). */
export type Paint = string;

export interface ButtonStateTokens {
  fill: Paint;
  stroke: Paint | null;
  label: Paint;
  icon: Paint;
}
export type ButtonVariantKey = 'contained' | 'outlined' | 'text';
export type ButtonStateKey = 'default' | 'hover' | 'disabled' | 'focus';
export type ButtonColorKey = 'primary' | 'error' | 'success' | 'warning' | 'ai';
export type ButtonSizeKey = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export interface ButtonSizeTokens {
  height: number;
  paddingX: number;
  gap: number;
  radius: number;
  iconSize: Record<ButtonVariantKey, number>;
  fontSize: number;
  lineHeight: number;
}

export interface PulseButtonTokens {
  disabledOpacity: number;
  borderWidth: number;
  focusRing: { outer: { color: string; spread: number }; inner: { color: string; spread: number } };
  typography: { fontFamily: string; fontWeight: number; letterSpacing: number };
  size: Record<ButtonSizeKey, ButtonSizeTokens>;
  color: Record<ButtonColorKey, Record<ButtonVariantKey, Record<ButtonStateKey, ButtonStateTokens>>>;
}

const COLORS: ButtonColorKey[] = ['primary', 'error', 'success', 'warning', 'ai'];
const VARIANTS: ButtonVariantKey[] = ['contained', 'outlined', 'text'];
const STATES: ButtonStateKey[] = ['default', 'hover', 'disabled', 'focus'];
const SIZES: ButtonSizeKey[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

/** The JSON is cast to a typed shape, so verify the shape once instead of failing deep inside the theme. */
function assertComplete(d: PulseButtonTokens): PulseButtonTokens {
  const missing: string[] = [];
  for (const s of SIZES) if (!d.size?.[s]) missing.push(`size.${s}`);
  for (const c of COLORS)
    for (const v of VARIANTS)
      for (const st of STATES) if (!d.color?.[c]?.[v]?.[st]) missing.push(`color.${c}.${v}.${st}`);
  if (missing.length) throw new Error(`figma-tokens/pulse-button.json is incomplete: ${missing.join(', ')}`);
  return d;
}

/** pulse-2.0 Button, resolved from Figma (see scripts/pull-pulse-button.mjs). */
export const pulseButton = assertComplete(data as unknown as PulseButtonTokens);

export const isGradient = (p: Paint): boolean => p.startsWith('linear-gradient');

/** Middle colour stop of a gradient; used where a gradient cannot be applied (icons). */
export function gradientMid(p: Paint): string {
  if (!isGradient(p)) return p;
  const stops = [...p.matchAll(/(#[0-9a-fA-F]{6,8})\s+\d+%/g)].map((m) => m[1] as string);
  return stops[Math.floor(stops.length / 2)] ?? '#000000';
}
