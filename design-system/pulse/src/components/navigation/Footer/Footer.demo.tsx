import Stack from '@mui/material/Stack';
import { Footer } from './Footer';

/** Footer: default and without chip. */
export default function FooterDemo() {
  return (
    <Stack spacing={2}>
      <Footer />
      <Footer chipLabel={null} text="Confidential" />
    </Stack>
  );
}

