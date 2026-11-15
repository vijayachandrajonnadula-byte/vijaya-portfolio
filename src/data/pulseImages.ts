/**
 * Image slots for the PULSE case study. Every slot has an image. A slot with no `src` shows a labelled
 * placeholder frame instead, so add an image here and nothing else on the page has to change.
 */
export interface Slot { src?: string; alt: string; caption: string; hint: string }

export const pulseImages: Record<string, Slot> = {
  gallery: {
    src: '/images/projects/pulse/storybook.jpg',
    alt: 'The PULSE Storybook with the component list on the left and the Chip story open, showing every variant',
    caption: 'The Storybook, with the component list on the left and the Chip story open.',
    hint: 'Storybook, Chip story, 1600 × 900',
  },
  datagrid: {
    src: '/images/projects/pulse/datagrid.jpg',
    alt: 'The data grid in Storybook with header, sorted column, status cells and row actions',
    caption: 'The data grid in Storybook. Its cells, header and toolbar each have their own variants.',
    hint: 'Storybook, data grid story, 1600 × 900',
  },
  buttonStory: {
    src: '/images/projects/pulse/button-story.jpg',
    alt: 'The Button component in Storybook, showing every variant and colour with live controls underneath',
    caption: 'One component in Storybook: every variant and colour, with live controls for its props.',
    hint: 'Storybook, Button story',
  },
  screenCapability: {
    src: '/images/projects/pulse/screen-capability.jpg',
    alt: 'A capability dashboard built from the design system: summary cards, a trend chart with limits, three category cards and a status grid',
    caption: 'Capability dashboard: KPI cards, a control chart, category summaries and a data grid.',
    hint: 'Capability dashboard, 1440 wide',
  },
  screenParameters: {
    src: '/images/projects/pulse/screen-parameters.jpg',
    alt: 'A parameter monitoring page built from the design system: filters above a grid of eight control charts',
    caption: 'Parameter monitoring: filters over a grid of control charts, with status chips.',
    hint: 'Parameter monitoring, 1440 wide',
  },
  screenTrends: {
    src: '/images/projects/pulse/screen-trends.jpg',
    alt: 'A quality trends page built from the design system: an attribute list, run-rule checks, two control charts and summary figures',
    caption: 'Quality trends: an attribute list beside run-rule checks, control charts and statistics.',
    hint: 'Quality trends, 1440 wide',
  },
  screenReview: {
    src: '/images/projects/pulse/screen-review.jpg',
    alt: 'An annual review dashboard built from the design system: cards, a donut chart, event tiles and three review tables',
    caption: 'Annual review: cards, a donut with legend, event tiles and three review tables.',
    hint: 'Annual review, 1440 wide',
  },
  screenCards: {
    src: '/images/projects/pulse/screen-cards.jpg',
    alt: 'A projects page in card view built from the design system, with a colour stripe and a status chip on each card',
    caption: 'Projects, card view: a workspace card for each record, with its status stripe and chip.',
    hint: 'Projects card view, 1440 wide',
  },
  screenList: {
    src: '/images/projects/pulse/screen-list.jpg',
    alt: 'The same projects as a data grid built from the design system, with link cells, status chips and row actions',
    caption: 'Projects, list view: the same records as a data grid.',
    hint: 'Projects list view, 1440 wide',
  },
  screen: {
    src: '/images/projects/pulse/lifecycle.jpg',
    alt: 'A shipped product screen built only from design system components',
    caption: 'A shipped product screen built only from the system.',
    hint: 'Product screen, 1600 × 1000',
  },
  screenDetail: {
    src: '/images/projects/pulse/lifecycle-detail.jpg',
    alt: 'Detail of the product screen: title, tabs, status filters and the first rows of the data grid',
    caption: 'Detail of the screen: the parts the review loop corrected.',
    hint: 'Detail crop, 1600 × 600',
  },
};
