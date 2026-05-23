import SectionHeading from '../ui/SectionHeading';

const cards = [
  { num: '01', title: 'Flow testing', desc: 'I walk through every user path before sharing. Each screen has to make sense on its own and connect properly to the next.' },
  { num: '02', title: 'UX critique', desc: 'I review every screen for clarity, visual hierarchy, and anything that feels off or incomplete.' },
  { num: '03', title: 'Responsive QA', desc: 'I test on desktop, tablet, and mobile. From 1440 down to 390px. If it overflows or breaks, it gets fixed before anything ships.' },
  { num: '04', title: 'Iteration log', desc: 'I track issues from each review round and address them properly rather than patching over them.' },
  { num: '05', title: 'AI output review', desc: 'Any AI-generated code or layout gets reviewed before it goes in. I use AI to move fast, not to skip the review.' },
];

export default function ValidationSection() {
  return (
    <section className="validation">
      <div className="container">
        <SectionHeading
          label="Validation"
          title="What I check before sharing anything."
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
