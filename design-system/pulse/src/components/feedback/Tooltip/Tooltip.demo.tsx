import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '../../actions/Button/Button';
import { Tooltip, TooltipContent } from './Tooltip';
import type { ArrowPosition } from './Tooltip';

const arrows: ArrowPosition[] = ['none', 'top-left', 'top-middle', 'top-right', 'bottom-left', 'bottom-middle', 'bottom-right', 'left-top', 'left-middle', 'left-bottom', 'right-top', 'right-middle', 'right-bottom'];

/** Tooltip: Outline / Filled x Single / Multi line x 12 arrow positions, plus live hover tooltips. */
export default function TooltipDemo() {
  return (
    <Stack spacing={3}>
      {(['outline', 'filled'] as const).map((v) => (
        <Stack key={v} spacing={2}>
          <Typography variant="textS">{v} single line</Typography>
          <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 3 }}>
            {arrows.map((a) => <TooltipContent key={a} variant={v} arrow={a}>Lorem ipsum dolor sit amet</TooltipContent>)}
          </Stack>
          <Typography variant="textS">{v} multi line</Typography>
          <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 3 }}>
            {arrows.map((a) => (
              <TooltipContent key={a} variant={v} arrow={a} heading="Title">Lorem ipsum dolor sit amet consectetur. Hendrerit quam diam justo malesuada lorem pulvinar.</TooltipContent>
            ))}
          </Stack>
        </Stack>
      ))}
      <Stack direction="row" spacing={2}>
        <Tooltip title="Filled tooltip" placement="top"><Button variant="outlined">Hover me</Button></Tooltip>
        <Tooltip title="Outline tooltip" variant="outline" placement="bottom"><Button variant="outlined">Outline</Button></Tooltip>
        <Tooltip heading="Heading" title="Multi line tooltip body text." placement="right"><Button variant="outlined">Multi line</Button></Tooltip>
      </Stack>
    </Stack>
  );
}
