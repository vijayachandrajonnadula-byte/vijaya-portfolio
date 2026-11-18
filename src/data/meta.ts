import { projects } from './projects';

/** Per-route title and description. Edit here; RouteMeta in App.tsx applies it on every route change. */
export const SITE_NAME = 'Vijaya Chandra Jonnadula';

export interface RouteMetaInfo {
  title: string;
  description: string;
  noindex?: boolean;
}

const HOME: RouteMetaInfo = {
  title: `UX/UI Product Designer | ${SITE_NAME}`,
  description:
    'Vijaya Chandra Jonnadula (Vijay), UX/UI product designer in Hyderabad, India. Product case studies, working prototypes, design systems and an AI-assisted workflow where the design judgement stays human.',
};

const ASK: RouteMetaInfo = {
  title: `Ask | ${SITE_NAME}`,
  description:
    'Ask about Vijay’s work, process and background. Answers are retrieved from facts already on this site, not generated.',
};

const NOT_FOUND: RouteMetaInfo = {
  title: `Page not found | ${SITE_NAME}`,
  description: 'This page does not exist. Head back to the portfolio of Vijaya Chandra Jonnadula.',
  noindex: true,
};

function firstSentence(text: string, max = 158): string {
  const s = text.split(/(?<=[.!?])\s/)[0] || text;
  if (s.length <= max) return s;
  return s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

export function getRouteMeta(pathname: string): RouteMetaInfo {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (path === '/') return HOME;
  if (path === '/ask') return ASK;
  const p = projects.find(x => x.href === path);
  if (p) {
    return {
      title: `${p.title} | ${SITE_NAME}`,
      description: `${p.subtitle.replace(/ · /g, ', ')}. ${firstSentence(p.description, 120)}`.slice(0, 200),
    };
  }
  return NOT_FOUND;
}
