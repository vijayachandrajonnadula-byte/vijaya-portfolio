interface TimelineItem { pr: string; label: string; }

export default function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="timeline">
      {items.map(i => (
        <div key={i.pr} className="timeline-item">
          <span className="timeline-item__badge">{i.pr}</span>
          <span className="timeline-item__label">{i.label}</span>
        </div>
      ))}
    </div>
  );
}
