import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { PasswordStrength, getPasswordStrength } from './PasswordStrength';
import type { PasswordStrengthLabel, PasswordStrengthStatus } from './PasswordStrength';
import { TextField } from '../TextField/TextField';
import { Caption, Section } from '../../_shared/ForceState';

const statuses: PasswordStrengthStatus[] = ['veryWeak', 'weak', 'moderate', 'strong', 'veryStrong'];
const labels: PasswordStrengthLabel[] = [false, 'right', 'topRight', 'topBoth', 'bottomRight', 'bottomBoth'];

/** Figma "Password Strength": Label (6 layouts) x Status (5 levels), plus a live example. */
export default function PasswordStrengthDemo() {
  const [pw, setPw] = useState('Pulse#2024x');
  return (
    <Stack spacing={4}>
      <Section title="Label x Status">
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 400px))', gap: 3 }}>
          {labels.map((l) =>
            statuses.map((s) => (
              <Stack key={`${String(l)}${s}`} spacing={0.5}>
                <Caption>{`${String(l)} / ${s}`}</Caption>
                <PasswordStrength status={s} label={l} hint="Guide message" />
              </Stack>
            )),
          )}
        </Box>
      </Section>
      <Section title="Live">
        <Stack spacing={1} sx={{ width: 320 }}>
          <TextField label="Password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <PasswordStrength status={getPasswordStrength(pw)} width="100%" label="bottomBoth" />
        </Stack>
      </Section>
    </Stack>
  );
}
