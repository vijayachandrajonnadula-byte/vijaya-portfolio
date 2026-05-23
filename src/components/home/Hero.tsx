import Button from '../ui/Button';
import { profile } from '../../data/profile';

const stages = [
  { name: 'Research framing', tools: 'ChatGPT · Claude · Perplexity', active: true },
  { name: 'Journey mapping', tools: 'Miro · FigJam', active: true },
  { name: 'UI exploration', tools: 'Figma · Figma AI · Claude Design', active: true },
  { name: 'Prototype build', tools: 'Claude · Roo Code · Cline · Codex · React · TypeScript', active: true },
  { name: 'Review and QA', tools: 'GitHub PRs · Storybook · Maze · Manual UX review', active: false },
  { name: 'Preview handoff', tools: 'Preview environment · Shareable prototype', active: false },
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero__grid">
          <div className="hero__content">
            <div className="hero__status">
              <span className="hero__status-dot" />
              {profile.status}
            </div>
            <h1 className="hero__headline">
              I design digital products faster with{' '}
              <em>research</em>, <em>UX judgement</em>,{' '}
              <em>AI-assisted workflows</em>, and working prototypes.
            </h1>
            <p className="hero__subtitle">
              {profile.bio}
            </p>
            <div className="hero__actions">
              <Button href="#work" size="lg">View selected work</Button>
              <Button href="#contact" variant="ghost" size="lg">Contact me</Button>
            </div>
          </div>

          <div className="hero__card">
            <div className="hero__card-header">
              <div className="hero__card-title">AI-assisted product workflow</div>
              <div className="hero__card-sub">Right tools at each stage</div>
            </div>
            <div className="hero__card-stages">
              {stages.map(s => (
                <div key={s.name} className="hero__card-stage">
                  <span className={`hero__card-stage-dot${s.active ? ' hero__card-stage-dot--active' : ''}`} />
                  <div className="hero__card-stage-info">
                    <div className="hero__card-stage-name">{s.name}</div>
                    <div className="hero__card-stage-tools">{s.tools}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hero__card-footer">
              <span className="hero__card-footer-item">Human-led judgement</span>
              <span className="hero__card-footer-sep">·</span>
              <span className="hero__card-footer-item">AI-assisted speed</span>
              <span className="hero__card-footer-sep">·</span>
              <span className="hero__card-footer-item">Tested before sharing</span>
            </div>
            <a href="#process" className="hero__card-cta">See the full process →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
