import { useState } from 'react';
import { Box } from '../../../components/mui';
import { Flyout } from '../../../components/feedback/Flyout/Flyout';
import { Button } from '../../../components/actions/Button/Button';
import { Notification } from '../../../components/feedback/Notification/Notification';
import { Calendar01Icon, Cancel01Icon, PlusSignIcon, UserIcon } from '../../../icons';
import { actRef, ref } from '../refTheme';
import { executionActions, stepsInTable, useExecution } from '../store';
import type { SplitAssignment, SplitScope, User } from '../model';
import { ui } from '../ui';
import { W, tx } from './parts';
import { RefSelect } from './RefSelect';
import UserPicker from './UserPicker';
import { RuleErrors } from './shared';
import { RefButton, focusRing } from '../shell/RefControls';

type Mode = 'split' | 'verify';
interface Draft {
  key: number;
  table: number | null;
  scope: SplitScope;
  rows: number[];
  userId: string;
}
let keySeq = 0;
const blank = (): Draft => ({ key: ++keySeq, table: null, scope: 'entire', rows: [], userId: '' });
const PICKER = '__picker__';

/** Column widths (px) of the 1388px drawer, from the reference. The last column takes what is left. */
const COLS = {
  split: [110, 270.4, 230, 285.4, 119.9, 130, 160],
  verify: [110, 469.9, 230, 495.8],
} as const;

const th = { p: '10px 14px', borderBottom: `1px solid ${ref.line}`, background: ref.tint2, textAlign: 'left', ...tx(12.5, W.emphasis, ref.ink, 18.125) } as const;
const td = { p: '8px 10px', borderBottom: `1px solid ${ref.tint2}`, verticalAlign: 'middle' } as const;
const field = { width: '100%', height: 32, p: '0 10px', boxSizing: 'border-box', border: `1px solid ${ref.line}`, borderRadius: '6px', background: ref.white, ...tx(12.5, W.regular, ref.ink) } as const;

/**
 * Split execution and verification assignment share this drawer (1388px, x 52): a task grid with Add Table, a footer with View
 * Details and Submit, and a user picker slider. Split writes executionActions.splitExecution (the store enforces the rules);
 * verification writes assignVerifier per table.
 */
export default function AssignDrawer({ mode }: { mode: Mode }) {
  const s = useExecution();
  const verify = mode === 'verify';
  const name = verify ? 'verifyAssign' : 'split';
  const close = () => ui.close(name);
  const users = s.users;
  const primary = s.users.find((u) => u.id === s.currentUserId && u.canExecute) ?? s.users.find((u) => u.canExecute);

  const [drafts, setDrafts] = useState<Draft[]>(() => {
    const init: Draft[] = verify
      ? Object.entries(s.verifierAssignments).map(([t, u]) => ({ key: ++keySeq, table: Number(t), scope: 'entire' as const, rows: [], userId: u }))
      : s.splits.map((a) => ({ key: ++keySeq, table: a.table, scope: a.scope, rows: [...a.rows], userId: a.assigneeId }));
    return init.length ? init : [blank()];
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [picker, setPicker] = useState<number | null>(null);

  const patch = (key: number, p: Partial<Draft>) => setDrafts((d) => d.map((x) => (x.key === key ? { ...x, ...p } : x)));
  const eligible = (u: User) => (verify ? u.canVerify : u.canExecute);
  const tableOptions = s.protocol.tables.map((t) => ({ value: t.n, label: `${t.num} ${t.title}` }));
  const userOptions = [...users.filter(eligible).map((u) => ({ value: u.id, label: u.name })), { value: PICKER, label: 'Browse users...' }];

  const executorsOf = (table: number) => new Set(stepsInTable(s, table).flatMap((x) => (x.signature && x.signature.by !== 'na' ? [x.signature.userId] : [])));
  const conflicts = verify ? drafts.filter((d) => d.table && d.userId && executorsOf(d.table).has(d.userId)) : [];

  const submit = () => {
    const used = drafts.filter((d) => d.table !== null || d.userId);
    const errs: string[] = [];
    for (const d of used) {
      const i = drafts.indexOf(d) + 1;
      if (d.table === null) errs.push(`Task ${i}: choose a table.`);
      else if (!d.userId) errs.push(`Task ${i}: choose ${verify ? 'a verifier' : 'who it is assigned to'}.`);
    }
    if (verify) {
      const seen = new Set<number>();
      for (const d of used) if (d.table !== null) { if (seen.has(d.table)) errs.push(`Table ${d.table} is listed twice.`); seen.add(d.table); }
    }
    if (errs.length) return setErrors(errs);
    if (verify) {
      const next = new Map(used.map((d) => [d.table as number, d.userId]));
      for (const t of s.protocol.tables) {
        const to = next.get(t.n) ?? null;
        if (to !== (s.verifierAssignments[t.n] ?? null)) executionActions.assignVerifier(t.n, to);
      }
      ui.toast('success', 'Verification assignment saved');
      return close();
    }
    const plan: SplitAssignment[] = used.map((d) => ({ assigneeId: d.userId, table: d.table as number, scope: d.scope, rows: d.scope === 'rows' ? [...d.rows].sort((a, b) => a - b) : [] }));
    const r = executionActions.splitExecution(plan);
    if (!r.ok) return setErrors(r.errors);
    ui.toast('success', plan.length === 0 ? 'Split removed' : `Execution split into ${plan.length} assignment${plan.length === 1 ? '' : 's'}`);
    close();
  };

  const widths = COLS[mode];
  const heads = verify ? ['Task ID', 'Table Name', 'Row(s)', 'Verifier', 'Status'] : ['Task ID', 'Table Name', 'Row(s)', 'Assigned To', 'Predecessor', 'Process', 'Target Date', 'Status'];
  const picking = picker !== null ? drafts.find((d) => d.key === picker) : undefined;

  return (
    <>
      <Flyout
        open
        width="calc(100vw - 52px)"
        onClose={close}
        backdropOpacity={0.3}
        headerProps={{ title: verify ? 'Assign for Verification' : 'Split Execution' }}
        disableContentPadding
        footer={
          <>
            <Button size="small" variant="outlined" onClick={() => ui.open('details')}>View Details</Button>
            <Button size="small" onClick={submit}>Submit</Button>
          </>
        }
      >
        {!verify && (
          <Box data-spec="primary-strip" sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '9px 16px', mb: '4px', background: actRef.stripBg, borderBottom: `1px solid ${actRef.stripLine}`, ...tx(12.5, W.regular, ref.navy2, 18.125) }}>
            <UserIcon size={14} />
            <Box component="span">Primary Executor:</Box>
            <Box component="b" sx={{ mx: '2px', fontWeight: W.strong }}>{primary?.name ?? 'None'}</Box>
            <Box component="span" sx={{ ...tx(12.5, W.menuItem, actRef.stripMuted, 18.125) }}>· the plan is saved with the execution; this sample does not limit who can record a step</Box>
          </Box>
        )}
        {errors.length > 0 && <Box sx={{ p: '12px 16px 0' }}><RuleErrors title={verify ? 'The assignment was not saved' : 'The split was not applied'} errors={errors} /></Box>}
        {conflicts.length > 0 && (
          <Box sx={{ p: '12px 16px 0' }}>
            <Notification color="orange" title="Check the assignment" body={`${conflicts.map((d) => `Table ${d.table}`).join(', ')}: the chosen verifier also recorded steps there. Verification will be refused for them.`} />
          </Box>
        )}
        <Box component="table" data-spec="assign-grid" sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
          <colgroup>{widths.map((w, i) => <col key={i} style={{ width: w }} />)}<col /></colgroup>
          <thead>
            <tr>{heads.map((h) => <Box component="th" key={h} sx={th}>{h}</Box>)}</tr>
          </thead>
          <tbody>
            {drafts.map((d, i) => {
              const table = s.protocol.tables.find((t) => t.n === d.table);
              return (
                <tr key={d.key}>
                  <Box component="td" sx={td}><Box sx={{ ...field, display: 'flex', alignItems: 'center', width: 90 }}>Task {i + 1}</Box></Box>
                  <Box component="td" sx={td}>
                    <RefSelect ariaLabel={`Task ${i + 1} table`} value={d.table} placeholder="Select table(s)" options={tableOptions} onSelect={(o) => patch(d.key, { table: Number(o.value), rows: [] })} />
                  </Box>
                  <Box component="td" sx={td}>
                    {!table ? (
                      <Box component="span" sx={tx(12, W.regular, ref.muted2, 17.4)}>Select table(s) first</Box>
                    ) : verify ? (
                      <Box component="span" sx={tx(12, W.regular, ref.ink, 17.4)}>Entire table ({table.stepIds.length} rows)</Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <Box role="group" aria-label={`Task ${i + 1} rows`} sx={{ display: 'inline-flex', gap: '4px' }}>
                          {(['entire', 'rows'] as const).map((k) => (
                            <RefButton key={k} aria-pressed={d.scope === k} onClick={() => patch(d.key, { scope: k })} sx={{ height: 24, p: '0 9px', border: `1px solid ${d.scope === k ? ref.blue3 : ref.line}`, borderRadius: '12px', background: d.scope === k ? ref.tint : ref.white, ...tx(11, W.emphasis, d.scope === k ? ref.blue3 : ref.muted), ...focusRing }}>{k === 'entire' ? 'Entire table' : 'Specific rows'}</RefButton>
                          ))}
                        </Box>
                        {d.scope === 'rows' && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {table.stepIds.map((_, ri) => (
                              <Box component="label" key={ri} sx={{ display: 'inline-flex', alignItems: 'center', gap: '2px', p: '1px 7px 1px 0', border: `1px solid ${ref.line}`, borderRadius: '8px', cursor: 'pointer', ...tx(11, W.emphasis, ref.ink, 16) }}>
                                <Box component="input" type="checkbox" checked={d.rows.includes(ri + 1)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch(d.key, { rows: e.target.checked ? [...d.rows, ri + 1] : d.rows.filter((x) => x !== ri + 1) })} sx={{ width: 12, height: 12, m: '3px 3px 3px 4px', accentColor: ref.blue3 }} />
                                {ri + 1}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                  <Box component="td" sx={td}>
                    <RefSelect
                      ariaLabel={`Task ${i + 1} ${verify ? 'verifier' : 'assignee'}`}
                      value={d.userId || null}
                      placeholder="Select assignee"
                      options={userOptions}
                      onSelect={(o) => (o.value === PICKER ? setPicker(d.key) : patch(d.key, { userId: String(o.value) }))}
                    />
                  </Box>
                  {!verify && (
                    <>
                      <Box component="td" sx={td}><RefSelect ariaLabel="Predecessor (not stored in this sample)" title="Not stored in this sample" value="none" placeholder="None" options={[{ value: 'none', label: 'None' }]} onSelect={() => undefined} disabled /></Box>
                      <Box component="td" sx={td}><RefSelect ariaLabel="Process (not stored in this sample)" title="Not stored in this sample" value={null} placeholder="Select" options={[]} onSelect={() => undefined} disabled /></Box>
                      <Box component="td" sx={td}>
                        <Box title="Not stored in this sample" aria-disabled sx={{ ...field, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', background: ref.tint2, opacity: 0.7, cursor: 'not-allowed', color: ref.muted }}>
                          Select Date <Calendar01Icon size={14} />
                        </Box>
                      </Box>
                    </>
                  )}
                  <Box component="td" sx={td}>
                    <RefButton
                      aria-label={`Remove task ${i + 1}`}
                      onClick={() => setDrafts((x) => (x.length > 1 ? x.filter((y) => y.key !== d.key) : [blank()]))}
                      sx={{ width: 28.6, height: 28, justifyContent: 'center', boxSizing: 'border-box', border: `1px solid ${actRef.dangerLine}`, borderRadius: '5px', background: actRef.dangerBg, color: actRef.danger, '&:hover': { background: actRef.dangerHover }, ...focusRing }}
                    >
                      <Cancel01Icon size={12} />
                    </RefButton>
                  </Box>
                </tr>
              );
            })}
          </tbody>
        </Box>
        <RefButton
          onClick={() => setDrafts((d) => [...d, blank()])}
          sx={{ m: '14px 14px 4px', height: 35, p: '9px 16px', gap: '7px', boxSizing: 'border-box', border: `1px dashed ${actRef.dashed}`, borderRadius: '8px', background: ref.white, transition: 'all .12s ease', ...tx(12.5, W.strong, ref.navy2), '&:hover': { background: actRef.stripBg, borderColor: ref.navy2 }, ...focusRing }}
        >
          <PlusSignIcon size={14} /> Add Table
        </RefButton>
      </Flyout>
      {picking && (
        <UserPicker
          title={verify ? 'Verifiers' : 'Executors'}
          users={users}
          initial={picking.userId}
          canPick={eligible}
          onCancel={() => setPicker(null)}
          onSelect={(id) => { patch(picking.key, { userId: id }); setPicker(null); }}
        />
      )}
    </>
  );
}
