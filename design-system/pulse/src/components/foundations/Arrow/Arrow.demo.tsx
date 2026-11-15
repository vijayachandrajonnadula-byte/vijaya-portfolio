import { SymbolGallery } from '../../../symbols/SymbolGallery';
import { useSymbolSet } from '../../../symbols/SymbolSvg';
import { Arrow, loadArrowSymbols } from './Arrow';
import type { ArrowDirection, ArrowEndPoints, ArrowSize, ArrowType } from './Arrow';

export default function ArrowDemo() {
  const set = useSymbolSet(loadArrowSymbols);
  return (
    <SymbolGallery
      keys={set && Object.keys(set)}
      cell={200}
      label={(k) => k.split('/').join(' / ')}
      render={(k) => {
        const [e, s, d, t] = k.split('/') as [ArrowEndPoints, ArrowSize, ArrowDirection, ArrowType];
        return <Arrow endPoints={e} size={s} direction={d} type={t} width={160} />;
      }}
    />
  );
}
