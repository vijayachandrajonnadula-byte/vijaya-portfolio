/**
 * The playful copy in one place: electronics puns that sit on top of a clean page.
 * Rules: dry, original, never about Vijay's life beyond the facts on this site (studied Electronics and
 * Communication Engineering at IIIT Nuzvid, 2017 to 2021, alongside design work). Clarity first: the
 * important buttons and links never get a joke for a label.
 */
import { spotlight } from './home';

const COUNT_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

export const quirks = {
  theme: {
    tip: 'Toggle the power. Both modes are fully supported.',
    label: (theme: 'light' | 'dark') => `Theme: ${theme}`,
    led: { light: 'Standby', dark: 'Powered' },
  },

  hero: {
    aside: 'Ex-electronics. Still thinks in signals, and lowers the noise.',
  },

  /** Rotating placeholder nudges for the ask box. The first one is the calm default. */
  askNudges: [
    'Ask me anything…',
    'Ask about my signal-to-noise ratio…',
    'Try: how do you debounce a messy brief?',
    'Ask about my pull-up resistor habits…',
    'Try: what is your design system doing at 3 a.m.?',
  ],
  /** The electronics chip is mapped to the entry with this question in src/data/knowledge.ts. */
  electronicsChip: 'Electronics to UX: what carried over?',

  guide: {
    placeholders: ['Say something to Clay…', 'Send Clay a signal…', 'Clay is powered up. Ask away…'],
    top: 'Not sure where to start? Ask me, or open a project. Fully powered up, no magic smoke.',
    work: `These ${COUNT_WORDS[spotlight.length] ?? spotlight.length} are the ones I’d show first. Probed and tested.`,
    more: 'Older and smaller things live here. Still on the bench.',
    about: 'That’s the short version. The datasheet has the rest.',
    contact: 'Want to say hi? I’ll open a draft in your email app. No wiring needed.',
    page: 'Reading this one? Ask me anything about it.',
    pagePlaceholder: 'Ask about this project',
    title: 'Ask Clay',
    /** Always shown with the ask box, so nobody mistakes retrieval for a chatbot. */
    honest: 'Answers come from this site’s own notes, not a language model.',
  },

  /** Loading lines for waiting states (the ask page can borrow these). */
  loading: [
    'Warming up the soldering iron…',
    'Checking for loose connections…',
    'Waiting for the capacitor to charge…',
    'Reading the datasheet, so you do not have to…',
    'Debouncing…',
  ],

  notFound: {
    code: '404',
    kicker: 'Open circuit.',
    title: 'Nothing is connected here.',
    body: 'This page has an open circuit: no current, no content. Close the switch to see what happens, then head somewhere that works.',
    open: 'Switch is open. Clay is running on standby.',
    closed: 'Circuit closed. The LED is lit. The page is still missing, but the mood is better.',
    switchOpen: 'Close the switch',
    switchClosed: 'Open the switch',
    home: 'Back to home',
    work: 'See the work',
  },

  /** Lines for the footer area, for whoever owns it to pick up. */
  footer: [
    'Built with care. Tested for magic smoke.',
    'Designed to stay under its absolute maximum ratings.',
    'No components were harmed. A few were debounced.',
  ],

  datasheet: {
    kicker: 'Datasheet',
    part: 'VJ-5',
    title: 'Product Designer',
    rev: 'Rev 2026',
    tagline: 'Low-noise, high-gain, human-friendly. Hyderabad package.',
    partHint: 'Press the part number. What could go wrong?',
    smoke: 'A small puff of magic smoke escaped. Everything still works.',
    story: [
      'I studied Electronics and Communication Engineering at IIIT Nuzvid, 2017 to 2021, while already designing. So I learned to think in signals: what is the message, what is the noise, and does the feedback arrive before something gets hot.',
      'Now I point that habit at people. I design practical products that turn messy user journeys into clear, testable experiences.',
    ],
    features: [
      'Turns messy user journeys into clear, testable flows',
      'Designs in components first, pages second',
      'Ships working React prototypes, not only static frames',
      'Fluent in both Figma and TypeScript',
      'AI speeds up the work. The product decisions and the final call stay with me.',
    ],
    ratings: [
      { k: 'Coffee', v: 'Until the build passes' },
      { k: 'Meetings without an agenda', v: 'Fuse blows after 30 minutes' },
      { k: 'Misaligned pixels', v: '1 px, and then everyone notices' },
      { k: 'Scope creep', v: 'Derate above one sprint' },
    ],
    conditions: [
      { k: 'Brief', v: 'Clear, or at least findable' },
      { k: 'Users', v: 'Real ones, within reach' },
      { k: 'Design system', v: 'A decent one' },
      { k: 'Feedback', v: 'Honest, and early' },
    ],
    specs: [
      { k: 'Package', v: 'Hyderabad, India' },
      { k: 'Operating experience', v: '5+ years' },
      { k: 'Core function', v: 'UX/UI and product design' },
      { k: 'Interfaces', v: 'Figma, React, TypeScript, Storybook' },
      { k: 'Education', v: 'Electronics and Communication Engineering, IIIT Nuzvid, 2017 to 2021' },
    ],
  },

  /** Easter-egg lines, picked at random. */
  eggs: [
    'Smoke released. It was only decorative.',
    'Do not worry. That was a very small fuse.',
    'Capacitor discharged. Tension relieved.',
  ],
} as const;
