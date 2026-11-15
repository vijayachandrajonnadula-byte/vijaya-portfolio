// Figma: Avatar page, sets "Avatar" (Size x Variant incl. split + AI) and "AvatarGroup".
import { fw } from '../../../theme/typography';
import { Children, cloneElement, forwardRef, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined';
import { chipPalette } from '../../_shared/families';
import type { FamilyColor } from '../../_shared/families';
import { pt } from '../../../theme/pulseTokens';

export type AvatarSize = 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';

export interface AvatarSplit {
  src?: string;
  /** Initials (1-2 letters) when there is no image. */
  text?: string;
}

export interface AvatarProps {
  /** @default "medium" */
  size?: AvatarSize;
  /** Photo variant. */
  src?: string;
  alt?: string;
  /** Initials (string) or an emoji / custom node. */
  children?: ReactNode;
  /** Two or three halves (Figma "2/3 Image|Initial Split"). */
  splits?: AvatarSplit[];
  /** Gray (default) or a named tint for initials / default avatars. */
  avatarColor?: FamilyColor;
  /** Overrides the background / text colour (used by the Pulse app). */
  backgroundColor?: string;
  textColor?: string;
  /** AI avatar (chat-bot glyph on a gradient). */
  ai?: boolean;
  /** Presence dot: true = green, or any CSS colour. */
  badge?: boolean | string;
  sx?: SxProps<Theme>;
}

// Figma: Avatar sizes 18/24/32/40/44. Font/glyph sizes inferred from the frame paddings (pad 4/6/6/6/8).
// Figma split-avatar initials (Inter Bold): first half / the two small quarters of the 3-split.
const splitFont = { xxsmall: [6, 4], xsmall: [8, 5], small: [10, 6], medium: [12, 8], large: [14, 9] } as const;
export const avatarMetrics = {
  xxsmall: { box: 18, font: 10, glyph: 10, dot: 4, ring: 1 },
  xsmall: { box: 24, font: 10, glyph: 12, dot: 6, ring: 1 },
  small: { box: 32, font: 12, glyph: 16, dot: 8, ring: 1 },
  medium: { box: 40, font: 14, glyph: 20, dot: 8, ring: 1 },
  large: { box: 44, font: 16, glyph: 24, dot: 10, ring: 1 },
} as const;

const av = pt.uiElements.avatar.color as Record<string, string>;
const GRAY_BG = '#f1f5f9';
const GRAY_TEXT = '#1e293b';
const AI_BG = 'linear-gradient(45deg, #f8e6f8 0%, #f0ecfb 50%, #e8f4fd 100%)';

/** Avatar: default glyph, initials, photo, emoji, 2/3 splits and AI. */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { size = 'medium', src, alt, children, splits, avatarColor, backgroundColor, textColor, ai, badge, sx },
  ref,
) {
  const m = avatarMetrics[size];
  const tint = avatarColor && avatarColor !== 'gray' && avatarColor !== 'default' && avatarColor in chipPalette ? chipPalette[avatarColor as keyof typeof chipPalette] : undefined;
  const bg = backgroundColor ?? (ai ? AI_BG : tint ? tint.bg : (av.grayBackground ?? GRAY_BG));
  const fg = textColor ?? (tint ? tint.text : (av.grayTextIcon ?? GRAY_TEXT));
  const dotPaint = typeof badge === 'string' ? badge : '#22c55e';
  const text = typeof children === 'string' ? children.slice(0, 2).toUpperCase() : children;

  let content: ReactNode;
  if (splits && splits.length >= 2) {
    const half = (s: AvatarSplit, sxx: object, quarter = false) => (
      <Box
        sx={{
          flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontWeight: fw.bold,
          fontSize: splitFont[size][quarter ? 1 : 0],
          background: s.src ? `center / cover url("${s.src}")` : 'transparent',
          boxShadow: `inset 0 0 0 0.75px ${av.stroke ?? '#fff'}`, ...sxx,
        }}
      >
        {s.src ? null : s.text}
      </Box>
    );
    const [a, b, c] = splits as [AvatarSplit, AvatarSplit, AvatarSplit | undefined];
    content = (
      <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
        {half(a, {})}
        {c ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{half(b, {}, true)}{half(c, {}, true)}</Box>
        ) : (
          half(b, {})
        )}
      </Box>
    );
  } else if (src) {
    content = <Box component="img" src={src} alt={alt ?? ''} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  } else if (ai) {
    content = <SmartToyOutlined sx={{ fontSize: m.glyph, color: '#653fda' }} />;
  } else if (text != null && text !== '') {
    content = typeof text === 'string' ? <span>{text}</span> : text;
  } else {
    content = <PersonOutlineRounded sx={{ fontSize: m.glyph, color: '#212324' }} />;
  }

  return (
    <Box
      ref={ref}
      role="img"
      aria-label={alt}
      data-spec={`avatar ${size}`}
      sx={[
        {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          flexShrink: 0,
          width: m.box,
          height: m.box,
          borderRadius: '50%',
          background: src || (splits && splits.some((s) => s.src)) ? undefined : bg,
          color: fg,
          fontFamily: 'Figtree, Inter Variable, sans-serif',
          fontSize: m.font,
          lineHeight: 1,
          fontWeight: fw.semiBold,
          overflow: 'visible',
          '& > :first-of-type': { borderRadius: '50%', overflow: 'hidden' },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {content}
      {badge && (
        <Box
          component="span"
          sx={{
            position: 'absolute', top: -1, right: -1, display: 'flex', p: '1px', borderRadius: '50%', background: av.stroke ?? '#fff',
            '&::after': { content: '""', width: m.dot, height: m.dot, borderRadius: '50%', background: dotPaint },
          }}
        />
      )}
    </Box>
  );
});
Avatar.displayName = 'Avatar';

export interface AvatarGroupProps {
  /** Avatar elements. */
  children: ReactNode;
  /** @default "medium" */
  size?: AvatarSize;
  /** Visible avatars before the "+N" counter. @default 5 */
  max?: number;
  /** stack: overlapped row. pie: one avatar split into 2-3 parts from the first members (Figma split variants). @default "stack" */
  layout?: 'stack' | 'pie';
  /** Shows the circular "+" add button after the counter. */
  onAdd?: () => void;
  className?: string;
  sx?: SxProps<Theme>;
}

/** AvatarGroup: overlapped avatars (-8px), 2px white ring, "+N" counter and optional add button. */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { children, size = 'medium', max = 5, layout = 'stack', onAdd, className, sx },
  ref,
) {
  const m = avatarMetrics[size];
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarProps>[];
  const ring = size === 'xxsmall' || size === 'xsmall' ? 1 : 2;
  if (layout === 'pie') {
    const parts = items.slice(0, 3).map((e) => ({ src: e.props.src, text: typeof e.props.children === 'string' ? e.props.children.slice(0, 1).toUpperCase() : undefined }));
    return <Avatar size={size} splits={parts.length >= 2 ? parts : [...parts, { text: '' }]} />;
  }
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  return (
    <Box ref={ref} className={className} role="group" sx={[{ display: 'inline-flex', alignItems: 'center', gap: size === 'xxsmall' ? '4px' : '8px' }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      <Box sx={{ display: 'inline-flex', '& > *:not(:first-of-type)': { ml: '-8px' } }}>
        {shown.map((e, i) => cloneElement(e, { key: e.key ?? i, size, sx: { boxShadow: `0 0 0 ${ring}px ${av.stroke ?? '#fff'}` } }))}
        {rest > 0 && (
          <Avatar size={size} sx={{ boxShadow: `0 0 0 ${ring}px ${av.stroke ?? '#fff'}` }}>{`+${rest}`}</Avatar>
        )}
      </Box>
      {onAdd && (
        <Box
          component="button"
          type="button"
          aria-label="Add"
          onClick={onAdd}
          sx={{ width: m.box, height: m.box, p: 0, borderRadius: '50%', border: '1px solid #cbd5e1', background: 'transparent', color: '#0f172a', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', '&:hover': { background: '#eef3fb' } }}
        >
          <AddRounded sx={{ fontSize: Math.min(20, m.box - 8) }} />
        </Box>
      )}
    </Box>
  );
});
AvatarGroup.displayName = 'AvatarGroup';

