import { ref } from '../refTheme';
import type { FigureKind } from './content';

/**
 * NOT FROM FIGMA. Simple original line drawings used as the figure of each table section (380 x 238 like the reference).
 * They are decorative placeholders; no real equipment photo or screenshot is shipped.
 */
function Art({ kind }: { kind: FigureKind }) {
  switch (kind) {
    case 'panel':
      return (
        <g>
          <rect x="60" y="30" width="260" height="170" rx="8" fill={ref.navy} />
          <rect x="76" y="46" width="228" height="62" rx="4" fill={ref.navy2} />
          <text x="90" y="72" fill={ref.blue6} fontSize="11" fontFamily="sans-serif">SHELL SPEED</text>
          <text x="90" y="98" fill={ref.white} fontSize="22" fontFamily="sans-serif">5.00 RPM</text>
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={102 + i * 58} cy={150} r={18} fill={i === 1 ? ref.pass : ref.blue3} />
          ))}
          <rect x="76" y="182" width="228" height="6" rx="3" fill={ref.blue3} />
        </g>
      );
    case 'blender':
    case 'trial':
      return (
        <g>
          <polygon points="110,50 170,50 190,120 150,150" fill={ref.blue6} stroke={ref.blue3} strokeWidth="2" />
          <polygon points="270,50 210,50 190,120 230,150" fill={ref.blue5} stroke={ref.blue3} strokeWidth="2" />
          <rect x="146" y="148" width="88" height="20" rx="4" fill={ref.blue3} />
          <rect x="60" y="76" width="50" height="14" rx="3" fill={ref.muted2} />
          <rect x="270" y="76" width="54" height="26" rx="4" fill={ref.navy2} />
          <polygon points="130,200 150,168 160,168 150,200" fill={ref.grayIc} />
          <polygon points="250,200 230,168 220,168 230,200" fill={ref.grayIc} />
          {kind === 'trial' && <rect x="124" y="78" width="132" height="14" fill={ref.draft} opacity="0.55" />}
        </g>
      );
    case 'valve':
      return (
        <g>
          <rect x="40" y="100" width="190" height="26" fill={ref.muted2} />
          <rect x="120" y="70" width="30" height="86" rx="4" fill={ref.blue3} />
          <circle cx="135" cy="58" r="22" fill="none" stroke={ref.blue3} strokeWidth="5" />
          <path d="M230 90 h50 v26 h-50 z" fill={ref.blue6} />
          <polygon points="250,170 330,170 318,215 262,215" fill={ref.tint} stroke={ref.blue3} strokeWidth="2" />
          <circle cx="290" cy="130" r="5" fill={ref.pass} />
        </g>
      );
    case 'certificate':
      return (
        <g>
          <rect x="80" y="26" width="220" height="186" rx="6" fill={ref.white} stroke={ref.blue5} strokeWidth="2" />
          <rect x="80" y="26" width="220" height="30" fill={ref.navy2} />
          <text x="190" y="46" textAnchor="middle" fill={ref.blue6} fontSize="11" fontFamily="sans-serif">CALIBRATION CERTIFICATE</text>
          {[78, 98, 118].map((y) => (
            <rect key={y} x="100" y={y} width="120" height="7" rx="3" fill={ref.blue6} />
          ))}
          <rect x="100" y="146" width="180" height="6" rx="3" fill={ref.tint} />
          <rect x="100" y="160" width="150" height="6" rx="3" fill={ref.tint} />
          <rect x="222" y="180" width="58" height="20" rx="3" fill={ref.verifyButton} />
          <text x="251" y="194" textAnchor="middle" fill={ref.white} fontSize="10" fontFamily="sans-serif">VALID</text>
        </g>
      );
    case 'form':
      return (
        <g>
          <rect x="70" y="24" width="240" height="190" rx="6" fill={ref.white} stroke={ref.blue5} strokeWidth="2" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x="90" y={50 + i * 40} width="18" height="18" rx="3" fill={i < 3 ? ref.pass : ref.white} stroke={ref.pass} strokeWidth="2" />
              <rect x="120" y={55 + i * 40} width={150 - i * 12} height="8" rx="4" fill={ref.blue6} />
            </g>
          ))}
        </g>
      );
  }
}

export function Figure({ kind, label }: { kind: FigureKind; label: string }) {
  return (
    <svg className="fig-img" viewBox="0 0 380 236.3" role="img" aria-label={label}>
      <rect width="380" height="236.3" fill={ref.tint2} />
      <Art kind={kind} />
    </svg>
  );
}
