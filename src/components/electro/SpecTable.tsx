import '../../styles/electro.css';

export interface SpecRow { k: string; v: string }

/** A definition list styled as a datasheet table. Rows highlight on hover and when something inside has focus. On a phone it stacks. */
export default function SpecTable({ rows }: { rows: readonly SpecRow[] }) {
  return (
    <dl className="el-spec">
      {rows.map(r => (
        <div key={r.k} className="el-spec__row">
          <dt>{r.k}</dt>
          <dd>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}
