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
    { name: 'Primary blue', value: 'ZoomInfo brand blue', usage: 'CTAs, active nav, info banners, toggles' },
    { name: 'White', value: 'Surface white', usage: 'Page background, card backgrounds, condition rows' },
    { name: 'Light grey', value: 'Sidebar/subtle background', usage: 'Left navigation background, subtle sections' },
    { name: 'Border grey', value: 'Divider and card borders', usage: 'Section dividers, table borders, input outlines' },
    { name: 'Text primary', value: 'Near-black', usage: 'Page titles, body copy, condition values' },
    { name: 'Text secondary', value: 'Medium grey', usage: 'Descriptions, nav labels, helper text' },
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
      title: 'Configure Account Fit Score (CRM source)',
      purpose: 'Main configuration screen for teams with CRM integration. Allows selection of CRM object type and definition of scoring conditions.',
      keyElements: [
        'Left sidebar with Go-to-Market navigation, AFS highlighted as active',
        'Breadcrumb header: Account Fit Score (AFS) / Configure',
        'Section heading: Configure Account Fit Score (AFS)',
        'Description text explaining what AFS does and how it uses CRM data',
        'CRM Object radio group: Account Object (selected) / Opportunity Object',
        'Help link: How to add/edit conditions?',
        'Blue info banner: default condition explanation with dismiss X',
        'Condition row: [Account Type] [Is] [Customer] with context menu',
        'Add Condition row with 1/10 conditions counter',
        'Auto-update AFS model toggle with info icon',
        'Cancel and Save Configuration action buttons',
      ],
      uxNote: 'The screen successfully balances density and guidance. Default conditions reduce the blank-state problem, the info banner explains editability without overwhelming, and the condition count (1/10) communicates the constraint boundary clearly.',
      src: '/images/projects/afs/screens/afs-screen-01.png',
    },
    {
      num: '02',
      title: 'Configure Account Fit Score (CSV source)',
      purpose: 'Alternative configuration path for teams whose CRM is not yet integrated. Allows CSV upload to train the model from historical data.',
      keyElements: [
        'Same left navigation and header structure as CRM path',
        'CSV upload interface replacing the condition builder',
        'Column mapping step to align CSV fields to AFS model inputs',
        'Save flow similar to CRM path',
      ],
      uxNote: 'Reconstructed from screen name metadata. The CSV path shares the same structural shell as the CRM path, maintaining consistency while accommodating a different data input mechanism.',
      src: undefined,
    },
    {
      num: '03',
      title: 'Default AFS view',
      purpose: 'View-only state showing the default AFS configuration before a user has customised it. Establishes a baseline that users can choose to keep or modify.',
      keyElements: [
        'Read-only condition display',
        'Clear indication that this is a default state',
        'Entry point to the Edit View',
      ],
      uxNote: 'Reconstructed from screen name metadata. Providing a default state allows teams to get started with scoring before spending time on customisation.',
      src: undefined,
    },
    {
      num: '04',
      title: 'Change Data Source',
      purpose: 'Flow or modal that allows an admin to switch between CRM and CSV data sources for the AFS model. Likely includes a warning about the impact of switching.',
      keyElements: [
        'Data source options: CRM / CSV',
        'Warning or confirmation step',
        'Clear action to proceed or cancel',
      ],
      uxNote: 'Reconstructed from screen name metadata. Data source changes likely trigger a model reset, so a confirmation step protects users from accidental configuration loss.',
      src: undefined,
    },
    {
      num: '05',
      title: 'Salesforce not integrated (info/error state)',
      purpose: 'State displayed when the CRM path is selected but Salesforce is not connected to the workspace. Guides users to resolve the integration before proceeding.',
      keyElements: [
        'Clear explanation that Salesforce is not connected',
        'Call to action or instructions for connecting the integration',
        'Possible fallback to CSV path',
      ],
      uxNote: 'Reconstructed from screen name metadata. Empty/error states in enterprise admin tools need to be informative, not just blocking. This state appears designed to direct users to a resolution path.',
      src: undefined,
    },
    {
      num: '06',
      title: 'AFS ready email notification',
      purpose: 'Email sent to users when the AFS model has finished training and account scores are available. Closes the loop on an asynchronous process.',
      keyElements: [
        'ZoomInfo header with logo',
        'Subject: Your AFS is ready',
        'Company contact data preview (anonymised)',
        'CTA to return to the Admin Portal',
        'Footer with support contact',
      ],
      uxNote: 'Model training is asynchronous. The email notification resolves the experience loop started at Save Configuration, preventing users from polling the Admin Portal for completion status.',
      src: undefined,
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
    'Case study reconstructed from final UI screens. Original discovery artefacts, research findings, and early wireframes are not available.',
    'MCP rate limits on the Figma Starter plan restricted access to all screens. Six of ten identified screens are described from metadata and frame names rather than screenshots.',
    'Business-specific conditions, scoring weights, and model training logic are intentionally abstracted. The portfolio documents design structure, not product internals.',
    'Client workspace identifier visible in screenshot has been noted in the confidentiality section but not digitally altered.',
    'Internal team names and roles from the Figma file cover have been omitted from the public case study.',
    'Exact design token values (hex codes, font sizes, spacing units) have not been extracted from the Figma file. Component patterns are described at a pattern level.',
    'Some screens (CSV path, Retrain Model, Renaming) are reconstructed solely from Figma frame names without screenshot verification.',
  ],

  reflection:
    'This case study demonstrates that final UI screens, even without original discovery artefacts, contain enough information to reconstruct meaningful product thinking. The navigation structure reveals the information architecture. The component language reveals the design system. The screen names in the Figma file reveal the full workflow. Working from finished designs requires a different skill than working from blank pages: it requires precise observation, careful inference, and honest documentation of what is known versus what is assumed. Enterprise UX is often about making complex data workflows feel structured and navigable. The AFS configure screen does this well: it layers guidance (info banner), constraint visibility (condition counter), and control (auto-update toggle) without overwhelming the user with the underlying ML complexity.',
};
