import { useEffect, useRef } from 'react';
import './../../styles/story.css';

/** The plain word beside each circuit word, so the chapter names match the header (Work, About, Contact). */
const PLAIN: Record<string, string> = { 'two readings': 'electronics + ux', prototypes: 'work', datasheet: 'about', pinout: 'contact' };

/**
 * A small chapter marker, e.g. "03 prototypes / work". Each one is a node on the Trace: it carries data-node,
 * and the Trace adds `is-lit` when the visitor reaches it. When it first crosses ~40% up the viewport the node
 * flickers on like a relay (~140ms) and the name slides in 6px. Classes are set on the element directly so the
 * Trace's own class changes are never overwritten. Reduced motion: lit, no flicker.
 */
export default function ChapterLabel({ n, name, align = 'left' }: { n: string; name: string; align?: 'left' | 'center' }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const plain = PLAIN[name];
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    el.classList.add('is-pre');
    const io = new IntersectionObserver(([e]) => {
      if (!e || !e.isIntersecting) return;
      io.disconnect();
      el.classList.remove('is-pre');
      el.classList.add('is-relay');
      window.setTimeout(() => el.classList.remove('is-relay'), 700);
    }, { rootMargin: '0px 0px -40% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <p ref={ref} className={`chapter chapter--${align}`} data-node data-chapter={n}>
      <span className="chapter__dot" aria-hidden="true" />
      <span className="chapter__n">{n}</span>
      <span className="chapter__name">{name}{plain ? <span className="chapter__plain"> / {plain}</span> : null}</span>
    </p>
  );
}
