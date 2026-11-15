/**
 * NOT FROM FIGMA. Upload Attachment modal (reference .modal.lg 720px, S\ref\overlays\spec.md "attach-external" / "attach-vault"):
 * Document Options (External / Vault), the current Table/Row, a drop zone with a staged file list, or a sample document tree
 * for the Vault tab, and the "Previously Uploaded Attachments" reuse table (tick the left box to link an earlier item to the
 * current step). Files are not uploaded anywhere: only the name and size are kept (sample data). Vault documents are a
 * generic sample tree.
 */
import { useMemo, useRef, useState } from 'react';
import { CompactDialog } from '../../../components/feedback/CompactDialog/CompactDialog';
import { Box } from '../../../components/mui';
import { ArrowDown01Icon, Attachment01Icon, ArrowExpandIcon, ArrowShrinkIcon, File01Icon, Folder01Icon, Search01Icon, Upload04Icon } from '../../../icons';
import { panelRole } from '../../../theme/typography';
import { fmtDate, fmtTime, userName } from '../dialogs/common';
import { ref } from '../refTheme';
import { executionActions, useExecution } from '../store';
import { ui } from '../ui';
import { EvBtn, EvSelect, EvSq, thinScroll } from './EvControls';
import { evidenceSource, markVault } from './evidenceMeta';
import { ev } from './evRef';

interface VaultDoc { id: string; name: string }
interface VaultFolder { name: string; docs?: VaultDoc[]; folders?: VaultFolder[] }
const VAULT: VaultFolder[] = [
  {
    name: 'Equipment Library',
    folders: [
      { name: 'Blenders', docs: [{ id: 'v1', name: 'V-cone blender - User manual.pdf' }, { id: 'v2', name: 'Tachometer calibration certificate.pdf' }, { id: 'v3', name: 'V-cone blender - Maintenance log.pdf' }] },
      { name: 'Mixers', docs: [{ id: 'v4', name: 'Ribbon mixer - Specification.pdf' }, { id: 'v5', name: 'Ribbon mixer - IQ report.pdf' }] },
    ],
  },
];

const th = { p: '7px 9px', textAlign: 'left', fontSize: 10, lineHeight: '14.5px', fontWeight: panelRole.strong, color: ref.muted, background: ref.tint2, borderBottom: `1px solid ${ref.line}`, position: 'sticky', top: 0, whiteSpace: 'nowrap' } as const;
const td = { p: '7px 9px', fontSize: 11.5, lineHeight: '16.675px', color: ref.ink, borderBottom: `1px solid ${ev.tdLine}`, whiteSpace: 'nowrap' } as const;
const label12 = { fontSize: 12.5, lineHeight: '18.125px', fontWeight: panelRole.strong, color: ref.ink } as const;

export default function UploadModal({ tab: initial }: { tab?: 'external' | 'vault' }) {
  const s = useExecution();
  const step = s.selectedStepId ? s.protocol.steps[s.selectedStepId] : undefined;
  const blocked = !step ? 'Select a step first.' : step.evidence === null ? 'Evidence does not apply to this step.' : step.state === 'recorded' ? 'This step is recorded and locked.' : '';
  const [tab, setTab] = useState<'external' | 'vault'>(initial ?? 'external');
  const [wide, setWide] = useState(false);
  const [files, setFiles] = useState<{ name: string; sizeKb: number }[]>([]);
  const [docs, setDocs] = useState<VaultDoc[]>([]);
  const [reuse, setReuse] = useState<string[]>([]);
  const [vq, setVq] = useState('');
  const [q, setQ] = useState('');
  const [source, setSource] = useState('all');
  const [show, setShow] = useState('all');
  const [open, setOpen] = useState<Record<string, boolean>>({ 'Equipment Library': true, Blenders: true, Mixers: true });
  const input = useRef<HTMLInputElement>(null);
  const close = () => ui.close('upload');

  const rows = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return s.evidence.filter((e) => {
      const here = !!step && e.stepIds.includes(step.id);
      if (ql && !e.name.toLowerCase().includes(ql)) return false;
      if (source !== 'all' && evidenceSource(e.id).toLowerCase() !== source) return false;
      if (show === 'attached' && !here) return false;
      if (show === 'available' && here) return false;
      return true;
    });
  }, [s.evidence, q, source, show, step]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((f) => [...f, ...Array.from(list).map((x) => ({ name: x.name, sizeKb: Math.max(1, Math.round(x.size / 1024)) }))]);
  };
  const total = files.length + docs.length + reuse.length;

  const attach = () => {
    if (!step || blocked) return;
    let n = 0;
    const errs: string[] = [];
    for (const f of files) {
      const r = executionActions.addEvidence(step.id, { kind: 'file', name: f.name, sizeKb: f.sizeKb });
      if (r.ok) n++;
      else errs.push(r.errors[0] ?? '');
    }
    for (const d of docs) {
      const r = executionActions.addEvidence(step.id, { kind: 'file', name: d.name, sizeKb: 220 });
      if (r.ok && r.id) {
        markVault(r.id);
        n++;
      } else errs.push(r.errors[0] ?? '');
    }
    for (const id of reuse) {
      const r = executionActions.reuseEvidence(step.id, id);
      if (r.ok) n++;
      else errs.push(r.errors[0] ?? '');
    }
    if (errs.length) ui.toast('error', errs[0] ?? 'Could not attach.');
    if (n) {
      ui.toast('success', `${n} attachment${n === 1 ? '' : 's'} added to Table ${step.table} / Row ${step.row}`);
      close();
    }
  };

  const tree = (f: VaultFolder, depth: number): React.ReactNode => {
    const isOpen = open[f.name] ?? false;
    const ql = vq.trim().toLowerCase();
    const matchDoc = (d: VaultDoc) => !ql || d.name.toLowerCase().includes(ql);
    return (
      <Box key={f.name}>
        <Box
          component="button"
          type="button"
          aria-expanded={isOpen}
          onClick={() => setOpen({ ...open, [f.name]: !isOpen })}
          sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', p: '7px 8px 7px 6px', pl: `${6 + depth * 16}px`, m: 0, border: 0, borderRadius: '6px', background: 'transparent', cursor: 'pointer', fontFamily: ev.font, textAlign: 'left', fontSize: 12.5, lineHeight: '18.125px', fontWeight: panelRole.emphasis, color: ref.ink, '&:hover': { background: ref.tint2 } }}
        >
          <Box component="span" sx={{ display: 'inline-flex', color: ref.muted, transform: isOpen ? 'none' : 'rotate(-90deg)', transition: 'transform .15s ease' }}><ArrowDown01Icon size={10} /></Box>
          <Box component="span" sx={{ display: 'inline-flex', color: ev.folder }}><Folder01Icon size={16} /></Box>
          {f.name}
        </Box>
        {isOpen && (
          <Box>
            {f.folders?.map((c) => tree(c, depth + 1))}
            {f.docs?.filter(matchDoc).map((d) => (
              <Box key={d.id} component="label" sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '6px 8px', pl: `${6 + (depth + 1) * 16 + 18}px`, borderRadius: '6px', cursor: 'pointer', fontSize: 12.5, lineHeight: '18.125px', color: ref.ink, '&:hover': { background: ref.tint2 } }}>
                <input type="checkbox" checked={docs.some((x) => x.id === d.id)} onChange={(e) => setDocs(e.target.checked ? [...docs, d] : docs.filter((x) => x.id !== d.id))} style={{ margin: '3px 3px 3px 4px', accentColor: ref.blue3 }} />
                <Box component="span" sx={{ display: 'inline-flex', color: ref.muted }}><File01Icon size={14} /></Box>
                <Box component="span" sx={{ flex: 1, minWidth: 0 }}>{d.name}</Box>
                <Box
                  component="button"
                  type="button"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    close();
                    ui.open('evidence', { sop: d.name.replace(/\.[^.]+$/, '') });
                  }}
                  sx={{ p: 0, m: '0 0 0 auto', border: 0, background: 'transparent', cursor: 'pointer', fontFamily: ev.font, fontSize: 12.5, color: ref.ink, '&:hover': { color: ref.blue3, textDecoration: 'underline' } }}
                >
                  Preview
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const seg = (v: 'external' | 'vault', text: string) => (
    <Box component="button" type="button" aria-pressed={tab === v} onClick={() => setTab(v)} sx={{ p: '6px 16px', m: 0, border: 0, borderRadius: '6px', cursor: 'pointer', fontFamily: ev.font, fontSize: 12, lineHeight: 'normal', fontWeight: panelRole.strong, background: tab === v ? ref.blue3 : 'transparent', color: tab === v ? ref.white : ev.seg, '&:focus-visible': { outline: `2px solid ${ref.blue4}`, outlineOffset: 1 } }}>
      {text}
    </Box>
  );

  const ctx = step ? `Table ${step.table} · Row ${step.row}` : 'No step selected';
  const cur = step ? `${step.table}/${step.row}` : '-';

  return (
    <CompactDialog
      open
      onClose={close}
      width={wide ? 1100 : 720}
      icon={<Attachment01Icon size={18} />}
      title="Upload Attachment"
      subtitle={ctx}
      dense
      headerActions={
        <EvSq bare size={26} aria-label={wide ? 'Restore size' : 'Maximise'} title={wide ? 'Restore size' : 'Maximise'} onClick={() => setWide(!wide)} sx={{ width: 23, borderRadius: '5px' }}>
          {wide ? <ArrowShrinkIcon size={14} /> : <ArrowExpandIcon size={14} />}
        </EvSq>
      }
      footerStart={blocked ? <Box role="alert" sx={{ fontSize: 11, lineHeight: '15.95px', color: ref.failFg }}>{blocked}</Box> : undefined}
      secondaryAction={{ label: 'Cancel', onClick: close }}
      primaryAction={{ label: total ? `Attach (${total})` : 'Attach', onClick: attach, disabled: total === 0 || !!blocked }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', p: '9px 0', borderBottom: `1px solid ${ref.line}` }}>
        <Box component="span" sx={{ ...label12, width: 150 }}>Document Options</Box>
        <Box role="group" aria-label="Document source" sx={{ display: 'flex', p: '3px', boxSizing: 'border-box', border: `1px solid ${ref.line}`, borderRadius: '8px', background: ref.bg }}>
          {seg('external', 'External')}
          {seg('vault', 'Vault')}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', p: '9px 0', borderBottom: `1px solid ${ref.line}` }}>
        <Box component="span" sx={{ ...label12, width: 150 }}>Current Table/Row</Box>
        <Box component="span" sx={{ ...label12, color: ref.blue3 }}>{cur.replace('/', ' / ')}</Box>
      </Box>

      {tab === 'external' ? (
        <Box sx={{ p: '14px 0 0' }}>
          <Box
            component="div"
            role="button"
            tabIndex={0}
            aria-label="Drop files here or click to browse"
            onClick={() => input.current?.click()}
            onKeyDown={(e: React.KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), input.current?.click())}
            onDragOver={(e: React.DragEvent) => e.preventDefault()}
            onDrop={(e: React.DragEvent) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            data-spec="at-drop"
            sx={{ boxSizing: 'border-box', p: '26px', textAlign: 'center', border: `2px dashed ${ev.dashed}`, borderRadius: '11px', background: ref.tint2, cursor: 'pointer', color: ref.blue3, '&:hover': { background: ref.tint, borderColor: ref.blue4 }, '&:focus-visible': { outline: `2px solid ${ref.blue4}`, outlineOffset: 2 } }}
          >
            <Upload04Icon size={28} />
            <Box sx={{ m: '7px 0 0', fontSize: 13, lineHeight: '18.85px', fontWeight: panelRole.strong, color: ref.ink }}>Drop files here or click to browse</Box>
            <Box sx={{ m: '3px 0 0', fontSize: 11, lineHeight: '15.95px', color: ref.muted }}>PDF, DOCX, XLSX, PNG, JPG, MP4 · max 50 MB (sample: only the file name is kept)</Box>
            <input ref={input} type="file" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
          </Box>
          {files.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', m: '10px 0 0' }}>
              {files.map((f, i) => (
                <Box key={`${f.name}${i}`} sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '5px 10px', border: `1px solid ${ref.line}`, borderRadius: '8px', fontSize: 11.5, lineHeight: '16.675px' }}>
                  <File01Icon size={14} />
                  <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</Box>
                  <Box sx={{ color: ref.muted }}>{f.sizeKb} KB</Box>
                  <EvBtn sm aria-label={`Remove ${f.name}`} onClick={() => setFiles(files.filter((_, k) => k !== i))}>Remove</EvBtn>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ p: '14px 0 0' }}>
          <Box component="label" htmlFor="ee-vault-q" sx={{ display: 'block', m: '14px 0 6px', fontSize: 12, lineHeight: '17.4px', fontWeight: panelRole.strong }}>Select Documents</Box>
          <SearchField id="ee-vault-q" value={vq} onChange={setVq} placeholder="Search documents..." />
          <Box data-spec="at-tree" sx={{ m: '10px 0 0', p: '6px', boxSizing: 'border-box', height: 260, overflow: 'auto', border: `1px solid ${ref.line}`, borderRadius: '9px', background: ref.white, ...thinScroll }}>
            {VAULT.map((f) => tree(f, 0))}
          </Box>
        </Box>
      )}

      <Box data-spec="at-reuse" sx={{ m: '16px 0 0', p: '14px 0 0', borderTop: `1px solid ${ref.line}` }}>
        <Box sx={{ m: '0 0 8px', fontSize: 12.5, lineHeight: '18.125px', fontWeight: panelRole.heavy, color: ref.blue3 }}>
          Previously Uploaded Attachments
          <Box component="span" sx={{ display: 'block', m: '3px 0 0', fontSize: 11, lineHeight: '15.95px', fontWeight: panelRole.menuItem, color: ref.muted }}>
            Tick the <b style={{ fontWeight: panelRole.strong }}>left box</b> to attach to the current step (Table/Row {cur}). Items already attached to this step are shown in green.
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', m: '0 0 8px', flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 200px', maxWidth: 274 }}><SearchField id="ee-reuse-q" value={q} onChange={setQ} placeholder="Search previously uploaded attachments" /></Box>
          <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 11, fontWeight: panelRole.strong, color: ref.muted }}>
            Source
            <EvSelect label="Source" value={source} onChange={setSource} options={[{ value: 'all', label: 'All' }, { value: 'external', label: 'External' }, { value: 'vault', label: 'Vault' }]} />
          </Box>
          <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 11, fontWeight: panelRole.strong, color: ref.muted }}>
            Show
            <EvSelect label="Show" value={show} onChange={setShow} options={[{ value: 'all', label: 'All' }, { value: 'attached', label: 'Attached to this step' }, { value: 'available', label: 'Not attached to this step' }]} />
          </Box>
          <EvBtn onClick={() => { setQ(''); setSource('all'); setShow('all'); }} sx={{ color: ref.blue3, p: '5px 12px', fontSize: 12 }}>Clear</EvBtn>
        </Box>
        <Box data-spec="at-tablewrap" sx={{ boxSizing: 'border-box', height: 218.4, overflow: 'auto', border: `1px solid ${ref.line}`, borderRadius: '8px', ...thinScroll }}>
          <Box component="table" sx={{ borderCollapse: 'collapse', minWidth: 760, width: '100%', background: ref.white }}>
            <thead>
              <tr>
                {['Attach', 'Attachment Name', 'Source', 'Table/Row', 'Uploaded By', 'Uploaded On', 'Comments'].map((h) => <Box component="th" key={h} sx={th}>{h}</Box>)}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><Box component="td" colSpan={7} sx={{ ...td, color: ref.muted, textAlign: 'center', p: '24px' }}>No attachments match.</Box></tr>
              )}
              {rows.map((e) => {
                const here = !!step && e.stepIds.includes(step.id);
                const first = s.protocol.steps[e.stepIds[0] ?? ''];
                return (
                  <Box component="tr" key={e.id} sx={{ background: here ? ev.attachedRow : 'transparent' }}>
                    <Box component="td" sx={td}>
                      <input type="checkbox" aria-label={`Attach ${e.name}`} disabled={here || !!blocked} checked={here || reuse.includes(e.id)} onChange={(c) => setReuse(c.target.checked ? [...reuse, e.id] : reuse.filter((x) => x !== e.id))} style={{ width: 13, height: 13, margin: '3px 3px 3px 4px', accentColor: ref.blue3 }} />
                    </Box>
                    <Box component="td" sx={td}>{e.name}</Box>
                    <Box component="td" sx={td}>{evidenceSource(e.id)}</Box>
                    <Box component="td" sx={td}>{first ? `${first.table}/${first.row}` : '-'}</Box>
                    <Box component="td" sx={td}>{userName(s, e.addedBy)}</Box>
                    <Box component="td" sx={td}>{`${fmtDate(e.when)} ${fmtTime(e.when)}`}</Box>
                    <Box component="td" sx={{ ...td, color: ev.faint }}>-</Box>
                  </Box>
                );
              })}
            </tbody>
          </Box>
        </Box>
      </Box>
    </CompactDialog>
  );
}

function SearchField({ id, value, onChange, placeholder }: { id: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Box component="span" aria-hidden sx={{ position: 'absolute', left: 12, top: 0, bottom: 0, display: 'flex', alignItems: 'center', color: ref.muted }}><Search01Icon size={14} /></Box>
      <Box component="input" id={id} type="search" aria-label={placeholder} placeholder={placeholder} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} sx={{ width: '100%', height: 36, p: '0 12px 0 34px', boxSizing: 'border-box', border: `1px solid ${ref.line}`, borderRadius: '8px', background: ref.white, color: ref.ink, fontFamily: ev.font, fontSize: 13, '&:focus': { outline: 'none', borderColor: ev.focusBlue }, '&::placeholder': { color: ref.muted } }} />
    </Box>
  );
}
