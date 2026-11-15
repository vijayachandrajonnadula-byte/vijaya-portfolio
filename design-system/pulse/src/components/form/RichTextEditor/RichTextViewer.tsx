// Read-only renderer for HTML produced by RichTextEditor (same typography as the editable surface).
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { rteContentSx } from './RichTextEditor';

export interface RichTextViewerProps {
  /** HTML produced by RichTextEditor. Must come from a trusted source or be sanitised by the caller. */
  value?: string | null;
  fontSize?: string;
  sx?: SxProps<Theme>;
}

export function RichTextViewer({ value, fontSize, sx }: RichTextViewerProps) {
  return <Box data-spec="rte-viewer" sx={[{ ...rteContentSx, ...(fontSize ? { fontSize } : {}) }, ...(Array.isArray(sx) ? sx : [sx])]} dangerouslySetInnerHTML={{ __html: value ?? '' }} />;
}
