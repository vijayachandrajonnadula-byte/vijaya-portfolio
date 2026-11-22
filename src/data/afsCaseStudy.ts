export interface AfsDecision {
  num: string;
  title: string;
  /** What is visible on the screens. */
  saw: string;
  /** My reading of why it is that way, hedged because there is no discovery artifact. */
  reading: string;
  /** One alternative, only where the screens make it inferable. */
  alternative?: string;
  /** What I would instrument or test. No invented numbers. */
  instrument: string;
  /** 'designed' only when the owner confirms it; the default is 'observed'. */
  basis: 'designed' | 'observed';
  /** Screen numbers this decision refers to. */
  screens: string;
  /** Optional screen crop shown with the decision (full image opens on zoom). */
  crop?: { src: string; pos: string; alt: string };
}

export interface AfsScreen {
  num: string;
  title: string;
  /** Bold first clause: the decision the screen shows. */
  lead: string;
  body: string;
  alt: string;
  keyElements: string[];
  src: string;
}

export interface AfsComponentPattern {
  name: string;
  description: string;
  usage: string;
}

export interface AfsHandoffCard {
  title: string;
  body: string;
}

export interface AfsNote {
  text: string;
  criteria: string;
}

export const afsCaseStudy = {
  id: 'afs-enterprise-workflow',
  title: 'Account Fit Score (AFS)',
  subtitle:
    "A configuration workflow for AI-powered account scoring in ZoomInfo's Admin Portal: choose a data source, define conditions, wait for the model, act on the result.",
  tags: ['Enterprise UX', 'Workflow Design', 'Admin Portal', 'B2B SaaS', 'Configuration UI', 'Figma'],

  myPart:
    'UX/UI Design Contributor on the Account Fit Score team. Focus of this write-up: configuration workflow, condition builder and data source management.',
  outcome:
    'Final dev-ready screens (Q4 2023). No shipped result or metrics are claimed: this page reconstructs the structure and reasoning from those screens.',
  statusLabel: 'Dev-ready, reconstructed from final screens',

  snapshot: [
    { label: 'Role', value: 'UX/UI Design Contributor, Account Fit Score team' },
    { label: 'Company', value: 'ZoomInfo, enterprise B2B intelligence platform' },
    { label: 'Platform', value: 'Enterprise web application, Admin Portal' },
    { label: 'Source', value: 'Final Figma UI screens, Q4/2023, Ready for Dev status' },
    { label: 'Focus', value: 'Configuration workflow, condition builder, data source management' },
    { label: 'Output', value: 'A design audit of the final screens: flow, decisions, notes for build' },
  ],

  readingNote: {
    title: 'How to read this page',
    items: [
      'This is company work. Business logic, scoring internals and team details are left out on purpose.',
      'It is reconstructed from final Figma screens. There is no research or discovery artifact behind it, so every reason given is my reading of the screens, not a recorded fact.',
      'Each decision is tagged "Observed from the final screens" unless the owner has confirmed it was designed by Vijay.',
      'The screens are shown as exported. The workspace name (Cyberlock), the placeholder user name (Bob) and the third-party company names in the account lists are sample data, not client records.',
    ],
  },

  overview:
    "Account Fit Score (AFS) sits in the Admin Portal under Go-to-Market, Set Up. From the screens, a team picks a data source, defines conditions, saves, and waits for scoring to finish. A list then shows the configuration, its status, a score distribution and the top factors behind the scores.",

  problem: {
    main: 'The feature asks RevOps and sales operations users, who know their business but are not machine-learning specialists, to set up a scoring model. The work is slow (the screens promise results within 24 hours) and mostly invisible while it runs.',
    detail:
      'My reading of the screens: the design has to answer three questions at every step. Where am I, what have I set up, and what happens next? Most of the decisions below are answers to one of them.',
    highlight:
      'The core design problem is trust during a long, invisible process: did it save, did my data arrive, when will I hear back, and what do I do with the result?',
  },

  userFlowDescription:
    'The path below is read off the twelve screens, in order. A CSV path also exists in the Figma canvas, but its screens are not in my reference set, so it is only sketched in the appendix.',

  userFlowSteps: [
    'AFS landing',
    'Configure AFS',
    'Pick source: Salesforce or file',
    'Define conditions + preview',
    'Save Configuration',
    'Name it',
    'Processing (up to 24 hours)',
    'Email: AFS ready',
    'Results and Retrain',
  ],

  decisions: [
    {
      num: '01',
      title: 'Say how long scoring takes, then confirm the data arrived',
      saw: 'After Save, the list shows a Processing badge and a toast: "AFS configuration successfully saved. Score generation is in progress and might take up to 24 hours." Expanding the row repeats the 24 hours, promises an email, and shows how many accounts were imported with a sample of them.',
      reading:
        'Training is slow and invisible, so the screens appear to answer two worries up front, "did it save?" and "did my data arrive?", and then let the user leave with a promise of an email.',
      alternative: 'A progress bar would be a weak fit if the duration varies up to a day (my inference).',
      instrument:
        'What I would instrument: how many people return from the email versus polling the list, and whether support questions about "did it save?" drop.',
      basis: 'observed',
      screens: '08, 09, 10',
      crop: {
        src: '/images/projects/afs/screens/afs-09-processing-detail.png',
        pos: '30% 40%',
        alt: 'Expanded Processing row stating that scores might take up to 24 hours and that 296 accounts were imported, followed by a sample of eight accounts.',
      },
    },
    {
      num: '02',
      title: 'Recommend Salesforce, keep a file upload one click away',
      saw: 'The source modal lists "Import from Salesforce" with a Recommended tag and a shaded card, above "Upload a file", which asks for a CSV of website URLs for at least 100 best-fit customers.',
      reading:
        'This steers teams that have a CRM toward the path that reuses their data, without a dead end for teams that do not. The two cards are not equal in weight: Salesforce is the default.',
      alternative: 'A CRM-only flow would block workspaces with no integration.',
      instrument:
        'What I would instrument: the split between the two sources, and drop-off on the file path, where the 100-customer minimum is a real hurdle.',
      basis: 'observed',
      screens: '03',
      crop: {
        src: '/images/projects/afs/screens/afs-03-import.png',
        pos: '50% 50%',
        alt: 'Modal titled Import your past deals to configure Account Fit Score, with Import from Salesforce marked Recommended above Upload a file.',
      },
    },
    {
      num: '03',
      title: 'Show matching accounts beside the conditions',
      saw: 'A right-hand panel reads "356 Accounts Found" with a scrollable preview of example accounts. By the naming step the count is 296 with two conditions, so it appears to recompute as conditions change.',
      reading:
        'It looks like a calibration loop: users can tighten or loosen conditions and see the effect before committing to a long training run.',
      alternative: 'Showing only a count would be cheaper to build but gives no sense of what kind of accounts match.',
      instrument:
        'What I would instrument: how many times conditions are edited before the first save, and whether people read the preview list or ignore it. Risk: sample accounts could be mistaken for the final scored list.',
      basis: 'observed',
      screens: '04, 05, 06, 07',
      crop: {
        src: '/images/projects/afs/screens/afs-05-preview.png',
        pos: '100% 30%',
        alt: 'Right-hand panel headed 356 Accounts Found with a list of example accounts and their industry, size and location.',
      },
    },
    {
      num: '04',
      title: 'Place AFS inside a Go-to-Market hierarchy',
      saw: 'The left navigation groups AFS under Go-to-Market, Set Up, next to Target Accounts, Intent and Buying Committees, with General (Analytics, Integrations and others) below.',
      reading: 'My reading: scoring is framed as one step in a wider setup, not a standalone technical feature.',
      instrument: 'What I would instrument: how often users arrive at AFS from the navigation versus from the Overview or Quickstart.',
      basis: 'observed',
      screens: '01',
    },
    {
      num: '05',
      title: 'Edit a condition in place',
      saw: 'The condition row turns into Field, Operator and Values dropdowns (Values accepts up to five) with confirm and cancel icons at the row end, while the other conditions and the preview stay on screen.',
      reading: 'Editing in the row keeps the full condition set visible, which appears to make gaps and overlaps easier to spot than a modal editor would.',
      alternative: 'A modal editor, which hides the other conditions.',
      instrument: 'What I would instrument: abandoned edits (cancel after change) and validation errors on conflicting conditions.',
      basis: 'observed',
      screens: '06',
    },
    {
      num: '06',
      title: 'Start from a default condition with a dismissible explanation',
      saw: 'A new configuration already holds one condition, {Account Type} is {Customer}, under an info banner: "This is a default condition. You can edit or add more conditions as required."',
      reading: 'A default gives a concrete starting point and shows what a valid condition looks like before the user writes their own.',
      instrument: 'What I would instrument: how many users save with the default unchanged.',
      basis: 'observed',
      screens: '04',
    },
    {
      num: '07',
      title: 'Keep the auto-update choice on the configure screen',
      saw: 'An "Auto-update AFS model" toggle with an info icon sits beside the Add Condition row, which carries a 1/10 conditions counter.',
      reading: 'It lets teams that want a stable model and teams that want fresh scores choose without a separate settings page. The counter shows the limit before it is reached.',
      instrument: 'What I would instrument: toggle state at first save and how often it is changed later. Risk: the consequences of auto-update may not be clear from the icon alone.',
      basis: 'observed',
      screens: '04',
    },
    {
      num: '08',
      title: 'Show location with a breadcrumb',
      saw: 'The header reads "Account Fit Score (AFS) / Configure", mirroring the sidebar depth.',
      reading: 'A cheap orientation aid on a screen that is several levels deep.',
      instrument: 'What I would instrument: nothing specific; I would check it exposes the current page to assistive technology (see notes for build).',
      basis: 'observed',
      screens: '04',
    },
  ] as AfsDecision[],

  iaDescription:
    'Reconstructed from the left navigation visible on the configure screen and from frame names in the Figma canvas. Nothing here comes from a documented sitemap.',

  iaTree: [
    { label: 'Admin Portal', indent: 0 },
    { label: 'Overview', indent: 1 },
    { label: 'Go-to-Market', indent: 1 },
    { label: 'Set Up: Target Accounts, Intent, Account Fit Score (AFS), Buying Committees, WebSights, FormComplete, Go-to-Market Plays', indent: 2 },
    { label: 'General: Analytics, User Management, Configurations, Privacy, Integrations, Enrich', indent: 2 },
  ],

  afsIaTree: [
    { label: 'Configure (CRM source)', indent: 0, active: true },
    { label: 'Account Object or Opportunity Object conditions', indent: 1 },
    { label: 'Condition builder (add, edit, remove)', indent: 2 },
    { label: 'Auto-update toggle', indent: 2 },
    { label: 'Configure (file source)', indent: 0 },
    { label: 'Default AFS', indent: 0 },
    { label: 'Edit view', indent: 0 },
    { label: 'Change data source', indent: 0 },
    { label: 'Retrain model', indent: 0 },
    { label: 'Renaming', indent: 0 },
    { label: 'States: Salesforce not integrated, error cases, score distribution edge case', indent: 0 },
  ],

  users: [
    {
      type: 'Primary',
      label: 'RevOps and sales operations teams',
      description:
        'Inferred from the product area and copy, not from research: people who configure the scoring model and understand the business criteria but are not necessarily machine-learning practitioners.',
      tasks: [
        'Choose a data source (Salesforce or file)',
        'Choose the CRM object (Account or Opportunity)',
        'Review, edit and add conditions',
        'Switch auto-update on or off',
        'Save, name and wait for scoring',
        'Review results and retrain',
      ],
    },
    {
      type: 'Secondary',
      label: 'System administrators and IT owners',
      description:
        'Inferred from the "Salesforce not integrated" and "Change Data Source" frames in the canvas: people who manage integrations and data sources.',
      tasks: ['Connect Salesforce', 'Resolve the not-integrated state', 'Change the data source'],
    },
  ],

  designSystemDescription:
    'Component language that repeats across the screens, redrawn here as small decorations. Colors are approximate, estimated from screenshots and not extracted from Figma.',

  designSystemColors: [
    { hex: '#1B7AFF', name: 'Primary blue (approx.)' },
    { hex: '#FFFFFF', name: 'White' },
    { hex: '#F7F9FC', name: 'Light surface (approx.)' },
    { hex: '#E2E8F0', name: 'Border (approx.)' },
    { hex: '#0F172A', name: 'Near-black text (approx.)' },
    { hex: '#64748B', name: 'Muted text (approx.)' },
  ],

  screens: [
    {
      num: '01',
      title: 'Landing, not configured yet',
      lead: 'Explain the feature before asking for setup.',
      body: 'The unconfigured page gives three benefit lines and one repeated action, "Configure AFS", at the top right and in the center. The left navigation highlights Account Fit Score under Go-to-Market, Set Up.',
      alt: 'Account Fit Score page with no configuration yet: an illustration, three benefit bullets and a Configure AFS button, with Account Fit Score highlighted in the left navigation.',
      keyElements: [
        'Left navigation with Account Fit Score (AFS) highlighted under Set Up',
        'Three benefit bullets: predict fit, use firmographics, align sales and marketing',
        '"Configure AFS" button, top right and center',
      ],
      src: '/images/projects/afs/screens/afs-01-landing.png',
    },
    {
      num: '02',
      title: 'Landing with the Quickstart guide',
      lead: 'Offer onboarding beside the page, not instead of it.',
      body: 'A Quickstart panel opens on the right with a greeting to a placeholder name, progress (37% completed, 3 of 7 steps), an AFS explainer with a short video, and an FAQ. The Configure AFS button stays visible.',
      alt: 'Landing page with an Admin Quickstart Guide panel open on the right, showing 37 percent progress, an AFS explainer video and three FAQ questions.',
      keyElements: [
        'Progress: 37% completed, 3 of 7 steps',
        'Account Fit Score section with explainer text, "Learn more" link and video',
        'FAQ list, including "What is Default AFS?"',
        'Close icon top right of the panel',
      ],
      src: '/images/projects/afs/screens/afs-02-quickstart.png',
    },
    {
      num: '03',
      title: 'Choose a data source',
      lead: 'Recommend one source, keep the other visible.',
      body: 'A modal, "Import your past deals to configure Account Fit Score", offers Import from Salesforce (tagged Recommended) and Upload a file (a CSV of website URLs for at least 100 best-fit customers). The close icon is the only way out.',
      alt: 'Modal with two options: Import from Salesforce, marked Recommended, and Upload a file for a CSV of at least 100 best-fit customers, over a dimmed landing page.',
      keyElements: [
        'Import from Salesforce card with a Recommended tag',
        'Upload a file card with its 100-customer minimum',
        'Close icon top right',
      ],
      src: '/images/projects/afs/screens/afs-03-import.png',
    },
    {
      num: '04',
      title: 'Configure with the default condition',
      lead: 'Keep the whole configuration on one screen.',
      body: 'Breadcrumb, a CRM object choice (Account or Opportunity), a dismissible info banner, one condition row, an Add Condition button with a 1/10 counter, and an Auto-update toggle. Cancel and Save Configuration sit top right. The right panel shows what looks like loading placeholders.',
      alt: 'Configure Account Fit Score screen with the Account Object option selected, an info banner, one condition reading Account Type is Customer, an Add Condition button and an auto-update toggle.',
      keyElements: [
        'Breadcrumb: Account Fit Score (AFS) / Configure',
        'Account Object (selected) and Opportunity Object',
        'Info banner about the default condition',
        '{Account Type} is {Customer} with a "..." menu',
        'Add Condition, 1/10 conditions added',
        'Auto-update AFS model toggle and info icon',
        'Cancel and Save Configuration',
      ],
      src: '/images/projects/afs/screens/afs-04-configure.png',
    },
    {
      num: '05',
      title: 'Configure with the account preview',
      lead: 'Show matching accounts next to the conditions.',
      body: 'The right panel now reads "356 Accounts Found" and previews example accounts with industry, size and location. The names are sample data.',
      alt: 'Configure screen with a right-hand panel headed 356 Accounts Found listing example accounts with industry, employee count and location.',
      keyElements: [
        '"356 Accounts Found" with a one-line explanation',
        'Scrollable list of example accounts',
        'Same condition builder on the left',
      ],
      src: '/images/projects/afs/screens/afs-05-preview.png',
    },
    {
      num: '06',
      title: 'Condition in edit mode',
      lead: 'Edit a condition in place.',
      body: 'The row expands into Field, Operator and Values dropdowns, marked required. Values accepts up to five. A check and an X confirm or cancel the edit. The preview and other controls stay put.',
      alt: 'Condition row in edit mode with Field set to Account Type, Operator set to is (any one of) and a Customer value chip, plus confirm and cancel icons.',
      keyElements: [
        'Field: Account Type, Operator: is (any one of)',
        'Values: Customer, with "(Add up to 5 values)"',
        'Required fields marked with an asterisk',
        'Confirm (check) and cancel (X) icons',
      ],
      src: '/images/projects/afs/screens/afs-06-condition-edit.png',
    },
    {
      num: '07',
      title: 'Name the configuration',
      lead: 'Ask for a name only at save time.',
      body: 'Save Configuration opens a small modal, "Name your Account Fit Score", with the field pre-filled as "New AFS 1". Behind it the configuration has two conditions and the preview shows 296 accounts.',
      alt: 'Small modal titled Name your Account Fit Score with a text field containing New AFS 1, over the configure screen showing two conditions.',
      keyElements: [
        'Field pre-filled with "New AFS 1"',
        'Cancel and Save Configuration',
        'Two conditions behind the modal, 2/10 added',
      ],
      src: '/images/projects/afs/screens/afs-07-name.png',
    },
    {
      num: '08',
      title: 'List with a Processing status and toast',
      lead: 'Set the time expectation at the moment of saving.',
      body: 'The list shows one row with a Processing badge, data source CRM (Salesforce) and the toast "AFS configuration successfully saved. Score generation is in progress and might take up to 24 hours." The header counts 1/5 AFS Configured.',
      alt: 'List of Account Fit Score configurations with one row marked Processing and a dark toast at bottom left saying scores might take up to 24 hours.',
      keyElements: [
        'Columns: AFS Name, Status, Data Source, Last Modified, Actions',
        'Processing badge',
        'Toast with a close icon',
        '1/5 AFS Configured counter',
      ],
      src: '/images/projects/afs/screens/afs-08-processing.png',
    },
    {
      num: '09',
      title: 'Processing row, expanded',
      lead: 'Confirm that the data arrived while scoring is still running.',
      body: 'The expanded row says scores are being processed, might take up to 24 hours, and that an email will follow. It states 296 accounts were imported for training and lists eight of them (sample data).',
      alt: 'Expanded Processing row stating that 296 accounts were imported for training the AFS model, followed by a grid of eight sample accounts.',
      keyElements: [
        '"Your AFS scores are being processed"',
        'Email promise: "We will send you an email once the processing is completed"',
        '296 accounts imported, sample of eight',
      ],
      src: '/images/projects/afs/screens/afs-09-processing-detail.png',
    },
    {
      num: '10',
      title: 'Email: your AFS is ready',
      lead: 'Close the loop outside the product.',
      body: 'The subject is "ZoomInfo Update: Your AFS is ready to use". The body names the configuration, lists the top features behind the scores, offers a "View Account Fit Score" button and shows example great-fit accounts. The greeting uses a placeholder name.',
      alt: 'Email titled ZoomInfo Update: Your AFS is ready to use, saying New AFS 1 has finished processing, listing top contributing features and a View Account Fit Score button.',
      keyElements: [
        'Subject line and greeting',
        'Top contributing features as a bullet list',
        'Red "View Account Fit Score" button',
        'Examples of great-fit accounts',
      ],
      src: '/images/projects/afs/screens/afs-10-email.png',
    },
    {
      num: '11',
      title: 'Results: score distribution and top factors',
      lead: 'Turn the model output into something to act on.',
      body: 'The Active row expands into a score distribution (Low, Moderate, Great fit by score range), the top factors behind the scores with expandable "more" lists, examples of great-fit accounts, and a Retrain Model button.',
      alt: 'Active configuration expanded to show a three-band score distribution bar, a top factors panel with an open technographics list, and example great-fit accounts.',
      keyElements: [
        'Score distribution bar in three fit bands',
        'Top factors contributing to scores, with "more" lists',
        'Examples of great-fit accounts and an "Open in Sales OS" link',
        'Retrain Model button and a "Scores updated on" timestamp',
      ],
      src: '/images/projects/afs/screens/afs-11-results.png',
    },
    {
      num: '12',
      title: 'Row actions menu',
      lead: 'Keep management actions on the row.',
      body: 'The Active row opens a menu with Edit, Rename and Change Data Source.',
      alt: 'List row marked Active with its Actions menu open, showing Edit, Rename and Change Data Source.',
      keyElements: ['Active badge', '"..." menu with Edit, Rename, Change Data Source'],
      src: '/images/projects/afs/screens/afs-12-actions.png',
    },
  ] as AfsScreen[],

  componentPatterns: [
    {
      name: 'Condition builder row',
      description: 'A row reading {Field} is {Value} with a "..." menu; in edit mode it becomes Field, Operator and Values dropdowns.',
      usage: 'Defines scoring conditions. Text chips keep each part distinct.',
    },
    {
      name: 'Info banner',
      description: 'A blue-tinted panel with text and a dismiss icon, placed inline in the form.',
      usage: 'Explains the default condition without interrupting the flow.',
    },
    {
      name: 'Constrained add row',
      description: '"Add Condition" with a counter, "1/10 conditions added".',
      usage: 'Shows the limit before the user reaches it.',
    },
    {
      name: 'Toggle with info icon',
      description: 'A switch, a text label and an info icon.',
      usage: 'Used for the auto-update setting, where the consequence needs explaining.',
    },
    {
      name: 'Status badge',
      description: 'A small tinted pill with a text label: Processing, Active.',
      usage: 'Shows model state in the list.',
    },
    {
      name: 'Toast',
      description: 'A dark message at the bottom left with a close icon.',
      usage: 'Confirms the save and sets the 24-hour expectation.',
    },
  ] as AfsComponentPattern[],

  notesForBuild: [
    { text: 'Status badges pair color with a text label (Processing, Active). Check the pale badge fills against the background.', criteria: 'WCAG 1.4.1, 1.4.3' },
    { text: 'The save toast carries the 24-hour message. Expose it as a status message so assistive technology hears it without a focus change.', criteria: 'WCAG 4.1.3' },
    { text: 'Icon-only controls (info icon, dismiss X, "..." menu, row expander) need accessible names and keyboard operation.', criteria: 'WCAG 4.1.2, 2.1.1' },
    { text: 'The info tooltip next to the auto-update toggle should open on keyboard focus and be dismissible.', criteria: 'WCAG 1.4.13' },
    { text: 'In the inline condition editor, return focus to the edited row after confirm or cancel.', criteria: 'WCAG 2.4.3' },
    { text: 'The source and naming modals should move focus in, contain it, and restore it on close.', criteria: 'WCAG 2.4.3, 2.1.2' },
    { text: 'The "..." and row icons look small in the screens. Check they meet the minimum target size.', criteria: 'WCAG 2.5.8' },
    { text: 'Errors for invalid or conflicting conditions should use text, not color alone.', criteria: 'WCAG 3.3.1, 1.4.1' },
    { text: 'The breadcrumb should be a navigation landmark and mark the current page.', criteria: 'WCAG 1.3.1, 2.4.8' },
  ] as AfsNote[],

  handoff: [
    {
      title: 'Documentation status',
      body: 'The Figma cover frame shows a Ready for Dev badge with a documentation list. I have not reproduced the linked documents here.',
    },
    {
      title: 'Component states',
      body: 'The screens show default states. A build needs hover, focus, disabled and error states for condition rows, toggles, banners and radio options.',
    },
    {
      title: 'Empty, loading and error states',
      body: 'The canvas has groups for "Salesforce not integrated", unusual error cases and a score distribution edge case. Those frames are not in my reference set, so I do not describe them.',
    },
    {
      title: 'Two data source paths',
      body: 'The Salesforce and file paths probably need separate acceptance criteria: the shell is shared, but inputs, validation and data handling differ.',
    },
    {
      title: 'Widths',
      body: 'The canvas includes a block of frames that appear to be labeled with four desktop widths (1920, 1440, 1280 and 960 px). I have not reviewed them.',
    },
    {
      title: 'Async feedback',
      body: 'Save starts a long process. The toast, the Processing row and the email are three feedback channels that frontend and notification services would need to keep in step.',
    },
  ] as AfsHandoffCard[],

  limitations: [
    'Reconstructed from final UI screens. Discovery artifacts, research findings and early wireframes were not available, so reasons are my reading, not recorded decisions.',
    'Business-specific conditions, scoring weights and training logic are abstracted on purpose.',
    'No usability testing or product metrics are claimed. The "what I would instrument" lines are proposals.',
    'The file-upload path, Retrain and other states are only sketched in the appendix, labeled as reconstructions, because their screens are not in my reference set.',
    'Colors and type are approximate, estimated from screenshots. No design tokens were extracted from Figma.',
    'Per-decision authorship is not marked beyond "observed from the final screens" until the owner confirms which decisions Vijay designed.',
  ],

  reflection:
    'Working back from final screens is closer to a design audit than to discovery. What I can do honestly is describe what is visible, say what I think each choice is for, name one alternative where the screens allow it, and propose what I would measure. The strongest part of this flow, in my reading, is how it treats the wait: a time promise at save, proof that the data arrived, an email at the end, and a results view that points to the next action. The weakest evidence is anything about users, because none is in the file.',

  wireframeNote:
    'Reconstruction: not a shipped screen. Layout inferred from frame names in the Figma canvas; all copy is illustrative.',
};
