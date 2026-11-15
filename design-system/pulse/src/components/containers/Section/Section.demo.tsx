import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '../../actions/Button/Button';
import { Section } from './Section';

export default function SectionDemo() {
  return (
    <Stack spacing={2} sx={{ maxWidth: 640 }}>
      <Section title="Basic details" metadata="General information">
        <Typography variant="textL">Section body content.</Typography>
      </Section>
      <Section title="With action" rightSlot={<Button size="small" variant="outlined">Edit</Button>}>
        <Typography variant="textL">Right slot in the header.</Typography>
      </Section>
      <Section title="Collapsible" collapsible>
        <Typography variant="textL">Click the chevron to collapse.</Typography>
      </Section>
      <Section title="Collapsed by default" collapsible defaultCollapsed>
        <Typography variant="textL">Hidden.</Typography>
      </Section>
    </Stack>
  );
}
