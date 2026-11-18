import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toMarkdown } from '../data/brief';
import { useDialog } from './useDialog';
import MdLines from './s3/RawMarkup';
import { useNote, writeClipboard } from './s3/copy';
import '../styles/s3-raw.css';

/**
 * The raw VIJAY.md in a terminal-style window, generated from the same data. The title bar holds copy, download and close.
 * Markdown glyphs are colour-coded in the accent; the text stays the file's real text. Copy says "Copied" politely.
 */
export default function RawFile({ open, onClose, calm = false }: { open: boolean; onClose: () => void; calm?: boolean }) {
  const md = useMemo(() => toMarkdown(), []);
  const meta = useMemo(() => `${md.replace(/\n$/, '').split('\n').length} lines, ${(new Blob([md]).size / 1024).toFixed(1)} KB, markdown`, [md]);
  const box = useRef<HTMLDivElement>(null);
  const { note, say } = useNote(4000);
  const [done, setDone] = useState<'copy' | 'save' | null>(null);
  useDialog(open, box, onClose, () => box.current?.querySelector<HTMLElement>('[data-first]') ?? null);

  const copy = async () => {
    if (await writeClipboard(md)) { say('Copied'); setDone('copy'); return; }
    // clipboard blocked: select the text so ctrl+c works
    const pre = box.current?.querySelector('pre');
    if (pre) { const r = document.createRange(); r.selectNodeContents(pre); const s = window.getSelection(); s?.removeAllRanges(); s?.addRange(r); }
    say('Copy is blocked here. The text is selected: press ctrl+c.');
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([md], { type: 'text/markdown;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'VIJAY.md';
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    say('Downloaded VIJAY.md');
    setDone('save');
  };

  return (
    <AnimatePresence onExitComplete={() => setDone(null)}>
      {open ? (
        <motion.div className="s3-raw" initial={calm ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={calm ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }} transition={{ duration: calm ? 0 : 0.22 }}
          onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div ref={box} className="s3-raw__win" role="dialog" aria-modal="true" aria-label="VIJAY.md, raw file"
            initial={calm ? false : { y: 26, scale: 0.94, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={calm ? undefined : { y: 14, scale: 0.97, opacity: 0 }} transition={{ duration: calm ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <div className="s3-raw__bar">
              <span className="s3-raw__dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="s3-raw__title">VIJAY.md</span>
              <span className="s3-raw__btns">
                <button type="button" data-first onClick={copy}>{done === 'copy' ? 'copied' : 'copy'}</button>
                <button type="button" onClick={download}>{done === 'save' ? 'saved' : 'download'}</button>
                <button type="button" className="s3-raw__x" onClick={onClose} aria-label="Close the raw file">close <kbd>esc</kbd></button>
              </span>
            </div>
            <pre className="s3-raw__pre" tabIndex={0} aria-label="Raw markdown of VIJAY.md"><code><MdLines md={md} /></code></pre>
            <div className="s3-raw__foot">
              <span className="s3-raw__meta">{meta}</span>
              <span className="s3-raw__note" role="status"><span aria-hidden="true" className="s3-raw__prompt">&gt;</span> {note}<i className="s3-raw__caret" aria-hidden="true" /></span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
