// Pulse "Charts & Cards" page, loose component ".Building Blocks/Charts Y-Axis/.Building Blocks/Charts Header":
// 32px row = optional drag handle (hidden), Title (Sub Heading 3 + optional Meta Data subtitle), Filter Options (Filter label + IconButton, More button).
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { pt, textStyle } from '../../../theme/pulseTokens';

export interface ChartHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Filter label (e.g. "Filter"); renders next to `filterAction`. */
  filterLabel?: ReactNode;
  /** Usually an IconButton (size small, shape square, plain). */
  filterAction?: ReactNode;
  /** Trailing "More" button. */
  moreAction?: ReactNode;
  /** Drag handle slot (hidden in the Figma default). */
  dragHandle?: ReactNode;
}

export function ChartHeader({ title, subtitle, filterLabel, filterAction, moreAction, dragHandle }: ChartHeaderProps) {
  return (
    <Box data-spec="chart-header" sx={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: 32, width: '100%' }}>
      {dragHandle}
      <Box sx={{ flex: 1, minWidth: 0, pr: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ ...textStyle('heading6', 'medium'), fontSize: 18, lineHeight: '24px', color: pt.formElements.headings.defaultTextColor }}>{title}</Box>
        {subtitle != null && <Box sx={{ ...textStyle('textS'), color: pt.formElements.content.metaDataTextColor }}>{subtitle}</Box>}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
        {(filterLabel != null || filterAction != null) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {filterLabel != null && <Box sx={{ ...textStyle('textM'), color: pt.formElements.content.primaryTextColor }}>{filterLabel}</Box>}
            {filterAction}
          </Box>
        )}
        {moreAction}
      </Box>
    </Box>
  );
}
