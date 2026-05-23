export interface AfsDemonstratesItem {
  title: string;
  body: string;
}

export interface AfsDecision {
  num: string;
  title: string;
  body: string;
  why: string;
}

export interface AfsScreen {
  num: string;
  title: string;
  purpose: string;
  keyElements: string[];
  uxNote: string;
  src?: string;
  wireframeKey?: string;
  annotated?: boolean;
}

export interface AfsAnnotationCallout {
  id: number;
  label: string;
  desc: string;
  left: string;
  top: string;
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

export const afsCaseStudy = {
  id: 'afs-enterprise-workflow',
  title: 'Account Fit Score (AFS)',
  subtitle:
    'Enterprise UX for AI-powered account scoring configuration in ZoomInfo\'s Admin Portal. Configuration workflows, condition builder, and model management for go-to-market teams.',
  tags: [
    'Enterprise UX',
    'Workflow Design',
    'Admin Portal',
    'B2B SaaS',
    'Configuration UI',
    'ZoomInfo',
    'Figma',
    'Information Architecture',
    'Design System',
  ],

  snapshot: [
    { label: 'Role', value: 'UX/UI Design Contributor, Account Fit Score team' },
    { label: 'Company', value: 'ZoomInfo, enterprise B2B intelligence platform' },
    { label: 'Platform', value: 'Enterprise web application, Admin Portal' },
    { label: 'Source', value: 'Final Figma UI screens, Q4/2023, dev-ready status' },
    { label: 'Focus', value: 'Configuration workflow, condition builder, data source management' },
    { label: 'Output', value: 'Case study, IA, user flow, wireframe documentation' },
  ],

  confidentialityNote:
    'This case study is based on UI screens from a company project connected to ZoomInfo. Business logic, internal workflows, client-specific data, and team details have been intentionally kept at a high level or omitted. The focus is on design structure, UX decisions, component thinking, and information architecture rather than proprietary product details.',

  demonstrates: [
    {
      title: 'Enterprise UX thinking',
      body: 'Worked within a complex admin portal containing multiple Go-to-Market modules. AFS sits within a structured hierarchy of configuration tools, each supporting a distinct part of the enterprise go-to-market setup.',
    },
    {
      title: 'Information architecture',
      body: 'The Admin Portal navigation structure is visible and well-organised: Overview, Go-to-Market (Set Up, General), and a clear placement of AFS within the Set Up section alongside related tools.',
    },
    {
      title: 'Workflow mapping',
      body: 'AFS supports two distinct data source paths (CRM and CSV), each with its own configuration flow. Mapping these paths shows how the product handles different enterprise data maturity levels.',
    },
    {
      title: 'Design system extraction',
      body: 'Consistent component language is visible across condition builder rows, info banners, toggles, radio groups, and action button pairs. These patterns appear reused across the Admin Portal.',
    },
    {
      title: 'Product documentation',
      body: 'Final dev-ready screens are translated into reconstructed IA, user flow, wireframe logic, and component documentation, showing how finished designs can still tell a clear design story.',
    },
    {
      title: 'Confidentiality awareness',
      body: 'Company project presented responsibly: business context is described at a pattern level, client identifiers are omitted, and no proprietary scoring logic or internal data is exposed.',
    },
  ] as AfsDemonstratesItem[],

  overview:
    'AFS (Account Fit Score) is a feature within ZoomInfo\'s enterprise Admin Portal that allows go-to-market teams to configure AI-powered account scoring. Users define conditions from their CRM data that train a model to score accounts against their ideal customer profile (ICP). The system supports two data source paths: CRM integration (using account or opportunity objects and conditions) and CSV upload (for teams whose CRM data is not yet integrated). Once configured, the model scores all accounts in the workspace and notifies users via email when scoring is complete. The design supports model retraining when conditions change.',

  problem: {
    main: 'Enterprise go-to-market teams manage hundreds or thousands of accounts without a reliable way to prioritise outreach. Manual CRM queries are time-consuming and inconsistent across teams. Without a configured scoring model, prioritisation relies on individual judgment rather than systematic criteria.',
    detail:
      'AFS solves this by allowing teams to encode their institutional knowledge about ideal customers into a set of configurable conditions. The AI then applies those conditions at scale. The UX challenge is making a sophisticated ML configuration process approachable to RevOps and sales operations users who are expert in their business context but not in machine learning.',
    highlight:
      'For enterprise users, clarity is productivity. Every screen in a configuration tool needs to answer: where am I, what have I set up, and what action comes next.',
  },

  users: [
    {
      type: 'Primary',
      label: 'RevOps and Sales Operations teams',
      description:
        'Users responsible for configuring scoring models within the Admin Portal. They understand the business criteria that define a good customer but are not necessarily technical ML practitioners.',
      tasks: [
        'Navigate to AFS configuration in Admin Portal',
        'Select data source (CRM or CSV)',
        'Choose CRM object type (Account or Opportunity)',
        'Review and edit default conditions',
        'Add new conditions to refine scoring',
        'Enable or disable auto-update model toggle',
        'Save configuration and trigger model training',
        'Retrain model when conditions change',
        'Monitor model status via email notification',
      ],
    },
    {
      type: 'Secondary',
      label: 'System administrators and IT owners',
      description:
        'Users who manage CRM integrations and data source connections. Relevant when Salesforce is not yet integrated or when the data source needs to change.',
      tasks: [
        'Connect Salesforce or CRM data source',
        'Resolve Salesforce not integrated state',
        'Change data source between CRM and CSV',
        'Manage workspace-level settings',
      ],
    },
  ],

  iaDescription:
    'The information architecture was reconstructed from the left navigation visible in the configure screen. The Admin Portal organises its features into two main sections under Go-to-Market: Set Up (where AFS lives) and General (analytics, user management, integrations). AFS is positioned alongside other go-to-market configuration tools including Target Accounts, Intent, Buying Committees, WebSights, FormComplete, and Go-to-Market Plays.',

  iaTree: [
    {
      label: 'Admin Portal',
      level: 0,
      children: [
        {
          label: 'Overview',
          level: 1,
        },
        {
          label: 'Go-to-Market',
          level: 1,
          children: [
            {
              label: 'Set Up',
              level: 2,
              children: [
                { label: 'Target Accounts', level: 3 },
                { label: 'Intent', level: 3 },
                { label: 'Account Fit Score (AFS)', level: 3, active: true },
                { label: 'Buying Committees', level: 3 },
                { label: 'WebSights', level: 3 },
                { label: 'FormComplete', level: 3 },
                { label: 'Go-to-Market Plays', level: 3 },
              ],
            },
            {
              label: 'General',
              level: 2,
              children: [
                { label: 'Analytics', level: 3 },
                { label: 'User Management', level: 3 },
                { label: 'Configurations', level: 3 },
                { label: 'Privacy', level: 3 },
                { label: 'Integrations', level: 3 },
                { label: 'Enrich', level: 3 },
              ],
            },
          ],
        },
      ],
    },
  ],

  afsIaTree: [
    { label: 'Configure (CRM source)', indent: 0, active: true },
    { label: 'Account Object conditions', indent: 1 },
    { label: 'Opportunity Object conditions', indent: 1 },
    { label: 'Condition builder (add/edit/remove)', indent: 2 },
    { label: 'Auto-update toggle', indent: 2 },
    { label: 'Configure (CSV source)', indent: 0 },
    { label: 'CSV upload flow', indent: 1 },
    { label: 'Column mapping', indent: 2 },
    { label: 'Default AFS (view-only)', indent: 0 },
    { label: 'Edit View', indent: 0 },
    { label: 'Change Data Source', indent: 0 },
    { label: 'Retrain Model', indent: 0 },
    { label: 'States', indent: 0 },
    { label: 'Salesforce not integrated', indent: 1 },
    { label: 'AFS ready (email notification)', indent: 1 },
    { label: 'Renaming', indent: 1 },
  ],

  userFlowDescription:
    'The user flow reconstructs how an operator would move through AFS setup for the first time, and how they would return to modify the configuration later. Two paths branch at the data source selection step, reflecting different integration states across enterprise workspaces.',

  userFlowSteps: [
    'Admin Portal',
    'Go-to-Market',
    'Set Up',
    'Account Fit Score (AFS)',
    'Select data source',
    'CRM: Define conditions',
    'Save Configuration',
    'Model trains',
    'AFS ready (email)',
    'Scores active',
  ],

  userFlowCsvBranch: [
    'CSV: Upload file',
    'Map columns',
    'Save',
    'Model trains',
  ],

  decisions: [
    {
      num: '01',
      title: 'Sidebar hierarchy places AFS in workflow context',
      body: 'AFS sits inside Set Up within Go-to-Market. Users can see where AFS fits relative to other configuration steps (Target Accounts, Intent, Buying Committees) without losing context.',
      why: 'Enterprise admin tools often feel disconnected from business intent. Placing AFS within a structured Go-to-Market hierarchy reinforces that scoring is part of a broader setup workflow, not a standalone technical feature.',
    },
    {
      num: '02',
      title: 'Two data source paths respect different integration states',
      body: 'CRM and CSV paths exist because enterprise workspaces have different data maturity levels. Some teams have Salesforce fully integrated; others need to upload data manually.',
      why: 'Forcing all users down a single path creates a dead end for teams whose CRM is not yet connected. Offering CSV as an alternative lets teams start building their model immediately and migrate to CRM later.',
    },
    {
      num: '03',
      title: 'Inline condition builder keeps configuration visible',
      body: 'Conditions are managed directly on the configure screen using a [Field] [Operator] [Value] row pattern with a contextual menu. Users can add, edit, and remove conditions without navigating away.',
      why: 'Modal-heavy configuration flows interrupt context. Keeping condition management inline means users can see their full condition set while editing, making it easier to spot gaps or conflicts.',
    },
    {
      num: '04',
      title: 'Default condition with editable info banner guides first-time users',
      body: 'New configurations are populated with a default condition. A blue info banner explains that the condition is editable and additional conditions can be added. The banner is dismissible.',
      why: 'Blank state configuration is intimidating. Starting with a sensible default gives users a concrete starting point and signals what good configuration looks like before they begin customising.',
    },
    {
      num: '05',
      title: 'Auto-update toggle gives users control over model freshness',
      body: 'A toggle allows users to enable or disable automatic model retraining when new data is available. The toggle is accompanied by an info icon for users who want to understand the implications.',
      why: 'Some enterprise teams need predictability: they want their model to change only when they decide. Others prefer automatic updates. The toggle respects both operating models without requiring a separate settings page.',
    },
    {
      num: '06',
      title: 'Breadcrumb header communicates location within nested navigation',
      body: 'The page header shows "Account Fit Score (AFS) / Configure" as a breadcrumb. This two-level path mirrors the left sidebar depth and helps users orient themselves within the Admin Portal.',
      why: 'Enterprise admin portals can become disorienting when configurations are nested multiple levels deep. A persistent breadcrumb reduces the cognitive load of tracking location across long configuration sessions.',
    },
  ] as AfsDecision[],

  designSystemDescription:
    'The design system extraction identifies the reusable visual and interaction patterns visible in the AFS configure screen. These components appear to come from a shared ZoomInfo Admin Portal design system, consistent with the visual language used across the Admin Portal navigation and content areas.',

  designSystemColors: [
    { name: 'Primary blue', hex: '#1B7AFF', value: 'ZoomInfo brand blue', usage: 'CTAs, active nav item, info banners, toggle on state' },
    { name: 'White', hex: '#FFFFFF', value: 'Surface white', usage: 'Page background, card backgrounds, condition row backgrounds' },
    { name: 'Light grey', hex: '#F7F9FC', value: 'Sidebar background', usage: 'Left navigation background, input fill, subtle surface sections' },
    { name: 'Border grey', hex: '#E2E8F0', value: 'Divider and card borders', usage: 'Section dividers, condition row borders, input outlines' },
    { name: 'Text primary', hex: '#0F172A', value: 'Near-black', usage: 'Page titles, section headings, body copy, condition values' },
    { name: 'Text secondary', hex: '#64748B', value: 'Medium grey', usage: 'Nav labels, descriptions, placeholder text, helper copy' },
  ],

  designSystemComponents: [
    { name: 'Left sidebar nav', description: 'Collapsible section groups with icon + label rows. Active state shown with background highlight.', usage: 'Persistent navigation across all Admin Portal screens' },
    { name: 'Breadcrumb header', description: 'Page-level title with "/" separator showing current step within a section.', usage: 'All configuration screens to communicate navigation depth' },
    { name: 'Radio group', description: 'Horizontal radio buttons with label. Selected state uses filled blue circle.', usage: 'CRM object selection (Account vs Opportunity)' },
    { name: 'Condition row', description: '[Field tag] [Operator tag] [Value tag] with contextual "..." menu on right. Rows stack vertically in a bordered container.', usage: 'Condition builder for AFS model training criteria' },
    { name: 'Info banner', description: 'Blue background panel with text and X dismiss button. Used for guidance and editable-state notifications.', usage: 'Default condition explanation, help text, state notifications' },
    { name: 'Add action row', description: '"+ Add Condition" text button with a counter showing conditions added (e.g. 1/10).', usage: 'Condition builder, adding new items to a constrained list' },
    { name: 'Toggle switch', description: 'On/off toggle with text label and optional info icon. Default state visible.', usage: 'Auto-update AFS model setting' },
    { name: 'Action button pair', description: 'Cancel (outline) and primary CTA (blue filled) aligned to top right of configuration area.', usage: 'All configuration screens for save/discard actions' },
    { name: 'Avatar header', description: 'Top-right cluster of notification bell, app grid, and user avatar initials.', usage: 'Persistent across all Admin Portal screens' },
  ],

  screens: [
    {
      num: '01',
      title: 'AFS landing — unconfigured state',
      purpose: 'Entry point for a workspace that has not yet set up Account Fit Score. Shows the section description and the primary call to action to begin configuration.',
      keyElements: [
        'Admin Portal left navigation, AFS highlighted under Go-to-Market > Set Up',
        'Page title: Account Fit Score (AFS)',
        'Product description: what AFS does and how it works',
        'Primary CTA to start the configuration process',
        'Clean empty state — no conditions, no scores yet active',
      ],
      uxNote: 'The unconfigured landing state sets expectations before users commit to the setup flow. Establishing what AFS does at this entry point means users arrive at the configuration screen with the right mental model — they understand why they are defining conditions.',
      src: '/images/projects/afs/screens/afs-01-landing.png',
    },
    {
      num: '02',
      title: 'AFS landing with Quickstart guide',
      purpose: 'Onboarding panel that surfaces the three-step setup sequence for first-time users without requiring page navigation. Reduces first-visit friction.',
      keyElements: [
        'Same Admin Portal shell as Screen 01',
        'Quickstart side panel with numbered setup steps',
        'Step 1: Import your data',
        'Step 2: Configure scoring conditions',
        'Step 3: Review your results',
        '"Hi Bob" — Figma placeholder name, not real user data',
        'Progress indicators showing which steps remain incomplete',
        'Dismiss option to close the panel',
      ],
      uxNote: 'The Quickstart panel reduces blank-state anxiety by decomposing the setup into three named steps. Users know how far the process goes before committing. The panel sits alongside the page without replacing it, so the CTA to begin is still visible and accessible.',
      src: '/images/projects/afs/screens/afs-02-quickstart.png',
    },
    {
      num: '03',
      title: 'Import data — choose data source',
      purpose: 'The first decision point in the configuration flow. Users choose between connecting their CRM (Salesforce) or uploading a CSV file with historical deal data.',
      keyElements: [
        'Modal overlay on the AFS page',
        'Two option cards: CRM Integration / CSV Upload',
        'CRM card: connect Salesforce, use account or opportunity object data',
        'CSV card: upload a file with historical deal records',
        'Visual parity between both cards — neither path is pre-selected',
        'Cancel action to return without choosing',
      ],
      uxNote: 'Presenting both data source options with equal visual weight respects different enterprise data maturity levels. Teams with Salesforce connected take the CRM path; teams still setting up integrations can use CSV immediately. The modal keeps users in context at the AFS section while making the decision explicit.',
      src: '/images/projects/afs/screens/afs-03-import.png',
    },
    {
      num: '04',
      title: 'Configure Account Fit Score (CRM source)',
      purpose: 'Main configuration screen for teams with CRM integration. Condition builder for defining scoring criteria using Salesforce account or opportunity object data.',
      keyElements: [
        'Left sidebar with Go-to-Market navigation, AFS highlighted as active',
        'Breadcrumb: Account Fit Score (AFS) / Configure',
        'Section heading: Configure Account Fit Score (AFS)',
        'Description: AFS predicts match against ideal customer profile using CRM data and firmographics',
        'CRM Object radio group: Account Object (selected) / Opportunity Object',
        'Help link: How to add/edit conditions?',
        'Blue info banner: default condition explanation, dismissible with X',
        'Condition row: [Account Type] [Is] [Customer] with "..." context menu',
        'Add Condition row with 1/10 conditions counter',
        'Auto-update AFS model toggle with info icon',
        'Cancel and Save Configuration action buttons (top right, always accessible)',
      ],
      uxNote: 'The screen balances density with guidance. Default conditions reduce the blank-state problem. The info banner explains editability without overwhelming. The condition counter (1/10) makes the constraint boundary visible before users hit it. Positioning the action buttons top-right means they are reachable without scrolling in a desktop admin context.',
      src: '/images/projects/afs/screens/afs-04-configure.png',
      annotated: true,
    },
    {
      num: '05',
      title: 'Configure with live account preview panel',
      purpose: 'Split-panel extension of the configure screen. As conditions are defined, a right-side panel shows which accounts currently match — providing real-time feedback on scoring quality.',
      keyElements: [
        'Same condition builder on the left as Screen 04',
        'Right panel: live account preview opens alongside the configuration form',
        '"355 Accounts Found" count that updates as conditions change (demo data)',
        'Account tiles showing matching companies: Ford, Apple, NVIDIA, Intel (demo data)',
        'Preview panel provides immediate visual feedback on condition effectiveness',
        'Panel can be closed to return to the full-width configuration view',
      ],
      uxNote: 'The "see as you configure" pattern gives enterprise users the calibration feedback they need. Showing how many real accounts match the current conditions — and which named companies — reduces the guess-and-retrain cycle. Users can tighten or loosen conditions with confidence before committing to a model training run.',
      src: '/images/projects/afs/screens/afs-05-preview.png',
    },
    {
      num: '06',
      title: 'Inline condition editor with dropdowns open',
      purpose: 'Condition editing stays in context. Dropdowns expand inline within the condition row — users select field, operator, and value without navigating to a separate screen or modal.',
      keyElements: [
        'Condition row in active edit state with all three dropdowns visible',
        'Field dropdown: list of available CRM fields (Account Type, Industry, Company Size, etc.)',
        'Operator dropdown: Is, Is not, Contains, Greater than, etc.',
        'Value dropdown: valid values for the selected field',
        'All other conditions remain visible in the background during editing',
        'Save/confirm action available within or immediately below the row',
      ],
      uxNote: 'Inline editing with the full condition list visible prevents the loss-of-context problem that modal-based editors create. Users can compare the condition being edited against existing conditions, making it easier to spot redundancy, gaps, or conflicts in the scoring criteria without switching views.',
      src: '/images/projects/afs/screens/afs-06-condition-edit.png',
    },
    {
      num: '07',
      title: 'Name your Account Fit Score',
      purpose: 'Naming modal surfaced before finalising the configuration. Users give the AFS a name that identifies it in the AFS list and in reports.',
      keyElements: [
        'Focused modal overlay — single purpose',
        'Heading: Name your Account Fit Score',
        'Pre-filled text input: "Account AFS 1" (sensible default naming convention)',
        'Helper text explaining how the name is used to identify the configuration',
        'Cancel to return without saving',
        'Save / Confirm to proceed to model training',
      ],
      uxNote: 'Pre-populating the name field with "Account AFS 1" solves the blank field problem and establishes a naming convention for workspaces with multiple AFS configurations. The focused modal design signals that naming is a required, distinct step — not an afterthought.',
      src: '/images/projects/afs/screens/afs-07-name.png',
    },
    {
      num: '08',
      title: 'AFS list — model processing with success toast',
      purpose: 'List view after saving configuration. The new AFS appears with a Processing status badge. A success toast sets time expectations for the async model training.',
      keyElements: [
        'AFS list view with the newly saved configuration row',
        'Status badge: Processing (with progress indicator)',
        'Success toast: "Score generation is in progress and might take up to 24 hours"',
        'Clear 24-hour time expectation communicated in the notification',
        'Toast confirms the save action completed successfully',
        'Other AFS configurations (if any) visible as separate rows in the list',
      ],
      uxNote: 'Setting a 24-hour expectation in the toast is the most important UX decision on this screen. Without it, users have no indication of whether to wait minutes or days. The toast closes the immediate interaction loop — the save worked, training is running, expect results within a day — so users can confidently leave the page.',
      src: '/images/projects/afs/screens/afs-08-processing.png',
    },
    {
      num: '09',
      title: 'Processing detail — accounts imported',
      purpose: 'Expanded processing state showing how many accounts were successfully pulled from the CRM. Confirms the data import phase completed before the longer model-training phase begins.',
      keyElements: [
        'Expanded detail view for the processing AFS configuration',
        '"296 Accounts have been imported" count (demo data)',
        'Account tiles displaying imported company names: Amazon, NVIDIA, Google, Ford (demo data)',
        'Status: import phase complete, model training now in progress',
        'Visual confirmation that CRM data was successfully ingested',
      ],
      uxNote: 'The account count and sample company tiles answer an implicit anxiety: "Did my CRM data actually come through?" Showing 296 accounts (demo data) reassures users before the model-training phase — which takes longer and is less visible — completes. This prevents support requests about whether configuration succeeded.',
      src: '/images/projects/afs/screens/afs-09-processing-detail.png',
    },
    {
      num: '10',
      title: 'AFS ready email notification',
      purpose: 'Transactional email sent when model training completes. Closes the async feedback loop — users do not need to monitor the Admin Portal for a completion signal.',
      keyElements: [
        'ZoomInfo email template with dark header bar and wordmark',
        'Subject: ZoomInfo Update: Your AFS is ready to use',
        '"Hi Bob" — Figma placeholder name, not real user data',
        'Body: confirmation that AFS model is trained and scores are now active',
        'Summary of actions now available: view scores, prioritise outreach',
        'Primary CTA: link back to Admin Portal',
        'Professional footer with support and unsubscribe links',
      ],
      uxNote: 'The email is a critical async UX pattern. After saving configuration, users return to their regular work. Without an email notification, they would need to periodically check the Admin Portal to find out if training completed. The email brings them back at the right moment — and the CTA restores context immediately, even if hours have passed.',
      src: '/images/projects/afs/screens/afs-10-email.png',
    },
    {
      num: '11',
      title: 'AFS results dashboard',
      purpose: 'Post-training view showing how accounts scored against the defined ICP. Score distribution, top factors, and account breakdowns translate the model output into actionable go-to-market intelligence.',
      keyElements: [
        'Score distribution visualisation: high / medium / low fit account breakdown',
        'Job function analysis: accounts segmented by role or industry type',
        'Top scoring factors: which conditions most influenced the model output',
        'Account count totals across score tiers',
        'Navigation context remains Admin Portal, AFS active in the sidebar',
        'Drill-down capability for exploring high-fit account segments',
      ],
      uxNote: 'The results dashboard closes the configuration loop. Surfacing top scoring factors creates a natural iteration path: if the factors do not match expectations, users know to refine conditions and retrain. Score distribution reveals whether the ICP definition is too narrow (few high-fit accounts) or too broad (most accounts score as high fit).',
      src: '/images/projects/afs/screens/afs-11-results.png',
    },
    {
      num: '12',
      title: 'AFS list — active configuration with actions menu',
      purpose: 'List view for a trained, active AFS configuration. The "..." contextual menu reveals management actions: Edit, Rename, Change Data Source.',
      keyElements: [
        'AFS list with active configuration row',
        'Status badge: Active (green success state)',
        'Account count and last-trained timestamp on the row',
        '"..." context menu open on the configuration row',
        'Menu items: Edit / Rename / Change Data Source',
        'Additional AFS configurations visible below if multiple exist',
      ],
      uxNote: 'The contextual menu pattern keeps management actions accessible without cluttering the list view. Grouping Edit, Rename, and Change Data Source in one overflow menu reflects the three distinct ongoing management tasks for an AFS. Keeping the menu on the row — not in a global header — matches the mental model of operating on a specific item in a list.',
      src: '/images/projects/afs/screens/afs-12-actions.png',
    },
  ] as AfsScreen[],

  componentPatterns: [
    {
      name: 'Condition builder row',
      description: 'Three-part field row: [Field name] [Operator] [Value] with a contextual "..." menu for edit/delete actions. Rows stack vertically in a bordered container.',
      usage: 'Used to define scoring conditions. The tag-style chips make each component of the condition visually distinct and easy to parse quickly.',
    },
    {
      name: 'Info banner',
      description: 'Blue-tinted background panel with body text and a dismiss X. Sits inline within the configuration form, not as a page-level notification.',
      usage: 'Used for guidance text that helps users understand default states or editable defaults without interrupting the flow.',
    },
    {
      name: 'Constrained add-item row',
      description: '"+ Add Condition" with a counter badge showing progress against a limit (e.g. 1/10 conditions added). The counter helps users understand how many more items they can add.',
      usage: 'Used anywhere a user can add items to a bounded list. The constraint boundary is visible before the user hits it.',
    },
    {
      name: 'Contextual menu (dot-dot-dot)',
      description: 'Three-dot overflow menu on the right of each condition row. Reveals edit and delete actions on hover or click.',
      usage: 'Keeps secondary actions out of the primary view to reduce visual noise in dense lists.',
    },
    {
      name: 'Toggle with info affordance',
      description: 'A standard toggle switch accompanied by a text label and an (i) info icon. Tapping the info icon reveals a tooltip explaining the implications of the setting.',
      usage: 'Used for settings where the user needs to understand the downstream effect of their choice, such as auto-update model behaviour.',
    },
    {
      name: 'Two-path radio selection',
      description: 'Horizontal radio group for mutually exclusive top-level options (Account Object / Opportunity Object). Each option is labelled clearly with no ambiguity about what it selects.',
      usage: 'Used when the two paths share the same screen structure but process different data. The radio selection determines which downstream conditions are valid.',
    },
  ] as AfsComponentPattern[],

  accessibility: [
    'Radio buttons use standard form semantics and are keyboard navigable',
    'Toggle switch labelled with visible text, not colour alone',
    'Info banner uses text to communicate guidance, not just a colour change',
    'Condition rows use tag-style chips with text labels for each component (field, operator, value)',
    'Action button pair maintains clear hierarchy: Cancel (outline, secondary) vs Save (filled, primary)',
    'Breadcrumb provides location context for screen reader navigation',
    'Dismissible info banner has an X button with accessible interaction',
    'Recommended: Ensure info icon tooltips are keyboard accessible',
    'Recommended: Verify condition row "..." menus open on keyboard and have ARIA labels',
    'Recommended: Error states for invalid or conflicting conditions should use text, not colour alone',
  ],

  handoff: [
    {
      title: 'Dev-ready status confirmed',
      body: 'The Figma file shows "Ready for Dev" status on the project cover frame, with Jira, PRD, and video walkthrough documentation linked directly from the file.',
    },
    {
      title: 'Component state documentation',
      body: 'Each component visible in the screens requires state documentation: default, hover, focus, active, disabled, and error states for condition rows, toggles, banners, and radio groups.',
    },
    {
      title: 'Data / empty / error states',
      body: 'The Salesforce not integrated screen represents one error state. Full handoff would document empty states (no conditions added), loading states (model training), and success states (model trained, scores active).',
    },
    {
      title: 'Two-path flow documentation',
      body: 'CRM and CSV paths need separate acceptance criteria and developer notes. The screen shell is shared but the input components, validation rules, and data handling differ between paths.',
    },
    {
      title: 'Responsive behaviour notes',
      body: 'The Admin Portal is a desktop-first enterprise tool (1440px primary viewport). Responsive behaviour for the condition builder, left sidebar collapse, and action button placement would need explicit documentation for smaller screens.',
    },
    {
      title: 'Async model training feedback',
      body: 'Save Configuration starts an asynchronous process. In-product feedback (progress indicator, pending state) and the AFS ready email represent the two feedback channels. Both need coordination between frontend and notification service.',
    },
  ] as AfsHandoffCard[],

  limitations: [
    'Case study reconstructed from final UI screens. Original discovery artefacts, research findings, and early-stage wireframes were not available for this portfolio case study.',
    'Business-specific conditions, scoring weights, and model training logic are intentionally abstracted. The portfolio documents design structure, IA, and UX decisions — not product internals.',
    'Client workspace identifier ("Cyberlock") is visible in several screenshots and is presented as-is without digital alteration. It is noted in the confidentiality section.',
    '"Bob" in the Quickstart panel and email screenshots is a Figma placeholder name used in the prototype, not real user data.',
    'Account names (Amazon, NVIDIA, Google, Ford) and counts (296 accounts, 355 accounts found) visible in processing and preview screenshots are Figma demo data, not real client records.',
    'Internal team names and roles from the Figma project cover frame have been omitted from the public case study.',
    'Exact design token values (hex codes, font sizes, spacing units) have not been extracted from the Figma file. Colours and typography are described at a pattern level from visible screen data.',
    'CSV configuration path, Retrain Model, and Rename flows are documented in the wireframes section as structural reconstructions. The actual CSV screens from Figma are not available in the reference set.',
  ],

  reflection:
    'This case study demonstrates that final UI screens, even without original discovery artefacts, contain enough information to reconstruct meaningful product thinking. The navigation structure reveals the information architecture. The component language reveals the design system. The screen names in the Figma file reveal the full workflow. Working from finished designs requires a different skill than working from blank pages: it requires precise observation, careful inference, and honest documentation of what is known versus what is assumed. Enterprise UX is often about making complex data workflows feel structured and navigable. The AFS configure screen does this well: it layers guidance (info banner), constraint visibility (condition counter), and control (auto-update toggle) without overwhelming the user with the underlying ML complexity.',

  annotationCallouts: [
    { id: 1, label: 'ZoomInfo logo', desc: 'Brand logo anchors the platform identity. Appears on all Admin Portal pages.', left: '3%', top: '4%' },
    { id: 2, label: 'Workspace identifier', desc: 'Client workspace name visible below the logo — noted as client identifier, omitted in portfolio description.', left: '3%', top: '11%' },
    { id: 3, label: 'Go-to-Market navigation', desc: 'Collapsible section group in the left sidebar. Contains both Set Up and General sub-sections.', left: '9%', top: '40%' },
    { id: 4, label: 'Active: Account Fit Score (AFS)', desc: 'AFS is highlighted as the current page within the Set Up section. Colour + weight indicate active state.', left: '9%', top: '52%' },
    { id: 5, label: 'Breadcrumb header', desc: '"Account Fit Score (AFS) / Configure" — two-level breadcrumb mirrors sidebar depth and confirms user location.', left: '55%', top: '10%' },
    { id: 6, label: 'CRM object radio group', desc: 'Account Object vs Opportunity Object. The choice determines which CRM records conditions are matched against.', left: '37%', top: '28%' },
    { id: 7, label: 'Default condition info banner', desc: 'Blue dismissible banner explaining the default condition is editable. Reduces blank-state anxiety for first-time users.', left: '58%', top: '39%' },
    { id: 8, label: 'Condition row', desc: '[Account Type] [Is] [Customer] with a "..." context menu. Tag-style chips make the three-part condition easy to scan.', left: '58%', top: '50%' },
    { id: 9, label: '+ Add Condition with counter', desc: '"1/10 conditions added" — constraint boundary is visible before the user hits it. Inline add keeps context.', left: '31%', top: '62%' },
    { id: 10, label: 'Cancel / Save Configuration', desc: 'Action button pair in the top right of the configure area. Persistent and accessible without scrolling.', left: '88%', top: '10%' },
  ] as AfsAnnotationCallout[],
};
