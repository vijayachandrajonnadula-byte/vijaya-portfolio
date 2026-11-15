import Character from '../studio/Character';

/**
 * A tiny schematic for the contact form: battery, switch, lamp and a return wire. It only reflects what the buttons did
 * (the drawing is not a control and is hidden from assistive tech; the wink line is a status message).
 * Closed: the lever drops, the wire lights up, the lamp glows and Clay holds an envelope for a moment.
 */
export default function ClosedCircuit({ closed, wink }: { closed: boolean; wink: string }) {
  return (
    <div className={`cc${closed ? ' is-closed' : ''}`}>
      <svg className="cc__svg" viewBox="0 0 280 70" focusable="false" aria-hidden="true">
        {[ 'M20 28V58H262V28H226', 'M20 28H88', 'M162 28H206' ].map(d => <path key={d} className="cc__wire" d={d} />)}
        {[ 'M20 28V58H262V28H226', 'M20 28H88', 'M162 28H206' ].map(d => <path key={d} className="cc__wire cc__wire--lit" d={d} pathLength={1} />)}
        {/* battery */}
        <circle className="cc__node" cx="20" cy="28" r="4" />
        <text className="cc__t" x="20" y="14" textAnchor="middle">YOU</text>
        {/* switch */}
        <circle className="cc__node" cx="88" cy="28" r="3.5" />
        <circle className="cc__node" cx="162" cy="28" r="3.5" />
        <line className="cc__lever" x1="88" y1="28" x2="158" y2="28" />
        <text className="cc__t" x="125" y="46" textAnchor="middle">SW1</text>
        {/* lamp */}
        <circle className="cc__lamp-halo" cx="216" cy="28" r="10" />
        <circle className="cc__lamp" cx="216" cy="28" r="7" />
        <text className="cc__t" x="216" y="14" textAnchor="middle">D1</text>
        <text className="cc__t cc__t--b" x="150" y="68" textAnchor="middle">{closed ? 'closed' : 'open'}</text>
      </svg>
      <p className="cc__wink" role="status">{wink}</p>
      <div className="cc__clay" aria-hidden="true">
        <Character pose="hold" size={78} />
        <svg className="cc__env" viewBox="0 0 40 28" width="30" height="21" focusable="false">
          <rect x="1.5" y="1.5" width="37" height="25" rx="4" fill="#fffaf2" stroke="#1e3a6e" strokeWidth="2" />
          <path d="m3 4 17 13L37 4" fill="none" stroke="#1e3a6e" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
