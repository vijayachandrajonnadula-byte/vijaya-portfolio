import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { moreIds, workImage } from '../../data/home';
import { glimpseOf } from '../../data/glimpses';
import { getProject } from '../work/workMeta';
import ArrowIcon from '../work/ArrowIcon';
import GlimpseVideo from './GlimpseVideo';
import '../../styles/work.css';

/**
 * The smaller projects as a tidy grid, each with its own short glimpse (the illustration set stays a still).
 * Every card is one big link (stretched title link) with the glimpse and its play button above the overlay, as in
 * work/WorkCard.tsx. Clips are lazy: GlimpseVideo asks for a file only when the card is within 300px of the screen.
 * The old "More projects" disclosure is gone, so these are always visible; links such as /#more or /#more-renewly still
 * scroll to the right place.
 */
export default function MoreWork() {
  const rows = moreIds.map(getProject);

  useEffect(() => {
    const h = window.location.hash;
    if (h.startsWith('#more-')) document.getElementById(h.slice(1))?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <section className="wk-more" id="more" aria-labelledby="more-h">
      <h3 id="more-h" className="wk-more__h">And a few more</h3>
      <ul className="wk-mini-grid">
        {rows.map(p => {
          const g = glimpseOf(p.id);
          return (
            <li key={p.id} id={`more-${p.id}`} className="wk-mini">
              <div className="wk-mini__vis">
                {g ? (
                  <GlimpseVideo id={g.clip ?? g.id} poster={g.poster} label={g.label} ratio="16 / 10" />
                ) : (
                  <div className="wk-still" style={{ aspectRatio: '16 / 10' }}><img src={workImage(p.id)} alt="" loading="lazy" draggable={false} /></div>
                )}
              </div>
              <div className="wk-mini__text">
                <p className="wk-meta"><span>{p.year} · {p.category.split(' / ')[0]}</span></p>
                <h4 className="wk-mini__title"><Link to={p.href} className="wk-link">{p.title}<span className="sr-only"> case study</span></Link></h4>
                <p className="wk-mini__line">{p.subtitle}</p>
                <span className="wk-cta" aria-hidden="true">Read the case study <ArrowIcon /></span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
