import { useCallback, useEffect, useRef, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';
import ImageLightbox from './ImageLightbox';
import '../../styles/audit-shared.css';

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading' | 'src' | 'alt'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  /** Above-the-fold image: loads eagerly with high fetch priority. */
  priority?: boolean;
  /** Click or press Enter to open the full, uncropped image in a lightbox. Optionally pass a different full-size src. */
  zoom?: boolean | string;
}

/**
 * Shared image primitive for case studies.
 * - reserves the aspect box when width/height are given (no layout shift)
 * - lazy + async decode by default
 * - soft tint placeholder, then a 280ms un-blur on load (skipped under reduced motion)
 * - if the file fails, the element hides itself (callers keep their own fallback frame)
 */
export default function Img({ src, alt, width, height, className, loading, priority, zoom, style, onError, onLoad, ...rest }: ImgProps) {
  const ref = useRef<HTMLImageElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<'pending' | 'loaded' | 'failed'>('pending');
  const [open, setOpen] = useState(false);
  const closeZoom = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => btnRef.current?.focus({ preventScroll: true }), 0);
  }, []);

  useEffect(() => {
    setState('pending');
    const el = ref.current;
    if (el?.complete && el.naturalWidth > 0) setState('loaded');
  }, [src]);

  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    setState('loaded');
    onLoad?.(e);
  };
  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    setState('failed');
    if (onError) onError(e);
    else (e.currentTarget as HTMLImageElement).style.display = 'none';
  };

  const img = (
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading ?? 'lazy'}
      decoding="async"
      {...(priority ? ({ fetchpriority: 'high' } as object) : {})}
      className={`cs-img${className ? ` ${className}` : ''}`}
      data-state={state}
      style={width && height ? { aspectRatio: `${width} / ${height}`, ...style } : style}
      onLoad={handleLoad}
      onError={handleError}
      {...rest}
    />
  );

  if (!zoom || state === 'failed') return img;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="cs-zoom"
        aria-haspopup="dialog"
        aria-label={`View full size: ${alt}`}
        onClick={() => setOpen(true)}
      >
        {img}
        <span className="cs-zoom__ic" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </span>
      </button>
      {open && <ImageLightbox src={typeof zoom === 'string' ? zoom : src} fallbackSrc={src} alt={alt} onClose={closeZoom} />}
    </>
  );
}
