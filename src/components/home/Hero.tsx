import { motion, useReducedMotion } from 'framer-motion';
import Button from '../ui/Button';
import { profile } from '../../data/profile';
import { fadeUp, staggerParent, EASE, DURATION } from '../motion/motion-presets';

const stages = [
  { name: 'Research framing', tools: 'ChatGPT · Claude · Perplexity', active: true },
  { name: 'Journey mapping', tools: 'Miro · FigJam', active: true },
  { name: 'UI exploration', tools: 'Figma · Figma AI · Claude Design', active: true },
  { name: 'Prototype build', tools: 'Claude · Roo Code · Cline · Codex · React · TypeScript', active: true },
  { name: 'Review and QA', tools: 'GitHub PRs · Storybook · Maze · Manual UX review', active: false },
  { name: 'Preview handoff', tools: 'Preview environment · Shareable prototype', active: false },
];

export default function Hero() {
  const reduced = useReducedMotion();
  // The hero is above the fold, so it animates on mount rather than on scroll.
  const start = reduced ? false : 'hidden';

  return (
    <section className="hero">
      <div className="container">
        <div className="hero__grid">
          <motion.div
            className="hero__content"
            variants={staggerParent(0.09)}
            initial={start}
            animate="show"
          >
            <motion.div className="hero__status" variants={fadeUp(10)}>
              <span className="hero__status-dot" />
              {profile.status}
            </motion.div>
            <motion.h1 className="hero__headline" variants={fadeUp(22)}>
              I design digital products that are{' '}
              <em>research-first</em>, built to a{' '}
              <em>system</em>, and shipped as{' '}
              <em>working prototypes</em>.
            </motion.h1>
            <motion.p className="hero__subtitle" variants={fadeUp(16)}>
              {profile.bio}
            </motion.p>
            <motion.div className="hero__actions" variants={fadeUp(14)}>
              <Button href="#work" size="lg">View selected work</Button>
              <Button href="#contact" variant="ghost" size="lg">Contact me</Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__card"
            initial={reduced ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE, delay: 0.18 }}
          >
            <div className="hero__card-header">
              <div className="hero__card-title">AI-assisted product workflow</div>
              <div className="hero__card-sub">Tools I use at each stage</div>
            </div>
            <motion.div
              className="hero__card-stages"
              variants={staggerParent(0.055, 0.45)}
              initial={start}
              animate="show"
            >
              {stages.map(s => (
                <motion.div key={s.name} className="hero__card-stage" variants={fadeUp(8)}>
                  <span className={`hero__card-stage-dot${s.active ? ' hero__card-stage-dot--active' : ''}`} />
                  <div className="hero__card-stage-info">
                    <div className="hero__card-stage-name">{s.name}</div>
                    <div className="hero__card-stage-tools">{s.tools}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="hero__card-footer">
              <span className="hero__card-footer-item">Decisions stay mine. AI handles the speed.</span>
            </div>
            <a href="#process" className="hero__card-cta">See the full process →</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
