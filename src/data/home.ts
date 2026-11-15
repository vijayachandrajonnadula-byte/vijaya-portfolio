import { projects } from './projects';
import pulseMetrics from './pulse-metrics.json';

/* Editable home page content. Copy lives here, layout lives in the components. */

/** Optimised images generated into public/images. 1400w for large frames, 640w for previews. */
export const workImage = (id: string) => `/images/work/${id}.jpg`;
export const thumbImage = (id: string) => `/images/thumb/${id}.jpg`;

/** The four projects shown as bento groups. Order is the order on the page. */
export const spotlight = [
  { id: 'pulse-design-system', tint: '#a9c0f2', prop: 'blocks', line: 'A design system AI could not read, made AI-readable: components, micro templates, rules and governance.' },
  { id: 'electronic-execution', tint: '#f6cdb4', prop: 'calendar', line: 'Running a validation protocol on screen: record, sign, verify, with an assistant that proposes and never signs.' },
  { id: 'afs-enterprise-workflow', tint: '#c9bdf0', prop: 'dial', line: 'Configuring how an AI scores accounts, inside an enterprise admin portal.' },
  { id: 'ai-workflow', tint: '#b9e3cf', prop: 'spark', line: 'From brief to deployed prototype, with AI speeding up the work and me making the calls.' },
] as const;

/**
 * The interactive work previews on the home page (src/components/work/WorkCard.tsx). Order is the order on the page.
 * Every line is taken from the project's own data or case study: problem, role, users and the decision with its reason.
 * `proof` is a plain fact (a count, a status or a stated target), never an invented result.
 */
export interface WorkPreview {
  id: string;
  layout: 'wide' | 'side' | 'band';
  status: string;
  problem: string;
  role: string;
  users: string;
  decision: string;
  why: string;
  proof: string;
  stack: string[];
}

export const workPreviews: WorkPreview[] = [
  {
    id: 'pulse-design-system',
    layout: 'wide',
    status: 'Complete',
    problem: 'A design system for regulated life-science software that AI could not read.',
    role: 'Senior UX Designer',
    users: 'Product teams building regulated life-science software',
    decision: 'Fix the component, never the page.',
    why: 'A wrong page means a wrong component. It is slower per screen and faster overall.',
    proof: `${pulseMetrics.code.components} React components · ${pulseMetrics.ai.deviationsLogged} deviations from Figma logged`,
    stack: ['Figma', 'React', 'Storybook'],
  },
  {
    id: 'afs-enterprise-workflow',
    layout: 'side',
    status: 'Complete',
    problem: 'Make configuring an AI account-scoring model approachable for people who are not ML practitioners.',
    role: 'UX/UI Design Contributor, ZoomInfo',
    users: 'RevOps and sales operations teams',
    decision: 'Two data paths: CRM and CSV.',
    why: 'One path dead-ends teams whose CRM is not connected yet. CSV lets them start now and move later.',
    proof: 'Dev-ready screens, Q4 2023',
    stack: ['Figma', 'Admin Portal', 'IA'],
  },
  {
    id: 'zoominfo-schedule',
    layout: 'side',
    status: 'Complete',
    problem: 'Reps were sending prospects to Calendly or Chili Piper, outside the outreach flow.',
    role: 'UX/UI Design Contributor, ZoomInfo Marketing',
    users: 'Sales reps and account executives',
    decision: 'Availability is pre-set to Mon to Fri, 9 to 5.',
    why: 'Most reps work standard hours, so they can go straight to creating their first meeting type.',
    proof: 'Design target: set up in a few minutes',
    stack: ['Figma', 'Settings UI', 'IA'],
  },
  {
    id: 'electronic-execution',
    layout: 'wide',
    status: 'Working prototype',
    problem: 'Run a validation protocol on screen: record each step, sign it, verify it and raise discrepancies.',
    role: 'Senior UX Designer',
    users: 'People who execute, verify and review validation protocols',
    decision: 'The assistant never signs.',
    why: 'AI output stays a visible draft. Recording it is a person’s action, and the signature says it was AI-assisted.',
    proof: 'Every function working · built on PULSE',
    stack: ['React', 'PULSE', 'E-signature'],
  },
  {
    id: 'ai-workflow',
    layout: 'band',
    status: 'Process',
    problem: 'AI is fast, and open-ended AI sessions produce diffs nobody can review.',
    role: 'UX/UI Designer + Product Builder',
    users: 'Anyone who picks up the repo or reviews the work',
    decision: 'One AI session, one scoped task.',
    why: 'Narrow sessions give small, auditable changes that can be accepted or rejected cleanly.',
    proof: 'tsc and vite build before every merge',
    stack: ['Claude', 'Codex', 'GitHub PRs'],
  },
];

/** Everything else, shown as a list with a hover preview. */
export const moreIds = ['zoominfo-schedule', 'riverside-general', 'caresync', 'renewly', 'illustration-systems'] as const;

/** Tools named on the page. Order is loose on purpose. */
/**
 * Which featured case studies name each tool, taken only from what those case studies and AGENTS.md already say.
 * A tool missing here is simply not listed by any of the four. Used by the bill of materials filter in About.
 */
export const projectTools: Record<string, readonly string[]> = {
  'pulse-design-system': ['Figma', 'React', 'Storybook', 'TypeScript'],
  'electronic-execution': ['React', 'TypeScript'],
  'afs-enterprise-workflow': ['Figma'],
  'ai-workflow': ['Claude', 'Codex', 'GitHub', 'React', 'TypeScript', 'Figma'],
};

export const toolBand = ['Figma', 'Storybook', 'React', 'TypeScript', 'Claude', 'FigJam', 'Codex', 'Miro', 'Figma AI', 'GitHub', 'Maze', 'Roo Code'];

export const manifesto =
  'I design practical digital products that turn {{messy user journeys}} into {{clear, testable experiences.}} Research first, built to a system, shipped as {{working prototypes}} you can open and click through.';

/** Numbers are derived from real data where possible. Years comes from the About copy (5+). */
export const stats = [
  { value: 5, suffix: '+', label: 'Years in product design' },
  { value: projects.length, suffix: '', label: 'Projects documented' },
  { value: projects.filter(p => p.prototypeUrl).length, suffix: '', label: 'Live, clickable prototypes' },
  { value: 390, suffix: 'px', label: 'Smallest width I QA down to', from: 1440 },
] as const;

export const capabilities = [
  {
    title: 'UX clarity',
    desc: 'Before I open Figma, I know what each screen needs to do. Messy flows become clear steps, and every design decision has a reason behind it.',
  },
  {
    title: 'UI systems',
    desc: 'I design in systems, not one-offs. Reusable components and consistent patterns mean teams can keep shipping without rebuilding the UI from scratch.',
  },
  {
    title: 'AI-assisted speed',
    desc: 'I use Claude, Figma AI, and coding agents to move fast through research, design, and build. Everything gets reviewed by me before it goes anywhere.',
  },
  {
    title: 'Prototype mindset',
    desc: 'I ship React prototypes that stakeholders can click through and test. An actual URL they can open on their phone, not a screenshot in a slide deck.',
  },
  {
    title: 'Responsive QA',
    desc: 'Before anything leaves my desk, I test it at desktop, tablet, and mobile. Overflow, tap targets, text size. The small things that break trust if you miss them.',
  },
];

export const workflowStages = [
  {
    stage: 'Brief',
    title: 'Product brief',
    story: 'Get clear on the actual problem before opening any tool. What is the user trying to do? What is in scope and what is not?',
    task: 'Get clear on the problem, scope, and user goals',
    ai: ['ChatGPT', 'Claude', 'Perplexity'],
    output: 'Scoped product brief',
  },
  {
    stage: 'Flow',
    title: 'Flow and IA',
    story: 'Build a user flow and IA map before touching UI. This is where the real product decisions get made.',
    task: 'Map the user journey and information architecture',
    ai: ['Miro', 'FigJam'],
    output: 'User flow + IA diagram',
  },
  {
    stage: 'Design',
    title: 'Interface system',
    story: 'Design a component system that works across all screens. Components and patterns first, full pages second.',
    task: 'Design reusable UI patterns and a component library',
    ai: ['Figma', 'Figma AI', 'Claude Design'],
    output: 'Component library + design system',
  },
  {
    stage: 'Build',
    title: 'Working prototype',
    story: 'Build a working React prototype with real screens and real interactions. Something you can actually open and use.',
    task: 'Scope and build a React prototype',
    ai: ['Claude', 'Roo Code', 'Cline', 'Codex', 'React', 'TypeScript'],
    output: 'Working React prototype',
  },
  {
    stage: 'Review',
    title: 'Review and QA',
    story: 'Go through the full flow, test on mobile, and fix what is broken. Critique comes from me, not from the model.',
    task: 'UX walkthrough, mobile testing, and iteration',
    ai: ['GitHub PRs', 'Storybook', 'Maze'],
    output: 'Refined, responsive UI',
  },
  {
    stage: 'Handoff',
    title: 'Handoff notes',
    story: 'Document the work properly and ship a preview link the team can open, instead of a deck they have to imagine.',
    task: 'Document the work and prepare for implementation',
    ai: ['GitHub', 'Preview environment'],
    output: 'Shareable prototype link',
  },
] as const;

/** What gets checked before anything is shared (formerly the Validation section). */
export const qualityGates = [
  { title: 'Flow testing', desc: 'I walk through every user path before sharing. Each screen has to make sense on its own and connect properly to the next.' },
  { title: 'UX critique', desc: 'I review every screen for clarity, visual hierarchy, and anything that feels off or incomplete.' },
  { title: 'Responsive QA', desc: 'I test on desktop, tablet, and mobile. From 1440 down to 390px. If it overflows or breaks, it gets fixed before anything ships.' },
  { title: 'Iteration log', desc: 'I track issues from each review round and address them properly rather than patching over them.' },
  { title: 'AI output review', desc: 'Any AI-generated code or layout gets reviewed before it goes in. I use AI to move fast, not to skip the review.' },
];

export const experience = [
  { company: 'ValGenesis', role: 'Senior UX Designer', period: 'Jul 2026 – Present', note: 'Enterprise product UX, React UI, design systems, AI-assisted delivery' },
  { company: 'ZoomInfo', role: 'UX/UI Designer I', period: 'Aug 2022 – Jun 2026', note: 'Admin Portal, Schedule, ZI Chat, FormComplete, AI Enablement' },
  { company: 'CredAvenue', role: 'Product Designer Consultant', period: 'Oct 2021 – Jul 2022', note: 'Web, desktop & mobile product design' },
  { company: 'Amigos Arts', role: 'Founder / Product Designer', period: 'Jan 2020 – Oct 2021', note: 'Product design, illustration, client delivery' },
  { company: 'Helping Hands', role: 'Design Lead', period: 'Jul 2017 – Mar 2020', note: 'Communication design, visual campaigns' },
];

export const skillGroups = [
  { label: 'Design', skills: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe XD', 'Adobe After Effects', 'Adobe InDesign'] },
  { label: 'UX & research', skills: ['UX Research', 'User Flows', 'Information Architecture', 'UI Design', 'Design Systems', 'Wireframing', 'Responsive QA'] },
  { label: 'Build', skills: ['React', 'TypeScript', 'Vite', 'CSS', 'React Router', 'GitHub'] },
  { label: 'AI-assisted', skills: ['Claude', 'ChatGPT', 'Perplexity', 'Figma AI', 'Roo Code', 'Cline', 'Codex'] },
  { label: 'Collaboration', skills: ['Notion', 'Miro', 'FigJam', 'Jira', 'Maze', 'Storybook', 'Zeplin', 'Vercel'] },
];

export const closingLine = 'Let’s make the next step obvious.';
