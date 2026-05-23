import SectionHeading from '../ui/SectionHeading';

const cards = [
  {
    stage: '01 Brief',
    title: 'Product brief',
    task: 'Get clear on the problem, scope, and user goals',
    ai: 'ChatGPT · Claude · Perplexity',
    output: 'Scoped product brief',
  },
  {
    stage: '02 Flow',
    title: 'Flow and IA',
    task: 'Map the user journey and information architecture',
    ai: 'Miro · FigJam',
    output: 'User flow + IA diagram',
  },
  {
    stage: '03 Design',
    title: 'Interface system',
    task: 'Design reusable UI patterns and a component library',
    ai: 'Figma AI · Claude Design',
    output: 'Component library + design system',
  },
  {
    stage: '04 Build',
    title: 'Working prototype',
    task: 'Scope and build a React prototype',
    ai: 'Claude · Roo Code · Cline · Codex · React · TypeScript',
    output: 'Working React prototype',
  },
  {
    stage: '05 Review',
    title: 'Review and QA',
    task: 'UX walkthrough, mobile testing, and iteration',
    ai: 'Manual review · GitHub PRs',
    output: 'Refined, responsive UI',
  },
  {
    stage: '06 Handoff',
    title: 'Handoff notes',
    task: 'Document the work and prepare for implementation',
    ai: 'GitHub · Preview environment',
    output: 'Shareable prototype link',
  },
];

export default function AiWorkflowSection() {
  return (
    <section className="ai-workflow" id="workflow">
      <div className="container">
        <SectionHeading
          label="AI-assisted workflow"
          title="How I use AI in my design and build process."
          subtitle="AI helps me move faster at each stage. The decisions, the critique, and the final call are all still mine."
          dark
        />
        <div className="ai-workflow__bento">
          {cards.map(c => (
            <div key={c.stage} className="ai-workflow-card">
              <span className="ai-workflow-card__stage">{c.stage}</span>
              <div className="ai-workflow-card__title">{c.title}</div>
              <div className="ai-workflow-card__row">
                <span className="ai-workflow-card__row-label">My task</span>
                <span className="ai-workflow-card__row-value">{c.task}</span>
              </div>
              <div className="ai-workflow-card__row">
                <span className="ai-workflow-card__row-label">AI tools</span>
                <span className="ai-workflow-card__row-value">{c.ai}</span>
              </div>
              <div className="ai-workflow-card__row">
                <span className="ai-workflow-card__row-label">Output</span>
                <span className="ai-workflow-card__row-value">{c.output}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="ai-workflow__note">
          I use AI to move fast, not to skip thinking.{' '}
          Every output gets reviewed before it makes it into the work.
        </p>
      </div>
    </section>
  );
}
