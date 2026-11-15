import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from './Button';
import { ButtonGroup, StyledButtonGroup } from './ButtonGroup';
import { AdornmentButton } from './AdornmentButton';
import { CloseButton } from './CloseButton';
import { RhombusIcon } from '../../../icons';

const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
const colors = ['primary', 'error', 'success', 'warning', 'ai'] as const;

/**
 * Button page: Button (variant x colour x size, disabled, icons), ButtonGroup (split), StyledButtonGroup,
 * AdornmentButton and CloseButton. Hover/focus are live (hover a button, tab to it); `Mui-focusVisible` rows show the focus ring statically.
 */
export default function ButtonDemo() {
  return (
    <Stack spacing={3}>
      {(['contained', 'outlined', 'text'] as const).map((variant) => (
        <Stack key={variant} spacing={1}>
          <Typography variant="textM" color="text.secondary">{variant}</Typography>
          <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
            {colors.map((color) => (
              <Button key={color} variant={variant} color={color} startIcon={<RhombusIcon />}>{color}</Button>
            ))}
            <Button variant={variant} disabled>Disabled</Button>
            <Button variant={variant} className="Mui-focusVisible">Focus</Button>
          </Stack>
        </Stack>
      ))}
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
        {sizes.map((size) => (
          <Button key={size} size={size} data-spec={`button ${size}`}>{size}</Button>
        ))}
      </Stack>

      <Typography variant="textM" color="text.secondary">ButtonGroup (split button)</Typography>
      {(['primary', 'secondary'] as const).map((v) => (
        <Stack key={v} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="textS" sx={{ width: 70 }}>{v}</Typography>
          {sizes.map((s) => <ButtonGroup key={s} variant={v} size={s}>Button</ButtonGroup>)}
          <ButtonGroup variant={v} disabled>Disabled</ButtonGroup>
        </Stack>
      ))}
      <StyledButtonGroup>
        <Button variant="outlined">One</Button><Button variant="outlined">Two</Button><Button variant="outlined">Three</Button>
      </StyledButtonGroup>

      <Typography variant="textM" color="text.secondary">AdornmentButton (size x variant x shape) and CloseButton</Typography>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', p: 1 }}>
        {(['xxs', 'xs', 's'] as const).map((s) => (
          <Stack key={s} direction="row" spacing={1}>
            <AdornmentButton size={s} variant="dark" shape="circle" />
            <AdornmentButton size={s} variant="dark" shape="square" />
            <AdornmentButton size={s} variant="dark" shape="circle" disabled />
            <Stack sx={{ bgcolor: '#1e3a6e', p: 0.5, flexDirection: 'row', gap: 1 }}>
              <AdornmentButton size={s} variant="light" shape="circle" />
              <AdornmentButton size={s} variant="light" shape="square" />
            </Stack>
          </Stack>
        ))}
        <CloseButton size="xsmall" />
        <CloseButton />
      </Stack>
    </Stack>
  );
}
