import { knowledge, type Entry, type Group } from './knowledge';

/** The ask page shows six topics instead of nine groups. Each topic is a set of knowledge groups. */
export type TopicId = 'journey' | 'work' | 'how' | 'career' | 'hiring' | 'fun';

export interface Topic {
  id: TopicId;
  title: string;
  /** One plain line, shown on the topic card. Must describe what is really inside. */
  blurb: string;
  groups: Group[];
}

export const topics: Topic[] = [
  { id: 'journey', title: 'My journey', blurb: 'From electronics to design: study, courses and first briefs.', groups: ['The journey'] },
  { id: 'work', title: 'My work', blurb: 'Projects and case studies, one question each.', groups: ['The work'] },
  { id: 'how', title: 'How I work', blurb: 'Process, research, design systems, accessibility, AI, tools.', groups: ['How I work', 'Skills and tools'] },
  { id: 'career', title: 'Career', blurb: 'Where I have worked and what I did there.', groups: ['Career'] },
  { id: 'hiring', title: 'Hiring', blurb: 'Roles, location, resume and how to get in touch.', groups: ['Hiring'] },
  { id: 'fun', title: 'Stories and fun', blurb: 'Short stories (labelled as fiction), tall tales and my timeline.', groups: ['Just for fun', 'Stories', 'Tall tales'] },
];

export const topicById = (id: string | null | undefined): Topic | undefined => topics.find(t => t.id === id);

/** Questions in a topic, in the order they are written in knowledge.ts. */
export const topicEntries = (t: Topic): Entry[] => knowledge.filter(e => t.groups.includes(e.group));

export const topicOfEntry = (e: Entry): Topic => topics.find(t => t.groups.includes(e.group))!;

/**
 * "Start here": the four questions most visitors want first (Pareto).
 * Who are you, which projects first, how do you use AI, how do we get in touch.
 * Ids, never text, so a click always opens its own answer.
 */
export const startHereIds = ['who', 'w-first', 'h-ai', 'hire-start'] as const;

/** The popover shows only the first two. */
export const guideStarterIds = ['w-first', 'hire-start'] as const;
