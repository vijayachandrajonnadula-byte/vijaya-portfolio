/** One generated vector symbol: an SVG fragment (already in the symbol's own coordinate space) plus its viewBox. */
export interface SymbolData {
  /** "x y width height" */
  viewBox: string;
  /** SVG markup (paths, gradients, clip paths) for the inside of the <svg>. */
  body: string;
}

export type SymbolSet<K extends string = string> = Record<K, SymbolData>;
