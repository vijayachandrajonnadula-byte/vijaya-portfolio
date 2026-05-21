import SectionHeading from '../ui/SectionHeading';

const steps = [
  { n: '01', title: 'Frame the problem', desc: 'Understand the user problem, define scope, and challenge assumptions before opening a design tool.', tools: ['ChatGPT', 'Claude', 'Perplexity'] },
  { n: '02', title: 'Map the journey', desc: 'Build a user flow and information architecture to align on what the product needs to do.', tools: ['Miro', 'FigJam'] },
  { n: '03', title: 'Design the system', desc: 'Create reusable UI patterns, components, and a design language that scales across screens.', tools: ['Figma', 'Figma AI', 'Claude Design'] },
  { n: '04', title: 'Prototype the flow', desc: 'Build a working React prototype that lets the team test the real flow, not just screenshots.', tools: ['Claude', 'Roo Code', 'Cline', 'Codex', 'React'] },
  { n: '05', title: 'Test, refine, hand off', desc: 'Review the full flow, test on mobile, iterate on issues, and prepare for implementation handoff.', tools: ['GitHub PRs', 'Manual QA', 'Responsive testing'] },
];

export default function ProcessSection() {
  return (
    <section className="process" id="process">
      <div className="container">
        <SectionHeading
          label="My product process"
          title="Not just visual design — a repeatable product workflow."
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
      </div>
    </section>
  );
}
