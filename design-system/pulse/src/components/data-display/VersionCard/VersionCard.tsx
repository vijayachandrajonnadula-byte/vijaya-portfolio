// Figma: Data Grid page, `BuildingBlocks/version-detail-card` (Show Option Collapsed 48 / Expanded 148).
// One card of the pair: bordered tinted card, header row (label + version Select + highlight slot), detail rows when expanded.
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRounded from '@mui/icons-material/ExpandLessRounded';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Select } from '../../form/Select/Select';
import type { SelectOption } from '../../form/Select/Select';
import { FieldLabel, ReadOnlyValue } from '../../form/TextFormat/TextFormat';
import { highlighterColors } from '../Highlighter/Highlighter';
import type { HighlighterColor } from '../Highlighter/Highlighter';

export interface VersionDetail {
  label: ReactNode;
  value: ReactNode;
}

export interface VersionCardProps {
  /** Card tint: blue = Current version, yellow = Previous version in Figma. @default "blue" */
  color?: HighlighterColor;
  /** Header label. @default "Version" */
  label?: ReactNode;
  /** Version dropdown. */
  versions: (SelectOption | string)[];
  version?: string;
  onVersionChange?: (version: string) => void;
  /** Show Option: false = Collapsed, true = Expanded. @default false */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Rows shown when expanded (label / read-only value). */
  details?: VersionDetail[];
  /** The 56x32 highlight colour control that sits right of the dropdown. */
  highlight?: ReactNode;
}

export function VersionCard({ color = 'blue', label = 'Version', versions, version, onVersionChange, expanded = false, onExpandedChange, details = [], highlight }: VersionCardProps) {
  const c = highlighterColors[color];
  return (
    <Box
      data-spec={expanded ? 'version-card-expanded' : 'version-card-collapsed'}
      sx={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: expanded ? '8px' : 0, justifyContent: 'center', padding: '8px 16px', borderRadius: '8px', background: c.bg, border: `1px solid ${c.border}`, minWidth: 0, width: '100%' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', height: 32 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0 }}>
          <FieldLabel>{label}</FieldLabel>
          <IconButton ariaLabel={expanded ? 'Collapse details' : 'Expand details'} size="small" variant="plain" onClick={() => onExpandedChange?.(!expanded)} aria-expanded={expanded}>
            {expanded ? <ExpandLessRounded /> : <ExpandMoreRounded />}
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Select fullWidth size="small" options={versions} value={version} onChange={(v) => onVersionChange?.(Array.isArray(v) ? (v[0] ?? '') : v)} />
          </Box>
          {highlight}
        </Box>
      </Box>
      {expanded && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {details.map((d, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', minHeight: 20 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}><FieldLabel>{d.label}</FieldLabel></Box>
              <Box sx={{ flex: 1, minWidth: 0 }}><ReadOnlyValue>{d.value}</ReadOnlyValue></Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
