import { SymbolGallery } from '../../../symbols/SymbolGallery';
import { humanize, useSymbolSet } from '../../../symbols/SymbolSvg';
import { Instrument, loadInstrumentSymbols } from './Instrument';
import type { InstrumentType } from './Instrument';

export default function InstrumentDemo() {
  const set = useSymbolSet(loadInstrumentSymbols);
  return (
    <SymbolGallery
      keys={set && (Object.keys(set) as InstrumentType[])}
      label={humanize}
      render={(k) => <Instrument type={k as InstrumentType} size={72} />}
    />
  );
}
