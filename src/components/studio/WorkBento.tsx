import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import WorkCard from '../work/WorkCard';
import MoreWork from './MoreWork';
import SectionHead from '../home/SectionHead';
import { spotlight } from '../../data/home';
import { useCalm } from '../../lib/calm';

/**
 * Work, on the ink-blue band. Four featured projects as big rows (a looping glimpse of the real work plus one sentence),
 * tied together by a clay "signal" line that draws down the page as you scroll and lights a node at each row.
 * The line is one element whose scaleY follows scroll (nothing runs off-screen, and it is simply drawn in full under
 * reduced motion). Then the smaller projects (MoreWork). The id and the section marker are what the story Trace measures.
 */
export default function WorkBento() {
  const calm = useCalm();
  const rows = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: rows, offset: ['start 70%', 'end 55%'] });
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.5 });
  const headTop = useTransform(grow, v => `${(v * 100).toFixed(2)}%`);

  return (
    <div className="work sec band band--ink band--wipe" id="work">
      <section className="work__in" aria-labelledby="work-h">
        <SectionHead n="03" name="prototypes" id="work-h" title="Prototypes, not just pictures.">
          Four case studies: the problem, my decisions and what came out of them.
        </SectionHead>
        <div className="wk-rows2" ref={rows}>
          <div className="wk-spine" aria-hidden="true">
            <motion.span className="wk-spine__fill" style={calm ? undefined : { scaleY: grow }} />
            {!calm && <motion.i className="wk-spine__head" style={{ top: headTop }} />}
          </div>
          {spotlight.map((s, i) => <WorkCard key={s.id} item={s} index={i} />)}
        </div>
      </section>
      <MoreWork />
    </div>
  );
}
