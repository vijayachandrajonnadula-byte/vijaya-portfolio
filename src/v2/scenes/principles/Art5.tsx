import { useRef } from 'react';
import Character from '../../../components/studio/Character';
import { useBeat } from '../../components/Beat';
import { Fit, useScrub } from './art5/kit';
import '../../styles/s2b-art5.css';
import type { ArtProps } from './types';

/**
 * 5: protect unsaved work. A fence (the "are you sure?" dialog, struck out) against a net (the form closes, the text is
 * caught, an undo toast brings it back). Scroll walks through five phases; the buttons let the visitor run the net by hand.
 * The phase is one data attribute (data-ph) so nothing re-renders.
 */
const ROWS: [string, string][] = [['name', 'Intro call'], ['length', '30 min'], ['notes', 'agenda: next steps']];
const FALL = [{ dy: 206, r: -4 }, { dy: 172, r: 3 }, { dy: 140, r: -2 }];
const PICKETS = [-6, 3, -9, 4, -3, 8, -5, 2, -7, 5];

export default function Art5({ beat }: ArtProps) {
  const { progress } = useBeat();
  const root = useRef<HTMLDivElement>(null);
  const st = useRef({ scroll: 0, manual: 0 });
  const apply = () => root.current?.setAttribute('data-ph', String(st.current.manual || st.current.scroll));
  useScrub(progress, p => {
    const ph = p < 0.1 ? 0 : p < 0.3 ? 1 : p < 0.46 ? 2 : p < 0.7 ? 3 : 4;
    if (ph !== st.current.scroll) { st.current.scroll = ph; st.current.manual = 0; }
    apply();
  });
  const close = () => { st.current.manual = 3; apply(); };
  const undo = () => { st.current.manual = 4; apply(); };

  return (
    <Fit W={480} H={360}>
      <div ref={root} className="a5" data-ph="0">
        <button type="button" className="a5__try" onClick={() => ((st.current.manual || st.current.scroll) === 3 ? undo() : close())}>
          <span className="a5__try-a">try to close it</span><span className="a5__try-b">bring it back</span>
        </button>

        <svg className="a5__net" viewBox="0 0 340 90" width="340" height="90">
          <defs>
            <pattern id="a5mesh" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path d="M0 0H14M0 0V14" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </pattern>
            <clipPath id="a5clip"><path d="M0 0Q170 100 340 0Z" /></clipPath>
          </defs>
          <g className="a5__sag">
            <rect width="340" height="90" fill="url(#a5mesh)" clipPath="url(#a5clip)" />
            <path d="M0 0Q170 100 340 0" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          </g>
          <path d="M0 0V-30M340 0V-30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="a5__chip a5__chip--net">the net</span>

        <div className="a5__card">
          <div className="a5__bar"><i /><i /><i /><b>new meeting type</b></div>
        </div>
        {ROWS.map(([k, v], i) => (
          <div key={k} className="a5__row" style={{ top: 64 + i * 46, '--dy': `${FALL[i]!.dy}px`, '--r': `${FALL[i]!.r}deg`, '--i': i } as never}>
            <span>{k}</span><b>{v}</b>
          </div>
        ))}
        <button type="button" className="a5__x" onClick={close} aria-label="close the form">×</button>

        <svg className="a5__fence" viewBox="0 0 340 100" width="340" height="100">
          {PICKETS.map((r, i) => (
            <g key={i} className="a5__pk" style={{ '--r': `${r}deg`, '--d': `${i * 28}ms` } as never}>
              <path transform={`translate(${6 + i * 34} 8)`} d="M0 12L7 0L14 12V88H0Z" fill="currentColor" />
            </g>
          ))}
          <path className="a5__rail" d="M0 40H340M0 72H340" stroke="currentColor" strokeWidth="3.5" />
        </svg>
        <span className="a5__chip a5__chip--fence">the fence</span>

        <div className="a5__dlg">
          <p className="a5__dq">are you sure?<svg viewBox="0 0 150 14" className="a5__strike" preserveAspectRatio="none"><path pathLength="1" d="M2 8C20 3 40 12 62 6S110 10 148 5" /></svg></p>
          <p className="a5__dp">discard your changes?</p>
          <div className="a5__db"><span>discard</span><span>keep editing</span></div>
        </div>

        <div className="a5__toast">
          <span className="a5__ts">closed. nothing lost.</span>
          <span className="a5__ts a5__ts--ok">restored ✓</span>
          <button type="button" className="a5__undo" onClick={undo}>undo</button>
        </div>

        <svg className="a5__cursor" width="26" height="30" viewBox="0 0 26 30"><path d="M3 2L3 24L9 18.5L13 27L17 25L13 17L21 17Z" fill="currentColor" stroke="var(--bg)" strokeWidth="2" strokeLinejoin="round" /></svg>
        <span className="a5__ring" />

        <div className="a5__clay"><Character pose={beat.pose} prop="none" size={116} track={false} power="bright" /></div>
      </div>
    </Fit>
  );
}
