import { profile } from '../../data/profile';

/** The plain next step: go to the work, or take the resume. Nothing witty. */
export default function HeroActions() {
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('work');
    if (!el) return;
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('vj:anchor', { detail: { target: 'work' } }));
    history.replaceState(null, '', '#work');
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -8 });
    else el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  return (
    <div className="hact">
      <a className="btn-c hact__go" href="#work" onClick={go}>
        See the work
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14m-6-6 6 6 6-6" /></svg>
      </a>
      <a className="hact__cv" href="/Vijaya_Chandra_Jonnadula.pdf" download="Vijaya_Chandra_Jonnadula.pdf" aria-label={`Résumé, PDF download, ${profile.name}`}>
        Résumé
        <span aria-hidden="true">PDF</span>
      </a>
    </div>
  );
}
