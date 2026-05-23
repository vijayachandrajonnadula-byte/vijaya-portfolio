import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';

const steps = [
  { n: '01', title: 'Frame the problem', desc: 'Get clear on the actual problem before opening any tool. What is the user trying to do? What is in scope and what is not?', tools: ['ChatGPT', 'Claude', 'Perplexity'] },
  { n: '02', title: 'Map the journey', desc: 'Build a user flow and IA map before touching UI. This is where the real product decisions get made.', tools: ['Miro', 'FigJam'] },
  { n: '03', title: 'Design the system', desc: 'Design a component system that works across all screens. Components and patterns first, full pages second.', tools: ['Figma', 'Figma AI', 'Claude Design'] },
  { n: '04', title: 'Prototype the flow', desc: 'Build a working React prototype with real screens and real interactions. Something you can actually open and use.', tools: ['Claude', 'Roo Code', 'Cline', 'Codex', 'React'] },
  { n: '05', title: 'Test, refine, hand off', desc: 'Go through the full flow, test on mobile, fix what is broken, and document the work properly for the handoff.', tools: ['GitHub PRs', 'Manual QA', 'Responsive testing'] },
];

export default function ProcessSection() {
  return (
    <section className="process" id="process">
      <div className="container">
        <SectionHeading
          label="My product process"
          title="How I approach every project."
        />
        <div className="process__grid">
          {steps.map(s => (
            <div key={s.n} className="process-card">
              <div className="process-card__number">{s.n}</div>
              <div className="process-card__title">{s.title}</div>
              <p className="process-card__desc">{s.desc}</p>
              <div className="process-card__tools">
                {s.tools.map(t => <span key={t} className="process-card__tool-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="process__cta">
          <p className="process__cta-text">Want to see how this works from start to finish?</p>
          <Button href="/projects/ai-assisted-product-workflow" variant="secondary" size="md">
            See the full workflow case study →
          </Button>
        </div>
      </div>
    </section>
  );
}
