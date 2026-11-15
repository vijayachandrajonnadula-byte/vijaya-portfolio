// Implements Figma page "ZoomSelect": sets "ZoomSelect" (Label Position Top/Left) and "ZoomSelectPanel" (Type Tree / Single Select / Multiselect).
import { useEffect, useId, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import OpenInFullRounded from '@mui/icons-material/OpenInFullRounded';
import { Button } from '../../actions/Button/Button';
import { CloseButton } from '../../actions/Button/CloseButton';
import { Checkbox } from '../../form/Checkbox/Checkbox';
import { Radio } from '../../form/Radio/Radio';
import { Search } from '../../form/Search/Search';
import { TreeView } from '../../data-display/TreeView/TreeView';
import type { TreeViewItem } from '../../data-display/TreeView/TreeView';
import { disabledOpacity, focusRing, pt, textStyle } from '../../../theme/pulseTokens';
import { role } from '../../../theme/typography';

export interface ZoomSelectOption {
  value: string;
  label: string;
  /** Secondary columns shown in the panel (single / multi). */
  meta?: string[];
}

export interface ZoomSelectProps {
  label?: ReactNode;
  /** @default "top" */
  labelPosition?: 'top' | 'left';
  /** "single" / "multi" list the options; "tree" shows `treeItems`. @default "single" */
  type?: 'single' | 'multi' | 'tree';
  options?: ZoomSelectOption[];
  /** Column headings for `option.meta` in the panel. */
  columns?: string[];
  treeItems?: TreeViewItem[];
  /** Selected value(s). */
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  /** Panel title, e.g. "Users". @default label */
  panelTitle?: string;
  helperText?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  /** Open the panel initially (for demos). */
  defaultOpen?: boolean;
}

const BORDER = '#d3e0f2';

function findLabels(items: TreeViewItem[], ids: string[]): string[] {
  const out: string[] = [];
  const walk = (list: TreeViewItem[]) => list.forEach((i) => { if (ids.includes(i.id)) out.push(i.label); if (i.children) walk(i.children); });
  walk(items);
  return out;
}

/** Read-only select field (32px) with a zoom button that opens a full list / tree panel to pick from. */
export function ZoomSelect({ label, labelPosition = 'top', type = 'single', options = [], columns = [], treeItems = [], value, onChange, placeholder = 'Select', panelTitle, helperText, error, disabled, defaultOpen = false }: ZoomSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [draft, setDraft] = useState(value);
  const [q, setQ] = useState('');
  useEffect(() => { if (open) setDraft(value); }, [open, value]);

  const labels = type === 'tree' ? findLabels(treeItems, value) : options.filter((o) => value.includes(o.value)).map((o) => o.label);
  const display = labels.join(', ');
  const shown = options.filter((o) => !q || o.label.toLowerCase().includes(q.toLowerCase()));
  const title = panelTitle ?? (typeof label === 'string' ? label : 'Select');
  const count = type === 'tree' ? treeItems.length : options.length;

  const field = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: labelPosition === 'left' ? 1 : undefined }}>
      <ButtonBase
        id={id}
        disabled={disabled}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        data-spec="zoomselect field"
        sx={{
          boxSizing: 'border-box', width: '100%', height: 32, p: '4px 8px', gap: '4px', justifyContent: 'flex-start', borderRadius: pt.radius.xs, background: '#fff',
          boxShadow: `inset 0 0 0 1.5px ${error ? '#ef4444' : BORDER}`, ...textStyle('textM', 'regular'), color: display ? '#0f172a' : '#5f6f86',
          '&:hover': { boxShadow: 'inset 0 0 0 1.5px #5f6f86' },
          '&.Mui-focusVisible': { boxShadow: `inset 0 0 0 1.5px #1e3a6e, ${focusRing}` },
          '&.Mui-disabled': { opacity: disabledOpacity },
        }}
      >
        <Box component="span" sx={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{display || placeholder}</Box>
        <OpenInFullRounded sx={{ fontSize: 14, color: '#0f172a' }} />
      </ButtonBase>
      {helperText && <Box sx={{ ...textStyle('textS', 'regular'), fontSize: 12, lineHeight: '20px', color: error ? '#dc2626' : '#566680' }}>{helperText}</Box>}
    </Box>
  );

  const toggle = (v: string) => setDraft((d) => (type === 'multi' ? (d.includes(v) ? d.filter((x) => x !== v) : [...d, v]) : [v]));

  return (
    <>
      {label != null && labelPosition === 'left' ? (
        <Box sx={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <Box component="label" htmlFor={id} sx={{ width: 200, py: '8px', ...textStyle('textM', 'medium'), color: '#0f172a' }}>{label}</Box>
          {field}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {label != null && <Box component="label" htmlFor={id} sx={{ ...textStyle('textM', 'medium'), color: '#0f172a' }}>{label}</Box>}
          {field}
        </Box>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth={false} slotProps={{ paper: { sx: { width: 960, maxWidth: '95vw', borderRadius: '8px' } } }} aria-label={title}>
        <Box data-spec="zoomselect panel" sx={{ display: 'flex', flexDirection: 'column', height: 480 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', p: '16px 16px 8px' }}>
            <Box sx={{ ...textStyle('textL', 'semiBold'), flex: 1 }}>{title} ({count})</Box>
            {type !== 'tree' && (
              <Box sx={{ width: 240 }}><Search value={q} onChange={(e) => setQ(e.target.value)} handleClear={() => setQ('')} /></Box>
            )}
            <CloseButton onClick={() => setOpen(false)} />
          </Box>
          <Box sx={{ flex: 1, minHeight: 0, mx: '16px', mb: '8px', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'auto' }}>
            {type === 'tree' ? (
              <Box sx={{ p: '8px' }}><TreeView items={treeItems} checkBox selectedItems={draft} handleSelection={setDraft} width="100%" defaultExpandedItems={treeItems.map((i) => i.id)} /></Box>
            ) : (
              <Box role="table" sx={{ minWidth: 0 }}>
                <Box role="row" sx={{ display: 'flex', height: 32, alignItems: 'center', background: '#f6f8fc', boxShadow: 'inset 0 -1px 0 0 #e2e8f0', ...textStyle('textM'), fontWeight: role.gridHeader }}>
                  <Box sx={{ width: 48 }} />
                  <Box sx={{ flex: 1, px: '8px' }}>{typeof label === 'string' ? label : 'Name'}</Box>
                  {columns.map((c) => <Box key={c} sx={{ flex: 1, px: '8px' }}>{c}</Box>)}
                </Box>
                {shown.map((o) => (
                  <Box key={o.value} role="row" onClick={() => toggle(o.value)} sx={{ display: 'flex', height: 38, alignItems: 'center', cursor: 'pointer', boxShadow: 'inset 0 -1px 0 0 #f1f5f9', background: draft.includes(o.value) ? '#eef3fb' : 'transparent', '&:hover': { background: draft.includes(o.value) ? '#eef3fb' : '#f6f8fc' }, ...textStyle('textM', 'regular') }}>
                    <Box sx={{ width: 48, display: 'flex', justifyContent: 'center' }}>
                      {type === 'multi' ? <Checkbox checked={draft.includes(o.value)} onChange={() => toggle(o.value)} onClick={(e) => e.stopPropagation()} slotProps={{ input: { 'aria-label': o.label } }} /> : <Radio checked={draft.includes(o.value)} onChange={() => toggle(o.value)} onClick={(e) => e.stopPropagation()} slotProps={{ input: { 'aria-label': o.label } }} />}
                    </Box>
                    <Box sx={{ flex: 1, px: '8px' }}>{o.label}</Box>
                    {columns.map((c, i) => <Box key={c} sx={{ flex: 1, px: '8px', color: '#566680' }}>{o.meta?.[i]}</Box>)}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', p: '8px 16px', boxShadow: 'inset 0 1px 0 0 #e2e8f0' }}>
            <Button variant="outlined" size="small" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="small" onClick={() => { onChange(draft); setOpen(false); }}>Apply</Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

