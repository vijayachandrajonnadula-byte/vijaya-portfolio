// Pulse "KPICard" page: KPI Card (Color x Interaction). 294x88, radius 6, 4px left stroke in the accent colour,
// inner container pad 12/16 with a 1px #d3e0f2 border, 40x40 icon tile (radius 4), value + two meta lines, optional progress donut.
import { fw } from '../../../theme/typography';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import KnowledgeIcon from '@mui/icons-material/MenuBookOutlined';
import { focusRing, pt } from '../../../theme/pulseTokens';

const kpi = pt.uiElements.kpi;
const aiGradient = 'linear-gradient(87deg, #bd06be 0%, #653fda 50%, #158eef 100%)';
const aiTile = 'linear-gradient(45deg, #f8e6f8 0%, #f0ecfb 50%, #e8f4fd 100%)';
/** Icon colours from the spec (icon overrides in KPI Card). */
const iconColor = { default: '#4c5661', green: '#2d872b', blue: '#2eb0cc', orange: '#d97706', red: '#dc2626', purple: '#7c3aed', yellow: '#ca8a04' } as const;

export type KPICardColor = 'default' | 'green' | 'orange' | 'red' | 'blue' | 'purple' | 'yellow' | 'ai' | 'custom';

export interface KPICardProps {
  /** Metric name (first meta line). */
  label: ReactNode;
  value: ReactNode;
  /** Accent colour for the left stroke and icon tile. @default "default" */
  color?: KPICardColor;
  /** Hex colour used when color="custom". */
  customColor?: string;
  /** Icon in the tile. Defaults to a book icon like the Figma component. */
  icon?: ReactNode;
  /** Second meta line, e.g. "+4 this week". */
  caption?: ReactNode;
  /** 0-100. Shows the progress donut at the left. */
  progress?: number;
  onClick?: () => void;
  /** Hides the icon tile. */
  hideIcon?: boolean;
}

function Donut({ value }: { value: number }) {
  const r = 31;
  const c = 2 * Math.PI * r;
  return (
    <svg width="66" height="66" viewBox="0 0 66 66" aria-hidden style={{ flexShrink: 0 }}>
      <circle cx="33" cy="33" r={r} fill="none" stroke={pt.colors.brand[50]} strokeWidth="4" />
      <circle cx="33" cy="33" r={r} fill="none" stroke={pt.colors.brand[500]} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(c * value) / 100} ${c}`} transform="rotate(-90 33 33)" />
      <text x="33" y="37" textAnchor="middle" fontSize="12" fontWeight="fw.semiBold" fill={kpi.color.value}>{Math.round(value)}%</text>
    </svg>
  );
}

/** Single-metric tile. */
export function KPICard({ label, value, color = 'default', customColor = '#ea08a6', icon, caption, progress, onClick, hideIcon }: KPICardProps) {
  const accent = color === 'ai' ? aiGradient : color === 'custom' ? customColor : kpi.color[color].border;
  const tile = color === 'ai' ? aiTile : color === 'custom' ? `${customColor}12` : kpi.color[color].iconBackground;
  const glyph = color === 'ai' ? '#653fda' : color === 'custom' ? customColor : iconColor[color];
  const interactive = Boolean(onClick);
  return (
    <Box
      component={interactive ? ButtonBase : 'div'}
      onClick={onClick}
      data-spec={`kpi ${color}`}
      sx={{
        position: 'relative',
        display: 'block',
        textAlign: 'left',
        width: 294,
        minHeight: 88,
        boxSizing: 'border-box',
        background: pt.colors.base.white,
        borderRadius: pt.radius.s,
        overflow: 'hidden',
        transition: 'box-shadow 120ms',
        '&::before': { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: accent, zIndex: 1 },
        '&.Mui-focusVisible': { boxShadow: focusRing },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: pt.spacing.xl, boxSizing: 'border-box', minHeight: 88, padding: `calc(${kpi.padding.paddingTB} - 1px) calc(${kpi.padding.paddingLR} - 1px)`, border: '1px solid #d3e0f2', borderRadius: pt.radius.s }}>
        {progress != null && <Donut value={progress} />}
        {!hideIcon && (
          <Box sx={{ width: 40, height: 40, boxSizing: 'border-box', padding: pt.spacing.m, borderRadius: pt.radius.xs, background: tile, color: glyph, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, '& svg': { fontSize: 24, ...(color === 'ai' && { fill: '#653fda' }) } }}>
            {icon ?? <KnowledgeIcon />}
          </Box>
        )}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ fontFamily: "Figtree, 'Inter Variable', Inter, sans-serif", fontSize: 24, lineHeight: '28px', fontWeight: fw.semiBold, color: kpi.color.value }}>{value}</Box>
          <Box sx={{ fontSize: 12, lineHeight: '18px', color: kpi.color.label }}>{label}</Box>
          {caption && <Box sx={{ fontSize: 12, lineHeight: '18px', color: kpi.color.label }}>{caption}</Box>}
        </Box>
      </Box>
    </Box>
  );
}

