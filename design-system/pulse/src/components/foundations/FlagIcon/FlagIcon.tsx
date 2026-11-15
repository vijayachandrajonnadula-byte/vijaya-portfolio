// Icons page: FlagIcon set (271 country flags, property Country). The flag data (~2 MB) lives in its own generated
// module (src/symbols/generated/flags.ts, scripts/generate/pulse-symbols.mjs) and is loaded lazily on first use.
// Usage: <FlagIcon country="india" />
import { forwardRef } from 'react';
import { SymbolSvg, humanize, useSymbolSet } from '../../../symbols/SymbolSvg';
import type { SymbolSvgProps } from '../../../symbols/SymbolSvg';
import type { FlagCountry } from '../../../symbols/generated/flags';

export type { FlagCountry };
export const loadFlagSymbols = () => import('../../../symbols/generated/flags');

export interface FlagIconProps extends Omit<SymbolSvgProps, 'symbol'> {
  /** Figma "Country" variant name (lowercase, no separators, e.g. "unitedstates"). */
  country: FlagCountry;
}

export const FlagIcon = forwardRef<SVGSVGElement, FlagIconProps>(function FlagIcon({ country, size = 24, title, ...rest }, ref) {
  const set = useSymbolSet(loadFlagSymbols);
  return <SymbolSvg ref={ref} symbol={set?.[country]} size={size} title={title ?? humanize(country)} data-symbol={country} {...rest} />;
});

