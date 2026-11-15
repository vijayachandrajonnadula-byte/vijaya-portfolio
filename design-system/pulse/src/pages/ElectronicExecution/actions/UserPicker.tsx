import { useState } from 'react';
import { Box } from '../../../components/mui';
import { SideSurface } from '../../../components/feedback/SideSurface/SideSurface';
import { actRef, fonts, ref } from '../refTheme';
import type { User } from '../model';
import { Av, Closer, W, tx } from './parts';
import { RefButton, focusRing } from '../shell/RefControls';

/**
 * User picker slider (880px) opened from the Assigned To / Verifier select. Users appear as roles. One user is chosen:
 * the store takes a single assignee per task. Users who may not take the task are listed but disabled.
 */
export default function UserPicker({ title, users, initial, canPick, onCancel, onSelect }: { title: string; users: User[]; initial: string; canPick: (u: User) => boolean; onCancel: () => void; onSelect: (id: string) => void }) {
  const [sel, setSel] = useState(initial);
  const th = { p: '11px 14px', borderBottom: `1px solid ${ref.line}`, background: ref.tint2, position: 'sticky', top: 0, textAlign: 'left', letterSpacing: '0.4px', ...tx(11, W.strong, ref.muted, 15.95) } as const;
  const td = { p: '10px 14px', borderBottom: `1px solid ${ref.tint2}`, ...tx(12.5, W.regular, ref.ink, 18.125) } as const;
  return (
    <SideSurface
      ariaLabel={title}
      width={880}
      onClose={onCancel}
      duration={0}
      scrim={actRef.scrimPicker}
      shadow={actRef.shadowPicker}
      fontFamily={fonts.shell}
      header={
        <Box data-spec="picker-head" sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '0 18px', height: 56, borderBottom: `1px solid ${ref.line}`, boxSizing: 'border-box', flexShrink: 0 }}>
          <Box sx={{ flex: 1, ...tx(16, W.strong, ref.ink, 23.2) }}>{title}</Box>
          <Closer onClose={onCancel} box={32} size={20} />
        </Box>
      }
      footer={
        <Box data-spec="picker-foot" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', p: '0 18px', height: 56, borderTop: `1px solid ${ref.line}`, boxSizing: 'border-box', flexShrink: 0 }}>
          <RefButton onClick={onCancel} sx={{ height: 29, p: '6px 14px', boxSizing: 'border-box', border: `1px solid ${actRef.cancelLine}`, borderRadius: '7px', background: ref.white, ...tx(12, W.emphasis, ref.ink), '&:hover': { background: ref.tint2 } }}>Cancel</RefButton>
          <RefButton disabled={!sel} onClick={() => onSelect(sel)} sx={{ height: 27, p: '6px 16px', borderRadius: '7px', background: ref.navy2, ...tx(12, W.strong, ref.white), '&:hover:not(:disabled)': { background: actRef.submitHover } }}>Select</RefButton>
        </Box>
      }
    >
      <Box component="table" data-spec="picker-table" sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            <Box component="th" sx={{ ...th, width: 48 }} aria-label="Choose" />
            {['User', 'User ID', 'Role', 'Can execute', 'Can verify'].map((h) => <Box component="th" key={h} sx={th}>{h}</Box>)}
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => {
            const ok = canPick(u);
            return (
              <Box component="tr" key={u.id} onClick={() => ok && setSel(u.id)} sx={{ cursor: ok ? 'pointer' : 'default', '&:hover td': { background: ok ? actRef.rowHover : undefined } }}>
                <Box component="td" sx={td}>
                  <Box component="input" type="radio" name="picker-user" aria-label={`Choose ${u.name}`} checked={sel === u.id} disabled={!ok} onChange={() => setSel(u.id)} sx={{ width: 13, height: 13, m: '3px 3px 3px 4px', accentColor: ref.blue3, cursor: ok ? 'pointer' : 'not-allowed', opacity: ok ? 1 : 0.4, ...focusRing }} />
                </Box>
                <Box component="td" sx={td}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '9px', ...tx(12.5, W.strong, ref.ink, 18.125), opacity: ok ? 1 : 0.5 }}>
                    <Av text={u.initials} color={actRef.avatars[i % actRef.avatars.length] as string} />
                    {u.name}
                  </Box>
                </Box>
                <Box component="td" sx={td}>{u.id}</Box>
                <Box component="td" sx={td}>{u.role}</Box>
                <Box component="td" sx={td}>{u.canExecute ? 'Yes' : 'No'}</Box>
                <Box component="td" sx={td}>{u.canVerify ? 'Yes' : 'No'}</Box>
              </Box>
            );
          })}
        </tbody>
      </Box>
    </SideSurface>
  );
}
