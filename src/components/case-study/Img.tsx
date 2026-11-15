import { useEffect, useRef, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading' | 'src' | 'alt'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  /** Above-the-fold image: loads eagerly with high fetch priority. */
  priority?: boolean;
}

/**
 * Shared image primitive for case studies.
 * - reserves the aspect box when width/height are given (no layout shift)
 * - lazy + async decode by default
 * - soft tint placeholder, then a 280ms un-blur on load (skipped under reduced motion)
 * - if the file fails, the element hides itself (callers keep their own fallback frame)
 */
export default function Img({ src, alt, width, height, className, loading, priority, style, onError, onLoad, ...rest }: ImgProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<'pending' | 'loaded' | 'failed'>('pending');

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

  return (
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
}
