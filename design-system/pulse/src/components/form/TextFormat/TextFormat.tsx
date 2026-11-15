import { fw } from '../../../theme/typography';
import type { ElementType, ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { textStyle } from '../../../theme/pulseTokens';

/**
 * Figma page "TextFormat": the text instances every component re-uses.
 * textLabel -> FieldLabel, textMetaData -> MetaData, textHeading -> TextHeading, textContent -> TextContent,
 * textLink -> TextLink, textInputValueReadOnly -> ReadOnlyValue.
 * (The text masters in the .fig are drawn in Figtree; instances resolve to the Inter text styles, which are used here.)
 */

/* ----------------------------------------------------------------- textLabel */

export interface FieldLabelProps {
  children?: ReactNode;
  required?: boolean;
  /** "All Caps? = Yes": Inter Bold 10/18, 5% tracking, uppercase. */
  allCaps?: boolean;
  /** "Variant = Multi Line": allow wrapping. */
  multiline?: boolean;
  /** Trailing 18px info affordance. */
  info?: ReactNode;
  htmlFor?: string;
  id?: string;
  component?: ElementType;
  sx?: SxProps<Theme>;
}

/** Label above / beside a control. Value #0F172A SemiBold, required asterisk neutral-400, 2px gap. */
export function FieldLabel({ children, required, allCaps, multiline, info, htmlFor, id, component = 'label', sx }: FieldLabelProps) {
  const text = allCaps ? { ...textStyle('textS', 'bold'), letterSpacing: '0.05em', textTransform: 'uppercase' as const } : textStyle('textL', 'semiBold');
  return (
    <Box
      component={component}
      htmlFor={component === 'label' ? htmlFor : undefined}
      id={id}
      sx={[
        { display: 'inline-flex', alignItems: 'center', gap: '2px', ...text, color: '#0f172a', whiteSpace: multiline ? 'normal' : 'nowrap', maxWidth: '100%' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <span>{children}</span>
      {required && (
        <Box component="span" aria-hidden="true" sx={{ color: '#5f6f86', fontWeight: allCaps ? fw.medium : fw.semiBold }}>
          *
        </Box>
      )}
      {info != null && <Box component="span" sx={{ display: 'inline-flex', ml: '6px', color: '#566680' }}>{info}</Box>}
    </Box>
  );
}

/* ---------------------------------------------------------------- textMetaData */

export type MetaDataColor = 'green' | 'orange' | 'red' | 'grey' | 'blue';
const metaColors: Record<MetaDataColor, string> = { green: '#15803d', orange: '#b45309', red: '#dc2626', grey: '#5f6f86', blue: '#2563eb' };

export interface MetaDataProps {
  /** @default "grey" */
  color?: MetaDataColor;
  /** "Font Weight": title is semi-bold, body regular. @default "body" */
  weight?: 'title' | 'body';
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

/** Coloured helper / status text (11/20). */
export function MetaData({ color = 'grey', weight = 'body', children, sx }: MetaDataProps) {
  return (
    <Box component="span" sx={[{ ...textStyle('textM', weight === 'title' ? 'semiBold' : 'regular'), color: metaColors[color] }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------------ textHeading */

export type TextHeadingVariant = 'main' | 'sub1' | 'sub2' | 'sub3' | 'section';
const headingStyle: Record<TextHeadingVariant, { tag: ElementType; css: Record<string, string | number> }> = {
  main: { tag: 'h1', css: textStyle('heading2', 'semiBold') },
  sub1: { tag: 'h2', css: textStyle('heading4', 'semiBold') },
  sub2: { tag: 'h3', css: textStyle('heading5', 'semiBold') },
  sub3: { tag: 'h4', css: textStyle('heading6', 'semiBold') },
  // "Section Heading": Inter Bold 14/24 (no matching kit token).
  section: { tag: 'h5', css: { ...textStyle('textXl', 'bold'), fontSize: '14px', lineHeight: '24px' } },
};

export interface TextHeadingProps {
  /** @default "sub1" */
  variant?: TextHeadingVariant;
  component?: ElementType;
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

/** Headings: Main (40) / Sub 1 (32) / Sub 2 (24) / Sub 3 (18) / Section (14 bold). */
export function TextHeading({ variant = 'sub1', component, children, sx }: TextHeadingProps) {
  const h = headingStyle[variant];
  return (
    <Box component={component ?? h.tag} sx={[{ m: 0, ...h.css, color: '#0f172a' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------------ textContent */

export interface TextContentProps {
  /** @default "primary" */
  variant?: 'primary' | 'secondary' | 'metaData';
  /** @default "regular" */
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  multiline?: boolean;
  component?: ElementType;
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

/** Body copy: primary (#0F172A, 12/20), secondary (#566680, 12/20), metaData (#566680, 10/18). */
export function TextContent({ variant = 'primary', weight = 'regular', multiline, component = 'span', children, sx }: TextContentProps) {
  const base = variant === 'metaData' ? textStyle('textS', weight) : textStyle('textL', weight);
  return (
    <Box
      component={component}
      sx={[
        { ...base, color: variant === 'primary' ? '#0f172a' : '#566680', ...(multiline ? { display: 'block' } : { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }) },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

/* --------------------------------------------------------------------- textLink */

export interface TextLinkProps {
  /** "Dark" = on a light surface, "Light" = on a dark surface. @default "dark" */
  tone?: 'dark' | 'light';
  href?: string;
  onClick?: () => void;
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

/** Hyperlink text: SemiBold, no underline at rest, underlined on hover. */
export function TextLink({ tone = 'dark', href, onClick, children, sx }: TextLinkProps) {
  const dark = tone === 'dark';
  return (
    <Box
      component={href ? 'a' : 'button'}
      href={href}
      type={href ? undefined : 'button'}
      onClick={onClick}
      sx={[
        {
          ...textStyle('textL', 'semiBold'),
          p: 0,
          border: 0,
          background: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          textDecoration: 'none',
          color: dark ? '#1e3a6e' : '#d3e0f2',
          '&:hover': { textDecoration: 'underline', color: dark ? '#1e3a6e' : '#b5c9e7' },
          '&:focus-visible': { outline: '2px solid #3b82f6', outlineOffset: 2, borderRadius: '2px' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------ textInputValueReadOnly */

export interface ReadOnlyValueProps {
  multiline?: boolean;
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

/** "Value - Read Only": the plain value text shown instead of an input (Regular, #0F172A). */
export function ReadOnlyValue({ multiline, children, sx }: ReadOnlyValueProps) {
  return (
    <Box
      sx={[
        { ...textStyle('textL'), color: '#0f172a', borderRadius: '4px', ...(multiline ? { whiteSpace: 'normal' } : { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }) },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
