import { SymbolGallery } from '../../../symbols/SymbolGallery';
import { humanize, useSymbolSet } from '../../../symbols/SymbolSvg';
import { FlagIcon, loadFlagSymbols } from './FlagIcon';
import type { FlagCountry } from './FlagIcon';

// 271 flags: the grid is paginated (60 per page, "Show more") so only the visible ones are mounted.
export default function FlagIconDemo() {
  const set = useSymbolSet(loadFlagSymbols);
  return (
    <SymbolGallery
      keys={set && Object.keys(set)}
      cell={110}
      pageSize={72}
      label={humanize}
      render={(k) => <FlagIcon country={k as FlagCountry} size={48} />}
    />
  );
}
