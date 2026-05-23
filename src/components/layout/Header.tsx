import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import VJLogo from '../ui/VJLogo';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { label: 'Work', href: '/#work' },
    { label: 'Process', href: '/#process' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ];

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="container">
        <div className="header__inner">
          <Link to="/" className="header__logo" onClick={handleLogoClick}>
            <VJLogo size={26} />
            <span className="header__logo-name">Vijay</span>
          </Link>
          <nav className="header__nav" aria-label="Main navigation">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="header__nav-link">{l.label}</a>
            ))}
          </nav>
          <button
            className="header__menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      <nav className={`header__mobile-nav${menuOpen ? ' header__mobile-nav--open' : ''}`} aria-label="Mobile navigation">
        {navLinks.map(l => (
          <a key={l.label} href={l.href} className="header__mobile-nav-link">{l.label}</a>
        ))}
      </nav>
    </header>
  );
}
