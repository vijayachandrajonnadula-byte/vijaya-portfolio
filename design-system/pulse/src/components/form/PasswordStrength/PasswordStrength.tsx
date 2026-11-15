// Figma page "Password Strength": set "passwordStrength" (Label x Status).
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { FieldLabel, TextContent } from '../TextFormat/TextFormat';
import { HelperText } from '../HelperText/HelperText';

export type PasswordStrengthStatus = 'veryWeak' | 'weak' | 'moderate' | 'strong' | 'veryStrong';
/** Figma "Label": False | Right | Top Right | Top Both | Bottom Right | Bottom Both. */
export type PasswordStrengthLabel = false | 'right' | 'topRight' | 'topBoth' | 'bottomRight' | 'bottomBoth';

export interface PasswordStrengthProps {
  status: PasswordStrengthStatus;
  /** @default "bottomBoth" */
  label?: PasswordStrengthLabel;
  /** Text next to the status; defaults to "Password strength" where the layout shows a left label. */
  labelText?: ReactNode;
  /** Hint text row under the bar. */
  hint?: ReactNode;
  width?: number | string;
}

const statusText: Record<PasswordStrengthStatus, string> = { veryWeak: 'Very Weak', weak: 'Weak', moderate: 'Moderate', strong: 'Strong', veryStrong: 'Very Strong' };
const filled: Record<PasswordStrengthStatus, number> = { veryWeak: 0, weak: 1, moderate: 2, strong: 3, veryStrong: 4 };
/** uiElements/progressBar/color/gradient5, 4, 2, 1 */
const segmentColors = ['#ef4444', '#f59e0b', '#4ade80', '#22c55e'] as const;

/** Estimate a status from a password: length and character variety. */
export function getPasswordStrength(password: string): PasswordStrengthStatus {
  if (!password) return 'veryWeak';
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  const score = (password.length >= 8 ? 1 : 0) + (password.length >= 12 ? 1 : 0) + (kinds - 1);
  return (['veryWeak', 'weak', 'moderate', 'strong', 'veryStrong'] as const)[Math.max(0, Math.min(4, score))] ?? 'veryWeak';
}

/** Four-segment strength meter (6px bar, 4px radius) with optional label / status text. */
export function PasswordStrength({ status, label = 'bottomBoth', labelText = 'Password strength', hint, width = 400 }: PasswordStrengthProps) {
  const n = filled[status];
  const bar = (
    <Box role="meter" aria-label="Password strength" aria-valuemin={0} aria-valuemax={4} aria-valuenow={n} aria-valuetext={statusText[status]} sx={{ flex: 1, height: 6, borderRadius: '4px', overflow: 'hidden', display: 'flex', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
      {segmentColors.map((c, i) => (
        <Box key={c} sx={{ flex: 1, height: 6, backgroundColor: c, opacity: i < n ? 1 : 0 }} />
      ))}
    </Box>
  );
  const statusNode = <TextContent>{statusText[status]}</TextContent>;
  const row = (left: boolean) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', minHeight: 20 }}>
      {left && <Box sx={{ flex: 1 }}><FieldLabel component="span">{labelText}</FieldLabel></Box>}
      {statusNode}
    </Box>
  );
  return (
    <Box data-status={status} sx={{ width, display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {label === 'topBoth' && row(true)}
      {label === 'topRight' && row(false)}
      {label === 'right' ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: 20 }}>
          {bar}
          {statusNode}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{bar}</Box>
      )}
      {label === 'bottomBoth' && row(true)}
      {label === 'bottomRight' && row(false)}
      {hint != null && <HelperText>{hint}</HelperText>}
    </Box>
  );
}
