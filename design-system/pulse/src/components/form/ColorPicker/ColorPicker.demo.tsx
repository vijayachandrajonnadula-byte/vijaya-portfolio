import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ColorPicker, ColorSelector } from './ColorPicker';

const palette = ['#000000', '#B91C1C', '#EF4444', '#F59E0B', '#FACC15', '#22C55E', '#15803D', '#06B6D4', '#3B82F6', '#1E3A6E', '#9751F2', '#EC4899', '#566680', '#CBD5E1', '#F1F5F9', '#FFFFFF'];
const recent = ['#000000', '#B91C1C', '#DC2626', '#F59E0B', '#22C55E', '#3B82F6', '#9751F2'];

/** Color Picker (all options, per entry mode, minimal) and Color Selector swatch grids (square, bordered, circle). */
export default function ColorPickerDemo() {
  const [c, setC] = useState('#9751F2');
  const [s, setS] = useState('#EF4444');
  return (
    <Stack spacing={3}>
      <Stack direction="row" useFlexGap sx={{ gap: 3, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Stack spacing={1}>
          <Typography variant="textM" color="text.secondary">all options (RGB)</Typography>
          <ColorPicker value={c} onChange={setC} recentColors={recent} onApply={() => {}} onCancel={() => {}} />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="textM" color="text.secondary">HEX entry, circle recents</Typography>
          <ColorPicker mode="HEX" recentColors={recent} swatchShape="circle" onApply={() => {}} onCancel={() => {}} />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="textM" color="text.secondary">HSB, inputs only</Typography>
          <ColorPicker mode="HSB" eyeDropper={false} />
        </Stack>
      </Stack>
      <Stack direction="row" useFlexGap sx={{ gap: 3, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Stack spacing={1}>
          <Typography variant="textM" color="text.secondary">Color Selector</Typography>
          <ColorSelector colors={palette} value={s} onChange={setS} />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="textM" color="text.secondary">with border</Typography>
          <ColorSelector colors={palette.slice(0, 6)} value={s} onChange={setS} bordered gap={8} />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="textM" color="text.secondary">circle</Typography>
          <ColorSelector colors={palette.slice(0, 8)} value={s} onChange={setS} shape="circle" />
        </Stack>
      </Stack>
    </Stack>
  );
}
