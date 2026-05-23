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
    'Enterprise scheduling configuration embedded inside ZoomInfo Marketing. Availability management, meeting type creation, and email reminder customisation for sales and marketing teams.',
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
      body: 'Designed a scheduling configuration experience embedded within a larger go-to-market platform. ZoomInfo Schedule lives alongside Audiences, Advertising, and other Marketing modules, requiring the feature to feel native to that product context rather than a standalone add-on.',
    },
    {
      title: 'Two-phase setup flow',
      body: 'Availability management and meeting type creation are distinct but connected tasks. The system pre-configures default availability so users can skip directly to creating their first meeting type if standard business hours work for them.',
    },
    {
      title: 'Smart defaults and guided setup',
      body: 'Default availability is pre-configured (Mon-Fri 9-5). Default email reminders are pre-added. A data-backed nudge ("reduces no-shows up to 60%") gives users a reason to engage with reminders before dismissing the section.',
    },
    {
      title: 'Constraint communication at the boundary',
      body: 'The 3-reminder limit is not stated upfront in the form. It surfaces only when the user tries to add a fourth, via a tooltip on the disabled add action. This avoids cluttering the UI with rules most users will never hit.',
    },
    {
      title: 'Destructive action protection',
      body: 'Clicking Cancel on a partially completed meeting type triggers a "Discard Meeting Type?" confirmation modal. The pattern protects users from accidentally losing work without requiring an auto-save system.',
    },
    {
      title: 'Email customisation with live preview',
      body: 'The Customize Reminder Email modal shows a live rendered preview panel alongside the editor. Users see exactly how the final email looks to recipients as they edit, eliminating the need for a "send test" round-trip.',
    },
  ] as ScheduleDemonstratesItem[],

  overview:
    'ZoomInfo Schedule is a scheduling feature built natively into the ZoomInfo Marketing application, serving the same purpose as Calendly or Chili Piper but within the ZoomInfo ecosystem. It allows sales and marketing professionals to configure their availability, create named meeting types with specific video conferencing links, set automated email reminders, and share booking URLs with prospects. The feature lives inside Calendar Settings within the Settings area of ZoomInfo Marketing.',

  problem: {
    main: 'Sales and marketing teams using ZoomInfo need to get meetings booked with prospects and customers. Without an integrated scheduling tool, teams rely on third-party services (Calendly, Chili Piper) that sit outside the ZoomInfo workflow and require prospects to navigate away from the engagement context.',
    detail:
      'Bringing scheduling natively into ZoomInfo Marketing closes this gap. Users can configure availability and meeting types without leaving the platform, and booking URLs can be shared directly from within ZoomInfo workflows. The UX challenge is making configuration feel lightweight — setup should take minutes and feel familiar to anyone who has used a modern scheduling tool.',
    highlight:
      'A scheduling tool that takes too long to configure is one people set up once and never revisit. First-time setup must be fast; returning edits must be obvious.',
  },

  users: [
    {
      type: 'Primary',
      label: 'Sales representatives and account executives',
      description:
        'Users who configure their personal scheduling page and share booking links with prospects during outreach. They need to set up availability and meeting types quickly and get back to selling.',
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
        'Users who configure scheduling for team-wide use or integrate booking URLs into ZoomInfo Marketing Workflows and campaign sequences.',
      tasks: [
        'Configure default availability for a team or workspace',
        'Create standardised meeting types for consistent outreach',
        'Embed booking URLs in ZoomInfo Workflows',
        'Manage and audit existing meeting types',
      ],
    },
  ],

  iaDescription:
    'ZoomInfo Schedule lives within Settings in ZoomInfo Marketing. Calendar Settings is one of four sub-tabs alongside My Account, Integrations, and Customisation. The feature has two primary entry points from the Calendar Settings landing: Manage Availability and Create Meeting Type. Meeting types created are listed as cards with direct action buttons.',

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
    'Two parallel flows branch from the Calendar Settings landing. Availability setup is a prerequisite the system handles by default — users can skip it or adjust it. Meeting type creation is the primary goal and references the configured availability.',

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
      body: 'New users arrive at Calendar Settings with Mon-Fri 9:00 AM - 5:00 PM already set in their detected time zone. The empty state message tells them availability is ready and offers an inline link to edit if needed.',
      why: 'Most sales reps share standard business hours. Requiring every user to configure availability from scratch before creating their first meeting type adds unnecessary friction. The default lets users skip directly to meeting type creation if it works for them.',
    },
    {
      num: '02',
      title: 'Split-shift availability supports flexible and blocked schedules',
      body: 'Each day supports multiple time slots, stacked vertically under the day label. Users add slots with a + button and remove individual slots with a trash icon without affecting other rows.',
      why: 'Enterprise users often have midday breaks, internal meeting blocks, or flexible hours across time zones. A single start/end time per day would force users to either over-expose availability or block time they are actually free.',
    },
    {
      num: '03',
      title: 'Email reminder toggle anchored to a no-show reduction stat',
      body: 'The Email Reminders section leads with "Adding a reminder can reduce no-shows up to 60%" directly below the section label. The toggle is on by default with a 30-minute reminder pre-configured.',
      why: 'Left as a plain toggle, most users skip or dismiss the section. Anchoring it to a measurable business outcome (60% reduction in no-shows) gives users a reason to engage with the setting rather than default to "off".',
    },
    {
      num: '04',
      title: 'Reminder limit communicated at the boundary, not upfront',
      body: 'The maximum of 3 reminders is not stated in the form. When the user tries to add a fourth, the add link becomes disabled and a tooltip reads "Only 3 reminders are possible".',
      why: 'Stating limits upfront ("maximum 3 reminders") adds noise for users who never reach the limit. Showing the constraint only at the point of violation keeps the form clean and surfaces information exactly when it is relevant.',
    },
    {
      num: '05',
      title: 'Live email preview eliminates the test-send round-trip',
      body: 'The Customize Reminder Email modal shows a rendered preview alongside the editor. Changes update the preview in real time — users see exactly what recipients will receive without sending a test email.',
      why: 'Email configuration without preview requires users to hold a mental model of how tokens and formatting will render. Live preview removes that cognitive load and shortens the editing loop significantly.',
    },
    {
      num: '06',
      title: 'Discard confirmation protects unsaved work on accidental cancel',
      body: 'Clicking Cancel on a partially completed Create Meeting Type form triggers a modal: "Discard Meeting Type? The changes you have made won\'t be saved." Users must explicitly choose to discard or return to the form.',
      why: 'Cancel on a configuration form is an easy accidental tap. A confirmation modal prevents data loss without requiring an auto-save system. The two-button pattern (Cancel / Discard) makes each action unambiguous.',
    },
    {
      num: '07',
      title: 'Booking URL and Share slots surface as primary actions on the card',
      body: 'After a meeting type is created, "Share slots" and "Copy booking URL" appear directly on the card in the list view — not inside an edit flow or settings drawer.',
      why: 'The most common action after creating a meeting type is sharing it with a prospect. One-click access to the booking URL from the list means users do not navigate into the meeting type just to complete the actual goal.',
    },
  ] as ScheduleDecision[],

  designSystemDescription:
    'Component patterns extracted from the ZoomInfo Schedule UI screens. The visual language is distinct from the Admin Portal used in the AFS case study — lighter, form-forward, and closer in feel to a consumer scheduling tool, despite being embedded in an enterprise B2B platform.',

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
      uxNote: 'The empty state does double duty: it drives the primary action (Create Meeting Type) while also surfacing that default availability is ready to use. The inline "edit" link inside the body copy is an escape hatch for users who need to adjust their hours first, without competing with the main CTA.',
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
      uxNote: 'The day pill pattern (filled/empty circle per day) allows faster scanning than a checkbox list for a small, fixed set of items. "Apply to all" on the Monday row lets users broadcast a single schedule across all active days in one click, cutting repetitive input for the most common setup case.',
      src: '/images/projects/schedule/screens/schedule-02-availability-default.png',
    },
    {
      num: '03',
      title: 'Manage Default Availability — split shifts added',
      purpose: 'Same availability screen after a second time slot has been added to each active day, creating a split schedule with a midday gap visible to prospects.',
      keyElements: [
        'Each active day (Mon-Fri) shows two stacked time slot rows',
        'Morning slot: 9:00 AM - 12:00 PM',
        'Afternoon slot: 2:00 PM - 5:00 PM',
        'Each slot row has + (add another slot) and trash (remove this slot) controls inline',
        'Slots stack vertically under the day label without horizontal crowding',
        'Buffer time section visible at the scroll bottom',
      ],
      uxNote: 'Stacking multiple slots under a single day label keeps the availability grid readable regardless of how many windows are added per day. Individual trash icons per slot (rather than a "remove row" action on the day) make it clear that specific time windows can be removed independently.',
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
      uxNote: 'Returning to the same empty state after saving confirms the task completed without a separate "saved" confirmation page. The toast provides closure without interrupting the flow, and users land exactly where they need to be to start the next task: creating a meeting type.',
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
      uxNote: 'The modular design of the two flows (availability + creation) is visible here: arriving from an availability edit or from a fresh session lands users in the same clear starting state. The empty state message re-establishes context and keeps the primary action accessible.',
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
      uxNote: 'The disabled Save button communicates required fields exist without triggering validation errors on load. Pre-adding a 30-minute reminder and pre-checking the cancel/reschedule checkbox nudges users toward best-practice configuration without forcing it — both can be changed or removed.',
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
      uxNote: 'The constraint tooltip appears only when the limit is reached, not before. The disabled state on the add link is the visual cue; the tooltip provides the explanation on demand. Users who never add 3 reminders never see this message — the form stays clean for the majority case.',
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
      uxNote: 'The split editor/preview eliminates the need for a "send test email" step. Users see how their email renders to recipients in real time as they edit. "Reset to suggested default" is the safety net — users can experiment freely knowing they can restore the original template without starting over.',
      src: '/images/projects/schedule/screens/schedule-08-email-editor-1.png',
    },
    {
      num: '09',
      title: 'Customize Reminder Email — second reminder state',
      purpose: 'The same email editor modal opened for a second reminder in the sequence, showing consistent structure across different reminder templates.',
      keyElements: [
        'Same modal structure as Screen 08',
        'Subject and body content may differ for this reminder',
        '"Reset to suggested default" available for this template',
        'Live preview updated for this reminder content',
      ],
      uxNote: 'Maintaining the same editor structure across all reminders makes editing predictable. Each reminder can have a distinct template (e.g. a brief 30-minute reminder vs a more detailed 24-hour one) while the interaction pattern stays consistent throughout.',
      src: '/images/projects/schedule/screens/schedule-09-email-editor-2.png',
    },
    {
      num: '10',
      title: 'Create Meeting Type — custom email saved',
      purpose: 'Create Meeting Type form after the reminder email has been customised and saved. The action label changes to confirm the customisation is stored.',
      keyElements: [
        'Form shows "Product Related Queries" and the filled configuration',
        'Email Reminders: "Edit custom email" label (was "Edit default email")',
        'Label change confirms the custom template is saved and is what will be edited next',
        'Availability section shows "Edit Default Availability" (capitalised)',
        'Save button active — form ready to finalise',
      ],
      uxNote: '"Edit custom email" vs "Edit default email" is a subtle but important distinction. It confirms to the user that their customised version is saved, and that clicking again will edit their version rather than reset to a system default. This prevents the anxiety of "will this overwrite my changes?"',
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
      uxNote: 'The Cancel/Discard button pair avoids the common modal ambiguity where "Cancel" could mean either "cancel this modal" or "cancel the underlying action". Here: Cancel returns to the form, Discard confirms the exit. The labels answer the modal\'s question directly.',
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
      uxNote: '"Share slots" and "Copy booking URL" are the most common post-creation actions, so they live directly on the card rather than inside an edit flow. The 1/3 counter signals remaining capacity within the plan, setting expectations before users create more meeting types.',
      src: '/images/projects/schedule/screens/schedule-12-meeting-created.png',
    },
  ] as ScheduleScreen[],

  componentPatterns: [
    {
      name: 'Day toggle pills',
      description: 'A horizontal row of day abbreviations (Sun-Sat). Active days render as a blue filled circle with white text; inactive days show a bordered circle with grey text.',
      usage: 'Availability configuration. Pill format is faster to scan and toggle than checkboxes for a fixed, short set of named options.',
    },
    {
      name: 'Time slot row',
      description: 'A day label followed by Start Time and End Time dropdowns, a + button to add another slot for the same day, and a trash icon to remove the current slot.',
      usage: 'Core availability pattern. Multiple rows stack under a single day label to represent split-shift schedules without horizontal crowding.',
    },
    {
      name: 'Reminder row',
      description: '"Send email [number spinner] [Minutes/Hours dropdown] before" with an edit email link and a trash icon. The unit dropdown handles short and long lead times in a single compact row.',
      usage: 'Email Reminders configuration. Up to 3 rows can be added per meeting type.',
    },
    {
      name: 'Constraint tooltip at boundary',
      description: 'Tooltip on a disabled action link appearing only when the user has reached the maximum allowed items ("Only 3 reminders are possible").',
      usage: 'Limit communication without upfront noise. The rule surfaces only when it is relevant — at the point of violation.',
    },
    {
      name: 'Conversion nudge helper text',
      description: 'A data-backed sentence immediately below a section title: "Adding a reminder can reduce no-shows up to 60%". Pairs with the toggle to create a meaningful decision point.',
      usage: 'Email Reminders section — converts a binary toggle into a choice with a visible outcome.',
    },
    {
      name: 'Split editor/preview modal',
      description: 'A modal with an editable content area on the left and a live rendered preview on the right. Changes update the preview in real time.',
      usage: 'Customize Reminder Email flow. Eliminates the send-test-email round-trip by showing the outcome inline with editing.',
    },
    {
      name: 'Meeting type card',
      description: 'A list card showing meeting name, description, metadata chips (video platform, reminder count, duration), and inline action buttons (Share slots, Copy booking URL, overflow menu).',
      usage: 'Primary management surface for created meeting types. Primary sharing actions are on the card to minimise clicks.',
    },
    {
      name: 'Dark action toast',
      description: 'A dark-background notification at the bottom left of the screen. Green check icon for success states. Includes an X dismiss. Appears after saves and destructive confirmations.',
      usage: 'Confirms async and destructive actions (availability saved, meeting type discarded) without a full-page confirmation state.',
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
      body: 'The time zone selector defaults to the detected browser locale. The handoff should document what happens if detection fails (explicit selection required), how timezone changes affect existing meeting types, and whether booking links display times in the host or guest time zone.',
    },
    {
      title: 'Dynamic email tokens',
      body: 'The reminder email editor uses tokens (Meeting_Title, date/time, etc.) rendered as tag chips. The handoff should define the full token set, how they render in the sent email, and what happens when a token value is missing at send time.',
    },
    {
      title: 'Slot conflict validation',
      body: 'Multiple time slots per day can create overlapping windows. The handoff should specify validation rules, when validation fires (on blur, on save), how conflicts are surfaced (inline error or toast), and whether overlaps are blocked or warned.',
    },
    {
      title: 'Meeting type plan limit (3 of 3)',
      body: 'The "0/3 Created" counter indicates a plan-level cap. The handoff should document the state when all 3 are used (CTA disabled or hidden), the upgrade path, and whether deleting a meeting type frees the count.',
    },
    {
      title: 'Booking URL routing',
      body: '"Copy booking URL" generates a shareable link to the prospect-facing booking page. The handoff should document the URL structure, how it routes to the correct meeting type, session handling for the guest, and the booking confirmation flow.',
    },
    {
      title: 'Reminder email delivery',
      body: 'Reminders trigger at configured intervals before the meeting. The handoff should document the sending infrastructure, how reminders behave if the meeting is rescheduled or cancelled, and unsubscribe handling.',
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
    'ZoomInfo Schedule demonstrates how a well-established product category (scheduling) can be embedded into a larger platform without feeling bolted-on. The design does several things well: it pre-configures defaults so first-time setup is optional, it anchors the email reminder toggle to a concrete business outcome, and it surfaces constraints only at the point where they become relevant rather than upfront. The discard confirmation is a pragmatic solution to unsaved state — effective without requiring an auto-save system. The post-creation card design gets the priority right: the goal after creating a meeting type is sharing it, and the card makes that a single click. Together these small decisions add up to a feature that feels considered rather than functional.',
};
