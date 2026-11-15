import type { Meta, StoryObj } from '@storybook/react-vite';
import Stack from '@mui/material/Stack';
import { Button } from './Button';
import { RhombusIcon } from '../../../icons';

const VARIANTS = ['contained', 'outlined', 'text'] as const;
const COLORS = ['primary', 'error', 'success', 'warning', 'ai'] as const;
const SIZES = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button', variant: 'contained', color: 'primary', size: 'medium' },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    color: { control: 'select', options: COLORS },
    size: { control: 'inline-radio', options: SIZES },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Variant x colour matrix (Figma: Variant, Color). */
export const VariantsAndColors: Story = {
  render: (args) => (
    <Stack spacing={2}>
      {VARIANTS.map((variant) => (
        <Stack key={variant} direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {COLORS.map((color) => (
            <Button key={color} {...args} variant={variant} color={color}>
              {color}
            </Button>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      {SIZES.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </Stack>
  ),
};

/** Disabled is a prop; hover and focus are real interaction states (tab to a button to see focus). */
export const States: Story = {
  render: (args) => (
    <Stack direction="row" spacing={2}>
      {VARIANTS.map((variant) => (
        <Stack key={variant} spacing={2}>
          <Button {...args} variant={variant}>Default</Button>
          <Button {...args} variant={variant} disabled>Disabled</Button>
        </Stack>
      ))}
    </Stack>
  ),
};

export const Icons: Story = {
  render: ({ children: _label, ...args }) => (
    <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
      <Button {...args} startIcon={<RhombusIcon />}>Left icon</Button>
      <Button {...args} endIcon={<RhombusIcon />}>Right icon</Button>
      <Button {...args} startIcon={<RhombusIcon />} endIcon={<RhombusIcon />}>Both</Button>
      <Button {...args} startIcon={<RhombusIcon />} aria-label="Icon only" />
    </Stack>
  ),
};

export const Loading: Story = { args: { loading: true } };
