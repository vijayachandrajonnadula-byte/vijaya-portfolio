import { fw } from '../theme/typography';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DemoBoundary } from './DemoBoundary';

/**
 * Component gallery. One demo is mounted at a time (mounting all ~100 at once makes the page heavy enough to
 * crash embedded browsers such as VS Code's).
 *
 * A demo is `src/components/<category>/<Name>/<Name>.demo.tsx` with a default-exported React component.
 *   /#/Chip        a demo (shareable link)
 *   /?c=Chip       same, used by scripts/dev/shot-component.mjs
 */
const modules = import.meta.glob<{ default: ComponentType }>('../components/*/*/*.demo.tsx');

/** Full pages built from the design system: src/pages/<Name>/<Name>.page.tsx. Opened full-screen, without the sidebar. */
const pageModules = import.meta.glob<{ default: ComponentType }>('../pages/*/*.page.tsx');

interface Entry { path: string; name: string; category: string; page?: boolean }
const entries: Entry[] = [
  ...Object.keys(modules).map((path) => {
    const [, , category, name] = path.split('/');
    return { path, category: category!, name: name! };
  }),
  ...Object.keys(pageModules).map((path) => ({ path, category: 'pages', name: path.split('/')[2]!, page: true })),
].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
const categories = [...new Set(entries.map((e) => e.category))];
const lazyDemos = Object.fromEntries(entries.map((e) => [e.name, lazy((e.page ? pageModules : modules)[e.path]!)]));

const label = (c: string) => c.replace(/-/g, ' ').replace(/^./, (m) => m.toUpperCase());
const fromLocation = () => new URLSearchParams(window.location.search).get('c') ?? decodeURIComponent(window.location.hash.replace(/^#\/?/, ''));

export default function Gallery() {
  const [name, setName] = useState(fromLocation);
  useEffect(() => {
    const onHash = () => setName(fromLocation());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const current = useMemo(() => entries.find((e) => e.name.toLowerCase() === name.toLowerCase()), [name]);
  const Demo = current ? lazyDemos[current.name] : undefined;
  const bare = new URLSearchParams(window.location.search).has('c');
  if (current?.page && Demo) {
    return (
      <DemoBoundary key={current.name} name={current.name}>
        <Suspense fallback={null}>
          <Box id="demo-root"><Demo /></Box>
        </Suspense>
      </DemoBoundary>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {!bare && (
        <Box component="nav" sx={{ width: 220, flexShrink: 0, position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100vh', overflowY: 'auto', p: 2, borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Typography variant="heading6">Pulse design system</Typography>
          <Typography variant="textS" color="text.secondary" component="div" sx={{ mb: 1 }}>{entries.length} components</Typography>
          {categories.map((c) => (
            <Box key={c} sx={{ mb: 1.5 }}>
              <Typography variant="label" component="div" color="text.secondary" sx={{ mb: 0.5 }}>{label(c)}</Typography>
              {entries.filter((e) => e.category === c).map((e) => (
                <Box
                  key={e.name}
                  component="a"
                  href={`#/${e.name}`}
                  aria-current={current?.name === e.name ? 'page' : undefined}
                  sx={{ display: 'block', py: 0.25, px: 0.75, borderRadius: 1, fontSize: 12, textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'primary.main' }, '&[aria-current=page]': { bgcolor: 'action.selected', color: 'primary.main', fontWeight: fw.semiBold } }}
                >
                  {e.name}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}
      <Box id="demo-root" sx={{ flex: 1, minWidth: 0, p: 3 }}>
        {!current || !Demo ? (
          <Box>
            <Typography variant="heading3" sx={{ mb: 1 }}>Pulse design system</Typography>
            <Typography variant="textXl" color="text.secondary" sx={{ mb: 3 }}>Pick a component from the list. Built from the pulse-2.0 Figma file.</Typography>
            {name && <Typography color="error">No component named “{name}”.</Typography>}
          </Box>
        ) : (
          <section id={`demo-${current.name}`}>
            <Typography variant="label" color="text.secondary" component="div">{label(current.category)}</Typography>
            <Typography variant="heading4" component="h1" sx={{ mb: 2 }}>{current.name}</Typography>
            <DemoBoundary key={current.name} name={current.name}>
              <Suspense fallback={<Typography variant="textM">Loading…</Typography>}>
                <Demo />
              </Suspense>
            </DemoBoundary>
          </section>
        )}
      </Box>
    </Box>
  );
}
