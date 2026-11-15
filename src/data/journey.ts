/**
 * "From signals to screens": the true timeline as a signal chain, drawn on three tracks that really did overlap.
 * Every node is from the resume (public/Vijaya_Chandra_Jonnadula.pdf). `carried` is phrased as how I think about
 * it, never as a claim about what happened. The optional fiction layer is invented, off by default, and always
 * labelled on screen. Nothing is generated at run time.
 */
export type Track = 'study' | 'learning' | 'practice';

export interface JourneyNode {
  id: string;
  track: Track;
  /** The label on the chain. */
  year: string;
  /** The resume's own dates. */
  when: string;
  title: string;
  /** What I was doing, from the resume. */
  doing: string;
  /** How I think about it. An approach, not an event. */
  carried: string;
  /** A one-line wink. */
  wink: string;
  /** Marks the two formal courses. */
  course?: boolean;
  /** Playful line shown between this node and the next when the fiction layer is on. */
  fiction: string;
}

export const trackMeta: Record<Track, { label: string; hint: string }> = {
  study: { label: 'Study', hint: 'Engineering degree' },
  learning: { label: 'Learning', hint: 'Courses' },
  practice: { label: 'Practice', hint: 'Design work' },
};

export const journey: JourneyNode[] = [
  {
    id: 'preuni', track: 'study', year: '2015', when: 'Aug 2015 – May 2017', title: 'Pre-University Course',
    doing: 'Foundational programming at RGUKT-IIIT Nuzvid: Python, C, HTML and CSS.',
    carried: 'How I think about it: seeing how things get built early makes the conversation with engineers easier later.',
    wink: 'Hello, world. Hello, <html>.',
    fiction: 'A semicolon, somewhere, is still missing.',
  },
  {
    id: 'helping-hands', track: 'practice', year: 'Jul 2017', when: 'Jul 2017 – Mar 2020', title: 'Helping Hands, Design Lead',
    doing: 'Led design for a student initiative at RGUKT Nuzvid: communication design, event visuals, posters and campaigns for outreach, volunteering, fundraising and community support.',
    carried: 'How I think about it: a poster has one job and a few seconds to do it, which is a decent school for hierarchy.',
    wink: 'A poster is a one-screen product.',
    fiction: 'A drafting pencil was reportedly harmed by an overly confident gradient.',
  },
  {
    id: 'ece', track: 'study', year: 'Aug 2017', when: 'Aug 2017 – Jul 2021', title: 'B.Tech, Electronics and Communications',
    doing: 'Electronics and Communications Engineering at RGUKT-IIIT Nuzvid, with exposure to Python, C, HTML, CSS, Java, machine learning concepts and experimental technical projects.',
    carried: 'How I think about it: ask what is signal and what is noise, make feedback immediate, and treat anything undefined as a bug waiting to happen.',
    wink: 'Resistance is futile. Tolerance is not.',
    fiction: 'The oscilloscope has no comment.',
  },
  {
    id: 'amigos', track: 'practice', year: 'Jan 2020', when: 'Jan 2020 – Oct 2021', title: 'Amigos Arts, Founder',
    doing: 'Founded and ran a creative design organisation: product design, graphic design, websites, apps, logos, brochures, posters and vector illustrations for clients. Designed Servicle, a mobile servicing app concept for a local vehicle servicing firm, from ideation to UI.',
    carried: 'How I think about it: running planning, client communication and visual design myself teaches what a brief costs.',
    wink: 'Servicle: an app for servicing vehicles, serviced by a design process.',
    fiction: 'The logo, it is said, grew itself a drop shadow overnight.',
  },
  {
    id: 'calarts', track: 'learning', year: 'Oct 2020', when: 'Oct 2020 – Feb 2021', title: 'CalArts UI/UX Specialisation', course: true,
    doing: 'A course, taken in the last year of the degree and while Amigos Arts was running. The resume names it and its dates; I have not written a syllabus here.',
    carried: 'How I think about it: a course is scaffolding for practice. The real test is whether the flow survives real use.',
    wink: 'Course nodes live on their own track, as they should.',
    fiction: 'The wireframes were grey. The grey was extremely confident.',
  },
  {
    id: 'google', track: 'learning', year: 'Mar 2021', when: 'Mar 2021 – Sep 2021', title: 'Google Professional UX Design Certificate', course: true,
    doing: 'A second course, overlapping the end of the degree and Amigos Arts. Finished in Sep 2021, a month before CredAvenue.',
    carried: 'How I think about it: a shared process is useful because the next team already speaks it.',
    wink: 'Finished one month before the next job. Tidy.',
    fiction: 'A sticky note was promoted to “insight”.',
  },
  {
    id: 'degree', track: 'study', year: 'Jul 2021', when: 'Jul 2021', title: 'Degree complete',
    doing: 'B.Tech in Electronics and Communications Engineering finished (Aug 2017 to Jul 2021).',
    carried: 'How I think about it: three tracks that overlapped for years now point the same way, at product design.',
    wink: 'Signal acquired.',
    fiction: 'A cap was thrown. The cap has since been debounced.',
  },
  {
    id: 'credavenue', track: 'practice', year: 'Oct 2021', when: 'Oct 2021 – Jul 2022', title: 'CredAvenue, Product Designer Consultant',
    doing: 'Full-stack product design across web, desktop and mobile: flows, information architecture, sketches, wireframes, prototypes and visual design, plus research, usability testing and design-system consistency.',
    carried: 'How I think about it: three form factors need one design language, or the product forgets who it is.',
    wink: 'Web, desktop, mobile: one system, three screens.',
    fiction: 'The browser, the desktop app and the phone met for coffee. The coffee was responsive.',
  },
  {
    id: 'zoominfo', track: 'practice', year: 'Aug 2022', when: 'Aug 2022 – Jun 2026', title: 'ZoomInfo, UX/UI Designer I',
    doing: 'Four major product areas: Admin Portal, Schedule, ZI Chat and FormComplete, plus design-system contributions, and the AI Enablement team, where I helped teammates with AI-assisted workflows and documented them.',
    carried: 'How I think about it: fast tools are only useful if the process around them can be reviewed and repeated.',
    wink: 'Four product areas, one shared design system.',
    fiction: 'A tooltip once tried to say too much. It was gently shortened.',
  },
  {
    id: 'valgenesis', track: 'practice', year: 'Jul 2026', when: 'Jul 2026 – present', title: 'ValGenesis, Senior UX Designer',
    doing: 'Enterprise product workflows: building and refining React UI screens and components with design-system patterns, and supporting consistency and handoff.',
    carried: 'How I think about it: the design system is the place where design and delivery finally share one source of truth.',
    wink: 'Where the design system learned to talk to machines.',
    fiction: 'The chain is still live. Please do not touch the exposed terminals.',
  },
];
