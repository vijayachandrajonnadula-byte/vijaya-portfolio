import Button from '../ui/Button';
import Tag from '../ui/Tag';

interface CaseStudyHeroProps {
  title: string;
  subtitle: string;
  tags: string[];
  prototypeUrl?: string;
  githubUrl?: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroImage2?: string;
  heroImageAlt2?: string;
  prototypeUrlLabel?: string;
  label?: string;
  prototypeLabel?: string;
  githubLabel?: string;
}

export default function CaseStudyHero({
  title,
  subtitle,
  tags,
  prototypeUrl,
  githubUrl,
  heroImage,
  heroImageAlt,
  heroImage2,
  heroImageAlt2,
  prototypeUrlLabel = 'renewly-ux.vercel.app',
  label = 'Case study',
  prototypeLabel = 'View live prototype ↗',
  githubLabel = 'View GitHub repository ↗',
}: CaseStudyHeroProps) {
  return (
    <section className="cs-hero">
      <div className="container">
        <p className="cs-hero__label">{label}</p>
        <h1 className="cs-hero__title">{title}</h1>
        <p className="cs-hero__subtitle">{subtitle}</p>
        <div className="cs-hero__tags">
          {tags.map(t => <Tag key={t}>{t}</Tag>)}
        </div>
        {(prototypeUrl || githubUrl) && (
          <div className="cs-hero__actions">
            {prototypeUrl && <Button href={prototypeUrl} external size="lg">{prototypeLabel}</Button>}
            {githubUrl && <Button href={githubUrl} variant="ghost" external size="lg">{githubLabel}</Button>}
          </div>
        )}

        {heroImage && (
          <div className="cs-hero__preview">
            <div className="cs-hero__browser">
              <div className="cs-hero__browser-bar">
                <span className="cs-hero__browser-dot" />
                <span className="cs-hero__browser-dot" />
                <span className="cs-hero__browser-dot" />
                <span className="cs-hero__browser-url">{prototypeUrlLabel}</span>
              </div>
              <div className={`cs-hero__browser-body${heroImage2 ? ' cs-hero__browser-body--dual' : ''}`}>
                <img
                  src={heroImage}
                  alt={heroImageAlt ?? title}
                  className="cs-hero__browser-img"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {heroImage2 && (
                  <img
                    src={heroImage2}
                    alt={heroImageAlt2 ?? title}
                    className="cs-hero__browser-img"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
