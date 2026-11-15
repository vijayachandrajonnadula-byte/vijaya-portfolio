import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '../../actions/Button/Button';
import { Notification } from './Notification';
import type { NotificationColor } from './Notification';

const colors: NotificationColor[] = ['blue', 'green', 'orange', 'red'];

export default function NotificationDemo() {
  const [snack, setSnack] = useState(false);
  return (
    <Stack spacing={3}>
      {(['leftStroke', 'fill'] as const).map((variant) => (
        <Box key={variant}>
          <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>{`variant=${variant}: bottom actions (left column) / right actions (right column)`}</Typography>
          <Stack direction="row" spacing={2}>
            <Stack spacing={1.5} sx={{ width: 520 }}>
              {colors.map((c) => (
                <Notification key={c} variant={variant} color={c} title={`${c} notification`} body="Supporting message goes here." showClose footer={<><Button size="xsmall" variant="text">Undo</Button><Button size="xsmall" variant="outlined">Dismiss</Button></>} />
              ))}
            </Stack>
            <Stack spacing={1.5} sx={{ width: 520 }}>
              {colors.map((c) => (
                <Notification key={c} variant={variant} color={c} title={`${c} notification`} body="Supporting message goes here." showClose actionsPlacement="right" footer={<><Button size="xsmall" variant="text">Undo</Button><Button size="xsmall" variant="outlined">Dismiss</Button></>} />
              ))}
            </Stack>
          </Stack>
        </Box>
      ))}
      <Box>
        <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>Title only, no icon; snackbar</Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Notification title="Saved" color="green" showIcon={false} />
          <Button size="small" onClick={() => setSnack(true)}>Show snackbar</Button>
          <Notification isSnackbar open={snack} duration={4000} handleClose={() => setSnack(false)} title="Snackbar" body="Auto closes after 4s." color="blue" showClose />
        </Stack>
      </Box>
    </Stack>
  );
}
