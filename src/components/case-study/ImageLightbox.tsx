import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/audit-shared.css';

interface ImageLightboxProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  onClose: () => void;
}

/** Lenis (smooth scroll) is typed with scrollTo only; stop/start exist at runtime. */
const lenis = () => window.__lenis as ({ stop?: () => void; start?: () => void } | undefined);

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/**
 * Accessible full-size image viewer used by <Img zoom />.
 * role=dialog + aria-modal, labelled, focus trap, Esc and outside click close, background scroll locked.
 * Fit mode shows the whole image in the window; actual-size mode shows it at its natural width (capped at
 * twice the viewport) inside a keyboard-scrollable region, so small text in screens can be read on a phone.
 * No animation beyond a short fade, and none under reduced motion (see audit-shared.css).
 */
export default function ImageLightbox({ src, fallbackSrc, alt, onClose }: ImageLightboxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [fit, setFit] = useState(() => !window.matchMedia('(max-width: 760px)').matches);
  const [natural, setNatural] = useState(0);
  const [url, setUrl] = useState(src);

  const close = useCallback(() => onClose(), [onClose]);

  // lock background scroll, hide the floating chips, restore on close
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    html.classList.add('cs-lightbox-open');
    lenis()?.stop?.();
    return () => {
      html.style.overflow = prevOverflow;
      html.classList.remove('cs-lightbox-open');
      lenis()?.start?.();
    };
  }, []);

  // focus entry, Esc, focus trap
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = rootRef.current;
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      if (!root.contains(active)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [close]);

  const style = !fit && natural
    ? ({ width: `min(${natural}px, 200vw)` } as React.CSSProperties)
    : undefined;

  return createPortal(
    <div
      ref={rootRef}
      className="cs-lb"
      role="dialog"
      aria-modal="true"
      aria-label={`Full size image: ${alt}`}
      onMouseDown={e => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="cs-lb__bar">
        <p className="cs-lb__title">{alt}</p>
        <button type="button" className="cs-lb__btn" aria-pressed={!fit} onClick={() => setFit(f => !f)}>
          {fit ? 'Actual size' : 'Fit to screen'}
        </button>
        <button ref={closeRef} type="button" className="cs-lb__btn cs-lb__close" onClick={close} aria-label="Close full size image">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <div
        className={`cs-lb__scroll${fit ? ' is-fit' : ''}`}
        tabIndex={0}
        role="region"
        aria-label={fit ? 'Image, fitted to the window' : 'Image at actual size, scroll to pan'}
        data-lenis-prevent
        onMouseDown={e => { if (e.target === e.currentTarget) close(); }}
      >
        <img
          className="cs-lb__img"
          src={url}
          alt={alt}
          style={style}
          draggable={false}
          onLoad={e => setNatural(e.currentTarget.naturalWidth)}
          onError={() => { if (url !== fallbackSrc) setUrl(fallbackSrc); }}
        />
      </div>
    </div>,
    document.body,
  );
}
