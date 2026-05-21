interface Snapshot { role: string; timeline: string; platform: string; tools: string; }

export default function SnapshotGrid({ snapshot }: { snapshot: Snapshot }) {
  const items = [
    { label: 'Role', value: snapshot.role },
    { label: 'Timeline', value: snapshot.timeline },
    { label: 'Platform', value: snapshot.platform },
    { label: 'Tools', value: snapshot.tools },
  ];
  return (
    <div className="snapshot-grid">
      {items.map(i => (
        <div key={i.label} className="snapshot-card">
          <div className="snapshot-card__label">{i.label}</div>
          <div className="snapshot-card__value">{i.value}</div>
        </div>
      ))}
    </div>
  );
}
