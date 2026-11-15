import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PanToolOutlined from '@mui/icons-material/PanToolOutlined';
import NearMeOutlined from '@mui/icons-material/NearMeOutlined';
import UndoRounded from '@mui/icons-material/UndoRounded';
import RedoRounded from '@mui/icons-material/RedoRounded';
import FitScreenOutlined from '@mui/icons-material/FitScreenOutlined';
import { CanvasToolbar } from './CanvasToolbar';

const actions = [
  { id: 'select', label: 'Select', icon: <NearMeOutlined /> },
  { id: 'pan', label: 'Pan', icon: <PanToolOutlined /> },
  { id: 'undo', label: 'Undo', icon: <UndoRounded /> },
  { id: 'redo', label: 'Redo', icon: <RedoRounded /> },
  { id: 'fit', label: 'Fit to screen', icon: <FitScreenOutlined /> },
];
const results = [{ id: '1', label: 'Start node' }, { id: '2', label: 'Approval step' }, { id: '3', label: 'End node' }];

/** CanvasToolbar: default (zoom only), additional features, search expanded, results dropped. */
export default function CanvasToolbarDemo() {
  const [z, setZ] = useState(100);
  const zoom = { value: z, onChange: setZ, onFit: () => setZ(100) };
  const Case = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <Stack spacing={1}><Typography variant="textS" color="text.secondary">{label}</Typography><Box sx={{ p: 2, background: '#e2e8f0', minHeight: 100 }}>{children}</Box></Stack>
  );
  return (
    <Stack spacing={2}>
      <Case label="Default"><CanvasToolbar zoom={zoom} /></Case>
      <Case label="Additional features (search collapsed)"><CanvasToolbar zoom={zoom} actions={actions} onSearch={() => undefined} /></Case>
      <Case label="Search expanded"><CanvasToolbar zoom={zoom} actions={actions} onSearch={() => undefined} defaultSearchOpen /></Case>
      <Case label="Result dropped"><CanvasToolbar zoom={zoom} actions={actions} onSearch={() => undefined} defaultSearchOpen searchResults={results} /></Case>
    </Stack>
  );
}
