/** "Execution history" drawer for one step: 60vw, one table row per version (reference layout). */
import { Button } from '../../../components/actions/Button/Button';
import { Chip } from '../../../components/data-display/Chip/Chip';
import { EmptyState } from '../../../components/data-display/EmptyState/EmptyState';
import { Flyout } from '../../../components/feedback/Flyout/Flyout';
import { Box } from '../../../components/mui';
import { pt } from '../../../theme/pulseTokens';
import { role } from '../../../theme/typography';
import { drawerRef } from '../refTheme';
import { useExecution } from '../store';
import { ui } from '../ui';
import { Muted, VerdictStatus, fmtWhen, plainText, stepLabel } from './common';

const COLS = ['Version', 'Step', 'Instructions', 'Expected result', 'Ref', 'Actual result', 'Evidence', 'P/F', 'Signature', 'Reason for edit'];
const cell = { p: '8px 10px', border: `1px solid ${drawerRef.tdBorder}`, verticalAlign: 'top', fontSize: 12, lineHeight: '17px', color: pt.colors.neutral[900], textAlign: 'left' } as const;
const head = { ...cell, bgcolor: drawerRef.thBg, borderColor: drawerRef.thBorder, fontWeight: role.dialogTitle } as const;

export default function HistoryDrawer({ stepId }: { stepId: string }) {
  const s = useExecution();
  const step = s.protocol.steps[stepId];
  const close = () => ui.close('history');
  const versions = step ? [...step.history].reverse() : [];
  const current = step?.history.length ?? 0;

  return (
    <Flyout
      open
      onClose={close}
      width="60vw"
      headerProps={{ title: 'Execution history', metadata: step ? `${stepLabel(step)} - ${step.reference}` : undefined }}
      footerLeft={<Muted>{`${versions.length} version${versions.length === 1 ? '' : 's'}`}</Muted>}
      footer={<Button variant="outlined" size="small" onClick={close}>Close</Button>}
    >
      {step && versions.length === 0 && <EmptyState type="noRecords" size="small" title="No history yet" description="A version is added each time the step is saved or recorded." />}
      {step && versions.length > 0 && (
        <Box sx={{ overflowX: 'auto' }}>
          <Box component="table" data-spec="history-table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {COLS.map((c) => (
                  <Box component="th" key={c} sx={head}>{c}</Box>
                ))}
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.v} aria-current={v.v === current ? 'step' : undefined}>
                  <Box component="td" sx={{ ...cell, fontWeight: role.dialogTitle }}>
                    {v.v}
                    {v.v === current && <Box sx={{ mt: '4px' }}><Chip label="Current" color="brand" variant="fill" size="xxsmall" /></Box>}
                  </Box>
                  <Box component="td" sx={cell}>{step.row}</Box>
                  <Box component="td" sx={cell}>{step.instructions}</Box>
                  <Box component="td" sx={cell}>{step.expected}</Box>
                  <Box component="td" sx={cell}>{step.reference}</Box>
                  <Box component="td" sx={cell}>{plainText(v.actual) || 'None'}</Box>
                  <Box component="td" sx={cell}>{v.evidenceNames.length ? v.evidenceNames.join(', ') : 'None'}</Box>
                  <Box component="td" sx={cell}><VerdictStatus verdict={v.verdict} /></Box>
                  <Box component="td" sx={cell}>
                    {v.signature ? v.signature.who : v.draft ? 'Saved value (draft)' : 'Not signed'}
                    <Box sx={{ fontSize: 11, color: drawerRef.subText }}>{fmtWhen(v.when)}</Box>
                  </Box>
                  <Box component="td" sx={cell}>{v.reason || 'N/A'}</Box>
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
      )}
    </Flyout>
  );
}
