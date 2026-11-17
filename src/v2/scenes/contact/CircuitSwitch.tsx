import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Character from '../../../components/studio/Character';
import { closeCircuit, openCircuit, useCircuit } from '../../../components/story/circuitStore';
import { MAIL, openMail } from '../../components/s3/copy';
import '../../styles/s3-contact.css';

/*
 * The closing circuit, in the film's language. One primary action (Hick), one big physical key (Fitts: 64px high, full width
 * of the panel, thumb-sized on a phone), the lamp and Clay's LED are the only things that light (Von Restorff), and the
 * last thing the visitor does on the page is the best moment of it (Peak-End).
 * State lives in circuitStore (shared with the classic home). The label always says what pressing does NOW.
 */

const LOOP = 'M60 66V36H460V126H60V80'; // battery, top wire, switch, lamp, return wire
const CAP_OPEN = 'Press the switch to close the circuit. It opens a draft in your email app.';
const CAP_NOW = 'Circuit closed. Your email app is opening.';
const CAP_BACK = 'Circuit closed. Say hello whenever you are ready.';

const Lab = ({ x, y, align = 'c', children }: { x: number; y: number; align?: 'c' | 'l' | 'r'; children: string }) => (
  <span className={`s3-sw__lab s3-sw__lab--${align}`} style={{ left: `${(x / 520) * 100}%`, top: `${(y / 150) * 100}%` }}>{children}</span>
);

export default function CircuitSwitch({ active }: { active: boolean }) {
  const still = !!useReducedMotion();
  const { closed } = useCircuit();
  const [just, setJust] = useState(false); // closed during this view, so the mail app really is opening
  const [run, setRun] = useState(0);
  const dot = useRef<SVGGElement>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(t => window.clearTimeout(t)), []);

  useEffect(() => {
    if (!run || still) return;
    const t = window.setTimeout(() => {
      dot.current?.querySelectorAll<SVGAnimationElement>('animateMotion, animate').forEach(a => { try { a.beginElement(); } catch { /* the lit wire still shows the flow */ } });
    }, 180);
    return () => window.clearTimeout(t);
  }, [run, still]);

  const press = () => {
    if (!closed) closeCircuit();
    setJust(true);
    setRun(r => r + 1);
    timers.current.push(window.setTimeout(openMail, still ? 0 : 900));
  };
  const reset = () => { openCircuit(); setJust(false); };

  const caption = !closed ? CAP_OPEN : just ? CAP_NOW : CAP_BACK;
  return (
    <div className={`s3-sw${closed ? ' is-closed' : ''}${active && !closed && !still ? ' is-live' : ''}`}>
      <div className="s3-sw__clay" aria-hidden="true">
        <Character pose="hold" size={190} track={active} power={closed ? 'bright' : active ? 'on' : 'off'} />
        <svg className="s3-sw__env" viewBox="0 0 56 40" focusable="false">
          <rect x="2" y="2" width="52" height="36" rx="5" fill="#FAF9F7" stroke="#17171A" strokeWidth="3" />
          <path d="m4 6 24 18L52 6" fill="none" stroke="#17171A" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="s3-sw__fig">
        <svg className="s3-sw__svg" viewBox="0 0 520 150" focusable="false" aria-hidden="true">
          <path id="s3-loop" d={LOOP} fill="none" stroke="none" />
          <path className="s3-sw__wire" d="M60 66V36H150M250 36H460V60M460 86V126H60V80" />
          <path className="s3-sw__wire s3-sw__wire--lit" d={LOOP} pathLength={1} />
          <line className="s3-sw__plate" x1="44" y1="66" x2="76" y2="66" />
          <line className="s3-sw__plate s3-sw__plate--s" x1="52" y1="80" x2="68" y2="80" />
          <circle className="s3-sw__node" cx="150" cy="36" r="6" />
          <circle className="s3-sw__node" cx="250" cy="36" r="6" />
          <g className="s3-sw__lever"><line x1="150" y1="36" x2="244" y2="36" /></g>
          <circle className="s3-sw__halo" cx="460" cy="73" r="34" />
          <circle className="s3-sw__lamp" cx="460" cy="73" r="14" />
          <path className="s3-sw__fil" d="M452 65l16 16M468 65l-16 16" />
          {run > 0 && !still ? (
            <g key={run} ref={dot} className="s3-sw__dot" opacity="0">
              <circle r="11" className="s3-sw__dot-halo" />
              <circle r="5" className="s3-sw__dot-core" />
              <animateMotion dur="0.8s" begin="indefinite" fill="freeze" calcMode="linear"><mpath href="#s3-loop" /></animateMotion>
              <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.94;1" dur="0.8s" begin="indefinite" fill="freeze" />
            </g>
          ) : null}
        </svg>
        <Lab x={70} y={106} align="l">you</Lab>
        <Lab x={200} y={70}>{closed ? 'closed' : 'open'}</Lab>
        <Lab x={450} y={106} align="r">vijay</Lab>
      </div>

      {/* The label says what pressing does NOW. No aria-pressed: the visible label already carries the state. */}
      <button type="button" className="s3-sw__btn" data-switch data-href={MAIL} onClick={press}>
        <span className="s3-sw__tog" aria-hidden="true"><i /></span>
        <span className="s3-sw__lbl">{closed ? 'Circuit closed: open email again' : 'Close the circuit: email me'}</span>
      </button>

      <div className="s3-sw__foot">
        <p className="s3-sw__cap" role="status">{caption}</p>
        {closed ? <button type="button" className="s3-sw__reset" onClick={reset}>Reset the circuit</button> : null}
      </div>
    </div>
  );
}
