import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DiamondOutlined from '@mui/icons-material/DiamondOutlined';
import { Tab, Tabs } from './Tabs';
import type { TabsSize, TabsVariation } from './Tabs';

function Row({ variation, size, orientation, icon, badge, scroll }: { variation: TabsVariation; size: TabsSize; orientation?: 'horizontal' | 'vertical'; icon?: boolean; badge?: boolean; scroll?: boolean }) {
  const [v, setV] = useState(0);
  return (
    <Tabs value={v} handleChange={(_, n) => setV(n)} variation={variation} size={size} orientation={orientation} isScrollable={scroll}>
      <Tab index={0} label="Tab 1" startIcon={icon ? <DiamondOutlined /> : undefined} showBadge={badge} badgeContent={badge ? 4 : undefined} />
      <Tab index={1} label="Tab 2" startIcon={icon ? <DiamondOutlined /> : undefined} showBadge={badge} badgeContent={badge ? 120 : undefined} />
      <Tab index={2} label="Tab 3" startIcon={icon ? <DiamondOutlined /> : undefined} endIcon={icon ? <DiamondOutlined /> : undefined} />
      <Tab index={3} label="Disabled" disabled />
    </Tabs>
  );
}

/** Tabs: solid / underline horizontal, leftLine / rightLine vertical, sizes, icons, badges, disabled, scrollable. */
export default function TabsDemo() {
  return (
    <Stack spacing={3}>
      {(['solid', 'underline'] as const).map((variation) => (
        <Stack key={variation} spacing={1.5}>
          <Typography variant="textM" color="text.secondary">{variation} - sizes small / medium / large</Typography>
          {(['small', 'medium', 'large'] as const).map((size) => <Row key={size} variation={variation} size={size} />)}
          <Typography variant="textM" color="text.secondary">{variation} - icon + badge</Typography>
          <Row variation={variation} size="small" icon badge />
        </Stack>
      ))}
      <Typography variant="textM" color="text.secondary">scrollable (narrow container)</Typography>
      <div style={{ width: 160 }}><Row variation="underline" size="small" scroll /></div>
      <Stack direction="row" spacing={6}>
        {(['leftLine', 'rightLine'] as const).map((variation) => (
          <Stack key={variation} spacing={1}>
            <Typography variant="textM" color="text.secondary">{variation} (vertical)</Typography>
            <Row variation={variation} size="small" icon badge />
            <Row variation={variation} size="medium" />
            <Row variation={variation} size="large" />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
