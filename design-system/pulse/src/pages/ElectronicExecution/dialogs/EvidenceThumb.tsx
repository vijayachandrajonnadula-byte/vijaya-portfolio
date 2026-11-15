/**
 * Generated placeholder thumbnail for an evidence item (inline SVG, no image files). NOT FROM FIGMA.
 * The picture depends on the kind (screenshot, file, video, snapshot) and varies a little with the name, so items look different.
 * Colours come from the Pulse palette tokens.
 */
import { pt } from '../../../theme/pulseTokens';
import { getEvidenceImage, useEvidenceSideTables } from '../evidence/evidenceMeta';
import type { EvidenceItem } from '../model';

const c = pt.colors;

function seedOf(name: string): number {
  let h = 7;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 9973;
  return h;
}

export default function EvidenceThumb({ item, label, fit = 'meet' }: { item: Pick<EvidenceItem, 'kind' | 'name' | 'aiCaptured'> & { id?: string }; label?: string; fit?: 'meet' | 'slice' }) {
  useEvidenceSideTables();
  const picture = item.id ? getEvidenceImage(item.id) : undefined;
  const seed = seedOf(item.name);
  const a = seed % 40;
  const b = (seed >> 3) % 50;
  const ext = item.name.includes('.') ? item.name.split('.').pop()!.toUpperCase().slice(0, 4) : 'FILE';
  if (picture) {
    return <img src={picture} alt={label ?? `${item.kind} preview of ${item.name}`} style={{ display: 'block', width: '100%', height: '100%', objectFit: fit === 'slice' ? 'cover' : 'contain' }} />;
  }
  return (
    <svg viewBox="0 0 320 200" width="100%" height="100%" role="img" aria-label={label ?? `${item.kind} preview of ${item.name}`} preserveAspectRatio={`xMidYMid ${fit}`} style={{ display: 'block' }}>
      {item.kind === 'screenshot' && (
        <g>
          <rect width="320" height="200" fill={c.neutral[50]} />
          <rect width="320" height="24" fill={c.neutral[200]} />
          <circle cx="14" cy="12" r="4" fill={c.accent.red[400]} />
          <circle cx="28" cy="12" r="4" fill={c.accent.orange[300]} />
          <circle cx="42" cy="12" r="4" fill={c.accent.green[400]} />
          <rect x="16" y="38" width="96" height="14" rx="3" fill={c.brand[300]} />
          <rect x="16" y="62" width="130" height="8" rx="3" fill={c.neutral[200]} />
          <rect x="16" y="78" width={90 + a} height="8" rx="3" fill={c.neutral[200]} />
          <rect x="16" y="94" width="110" height="8" rx="3" fill={c.neutral[200]} />
          <rect x="168" y="38" width="136" height="100" rx="6" fill={c.base.white} stroke={c.neutral[200]} />
          <polyline points={`176,${120 - a} 206,${96 + (b % 20)} 236,${108 - (a % 16)} 266,${72 + (b % 14)} 296,${84 - (a % 12)}`} fill="none" stroke={c.brand[500]} strokeWidth="3" strokeLinejoin="round" />
          <rect x="16" y="150" width="288" height="32" rx="6" fill={c.brand[50]} />
          <rect x="28" y="162" width={80 + b} height="8" rx="3" fill={c.brand[300]} />
        </g>
      )}
      {item.kind === 'file' && (
        <g>
          <rect width="320" height="200" fill={c.neutral[100]} />
          <path d="M96 20 H196 L232 56 V180 H96 Z" fill={c.base.white} stroke={c.neutral[300]} strokeWidth="2" />
          <path d="M196 20 V56 H232" fill={c.neutral[100]} stroke={c.neutral[300]} strokeWidth="2" />
          <rect x="112" y="72" width="104" height="6" rx="3" fill={c.neutral[300]} />
          <rect x="112" y="88" width={70 + (a % 34)} height="6" rx="3" fill={c.neutral[200]} />
          <rect x="112" y="104" width="104" height="6" rx="3" fill={c.neutral[200]} />
          <rect x="112" y="120" width={60 + (b % 40)} height="6" rx="3" fill={c.neutral[200]} />
          <rect x="112" y="142" width="46" height="20" rx="4" fill={c.brand[500]} />
          <text x="135" y="156" textAnchor="middle" fontSize="11" fontFamily="Inter, sans-serif" fill={c.base.white}>
            {ext}
          </text>
        </g>
      )}
      {item.kind === 'video' && (
        <g>
          <rect width="320" height="200" fill={c.neutral[900]} />
          <rect x="0" y="0" width="320" height="200" fill={c.brand[900]} opacity="0.5" />
          <circle cx="160" cy="92" r="30" fill={c.base.white} opacity="0.9" />
          <polygon points="150,76 150,108 178,92" fill={c.neutral[900]} />
          <rect x="24" y="164" width="272" height="6" rx="3" fill={c.neutral[600]} />
          <rect x="24" y="164" width={60 + b * 3} height="6" rx="3" fill={c.brand[400]} />
          <circle cx={84 + b * 3} cy="167" r="6" fill={c.base.white} />
        </g>
      )}
      {item.kind === 'snapshot' && (
        <g>
          <rect width="320" height="200" fill={c.accent.blue[100]} />
          <circle cx={230 - a} cy="52" r="22" fill={c.accent.orange[300]} />
          <path d={`M0 150 Q80 ${96 + b} 160 140 T320 ${124 + (a % 20)} V200 H0 Z`} fill={c.accent.green[300]} />
          <path d={`M0 176 Q100 ${140 + (a % 24)} 200 172 T320 160 V200 H0 Z`} fill={c.accent.green[500]} />
          <rect x="12" y="12" width="28" height="20" rx="4" fill="none" stroke={c.base.white} strokeWidth="2" />
          <circle cx="26" cy="22" r="5" fill="none" stroke={c.base.white} strokeWidth="2" />
        </g>
      )}
      {item.aiCaptured && (
        <g>
          <rect x="262" y="8" width="50" height="20" rx="10" fill={c.base.white} stroke={c.brand[400]} />
          <text x="287" y="22" textAnchor="middle" fontSize="11" fontFamily="Inter, sans-serif" fill={c.brand[700]}>
            AI
          </text>
        </g>
      )}
    </svg>
  );
}
