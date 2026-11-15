import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Status } from './Status';
import type { StatusProps } from './Status';
import type { FamilyColor } from '../../_shared/families';

const colors: FamilyColor[] = ['green', 'dark_gray', 'gray', 'red', 'orange', 'blue', 'purple', 'cyan', 'teal', 'ai'];
const types: NonNullable<StatusProps['type']>[] = ['chip', 'textWithBadge', 'text', 'textWithIcon'];

/** Status: 4 types x 10 colours (Text with icon exists in Figma for green, red, orange). */
export default function StatusDemo() {
  return (
    <Stack spacing={1.5}>
      {types.map((t) => (
        <Stack key={t} direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
          <Typography variant="textS" sx={{ width: 110 }}>{t}</Typography>
          {colors.filter((c) => t !== 'textWithIcon' || ['green', 'orange', 'red'].includes(c)).map((c) => <Status key={c} type={t} color={c} label={c.replace('_', ' ')} />)}
        </Stack>
      ))}
    </Stack>
  );
}
