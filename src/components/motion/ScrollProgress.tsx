import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/** A thin accent line along the top edge that fills as you read. One rAF-throttled listener, no re-renders. */
export default function ScrollProgress() {
  const { pathname } = useLocation();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      root.current?.style.setProperty('--p', String(p));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [pathname]);

  return <div className="progress" ref={root} aria-hidden="true" />;
}
