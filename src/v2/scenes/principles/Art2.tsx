import { useRef, type CSSProperties } from 'react';
import Character from '../../../components/studio/Character';
import { useBeat } from '../../components/Beat';
import { TILES } from './art2/tiles';
import { outBack, seg, smooth, tri, useScrub } from './art1/kit';
import type { ArtProps } from './types';
import '../../styles/s2a-base.css';
import '../../styles/s2a-2.css';

/** One token at a time: radius, then colour, then spacing. Each stage has a window of progress. */
const W = [[0.16, 0.34], [0.42, 0.6], [0.68, 0.86]] as const;
const vars = (p: number) => {
  const s = W.map(([a, b]) => smooth(seg(p, a, b)));
  const f = W.map(([a, b]) => tri(seg(p, a - 0.02, b + 0.04)));
  return { '--s1': s[0]!, '--s2': s[1]!, '--s3': s[2]!, '--f1': f[0]!, '--f2': f[1]!, '--f3': f[2]!, '--fl': Math.max(...f), '--b': seg(p, 0.02, 0.15), '--by': outBack(seg(p, 0.02, 0.15)) };
};

const ROWS = [['radius', 1], ['colour', 2], ['space', 3]] as const;

/** 2. let the system carry the weight: 16 parts, three tokens; change one value and every part follows. */
export default function Art2(_: ArtProps) {
  const { progress, active } = useBeat();
  const root = useRef<HTMLDivElement>(null);
  useScrub(root, progress, active, vars);
  return (
    <div ref={root} className="s2a s2a2">
      <div className="a2-grid">
        {TILES.map((t, i) => (
          <div key={i} className={`a2-t${i === 12 ? ' a2-t--land' : ''}`} style={{ '--d': ((i % 4) + (3 - Math.floor(i / 4))) / 6 } as CSSProperties}>
            <div className="a2-t__in">{t}</div>
          </div>
        ))}
      </div>
      <div className="s2a-clay a2-clay">
        <Character pose="hold" prop="blocks" size={400} track={active} power={active ? 'bright' : 'on'} />
      </div>
      <div className="a2-panel s2a-mono">
        {ROWS.map(([name, n]) => (
          <div key={name} className="a2-row" style={{ '--n': n } as CSSProperties}>
            <span>--{name}</span><span className="a2-trk"><i /></span>
          </div>
        ))}
        <p className="a2-cap">one change, everywhere</p>
      </div>
    </div>
  );
}
