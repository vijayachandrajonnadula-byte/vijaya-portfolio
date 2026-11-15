// Figma page "Tally Counter": set "Tally Counter" (Size x Variant Default | Compact x Label Position).
import { useId } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import OutlinedInput from '@mui/material/OutlinedInput';
import AddRounded from '@mui/icons-material/AddRounded';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import RemoveRounded from '@mui/icons-material/RemoveRounded';
import { FormField } from '../../_shared/FormField';
import type { FormFieldProps } from '../../_shared/FormField';
import { fieldBorderWidth, fieldColors, fieldSizes, fieldSx } from '../../_shared/fieldStyles';
import type { FieldSize } from '../../_shared/fieldStyles';
import { disabledOpacity, focusRing, num, pt } from '../../../theme/pulseTokens';

export interface TallyCounterProps extends Omit<FormFieldProps, 'children' | 'htmlFor' | 'hintId'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** @default "medium" */
  size?: FieldSize;
  /** default: field with a stacked up / down column on the right. compact: [-] value [+]. @default "default" */
  variant?: 'default' | 'compact';
  /** Width of the default variant. @default 200 */
  width?: number | string;
  'data-spec'?: string;
}

const tc = pt.custom.tallyCounter;
const line = fieldColors.primary.border;

/** Numeric input with increment / decrement buttons. Measurements: Figma Tally Counter + pt.custom.tallyCounter. */
export function TallyCounter({ value, onChange, min = -Infinity, max = Infinity, step = 1, size = 'medium', variant = 'default', width = 200, disabled, 'data-spec': dataSpec, ...field }: TallyCounterProps) {
  const id = useId();
  const s = fieldSizes[size];
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const canInc = !disabled && value < max;
  const canDec = !disabled && value > min;
  const bw = tc.iconButton.width[size];
  const bh = num(tc.iconButton.height[size]);
  const glyph = num(tc.icon.width);
  const ariaLabel = typeof field.label === 'string' ? field.label : 'Value';

  const stepper = (dir: 1 | -1) => (
    <ButtonBase
      aria-label={dir === 1 ? 'Increase' : 'Decrease'}
      disabled={dir === 1 ? !canInc : !canDec}
      onClick={() => onChange(clamp(value + dir * step))}
      sx={{
        width: bw,
        height: bh,
        color: '#475569',
        borderBottom: dir === 1 ? `${fieldBorderWidth}px solid ${line}` : 'none',
        '&:hover': { backgroundColor: pt.colors.neutral[50] },
        '&.Mui-focusVisible': { boxShadow: focusRing, zIndex: 1 },
        '&.Mui-disabled': { opacity: disabledOpacity },
        '& svg': { fontSize: glyph },
      }}
    >
      {dir === 1 ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
    </ButtonBase>
  );

  const compactButton = (dir: 1 | -1) => (
    <ButtonBase
      aria-label={dir === 1 ? 'Increase' : 'Decrease'}
      disabled={dir === 1 ? !canInc : !canDec}
      onClick={() => onChange(clamp(value + dir * step))}
      sx={{
        width: s.h,
        height: s.h,
        flex: '0 0 auto',
        borderRadius: `${s.r}px`,
        color: '#475569',
        '&:hover': { backgroundColor: pt.colors.neutral[100] },
        '&.Mui-focusVisible': { boxShadow: focusRing },
        '&.Mui-disabled': { opacity: disabledOpacity },
        '& svg': { fontSize: s.glyph + 2 },
      }}
    >
      {dir === 1 ? <AddRounded /> : <RemoveRounded />}
    </ButtonBase>
  );

  const input = (
    <OutlinedInput
      id={id}
      type="number"
      size={size === 'small' ? 'small' : 'medium'}
      value={value}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (e.target.value !== '' && !Number.isNaN(n)) onChange(clamp(n));
      }}
      slotProps={{ input: { min, max, step, 'aria-label': ariaLabel } }}
      data-spec={dataSpec}
      sx={[
        fieldSx({ size }),
        {
          width: variant === 'compact' ? Math.max(s.h, String(value).length * 8 + 2 * s.px) : width,
          pr: variant === 'default' ? 0 : undefined,
          overflow: 'hidden',
          '& input[type=number]': { MozAppearance: 'textfield', textAlign: variant === 'compact' ? 'center' : 'left', '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 } },
          ...(variant === 'compact' && { px: `${Math.min(s.px, 8)}px` }),
        },
      ]}
      endAdornment={
        variant === 'default' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch', justifyContent: 'center', borderLeft: `1px solid ${line}`, ml: `${s.gap}px` }}>
            {stepper(1)}
            {stepper(-1)}
          </Box>
        ) : undefined
      }
    />
  );

  return (
    <FormField {...field} disabled={disabled} htmlFor={id} fullWidth={field.fullWidth ?? false}>
      {variant === 'compact' ? (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start' }}>
          {compactButton(-1)}
          {input}
          {compactButton(1)}
        </Box>
      ) : (
        input
      )}
    </FormField>
  );
}
