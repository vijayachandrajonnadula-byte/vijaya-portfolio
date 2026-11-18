import { useRef, useState } from 'react';
import Character from '../../../components/studio/Character';
import { useBeat } from '../../components/Beat';
import { Fit, span, useScrub } from './art5/kit';
import { DEMO_INPUTS, DEMO_RESULT, DEMO_TODAY, interpret, words } from './art6/interpret';
import '../../styles/s2b-art6.css';
import type { ArtProps } from './types';

/**
 * 6: be tolerant of people. Five messy ways to say one date type themselves in (scrubbed by scroll), run down wires into a resistor,
 * and come out as one answer inside a +-5% tolerance bracket. The visitor can type their own into the real input.
 */
const ROW = (i: number) => 37 + i * 44;
const BANDS = [28, 54, 80];

export default function Art6({ beat }: ArtProps) {
  const { progress } = useBeat();
  const root = useRef<HTMLDivElement>(null);
  const texts = useRef<(HTMLSpanElement | null)[]>([]);
  const last = useRef<number[]>([]);
  const [mine, setMine] = useState('');
  const got = mine.trim() ? interpret(mine) : null;
  const mode = !mine.trim() ? 'demo' : got ? 'mine' : 'miss';

  useScrub(progress, p => {
    const el = root.current;
    if (!el) return;
    let done = 0, lit = 0;
    DEMO_INPUTS.forEach((full, i) => {
      const t = span(p, 0.04 + i * 0.15, 0.04 + i * 0.15 + 0.11);
      const n = Math.floor(t * full.length + 0.001);
      if (last.current[i] !== n) { last.current[i] = n; const s = texts.current[i]; if (s) s.textContent = full.slice(0, n); }
      el.style.setProperty(`--c${i}`, String(t >= 1 ? 1 : 0));
      el.style.setProperty(`--w${i}`, String(span(t, 0.7, 1)));
      if (t >= 1) done++;
      if (t >= 0.9) lit = 1;
    });
    el.style.setProperty('--done', String(done));
    el.style.setProperty('--lit', String(lit));
    el.style.setProperty('--br', String(span(p, 0.74, 0.88)));
  });

  return (
    <Fit W={480} H={360}>
      <div ref={root} className="a6" data-mode={mode}>
        <svg className="a6__wires" width="480" height="300" viewBox="0 0 480 300" aria-hidden="true">
          {DEMO_INPUTS.map((_, i) => {
            const d = `M138 ${ROW(i)}C176 ${ROW(i)} 160 124 200 124`;
            return <g key={i}><path className="g" d={d} /><path className="d" pathLength={1} style={{ '--w': `var(--w${i}, 0)` } as never} d={d} /></g>;
          })}
        </svg>

        {DEMO_INPUTS.map((full, i) => (
          <div key={full} className="a6__chip" style={{ top: ROW(i) - 17, '--c': `var(--c${i}, 0)` } as never}>
            <span ref={el => { texts.current[i] = el; }} />
            <i aria-hidden="true">✓</i>
          </div>
        ))}

        <svg className="a6__res" width="230" height="100" viewBox="0 0 230 100" aria-hidden="true">
          <path className="a6__brk" pathLength={1} d="M26 44V28H196V44" />
          <text x="111" y="18" textAnchor="middle">±5%</text>
          <g transform="translate(0 52)">
            <line className="a6__lead" x1="0" y1="20" x2="30" y2="20" />
            <line className="a6__lead" x1="192" y1="20" x2="230" y2="20" />
            <rect className="a6__body" x="26" y="0" width="170" height="40" rx="20" />
            {BANDS.map((x, i) => <rect key={x} className={`a6__band a6__band--${i}`} x={x + 20} y="0" width="12" height="40" />)}
            <rect className="a6__band a6__band--t" x="154" y="0" width="12" height="40" />
          </g>
        </svg>

        <div className="a6__card">
          <span className="a6__k">understood as</span>
          <b className="a6__v">{mode === 'mine' && got ? words(got) : mode === 'miss' ? 'not sure yet' : DEMO_RESULT}</b>
          <span className="a6__n">
            {mode === 'demo' ? `demo: today is ${words(DEMO_TODAY)}` : mode === 'mine' ? 'read back as one clean date' : 'try 5 mar, next fri or tomorrow'}
          </span>
        </div>

        <label className="a6__in">
          <span className="a6__lbl">try your own</span>
          <input type="text" inputMode="text" autoComplete="off" spellCheck={false} placeholder="a date, any way you like" value={mine}
            onChange={e => setMine(e.target.value.slice(0, 40))} aria-label="type a date any way you like, it is read back as one clean date" />
        </label>

        <div className="a6__clay"><Character pose={beat.pose} prop="none" size={100} track={false} power="bright" /></div>
        <span className="a6__say">that works.</span>
      </div>
    </Fit>
  );
}
