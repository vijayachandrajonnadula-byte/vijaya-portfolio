import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import { useCalm } from '../../lib/calm';

const PER_COLUMN = 6;

/**
 * A tilted wall of the work. Three columns of project covers drift past, slowly, in different directions; you can
 * stop one by pointing at it, and a label follows the cursor and names what a click would open.
 *
 * Rules: the drift runs only while the hero is on screen and the tab is visible, stops while pointed at, and is
 * absent under reduced motion (the columns simply stand still). The wall is decorative and aria-hidden, and its
 * links are not in the tab order because the Work section just below lists the same projects as real, focusable cards.
 * The cursor label exists only for mouse and pen.
 */
export default function ProjectReel() {
  const calm = useCalm();
  const wrap = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(true);

  const columns = useMemo(() => {
    const list = projects.filter(p => p.image);
    return [0, 1, 2].map(c => Array.from({ length: PER_COLUMN }, (_, i) => list[(i * 3 + c) % list.length]));
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let onScreen = true;
    const sync = () => setRun(onScreen && document.visibilityState === 'visible');
    const io = new IntersectionObserver(([e]) => { onScreen = !!e?.isIntersecting; sync(); });
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);

  // cursor label: written straight to the DOM, no React state per mouse move
  useEffect(() => {
    const el = wrap.current, tag = label.current;
    if (!el || !tag || calm || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const move = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('[data-title]');
      const r = el.getBoundingClientRect();
      tag.style.transform = `translate3d(${e.clientX - r.left + 16}px, ${e.clientY - r.top + 18}px, 0)`;
      if (card) { tag.textContent = `Open ${card.dataset.title}`; tag.dataset.on = '1'; } else tag.dataset.on = '0';
    };
    const leave = () => { tag.dataset.on = '0'; };
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [calm]);

  return (
    <div className={`reel${run && !calm ? ' is-run' : ''}`} ref={wrap} aria-hidden="true">
      <div className="reel__tilt">
        {columns.map((items, c) => (
          <div className={`reel__col reel__col--${c}`} key={c}>
            <div className="reel__track">
              {[...items, ...items].map((p, i) => (
                <Link key={`${p.id}-${i}`} to={p.href} tabIndex={-1} className="reel__card" data-title={p.title}>
                  <img src={p.image} alt="" width={640} height={400} loading={i < 3 ? 'eager' : 'lazy'} decoding="async" draggable={false} />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="reel__label" ref={label} data-on="0" />
    </div>
  );
}
