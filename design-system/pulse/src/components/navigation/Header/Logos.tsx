import type { SVGProps } from 'react';
import { fw } from '../../../theme/typography';

// Generic wordmarks. The production system ships the company's own vectors here; this copy deliberately does not.
// Replace these two components (or pass `logo` / `customElement` to Header, Footer and LeftNav) to brand an instance.

export interface LogoProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
  /** Any CSS colour. */
  color?: string;
}

/** Application wordmark shown at the left of the Header (115 x 18). */
export function ProductLogoVector({ color = '#02216e', width, height, ...rest }: LogoProps) {
  return (
    <svg viewBox="0 0 115.38 17.52" width={width ?? 115.38} height={height ?? 17.52} fill={color} role="img" {...rest}>
      <text x="0" y="14.6" fontFamily="'Inter Variable', Inter, sans-serif" fontWeight={fw.bold} fontSize="17" letterSpacing="2.4">PULSE</text>
    </svg>
  );
}

/** Wordmark shown after "Powered By" in the Footer. */
export function FooterLogoVector({ color = '#1e3a6e', width, height, ...rest }: LogoProps) {
  return (
    <svg viewBox="0 0 92 18" width={width ?? 92} height={height ?? 18} fill={color} role="img" {...rest}>
      <text x="0" y="14" fontFamily="'Inter Variable', Inter, sans-serif" fontWeight={fw.bold} fontSize="15" letterSpacing="2">PULSE</text>
    </svg>
  );
}
