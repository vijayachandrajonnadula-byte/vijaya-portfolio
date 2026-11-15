import { Fragment } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutlined';
import MoreVertRounded from '@mui/icons-material/MoreVertRounded';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { Button } from '../../actions/Button/Button';
import { IconButton } from '../../actions/IconButton/IconButton';
import { DataGridSizeProvider } from './DataGridCells';
import {
  DataGridActionsCell,
  DataGridCellFrame,
  DataGridFormCell,
  DataGridGroupCell,
  DataGridHeaderCell,
  DataGridLinkCell,
  DataGridTextCell,
  dataGridFormCellHeights,
  dataGridIconButtonSize,
} from './DataGrid';
import type { DataGridCellInteraction, DataGridFormCellType, DataGridSize } from './DataGrid';

const sizes: DataGridSize[] = ['small', 'medium', 'large'];
const interactions: DataGridCellInteraction[] = ['default', 'hover', 'disabled', 'rowSelected', 'rowSelectedHover'];
const Label = ({ children }: { children: string }) => (
  <Typography variant="textM" color="text.secondary" component="div" sx={{ mb: 1 }}>{children}</Typography>
);

const textCells: Record<string, (s: DataGridSize) => { node: React.ReactNode; height: number }> = {
  Default: (s) => ({ node: <DataGridTextCell primary="Protocol 001" secondary="Boston site" statusColor="green" />, height: heightOf(s, 'rowTwoLine') }),
  Link: (s) => ({ node: <DataGridLinkCell secondary="Boston site">Protocol 001</DataGridLinkCell>, height: heightOf(s, 'rowLink') }),
  'Text with Icon': (s) => ({ node: <DataGridTextCell primary="Protocol 001" secondary="Boston site" icon={<DescriptionOutlined />} />, height: heightOf(s, 'rowTwoLine') }),
  'Group by': (s) => ({ node: <DataGridGroupCell label="Boston" secondary="12 records" />, height: heightOf(s, 'rowTwoLine') }),
  Icons: (s) => ({
    node: (
      <DataGridActionsCell>
        {[<EditOutlined key="e" />, <DeleteOutline key="d" />].map((i, k) => <IconButton key={k} ariaLabel="action" size={dataGridIconButtonSize[s]} variant="plain">{i}</IconButton>)}
      </DataGridActionsCell>
    ),
    height: heightOf(s, 'rowIcons'),
  }),
};
const rowHeights = { small: { rowTwoLine: 48, rowLink: 52, rowIcons: 36 }, medium: { rowTwoLine: 52, rowLink: 56, rowIcons: 48 }, large: { rowTwoLine: 60, rowLink: 64, rowIcons: 56 } };
function heightOf(s: DataGridSize, k: 'rowTwoLine' | 'rowLink' | 'rowIcons') { return rowHeights[s][k]; }

const formCells: Record<DataGridFormCellType, React.ReactNode> = {
  radioCheckbox: <DataGridFormCell type="radioCheckbox" label="Select" checked />,
  chip: <DataGridFormCell type="chip" chip={{ label: 'Open', color: 'blue' }} trailingIcon={<CloseRounded />} />,
  status: <DataGridFormCell type="status" status={{ label: 'Open', color: 'blue' }} trailingIcon={<CloseRounded />} />,
  progress: <DataGridFormCell type="progress" progress={{ value: 60 }} trailingIcon={<CloseRounded />} />,
  input: <DataGridFormCell type="input" input={{ placeholder: 'Value' }} />,
  dropdown: <DataGridFormCell type="dropdown" dropdown={{ options: ['One', 'Two'], placeholder: 'Select' }} />,
  buttons: <DataGridFormCell type="buttons"><Button size="small" variant="outlined">Edit</Button><Button size="small" variant="outlined">Save</Button></DataGridFormCell>,
  textArea: <DataGridFormCell type="textArea" textArea={{ placeholder: 'Comments' }} />,
  slot: <DataGridFormCell type="slot"><Box sx={{ fontSize: 12, color: '#7b37a3' }}>Custom slot</Box></DataGridFormCell>,
  trendLine: <DataGridFormCell type="trendLine" trend={{ color: 'green' }} />,
  tree: <DataGridFormCell type="tree"><Box sx={{ fontSize: 12 }}>Tree list</Box></DataGridFormCell>,
};

// Demo section (rendered by DataGrid.demo.tsx; the gallery allows one demo file per folder).
/** DataGrid building blocks: Header (Type x BackGroundFill x Size), Text cells (Type x Interaction x Size), Form cells (Type x Size). */
export function DataGridCellsSection() {
  return (
    <Stack spacing={4}>
      <Box>
        <Label>DataGrid_Header: Type Default / Filter, BackGroundFill No / Yes, Size, Disabled</Label>
        <Stack direction="row" useFlexGap sx={{ gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {sizes.map((s) => (
            <Fragment key={s}>
              <DataGridHeaderCell size={s} title="Column title" width={220} />
              <DataGridHeaderCell size={s} title="Column title" filled width={220} />
            </Fragment>
          ))}
          <DataGridHeaderCell size="medium" title="Column title" disabled width={220} />
          <DataGridHeaderCell size="medium" type="filter" title="Filter" width={220} />
        </Stack>
      </Box>
      {Object.entries(textCells).map(([type, make]) => (
        <Box key={type}>
          <Label>{`DataGrid_Text_Cell Type = ${type} (rows: Small / Medium / Large, columns: ${interactions.join(' / ')})`}</Label>
          <Stack spacing={0}>
            {sizes.map((s) => (
              <DataGridSizeProvider key={s} value={s}>
                <Stack direction="row" sx={{ alignItems: 'flex-start' }}>
                  {interactions.map((i) => {
                    const { node, height } = make(s);
                    return <DataGridCellFrame key={i} size={s} interaction={i} height={height} background={type === 'Group by' ? (i === 'default' || i === 'disabled' ? '#ffffff' : '#eef3fb') : undefined}>{node}</DataGridCellFrame>;
                  })}
                </Stack>
              </DataGridSizeProvider>
            ))}
          </Stack>
        </Box>
      ))}
      <Box>
        <Label>DataGrid_Form_Cell: every Type, Small / Medium / Large (interaction default)</Label>
        <Stack spacing={1}>
          {(Object.keys(formCells) as DataGridFormCellType[]).map((t) => (
            <Stack key={t} direction="row" sx={{ alignItems: 'flex-start' }}>
              <Typography variant="textS" sx={{ width: 100, pt: 1 }}>{t}</Typography>
              {sizes.map((s) => (
                <DataGridSizeProvider key={s} value={s}>
                  <DataGridCellFrame size={s} height={dataGridFormCellHeights[t][s]} width={t === 'tree' ? 276 : 200}>{formCells[t]}</DataGridCellFrame>
                </DataGridSizeProvider>
              ))}
            </Stack>
          ))}
          <Stack direction="row"><IconButton ariaLabel="more" variant="plain"><MoreVertRounded /></IconButton></Stack>
        </Stack>
      </Box>
    </Stack>
  );
}


