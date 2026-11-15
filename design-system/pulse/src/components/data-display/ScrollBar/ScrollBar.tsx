// Implements Figma page "ScrollBar": scrollBar (Direction Vertical/Horizontal, Stage BG Light/Dark) and sliderKnob-States (Default/Hover/Pressed).
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

export type ScrollBarBackground = 'light' | 'dark';

/** Thumb colours from pt.uiElements.scrollBar (light: black 20/30/50%) and the dark-stage variant (white 40/50/70%). */
export const scrollBarColors = {
  light: { thumb: 'rgba(0, 0, 0, 0.2)', hover: 'rgba(0, 0, 0, 0.3)', pressed: 'rgba(0, 0, 0, 0.5)' },
  dark: { thumb: 'rgba(255, 255, 255, 0.4)', hover: 'rgba(255, 255, 255, 0.5)', pressed: 'rgba(255, 255, 255, 0.7)' },
} as const;

/** Spec: 4px rounded thumb (r4) with 2px breathing room, so the scrollbar track is 8px wide. */
export function scrollBarSx(background: ScrollBarBackground = 'light'): SxProps<Theme> {
  const c = scrollBarColors[background];
  const thumb = (color: string) => ({ backgroundColor: color, backgroundClip: 'padding-box', border: '2px solid transparent', borderRadius: '6px' });
  return {
    scrollbarWidth: 'thin',
    scrollbarColor: `${c.thumb} transparent`,
    '&::-webkit-scrollbar': { width: 8, height: 8 },
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-corner': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': thumb(c.thumb),
    '&::-webkit-scrollbar-thumb:hover': thumb(c.hover),
    '&::-webkit-scrollbar-thumb:active': thumb(c.pressed),
  };
}

export interface ScrollBarProps extends Omit<BoxProps, 'overflow'> {
  /** Axis that scrolls. @default "vertical" */
  direction?: 'vertical' | 'horizontal' | 'both';
  /** Stage the scrollbar sits on. @default "light" */
  background?: ScrollBarBackground;
}

/** A scroll container wearing the Pulse scrollbar. Give it a height (vertical) or width (horizontal) to scroll. */
export function ScrollBar({ direction = 'vertical', background = 'light', sx, ...rest }: ScrollBarProps) {
  return (
    <Box
      tabIndex={0}
      {...rest}
      sx={[
        { overflowX: direction === 'vertical' ? 'hidden' : 'auto', overflowY: direction === 'horizontal' ? 'hidden' : 'auto' },
        scrollBarSx(background),
        ...(Array.isArray(sx) ? sx : [sx]),
      ] as never}
    />
  );
}

