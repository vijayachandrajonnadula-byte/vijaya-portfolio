// Implements Figma pages "Selection Card (NEW)" (Selection Card: Default/Hover/Active/Disabled, free slot),
// "Checkbox" -> Checkbox Card and "Radio" -> RadioCard (Default/Hover/Active/Disabled/Error).
import { fw } from '../../../theme/typography';
import type { KeyboardEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Checkbox } from '../Checkbox/Checkbox';
import { Radio } from '../Radio/Radio';
import { disabledOpacity, focusRing, pt } from '../../../theme/pulseTokens';

const navy = '#1E3A6E';
const red = pt.colors.accent.red[500];
const font = "'Inter Variable', Inter, sans-serif";

/* ---------- Selection Card: generic selectable surface ---------- */
export interface SelectionCardProps {
  /** Active state: 2px navy border. */
  selected?: boolean;
  disabled?: boolean;
  /** Click / Enter / Space. */
  onSelect?: () => void;
  /** Free content slot. */
  children?: ReactNode;
  /** Card width in px (spec 320). Omit for fill. */
  width?: number | string;
  /** Use `checkbox` / `radio` when the card is part of a multi / single choice group. @default "button" */
  role?: 'button' | 'checkbox' | 'radio';
  ariaLabel?: string;
  /** Extra class, e.g. is-hover to pin the hover look. */
  className?: string;
}

/** Interactive surface for any content. Border 1px #e2e8f0, hover #cbd5e1, active 2px navy, disabled 38%. */
export function SelectionCard({ selected, disabled, onSelect, children, width = 320, role = 'button', ariaLabel, className }: SelectionCardProps) {
  const key = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) onSelect?.();
    }
  };
  return (
    <Box
      role={role}
      className={className}
      tabIndex={disabled ? -1 : 0}
      aria-checked={role === 'button' ? undefined : !!selected}
      aria-pressed={role === 'button' ? !!selected : undefined}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      onClick={() => !disabled && onSelect?.()}
      onKeyDown={key}
      data-spec={selected ? 'selection card active' : 'selection card'}
      sx={{
        boxSizing: 'border-box',
        width,
        p: '12px 16px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        border: `${selected ? 2 : 1}px solid ${selected ? navy : pt.colors.neutral[200]}`, // spec: Active is a 2px border (strokes count in the layout)
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? disabledOpacity : 1,
        outline: 'none',
        transition: 'border-color 120ms',
        '&:hover, &.is-hover': disabled || selected ? {} : { borderColor: pt.colors.neutral[300] },
        '&:focus-visible': { boxShadow: focusRing },
      }}
    >
      {children}
    </Box>
  );
}

/* ---------- Checkbox Card / Radio Card ---------- */
interface ChoiceCardBase {
  label: ReactNode;
  /** Helper text under the label. */
  description?: ReactNode;
  /** Optional leading icon (16px). */
  icon?: ReactNode;
  disabled?: boolean;
  /** Red border plus message below the card. */
  error?: boolean;
  errorMessage?: ReactNode;
  /** Card width in px (spec 240). @default 240 */
  width?: number | string;
  /** Extra class, e.g. is-hover to pin the hover look. */
  className?: string;
}

function CardFrame({ className, icon, label, description, error, errorMessage, disabled, width = 240, control }: ChoiceCardBase & { control: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', width, opacity: disabled ? disabledOpacity : 1 }}>
      <Box
        component="label"
        className={className}
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          minHeight: 64,
          p: '8px 16px 12px',
          borderRadius: '4px',
          border: `1px solid ${error ? red : '#D3E0F2'}`,
          backgroundColor: 'rgba(255,255,255,0.03)',
          cursor: disabled ? 'default' : 'pointer',
          transition: 'border-color 120ms, box-shadow 120ms',
          '&:hover, &.is-hover': disabled ? {} : { borderColor: error ? red : '#B5C9E7', boxShadow: '0 0 4px rgba(0,0,0,0.2)' },
          '&:has(input:checked)': { borderColor: error ? red : navy },
          '&:has(input:focus-visible)': { boxShadow: focusRing },
        }}
      >
        {icon != null && <Box component="span" sx={{ display: 'flex', alignItems: 'center', height: 32, color: pt.colors.neutral[600], '& svg': { width: 16, height: 16, fontSize: 16 } }}>{icon}</Box>}
        <Box component="span" sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', pt: '6px' }}>
          <Box component="span" sx={{ fontFamily: font, fontSize: 12, lineHeight: '20px', fontWeight: fw.medium, color: pt.colors.neutral[900] }}>{label}</Box>
          {description != null && <Box component="span" sx={{ fontFamily: font, fontSize: 10, lineHeight: '18px', color: pt.colors.neutral[500] }}>{description}</Box>}
        </Box>
        <Box component="span" sx={{ display: 'flex', mr: '-9px', mt: 0 }}>{control}</Box>
      </Box>
      {error && errorMessage != null && <Box sx={{ px: '16px', fontFamily: font, fontSize: 12, lineHeight: '20px', color: pt.colors.accent.red[600] }}>{errorMessage}</Box>}
    </Box>
  );
}

export interface CheckboxCardProps extends ChoiceCardBase {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
}

/** Card with a checkbox on the right; the whole card is the click target. */
export function CheckboxCard({ checked, defaultChecked, onChange, name, value, ...card }: CheckboxCardProps) {
  return (
    <CardFrame
      {...card}
      control={<Checkbox name={name} value={value} checked={checked} defaultChecked={defaultChecked} disabled={card.disabled} error={card.error} onChange={(_, v) => onChange?.(v)} />}
    />
  );
}

export interface RadioCardProps extends ChoiceCardBase {
  /** Value inside a `RadioGroup`. */
  value: string;
  checked?: boolean;
  onChange?: () => void;
  name?: string;
}

/** Card with a radio on the right. Use inside a `RadioGroup` (or pass `checked`). */
export function RadioCard({ value, checked, onChange, name, ...card }: RadioCardProps) {
  return <CardFrame {...card} control={<Radio value={value} name={name} checked={checked} disabled={card.disabled} error={card.error} onChange={() => onChange?.()} />} />;
}

