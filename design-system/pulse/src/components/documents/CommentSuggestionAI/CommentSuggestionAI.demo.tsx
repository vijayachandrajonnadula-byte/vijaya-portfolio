import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CommentSuggestionAI, SuggestionItem } from './CommentSuggestionAI';

/** CommentSuggestionAI: group card and item states (default / hover / focus). */
export default function CommentSuggestionAIDemo() {
  const [picked, setPicked] = useState('');
  return (
    <Stack spacing={3} sx={{ maxWidth: 420 }}>
      <Typography variant="textM" color="text.secondary">Suggestion group (click an item)</Typography>
      <CommentSuggestionAI suggestions={['Please attach the supporting batch record.', 'Looks good to me, approving.', 'Can you clarify the root cause?']} onSelect={(s) => setPicked(s)} />
      <Typography variant="textM" color="text.secondary">{picked ? `Picked: ${picked}` : 'Nothing picked yet'}</Typography>
      <Typography variant="textM" color="text.secondary">Item states: default, hover, focus</Typography>
      <SuggestionItem>Default suggestion</SuggestionItem>
      <SuggestionItem forceState="hover">Hover suggestion</SuggestionItem>
      <SuggestionItem forceState="focus">Focus suggestion</SuggestionItem>
    </Stack>
  );
}
