/**
 * NOT FROM FIGMA. Compact rich text editor of the Electronic Execution execution panel, sized and coloured from the
 * reference prototype (measured at 1440x900): 1.5px border, radius 9, 2px halo, two-row wrapping toolbar (controls 22px high,
 * buttons 24x22), dashed editing area, footer strip. Built on Tiptap like RichTextEditor. Logged in docs/figma-deviations.md.
 *
 * Working controls: bold, italic, underline, strike, lists, alignment, sub/superscript, text colour, symbols.
 * Font and size apply to the editing surface only (not saved in the HTML). "Writing tools" is shown but inactive in this sample.
 */
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { EditorContent, useEditor, Extension, Mark, mergeAttributes } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Box from '@mui/material/Box';
import { panelRole } from '../../../theme/typography';

/** Colours "from the reference prototype". */
const c = {
  ink: '#0A0D2E',
  muted: '#8A96A8',
  line: '#DFE5EB',
  line2: '#F4F7FB',
  tint: '#EAF0F8',
  blue3: '#2F5496',
  blue4: '#3D6BB5',
  blue5: '#7DA3D6',
  navy: '#1E3A6E',
  areaBg: '#FCFDFF',
  writing: '#7C3AED',
  writingBg: '#F5F3FF',
  placeholder: '#9AA6BF',
};

const SubMark = Mark.create({
  name: 'subscriptMark',
  excludes: 'superscriptMark',
  parseHTML: () => [{ tag: 'sub' }],
  renderHTML: ({ HTMLAttributes }) => ['sub', mergeAttributes(HTMLAttributes), 0],
});
const SupMark = Mark.create({
  name: 'superscriptMark',
  excludes: 'subscriptMark',
  parseHTML: () => [{ tag: 'sup' }],
  renderHTML: ({ HTMLAttributes }) => ['sup', mergeAttributes(HTMLAttributes), 0],
});
const ColorMark = Mark.create({
  name: 'textColor',
  addAttributes: () => ({
    color: {
      default: null,
      parseHTML: (el: HTMLElement) => el.style.color || null,
      renderHTML: (a: Record<string, unknown>) => (a.color ? { style: `color:${String(a.color)}` } : {}),
    },
  }),
  parseHTML: () => [{ tag: 'span', getAttrs: (el: HTMLElement | string) => (typeof el !== 'string' && el.style.color ? {} : false) }],
  renderHTML: ({ HTMLAttributes }) => ['span', mergeAttributes(HTMLAttributes), 0],
});
const AlignExt = Extension.create({
  name: 'textAlignAttr',
  addGlobalAttributes: () => [
    {
      types: ['paragraph', 'heading'],
      attributes: {
        textAlign: {
          default: null,
          parseHTML: (el: HTMLElement) => el.style.textAlign || null,
          renderHTML: (a: Record<string, unknown>) => (a.textAlign ? { style: `text-align:${String(a.textAlign)}` } : {}),
        },
      },
    },
  ],
});

const FONTS = ['Inter', 'Arial', 'Georgia', 'Courier New'];
const SIZES = ['10', '11', '12', '13', '14', '16'];
const SYMBOLS = ['°', '±', '≤', '≥', 'µ', 'Ω', '≠', '≈', '→', '×'];

const selSx = {
  height: 22,
  boxSizing: 'border-box',
  px: '6px',
  borderRadius: '4px',
  bgcolor: '#fff',
  color: c.ink,
  fontSize: 10.5,
  fontWeight: panelRole.emphasis,
  border: `1px solid ${c.line2}`,
  fontFamily: 'inherit',
  cursor: 'pointer',
  lineHeight: 'normal',
} as const;

const btnSx = {
  width: 24,
  height: 22,
  boxSizing: 'border-box',
  display: 'grid',
  placeItems: 'center',
  p: '1px 6px',
  m: 0,
  border: 0,
  borderRadius: '4px',
  bgcolor: 'transparent',
  color: c.muted,
  fontSize: 11,
  fontFamily: 'inherit',
  lineHeight: 'normal',
  cursor: 'pointer',
  '&:hover': { bgcolor: c.tint, color: c.blue3 },
  '&[aria-pressed="true"]': { bgcolor: c.tint, color: c.blue3 },
  '& sup, & sub': { fontSize: 7 },
  '& svg': { display: 'block' },
} as const;

const Div = () => <Box component="span" role="separator" aria-orientation="vertical" sx={{ display: 'block', width: '1px', height: 16, bgcolor: c.line, m: '0 3px', flexShrink: 0 }} />;

const Grp = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '1px', bgcolor: '#fff', borderRadius: '6px', p: '1px', border: `1px solid ${c.line2}`, boxSizing: 'border-box' }}>{children}</Box>
);

function Btn({ label, pressed, onClick, children }: { label: string; pressed?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Box component="button" type="button" title={label} aria-label={label} aria-pressed={pressed} onMouseDown={(e: React.MouseEvent) => e.preventDefault()} onClick={onClick} sx={btnSx}>
      {children}
    </Box>
  );
}

const alignIcon = (a: 'left' | 'center' | 'right' | 'justify') => {
  const base = [18, 12, 18, 12];
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {base.map((len, i) => {
        const l = a === 'justify' ? 18 : len;
        const x1 = a === 'left' || a === 'justify' ? 3 : a === 'right' ? 21 - l : 12 - l / 2;
        return <line key={i} x1={x1} y1={5 + i * 4.7} x2={x1 + l} y2={5 + i * 4.7} />;
      })}
    </svg>
  );
};
const listIcon = (ordered: boolean) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    {[6, 12, 18].map((y) => (
      <line key={y} x1="9" y1={y} x2="21" y2={y} />
    ))}
    {ordered ? [6, 12, 18].map((y, i) => <text key={y} x="2" y={y + 2} fontSize="6" fill="currentColor" stroke="none">{i + 1}</text>) : [6, 12, 18].map((y) => <circle key={y} cx="4" cy={y} r="1.4" fill="currentColor" stroke="none" />)}
  </svg>
);

function Toolbar({ editor, font, size, onFont, onSize }: { editor: Editor; font: string; size: string; onFont: (v: string) => void; onSize: (v: string) => void }) {
  const run = () => editor.chain().focus();
  const align = (a: string) => run().updateAttributes('paragraph', { textAlign: a }).run();
  return (
    <Box
      role="toolbar"
      aria-label="Text formatting"
      data-spec="exrte-toolbar"
      sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1px', p: '4px 5px', borderBottom: `1px solid ${c.line2}`, background: `linear-gradient(180deg,#fff,${c.line2})` }}
    >
      <Box component="select" aria-label="Font" value={font} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFont(e.target.value)} sx={{ ...selSx, width: 78 }}>
        <option value="">Font</option>
        {FONTS.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </Box>
      <Box component="select" aria-label="Font size" value={size} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSize(e.target.value)} sx={{ ...selSx, width: 52 }}>
        <option value="">Size</option>
        {SIZES.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </Box>
      <Box component="label" title="Text colour" sx={{ display: 'inline-flex', alignItems: 'center', gap: '2px', height: 22, p: '0 3px', boxSizing: 'border-box', border: `1px solid ${c.line2}`, borderRadius: '4px', bgcolor: '#fff', cursor: 'pointer', position: 'relative' }}>
        <Box component="span" sx={{ fontSize: 11, fontWeight: panelRole.heavy, color: c.ink, borderBottom: `2px solid ${c.navy}`, lineHeight: 1, p: '0 1px' }}>A</Box>
        <Box component="input" type="color" aria-label="Text colour" defaultValue="#1e3a6e" onChange={(e: React.ChangeEvent<HTMLInputElement>) => run().setMark('textColor', { color: e.target.value }).run()} sx={{ width: 16, height: 16, border: 0, bgcolor: 'transparent', p: 0, cursor: 'pointer' }} />
      </Box>
      <Div />
      <Grp>
        <Btn label="Bold" pressed={editor.isActive('bold')} onClick={() => run().toggleBold().run()}><b>B</b></Btn>
        <Btn label="Italic" pressed={editor.isActive('italic')} onClick={() => run().toggleItalic().run()}><i>I</i></Btn>
        <Btn label="Underline" pressed={editor.isActive('underline')} onClick={() => run().toggleUnderline().run()}><u>U</u></Btn>
        <Btn label="Strikethrough" pressed={editor.isActive('strike')} onClick={() => run().toggleStrike().run()}><s>S</s></Btn>
      </Grp>
      <Div />
      <Grp>
        <Btn label="Bulleted list" pressed={editor.isActive('bulletList')} onClick={() => run().toggleBulletList().run()}>{listIcon(false)}</Btn>
        <Btn label="Numbered list" pressed={editor.isActive('orderedList')} onClick={() => run().toggleOrderedList().run()}>{listIcon(true)}</Btn>
      </Grp>
      <Div />
      <Grp>
        <Btn label="Align left" onClick={() => align('left')}>{alignIcon('left')}</Btn>
        <Btn label="Align centre" onClick={() => align('center')}>{alignIcon('center')}</Btn>
        <Btn label="Align right" onClick={() => align('right')}>{alignIcon('right')}</Btn>
        <Btn label="Justify" onClick={() => align('justify')}>{alignIcon('justify')}</Btn>
      </Grp>
      <Div />
      <Grp>
        <Btn label="Subscript" pressed={editor.isActive('subscriptMark')} onClick={() => run().toggleMark('subscriptMark').run()}>X<sub>2</sub></Btn>
        <Btn label="Superscript" pressed={editor.isActive('superscriptMark')} onClick={() => run().toggleMark('superscriptMark').run()}>X<sup>2</sup></Btn>
      </Grp>
      <Box
        component="select"
        aria-label="Symbols"
        value=""
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          if (e.target.value) run().insertContent(e.target.value).run();
        }}
        sx={{ ...selSx, width: 92 }}
      >
        <option value="">Ω Symbols</option>
        {SYMBOLS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Box>
      <Div />
      <Box component="button" type="button" aria-label="Writing tools (not available in this sample)" title="Writing tools (not available in this sample)" aria-disabled sx={{ ...btnSx, color: c.writing, '&:hover': { bgcolor: c.writingBg, color: c.writing }, cursor: 'default' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      </Box>
    </Box>
  );
}

export interface ExecutionRichTextProps {
  /** HTML. */
  value?: string;
  onChange?: (html: string) => void;
  /** Recorded / spectator: tinted, toolbar at half opacity, not editable. */
  readOnly?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  /** Font size of the editing area in px (reference: 12; 11 when docked top or bottom). */
  areaFontSize?: number;
  /** Min height of the editing area in px (reference: 64; 46 when docked bottom). */
  areaMinHeight?: number;
  /** Replaces the editing area (and, with `hideToolbar`, the toolbar): used for control steps and the Reason for Edit tab. */
  area?: ReactNode;
  hideToolbar?: boolean;
  /** Footer strip content (reference: "Auto-saved · 2 sec ago"). */
  meta?: ReactNode;
}

export function ExecutionRichText({ value = '', onChange, readOnly, placeholder, ariaLabel = 'Rich text', areaFontSize = 12, areaMinHeight = 64, area, hideToolbar, meta }: ExecutionRichTextProps) {
  const [font, setFont] = useState('');
  const [size, setSize] = useState('');
  const extensions = useMemo(() => [StarterKit.configure({ link: { openOnClick: false } }), SubMark, SupMark, ColorMark, AlignExt, Placeholder.configure({ placeholder: placeholder ?? '' })], [placeholder]);
  const editor = useEditor({
    extensions,
    content: value,
    editable: !readOnly,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor: ed }) => onChange?.(ed.isEmpty ? '' : ed.getHTML()),
    editorProps: { attributes: { 'aria-label': ariaLabel, 'aria-multiline': 'true' } },
  });
  useEffect(() => {
    editor?.setEditable(!readOnly);
  }, [editor, readOnly]);
  useEffect(() => {
    if (editor && value !== (editor.isEmpty ? '' : editor.getHTML())) editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  const areaBg = readOnly ? c.line2 : c.areaBg;
  return (
    <Box
      data-spec="exrte"
      sx={{
        boxSizing: 'border-box',
        border: `1.5px solid ${c.blue5}`,
        borderRadius: '9px',
        bgcolor: readOnly ? c.line2 : '#fff',
        boxShadow: readOnly ? 'none' : `0 0 0 2px ${c.tint}`,
        '&:focus-within': { borderColor: c.blue3, borderWidth: '2px' },
      }}
    >
      {!hideToolbar && editor && (
        <Box sx={readOnly ? { opacity: 0.5, pointerEvents: 'none' } : undefined}>
          <Toolbar editor={editor} font={font} size={size} onFont={setFont} onSize={setSize} />
        </Box>
      )}
      <Box
        data-spec="exrte-area"
        sx={{
          display: area ? 'none' : 'block',
          boxSizing: 'border-box',
          m: '5px',
          p: '9px 11px',
          minHeight: areaMinHeight,
          border: `1px dashed ${c.tint}`,
          borderRadius: '6px',
          bgcolor: areaBg,
          color: readOnly ? c.muted : c.ink,
          fontSize: size ? Number(size) : areaFontSize,
          fontFamily: font || 'inherit',
          lineHeight: 1.5,
          wordBreak: 'break-word',
          cursor: readOnly ? 'default' : 'text',
          '&:focus-within': { bgcolor: '#fff', borderStyle: 'solid', borderColor: c.blue4 },
          '& .tiptap': { outline: 'none', minHeight: areaMinHeight - 20 },
          '& .tiptap p': { m: '0 0 4px' },
          '& .tiptap ul, & .tiptap ol': { m: '2px 0', pl: '20px' },
          '& .tiptap li': { m: 0 },
          '& .tiptap p.is-editor-empty:first-of-type::before': { content: 'attr(data-placeholder)', color: c.placeholder, float: 'left', height: 0, pointerEvents: 'none', fontStyle: 'italic' },
        }}
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} />
      </Box>
      {area}
      <Box sx={{ display: 'flex', alignItems: 'center', p: '5px 7px', borderTop: `1px solid ${c.line2}`, bgcolor: c.line2, borderRadius: '0 0 8px 8px' }}>
        <Box component="span" sx={{ fontSize: 10, color: c.muted, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', '& b': { fontWeight: panelRole.strong } }}>
          {meta}
        </Box>
      </Box>
    </Box>
  );
}
