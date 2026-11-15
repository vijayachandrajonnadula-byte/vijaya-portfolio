// Searchable, paginated grid used by the symbol-library demos (every variant with its name).
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export interface SymbolGalleryProps {
  /** All variant keys (undefined while the lazy set loads). */
  keys: readonly string[] | undefined;
  render: (key: string) => ReactNode;
  /** Cell min width in px. */
  cell?: number;
  /** Cells rendered per page ("Show more" appends another page). */
  pageSize?: number;
  label?: (key: string) => string;
  background?: string;
}

export function SymbolGallery({ keys, render, cell = 150, pageSize = 60, label = (k) => k, background }: SymbolGalleryProps) {
  const [q, setQ] = useState('');
  const [pages, setPages] = useState(1);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (keys ?? []).filter((k) => !t || k.toLowerCase().includes(t) || label(k).toLowerCase().includes(t));
  }, [keys, q, label]);
  const visible = shown.slice(0, pages * pageSize);
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <TextField
          size="small"
          label="Search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPages(1);
          }}
        />
        <Typography variant="body2" color="text.secondary">
          {keys ? `${shown.length} of ${keys.length}` : 'Loading...'}
        </Typography>
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${cell}px, 1fr))`, gap: 1.5 }}>
        {visible.map((k) => (
          <Stack
            key={k}
            spacing={1}
            data-symbol={k}
            sx={{ alignItems: 'center', justifyContent: 'space-between', p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: background }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 72, width: '100%' }}>{render(k)}</Box>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', wordBreak: 'break-word' }}>
              {label(k)}
            </Typography>
          </Stack>
        ))}
      </Box>
      {visible.length < shown.length && (
        <Box>
          <Button variant="outlined" size="small" onClick={() => setPages((p) => p + 1)}>
            Show more ({shown.length - visible.length} left)
          </Button>
        </Box>
      )}
    </Stack>
  );
}
