// Shapes page: Shapes set (56 variants: Shape x Type). Vector data generated from Figma (scripts/generate/pulse-symbols.mjs), loaded lazily.
// Usage: <Shape shape="diamond" type="roundedDashed" />
import { forwardRef } from 'react';
import { SymbolSvg, useSymbolSet } from '../../../symbols/SymbolSvg';
import type { SymbolSvgProps } from '../../../symbols/SymbolSvg';
import type { ShapeKey } from '../../../symbols/generated/shapes';

export type ShapeName = 'rectangle' | 'square' | 'triangle' | 'invertedTriangle' | 'diamond' | 'parallelogram' | 'circle';
export type ShapeType =
  | 'pointed'
  | 'rounded'
  | 'roundedDotted'
  | 'roundedDashed'
  | 'roundedOutline'
  | 'pointedOutline'
  | 'pointedDashed'
  | 'pointedDotted';
export type { ShapeKey };
export const loadShapeSymbols = () => import('../../../symbols/generated/shapes');

export interface ShapeProps extends Omit<SymbolSvgProps, 'symbol' | 'type'> {
  shape?: ShapeName;
  type?: ShapeType;
}

export const Shape = forwardRef<SVGSVGElement, ShapeProps>(function Shape({ shape = 'rectangle', type = 'rounded', size = 120, title, ...rest }, ref) {
  const set = useSymbolSet(loadShapeSymbols);
  const key = `${shape}/${type}` as ShapeKey;
  return <SymbolSvg ref={ref} symbol={set?.[key]} size={size} title={title ?? `${shape} shape`} data-symbol={key} {...rest} />;
});
