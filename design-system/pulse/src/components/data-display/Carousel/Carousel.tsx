// Pulse "Carousel" page: Carousel (Indicator Position x Indicator Type x Arrow Position x Theme), carousel-ButtonVariations
// (Interaction x Shape x Theme x Size 40/44/48) and the .Pagination indicator (Lined | Dots). 800x400 slide area, 24px gap to
// outside indicators, arrow buttons are 48px circles filled #00000012 (light) / #ffffff0d (dark).
import { Children, useEffect, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import { focusRing, pt } from '../../../theme/pulseTokens';

const pg = pt.uiElements.pagination.color;
const arrowBg = {
  light: { rest: '#00000012', hover: '#eef3fb' }, // light hover: the inner IconButton paints tertiaryHoverBG over #0000001a
  dark: { rest: '#ffffff0d', hover: '#ffffff1a' },
} as const;
const arrowPx = { medium: 40, large: 44, xlarge: 48 } as const;
// Glyph sizes of the inner Figma IconButton (Plain) per arrow size.
const arrowGlyph = { medium: 16, large: 18, xlarge: 18 } as const;

/* -------------------------------------------------------------- pagination */

export interface CarouselPaginationProps {
  count: number;
  /** Zero-based active index. */
  value: number;
  onChange?: (index: number) => void;
  /** @default "circle" */
  type?: 'circle' | 'lined';
  /** Colours for a light or dark surface. @default "light" */
  theme?: 'light' | 'dark';
}

/** Slide indicator (.Pagination: dots or lines, 4px padding). */
export function CarouselPagination({ count, value, onChange, type = 'circle', theme = 'light' }: CarouselPaginationProps) {
  const normal = theme === 'dark' ? pg.darkBgNormal : pg.dotBgNormal;
  const hover = theme === 'dark' ? pg.darkBgActive : pg.dotBgHover;
  const active = theme === 'dark' ? pg.darkBgActive : pg.dotBgActive;
  return (
    <Box role="tablist" aria-label="Slides" data-spec="carousel-pagination" sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: pt.spacing.xs, p: pt.spacing.xs, minHeight: 24, boxSizing: 'border-box' }}>
      {Array.from({ length: count }, (_, i) => (
        <ButtonBase
          key={i}
          role="tab"
          aria-selected={i === value}
          aria-label={`Slide ${i + 1}`}
          onClick={() => onChange?.(i)}
          sx={{
            width: type === 'lined' ? 32 : 8,
            height: type === 'lined' ? 4 : 8,
            borderRadius: pt.uiElements.pagination.radius.full,
            background: i === value ? active : normal,
            transition: 'background-color 120ms, width 120ms',
            '&:hover': { background: i === value ? active : hover },
            '&.Mui-focusVisible': { boxShadow: focusRing },
            ...(theme === 'light' && i !== value && { outline: `1px solid ${pt.colors.neutral[200]}`, outlineOffset: '-1px' }),
          }}
        />
      ))}
    </Box>
  );
}

/* ---------------------------------------------------------------- carousel */

export interface CarouselProps {
  children: ReactNode;
  /** Controlled index. */
  value?: number;
  defaultValue?: number;
  onChange?: (index: number) => void;
  /** @default "outside" */
  indicatorPosition?: 'inside' | 'outside';
  /** @default "circle" */
  indicatorType?: 'circle' | 'lined';
  /** @default "inside" */
  arrowPosition?: 'inside' | 'outside';
  /** Surface and arrow colours. @default "light" */
  theme?: 'light' | 'dark';
  /** @default "xlarge" (48px) */
  arrowSize?: keyof typeof arrowPx;
  /** @default "circle" */
  arrowShape?: 'circle' | 'square';
  /** Wrap around at the ends. @default false */
  loop?: boolean;
  /** Auto advance every N ms. */
  autoPlayMs?: number;
  /** @default 800 */
  width?: number | string;
  /** Slide area height. @default 400 */
  height?: number | string;
  ariaLabel?: string;
}

/** Slide carousel: arrows, indicator, keyboard (left/right arrows). */
export function Carousel({
  children,
  value,
  defaultValue = 0,
  onChange,
  indicatorPosition = 'outside',
  indicatorType = 'circle',
  arrowPosition = 'inside',
  theme = 'light',
  arrowSize = 'xlarge',
  arrowShape = 'circle',
  loop = false,
  autoPlayMs,
  width = pt.uiElements.carousel.container.width,
  height = 400,
  ariaLabel = 'Carousel',
}: CarouselProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [internal, setInternal] = useState(defaultValue);
  const index = Math.min(value ?? internal, Math.max(count - 1, 0));
  const go = (next: number) => {
    const n = loop ? (next + count) % count : Math.max(0, Math.min(count - 1, next));
    if (value === undefined) setInternal(n);
    onChange?.(n);
  };
  useEffect(() => {
    if (!autoPlayMs || count < 2) return;
    const t = window.setInterval(() => go(index + 1 >= count ? 0 : index + 1), autoPlayMs);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlayMs, index, count]);

  const px = arrowPx[arrowSize];
  const inside = arrowPosition === 'inside';
  const dark = theme === 'dark';
  // Figma: arrows placed outside the card sit on the page, so they always use the Light button theme.
  const arrowTheme = inside ? theme : 'light';
  const arrow = (dir: -1 | 1) => {
    const disabled = !loop && (dir === -1 ? index === 0 : index === count - 1);
    const Icon = dir === -1 ? ChevronLeftRounded : ChevronRightRounded;
    return (
      <ButtonBase
        aria-label={dir === -1 ? 'Previous slide' : 'Next slide'}
        disabled={disabled}
        onClick={() => go(index + dir)}
        data-spec={`carousel-arrow ${arrowSize}`}
        sx={{
          position: 'absolute',
          top: '50%',
          mt: `${-px / 2}px`,
          [dir === -1 ? 'left' : 'right']: inside ? 40 : -(px + 24),
          zIndex: 2,
          width: px,
          height: px,
          borderRadius: arrowShape === 'circle' ? pt.radius.full : '10px',
          background: arrowBg[arrowTheme].rest,
          color: arrowTheme === 'dark' ? '#d9dbdd' : '#02216e',
          '&:hover': { background: arrowBg[arrowTheme].hover, ...(arrowTheme === 'dark' && { color: '#fff' }) },
          '&.Mui-focusVisible': { boxShadow: focusRing },
          '&.Mui-disabled': { opacity: 0.38 },
        }}
      >
        <Icon sx={{ fontSize: arrowGlyph[arrowSize] }} />
      </ButtonBase>
    );
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(index - 1);
    if (e.key === 'ArrowRight') go(index + 1);
  };
  const indicator = <CarouselPagination count={count} value={index} onChange={go} type={indicatorType} theme={dark && indicatorPosition === 'inside' ? 'dark' : 'light'} />;
  return (
    <Box role="region" aria-roledescription="carousel" aria-label={ariaLabel} tabIndex={0} onKeyDown={onKey} data-spec={`carousel ${indicatorPosition}`} sx={{ width, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', position: 'relative', outline: 'none', '&:focus-visible': { boxShadow: focusRing, borderRadius: pt.radius.m } }}>
      <Box sx={{ position: 'relative', width: '100%', height }}>
        <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: pt.uiElements.carousel.wrapper.radius, background: dark ? pt.colors.neutral[900] : pt.uiElements.carousel.color.background, color: dark ? '#fff' : undefined }}>
          <Box sx={{ display: 'flex', height: '100%', transform: `translateX(-${index * 100}%)`, transition: 'transform 300ms ease' }}>
            {slides.map((s, i) => (
              <Box key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} aria-hidden={i !== index} sx={{ flex: '0 0 100%', minWidth: 0, height: '100%' }}>
                {s}
              </Box>
            ))}
          </Box>
        </Box>
        {count > 1 && arrow(-1)}
        {count > 1 && arrow(1)}
        {indicatorPosition === 'inside' && count > 1 && <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center' }}>{indicator}</Box>}
      </Box>
      {indicatorPosition === 'outside' && count > 1 && indicator}
    </Box>
  );
}


