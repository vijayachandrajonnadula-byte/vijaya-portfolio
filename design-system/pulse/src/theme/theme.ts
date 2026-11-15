import { createTheme } from '@mui/material/styles';
import type { Theme, ThemeOptions } from '@mui/material/styles';
import { buttonIcon, buttonRoot, buttonTypography } from './buttonStyles';
import { gradientMid, pulseButton } from './buttonTokens';
import { componentStyles, muiTypography } from './componentStyles';
import { accent, neutral, num, pt } from './pulseTokens';

/**
 * MUI theme for the Pulse design system. Light only: the pulse-2.0 Figma file defines no dark appearance.
 *
 * Sources: figma-tokens/pulse-designkit.json (@pulse/designkit: colours, type, radius, spacing, per-component
 * tokens) and figma-tokens/pulse-button.json (the Button component set). Components read their own measurements
 * from the extracted Figma specs (figma-tokens/pulse/components).
 */

const pc = pulseButton.color;
const status = (c: 'error' | 'success' | 'warning') => ({
  main: pc[c].contained.default.fill,
  light: pc[c].contained.hover.fill,
  contrastText: pc[c].contained.default.label,
});
// A gradient cannot live in a palette entry; main is the gradient's middle stop (see buttonStyles.ts).
const aiMain = gradientMid(pc.ai.contained.default.fill);

/** Theme options, exposed so consumers can extend them. */
export const themeOptions: ThemeOptions = {
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: { main: pc.primary.contained.default.fill, light: pt.colors.brand[400], dark: pt.colors.brand[700], contrastText: pc.primary.contained.default.label },
    secondary: { main: neutral[600], contrastText: pt.colors.base.white },
    error: status('error'),
    success: status('success'),
    warning: status('warning'),
    info: { main: accent.blue[600], light: accent.blue[500], dark: accent.blue[700], contrastText: pt.colors.base.white },
    ai: { main: aiMain, contrastText: pc.ai.contained.default.label },
    text: { primary: pt.formElements.content.primaryTextColor, secondary: pt.formElements.content.secondaryTextColor, disabled: neutral[400] },
    background: { default: neutral[25], paper: pt.colors.base.white },
    divider: neutral[200],
  },
  spacing: num(pt.spacing.xs), // 4px, the designkit base step
  shape: { borderRadius: num(pt.radius.m) }, // 8px: cards, menus, sections
  typography: { ...muiTypography, button: buttonTypography },
  components: {
    ...componentStyles,
    // pulse-2.0 Button (figma-tokens/pulse-button.json).
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: ({ ownerState, theme }) => buttonRoot(theme, ownerState.variant ?? 'text', ownerState.color ?? 'primary', ownerState.size ?? 'medium'),
        startIcon: ({ ownerState }) => buttonIcon(ownerState.variant ?? 'text', ownerState.size ?? 'medium'),
        endIcon: ({ ownerState }) => buttonIcon(ownerState.variant ?? 'text', ownerState.size ?? 'medium'),
      },
    },
    MuiCard: { styleOverrides: { root: { borderRadius: num(pt.radius.m), backgroundImage: 'none' } } },
    MuiCardContent: { styleOverrides: { root: { padding: num(pt.spacing.xxxl), '&:last-child': { paddingBottom: num(pt.spacing.xxxl) } } } },
  },
};

export const theme: Theme = createTheme(themeOptions);
