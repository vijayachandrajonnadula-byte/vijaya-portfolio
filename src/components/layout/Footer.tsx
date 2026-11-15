import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';
import CircuitLed from '../story/CircuitLed';

export default function Footer() {
  return (
    <footer className="site-foot">
      <CircuitLed />
      <span>© 2026 {profile.name}</span>
      <nav className="site-foot__links" aria-label="Footer">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href="/Vijaya_Chandra_Jonnadula.pdf" download="Vijaya_Chandra_Jonnadula.pdf">Resume</a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <Link to="/ask">Ask</Link>
      </nav>
      <button type="button" onClick={() => (window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' }))}>Back to top ↑</button>
    </footer>
  );
}
