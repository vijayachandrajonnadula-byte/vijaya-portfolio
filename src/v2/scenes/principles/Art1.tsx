import { useRef, type CSSProperties } from 'react';
import Character from '../../../components/studio/Character';
import { useBeat } from '../../components/Beat';
import { dashes, noise, shape } from './art1/geometry';
import { useScrub } from './art1/kit';
import type { ArtProps } from './types';
import '../../styles/s2a-base.css';
import '../../styles/s2a-1.css';

const pv = (p: number) => ({ '--p': p });
const v = (o: Record<string, number>) => o as CSSProperties;

/** 1. find the signal first: scattered dots, quotes and noise resolve into ONE person while Clay turns the dial. */
export default function Art1(_: ArtProps) {
  const { progress, active } = useBeat();
  const root = useRef<HTMLDivElement>(null);
  useScrub(root, progress, active, pv);
  return (
    <div ref={root} className="s2a s2a1">
      <svg className="s2a1__board" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
        <g className="s2a1__ring"><circle cx="200" cy="200" r="190" className="s2a1__r1" /><circle cx="200" cy="200" r="176" className="s2a1__r2" /></g>
        <g className="s2a1__brackets">
          {[[78, 70, 1, 1], [322, 70, -1, 1], [78, 392, 1, -1], [322, 392, -1, -1]].map(([x, y, a, b], i) => <path key={i} d={`M${x! + a! * 26} ${y}H${x}V${y! + b! * 26}`} />)}
        </g>
        {noise.map((n, i) => <circle key={i} className="s2a1__n" cx={n.x} cy={n.y} r={n.r} style={v({ '--d': n.d })} />)}
        {dashes.map((d, i) => <rect key={i} className="s2a1__q" x={d.x} y={d.y} width={d.w} height="3.4" rx="1.7" style={v({ '--ox': d.ox, '--rot': d.rot })} />)}
        {shape.map((s, i) => <circle key={i} className="s2a1__s" cx={s.x} cy={s.y} r={s.r} style={v({ '--ox': s.ox, '--oy': s.oy, '--d': s.d })} />)}
        <circle className="s2a1__halo" cx="200" cy="128" r="17" />
        <circle className="s2a1__eye" cx="200" cy="128" r="6.5" />
      </svg>
      <div className="s2a-clay s2a1__clay">
        <Character pose="hold" size={400} track={active} power={active ? 'bright' : 'on'} />
        <svg className="s2a1__knob" viewBox="-50 -50 100 100">
          <circle r="46" className="s2a1__kb" />
          {Array.from({ length: 11 }, (_, i) => { const a = (-150 + i * 30) * Math.PI / 180; return <line key={i} x1={Math.sin(a) * 38} y1={-Math.cos(a) * 38} x2={Math.sin(a) * 44} y2={-Math.cos(a) * 44} className="s2a1__tick" />; })}
          <g className="s2a1__hand"><circle r="26" className="s2a1__kf" /><path d="M0 -4V-25" className="s2a1__kp" /></g>
        </svg>
      </div>
      <div className="s2a1__meter s2a-mono">
        <span className="s2a1__lab"><span className="s2a1__noise">noise</span><span className="s2a1__sig">signal</span></span>
        <span className="s2a1__track"><i /></span>
      </div>
    </div>
  );
}
