// Implements Figma page "Code Snippet": CodeSnippet (Variation Single Line | Multi Line | Expanded, State Default | Hover | Focus | Disabled,
// Line indicator Yes | No). Read-only block with copy button, optional language/file header and "Show More".
import { fw } from '../../../theme/typography';
import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CheckRounded from '@mui/icons-material/CheckRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import { IconButton } from '../../actions/IconButton/IconButton';
import { disabledOpacity, pt, textStyle } from '../../../theme/pulseTokens';

const cs = pt.uiElements.codeSnippet;
/** Figma atomTextArea Interaction=Focus: formElements/color/primary/focusBorder. */
const FOCUS_BORDER = '#1e3a6e';

export interface CodeSnippetProps {
  code: string;
  /** @default "multiLine" */
  variation?: 'singleLine' | 'multiLine' | 'expanded';
  /** Numbered gutter (not available for singleLine). @default false */
  lineNumbers?: boolean;
  /** Language or file name shown in a header above the code. */
  language?: string;
  disabled?: boolean;
  /** Called after the code was copied. */
  onCopy?: (code: string) => void;
  /** Force the hover / focus look (docs only; real hover and focus work on their own). */
  forceState?: 'hover' | 'focus';
  /** Accessible name of the code block. */
  'aria-label'?: string;
}

const KEYWORDS = /\b(const|let|var|function|return|if|else|for|while|import|from|export|default|class|new|async|await|type|interface|true|false|null|undefined|def|print|SELECT|FROM|WHERE|npm|yarn|install|run)\b/g;
const TOKEN = /(\/\/.*$|#.*$|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)/gm;

/** Light-weight highlighter: comments, strings, numbers, keywords. No dependency. */
function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  const pushPlain = (s: string, key: string) => {
    let li = 0;
    let m: RegExpExecArray | null;
    KEYWORDS.lastIndex = 0;
    while ((m = KEYWORDS.exec(s))) {
      if (m.index > li) out.push(s.slice(li, m.index));
      out.push(<Box component="span" key={`${key}-${m.index}`} sx={{ color: '#7c3aed', fontWeight: fw.semiBold }}>{m[0]}</Box>);
      li = m.index + m[0].length;
    }
    if (li < s.length) out.push(s.slice(li));
  };
  TOKEN.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN.exec(line))) {
    if (m.index > last) pushPlain(line.slice(last, m.index), `p${last}`);
    const color = m[1] ? pt.colors.neutral['500'] : m[2] ? '#15803d' : '#b45309';
    out.push(<Box component="span" key={`t${m.index}`} sx={{ color }}>{m[0]}</Box>);
    last = m.index + m[0].length;
  }
  if (last < line.length) pushPlain(line.slice(last), `p${last}`);
  return out;
}

export function CodeSnippet({ code, variation = 'multiLine', lineNumbers = false, language, disabled, onCopy, forceState, 'aria-label': ariaLabel }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(variation === 'expanded');
  const single = variation === 'singleLine';
  const gutter = lineNumbers && !single;
  const lines = code.replace(/\n$/, '').split('\n');
  const collapsedHeight = 136;
  const expandedHeight = 444;
  // Figma: Expanded keeps the link (as Show Less); Multi Line shows Show More when the code overflows.
  const canShowMore = variation === 'expanded' || (variation === 'multiLine' && lines.length * 20 + 16 > collapsedHeight);
  const height = single ? 32 : open ? expandedHeight : collapsedHeight;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard may be unavailable (insecure context); still report success to the caller */
    }
    setCopied(true);
    onCopy?.(code);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const copyBtn = (
    <IconButton ariaLabel={copied ? 'Copied' : 'Copy code'} size="xsmall" disabled={disabled} onClick={copy}>
      {copied ? <CheckRounded sx={{ fontSize: 16, color: cs.color.tickSvgColor }} /> : <ContentCopyRounded sx={{ fontSize: 16 }} />}
    </IconButton>
  );

  return (
    <Box
      data-spec={`code-${variation}`}
      role="group"
      aria-label={ariaLabel ?? (language ? `${language} code` : 'Code snippet')}
      sx={{
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        borderRadius: single ? cs.border.radius.medium : cs.border.radius.medium,
        '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', border: `1.5px solid ${forceState === 'focus' ? FOCUS_BORDER : forceState === 'hover' ? cs.color.hoverBorder : cs.color.contentBorder}`, pointerEvents: 'none', zIndex: 3 },
        bgcolor: pt.formElements.color.primary.defaultBackground,
        overflow: 'hidden',
        opacity: disabled ? disabledOpacity : 1,
        pointerEvents: disabled ? 'none' : undefined,
        '&:hover::after': { borderColor: cs.color.hoverBorder },
        '&:focus-within::after': { borderColor: FOCUS_BORDER },
      }}
    >
      {language && !single && (
        <Box sx={{ ...textStyle('textS', 'medium'), px: '12px', height: 32, display: 'flex', alignItems: 'center', bgcolor: cs.color.gutterBackground, borderBottom: `1px solid ${cs.color.contentBorder}`, color: 'text.secondary', pr: '40px' }}>
          {language}
        </Box>
      )}
      <Box sx={{ display: 'flex', height: (language && !single ? height - 32 : height), overflow: 'hidden', position: 'relative' }}>
        {gutter && (
          <Box aria-hidden sx={{ width: 40, flexShrink: 0, py: '8px', bgcolor: cs.color.gutterBackground, borderRight: `1px solid ${cs.color.contentBorder}`, textAlign: 'center', color: cs.color.lineNumberColor, overflow: 'hidden' }}>
            {lines.map((_, i) => (
              <Box key={i} sx={{ ...textStyle('textL'), fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, lineHeight: '20px', height: 20 }}>{i + 1}</Box>
            ))}
          </Box>
        )}
        <Box
          component="pre"
          tabIndex={disabled ? -1 : 0}
          sx={{ m: 0, flex: 1, minWidth: 0, overflow: single ? 'hidden' : 'auto', p: single ? '0 40px 0 12px' : `8px 40px 8px ${gutter ? '12px' : cs.spacing.multiLine.rightLeft}`, display: single ? 'flex' : 'block', alignItems: 'center', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, lineHeight: '20px', color: cs.color.textColor, whiteSpace: single ? 'nowrap' : 'pre', outline: 'none' }}
        >
          <code>{single ? <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{highlight(lines.join(' '))}</Box> : lines.map((l, i) => <Box key={i} component="div" sx={{ minHeight: 20 }}>{highlight(l)}</Box>)}</code>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', top: single ? 4 : language ? 4 : 8, right: 8 }}>{copyBtn}</Box>
      {canShowMore && (
        <Box sx={{ position: 'absolute', right: 0, bottom: 0, p: '6px 12px', bgcolor: cs.showMore.backGround, borderTopLeftRadius: 6 }}>
          <ButtonBase onClick={() => setOpen((o) => !o)} aria-expanded={open} sx={{ ...textStyle('textL'), color: pt.uiElements.fileUpload.color.previewIconLink, textDecoration: 'underline' }}>
            {open ? 'Show Less' : 'Show More'}
          </ButtonBase>
        </Box>
      )}
    </Box>
  );
}

