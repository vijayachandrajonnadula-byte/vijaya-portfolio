import { SymbolGallery } from '../../../symbols/SymbolGallery';
import { humanize, useSymbolSet } from '../../../symbols/SymbolSvg';
import { Equipment, loadEquipmentSymbols } from './Equipment';
import type { EquipmentType } from './Equipment';

export default function EquipmentDemo() {
  const set = useSymbolSet(loadEquipmentSymbols);
  return (
    <SymbolGallery
      keys={set && (Object.keys(set) as EquipmentType[])}
      label={humanize}
      render={(k) => <Equipment type={k as EquipmentType} size={80} />}
    />
  );
}
