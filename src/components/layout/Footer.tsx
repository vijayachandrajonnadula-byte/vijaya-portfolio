import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';
import CircuitLed from '../story/CircuitLed';
import { isCalm } from '../../lib/calm';

/**
 * One row (Occam, Hick): copyright, then six links in the order people look for them. Every target is 44px
 * tall (Fitts, WCAG 2.5.8). The LED row above stays as it was.
 */
export default function Footer() {
  return (
    <footer className="site-foot">
      <CircuitLed />
      <span className="site-foot__copy">© 2026 {profile.name}</span>
      <nav className="site-foot__links" aria-label="Footer">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href="/Vijaya_Chandra_Jonnadula.pdf" download="Vijaya_Chandra_Jonnadula.pdf">Resume</a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub<span className="sr-only"> (opens in a new tab)</span></a>
        <Link to="/ask">Ask</Link>
        <button type="button" onClick={() => (window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: isCalm() ? 'auto' : 'smooth' }))}>Back to top ↑</button>
      </nav>
    </footer>
  );
}
