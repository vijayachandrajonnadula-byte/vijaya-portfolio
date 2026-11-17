import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toMarkdown } from '../data/brief';
import { useDialog } from './useDialog';

/** The raw VIJAY.md in a terminal-style window, generated from the same data. Copy and download included. */
export default function RawFile({ open, onClose, calm = false }: { open: boolean; onClose: () => void; calm?: boolean }) {
  const md = useMemo(() => toMarkdown(), []);
  const box = useRef<HTMLDivElement>(null);
  const [note, setNote] = useState('');
  useDialog(open, box, onClose, () => box.current?.querySelector<HTMLElement>('[data-first]') ?? null);

  const copy = async () => {
    try { await navigator.clipboard.writeText(md); setNote('copied.'); }
    catch {
      // clipboard blocked: select the text so ctrl+c works
      const pre = box.current?.querySelector('pre');
      if (pre) { const r = document.createRange(); r.selectNodeContents(pre); const s = window.getSelection(); s?.removeAllRanges(); s?.addRange(r); }
      setNote('copy is blocked here. the text is selected: press ctrl+c.');
    }
    window.setTimeout(() => setNote(''), 4000);
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([md], { type: 'text/markdown;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'VIJAY.md';
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNote('downloaded VIJAY.md.');
    window.setTimeout(() => setNote(''), 4000);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="v2-raw" initial={calm ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={calm ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }} transition={{ duration: calm ? 0 : 0.25 }}
          onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div ref={box} className="v2-raw__win" role="dialog" aria-modal="true" aria-label="VIJAY.md, raw file"
            initial={calm ? false : { y: 24, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={calm ? undefined : { y: 16, scale: 0.98 }} transition={{ duration: calm ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}>
            <div className="v2-raw__bar">
              <span className="v2-raw__dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="v2-raw__title">~/VIJAY.md</span>
              <button type="button" className="v2-raw__x" onClick={onClose} aria-label="Close the raw file">esc</button>
            </div>
            <pre className="v2-raw__pre" tabIndex={0} aria-label="Raw markdown of VIJAY.md">{md}</pre>
            <div className="v2-raw__actions">
              <span className="v2-raw__prompt" aria-hidden="true">&gt;</span>
              <button type="button" data-first onClick={copy}>copy</button>
              <button type="button" onClick={download}>download VIJAY.md</button>
              <span className="v2-raw__note" role="status">{note}</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
