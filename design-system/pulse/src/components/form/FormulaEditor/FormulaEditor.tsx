// Implements Figma page "Rich Text Editor", sets "Formula Editor" (Label Position Top/Left), ".building block / Formula Editor Base"
// (Color x Interaction) and ".building block / Formula Button Set" (Type Characters/Basic/Trigonometry/Algebra/Statistical).
// Base = 1.5px bordered box, radius 6: toolbar (32px, #F1F5F9: five set switches, formula library dropdown, undo / redo / clear),
// the active button set (32px+ rows, #EFF6FF) and the text area. Same chrome as form/RichTextEditor.
import { useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { FormField } from '../../_shared/FormField';
import type { FormFieldProps } from '../../_shared/FormField';
import { fieldColors, fieldFocusBorder, fieldPlaceholder, fieldValue } from '../../_shared/fieldStyles';
import { Button } from '../../actions/Button/Button';
import { HelperText } from '../HelperText/HelperText';
import { ToolbarButton, ToolbarDivider, ToolbarDropdown } from '../RichTextEditor/RichTextEditor';
import {
  CalculateIcon, ChartAverageIcon, Cosine01Icon, LibraryIcon, RedoIcon, TextIcon, UndoIcon, XVariableSquareIcon, CancelIcon,
} from '../../../icons';
import { disabledOpacity, focusRing, pt, textStyle } from '../../../theme/pulseTokens';

export type FormulaButtonSetType = 'characters' | 'basic' | 'trigonometry' | 'algebra' | 'statistical';
export type FormulaEditorColor = 'primary' | 'error' | 'success' | 'warning';

export interface FormulaLibraryItem {
  label: string;
  /** Formula inserted when picked. */
  formula: string;
}

export interface FormulaEditorProps extends Omit<FormFieldProps, 'children' | 'htmlFor' | 'hintId' | 'fullWidth'> {
  /** Formula text. Omit for uncontrolled. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Figma Color of the border. `error` also follows the `error` prop. @default "primary" */
  color?: FormulaEditorColor;
  placeholder?: string;
  /** Character limit; the counter at the bottom right shows count/limit. */
  limit?: number;
  /** Which Formula Button Set is shown first. @default "characters" */
  defaultButtonSet?: FormulaButtonSetType;
  /** Items of the toolbar library dropdown. */
  library?: FormulaLibraryItem[];
  /** Minimum height of the text area. @default 160 */
  minHeight?: number;
  'data-spec'?: string;
}

/* Button labels inferred: the export only keeps button geometry (24px tall, 8px side padding), not the text. */
export const formulaButtonSets: Record<FormulaButtonSetType, { label: string; icon: ReactNode; buttons: (string | { text: string; insert: string })[] }> = {
  characters: {
    label: 'Characters',
    icon: <TextIcon size={16} />,
    buttons: ['(', ')', '[', ']', '{', '}', ',', ';', '.', '"', "'", '_'],
  },
  basic: {
    label: 'Basic',
    icon: <CalculateIcon size={16} />,
    buttons: ['+', '-', '*', '/', '%', '^', '=', '<', '>', '<=', '>=', '!=', 'AND', 'OR', 'NOT', 'IF', 'TRUE', 'FALSE'],
  },
  trigonometry: {
    label: 'Trigonometry',
    icon: <Cosine01Icon size={16} />,
    buttons: ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'sec', 'csc', 'cot', 'asinh', 'acosh', 'atanh', 'degrees', 'radians', 'pi'].map((t) => (t === 'pi' ? { text: 'π', insert: 'PI' } : { text: t, insert: `${t.toUpperCase()}(` })),
  },
  algebra: {
    label: 'Algebra',
    icon: <XVariableSquareIcon size={16} />,
    buttons: ['abs', 'sqrt', 'cbrt', 'pow', 'exp', 'ln', 'log', 'log10', 'floor', 'ceil', 'round', 'mod', 'sign', 'trunc'].map((t) => ({ text: t, insert: `${t.toUpperCase()}(` })),
  },
  statistical: {
    label: 'Statistical',
    icon: <ChartAverageIcon size={16} />,
    buttons: ['sum', 'avg', 'count', 'median', 'mode', 'min', 'max', 'range', 'stdev', 'var'].map((t) => ({ text: t, insert: `${t.toUpperCase()}(` })),
  },
};
const setOrder: FormulaButtonSetType[] = ['characters', 'basic', 'trigonometry', 'algebra', 'statistical'];

const defaultLibrary: FormulaLibraryItem[] = [
  { label: 'Percent change', formula: '(NEW - OLD) / OLD * 100' },
  { label: 'Mean', formula: 'SUM(A, B, C) / 3' },
  { label: 'Hypotenuse', formula: 'SQRT(POW(A, 2) + POW(B, 2))' },
];

// Border colours as drawn in the .fig (the design-kit JSON has stale values, e.g. warning = blue); same source as RichTextEditor.
const border = (c: FormulaEditorColor, s: 'defaultBorder' | 'hoverBorder' | 'focusBorder') => (s === 'focusBorder' ? fieldFocusBorder : s === 'hoverBorder' ? fieldColors[c].hover : fieldColors[c].border);

/** Math expression editor: toolbar, formula button sets and a text area. */
export function FormulaEditor({
  value, defaultValue = '', onChange, color = 'primary', placeholder = 'Placeholder text', limit, defaultButtonSet = 'characters', library = defaultLibrary, minHeight = 160, 'data-spec': dataSpec,
  label, required, hint, hintVariant, hintIcon, error, disabled, labelPosition, labelWidth, labelAllCaps, labelInfo,
}: FormulaEditorProps) {
  const id = useId();
  const area = useRef<HTMLTextAreaElement>(null);
  const [inner, setInner] = useState(defaultValue);
  const [set, setSet] = useState<FormulaButtonSetType>(defaultButtonSet);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [past, setPast] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);
  const text = value ?? inner;
  const tone: FormulaEditorColor = error ? 'error' : color;
  const edge = focused ? border(tone, 'focusBorder') : hovered && !disabled ? border(tone, 'hoverBorder') : border(tone, 'defaultBorder');
  const over = limit != null && text.length > limit;

  const commit = (next: string, record = true) => {
    if (record) {
      setPast((p) => [...p, text]);
      setFuture([]);
    }
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  const insert = (snippet: string) => {
    const el = area.current;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    const next = text.slice(0, start) + snippet + text.slice(end);
    if (limit != null && next.length > limit) return;
    commit(next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + snippet.length, start + snippet.length);
    });
  };
  const undo = () => {
    const prev = past[past.length - 1];
    if (prev === undefined) return;
    setPast(past.slice(0, -1));
    setFuture([text, ...future]);
    commit(prev, false);
  };
  const redo = () => {
    const nxt = future[0];
    if (nxt === undefined) return;
    setFuture(future.slice(1));
    setPast([...past, text]);
    commit(nxt, false);
  };

  const buttons = formulaButtonSets[set].buttons;

  return (
    <FormField
      label={label} required={required} error={error} disabled={disabled} fullWidth
      labelPosition={labelPosition} labelWidth={labelWidth} labelAllCaps={labelAllCaps} labelInfo={labelInfo} htmlFor={id}
    >
      <Box
        data-spec={dataSpec}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          position: 'relative',
          boxSizing: 'border-box',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '6px',
          overflow: 'hidden',
          bgcolor: pt.formElements.color.primary.defaultBackground,
          boxShadow: focused ? focusRing : 'none',
          opacity: disabled ? disabledOpacity : 1,
          pointerEvents: disabled ? 'none' : undefined,
          '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', border: `1.5px solid ${edge}`, pointerEvents: 'none' },
        }}
      >
        <Box role="toolbar" aria-label="Formula toolbar" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', minHeight: 32, boxSizing: 'border-box', p: '4px 8px', bgcolor: pt.uiElements.RTE.Color.backgroundColor }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {setOrder.map((t, i) => (
              <Box key={t} sx={{ display: 'contents' }}>
                {i > 0 && <ToolbarDivider />}
                <ToolbarButton label={formulaButtonSets[t].label} active={set === t} disabled={disabled} onClick={() => setSet(t)}>
                  {formulaButtonSets[t].icon}
                </ToolbarButton>
              </Box>
            ))}
            <ToolbarDivider />
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <LibraryIcon size={16} />
              <ToolbarDropdown
                label="Formula library"
                text=""
                options={library.map((l) => ({ label: l.label, onPick: () => insert(l.formula) }))}
                disabled={disabled}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ToolbarButton label="Undo" disabled={disabled || past.length === 0} onClick={undo}><UndoIcon size={16} /></ToolbarButton>
            <ToolbarButton label="Redo" disabled={disabled || future.length === 0} onClick={redo}><RedoIcon size={16} /></ToolbarButton>
            <ToolbarButton label="Clear" disabled={disabled || text === ''} onClick={() => commit('')}><CancelIcon size={16} /></ToolbarButton>
          </Box>
        </Box>
        <FormulaButtonSet type={set} buttons={buttons} onInsert={insert} />
        <Box
          component="textarea"
          ref={area}
          id={id}
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          spellCheck={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const v = limit != null ? e.target.value.slice(0, limit) : e.target.value;
            commit(v);
          }}
          sx={{
            ...textStyle('textL', 'medium'),
            boxSizing: 'border-box',
            display: 'block',
            width: '100%',
            minHeight,
            p: '8px 12px',
            border: 0,
            outline: 0,
            resize: 'vertical',
            bgcolor: pt.formElements.color.primary.defaultBackground,
            color: fieldValue,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            '&::placeholder': { color: fieldPlaceholder, opacity: 1, fontFamily: 'inherit' },
          }}
        />
      </Box>
      {(hint != null || limit != null) && (
        <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {hint != null && (
              <HelperText variant={error ? 'error' : hintVariant === undefined || hintVariant === 'default' ? 'normal' : hintVariant} showIcon={hintIcon ?? hintVariant === 'info'}>{hint}</HelperText>
            )}
          </Box>
          {limit != null && (
            <Box aria-live="polite" sx={{ ...textStyle('textL'), color: over ? 'error.main' : 'text.secondary', whiteSpace: 'nowrap' }}>
              {text.length}/{limit}
            </Box>
          )}
        </Box>
      )}
    </FormField>
  );
}

/** Figma ".building block / Formula Button Set": #EFF6FF strip of 24px text buttons separated by dividers; wraps onto rows. */
export function FormulaButtonSet({ type, buttons, onInsert }: { type: FormulaButtonSetType; buttons?: (string | { text: string; insert: string })[]; onInsert?: (snippet: string) => void }) {
  const list = buttons ?? formulaButtonSets[type].buttons;
  return (
    <Box role="group" aria-label={`${formulaButtonSets[type].label} buttons`} sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px', minHeight: 32, boxSizing: 'border-box', p: '4px 8px', bgcolor: pt.colors.accent.blue[50] }}>
      {list.map((b, i) => {
        const text = typeof b === 'string' ? b : b.text;
        const snippet = typeof b === 'string' ? b : b.insert;
        return (
          <Box key={`${text}-${i}`} sx={{ display: 'contents' }}>
            {i > 0 && <ToolbarDivider />}
            <Button variant="text" size="xsmall" color="primary" onClick={() => onInsert?.(snippet)}>{text}</Button>
          </Box>
        );
      })}
    </Box>
  );
}

