import SectionHeading from '../ui/SectionHeading';

const cards = [
  {
    num: '01',
    title: 'UX clarity',
    desc: 'Before I open Figma, I know what each screen needs to do. Messy flows become clear steps, and every design decision has a reason behind it.',
  },
  {
    num: '02',
    title: 'UI systems',
    desc: 'I design in systems, not one-offs. Reusable components and consistent patterns mean teams can keep shipping without rebuilding the UI from scratch.',
  },
  {
    num: '03',
    title: 'AI-assisted speed',
    desc: 'I use Claude, Figma AI, and coding agents to move fast through research, design, and build. Everything gets reviewed by me before it goes anywhere.',
  },
  {
    num: '04',
    title: 'Prototype mindset',
    desc: 'I ship React prototypes that stakeholders can click through and test. An actual URL they can open on their phone, not a screenshot in a slide deck.',
  },
  {
    num: '05',
    title: 'Responsive QA',
    desc: 'Before anything leaves my desk, I test it at desktop, tablet, and mobile. Overflow, tap targets, text size. The small things that break trust if you miss them.',
  },
];

export default function WhyMeSection() {
  return (
    <section className="why-me">
      <div className="container">
        <SectionHeading
          label="Why me"
          title="What I bring to product teams."
        />
        <div className="why-me__grid">
          {cards.map(c => (
            <div key={c.num} className="why-me-card">
              <div className="why-me-card__num">{c.num}</div>
              <div className="why-me-card__title">{c.title}</div>
              <p className="why-me-card__desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
