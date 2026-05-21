import SectionHeading from '../ui/SectionHeading';

const cards = [
  { icon: '🧭', title: 'Flow testing', desc: 'Walk through every user path before sharing. Verify each screen knows its job and transitions correctly.' },
  { icon: '🔎', title: 'UX critique', desc: 'Manual review for clarity, hierarchy, edge cases, and any screen that feels confusing or incomplete.' },
  { icon: '📱', title: 'Responsive QA', desc: 'Test all breakpoints: 1440, 1024, 768, 430, and 390px. No horizontal overflow allowed.' },
  { icon: '📝', title: 'Iteration log', desc: 'Track and address issues from each review round. Changes are scoped, not hacked.' },
  { icon: '🤖', title: 'AI output review', desc: 'Every AI-generated layout or code is reviewed before acceptance. AI speed, human sign-off.' },
];

export default function ValidationSection() {
  return (
    <section className="validation">
      <div className="container">
        <SectionHeading
          label="Validation"
          title="How I validate the work before sharing."
        />
        <div className="validation__grid">
          {cards.map(c => (
            <div key={c.title} className="validation-card">
              <span className="validation-card__icon">{c.icon}</span>
              <div className="validation-card__title">{c.title}</div>
              <p className="validation-card__desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
