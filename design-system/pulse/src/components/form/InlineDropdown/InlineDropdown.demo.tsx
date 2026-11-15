import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { InlineDropdown } from './InlineDropdown';
import type { InlineDropdownInteraction } from './InlineDropdown';

const options = ['Deviation report', 'Change control', 'CAPA record', 'Audit finding'];
const states: InlineDropdownInteraction[] = ['default', 'hover', 'focus'];

/** Inline Dropdown: Variant (Page Title / Body) x Interaction (Default / Hover / Focus), plus one that opens. */
export default function InlineDropdownDemo() {
  return (
    <Stack spacing={3}>
      {(['pageTitle', 'body'] as const).map((variant) => (
        <Stack key={variant} spacing={1.5}>
          <Typography variant="textM" color="text.secondary">{variant}</Typography>
          <Stack direction="row" useFlexGap sx={{ gap: 5, alignItems: 'center', flexWrap: 'wrap' }}>
            {states.map((s) => (
              <Stack key={s} spacing={0.5}>
                <Typography variant="textS" color="text.secondary">{s}</Typography>
                <InlineDropdown variant={variant} interaction={s} options={options} defaultValue="Change control" />
              </Stack>
            ))}
            <Stack spacing={0.5}>
              <Typography variant="textS" color="text.secondary">disabled</Typography>
              <InlineDropdown variant={variant} options={options} defaultValue="Change control" disabled />
            </Stack>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
