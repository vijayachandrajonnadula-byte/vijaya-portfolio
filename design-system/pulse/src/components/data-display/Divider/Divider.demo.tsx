import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import { Divider } from './Divider';
import { IconButton } from '../../actions/IconButton/IconButton';

/** Divider: 3 line types x 3 sizes x 2 directions, plus Text Button and Button Only. */
export default function DividerDemo() {
  return (
    <Stack spacing={2.5} sx={{ maxWidth: 520 }}>
      {(['solid', 'dashed', 'dotted'] as const).map((t) => (
        <Stack key={t} spacing={1.5}>
          {(['small', 'medium', 'large'] as const).map((s) => (
            <Stack key={s} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Typography variant="textS" sx={{ width: 100 }}>{t} {s}</Typography>
              <Divider type={t} size={s} />
              <Stack direction="row" spacing={1} sx={{ height: 40 }}><Divider type={t} size={s} orientation="vertical" /></Stack>
            </Stack>
          ))}
        </Stack>
      ))}
      <Divider type="textButton">Button</Divider>
      <Divider type="buttonOnly">
        <IconButton ariaLabel="More" size="small"><MoreHorizRounded /></IconButton>
        <IconButton ariaLabel="Add" size="small"><AddRounded /></IconButton>
      </Divider>
      <Stack direction="row" spacing={2} sx={{ height: 64 }}>
        <Divider type="textButton" orientation="vertical">Go</Divider>
      </Stack>
    </Stack>
  );
}
