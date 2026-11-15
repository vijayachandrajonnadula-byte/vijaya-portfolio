/** Independent verification of a whole table: a user other than the executor signs. Compact e-signature layout (480px). */
import { useState } from 'react';
import { ElectronicSignature } from '../../../components/documents/ElectronicSignature/ElectronicSignature';
import { Select } from '../../../components/form/Select/Select';
import { SIGN_REASONS } from '../model';
import { executionActions, useExecution } from '../store';
import { ui } from '../ui';
import { ErrorLines, LEGAL_TEXT, acceptStatement, userName } from './common';

export default function VerifyDialog({ table }: { table: number }) {
  const s = useExecution();
  const t = s.protocol.tables.find((x) => x.n === table);
  const verifiers = s.users.filter((u) => u.canVerify);
  const current = s.users.find((u) => u.id === s.currentUserId);
  const [verifierId, setVerifierId] = useState(current?.canVerify ? current.id : '');
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [remarks, setRemarks] = useState('');
  const [accept, setAccept] = useState(false);
  const [tried, setTried] = useState(false);
  const [storeErrors, setStoreErrors] = useState<string[]>([]);

  const executors = [...new Set((t?.stepIds ?? []).flatMap((id) => (s.protocol.steps[id]?.signature ? [s.protocol.steps[id]!.signature!.userId] : [])))];
  const close = () => ui.close('verify');

  const verErr = tried && !verifierId;
  const reasonErr = tried && !reason;
  const pwErr = tried && !password.trim();
  const acceptErr = tried && !accept;

  const submit = () => {
    setTried(true);
    if (!verifierId || !reason || !password.trim() || !accept) return;
    const r = executionActions.verifyTable(table, { verifierId, reason, password, accept, remarks });
    if (!r.ok) {
      setStoreErrors(r.errors);
      return;
    }
    ui.close('verify');
    ui.toast('success', `Table ${table} verified`);
  };

  return (
    <ElectronicSignature
      open
      compact
      handleFlyoutClose={close}
      handleSecondary={close}
      handleSign={submit}
      signButtonLabel="Verify and sign"
      avatarContent="✓"
      contextText={
        <>
          Verifying <b>{`Table ${table}`}</b>
          {executors.length ? ` · executed by ${executors.map((id) => userName(s, id)).join(', ')}` : ''}
        </>
      }
      userDetails={{ name: 'Independent verification', role: 'Must be signed by a user other than the executor' }}
      errorMessage={acceptErr || storeErrors.length ? <ErrorLines messages={[...(acceptErr ? ['Accept the signature statement.'] : []), ...storeErrors]} /> : undefined}
      beforeFields={
        <Select
          size="small"
          label="Verifying user"
          required
          placeholder="Select a verifier"
          options={verifiers.map((u) => ({ label: `${u.name} (${u.role})`, value: u.id }))}
          value={verifierId}
          error={verErr}
          hint={verErr ? 'Select a verifier.' : undefined}
          onChange={(v) => setVerifierId(Array.isArray(v) ? (v[0] ?? '') : v)}
        />
      }
      userIdReadOnly
      fields={{
        type: 'reason',
        reason: { label: 'Reason for E-sign', options: [...SIGN_REASONS], value: reason, error: reasonErr, hint: reasonErr ? 'Select a reason.' : undefined, onChange: setReason },
        userId: { value: verifierId, placeholder: 'Filled from the verifier', onChange: () => {} },
        password: { value: password, error: pwErr, hint: pwErr ? 'Enter your password.' : undefined, onChange: (e) => setPassword(e.target.value) },
        comments: { label: 'Remarks', placeholder: 'Write a remark', value: remarks, onChange: (e) => setRemarks(e.target.value) },
      }}
      notificationValues={acceptStatement(accept, setAccept, acceptErr, LEGAL_TEXT)}
    />
  );
}
