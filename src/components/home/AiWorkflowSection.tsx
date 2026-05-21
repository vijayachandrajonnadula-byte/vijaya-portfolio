import SectionHeading from '../ui/SectionHeading';

const cards = [
  {
    icon: '📋',
    stage: '01 — Brief',
    title: 'Product brief',
    task: 'Define scope, constraints, and user goals',
    ai: 'ChatGPT · Claude · Perplexity',
    output: 'Scoped product brief',
  },
  {
    icon: '🗺️',
    stage: '02 — Flow',
    title: 'Flow and IA',
    task: 'Map the user journey and information architecture',
    ai: 'Miro · FigJam',
    output: 'User flow + IA diagram',
  },
  {
    icon: '🎨',
    stage: '03 — Design',
    title: 'Interface system',
    task: 'Design reusable UI patterns and component library',
    ai: 'Figma AI · Claude Design',
    output: 'Component library + design system',
  },
  {
    icon: '⚙️',
    stage: '04 — Build',
    title: 'Working prototype',
    task: 'Scope and implement React prototype',
    ai: 'Roo Code · Cline · Codex · React · TypeScript',
    output: 'Working React prototype',
  },
  {
    icon: '🔍',
    stage: '05 — Review',
    title: 'Review and QA',
    task: 'UX critique, mobile testing, iteration',
    ai: 'Manual review · GitHub PRs',
    output: 'Refined, responsive UI',
  },
  {
    icon: '🚀',
    stage: '06 — Handoff',
    title: 'Handoff notes',
    task: 'Prepare for implementation review',
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
          title="How I use AI-assisted workflows without losing UX judgement."
          subtitle="AI helps me move faster, but the product decisions, UX critique, testing, and final judgement stay human-led."
          dark
        />
        <div className="ai-workflow__bento">
          {cards.map(c => (
            <div key={c.stage} className="ai-workflow-card">
              <span className="ai-workflow-card__icon">{c.icon}</span>
              <span className="ai-workflow-card__stage">{c.stage}</span>
              <div className="ai-workflow-card__title">{c.title}</div>
              <div className="ai-workflow-card__row">
                <span className="ai-workflow-card__row-label">Human task</span>
                <span className="ai-workflow-card__row-value">{c.task}</span>
              </div>
              <div className="ai-workflow-card__row">
                <span className="ai-workflow-card__row-label">AI support</span>
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
          <strong>AI accelerated the workflow, but it did not replace UX judgement.</strong>{' '}
          Human judgement stays responsible for product decisions, critique, testing, responsive QA, and final acceptance.
        </p>
      </div>
    </section>
  );
}
