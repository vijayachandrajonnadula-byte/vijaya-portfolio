import { SymbolGallery } from '../../../symbols/SymbolGallery';
import { humanize, useSymbolSet } from '../../../symbols/SymbolSvg';
import { Subpart, loadSubpartSymbols } from './Subpart';
import type { SubpartType } from './Subpart';

export default function SubpartDemo() {
  const set = useSymbolSet(loadSubpartSymbols);
  return (
    <SymbolGallery
      keys={set && (Object.keys(set) as SubpartType[])}
      label={humanize}
      render={(k) => <Subpart type={k as SubpartType} size={72} />}
    />
  );
}
