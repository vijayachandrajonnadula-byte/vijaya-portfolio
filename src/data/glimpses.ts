/**
 * The short clips shown on the home page work cards (src/components/studio/GlimpseVideo.tsx).
 * Each file is /videos/projects/<id>.webm: silent, 6 to 9 seconds, loops, recorded from the real prototype
 * or panned across the project's real screens. `label` says what it shows, in one plain sentence.
 * A clip that is missing simply falls back to the poster image.
 */
export interface Glimpse {
  id: string;
  /** Still image used as the poster: the project's existing work image. */
  poster: string;
  label: string;
}

export const glimpses: Glimpse[] = [
  { id: 'pulse-design-system', poster: '/images/work/pulse-design-system.jpg', label: 'Browsing the PULSE component gallery and its states' },
  { id: 'electronic-execution', poster: '/images/work/electronic-execution.jpg', label: 'Recording a step in the Electronic execution prototype' },
  { id: 'afs-enterprise-workflow', poster: '/images/projects/afs/screens/afs-screen-01.png', label: 'Moving through the Account Fit Score configuration screens' },
  { id: 'zoominfo-schedule', poster: '/images/projects/schedule/screens/schedule-07-create-filled.png', label: 'Moving through the Schedule setup screens' },
  { id: 'caresync', poster: '/images/projects/caresync/cover.jpg', label: 'Scrolling the CareSync shift briefing' },
  { id: 'renewly', poster: '/images/projects/renewly/clean/desktop-dashboard.jpg', label: 'Scrolling the Renewly renewal dashboard' },
  { id: 'riverside-general', poster: '/images/projects/riverside/clean/desktop-home.jpg', label: 'Booking an appointment in the Riverside prototype' },
  { id: 'ai-workflow', poster: '/images/projects/ai-workflow/cover.jpg', label: 'The build workflow from brief to deployed prototype' },
];

export const glimpseOf = (id: string) => glimpses.find(g => g.id === id);
