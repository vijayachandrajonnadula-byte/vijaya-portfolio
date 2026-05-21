interface RQAItem { breakpoint: string; label: string; status: string; }

export default function ResponsiveQA({ items }: { items: RQAItem[] }) {
  return (
    <div className="rqa-grid">
      {items.map(i => (
        <div key={i.breakpoint} className="rqa-card">
          <div className="rqa-card__breakpoint">{i.breakpoint}</div>
          <div className="rqa-card__label">{i.label}</div>
          <div className="rqa-card__status">{i.status}</div>
        </div>
      ))}
    </div>
  );
}
