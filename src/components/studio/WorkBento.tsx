import WorkCard from '../work/WorkCard';
import MoreWork from './MoreWork';
import SectionHead from '../home/SectionHead';
import { spotlight } from '../../data/home';

/**
 * Four featured projects as equal cards (same size, same anatomy: the screen, one meta line, title, one sentence, one
 * call to action), then a collapsed "More projects" disclosure. Each card is one big target (see work/WorkCard.tsx).
 * The id and the section marker are what the story Trace measures, so they stay.
 */
export default function WorkBento() {
  return (
    <div className="work sec" id="work">
      <section className="work__in" aria-labelledby="work-h">
        <SectionHead n="03" name="prototypes" id="work-h" title="Prototypes, not just pictures.">
          Four case studies: the problem, my decisions and what came out of them.
        </SectionHead>
        <div className="wk-grid">
          {spotlight.map((s, i) => <WorkCard key={s.id} item={s} index={i} />)}
        </div>
      </section>
      <MoreWork />
    </div>
  );
}
