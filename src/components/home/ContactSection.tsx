import { profile } from '../../data/profile';

const links = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'LinkedIn', value: 'linkedin.com/in/vijaya-chandra', href: profile.linkedin, external: true },
  { label: 'GitHub', value: 'github.com/vijayachandrajonnadula-byte', href: profile.github, external: true },
  { label: 'Portfolio', value: profile.portfolio, href: `https://${profile.portfolio}` },
];

export default function ContactSection() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact__inner">
          <div>
            <h2 className="contact__heading">Have a role, project, or product problem to discuss?</h2>
            <p className="contact__sub">
              I'm open to UX/UI and product design opportunities. Email is the easiest way to reach me.
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
                <div className="contact__link-label">{l.label}</div>
                <div className="contact__link-value">{l.value}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
