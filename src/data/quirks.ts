/**
 * The playful copy in one place: electronics wit that sits on top of a clean page.
 * Rules (see docs/copy-guidelines.md): plain first, wit second. Every label must make sense to someone with
 * no electronics background; the electronics flavour lives in the styling and in the jokes underneath a clear
 * label. Never about Vijay's life beyond the facts on this site (studied Electronics and Communication
 * Engineering at IIIT Nuzvid, 2017 to 2021, alongside design work). The important buttons and links never get
 * a joke for a label.
 */
import { spotlight } from './home';

const COUNT_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

export const quirks = {
  theme: {
    tip: 'Switch between light and dark.',
    label: (theme: 'light' | 'dark') => `Theme: ${theme}`,
    led: { light: 'Standby', dark: 'Powered' },
  },

  hero: {
    aside: 'I studied electronics, so I cut the noise and keep the signal.',
  },

  /** Rotating placeholder nudges for the ask box. The first one is the calm default. */
  askNudges: [
    'Ask me anything…',
    'Try: which projects should I see first?',
    'Try: what did electronics teach you about design?',
    'Try: how do you use AI in your work?',
    'Try: what is a pull-up resistor in UX?',
  ],
  /** The electronics chip is mapped to the entry with this question in src/data/knowledge.ts. */
  electronicsChip: 'Electronics to UX: what carried over?',

  guide: {
    placeholders: ['Ask Clay a question…', 'Ask about my work…', 'Ask about my background…'],
    top: 'Not sure where to start? Ask me a question, or open a project.',
    work: `These ${COUNT_WORDS[spotlight.length] ?? spotlight.length} are the ones I’d look at first.`,
    more: 'The rest of my projects, in a shorter list.',
    about: 'That’s the short version. Scroll for my experience, tools and education.',
    contact: 'Want to say hi? I’ll open a draft in your email app.',
    page: 'Reading this one? Ask me anything about it.',
    pagePlaceholder: 'Ask about this project',
    title: 'Ask Clay',
    /** Always shown with the ask box, so nobody mistakes retrieval for a chatbot. */
    honest: 'Answers come from this site’s own notes, not a language model.',
  },

  /** Loading lines for waiting states (the ask page can borrow these). */
  loading: [
    'Looking through my notes…',
    'Finding the right answer…',
    'One moment…',
  ],

  notFound: {
    code: '404',
    kicker: 'Page not found.',
    title: 'That page isn’t here.',
    body: 'The link may be old or mistyped. Head back home or look at the work. The switch below is just for fun.',
    open: 'The switch is off. Clay is on standby.',
    closed: 'Switch on. The LED is lit. The page is still missing, but the mood is better.',
    switchOpen: 'Flip the switch',
    switchClosed: 'Flip it back',
    home: 'Back to home',
    work: 'See the work',
  },

  /** Lines for the footer area, for whoever owns it to pick up. */
  footer: [
    'Built with care and checked twice.',
    'Made in Hyderabad, tested at 390px.',
    'No components were harmed.',
  ],

  datasheet: {
    kicker: 'About Vijay, as a datasheet',
    part: 'VJ-5',
    title: 'Product Designer',
    rev: 'Updated 2026',
    tagline: 'Low noise, high clarity, human-friendly.',
    partHint: 'Press the part number for a surprise.',
    smoke: 'A puff of smoke. Nothing is broken.',
    /** The About tile: the existing true copy, tightened to four sentences. */
    about:
      'I studied Electronics and Communication Engineering at IIIT Nuzvid (2017 to 2021) while already designing. It taught me to think in signals: what is the message, what is the noise, and does the feedback arrive in time? Now I use that habit on people’s problems, designing practical products that turn messy user journeys into clear, testable experiences. I handle the full design cycle myself: understanding the problem, mapping the flow, building in Figma, and handing off something the team can build from.',
    more: { open: 'More about how I work', close: 'Less about how I work' },
    story: [
      'I studied Electronics and Communication Engineering at IIIT Nuzvid, 2017 to 2021, while already designing. It taught me to think in signals: what is the message, what is the noise, and does the feedback arrive in time?',
      'Now I use that habit on people’s problems. I design practical products that turn messy user journeys into clear, testable experiences.',
    ],
    features: [
      'Turns messy user journeys into clear, testable flows',
      'Designs in components first, pages second',
      'Ships working React prototypes, not only static frames',
      'Works in both Figma and TypeScript',
      'AI speeds up the work. The product decisions and the final call stay with me.',
    ],
    ratings: [
      { k: 'Coffee', v: 'Until the build passes' },
      { k: 'Meetings without an agenda', v: 'My patience ends at 30 minutes' },
      { k: 'Misaligned pixels', v: '1 px, and then everyone notices' },
      { k: 'Scope creep', v: 'Welcome for one sprint, no longer' },
    ],
    conditions: [
      { k: 'Brief', v: 'Clear, or at least findable' },
      { k: 'Users', v: 'Real ones, within reach' },
      { k: 'Design system', v: 'A decent one' },
      { k: 'Feedback', v: 'Honest, and early' },
    ],
    specs: [
      { k: 'Based in', v: 'Hyderabad, India' },
      { k: 'Years in the field', v: '5+ in product design' },
      { k: 'Focus', v: 'UX/UI and product design' },
      { k: 'Daily tools', v: 'Figma, React, TypeScript, Storybook' },
      { k: 'Education', v: 'B.Tech, Electronics and Communication Engineering, IIIT Nuzvid, 2017 to 2021' },
    ],
  },

  /** Easter-egg lines, picked at random. */
  eggs: [
    'Another puff. It was only decorative.',
    'Relax. Nothing here is on fire.',
    'Tension released. Back to work.',
  ],
} as const;
