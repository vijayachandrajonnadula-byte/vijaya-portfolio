import { useState, useEffect } from 'react';

const navItems = [
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
  { id: 'pr-workflow', label: 'PR workflow' },
  { id: 'testing', label: 'Testing' },
  { id: 'iterations', label: 'Iterations' },
  { id: 'responsive-qa', label: 'Responsive QA' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'tech-stack', label: 'Tech stack' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'validation', label: 'Final validation' },
  { id: 'reflection', label: 'Reflection' },
];

export default function CaseStudyNav() {
  const [active, setActive] = useState('');

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
  }, []);

  return (
    <nav className="cs-nav" aria-label="Case study sections">
      <div className="cs-nav__title">Contents</div>
      {navItems.map(n => (
        <a
          key={n.id}
          href={`#${n.id}`}
          className={`cs-nav__link${active === n.id ? ' cs-nav__link--active' : ''}`}
        >
          {n.label}
        </a>
      ))}
    </nav>
  );
}
