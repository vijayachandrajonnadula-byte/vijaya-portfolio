import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '../../actions/Button/Button';
import { Link } from '../../data-display/Link/Link';
import { Popover, PopoverContent } from './Popover';
import type { ArrowPosition } from './Popover';

const arrows: ArrowPosition[] = ['none', 'top-left', 'top-middle', 'top-right', 'bottom-left', 'bottom-middle', 'bottom-right', 'left-top', 'left-middle', 'left-bottom', 'right-top', 'right-middle', 'right-bottom'];
const body = 'Lorem ipsum dolor sit amet consectetur. Hendrerit quam diam justo malesuada lorem pulvinar.';

/** Popover: Outline and Filled panels in all 12 arrow positions, plus the live MUI-positioned popover. */
export default function PopoverDemo() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <Stack spacing={3}>
      {(['outline', 'filled'] as const).map((v) => (
        <Stack key={v} direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 4, p: 2, borderRadius: 1, bgcolor: v === 'filled' ? '#f8fafc' : undefined }}>
          <Typography variant="textS" sx={{ width: '100%' }}>{v}</Typography>
          {arrows.map((a) => (
            <Stack key={a} spacing={0.5}>
              <Typography variant="textS">{a}</Typography>
              <PopoverContent
                variant={v}
                arrow={a}
                title="Title"
                onClose={() => undefined}
                actions={
                  <>
                    <Link background={v === 'filled' ? 'dark' : 'light'} href="#x">Hyperlink</Link>
                    <Stack direction="row" spacing={0.5}><Button size="xsmall" variant="text" sx={v === 'filled' ? { color: '#fff' } : undefined}>Button 2</Button><Button size="xsmall" variant="outlined" sx={v === 'filled' ? { color: '#fff', borderColor: '#fff' } : undefined}>Button 1</Button></Stack>
                  </>
                }
              >
                {body}
              </PopoverContent>
            </Stack>
          ))}
        </Stack>
      ))}
      <Button variant="outlined" sx={{ alignSelf: 'flex-start' }} onClick={(e) => setAnchor(e.currentTarget)}>Open live popover</Button>
      <Popover open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)} title="Live popover" showClose>{body}</Popover>
    </Stack>
  );
}
