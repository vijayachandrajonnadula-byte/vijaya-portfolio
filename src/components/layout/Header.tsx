import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import VJLogo from '../ui/VJLogo';
import { useTheme, applyThemeWithWipe } from './theme';
import PowerSwitch from '../electro/PowerSwitch';
import { isCalm } from '../../lib/calm';

const links = [
  { label: 'Work', href: '/#work', key: 'work' },
  { label: 'About', href: '/#about', key: 'about' },
  { label: 'Contact', href: '/#contact', key: 'contact' },
];

/**
 * A floating pill: mark, links, theme switch. It sits at the top on large screens and at the
 * bottom on phones (where it slides away while you scroll down). Its colours come from the theme.
 */
export default function Header() {
  const { pathname } = useLocation();
  const [theme] = useTheme();
  const dark = theme === 'dark';
  const [active, setActive] = useState<string>('');
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // scroll-spy: which home section is under the middle of the screen
  useEffect(() => {
    setActive('');
    if (pathname !== '/' || typeof IntersectionObserver === 'undefined') return;
    let io: IntersectionObserver | undefined;
    let retry: number | undefined;
    const seen = new Map<string, boolean>();
    const start = (attempt: number) => {
      const els = links.map(l => document.getElementById(l.key)).filter((e): e is HTMLElement => !!e);
      if (!els.length) { if (attempt < 5) retry = window.setTimeout(() => start(attempt + 1), 300); return; }
      io = new IntersectionObserver(entries => {
        entries.forEach(e => seen.set(e.target.id, e.isIntersecting));
        const on = links.find(l => seen.get(l.key));
        setActive(on ? on.key : '');
      }, { rootMargin: '-40% 0px -55% 0px' });
      els.forEach(el => io!.observe(el));
    };
    start(0);
    return () => { io?.disconnect(); if (retry) clearTimeout(retry); };
  }, [pathname]);

  // phone: hide the pill while scrolling down and while the footer is on screen; transform only
  useEffect(() => {
    const phone = window.matchMedia('(max-width: 700px)');
    let lastY = window.scrollY;
    let inFooter = false;
    let down = false;
    let raf = 0;
    // With "reduce motion" on, the pill stays in place (no sliding bar while scrolling)
    const apply = () => { raf = 0; setHidden(phone.matches && !isCalm() && (down || inFooter)); };
    window.addEventListener('vj-calm', apply);
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      if (Math.abs(dy) > 6) {
        down = dy > 0 && y > 120;
        lastY = y;
        if (!raf) raf = requestAnimationFrame(apply);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    let io: IntersectionObserver | undefined;
    const watchFooter = () => {
      io?.disconnect();
      inFooter = false;
      const foot = document.querySelector('.site-foot');
      if (!foot || typeof IntersectionObserver === 'undefined') return;
      io = new IntersectionObserver(([e]) => { inFooter = e.isIntersecting; apply(); });
      io.observe(foot);
    };
    watchFooter();
    const t = window.setTimeout(watchFooter, 600);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('vj-calm', apply); io?.disconnect(); clearTimeout(t); if (raf) cancelAnimationFrame(raf); };
  }, [pathname]);

  // a new page always starts with the pill shown
  useEffect(() => { setHidden(false); }, [pathname]);

  const onAnchor = (key: string) => {
    if (pathname === '/') window.dispatchEvent(new CustomEvent('vj:anchor', { detail: { target: key } }));
  };

  return (
    <header className="nav" data-nav data-hidden={hidden ? 'true' : undefined} ref={headerRef}>
      <nav className="nav__pill" aria-label="Main">
        <Link to="/" className="nav__mark" aria-label="Vijay, home" onClick={() => window.scrollTo({ top: 0 })}>
          <VJLogo size={26} variant={dark ? 'light' : 'dark'} />
        </Link>
        <span className="nav__sep" aria-hidden="true" />
        {links.map(l => {
          const here = active === l.key;
          return (
            <Link
              key={l.key}
              to={l.href}
              className={`nav__link nav__link--${l.key}${here ? ' is-here' : ''}`}
              aria-current={here ? 'location' : undefined}
              onClick={() => onAnchor(l.key)}
            >
              {l.label}
            </Link>
          );
        })}
        <span className="nav__sep nav__sep--tools" aria-hidden="true" />
        <PowerSwitch dark={dark} onToggle={origin => applyThemeWithWipe(dark ? 'light' : 'dark', origin)} />
      </nav>
    </header>
  );
}
