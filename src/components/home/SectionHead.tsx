import type { ReactNode } from 'react';
import ChapterLabel from '../story/ChapterLabel';
import SplitTitle from './SplitTitle';

/**
 * One header pattern for every home section: a small marker (the Trace node), ONE big editorial heading, ONE sentence.
 * The marker is the section's only [data-node], so the Trace keeps one stop per section.
 * A plain-text title rises in word by word (once, never under reduced motion).
 */
export default function SectionHead({ n, name, id, title, children }: { n: string; name: string; id: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="sec-head">
      <ChapterLabel n={n} name={name} />
      <h2 id={id} className="sec-h">{typeof title === 'string' ? <SplitTitle text={title} /> : title}</h2>
      {children ? <p className="sec-sub">{children}</p> : null}
    </header>
  );
}
