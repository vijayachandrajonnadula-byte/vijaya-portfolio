// Imagery / Lines (10 variants): P&ID line style. Vector data is generated from the Figma geometry (scripts/generate/pulse-symbols.mjs) and loaded lazily.
// Usage: <ProcessLine type="pneumatic" />
import { forwardRef } from 'react';
import { SymbolSvg, humanize, useSymbolSet } from '../../../symbols/SymbolSvg';
import type { SymbolSvgProps } from '../../../symbols/SymbolSvg';
import type { ProcessLineType } from '../../../symbols/generated/lines';

export type { ProcessLineType };
export const loadProcessLineSymbols = () => import('../../../symbols/generated/lines');

export interface ProcessLineProps extends Omit<SymbolSvgProps, 'symbol'> {
  /** Figma variant name. */
  type: ProcessLineType;
}

export const ProcessLine = forwardRef<SVGSVGElement, ProcessLineProps>(function ProcessLine({ type, size = 120, title, ...rest }, ref) {
  const set = useSymbolSet(loadProcessLineSymbols);
  return <SymbolSvg ref={ref} symbol={set?.[type]} size={size} title={title ?? humanize(type)} data-symbol={type} {...rest} />;
});
