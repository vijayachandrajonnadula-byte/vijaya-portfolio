import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import DiamondOutlined from '@mui/icons-material/DiamondOutlined';
import { Accordion, AccordionGroup } from './Accordion';

const Label = ({ children }: { children: string }) => (
  <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>
    {children}
  </Typography>
);
const body = <Typography variant="textL">Accordion body slot: any content goes here.</Typography>;

export default function AccordionDemo() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 560 }}>
      <Box>
        <Label>Sizes: small (54) / medium (58) / large (62), collapsed and expanded (hover a header for the hover state)</Label>
        <Stack spacing={1}>
          {(['small', 'medium', 'large'] as const).map((s) => (
            <Stack key={s} spacing={1}>
              <Accordion size={s} summary={`Accordion ${s}`} metadata="Metadata line" >{body}</Accordion>
              <Accordion size={s} summary={`Accordion ${s} (active)`} metadata="Metadata line" defaultOpen>{body}</Accordion>
            </Stack>
          ))}
        </Stack>
      </Box>
      <Box>
        <Label>Disabled (38%)</Label>
        <Accordion summary="Disabled accordion" metadata="Cannot be toggled" disabled>{body}</Accordion>
      </Box>
      <Box>
        <Label>Optional elements: left icon + chips / number badge + delete / right icon / edit title (pencil, then Enter to confirm)</Label>
        <Stack spacing={1}>
          <Accordion summary="Left icon + chips" icon={<DiamondOutlined />} chips={[{ label: 'Draft' }, { label: 'Open', color: 'green' }]}>{body}</Accordion>
          <Accordion summary="Number badge + delete" badgeContent={4} onDelete={() => undefined}>{body}</Accordion>
          <Accordion summary="Right other icon" endIcon={<AutoAwesomeOutlined />} metadata="With metadata">{body}</Accordion>
          <Accordion summary="Editable title" onTitleChange={() => undefined} metadata="Press the pencil">{body}</Accordion>
          <Accordion summary="All optional elements" metadata="Metadata" icon={<DiamondOutlined />} chips={[{ label: 'New' }]} endIcon={<AutoAwesomeOutlined />} onTitleChange={() => undefined} onDelete={() => undefined} badgeContent={12}>{body}</Accordion>
          <Accordion border="no-fill" summary="no-fill header" metadata="transparent until hover">{body}</Accordion>
        </Stack>
      </Box>
      <Box>
        <Label>Vertical orientation (body expands sideways)</Label>
        <Stack direction="row" spacing={2} sx={{ height: 340 }}>
          <Accordion orientation="vertical" summary="Collapsed vertical" metadata="Meta">{body}</Accordion>
          <Accordion orientation="vertical" summary="Expanded vertical" defaultOpen>{body}</Accordion>
        </Stack>
      </Box>
      <Box>
        <Label>AccordionGroup (exclusive)</Label>
        <AccordionGroup exclusive defaultOpenIds={['a']} items={[{ id: 'a', summary: 'First', children: body }, { id: 'b', summary: 'Second', children: body }, { id: 'c', summary: 'Third', children: body }]} />
      </Box>
      <Box>
      </Box>
    </Stack>
  );
}

