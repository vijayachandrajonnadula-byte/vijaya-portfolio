export interface ScheduleScreen {
  num: string;
  title: string;
  /** Bold first clause: the decision the screen shows. */
  lead: string;
  body: string;
  alt: string;
  keyElements: string[];
  src: string;
}

export interface ScheduleDecision {
  num: string;
  title: string;
  saw: string;
  reading: string;
  alternative?: string;
  instrument: string;
  /** 'designed' only when the owner confirms it; the default is 'observed'. */
  basis: 'designed' | 'observed';
  screens: string;
  crop?: { src: string; pos: string; alt: string };
}

export interface ScheduleComponentPattern {
  name: string;
  description: string;
  usage: string;
}

export interface ScheduleHandoffCard {
  title: string;
  body: string;
}

export interface ScheduleNote {
  text: string;
  criteria: string;
}

export const scheduleCaseStudy = {
  id: 'zoominfo-schedule',
  title: 'ZoomInfo Schedule',
  subtitle:
    'Scheduling settings inside ZoomInfo Marketing: default availability, meeting types and email reminders, with booking links ready to share.',
  tags: ['Enterprise UX', 'Scheduling', 'Calendar Settings', 'B2B SaaS', 'Configuration UI', 'Figma'],

  myPart:
    'UX/UI Design Contributor on ZoomInfo Marketing. Focus of this write-up: availability setup, meeting type creation and reminder configuration.',
  outcome:
    'Final Figma screens from a company project. No shipped result or metrics are claimed: this page reconstructs the structure and reasoning from those screens.',
  statusLabel: 'Final screens, reconstructed',

  snapshot: [
    { label: 'Role', value: 'UX/UI Design Contributor, ZoomInfo Marketing' },
    { label: 'Company', value: 'ZoomInfo, enterprise B2B intelligence platform' },
    { label: 'Platform', value: 'ZoomInfo Marketing web application' },
    { label: 'Source', value: 'Final Figma UI screens, company project' },
    { label: 'Focus', value: 'Availability setup, meeting type creation, reminder configuration' },
    { label: 'Output', value: 'A design audit of the final screens: flow, decisions, notes for build' },
  ],

  readingNote: {
    title: 'How to read this page',
    items: [
      'This is company work. Business context, internal workflows and team details are left out on purpose.',
      'It is reconstructed from final Figma screens. There is no research or discovery artifact behind it, so every reason given is my reading of the screens, not a recorded fact.',
      'Each decision is tagged "Observed from the final screens" unless the owner has confirmed it was designed by Vijay.',
      'Values such as "Product Related Queries", "Chennai", "ZI Schedule Demo" and "JD" are test data from the prototype. The sample email body in the editor names a real company; it is placeholder copy.',
    ],
  },

  overview:
    'From the screens, Schedule lives under Settings, Calendar Settings in ZoomInfo Marketing. A user sets default availability, creates up to three meeting types (the list header counts "0/3 Created"), configures email reminders for each, and copies a booking URL or shares slots from the meeting type card.',

  problem: {
    main: 'Setting up scheduling involves several linked settings: when you are available, what a meeting is, and what reminders go out. A form that asks for all of it up front would be slow to finish.',
    detail:
      'My reading of the screens: the design tries to make the first meeting type quick (sensible defaults, one required field group) while leaving the controls that busy people need within reach (split shifts, custom reminder emails, per-meeting availability).',
    highlight:
      'Getting started has to be fast, and coming back to edit has to be obvious.',
  },

  userFlowDescription:
    'Two paths start from Calendar Settings. Availability is already filled in, so a user can skip it. Creating a meeting type is the main task.',

  userFlowAvailability: [
    'Calendar Settings',
    'Manage Availability',
    'Time zone and active days',
    'Time slots and buffers',
    'Save',
    'Back to Calendar Settings, toast',
  ],

  userFlowCreateMeeting: [
    'Calendar Settings',
    'Create Meeting Type',
    'Title, description, video conferencing',
    'Reminders',
    '(Customize email)',
    'Save',
    'Meeting type card with share actions',
  ],

  decisions: [
    {
      num: '01',
      title: 'Pre-fill availability and say so on the empty state',
      saw: 'The empty state reads "We have set up default availability for you. You can edit it if needed." Availability opens as Monday to Friday, 9:00 AM to 5:00 PM, in Eastern Time (New York).',
      reading:
        'Most people can skip availability and go straight to their first meeting type. The inline "edit" link is a quiet way back that does not compete with the main button.',
      alternative: 'Requiring availability before the first meeting type would add a step many people may not need.',
      instrument:
        'What I would instrument: the share of users who open Manage Availability before creating a meeting type, and how often they change the defaults. I cannot tell from the screens whether the time zone comes from browser detection.',
      basis: 'observed',
      screens: '01, 02',
      crop: {
        src: '/images/projects/schedule/screens/schedule-01-empty-state.png',
        pos: '50% 78%',
        alt: 'Empty state reading Setup your first meeting type, with copy saying default availability has been set up and an edit link, above a Create Meeting Type button.',
      },
    },
    {
      num: '02',
      title: 'Explain the reminder limit at the moment it applies',
      saw: 'The form does not mention a cap. With three reminders added, "Add new reminder" turns grey and a tooltip reads "Only 3 reminders are possible".',
      reading:
        'Users who add one or two reminders never see the message, so the form stays clean for the common case and the explanation appears right where it is needed.',
      alternative: 'Stating the limit up front, which adds text for people who will not reach it.',
      instrument:
        'What I would instrument: how often people hit the limit. Risk: a hover-only tooltip is easy to miss, so I would check that it is reachable by keyboard and touch.',
      basis: 'observed',
      screens: '06',
      crop: {
        src: '/images/projects/schedule/screens/schedule-07-create-filled.png',
        pos: '0% 82%',
        alt: 'Email Reminders card with three reminders and a disabled Add new reminder link under a dark tooltip reading Only 3 reminders are possible.',
      },
    },
    {
      num: '03',
      title: 'Edit the reminder email beside a rendered preview',
      saw: 'The Customize Reminder Email modal has an editor on the left (subject, locked blocks, token chips such as {Meeting_Title}, a formatting toolbar, a reset link) and a preview on the right with desktop, tablet and mobile toggles and an "Email Yourself" button.',
      reading:
        'The preview shows the shape of the email while the editor controls the wording. The preview in the screen uses placeholder date text, and "Email Yourself" suggests a real test send is also offered. I cannot tell from a static screen whether the preview updates as you type.',
      alternative: 'Editing in a plain text area and finding out by sending a test.',
      instrument:
        'What I would instrument: how many people open the editor, save a change, or use Reset. Risk: token chips need clear behavior when a value is empty.',
      basis: 'observed',
      screens: '07',
      crop: {
        src: '/images/projects/schedule/screens/schedule-08-email-editor-1.png',
        pos: '60% 30%',
        alt: 'Customize Reminder Email modal with an editor on the left and a rendered email preview on the right, including device toggles and an Email Yourself button.',
      },
    },
    {
      num: '04',
      title: 'Stack extra time windows under the day',
      saw: 'After a second window is added, each active day shows a 9:00 AM to 12:00 PM row and a 2:00 PM to 5:00 PM row. The first row carries a plus, the second a trash icon. "Apply to all" sits on the Monday row.',
      reading: 'Stacking keeps the grid readable however many windows are added, and each window can be removed without touching the rest of the day.',
      instrument: 'What I would instrument: how often split shifts are used, and how often overlapping windows are entered (see open questions).',
      basis: 'observed',
      screens: '02, 03',
    },
    {
      num: '05',
      title: 'Confirm before discarding a half-filled meeting type',
      saw: 'Cancel opens "Discard Meeting Type?" with the buttons Cancel and Discard. The copy says the changes will not be saved.',
      reading: 'A confirmation protects the work without needing autosave. The button labels say what each does.',
      instrument: 'What I would instrument: how often Discard is chosen versus Cancel. I would also check that focus and Escape behave safely (see notes for build).',
      basis: 'observed',
      screens: '09',
    },
    {
      num: '06',
      title: 'Put sharing on the meeting type card',
      saw: 'After saving, the card shows "Share slots" and a "Copy booking URL" control directly, next to chips for the video tool, reminder count and duration.',
      reading: 'Sharing a link appears to be the likely next step, so it is one action away without reopening settings.',
      instrument: 'What I would instrument: use of Copy booking URL versus Share slots, and return visits to edit.',
      basis: 'observed',
      screens: '10',
    },
    {
      num: '07',
      title: 'Persuasion line above the reminder rows',
      saw: 'The Email Reminders card carries the helper line "Adding a reminder can reduce no-shows up to 60%".',
      reading:
        'It appears to be there to encourage people to leave reminders on. I cannot verify the figure and I do not use it as evidence in this case study; it is quoted as it appears in the product copy.',
      instrument: 'What I would instrument: reminder on/off rate with and without the line, if the claim can be sourced.',
      basis: 'observed',
      screens: '05, 06',
    },
  ] as ScheduleDecision[],

  iaDescription:
    'Reconstructed from the visible top navigation and the Settings tabs. Nothing here comes from a documented sitemap.',

  iaTree: [
    { label: 'ZoomInfo Marketing: Dashboard, Audiences, Advertising, Buying Signals, Conversion, Workflows, Lists', level: 0 },
    { label: 'Settings', level: 1 },
    { label: 'My Account, Integrations, Customisation', level: 2 },
    { label: 'Calendar Settings (active)', level: 2, active: true },
    { label: 'Manage Availability: time zone, work hours, buffer time, meeting buffers', level: 3 },
    { label: 'My Meeting Types (0/3 created)', level: 3 },
    { label: 'Create Meeting Type: basic settings, email reminders, availability, cancel and reschedule links', level: 4 },
    { label: 'Customize Reminder Email (per reminder)', level: 5 },
    { label: 'Meeting type card: Share slots, Copy booking URL, "..." menu', level: 4 },
  ],

  users: [
    {
      type: 'Primary',
      label: 'Sales representatives and account executives',
      description:
        'Inferred from the feature, not from research: people who set up their own scheduling page and share booking links.',
      tasks: [
        'Review default availability',
        'Adjust split shifts',
        'Create a meeting type',
        'Set and customize reminders',
        'Copy a booking URL or share slots',
      ],
    },
    {
      type: 'Secondary',
      label: 'Marketing operations and RevOps',
      description:
        'Inferred from the product area: people who might standardize meeting types for a team. Nothing on the screens confirms team-level controls.',
      tasks: ['Create consistent meeting types', 'Review existing meeting types'],
    },
  ],

  designSystemDescription:
    'Component language that repeats across the screens, redrawn here as small decorations. Colors are approximate, estimated from screenshots and not extracted from Figma.',

  designSystemColors: [
    { name: 'Primary blue (approx.)', hex: '#1B7AFF' },
    { name: 'Near-black text (approx.)', hex: '#0F172A' },
    { name: 'Body text (approx.)', hex: '#374151' },
    { name: 'Muted text (approx.)', hex: '#6B7280' },
    { name: 'Border (approx.)', hex: '#E5E7EB' },
    { name: 'Surface (approx.)', hex: '#F9FAFB' },
    { name: 'Success green (approx.)', hex: '#16A34A' },
    { name: 'Toast (approx.)', hex: '#1F2937' },
  ],

  screens: [
    {
      num: '01',
      title: 'Calendar Settings, empty state',
      lead: 'Make the next step obvious and say availability is already handled.',
      body: '"My Meeting Types" shows 0/3 Created above an illustration and "Setup your first meeting type". The copy says default availability is set up and links "edit". Create Meeting Type appears top right and in the center; Manage Availability sits beside it. A hover state on the center button appears in a second export with the same layout.',
      alt: 'Calendar Settings page under Settings with 0 of 3 meeting types created, an illustration, and Setup your first meeting type with a Create Meeting Type button.',
      keyElements: [
        'Marketing top navigation and Settings tabs, Calendar Settings active',
        '0/3 Created counter',
        '"edit" link inside the body copy',
        'Create Meeting Type (top right and center), Manage Availability',
      ],
      src: '/images/projects/schedule/screens/schedule-01-empty-state.png',
    },
    {
      num: '02',
      title: 'Manage Default Availability',
      lead: 'Pre-fill a standard week.',
      body: 'Time zone is Eastern Time (New York). Day pills show Monday to Friday active. Each weekday runs 9:00 AM to 5:00 PM, with "Apply to all" on the Monday row. Buffer time is on (24 hours) and Meeting buffers are on (5 minutes before and after).',
      alt: 'Manage Default Availability form with a time zone selector, day pills for Monday to Friday, weekday rows of 9:00 AM to 5:00 PM, and buffer settings below.',
      keyElements: [
        'Breadcrumb with back arrow, Cancel and Save',
        'Time zone selector',
        'Day pills: Sun and Sat inactive',
        'Start and end time selects with a plus per row',
        '"Apply to all" on Monday',
        'Buffer time and Meeting buffers cards',
      ],
      src: '/images/projects/schedule/screens/schedule-02-availability-default.png',
    },
    {
      num: '03',
      title: 'Availability with split shifts',
      lead: 'Stack extra time windows under the day.',
      body: 'Each active day has two rows: 9:00 AM to 12:00 PM and 2:00 PM to 5:00 PM. The first row has a plus, the second a trash icon. The pointer is over Save.',
      alt: 'Availability form where each weekday has a morning and an afternoon time row, with plus and trash icons at the end of the rows.',
      keyElements: [
        'Two stacked rows per active day',
        'Plus on the first row, trash on the second',
        'Buffer time card visible at the bottom',
      ],
      src: '/images/projects/schedule/screens/schedule-03-availability-split.png',
    },
    {
      num: '04',
      title: 'Back on Calendar Settings, saved',
      lead: 'Return to the list and confirm with a toast.',
      body: 'After Save the user lands on Calendar Settings, still at 0/3, with a dark toast: "Default Availability has been changed successfully".',
      alt: 'Calendar Settings empty state with a dark toast at bottom left reading Default Availability has been changed successfully.',
      keyElements: ['Toast with check icon and close', 'Create Meeting Type still primary'],
      src: '/images/projects/schedule/screens/schedule-04-availability-saved.png',
    },
    {
      num: '05',
      title: 'Create Meeting Type, empty form',
      lead: 'Keep Save disabled until required fields are filled.',
      body: 'Meeting Title and Video Conferencing are required (marked *). Save is greyed out. One reminder is pre-added (30 minutes, "Edit default email"). The checkbox for cancel and reschedule links is checked and labeled recommended.',
      alt: 'Create Meeting Type form with empty title, description and video conferencing fields, one 30-minute reminder, an availability card and a checked cancel and reschedule box. Save is disabled.',
      keyElements: [
        'Basic Settings: *Meeting Title, Meeting Description, *Select Video Conferencing',
        'Email Reminders toggle with one reminder',
        'Availability card with "Edit default availability"',
        'Checkbox for cancel and reschedule links',
      ],
      src: '/images/projects/schedule/screens/schedule-06-create-empty.png',
    },
    {
      num: '06',
      title: 'Create Meeting Type, filled, at the reminder limit',
      lead: 'Explain the limit where it applies.',
      body: 'The form is filled with test data. Video conferencing is Custom with a free-text location. Three reminders exist (30 minutes, 1 hour, 30 minutes). "Add new reminder" is disabled under the tooltip "Only 3 reminders are possible". Save is active.',
      alt: 'Filled Create Meeting Type form with three reminders and a disabled Add new reminder link under the tooltip Only 3 reminders are possible. Save is enabled.',
      keyElements: [
        'Custom video conferencing with a location field',
        'Three reminder rows, each with "Edit default email" and a trash icon',
        'Disabled add link and tooltip',
        'Save active',
      ],
      src: '/images/projects/schedule/screens/schedule-07-create-filled.png',
    },
    {
      num: '07',
      title: 'Customize Reminder Email',
      lead: 'Pair the editor with a preview.',
      body: 'A modal over the dimmed form. Left: subject with a {Meeting_Title} chip, greyed locked blocks, an editable sentence with a {Remaining_Time} chip, a toolbar and "Reset to default". Right: preview with device toggles, "Email Yourself" and the sample email. A second export of this modal is identical except that the reset link reads "Reset to suggested default".',
      alt: 'Customize Reminder Email modal with a subject field, token chips and a formatting toolbar on the left, and a rendered email preview with device toggles on the right.',
      keyElements: [
        'Subject with token chip',
        'Locked blocks and token chips for meeting details',
        'Formatting toolbar and "Reset to default"',
        'Preview with desktop, tablet and mobile toggles',
        '"Email Yourself" button, Cancel and Save',
      ],
      src: '/images/projects/schedule/screens/schedule-08-email-editor-1.png',
    },
    {
      num: '08',
      title: 'Create Meeting Type, custom email saved',
      lead: 'Change the link label to show a custom email is in use.',
      body: 'Back on the form, the reminder link now reads "Edit custom email" instead of "Edit default email". Only one reminder is present.',
      alt: 'Create Meeting Type form with one reminder whose link reads Edit custom email, and an Availability card with Edit Default Availability.',
      keyElements: [
        '"Edit custom email" on the reminder',
        'Availability link capitalized as "Edit Default Availability"',
        'Save active',
      ],
      src: '/images/projects/schedule/screens/schedule-10-create-custom-email.png',
    },
    {
      num: '09',
      title: 'Discard Meeting Type confirmation',
      lead: 'Confirm before throwing work away.',
      body: 'Cancel opens a small modal with an info icon, the title "Discard Meeting Type?", the copy "The changes you have made in the meeting type won\'t be saved. Are you still sure you want to discard?", and the buttons Cancel and Discard. A copy inconsistency: the availability link reads "Edit default availability" on screen 05, "Edit Default Availability" on screen 08 and "Edit Custom Availability" behind this modal.',
      alt: 'Small modal titled Discard Meeting Type with a warning sentence and Cancel and Discard buttons over a dimmed form.',
      keyElements: ['Info icon and title', 'Warning sentence', 'Cancel and Discard buttons', 'Close icon'],
      src: '/images/projects/schedule/screens/schedule-11-discard-modal.png',
    },
    {
      num: '10',
      title: 'Meeting type card, 1/3 created',
      lead: 'Put sharing on the card.',
      body: 'The list shows 1/3 Created and a card titled "Product Related Queries" with placeholder text, chips for Zoom, 3 Reminders and 30 Mins, a "Share slots" link, a "Copy booking URL" control and a "..." menu. A toast says "Meeting Type has been discarded successfully", which probably refers to a separate draft.',
      alt: 'My Meeting Types list with one card showing a title, a short description, Zoom, 3 Reminders and 30 Mins chips, a Share slots link and a Copy booking URL control.',
      keyElements: [
        '1/3 Created counter',
        'Card with chips for video tool, reminders and duration',
        'Share slots and Copy booking URL',
        '"..." menu',
        'Toast about a discard',
      ],
      src: '/images/projects/schedule/screens/schedule-12-meeting-created.png',
    },
  ] as ScheduleScreen[],

  componentPatterns: [
    {
      name: 'Day pills',
      description: 'A row of day abbreviations. Active days are outlined and blue, inactive days grey.',
      usage: 'Chooses active days; quick to scan for seven fixed options.',
    },
    {
      name: 'Time slot row',
      description: 'A day label, start and end selects, a plus to add a window and a trash icon to remove one.',
      usage: 'Core of the availability form; stacked rows handle split shifts.',
    },
    {
      name: 'Reminder row',
      description: '"Send email [number] [unit] before", an edit-email link and a trash icon.',
      usage: 'Up to three per meeting type.',
    },
    {
      name: 'Constraint tooltip',
      description: 'A dark tooltip on a disabled add link at the limit.',
      usage: 'Explains the cap only when it applies.',
    },
    {
      name: 'Editor and preview modal',
      description: 'An editor on the left and a rendered preview on the right.',
      usage: 'Customize Reminder Email.',
    },
    {
      name: 'Meeting type card',
      description: 'Title, description, chips, and inline actions.',
      usage: 'Main view for created meeting types.',
    },
    {
      name: 'Dark toast',
      description: 'A dark message at the bottom left with a check icon and a close icon.',
      usage: 'Confirms saves and discards.',
    },
  ] as ScheduleComponentPattern[],

  notesForBuild: [
    { text: 'Day pills behave like a group of toggles. Use a fieldset with a legend such as "Active days" and expose the pressed state.', criteria: 'WCAG 1.3.1, 4.1.2' },
    { text: 'Required fields are marked with an asterisk. Make sure the accessible label says "required".', criteria: 'WCAG 3.3.2, 1.3.1' },
    { text: 'Save is greyed out until the form is valid. A visible or accessible reason helps people who cannot see the contrast difference.', criteria: 'WCAG 3.3.2, 1.4.1' },
    { text: 'Trash and plus icons on rows are icon-only. Each needs a name such as "Remove Monday afternoon slot".', criteria: 'WCAG 4.1.2, 2.5.3' },
    { text: 'The "Only 3 reminders are possible" tooltip must open on keyboard focus, not hover only.', criteria: 'WCAG 1.4.13, 2.1.1' },
    { text: 'The discard modal should move focus in, keep it inside, restore it on close, and make Escape behave like Cancel, not Discard.', criteria: 'WCAG 2.4.3, 2.1.2' },
    { text: 'Toasts should be announced through a polite live region.', criteria: 'WCAG 4.1.3' },
    { text: 'The email preview is a rendering of content, not a control; check how it is announced.', criteria: 'WCAG 1.3.1' },
    { text: 'Small controls (plus, trash, "...") should be checked against the minimum target size.', criteria: 'WCAG 2.5.8' },
    { text: '"Apply to all" should give visible feedback that it worked.', criteria: 'WCAG 4.1.3' },
  ] as ScheduleNote[],

  handoff: [
    {
      title: 'Time zone',
      body: 'The selector appears pre-filled with Eastern Time (New York). Whether that comes from the browser is not visible. Open questions: what if detection fails, do changes affect existing meeting types, and whose time zone shows on the booking page.',
    },
    {
      title: 'Email tokens',
      body: 'Tokens appear as chips ({Meeting_Title}, {Remaining_Time}, {Meeting_Description}). A build needs the full list, empty-value behavior, and how they render in the sent email.',
    },
    {
      title: 'Overlapping slots',
      body: 'Stacked windows can overlap. When does validation run, how are conflicts shown, and are they blocked or only warned?',
    },
    {
      title: 'The 3-meeting-type cap',
      body: 'The counter reads 0/3 and 1/3. I assume it is a plan-level limit but cannot confirm. What happens at 3/3, and does deleting one free a slot?',
    },
    {
      title: 'Booking URL',
      body: 'The prospect-facing page is not in the screens. URL structure, routing to the right meeting type and the post-booking confirmation are open.',
    },
    {
      title: 'Reminder delivery',
      body: 'What happens to reminders when a meeting is rescheduled or cancelled, how unsubscribes work, and what sends them are not visible.',
    },
  ] as ScheduleHandoffCard[],

  limitations: [
    'Reconstructed from final UI screens. Discovery artifacts, wireframes and research were not available, so reasons are my reading, not recorded decisions.',
    'No usability testing or product metrics are claimed. The "what I would instrument" lines are proposals.',
    'The prospect-facing booking page is not in the available screens.',
    'Business configuration, plan limits and backend behavior are described at a pattern level only.',
    'The 30-minute chip on the card is test data; the duration field is not visible in the screens.',
    'Colors are approximate, estimated from screenshots. No design tokens were extracted from Figma.',
    'Per-decision authorship is not marked beyond "observed from the final screens" until the owner confirms which decisions Vijay designed.',
    'Two near-duplicate exports (a hover variant of the empty state, and a second email editor export that differs only in one link label) are folded into the screens above instead of shown again.',
  ],

  reflection:
    'The interesting part here is not scheduling itself but how a familiar tool is fitted into a platform where scheduling is not the main feature. In my reading of the screens, a few choices carry the design: defaults that skip the blank-form problem, a limit that stays out of sight until it applies, and a card that puts sharing first. The discard confirmation is small but protects the most work. Because there is no research or test data in the file, I treat all of this as an audit with proposals, not as proof that it worked.',
};
