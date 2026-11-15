// Implements Figma page "Tabs": sets "Building Blocks/Tab" (Variant x Size x Interaction) and "Tabs" (Variant x Size x Orientation).
import { fw, role } from '../../../theme/typography';
import { forwardRef } from 'react';
import type { MouseEventHandler, ReactNode, SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import MuiTab from '@mui/material/Tab';
import type { TabProps as MuiTabProps } from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowLeftRounded from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import { IconButton } from '../../actions/IconButton/IconButton';
import { disabledOpacity, focusRing, pt } from '../../../theme/pulseTokens';

export type TabsSize = 'small' | 'medium' | 'large';
/** solid: filled pill (Figma "Default"/"Solid"); underline: line under the tab; leftLine / rightLine: vertical tabs with a line on that side. */
export type TabsVariation = 'solid' | 'underline' | 'leftLine' | 'rightLine';

export interface TabsProps {
  /** Index of the selected Tab (its `index` prop). */
  value: number;
  handleChange: (event: SyntheticEvent, value: number) => void;
  /** @default "underline" */
  variation?: TabsVariation;
  /** @default "small" */
  size?: TabsSize;
  /** @default "horizontal" (leftLine / rightLine default to "vertical") */
  orientation?: 'horizontal' | 'vertical';
  isScrollable?: boolean;
  children: ReactNode;
}

const t = pt.uiElements.tabs;
const tc = t.color;
/** Figma Tab: S 32px (6/12, gap 6, icon 16), M 40px (10/14, gap 8, icon 18), L 44px (12/16, gap 10, icon 20). */
const dims = {
  small: { x: t.padding.sHPadding, y: t.padding.sVSpacing, gap: t.padding.sVSpacing, line: t.border.s, icon: 16, font: 14, lh: '20px' },
  medium: { x: t.padding.mHPadding, y: t.padding.mVPadding, gap: t.padding.mSpacing, line: t.border.m, icon: 18, font: 14, lh: '20px' },
  large: { x: t.padding.lHPadding, y: t.padding.lVPadding, gap: t.padding.lSpacing, line: t.border.l, icon: 20, font: 16, lh: '24px' },
} as const;
// Figma Building Blocks/Tab label colours. The unselected (Default) label is the muted grey; it darkens on Hover and is navy when Active.
// (An earlier pass had Default and Hover swapped: wrong against the design and the live Pulse app.)
const textDefault = '#090909'; // label on Hover
const textMuted = '#6b7178'; // label (and icon) in the unselected Default state
const textActive = '#02216e'; // Figma label (Active)
const iconActive = '#442069'; // Figma icon in Hover / Active

/**
 * Scroll arrow of a scrollable tab list. Figma Navigation Bar: Pulse IconButton (Small, Plain, 32x32) on a 56x32 white fade
 * (`linear-gradient(90deg, #fff0, #fff 50%, #fff)` at the end, mirrored at the start) laid over the tabs.
 * Replaces MUI's stock TabScrollButton. Hidden while there is nothing to scroll in that direction.
 */
const ScrollArrow = forwardRef<HTMLDivElement, { direction?: 'left' | 'right'; orientation?: string; disabled?: boolean; onClick?: MouseEventHandler<HTMLElement> }>(function ScrollArrow(
  { direction = 'right', orientation, disabled, onClick },
  ref,
) {
  if (disabled) return null;
  const vertical = orientation === 'vertical';
  const start = direction === 'left';
  const label = vertical ? (start ? 'Scroll tabs up' : 'Scroll tabs down') : start ? 'Scroll tabs left' : 'Scroll tabs right';
  const Icon = vertical ? (start ? KeyboardArrowUpRounded : KeyboardArrowDownRounded) : start ? KeyboardArrowLeftRounded : KeyboardArrowRightRounded;
  return (
    <Box
      ref={ref}
      data-spec="tabs scroll arrow"
      sx={
        vertical
          ? { display: 'flex', justifyContent: 'center', flexShrink: 0 }
          : { position: 'absolute', top: 0, bottom: 0, [start ? 'left' : 'right']: 0, width: 56, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: start ? 'flex-start' : 'flex-end', background: start ? 'linear-gradient(90deg, #ffffff 0%, #ffffff 50%, #ffffff00 100%)' : 'linear-gradient(90deg, #ffffff00 0%, #ffffff 50%, #ffffff 100%)' }
      }
    >
      <IconButton ariaLabel={label} size="small" onClick={onClick as MouseEventHandler<HTMLButtonElement>}><Icon /></IconButton>
    </Box>
  );
});

function lineShadow(variation: TabsVariation, color: string, w: string) {
  if (variation === 'underline') return `inset 0 -${w} 0 0 ${color}`;
  if (variation === 'leftLine') return `inset ${w} 0 0 0 ${color}`;
  if (variation === 'rightLine') return `inset -${w} 0 0 0 ${color}`;
  return 'none';
}

/** Tab list (pulse-2.0 Tabs). Paddings, line widths and colours come from pt.uiElements.tabs and the Figma Tab set. */
export function Tabs({ value, handleChange, variation = 'underline', size = 'small', orientation, isScrollable = false, children }: TabsProps) {
  const vertical = (orientation ?? (variation === 'leftLine' || variation === 'rightLine' ? 'vertical' : 'horizontal')) === 'vertical';
  const d = dims[size];
  const solid = variation === 'solid';
  const underline = variation === 'underline';
  return (
    <MuiTabs
      value={value}
      onChange={handleChange}
      orientation={vertical ? 'vertical' : 'horizontal'}
      variant={isScrollable ? 'scrollable' : 'standard'}
      slots={{ scrollButtons: ScrollArrow as never }}
      slotProps={{ indicator: { style: { display: 'none' } }, list: { sx: { gap: underline ? '24px' : 0 } } }}
      sx={{
        position: 'relative',
        minHeight: 0,
        alignSelf: vertical ? 'flex-start' : undefined,
        width: vertical ? 'fit-content' : undefined,
        boxShadow: underline && !vertical ? `inset 0 -1px 0 0 ${tc.normalBorder}` : 'none',
        '& .MuiTab-root': {
          minHeight: 0,
          minWidth: 0,
          padding: `${d.y} ${underline ? 0 : d.x}`,
          gap: d.gap,
          flexDirection: 'row',
          justifyContent: vertical ? 'flex-start' : 'center',
          alignItems: 'center',
          textAlign: vertical ? 'left' : 'center',
          textTransform: 'none',
          fontFamily: pt.typographyStyles.textM.semiBold.fontFamily,
          fontSize: d.font,
          lineHeight: d.lh,
          // Unselected tabs are Medium; only the selected tab is SemiBold (Figma's two textTabs masters both say SemiBold,
          // but the live Pulse tabs show the selected one clearly heavier, so the unselected state is Medium).
          fontWeight: role.tab,
          letterSpacing: 0,
          color: textMuted,
          opacity: 1,
          borderRadius: solid ? pt.radius.xs : 0,
          background: 'transparent',
          whiteSpace: 'nowrap',
          '& .PulseTab-icon': { display: 'inline-flex', width: d.icon, height: d.icon, color: textMuted, '& svg': { fontSize: d.icon } },
          '& .PulseTab-badge': { border: '1px solid #cbd5e1' },
          '&:hover': {
            background: underline ? pt.colors.base.white : tc.hoverBackground,
            color: textDefault,
            boxShadow: lineShadow(variation, tc.hoverBorder, d.line),
            '& .PulseTab-icon': { color: iconActive },
            '& .PulseTab-badge': { borderColor: '#1e293b' },
          },
          '&.Mui-selected': {
            fontWeight: role.tabSelected,
            color: textActive,
            background: underline ? 'transparent' : tc.activeBackground,
            boxShadow: lineShadow(variation, tc.activeBorder, d.line),
            '& .PulseTab-icon': { color: iconActive },
            '& .PulseTab-badge': { borderColor: '#1e293b' },
          },
          '&.Mui-focusVisible': { boxShadow: focusRing },
          '&.Mui-disabled': { opacity: disabledOpacity, color: textMuted },
          ...(vertical ? { alignSelf: 'stretch', maxWidth: 'none' } : {}),
        },
      }}
    >
      {children}
    </MuiTabs>
  );
}

export interface TabProps {
  /** Position of the tab; matches `Tabs.value`. */
  index: number;
  label: ReactNode;
  /** Accepted for API parity; Tabs owns the styling. */
  size?: TabsSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** Show a count badge. */
  showBadge?: boolean;
  badgeContent?: number;
  badgeContentMaxValue?: number;
  disabled?: boolean;
  /** Accepted for API parity; Tabs owns the styling. */
  variant?: TabsVariation;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * One tab of a Tabs list. MUI's Tabs injects `selected`, `onChange`, ... into its children, so unknown props are forwarded.
 * Badge: Figma Badge Stroke, 16px pill, 1px outline (gray default, black hover/active).
 */
export function Tab({ index, label, startIcon, endIcon, showBadge, badgeContent, badgeContentMaxValue = 99, disabled, size, variant, orientation, ...injected }: TabProps & Omit<MuiTabProps, keyof TabProps | 'value' | 'icon'>) {
  void size;
  void variant;
  void orientation;
  const hasBadge = showBadge || badgeContent != null;
  const shown = badgeContent != null && badgeContent > badgeContentMaxValue ? `${badgeContentMaxValue}+` : badgeContent;
  return (
    <MuiTab
      {...injected}
      value={index}
      disabled={disabled}
      disableRipple
      label={
        <>
          {startIcon && <span className="PulseTab-icon">{startIcon}</span>}
          <span>{label}</span>
          {hasBadge && (
            <span
              className="PulseTab-badge"
              style={{ boxSizing: 'border-box', minWidth: 16, height: 16, padding: '0 4px', borderRadius: 1000, background: '#fff', fontSize: 10, lineHeight: '14px', fontWeight: fw.semiBold, color: '#1e293b', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {shown}
            </span>
          )}
          {endIcon && <span className="PulseTab-icon">{endIcon}</span>}
        </>
      }
    />
  );
}
