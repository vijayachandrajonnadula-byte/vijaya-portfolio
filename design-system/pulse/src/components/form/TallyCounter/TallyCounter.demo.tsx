import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { TallyCounter } from './TallyCounter';
import { Caption, Section } from '../../_shared/ForceState';
import type { FieldSize } from '../../_shared/fieldStyles';

function Counter(props: Omit<React.ComponentProps<typeof TallyCounter>, 'value' | 'onChange'> & { start?: number }) {
  const { start = 1, ...rest } = props;
  const [v, setV] = useState(start);
  return <TallyCounter {...rest} value={v} onChange={setV} />;
}

/** Figma "Tally Counter": Size (small / medium / large) x Variant (default / compact) x Label Position (top / left). */
export default function TallyCounterDemo() {
  return (
    <Stack spacing={4}>
      {(['default', 'compact'] as const).map((variant) => (
        <Section key={variant} title={`Variant = ${variant}`}>
          <Stack direction="row" useFlexGap sx={{ gap: 4, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {(['small', 'medium', 'large'] as FieldSize[]).map((size) => (
              <Stack key={size} spacing={2}>
                <Caption>{size}</Caption>
                <Counter variant={variant} size={size} label="Label" hint="Guide message" data-spec={`tally ${variant} ${size}`} />
                <Counter variant={variant} size={size} label="Label" labelPosition="left" labelWidth={80} hint="Guide message" />
              </Stack>
            ))}
          </Stack>
        </Section>
      ))}
      <Section title="Limits, disabled, error">
        <Stack direction="row" useFlexGap sx={{ gap: 4, flexWrap: 'wrap' }}>
          <Counter label="Min 0 / max 5" min={0} max={5} start={5} hint="Maximum reached" />
          <Counter label="Disabled" disabled start={3} />
          <Counter label="Compact disabled" variant="compact" disabled start={3} />
          <Counter label="Error" error start={12} hint="Value out of range" />
        </Stack>
      </Section>
    </Stack>
  );
}
