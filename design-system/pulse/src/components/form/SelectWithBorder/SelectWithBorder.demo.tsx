import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AutocompleteWithBorder, SelectWithBorder } from './SelectWithBorder';
import { Caption } from '../../_shared/ForceState';

const options = ['QA Team', 'CMC Team', 'Manufacturing', 'Quality Control', 'Regulatory Affairs', 'Validation'];

/** .SelectwithBorder and .AutocompletewithBorder: State (Default / Expanded) x Label Position (Top / Left). */
export default function SelectWithBorderDemo() {
  return (
    <Stack spacing={3}>
      {([['SelectWithBorder', SelectWithBorder], ['AutocompleteWithBorder', AutocompleteWithBorder]] as const).map(([name, C]) => (
        <Stack key={name} spacing={1.5}>
          <Caption>{name}</Caption>
          <Box sx={{ display: 'grid', gridTemplateColumns: '240px 480px', gap: '32px', alignItems: 'start' }}>
            <C label="Default, top" options={options} defaultValue={['QA Team']} hint="Helper text" />
            <C label="Default, left" labelPosition="left" options={options} hint="Helper text" />
            <Box sx={{ minHeight: 270 }}>
              <C label="Expanded, top" options={options} defaultExpanded defaultValue={['QA Team', 'Validation']} />
            </Box>
            <Box sx={{ minHeight: 270 }}>
              <C label="Expanded, left" labelPosition="left" options={options} defaultExpanded defaultValue={['Manufacturing']} />
            </Box>
          </Box>
        </Stack>
      ))}
      <Caption>Single choice, disabled</Caption>
      <Stack direction="row" spacing={4}>
        <Box sx={{ width: 240 }}><SelectWithBorder label="Single" options={options.slice(0, 3)} multiple={false} /></Box>
        <Box sx={{ width: 240 }}><SelectWithBorder label="Disabled" options={options} disabled /></Box>
      </Stack>
    </Stack>
  );
}
