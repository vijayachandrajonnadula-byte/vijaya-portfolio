import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useCalm } from '../../lib/calm';

/** Deterministic pseudo-random in -1..1 so the scatter is the same on every load (and in tests). */
const rnd = (i: number, k: number) => { const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return (s - Math.floor(s)) * 2 - 1; };

/**
 * Text that arrives as noise and resolves into clean letters, once, in step with a scan line that crosses the hero.
 * Each letter starts scattered and blurred; its delay is its horizontal position on the screen, so the letters settle
 * as the scan line passes them. After that nothing moves. The element keeps the full text as an accessible name.
 *
 * `host` is the element whose width the scan line crosses (the closest <section>); the scan line itself lives in
 * HomeHero and uses the same 0.3s start and 1.4s travel, so the two stay in step.
 */
export default function ResolveText({ text, className }: { text: string; className?: string }) {
  const calm = useCalm();
  const root = useRef<HTMLSpanElement>(null);
  const [go, setGo] = useState<'0' | '1'>(calm ? '1' : '0');
  const words = useMemo(() => text.split(' '), [text]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (calm) { setGo('1'); return; }
    const host = (el.closest('.hhero__screen') ?? el.closest('section')) as HTMLElement | null;
    if (!host) { setGo('1'); return; }
    const hr = host.getBoundingClientRect();
    el.querySelectorAll<HTMLElement>('.rt__c').forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const f = Math.min(1, Math.max(0, (r.left - hr.left) / hr.width));
      c.style.setProperty('--rd', `${(0.3 + 1.4 * f).toFixed(2)}s`);
      c.style.setProperty('--dx', `${(rnd(i, 1) * 22).toFixed(1)}px`);
      c.style.setProperty('--dy', `${(rnd(i, 2) * 18).toFixed(1)}px`);
      c.style.setProperty('--rr', `${(rnd(i, 3) * 16).toFixed(1)}deg`);
    });
    setGo('1');
  }, [calm, text]);

  return (
    <span ref={root} className={`rt${className ? ` ${className}` : ''}`} data-go={go}>
      <span className="rt__sr">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <span key={wi}>
            {wi > 0 ? ' ' : ''}
            <span className="rt__w">{Array.from(word).map((c, i) => <span key={i} className="rt__c">{c}</span>)}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
