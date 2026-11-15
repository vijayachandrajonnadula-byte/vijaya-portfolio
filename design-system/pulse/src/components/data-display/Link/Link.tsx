// Figma: Link page, set "Link" (Interaction Default|Hover|Visited|Focus x Background Mode Light|Dark).
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import MuiLink from '@mui/material/Link';
import type { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { focusRing, textStyle } from '../../../theme/pulseTokens';

export interface LinkProps extends Omit<MuiLinkProps, 'color'> {
  /** Surface the link sits on. dark switches to the light-cyan link colours. @default "light" */
  background?: 'light' | 'dark';
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

// Figma colours: default #1c6a7b, hover #24899f, visited #6537bc (glyph #1e40af); on dark #76d5ea, hover #5bcde6, visited #9f7cdf (glyph #818cf8).
const light = { base: '#1c6a7b', hover: '#24899f', visited: '#6537bc', visitedIcon: '#1e40af' };
const dark = { base: '#76d5ea', hover: '#5bcde6', visited: '#9f7cdf', visitedIcon: '#818cf8' };

/** Link: underlined text with optional 16px glyphs; hover, visited and focus-ring states. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { background = 'light', startIcon, endIcon, children, sx, ...rest },
  ref,
) {
  const c = background === 'dark' ? dark : light;
  return (
    <MuiLink
      ref={ref}
      underline="always"
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          borderRadius: '4px',
          color: c.base,
          textDecorationColor: 'currentColor',
          ...textStyle('textM', 'regular'),
          '& svg': { width: 16, height: 16 },
          '&:hover': { color: c.hover },
          '&:visited': { color: c.visited, '& svg': { color: c.visitedIcon } },
          '&:focus-visible': { outline: 'none', boxShadow: focusRing },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...rest}
    >
      {startIcon}
      {children}
      {endIcon}
    </MuiLink>
  );
});
Link.displayName = 'Link';

