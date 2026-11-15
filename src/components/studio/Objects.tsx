/** Small still-life objects for the work grid. Pure CSS and SVG, each reacts when its project is hovered. */
export type ObjectKind = 'blocks' | 'dial' | 'spark' | 'calendar';

export default function ObjectArt({ kind }: { kind: ObjectKind }) {
  if (kind === 'blocks') {
    return (
      <div className="obj obj--blocks" aria-hidden="true">
        <div className="obj__plane">
          {Array.from({ length: 20 }, (_, i) => <i key={i} className={i === 7 ? 'is-lift' : undefined} />)}
        </div>
      </div>
    );
  }
  if (kind === 'dial') {
    return (
      <div className="obj obj--dial" aria-hidden="true">
        <svg viewBox="0 0 120 120" width="100%" height="100%">
          <circle cx="60" cy="62" r="38" fill="var(--c-obj)" stroke="var(--c-line)" strokeWidth="2" />
          {Array.from({ length: 11 }, (_, i) => { const a = (-120 + i * 24) * Math.PI / 180; return <line key={i} x1={60 + Math.cos(a) * 31} y1={62 + Math.sin(a) * 31} x2={60 + Math.cos(a) * 36} y2={62 + Math.sin(a) * 36} stroke="var(--c-mute)" strokeWidth="2" strokeLinecap="round" />; })}
          <g className="obj__needle"><path d="M60 62 60 34" stroke="var(--c-clay)" strokeWidth="4" strokeLinecap="round" /></g>
          <circle cx="60" cy="62" r="5" fill="var(--c-ink)" />
        </svg>
      </div>
    );
  }
  if (kind === 'spark') {
    return (
      <div className="obj obj--spark" aria-hidden="true">
        <svg viewBox="0 0 120 120" width="100%" height="100%">
          <rect x="30" y="30" width="60" height="60" rx="16" fill="var(--c-obj)" stroke="var(--c-line)" strokeWidth="2" />
          <g className="obj__spin"><path d="M60 42v36M42 60h36M47 47l26 26M73 47 47 73" stroke="var(--c-clay)" strokeWidth="4" strokeLinecap="round" /></g>
          <circle cx="94" cy="26" r="4" fill="var(--c-clay)" /><circle cx="24" cy="98" r="3" fill="var(--c-mute)" />
        </svg>
      </div>
    );
  }
  return (
    <div className="obj obj--cal" aria-hidden="true">
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <rect x="24" y="26" width="72" height="70" rx="12" fill="var(--c-obj)" stroke="var(--c-line)" strokeWidth="2" />
        <path d="M24 46h72V38a12 12 0 0 0-12-12H36a12 12 0 0 0-12 12Z" fill="var(--c-clay)" />
        {[0, 1, 2].map(r => [0, 1, 2, 3].map(c => <circle key={`${r}${c}`} cx={38 + c * 15} cy={58 + r * 12} r="3" fill={r === 1 && c === 2 ? 'var(--c-clay)' : 'var(--c-line)'} className={r === 1 && c === 2 ? 'obj__day' : undefined} />))}
      </svg>
    </div>
  );
}
