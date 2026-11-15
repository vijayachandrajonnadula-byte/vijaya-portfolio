// Implements Figma page "Canvas Toolbar": set "Canvas Toolbar" (Default / Additional Features / Search Expanded / Result dropped).
// Figma structure: 40px bar (pad 4, radius 8) > Container (gap 4) > [Search + divider] [Additional Features, gap 4] divider [Zoom Control].
// Buttons are the Pulse IconButton (Small, Plain), the field is the Pulse Search (240px), dividers the Pulse Divider (1x16).
import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Divider } from '../../data-display/Divider/Divider';
import { Search } from '../../form/Search/Search';
import { ZoomControl } from '../ZoomControl/ZoomControl';
import type { ZoomControlProps } from '../ZoomControl/ZoomControl';
import { pt } from '../../../theme/pulseTokens';

export interface CanvasToolbarAction {
  id: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface CanvasToolbarSearchResult {
  id: string;
  label: string;
}

export interface CanvasToolbarProps {
  zoom: Pick<ZoomControlProps, 'value' | 'onChange' | 'onFit' | 'presets' | 'min' | 'max' | 'step'>;
  /** Extra icon buttons between search and zoom ("Additional Features"). */
  actions?: CanvasToolbarAction[];
  /** Provide to show the search button (expands into a 240px field). */
  onSearch?: (query: string) => void;
  /** Results shown in the dropdown under the expanded search ("Result dropped"). */
  searchResults?: CanvasToolbarSearchResult[];
  onResultSelect?: (result: CanvasToolbarSearchResult) => void;
  /** Start with the search field expanded. */
  defaultSearchOpen?: boolean;
}

const vDivider = <Divider orientation="vertical" sx={{ height: 16, alignSelf: 'center' }} />;

/** Floating canvas toolbar: white 40px bar (radius 8, padding 4) holding search, feature buttons and zoom. */
export function CanvasToolbar({ zoom, actions = [], onSearch, searchResults, onResultSelect, defaultSearchOpen = false }: CanvasToolbarProps) {
  const [searchOpen, setSearchOpen] = useState(defaultSearchOpen);
  const [q, setQ] = useState('');
  const close = () => { setSearchOpen(false); setQ(''); onSearch?.(''); };
  return (
    <Box role="toolbar" aria-label="Canvas tools" data-spec="canvas-toolbar" sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '4px', p: '4px', height: 40, boxSizing: 'border-box', background: pt.colors.base.white, borderRadius: pt.radius.m, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.15)' }}>
      {onSearch && (
        <>
          {searchOpen ? (
            <Box
              sx={{ width: 240, flexShrink: 0 }}
              onKeyDown={(e) => { if (e.key === 'Escape') close(); }}
            >
              <Search
                autoFocus
                value={q}
                onChange={(e) => { setQ(e.target.value); onSearch(e.target.value); }}
                handleClear={close}
                showCloseIcon
                ariaLabel="Search canvas"
              />
            </Box>
          ) : (
            <IconButton ariaLabel="Search" size="small" onClick={() => setSearchOpen(true)}><SearchRounded /></IconButton>
          )}
          {vDivider}
        </>
      )}
      {actions.length > 0 && (
        <>
          <Box sx={{ display: 'inline-flex', gap: '4px' }}>
            {actions.map((a) => (
              <IconButton key={a.id} ariaLabel={a.label} size="small" disabled={a.disabled} onClick={a.onClick} sx={{ '& svg': { width: 16, height: 16 } }}>
                {a.icon}
              </IconButton>
            ))}
          </Box>
          {vDivider}
        </>
      )}
      <ZoomControl compact {...zoom} />
      {searchOpen && searchResults && searchResults.length > 0 && (
        <MenuList role="listbox" data-spec="canvas-toolbar results" sx={{ position: 'absolute', top: 36, left: 4, width: 240, boxSizing: 'border-box', py: '8px', borderRadius: pt.radius.m, background: pt.colors.base.white, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.2)', zIndex: 10 }}>
          {searchResults.map((r) => (
            <MenuItem key={r.id} role="option" onClick={() => onResultSelect?.(r)}>{r.label}</MenuItem>
          ))}
        </MenuList>
      )}
    </Box>
  );
}
