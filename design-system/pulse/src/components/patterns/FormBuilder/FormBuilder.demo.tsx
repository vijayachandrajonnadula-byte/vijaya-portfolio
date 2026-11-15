import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddCircleOutlineRounded from '@mui/icons-material/AddCircleOutlineRounded';
import FormatListBulletedRounded from '@mui/icons-material/FormatListBulletedRounded';
import { FormBuilder } from './FormBuilder';
import { FieldPreview } from './FieldPreview';
import { FieldPalette, PaletteItem } from './FieldPalette';
import { PropertiesPanel } from './PropertiesPanel';
import { FormFieldFrame } from './FormCanvas';
import {
  ButtonedTab,
  CellCountCell,
  ColumnRowResizer,
  CompResizer,
  ExpandCollapseHandle,
  HeaderStyleOption,
  TableCellCountSelection,
  TemplateTypeCard,
  headerStyles,
  templateTypes,
} from './BuildingBlocks';
import {
  AdditionalSettings,
  AttachmentSetting,
  HyperlinkSetting,
  PasswordSetting,
  SystemValueSetting,
  TagsSetting,
  ToggleSwitchButton,
  VerificationRequired,
} from './FieldSettingSections';
import { FIELD_TYPES } from './types';
import type { FormBuilderField } from './types';

const sample: FormBuilderField[] = [
  { id: 'a', type: 'section', label: 'Batch details' },
  { id: 'b', type: 'textBox', label: 'Batch number', name: 'batch', placeholder: 'Enter batch number', required: true },
  { id: 'c', type: 'dropdown', label: 'Product', options: [{ label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' }] },
  { id: 'd', type: 'radio', label: 'Result', options: [{ label: 'Pass', value: 'p' }, { label: 'Fail', value: 'f' }] },
  { id: 'e', type: 'date', label: 'Date of manufacture' },
];

const previews: FormBuilderField[] = FIELD_TYPES.map((t) => ({ id: t.type, type: t.type, label: t.label, placeholder: 'Placeholder' }));

const Caption = ({ children }: { children: ReactNode }) => (
  <Typography variant="textM" color="text.secondary" component="div">{children}</Typography>
);

export default function FormBuilderDemo() {
  const [fields, setFields] = useState(sample);
  const [style, setStyle] = useState<(typeof headerStyles)[number]['type']>('logoTitlePageNumber');
  const [sys, setSys] = useState<'off' | 'dynamic' | 'static'>('dynamic');
  const [tab, setTab] = useState('a');
  return (
    <Stack spacing={3}>
      <Caption>Composed builder (Add Fields panel, canvas, Field Settings panel): drag or click palette items, click a field to edit it; select a field to get the drag handle, duplicate and delete</Caption>
      <FormBuilder fields={fields} onChange={setFields} height={640} />

      <Caption>Panel types: Add Fields, Field Settings - No selection, Field Settings (Text Box), Field Settings (Table), Right - Collapsed (handle)</Caption>
      <Stack direction="row" useFlexGap spacing={2} sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Box sx={{ height: 640, border: '1px solid #d0d6e4' }}><FieldPalette onCollapse={() => undefined} /></Box>
        <Box sx={{ height: 640, border: '1px solid #d0d6e4' }}><PropertiesPanel field={null} onChange={() => undefined} onCollapse={() => undefined} /></Box>
        <Box sx={{ height: 640, border: '1px solid #d0d6e4' }}><PropertiesPanel field={sample[1]} onChange={() => undefined} onReset={() => undefined} onCollapse={() => undefined} /></Box>
        <Box sx={{ height: 640, border: '1px solid #d0d6e4' }}><PropertiesPanel field={{ id: 't', type: 'table', label: 'Table' }} onChange={() => undefined} onReset={() => undefined} /></Box>
        <Box sx={{ height: 640, width: 16, border: '1px solid #d0d6e4', borderWidth: '0 0 0 1px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', pt: '44px' }}><ExpandCollapseHandle direction="right" /></Box>
      </Stack>

      <Caption>Component list item states: Default, Hover (forced via the item), Favourite, Start Drag / Dragging Card are driven by pointer and drag</Caption>
      <Stack direction="row" spacing={2} sx={{ width: 640 }}>
        <PaletteItem info={FIELD_TYPES[0]!} />
        <PaletteItem info={FIELD_TYPES[3]!} favourite onToggleFavourite={() => undefined} />
      </Stack>

      <Caption>FormField: Default / Hover / Selected (selected shows 4 corner resizers, component name, drag handle and toolbar)</Caption>
      <Stack spacing={5} sx={{ width: 460, pt: 4, pl: 5 }}>
        <FormFieldFrame field={sample[1]!} />
        <FormFieldFrame field={sample[2]!} selected />
      </Stack>

      <Caption>Resizers: CompResizer (Square Resizer, Move), ColumnRowResizer (Column Resizer, Row Resize), CellCountSelection (Default, Hover)</Caption>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
        <CompResizer />
        <CompResizer type="move" />
        <ColumnRowResizer />
        <ColumnRowResizer type="row" />
        <CellCountCell />
        <CellCountCell interaction="hover" />
      </Stack>
      <Caption>TableCellCountSelection (hover to highlight, click to choose)</Caption>
      <TableCellCountSelection highlight={{ rows: 3, columns: 3 }} />

      <Caption>Buttoned Tabs: Default, Hover, Active, Focus, Disabled</Caption>
      <Stack direction="row" spacing={2}>
        <ButtonedTab label="Fields" icon={<AddCircleOutlineRounded />} />
        <ButtonedTab label="Fields" icon={<AddCircleOutlineRounded />} forceState="hover" />
        <ButtonedTab label="Fields" icon={<AddCircleOutlineRounded />} active />
        <ButtonedTab label="Fields" icon={<AddCircleOutlineRounded />} forceState="focus" />
        <ButtonedTab label="Fields" icon={<FormatListBulletedRounded />} disabled />
      </Stack>

      <Caption>Template types</Caption>
      <Stack direction="row" useFlexGap spacing={3} sx={{ flexWrap: 'wrap' }}>
        {templateTypes.map((t) => <TemplateTypeCard key={t.type} type={t.type} />)}
      </Stack>

      <Caption>Header styles: Default / Hover / Selected for each of the 4 styles</Caption>
      <Stack direction="row" useFlexGap spacing={3} sx={{ flexWrap: 'wrap' }}>
        {headerStyles.map((h) => (
          <Stack key={h.type} spacing={1}>
            <HeaderStyleOption type={h.type} selected={style === h.type} onSelect={() => setStyle(h.type)} />
            <HeaderStyleOption type={h.type} hover />
            <HeaderStyleOption type={h.type} selected />
          </Stack>
        ))}
      </Stack>

      <Caption>Field Settings sections: ToggleSwitchButton, Verification Required, Hyperlink, Attachment, Tags, Password (unselected, then selected), System Value (off / dynamic / static)</Caption>
      <Stack direction="row" useFlexGap spacing={4} sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}><ToggleSwitchButton /><ToggleSwitchButton checked /></Stack>
          <VerificationRequired /><HyperlinkSetting /><AttachmentSetting /><TagsSetting /><PasswordSetting />
        </Stack>
        <Stack spacing={2}>
          <VerificationRequired defaultOn /><TagsSetting defaultOn /><AttachmentSetting defaultOn />
        </Stack>
        <Stack spacing={2}>
          <HyperlinkSetting defaultOn /><PasswordSetting defaultOn />
        </Stack>
        <Stack spacing={2}>
          <SystemValueSetting state="off" />
          <SystemValueSetting state={sys} onStateChange={setSys} />
          <SystemValueSetting state="static" />
        </Stack>
        <Box sx={{ width: 312 }}><AdditionalSettings filled /></Box>
      </Stack>
      <Caption>Buttoned tab selection state: {tab}</Caption>
      <Stack direction="row" spacing={2}>
        {['a', 'b'].map((k) => <ButtonedTab key={k} label={k === 'a' ? 'Fields' : 'List'} icon={k === 'a' ? <AddCircleOutlineRounded /> : <FormatListBulletedRounded />} active={tab === k} onClick={() => setTab(k)} />)}
      </Stack>

      <Caption>Field previews (all 15 form-type kinds)</Caption>
      <Stack spacing={1.5} sx={{ width: 460 }}>
        {previews.map((f) => <FieldPreview key={f.id} field={f} />)}
      </Stack>
    </Stack>
  );
}
