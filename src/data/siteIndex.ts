import { projects } from './projects';
import { STOP, addVocab, askHref, queryWords, stem, suggestQuestions, type Entry } from './knowledge';

/**
 * A small index of the places on this site a visitor can be sent to: every case study, the home sections, the resume
 * and the ask page. It is the second half of the ask box's retrieval. When a typed word is not in the notes
 * ("figma", "healthcare", "dashboard"), the case studies that really contain it are the answer. Titles and
 * descriptions come from src/data/projects.ts; the keywords are that file's tags and category plus a few terms the
 * case study pages really cover. Nothing here is generated.
 */
export type SiteType = 'case-study' | 'page';

export interface SiteItem {
  id: string;
  type: SiteType;
  title: string;
  /** A route on this site, a hash route (/#work) or a file in /public. */
  route: string;
  /** One plain line. */
  desc: string;
  keywords: string[];
}

/** The first sentence of a project's description. */
const firstSentence = (s: string) => (/^[^.]+\./.exec(s)?.[0] ?? s).trim();

/** Extra terms per case study, only where the page really covers them. */
const EXTRA: Record<string, string[]> = {
  'pulse-design-system': ['accessibility', 'axe', 'a11y', 'tokens', 'components', 'component library', 'life science', 'valgenesis', 'ai', 'gallery', 'regulated'],
  'electronic-execution': ['protocol', 'validation', 'gxp', 'audit trail', 'signature', 'prototype', 'ai assistant', 'valgenesis', 'life science'],
  'afs-enterprise-workflow': ['account fit score', 'admin portal', 'scoring', 'crm', 'csv', 'condition builder', 'ai'],
  'zoominfo-schedule': ['calendar', 'availability', 'meeting types', 'reminder', 'calendly', 'chili piper', 'admin portal'],
  caresync: ['clinical', 'clinician', 'command centre', 'shift briefing', 'github', 'repo', 'code', 'dashboard', 'prototype', 'colour', 'safety'],
  renewly: ['dashboard', 'renewal', 'subscription', 'finance', 'github', 'repo', 'code', 'mobile', 'responsive', 'approval', 'savings', 'prototype'],
  'riverside-general': ['hospital', 'booking', 'appointment', 'doctor', 'patient', 'mobile', 'responsive', 'sprint', 'prototype'],
  'ai-workflow': ['pull request', 'pr', 'github', 'ci', 'preview', 'ai', 'claude', 'codex', 'process', 'handoff', 'vs code'],
  'illustration-systems': ['illustration', 'illustrator', 'portrait', 'wpap', 'vector', 'drawing', 'art', 'creative'],
};

const caseStudies: SiteItem[] = projects.map(p => ({
  id: p.id,
  type: 'case-study',
  title: p.title,
  route: p.href,
  desc: firstSentence(p.description),
  keywords: [...p.tags, p.category, ...p.subtitle.split('·'), ...(EXTRA[p.id] ?? [])].map(s => s.trim()).filter(Boolean),
}));

const pages: SiteItem[] = [
  { id: 'home-work', type: 'page', title: 'Selected work', route: '/#work', desc: 'The case studies, one card each, with a link to every project.', keywords: ['work', 'projects', 'portfolio', 'case studies', 'case study', 'examples', 'selected work'] },
  { id: 'home-about', type: 'page', title: 'About me', route: '/#about', desc: 'Who I am, how I work, my tools and my education.', keywords: ['about', 'bio', 'background', 'story', 'education', 'tools', 'experience', 'timeline', 'who is vijay'] },
  { id: 'home-contact', type: 'page', title: 'Contact', route: '/#contact', desc: 'My email, LinkedIn, GitHub and the resume.', keywords: ['contact', 'email', 'linkedin', 'github', 'reach', 'hire', 'get in touch', 'message'] },
  { id: 'resume', type: 'page', title: 'Resume (PDF)', route: '/Vijaya_Chandra_Jonnadula.pdf', desc: 'The resume as a PDF: summary, skills, roles, education and certifications.', keywords: ['resume', 'cv', 'pdf', 'download', 'curriculum vitae', 'experience'] },
  { id: 'ask', type: 'page', title: 'Ask Vijay', route: '/ask', desc: 'Questions and answers written by Vijay, grouped by topic.', keywords: ['ask', 'questions', 'faq', 'answers', 'q&a'] },
];

export const siteIndex: SiteItem[] = [...caseStudies, ...pages];
export const isFile = (route: string) => /\.[a-z0-9]{2,4}$/i.test(route);

/** Words that say nothing about where to go. */
const SKIP = new Set([...STOP,'project', 'design', 'designer', 'work', 'ux', 'ui', 'case', 'study', 'page', 'site', 'show', 'see', 'look', 'vijay', 'vijaya', 'your', 'about', 'tell', 'can', 'you', 'the', 'and', 'for', 'with', 'what', 'how', 'who', 'did', 'does', 'have', 'has', 'was', 'are', 'any', 'get']);

interface Prepared { item: SiteItem; title: Set<string>; words: Set<string>; phrases: string[] }
const words = (s: string) => queryWords(s);
const prepared: Prepared[] = siteIndex.map(item => {
  const title = new Set(words(item.title).filter(w => !SKIP.has(w)));
  const kw = new Set<string>();
  const phrases: string[] = [];
  for (const k of item.keywords) {
    const t = words(k);
    if (t.length > 1) phrases.push(t.join(' '));
    t.filter(w => !SKIP.has(w) && w.length > 1).forEach(w => kw.add(w));
  }
  return { item, title, words: kw, phrases };
});
// typo fixing for the notes also knows the words of the site index
for (const p of prepared) addVocab([...p.title, ...p.words]);

export interface SiteHit { item: SiteItem; score: number }

/** The lowest site score that counts as a real answer, and the lower bar for "closest on this site". */
export const SITE_MIN = 2.9;
export const SITE_SUGGEST_MIN = 1.5;

/**
 * Rank the places on this site for a typed text. Same folding as the notes (plurals, synonyms, typo fixes). A word
 * in the title scores most, then a keyword, then (only for the last word, while typing) a prefix. Words the index
 * does not know lower the score, so an unrelated text matches nothing.
 */
export function searchSite(text: string, opts: { live?: boolean; min?: number } = {}): SiteHit[] {
  const min = opts.min ?? SITE_MIN;
  const raw = text.trim();
  if (raw.length < 2) return [];
  const q = words(raw).filter(w => !SKIP.has(w) && w.length > 1);
  const last = stem(raw.toLowerCase().replace(/[^a-z0-9+# ]+/g, ' ').trim().split(/\s+/).pop() ?? '');
  const hits: SiteHit[] = [];
  const nq = ' ' + words(raw).join(' ') + ' ';
  for (const p of prepared) {
    let score = 0, matched = 0;
    for (const w of q) {
      if (p.title.has(w)) { score += 3.6; matched++; }
      else if (p.words.has(w)) { score += 3; matched++; }
      else if (opts.live && w === q[q.length - 1] && last.length >= 2 && [...p.title, ...p.words].some(k => k.startsWith(last))) { score += 1.6; matched += 0.5; }
    }
    for (const ph of p.phrases) if (ph.includes(' ') && nq.includes(' ' + ph + ' ')) score += 2;
    if (!score) continue;
    const coverage = q.length ? matched / q.length : 1;
    score *= 0.6 + 0.4 * Math.min(1, coverage);
    if (score >= min) hits.push({ item: p.item, score: +score.toFixed(2) });
  }
  return hits.sort((a, b) => b.score - a.score);
}

/** One row of the live suggestions or the "closest on this site" block. */
export interface Suggestion {
  kind: 'question' | 'case-study' | 'page';
  id: string;
  title: string;
  /** Short plain line under the title; empty for questions. */
  desc: string;
  href: string;
  /** The entry, for questions. */
  entry?: Entry;
  score: number;
}
export const kindBadge: Record<Suggestion['kind'], string> = { question: 'Question', 'case-study': 'Case study', page: 'Page' };

/**
 * What to offer while someone types, mixed: questions the notes really have, and case studies or pages. Questions
 * come first when one is a strong match; otherwise whichever scores higher. Both kinds are kept in the list when both exist.
 * `loose` lowers the bar for the no-match page ("closest on this site"), where only plausible rows are shown.
 */
export function suggest(text: string, n = 5, opts: { loose?: boolean } = {}): Suggestion[] {
  const qs: Suggestion[] = suggestQuestions(text, n).filter(h => (opts.loose ? h.score >= 1.4 : true)).map(h => ({ kind: 'question', id: h.entry.id, title: h.entry.q, desc: '', href: askHref(h.entry.id), entry: h.entry, score: h.score }));
  const ss: Suggestion[] = searchSite(text, { live: true, min: SITE_SUGGEST_MIN }).map(h => ({ kind: h.item.type, id: h.item.id, title: h.item.title, desc: h.item.desc, href: h.item.route, score: h.score }));
  const all = [...qs, ...ss].sort((a, b) => b.score - a.score);
  const out = all.slice(0, n);
  // keep both kinds visible when both exist
  if (out.length >= 3) {
    if (!out.some(s => s.kind === 'question') && qs[0]) out[out.length - 1] = qs[0];
    else if (!out.some(s => s.kind !== 'question') && ss[0]) out[out.length - 1] = ss[0];
  }
  return out;
}
