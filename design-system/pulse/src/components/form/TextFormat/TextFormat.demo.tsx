import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { FieldLabel, MetaData, ReadOnlyValue, TextContent, TextHeading, TextLink } from './TextFormat';
import type { MetaDataColor, TextHeadingVariant } from './TextFormat';
import { Caption, Section } from '../../_shared/ForceState';

/** Figma "TextFormat": label, read-only value, headings, content, metadata, hyperlink. */
export default function TextFormatDemo() {
  return (
    <Stack spacing={4}>
      <Section title="Label (textLabel)">
        <Stack direction="row" useFlexGap sx={{ gap: 4, flexWrap: 'wrap' }}>
          <FieldLabel>Label Value</FieldLabel>
          <FieldLabel required>Label Value</FieldLabel>
          <FieldLabel allCaps>Label Value</FieldLabel>
          <FieldLabel allCaps required>Label Value</FieldLabel>
          <Box sx={{ width: 120 }}><FieldLabel multiline required>Label value that wraps onto two lines</FieldLabel></Box>
        </Stack>
      </Section>
      <Section title="Value, read only (textInputValueReadOnly)">
        <Stack direction="row" useFlexGap sx={{ gap: 4 }}>
          <Box sx={{ width: 200 }}><ReadOnlyValue>Single line value</ReadOnlyValue></Box>
          <Box sx={{ width: 200 }}><ReadOnlyValue multiline>Multi line value that continues past the first line of the box</ReadOnlyValue></Box>
        </Stack>
      </Section>
      <Section title="Headings (textHeading)">
        <Stack spacing={1}>
          {(['main', 'sub1', 'sub2', 'sub3', 'section'] as TextHeadingVariant[]).map((v) => (
            <TextHeading key={v} variant={v}>{v === 'main' ? 'Main Heading' : v === 'section' ? 'Section Heading' : `Sub Heading ${v.slice(3)}`}</TextHeading>
          ))}
        </Stack>
      </Section>
      <Section title="Content (textContent)">
        <Stack direction="row" useFlexGap sx={{ gap: 6, flexWrap: 'wrap' }}>
          {(['primary', 'secondary', 'metaData'] as const).map((v) => (
            <Stack key={v}>
              <Caption>{v}</Caption>
              {(['regular', 'medium', 'semiBold', 'bold'] as const).map((w) => (
                <TextContent key={w} variant={v} weight={w}>{`${v} ${w}`}</TextContent>
              ))}
            </Stack>
          ))}
        </Stack>
      </Section>
      <Section title="Metadata (textMetaData)">
        <Stack direction="row" useFlexGap sx={{ gap: 6 }}>
          {(['body', 'title'] as const).map((w) => (
            <Stack key={w}>
              <Caption>{w}</Caption>
              {(['green', 'orange', 'red', 'grey', 'blue'] as MetaDataColor[]).map((c) => (
                <MetaData key={c} color={c} weight={w}>{`Metadata ${c}`}</MetaData>
              ))}
            </Stack>
          ))}
        </Stack>
      </Section>
      <Section title="Hyperlink (textLink)">
        <Stack direction="row" useFlexGap sx={{ gap: 4 }}>
          <Box sx={{ p: 2, bgcolor: '#ffffff', border: '1px solid #e2e8f0' }}><TextLink href="#x">Hyperlink (hover to underline)</TextLink></Box>
          <Box sx={{ p: 2, bgcolor: '#1e3a6e' }}><TextLink tone="light" href="#x">Hyperlink on dark</TextLink></Box>
        </Stack>
      </Section>
    </Stack>
  );
}
