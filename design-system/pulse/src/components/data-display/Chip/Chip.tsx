// Figma: Chip page, set "Chip" (Shape x Size x Style x Color x Interaction).
import { role } from '../../../theme/typography';
import { forwardRef } from 'react';
import type { MouseEventHandler, ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { chipAi, chipPalette } from '../../_shared/families';
import type { FamilyColor } from '../../_shared/families';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import { AdornmentButton } from '../../actions/Button/AdornmentButton';
import { focusRing } from '../../../theme/pulseTokens';

export type ChipColor = FamilyColor;
export type ChipVariant = 'stroke' | 'fill' | 'strokeLight' | 'strokeExtraPadding';
export type ChipSize = 'xxsmall' | 'xsmall' | 'small';
export type ChipShape = 'pill' | 'rectangle';

export interface ChipProps {
  label: ReactNode;
  /** @default "default" */
  color?: ChipColor;
  /**
   * stroke: tint + 1px border (Figma Style=Stroke). fill: tint, no border, saturated text (Style=Fill).
   * strokeLight: tint + 0.5px border. strokeExtraPadding: stroke with the wider padding tokens.
   * @default "stroke"
   */
  variant?: ChipVariant;
  /** @default "xsmall" */
  size?: ChipSize;
  /** @default "pill" */
  shape?: ChipShape;
  /** Leading status dot (Figma "Badge" slot). */
  showBadge?: boolean;
  /** Overrides the family colours (e.g. a user-defined tag colour). */
  customColors?: { color: string; bgColor: string };
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  /** Trailing chevron (Figma Show Dropdown). */
  showDropdown?: boolean;
  /** Makes the chip a button (enables hover shadow and focus ring). */
  onClick?: MouseEventHandler<HTMLElement>;
  /** Shows the close adornment button and calls this when it is pressed. */
  onDelete?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

// Figma: root padding [v,h] and fixed height per size; radius 1000 (pill) or 6 (rectangle).
const metrics = {
  xxsmall: { height: 20, py: 1, px: 8, extra: 12, font: 10 },
  xsmall: { height: 24, py: 3, px: 10, extra: 12, font: 11 },
  small: { height: 32, py: 7, px: 12, extra: 18, font: 12 },
} as const;

/**
 * Chip: tag / status label. Sizes, paddings, radii and colours are read from the pulse-2.0 Chip set.
 * The 10/11/12px font sizes per size are inferred (Figma only fixes the 18px line box).
 */
export const Chip = forwardRef<HTMLElement, ChipProps>(function Chip(
  { label, color = 'default', variant = 'stroke', size = 'xsmall', shape = 'pill', showBadge, customColors, startAdornment, endAdornment, showDropdown, onClick, onDelete, disabled, sx },
  ref,
) {
  const m = metrics[size];
  const filled = variant === 'fill';
  const isAi = color === 'ai';
  const pal = isAi ? undefined : chipPalette[(color in chipPalette ? color : 'gray') as keyof typeof chipPalette];
  const bg = customColors?.bgColor ?? (isAi ? (filled ? chipAi.fillBg : chipAi.bg) : filled && color === 'default' ? chipPalette.gray.bg : pal!.bg);
  const text = customColors?.color ?? (isAi ? chipAi.text : pal!.text);
  const borderColor = customColors ? 'transparent' : isAi ? chipAi.border : pal!.border;
  const bw = filled ? 0 : variant === 'strokeLight' ? 0.5 : 1;
  const extra = variant === 'strokeExtraPadding';
  const clickable = Boolean(onClick) && !disabled;
  const dot = text;
  const px = extra ? m.extra : m.px;
  const shadowHover = '0 0 4px rgba(0,0,0,0.2)';

  return (
    <Box
      ref={ref}
      component="span"
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                (e.currentTarget as HTMLElement).click();
              }
            }
          : undefined
      }
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          height: m.height,
          maxWidth: '100%',
          // Figma strokes sit inside the box, so the border is taken out of the padding.
          padding: `${m.py - bw}px ${px - bw}px`,
          background: bg,
          color: text,
          border: `${bw}px solid ${borderColor}`,
          borderRadius: shape === 'pill' ? '1000px' : '6px',
          fontFamily: 'Inter Variable, Inter, sans-serif',
          fontSize: m.font,
          lineHeight: '18px',
          fontWeight: role.chip,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          cursor: clickable ? 'pointer' : 'default',
          opacity: disabled ? 0.38 : 1,
          transition: 'box-shadow 120ms',
          '&:focus-visible': {
            outline: 'none',
            boxShadow: focusRing,
            ...(isAi ? { background: `${chipAi.gradientBg} padding-box, ${chipAi.gradientBorder} border-box`, borderColor: 'transparent' } : {}),
          },
          ...(clickable ? { '&:hover': { boxShadow: shadowHover } } : {}),
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {showBadge && <Box component="span" data-slot="badge" sx={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: customColors ? dot : isAi ? 'linear-gradient(45deg,#bd06be,#653fda,#158eef)' : pal!.dot, mr: '4px' }} />}
      {startAdornment && <Box component="span" sx={{ display: 'inline-flex', mr: '4px', '& svg': { width: 14, height: 14 } }}>{startAdornment}</Box>}
      <Box component="span" sx={{ px: '4px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {label}
      </Box>
      {endAdornment && <Box component="span" sx={{ display: 'inline-flex', ml: '4px', '& svg': { width: 14, height: 14 } }}>{endAdornment}</Box>}
      {showDropdown && (
        <Box component="span" data-slot="dropdown" sx={{ display: 'inline-flex', width: 18, height: 18, p: '2px', boxSizing: 'border-box', '& svg': { width: 14, height: 14 } }}>
          <KeyboardArrowDownRounded />
        </Box>
      )}
      {onDelete && (
        <AdornmentButton
          size="xxs"
          shape="circle"
          variant="dark"
          aria-label="Remove"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          sx={{ color: text, ml: '2px' }}
        />
      )}
    </Box>
  );
});
Chip.displayName = 'Chip';


