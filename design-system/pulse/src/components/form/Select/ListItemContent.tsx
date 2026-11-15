// Content of Figma BuildingBlocks/ListItem (checkbox, colour, avatar, left icon, title, metadata, chips, right icon),
// for lists that are not an MUI Select (Autocomplete, bordered dropdowns, country code).
import Box from '@mui/material/Box';
import { Checkbox } from '../Checkbox/Checkbox';
import { Chip } from '../../data-display/Chip/Chip';
import { textStyle } from '../../../theme/pulseTokens';
import type { SelectOption } from './Select';

export function ListItemContent({ option, multiple, selected }: { option: SelectOption; multiple?: boolean; selected?: boolean }) {
  const withMeta = option.metadata != null;
  return (
    <>
      {option.indent ? <Box component="span" sx={{ flex: `0 0 ${16 * option.indent}px` }} /> : null}
      {multiple && <Checkbox size="small" tabIndex={-1} checked={!!selected} disabled={option.disabled} sx={{ width: 14, p: '9px 0' }} />}
      {option.color && <Box component="span" sx={{ width: 20, height: 20, borderRadius: '4px', backgroundColor: option.color, flex: '0 0 20px' }} />}
      {option.avatar != null && <Box component="span" sx={{ display: 'inline-flex', flex: '0 0 24px' }}>{option.avatar}</Box>}
      {option.icon != null && <Box component="span" sx={{ display: 'inline-flex', flex: '0 0 16px', '& svg': { fontSize: 16 } }}>{option.icon}</Box>}
      <Box component="span" sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', py: withMeta ? 0 : '6px' }}>
        <span>{option.label}</span>
        {withMeta && <Box component="span" sx={{ ...textStyle('textS'), color: '#566680' }}>{option.metadata}</Box>}
      </Box>
      {option.chips?.map((c) => <Chip key={c} label={c} color="default" size="xxsmall" />)}
      {option.rightIcon != null && <Box component="span" sx={{ display: 'inline-flex', flex: '0 0 18px', '& svg': { fontSize: 18 } }}>{option.rightIcon}</Box>}
    </>
  );
}
