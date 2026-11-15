// Figma: Data Grid page, `TaskSwitcher` (Size x My Tasks/All Tasks On/Off) built from `.BuildingBlocks/TaskSwitcher`
// (Size x Type x Interaction Default/Selected/Hover/Disabled/selectedHover/selectedDisabled/Focus/SelectedFocus).
// Note: in the atom, "Type=All Tasks" is the left single-avatar segment and "Type=My Tasks" the right avatar-group
// segment, but TaskSwitcher "My Tasks=On" selects the single-avatar one, so the single avatar is "my" here.
import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/material/Box';
import { Avatar, AvatarGroup } from '../Avatar/Avatar';
import type { AvatarSize } from '../Avatar/Avatar';

export type TaskSwitcherSize = 'small' | 'medium' | 'large';
export type TaskSwitcherValue = 'my' | 'all';

export interface TaskSwitcherProps {
  /** Selected segment. */
  value: TaskSwitcherValue;
  onChange: (value: TaskSwitcherValue) => void;
  /** @default "medium" */
  size?: TaskSwitcherSize;
  disabled?: boolean;
}

const dims: Record<TaskSwitcherSize, { h: number; py: number; px: number; r: number; avatar: AvatarSize }> = {
  small: { h: 32, py: 4, px: 8, r: 6, avatar: 'xsmall' },
  medium: { h: 40, py: 8, px: 12, r: 8, avatar: 'xsmall' },
  large: { h: 44, py: 6, px: 16, r: 10, avatar: 'small' },
};
const c = { bg: '#eef3fb', border: '#d3e0f2', hover: '#e3ebf8', sel: '#1e3a6e', selHover: '#4e73a8' };
/** Default border 1px INSIDE: top/bottom plus the outer side only (the shared edge is open). */
const inset = (left: boolean) => (left ? `inset 1px 1px 0 0 ${c.border}, inset 0 -1px 0 0 ${c.border}` : `inset -1px 1px 0 0 ${c.border}, inset 0 -1px 0 0 ${c.border}`);
const focus = '0 0 0 1px #ffffff, 0 0 0 4px #3b82f6';

const people = ['AK', 'JD', 'MR', 'LS'];

/** Two-segment toggle: "My tasks" (single avatar) / "All tasks" (avatar group). */
export function TaskSwitcher({ value, onChange, size = 'medium', disabled = false }: TaskSwitcherProps) {
  const d = dims[size];
  const seg = (key: TaskSwitcherValue, label: string) => {
    const on = value === key;
    const left = key === 'my';
    return (
      <ButtonBase
        key={key}
        data-spec={`${key}-${size}`}
        disabled={disabled}
        aria-pressed={on}
        aria-label={label}
        onClick={() => onChange(key)}
        sx={{
          height: d.h,
          padding: `${d.py}px ${d.px}px`,
          borderRadius: left ? `${d.r}px 0 0 ${d.r}px` : `0 ${d.r}px ${d.r}px 0`,
          background: on ? c.sel : c.bg,
          boxShadow: on ? 'none' : inset(left),
          boxSizing: 'border-box',
          '&:hover': { background: on ? c.selHover : c.hover },
          '&.Mui-focusVisible': { boxShadow: focus },
          '&.Mui-disabled': { opacity: 0.38 },
        }}
      >
        {left ? (
          <Avatar size={d.avatar} avatarColor="blue">AK</Avatar>
        ) : (
          <Box sx={{ display: 'flex' }}>
            <AvatarGroup size={d.avatar}>
              {people.map((p, i) => <Avatar key={p} size={d.avatar} avatarColor={(['blue', 'green', 'orange', 'purple'] as const)[i % 4]}>{p}</Avatar>)}
            </AvatarGroup>
          </Box>
        )}
      </ButtonBase>
    );
  };
  return (
    <Box role="group" aria-label="Task scope" sx={{ display: 'inline-flex' }}>
      {seg('my', 'My tasks')}
      {seg('all', 'All tasks')}
    </Box>
  );
}



