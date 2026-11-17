import { useEffect, useRef } from 'react';
import './../../styles/story.css';
import { isCalm } from '../../lib/calm';

/** The one plain word shown for each chapter. The circuit words (prototypes, datasheet, pinout) are gone from the page. */
const PLAIN: Record<string, string> = { 'power on': 'Intro', 'two readings': 'Electronics + UX', prototypes: 'Work', datasheet: 'About', pinout: 'Contact' };

/**
 * A quiet chapter marker: a small dot and one plain word (Work, About, Contact). Each one is a node on the Trace:
 * it carries data-node and data-chapter, and the Trace adds `is-lit` when the visitor reaches it. The dot lights once as
 * it crosses ~40% up the viewport (a single 140ms blink; none in Calm mode). Classes are set on the element directly so
 * the Trace's own class changes are never overwritten.
 * Occam / cognitive load: the number and the metaphor word were decoration, so they are gone.
 */
export default function ChapterLabel({ n, name, align = 'left' }: { n: string; name: string; align?: 'left' | 'center' }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const word = PLAIN[name] ?? name;
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (isCalm() || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e || !e.isIntersecting) return;
      io.disconnect();
      el.classList.add('is-relay');
      window.setTimeout(() => el.classList.remove('is-relay'), 400);
    }, { rootMargin: '0px 0px -40% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <p ref={ref} className={`chapter chapter--${align}`} data-node data-chapter={n}>
      <span className="chapter__dot" aria-hidden="true" />
      <span className="chapter__name">{word}</span>
    </p>
  );
}
