import { SymbolGallery } from '../../../symbols/SymbolGallery';
import { useSymbolSet } from '../../../symbols/SymbolSvg';
import { Shape, loadShapeSymbols } from './Shape';
import type { ShapeName, ShapeType } from './Shape';

export default function ShapeDemo() {
  const set = useSymbolSet(loadShapeSymbols);
  return (
    <SymbolGallery
      keys={set && Object.keys(set)}
      cell={180}
      label={(k) => k.split('/').join(' / ')}
      render={(k) => {
        const [s, t] = k.split('/') as [ShapeName, ShapeType];
        return <Shape shape={s} type={t} size={104} />;
      }}
    />
  );
}
