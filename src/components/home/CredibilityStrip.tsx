import { profile } from '../../data/profile';

const cards = [
  { label: 'Based', value: profile.location },
  { label: 'Focus', value: profile.focus },
  { label: 'Strength', value: profile.strength },
  { label: 'Workflow', value: profile.workflow },
];

export default function CredibilityStrip() {
  return (
    <section className="credibility">
      <div className="container">
        <div className="credibility__grid">
          {cards.map(c => (
            <div key={c.label} className="credibility__card">
              <span className="credibility__card-label">{c.label}</span>
              <span className="credibility__card-value">{c.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
