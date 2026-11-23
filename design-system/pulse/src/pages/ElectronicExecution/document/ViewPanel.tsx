/**
 * NOT FROM FIGMA. The panel the document toolbar's View button opens: a two-way toggle (Attachments | Vault) over a list, then the
 * page width. Attachments lists the documents this execution refers to (a document id with the part of the protocol it belongs
 * to under it); Vault shows a sample folder tree of controlled documents. Both lists are generic sample data. Choosing a document opens it in the Evidence & Activity pane as a
 * sample page (no file is stored; the vault tree is generic sample data). Built only from design-system components:
 * Popover, ToggleButtonGroup and TreeView.
 */
import { useMemo, useState } from 'react';
import { Box } from '../../../components/mui';
import { Popover } from '../../../components/feedback/Popover/Popover';
import { ToggleButtonGroup } from '../../../components/form/ToggleButtonGroup/ToggleButtonGroup';
import { TreeView } from '../../../components/data-display/TreeView/TreeView';
import type { TreeViewItem } from '../../../components/data-display/TreeView/TreeView';
import type { FitMode } from '../refTheme';
import { thinScroll } from '../evidence/EvControls';

interface VaultNode { name: string; children?: VaultNode[] }
/** Generic sample vault: sites, then equipment groups, then documents. No company or product names, no people. */
const VAULT: VaultNode[] = [
  {
    name: 'Italy',
    children: [
      {
        name: 'Manufacturing Equipment',
        children: [
          { name: 'Power Blenders', children: [{ name: 'V-Cone Blender VCB-001 User Manual.pdf' }, { name: 'Calibration Certificate Cal-CRT-2026-0119.pdf' }, { name: 'VCB-001 Maintenance Log.pdf' }] },
          { name: 'Mixers', children: [{ name: 'Ribbon Mixer RM-204 Specification.pdf' }, { name: 'RM-204 IQ Report.pdf' }] },
        ],
      },
      { name: 'Medical Equipment', children: [{ name: 'Autoclave AC-12 IQ Report.pdf' }, { name: 'Sterilizer ST-08 OQ Protocol.pdf' }] },
    ],
  },
];

/** The documents this execution refers to (generic sample list): a document id with the part of the protocol it belongs to. */
const ATTACHMENTS: { id: string; title: string }[] = [
  { id: 'URS-03', title: 'Speed Verification' },
  { id: 'SOP-004', title: 'Mixing Performance' },
  { id: 'SOP-DIS', title: 'Discharge Validation' },
  { id: 'SOP-CLN-007', title: 'Cleaning Verification' },
  { id: 'QA-001', title: 'OQ Sign-off' },
];

const FIT_OPTIONS: { value: FitMode; label: string }[] = [
  { value: 'auto', label: 'Fit width' },
  { value: 'compact', label: 'Compact' },
  { value: 'full', label: 'Full width' },
];

type Tab = 'attachments' | 'vault';

export interface ViewPanelProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  fit: FitMode;
  onFit: (f: FitMode) => void;
  /** A document was chosen: open it (title shown in the pane). */
  onOpenDocument: (title: string) => void;
}

export function ViewPanel({ anchorEl, onClose, fit, onFit, onOpenDocument }: ViewPanelProps) {
  const [tab, setTab] = useState<Tab>('attachments');

  const attachments = useMemo<TreeViewItem[]>(() => ATTACHMENTS.map((r) => ({ id: `a:${r.id}`, label: r.id, metadata: r.title })), []);
  const { vault, vaultOpen, docTitle } = useMemo(() => {
    const open: string[] = [];
    const titles = new Map<string, string>();
    const walk = (n: VaultNode, path: string): TreeViewItem => {
      const id = `v:${path}`;
      if (n.children) {
        open.push(id);
        return { id, label: n.name, children: n.children.map((c) => walk(c, `${path}/${c.name}`)) };
      }
      titles.set(id, n.name.replace(/\.[^.]+$/, ''));
      return { id, label: n.name };
    };
    const items = VAULT.map((n) => walk(n, n.name));
    return { vault: items, vaultOpen: open, docTitle: titles };
  }, []);

  const pick = (ids: string[]) => {
    const id = ids[0];
    if (!id) return;
    if (id.startsWith('a:')) {
      const r = ATTACHMENTS.find((x) => `a:${x.id}` === id);
      if (r) { onOpenDocument(`${r.id} ${r.title}`); onClose(); }
    } else {
      const t = docTitle.get(id);
      if (t) { onOpenDocument(t); onClose(); }
    }
  };

  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
      width={320}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { 'aria-label': 'View' } as never }}
    >
      <Box data-spec="view-panel" sx={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
        <ToggleButtonGroup
          ariaLabel="Document source"
          exclusive
          fullWidth
          size="small"
          value={tab}
          onChange={(_, v) => v && setTab(v as Tab)}
          buttonList={[{ value: 'attachments', label: 'Attachments' }, { value: 'vault', label: 'Vault' }]}
        />
        <Box sx={{ maxHeight: 'min(50vh, 240px)', overflowY: 'auto', minWidth: 0, ...thinScroll }}>
          {tab === 'attachments' ? (
            <TreeView key="attachments" items={attachments} width="100%" selectedItems={[]} handleSelection={pick} />
          ) : (
            <TreeView key="vault" items={vault} width="100%" selectedItems={[]} handleSelection={pick} defaultExpandedItems={vaultOpen} />
          )}
        </Box>
        <ToggleButtonGroup
          ariaLabel="Page width"
          label="Page width"
          exclusive
          fullWidth
          size="small"
          value={fit}
          onChange={(_, v) => v && onFit(v as FitMode)}
          buttonList={FIT_OPTIONS.map((f) => ({ value: f.value, label: f.label }))}
        />
      </Box>
    </Popover>
  );
}
