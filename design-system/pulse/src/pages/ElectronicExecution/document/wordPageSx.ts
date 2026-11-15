import type { SxProps, Theme } from '../../../components/mui';
import { fw, role } from '../../../theme/typography';
import { FIT, docRef, fonts, ref } from '../refTheme';
import type { FitMode } from '../refTheme';

/**
 * NOT FROM FIGMA. Style of the document card, measured on the real Pulse application screenshot (1440 x 1024): a white rounded card
 * in the interface font (Inter) with a small running header, a bold 30px title, a bordered information table with grey label cells,
 * blue-link contents and bold 18px headings. The execution tables below it use the same language (thin #e2e8f0 borders, #f1f4f8
 * header cells, Inter). Class names are used on purpose: the page is a document, and the table states (selected, completed, locked ...)
 * are row classes.
 */
export function wordPageSx(fit: FitMode, tableView: boolean): SxProps<Theme> {
  const f = FIT[fit];
  const cellBorder = `1px solid ${docRef.line}`;
  return {
    boxSizing: 'border-box',
    width: f.width,
    maxWidth: fit === 'compact' ? '100%' : undefined,
    minWidth: 560,
    mx: 'auto',
    p: tableView ? '24px 32px 32px' : f.pad,
    background: ref.white,
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(15,23,42,.08)',
    fontFamily: fonts.shell,
    fontSize: 13,
    fontWeight: fw.regular,
    color: docRef.body,
    lineHeight: '16px',
    position: 'relative',
    textAlign: 'left',
    '& *, & *::before, & *::after': { boxSizing: 'border-box' },
    '& .page-hdr': { display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: 11, lineHeight: '16px', color: docRef.runHead, m: 0 },
    '& .page-hdr span:last-of-type': { display: 'none' },
    '& h1': { fontSize: 28.25, lineHeight: '36px', fontWeight: fw.bold, color: docRef.ink, m: '12px 0 0', letterSpacing: '-0.01em' },
    '& h2': { fontSize: 17.5, lineHeight: '24px', fontWeight: fw.bold, color: docRef.ink, m: '0 0 14px' },
    '& h2 .num': { mr: '0.5em' },
    '& p': { m: '0 0 16px', fontSize: 13, lineHeight: '16px' },
    '& p.sub': { color: docRef.subtitle, fontSize: 13, lineHeight: '20px', m: '14px 0 12px' },
    '& .word-info-tbl': { width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', m: '0 0 16px', fontSize: 11.5, border: cellBorder },
    '& .word-info-tbl td': { border: cellBorder, height: 32, p: '0 12px', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    '& .word-info-tbl td.k': { background: docRef.infoLabelBg, color: docRef.infoLabel, fontWeight: fw.semiBold },
    '& .word-info-tbl td:nth-of-type(1)': { width: '25%' },
    '& .word-info-tbl td:nth-of-type(2)': { width: '33%' },
    '& .word-info-tbl td:nth-of-type(3)': { width: '18%' },
    '& .word-info-tbl td:nth-of-type(4)': { width: '24%' },
    '& .word-info-tbl td.v': { background: ref.white, color: docRef.infoValue },
    '& .toc-mini': { display: 'flex', flexDirection: 'column', m: '0 0 12px' },
    '& .toc-mini .t': { color: docRef.link, fontSize: 11.5, lineHeight: '19px' },
    '& .toc-mini .pg': { display: 'none' },
    '& .doc-tag': { color: docRef.body, p: '0 8px', whiteSpace: 'nowrap' },
    '& .doc-blank': {
      display: 'inline-block', minWidth: 78, background: ref.tint2, borderBottom: `1.5px solid ${ref.muted2}`, borderRadius: '3px', p: '0 7px', color: docRef.ink, fontWeight: role.strong,
      lineHeight: '20px', verticalAlign: 'baseline', outline: 'none',
    },
    '& .doc-blank:empty::before': { content: '"\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0"' },
    '& .doc-blank.filled': { background: ref.passBg, borderBottom: `1.5px solid ${ref.pass}`, color: ref.passText },
    '& .doc-blank:focus': { outline: `2px solid ${ref.blue4}`, background: ref.tint },

    '& .tbl-sec': { m: '24px 0 0', scrollMarginTop: '20px' },
    '& .tbl-sec-lbl': { fontSize: 11, fontWeight: fw.semiBold, color: ref.muted, mb: '4px' },
    ...(tableView ? { '& .tbl-sec > h2': { mt: 0 }, '& .tbl-sec': { m: '0 0 0', scrollMarginTop: '20px' } } : {}),
    '& .word-prereq': { m: '0 0 16px', fontSize: 13, color: docRef.body, lineHeight: '19px' },
    '& .word-prereq .wp-h': { fontWeight: fw.semiBold, color: docRef.ink, mb: '4px' },
    '& .word-prereq ul': { m: '0 0 0 20px', p: 0 },
    '& .word-prereq li': { mb: '2px', lineHeight: '19px' },
    '& .word-prereq li b': { fontWeight: fw.semiBold, color: docRef.ink },
    '& .word-fig': { textAlign: 'center', m: '0 0 16px' },
    '& .word-fig .fig-img': { width: 380, maxWidth: '100%', height: 'auto', aspectRatio: '380 / 238.3', border: `1px solid ${ref.figBorder}`, borderRadius: '6px', display: 'block', m: '0 auto', boxSizing: 'border-box' },
    '& .word-fig .cap': { fontSize: 11, color: docRef.subtitle, mt: '4px' },

    '& .tbl-locked-banner': {
      display: 'flex', alignItems: 'center', gap: '9px', background: ref.lockBg, border: `1px solid ${ref.lockBorder}`, borderLeft: `3px solid ${ref.lockBar}`, borderRadius: '6px',
      p: '9px 14px', mb: '12px', fontSize: 13, color: ref.lockText, fontWeight: role.strong,
    },
    '& .tbl-locked-banner svg': { opacity: 0.65, flexShrink: 0 },

    /* execution tables */
    '& .exec-tbl': { width: '100%', borderCollapse: 'collapse', m: '0 0 8px', fontSize: 12, lineHeight: '16px', tableLayout: 'fixed', border: cellBorder },
    '& .exec-tbl thead th, & .exec-tbl tbody td': { overflow: 'hidden', wordBreak: 'break-word', overflowWrap: 'break-word' },
    '& .exec-tbl thead th': {
      border: cellBorder, p: '8px', textAlign: 'left', fontWeight: fw.semiBold, fontSize: 12, background: docRef.infoLabelBg, color: docRef.infoLabel, verticalAlign: 'middle', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
    },
    '& .exec-tbl tbody td': { border: cellBorder, p: '8px', verticalAlign: 'top', background: ref.white, color: docRef.body, whiteSpace: 'normal', minWidth: 0 },
    '& .exec-tbl tbody tr.completed td': { background: `${ref.white} !important` },
    '& .exec-tbl tbody tr.selected td': { background: `${ref.tint} !important` },
    '& .exec-tbl tbody tr.selected td:first-of-type': { boxShadow: `inset 3px 0 0 ${docRef.navy}` },
    '& .exec-tbl tbody tr.ai-filled td': { background: `${ref.white} !important` },
    '& .exec-tbl tbody tr.ai-filled td:first-of-type': { borderLeft: `2px solid ${ref.blue5}` },
    '& .exec-tbl tbody tr:hover td': { background: `${ref.tint2} !important` },
    '& .exec-tbl tbody tr.selected:hover td': { background: `${ref.rowSelectedHover} !important` },
    '& .exec-tbl tbody tr': { cursor: 'pointer' },
    '& .exec-tbl .snum': { textAlign: 'center', verticalAlign: 'middle' },
    '& .exec-tbl td.ce': { background: `${ref.white} !important`, borderLeft: `${cellBorder} !important` },
    '& .exec-tbl tbody tr.completed td.ce': { background: `${ref.white} !important` },
    '& .exec-tbl tbody tr.selected td.ce': { background: `${ref.tint} !important` },
    '& .exec-tbl tbody tr:hover td.ce': { background: `${ref.tint2} !important` },
    '& .exec-tbl tbody tr.selected:hover td.ce': { background: `${ref.rowSelectedHover} !important` },
    '& .exec-tbl td.snum, & .exec-tbl tr.tbl-verify-row td': { position: 'relative', overflow: 'visible' },
    '& .tbl-locked .exec-tbl tbody tr': { cursor: 'default' },

    '& .step-pick': { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
    '& .step-pick .n': { fontWeight: fw.semiBold, color: docRef.navy, fontSize: 12 },
    '& .step-status-row': { position: 'absolute', right: 'calc(100% + 7px)', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '4px', width: 36, justifyContent: 'flex-end' },
    '& .step-status': { width: 16, height: 16, borderRadius: '50%', display: 'grid', placeItems: 'center', boxShadow: `inset 0 0 0 1px rgba(10,13,46,.06)`, cursor: 'default' },
    '& .ss-esign': { color: ref.esignFg, background: ref.esignBg },
    '& .ss-ai': { color: ref.blue3, background: ref.tint },
    '& .ss-verified': { color: ref.verifiedFg, background: ref.verifiedBg },
    '& .ss-xreason': { color: ref.failFg, background: ref.white },

    '& .irte': {
      display: 'block', width: '100%', minHeight: 20, p: '2px 6px', border: `1px dashed ${ref.muted2}`, borderRadius: '4px', background: ref.white, fontSize: 12, color: docRef.ink, fontFamily: fonts.shell,
      outline: 'none', wordBreak: 'break-word', m: 0, lineHeight: '16px', textAlign: 'left',
    },
    '& .irte.locked': { borderStyle: 'solid', borderColor: ref.line, background: ref.white, pointerEvents: 'none' },
    // grows with its text (field-sizing); rows=1 is the fallback height
    '& textarea.irte': { resize: 'none', overflow: 'hidden', display: 'block', fieldSizing: 'content' },
    '& .irte:focus': { borderStyle: 'solid', borderColor: ref.blue4, background: ref.white },
    '& .irte ul, & .irte ol': { m: '2px 0', pl: '20px' },
    '& .irte p': { m: '0 0 4px', textAlign: 'left', fontSize: 'inherit', lineHeight: 'inherit' },
    '& .tbl-locked .irte': { background: ref.lockBg, cursor: 'default', fontStyle: 'italic', color: `${ref.lockCell} !important` },
    // Panel layout: the result is text, not a field (transparent, no border, no pointer events). Wins over the locked fill.
    '& .irte.readonly': { pointerEvents: 'none', background: 'transparent', borderColor: 'transparent', p: 0 },

    '& .ev-pills': { display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' },
    '& .ev-pill': {
      fontSize: 12, color: docRef.link, textDecoration: 'underline', cursor: 'pointer', whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '100%', background: 'none', border: 0, p: 0, m: 0, fontFamily: 'inherit', textAlign: 'left',
      '&:hover': { color: docRef.navy },
    },
    '& .ev-na': { fontSize: 12, color: ref.muted },
    '& .evi-inline-zone': {
      minHeight: 24, border: `1px dashed ${ref.muted2}`, borderRadius: '4px', p: '3px 6px', background: ref.white, cursor: 'pointer', display: 'block', width: '100%',
      '&:hover': { borderColor: ref.blue4 },
      '&:focus, &:active': { outline: 'none', borderStyle: 'solid', borderColor: ref.blue4, boxShadow: `0 0 0 2px ${ref.tint}` },
    },
    '& .tbl-locked .evi-inline-zone': { cursor: 'default' },

    '& .pf-cell': { minWidth: 64, overflow: 'hidden' },
    '& .pf-flat': { fontSize: 12, color: docRef.body },
    '& .pf-radios': { display: 'flex', flexDirection: 'column', gap: '3px' },
    '& .pf-opt': { display: 'flex', alignItems: 'center', gap: '5px', fontSize: 12, color: docRef.body, cursor: 'pointer', lineHeight: '16px' },
    '& .pf-opt input': { width: 12, height: 12, m: 0, accentColor: docRef.navy, cursor: 'pointer' },

    '& .sig-cell': { fontSize: 11, minWidth: 0, overflow: 'hidden', wordBreak: 'break-word' },
    '& .sig-cell .who': { fontWeight: fw.semiBold, fontSize: 11, color: docRef.ink },
    '& .sig-cell .when': { color: docRef.subtitle, fontSize: 11 },
    '& .sig-cell .badge': { display: 'inline', fontSize: 11, fontWeight: role.strong, color: ref.ink, mt: '1px' },

    '& .tbl-verify': { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
    '& .tv-lbl': { fontSize: 12, color: ref.verifyLabel, fontWeight: role.strong },
    '& .tv-btn': {
      ml: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', background: docRef.navy, color: ref.white, border: 0, borderRadius: '6px', p: '0 16px', height: 32, fontSize: 13,
      fontWeight: fw.semiBold, fontFamily: fonts.shell, cursor: 'pointer',
      '&:disabled': { background: ref.verifyButtonOff, cursor: 'not-allowed' },
      '&:not(:disabled):hover': { filter: 'brightness(1.12)' },
    },
    '& .tv-done .tv-badge': { background: ref.passBg, color: ref.passText, border: `1px solid ${ref.pass}`, borderRadius: '6px', p: '3px 10px', fontSize: 12, fontWeight: fw.semiBold },
  };
}
