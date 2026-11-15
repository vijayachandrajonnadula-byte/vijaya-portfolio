/**
 * Figma page "Form Builder": composes FieldPalette (left, "Add Fields"), FormCanvas (centre) and
 * PropertiesPanel ("Field Settings") into the three-column builder layout. Controlled or uncontrolled via `fields`.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { FieldPalette } from './FieldPalette';
import { FormCanvas } from './FormCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { fieldTypeLabel } from './types';
import type { FormBuilderField, FormFieldType } from './types';
import { scrollBarSx } from '../../data-display/ScrollBar/ScrollBar';
import { pt } from '../../../theme/pulseTokens';

export interface FormBuilderProps {
  fields?: FormBuilderField[];
  defaultFields?: FormBuilderField[];
  onChange?: (fields: FormBuilderField[]) => void;
  /** @default 560 */
  height?: number | string;
  sx?: SxProps<Theme>;
}

let counter = 0;
const newField = (type: FormFieldType): FormBuilderField => {
  counter += 1;
  const base: FormBuilderField = { id: `field-${Date.now().toString(36)}-${counter}`, type, label: fieldTypeLabel(type), name: `${type}${counter}` };
  if (type === 'dropdown' || type === 'radio' || type === 'checkbox') base.options = [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }];
  return base;
};

export function FormBuilder({ fields, defaultFields = [], onChange, height = 560, sx }: FormBuilderProps) {
  const [inner, setInner] = useState(defaultFields);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const list = fields ?? inner;
  const update = (next: FormBuilderField[]) => { if (fields === undefined) setInner(next); onChange?.(next); };
  const insert = (type: FormFieldType, index = list.length) => {
    const f = newField(type);
    const next = list.slice();
    next.splice(index, 0, f);
    update(next);
    setSelectedId(f.id);
  };
  const selected = list.find((f) => f.id === selectedId);
  return (
    <Box data-spec="form-builder" sx={[{ display: 'flex', height, minHeight: 0, border: `1px solid ${pt.colors.neutral[200]}`, borderRadius: pt.radius.m, overflow: 'hidden', bgcolor: pt.colors.neutral[50] }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>}>
      <FieldPalette width={320} onAdd={(t) => insert(t)} />
      <Box sx={{ flex: 1, minWidth: 0, overflow: 'auto', p: '24px', ...scrollBarSx() as object }}>
        <FormCanvas fields={list} selectedId={selectedId} onSelect={setSelectedId} onFieldsChange={update} onDropField={insert} />
      </Box>
      <PropertiesPanel width={320} field={selected} onChange={(f) => update(list.map((x) => (x.id === f.id ? f : x)))} />
    </Box>
  );
}
