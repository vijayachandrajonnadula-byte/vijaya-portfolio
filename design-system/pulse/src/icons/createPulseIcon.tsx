// Factory for the Pulse icon library (Figma "Icons" page). Used by the generated icons in generated.tsx.
import { createContext, createElement, forwardRef, useContext } from 'react';
import type { ReactNode } from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { sharpIcons } from './sharpMap';

export type IconNode = [tag: string, attrs: Record<string, string | number>, children?: IconNode[]];

export interface PulseIconProps extends Omit<SvgIconProps, 'color' | 'type'> {
  /** Pixel size (width and height). Defaults to the icon's native size (24 for stroke icons). */
  size?: number | string;
  /** Any CSS colour; defaults to currentColor. */
  color?: string;
  /** Corner style used by the Pulse app (`type="rounded"`). Stroke icons are already round-capped, so this is accepted for API parity. */
  type?: 'standard' | 'rounded' | 'sharp';
  /** Style variant (`variant="solid"`). Accepted for API parity with @pulse/icons; only one style exists in the Figma library. */
  variant?: string;
  /** Overrides stroke width on stroke icons (default 1.5). */
  strokeWidth?: number;
}

/**
 * NOT FROM FIGMA. Corner style for every icon below it: `standard` is the library as drawn (round caps and joins); `sharp` renders the
 * same outline with butt caps and mitre joins (square-cornered strokes). Default is `standard`, so nothing changes unless a screen opts in
 * (the Electronic Execution page does). An icon's own `type` prop wins over the context. Logged in docs/figma-deviations.md.
 */
export const IconStyleContext = createContext<'standard' | 'rounded' | 'sharp'>('standard');
export const IconStyleProvider = IconStyleContext.Provider;

const render = (n: IconNode, key: number, sw?: number, sharp?: boolean): ReactNode => {
  const [tag, attrs, kids] = n;
  const a: Record<string, unknown> = { ...attrs, key };
  if (sw != null && 'strokeWidth' in attrs) a.strokeWidth = sw;
  if (sharp) {
    if ('strokeLinecap' in attrs) a.strokeLinecap = 'butt';
    if ('strokeLinejoin' in attrs) a.strokeLinejoin = 'miter';
  }
  return createElement(tag, a, ...(kids ? kids.map((k, i) => render(k, i, sw, sharp)) : []));
};

export function createPulseIcon(name: string, viewBox: string, w: number, h: number, nodes: IconNode[], _custom: boolean) {
  const Icon = forwardRef<SVGSVGElement, PulseIconProps>(function PulseIcon(
    { size, color, type, variant: _variant, strokeWidth, sx, style, children: _c, ...rest },
    ref,
  ) {
    const inherited = useContext(IconStyleContext);
    const sharp = (type ?? inherited) === 'sharp';
    const Swap = sharp ? sharpIcons[name] : undefined;
    if (Swap) {
      return <Swap ref={ref} data-icon={name} {...rest} style={{ width: size ?? w, height: size ?? h, ...(color ? { color } : null), ...style }} sx={[{ flexShrink: 0 }, ...(Array.isArray(sx) ? sx : [sx])]} />;
    }
    const wd = size ?? w;
    const ht = size ?? h;
    return (
      <SvgIcon
        ref={ref}
        viewBox={viewBox}
        fill="none"
        data-icon={name}
        {...rest}
        style={{ width: wd, height: ht, ...(color ? { color } : null), ...style }}
        sx={[{ flexShrink: 0, fill: 'none' },...(Array.isArray(sx) ? sx : [sx])]}
      >
        {nodes.map((n, i) => render(n, i, strokeWidth, sharp))}
      </SvgIcon>
    );
  });
  Icon.displayName = name;
  return Icon;
}
