/** Public API of the design system. Import only from here in consuming apps. */
export * from './components';
export * from './templates';
export * from './icons';
export { theme, themeOptions } from './theme/theme';
export { pt as pulseTokens } from './theme/pulseTokens';
// Heavy generated symbol sets (P&ID equipment, shapes, arrows, 271 flags) are imported lazily from
// './components/foundations/<Name>' so they stay out of the main bundle.
