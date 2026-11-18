import { useState } from 'react';
import { Link } from 'react-router-dom';
import { projectTools, toolBand } from '../../data/home';
import { projects } from '../../data/projects';
import '../../styles/electro.css';

/**
 * The tools I use, as a filter. Press a tool to see which featured case studies name it; the answer is read from
 * `projectTools` in src/data/home.ts, nothing is generated. Press it again to clear. Each tool is one button (aria-pressed).
 * De-jargoned: no part codes. The count is shown in words ("3 projects") because it carries meaning, and it is never
 * the only signal (the selected chip also gets a heavier border and a check mark, not just colour).
 */
export default function ToolFilter() {
  const [pick, setPick] = useState<string | null>(null);
  const used = (tool: string) => Object.keys(projectTools).filter(id => projectTools[id]!.includes(tool));
  const hits = pick ? used(pick) : [];
  return (
    <>
      <ul className="el-bom" aria-label="Tools. Press one to see where it was used.">
        {toolBand.map(t => {
          const on = pick === t, n = used(t).length;
          return (
            <li key={t} className={on ? 'is-on' : pick && n === 0 ? 'is-dim' : ''}>
              <button type="button" aria-pressed={on} onClick={() => setPick(on ? null : t)}>
                {on ? <span className="el-bom__check" aria-hidden="true">✓</span> : null}
                <span>{t}</span>
                {n > 0 ? <span className="el-bom__n">{n} {n === 1 ? 'project' : 'projects'}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="el-bomout" role="status" aria-live="polite">
        {!pick ? <p className="el-bomout__hint">Press a tool to see the case studies that name it.</p> : hits.length === 0 ? (
          <p className="el-bomout__hint"><b>{pick}</b> is not named in any of the four featured case studies yet.</p>
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
