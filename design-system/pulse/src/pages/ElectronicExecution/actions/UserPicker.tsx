import { useState } from 'react';
import { Box } from '../../../components/mui';
import { Flyout } from '../../../components/feedback/Flyout/Flyout';
import { Button } from '../../../components/actions/Button/Button';
import { actRef, ref } from '../refTheme';
import type { User } from '../model';
import { Av, W, tx } from './parts';
import { focusRing } from '../shell/RefControls';

/**
 * User picker slider (880px) opened from the Assigned To / Verifier select. Users appear as roles. One user is chosen:
 * the store takes a single assignee per task. Users who may not take the task are listed but disabled.
 */
export default function UserPicker({ title, users, initial, canPick, onCancel, onSelect }: { title: string; users: User[]; initial: string; canPick: (u: User) => boolean; onCancel: () => void; onSelect: (id: string) => void }) {
  const [sel, setSel] = useState(initial);
  const th = { p: '11px 14px', borderBottom: `1px solid ${ref.line}`, background: ref.tint2, position: 'sticky', top: 0, textAlign: 'left', letterSpacing: '0.4px', ...tx(11, W.strong, ref.muted, 15.95) } as const;
  const td = { p: '10px 14px', borderBottom: `1px solid ${ref.tint2}`, ...tx(12.5, W.regular, ref.ink, 18.125) } as const;
  return (
    <Flyout
      open
      width={880}
      onClose={onCancel}
      backdropOpacity={0.3}
      headerProps={{ title }}
      disableContentPadding
      footer={
        <>
          <Button size="small" variant="outlined" onClick={onCancel}>Cancel</Button>
          <Button size="small" disabled={!sel} onClick={() => onSelect(sel)}>Select</Button>
        </>
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
    </Flyout>
  );
}
