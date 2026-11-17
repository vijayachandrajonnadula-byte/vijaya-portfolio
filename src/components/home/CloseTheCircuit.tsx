import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { profile } from '../../data/profile';
import Character from '../studio/Character';
import { closeCircuit, openCircuit, useCircuit } from '../story/circuitStore';

/*
 * Design rationale (laws of UX, one line each)
 * - Zeigarnik: an open loop with a visible gap reads as an unfinished task, so it pulls toward completion.
 * - Goal-gradient: the scroll Trace ends at this switch; the nearer the visitor gets, the more it glows (--glow, set by Trace).
 * - Fitts: the switch IS the primary CTA, one full-width target, 60px high (56px+ on mobile), reachable by thumb.
 * - Hick: exactly one primary action here; copy address and the four links are quieter and sit below.
 * - Von Restorff: the switch and the lit lamp are the only saturated clay elements in the contact area.
 * - Jakob: it is still a normal labelled button ("Close the circuit: email me") that opens the mail app.
 * - Doherty: the lever and caption respond in the same frame (<100ms); the current loop finishes in 800ms.
 * - Peak-End: closing is the last thing on the page: current travels the loop, the lamp lights, Clay delivers the envelope.
 * - Postel / Tesler / Norman: no input is asked for (the system builds the email draft); the diagram is a signifier
 *   (YOU, REACH OUT, VIJAY) and one plain sentence says what the metaphor means and why.
 */

const LOOP = 'M60 66V36H460V126H60V80'; // battery, top wire, switch, lamp, return wire
const MAIL = `mailto:${profile.email}?subject=${encodeURIComponent('Hello from your portfolio')}`;
const CAP_OPEN = 'Press the switch to close the circuit. It opens a draft in your email app.';
const CAP_NOW = 'Circuit closed. Your email app is opening.';
const CAP_BACK = 'Circuit closed. Say hello whenever you are ready.';

/** Opens the visitor's mail app through a real anchor click (so it behaves exactly like a mailto link). */
function openMail() {
  const a = document.createElement('a');
  a.href = MAIL;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const Lab = ({ x, y, align = 'c', children }: { x: number; y: number; align?: 'c' | 'l' | 'r'; children: string }) => (
  <span className={`cts__lab cts__lab--${align}`} style={{ left: `${(x / 520) * 100}%`, top: `${(y / 150) * 100}%` }}>{children}</span>
);

export default function CloseTheCircuit() {
  const reduced = !!useReducedMotion();
  const { closed } = useCircuit();
  const [just, setJust] = useState(false); // closed during this view (so the mail app really is opening)
  const [run, setRun] = useState(0); // bumps to replay the travelling dot
  const [seen, setSeen] = useState(false);
  const [note, setNote] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<SVGGElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(t => window.clearTimeout(t)), []);

  // animate only while on screen
  useEffect(() => {
    const el = root.current;
    if (!el || !('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => setSeen(!!e?.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // start the travelling current (SMIL elements wait for beginElement so each press replays them)
  useEffect(() => {
    if (!run || reduced) return;
    dot.current?.querySelectorAll<SVGAnimationElement>('animateMotion, animate').forEach(a => { try { a.beginElement(); } catch { /* unsupported: lit wire still shows the flow */ } });
  }, [run, reduced]);

  const press = () => {
    if (!closed) closeCircuit();
    setJust(true);
    setNote('');
    setRun(r => r + 1);
    timers.current.push(window.setTimeout(openMail, reduced ? 0 : 650));
  };
  const reopen = () => { openCircuit(); setJust(false); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setNote('Address copied.'); }
    catch { setNote('Copy is blocked here. Select the address below instead.'); }
    timers.current.push(window.setTimeout(() => setNote(''), 4000));
  };

  const caption = !closed ? CAP_OPEN : just ? CAP_NOW : CAP_BACK;
  return (
    <div ref={root} className={`cts${closed ? ' is-closed' : ''}${seen ? ' is-seen' : ''}${reduced ? ' is-still' : ''}`}>
      <div className="cts__fig">
        <svg className="cts__svg" viewBox="0 0 520 150" focusable="false" aria-hidden="true">
          <path id="cts-loop" d={LOOP} fill="none" stroke="none" />
          {['M60 66V36H150', 'M250 36H460V60', 'M460 86V126H60V80'].map(d => <path key={d} className="cts__wire" d={d} />)}
          <path className="cts__wire cts__wire--lit" d={LOOP} pathLength={1} />
          {/* battery: long plate is positive */}
          <line className="cts__plate" x1="44" y1="66" x2="76" y2="66" />
          <line className="cts__plate cts__plate--s" x1="52" y1="80" x2="68" y2="80" />
          {/* switch */}
          <circle className="cts__ring" cx="200" cy="36" r="19" />
          <circle className="cts__node" cx="150" cy="36" r="4.5" />
          <circle className="cts__node" cx="250" cy="36" r="4.5" />
          <line className="cts__lever" x1="150" y1="36" x2="246" y2="36" />
          {/* lamp */}
          <circle className="cts__halo" cx="460" cy="73" r="27" />
          <circle className="cts__lamp" cx="460" cy="73" r="13" />
          <path className="cts__fil" d="M452 65l16 16M468 65l-16 16" />
          {/* travelling current */}
          {run > 0 && !reduced ? (
            <g key={run} ref={dot} className="cts__dot" opacity="0">
              <circle r="9" className="cts__dot-halo" />
              <circle r="4.5" className="cts__dot-core" />
              <animateMotion dur="0.8s" begin="indefinite" fill="freeze" calcMode="linear"><mpath href="#cts-loop" /></animateMotion>
              <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.94;1" dur="0.8s" begin="indefinite" fill="freeze" />
            </g>
          ) : null}
        </svg>
        <Lab x={70} y={104} align="l">YOU</Lab>
        <Lab x={200} y={66}>REACH OUT</Lab>
        <Lab x={200} y={82}>{closed ? '(closed)' : '(open)'}</Lab>
        <Lab x={450} y={104} align="r">VIJAY</Lab>
      </div>

      {/* The label always says what pressing does NOW (Norman: feedback and signifiers). Before: it closes the circuit and
          opens the mail app. After: the circuit is already closed, so the only thing left to do is open the mail app again.
          No aria-pressed: the visible label already carries the state, and a changing label plus a pressed state double-announces. */}
      <button type="button" className="cts__btn" data-switch data-href={MAIL} onClick={press}>
        <span className="cts__tog" aria-hidden="true"><i /></span>
        <span>{closed ? 'Circuit closed: open email again' : 'Close the circuit: email me'}</span>
      </button>

      <div className="cts__row">
        <p className="cts__cap" role="status">{caption}</p>
        <div className="cts__clay" aria-hidden="true">
          <Character pose="hold" size={64} />
          <svg className="cts__env" viewBox="0 0 40 28" width="26" height="18" focusable="false">
            <rect x="1.5" y="1.5" width="37" height="25" rx="4" fill="#fffaf2" stroke="#1e3a6e" strokeWidth="2" />
            <path d="m3 4 17 13L37 4" fill="none" stroke="#1e3a6e" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="cts__aux">
        <button type="button" className="cts__ghost" onClick={copy}>Copy address</button>
        {closed ? <button type="button" className="cts__link" onClick={reopen}>Reset the circuit</button> : null}
        <p className="cts__note" role="status">{note}</p>
      </div>
    </div>
  );
}
