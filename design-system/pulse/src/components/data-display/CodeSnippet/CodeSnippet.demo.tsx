import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CodeSnippet } from './CodeSnippet';

const Label = ({ children }: { children: string }) => <Typography variant="textM" color="text.secondary">{children}</Typography>;

const short = 'npm install @pulse/designkit';
const medium = `// Create a theme and render a button
import { createTheme } from '@mui/material/styles';

const theme = createTheme({ palette: { mode: 'light' } });
export function App() {
  const count = 42;
  return <Button variant="contained">Save {count}</Button>;
}
`;
const long = Array.from({ length: 24 }, (_, i) => `const row${i + 1} = ${i + 1}; // line ${i + 1}`).join('\n');

/** CodeSnippet: Single / Multi / Expanded, line indicator yes / no, states default / hover / focus / disabled. */
export default function CodeSnippetDemo() {
  return (
    <Stack spacing={2.5} sx={{ maxWidth: 560 }}>
      <Label>Single line</Label>
      <CodeSnippet variation="singleLine" code={short} />
      <CodeSnippet variation="singleLine" code={short} forceState="hover" />
      <CodeSnippet variation="singleLine" code={short} forceState="focus" />
      <CodeSnippet variation="singleLine" code={short} disabled />
      <Label>Multi line, with line numbers and Show More</Label>
      <CodeSnippet code={medium} lineNumbers language="app.tsx" />
      <Label>Multi line, without line numbers (hover / focus / disabled)</Label>
      <CodeSnippet code={medium} forceState="hover" />
      <CodeSnippet code={medium} forceState="focus" />
      <CodeSnippet code={medium} disabled />
      <Label>Expanded, with and without line numbers</Label>
      <CodeSnippet variation="expanded" lineNumbers code={long} language="rows.js" />
      <CodeSnippet variation="expanded" code={long} />
    </Stack>
  );
}
