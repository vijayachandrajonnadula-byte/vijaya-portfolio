import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconButton } from './IconButton';
import { RhombusIcon } from '../../../icons';

const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
const colors = ['primary', 'error', 'success', 'warning', 'ai'] as const;

/** IconButton: variant x colour x size x shape, Active (plain), badge, disabled. */
export default function IconButtonDemo() {
  return (
    <Stack spacing={2}>
      {(['contained', 'outlined', 'plain'] as const).map((variant) =>
        (['square', 'circle'] as const).map((shape) => (
          <Stack key={variant + shape} spacing={1}>
            <Typography variant="textS">{variant} {shape}</Typography>
            {colors.map((color) => (
              <Stack key={color} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                {sizes.map((size) => (
                  <IconButton key={size} ariaLabel={`${color} ${size}`} variant={variant} shape={shape} color={color} size={size}>
                    <RhombusIcon />
                  </IconButton>
                ))}
                <IconButton ariaLabel="disabled" variant={variant} shape={shape} color={color} disabled><RhombusIcon /></IconButton>
                {variant === 'plain' && <IconButton ariaLabel="active" variant="plain" shape={shape} color={color} active><RhombusIcon /></IconButton>}
                <IconButton ariaLabel="badge" variant={variant} shape={shape} color={color} badge><RhombusIcon /></IconButton>
              </Stack>
            ))}
          </Stack>
        )),
      )}
    </Stack>
  );
}

