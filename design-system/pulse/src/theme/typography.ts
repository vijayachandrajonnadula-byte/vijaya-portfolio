/**
 * The ONE place font weights are defined. Components must not write numeric font weights (`fontWeight: 600`):
 * use `fw.*` for a raw weight or, better, a `role.*` for what the text IS. `npm run check:weights` (part of `npm run lint`)
 * fails on numeric weights anywhere else.
 *
 * Figma's text styles name four weights (textContent Weight = Regular | Medium | Semibold | Bold); the kit maps them to
 * 400 / 500 / 600 / 700 (pulse-designkit typography.weight).
 *
 * Roles record each kind of text with the Figma style it comes from. To change how something looks, change the ROLE here
 * (and docs/figma-deviations.md if it differs from Figma), not the component.
 */
export const fw = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  /** NOT FROM FIGMA: reference prototype only (Electronic Execution panel: colour "A" glyph, dock menu title). */
  extraBold: 800,
} as const;

export type FontWeightName = keyof typeof fw;

export const role = {
  /** Page / section / toolbar title. Figma DatagridToolbar title: SemiBold 18/28. */
  title: fw.semiBold,
  /** Text under a title. Figma textContent Secondary: Regular. */
  subtitle: fw.regular,
  /** Body and table cell text. Figma textContent / DataGrid_Text_Cell: Regular. */
  body: fw.regular,
  /** Table column header. Figma DataGrid_Header title: Regular 12/20 (the live Pulse app shows it heavier: open question). */
  gridHeader: fw.regular,
  /** Hyperlink at rest. Figma textLink Default: SemiBold, no underline. */
  link: fw.semiBold,
  /** Hyperlink on hover. Figma textLink Hover: Regular + underline. */
  linkHover: fw.regular,
  /** Chip / Status chip label. Figma textChip: SemiBold. */
  chip: fw.semiBold,
  /** Unselected tab (user-directed: not semibold; Figma masters say SemiBold). */
  tab: fw.medium,
  /** Selected tab. Figma textTabs Active: SemiBold. */
  tabSelected: fw.semiBold,
  /** Breadcrumb node (parent and leaf). Figma textBreadcrumb: Medium. */
  breadcrumb: fw.medium,
  /** Button label. Figma Button text: SemiBold. */
  button: fw.semiBold,
  /** Form field label. Figma textLabel: Medium. */
  label: fw.medium,
  /** Status filter label (statusFilterv2 textContent Weight=Medium). */
  filterLabel: fw.medium,
  /** Status filter count (statusFilterv2 textContent Weight=Bold). */
  filterCount: fw.bold,
  /** Navigation labels (LeftNav, NavigationRail). */
  nav: fw.medium,
  /** Emphasis inside text (names, key values). */
  strong: fw.semiBold,
  /** Compact dialog title and emphasis (Electronic Execution reference prototype, measured 700). NOT FROM FIGMA. */
  dialogTitle: fw.bold,
} as const;

export type TextRole = keyof typeof role;

/**
 * NOT FROM FIGMA. Weights measured from the Electronic Execution reference prototype (page shell and Word-style document),
 * which uses a wider scale than Figma's four. Used only by src/pages/ElectronicExecution (logged in docs/figma-deviations.md).
 */
export const refRole = {
  /** Word-style page title and section headings (reference: weight 300). */
  docHeading: 300,
  /** Shell logo mark (reference: 800). */
  shellLogo: 800,
  /** Shell brand name (reference: 900). */
  shellBrand: 900,
  /** Shell labels, chips, toggles (reference: 700). */
  shellStrong: fw.bold,
  /** Shell buttons and pill labels (reference: 600). */
  shellMedium: fw.semiBold,
} as const;

/**
 * NOT FROM FIGMA. Weights of the Electronic Execution execution panel (and its rich text editor), measured on the
 * reference prototype. Logged in docs/figma-deviations.md.
 */
export const panelRole = {
  regular: fw.regular,
  /** Section labels, tabs' star, P/F buttons, panel title (700). */
  strong: fw.bold,
  /** Tabs, tags, buttons, toolbar selects, menu items (600). */
  emphasis: fw.semiBold,
  /** Overflow-menu rows (500). */
  menuItem: fw.medium,
  /** Colour glyph "A" and menu titles (800). */
  heavy: fw.extraBold,
} as const;
