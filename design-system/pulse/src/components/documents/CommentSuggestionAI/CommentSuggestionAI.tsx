// Implements Figma page "Comment Suggestion AI": Suggestion Group (AI gradient card, 8/12 padding, title row with AI icon)
// containing buildingBlock/SuggestionItem (Interaction Default | Hover | Focus).
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import { pt, textStyle } from '../../../theme/pulseTokens';

const g = pt.colors.gradient;
// Figma paints these two gradients at 45deg (families.ts uses 135deg for buttons/chips).
const ai45 = `linear-gradient(45deg, ${g.gradient1.stop1} 0%, ${g.gradient1.stop2} 50%, ${g.gradient1.stop3} 100%)`;
const aiSoft45 = `linear-gradient(45deg, ${g.gradient1XLight.stop1} 0%, ${g.gradient1XLight.stop2} 50%, ${g.gradient1XLight.stop3} 100%)`;
const AI_ICON = '#24899f';

export interface SuggestionItemProps {
  children: ReactNode;
  onClick?: () => void;
  /** Force the hover look (docs only). */
  forceState?: 'hover' | 'focus';
  disabled?: boolean;
}

/** One suggestion: white card with a soft gradient stroke, strong gradient stroke on hover, focus ring on keyboard focus. */
export function SuggestionItem({ children, onClick, forceState, disabled }: SuggestionItemProps) {
  const hover = { background: `linear-gradient(#fff, #fff) padding-box, ${ai45} border-box` };
  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      data-spec="suggestion-item"
      sx={{
        ...textStyle('textL'),
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
        minHeight: 38,
        textAlign: 'left',
        p: '8px 12px',
        borderRadius: '4px',
        border: '1px solid transparent',
        color: 'text.primary',
        background: `linear-gradient(#fff, #fff) padding-box, ${aiSoft45} border-box`,
        '&:hover': hover,
        '&.Mui-focusVisible': { boxShadow: '0 0 0 1px #fff, 0 0 0 3px #3b82f6' },
        ...(forceState === 'hover' ? hover : {}),
        ...(forceState === 'focus' ? { boxShadow: '0 0 0 1px #fff, 0 0 0 3px #3b82f6' } : {}),
      }}
    >
      {children}
    </ButtonBase>
  );
}

export interface CommentSuggestionAIProps {
  /** @default "AI Suggestions" */
  title?: ReactNode;
  suggestions: string[];
  onSelect?: (suggestion: string, index: number) => void;
  /** Width in px. @default 400 (Figma) */
  width?: number | string;
}

/** AI suggestion card: a titled group of clickable suggestion items. */
export function CommentSuggestionAI({ title = 'AI Suggestions', suggestions, onSelect, width = 400 }: CommentSuggestionAIProps) {
  return (
    <Box
      role="group"
      aria-label="AI comment suggestions"
      data-spec="suggestion-group"
      sx={{ width, maxWidth: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '8px', p: '8px 12px', borderRadius: '4px', border: '1px solid transparent', background: `${aiSoft45} padding-box, ${ai45} border-box` }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <AutoAwesomeRounded aria-hidden sx={{ fontSize: 16, color: AI_ICON }} />
        <Box sx={{ ...textStyle('textL', 'semiBold'), color: pt.colors.neutral['900'] }}>{title}</Box>
      </Box>
      {suggestions.map((s, i) => (
        <SuggestionItem key={i} onClick={() => onSelect?.(s, i)}>
          {s}
        </SuggestionItem>
      ))}
    </Box>
  );
}
