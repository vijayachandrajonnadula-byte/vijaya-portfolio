import type { DemonstratesItem, ResearchInsight } from './caseStudies';

export interface CareSyncScreen {
  src: string;
  title: string;
  purpose: string;
  uxNote: string;
}

export interface CareSyncMobileScreen {
  src: string;
  title: string;
  uxNote: string;
}

export const caresyncCaseStudy = {
  id: 'caresync',
  title: 'CareSync Clinical Command Centre',
  subtitle:
    'A shift-based clinical command centre for outpatient clinicians. Instead of opening on appointment volumes, CareSync opens on what needs attention before the next patient walks in. Designed and built as a working React prototype.',
  tags: [
    'UX/UI Design',
    'Healthcare',
    'Enterprise SaaS',
    'Product Strategy',
    'Design System',
    'Accessibility',
    'React Prototype',
    'AI-assisted Workflow',
  ],
  prototypeUrl: 'https://care-sync-two-mu.vercel.app/shift-briefing',
  githubUrl: 'https://github.com/vijayachandrajonnadula-byte/care-sync',

  snapshot: {
    role: 'UX/UI & Visual Designer, product thinker, prototype builder',
    timeline: 'Assignment sprint',
    platform: 'Enterprise SaaS web app, desktop-first',
    tools: 'Claude, Claude Code, React, TypeScript, CSS Modules, Procreate, GitHub, Vercel',
    focus: 'Clinical triage, shift handover, records worklist, and operational insight in one clinician workspace',
  },

  demonstrates: [
    {
      title: 'Product thinking',
      body: 'The brief asked for a modern healthcare provider dashboard. I spent the first part of the project questioning whether a dashboard was the right answer at all, and reframed the product around the rhythm of a shift rather than around data categories.',
    },
    {
      title: 'UX decision-making',
      body: 'Built the Now / Next / Later model as the structural spine of the product. Severity, timing, and ownership appear together in every row, so a clinician never visits four screens to understand one piece of information.',
    },
    {
      title: 'Design-system thinking',
      body: 'One token layer, a four-dimension status architecture, and 25+ custom components. Every screen inherits the same visual language, so a new surface never requires re-deciding the visual rules.',
    },
    {
      title: 'Safety-led colour semantics',
      body: 'Red is reserved exclusively for patient safety risk, never for overdue tasks or operational warnings. This is a structural decision about alert fatigue, not a stylistic preference.',
    },
    {
      title: 'Accessibility as a constraint',
      body: 'Focus trapping in drawers, role="alert" on the patient safety strip, screen-reader summaries on every chart, and reduced-motion handling were designed into the component model rather than audited at the end.',
    },
    {
      title: 'Implementation readiness',
      body: 'A working React prototype with custom components and CSS Modules, no UI kit, shipped through a reviewed PR workflow and deployed so the whole clinician workflow can be clicked through.',
    },
  ] as DemonstratesItem[],

  overview:
    'CareSync is a shift-based clinical command centre for outpatient clinicians, built around a single question: what needs to happen before the next patient walks in? The prototype covers eight connected screens — Shift Briefing, Patients, Appointments, Medical Records, Messages, Tasks, Operational Insights, and Settings — plus a deep-linkable patient profile, each mapped to a distinct mode of clinical or operational attention. The navigation order follows the sequence of a real shift: shift start, then patient, appointment, record, communication, action, analysis, and admin. The organising idea is a Now / Next / Later model: Now holds what requires clinical action before the next consultation, Next holds the coming ninety minutes with preparation status attached, and Later holds shift follow-through that can be deferred without risk. That model is not a feature on one screen, it is the structure the whole product is built on.',

  problem:
    'Provider-side healthcare software tends to surface KPIs, appointment volumes, and aggregate metrics. But a doctor starting a shift is not asking what happened, they are asking what needs to happen next. Lab results, handover tasks, upcoming appointments, and abnormal flags all arrive together with no priority model, and the first minutes of a shift are the highest-risk window: the most context switches, the most incomplete information, the most handover gaps. An analytics dashboard at that moment is noise. The second problem is inheritance. Tasks picked up from the previous shift require reconstructing context from notes the clinician did not write, and that reconstruction is slow and error-prone.',

  problemHighlight:
    'What does a doctor need to know in the first ten minutes of a shift, and what can wait? Once the problem was framed that way, the structure of the product became much clearer.',

  goals: [
    {
      title: 'Structure the product around the shift',
      body: 'Organise information by urgency, responsibility, and sequence rather than by data category, so the interface follows the rhythm of clinical work instead of the shape of the database.',
    },
    {
      title: 'Make the next action obvious',
      body: 'Every row should carry severity, timing, source, and ownership together, so a clinician can act on an item without navigating away to assemble the context first.',
    },
    {
      title: 'Protect red for patient safety',
      body: 'Separate clinical safety signals from operational urgency so red never becomes ambient. If red means both allergy alert and overdue task, clinicians learn to ignore it.',
    },
    {
      title: 'Build one system, not eight screens',
      body: 'Use a single token layer and a shared status architecture so every screen behaves consistently and any new surface inherits the language automatically.',
    },
  ],

  researchInsights: [
    {
      title: 'Clinicians triage before they browse',
      issue:
        'Provider dashboards commonly open on volume metrics: patients seen, utilisation, revenue. Those are management questions, and a metrics-first layout pushes the clinical answer below the fold at exactly the moment it is needed.',
      response:
        'Shift Briefing answers what needs attention before anything else, ordered Now / Next / Later. Operational Insights becomes a separate destination a clinician reaches deliberately rather than by accident.',
    },
    {
      title: 'Time, ownership, and urgency belong together',
      issue:
        'Seeing a lab result without knowing when it arrived, who flagged it, and what action is expected means visiting several screens just to understand one piece of information.',
      response:
        'Every row co-locates source, timestamp, owner, and due time. A four-dimension status model — severity, workflow, timing, ownership — exists because no single badge could carry all four.',
    },
    {
      title: 'Abnormal results without context are not enough',
      issue:
        'A glucose reading of 142 mg/dL means something different if the previous value was 118 rather than 98. The number on its own is not actionable, and it is not safely interpretable either.',
      response:
        'The clinical warning card pairs the changed value with its trend, its source, its timestamp, and the recent medication history, so the result arrives already interpretable.',
    },
    {
      title: 'Inherited handovers carry hidden cognitive cost',
      issue:
        'Picking up tasks from the previous shift means reconstructing context from notes the clinician did not write. That reconstruction is slow, and it is where continuity between shifts breaks down.',
      response:
        'Tasks group by time horizon — Now, Due this shift, Handed over, Waiting on others — and acknowledgement is required before a handover task is actioned, making continuity explicit.',
    },
    {
      title: 'Fast scan plus focused drill-down is the real workflow',
      issue:
        'Clinicians do not browse. They triage a list, identify who needs attention, then go deep on that person. Trying to serve both modes on one screen makes the list unusable and the record shallow.',
      response:
        'Tables handle the scan; a row click opens a drawer for focused review without losing list position. Opening the full patient profile is an explicit secondary step, not the default on every touch.',
    },
    {
      title: 'Safety red must stay rare',
      issue:
        'If red means both allergy alert and overdue task, users learn to tune it out, and the signal stops working at the moment it matters most.',
      response:
        'Red is reserved exclusively for patient safety risk. Amber carries review-required and operational urgency, green carries stable and completed. The separation is structural, not stylistic.',
    },
  ] as ResearchInsight[],

  earlyStructureIntro:
    'Before any visual decisions were made, the product was structured around three questions: what does a clinician need to know, in what order, and which screen owns each answer. I sketched the shift as a story in Procreate first — arrival, triage, consultation, review, handover — because I wanted to understand sequence and coordination rather than jump straight into layout. What came out of that sketch most clearly was that Now / Next / Later was not a feature. It was the fundamental structure of how clinical work unfolds.',

  userJourneyDescription:
    'The flow is a loop rather than a funnel, which is the main structural difference from a patient-facing booking journey. A clinician re-enters at the briefing many times a day and exits into a different module each time, so every stage has to be both a destination and a junction. Context carries forward: the appointment detail offers the patient, the message context offers the patient, and the patient profile offers the message.',

  userJourneySteps: [
    'Shift Briefing',
    'Priority patient',
    'Patient profile',
    'Lab review',
    'Message care team',
    'Assign task',
    'Appointment',
    'Mark complete',
  ],

  iaDescription:
    'The IA splits into a persistent shell and a routed content area. The shell holds global search, shift context, notifications, and the clinical nav group, with Settings deliberately separated at the bottom so administrative navigation never competes with clinical navigation. Eight destinations sit under a single CLINICAL group, ordered to match the sequence of a shift: shift start, then patient, appointment, record, communication, action, analysis, and admin. Live counts sit only on the two that are time-sensitive, Messages and Tasks. The patient profile is a parameterised, deep-linkable route reached from the roster rather than a ninth nav item, which keeps the roster as the scan surface and the profile as the depth surface.',

  wireframesDescription:
    'Low-fidelity frames for all eight screens, reduced to structure only: which region owns which question, and in what order a clinician meets them. Three structural patterns were settled here before any styling. A main work area with a persistent operational rail on the briefing, so Now, Next, and Later stay co-visible. A table with an overlay detail drawer everywhere the work is list-heavy, so the worklist never disappears during review. And a three-panel layout for Messages, so severity nav, conversation, and patient context are readable at once. Each was chosen from how the clinical work is done rather than from a 12-column grid abstraction.',

  wireframeImages: [
    { src: '/images/projects/caresync/wireframes/shift-briefing.svg', label: 'A — Shift Briefing: Now / Next / Later' },
    { src: '/images/projects/caresync/wireframes/patients.svg', label: 'B — Patients: table with detail drawer' },
    { src: '/images/projects/caresync/wireframes/appointments.svg', label: 'C — Appointments: queue with flow status' },
    { src: '/images/projects/caresync/wireframes/medical-records.svg', label: 'D — Medical Records: shift-level worklist' },
    { src: '/images/projects/caresync/wireframes/messages.svg', label: 'E — Messages: three-panel layout' },
    { src: '/images/projects/caresync/wireframes/tasks.svg', label: 'F — Tasks: grouped by time horizon' },
    { src: '/images/projects/caresync/wireframes/operational-insights.svg', label: 'G — Operational Insights: charts with thresholds' },
    { src: '/images/projects/caresync/wireframes/settings.svg', label: 'H — Settings: two-column card' },
  ] as { src: string; label: string }[],

  uxDecisions: [
    {
      title: 'The briefing replaces the greeting',
      body: 'The first thing a clinician sees is what needs attention, not their name and today’s date. The Now / Next / Later rail sits above the fold and there is no hero welcome banner anywhere in the product. Clinicians need workflow clarity at shift start, not a personalised greeting.',
    },
    {
      title: 'Medical Records became a shift-level worklist',
      body: 'The most consequential IA decision in the project. Instead of "show me one patient’s records", the question became "which records across all my patients need review this shift?" That reoriented an entire screen around shift workflow rather than patient hierarchy, and surfaced new results at the top of the list.',
    },
    {
      title: 'Row click opens a drawer, not a page',
      body: 'Clinical work is list-heavy and triage-heavy. Tables let a clinician scan across many patients, and a drawer gives enough context for a decision without full-page navigation. The worklist stays visible, so the clinician never loses their place mid-review.',
    },
    {
      title: 'Messages sort by severity, not recency',
      body: 'A three-panel layout — severity nav, thread list, conversation — with patient context, result source, and severity visible in the list rather than just subject lines. Sorting by time would let a safety-critical message get buried under routine traffic.',
    },
    {
      title: 'Flow status replaces appointment type',
      body: 'On the Appointments queue, the primary column answers where an appointment sits in the clinical process, not what kind of appointment it is. Preparation notes are visible before the patient enters the room, not after.',
    },
    {
      title: 'Charts never stand alone',
      body: 'Every chart on Operational Insights carries a threshold line, a narrative sentence, and a screen-reader summary. Bars are uniform aubergine; red appears only on the capacity threshold line, never on the data itself.',
    },
  ],

  designSystemDescription:
    'The design system did not start with colours. It started with a question: how should a doctor feel at the beginning of a busy shift? Not overwhelmed by data, not performing data entry — ready to act. The first direction felt too familiar: blue surfaces, generic KPI cards, rounded widgets, decorative charts. It looked like healthcare, but it did not feel operational. Blue is common in healthcare UI because it suggests trust, but it also makes most healthcare dashboards look identical to each other. Aubergine still reads as mature, serious, and trustworthy while giving CareSync a distinct enterprise identity, and it works with warm neutral surfaces that reduce eye strain across a long shift. Aubergine anchors product identity; critical, warning, and success colours anchor clinical meaning. They never compete. The screens below are captured from the design system documentation page that ships inside the prototype itself.',

  designSystemImages: [
    { src: '/images/projects/caresync/system/color-system.png', label: 'Colour system — aubergine brand scale and semantic roles' },
    { src: '/images/projects/caresync/system/typography.png', label: 'Typography — eight-step scale with tabular numerals' },
    { src: '/images/projects/caresync/system/buttons.png', label: 'Buttons — primary, secondary, ghost, danger' },
    { src: '/images/projects/caresync/system/badges-status.png', label: 'Badges and the four-dimension status system' },
    { src: '/images/projects/caresync/system/patient-identity.png', label: 'Patient identity — avatar, chip, and safety strip' },
    { src: '/images/projects/caresync/system/clinical-alerts.png', label: 'Clinical alerts — safety-critical treatment' },
    { src: '/images/projects/caresync/system/cards.png', label: 'Cards — priority, lab result, and preparation note' },
    { src: '/images/projects/caresync/system/drawers.png', label: 'Drawers — focus-trapped detail review' },
    { src: '/images/projects/caresync/system/charts.png', label: 'Charts — thresholds with accessible summaries' },
  ],

  desktopScreenshots: [
    {
      src: '/images/projects/caresync/desktop/dashboard.png',
      title: 'Shift Briefing',
      purpose: 'Answer what needs attention before the next patient walks in, before any navigation is required.',
      uxNote:
        'A three-column temporal model replaces the greeting banner. The priority patient card surfaces at the top with the changed value, severity, timing, and action in one glanceable block, while the operational rail shows the coming queue without navigating away.',
    },
    {
      src: '/images/projects/caresync/desktop/patients.png',
      title: 'Patients',
      purpose: 'Let a clinician scan the roster and move into focused review without losing the list.',
      uxNote:
        'Row click opens a quick-view drawer; opening the full profile is a deliberate secondary step. The active row uses a 3px inset aubergine left accent, consistent with Tasks and Messages.',
    },
    {
      src: '/images/projects/caresync/desktop/patient-profile.png',
      title: 'Patient profile',
      purpose: 'Carry the full clinical story for one patient without burying the facts that affect safety.',
      uxNote:
        'A parameterised, deep-linkable route reached from the roster rather than a nav destination of its own. The allergy strip sits above the fold and is announced by screen readers, and the consultation priority block pairs the changed value with its trend, source, and target range.',
    },
    {
      src: '/images/projects/caresync/desktop/appointments.png',
      title: 'Appointments',
      purpose: 'Run the outpatient queue with consultation readiness visible per slot.',
      uxNote:
        'Flow status replaces appointment type as the primary column: the question is where the appointment sits in the clinical process, not what kind it is. Preparation notes appear before the patient enters the room.',
    },
    {
      src: '/images/projects/caresync/desktop/medical-records.png',
      title: 'Medical Records',
      purpose: 'Answer which records across all patients need review this shift.',
      uxNote:
        'The most consequential IA decision in the project. New results are surfaced at the top of the worklist, and source, time, and patient identity are visible in every row without an extra click.',
    },
    {
      src: '/images/projects/caresync/desktop/messages.png',
      title: 'Messages',
      purpose: 'Coordinate with nurses, labs, and admin while keeping clinical context attached to the thread.',
      uxNote:
        'Three panels — severity nav, thread list, conversation — sorted by severity rather than time, so a safety-critical message can never get buried under routine traffic.',
    },
    {
      src: '/images/projects/caresync/desktop/tasks.png',
      title: 'Tasks and handovers',
      purpose: 'Make inherited shift work visible, owned, and time-bounded.',
      uxNote:
        'Tasks group by time horizon — Now, Due this shift, Handed over, Waiting on others — and acknowledgement is required before a handover task is actioned. The Now group is never buried below a full list.',
    },
    {
      src: '/images/projects/caresync/desktop/operational-insights.png',
      title: 'Operational Insights',
      purpose: 'Support staffing and queue decisions with analytics that carry a recommended action.',
      uxNote:
        'Each insight card shows a metric, an owner, and a recommended action. Charts carry threshold lines and narrative text; bars are uniform aubergine, with red reserved for the capacity threshold line.',
    },
    {
      src: '/images/projects/caresync/desktop/settings.png',
      title: 'Settings',
      purpose: 'Manage shift, notification, display, security, and accessibility preferences.',
      uxNote:
        'A two-column card with an aubergine active accent on the left nav rather than a full-page form, reusing the same enterprise card pattern as the rest of the product.',
    },
  ] as CareSyncScreen[],

  mobileScreenshots: [
    {
      src: '/images/projects/caresync/mobile/messages.png',
      title: 'Messages',
      uxNote: 'The three-panel desktop workspace becomes a single-panel list, with severity still leading each row so triage order survives the layout change. The sidebar is replaced by a bottom tab bar.',
    },
    {
      src: '/images/projects/caresync/mobile/tasks.png',
      title: 'Tasks and handovers',
      uxNote: 'Time-horizon grouping holds at mobile width, so Now stays above Due this shift and Handed over rather than collapsing into one flat list. Card-based rows carry owner and due time without a table.',
    },
    {
      src: '/images/projects/caresync/mobile/patients.png',
      title: 'Patients',
      uxNote: 'The roster keeps patient identity, age, and condition in the first columns so the scan still works one-handed. The remaining columns sit inside a horizontal scroll container rather than truncating.',
    },
    {
      src: '/images/projects/caresync/mobile/appointments.png',
      title: 'Appointments',
      uxNote: 'The OPD queue summary stacks above the table, keeping waiting count, delays, and longest wait visible before the queue itself. Flow status stays adjacent to the time column.',
    },
    {
      src: '/images/projects/caresync/mobile/medical-records.png',
      title: 'Medical Records',
      uxNote: 'Review-state chips move above the worklist so the count of records needing attention is legible before scrolling, and new results stay at the top of the list.',
    },
  ] as CareSyncMobileScreen[],

  brandScale: [
    { name: 'brand-50', hex: '#F5EFF5', border: true },
    { name: 'brand-100', hex: '#E5D5E4', border: true },
    { name: 'brand-300', hex: '#B79BB3', border: false },
    { name: 'brand-600', hex: '#553052', border: false },
    { name: 'brand-700', hex: '#40233F', border: false },
    { name: 'brand-900', hex: '#251324', border: false },
  ],

  surfaceScale: [
    { name: 'App background', hex: '#F7F6F4', border: true },
    { name: 'Surface', hex: '#FFFFFF', border: true },
    { name: 'Subtle surface', hex: '#FCFBFA', border: true },
    { name: 'Border default', hex: '#E2DEDA', border: true },
    { name: 'Border strong', hex: '#CBC5C1', border: true },
    { name: 'Text primary', hex: '#201C20', border: false },
    { name: 'Text secondary', hex: '#4E484C', border: false },
  ],

  statusChips: [
    { label: 'Allergy: Penicillin', bg: '#FDECEA', text: '#B42318', border: '#F0B9B5' },
    { label: 'Review required', bg: '#FFF3DA', text: '#8A5600', border: '#E9C77A' },
    { label: 'Stable', bg: '#E8F3EC', text: '#26734D', border: '#ACD2BC' },
    { label: 'Routine', bg: '#F9FAFB', text: '#374151', border: '#E2DEDA' },
    { label: 'Under review', bg: '#F5EFF5', text: '#553052', border: '#C8A8C6' },
  ],

  typeScale: [
    { role: 'Page title', token: '--font-size-page-title', meta: '28px / 36px · 600', example: 'Shift Briefing', usage: 'Top-level screen identifier' },
    { role: 'Section title', token: '--font-size-section-title', meta: '20px / 28px · 600', example: 'Priority patients · Now', usage: 'Workflow grouping within a screen' },
    { role: 'Subsection', token: '--font-size-subsection', meta: '17px / 24px · 600', example: 'Lab results', usage: 'Grouping inside a card or drawer' },
    { role: 'Card title', token: '--font-size-card-title', meta: '15px / 22px · 600', example: 'Meera Iyer · Glucose review', usage: 'The primary action statement' },
    { role: 'Body / table row', token: '--font-size-body', meta: '14px / 21px · 400', example: 'Fasting glucose 142 mg/dL since Monday', usage: 'Supporting clinical detail' },
    { role: 'Supporting', token: '--font-size-supporting', meta: '13px / 18px · 400', example: 'Updated 10 min ago by Nurse Priya', usage: 'Secondary metadata in a row' },
    { role: 'Label', token: '--font-size-label', meta: '12px / 16px · 600', example: 'REVIEW REQUIRED', usage: 'Status state, always uppercase' },
    { role: 'Metadata', token: '--font-size-metadata', meta: '11px / 16px · 400', example: 'CP-10482 · Lab · 08:12 AM', usage: 'Source, ID, timestamp' },
  ],

  designNotes: [
    {
      title: 'Borders instead of heavy shadows',
      body: 'Elevation comes from layout hierarchy rather than decorative shadow layers, which keeps the product reading as a clinical workspace rather than a consumer layer cake. Only drawers and modals carry real elevation.',
    },
    {
      title: 'Warm neutrals rather than pure white',
      body: 'Pure white at scale creates harsh contrast in dense clinical lists. A warm off-white canvas at #F7F6F4 lets the eye relax while reading across rows for the length of a shift.',
    },
    {
      title: 'Tabular numerals throughout',
      body: 'Every numeric value uses tabular figures so lab values, times, and patient IDs align vertically when scanning a column of rows.',
    },
    {
      title: 'Status is never colour alone',
      body: 'Every severity indicator pairs a coloured dot with a text label, so the meaning survives both colour blindness and a greyscale print-out.',
    },
    {
      title: 'Compact density, generous targets',
      body: 'Type is small and rows are tight because clinical work is list-heavy, but interactive targets stay at 36–44px so density never costs reachability.',
    },
    {
      title: 'One token layer, changed in one place',
      body: 'Colour, type, spacing, radius, and elevation all live as CSS custom properties in a single tokens.css, so a system-level change never requires touching a screen.',
    },
  ],

  aiWorkflow: [
    {
      stage: '01',
      title: 'Prompt — write the brief and the decision',
      body: 'Framed each screen as a written design brief and an explicit decision before any implementation began, so the generation step had a specification to work against rather than an open prompt.',
      note: 'Human task — define the clinical framing and decide what the screen is for.',
    },
    {
      stage: '02',
      title: 'Generate — first implementation pass',
      body: 'Used AI coding assistance to produce the first implementation of a screen or component from the written decision, kept narrow to one surface at a time so the diff stayed reviewable.',
      note: 'Human task — scope each session and keep the change traceable.',
    },
    {
      stage: '03',
      title: 'Audit — review for visual, semantic, and clinical issues',
      body: 'Reviewed every screen section by section against clinical credibility, token consistency, and accessibility compliance. This is where most of the real work happened.',
      note: 'Human task — judge clinical credibility and catch semantic drift.',
    },
    {
      stage: '04',
      title: 'Refine — targeted passes per screen',
      body: 'Ran repeated narrow refinement passes rather than one broad rewrite, so each change stayed traceable and no screen was silently redesigned between sessions.',
      note: 'Human task — decide what to change and what to leave alone.',
    },
    {
      stage: '05',
      title: 'Freeze — mark the screen complete',
      body: 'Explicitly froze screens once they met the bar, preventing the endless-tinkering failure mode where an accepted screen drifts during later work.',
      note: 'Human task — decide which screens to freeze and which to refine further.',
    },
    {
      stage: '06',
      title: 'Systematise — extract to the design system',
      body: 'Pulled recurring patterns back into tokens and shared components, then documented them on a design system page inside the product so the language could extend without re-deciding.',
      note: 'Human task — decide what belongs in the system versus one screen.',
    },
  ],

  technicalDescription:
    'The interface was built entirely with custom React components and CSS Modules — no Material UI, no Tailwind, no component kit. That was deliberate: it let the system match the clinical context exactly rather than inheriting the visual assumptions of a general-purpose library. All clinical content is mock data, so the full workflow is navigable without a backend, an API layer, or authentication.',

  technicalPoints: [
    'React with TypeScript and CSS Modules — scoped styles with no cascade conflicts across components',
    'Design tokens as CSS custom properties in a single tokens.css, so the system changes in one place',
    'Custom component library of 25+ components, with no UI framework or icon-font dependency',
    'Four-dimension status system: WorkflowStatus (8 states), TimingStatus (5 states), OwnershipStatus, SeverityIndicator',
    'All status components accept a compact prop, so the same component serves tables, cards, and drawers',
    'Parameterised, deep-linkable patient route reached from the roster, with a catch-all redirect',
    'Drawers trap focus on open and restore focus to the triggering row on close',
    'PatientSafetyStrip uses role="alert" so allergy information is announced immediately on render',
    'Charts wrapped with an AccessibleChartSummary component rendering an sr-only narrative description',
    'prefers-reduced-motion collapses transitions to opacity only, removing drawer slide animations',
  ],

  testingFlow:
    'Shift Briefing → Priority patient → Patient profile → Lab review → Message care team → Assign task → Appointment → Mark complete',

  testingChecklist: [
    'Could a clinician identify the most urgent patient from the briefing without scrolling?',
    'Did every priority card, queue row, and task lead somewhere useful rather than dead-ending?',
    'Did the roster stay scannable, with severity readable from the chip label and not colour alone?',
    'Did allergy and risk flags stay visible while moving between the roster, the profile, and a drawer?',
    'Did a row click open the drawer without losing scroll position in the list behind it?',
    'Did the drawer trap focus while open and return focus to the triggering row on close?',
    'Did Messages keep the linked patient context attached to the correct conversation?',
    'Did every chart carry a threshold, a narrative sentence, and a screen-reader summary?',
    'Did all nine routes resolve, and did the patient record deep-link correctly?',
    'Was every icon-only control reachable by keyboard with a visible focus ring?',
  ],

  iterations: [
    {
      num: '01',
      title: 'From dashboard-first to shift-first',
      issue: 'The first direction opened on KPI tiles at equal weight behind a greeting hero with the date and username above the fold.',
      fix: 'Replaced the greeting with an operational priority rail and reordered the landing screen around Now / Next / Later.',
      why: 'The highest-risk window of a shift is its first minutes. A greeting spends that attention on nothing.',
    },
    {
      num: '02',
      title: 'Visual identity was indistinguishable',
      issue: 'The blue healthcare palette made the product look identical to every other clinical SaaS tool in the category.',
      fix: 'Moved to a warm aubergine identity on a neutral off-white canvas, with borders instead of heavy shadows.',
      why: 'A product that looks like everything else inherits the assumption that it works like everything else.',
    },
    {
      num: '03',
      title: 'Colour was being used decoratively',
      issue: 'Red covered both warnings and safety states, and badge colours had no shared rules between screens.',
      fix: 'Introduced a strict semantic model: red for safety, amber for review, green for stable, aubergine for identity.',
      why: 'If red means too many things, clinicians stop responding to red at all.',
    },
    {
      num: '04',
      title: 'One badge could not carry clinical context',
      issue: 'Status was inconsistent across screens, and tasks showed no visible ownership or timing.',
      fix: 'Split status into four independent axes — severity, workflow, timing, ownership — each its own component.',
      why: 'How severe, where in the process, when due, and who owns it are four different questions.',
    },
    {
      num: '05',
      title: 'Medical Records mirrored the database, not the work',
      issue: 'The screen showed one patient’s records at a time, which answered the wrong question during a shift.',
      fix: 'Rebuilt it as a shift-level worklist answering which records across all patients need review now.',
      why: 'The IA should follow how the work is done, not how the data is stored.',
    },
    {
      num: '06',
      title: 'Screens had no shared interaction pattern',
      issue: 'Each list screen handled detail differently, so the product felt like a set of pages rather than one system.',
      fix: 'Standardised on a row-click drawer pattern repeated across every table in the product.',
      why: 'Consistency across eight screens is what turns a set of pages into a product.',
    },
    {
      num: '07',
      title: 'Mobile had no navigation model',
      issue: 'The 232px sidebar could not survive a phone viewport, leaving small screens without a usable nav.',
      fix: 'Added a bottom tab bar below the desktop breakpoint, shipped as its own pull request.',
      why: 'Navigation has to change form on mobile, not just shrink.',
    },
  ],

  responsiveQADescription:
    'Responsive QA focused on keeping navigation reachable, preventing page-level horizontal overflow, and confirming the app shell holds when the sidebar is replaced by a bottom tab bar. Measured on the deployed build, there is no page-level horizontal overflow at any width from 1440px down to 390px, and the sidebar swaps to a bottom tab bar below the desktop breakpoint. Two things are still unfinished at mobile width. Table-heavy screens — Patients, Appointments, and Medical Records — keep their tables inside a horizontal scroll container rather than restructuring into cards, so columns run off the edge until scrolled. And four screens — Shift Briefing, patient profile, Operational Insights, and Settings — clip content inside a container that does not scroll at all. Both are recorded as limitations rather than presented as finished work.',

  responsiveQA: [
    { breakpoint: '1440px', label: 'Wide desktop', status: 'Tested' },
    { breakpoint: '1280px', label: 'Laptop', status: 'Tested' },
    { breakpoint: '1024px', label: 'Tablet landscape', status: 'Tested' },
    { breakpoint: '768px', label: 'Tablet — bottom tab bar', status: 'Tested' },
    { breakpoint: '430px', label: 'Mobile L', status: 'Partial' },
    { breakpoint: '390px', label: 'iPhone 14', status: 'Partial' },
  ],

  accessibilityChecklist: [
    'Keyboard operable throughout, with drawers trapping focus and restoring it to the triggering row on close',
    'No colour-only status — every severity indicator pairs its coloured dot with a visible text label',
    'A 3px aubergine focus ring on every interactive element, deliberately distinct from clinical status colours',
    'Touch targets held to 40–44px for primary actions, 36px for supporting actions, 36×36px for icon buttons',
    'An sr-only AccessibleChartSummary on every chart, giving a full narrative description rather than a title',
    'role="alert" on the patient safety strip so allergy information reaches screen readers immediately',
    'Visually hidden table captions and scope="col" headers for correct screen-reader reading order',
    'Reduced-motion support that removes drawer slide animations entirely, avoiding vestibular triggers',
  ],

  techStack: [
    { label: 'Frontend', value: 'React, TypeScript, CSS Modules' },
    { label: 'UI', value: 'Custom component library and CSS custom-property tokens, no UI framework' },
    { label: 'Status system', value: 'Four-dimension model — severity, workflow, timing, ownership' },
    { label: 'Charts', value: 'Recharts wrapped with an sr-only accessible summary per chart' },
    { label: 'Data', value: 'Module-scope mock clinical datasets, no backend' },
    { label: 'Design', value: 'Claude, Claude Code, Procreate for shift storyboarding' },
    { label: 'Version control', value: 'GitHub, four reviewed pull requests' },
    { label: 'Deployment', value: 'Vercel, live prototype with SPA routing configured' },
  ],

  limitations: [
    'Mock clinical data only, with no EMR integration, scheduling API, or persistence layer',
    'No authentication, role-based access control, or audit logging, all of which a real provider tool requires',
    'Four screens still clip content inside a non-scrolling container at 430px and below',
    'Table-heavy screens scroll horizontally at mobile width instead of restructuring into cards',
    'Informal clinician input rather than structured usability testing with practising GPs',
    'Search, filter, and primary actions are present but do not mutate state',
    'Charts render fixed series rather than computing from underlying appointment data',
    'No automated test coverage or CI accessibility audit',
  ],

  nextSteps: [
    'Run structured sessions with GPs in outpatient settings to validate Now / Next / Later against real shift behaviour',
    'Review every severity label, status chip, and alert string with a clinical advisor, the highest-risk content in the product',
    'Fix the remaining mobile clipping and refine drawer widths and touch targets for bedside tablet use',
    'Add role-based views so nurse, admin, and specialist surface different priorities from the same shift data',
    'Wire the roster, records, and messages to a real backend with typed API contracts',
    'Add component and interaction tests plus an automated accessibility audit in CI',
  ],

  finalValidation: [
    'The briefing surfaces clinical priority above operational metrics on first view',
    'Status resolves through one component set and stays consistent across all screens',
    'The roster stays scannable while the patient profile carries full clinical depth',
    'Allergy and risk flags remain visible while moving between roster, profile, and drawer',
    'Row click opens the drawer without losing list position behind it',
    'Messages keeps the linked patient context attached to the right conversation',
    'All routes resolve and the patient record deep-links correctly',
    'No page-level horizontal overflow from 1440px down to 390px',
    'Every icon-only control has an accessible name and a visible focus state',
    'The design system is documented inside the product itself, not only in the case study',
  ],

  reflection:
    'I went into this thinking I was designing a healthcare dashboard. I came out having built something closer to a clinical workflow system, and that shift in how I understood the problem changed everything downstream: the structure, the visual language, the components, and the way I talk about the work. A dashboard asks what happened; a shift system asks what needs to happen next. Once I understood that, almost every design decision became clearer. The second lesson was that some components carry meaning rather than style. Centralising status in one component set and reserving red for patient safety were the two changes with the highest ratio of safety value to code, because an inconsistent status colour erodes trust in colour entirely and a misused red trains clinicians to ignore it. The third was that system thinking matters as much as screen polish: any individual screen looks reasonable on its own, but what makes CareSync work is that all eight speak the same visual language. Sketching the shift as a narrative in Procreate was a tool rather than a deliverable, and it forced me to think about sequence and coordination in a way wireframing alone would not have. AI moved me quickly through scaffolding, component implementation, and layout exploration, but the ordering decisions, the clinical framing, and the accessibility pass came from reading and testing the thing myself. The honest gap is testing: informal clinician input shaped the direction, but this has not yet been validated with practising GPs, and four screens still need responsive work before it would survive real bedside use.',
};
