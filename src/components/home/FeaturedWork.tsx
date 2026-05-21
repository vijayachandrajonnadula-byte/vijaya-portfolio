import Button from '../ui/Button';
import Tag from '../ui/Tag';
import SectionHeading from '../ui/SectionHeading';
import { projects } from '../../data/projects';

export default function FeaturedWork() {
  const featured = projects.find(p => p.featured);
  const coming = projects.filter(p => !p.featured);

  return (
    <section className="featured-work" id="work">
      <div className="container">
        <SectionHeading
          label="Selected work"
          title="Selected product case studies"
        />

        {featured && (
          <div className="project-card project-card--featured">
            <div className="project-card__image-wrap">
              <div className="project-card__browser-bar">
                <span className="project-card__browser-dot" />
                <span className="project-card__browser-dot" />
                <span className="project-card__browser-dot" />
                <span className="project-card__browser-url">hospital-booking-portfolio.vercel.app</span>
              </div>
              {featured.image ? (
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="project-card__img"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="project-card__img-placeholder">Riverside General · Hospital Booking</div>
              )}
            </div>
            <div className="project-card__body">
              <div className="project-card__meta">
                <span className="project-card__sprint-label">Featured case study</span>
                <span className="project-card__year">{featured.sprint} · {featured.year}</span>
              </div>
              <h3 className="project-card__title">{featured.title}</h3>
              <p className="project-card__description">{featured.description}</p>
              <div className="project-card__tags">
                {featured.tags.map(t => <Tag key={t}>{t}</Tag>)}
              </div>
              <div className="project-card__actions">
                <Button href={featured.href}>View case study</Button>
                <Button href={featured.prototypeUrl} variant="ghost" external>Open prototype ↗</Button>
              </div>
            </div>
          </div>
        )}

        <div className="coming-soon-grid">
          {coming.map(p => (
            <div key={p.id} className="project-card project-card--coming-soon">
              <div className="project-card__body">
                <span className="project-card__status-badge">In progress</span>
                <h3 className="project-card__title project-card__title--dim">{p.title}</h3>
                <p className="project-card__description">{p.description}</p>
                <div className="project-card__tags">
                  {p.tags.map(t => <Tag key={t} variant="subtle">{t}</Tag>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
