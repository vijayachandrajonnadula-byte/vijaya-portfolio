import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Slider, SliderWithLabel } from './Slider';
import type { SliderValueLabels } from './Slider';

function Cell({ title, children, w = 400 }: { title: string; children: React.ReactNode; w?: number }) {
  return (
    <Stack spacing={0.5} sx={{ width: w }}>
      <Typography variant="textM" color="text.secondary">{title}</Typography>
      {children}
    </Stack>
  );
}

const labelVariants: SliderValueLabels[] = ['none', 'right', 'sides', 'topRight', 'bottomRight', 'topBoth', 'bottomBoth', 'topLabelBottomBoth'];

/** Slider (Orientation x Placement x Interaction x Label) and RangeSlider, plus the sliderKnobs states. */
export default function SliderDemo() {
  const [v, setV] = useState(50);
  return (
    <Stack spacing={3}>
      <Cell title="Placement: start, 25, 50, 75, filled (default)">
        {[0, 25, 50, 75, 100].map((n) => <Slider key={n} defaultValue={n} data-spec={`slider ${n}`} />)}
      </Cell>
      <Cell title="Interaction: hover / focus / disabled">
        <Slider defaultValue={50} className="is-hover" valueLabelDisplay="on" sx={{ mt: 3 }} />
        <Slider defaultValue={50} autoFocus />
        <Slider defaultValue={50} disabled />
      </Cell>
      <Cell title="RangeSlider: default / hover / disabled">
        <Slider defaultValue={[20, 70]} />
        <Slider defaultValue={[20, 70]} className="is-hover" />
        <Slider defaultValue={[20, 70]} disabled />
      </Cell>
      <Stack direction="row" useFlexGap sx={{ gap: 4, flexWrap: 'wrap' }}>
        <Cell title="vertical" w={60}><Slider orientation="vertical" defaultValue={40} data-spec="vertical" /></Cell>
        <Cell title="hover" w={60}><Slider orientation="vertical" defaultValue={40} className="is-hover" /></Cell>
        <Cell title="disabled" w={60}><Slider orientation="vertical" defaultValue={40} disabled /></Cell>
        <Cell title="Top & Bottom" w={60}><SliderWithLabel orientation="vertical" valueLabels="sides" defaultValue={40} /></Cell>
        <Cell title="range" w={60}><Slider orientation="vertical" defaultValue={[20, 70]} /></Cell>
      </Stack>
      {labelVariants.slice(1).map((l) => (
        <Cell key={l} title={`Label: ${l}`}>
          <SliderWithLabel label="Volume" valueLabels={l} value={v} onChange={(_, x) => setV(x as number)} hint="Helper text" />
        </Cell>
      ))}
      {(['sides', 'topBoth', 'bottomBoth', 'topLabelBottomBoth'] as const).map((l) => (
        <Cell key={l} title={`RangeSlider Label: ${l}`}><SliderWithLabel label="Price" valueLabels={l} defaultValue={[20, 60]} formatValue={(n) => `${n}%`} /></Cell>
      ))}
      <Cell title="disabled with label"><SliderWithLabel label="Disabled" valueLabels="topBoth" defaultValue={45} disabled /></Cell>
    </Stack>
  );
}
