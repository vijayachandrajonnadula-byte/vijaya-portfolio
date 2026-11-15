import WorkCard from '../work/WorkCard';
import MoreWork from './MoreWork';
import ChapterLabel from '../story/ChapterLabel';
import { spotlight } from '../../data/home';

/**
 * Four featured projects as cards, then a collapsed "More projects" disclosure.
 * Each card is one big target (see work/WorkCard.tsx). The id and the chapter label are what the
 * story Trace measures, so they stay.
 */
export default function WorkBento() {
  return (
    <div className="work" id="work">
      <section className="work__in" aria-labelledby="work-h">
        <ChapterLabel n="03" name="prototypes" />
        <div className="sec-head">
          <h2 id="work-h">Prototypes, not just pictures.</h2>
          <p>Four projects, each with a story behind it. Click anywhere on a card to read it.</p>
        </div>
        <div className="wk-grid">
          {spotlight.map((s, i) => <WorkCard key={s.id} item={s} index={i} />)}
        </div>
      </section>
      <MoreWork />
    </div>
  );
}
