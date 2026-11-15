import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '../../actions/Button/Button';
import { Chip } from '../../data-display/Chip/Chip';
import { SidePanel } from './SidePanel';

function Demo({ position }: { position: 'left' | 'right' }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Stack spacing={1}>
      <Typography variant="textS" color="text.secondary">{position} (click the circle to collapse)</Typography>
      <Box sx={{ height: 420, display: 'flex', flexDirection: position === 'left' ? 'row' : 'row-reverse', background: '#f1f1f2', width: 560 }}>
        <SidePanel
          position={position}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          title="Panel title"
          titleAdornment={<Chip label="Active" color="green" size="xsmall" />}
          onClose={() => setCollapsed(true)}
          footerLeft={<Typography variant="textS" color="text.secondary">3 items</Typography>}
          footerRight={<><Button variant="text" size="small">Cancel</Button><Button variant="outlined" size="small">Apply</Button></>}
        >
          <Box sx={{ flex: 1, border: '1px dashed #6d28d9', background: '#fcfaff', borderRadius: '8px', display: 'grid', placeItems: 'center', color: '#6d28d9', fontSize: 12 }}>Slot content</Box>
        </SidePanel>
      </Box>
    </Stack>
  );
}

/** SidePanel: left / right, expanded and collapsed. */
export default function SidePanelDemo() {
  return (
    <Stack direction="row" spacing={4} useFlexGap sx={{ flexWrap: 'wrap' }}>
      <Demo position="left" />
      <Demo position="right" />
    </Stack>
  );
}
