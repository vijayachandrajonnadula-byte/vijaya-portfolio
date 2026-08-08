import type { DemonstratesItem, ResearchInsight } from './caseStudies';

export interface IAColumn {
  label: string;
  items: string[];
}

export interface RenewlyScreen {
  src: string;
  caption: string;
  title: string;
  purpose: string;
  uxNote: string;
}

export interface RenewlyMobileScreen {
  src: string;
  caption: string;
  title: string;
  purpose: string;
  responsiveDecision: string;
}

export const renewlyCaseStudy = {
  id: 'renewly',
  title: 'Renewly SaaS Renewal Management',
  subtitle:
    'A responsive SaaS renewal management case study. Finance teams review subscriptions, track renewal risk, approve decisions, and spot savings opportunities. Built as a working React prototype.',
  tags: [
    'UX/UI Design',
    'SaaS Dashboard',
    'Responsive Product Design',
    'Design System',
    'Product Flow',
    'AI-assisted Workflow',
    'React Prototype',
  ],
  prototypeUrl: 'https://renewly-ux.vercel.app/',
  githubUrl: 'https://github.com/vijayachandrajonnadula-byte/renewly-ux',

  snapshot: {
    role: 'UX/UI Designer, product thinker, prototype builder',
    timeline: 'Portfolio sprint',
    platform: 'Responsive web and mobile',
    tools: 'Figma, Claude Design, React, TypeScript, GitHub, Vercel',
    focus: 'SaaS renewal tracking, approval workflows, savings review, and responsive product design',
  },

  demonstrates: [
    {
      title: 'Product thinking',
      body: 'Structured Renewly around real SaaS renewal tasks: monitoring spend, reviewing risk, checking approval status, and deciding what action should happen next.',
    },
    {
      title: 'UX decision-making',
      body: 'Reduced renewal complexity by grouping information into overview, detail, status, action, and reporting areas.',
    },
    {
      title: 'Responsive design',
      body: 'Adapted the product from desktop dashboards and tables into mobile cards, bottom navigation, sticky topbar, and simplified decision flows.',
    },
    {
      title: 'Design-system thinking',
      body: 'Used reusable cards, buttons, status chips, metric cards, navigation states, forms, and mobile action patterns to keep the interface consistent.',
    },
    {
      title: 'AI-assisted workflow',
      body: 'Used AI tools for critique, implementation planning, and portfolio structure while keeping product decisions and final UX judgement human-led.',
    },
    {
      title: 'Implementation readiness',
      body: 'Converted the design direction into a working React/TypeScript portfolio prototype prepared for Vercel deployment.',
    },
  ] as DemonstratesItem[],

  overviewParagraphs: [
    'Renewly is a responsive SaaS renewal management product concept for finance and admin teams. The product helps users review active subscriptions, track upcoming renewals, identify high-risk tools, manage approval queues, and review potential savings opportunities.',
    'The desktop experience uses wider layouts for dashboard summaries, subscription tables, approval lists, reports, and settings. The mobile experience adapts the same product intent into a more focused flow with stacked cards, simplified metrics, bottom navigation, and action-first screens.',
    'The main UX challenge was balancing information density with clarity. Renewal workflows quickly become overloaded with dates, spend, owners, risk labels, approval states, and savings signals. Renewly focuses on keeping priority, status, and next action visible together at the point of decision.',
  ],

  problem:
    'SaaS renewal workflows can become confusing when finance users need to monitor multiple tools, renewal dates, owners, seat usage, approval states, and savings opportunities at the same time. If renewal information is scattered or visually noisy, users may miss deadlines, delay decisions, or approve renewals without enough context.',

  problemHighlight:
    'The user should not have to search for the next step. Renewly should make renewal priority, status, ownership, and action clear at the point of decision.',

  problemQuestions: [
    'What needs attention right now?',
    'Which renewals are high risk?',
    'Who owns the decision?',
    'What approval is pending?',
    'Where can savings be found?',
    'What action should happen next?',
  ],

  goals: [
    {
      title: 'Clarify the main renewal task',
      body: 'Help users quickly understand which subscriptions, renewals, and approvals need attention without scanning every screen.',
    },
    {
      title: 'Improve decision visibility',
      body: 'Keep risk, cost, renewal date, owner, and next action close together so users can act without hunting for context.',
    },
    {
      title: 'Create consistent screen hierarchy',
      body: 'Use reusable cards, tables, badges, filters, and action areas so users do not relearn the interface on every page.',
    },
    {
      title: 'Support responsive access',
      body: 'Make the product understandable across desktop and mobile without simply squeezing desktop tables into mobile screens.',
    },
    {
      title: 'Prepare for implementation',
      body: 'Organise UI screens and components so the product can be converted into a maintainable React/TypeScript portfolio prototype.',
    },
  ],

  researchInsights: [
    {
      title: 'Finance users need status visibility before taking action',
      issue:
        'Users should see whether a renewal is high risk, awaiting finance, approved, or needs owner review before choosing an action. Presenting action buttons without status context leads to low-confidence decisions.',
      response:
        'Status chips and approval labels are placed close to renewal details and action buttons on every screen that supports decision-making.',
    },
    {
      title: 'Users need renewal urgency to be visible',
      issue:
        'Renewal date, days remaining, and cancellation window should not be buried inside dense detail screens. Finance users managing many renewals need urgency to be surfaced early.',
      response:
        'The dashboard, renewal calendar, and subscription detail screens surface renewal timing through metric cards, grouped lists, and date badges.',
    },
    {
      title: 'Savings opportunities need explanation, not just numbers',
      issue:
        'A savings estimate is only useful if the user understands why it exists and what action is recommended. Raw numbers without context are ignored or misread.',
      response:
        'Savings cards show the tool, estimated monthly and annual savings, reason, confidence level, risk level, and recommended action.',
    },
    {
      title: 'Mobile users need action-first summaries',
      issue:
        'Mobile screens cannot simply compress desktop tables. Users reviewing renewals on mobile need summary, status, and primary actions without horizontal scrolling or tiny text.',
      response:
        'Mobile pages use stacked cards, simplified KPI labels, bottom navigation, and shorter action labels such as Approve, Changes, and Reject.',
    },
    {
      title: 'Reusable components reduce visual inconsistency',
      issue:
        'A renewal product has repeated states, cards, owners, tags, dates, and actions across every screen. Inconsistent components make the product harder to scan and trust.',
      response:
        'Renewly uses reusable metric cards, subscription cards, approval cards, status chips, buttons, navigation items, and form rows across all screens.',
    },
  ] as ResearchInsight[],

  userJourneySteps: [
    'Dashboard',
    'Identify high-risk renewal or pending approval',
    'Open subscription detail or approval queue',
    'Review cost, usage, owner, and risk',
    'Choose action',
    'Track decision in calendar, queue, or reports',
  ],

  userJourneyDescription:
    'The flow moves users from a high-level renewal command centre into focused decision screens. The dashboard gives a quick view of spend, upcoming renewals, high-risk tools, and savings opportunities. Detail and approval screens provide enough context for action without overloading the dashboard. Reports and settings support ongoing management and configuration.',

  iaDescription:
    'The information architecture separates overview, monitoring, review, decision, reporting, and configuration. This helps users understand where they are, what each screen is responsible for, and what they can do next without relearning the layout.',

  iaColumns: [
    {
      label: 'Dashboard',
      items: [
        'Monthly spend summary',
        'Upcoming renewals',
        'High-risk renewals',
        'Estimated annual savings',
        'Needs attention',
        'Approval queue preview',
        'Savings opportunities preview',
      ],
    },
    {
      label: 'Subscriptions',
      items: [
        'All SaaS tools',
        'Tool / vendor details',
        'Owner and department',
        'Cost',
        'Renewal date',
        'Seat utilisation',
        'Risk and approval status',
      ],
    },
    {
      label: 'Renewal Calendar',
      items: [
        'Next 30/60/90 day windows',
        'High-risk upcoming renewals',
        'Renewal spend',
        'Monthly grouping',
        'Renewal cards',
      ],
    },
    {
      label: 'Approval Queue',
      items: [
        'Pending approvals',
        'Owner review',
        'Waiting finance',
        'High-risk approvals',
        'Savings under review',
        'Approve / request changes / reject',
      ],
    },
    {
      label: 'Savings',
      items: [
        'Estimated monthly savings',
        'Estimated annual savings',
        'Confidence level',
        'Risk level',
        'Recommended action',
        'Tool details',
      ],
    },
    {
      label: 'Reports & Settings',
      items: [
        'Finance summary',
        'Spend overview',
        'High-risk renewal list',
        'Renewal alerts',
        'Approval rules',
        'Team roles and notifications',
        'Integrations and billing',
      ],
    },
  ] as IAColumn[],

  wireframesDescription:
    'Early wireframes established page responsibility, content hierarchy, and layout structure before any visual decisions were made. The goal was to confirm what each screen should show and how users would move between product areas, not how anything would look. Wireframes covered all eight main screens so that structure could be reviewed before design system work began.',

  wireframeImages: [
    { src: '/images/projects/renewly/wireframes/wireframe-dashboard.png', label: 'Dashboard: command centre layout' },
    { src: '/images/projects/renewly/wireframes/wireframe-subscriptions.png', label: 'Subscriptions: comparison table' },
    { src: '/images/projects/renewly/wireframes/wireframe-renewal-calendar.png', label: 'Renewal calendar: time-based planning' },
    { src: '/images/projects/renewly/wireframes/wireframe-approval-queue.png', label: 'Approval queue: decision list' },
    { src: '/images/projects/renewly/wireframes/wireframe-savings.png', label: 'Savings opportunities: review cards' },
    { src: '/images/projects/renewly/wireframes/wireframe-detail.png', label: 'Subscription detail: focused decision view' },
    { src: '/images/projects/renewly/wireframes/wireframe-reports.png', label: 'Reports: finance summary' },
    { src: '/images/projects/renewly/wireframes/wireframe-settings.png', label: 'Settings: rules and preferences' },
  ],

  uxDecisions: [
    {
      title: 'Dashboard first, details second',
      body: 'The dashboard acts as the renewal command centre. Key metrics, urgent items, approval previews, upcoming renewals, and savings opportunities are all surfaced here so users can identify priority work quickly without opening every subscription individually.',
    },
    {
      title: 'Status and action stay close together',
      body: 'Risk badges, approval states, renewal timing, and action buttons are grouped near the relevant item on every screen. Users should not have to travel across the page after identifying a problem. The next step should already be visible.',
    },
    {
      title: 'Subscriptions use structured comparison',
      body: 'The desktop subscription screen uses a table-style layout for tool, owner, cost, renewal date, usage, risk, approval state, and status. Finance and admin users need to compare many SaaS tools in one view, so the layout prioritises scannable columns over expanded detail cards.',
    },
    {
      title: 'Approval queue supports decision confidence',
      body: 'Approval cards show tool name, risk level, request type, owner, renewal cost, reason, and approve/change/reject actions together. Approval decisions need enough context to feel confident, not just action buttons with no supporting information.',
    },
    {
      title: 'Savings opportunities are framed as review prompts',
      body: 'Savings cards show estimated value, reason, confidence, risk, and recommended action rather than presenting amounts as guaranteed outcomes. This supports responsible decision-making and avoids overpromising on estimated figures.',
    },
    {
      title: 'Mobile screens use mobile-only structure',
      body: 'Mobile layouts use stacked cards, simplified KPI labels, bottom navigation, and focused actions instead of compressed desktop tables. The goal was for mobile to feel designed for its context, not just scaled down from a wider screen.',
    },
    {
      title: 'Design system supports consistent scale',
      body: 'Shared components were used for metric cards, status chips, buttons, cards, navigation, forms, and mobile action areas. This means the product can grow to cover more renewal states and new screens without becoming visually inconsistent.',
    },
  ],

  designSystemDescription:
    'The design system helped Renewly feel consistent across all web and mobile screens. Rather than designing each screen as a one-off layout, the product uses repeated cards, status indicators, spacing rules, buttons, form controls, and navigation patterns drawn from shared foundations.',

  designSystemImages: [
    { src: '/images/projects/renewly/design-system/00-foundations.png', label: 'Foundations and components' },
  ],

  desktopScreenshots: [
    {
      src: '/images/projects/renewly/clean/desktop-dashboard.png',
      caption: 'Dashboard: Renewal command centre with spend, risk, approvals, and savings',
      title: 'Dashboard',
      purpose: 'Provides a high-level view of monthly spend, upcoming renewals, high-risk subscriptions, estimated annual savings, approval queue preview, and urgent renewal signals.',
      uxNote: 'Uses metric cards and grouped lists so users can immediately understand what needs attention without opening individual subscriptions.',
    },
    {
      src: '/images/projects/renewly/clean/desktop-subscriptions.png',
      caption: 'Subscriptions: Structured SaaS tool comparison with renewal and usage data',
      title: 'Subscriptions',
      purpose: 'Allows users to review all SaaS tools across the workspace, compare cost, renewal date, owner, seat utilisation, risk, approval state, and active status.',
      uxNote: 'Desktop table layout supports multi-tool comparison while filters help users narrow to relevant subsets without losing context.',
    },
    {
      src: '/images/projects/renewly/clean/desktop-detail.png',
      caption: 'Subscription Detail: Focused renewal decision view for a single subscription',
      title: 'Subscription Detail',
      purpose: 'Provides a focused view of a single tool, including risk, usage, renewal details, approval workflow, savings estimate, and available actions.',
      uxNote: 'Supports deeper decision-making after a user has identified a high-risk renewal from the dashboard or subscription list.',
    },
    {
      src: '/images/projects/renewly/clean/desktop-renewal-calendar.png',
      caption: 'Renewal Calendar: Time-based renewal planning view',
      title: 'Renewal Calendar',
      purpose: 'Shows upcoming renewals grouped by time window and month so finance teams can plan around deadlines.',
      uxNote: 'Groups renewals into 30/60/90 day windows and highlights high-risk items within each period so urgency is visible before opening individual records.',
    },
    {
      src: '/images/projects/renewly/clean/desktop-approval-queue.png',
      caption: 'Approval Queue: Decision list for owner and finance review',
      title: 'Approval Queue',
      purpose: 'Helps users review pending renewal decisions, owner review requests, finance approvals, high-risk approvals, and savings under review.',
      uxNote: 'Approval information and action buttons are placed together on each card so users can act with full context rather than opening a separate detail view.',
    },
    {
      src: '/images/projects/renewly/clean/desktop-savings.png',
      caption: 'Savings Opportunities: Potential savings cards with recommended actions',
      title: 'Savings Opportunities',
      purpose: 'Highlights potential savings from seat reduction, cancellation, downgrade, or consolidation across the active SaaS tool set.',
      uxNote: 'Each card shows the estimated value, confidence level, risk level, reason, and recommended action. Enough context to make a real decision, not just a number.',
    },
    {
      src: '/images/projects/renewly/clean/desktop-reports.png',
      caption: 'Reports: Finance summary of renewal activity and spend',
      title: 'Reports',
      purpose: 'Summarises monthly spend, upcoming renewal spend, approved renewals, pending decisions, high-risk items, and estimated savings.',
      uxNote: 'Turns renewal operations data into a finance-friendly review format for periodic review cycles.',
    },
    {
      src: '/images/projects/renewly/clean/desktop-settings.png',
      caption: 'Settings: Workspace rules, alerts, roles, and preferences',
      title: 'Settings',
      purpose: 'Lets users configure company profile, renewal alerts, approval rules, team roles, notifications, integrations, and billing preferences.',
      uxNote: 'Settings are organised into labelled sections so configuration work does not compete visually with daily renewal operations.',
    },
  ] as RenewlyScreen[],

  mobileScreenshots: [
    {
      src: '/images/projects/renewly/clean/mobile-dashboard.png',
      caption: 'Mobile Dashboard: Action-first renewal overview for smaller screens',
      title: 'Mobile Dashboard',
      purpose: 'Shows the most important renewal information first: key metrics, high-risk review call to action, needs-attention list, and upcoming renewals.',
      responsiveDecision: 'Desktop summary cards are converted into compact KPI rows and stacked decision lists. The most urgent item leads the screen.',
    },
    {
      src: '/images/projects/renewly/clean/mobile-subscriptions.png',
      caption: 'Mobile Subscriptions: Card-based SaaS tool scanning with cost and usage',
      title: 'Mobile Subscriptions',
      purpose: 'Lets users scan SaaS tools, renewal timing, cost, risk level, and seat usage in a readable card format.',
      responsiveDecision: 'The desktop comparison table becomes individual mobile subscription cards with readable cost, seat progress indicator, and status badge.',
    },
    {
      src: '/images/projects/renewly/clean/mobile-approvals.png',
      caption: 'Mobile Approvals: Compact decision cards with clear actions',
      title: 'Mobile Approvals',
      purpose: 'Allows users to review high-risk approvals and take direct action from mobile: approve, request changes, or reject.',
      responsiveDecision: 'Desktop approval columns become stacked mobile approval cards. Action buttons are large enough to tap confidently.',
    },
    {
      src: '/images/projects/renewly/clean/mobile-detail.png',
      caption: 'Mobile Subscription Detail: Single subscription decision flow on mobile',
      title: 'Mobile Subscription Detail',
      purpose: 'Supports focused review of a single subscription including decision summary, cost, seat usage, approval workflow status, and available actions.',
      responsiveDecision: 'The desktop detail layout is stacked into clear sections with the primary approval action placed prominently at the bottom.',
    },
  ] as RenewlyMobileScreen[],

  aiWorkflow: [
    {
      stage: 'Problem framing',
      title: 'Structured the product brief',
      body: 'ChatGPT and Claude helped structure product questions, identify UX risks, and frame the case study around renewal workflows and finance decision-making.',
      note: 'Human task: Define scope, validate the problem statement, decide what to include or cut',
    },
    {
      stage: 'Visual critique',
      title: 'Reviewed hierarchy and readability',
      body: 'AI tools helped review hierarchy, contrast, spacing, mobile readability, and whether the screens felt professional or overly compressed.',
      note: 'Human task: Review critique results, judge which feedback to act on, and accept or reject suggested changes',
    },
    {
      stage: 'Prototype planning',
      title: 'Supported implementation and deployment',
      body: 'Claude Code, Codex, Roo Code, and Cline supported implementation planning, code refinement, responsive fixes, and Git/Vercel workflow preparation.',
      note: 'Human task: Scope each implementation session, review all outputs, confirm deployment correctness',
    },
    {
      stage: 'Portfolio structure',
      title: 'Mapped screens into case-study format',
      body: 'AI helped map Renewly screenshots into reusable portfolio case-study sections and structure recruiter-friendly storytelling around the product decisions.',
      note: 'Human task: Review structure, confirm accuracy against actual screens, approve final content and order',
    },
    {
      stage: 'Human-led review',
      title: 'Final decisions were human-controlled',
      body: 'All final decisions were reviewed manually against the actual screens, live prototype, mobile responsiveness, and portfolio quality expectations.',
      note: 'Human task: All product decisions, UX judgement, quality acceptance, and final sign-off',
    },
  ],

  technicalDescription:
    'Renewly is implemented as a frontend portfolio prototype using React and TypeScript, hosted through Vercel. The project is organised with reusable routes and screens covering the dashboard, subscriptions, renewal calendar, approval queue, savings opportunities, reports, settings, and subscription detail views. The implementation uses mock data to demonstrate product flows and UI behaviour. It does not include a real backend, authentication, or production SaaS data. The technical focus was not to build a production SaaS platform, but to translate the design into a believable interactive portfolio prototype that demonstrates responsive product thinking and implementation readiness.',

  technicalPoints: [
    'React and TypeScript portfolio prototype with Vite build toolchain',
    'Multi-route SPA covering all main product areas including dashboard, subscriptions, approvals, savings, and settings',
    'Reusable components for metric cards, subscription tables, approval cards, savings cards, and navigation',
    'Design-system CSS tokens for colour, spacing, and typography consistent across all screens',
    'Mock SaaS subscription data with typed TypeScript interfaces, no backend dependency',
    'Responsive CSS covering 1440px desktop, 1024px tablet, 768px tablet/mobile, and 390px mobile',
    'GitHub repository with version-controlled project assets and component structure',
    'Vercel deployment, live portfolio prototype accessible via shareable link',
  ],

  testingFlow: 'Dashboard → Subscriptions → Subscription Detail → Approval Queue → Savings Opportunities → Reports → Settings',

  testingChecklist: [
    'Is the main renewal task visible from the dashboard without searching?',
    'Can users identify high-risk renewals quickly from the overview?',
    'Are renewal statuses understandable without additional context?',
    'Is the next action clear at each screen?',
    'Can users compare subscription details in the subscription list?',
    'Does the mobile version preserve the same product intent as desktop?',
    'Are approval actions easy to find on both desktop and mobile?',
    'Are savings opportunities clearly explained, not just numbers?',
    'Are card and button states consistent across all screens?',
    'Is there any horizontal overflow at mobile breakpoints?',
    'Are tap targets usable at 390px?',
    'Does the design system support future screens without introducing new patterns?',
  ],

  responsiveQADescription:
    'Responsive QA was important because Renewly should not feel like a compressed desktop dashboard on mobile. The mobile experience needs to prioritise core renewal information, next actions, and readable spacing. Finance users reviewing approvals on mobile need the same product clarity as desktop.',

  responsiveQA: [
    { breakpoint: '1440px', label: 'Wide desktop', status: 'Tested' },
    { breakpoint: '1280px', label: 'Laptop', status: 'Tested' },
    { breakpoint: '1024px', label: 'Tablet', status: 'Tested' },
    { breakpoint: '768px', label: 'Tablet / mobile', status: 'Tested' },
    { breakpoint: '430px', label: 'Mobile L', status: 'Tested' },
    { breakpoint: '390px', label: 'Mobile M', status: 'Tested' },
    { breakpoint: '360px', label: 'Small mobile', status: 'Tested' },
  ],

  accessibilityChecklist: [
    'Clear typography hierarchy: metric values, headings, section labels, and metadata are visually distinguishable',
    'Sufficient colour contrast: primary text, buttons, and status chips remain readable against light backgrounds',
    'Readable form labels: filters, settings controls, and form fields use clear labels rather than placeholder-only patterns',
    'Non-colour-only status communication: risk and approval states include text labels, not only colour cues',
    'Large mobile tap targets: mobile buttons, tabs, and bottom navigation items are sized for confident tapping',
    'Readable mobile spacing: cards and actions remain readable without horizontal scrolling at 390px',
    'Clear active/selected states: active navigation, selected tabs, and approval statuses are clearly distinguished',
    'Visible focus states planned for production version: keyboard navigation should be supported in a future build',
  ],

  limitations: [
    'Portfolio prototype, not a production SaaS product',
    'Mock data only, no real SaaS backend or live subscription feed',
    'No authentication or real finance user accounts',
    'No real SaaS tool integrations or live renewal data',
    'No production-grade approval routing or notification system',
    'No real usability testing with finance or admin users yet',
    'Limited implemented error, loading, and empty states',
    'Approval and savings workflows are demonstrative, not production-connected',
  ],

  nextSteps: [
    'Add realistic SaaS data scenarios with varied renewal states and edge cases',
    'Add empty, error, loading, and success states for all main screens',
    'Expand subscription detail interactions and owner review flow',
    'Add notification and reminder states for approaching renewal deadlines',
    'Test with finance and admin users in a structured usability session',
    'Validate mobile approval flow with real device testing at multiple sizes',
    'Improve accessibility and add keyboard navigation support',
    'Document component behaviour and design system usage rules',
    'Extend the design system to cover more renewal and approval states',
    'Connect to a real SaaS data backend in a future version',
  ],

  iterations: [
    {
      num: 'Round 01',
      title: 'Dashboard density',
      issue: 'Initial dashboard showed too many metrics at once. The page felt like a spreadsheet rather than a command centre.',
      fix: 'Grouped metrics into four summary cards (spend, upcoming, high-risk, savings) with sub-detail accessible on hover or scroll.',
      why: 'Finance users need orientation first. The dashboard should answer "what needs my attention today" before surfacing all data.',
    },
    {
      num: 'Round 02',
      title: 'Mobile navigation',
      issue: 'Desktop sidebar collapsed into a hidden drawer on mobile, making navigation effectively invisible.',
      fix: 'Replaced desktop sidebar with a bottom tab bar on mobile. Top five navigation items mapped to persistent tabs.',
      why: 'Finance users reviewing approvals on mobile need one-tap access to core screens. A hidden drawer creates friction at the wrong moment.',
    },
    {
      num: 'Round 03',
      title: 'Status chip readability',
      issue: 'Early status chips used only colour to communicate risk state. This was inaccessible and unclear at small sizes.',
      fix: 'Added text labels to all status chips. High risk, Medium risk, Low risk, and Waiting finance are labelled and coloured.',
      why: 'Colour-only communication fails accessibility requirements and causes confusion when chips are viewed quickly across a table.',
    },
    {
      num: 'Round 04',
      title: 'Approval queue context',
      issue: 'Approval cards showed the renewal name and action buttons but not enough context for a confident decision.',
      fix: 'Added cost, renewal date, seat usage, risk level, and owner to each approval card before the action buttons.',
      why: 'Approval decisions made without context lead to rubber-stamping. The card needs to answer the question before the user has to search for it.',
    },
    {
      num: 'Round 05',
      title: 'Mobile table to cards',
      issue: 'Subscription list rendered as a desktop table on mobile. Columns overflowed and text became unreadable.',
      fix: 'Replaced subscription table with stacked mobile cards showing name, status, renewal date, cost, and risk as a vertical list.',
      why: 'Tables built for 1400px collapse unpredictably on 390px. Cards provide a more controlled, scannable format for mobile.',
    },
    {
      num: 'Round 06',
      title: 'Screen hierarchy clarity',
      issue: 'Overview and detail content were mixed on the same screens, making it unclear when to use dashboard vs. subscription detail.',
      fix: 'Reinforced each screen\'s single responsibility: dashboard for priority overview, subscriptions for comparison, detail for action.',
      why: 'Clear screen hierarchy prevents users from hunting for information and reduces cognitive load across the product.',
    },
  ],

  techStack: [
    { label: 'Frontend', value: 'React 18, TypeScript 5, Vite 5' },
    { label: 'Routing', value: 'React Router v6, multi-route SPA' },
    { label: 'Styling', value: 'Custom CSS with design system tokens' },
    { label: 'Data', value: 'Mock SaaS subscription data, no backend' },
    { label: 'Version control', value: 'GitHub, feature branches per phase' },
    { label: 'Deployment', value: 'Vercel, live portfolio prototype' },
  ],

  finalValidation: [
    'Dashboard shows spend, risk, approvals, and savings correctly on desktop and mobile',
    'High-risk subscriptions are identifiable from the dashboard without opening individual detail pages',
    'Subscription detail page provides enough context to make an approval decision',
    'Approval queue actions are reachable and clearly labelled on both desktop and mobile',
    'Savings opportunities include a rationale, not just a number',
    'Mobile screens use cards instead of tables at 390px with no horizontal overflow',
    'Status chips include text labels alongside colour, no colour-only communication',
    'Bottom navigation on mobile provides access to all core sections in one tap',
    'Renewal calendar shows upcoming deadlines in a readable layout on both screen sizes',
    'All screens render without console errors or broken layout states',
  ],

  reflection:
    'Renewly reinforced the importance of building product structure before visual polish. Renewal workflows carry a lot of competing signals: spend, dates, owners, utilisation, risk, approval status, and savings. The interface needed a clear hierarchy before any screen could feel clean. The strongest design direction came from separating overview, comparison, detail, decision, and reporting into distinct screen responsibilities. The dashboard helps users identify priority work, while deeper screens support more confident decisions. The mobile version required a separate layout strategy rather than simply compressing desktop tables. Responsive design means rethinking what information matters most at each screen size, not just resizing components. The next step is to validate the flow with real finance users and extend interaction states: empty states, loading states, errors, confirmations, and owner-review workflows.',
};
