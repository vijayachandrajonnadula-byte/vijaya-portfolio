// Figma: Data Grid page, `statusFilterv2` (row: Total pill + 1x16 divider + colour pills) built from
// `BuildingBlocks/atomStatusFilterv2` (Size x Variant x Interaction Default/Selected/Focus).
// The older `BuildingBlocks/statusFilter` / `statusFilterVercel` sets are the previous generation (see report).
import { role } from '../../../theme/typography';
import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/material/Box';
import type { FamilyColor } from '../../_shared/families';

export interface StatusFilterItem {
  status: string;
  count: number;
  color?: FamilyColor;
}
/** Figma atomStatusFilterv2 Size. */
export type StatusFilterSize = 'small' | 'medium' | 'large';

export interface StatusFilterBarProps {
  items: StatusFilterItem[];
  /** Selected status; `null` selects the Total pill. */
  activeStatus: string | null;
  onStatusChange: (status: string | null) => void;
  /** Total shown on the Total pill. Summed from `items` when omitted. */
  totalCount?: number;
  /** @default "Total" */
  totalLabel?: string;
  /** @default true */
  showTotal?: boolean;
  /** @default "small" */
  size?: StatusFilterSize;
}

/** Selected-state colours per atomStatusFilterv2 Variant (uiElements/statusFilter v2/color/selected*). */
const selected: Record<string, { bg: string; border: string; text: string }> = {
  green: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  orange: { bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
  blue: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  dark_gray: { bg: '#f8fafc', border: '#e2e8f0', text: '#334155' },
  gray: { bg: '#fcfcfd', border: '#e2e8f0', text: '#5f6f86' },
  red: { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' },
  purple: { bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
  cyan: { bg: '#ecfeff', border: '#a5f3fc', text: '#06b6d4' },
  teal: { bg: '#f0fdfa', border: '#99f6e4', text: '#0f766e' },
  yellow: { bg: '#fefce8', border: '#fef08a', text: '#a16207' },
};
const fallback = selected.gray as { bg: string; border: string; text: string };
const ink = '#0a162a';
const totalSelectedBg = '#1e3a6e';
const totalStroke = '#e2e8f0';
/** Figma Focus: drop(0 0 0 3 #3b82f6) + drop(0 0 0 1 #fff). */
const focus = '0 0 0 1px #ffffff, 0 0 0 4px #3b82f6';

/** Total pill (r 4/6/8) and colour pill (r full) boxes: height, vertical/horizontal padding. */
const total = { small: { h: 28, py: 4, px: 8, r: 4 }, medium: { h: 32, py: 6, px: 10, r: 6 }, large: { h: 36, py: 8, px: 12, r: 8 } } as const;
const tone = { small: { h: 24, py: 2, px: 8 }, medium: { h: 28, py: 4, px: 10 }, large: { h: 32, py: 6, px: 12 } } as const;

const text = { fontFamily: 'Inter, sans-serif', fontSize: 12, lineHeight: '20px' } as const;

/** Row of count pills used to filter a list by status. */
export function StatusFilterBar({ items, activeStatus, onStatusChange, totalCount, totalLabel = 'Total', showTotal = true, size = 'small' }: StatusFilterBarProps) {
  const rows = items.filter((i) => i.status !== 'Total');
  const sum = totalCount ?? rows.reduce((n, i) => n + i.count, 0);

  const totalPill = () => {
    const d = total[size];
    const on = activeStatus === null;
    const color = on ? '#ffffff' : ink;
    return (
      <ButtonBase
        key="__total"
        data-spec={`total-${size}`}
        onClick={() => onStatusChange(null)}
        aria-pressed={on}
        sx={{
          flex: 'none',
          height: d.h,
          gap: '4px',
          padding: `${d.py}px ${d.px}px`,
          borderRadius: `${d.r}px`,
          background: on ? totalSelectedBg : 'transparent',
          boxShadow: on ? 'none' : `inset 0 0 0 1px ${totalStroke}`,
          color,
          ...text,
          '&.Mui-focusVisible': { boxShadow: focus },
        }}
      >
        <Box component="span" sx={{ fontWeight: role.filterLabel }}>{totalLabel}</Box>
        <Box component="span" sx={{ fontWeight: role.filterCount }}>{sum}</Box>
      </ButtonBase>
    );
  };

  const tonePill = (i: StatusFilterItem) => {
    const d = tone[size];
    const on = activeStatus === i.status;
    const c = selected[i.color ?? 'gray'] ?? fallback;
    return (
      <ButtonBase
        key={i.status}
        data-spec={`pill-${size}`}
        onClick={() => onStatusChange(on ? null : i.status)}
        aria-pressed={on}
        sx={{
          flex: 'none',
          height: d.h,
          gap: '4px',
          padding: `${d.py}px ${d.px}px`,
          borderRadius: '1000px',
          background: on ? c.bg : 'transparent',
          boxShadow: on ? `inset 0 0 0 1px ${c.border}` : 'none',
          color: on ? c.text : ink,
          ...text,
          '&.Mui-focusVisible': { boxShadow: focus },
        }}
      >
        {/* Figma order for colour pills: count (textHeading) then label (textContent). */}
        <Box component="span" sx={{ fontWeight: role.filterCount, color: ink }}>{i.count}</Box>
        <Box component="span" sx={{ fontWeight: role.filterLabel }}>{i.status}</Box>
      </ButtonBase>
    );
  };

  return (
    <Box
      role="group"
      aria-label="Filter by status"
      sx={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '100%', overflowX: 'auto', p: '4px', m: '-4px' /* room for the 4px focus ring, which overflow would clip */, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
    >
      {showTotal && totalPill()}
      {showTotal && rows.length > 0 && <Box role="separator" aria-orientation="vertical" sx={{ flex: 'none', width: '1px', height: 16, background: totalStroke }} />}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{rows.map(tonePill)}</Box>
    </Box>
  );
}
