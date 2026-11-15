/**
 * Figma page "Form Builder": ".Building Blocks/formBuilder-formfields" (Type = TextBox | Dropdown | Radio Group | Date Time Picker | Button)
 * plus the other form-type kinds. Each field renders the real Pulse control (TextField / Select / RadioGroup ...)
 * inertly (pointer-events off) in edit mode, interactive in preview mode.
 */
import { fw } from '../../../theme/typography';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { Button } from '../../actions/Button/Button';
import { CheckboxGroup, RadioGroup } from '../../form/Choice/Choice';
import { Select } from '../../form/Select/Select';
import { TextArea, TextField } from '../../form/TextField/TextField';
import type { FormBuilderField } from './types';
import { pt } from '../../../theme/pulseTokens';

export interface FieldPreviewProps {
  field: FormBuilderField;
  /** Preview mode: controls accept input. In edit mode they are inert. @default false */
  interactive?: boolean;
}

const defaultOptions = [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }, { label: 'Option 3', value: '3' }];

export function FieldPreview({ field, interactive = false }: FieldPreviewProps) {
  const [text, setText] = useState('');
  const [choice, setChoice] = useState('');
  const [multi, setMulti] = useState<string[]>([]);
  const options = field.options?.length ? field.options : defaultOptions;
  const common = { label: field.label, required: field.required, hint: field.helpText };
  let body;
  switch (field.type) {
    case 'textBox':
      body = <TextField {...common} size="small" placeholder={field.placeholder} value={text} onChange={(e) => setText(e.target.value)} />;
      break;
    case 'textArea':
      body = <TextArea {...common} size="small" placeholder={field.placeholder} value={text} onChange={(e) => setText(e.target.value)} />;
      break;
    case 'date':
      body = <TextField {...common} size="small" type="date" value={text} onChange={(e) => setText(e.target.value)} />;
      break;
    case 'dropdown':
      body = <Select {...common} size="small" options={options} value={choice} onChange={(v) => setChoice(String(v))} placeholder={field.placeholder ?? 'Select'} />;
      break;
    case 'radio':
      body = <RadioGroup {...common} row options={options} value={choice} onChange={setChoice} />;
      break;
    case 'checkbox':
      body = <CheckboxGroup {...common} row options={options} value={multi} onChange={setMulti} />;
      break;
    case 'button':
      body = <Button size="small">{field.label || 'Button'}</Button>;
      break;
    case 'label':
      body = <Box sx={{ fontSize: 12, lineHeight: '20px', fontWeight: fw.semiBold, color: pt.colors.neutral[900] }}>{field.label}</Box>;
      break;
    case 'section':
      body = <Box sx={{ width: '100%', fontSize: 14, lineHeight: '24px', fontWeight: fw.semiBold, color: pt.colors.brand[500], pb: '4px', borderBottom: `1px solid ${pt.colors.neutral[200]}` }}>{field.label}</Box>;
      break;
    case 'blankSpace':
      body = <Box sx={{ height: 24 }} aria-label="Blank space" />;
      break;
    case 'pageBreak':
      body = <Box sx={{ width: '100%', borderTop: `2px dashed ${pt.colors.neutral[300]}`, textAlign: 'center', fontSize: 11, lineHeight: '20px', color: pt.colors.neutral[500] }}>Page break</Box>;
      break;
    case 'image':
      body = <Box sx={{ width: '100%', height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: pt.colors.neutral[100], border: `1px dashed ${pt.colors.neutral[300]}`, borderRadius: pt.radius.xs, fontSize: 12, color: pt.colors.neutral[500] }}>Image</Box>;
      break;
    case 'headerSection':
    case 'footerSection':
      body = <Box sx={{ width: '100%', minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: pt.colors.brand[25], border: `1px solid ${pt.colors.neutral[200]}`, borderRadius: pt.radius.xs, fontSize: 12, fontWeight: fw.semiBold, color: pt.colors.brand[500] }}>{field.type === 'headerSection' ? 'Header' : 'Footer'}</Box>;
      break;
    case 'table':
      body = (
        <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: `1px solid ${pt.colors.neutral[200]}`, fontSize: 12, lineHeight: '32px' }}>
          {['Column 1', 'Column 2', 'Column 3', '', '', ''].map((c, i) => <Box key={i} sx={{ px: '8px', height: 32, fontWeight: i < 3 ? fw.semiBold : fw.regular, bgcolor: i < 3 ? pt.colors.neutral[100] : '#fff', borderRight: i % 3 < 2 ? `1px solid ${pt.colors.neutral[200]}` : 0, borderTop: i >= 3 ? `1px solid ${pt.colors.neutral[200]}` : 0 }}>{c}</Box>)}
        </Box>
      );
      break;
  }
  return <Box data-spec={`field-preview ${field.type}`} sx={{ width: '100%', pointerEvents: interactive ? 'auto' : 'none', minWidth: 0 }}>{body}</Box>;
}
