import { SymbolGallery } from '../../../symbols/SymbolGallery';
import { humanize, useSymbolSet } from '../../../symbols/SymbolSvg';
import { ProcessLine, loadProcessLineSymbols } from './ProcessLine';
import type { ProcessLineType } from './ProcessLine';

export default function ProcessLineDemo() {
  const set = useSymbolSet(loadProcessLineSymbols);
  return (
    <SymbolGallery
      keys={set && (Object.keys(set) as ProcessLineType[])}
      label={humanize}
      render={(k) => <ProcessLine type={k as ProcessLineType} size={136} />}
    />
  );
}
