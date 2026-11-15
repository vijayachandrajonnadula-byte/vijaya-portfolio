// Implements Figma page "Footer": component "Footer" (1440x28, #F6F8FC, pad 4/16, "Powered By" + wordmark left, text + blue chip right).
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Chip } from '../../data-display/Chip/Chip';
import { textStyle } from '../../../theme/pulseTokens';
import { FooterLogoVector } from '../Header/Logos';

export interface FooterProps {
  /** @default "Powered By" */
  poweredByLabel?: string;
  /** Replaces the default wordmark. */
  logo?: ReactNode;
  /** Right side text, e.g. a copyright line. */
  text?: ReactNode;
  /** Blue chip beside the text, e.g. a version. Omit to hide. */
  chipLabel?: ReactNode;
}

const text = { ...textStyle('textS', 'regular'), fontSize: 12, lineHeight: '20px', color: '#0f172a' } as const;

/** Application footer bar, 28px tall. */
export function Footer({ poweredByLabel = 'Powered By', logo, text: right = '\u00a9 2026 PULSE design system', chipLabel = 'PULSE v2.0' }: FooterProps) {
  return (
    <Box component="footer" data-spec="footer" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 28, boxSizing: 'border-box', px: '16px', py: '4px', background: '#f6f8fc', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Box component="span" sx={text}>{poweredByLabel}</Box>
        {logo ?? <FooterLogoVector data-spec="footer logo" aria-label="PULSE" />}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Box component="span" sx={text}>{right}</Box>
        {chipLabel != null && <Chip label={chipLabel} color="blue" shape="rectangle" size="xxsmall" />}
      </Box>
    </Box>
  );
}

