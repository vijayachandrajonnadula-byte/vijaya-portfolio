import type { Components, Theme } from '@mui/material/styles';
import { disabledOpacity, focusRing, neutral, num, pt, pulseTypography, textStyle } from './pulseTokens';

/**
 * styleOverrides for the MUI primitives the design system uses directly (no wrapper needed).
 * Every number comes from pt (pulse-designkit). Components with a Pulse-specific API
 * (Chip, Tabs, Stepper, ...) are styled inside src/components instead.
 */
const ui = pt.uiElements;
const form = pt.formElements;
const custom = pt.custom;

const inputHeight = { small: 32, medium: 40 } as const;
const fieldPadding = { small: form.padding.s, medium: form.padding.m } as const;
const fieldRadius = { small: form.commonTextField.radius.s, medium: form.commonTextField.radius.m } as const;

/** Checkbox and Radio share one colour model: border -> filled; error/success/warning variants. */
function choiceColors(set: typeof ui.checkbox.primary) {
  return {
    color: set.defaultBorder,
    '&:hover': { color: set.hoverBorder },
    '&.Mui-checked': { color: set.selectedBackground, '&:hover': { color: set.hoverSelectedBackground } },
    '&.Mui-disabled': { opacity: disabledOpacity },
  };
}

export const componentStyles: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: { ...textStyle('textL'), color: pt.formElements.content.primaryTextColor },
    },
  },

  MuiDivider: {
    styleOverrides: { root: { borderColor: ui.divider.color.defaultColor } },
  },

  MuiLink: {
    defaultProps: { underline: 'none' },
    styleOverrides: {
      root: {
        ...textStyle('textL', 'semiBold'),
        color: pt.colors.hyperlink.defaultLight,
        '&:hover': { color: pt.colors.hyperlink.hoverLight, textDecoration: 'underline' },
        '&:visited': { color: pt.colors.hyperlink.visitedLight },
      },
    },
  },

  MuiTooltip: {
    defaultProps: { arrow: false },
    styleOverrides: {
      tooltip: {
        ...textStyle('textL'),
        backgroundColor: ui.tooltip.color.black,
        color: ui.tooltip.color.white,
        borderRadius: pt.radius.xs,
        padding: `${ui.tooltip.padding.singleLine.topBottom} ${ui.tooltip.padding.singleLine.leftRight}`,
        maxWidth: ui.tooltip.sizes.singleLineMaxWidth,
      },
    },
  },

  MuiCheckbox: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: ({ ownerState }) => {
        const size = ownerState.size === 'small' ? 'small' : 'medium';
        return {
          padding: custom.checkbox.padding[size],
          ...choiceColors(ui.checkbox.primary),
          '& .MuiSvgIcon-root': { fontSize: custom.checkbox.size[size] },
          '&.Mui-focusVisible': { boxShadow: focusRing, borderRadius: custom.checkbox.border.radius[size] },
          ...(ownerState.color === 'error' && choiceColors(ui.checkbox.error)),
          ...(ownerState.color === 'success' && choiceColors(ui.checkbox.success)),
          ...(ownerState.color === 'warning' && choiceColors(ui.checkbox.warning)),
        };
      },
    },
  },

  MuiRadio: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: ({ ownerState }) => {
        const size = ownerState.size === 'small' ? 'small' : 'medium';
        return {
          padding: custom.checkbox.padding[size],
          ...choiceColors(ui.radio.primary),
          '& .MuiSvgIcon-root': { fontSize: custom.radio[size].width },
          '&.Mui-focusVisible': { boxShadow: focusRing, borderRadius: '50%' },
          ...(ownerState.color === 'error' && choiceColors(ui.radio.error)),
          ...(ownerState.color === 'success' && choiceColors(ui.radio.success)),
          ...(ownerState.color === 'warning' && choiceColors(ui.radio.warning)),
        };
      },
    },
  },

  MuiSwitch: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: ({ ownerState }) => {
        const s = ownerState.size === 'small' ? custom.switchBase.small : custom.switchBase.medium;
        const thumb = ownerState.size === 'small' ? custom.switchThumb.small : custom.switchThumb.medium;
        const inset = custom.switchBase.spacing.xxs;
        return {
          width: s.width,
          height: s.height,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: inset,
            '&.Mui-checked': {
              transform: `translateX(${s.transform})`,
              color: form.color.primary.selectedIcon,
              '& + .MuiSwitch-track': { backgroundColor: form.color.primary.selectedBackground, opacity: 1 },
              '&:hover + .MuiSwitch-track': { backgroundColor: form.color.primary.hoverSelectedBackground },
            },
            '&.Mui-focusVisible + .MuiSwitch-track': { boxShadow: focusRing },
            '&.Mui-disabled': { opacity: disabledOpacity },
          },
          '& .MuiSwitch-thumb': { width: thumb.width, height: thumb.height, boxShadow: 'none', color: pt.colors.base.white },
          '& .MuiSwitch-track': {
            borderRadius: pt.radius.full,
            backgroundColor: form.color.gray.defaultBorder,
            opacity: 1,
          },
        };
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ ownerState }) => {
        const size = ownerState.size === 'small' ? 'small' : 'medium';
        const p = fieldPadding[size];
        return {
          ...textStyle('textL'),
          minHeight: inputHeight[size],
          borderRadius: fieldRadius[size],
          backgroundColor: form.color.primary.defaultBackground,
          color: form.inputText.colour.inputValue,
          paddingLeft: p.leftRight,
          paddingRight: p.leftRight,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: form.color.primary.defaultBorder, borderWidth: form.border.xs },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: form.color.primary.hoverBorder },
          '&.Mui-focused': { boxShadow: focusRing },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: form.color.primary.focusBorder, borderWidth: form.border.xs },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: form.color.error.defaultBorder },
          '&.Mui-error:hover .MuiOutlinedInput-notchedOutline': { borderColor: form.color.error.hoverBorder },
          '&.Mui-disabled': { opacity: disabledOpacity },
          '& .MuiOutlinedInput-input': { padding: `${p.topBottom} 0`, height: 'auto', '&::placeholder': { color: pt.custom.dropdown.placeholder.color, opacity: 1 } },
          '& .MuiSelect-select.MuiOutlinedInput-input': { paddingRight: '24px !important' },
        };
      },
      multiline: { paddingTop: 0, paddingBottom: 0 },
    },
  },

  MuiInputLabel: {
    styleOverrides: { root: { ...textStyle('textL', 'medium'), color: form.label.defaultTextColor } },
  },

  MuiFormLabel: {
    styleOverrides: {
      root: { ...textStyle('textL', 'medium'), color: form.label.defaultTextColor, '&.Mui-focused': { color: form.label.defaultTextColor } },
      asterisk: { color: pt.colors.accent.red[500] },
    },
  },

  MuiFormHelperText: {
    styleOverrides: {
      root: { ...textStyle('textM'), color: form.content.secondaryTextColor, marginLeft: 0, marginRight: 0, '&.Mui-error': { color: pt.colors.accent.red[600] } },
    },
  },

  MuiFormControlLabel: {
    styleOverrides: { label: { ...textStyle('textL'), color: form.content.primaryTextColor } },
  },

  MuiMenu: {
    styleOverrides: {
      paper: {
        marginTop: custom.dropdown.paper.marginTop,
        borderRadius: custom.dropdown.paper.radius,
        boxShadow: custom.dropdown.paper.boxShadow,
        border: `1px solid ${neutral[200]}`,
      },
    },
  },

  MuiMenuItem: {
    styleOverrides: {
      root: {
        ...textStyle('textL'),
        borderRadius: custom.dropdown.list.option.borderRadius,
        margin: '2px 6px',
        minHeight: 32,
        '&:hover': { backgroundColor: custom.dropdown.list.background.hover },
        '&.Mui-selected': { backgroundColor: custom.dropdown.list.background.selected, '&:hover': { backgroundColor: custom.dropdown.list.background.selected } },
      },
    },
  },

  MuiAvatar: {
    styleOverrides: {
      root: {
        ...textStyle('textM', 'semiBold'),
        backgroundColor: ui.avatar.color.grayBackground,
        color: ui.avatar.color.grayTextIcon,
        width: ui.avatar.layout.size.small,
        height: ui.avatar.layout.size.small,
        borderRadius: ui.avatar.border.radius.full,
      },
    },
  },

  MuiBadge: {
    styleOverrides: { badge: { ...textStyle('textS', 'semiBold'), minWidth: 16, height: 16, padding: '0 4px' } },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: { height: custom.progressBar.height, borderRadius: ui.progressBar.radius.s, backgroundColor: ui.progressBar.color.defaultBaseBackground },
      bar: { borderRadius: ui.progressBar.radius.s },
    },
  },

  MuiSlider: {
    styleOverrides: {
      root: { height: num(ui.slider.size), color: ui.slider.color.defaultProgressBackground },
      rail: { backgroundColor: ui.slider.color.defaultBaseBackground, opacity: 1 },
      thumb: {
        width: 16,
        height: 16,
        backgroundColor: ui.slider.color.defaultKnobBackground,
        border: `2px solid ${ui.slider.color.defaultKnobBorder}`,
        '&:hover': { borderColor: ui.slider.color.hoverKnobBorder, boxShadow: 'none' },
        '&.Mui-focusVisible': { boxShadow: focusRing },
      },
    },
  },

  MuiAccordion: {
    defaultProps: { disableGutters: true, elevation: 0 },
    styleOverrides: {
      root: {
        border: `1px solid ${neutral[200]}`,
        borderRadius: ui.accordion.radius.m,
        '&:before': { display: 'none' },
        '&:not(:last-child)': { marginBottom: ui.accordion.padding.m },
        '&.Mui-expanded': { margin: 0, marginBottom: ui.accordion.padding.m },
      },
    },
  },

  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        ...textStyle('textXl', 'semiBold'),
        backgroundColor: ui.accordion.color.defaultBg,
        color: ui.accordion.color.defaultTextColor,
        borderRadius: ui.accordion.radius.m,
        minHeight: 40,
        padding: `0 ${ui.accordion.padding['2xl']}`,
        '&:hover': { backgroundColor: ui.accordion.color.hoverBg },
        '&.Mui-expanded': { minHeight: 40, backgroundColor: ui.accordion.color.activeBg, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
        '&.Mui-focusVisible': { boxShadow: focusRing },
      },
      content: { margin: '8px 0', '&.Mui-expanded': { margin: '8px 0' } },
    },
  },

  MuiAccordionDetails: {
    styleOverrides: { root: { padding: ui.accordion.padding['2xl'], ...textStyle('textL') } },
  },

  MuiPaper: {
    styleOverrides: { root: { backgroundImage: 'none' } },
  },

  MuiDialog: {
    styleOverrides: {
      paper: { borderRadius: ui.popup.radius.medium, border: `${custom.popup.border.width} ${custom.popup.border.style} ${ui.popup.color.border}` },
    },
  },
  MuiDialogTitle: {
    styleOverrides: { root: { ...textStyle('heading6', 'semiBold'), padding: custom.popup.header.padding } },
  },
  MuiDialogContent: {
    styleOverrides: { root: { padding: custom.popup.content.padding } },
  },
  MuiDialogActions: {
    styleOverrides: { root: { padding: custom.popup.footer.popUpPadding, gap: pt.spacing.m } },
  },
};

/** Typography for MUI's built-in variants, from Pulse text styles. */
export const muiTypography = {
  fontFamily: pulseTypography.baseFont,
  fontWeightLight: pulseTypography.weight.light300,
  fontWeightRegular: pulseTypography.weight.regular400,
  fontWeightMedium: pulseTypography.weight.medium500,
  fontWeightBold: pulseTypography.weight.bold700,
  h1: textStyle('heading1', 'semiBold'),
  h2: textStyle('heading2', 'semiBold'),
  h3: textStyle('heading3', 'semiBold'),
  h4: textStyle('heading4', 'semiBold'),
  h5: textStyle('heading5', 'semiBold'),
  h6: textStyle('heading6', 'semiBold'),
  subtitle1: textStyle('textXl', 'semiBold'),
  subtitle2: textStyle('textL', 'semiBold'),
  body1: textStyle('textL'),
  body2: textStyle('textM'),
  caption: textStyle('textS'),
  overline: { ...textStyle('textS', 'bold'), ...pulseTypography.special.Label, textTransform: 'uppercase' as const },
  // Pulse names, usable as <Typography variant="heading4">.
  displayL: textStyle('displayL', 'semiBold'),
  displayXl: textStyle('displayXl', 'semiBold'),
  heading1: textStyle('heading1', 'semiBold'),
  heading2: textStyle('heading2', 'semiBold'),
  heading3: textStyle('heading3', 'semiBold'),
  heading4: textStyle('heading4', 'semiBold'),
  heading5: textStyle('heading5', 'semiBold'),
  heading6: textStyle('heading6', 'semiBold'),
  textXl: textStyle('textXl'),
  textL: textStyle('textL'),
  textM: textStyle('textM'),
  textS: textStyle('textS'),
  label: {
    fontFamily: pulseTypography.baseFont,
    fontWeight: pulseTypography.special.Label.fontWeight,
    fontSize: pulseTypography.special.Label.fontSize,
    lineHeight: pulseTypography.special.Label.lineHeight,
    letterSpacing: pulseTypography.special.Label.letterSpacing,
    textTransform: 'uppercase' as const,
  },
};
