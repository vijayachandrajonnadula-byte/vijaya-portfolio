/**
 * MUI type augmentations.
 * - Button: pulse-2.0 sizes (xsmall/xlarge) and colour (ai); colours Figma does not define are removed.
 * - Typography: the Pulse text styles (heading1-6, textXl/L/M/S, label, displayL/Xl).
 * - `palette.ai`: middle stop of the AI gradient (the gradient itself lives in buttonTokens).
 * The imports make this file a module so `declare module` augments (not replaces).
 */
import '@mui/material/Button';
import '@mui/material/Typography';
import type { PaletteColor, PaletteColorOptions } from '@mui/material/styles';
import type { CSSProperties } from 'react';

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    ai: true;
    secondary: false;
    info: false;
  }
  interface ButtonPropsSizeOverrides {
    xsmall: true;
    xlarge: true;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    ai: PaletteColor;
  }
  interface PaletteOptions {
    ai?: PaletteColorOptions;
  }
  interface TypographyVariants {
    displayL: CSSProperties;
    displayXl: CSSProperties;
    heading1: CSSProperties;
    heading2: CSSProperties;
    heading3: CSSProperties;
    heading4: CSSProperties;
    heading5: CSSProperties;
    heading6: CSSProperties;
    textXl: CSSProperties;
    textL: CSSProperties;
    textM: CSSProperties;
    textS: CSSProperties;
    label: CSSProperties;
  }
  interface TypographyVariantsOptions {
    displayL?: CSSProperties;
    displayXl?: CSSProperties;
    heading1?: CSSProperties;
    heading2?: CSSProperties;
    heading3?: CSSProperties;
    heading4?: CSSProperties;
    heading5?: CSSProperties;
    heading6?: CSSProperties;
    textXl?: CSSProperties;
    textL?: CSSProperties;
    textM?: CSSProperties;
    textS?: CSSProperties;
    label?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    displayL: true;
    displayXl: true;
    heading1: true;
    heading2: true;
    heading3: true;
    heading4: true;
    heading5: true;
    heading6: true;
    textXl: true;
    textL: true;
    textM: true;
    textS: true;
    label: true;
  }
}
