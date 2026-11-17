import type { ReactNode } from 'react';
import ChapterLabel from '../story/ChapterLabel';

/**
 * One header pattern for every home section: a small marker (the Trace node), ONE heading, ONE sentence.
 * The marker is the section's only [data-node], so the Trace keeps one stop per section.
 * Consistency (Similarity): same sizes, same gaps, same order everywhere.
 */
export default function SectionHead({ n, name, id, title, children }: { n: string; name: string; id: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="sec-head">
      <ChapterLabel n={n} name={name} />
      <h2 id={id} className="sec-h">{title}</h2>
      {children ? <p className="sec-sub">{children}</p> : null}
    </header>
  );
}
