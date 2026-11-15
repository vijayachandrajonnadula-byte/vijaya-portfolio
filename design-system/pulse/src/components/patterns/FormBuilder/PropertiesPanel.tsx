/**
 * Figma page "Form Builder": panel types "Field Settings - <type>" and "Field Settings - No selection"
 * (360x812, border-right #d0d6e4, pad 16/24, gap 16; header = type icon tile + title + description;
 * accordion "Basic" with fields pad 16 gap 16 and Switch rows "Mandatory" ...).
 */
import { fw } from '../../../theme/typography';
import Box from '@mui/material/Box';
import AdsClickRounded from '@mui/icons-material/AdsClickRounded';
import { Button } from '../../actions/Button/Button';
import { Tab, Tabs } from '../../navigation/Tabs/Tabs';
import { ExpandCollapseHandle, TableCellCountSelection } from './BuildingBlocks';
import { AdditionalSettings } from './FieldSettingSections';
import type { SxProps, Theme } from '@mui/material/styles';
import { SwitchWithLabel } from '../../form/Choice/Choice';
import { TextArea, TextField } from '../../form/TextField/TextField';
import { fieldIcons } from './FieldIcons';
import { PanelSection, formBuilderBorder } from './FieldPalette';
import { fieldTypeLabel } from './types';
import type { FormBuilderField } from './types';
import { scrollBarSx } from '../../data-display/ScrollBar/ScrollBar';
import { pt } from '../../../theme/pulseTokens';

export interface PropertiesPanelProps {
  field: FormBuilderField | null | undefined;
  onChange: (field: FormBuilderField) => void;
  /** @default 360 */
  width?: number | string;
  /** Reset action in the panel footer (Figma: outlined small button). */
  onReset?: () => void;
  /** Collapse handle on the panel edge (Figma Building Blocks/expandCollapse). */
  onCollapse?: () => void;
  sx?: SxProps<Theme>;
}

const hasOptions = (t: FormBuilderField['type']) => t === 'dropdown' || t === 'radio' || t === 'checkbox';
const hasPlaceholder = (t: FormBuilderField['type']) => t === 'textBox' || t === 'textArea' || t === 'dropdown';
const hasValueSettings = (t: FormBuilderField['type']) => ['textBox', 'textArea', 'date', 'dropdown', 'radio', 'checkbox'].includes(t);

export function PropertiesPanel({ field, onChange, width = 360, onReset, onCollapse, sx }: PropertiesPanelProps) {
  const frame = [{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box', width, height: '100%', minHeight: 0, p: '16px 24px', overflowY: 'auto', bgcolor: '#fff', borderLeft: `1px solid ${formBuilderBorder}` }, scrollBarSx(), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>;
  const handle = onCollapse ? <Box sx={{ position: 'absolute', left: -12, top: 44, zIndex: 1 }}><ExpandCollapseHandle direction="right" onClick={onCollapse} /></Box> : null;
  const tabs = <Tabs value={0} handleChange={() => undefined} size="small"><Tab index={0} label="Field Settings" /></Tabs>;
  if (!field) {
    return (
      <Box data-spec="properties-panel empty" component="aside" aria-label="Field settings" sx={frame}>
        {handle}
        {tabs}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', textAlign: 'center', fontSize: 14, lineHeight: '20px', color: pt.colors.neutral[900] }}>
          <AdsClickRounded />
          Click on a form element within your canvas area to modify!
        </Box>
      </Box>
    );
  }
  const set = (patch: Partial<FormBuilderField>) => onChange({ ...field, ...patch });
  const optionText = (field.options ?? []).map((o) => o.label).join('\n');
  return (
    <Box data-spec="properties-panel" component="aside" aria-label="Field settings" sx={frame}>
      {handle}
      {tabs}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', height: 40 }}>
        <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: pt.radius.xs, bgcolor: 'rgba(0,0,0,0.03)', color: pt.colors.brand[500], '& svg': { fontSize: 16 } }}>{fieldIcons[field.type]}</Box>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ fontSize: 12, lineHeight: '20px', fontWeight: fw.semiBold, color: pt.colors.neutral[900] }}>{fieldTypeLabel(field.type)}</Box>
          <Box sx={{ fontSize: 12, lineHeight: '20px', color: pt.colors.neutral[500] }}>Field settings</Box>
        </Box>
      </Box>
      <PanelSection title="Basic">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', p: '8px' }}>
          <TextField size="small" label={field.type === 'label' || field.type === 'section' || field.type === 'button' ? 'Text' : 'Label'} value={field.label} onChange={(e) => set({ label: e.target.value })} />
          {hasValueSettings(field.type) && <TextField size="small" label="Field name" value={field.name ?? ''} onChange={(e) => set({ name: e.target.value })} />}
          {hasPlaceholder(field.type) && <TextField size="small" label="Placeholder" value={field.placeholder ?? ''} onChange={(e) => set({ placeholder: e.target.value })} />}
          {hasValueSettings(field.type) && <TextField size="small" label="Help text" value={field.helpText ?? ''} onChange={(e) => set({ helpText: e.target.value })} />}
          {hasOptions(field.type) && (
            <TextArea
              size="small"
              rows={4}
              label="Options (one per line)"
              value={optionText}
              onChange={(e) => set({ options: String(e.target.value).split('\n').map((l, i) => ({ label: l, value: String(i + 1) })) })}
            />
          )}
          {hasValueSettings(field.type) && <SwitchWithLabel label="Mandatory" labelPlacement="start" checked={Boolean(field.required)} onChange={(v) => set({ required: v })} />}
        </Box>
      </PanelSection>
      {field.type === 'table' && <TableCellCountSelection />}
      {hasValueSettings(field.type) && <AdditionalSettings />}
      {onReset && (
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', pt: '8px', borderTop: `1px solid ${formBuilderBorder}` }}>
          <Button size="small" variant="outlined" onClick={onReset}>Reset</Button>
        </Box>
      )}
    </Box>
  );
}
