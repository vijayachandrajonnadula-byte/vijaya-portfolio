import Tag from '../ui/Tag';
import { profile } from '../../data/profile';

const skillGroups = [
  { label: 'Design', skills: ['UX Research', 'User Flows', 'Information Architecture', 'UI Design', 'Design Systems', 'Responsive QA'] },
  { label: 'Prototype & build', skills: ['React', 'TypeScript', 'Vite', 'CSS', 'React Router', 'GitHub'] },
  { label: 'AI-assisted tools', skills: ['ChatGPT', 'Claude', 'Perplexity', 'Figma AI', 'Claude Design', 'Roo Code', 'Cline', 'Codex'] },
  { label: 'Process', skills: ['GitHub PRs', 'Storybook', 'Maze', 'Manual UX review', 'Vercel'] },
];

export default function AboutSection() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about__grid">
          <div className="about__profile-card">
            <div className="about__profile-photo-wrap">
              <img
                src="/images/profile.png"
                alt={profile.name}
                className="about__profile-photo"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="about__profile-name">{profile.name}</div>
              <div className="about__profile-role">{profile.title}</div>
            </div>
            <div className="about__profile-divider" />
            <div className="about__profile-details">
              <div className="about__profile-detail">
                <span className="about__profile-detail-icon">📍</span>
                <span className="about__profile-detail-text">{profile.location}</span>
              </div>
              <div className="about__profile-detail">
                <span className="about__profile-detail-icon">💼</span>
                <span className="about__profile-detail-text">{profile.workflow}</span>
              </div>
              <div className="about__profile-detail">
                <span className="about__profile-detail-icon">✉️</span>
                <a href={`mailto:${profile.email}`} className="about__profile-detail-text" style={{ color: 'var(--color-accent)' }}>{profile.email}</a>
              </div>
            </div>
          </div>

          <div className="about__content">
            <h2 className="about__heading">{profile.aboutHeading}</h2>
            <p className="about__body">{profile.aboutBody}</p>
            <div className="about__skills">
              {skillGroups.map(g => (
                <div key={g.label} className="about__skill-group">
                  <span className="about__skill-label">{g.label}</span>
                  <div className="about__skill-tags">
                    {g.skills.map(s => <Tag key={s} variant="subtle">{s}</Tag>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
