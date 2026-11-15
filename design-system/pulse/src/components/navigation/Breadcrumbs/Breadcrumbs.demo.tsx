import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Breadcrumbs } from './Breadcrumbs';

const nodes = [
  { node: 'Parent node', link: '/a' },
  { node: 'Parent node', link: '/b' },
  { node: 'Parent node', link: '/c' },
  { node: 'Leaf node', link: '' },
];

/** Breadcrumbs: Default / With Icon / Icon x Sliced Line / Arrow, no home, ellipsis collapse. */
export default function BreadcrumbsDemo() {
  return (
    <Stack spacing={2.5}>
      {(['default', 'withIcon', 'icon'] as const).flatMap((variant) =>
        (['slice', 'arrow'] as const).map((sep) => (
          <Stack key={`${variant}-${sep}`} spacing={0.5}>
            <Typography variant="textS" color="text.secondary">{variant} / {sep}</Typography>
            <Breadcrumbs nodes={nodes} variant={variant} separatorVariant={sep} />
          </Stack>
        )),
      )}
      <Typography variant="textS" color="text.secondary">without home</Typography>
      <Breadcrumbs nodes={nodes.slice(2)} showHomeIcon={false} separatorVariant="slice" />
      <Typography variant="textS" color="text.secondary">ellipsis (maxItems=3, click to expand)</Typography>
      <Breadcrumbs nodes={nodes} maxItems={3} />
    </Stack>
  );
}
