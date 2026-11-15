// Implements Figma page "Navigation Rail": sets "NavigationRail" (Variant Docked/Floating x Position Left/Right x Label on/off) and ".navItem".
import { fw } from '../../../theme/typography';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { disabledOpacity, focusRing, pt } from '../../../theme/pulseTokens';

export interface NavigationRailItem {
  id: string;
  label: string;
  icon: ReactNode;
  /** Red 6px dot badge. */
  badge?: boolean;
  disabled?: boolean;
}

export interface NavigationRailProps {
  items: NavigationRailItem[];
  selectedId?: string;
  onChange?: (item: NavigationRailItem) => void;
  /** docked: full-height panel with a background and a divider. floating: bare 32px column of icon buttons. @default "docked" */
  variant?: 'docked' | 'floating';
  /** @default "left" */
  position?: 'left' | 'right';
  /** Show titles under the icons (docked only). @default true */
  showLabels?: boolean;
}

const nr = pt.uiElements.navigationRail;
const textStyleRail = { fontFamily: pt.typographyStyles.textS.medium.fontFamily, fontSize: 9, lineHeight: '16px', fontWeight: fw.medium } as const;

/** Navigation rail. Docked 80px wide (64x64 items with label, 32x32 icon-only); floating 32px wide. */
export function NavigationRail({ items, selectedId, onChange, variant = 'docked', position = 'left', showLabels = true }: NavigationRailProps) {
  const docked = variant === 'docked';
  const labels = docked && showLabels;
  const edgeRadius = position === 'left' ? '4px 0 0 4px' : '0 4px 4px 0';
  return (
    <Box
      role="navigation"
      data-spec={`rail ${variant}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        boxSizing: 'border-box',
        width: docked ? (labels ? 80 : 48) : 32,
        height: docked ? '100%' : undefined,
        p: docked ? '8px' : '48px 0',
        background: docked ? nr.color.railBackground : 'transparent',
        boxShadow: docked ? (position === 'left' ? `inset -1px 0 0 0 ${nr.color.defaultStroke}` : `inset 1px 0 0 0 ${nr.color.defaultStroke}`) : 'none',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: labels ? '4px' : '2px' }}>
        {items.map((it) => {
          const active = it.id === selectedId;
          return (
            <ButtonBase
              key={it.id}
              disabled={it.disabled}
              aria-label={labels ? undefined : it.label}
              aria-current={active ? 'page' : undefined}
              onClick={() => onChange?.(it)}
              data-spec="rail item"
              sx={{
                position: 'relative',
                boxSizing: 'border-box',
                width: labels ? 64 : 32,
                height: labels ? 64 : 32,
                flexDirection: 'column',
                gap: '2px',
                padding: labels ? '12px 4px' : 0,
                borderRadius: labels ? pt.radius.m : docked ? pt.radius.xs : edgeRadius,
                color: active ? nr.color.activeText : '#090909',
                background: active ? nr.color.activeBackground : docked ? 'transparent' : nr.color.defaultBackground,
                '& .PulseRail-icon': { display: 'inline-flex', '& svg': { fontSize: labels ? 20 : 16 } },
                '& .PulseRail-label': { ...textStyleRail, width: '100%', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
                '&:hover': active ? undefined : { background: nr.color.hoverBackground, color: nr.color.hoverText },
                '&.Mui-focusVisible': { boxShadow: focusRing },
                '&.Mui-disabled': { opacity: disabledOpacity },
              }}
            >
              <span className="PulseRail-icon">{it.icon}</span>
              {labels && <span className="PulseRail-label">{it.label}</span>}
              {it.badge && <Box component="span" aria-hidden sx={{ position: 'absolute', top: labels ? 12 : 8, left: labels ? 36 : 22, width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}

