import { useRef, type ReactNode } from 'react';
import Img from '../case-study/Img';
import { imgSize } from '../../data/imageSizes';
import '../../styles/audit-af4.css';

/** Native <details> block for checklist-type material. Keyboard operable by default. */
export function Fold({ title, count, children, open }: { title: string; count?: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="af-fold" open={open}>
      <summary className="af-fold__summary">
        <span className="af-fold__title">{title}</span>
        {count && <span className="af-fold__count">{count}</span>}
        <span className="af-fold__chev" aria-hidden="true" />
      </summary>
      <div className="af-fold__body">{children}</div>
    </details>
  );
}

/** mark: 'check' = done, 'box' = a planned or open item (empty checkbox), 'dot' = a question or note. */
export function Checklist({ items, mark = 'dot' }: { items: string[]; mark?: 'check' | 'box' | 'dot' }) {
  return (
    <ul className="af-list">
      {items.map(i => (
        <li key={i} className="af-list__item">
          <span className={`af-mark af-mark--${mark}`} aria-hidden="true">{mark === 'check' ? '✓' : ''}</span>
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

export function sentence(text: string): string {
  const m = text.match(/^.*?[.!?](?=\s|$)/);
  return (m ? m[0] : text).trim();
}

/**
 * Browser-framed screenshot. Shows the whole image width, capped in height so the page stays
 * scannable. Click opens the full, uncropped image (Img zoom). `crop` frames a region instead.
 */
export function Shot({
  src, alt, url, cap = 640, crop,
}: {
  src: string; alt: string; url: string; cap?: number;
  crop?: { x: number; y: number; w: number; h: number };
}) {
  const [iw, ih] = (() => {
    const s = imgSize(src) as { width?: number; height?: number } | undefined;
    return [s?.width ?? 1600, s?.height ?? 1000];
  })();
  return (
    <div className="renewly-browser-chrome af-shot">
      <div className="renewly-browser-bar">
        <span className="renewly-browser-dot" />
        <span className="renewly-browser-dot" />
        <span className="renewly-browser-dot" />
        <span className="renewly-browser-url-bar">{url}</span>
      </div>
      {crop ? (
        <div className="af-shot__crop" style={{ aspectRatio: `${crop.w} / ${crop.h}` }}>
          <Img
            src={src} {...imgSize(src)} alt={alt} zoom
            className="af-shot__img af-shot__img--crop"
            style={{
              width: `${(iw / crop.w) * 100}%`,
              left: `${(-crop.x / crop.w) * 100}%`,
              top: `${(-crop.y / crop.h) * 100}%`,
              aspectRatio: `${iw} / ${ih}`,
            }}
          />
        </div>
      ) : (
        <div className="af-shot__body" style={{ maxHeight: cap }}>
          <Img src={src} {...imgSize(src)} alt={alt} zoom className="af-shot__img" />
        </div>
      )}
    </div>
  );
}

export interface MobileItem { src: string; title: string; note: string; alt: string }

/** 4-up or 3-up grid on desktop; a snap carousel of ~280px frames with 44px controls at <=520px. */
export function MobileGallery({ items, label, cols = 4 }: { items: MobileItem[]; label: string; cols?: 3 | 4 }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = (dir: number) => ref.current?.scrollBy({ left: dir * 296, behavior: 'smooth' });
  return (
    <div className="af-mgal-wrap">
      <div className="af-mgal-nav">
        <button type="button" className="af-mgal-btn" onClick={() => step(-1)} aria-label={`Previous screen, ${label}`}>&#x2190;</button>
        <button type="button" className="af-mgal-btn" onClick={() => step(1)} aria-label={`Next screen, ${label}`}>&#x2192;</button>
      </div>
      <div ref={ref} className={`af-mgal af-mgal--${cols}`} role="region" aria-label={label} tabIndex={0}>
        {items.map(s => (
          <div key={s.title} className="renewly-mobile-item af-mgal__item">
            <div className="renewly-mobile-caption">
              <div className="renewly-mobile-caption__title">{s.title}</div>
              <div className="renewly-mobile-caption__note">{s.note}</div>
            </div>
            <div className="renewly-mobile-frame">
              <Img src={s.src} {...imgSize(s.src)} alt={s.alt} zoom className="renewly-mobile-img" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Diagram with zoom and a visible text equivalent so it works without the image. */
export function Diagram({ src, alt, steps, caption }: { src: string; alt: string; steps: string[]; caption: string }) {
  return (
    <figure className="af-diagram">
      <div className="cs-image-wrap">
        <Img src={src} {...imgSize(src)} alt={alt} zoom className="cs-image" style={{ maxHeight: 'none', objectFit: 'contain' }} />
      </div>
      <figcaption className="af-diagram__cap">
        {caption}
        <ol className="af-diagram__steps">
          {steps.map(s => <li key={s}>{s}</li>)}
        </ol>
      </figcaption>
    </figure>
  );
}

/** Equal-height design-system image card with zoom. */
export function DsCard({ src, label, alt }: { src: string; label: string; alt: string }) {
  return (
    <figure className="af-ds-card">
      <div className="af-ds-card__frame">
        <Img src={src} {...imgSize(src)} alt={alt} zoom />
      </div>
      <figcaption className="af-ds-card__label">{label}</figcaption>
    </figure>
  );
}
