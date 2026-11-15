// Shared renderer + lazy loader for the generated vector symbol sets (src/symbols/generated/*.ts).
import { forwardRef, useEffect, useState } from 'react';
import type { SVGProps } from 'react';
import type { SymbolData, SymbolSet } from './types';

export interface SymbolSvgProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox'> {
  /** The symbol to draw; while a set is still loading pass undefined and an empty, correctly sized box is drawn. */
  symbol?: SymbolData | undefined;
  /** Width in px (or any CSS length). Height follows the symbol's aspect ratio. */
  size?: number | string;
  /** Accessible name. Without it the symbol is treated as decorative (aria-hidden). */
  title?: string;
}

export const SymbolSvg = forwardRef<SVGSVGElement, SymbolSvgProps>(function SymbolSvg(
  { symbol, size, title, style, ...rest },
  ref,
) {
  const vb = symbol?.viewBox ?? '0 0 1 1';
  const [, , w, h] = vb.split(' ').map(Number);
  return (
    <svg
      ref={ref}
      viewBox={vb}
      width={size ?? w}
      height={typeof (size ?? w) === 'number' && w && h ? (((size ?? w) as number) * h) / w : undefined}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
      style={{ display: 'inline-block', flexShrink: 0, overflow: 'visible', height: 'auto',...style }}
      dangerouslySetInnerHTML={{ __html: symbol?.body ?? '' }}
    />
  );
});

const cache = new Map<() => Promise<unknown>, SymbolSet>();

/** Loads a generated set on first use (dynamic import, so the data stays out of the main bundle). */
export function useSymbolSet<K extends string>(loader: () => Promise<{ symbols: SymbolSet<K> }>): SymbolSet<K> | undefined {
  const [set, setSet] = useState<SymbolSet<K> | undefined>(cache.get(loader) as SymbolSet<K> | undefined);
  useEffect(() => {
    if (set) return;
    let live = true;
    void loader().then((m) => {
      cache.set(loader, m.symbols);
      if (live) setSet(m.symbols);
    });
    return () => {
      live = false;
    };
  }, [loader, set]);
  return set;
}

export const humanize = (key: string) =>
  key
    .replace(/__/g, ' / ')
    .replace(/[_/]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
