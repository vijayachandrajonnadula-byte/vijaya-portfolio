import Stack from '@mui/material/Stack';
import { HelperText } from './HelperText';
import type { HelperTextVariant } from './HelperText';
import { Caption, Section } from '../../_shared/ForceState';

const messages: Record<HelperTextVariant, string> = { error: 'Error message', warning: 'Warning message', info: 'Information message', success: 'Success message', normal: 'Guide message' };

/** Figma "Helper Text": Variant = Error | Warning | Info | Success | Normal, with and without the status glyph. */
export default function HelperTextDemo() {
  return (
    <Stack direction="row" useFlexGap sx={{ gap: 6, flexWrap: 'wrap' }}>
      {[false, true].map((icon) => (
        <Section key={String(icon)} title={icon ? 'With icon' : 'Default (icon hidden)'}>
          <Stack spacing={1.5} sx={{ width: 240 }}>
            {(Object.keys(messages) as HelperTextVariant[]).map((v) => (
              <Stack key={v}>
                <Caption>{v}</Caption>
                <HelperText variant={v} showIcon={icon}>{messages[v]}</HelperText>
              </Stack>
            ))}
          </Stack>
        </Section>
      ))}
    </Stack>
  );
}
