// Gallery of the Pulse icon library (Figma "Icons" page): searchable grid with size and colour controls.
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import * as all from '../../../icons/generated';
import * as extra from '../../../icons/figmaExtra';
import { iconList } from '../../../icons/iconList';
import type { PulseIconProps } from '../../../icons/createPulseIcon';
import type { ComponentType } from 'react';

const registry = { ...all, ...extra } as unknown as Record<string, ComponentType<PulseIconProps>>;
const colours = ['#1F2937', '#1d4ed8', '#dc2626', '#16a34a', '#d97706', '#7c3aed'];

export default function IconsDemo() {
  const [q, setQ] = useState('');
  const [size, setSize] = useState(24);
  const [colour, setColour] = useState(colours[0] as string);
  const [kind, setKind] = useState<'all' | 'stroke' | 'custom'>('all');
  const shown = useMemo(
    () => iconList.filter(([n, k]) => (kind === 'all' || k === kind) && n.toLowerCase().includes(q.toLowerCase())),
    [q, kind],
  );
  return (
    <Stack spacing={2}>
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
        <TextField size="small" label="Search icons" value={q} onChange={(e) => setQ(e.target.value)} />
        <ToggleButtonGroup size="small" exclusive value={kind} onChange={(_, v: typeof kind | null) => v && setKind(v)}>
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="stroke">Stroke</ToggleButton>
          <ToggleButton value="custom">Custom</ToggleButton>
        </ToggleButtonGroup>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', width: 240 }}>
          <Typography variant="body2">Size {size}</Typography>
          <Slider size="small" min={12} max={64} value={size} onChange={(_, v) => setSize(v as number)} />
        </Stack>
        <Stack direction="row" spacing={1}>
          {colours.map((c) => (
            <Box
              key={c}
              onClick={() => setColour(c)}
              sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: c, cursor: 'pointer', outline: c === colour ? '2px solid' : 'none', outlineOffset: 2 }}
            />
          ))}
        </Stack>
        <Typography variant="body2" color="text.secondary">{shown.length} icons</Typography>
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 1 }}>
        {shown.map(([name]) => {
          const Icon = registry[name];
          return Icon ? (
            <Stack key={name} spacing={1} title={name} sx={{ alignItems: 'center', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Box sx={{ height: 64, display: 'flex', alignItems: 'center' }}>
                <Icon size={size} color={colour} />
              </Box>
              <Typography variant="caption" sx={{ wordBreak: 'break-all', textAlign: 'center', lineHeight: 1.2 }}>{name}</Typography>
            </Stack>
          ) : null;
        })}
      </Box>
    </Stack>
  );
}
