import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '../../actions/Button/Button';
import { ElectronicSignature } from './ElectronicSignature';
import type { ElectronicSignatureProps } from './ElectronicSignature';

const base: Omit<ElectronicSignatureProps, 'open'> = {
  fields: {
    type: 'reason',
    reason: { label: 'Reason for E-sign', options: ['Approved', 'Reviewed', 'Authored'], value: 'Approved', placeholder: 'Select a Reason' },
    userId: { label: 'User ID', value: 'qa.reviewer', placeholder: 'Enter User ID' },
    password: { label: 'Password', value: 'secret', placeholder: 'Enter password' },
    comments: { label: 'Comments', value: '', placeholder: 'Write a comment' },
  },
  notificationValues: { title: 'I Accept', description: 'The user acknowledges, understands, and accepts that any electronic signature they make is legally binding and equivalent of their handwritten signature or initials' },
  userDetails: { date: '12/11/2024', time: '12:00 PM', timeZone: 'UTC +5:30', timeZoneTooltip: 'Chennai, Mumbai, New Delhi, Kolkata', activityText: 'Witnessed and Verified', name: 'QA reviewer', role: 'Content Writer' },
  signButtonLabel: 'Submit',
  secondaryButtonLabel: 'Cancel',
};

/** ElectronicSignature: inline panel, error state, and the real dialog. */
export default function ElectronicSignatureDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Stack spacing={3}>
      <Typography variant="textM" color="text.secondary">Panel (as laid out in Figma, 560px)</Typography>
      <ElectronicSignature open inline {...base} />
      <Typography variant="textM" color="text.secondary">With error message and a required field flagged</Typography>
      <ElectronicSignature open inline {...base} errorMessage="Invalid credentials. Try again." fields={{ ...base.fields, password: { ...base.fields?.password, error: true, hint: 'Password is incorrect' } }} />
      <div>
        <Button onClick={() => setOpen(true)}>Open as dialog</Button>
        <ElectronicSignature open={open} {...base} handleSecondary={() => setOpen(false)} handleSign={() => setOpen(false)} handleFlyoutClose={() => setOpen(false)} />
      </div>
    </Stack>
  );
}
