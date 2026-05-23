export interface ScheduleScreen {
  num: string;
  title: string;
  purpose: string;
  keyElements: string[];
  uxNote: string;
  src: string;
}

export interface ScheduleDemonstratesItem {
  title: string;
  body: string;
}

export interface ScheduleDecision {
  num: string;
  title: string;
  body: string;
  why: string;
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

export const scheduleCaseStudy = {
  id: 'zoominfo-schedule',
  title: 'ZoomInfo Schedule',
  subtitle:
    "ZoomInfo's answer to Calendly — scheduling built directly into ZoomInfo Marketing. Availability setup, meeting types, and email reminders for sales and RevOps teams.",
  tags: [
    'Enterprise UX',
    'Scheduling',
    'Calendar Settings',
    'B2B SaaS',
    'ZoomInfo',
    'Configuration UI',
    'Email Reminders',
    'Workflow Design',
    'Design System',
  ],

  snapshot: [
    { label: 'Role', value: 'UX/UI Design Contributor, ZoomInfo Marketing' },
    { label: 'Company', value: 'ZoomInfo, enterprise B2B intelligence platform' },
    { label: 'Platform', value: 'ZoomInfo Marketing web application' },
    { label: 'Source', value: 'Final Figma UI screens, company project' },
    { label: 'Focus', value: 'Availability setup, meeting type creation, reminder configuration' },
    { label: 'Comparable', value: 'Calendly, Chili Piper — built natively within ZoomInfo' },
  ],

  confidentialityNote:
    'This case study is based on UI screens from a company project within ZoomInfo Marketing. Business context, internal workflows, and specific team details are kept at a high level. Prototype data visible in the screens — "Product Related Queries", "Chennai", "ZI Schedule Demo", "JD" — are test values used during design, not real customer or business data.',

  demonstrates: [
    {
      title: 'Enterprise scheduling UX',
      body: 'ZoomInfo Schedule lives in the same nav as Audiences, Advertising, and Buying Signals. The feature had to feel like it belonged there — not like a Calendly widget dropped into a B2B platform.',
    },
    {
      title: 'Two-phase setup flow',
      body: 'Availability and meeting types are separate concerns that reference each other. Default availability is pre-set so users can skip straight to creating their first meeting type if Mon–Fri 9–5 already matches their schedule.',
    },
    {
      title: 'Smart defaults and guided setup',
      body: 'Mon–Fri 9–5 is set before you touch anything. A 30-minute reminder is already added. The email reminders section leads with "Adding a reminder can reduce no-shows up to 60%" — a reason to actually read it instead of skipping straight to Save.',
    },
    {
      title: 'Constraint communication at the boundary',
      body: "The 3-reminder cap doesn't appear in the form. You only see it when you try to add a fourth — the link is disabled and a tooltip explains why. No need to flag limits to users who'll never reach them.",
    },
    {
      title: 'Destructive action protection',
      body: "Hitting Cancel on a partially completed meeting type shows a confirmation: \"Discard Meeting Type? Your changes won't be saved.\" One accidental tap shouldn't wipe out a form someone just spent five minutes filling in.",
    },
    {
      title: 'Email customisation with live preview',
      body: 'Edit the reminder email on the left, see what the recipient gets on the right. The preview updates as you type. No sending yourself a test email to check how the formatting landed.',
    },
  ] as ScheduleDemonstratesItem[],

  overview:
    "ZoomInfo Schedule is essentially Calendly inside ZoomInfo Marketing. Sales reps and account executives configure their availability, create named meeting types, set up email reminders, and share booking links with prospects — without switching to a separate tool. The feature sits in Calendar Settings, one of four sub-tabs under Settings.",

  problem: {
    main: 'Teams using ZoomInfo still needed a scheduling tool. Without one built in, they were sending prospects to Calendly or Chili Piper — separate products that break the flow of an outreach sequence and add another thing to manage.',
    detail:
      "A native scheduling tool fixes this. Booking links can be shared directly from ZoomInfo workflows, and reps don't need to jump between products to get a meeting on the calendar. The design challenge was keeping setup fast — someone who has used Calendly before should be up and running in a few minutes, not an afternoon.",
    highlight:
      'A scheduling tool that takes too long to set up is one people configure once and never touch again. Getting started needs to be fast; coming back to edit needs to be obvious.',
  },

  users: [
    {
      type: 'Primary',
      label: 'Sales representatives and account executives',
      description:
        'Users who configure their own scheduling page and share booking links with prospects during outreach. They need to set up availability and meeting types quickly and get back to selling.',
      tasks: [
        'Set or review default availability (work hours, time zone)',
        'Adjust split-shift availability if needed',
        'Create a named meeting type (title, description, video conferencing)',
        'Configure email reminders for the meeting type',
        'Customise the reminder email template if needed',
        'Copy booking URL to share in emails or messages',
        'Share specific available time slots directly with a prospect',
      ],
    },
    {
      type: 'Secondary',
      label: 'Marketing operations and RevOps teams',
      description:
        'Users who configure scheduling for team-wide use or embed booking URLs into ZoomInfo Marketing Workflows and campaign sequences.',
      tasks: [
        'Configure default availability for a team or workspace',
        'Create standardised meeting types for consistent outreach',
        'Embed booking URLs in ZoomInfo Workflows',
        'Manage and audit existing meeting types',
      ],
    },
  ],

  iaDescription:
    'ZoomInfo Schedule sits under Settings → Calendar Settings, alongside My Account, Integrations, and Customisation. From the Calendar Settings landing you can go to Manage Availability or Create a Meeting Type. Created meeting types show up as cards with sharing actions directly on each card.',

  iaTree: [
    { label: 'ZoomInfo Marketing', level: 0 },
    { label: 'Dashboard', level: 1 },
    { label: 'Audiences', level: 1 },
    { label: 'Advertising', level: 1 },
    { label: 'Buying Signals', level: 1 },
    { label: 'Conversion', level: 1 },
    { label: 'Workflows', level: 1 },
    { label: 'Lists', level: 1 },
    { label: 'Settings', level: 1, active: true },
    { label: 'My Account', level: 2 },
    { label: 'Integrations', level: 2 },
    { label: 'Customisation', level: 2 },
    { label: 'Calendar Settings', level: 2, active: true },
    { label: 'Manage Availability', level: 3 },
    { label: 'Time Zone', level: 4 },
    { label: 'Work Hours (day toggles + time slots)', level: 4 },
    { label: 'Buffer Time + Meeting Buffers', level: 4 },
    { label: 'My Meeting Types', level: 3 },
    { label: 'Create Meeting Type', level: 4 },
    { label: 'Basic Settings (title, description, video conf)', level: 5 },
    { label: 'Email Reminders (up to 3)', level: 5 },
    { label: 'Customize Reminder Email (per reminder)', level: 5 },
    { label: 'Availability (per meeting type override)', level: 5 },
    { label: 'Meeting Type Card', level: 4 },
    { label: 'Share slots', level: 5 },
    { label: 'Copy booking URL', level: 5 },
    { label: '... overflow menu (edit, delete)', level: 5 },
  ],

  userFlowDescription:
    'Two paths from Calendar Settings. Availability is pre-configured by default — skip it or adjust it. Creating a meeting type is the main task and references whatever availability is set.',

  userFlowAvailability: [
    'Calendar Settings',
    'Manage Availability',
    'Set time zone',
    'Toggle active days',
    'Configure time slots',
    'Set buffer times',
    'Save',
    'Back to Calendar Settings',
  ],

  userFlowCreateMeeting: [
    'Calendar Settings',
    'Create Meeting Type',
    'Title + description',
    'Select video conf',
    'Configure reminders',
    '(Customise email)',
    'Save',
    'Meeting type card',
  ],

  decisions: [
    {
      num: '01',
      title: 'Default availability pre-configured removes the blank-state setup blocker',
      body: 'New users arrive at Calendar Settings with Mon-Fri 9:00 AM - 5:00 PM already set in their detected time zone. The empty state tells them availability is ready and includes an inline link to edit if needed.',
      why: 'Most sales reps work standard business hours. Forcing every user to configure availability from scratch before creating their first meeting type is unnecessary friction. The default lets people skip straight to meeting type creation if it already fits their schedule.',
    },
    {
      num: '02',
      title: 'Split-shift availability supports flexible and blocked schedules',
      body: 'Each day supports multiple time slots, stacked vertically under the day label. Users add slots with a + button and remove individual slots with a trash icon without affecting other rows.',
      why: 'Enterprise users often have midday breaks, internal meeting blocks, or split hours across time zones. A single start/end time per day would force users to either over-expose their availability or block off time they are actually free.',
    },
    {
      num: '03',
      title: 'Email reminder toggle anchored to a no-show reduction stat',
      body: 'The Email Reminders section leads with "Adding a reminder can reduce no-shows up to 60%" directly below the section label. The toggle is on by default with a 30-minute reminder already configured.',
      why: "Left as a plain toggle, most users skip past it. Pairing it with a concrete business outcome gives people a reason to actually engage with the setting rather than switch it off and move on.",
    },
    {
      num: '04',
      title: 'Reminder limit communicated at the boundary, not upfront',
      body: 'The maximum of 3 reminders is not stated in the form. When the user tries to add a fourth, the add link becomes disabled and a tooltip reads "Only 3 reminders are possible".',
      why: 'Stating limits upfront adds noise for users who never reach them. Showing the constraint only when it becomes relevant keeps the form clean and puts the information exactly where it is needed.',
    },
    {
      num: '05',
      title: 'Live email preview cuts out the test-send step',
      body: 'The Customize Reminder Email modal shows a rendered preview alongside the editor. Changes update in real time — you see what recipients will receive without sending a test email to yourself.',
      why: 'Editing email templates without a preview means holding a mental model of how tokens and formatting will render. Seeing it live removes that guesswork and makes the editing loop much shorter.',
    },
    {
      num: '06',
      title: 'Discard confirmation protects unsaved work on accidental cancel',
      body: "Clicking Cancel on a partially completed Create Meeting Type form triggers a modal: \"Discard Meeting Type? The changes you have made won't be saved.\" Users must explicitly choose to discard or return to the form.",
      why: 'Cancel on a configuration form is an easy accidental tap. A confirmation modal keeps someone from losing work without needing an auto-save system. Cancel / Discard makes each action clear — no ambiguity about which button does what.',
    },
    {
      num: '07',
      title: 'Booking URL and Share slots surface as primary actions on the card',
      body: 'After a meeting type is created, "Share slots" and "Copy booking URL" appear directly on the card in the list view — not inside an edit flow or settings drawer.',
      why: "The most common thing you do after creating a meeting type is share it. One-click access to the booking URL from the list means you don't have to go back into the meeting type settings just to get a link.",
    },
  ] as ScheduleDecision[],

  designSystemDescription:
    'The visual language here is noticeably lighter than the Admin Portal in the AFS case study — more form-focused, almost consumer-grade in feel despite the B2B context. These are the component patterns visible across the screens.',

  designSystemColors: [
    { name: 'ZoomInfo blue', hex: '#1B7AFF', usage: 'CTAs, active pill states, links, toggle on, focus rings' },
    { name: 'Near-black', hex: '#0F172A', usage: 'Page titles, section headings, input values' },
    { name: 'Body text', hex: '#374151', usage: 'Form labels, descriptions, card body copy' },
    { name: 'Muted', hex: '#6B7280', usage: 'Placeholder text, helper copy, metadata chips on cards' },
    { name: 'Border', hex: '#E5E7EB', usage: 'Card borders, input outlines, section dividers' },
    { name: 'Surface', hex: '#F9FAFB', usage: 'Page background, card fills, disabled input backgrounds' },
    { name: 'Success green', hex: '#16A34A', usage: 'Success toast icon and accent border' },
    { name: 'Toast background', hex: '#1F2937', usage: 'Dark background on success and action confirmation toasts' },
  ],

  screens: [
    {
      num: '01',
      title: 'Calendar Settings — empty state',
      purpose: 'Entry point for first-time scheduling setup. Communicates that default availability is already configured and directs users to create their first meeting type.',
      keyElements: [
        'ZoomInfo Marketing top nav: Dashboard, Audiences, Advertising, Buying Signals, Conversion, Workflows, Lists',
        'Settings breadcrumb with sub-tabs: My Account, Integrations, Customisation, Calendar Settings (active)',
        '"My Meeting Types" heading with 0/3 Created counter',
        'Empty state illustration',
        '"Setup your first meeting type" heading with descriptive body copy',
        'Inline "edit" text link for availability — escape hatch without disrupting CTA hierarchy',
        '"Create Meeting Type" CTA at centre and top right',
        '"Manage Availability" outline button at top right',
      ],
      uxNote: 'The empty state pulls two jobs at once — it makes Create Meeting Type the obvious next step while quietly telling you availability is already set. The "edit" link in the body copy gives you an out if your hours are different, without it competing with the main button for attention.',
      src: '/images/projects/schedule/screens/schedule-01-empty-state.png',
    },
    {
      num: '02',
      title: 'Manage Default Availability — single slot view',
      purpose: 'Availability configuration showing the pre-set Mon-Fri 9:00 AM to 5:00 PM defaults. Users can adjust time zone, toggle active days, and change or add time slots.',
      keyElements: [
        'Breadcrumb: < Calendar Settings / Manage Default Availability',
        'Cancel + Save buttons (top right)',
        'Time Zone: (GMT -4:00) Eastern Time - New York',
        'Work Hours Availability section with explanatory description',
        'Day toggle pills: Sun/Sat inactive, Mon-Fri active (blue filled)',
        'Day / Start Time / End Time column table',
        'Mon-Fri: 9:00 AM - 5:00 PM single slot each',
        '"Apply to all" shortcut on Monday row',
        'Buffer time: toggle ON, set to 24 Hours',
        'Meeting buffers: toggle ON, Before: 5 Mins, After: 5 Mins',
      ],
      uxNote: 'The day pill pattern (filled/empty circle per day) scans faster than a checkbox list for a small, fixed set of items. "Apply to all" on the Monday row broadcasts a single schedule across all active days in one click — cuts out the repetitive input for the most common setup.',
      src: '/images/projects/schedule/screens/schedule-02-availability-default.png',
    },
    {
      num: '03',
      title: 'Manage Default Availability — split shifts added',
      purpose: 'Same availability screen after a second time slot has been added to each active day, showing a split schedule with a midday gap visible to prospects.',
      keyElements: [
        'Each active day (Mon-Fri) shows two stacked time slot rows',
        'Morning slot: 9:00 AM - 12:00 PM',
        'Afternoon slot: 2:00 PM - 5:00 PM',
        'Each slot row has + (add another slot) and trash (remove this slot) controls inline',
        'Slots stack vertically under the day label without horizontal crowding',
        'Buffer time section visible at the scroll bottom',
      ],
      uxNote: 'Stacking multiple slots under a single day label keeps the grid readable no matter how many windows are added. Individual trash icons per slot make it clear you can remove a specific time window without touching the rest of the day.',
      src: '/images/projects/schedule/screens/schedule-03-availability-split.png',
    },
    {
      num: '04',
      title: 'Calendar Settings — availability saved with success toast',
      purpose: 'Return to Calendar Settings after saving updated availability. A success toast at the bottom left confirms the change was applied.',
      keyElements: [
        'Back at Calendar Settings landing — 0/3 Created, empty state intact',
        'Success toast: "Default Availability has been changed successfully"',
        'Toast uses dark background, green check icon, and X dismiss button',
        '"Create Meeting Type" CTA still prominent — clear next step in the flow',
        'No data loss or navigation disruption on return',
      ],
      uxNote: 'Saving availability brings you back to the Calendar Settings landing — not a dedicated confirmation page. The toast tells you it worked, and you land exactly where the next task starts: creating a meeting type.',
      src: '/images/projects/schedule/screens/schedule-04-availability-saved.png',
    },
    {
      num: '05',
      title: 'Calendar Settings — ready to create',
      purpose: 'Calendar Settings landing in its pre-creation state. Availability is configured; the user is ready to start their first meeting type.',
      keyElements: [
        'Same Calendar Settings shell — 0/3 Created, empty state',
        '"Create Meeting Type" as the single primary CTA',
        '"Manage Availability" accessible if the user wants to revisit hours',
        'Clean state with no pending notifications',
      ],
      uxNote: "Whether you just saved availability or loaded the page fresh, you end up in the same place — the empty state with Create Meeting Type front and centre. There's no dependency on how you got here.",
      src: '/images/projects/schedule/screens/schedule-05-pre-create.png',
    },
    {
      num: '06',
      title: 'Create Meeting Type — empty form',
      purpose: 'Initial Create Meeting Type form state. Required fields are unfilled, Save is disabled, one default reminder is pre-configured, and the cancel/reschedule links checkbox is pre-checked.',
      keyElements: [
        'Breadcrumb: < Calendar Settings / Create Meeting Type',
        'Cancel + Save (disabled, greyed out) top right',
        'Basic Settings card: *Meeting Title (required), Meeting Description, *Select Video Conferencing (required dropdown)',
        'Email Reminders card: toggle ON, "Adding a reminder can reduce no-shows up to 60%"',
        '1 default reminder: Send email 30 Minutes before, "Edit default email" link',
        '"+ Add new reminder" available',
        'Availability card: "Edit default availability" link, description text',
        'Checkbox: Include cancel and reschedule links (pre-checked, labelled recommended)',
      ],
      uxNote: 'Save is greyed out on load — it tells you required fields still need filling without spraying the form with red errors on arrival. The pre-added 30-minute reminder and pre-checked reschedule link are suggestions, not mandates. Both can be removed.',
      src: '/images/projects/schedule/screens/schedule-06-create-empty.png',
    },
    {
      num: '07',
      title: 'Create Meeting Type — filled form, 3 reminders at limit',
      purpose: 'Form complete with meeting details and the maximum of 3 email reminders configured. Save is now active. The reminder constraint is surfaced via tooltip.',
      keyElements: [
        'Meeting Title: "Product Related Queries" (prototype data)',
        'Description: "Discuss about the product related queries and helps to clarify other queries"',
        'Video Conferencing: Custom type with "Chennai" as custom location (prototype data)',
        '3 reminders: 30 Minutes, 01 Hour, 30 Minutes before',
        'Tooltip on disabled "+ Add new reminder": "Only 3 reminders are possible"',
        'Save button now active blue — validation passes',
      ],
      uxNote: 'The constraint tooltip only appears when you hit the limit, not before. The disabled state on the add link is the visual signal; the tooltip gives the reason. Users who add two reminders and stop never see this message — the form stays clean for the common case.',
      src: '/images/projects/schedule/screens/schedule-07-create-filled.png',
    },
    {
      num: '08',
      title: 'Customize Reminder Email — editor with live preview',
      purpose: 'Modal for editing the reminder email template. A split-panel layout shows the editor and live rendered preview side by side.',
      keyElements: [
        'Modal overlay on dimmed Create Meeting Type background',
        '"Customize Reminder Email" heading with X close',
        'Subject line field with dynamic token tags (Meeting_Title)',
        'Rich text editor with formatting toolbar',
        'Right panel: live rendered email preview',
        'Preview shows prototype meeting details: "ZI Schedule Demo", date/time, Google Meet link',
        '"Reset to suggested default" link for safety net',
        'Cancel | Save buttons',
      ],
      uxNote: 'Edit on the left, see what the recipient gets on the right. "Reset to suggested default" is the safety net — you can rewrite freely knowing you can get back to the original without starting over.',
      src: '/images/projects/schedule/screens/schedule-08-email-editor-1.png',
    },
    {
      num: '09',
      title: 'Customize Reminder Email — second reminder state',
      purpose: 'The same email editor modal opened for a second reminder, showing consistent structure across different reminder templates.',
      keyElements: [
        'Same modal structure as Screen 08',
        'Subject and body content may differ for this reminder',
        '"Reset to suggested default" available for this template',
        'Live preview updated for this reminder content',
      ],
      uxNote: 'Same modal regardless of which reminder you are editing. You can write a brief 30-minute heads-up or a more detailed 24-hour notice — each gets its own template, but the editing experience never changes.',
      src: '/images/projects/schedule/screens/schedule-09-email-editor-2.png',
    },
    {
      num: '10',
      title: 'Create Meeting Type — custom email saved',
      purpose: 'Create Meeting Type form after the reminder email has been customised and saved. The action label changes to confirm the customisation is stored.',
      keyElements: [
        'Form shows "Product Related Queries" and the filled configuration',
        'Email Reminders: "Edit custom email" label (was "Edit default email")',
        'Label change confirms the custom template is saved and active',
        'Availability section shows "Edit Default Availability" (capitalised)',
        'Save button active — form ready to finalise',
      ],
      uxNote: 'The label flipping from "Edit default email" to "Edit custom email" is a small thing that matters. It tells you your version is saved and that clicking again opens what you wrote — not a reset to the system template.',
      src: '/images/projects/schedule/screens/schedule-10-create-custom-email.png',
    },
    {
      num: '11',
      title: 'Discard Meeting Type — confirmation modal',
      purpose: 'Confirmation dialog protecting against accidental data loss when Cancel is clicked on a partially completed or unsaved meeting type.',
      keyElements: [
        'Modal overlay on dimmed Create Meeting Type form',
        'Info icon + "Discard Meeting Type?" heading',
        '"The changes you have made in the meeting type won\'t be saved. Are you still sure you want to discard?"',
        'Cancel — returns user to the form',
        'Discard — confirms exit without saving',
        'Clean two-action layout with clear labels',
      ],
      uxNote: 'Cancel and Discard do exactly what they say — Cancel puts you back in the form, Discard confirms you want to leave. No ambiguity about which button closes the modal versus which one abandons the work.',
      src: '/images/projects/schedule/screens/schedule-11-discard-modal.png',
    },
    {
      num: '12',
      title: 'Calendar Settings — meeting type created, 1/3',
      purpose: 'Calendar Settings list view after a meeting type has been saved. The card shows the meeting type summary and exposes the primary sharing actions directly.',
      keyElements: [
        '"My Meeting Types" counter: 1/3 Created',
        'Meeting type card: "Product Related Queries" title (prototype data)',
        'Card description: prototype placeholder copy',
        'Metadata chips: Zoom icon | 3 Reminders | 30 Mins',
        '"Share slots" and "Copy booking URL" dropdown as primary card actions',
        '"..." overflow menu for additional management',
        'Success toast: "Meeting Type has been discarded successfully" (a subsequent draft was discarded)',
        '"Create Meeting Type" button still accessible — 2 more allowed',
      ],
      uxNote: '"Share slots" and "Copy booking URL" are on the card because that\'s what you do immediately after creating a meeting type. You shouldn\'t have to open an edit flow just to grab a link. The 1/3 counter sets expectations on remaining capacity before someone tries to create a fourth.',
      src: '/images/projects/schedule/screens/schedule-12-meeting-created.png',
    },
  ] as ScheduleScreen[],

  componentPatterns: [
    {
      name: 'Day toggle pills',
      description: 'A horizontal row of day abbreviations (Sun-Sat). Active days render as a blue filled circle with white text; inactive days show a bordered circle with grey text.',
      usage: 'Availability days selection. Faster to scan and tap than a checkbox list for seven fixed options with clear active/inactive states.',
    },
    {
      name: 'Time slot row',
      description: 'A day label followed by Start Time and End Time dropdowns, a + button to add another slot for the same day, and a trash icon to remove the current slot.',
      usage: 'Core of the availability form. Multiple rows under one day label handle split shifts cleanly — no horizontal crowding.',
    },
    {
      name: 'Reminder row',
      description: '"Send email [number spinner] [Minutes/Hours dropdown] before" with an edit email link and a trash icon. The unit dropdown handles both short and long lead times in a single compact row.',
      usage: 'Email Reminders section. Up to 3 per meeting type, each independently configurable and editable.',
    },
    {
      name: 'Constraint tooltip at boundary',
      description: 'Tooltip on a disabled action link appearing only when the user has reached the maximum allowed items ("Only 3 reminders are possible").',
      usage: 'The 3-reminder cap only shows up when you hit it. No reason to mention it before that point.',
    },
    {
      name: 'Conversion nudge helper text',
      description: 'A data-backed sentence immediately below a section title: "Adding a reminder can reduce no-shows up to 60%". Pairs with the toggle to create a meaningful decision point.',
      usage: 'Email Reminders toggle. Turns an easy "skip" into a deliberate decision by giving users a reason to engage.',
    },
    {
      name: 'Split editor/preview modal',
      description: 'A modal with an editable content area on the left and a live rendered preview on the right. Changes update the preview in real time.',
      usage: 'Customize Reminder Email. You see what the recipient gets as you type — no test sends needed.',
    },
    {
      name: 'Meeting type card',
      description: 'A list card showing meeting name, description, metadata chips (video platform, reminder count, duration), and inline action buttons (Share slots, Copy booking URL, overflow menu).',
      usage: 'Main view for created meeting types. Sharing actions sit directly on the card because that is the most common thing you do right after creating one.',
    },
    {
      name: 'Dark action toast',
      description: 'A dark-background notification at the bottom left of the screen. Green check icon for success states. Includes an X dismiss. Appears after saves and destructive confirmations.',
      usage: 'Confirms saves and discards without a full page reload or dedicated confirmation screen.',
    },
  ] as ScheduleComponentPattern[],

  accessibility: [
    'Day toggle pills function as a radio group — each pill should use radio button semantics within a fieldset with a "Active days" legend',
    'Time dropdowns use standard select semantics and are keyboard navigable',
    'Required fields marked with * — screen reader labels should include the word "required"',
    'Save button disabled state should use aria-disabled="true" with a visible or accessible explanation',
    'Trash icon buttons on slot and reminder rows are icon-only — each needs an aria-label (e.g. "Remove Monday morning slot")',
    'Constraint tooltip ("Only 3 reminders are possible") must be keyboard-accessible, not hover-only',
    'Discard modal: focus should move into the modal on open, be trapped within it, and Escape should trigger Cancel (not Discard)',
    'Success toast should be announced via an aria-live="polite" region',
    'Email preview panel is decorative — mark as aria-hidden to avoid double-reading by screen readers',
    'Recommended: "Apply to all" should provide visible feedback (brief toast or row highlight) confirming the propagation completed',
  ],

  handoff: [
    {
      title: 'Time zone detection and defaults',
      body: 'The time zone selector defaults to browser locale. Open questions for handoff: what happens if detection fails, whether timezone changes update existing meeting types retroactively, and whose timezone shows on the booking page — the host\'s or the guest\'s.',
    },
    {
      title: 'Dynamic email tokens',
      body: 'The email editor uses tokens rendered as tag chips — Meeting_Title and others. The handoff needs to define the full token list, what happens if a token value is empty when the reminder fires, and how they render in the actual sent email.',
    },
    {
      title: 'Slot conflict validation',
      body: 'Multiple slots per day can overlap. The handoff needs to define when validation runs (on blur or on save), how conflicts are surfaced, and whether overlapping windows are blocked entirely or just warned.',
    },
    {
      title: 'Meeting type plan limit (3 of 3)',
      body: 'The 0/3 counter is a plan-level cap. What happens when all three slots are used — is the CTA disabled, hidden, or does it prompt an upgrade? And does deleting a meeting type free the count back up?',
    },
    {
      title: 'Booking URL routing',
      body: '"Copy booking URL" generates a shareable link to the prospect-facing booking page. The handoff needs URL structure, how it routes to the right meeting type, guest session handling, and what the confirmation flow looks like after a slot is booked.',
    },
    {
      title: 'Reminder email delivery',
      body: 'Reminders fire at configured intervals. The handoff needs to clarify what happens when a meeting is rescheduled or cancelled after reminders are set, how unsubscribes work, and what sending infrastructure backs this.',
    },
  ] as ScheduleHandoffCard[],

  limitations: [
    'Case study reconstructed from final UI screens. Original discovery artefacts, wireframes, and research findings were not available.',
    '"Product Related Queries", "Chennai", "ZI Schedule Demo", "JD" and supporting text are prototype test values used during design, not real customer or business data.',
    'The prospect-facing booking page (what a guest sees when opening the booking URL) is not represented in the available screens.',
    'Business-specific configuration options, plan tier limits, and backend behaviour are described at a pattern level only.',
    'The 30-minute meeting duration chip in Screen 12 is prototype data — the duration configuration field is not visible in the available screens.',
    'Internal team structure and project timeline details have been omitted from this portfolio case study.',
  ],

  reflection:
    "The interesting challenge here wasn't scheduling itself — Calendly figured that out years ago. It was making a familiar product feel like it belonged inside a platform where scheduling was never the main feature. A few decisions land well: defaults that skip the blank-slate problem on first load, a reminder section that gives you a reason to configure it rather than dismiss it, constraints that stay out of sight until you actually hit them. The discard modal is probably the least glamorous thing in the product and the most important — one mis-tap on Cancel shouldn't wipe out someone's work. The card design gets the post-creation priority right too: you built the meeting type to share it, and that's the first thing the card lets you do. Small calls, but they add up.",
};
