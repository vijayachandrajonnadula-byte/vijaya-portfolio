import Tag from '../ui/Tag';
import { profile } from '../../data/profile';

const experience = [
  { company: 'ValGenesis', role: 'Senior UX Designer', period: 'Jul 2026 – Present', note: 'Enterprise product UX, React UI, design systems, AI-assisted delivery' },
  { company: 'ZoomInfo', role: 'UX/UI Designer I', period: 'Aug 2022 – Jun 2026', note: 'Admin Portal, Schedule, ZI Chat, FormComplete, AI Enablement' },
  { company: 'CredAvenue', role: 'Product Designer Consultant', period: 'Oct 2021 – Jul 2022', note: 'Web, desktop & mobile product design' },
  { company: 'Amigos Arts', role: 'Founder / Product Designer', period: 'Jan 2020 – Oct 2021', note: 'Product design, illustration, client delivery' },
  { company: 'Helping Hands', role: 'Design Lead', period: 'Jul 2017 – Mar 2020', note: 'Communication design, visual campaigns' },
];

const skillGroups = [
  { label: 'Design tools', skills: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe XD', 'Adobe After Effects', 'Adobe InDesign'] },
  { label: 'UX & research', skills: ['UX Research', 'User Flows', 'Information Architecture', 'UI Design', 'Design Systems', 'Wireframing', 'Responsive QA'] },
  { label: 'Prototype & build', skills: ['React', 'TypeScript', 'Vite', 'CSS', 'React Router', 'GitHub'] },
  { label: 'AI-assisted tools', skills: ['Claude', 'ChatGPT', 'Perplexity', 'Figma AI', 'Roo Code', 'Cline', 'Codex'] },
  { label: 'Collaboration & process', skills: ['Notion', 'Miro', 'FigJam', 'Jira', 'Maze', 'Storybook', 'Zeplin', 'Vercel'] },
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
            <div className="about__profile-identity">
              <div className="about__profile-name">{profile.name}</div>
              <div className="about__profile-role">{profile.title}</div>
            </div>
            <div className="about__profile-divider" />
            <div className="about__profile-details">
              <div className="about__profile-detail">
                <span className="about__profile-detail-label">Based</span>
                <span className="about__profile-detail-text">{profile.location}</span>
              </div>
              <div className="about__profile-detail">
                <span className="about__profile-detail-label">Workflow</span>
                <span className="about__profile-detail-text">{profile.workflow}</span>
              </div>
              <div className="about__profile-detail">
                <span className="about__profile-detail-label">Email</span>
                <a href={`mailto:${profile.email}`} className="about__profile-detail-text about__profile-detail-link">{profile.email}</a>
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

            <div className="about__experience">
              <div className="about__experience-label">Experience</div>
              {experience.map(e => (
                <div key={e.company} className="about__exp-row">
                  <div className="about__exp-left">
                    <span className="about__exp-company">{e.company}</span>
                    <span className="about__exp-role">{e.role}</span>
                  </div>
                  <div className="about__exp-right">
                    <span className="about__exp-period">{e.period}</span>
                    <span className="about__exp-note">{e.note}</span>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/Vijaya_Chandra_Jonnadula.pdf"
              download="Vijaya_Chandra_Jonnadula.pdf"
              className="about__resume-download"
            >
              Download full resume ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
