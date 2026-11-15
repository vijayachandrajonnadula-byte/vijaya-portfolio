// Arrows page: Arrows set (192 variants: End Points x Size x Direction x Type). Vector data generated from Figma
// (scripts/generate/pulse-symbols.mjs) and loaded lazily. Not every combination exists in Figma; missing ones render nothing.
// Usage: <Arrow endPoints="triangle" direction="right" type="straightDash" size="medium" />
import { forwardRef } from 'react';
import { SymbolSvg, useSymbolSet } from '../../../symbols/SymbolSvg';
import type { SymbolSvgProps } from '../../../symbols/SymbolSvg';
import type { ArrowKey } from '../../../symbols/generated/arrows';

export type ArrowEndPoints = 'line' | 'circle' | 'diamond' | 'triangle' | 'reversedTriangle' | 'none';
export type ArrowSize = 'small' | 'medium' | 'large';
export type ArrowDirection = 'left' | 'right' | 'both' | 'none';
export type ArrowType = 'straight' | 'straightDash' | 'curved' | 'curvedDash';
export type { ArrowKey };
export const loadArrowSymbols = () => import('../../../symbols/generated/arrows');

export interface ArrowProps extends Omit<SymbolSvgProps, 'symbol' | 'size' | 'type'> {
  endPoints?: ArrowEndPoints;
  /** Figma "Size" variant (line weight / head size). */
  size?: ArrowSize;
  direction?: ArrowDirection;
  type?: ArrowType;
  /** Rendered width in px; defaults to the Figma size. */
  width?: number | string;
}

export const Arrow = forwardRef<SVGSVGElement, ArrowProps>(function Arrow(
  { endPoints = 'triangle', size = 'medium', direction = 'right', type = 'straight', width, title, ...rest },
  ref,
) {
  const set = useSymbolSet(loadArrowSymbols);
  const key = `${endPoints}/${size}/${direction}/${type}` as ArrowKey;
  return (
    <SymbolSvg
      ref={ref}
      symbol={set?.[key]}
      size={width}
      title={title ?? `${endPoints} ${direction} arrow`}
      data-symbol={key}
      {...rest}
    />
  );
});
