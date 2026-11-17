import { useRef, type CSSProperties } from 'react';
import Character from '../../../components/studio/Character';
import { useBeat } from '../../components/Beat';
import { outBack, seg, smooth, useScrub } from './art1/kit';
import type { ArtProps } from './types';
import '../../styles/s2a-base.css';
import '../../styles/s2a-4.css';

/** The stamp visits the rest spot (w0), card 2 (w1), card 1 (w2); `lift` is its height above the paper. */
const hop = (p: number, a: number, b: number) => smooth(seg(p, a, b));
function vars(p: number) {
  const toA = hop(p, 0.34, 0.46), backA = hop(p, 0.56, 0.66), toB = hop(p, 0.66, 0.74), backB = hop(p, 0.84, 0.94);
  const w1 = toA - backA, w2 = toB - backB;
  const press = (c: number) => Math.max(0, 1 - Math.abs(p - c) / 0.035);
  const lift = Math.max(0, 1 - press(0.5) - press(0.775));
  return {
    '--in1': outBack(seg(p, 0.03, 0.15)), '--in2': outBack(seg(p, 0.1, 0.22)), '--in3': outBack(seg(p, 0.17, 0.29)),
    '--w0': 1 - w1 - w2, '--w1': w1, '--w2': w2, '--lift': lift, '--hand': hop(p, 0.2, 0.28) * (1 - hop(p, 0.94, 1)),
    '--ok': hop(p, 0.5, 0.535), '--cut': hop(p, 0.775, 0.84), '--may': hop(p, 0.88, 0.94),
    '--sq1': press(0.5), '--sq2': press(0.775),
  };
}

/** Three tiny wireframes, one per draft: a sidebar layout, a hero with columns, a list. */
const THUMBS = [
  <svg key="a" viewBox="0 0 60 40"><rect x="2" y="2" width="14" height="36" rx="2" /><rect x="20" y="2" width="38" height="10" rx="2" /><rect x="20" y="16" width="38" height="22" rx="2" /></svg>,
  <svg key="b" viewBox="0 0 60 40"><rect x="2" y="2" width="56" height="16" rx="2" /><rect x="2" y="22" width="17" height="16" rx="2" /><rect x="21.5" y="22" width="17" height="16" rx="2" /><rect x="41" y="22" width="17" height="16" rx="2" /></svg>,
  <svg key="c" viewBox="0 0 60 40"><rect x="2" y="2" width="56" height="8" rx="2" /><rect x="2" y="12" width="56" height="8" rx="2" /><rect x="2" y="22" width="56" height="8" rx="2" /><rect x="2" y="32" width="36" height="6" rx="2" /></svg>,
];
const CARDS = [
  { id: 1, tag: 'cut', note: 'strike' },
  { id: 2, tag: 'approved', note: 'ok' },
  { id: 3, tag: 'maybe', note: 'may' },
] as const;

/** 4. let machines draft, let humans decide: three ghost drafts arrive, then a person stamps one, strikes one, and leaves one open. */
export default function Art4(_: ArtProps) {
  const { progress, active } = useBeat();
  const root = useRef<HTMLDivElement>(null);
  useScrub(root, progress, active, vars);
  return (
    <div ref={root} className="s2a s2a4">
      <p className="a4-cap a4-cap--t s2a-mono">machine proposes</p>
      <div className="a4-col">
        {CARDS.map(c => (
          <div key={c.id} className={`a4-card a4-card--${c.id}`} style={{ '--in': `var(--in${c.id})` } as CSSProperties}>
            <div className="a4-card__ghost" />
            <div className="a4-card__solid" />
            <div className="a4-thumb">{THUMBS[c.id - 1]}</div>
            <div className="a4-lines"><i /><i /><i /></div>
            <span className="a4-tag s2a-mono">
              <span className="a4-tag__d">draft</span>
              <span className={`a4-tag__f a4-tag__f--${c.id}`}>{c.tag}</span>
            </span>
            {c.id === 1 ? <i className="a4-strike" /> : null}
            {c.id === 2 ? <span className="a4-ink" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M2.4 6.4 5 9 9.7 3.2" /></svg></span> : null}
          </div>
        ))}
      </div>
      <p className="a4-cap a4-cap--b s2a-mono">a person decides</p>
      <div className="s2a-clay a4-clay"><Character pose="point" size={400} track={active} power={active ? 'bright' : 'on'} /></div>
      <svg className="a4-stamp" viewBox="0 0 56 76" aria-hidden="true">
        <rect x="19" y="2" width="18" height="40" rx="9" className="a4-stamp__h" />
        <rect x="23" y="38" width="10" height="16" className="a4-stamp__h" />
        <rect x="4" y="52" width="48" height="12" rx="4" className="a4-stamp__h" />
        <rect x="4" y="64" width="48" height="8" rx="3" className="a4-stamp__b" />
      </svg>
    </div>
  );
}
