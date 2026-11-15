import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Chip } from './Chip';
import type { ChipColor } from './Chip';
import { RhombusIcon } from '../../../icons';

const colors: ChipColor[] = ['default', 'gray', 'dark_gray', 'blue', 'green', 'orange', 'red', 'brand', 'ai', 'purple', 'cyan', 'teal'];

/** Chip: size x shape x style x 12 colours; clickable (hover/focus), badge, adornments, delete, disabled. */
export default function ChipDemo() {
  return (
    <Stack spacing={2}>
      {(['xxsmall', 'xsmall', 'small'] as const).map((size) =>
        (['pill', 'rectangle'] as const).map((shape) =>
          (['stroke', 'fill'] as const).map((variant) => (
            <Stack key={`${size}${shape}${variant}`} direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              <Typography variant="textS" sx={{ width: 150 }}>{size} {shape} {variant}</Typography>
              {colors.filter((c) => variant === 'stroke' || c !== 'default').map((c) => <Chip key={c} label={c} color={c} size={size} shape={shape} variant={variant} onClick={() => undefined} />)}
            </Stack>
          )),
        ),
      )}
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <Chip label="Badge" color="green" showBadge size="small" />
        <Chip label="Icon" color="blue" startAdornment={<RhombusIcon />} size="small" />
        <Chip label="Dropdown" color="gray" showDropdown size="small" />
        <Chip label="Dropdown + close" color="blue" showDropdown onDelete={() => undefined} size="small" />
        <Chip label="Deletable" color="brand" onDelete={() => undefined} size="small" />
        <Chip label="Deletable" color="red" onDelete={() => undefined} size="xxsmall" />
        <Chip label="Light stroke" color="gray" variant="strokeLight" showBadge />
        <Chip label="Extra padding" color="gray" variant="strokeExtraPadding" />
        <Chip label="Custom" customColors={{ color: '#7c2d12', bgColor: '#ffedd5' }} />
        <Chip label="Disabled" color="blue" disabled onClick={() => undefined} />
      </Stack>
    </Stack>
  );
}


