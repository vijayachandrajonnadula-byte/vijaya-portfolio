import { useState } from 'react';
import type { ReactElement } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormatAlignCenterRounded from '@mui/icons-material/FormatAlignCenterRounded';
import FormatAlignJustifyRounded from '@mui/icons-material/FormatAlignJustifyRounded';
import FormatAlignLeftRounded from '@mui/icons-material/FormatAlignLeftRounded';
import FormatAlignRightRounded from '@mui/icons-material/FormatAlignRightRounded';
import FormatBoldRounded from '@mui/icons-material/FormatBoldRounded';
import FormatColorTextRounded from '@mui/icons-material/FormatColorTextRounded';
import FormatItalicRounded from '@mui/icons-material/FormatItalicRounded';
import FormatListBulletedRounded from '@mui/icons-material/FormatListBulletedRounded';
import FormatListNumberedRounded from '@mui/icons-material/FormatListNumberedRounded';
import FormatUnderlinedRounded from '@mui/icons-material/FormatUnderlinedRounded';
import StrikethroughSRounded from '@mui/icons-material/StrikethroughSRounded';
import BorderColorOutlined from '@mui/icons-material/BorderColorOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import LinkRounded from '@mui/icons-material/LinkRounded';
import TableChartOutlined from '@mui/icons-material/TableChartOutlined';
import UndoRounded from '@mui/icons-material/UndoRounded';
import RedoRounded from '@mui/icons-material/RedoRounded';
import ViewSidebarOutlined from '@mui/icons-material/ViewSidebarOutlined';
import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import FormatIndentIncreaseRounded from '@mui/icons-material/FormatIndentIncreaseRounded';
import FormatIndentDecreaseRounded from '@mui/icons-material/FormatIndentDecreaseRounded';
import FormatQuoteRounded from '@mui/icons-material/FormatQuoteRounded';
import HorizontalRuleRounded from '@mui/icons-material/HorizontalRuleRounded';
import FormatClearRounded from '@mui/icons-material/FormatClearRounded';
import CodeRounded from '@mui/icons-material/CodeRounded';
import { Button } from '../../actions/Button/Button';
import { DocumentToolbar } from './DocumentToolbar';
import type { DocumentToolbarItem } from './DocumentToolbar';

const sm = { fontSize: 16 };
const btn = (id: string, label: string, icon: ReactElement): DocumentToolbarItem => ({ id, label, icon });
const div: DocumentToolbarItem = { type: 'divider' };

// Group structure follows the Figma "Document Toolbar" (1 | 2 | 2 dropdowns | 4 | 2 | 6 | 4 | 2 | 3 | 1). The file stores
// the buttons as plain icon-button instances without glyph names, so these icons are a demo choice.
const items: DocumentToolbarItem[] = [
  btn('outline', 'Toggle outline panel', <ViewSidebarOutlined sx={sm} />), div,
  btn('undo', 'Undo', <UndoRounded sx={sm} />), btn('redo', 'Redo', <RedoRounded sx={sm} />), div,
  { type: 'dropdown', id: 'style', label: 'Text style', value: 'Paragraph', width: 88, options: ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3'] },
  { type: 'dropdown', id: 'fontSize', label: 'Font size', value: '12', width: 53, options: ['10', '11', '12', '14', '16', '18', '24'] }, div,
  btn('bold', 'Bold', <FormatBoldRounded sx={sm} />), btn('italic', 'Italic', <FormatItalicRounded sx={sm} />), btn('underline', 'Underline', <FormatUnderlinedRounded sx={sm} />), btn('strike', 'Strikethrough', <StrikethroughSRounded sx={sm} />), div,
  btn('textColor', 'Text colour', <FormatColorTextRounded sx={sm} />), btn('highlight', 'Highlight', <BorderColorOutlined sx={sm} />), div,
  btn('bulletList', 'Bulleted list', <FormatListBulletedRounded sx={sm} />), btn('orderedList', 'Numbered list', <FormatListNumberedRounded sx={sm} />), btn('indent', 'Increase indent', <FormatIndentIncreaseRounded sx={sm} />), btn('outdent', 'Decrease indent', <FormatIndentDecreaseRounded sx={sm} />), btn('quote', 'Quote', <FormatQuoteRounded sx={sm} />), btn('code', 'Code', <CodeRounded sx={sm} />), div,
  btn('alignLeft', 'Align left', <FormatAlignLeftRounded sx={sm} />), btn('alignCenter', 'Align centre', <FormatAlignCenterRounded sx={sm} />), btn('alignRight', 'Align right', <FormatAlignRightRounded sx={sm} />), btn('alignJustify', 'Justify', <FormatAlignJustifyRounded sx={sm} />), div,
  btn('link', 'Insert link', <LinkRounded sx={sm} />), btn('image', 'Insert image', <ImageOutlined sx={sm} />), div,
  btn('table', 'Insert table', <TableChartOutlined sx={sm} />), btn('rule', 'Horizontal rule', <HorizontalRuleRounded sx={sm} />), btn('clear', 'Clear formatting', <FormatClearRounded sx={sm} />), div,
  btn('comments', 'Toggle comments panel', <ChatBubbleOutlineRounded sx={sm} />),
];
/** DocumentToolbar: full bar with toggles and a trailing slot, wrapped (narrow), disabled. */
export default function DocumentToolbarDemo() {
  const [active, setActive] = useState<string[]>(['bold']);
  const toggle = (id: string) => setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  return (
    <Stack spacing={3}>
      <Typography variant="textM" color="text.secondary">Default (click the buttons to toggle)</Typography>
      <DocumentToolbar items={items} activeIds={active} onAction={toggle} slot={<Button size="small">Share</Button>} />
      <Typography variant="textM" color="text.secondary">Wrapped in a narrow container</Typography>
      <div style={{ width: 420 }}><DocumentToolbar items={items} activeIds={active} onAction={toggle} /></div>
      <Typography variant="textM" color="text.secondary">Disabled</Typography>
      <DocumentToolbar items={items} disabled />
    </Stack>
  );
}


