import SectionHeading from '../ui/SectionHeading';

const cards = [
  {
    num: '01',
    title: 'UX clarity',
    desc: 'I simplify messy flows into clear product journeys — defining what each screen needs to do before touching any visual layer.',
  },
  {
    num: '02',
    title: 'UI systems',
    desc: 'I create reusable patterns instead of one-off screens, so teams ship faster and maintain consistency as the product grows.',
  },
  {
    num: '03',
    title: 'AI-assisted speed',
    desc: 'I use AI tools to move faster while reviewing quality manually. AI accelerates delivery; product judgement stays human-led.',
  },
  {
    num: '04',
    title: 'Prototype mindset',
    desc: 'I build working flows that stakeholders can actually open, click through, and test — not just static mockups.',
  },
  {
    num: '05',
    title: 'Responsive QA',
    desc: 'I check desktop, tablet, and mobile before sharing. No horizontal overflow, tappable targets, and readable text at every size.',
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
