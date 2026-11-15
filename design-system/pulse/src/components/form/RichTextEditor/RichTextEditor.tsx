// Implements Figma page "Rich Text Editor": RichTextEditor (Label Position Top | Left) over building block/RichTextEditorBase
// (Type Default | Compact | Inline | Minimal, Color Primary | Error | Success | Warning, Interaction Default | Hover | Focus | Disabled).
// Built on Tiptap (StarterKit incl. link + underline, Placeholder).
import { useEffect, useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popover from '@mui/material/Popover';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import FormatBoldRounded from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRounded from '@mui/icons-material/FormatItalicRounded';
import FormatUnderlinedRounded from '@mui/icons-material/FormatUnderlinedRounded';
import StrikethroughSRounded from '@mui/icons-material/StrikethroughSRounded';
import FormatListBulletedRounded from '@mui/icons-material/FormatListBulletedRounded';
import FormatListNumberedRounded from '@mui/icons-material/FormatListNumberedRounded';
import FormatQuoteRounded from '@mui/icons-material/FormatQuoteRounded';
import CodeRounded from '@mui/icons-material/CodeRounded';
import LinkRounded from '@mui/icons-material/LinkRounded';
import UndoRounded from '@mui/icons-material/UndoRounded';
import RedoRounded from '@mui/icons-material/RedoRounded';
import FormatClearRounded from '@mui/icons-material/FormatClearRounded';
import { EditorContent, useEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '../../actions/Button/Button';
import { IconButton } from '../../actions/IconButton/IconButton';
import { disabledOpacity, focusRing, pt, textStyle } from '../../../theme/pulseTokens';
import { fieldColors, fieldFocusBorder } from '../../_shared/fieldStyles';

export type RichTextEditorType = 'default' | 'compact' | 'inline' | 'minimal';
export type RichTextEditorColor = 'primary' | 'error' | 'success' | 'warning';
export type RichTextToolbarItem = 'heading' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'strike' | 'bulletList' | 'orderedList' | 'blockquote' | 'code' | 'link' | 'undo' | 'redo' | 'clear';

export interface RichTextEditorProps {
  label?: ReactNode;
  /** @default "top" */
  labelPosition?: 'top' | 'left';
  required?: boolean;
  hint?: ReactNode;
  /** HTML string (controlled). */
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  /** Figma "Type". `mode` is the name the Pulse app uses. @default "default" */
  type?: RichTextEditorType;
  mode?: RichTextEditorType;
  /** Figma "Color" (border colour). @default "primary" */
  color?: RichTextEditorColor;
  /** Accepted for API compatibility with the Pulse app; height comes from `minHeight`. */
  size?: 'small' | 'medium' | 'large';
  resize?: boolean;
  /** Character limit; a counter is shown at the bottom right. */
  limit?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  /** Toolbar items, in order; "|" inserts a divider. Defaults depend on `type`. */
  toolbarMenus?: (RichTextToolbarItem | '|')[];
  defaultFontFamily?: string;
  defaultFontSize?: string;
  /** Editable area min height in px (Figma default 160). */
  minHeight?: number;
}

const DEFAULTS: Record<RichTextEditorType, (RichTextToolbarItem | '|')[]> = {
  default: ['heading', 'fontSize', '|', 'bold', 'italic', 'underline', 'strike', '|', 'bulletList', 'orderedList', '|', 'blockquote', 'code', 'link', '|', 'undo', 'redo', '|', 'clear'],
  compact: ['heading', '|', 'bold', 'italic', 'underline', '|', 'bulletList', 'orderedList', 'link'],
  inline: ['heading', 'fontSize', '|', 'bold', 'italic', 'underline', 'strike', '|', 'bulletList', 'orderedList', '|', 'link'],
  minimal: ['bold', 'italic', 'underline', '|', 'heading'],
};

// Border colours as drawn in the .fig (the design-kit JSON has stale values, e.g. warning = blue): default / hover per colour, focus is always navy.
const borderFor = (color: RichTextEditorColor, state: 'defaultBorder' | 'hoverBorder' | 'focusBorder') => (state === 'focusBorder' ? fieldFocusBorder : state === 'hoverBorder' ? fieldColors[color].hover : fieldColors[color].border);

/** Plain text of an HTML string (used for counters, previews and validation). */
export function getPlainTextFromRTE(html?: string | null): string {
  if (!html) return '';
  const withBreaks = html.replace(/<\/(p|div|h[1-6]|li|blockquote|pre)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n');
  let text: string;
  if (typeof document !== 'undefined') {
    const el = document.createElement('div');
    el.innerHTML = withBreaks;
    text = el.textContent ?? '';
  } else {
    text = withBreaks.replace(/<[^>]*>/g, '');
  }
  return text.replace(/Â /g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

/** Typography of the editable surface / viewer content. */
export const rteContentSx = {
  ...textStyle('textL'),
  color: 'text.primary',
  wordBreak: 'break-word' as const,
  '& p': { m: 0, mb: '8px', '&:last-child': { mb: 0 } },
  '& h1': { ...textStyle('heading3'), m: '0 0 8px' },
  '& h2': { ...textStyle('heading4'), m: '0 0 8px' },
  '& h3': { ...textStyle('heading5'), m: '0 0 8px' },
  '& ul, & ol': { m: '0 0 8px', pl: '24px' },
  '& blockquote': { m: '0 0 8px', pl: '12px', borderLeft: `3px solid ${pt.uiElements.RTE.Color.quotesColor}`, color: 'text.secondary' },
  '& code': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.92em', bgcolor: pt.uiElements.RTE.Color.backgroundColor, px: '4px', borderRadius: '4px' },
  '& pre': { bgcolor: pt.uiElements.RTE.Color.backgroundColor, p: '8px 12px', borderRadius: '4px', overflowX: 'auto', '& code': { bgcolor: 'transparent', p: 0 } },
  '& a': { color: pt.colors.brand['700'] ?? 'primary.main', textDecoration: 'underline' },
  '& hr': { border: 0, borderTop: 1, borderColor: 'divider' },
} as const;

const Divider = () => <Box role="separator" aria-orientation="vertical" sx={{ width: '1px', height: 16, bgcolor: 'divider', mx: '2px', flexShrink: 0 }} />;

function ToolButton({ label, active, disabled, onClick, children }: { label: string; active?: boolean; disabled?: boolean; onClick: (el: HTMLElement) => void; children: ReactNode }) {
  return (
    <Box sx={{ display: 'inline-flex', borderRadius: '4px', bgcolor: active ? 'action.selected' : 'transparent' }}>
      <IconButton ariaLabel={label} size="xsmall" disabled={disabled} onClick={(e) => onClick(e.currentTarget)}>
        {children}
      </IconButton>
    </Box>
  );
}

function Dropdown({ label, text, width, options, disabled }: { label: string; text: string; width?: number; options: { label: string; onPick: () => void; selected?: boolean }[]; disabled?: boolean }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <Box
        component="button"
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ ...textStyle('textL'), display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', height: 24, minWidth: width, p: '0 0 0 8px', border: 0, borderRadius: '4px', bgcolor: 'transparent', color: 'text.primary', cursor: 'pointer', '&:hover:not(:disabled)': { bgcolor: pt.uiElements.datePicker.color.cellHover }, '&:focus-visible': { outline: 'none', boxShadow: focusRing } }}
      >
        {text}
        <KeyboardArrowDownRounded sx={{ fontSize: 16, mr: '4px' }} />
      </Box>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        {options.map((o) => (
          <MenuItem key={o.label} selected={o.selected} onClick={() => { o.onPick(); setAnchor(null); }}>
            {o.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

const FONT_SIZES = ['10px', '12px', '14px', '16px', '18px', '24px'];

function Toolbar({ editor, items, fontSize, onFontSize, disabled, inline, plain }: { editor: Editor; items: (RichTextToolbarItem | '|')[]; fontSize: string; onFontSize: (s: string) => void; disabled?: boolean; inline?: boolean; plain?: boolean }) {
  const [linkAnchor, setLinkAnchor] = useState<HTMLElement | null>(null);
  const [url, setUrl] = useState('');
  const headingText = editor.isActive('heading', { level: 1 }) ? 'Heading 1' : editor.isActive('heading', { level: 2 }) ? 'Heading 2' : editor.isActive('heading', { level: 3 }) ? 'Heading 3' : 'Paragraph';
  const run = () => editor.chain().focus();

  const render = (it: RichTextToolbarItem | '|', i: number) => {
    switch (it) {
      case '|': return <Divider key={`d${i}`} />;
      case 'heading':
        return (
          <Dropdown key={it} label="Text style" text={headingText} width={88} disabled={disabled} options={[
            { label: 'Paragraph', onPick: () => run().setParagraph().run(), selected: headingText === 'Paragraph' },
            { label: 'Heading 1', onPick: () => run().toggleHeading({ level: 1 }).run(), selected: headingText === 'Heading 1' },
            { label: 'Heading 2', onPick: () => run().toggleHeading({ level: 2 }).run(), selected: headingText === 'Heading 2' },
            { label: 'Heading 3', onPick: () => run().toggleHeading({ level: 3 }).run(), selected: headingText === 'Heading 3' },
          ]} />
        );
      case 'fontSize':
        return <Dropdown key={it} label="Font size" text={String(parseInt(fontSize, 10))} width={53} disabled={disabled} options={FONT_SIZES.map((s) => ({ label: String(parseInt(s, 10)), onPick: () => onFontSize(s), selected: s === fontSize }))} />;
      case 'bold': return <ToolButton key={it} label="Bold" active={editor.isActive('bold')} disabled={disabled} onClick={() => run().toggleBold().run()}><FormatBoldRounded sx={{ fontSize: 16 }} /></ToolButton>;
      case 'italic': return <ToolButton key={it} label="Italic" active={editor.isActive('italic')} disabled={disabled} onClick={() => run().toggleItalic().run()}><FormatItalicRounded sx={{ fontSize: 16 }} /></ToolButton>;
      case 'underline': return <ToolButton key={it} label="Underline" active={editor.isActive('underline')} disabled={disabled} onClick={() => run().toggleUnderline().run()}><FormatUnderlinedRounded sx={{ fontSize: 16 }} /></ToolButton>;
      case 'strike': return <ToolButton key={it} label="Strikethrough" active={editor.isActive('strike')} disabled={disabled} onClick={() => run().toggleStrike().run()}><StrikethroughSRounded sx={{ fontSize: 16 }} /></ToolButton>;
      case 'bulletList': return <ToolButton key={it} label="Bulleted list" active={editor.isActive('bulletList')} disabled={disabled} onClick={() => run().toggleBulletList().run()}><FormatListBulletedRounded sx={{ fontSize: 16 }} /></ToolButton>;
      case 'orderedList': return <ToolButton key={it} label="Numbered list" active={editor.isActive('orderedList')} disabled={disabled} onClick={() => run().toggleOrderedList().run()}><FormatListNumberedRounded sx={{ fontSize: 16 }} /></ToolButton>;
      case 'blockquote': return <ToolButton key={it} label="Quote" active={editor.isActive('blockquote')} disabled={disabled} onClick={() => run().toggleBlockquote().run()}><FormatQuoteRounded sx={{ fontSize: 16 }} /></ToolButton>;
      case 'code': return <ToolButton key={it} label="Code" active={editor.isActive('code')} disabled={disabled} onClick={() => run().toggleCode().run()}><CodeRounded sx={{ fontSize: 16 }} /></ToolButton>;
      case 'link':
        return (
          <ToolButton key={it} label="Link" active={editor.isActive('link')} disabled={disabled} onClick={(el) => {
            setUrl((editor.getAttributes('link').href as string | undefined) ?? '');
            setLinkAnchor(el);
          }}>
            <LinkRounded sx={{ fontSize: 16 }} />
          </ToolButton>
        );
      case 'undo': return <ToolButton key={it} label="Undo" disabled={disabled || !editor.can().undo()} onClick={() => run().undo().run()}><UndoRounded sx={{ fontSize: 16 }} /></ToolButton>;
      case 'redo': return <ToolButton key={it} label="Redo" disabled={disabled || !editor.can().redo()} onClick={() => run().redo().run()}><RedoRounded sx={{ fontSize: 16 }} /></ToolButton>;
      case 'clear': return <ToolButton key={it} label="Clear formatting" disabled={disabled} onClick={() => run().unsetAllMarks().clearNodes().run()}><FormatClearRounded sx={{ fontSize: 16 }} /></ToolButton>;
    }
  };

  const applyLink = () => {
    if (url.trim()) editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
    else editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkAnchor(null);
  };

  return (
    <Box
      role="toolbar"
      aria-label="Text formatting"
      data-spec="rte-toolbar"
      sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', minHeight: 32, boxSizing: 'border-box', p: '4px 8px', bgcolor: plain ? 'transparent' : pt.uiElements.RTE.Color.backgroundColor, ...(plain ? { p: 0, minHeight: 24, flexWrap: 'nowrap' } : {}), borderRadius: inline ? `${pt.uiElements.RTE.radius.s} ${pt.uiElements.RTE.radius.s} 0 0` : undefined }}
    >
      {items.map(render)}
      <Popover open={!!linkAnchor} anchorEl={linkAnchor} onClose={() => setLinkAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box sx={{ p: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <OutlinedInput size="small" autoFocus placeholder="https://" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyLink()} inputProps={{ 'aria-label': 'Link URL' }} sx={{ width: 240 }} />
          <Button size="small" onClick={applyLink}>Apply</Button>
        </Box>
      </Popover>
    </Box>
  );
}

/** Rich text editor (HTML in / HTML out). */
export function RichTextEditor({
  label, labelPosition = 'top', required, hint, value, defaultValue = '', onChange, type, mode, color = 'primary', limit, placeholder, disabled, error, toolbarMenus, defaultFontFamily, defaultFontSize = '14px', minHeight = 160,
}: RichTextEditorProps) {
  const kind: RichTextEditorType = type ?? mode ?? 'default';
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const tone: RichTextEditorColor = error ? 'error' : color;
  const items = toolbarMenus ?? DEFAULTS[kind];
  const minimal = kind === 'minimal';

  const extensions = useMemo(() => [StarterKit.configure({ link: { openOnClick: false, autolink: true } }), Placeholder.configure({ placeholder: placeholder ?? '' })], [placeholder]);
  const editor = useEditor({
    extensions,
    content: value ?? defaultValue,
    editable: !disabled,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor: ed }) => onChange?.(ed.isEmpty ? '' : ed.getHTML()),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    editorProps: {
      attributes: { id, 'aria-label': typeof label === 'string' ? label : 'Rich text editor', 'aria-multiline': String(!minimal) },
      handleTextInput: (view) => (limit != null && view.state.doc.textContent.length >= limit ? true : false),
      handleKeyDown: (_v, e) => (minimal && e.key === 'Enter' ? true : false),
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);
  useEffect(() => {
    if (editor && value !== undefined && value !== (editor.isEmpty ? '' : editor.getHTML())) editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  const count = editor ? editor.getText().length : 0;
  const over = limit != null && count > limit;
  const left = labelPosition === 'left';
  const borderColor = focused ? borderFor(tone, 'focusBorder') : hovered && !disabled ? borderFor(tone, 'hoverBorder') : borderFor(tone, 'defaultBorder');
  const showToolbar = kind !== 'inline' || focused;

  const surface = (
    <Box
      sx={{
        ...rteContentSx,
        fontSize,
        fontFamily: defaultFontFamily ?? rteContentSx.fontFamily,
        flex: 1,
        minWidth: 0,
        boxSizing: 'border-box',
        p: minimal ? '0' : '8px 12px',
        minHeight: minimal ? 20 : minHeight,
        bgcolor: pt.formElements.color.primary.defaultBackground,
        cursor: disabled ? 'default' : 'text',
        '& .tiptap': { outline: 'none', minHeight: minimal ? 20 : minHeight - 16, ...(minimal ? { whiteSpace: 'nowrap', overflow: 'hidden' } : {}) },
        '& .tiptap p.is-editor-empty:first-of-type::before': { content: 'attr(data-placeholder)', color: pt.custom.dropdown.placeholder.color, float: 'left', height: 0, pointerEvents: 'none' },
      }}
      onClick={() => editor?.commands.focus()}
    >
      <EditorContent editor={editor} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: left ? 'row' : 'column', gap: left ? '12px' : '4px', width: '100%', alignItems: left ? 'flex-start' : 'stretch' }}>
      {label != null && (
        <FormLabel htmlFor={id} required={required} error={error} disabled={disabled} sx={{ width: left ? 120 : undefined, flexShrink: 0 }}>
          {label}
        </FormLabel>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          data-spec={`rte-${kind}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          sx={{
            position: 'relative',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: minimal ? 'row' : 'column',
            alignItems: minimal ? 'center' : 'stretch',
            gap: minimal ? '8px' : 0,
            minHeight: minimal ? 32 : undefined,
            p: minimal ? '4px 8px' : 0,
            borderRadius: minimal ? pt.uiElements.RTE.radius.s : pt.uiElements.RTE.radius.m,
            bgcolor: pt.formElements.color.primary.defaultBackground,
            boxShadow: focused ? focusRing : 'none',
            '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', border: `1.5px solid ${borderColor}`, pointerEvents: 'none' },
            opacity: disabled ? disabledOpacity : 1,
            pointerEvents: disabled ? 'none' : undefined,
            overflow: 'hidden',
          }}
        >
          {editor && !minimal && showToolbar && <Toolbar editor={editor} items={items} fontSize={fontSize} onFontSize={setFontSize} disabled={disabled} inline={kind === 'inline'} />}
          {surface}
          {editor && minimal && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Toolbar editor={editor} items={items} fontSize={fontSize} onFontSize={setFontSize} disabled={disabled} />
            </Box>
          )}
        </Box>
        {(hint != null || limit != null) && (
          <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'space-between', mt: pt.spacing.xs }}>
            <FormHelperText error={error || tone === 'error'} sx={{ m: 0, flex: 1 }}>{hint}</FormHelperText>
            {limit != null && (
              <Box sx={{ ...textStyle('textL'), color: over ? 'error.main' : 'text.secondary', whiteSpace: 'nowrap' }} aria-live="polite">
                {count}/{limit}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

/** Building blocks shared with DocumentToolbar. */
export { Dropdown as ToolbarDropdown, Divider as ToolbarDivider, ToolButton as ToolbarButton };
