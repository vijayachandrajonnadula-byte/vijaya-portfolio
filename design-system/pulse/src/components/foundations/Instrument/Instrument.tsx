// Imagery / instruments (38 variants): P&ID instrument symbol. Vector data is generated from the Figma geometry (scripts/generate/pulse-symbols.mjs) and loaded lazily.
// Usage: <Instrument type="instr_sensor__flow" />
import { forwardRef } from 'react';
import { SymbolSvg, humanize, useSymbolSet } from '../../../symbols/SymbolSvg';
import type { SymbolSvgProps } from '../../../symbols/SymbolSvg';
import type { InstrumentType } from '../../../symbols/generated/instruments';

export type { InstrumentType };
export const loadInstrumentSymbols = () => import('../../../symbols/generated/instruments');

export interface InstrumentProps extends Omit<SymbolSvgProps, 'symbol'> {
  /** Figma variant name. */
  type: InstrumentType;
}

export const Instrument = forwardRef<SVGSVGElement, InstrumentProps>(function Instrument({ type, size = 56, title, ...rest }, ref) {
  const set = useSymbolSet(loadInstrumentSymbols);
  return <SymbolSvg ref={ref} symbol={set?.[type]} size={size} title={title ?? humanize(type)} data-symbol={type} {...rest} />;
});
