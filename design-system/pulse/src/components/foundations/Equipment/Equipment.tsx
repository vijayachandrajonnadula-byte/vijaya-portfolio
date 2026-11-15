// Imagery / Equipment (104 variants): P&ID equipment symbol. Vector data is generated from the Figma geometry (scripts/generate/pulse-symbols.mjs) and loaded lazily.
// Usage: <Equipment type="centrifugal_pump" />
import { forwardRef } from 'react';
import { SymbolSvg, humanize, useSymbolSet } from '../../../symbols/SymbolSvg';
import type { SymbolSvgProps } from '../../../symbols/SymbolSvg';
import type { EquipmentType } from '../../../symbols/generated/equipment';

export type { EquipmentType };
export const loadEquipmentSymbols = () => import('../../../symbols/generated/equipment');

export interface EquipmentProps extends Omit<SymbolSvgProps, 'symbol'> {
  /** Figma variant name. */
  type: EquipmentType;
}

export const Equipment = forwardRef<SVGSVGElement, EquipmentProps>(function Equipment({ type, size = 64, title, ...rest }, ref) {
  const set = useSymbolSet(loadEquipmentSymbols);
  return <SymbolSvg ref={ref} symbol={set?.[type]} size={size} title={title ?? humanize(type)} data-symbol={type} {...rest} />;
});
