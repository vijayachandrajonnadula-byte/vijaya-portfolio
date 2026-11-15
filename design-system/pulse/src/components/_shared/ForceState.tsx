import { fw } from '../../theme/typography';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { fieldColors, fieldFocusBorder } from './fieldStyles';
import type { FieldColor } from './fieldStyles';

/** Demo-only helper: paints the Hover / Active border of the input inside, so a static gallery can show those states. */
export function ForceState({ state, color = 'primary', children }: { state?: 'hover' | 'active'; color?: FieldColor; children: ReactNode }) {
  const border = state === 'hover' ? fieldColors[color].hover : state === 'active' ? fieldFocusBorder : undefined;
  return <Box sx={border ? { '& .MuiOutlinedInput-notchedOutline': { borderColor: `${border} !important` } } : undefined}>{children}</Box>;
}

/** Demo-only helper: small caption above a block. */
export function Caption({ children }: { children: ReactNode }) {
  return <Typography variant="textM" color="text.secondary" sx={{ fontWeight: fw.semiBold }}>{children}</Typography>;
}

/** Demo-only helper: titled section. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="heading6">{title}</Typography>
      {children}
    </Stack>
  );
}
