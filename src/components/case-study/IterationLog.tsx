interface Iteration { num: string; title: string; issue: string; fix: string; why?: string; }

export default function IterationLog({ iterations }: { iterations: Iteration[] }) {
  return (
    <div className="iteration-grid">
      {iterations.map(it => (
        <div key={it.num} className="iteration-card">
          <span className="iteration-card__num">Iteration {it.num}</span>
          <div className="iteration-card__title">{it.title}</div>
          <div className="iteration-card__issue">Issue: {it.issue}</div>
          <div className="iteration-card__fix">Fix: {it.fix}</div>
          {it.why && <div className="iteration-card__why">Why it mattered: {it.why}</div>}
        </div>
      ))}
    </div>
  );
}
