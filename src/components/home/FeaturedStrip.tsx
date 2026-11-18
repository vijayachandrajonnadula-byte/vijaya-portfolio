import { Link } from 'react-router-dom';
import { spotlight, thumbImage } from '../../data/home';
import { projects } from '../../data/projects';

/**
 * A slim proof strip under the ask box: the four featured case studies as small linked thumbnails.
 * One tab stop each. At 1024px and up it is a row; below that it scrolls sideways with snap and a fade cue.
 */
export default function FeaturedStrip() {
  const items = spotlight.map(s => projects.find(p => p.id === s.id)).filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <nav className="fstrip" aria-label="Featured case studies">
      <p className="fstrip__k">Featured work</p>
      <ul className="fstrip__list">
        {items.map(p => (
          <li key={p.id}>
            <Link to={p.href} className="fstrip__a">
              <img src={thumbImage(p.id)} alt="" width={120} height={76} loading="lazy" decoding="async" onError={e => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }} />
              <span>{p.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
