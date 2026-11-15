import { useState, useEffect, useRef } from 'react';
import SectionSheet from './SectionSheet';
import { useIndicator } from './useIndicator';
import '../../styles/case-v2.css';

interface NavItem { id: string; label: string; }

const defaultNavItems: NavItem[] = [
  { id: 'snapshot', label: 'Project snapshot' },
  { id: 'demonstrates', label: 'What this demonstrates' },
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'goals', label: 'Goals' },
  { id: 'research', label: 'Research insights' },
  { id: 'early-structure', label: 'Early structure' },
  { id: 'decisions', label: 'Key UX decisions' },
  { id: 'design-system', label: 'Design system' },
  { id: 'screenshots', label: 'Desktop screens' },
  { id: 'mobile-screens', label: 'Mobile screens' },
  { id: 'ai-workflow', label: 'AI-assisted workflow' },
  { id: 'technical', label: 'Technical implementation' },
  { id: 'testing', label: 'Testing' },
  { id: 'iterations', label: 'Iterations' },
  { id: 'responsive-qa', label: 'Responsive QA' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'tech-stack', label: 'Tech stack' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'validation', label: 'Final validation' },
  { id: 'reflection', label: 'Reflection' },
];

/**
 * Sticky "On this page" index.
 *
 * - scroll-spy highlights the section being read
 * - a progress rail fills as you move through the content
 * - section blocks fade up as they enter (class-gated, so content is never hidden
 *   if scripting or reduced-motion rules change)
 */
export default function CaseStudyNav({ items }: { items?: NavItem[] }) {
  const navItems = items ?? defaultNavItems;
  const [active, setActive] = useState('');
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  useIndicator(listRef, '.cs-nav__link--active', active);

  // scroll-spy
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    navItems.forEach(n => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [navItems]);

  // progress rail
  useEffect(() => {
    const content = document.querySelector<HTMLElement>('.cs-content');
    const nav = navRef.current;
    if (!content || !nav) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = content.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.5;
      const done = Math.min(1, Math.max(0, (window.innerHeight * 0.3 - r.top) / Math.max(total, 1)));
      nav.style.setProperty('--cs-progress', String(done));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // section fade-up on entry
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    // A scroll check rather than IntersectionObserver: a section that is jumped
    // over (anchor click, fast scroll) must still end up visible. The list is
    // re-queried each time so sections that render late are never left hidden.
    let raf = 0;
    const check = () => {
      raf = 0;
      const line = window.innerHeight * 0.94;
      document.querySelectorAll<HTMLElement>('.cs-section').forEach(s => {
        if (!s.classList.contains('is-in') && s.getBoundingClientRect().top < line) s.classList.add('is-in');
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    root.classList.add('cs-reveal-on');
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove('cs-reveal-on');
      document.querySelectorAll('.cs-section.is-in').forEach(s => s.classList.remove('is-in'));
    };
  }, []);

  const go = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id);
    if (!el || !window.__lenis) return; // fall back to the native anchor jump
    e.preventDefault();
    window.__lenis.scrollTo(el, { offset: -88 });
  };

  const skip = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector<HTMLElement>('.cs-content') ?? document.getElementById('main');
    if (!target) return;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  return (
    <>
    <nav ref={navRef} className="cs-nav" aria-label="On this page">
      <a href="#main" className="cs-skip" onClick={skip}>Skip to case study</a>
      <div className="cs-nav__title">On this page</div>
      <div className="cs-nav__list" ref={listRef}>
        <span className="cs-nav__rail" aria-hidden="true"><span className="cs-nav__rail-fill" /></span>
        <span className="cs-nav__ind" aria-hidden="true" />
        {navItems.map((n, i) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            onClick={e => go(e, n.id)}
            onFocus={e => e.currentTarget.scrollIntoView({ block: 'nearest' })}
            aria-current={active === n.id ? 'location' : undefined}
            className={`cs-nav__link${active === n.id ? ' cs-nav__link--active' : ''}`}
          >
            <span className="cs-nav__num">{String(i + 1).padStart(2, '0')}</span>
            {n.label}
          </a>
        ))}
      </div>
    </nav>
    <SectionSheet sections={navItems} variant="cs" />
    </>
  );
}
