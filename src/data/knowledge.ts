import { projects } from './projects';
import { experience, workflowStages, spotlight } from './home';
import { profile } from './profile';
import metrics from './pulse-metrics.json';
import { quirks } from './quirks';

/**
 * What the ask box can answer. This is retrieval, not generation: every answer is written by Vijay from
 * facts already on this site and in the resume (public/Vijaya_Chandra_Jonnadula.pdf), and the page says so.
 * Nothing here is produced at run time. To teach the box something new, add an entry. Where the resume is
 * silent, the entry says so instead of guessing.
 *
 * Every entry has a stable `id`. Suggestion chips, the browse list and deep links (/ask#q=<id>) all use the
 * id, so a click always shows its own answer. Typed questions go through `search`, which is stricter than a
 * plain keyword match and prefers "no match" to a wrong answer.
 */
export type Group = 'The journey' | 'The work' | 'How I work' | 'Career' | 'Skills and tools' | 'Hiring' | 'Just for fun' | 'Stories' | 'Tall tales';

export const groups: Group[] = ['The journey', 'The work', 'How I work', 'Career', 'Skills and tools', 'Hiring', 'Just for fun', 'Stories', 'Tall tales'];

/** What kind of text an entry is. Only 'true' is a statement of fact about Vijay. */
export type Kind = 'true' | 'parable' | 'tall-tale' | 'analogy';
export const kindLabel: Record<Kind, string> = {
  true: 'From the resume and this site',
  parable: 'Parable: invented, no real people or companies',
  'tall-tale': 'Tall tale: fiction. Mostly. Not a real event',
  analogy: 'Analogy: circuits as a way to think about interfaces',
};
export const isFiction = (e: Entry) => e.kind === 'parable' || e.kind === 'tall-tale';

export interface Entry {
  id: string;
  group: Group;
  /** Defaults to 'true'. Parables and tall tales are invented and are labelled on screen. */
  kind?: Kind;
  /** The canonical question, in natural phrasing. */
  q: string;
  /** A shorter label for suggestion chips, when the question is long. */
  chip?: string;
  /** Synonyms and keywords. Entries with a space are phrases ("design system"). */
  keys: string[];
  /** One to three short paragraphs. The first answers the question directly. */
  answer: string[];
  link?: { label: string; href: string };
  /** Ids of entries worth reading next. */
  related?: string[];
}

const proj = (id: string) => projects.find(p => p.id === id)!;
const featured = spotlight.map(s => proj(s.id));
const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
const featuredCount = NUMBER_WORDS[featured.length] ?? String(featured.length);
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const stages = workflowStages.map(s => s.stage).join(', then ');
const email = profile.email;
const RESUME = '/Vijaya_Chandra_Jonnadula.pdf';
const SILENT = 'That is not something I have written down here. Ask me directly.';
const contactLink = { label: 'Get in touch', href: '/#contact' };

export const knowledge: Entry[] = [
  /* ------------------------------------------------------------------ THE JOURNEY */
  {
    id: 'who', group: 'The journey', q: 'Who is Vijay?', chip: 'Who is Vijay?',
    keys: ['who is vijay', 'who are you', 'introduce yourself', 'about you', 'tell me about yourself', 'introduction', 'who are you', 'about you', 'bio', 'background', 'summary', 'hello', 'hi', 'hey'],
    answer: [
      `I’m Vijay (Vijaya Chandra Jonnadula), a UX and product designer in ${profile.location}. I have more than five years of experience designing enterprise SaaS products, admin portals, scheduling flows, chat experiences and data-heavy interfaces.`,
      'Right now I am a Senior UX Designer at ValGenesis, mixing UX strategy, UI design, design systems, React-based UI work and AI-assisted delivery. I turn messy user journeys into clear, testable experiences.',
    ],
    link: { label: 'About me', href: '/#about' },
    related: ['j-why', 'c-all', 'w-first'],
  },
  {
    id: 'j-why', group: 'The journey', q: 'Why did you move from electronics to design?', chip: 'Why electronics to design?',
    keys: ['why electronics design', 'why switch', 'why pivot', 'why change career', 'career change', 'pivot', 'switch', 'switched', 'transition', 'transitioned', 'moved from ece', 'electronics to design', 'switch from electronics', 'ece to design', 'engineering to design', 'engineer to designer', 'became a designer', 'become a designer', 'end up in design', 'ended up', 'path', 'motivation', 'choose design'],
    answer: [
      'It was less a move than two tracks side by side. I studied Electronics and Communication Engineering at RGUKT-IIIT Nuzvid (Aug 2017 to Jul 2021), and in the same stretch I was designing: Design Lead at Helping Hands from Jul 2017, then founder of Amigos Arts from Jan 2020.',
      'Why design pulled harder than engineering is not written down here, so I won’t guess. What I can say is that both are about getting a clear message through a noisy channel. For the personal version, ask me directly.',
    ],
    link: { label: 'Follow the timeline', href: '/ask#story' },
    related: ['j-story', 'j-carried', 'j-overlap'],
  },
  {
    id: 'j-carried', group: 'The journey', q: quirks.electronicsChip, chip: 'Electronics to UX: what carried over?',
    keys: ['electronics', 'ece', 'carried over', 'carry over', 'what carried', 'what did ece give', 'ece give', 'what ece gave', 'engineering background', 'electronics background', 'electronics help', 'signal', 'signals', 'noise', 'hardware', 'iiit', 'nuzvid', 'communication engineering', 'electronics and communication', 'benefit', 'helped'],
    answer: [
      'Mostly a way of thinking, not a skill list. I still ask what is signal and what is noise on a screen, I want feedback to arrive immediately, and I treat anything left undefined as a bug waiting to happen.',
      'That is my approach, not a claim about any one past project. The degree also gave me exposure to Python, C, HTML, CSS, Java and machine learning concepts, which is why talking to engineers does not feel like a foreign language.',
    ],
    link: { label: 'Read the datasheet', href: '/#about' },
    related: ['j-circuits', 'j-budget', 'h-engineers'],
  },
  {
    id: 'j-preuni', group: 'The journey', q: 'What were the pre-university years about?', chip: 'The pre-university code years',
    keys: ['pre university', 'preuniversity', 'pre-university', 'before engineering', 'programming before college', '2015', 'school years', 'early years', 'first code', 'started coding', 'where did it start', 'beginning'],
    answer: [
      'They were my start in programming. From Aug 2015 to May 2017 I did the Pre-University Course at RGUKT-IIIT Nuzvid, where I first learned Python, C, HTML and CSS.',
      'On the timeline it is the first step: a few lines of code before any pixels. It is a small reason I am comfortable reading a pull request today.',
    ],
    link: { label: 'Follow the timeline', href: '/ask#story' },
    related: ['j-education', 'j-story'],
  },
  {
    id: 'j-education', group: 'The journey', q: 'Where did you study?', chip: 'Where did you study?',
    keys: ['go to college', 'study', 'studied', 'education', 'educated', 'school', 'college', 'university', 'degree', 'graduate', 'graduated', 'btech', 'b.tech', 'bachelor', 'qualification', 'qualifications', 'academic', 'rgukt', 'iiit', 'nuzvid', 'finish degree', 'degree complete'],
    answer: [
      'B.Tech in Electronics and Communications Engineering at RGUKT-IIIT Nuzvid, Aug 2017 to Jul 2021, after the Pre-University Course there (Aug 2015 to May 2017).',
      'Design came through practice and courses beside the degree: the CalArts UI/UX Specialisation and the Google Professional UX Design Certificate.',
    ],
    link: { label: 'Download the resume', href: RESUME },
    related: ['j-preuni', 'j-calarts', 'j-google'],
  },
  {
    id: 'j-firstbrief', group: 'The journey', q: 'Was Helping Hands where design started?', chip: 'Helping Hands, my first design brief',
    keys: ['helping hands', 'first design', 'first brief', 'first design job', 'started designing', 'start designing', 'where did design start', 'where it started', 'earliest', 'student initiative', 'posters', 'campaigns', 'volunteering', 'fundraising', 'outreach', 'event visuals'],
    answer: [
      'On my resume, yes: it is the earliest design role. From Jul 2017 to Mar 2020 I was Design Lead for Helping Hands, a student initiative at RGUKT Nuzvid, making communication design, event visuals, posters and campaigns for outreach, volunteering, fundraising and community support.',
      'It ran alongside the first years of my degree. How I think about it: a poster has one job and a few seconds to do it, which is a decent training ground for interface hierarchy.',
    ],
    link: { label: 'Follow the timeline', href: '/ask#story' },
    related: ['c-helpinghands', 'j-overlap', 'j-story'],
  },
  {
    id: 'j-calarts', group: 'The journey', q: 'Why did you take the CalArts UI/UX Specialisation?', chip: 'The CalArts UI/UX Specialisation',
    keys: ['calarts', 'cal arts', 'california institute of the arts', 'ui ux specialisation', 'ui/ux specialisation', 'specialization', 'specialisation', 'design course', 'design courses', 'design specialisation', 'online course', 'courses', 'coursera', 'ux training', 'training'],
    answer: [
      'I did the CalArts UI/UX Specialisation from Oct 2020 to Feb 2021, in the last year of my degree and while Amigos Arts was running. My resume lists it by name and dates, and that is all I have written down: I will not invent a syllabus.',
      'How I think about a course like this: it is scaffolding for practice, not a substitute for it. That is why every case study on this site shows its testing and its limits, not just the finished screens.',
    ],
    link: { label: 'See it on the timeline', href: '/ask#story' },
    related: ['j-google', 'j-overlap', 'j-story'],
  },
  {
    id: 'j-google', group: 'The journey', q: 'What is the Google UX Design Certificate?', chip: 'The Google UX Design Certificate',
    keys: ['google', 'google ux', 'google certificate', 'google professional', 'ux certificate', 'ux certification', 'certificate', 'certification', 'certifications', 'certified', 'professional certificate', 'credential', 'credentials'],
    answer: [
      'It is a course I completed between Mar 2021 and Sep 2021. It sits at the end of the learning track: it overlapped the last months of my degree and Amigos Arts, and finished just before I joined CredAvenue in Oct 2021.',
      'The resume names the certificate and dates, not the modules, so I will leave it there. Together with CalArts it is the formal-learning half of how I got into design; the other half is shipping work.',
    ],
    link: { label: 'Download the resume', href: RESUME },
    related: ['j-calarts', 'j-education', 'j-story'],
  },
  {
    id: 'j-amigos', group: 'The journey', q: 'What was Amigos Arts, and what is Servicle?', chip: 'Amigos Arts and Servicle',
    keys: ['amigos', 'amigos arts', 'servicle', 'vehicle servicing', 'car servicing', 'servicing app', 'bike servicing', 'studio', 'creative studio', 'own studio', 'founded', 'founder', 'startup', 'freelance', 'freelancing', 'logos', 'brochures'],
    answer: [
      'Amigos Arts was a creative design organisation I founded and ran in Hyderabad from Jan 2020 to Oct 2021. It did product design, graphic design, websites, apps, logos, brochures, posters and vector illustrations for clients.',
      'Servicle is the product piece: a mobile servicing app concept I designed for a local vehicle servicing firm, from ideation to UI. I led planning, client communication and visual design on all of it.',
    ],
    link: { label: 'See the timeline', href: '/ask#story' },
    related: ['c-amigos', 'j-overlap', 's-creative'],
  },
  {
    id: 'j-overlap', group: 'The journey', q: 'How did the degree, Helping Hands, Amigos Arts and the courses overlap?', chip: 'How did all the parallel tracks overlap?',
    keys: ['overlap', 'overlapped', 'parallel', 'parallel tracks', 'at the same time', 'same time', 'alongside', 'while studying', 'balance', 'balanced', 'juggle', 'juggled', 'manage', 'multitask', 'time management', 'tracks', 'three tracks', 'concurrently'],
    answer: [
      'The dates overlap, and I will not smooth that out. Degree: Aug 2017 to Jul 2021. Helping Hands: Jul 2017 to Mar 2020. Amigos Arts: Jan 2020 to Oct 2021. CalArts: Oct 2020 to Feb 2021. Google certificate: Mar 2021 to Sep 2021. Study, practice and learning were three tracks running at once.',
      'How I managed the time day to day is not written down here, so ask me directly. The timeline on this page lays all three tracks side by side so you can see where they cross.',
    ],
    link: { label: 'See the three tracks', href: '/ask#story' },
    related: ['j-story', 'j-why', 'j-carried'],
  },
  {
    id: 'j-circuits', group: 'The journey', kind: 'analogy', q: 'What do circuits teach you about interfaces?', chip: 'Circuits, but for interfaces',
    keys: ['circuits', 'circuit', 'learn from circuits', 'circuit principles', 'interfaces', 'signal vs noise', 'signal to noise', 'signal-to-noise', 'noise', 'feedback loop', 'feedback loops', 'debounce', 'debouncing', 'tolerance', 'tolerances', 'engineering principles', 'electronics principles', 'analogy', 'analogies', 'think in signals'],
    answer: [
      'Four borrowed ideas, held as analogies. Signal versus noise: every element either carries the message or competes with it. Feedback loops: an action should answer back at once, or people press again. Debouncing: one intention should count once. Tolerances: design for the sloppy tap and the long name, not only the clean demo.',
      'This is how I think about interface work, not a claim about any specific past project.',
    ],
    link: { label: 'Read the datasheet', href: '/#about' },
    related: ['j-budget', 'j-carried', 'f-pullup'],
  },
  {
    id: 'j-budget', group: 'The journey', kind: 'analogy', q: 'What are power budgets, pull-ups and fuses in UX terms?', chip: 'Power budgets, pull-ups and fuses',
    keys: ['power budget', 'power budgets', 'budget', 'cognitive load', 'attention', 'pull up', 'pull-up', 'pull up resistor', 'sensible defaults', 'defaults', 'default', 'fuse', 'fuses', 'undo', 'confirm step', 'confirmation', 'safety'],
    answer: [
      'Three analogies I use when I design. A power budget is cognitive load: each screen has a limited amount of attention, so spend it on what the person came for. A pull-up resistor is a sensible default: it holds the line at a good level until someone deliberately changes it. A fuse is an undo or confirm step: it blows before the damage spreads.',
      'A real example: ZoomInfo Schedule pre-sets availability to Mon to Fri, 9 to 5, and it has a confirmation when you discard changes. Those are the pull-up and the fuse in one product.',
    ],
    link: { label: 'Open ZoomInfo Schedule', href: proj('zoominfo-schedule').href },
    related: ['f-pullup', 'j-circuits', 'w-schedule'],
  },
  {
    id: 'j-story', group: 'The journey', q: 'Can I see the whole journey from electronics to design?', chip: 'Story: ECE to design',
    keys: ['whole story', 'full story', 'ece story', 'story of your journey', 'journey', 'timeline', 'signal chain', 'from signals to screens', 'long answer', 'in order', 'chronological', 'history', 'life story', 'how did you get here', 'story from electronics to design'],
    answer: [
      'Yes, it is on this page as a timeline of ten steps: pre-university code in 2015, Helping Hands and the degree in 2017, Amigos Arts in 2020, the CalArts and Google courses, then CredAvenue, ZoomInfo and ValGenesis.',
      'Three tracks run side by side (study, learning, practice), because that is how the dates actually fell. Use the arrow keys or the buttons to step along it.',
    ],
    link: { label: 'Open the timeline', href: '/ask#story' },
    related: ['j-why', 'j-overlap', 'c-all'],
  },

  /* ------------------------------------------------------------------ THE WORK */
  {
    id: 'w-first', group: 'The work', q: 'Which projects should I look at first?', chip: 'Which projects first?',
    keys: ['which projects', 'projects first', 'look at first', 'start with', 'best project', 'best work', 'best projects', 'show me your work', 'your work', 'projects', 'portfolio', 'case studies', 'case study', 'examples', 'representative', 'highlights', 'recommend', 'recommended', 'featured'],
    answer: [
      `${featuredCount} I would show first: ${list(featured.map(p => p.title))}.`,
      `There is more under “More projects”: ${list(['ZoomInfo Schedule', 'Riverside General Hospital Booking', 'CareSync Clinical Command Centre', 'Renewly SaaS Renewal Management', 'Illustration Systems & Vector Portraits'])}.`,
    ],
    link: { label: 'See the work', href: '/#work' },
    related: ['w-pulse', 'w-execution', 'h-ai'],
  },
  {
    id: 'w-pulse', group: 'The work', q: 'Tell me about the PULSE design system', chip: 'Tell me about the design system',
    keys: ['pulse', 'design system', 'design systems', 'component library', 'storybook', 'tokens', 'micro templates', 'governance', 'life science', 'life-science', 'regulated software', 'valgenesis design system', 'design system case study'],
    answer: [
      `PULSE is a design system for regulated life-science software. It had a Figma library and product teams, but nothing an AI assistant could read, so I made it AI-readable: more than ${metrics.code.components - (metrics.code.components % 10)} React components built from the Figma spec, micro templates for repeating regions, rules in markdown, a decision layer that maps a job to a component, and governance that keeps it true.`,
      'Product screens built from it have shipped. The case study walks through it in 16 sections, with parts you can play with.',
    ],
    link: { label: 'Open the case study', href: '/projects/pulse-design-system' },
    related: ['w-execution', 'h-system', 'w-impact'],
  },
  {
    id: 'w-execution', group: 'The work', q: 'What is the electronic execution project?', chip: 'What is electronic execution?',
    keys: ['electronic execution', 'execution', 'protocol', 'validation', 'signature', 'e signature', 'esign', 'sign', 'verify', 'verification', 'discrepancy', 'audit trail', 'gxp', 'regulated', 'second person', 'record a step', 'working prototype'],
    answer: [
      'It is a prototype for running a test protocol on screen. In regulated life-science work a protocol is carried out step by step, and every step has to be recorded, signed and checked by someone else. I rebuilt it on the PULSE design system with every function working: recording a step, e-signature, verification by a second person, a discrepancy prompt on a failure, status, metrics, an audit trail, split execution and an assistant that proposes while the person records.',
      'It is a working prototype, not a validated system, and it has not been tested with the people who execute protocols. The decision I stand behind: the assistant never signs.',
    ],
    link: { label: 'Open the case study', href: '/projects/electronic-execution' },
    related: ['w-pulse', 'h-ai-human', 'w-impact'],
  },
  {
    id: 'w-afs', group: 'The work', q: 'What is Account Fit Score?', chip: 'What is Account Fit Score?',
    keys: ['afs', 'account fit', 'account fit score', 'fit score', 'scoring', 'score', 'account scoring', 'condition builder', 'data source', 'retraining', 'model retraining', 'admin portal', 'revops'],
    answer: [
      proj('afs-enterprise-workflow').description,
      'My role was UX/UI design contributor at ZoomInfo. The decision I would point at: two data paths, CRM and CSV, so teams without a connected CRM can start now and move later.',
    ],
    link: { label: 'Open the case study', href: proj('afs-enterprise-workflow').href },
    related: ['w-schedule', 'c-zoominfo', 'h-system'],
  },
  {
    id: 'w-aiflow', group: 'The work', q: 'What is the AI-assisted product build workflow project?', chip: 'The AI-assisted build workflow',
    keys: ['ai workflow', 'build workflow', 'process showcase', 'workflow case study', 'behind the scenes', 'behind-the-scenes', 'one session one task', 'scoped task', 'ci checks', 'preview link', 'preview environment', 'pull request', 'pull requests', 'pr workflow'],
    answer: [
      proj('ai-workflow').description,
      'The rule it demonstrates: one AI session, one scoped task. Narrow sessions give small changes that can be reviewed, accepted or rejected cleanly, and tsc and the build run before every merge.',
    ],
    link: { label: 'Open the workflow case study', href: proj('ai-workflow').href },
    related: ['h-ai', 'h-ai-human', 'h-qa'],
  },
  {
    id: 'w-schedule', group: 'The work', q: 'What is ZoomInfo Schedule?', chip: 'What is ZoomInfo Schedule?',
    keys: ['schedule', 'scheduling', 'calendar', 'calendly', 'chili piper', 'meeting types', 'availability', 'reminder', 'zoominfo marketing', 'discard'],
    answer: [
      proj('zoominfo-schedule').description,
      'My role was UX/UI design contributor at ZoomInfo Marketing. The decision I would point at: availability is pre-set to Mon to Fri, 9 to 5, so most reps go straight to creating their first meeting type.',
    ],
    link: { label: 'Open the case study', href: proj('zoominfo-schedule').href },
    related: ['j-budget', 'w-afs', 'c-zoominfo'],
  },
  {
    id: 'w-riverside', group: 'The work', q: 'What is Riverside General?', chip: 'What is Riverside General?',
    keys: ['riverside', 'riverside general', 'hospital', 'hospital booking', 'booking', 'healthcare', 'appointment', 'appointments', 'doctor', 'doctors', 'patients', 'slot'],
    answer: [
      proj('riverside-general').description,
      'It was a 14-day sprint, and the prototype is live and clickable, so you can test the flow yourself rather than take my word for it.',
    ],
    link: { label: 'Open the case study', href: proj('riverside-general').href },
    related: ['w-caresync', 'w-renewly', 'h-react'],
  },
  {
    id: 'w-caresync', group: 'The work', q: 'What is CareSync?', chip: 'What is CareSync?',
    keys: ['caresync', 'care sync', 'clinical', 'clinician', 'clinicians', 'command centre', 'command center', 'shift', 'shift briefing', 'briefing', 'outpatient', 'aubergine', 'colour semantics'],
    answer: [
      proj('caresync').description,
      'It has a live prototype and a public GitHub repository, so the build is as inspectable as the design.',
    ],
    link: { label: 'Open the case study', href: proj('caresync').href },
    related: ['w-riverside', 'h-a11y', 'h-system'],
  },
  {
    id: 'w-renewly', group: 'The work', q: 'What is Renewly?', chip: 'What is Renewly?',
    keys: ['renewly', 'saas', 'renewal', 'renewals', 'subscription', 'subscriptions', 'finance', 'finance team', 'savings', 'savings tracker', 'renewal risk', 'approval flow', 'software renewals'],
    answer: [
      proj('renewly').description,
      'It has a live prototype and a public GitHub repository, so you can open it on your phone and check the responsive claims.',
    ],
    link: { label: 'Open the case study', href: proj('renewly').href },
    related: ['w-riverside', 'w-caresync', 'h-qa'],
  },
  {
    id: 'w-illustration', group: 'The work', q: 'Do you illustrate too?', chip: 'Do you illustrate too?',
    keys: ['illustration', 'illustrations', 'illustrate', 'illustrator', 'vector', 'vectors', 'portrait', 'portraits', 'wpap', 'draw', 'drawing', 'artwork', 'birthday cards', 'pen tool'],
    answer: [
      proj('illustration-systems').description,
      'It is the strongest evidence for the part of my resume that says creative background: illustration, vector artwork, UI graphics, character design and visual storytelling.',
    ],
    link: { label: 'See the illustrations', href: proj('illustration-systems').href },
    related: ['s-creative', 'f-mascot', 'j-amigos'],
  },
  {
    id: 'w-impact', group: 'The work', q: 'What about impact and metrics?', chip: 'What about impact and metrics?',
    keys: ['impact', 'metrics', 'metric', 'results', 'achieved', 'achievements', 'numbers', 'outcome', 'outcomes', 'roi', 'revenue', 'kpi', 'kpis', 'measure', 'measured', 'success', 'proof', 'evidence', 'statistics'],
    answer: [
      `I have not put outcome numbers on this site where I cannot stand behind them. What I can point to is countable and checkable: PULSE has ${metrics.code.components} components, ${metrics.code.stories} Storybook stories and ${metrics.ai.deviationsLogged} logged deviations from Figma, and the screens built from it have shipped.`,
      'If you want the story behind a number, ask me directly.',
    ],
    link: { label: 'Email me', href: `mailto:${email}` },
    related: ['w-pulse', 'h-qa', 'hire-start'],
  },

  /* ------------------------------------------------------------------ HOW I WORK */
  {
    id: 'h-process', group: 'How I work', q: 'What is your design process?', chip: 'What is your design process?',
    keys: ['process', 'design process', 'approach', 'method', 'methodology', 'steps', 'brief', 'flow first', 'workflow', 'way of working', 'ways of working', 'stages'],
    answer: [
      `My process runs ${stages}.`,
      'I get clear on the problem before opening a tool, build a flow and information architecture before UI, design in components first and pages second, and ship a working prototype link the team can open.',
    ],
    link: { label: 'See the workflow', href: '/#about' },
    related: ['h-research', 'h-system', 'h-qa'],
  },
  {
    id: 'h-research', group: 'How I work', q: 'How do you do user research?', chip: 'How do you do research?',
    keys: ['research', 'user research', 'user interviews', 'interviews', 'interview', 'contextual enquiry', 'contextual inquiry', 'stakeholder workshops', 'workshops', 'personas', 'persona', 'scenarios', 'usability testing', 'usability test', 'testing', 'discovery', 'insights', 'strategy', 'product thinking'],
    answer: [
      'The methods on my resume are contextual enquiry, user interviews, stakeholder workshops, personas, scenarios, usability testing and design critique, held together by product thinking: what problem, for whom, and how would we know it worked.',
      'I should be honest about scale: the portfolio case studies are mostly sprint or reconstructed work, and each one lists what was and was not tested with real users.',
    ],
    link: { label: 'See the case studies', href: '/#work' },
    related: ['h-process', 'h-qa', 'w-impact'],
  },
  {
    id: 'h-system', group: 'How I work', q: 'How do you approach design systems?', chip: 'How do you approach design systems?',
    keys: ['design system approach', 'systems thinking', 'components first', 'reusable components', 'tokens', 'design tokens', 'ui states', 'handoff', 'handoff specs', 'specs', 'consistency', 'patterns', 'component reuse', 'typography'],
    answer: [
      'Components first, pages second. A wrong page usually means a wrong component, so the rule I use on PULSE is: fix the component, never the page.',
      'On my resume that is reusable components, tokens, layout systems, typography, accessibility, UI states, responsive behaviour and handoff specs. At ZoomInfo I contributed to the design system; at ValGenesis I help keep it consistent.',
    ],
    link: { label: 'Open the PULSE case study', href: '/projects/pulse-design-system' },
    related: ['w-pulse', 'h-a11y', 'h-engineers'],
  },
  {
    id: 'h-a11y', group: 'How I work', q: 'How do you handle accessibility?', chip: 'How do you handle accessibility?',
    keys: ['accessibility', 'accessible', 'a11y', 'wcag', 'contrast', 'keyboard', 'screen reader', 'inclusive', 'axe', 'axe core', 'focus', 'reduced motion'],
    answer: [
      'As part of the system, not a final polish step. Accessibility sits on my resume under design systems, alongside tokens and UI states, so it is decided once in the component and inherited everywhere.',
      'The PULSE case study includes an axe-core scan and lists its limits. An automated scan finds some problems, not all, and I do not claim more than I have run.',
    ],
    link: { label: 'Open the PULSE case study', href: '/projects/pulse-design-system' },
    related: ['h-system', 'h-qa', 'w-caresync'],
  },
  {
    id: 'h-engineers', group: 'How I work', q: 'How do you work with engineers?', chip: 'How do you work with engineers?',
    keys: ['engineers', 'engineering team', 'developers', 'developer', 'frontend', 'front end', 'frontend developers', 'work with developers', 'work with engineers', 'working with engineers', 'working with developers', 'collaborate', 'collaboration', 'cross functional', 'cross-functional', 'product managers', 'product manager', 'stakeholders', 'researchers', 'team', 'teammates', 'handoff to developers'],
    answer: [
      'Closely, and in their vocabulary. I partner with product managers, engineers, researchers and stakeholders, and I connect UX thinking with implementation realities: component reuse, React behaviour, responsive layouts, accessibility, PR review, CI checks and release workflows.',
      'At ZoomInfo I worked with frontend developers; at ValGenesis I build and refine React UI screens and components myself, using design-system patterns.',
    ],
    link: { label: 'See the AI-assisted build workflow', href: proj('ai-workflow').href },
    related: ['h-react', 'h-qa', 'c-valgenesis'],
  },
  {
    id: 'h-react', group: 'How I work', q: 'Why do you build React prototypes?', chip: 'Why React prototypes?',
    keys: ['react', 'prototype', 'prototypes', 'prototyping', 'rapid prototyping', 'clickable', 'working prototype', 'code prototype', 'typescript', 'vite', 'deploy', 'deployed', 'vercel', 'static frames', 'clickable prototype'],
    answer: [
      'Because a link people can open on their phone settles arguments that a static frame only starts. A React prototype has real states, real overflow and real keyboard behaviour, and the team can build from it.',
      'Riverside, Renewly and CareSync are deployed prototypes, and Electronic execution runs every function. I use Figma for exploration and handoff, and React where behaviour is the question.',
    ],
    link: { label: 'See the work', href: '/#work' },
    related: ['w-execution', 'w-riverside', 'h-engineers'],
  },
  {
    id: 'h-ai', group: 'How I work', q: 'How do you use AI tools in your work?', chip: 'How do you use AI in your work?',
    keys: ['ai', 'ai tools', 'ai workflow', 'ai assisted', 'ai-assisted', 'use ai', 'using ai', 'claude', 'claude code', 'chatgpt', 'codex', 'cline', 'roo code', 'perplexity', 'prompts', 'prompt', 'agents', 'coding agents', 'copilot', 'llm'],
    answer: [
      'AI tools speed up research framing, visual exploration, implementation and review. I use Claude and Claude Code for exploration, critique, copy, component planning, documentation and QA review, and Codex, Cline and Roo Code for implementation support.',
      'The product decisions, the critique, the testing, the responsive quality and the final call stay with me. I document the prompts, specs and acceptance criteria so the process can be repeated and reviewed.',
    ],
    link: { label: 'Open the workflow case study', href: proj('ai-workflow').href },
    related: ['h-ai-human', 'w-aiflow', 'c-zoominfo'],
  },
  {
    id: 'h-ai-human', group: 'How I work', q: 'Where does a human stay responsible when AI helps?', chip: 'Where does the human stay in charge?',
    keys: ['human', 'responsible', 'responsibility', 'accountable', 'replace', 'replace designers', 'replacing', 'judgement', 'judgment', 'trust ai', 'hallucinate', 'never signs', 'final call', 'review ai', 'ai output', 'ownership', 'in charge'],
    answer: [
      'Everywhere that a decision is made. AI output stays a visible draft until I have reviewed it: I own the product decisions, the UX critique, the testing, the responsive quality and the final acceptance.',
      'The clearest example is Electronic execution, where the assistant proposes and the person records. It never signs, and the signature says the work was AI-assisted.',
    ],
    link: { label: 'Open Electronic execution', href: '/projects/electronic-execution' },
    related: ['h-ai', 'w-execution', 'h-qa'],
  },
  {
    id: 'h-qa', group: 'How I work', q: 'How do you review and QA your work?', chip: 'How do you review and QA?',
    keys: ['qa', 'quality', 'quality assurance', 'review', 'reviews', 'responsive', 'responsive layouts', 'test responsive', 'responsive qa', 'responsive testing', 'mobile', 'mobile testing', '390', '1440', 'overflow', 'critique', 'checks', 'validation checks', 'iteration', 'iteration log', 'quality gates'],
    answer: [
      'Five gates before anything is shared: flow testing, UX critique, responsive QA from 1440 down to 390px, an iteration log of issues from each review round, and a review of any AI-generated code or layout.',
      'On the build side that means type checks and a clean build before every merge, and a preview link the team can open instead of a deck they have to imagine.',
    ],
    link: { label: 'See the workflow', href: proj('ai-workflow').href },
    related: ['w-aiflow', 'h-ai-human', 'h-a11y'],
  },

  /* ------------------------------------------------------------------ CAREER */
  {
    id: 'c-all', group: 'Career', q: 'Where have you worked?', chip: 'Where have you worked?',
    keys: ['experience', 'worked', 'work history', 'work experience', 'career history', 'jobs', 'job history', 'employers', 'employer', 'companies', 'company', 'years of experience', 'how many years', 'how long', 'roles'],
    answer: [
      `More than five years in product design. ${experience.map(e => `${e.role} at ${e.company} (${e.period})`).join('; ')}.`,
      'The timeline on this page puts those five roles beside the degree and the two courses, so you can see how they overlap.',
    ],
    link: { label: 'See the timeline', href: '/#about' },
    related: ['c-valgenesis', 'c-zoominfo', 'j-story'],
  },
  {
    id: 'c-valgenesis', group: 'Career', q: 'What do you do at ValGenesis?', chip: 'What do you do at ValGenesis?',
    keys: ['valgenesis', 'val genesis', 'current job', 'current role', 'currently', 'right now', 'present', 'senior ux designer', 'senior', 'what do you do', 'day to day', 'daily', 'enterprise product', 'current employer'],
    answer: [
      'I am a Senior UX Designer at ValGenesis in Chennai, since Jul 2026. The work is enterprise product workflows: building and refining React UI screens and components with design-system patterns.',
      'I use Claude and Claude Code for exploration, critique, copy, component planning, documentation and QA review, and I support design-system consistency and handoff.',
    ],
    link: { label: 'Open the PULSE case study', href: '/projects/pulse-design-system' },
    related: ['w-pulse', 'h-ai', 'c-zoominfo'],
  },
  {
    id: 'c-zoominfo', group: 'Career', q: 'What did you do at ZoomInfo?', chip: 'What did you do at ZoomInfo?',
    keys: ['zoominfo', 'zoom info', 'zi chat', 'formcomplete', 'form complete', 'ai enablement', 'ai enablement team', 'ux/ui designer i', 'product areas', 'train teammates', 'guide teammates', 'enablement'],
    answer: [
      'UX/UI Designer I, Chennai, Aug 2022 to Jun 2026. I worked across four major product areas: Admin Portal, Schedule, ZI Chat and FormComplete, from flows, information architecture and wireframes to hi-fi screens and prototypes, and I contributed to the design system.',
      'On the AI Enablement team I helped train and guide teammates on end-to-end AI-assisted workflows, and documented the process with prompts, specs, acceptance criteria, PR workflows, CI checks and staging-to-production handoff.',
    ],
    link: { label: 'Open Account Fit Score', href: proj('afs-enterprise-workflow').href },
    related: ['w-afs', 'w-schedule', 'h-ai'],
  },
  {
    id: 'c-credavenue', group: 'Career', q: 'What did you do at CredAvenue?', chip: 'What did you do at CredAvenue?',
    keys: ['credavenue', 'cred avenue', 'product designer consultant', 'consultant', 'consulting', 'full stack product design', 'full-stack', 'web desktop mobile', 'fintech'],
    answer: [
      'Product Designer Consultant in Chennai, Oct 2021 to Jul 2022: full-stack product design across web, desktop and mobile. Flows, information architecture, sketches, wireframes, prototypes and visual design.',
      'It also included research, usability testing and keeping the design system consistent.',
    ],
    link: { label: 'See the timeline', href: '/ask#story' },
    related: ['c-zoominfo', 'j-google', 'c-all'],
  },
  {
    id: 'c-amigos', group: 'Career', q: 'What did you do as founder of Amigos Arts?', chip: 'My role as founder of Amigos Arts',
    keys: ['founder role', 'amigos founder', 'ran a company', 'ran a studio', 'business', 'client communication', 'clients', 'client work', 'product designer illustrator', 'planning'],
    answer: [
      'Founder, Product Designer and Illustrator in Hyderabad, Jan 2020 to Oct 2021. I founded and ran the design organisation, led planning and client communication, and did the visual design on product, graphic, web and app work.',
      'It is also where the vector illustration habit lives: logos, brochures, posters and illustrations for clients.',
    ],
    link: { label: 'See the illustrations', href: proj('illustration-systems').href },
    related: ['j-amigos', 's-creative', 'c-all'],
  },
  {
    id: 'c-helpinghands', group: 'Career', q: 'What was your role at Helping Hands?', chip: 'My role at Helping Hands',
    keys: ['design lead', 'helping hands role', 'helping hands design lead', 'student initiative role', 'community support', 'communication design'],
    answer: [
      'Design Lead at Helping Hands, a student initiative at RGUKT Nuzvid, from Jul 2017 to Mar 2020. I led design for communication, event visuals, posters and campaigns.',
      'The material supported outreach, volunteering, fundraising and community support, and ran alongside my degree.',
    ],
    link: { label: 'See the timeline', href: '/ask#story' },
    related: ['j-firstbrief', 'c-all', 'j-overlap'],
  },

  /* ------------------------------------------------------------------ SKILLS AND TOOLS */
  {
    id: 's-tools', group: 'Skills and tools', q: 'What design tools do you use?', chip: 'What tools do you use?',
    keys: ['tools', 'tool', 'design tools', 'what tools', 'tools you use', 'software', 'figma', 'miro', 'notion', 'illustrator', 'photoshop', 'adobe', 'xd', 'indesign', 'excel', 'acrobat', 'vs code', 'toolbox', 'tool stack', 'skills', 'skill', 'core skills'],
    answer: [
      'Figma first, with Miro for mapping, VS Code for the build side, and Adobe Illustrator, Photoshop, XD and InDesign for graphics and illustration. Notion, Excel and Acrobat keep the documents in order.',
      'Beyond tools, my core skills are UX and product design, research and strategy, design systems, and AI and implementation workflows.',
    ],
    link: { label: 'Download the resume', href: RESUME },
    related: ['s-code', 'h-ai', 'h-research'],
  },
  {
    id: 's-code', group: 'Skills and tools', q: 'Do you code?', chip: 'Do you code?',
    keys: ['code', 'coding', 'programming', 'programmer', 'developer skills', 'javascript', 'html', 'css', 'python', 'java', 'git', 'github', 'ci', 'staging', 'production', 'technical skills', 'technical awareness', 'languages', 'tech stack'],
    answer: [
      'Enough to build and to review. My resume lists React, HTML, CSS, JavaScript, Python, Java and C, plus Git, GitHub, CI checks and staging-to-production workflow, and this portfolio is React and TypeScript.',
      'I do not replace engineers. The point is a shared language: I can read a pull request, build a working prototype and say what a layout will do at 390px.',
    ],
    link: { label: 'Visit GitHub', href: profile.github },
    related: ['h-react', 'h-engineers', 'j-carried'],
  },
  {
    id: 's-creative', group: 'Skills and tools', q: 'What is your creative background?', chip: 'My creative background',
    keys: ['creative', 'creative background', 'character design', 'visual storytelling', 'vector artwork', 'ui graphics', 'art', 'artist', 'strengths', 'strength', 'ambiguity', 'iterative improvement', 'additional strengths', 'visual design'],
    answer: [
      'Illustration, vector artwork, UI graphics, character design and visual storytelling, built up through Amigos Arts, Helping Hands and a lot of Illustrator.',
      'It sits beside a working comfort with ambiguity, cross-functional feedback, stakeholder expectations and iterative improvement. The mascot on this site, Clay, is drawn by hand.',
    ],
    link: { label: 'See the illustrations', href: proj('illustration-systems').href },
    related: ['w-illustration', 'f-mascot', 'j-amigos'],
  },

  /* ------------------------------------------------------------------ HIRING */
  {
    id: 'hire-roles', group: 'Hiring', q: 'What roles are you looking for?', chip: 'What roles fit?',
    keys: ['roles', 'role', 'looking for', 'hiring', 'hire', 'hire you', 'open to', 'opportunities', 'opportunity', 'job opening', 'what roles', 'which roles', 'fit', 'position', 'positions', 'job search', 'recruiter', 'recruiting'],
    answer: [
      `${profile.status}. The fit is UX/UI and product design, design systems, and AI-enabled product delivery, mainly on enterprise SaaS, admin tools and data-heavy interfaces.`,
      'My current title is Senior UX Designer; what level or scope you have in mind is a conversation, so email me.',
    ],
    link: contactLink,
    related: ['hire-bring', 'hire-start', 'hire-resume'],
  },
  {
    id: 'hire-bring', group: 'Hiring', q: 'What would you bring to a team?', chip: 'What would you bring to a team?',
    keys: ['bring', 'bring to a team', 'value', 'strengths on a team', 'why hire', 'why should we hire', 'pitch', 'selling point', 'differentiator', 'unique', 'what makes you different', 'good at'],
    answer: [
      'Five years of enterprise SaaS design with a bias for clarity: flows that make sense, systems that stay consistent, and prototypes people can click through.',
      'And a bridge between design and delivery: I partner with PMs, engineers and researchers, I can build in React, and I use AI tools to move faster while keeping the critique and the final call.',
    ],
    link: { label: 'Download the resume', href: RESUME },
    related: ['hire-roles', 'h-engineers', 'h-ai'],
  },
  {
    id: 'hire-where', group: 'Hiring', q: 'Where are you based?', chip: 'Where are you based?',
    keys: ['where', 'location', 'city', 'based', 'hyderabad', 'india', 'live', 'lives', 'country', 'remote', 'relocate', 'relocation', 'timezone', 'time zone', 'available', 'availability', 'where are you'],
    answer: [
      `I am based in ${profile.location}. ${profile.status}.`,
      'Whether a role is remote, hybrid or on site, and notice periods, are not written down here, so ask me directly.',
    ],
    link: contactLink,
    related: ['hire-roles', 'hire-unwritten', 'hire-contact'],
  },
  {
    id: 'hire-contact', group: 'Hiring', q: 'How can I contact you?', chip: 'How can I contact you?',
    keys: ['contact', 'email', 'e mail', 'reach', 'reach you', 'message', 'linkedin', 'github profile', 'get in touch', 'touch', 'talk to you', 'write to you', 'address', 'social', 'phone', 'phone number', 'call', 'number', 'whatsapp'],
    answer: [
      `Email is the fastest: ${email}. I am also on LinkedIn and GitHub, and the resume is a download away.`,
      'I do not publish a phone number on this site, so email is the way in.',
    ],
    link: { label: 'Open the contact section', href: '/#contact' },
    related: ['hire-start', 'hire-resume', 'hire-roles'],
  },
  {
    id: 'hire-resume', group: 'Hiring', q: 'Where can I download your resume?', chip: 'Download the resume',
    keys: ['resume', 'resume download', 'download', 'cv', 'curriculum vitae', 'pdf', 'download cv', 'download resume', 'see your resume', 'full resume'],
    answer: [
      'Right here. The resume is a PDF, the same one these notes were written from.',
      'It covers the summary, skills, the five roles, education and the two certifications.',
    ],
    link: { label: 'Download the resume (PDF)', href: RESUME },
    related: ['hire-contact', 'c-all', 'j-education'],
  },
  {
    id: 'hire-start', group: 'Hiring', q: 'How do we start a conversation?', chip: 'How do we start a conversation?',
    keys: ['start a conversation', 'start conversation', 'get started', 'next step', 'next steps', 'work together', 'collaborate with you', 'project enquiry', 'say hi', 'say hello', 'interview', 'schedule a call', 'book a call', 'talk', 'chat', 'contact', 'compose'],
    answer: [
      'Email me with a few lines: who you are, what you are building, and what you want from a designer. The contact section on the home page lists my email, LinkedIn, GitHub and resume. This site has no form and no backend, so nothing is collected here.',
      `You can also write straight to ${email}. A short note with the role and a link is perfect.`,
    ],
    link: contactLink,
    related: ['hire-contact', 'hire-roles', 'hire-resume'],
  },
  {
    id: 'hire-unwritten', group: 'Hiring', q: 'What about salary, notice period or visa?', chip: 'Salary, notice period, visa?',
    keys: ['salary', 'pay', 'compensation', 'ctc', 'rate', 'rates', 'notice period', 'notice', 'visa', 'sponsorship', 'work permit', 'expected salary', 'expectations', 'fees', 'cost', 'price', 'budget for you', 'start date', 'join date', 'when can you join'],
    answer: [
      SILENT,
      'Those details belong in a direct conversation. The email in the contact section is the right door.',
    ],
    link: contactLink,
    related: ['hire-start', 'hire-where', 'hire-roles'],
  },

  /* ------------------------------------------------------------------ JUST FOR FUN */
  {
    id: 'f-component', group: 'Just for fun', q: 'What is your favourite component?', chip: 'Favourite component?',
    keys: ['favourite component', 'favorite component', 'favourite', 'favorite', 'best component', 'component you love', 'most loved', 'pick one component', 'button', 'ui component'],
    answer: [
      'The one I would defend in any meeting: the humble button. It looks trivial, and then you count its states: default, hover, focus, pressed, disabled, loading, and the label that must still fit when someone translates it.',
      'Honourable mention goes to the electronic signature in PULSE, because a component that says who signed what, and when, deserves respect.',
    ],
    link: { label: 'Open the PULSE case study', href: '/projects/pulse-design-system' },
    related: ['w-pulse', 'h-system', 'f-pullup'],
  },
  {
    id: 'f-pullup', group: 'Just for fun', kind: 'analogy', q: 'What is a pull-up resistor in UX?', chip: 'What is a pull-up resistor in UX?',
    keys: ['pull up resistor ux', 'pull up resistor', 'pull-up resistor', 'resistor', 'resistors', 'pull up in ux', 'pull-up'],
    answer: [
      'In a circuit it holds a line at a sensible level until something deliberately pulls it the other way. In an interface, it is a good default.',
      'The pull-up habit in practice: ZoomInfo Schedule starts availability at Mon to Fri, 9 to 5. Most people never touch it, and the few who differ change it on purpose.',
    ],
    link: { label: 'Open ZoomInfo Schedule', href: proj('zoominfo-schedule').href },
    related: ['j-budget', 'j-circuits', 'f-component'],
  },
  {
    id: 'f-power', group: 'Just for fun', q: 'Why is the theme switch a power switch?', chip: 'Why a power switch for the theme?',
    keys: ['theme switch', 'power switch', 'dark mode', 'light mode', 'dark theme', 'light theme', 'theme', 'toggle', 'standby', 'powered', 'led', 'switch'],
    answer: [
      'Because I could not resist, and because it is still a plain, honest toggle. Light mode shows Standby, dark mode shows Powered, and both are fully supported.',
      'Your choice is remembered in your browser, and it follows your system setting until you pick. The case-study pages stay light for now, so the switch hides there.',
    ],
    link: { label: 'Back to the home page', href: '/' },
    related: ['f-trace', 'f-mascot', 'j-circuits'],
  },
  {
    id: 'f-trace', group: 'Just for fun', q: 'What is the Trace?', chip: 'What is the Trace?',
    keys: ['trace', 'the trace', 'line down the side', 'left line', 'gutter', 'circuit line', 'scroll line', 'footer led', 'pcb', 'copper'],
    answer: [
      'The thin line down the left edge of the home page. It looks like a trace on a circuit board: it lights up as you scroll, passes a marker at each section, and ends at the LED in the footer.',
      'It is decoration with a job: it shows how far through the page you are. It does not scroll for you.',
    ],
    link: { label: 'See it on the home page', href: '/' },
    related: ['f-power', 'f-mascot', 'j-circuits'],
  },
  {
    id: 'f-mascot', group: 'Just for fun', q: 'Is the mascot a robot?', chip: 'Is the mascot a robot?',
    keys: ['mascot', 'clay', 'robot', 'character', 'who is clay', 'what is clay', 'the guide', 'eyes', 'led eyes', 'cute', 'bot', 'chatbot', 'who am i talking to'],
    answer: [
      'Clay is an original character I drew, with LED eyes, so it has robot manners. It blinks, breathes and follows your pointer only while it is on screen and your system allows motion.',
      'It is not a chatbot, either. Clay shows you the door and the notes behind it do the answering, which is why every answer here is written by me, not generated.',
    ],
    link: { label: 'Back to the home page', href: '/' },
    related: ['f-power', 's-creative', 'f-trace'],
  },

  /* ------------------------------------------------------------------ STORIES (not facts: every one is labelled) */
  {
    id: 'st-menu', group: 'Stories', kind: 'true', q: 'Tell me a story', chip: 'Tell me a story',
    keys: ['tell me a story', 'story', 'stories', 'tale', 'tales', 'parable', 'parables', 'fable', 'fables', 'fiction', 'something funny', 'funny', 'joke', 'jokes', 'make me laugh', 'entertain me', 'bedtime', 'anecdote', 'read me something', 'surprise me with a story', 'a design parable', 'design parable'],
    answer: [
      'Gladly. I keep a small shelf of made-up stories about design. They are fables and fiction, not events from my life, and every one is labelled on its card.',
      'Parables: The Parable of the Debounced Button, The Fuse That Saved the Sprint, The Day the Signal Went Quiet, Impedance Matching at the Handoff. Tall tales: Clay Learns to Read a Datasheet, Vijay and the Noisy Dashboard, The Breadboard Years, Three Resistors Walk Into a Design Review. Press “Random story” in the list below to be surprised.',
    ],
    related: ['st-debounce', 'st-clay', 'st-dashboard'],
  },
  {
    id: 'st-debounce', group: 'Stories', kind: 'parable', q: 'The Parable of the Debounced Button', chip: 'The Debounced Button',
    keys: ['debounced button', 'parable of the debounced button', 'button fired twice', 'double charge', 'paid double', 'double click', 'double submit'],
    answer: [
      'A button once lived in a checkout. It was a fine button. But it had a flaw: it believed every press was a brand new wish. One evening a traveller pressed Pay, and nothing seemed to happen, so she pressed it again, and then once more for luck. The button granted all three wishes. The traveller was charged three times, and the button was very proud of its responsiveness.',
      'The elders gave the button a small virtue: patience. Now, after one press it goes quiet, shows “Paying…”, and ignores its own echo.',
      'Takeaway: show state straight away and make an action count once. Silence invites a second click.',
    ],
    related: ['st-fuse', 'j-circuits', 'f-pullup'],
  },
  {
    id: 'st-fuse', group: 'Stories', kind: 'parable', q: 'The Fuse That Saved the Sprint', chip: 'The Fuse That Saved the Sprint',
    keys: ['fuse that saved the sprint', 'saved the sprint', 'undo versus confirm', 'confirm dialog', 'confirm dialogs', 'are you sure', 'delete button', 'deleted everything'],
    answer: [
      'In the kingdom of Almost-Done, a Delete button sat next to Save, and both wore the same colour. Each Friday somebody pressed the wrong one. The kingdom answered with a dialog: “Are you sure?” Everyone clicked Yes without reading, as everyone does, and the dialog became furniture.',
      'Then a quiet engineer fitted a fuse. Delete now worked instantly, and a small bar said “Deleted. Undo” for ten seconds. The Friday disasters stopped, because a mistake you can reverse is no longer a disaster.',
      'Takeaway: prefer undo to “are you sure?”. Keep confirmations for the things that truly cannot be taken back.',
    ],
    related: ['st-debounce', 'j-budget', 'st-quiet'],
  },
  {
    id: 'st-quiet', group: 'Stories', kind: 'parable', q: 'The Day the Signal Went Quiet', chip: 'The Day the Signal Went Quiet',
    keys: ['signal went quiet', 'day the signal went quiet', 'empty state', 'empty states', 'blank screen', 'nothing to show', 'no results'],
    answer: [
      'There was once a dashboard for a new customer, and on her first morning it showed one thing: a large, perfectly aligned, completely blank rectangle. She waited. She refreshed. She decided the product was broken and left to tell her friends.',
      'The blank was not broken. It was merely mute. Later the team gave the blank a voice: a line saying what would appear here, a button for the first thing to do, and a small picture of how it would look when full. The same empty screen now said hello.',
      'Takeaway: an empty state is a screen to design, not an absence. Say what is missing and what to do next.',
    ],
    related: ['st-fuse', 'st-dashboard', 'j-circuits'],
  },
  {
    id: 'st-impedance', group: 'Stories', kind: 'parable', q: 'Impedance Matching at the Handoff', chip: 'Impedance Matching at the Handoff',
    keys: ['impedance matching', 'impedance matching at the handoff', 'handoff parable', 'design to dev handoff story', 'lost in translation', 'handoff mismatch'],
    answer: [
      'Two people, a designer and a developer, stood on opposite banks of a river called Handoff. The designer shouted “It is obvious!” across the water. The developer heard “It is obnoxious” and built something very cautious.',
      'Power travels best between matched ends, said the old electricians, so the two banks built a bridge: tokens named the same on both sides, a component for each repeating thing, states written out, and a preview link in place of a deck. The signal crossed with almost no loss, and everybody went home on time.',
      'Takeaway: shared names, written states and a working preview do more for a handoff than any amount of shouting.',
    ],
    related: ['h-engineers', 'h-system', 'st-resistors'],
  },
  {
    id: 'st-clay', group: 'Tall tales', kind: 'tall-tale', q: 'Clay Learns to Read a Datasheet', chip: 'Clay Learns to Read a Datasheet',
    keys: ['clay learns to read a datasheet', 'clay first day', 'clay on a design team', 'clay datasheet', 'clay first day on a design team', 'mascot first day'],
    answer: [
      'Fiction. Mostly. Any resemblance to real incidents is a bug.',
      'On its first morning at the design team, Clay, the LED-eyed mascot, was handed a datasheet and told, “Read the absolute maximum ratings,” the limits a part must never exceed. Clay read every one, then asked the team to stay below them. “Maximum meetings per day,” it said, “is four.” Nobody had ever thought to write that down, and by lunch four became the law. The datasheet filled in: coffee, derated at 3 p.m.; sprint scope, do not exceed. Clay blinked twice, which in Clay means approved.',
      'Takeaway: limits written down are kinder than limits discovered. Say what the system can take.',
    ],
    related: ['f-mascot', 'st-resistors', 'st-menu'],
  },
  {
    id: 'st-dashboard', group: 'Tall tales', kind: 'tall-tale', q: 'Vijay and the Noisy Dashboard', chip: 'Vijay and the Noisy Dashboard',
    keys: ['noisy dashboard', 'vijay and the noisy dashboard', '47 charts', 'forty seven charts', 'dashboard with too many charts', 'dashboard tall tale', 'too many charts'],
    answer: [
      'Fiction. Mostly. Any resemblance to real incidents is a bug.',
      'Once upon a Monday, a dashboard arrived with 47 charts and one question, which was: “Are we okay?” Vijay, the character in this tale, sat the dashboard down and asked what it wanted to say. After a long silence the dashboard said, “Okay.” So the 47 charts became one sentence, one number, and three links for the curious. The dashboard felt lighter. The other 46 charts were given their own tab, where they were visited on rare days, like relatives.',
      'Takeaway: start from the question the person is asking. Put the answer first and the evidence one click behind it.',
    ],
    related: ['st-quiet', 'j-circuits', 'st-menu'],
  },
  {
    id: 'st-breadboard', group: 'Tall tales', kind: 'tall-tale', q: 'The Breadboard Years', chip: 'The Breadboard Years',
    keys: ['breadboard', 'breadboard years', 'the breadboard years', 'prototyping tall tale', 'prototype tall tale', 'jumper wires'],
    answer: [
      'Fiction. Mostly. This tells you nothing about any real lab, class or person.',
      'In the mythical Breadboard Years, a prototype was a tangle of jumper wires, and the only user test was whether the LED lit. Legend says the first rule of the era was: build the smallest thing that can fail, and let it. The wires were loud and the lessons were quick. Nobody framed the breadboard. They all remembered it, though, every time a Figma frame got to 200 layers and someone asked, quietly, “Can we just make it blink?”',
      'Takeaway: prototype the risky part first and cheaply. A thing you can try beats a thing you can describe.',
    ],
    related: ['h-react', 'j-carried', 'st-menu'],
  },
  {
    id: 'st-resistors', group: 'Tall tales', kind: 'tall-tale', q: 'Three Resistors Walk Into a Design Review', chip: 'Three Resistors Walk Into a Design Review',
    keys: ['three resistors', 'three resistors walk into a design review', 'resistors walk into', 'resistors design review', 'design review joke'],
    answer: [
      'Fiction. Mostly. Any resemblance to real incidents is a bug.',
      'Three resistors walk into a design review. The first says, “I limit the current.” The second says, “I divide the voltage.” The third says nothing and just sits in the corner, holding a line high. The reviewer asks, “What does that one do?” The first two answer together: “Not much, but nothing works without it.” The reviewer writes “sensible defaults” on the whiteboard and underlines it twice. The meeting ends early. The fuse, who was only invited as an observer, nods.',
      'Takeaway: the unglamorous parts, defaults and limits, hold the most weight. Review them first.',
    ],
    related: ['f-pullup', 'st-fuse', 'st-clay'],
  },
];

const BY_ID = new Map(knowledge.map(e => [e.id, e]));
export const entryById = (id: string | null | undefined): Entry | undefined => (id ? BY_ID.get(id) : undefined);

/* ------------------------------------------------------------------------------------------ search */

const STOP = new Set(
  'a an the and or of to in on at is are was were be been am it its i me my mine we our us you your yours he she his her they them their this that these those do does did done have has had will would can could should may might shall what whats which who whom whose when where why how tell show give me please just really also very about any some more than then there here with for from into out so if as by not no yes want need like know get got let lets ask asking'.split(' '),
);

/** Words so common on this site that matching on them alone should not decide anything. */
const GENERIC = new Set(['work', 'worked', 'design', 'designer', 'ux', 'ui', 'project', 'projects', 'vijay', 'vijaya', 'role', 'use', 'used', 'using', 'make', 'made', 'good', 'new', 'thing', 'things', 'one', 'time', 'people', 'product', 'products']);

const STORY_INTENT = new Set(['story', 'tale', 'parable', 'fable', 'fiction', 'funny', 'joke', 'anecdote']);
const norm = (s: string) => s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9+#]+/g, ' ').trim();
const stem = (w: string) => (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') ? w.slice(0, -1) : w);
const toks = (s: string) => norm(s).split(' ').filter(Boolean).map(stem);
const content = (s: string) => toks(s).filter(w => !STOP.has(w) && (w.length > 1 || w === 'c'));

interface Prepared { entry: Entry; keyWords: Set<string>; phrases: string[]; qWords: Set<string>; body: string; qNorm: string }
const prepared: Prepared[] = knowledge.map(entry => {
  const keyWords = new Set<string>();
  const phrases: string[] = [];
  for (const k of entry.keys) {
    const t = toks(k);
    if (t.length === 1) keyWords.add(t[0]!);
    else if (t.length > 1) { phrases.push(t.join(' ')); t.filter(w => !STOP.has(w) && !GENERIC.has(w)).forEach(w => keyWords.add(w)); }
  }
  return { entry, keyWords, phrases, qWords: new Set(content(entry.q)), body: ' ' + toks(entry.answer.join(' ')).join(' ') + ' ', qNorm: toks(entry.q).join(' ') };
});

export interface Hit { entry: Entry; score: number }

/** The lowest score that counts as an answer. Below it the page shows "no match" and offers real suggestions. */
export const MIN_SCORE = 2.9;

/**
 * Rank entries for a typed question. Exact question text wins outright. Otherwise: phrase keys score most,
 * then single key words, then words from the entry's own question; generic words score little, prefixes a
 * little more than the answer text, and unmatched words in the question lower the score, so a question the
 * notes do not cover falls below MIN_SCORE rather than landing on a loosely related entry.
 */
export function search(question: string): Hit[] {
  const nq = ' ' + toks(question).join(' ') + ' ';
  const words = content(question);
  const hits: Hit[] = [];
  for (const p of prepared) {
    if (nq.trim() === p.qNorm) { hits.push({ entry: p.entry, score: 100 }); continue; }
    let score = 0, matched = 0;
    for (const w of words) {
      const generic = GENERIC.has(w);
      let s = 0;
      if (p.keyWords.has(w)) s = generic ? 0.8 : 3;
      else if (p.qWords.has(w)) s = generic ? 0.6 : 2;
      else if (w.length >= 5 && [...p.keyWords].some(k => k.length >= 5 && (k.startsWith(w) || w.startsWith(k)))) s = generic ? 0.4 : 1.4;
      else if (w.length >= 5 && p.body.includes(' ' + w)) s = 0.5;
      if (s > 0) matched += s >= 1 ? 1 : 0.4;
      score += s;
    }
    let phrase = 0;
    for (const ph of p.phrases) if (nq.includes(' ' + ph + ' ')) phrase += 3.5 + ph.split(' ').length;
    // Invented stories only answer when someone asks for a story or names one, never a factual question.
    if (isFiction(p.entry) && !phrase && !words.some(w => STORY_INTENT.has(w))) continue;
    score += Math.min(phrase, 12);
    if (!score) continue;
    const coverage = words.length ? Math.min(1, matched / words.length) : 1;
    score *= 0.7 + 0.3 * coverage;
    hits.push({ entry: p.entry, score: +score.toFixed(2) });
  }
  return hits.sort((a, b) => b.score - a.score);
}

/** The best entry for a typed question, or null when nothing in the notes is close enough. */
export function bestMatch(question: string): { entry: Entry | null; hits: Hit[] } {
  const hits = search(question);
  const top = hits[0];
  return { entry: top && top.score >= MIN_SCORE ? top.entry : null, hits };
}

/**
 * "Suggested next questions" for an answer. Entries it names in `related` come first, then others that
 * share non-generic keys. Questions already shown are skipped.
 */
export function relatedQuestions(entry: Entry, asked: string[] = [], n = 2): Entry[] {
  const skip = new Set(asked);
  const named = (entry.related ?? []).map(id => BY_ID.get(id)).filter((e): e is Entry => !!e && !skip.has(e.q) && !skip.has(e.id));
  const out = [...named];
  if (out.length < n) {
    const mine = new Set(entry.keys);
    const rest = knowledge
      .filter(k => k !== entry && !out.includes(k) && !skip.has(k.q) && !skip.has(k.id))
      .map((e, i) => ({ e, i, s: e.keys.reduce((a, k) => a + (mine.has(k) ? 1 : 0), 0) }))
      .sort((a, b) => b.s - a.s || a.i - b.i);
    out.push(...rest.map(r => r.e));
  }
  return out.slice(0, n);
}

/**
 * The suggestion chips. Each carries the id of the entry it opens, so a click always shows its own answer.
 * Eight candidates, three shown at a time, in this order: story, work, AI, hiring, courses, stories, work, fun.
 */
export const suggestionIds = ['j-story', 'w-first', 'h-ai', 'hire-start', 'j-calarts', 'st-menu', 'w-pulse', 'f-pullup'] as const;
export const suggestionPool: { id: string; label: string }[] = suggestionIds.map(id => {
  const e = BY_ID.get(id)!;
  return { id, label: e.chip ?? e.q };
});

/** Where a chip or list item sends the visitor. */
export const askHref = (id: string) => `/ask?id=${encodeURIComponent(id)}`;
