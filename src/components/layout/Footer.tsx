import VJLogo from '../ui/VJLogo';
import { profile } from '../../data/profile';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <div className="footer__brand-logo">
              <VJLogo size={32} variant="light" />
              <span className="footer__name">{profile.name}</span>
            </div>
            <p className="footer__status">Currently open to product design roles</p>
          </div>
          <div className="footer__links">
            <a href={`mailto:${profile.email}`} className="footer__link">{profile.email}</a>
            <a href={profile.linkedin} className="footer__link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={profile.github} className="footer__link" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
        <div className="footer__bottom">
          <span className="footer__copy">Built with React · {profile.name} 2026</span>
        </div>
      </div>
    </footer>
  );
}
