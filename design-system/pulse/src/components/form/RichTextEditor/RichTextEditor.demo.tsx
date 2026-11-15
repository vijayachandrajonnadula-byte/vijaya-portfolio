import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RichTextEditor, getPlainTextFromRTE } from './RichTextEditor';
import type { RichTextEditorColor, RichTextEditorType } from './RichTextEditor';
import { RichTextViewer } from './RichTextViewer';

const Label = ({ children }: { children: string }) => <Typography variant="textM" color="text.secondary">{children}</Typography>;
const sample = '<h2>Deviation summary</h2><p>Lorem Ipsum is simply dummy text of the <strong>printing</strong> and <em>typesetting</em> industry, with a <a href="https://example.com">link</a>.</p><ul><li>First point</li><li>Second point</li></ul>';

/** RichTextEditor: Types (default / compact / inline / minimal), colours, states, label left, limit, plus the viewer. */
export default function RichTextEditorDemo() {
  const [html, setHtml] = useState(sample);
  return (
    <Stack spacing={3} sx={{ maxWidth: 760 }}>
      <Label>Default, controlled, with limit</Label>
      <RichTextEditor label="Description" required value={html} onChange={setHtml} limit={500} hint="Helper text" placeholder="Write something" />
      <Label>{`Viewer (plain text length ${getPlainTextFromRTE(html).length})`}</Label>
      <RichTextViewer value={html} />
      <Label>Types</Label>
      {(['compact', 'inline', 'minimal'] as RichTextEditorType[]).map((t) => (
        <RichTextEditor key={t} type={t} label={t} defaultValue={t === 'minimal' ? '<p>Single line</p>' : sample} minHeight={80} />
      ))}
      <Label>Colours</Label>
      {(['error', 'success', 'warning'] as RichTextEditorColor[]).map((c) => (
        <RichTextEditor key={c} color={c} label={c} defaultValue="<p>Text</p>" minHeight={60} hint={c === 'error' ? 'Description is required' : undefined} />
      ))}
      <Label>Disabled / label left</Label>
      <RichTextEditor label="Disabled" disabled defaultValue="<p>Not editable</p>" minHeight={60} />
      <RichTextEditor label="Left label" labelPosition="left" defaultValue="<p>Text</p>" minHeight={60} />
    </Stack>
  );
}
