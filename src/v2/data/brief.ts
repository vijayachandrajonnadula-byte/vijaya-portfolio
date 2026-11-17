import { profile } from '../../data/profile';
import { projects } from '../../data/projects';

/**
 * VIJAY.md: the one content model for the v2 film, the reading article, the raw .md file, the index cards and the meta tags.
 * Edit the words here. Rules (docs/copy-guidelines.md): first person, lowercase headings, plain, facts only from the repo and
 * the resume, no invented numbers or outcomes, fiction labelled. `_word_` marks an emotion word (italic serif in the film, *word* in markdown).
 */

export type BeatKind = 'title' | 'statement' | 'principle' | 'list' | 'contact' | 'signoff';
export type ChapterKey = 'paper' | 'clay' | 'violet' | 'pulse' | 'exec' | 'ai' | 'amber' | 'plum' | 'teal' | 'ink';
export type Mark = 'H' | '?' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '±' | '#' | '.';
export type Pose = 'rest' | 'wave' | 'point' | 'hold' | 'think';
export type Prop = 'none' | 'blocks' | 'dial' | 'spark' | 'calendar';

export interface Proof { id: string; label: string; href: string }
export interface LinkItem { label: string; href: string; note?: string }

export interface Beat {
  id: string;
  kind: BeatKind;
  /** The `##` section this beat belongs to (breadcrumb text, without the marks). */
  section: string;
  /** Set on the first beat of a section: the `##` heading and its one-line intro. */
  h2?: string;
  h2Intro?: string;
  /** This beat's own heading (h1 for the title, h2 for sections, h3 for principles). */
  heading: string;
  level: 1 | 2 | 3;
  /** The glyph on the index card and in the scene. */
  mark: Mark;
  chapter: ChapterKey;
  /** Number of the principle (1 to 7), only for kind 'principle'. */
  n?: number;
  paragraphs: string[];
  /** The `>` prompt lines (title) or list items (list kind). */
  prompts?: string[];
  items?: string[];
  /** Small meta line under the title. */
  meta?: string;
  proof?: Proof;
  analogy?: string;
  /** Contact links (contact kind). */
  links?: LinkItem[];
  /** Clay's pose and prop for this beat. */
  pose: Pose;
  prop?: Prop;
  /** One line for the index card. */
  cardLine: string;
  /** Words in this beat, derived (the film's pace). */
  words: number;
  /** Height of the beat's section in viewports (1.3 to 3), derived from the words. */
  length: number;
}

const SITE = `https://${profile.portfolio}`;
const proofOf = (id: string, label?: string): Proof => {
  const p = projects.find(x => x.id === id);
  if (!p) throw new Error(`brief.ts: unknown project id ${id}`);
  return { id, label: label ?? p.title, href: p.href };
};

/** Today, in the file's own voice: "17 november 2026". Computed when the page loads. */
export const lastEdited = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toLowerCase();

const strip = (s: string) => s.replace(/_([^_]+)_/g, '$1');
const count = (parts: (string | undefined)[]) => parts.filter(Boolean).join(' ').split(/\s+/).filter(Boolean).length;

type Draft = Omit<Beat, 'words' | 'length'> & { length?: number };

const drafts: Draft[] = [
  {
    id: 'title', kind: 'title', section: 'VIJAY.md', heading: 'VIJAY.md', level: 1, mark: 'H', chapter: 'paper',
    meta: `designer, ex-electronics. last edited: ${lastEdited}`,
    prompts: [
      'a working brief. notes-to-self, mostly.',
      'not a pitch deck. not a case-study carousel. not a dribbble shot.',
      'scroll, or press space. it reads the same either way.',
    ],
    paragraphs: [],
    pose: 'wave', cardLine: 'a working brief, in the shape of a file',
  },
  {
    id: 'what-this-file-is', kind: 'statement', section: 'what this file is', h2: 'what this file is', heading: 'what this file is', level: 2, mark: '?', chapter: 'clay',
    paragraphs: [
      'a designer\'s artefact is usually a brief. this is mine: what i believe, how i work, and which projects back it up. it is a file because i work in files.',
      'i started in electronics. i studied electronics and communication engineering at IIIT Nuzvid, 2017 to 2021, and kept one habit from it: ask what is _signal_ and what is _noise_. now i ask it about screens, flows and meetings.',
    ],
    pose: 'think', cardLine: 'why a brief, and where the habit comes from',
  },
  {
    id: 'find-the-signal-first', kind: 'principle', n: 1, section: 'the actual job', h2: 'the actual job', h2Intro: 'seven rules i keep re-learning. each one has a project i can point at.',
    heading: 'find the signal first', level: 3, mark: '1', chapter: 'violet',
    paragraphs: [
      'before a screen, a question: who is this for, and what do they already have?',
      'Account Fit Score sets up an AI scoring model for people who are not machine-learning specialists. the answer shaped one decision: two data paths, CRM and CSV. a team without a connected CRM can still start.',
    ],
    analogy: 'in electronics: a filter does not make the signal louder. it removes what was never the message.',
    proof: proofOf('afs-enterprise-workflow'), pose: 'point', cardLine: 'ask who it is for before you draw it',
  },
  {
    id: 'let-the-system-carry-the-weight', kind: 'principle', n: 2, section: 'the actual job',
    heading: 'let the system carry the weight', level: 3, mark: '2', chapter: 'pulse',
    paragraphs: [
      'make a decision once, then make it available everywhere. PULSE is a design system for regulated life-science software. i made it readable by AI tools: more than 90 React components built from the Figma spec, rules in markdown, a decision layer and governance.',
      'the rule i keep: fix the component, never the page. a wrong page means a wrong component.',
    ],
    analogy: 'in electronics: you do not redesign the resistor for every board. you pick a value from the series and move on.',
    proof: proofOf('pulse-design-system'), pose: 'hold', prop: 'blocks', cardLine: 'fix the component, never the page',
  },
  {
    id: 'prototype-to-find-the-truth', kind: 'principle', n: 3, section: 'the actual job',
    heading: 'prototype to find the truth', level: 3, mark: '3', chapter: 'exec',
    paragraphs: [
      'a flow on paper gets nods. a prototype gets objections, and that is the point.',
      'Electronic execution is a validation protocol run on screen: record each step, sign it, have a second person verify it, raise a discrepancy on a failure. it was rebuilt from a prototype on PULSE, with every function working.',
    ],
    analogy: 'in electronics: you breadboard it before you order the board. the datasheet is a claim. the scope is a fact.',
    proof: proofOf('electronic-execution'), pose: 'hold', prop: 'calendar', cardLine: 'a working thing argues better than a slide',
  },
  {
    id: 'let-machines-draft', kind: 'principle', n: 4, section: 'the actual job',
    heading: 'let machines draft, let humans decide', level: 3, mark: '4', chapter: 'ai',
    paragraphs: [
      'AI tools are good at drafts: research framing, visual options, first-pass code, review notes. they do not carry accountability. i use them to go faster, and i keep the decisions: what to build, whether it is clear, whether it works on a phone, when it is done.',
      'the AI-assisted build workflow documents the path from brief to deployed prototype, including the GitHub pull requests and checks.',
    ],
    analogy: 'in electronics: an amplifier gives you gain, not judgement. a person still reads the output.',
    proof: proofOf('ai-workflow'), pose: 'hold', prop: 'spark', cardLine: 'tools draft, i decide',
  },
  {
    id: 'protect-unsaved-work', kind: 'principle', n: 5, section: 'the actual job',
    heading: 'protect unsaved work', level: 3, mark: '5', chapter: 'amber',
    paragraphs: [
      'the cheapest error is the one that costs nothing. in ZoomInfo Schedule, cancel on a half-filled meeting type asks first: discard, or go back. one accidental tap should not wipe five minutes of work.',
      'honestly, i would still like undo more than a confirmation. a confirmation is a fence. undo is a net. the case study records the fence.',
    ],
    analogy: 'in electronics: a fuse is built to fail first, so the rest does not have to.',
    proof: proofOf('zoominfo-schedule', 'ZoomInfo Schedule'), pose: 'point', cardLine: 'a fence, and why i prefer a net',
  },
  {
    id: 'be-tolerant-of-people', kind: 'principle', n: 6, section: 'the actual job',
    heading: 'be tolerant of people', level: 3, mark: '6', chapter: 'plum',
    paragraphs: [
      'people mis-tap, skim, and come back tired. design for that person first.',
      'CareSync is a command centre for outpatient clinicians. it opens on what needs attention before the next patient walks in, not on appointment volumes, and colour carries safety meaning.',
    ],
    analogy: 'in electronics: the old network rule. be strict in what you send, tolerant in what you accept.',
    proof: proofOf('caresync', 'CareSync Clinical Command Centre'), pose: 'rest', cardLine: 'design for the tired person first',
  },
  {
    id: 'close-the-loop', kind: 'principle', n: 7, section: 'the actual job',
    heading: 'close the loop', level: 3, mark: '7', chapter: 'teal',
    paragraphs: [
      'a design is not finished when i like it. it is finished when someone has used it and told me what broke.',
      'Renewly is a renewal-management prototype for finance teams. it was tested on desktop and mobile, and its case study keeps a log of what feedback changed.',
    ],
    analogy: 'in electronics: an open circuit does nothing. close the loop and current flows. the contact switch at the end of this file is that, literally.',
    proof: proofOf('renewly', 'Renewly SaaS Renewal Management'), pose: 'wave', cardLine: 'finished means tested and answered',
  },
  {
    id: 'things-i-am-trying-to-stop-doing', kind: 'list', section: 'things i am trying to stop doing', h2: 'things i am trying to stop doing', heading: 'things i am trying to stop doing', level: 2, mark: '±', chapter: 'ink',
    paragraphs: [],
    items: [
      'polishing screens before the problem is clear',
      'writing "users want" when i mean "i want"',
      'adding a screen when a sentence would do',
      'treating the first AI draft as the answer',
      'leaving the empty, error and slow states until the end',
      'calling it done before it works on a phone',
    ],
    pose: 'think', cardLine: 'six habits, struck out in pencil',
  },
  {
    id: 'things-i-am-trying-to-do-more', kind: 'list', section: 'things i am trying to do more', h2: 'things i am trying to do more', heading: 'things i am trying to do more', level: 2, mark: '±', chapter: 'paper',
    paragraphs: [],
    items: [
      'write down the decision and the reason next to it',
      'draw the unhappy path first',
      'test with one more person than feels necessary',
      'name things plainly, once',
      'stay close to the work after handoff',
      'ship the small version and write what changed',
    ],
    pose: 'point', cardLine: 'six habits, added in ink',
  },
  {
    id: 'say-hello', kind: 'contact', section: 'say hello', h2: 'say hello', heading: 'say hello', level: 2, mark: '#', chapter: 'clay',
    paragraphs: [
      `i am based in ${profile.location}, and open to UX/UI and product design roles.`,
      'email is quickest. the switch below opens a draft in your email app. nothing is sent from this page.',
    ],
    links: [
      { label: profile.email, href: `mailto:${profile.email}`, note: 'email' },
      { label: 'LinkedIn', href: profile.linkedin, note: 'linkedin' },
      { label: 'GitHub', href: profile.github, note: 'github' },
      { label: 'resume (PDF)', href: '/Vijaya_Chandra_Jonnadula.pdf', note: 'resume' },
    ],
    pose: 'hold', cardLine: 'email, links, and the circuit switch',
  },
  {
    id: 'sign-off', kind: 'signoff', section: 'sign-off', h2: 'sign-off', heading: 'sign-off', level: 2, mark: '.', chapter: 'ink',
    paragraphs: [
      'this is a draft that happens to be public. it will change when the work changes my mind. if a line here is wrong, tell me.',
      '_thanks for reading it._',
    ],
    pose: 'wave', cardLine: 'the last line, and a full stop',
  },
];

/** Reading pace: 1.2 viewports plus the words, clamped. The whole film stays under ~20 viewports. */
function lengthFor(words: number): number {
  return Math.round(Math.min(3, Math.max(1.3, 1.1 + words / 190)) * 10) / 10;
}

export const beats: Beat[] = drafts.map(d => {
  const words = count([d.heading, d.meta, d.h2Intro, ...(d.prompts ?? []), ...d.paragraphs, ...(d.items ?? []), d.analogy, d.proof?.label].map(x => (x ? strip(x) : x)));
  return { ...d, words, length: d.length ?? lengthFor(words) };
});

/** Page length in viewports (sum of every beat's section height). */
export const totalViewports = Math.round(beats.reduce((s, b) => s + b.length, 0) * 10) / 10;

export const principles = beats.filter(b => b.kind === 'principle');

/** The index cards: one per beat, plus the file itself (handled by the Index component). */
export const cardLines = beats.map(b => ({ id: b.id, mark: b.mark, title: b.heading, line: b.cardLine }));

/** Removes the `_emotion_` markers: plain text for SEO, aria labels and the raw file's plain parts. */
export const plain = strip;
/** `_word_` to markdown `*word*`. */
const md = (s: string) => s.replace(/_([^_]+)_/g, '*$1*');

const absolute = (href: string) => (href.startsWith('/') ? `${SITE}${href}` : href);

/** The raw VIJAY.md, generated from the same data. */
export function toMarkdown(): string {
  const out: string[] = [];
  for (const b of beats) {
    if (b.kind === 'title') {
      out.push(`# ${b.heading}`, '', b.meta ?? '', '', ...(b.prompts ?? []).map(p => `> ${p}`), '');
      continue;
    }
    if (b.h2) {
      out.push(`## ${b.h2}`, '');
      if (b.h2Intro) out.push(md(b.h2Intro), '');
    }
    if (b.kind === 'principle') out.push(`### ${b.n}. ${b.heading}`, '');
    b.paragraphs.forEach(p => out.push(md(p), ''));
    if (b.items) { b.items.forEach(i => out.push(`- ${md(i)}`)); out.push(''); }
    if (b.analogy) out.push(`> ${md(b.analogy)}`, '');
    if (b.proof) out.push(`proof: [${b.proof.label}](${absolute(b.proof.href)})`, '');
    if (b.links) { b.links.forEach(l => out.push(`- [${l.label}](${absolute(l.href)})`)); out.push(''); }
  }
  out.push('---', '', `last edited: ${lastEdited}. ${profile.location}.`, '');
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

/** The plain article's structure, grouped by `##` section. Used by the reading page and the hidden article in the film. */
export interface ArticleSection { id: string; h2: string; intro?: string; beats: Beat[] }
export function toPlainArticle(): { title: string; meta: string; prompts: string[]; sections: ArticleSection[] } {
  const title = beats[0]!;
  const sections: ArticleSection[] = [];
  for (const b of beats.slice(1)) {
    if (b.h2) sections.push({ id: b.id, h2: b.h2, intro: b.h2Intro, beats: [] });
    sections[sections.length - 1]!.beats.push(b);
  }
  return { title: title.heading, meta: title.meta ?? '', prompts: title.prompts ?? [], sections };
}
