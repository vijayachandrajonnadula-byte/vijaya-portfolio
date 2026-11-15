// Implements Figma page "Side Nav": sets "SideNav" and "BuildingBlocks/sideNav" (Interaction x Menu Type: Default / Accordion Header / Accordion Menu).
import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import { pt, textStyle } from '../../../theme/pulseTokens';

export interface SideNavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Children turn the item into an accordion header. */
  children?: SideNavItem[];
}

export interface SideNavSection {
  /** Section title (meta data text, 32px row). */
  title?: string;
  items: SideNavItem[];
}

export interface SideNavProps {
  sections: SideNavSection[];
  /** Selected item id. */
  selectedId?: string;
  onSelect?: (item: SideNavItem) => void;
}

const sn = pt.uiElements.sideNav.color;
const itemText = { ...textStyle('textM', 'medium'), fontSize: 14, lineHeight: '20px' } as const;

function Row({ item, active, header, indent, open, onClick }: { item: SideNavItem; active: boolean; header?: boolean; indent?: boolean; open?: boolean; onClick: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      aria-expanded={header ? open : undefined}
      data-spec={header ? 'sidenav header' : indent ? 'sidenav menu' : 'sidenav item'}
      sx={{
        width: '100%',
        height: 32,
        boxSizing: 'border-box',
        justifyContent: 'flex-start',
        gap: '8px',
        padding: indent ? '0 8px 0 40px' : '0 8px 0 16px',
        ...itemText,
        textAlign: 'left',
        color: active ? sn.activeText : sn.textColor,
        background: header ? sn.accordionHeaderBg : active ? sn.activeBg : 'transparent',
        borderRadius: 0,
        boxShadow: active && !header ? 'inset 2px 0 0 0 #19325e' : 'none',
        '& .PulseSide-icon': { display: 'inline-flex', color: active ? sn.activeIcon : sn.secondaryMenuIcon, '& svg': { fontSize: 16 } },
        '&:hover': { background: header ? sn.accordionHeaderHoverBg : sn.hoverBg },
        '&.Mui-focusVisible': { boxShadow: 'inset 0 0 0 2px #3B82F6' },
      }}
    >
      {item.icon && <span className="PulseSide-icon">{item.icon}</span>}
      <Box component="span" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</Box>
      {header && (open ? <KeyboardArrowUpRounded sx={{ fontSize: 16 }} /> : <KeyboardArrowDownRounded sx={{ fontSize: 16 }} />)}
    </ButtonBase>
  );
}

/** Vertical page navigation: section titles, plain items and accordion groups. 234px wide, 32px rows, gap 2. */
export function SideNav({ sections, selectedId, onSelect }: SideNavProps) {
  const containsSelected = (i: SideNavItem) => i.children?.some((c) => c.id === selectedId) ?? false;
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <Box component="nav" aria-label="Side navigation" sx={{ width: 234, background: sn.background, display: 'flex', flexDirection: 'column', gap: '2px' }} data-spec="sidenav">
      {sections.map((s, si) => (
        <Box key={si} sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {s.title && (
            <Box sx={{ height: 32, px: '8px', display: 'flex', alignItems: 'center', boxSizing: 'border-box', ...textStyle('textM', 'medium'), color: '#566680' }}>{s.title}</Box>
          )}
          {s.items.map((it) => {
            if (!it.children) return <Row key={it.id} item={it} active={it.id === selectedId} onClick={() => onSelect?.(it)} />;
            const isOpen = open[it.id] ?? containsSelected(it);
            return (
              <Box key={it.id} sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Row item={it} header active={false} open={isOpen} onClick={() => setOpen((o) => ({ ...o, [it.id]: !isOpen }))} />
                {isOpen && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', background: sn.accordionBodyBg }}>
                    {it.children.map((c) => <Row key={c.id} item={c} indent active={c.id === selectedId} onClick={() => onSelect?.(c)} />)}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
