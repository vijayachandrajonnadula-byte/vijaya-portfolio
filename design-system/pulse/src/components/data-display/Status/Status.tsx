// Figma: Status page, set "Status" (Variant Chip | Text with badge | Text | Text with icon x Color).
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import { Chip } from '../Chip/Chip';
import { chipPalette } from '../../_shared/families';
import type { FamilyColor } from '../../_shared/families';
import { textStyle } from '../../../theme/pulseTokens';

export interface StatusProps {
  label: ReactNode;
  /** @default "gray" */
  color?: FamilyColor;
  /**
   * chip: stroke chip. textWithBadge: dot + text. text: coloured text. textWithIcon: icon + text.
   * @default "text"
   */
  type?: 'text' | 'chip' | 'textWithBadge' | 'textWithIcon';
  /** Used by `textWithIcon` (default: alert glyph). */
  icon?: ReactNode;
}

const AI = 'linear-gradient(45deg, #bd06be 0%, #653fda 50%, #158eef 100%)';
// Figma Status text colours / dot colours / icon colours per colour variant.
const textColor: Record<string, string> = {
  green: '#15803d', dark_gray: '#566680', gray: '#5f6f86', red: '#dc2626', orange: '#b45309',
  blue: '#2563eb', purple: '#7c3aed', cyan: '#0e7490', teal: '#0f766e',
};
const dotColor: Record<string, string> = {
  green: '#22c55e', dark_gray: '#566680', gray: '#cbd5e1', red: '#ef4444', orange: '#f59e0b',
  blue: '#2563eb', purple: '#8b5cf6', cyan: '#06b6d4', teal: '#14b8a6', ai: '#1e293b',
};

/** Status indicator for table cells and headers. Text is 11/20 semibold (Figma textContent Weight=Semibold). */
export function Status({ label, color = 'gray', type = 'text', icon }: StatusProps) {
  if (type === 'chip') return <Chip label={label} color={color} variant="stroke" shape="pill" size="xsmall" />;
  const isAi = color === 'ai';
  const fallback = chipPalette[(color in chipPalette ? color : 'gray') as keyof typeof chipPalette];
  const text = textColor[color] ?? fallback.text;
  const dot = dotColor[color] ?? fallback.dot;
  const labelSx = isAi && type === 'text'
    ? { backgroundImage: AI, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }
    : { color: type === 'text' ? text : '#0f172a' }; // Figma: only Variant=Text colours the label; badge/icon variants keep Primary text
  return (
    <Box
      component="span"
      data-spec={`status ${type}`}
      sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', py: '2px', whiteSpace: 'nowrap', ...textStyle('textM', 'semiBold') }}
    >
      {type === 'textWithBadge' && <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: dot }} />}
      {type === 'textWithIcon' && (
        <Box component="span" sx={{ display: 'inline-flex', color: dot, '& svg': { width: 16, height: 16 } }}>
          {icon ?? <ErrorOutlineRounded />}
        </Box>
      )}
      <Box component="span" sx={labelSx}>{label}</Box>
    </Box>
  );
}

