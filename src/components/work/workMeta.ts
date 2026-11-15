import { projects, type Project } from '../../data/projects';
import { workPreviews } from '../../data/home';

/** Plain-language status for a project, taken from its own data (workPreviews first, then projects.ts). */
export function statusLabel(p: Project): string {
  const w = workPreviews.find(x => x.id === p.id);
  if (w) return w.status;
  if (p.status === 'process-showcase') return 'Process';
  if (p.status === 'creative-showcase') return 'Creative';
  if (p.status === 'in-progress') return 'In progress';
  if (p.status === 'coming-soon') return 'Coming soon';
  return p.prototypeUrl ? 'Working prototype' : 'Complete';
}

export function roleOf(p: Project): string | undefined {
  return workPreviews.find(x => x.id === p.id)?.role;
}

export function getProject(id: string): Project {
  const p = projects.find(x => x.id === id);
  if (!p) throw new Error(`Unknown project id: ${id}`);
  return p;
}

export const isExternal = (url: string) => /^https?:\/\//.test(url);
