import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataGridCellFrame, DataGridEmptyCell, DataGridFormCell, DataGridHeaderCell, DataGridTextCell, dataGridFormCellHeights, dataGridMetrics } from '../DataGrid/DataGrid';
import type { DataGridSize } from '../DataGrid/DataGrid';

const sizes: DataGridSize[] = ['small', 'medium', 'large'];
const Label = ({ children }: { children: string }) => (
  <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>{children}</Typography>
);

/** tableCell: Types (Header, Text Based Cell, Form Based Cell) x Row Variant (Odd, Even) x Size x Content Level (Filled, Empty). */
export default function TableCellDemo() {
  return (
    <Stack spacing={3}>
      {sizes.map((s) => (
        <Box key={s}>
          <Label>{`Size Variant = ${s}`}</Label>
          <Stack direction="row" useFlexGap sx={{ gap: 3, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {(['Odd', 'Even'] as const).map((row) => (
              <Stack key={row}>
                <Typography variant="textS">{`Row Variant = ${row}`}</Typography>
                <DataGridHeaderCell size={s} title="Header" width={200} />
                <DataGridCellFrame size={s} even={row === 'Even'} height={dataGridMetrics[s].rowTwoLine}><DataGridTextCell size={s} primary="Text cell" secondary="Meta data" /></DataGridCellFrame>
                <DataGridCellFrame size={s} even={row === 'Even'} height={dataGridFormCellHeights.radioCheckbox[s]}><DataGridFormCell type="radioCheckbox" size={s} label="Form cell" /></DataGridCellFrame>
                <DataGridEmptyCell size={s} even={row === 'Even'} />
              </Stack>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

