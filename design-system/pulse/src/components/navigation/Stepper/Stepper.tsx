// Implements Figma page "Stepper": sets "Stepper" (Direction x Text Position), "Building Blocks/stepper-circles" (State x Text Position), ".stepper-connector".
import { fw } from '../../../theme/typography';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CheckRounded from '@mui/icons-material/CheckRounded';
import { Button } from '../../actions/Button/Button';
import { useState } from 'react';
import { disabledOpacity, focusRing, pt, textStyle } from '../../../theme/pulseTokens';

export interface StepperStep {
  /** Step title (Figma textStepperTitle). The Pulse app passes this as subtitle; both work. */
  label?: string;
  subtitle?: string;
  /** Meta data line above the title, e.g. Step 1 (Figma textMetaData). */
  metadata?: string;
  /** Overrides the state derived from ctiveStep. */
  status?: 'completed' | 'active' | 'pending' | 'disabled';
  disabled?: boolean;
  icon?: ReactNode;
}

export interface StepperStatusText {
  active: string;
  completed: string;
  pending: string;
  disabled: string;
}

export interface StepperProps {
  steps: StepperStep[];
  /** Index of the current step. Steps before it are completed. */
  activeStep: number;
  /** @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  /** What the circle shows for non-completed steps. @default "number" */
  stepType?: 'number' | 'tick';
  /** default: filled green completed circle. outlined: green ring with a green tick. @default "default" */
  variant?: 'outlined' | 'default';
  /** Print "In Progress" / "Completed" ... under each label. @default true */
  showStatusText?: boolean;
  statusObject?: StepperStatusText;
  /** Makes steps clickable. Receives the clicked index. */
  onStepClick?: (stepIndex: number) => void;
  /** "right": label beside the circle. "bottom": label under the circle. @default "right" */
  contentAlignment?: 'right' | 'bottom';
  /** Shows at most this many steps; hidden ones collapse into +N buttons at the ends (Figma Button Left/Right/Top/Bottom). */
  maxSteps?: number;
}

const defaultStatus: StepperStatusText = { active: 'In Progress', completed: 'Completed', pending: 'Pending', disabled: 'Disabled' };

type State = 'completed' | 'active' | 'pending' | 'disabled';

// Figma colours (uiElements/stepper/*)
const NOT_STARTED = '#d3e0f2';
const ACTIVE_BULLET = '#1e3a6e';
const ACTIVE_RING = '#e2e8f0';
const COMPLETED = '#22c55e';
const NUM_TEXT = '#5f6f86';
const STATUS_COLOR: Record<State, string> = { active: '#02216e', completed: '#15803d', pending: '#5f6f86', disabled: '#5f6f86' };

const tick = <CheckRounded sx={{ fontSize: 16 }} />;

/** Multi-step progress indicator. Circle 32 (28 + 2px ring), connector 2px x 80 (horizontal) / 32 x 80+ (vertical), gap 8. */
export function Stepper({ steps, activeStep, orientation = 'horizontal', stepType = 'number', variant = 'default', showStatusText = true, statusObject = defaultStatus, onStepClick, contentAlignment = 'right', maxSteps }: StepperProps) {
  const [start, setStart] = useState(0);
  const total = steps.length;
  const windowSize = maxSteps && maxSteps > 0 && maxSteps < total ? maxSteps : total;
  const from = Math.min(start, total - windowSize);
  const hiddenBefore = from;
  const hiddenAfter = total - from - windowSize;
  const shown = steps.map((s, i) => ({ s, i })).slice(from, from + windowSize);
  const overflow = (n: number, dir: 'prev' | 'next') => (
    <Button variant="outlined" size="small" data-spec="stepper overflow" aria-label={`${n} ${dir === 'prev' ? 'earlier' : 'later'} steps`} onClick={() => setStart(dir === 'prev' ? Math.max(0, from - windowSize) : Math.min(total - windowSize, from + windowSize))} sx={{ alignSelf: 'center', flexShrink: 0 }}>+{n}</Button>
  );
  const vertical = orientation === 'vertical';
  const bottom = contentAlignment === 'bottom';
  const stateOf = (i: number, s: StepperStep): State => (s.disabled ? 'disabled' : s.status ? s.status : i < activeStep ? 'completed' : i === activeStep ? 'active' : 'pending');
  const numberText = { fontFamily: pt.typographyStyles.textS.regular.fontFamily, fontSize: 10, lineHeight: '18px', fontWeight: fw.regular };

  const bullet = (i: number, state: State, s: StepperStep) => {
    const inner = s.icon ?? (stepType === 'tick' ? tick : i + 1);
    const ring = { width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' as const, flexShrink: 0, ...numberText };
    let body: ReactNode;
    if (state === 'completed') {
      body = variant === 'outlined'
        ? <Box sx={{ ...ring, border: `2px solid ${COMPLETED}`, color: COMPLETED }}>{tick}</Box>
        : <Box sx={{ ...ring, background: COMPLETED, color: '#fff' }}>{tick}</Box>;
    } else if (state === 'active') {
      body = (
        <Box sx={{ ...ring, background: pt.colors.base.white, border: `2px solid ${ACTIVE_RING}` }}>
          <Box sx={{ ...ring, background: ACTIVE_BULLET, color: '#fff' }}>{inner}</Box>
        </Box>
      );
    } else {
      body = <Box sx={{ ...ring, border: `2px solid ${NOT_STARTED}`, color: NUM_TEXT }}>{inner}</Box>;
    }
    return <Box data-spec="stepper circle" sx={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{body}</Box>;
  };

  const connector = (completed: boolean) => (
    <Box
      aria-hidden
      data-spec="stepper connector"
      sx={vertical ? { width: 32, minHeight: 80, flex: 1, position: 'relative', '&::after': { content: '""', position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, background: completed ? COMPLETED : pt.uiElements.stepper.line.notStartedLine } } : { width: 80, flexShrink: 0, height: bottom ? 32 : 32, position: 'relative', '&::after': { content: '""', position: 'absolute', left: 1, right: 1, top: 15, height: 2, background: completed ? COMPLETED : pt.uiElements.stepper.line.notStartedLine } }}
    />
  );

  return (
    <Box component="ol" sx={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: vertical && bottom ? 'center' : 'flex-start', gap: '8px', listStyle: 'none', m: 0, p: 0, width: vertical ? 'fit-content' : '100%' }}>
      {hiddenBefore > 0 && <Box component="li" sx={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: '8px' }}>{overflow(hiddenBefore, 'prev')}</Box>}
      {shown.map(({ s, i }) => {
        const state = stateOf(i, s);
        const last = i === total - 1 || (i === from + windowSize - 1 && hiddenAfter > 0);
        const clickable = Boolean(onStepClick) && state !== 'disabled';
        return (
          <Box component="li" key={`${s.label}-${i}`} aria-current={state === 'active' ? 'step' : undefined} sx={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: vertical ? (bottom ? 'center' : 'flex-start') : 'flex-start', gap: '8px', flex: vertical && !last ? 1 : undefined }}>
            <ButtonBase
              disabled={!clickable}
              onClick={() => onStepClick?.(i)}
              sx={{
                gap: '8px',
                alignItems: bottom ? 'center' : 'flex-start',
                flexDirection: bottom ? 'column' : 'row',
                textAlign: bottom ? 'center' : 'left',
                borderRadius: pt.radius.m,
                opacity: state === 'disabled' ? disabledOpacity : 1,
                cursor: clickable ? 'pointer' : 'default',
                '&.Mui-focusVisible': { boxShadow: focusRing, '& [data-spec="stepper circle"] div': { fontWeight: fw.semiBold } },
                '&.Mui-disabled': { pointerEvents: 'none' },
              }}
            >
              {bullet(i, state, s)}
              <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: bottom ? undefined : 32 }}>
                {s.metadata && <Box data-spec="stepper metadata" sx={{ fontFamily: 'Figtree, sans-serif', fontSize: 14, lineHeight: '20px', color: NUM_TEXT }}>{s.metadata}</Box>}
                {(s.label ?? s.subtitle) && <Box sx={{ fontFamily: 'Inter, sans-serif', fontSize: 12, lineHeight: '20px', fontWeight: state === 'pending' || state === 'disabled' ? fw.medium : fw.semiBold, color: '#0f172a' }}>{s.label ?? s.subtitle}</Box>}
                {showStatusText && <Box sx={{ ...textStyle('textS', 'regular'), color: STATUS_COLOR[state] }}>{statusObject[state]}</Box>}
              </Box>
            </ButtonBase>
            {!last && connector(i < activeStep)}
          </Box>
        );
      })}
      {hiddenAfter > 0 && <Box component="li" sx={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: '8px' }}>{overflow(hiddenAfter, 'next')}</Box>}
    </Box>
  );
}



