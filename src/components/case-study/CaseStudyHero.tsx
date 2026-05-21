import Button from '../ui/Button';
import Tag from '../ui/Tag';

interface CaseStudyHeroProps {
  title: string;
  subtitle: string;
  tags: string[];
  prototypeUrl: string;
  githubUrl: string;
}

export default function CaseStudyHero({ title, subtitle, tags, prototypeUrl, githubUrl }: CaseStudyHeroProps) {
  return (
    <section className="cs-hero">
      <div className="container">
        <p className="cs-hero__label">Case study</p>
        <h1 className="cs-hero__title">{title}</h1>
        <p className="cs-hero__subtitle">{subtitle}</p>
        <div className="cs-hero__tags">
          {tags.map(t => <Tag key={t}>{t}</Tag>)}
        </div>
        <div className="cs-hero__actions">
          <Button href={prototypeUrl} external size="lg">View live prototype ↗</Button>
          <Button href={githubUrl} variant="ghost" external size="lg">View GitHub repository ↗</Button>
        </div>
      </div>
    </section>
  );
}
