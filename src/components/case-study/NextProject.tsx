import { Link, useLocation } from 'react-router-dom';
import { projects } from '../../data/projects';
import { thumbImage } from '../../data/home';
import TiltCard from '../motion/TiltCard';
import '../../styles/case-v2.css';

/**
 * End-of-page project footer: Previous / All work / Next, plus the large next-project card.
 * The order comes from src/data/projects.ts and wraps around, so adding a project there
 * updates every case study automatically.
 */
export default function NextProject() {
  const { pathname } = useLocation();
  const list = projects.filter(p => p.status !== 'coming-soon');
  const i = list.findIndex(p => p.href === pathname);
  if (i === -1) return null;
  const next = list[(i + 1) % list.length]!;
  const prev = list[(i - 1 + list.length) % list.length]!;

  return (
    <section className="next-project" aria-label="More projects">
      <div className="container">
        <TiltCard className="next-project__tilt" max={2.5}>
          <Link to={next.href} className="next-project__card" data-cursor="Next project">
            <span className="next-project__text">
              <span className="next-project__eyebrow">Next project</span>
              <span className="next-project__title">{next.title}</span>
              <span className="next-project__sub">{next.subtitle}</span>
              <span className="next-project__cta">Read the case study →</span>
            </span>
            <span className="next-project__media" aria-hidden="true">
              <img
                src={thumbImage(next.id)}
                alt=""
                loading="lazy"
                onError={e => { (e.target as HTMLImageElement).src = next.image; }}
              />
            </span>
          </Link>
        </TiltCard>

        <nav className="cs-pn" aria-label="Project navigation">
          <Link to={prev.href} className="cs-pn__cell cs-pn__cell--prev" rel="prev">
            <span className="cs-pn__k">← Previous</span>
            <span className="cs-pn__v">{prev.title}</span>
          </Link>
          <Link to="/classic#work" className="cs-pn__cell cs-pn__cell--all">
            <span className="cs-pn__k">Back to</span>
            <span className="cs-pn__v">All work</span>
          </Link>
          <Link to={next.href} className="cs-pn__cell cs-pn__cell--next" rel="next">
            <span className="cs-pn__k">Next →</span>
            <span className="cs-pn__v">{next.title}</span>
          </Link>
        </nav>
      </div>
    </section>
  );
}
