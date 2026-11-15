import { useState } from 'react';
import { Link } from 'react-router-dom';
import { projectTools, toolBand } from '../../data/home';
import { projects } from '../../data/projects';

/**
 * The bill of materials as a filter. Press a part (a tool) to see which featured case studies name it; the answer is read
 * from `projectTools` in src/data/home.ts, nothing is generated. Press it again to clear. Each part is one button (aria-pressed).
 */
export default function BomFilter() {
  const [pick, setPick] = useState<string | null>(null);
  const used = (tool: string) => Object.keys(projectTools).filter(id => projectTools[id]!.includes(tool));
  const hits = pick ? used(pick) : [];
  const count = (tool: string) => used(tool).length;
  return (
    <>
      <ul className="el-bom" aria-label="Tools. Press one to see where it was used.">
        {toolBand.map((t, i) => {
          const on = pick === t, n = count(t);
          return (
            <li key={t} className={`${on ? 'is-on' : ''}${pick && !on && n === 0 ? ' is-dim' : ''}`}>
              <button type="button" aria-pressed={on} onClick={() => setPick(on ? null : t)}>
                <b aria-hidden="true">U{i + 1}</b>{t}
                {n > 0 ? <i className="el-bom__n" aria-hidden="true">{n}</i> : null}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="el-bomout" role="status" aria-live="polite">
        {!pick ? <p className="el-bomout__hint">Press a part to see where I used it.</p> : hits.length === 0 ? (
          <p className="el-bomout__hint"><b>{pick}</b> is not listed in any of the four featured case studies yet.</p>
        ) : (
          <>
            <p className="el-bomout__hint"><b>{pick}</b> is used in:</p>
            <ul className="el-bomout__list">
              {hits.map(id => {
                const p = projects.find(x => x.id === id);
                return p ? <li key={id}><Link to={p.href}>{p.title}<span aria-hidden="true"> ↗</span></Link></li> : null;
              })}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
