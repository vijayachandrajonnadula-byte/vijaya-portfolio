import type { TopicId } from '../../data/topics';

/** Small decorative icons for the Ask experience. One grid (24), one stroke (1.8), round caps. Always aria-hidden. */
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false } as const;

export const Chev = ({ dir = 'right' }: { dir?: 'right' | 'left' }) => (
  <svg className="tb-chev" width="18" height="18" {...base} strokeWidth={2.2}>
    <path d={dir === 'right' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export const LinkIcon = () => (
  <svg width="18" height="18" {...base}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1" /></svg>
);

export const CheckIcon = () => (
  <svg width="18" height="18" {...base} strokeWidth={2.2}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);

export const PenIcon = () => (
  <svg width="16" height="16" {...base}><path d="m4 20 1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1Z" /><path d="m14.5 6.5 3 3" /></svg>
);

export const SendIcon = () => (
  <svg width="16" height="16" {...base} strokeWidth={2.2}><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
);

const topicPaths: Record<TopicId, React.ReactNode> = {
  // a path with a start and an end
  journey: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h5a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h5" /></>,
  // stacked screens
  work: <><rect x="3.5" y="5" width="17" height="11" rx="2" /><path d="M8 20h8M12 16v4" /></>,
  // sliders
  how: <><path d="M4 7h9m4 0h3M4 17h3m4 0h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>,
  // briefcase
  career: <><rect x="3.5" y="7.5" width="17" height="12" rx="2" /><path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M3.5 13h17" /></>,
  // envelope
  hiring: <><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  // spark
  fun: <path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6.2 6.2l2.8 2.8M15 15l2.8 2.8M17.8 6.2 15 9M9 15l-2.8 2.8" />,
};

export const TopicIcon = ({ id }: { id: TopicId }) => <svg width="22" height="22" {...base}>{topicPaths[id]}</svg>;
