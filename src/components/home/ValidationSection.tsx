import SectionHeading from '../ui/SectionHeading';

const cards = [
  { num: '01', title: 'Flow testing', desc: 'Walk through every user path before sharing. Verify each screen knows its job and transitions correctly.' },
  { num: '02', title: 'UX critique', desc: 'Manual review for clarity, hierarchy, edge cases, and any screen that feels confusing or incomplete.' },
  { num: '03', title: 'Responsive QA', desc: 'Test all breakpoints: 1440, 1024, 768, 430, and 390px. No horizontal overflow allowed.' },
  { num: '04', title: 'Iteration log', desc: 'Track and address issues from each review round. Changes are scoped, not hacked.' },
  { num: '05', title: 'AI output review', desc: 'Every AI-generated layout or code is reviewed before acceptance. AI speed, human sign-off.' },
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
              <div className="validation-card__num">{c.num}</div>
              <div className="validation-card__title">{c.title}</div>
              <p className="validation-card__desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
