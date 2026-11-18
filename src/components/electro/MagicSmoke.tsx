import { useEffect, useRef, useState } from 'react';
import { quirks } from '../../data/quirks';
import '../../styles/electro.css';

/**
 * The part number as a button. Pressing it lets out a small puff of magic smoke (CSS/SVG, one burst per
 * click) and a line of text. Under reduced motion only the line appears.
 */
export default function MagicSmoke({ label }: { label: string }) {
  const [burst, setBurst] = useState(0);
  const [line, setLine] = useState('');
  const t = useRef(0);
  useEffect(() => () => window.clearTimeout(t.current), []);

  const press = () => {
    setBurst(b => b + 1);
    setLine(burst === 0 ? quirks.datasheet.smoke : quirks.eggs[burst % quirks.eggs.length]!);
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setLine(''), 3600);
  };

  return (
    <span className="el-smoke">
      <button type="button" className="el-part" onClick={press} title={quirks.datasheet.partHint}>
        {label}
      </button>
      <span className="el-smoke__puffs" aria-hidden="true" key={burst}>
        {burst > 0 && [0, 1, 2, 3].map(i => <i key={i} style={{ ['--i' as string]: i }} />)}
      </span>
      <span className="el-smoke__line" role="status">{line}</span>
    </span>
  );
}
