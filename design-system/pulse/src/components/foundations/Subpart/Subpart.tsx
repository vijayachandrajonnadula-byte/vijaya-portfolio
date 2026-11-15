// Imagery / Subpart (35 variants): P&ID sub-part / valve symbol. Vector data is generated from the Figma geometry (scripts/generate/pulse-symbols.mjs) and loaded lazily.
// Usage: <Subpart type="instr_valve__ball" />
import { forwardRef } from 'react';
import { SymbolSvg, humanize, useSymbolSet } from '../../../symbols/SymbolSvg';
import type { SymbolSvgProps } from '../../../symbols/SymbolSvg';
import type { SubpartType } from '../../../symbols/generated/subpart';

export type { SubpartType };
export const loadSubpartSymbols = () => import('../../../symbols/generated/subpart');

export interface SubpartProps extends Omit<SymbolSvgProps, 'symbol'> {
  /** Figma variant name. */
  type: SubpartType;
}

export const Subpart = forwardRef<SVGSVGElement, SubpartProps>(function Subpart({ type, size = 56, title, ...rest }, ref) {
  const set = useSymbolSet(loadSubpartSymbols);
  return <SymbolSvg ref={ref} symbol={set?.[type]} size={size} title={title ?? humanize(type)} data-symbol={type} {...rest} />;
});
