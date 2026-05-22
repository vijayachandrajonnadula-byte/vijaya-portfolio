interface Snapshot { role: string; timeline: string; platform: string; tools: string; focus?: string; }

export default function SnapshotGrid({ snapshot }: { snapshot: Snapshot }) {
  const items = [
    { label: 'Role', value: snapshot.role },
    { label: 'Timeline', value: snapshot.timeline },
    { label: 'Platform', value: snapshot.platform },
    { label: 'Tools', value: snapshot.tools },
    ...(snapshot.focus ? [{ label: 'Focus', value: snapshot.focus }] : []),
  ];
  return (
    <div className={`snapshot-grid${items.length === 5 ? ' snapshot-grid--5' : ''}`}>
      {items.map(i => (
        <div key={i.label} className="snapshot-card">
          <div className="snapshot-card__label">{i.label}</div>
          <div className="snapshot-card__value">{i.value}</div>
        </div>
      ))}
    </div>
  );
}
