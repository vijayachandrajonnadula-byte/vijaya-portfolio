import { Link } from 'react-router-dom';
import Article from './Article';
import { lastEdited } from '../data/brief';

/**
 * The reading version: the same data as the film, as one plain page. No sticky scenes, no animation, same colours.
 * Shown when the system asks for reduced motion, or the address has ?read. It is a full alternative, not a degraded one.
 */
export default function ReadingMode({ calm, onRaw }: { calm: boolean; onRaw: () => void }) {
  return (
    <div className="v2-read" data-chapter="paper">
      <header className="v2-read__bar">
        <Link className="v2-read__file" to="/">VIJAY.md</Link>
        <span className="v2-read__spacer" />
        {calm
          ? <span className="v2-read__note">reduced motion is on, so you get the reading version.</span>
          : <Link className="v2-read__switch" to={{ search: '' }}>Switch to the film</Link>}
        <button type="button" className="v2-read__raw" onClick={onRaw}>raw .md</button>
      </header>
      <main className="v2-read__main">
        <Article />
        <p className="v2-read__end">last edited: {lastEdited}</p>
        <p className="v2-read__end"><Link to="/classic">The classic portfolio</Link> · <Link to="/ask">Ask</Link></p>
      </main>
    </div>
  );
}
