import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Header } from './Header';

const region = { value: 'Chennai', time: '12:00 AM EST', options: [{ value: 'Chennai' }, { value: 'New Jersey' }] };
const profile = { name: 'Administrator', job: 'Quality site', options: [{ value: 'settings' }, { value: 'logout' }] };

/** Header: desktop (full), tablet, mobile; notification badge, suite/actions buttons, region + profile menus. */
export default function HeaderDemo() {
  return (
    <Stack spacing={2}>
      <Typography variant="textM" color="text.secondary">Desktop</Typography>
      <Header showSuite showNotification showNotificationBadge showActions showRegion showProfile showAvatar region={region} profile={profile} />
      <Typography variant="textM" color="text.secondary">Desktop, minimal (logo + profile)</Typography>
      <Header showProfile profile={profile} />
      <Typography variant="textM" color="text.secondary">Tablet (768)</Typography>
      <Box sx={{ width: 768 }}><Header variant="tablet" showNotification showNotificationBadge showRegion showProfile region={region} profile={profile} /></Box>
      <Typography variant="textM" color="text.secondary">Mobile (360)</Typography>
      <Box sx={{ width: 360 }}><Header variant="mobile" showNotification showRegion showProfile region={region} profile={profile} /></Box>
    </Stack>
  );
}
