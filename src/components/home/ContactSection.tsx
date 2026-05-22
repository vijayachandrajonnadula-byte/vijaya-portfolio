import { profile } from '../../data/profile';

const links = [
  { icon: '✉️', label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/vijaya-chandra', href: profile.linkedin, external: true },
  { icon: '💻', label: 'GitHub', value: 'github.com/vijayachandrajonnadula-byte', href: profile.github, external: true },
  { icon: '🌐', label: 'Portfolio', value: profile.portfolio, href: `https://${profile.portfolio}` },
];

export default function ContactSection() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact__inner">
          <div>
            <h2 className="contact__heading">Have a product problem, role, or project to discuss?</h2>
            <p className="contact__sub">
              I am open to UX/UI and product design opportunities. The easiest way to reach me is by email.
            </p>
          </div>
          <div className="contact__links">
            {links.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="contact__link-item"
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className="contact__link-icon">{l.icon}</span>
                <div>
                  <div className="contact__link-label">{l.label}</div>
                  <div className="contact__link-value">{l.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
