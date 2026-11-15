# Pulse component inventory

Built from the pulse-2.0 `.fig` (decoded locally). 92 gallery demos, ~260 exported values, 398 icons, 8 generated symbol sets (713 symbols incl. 271 flags).
Process and conventions: `docs/component-conventions.md`. Usage rules from the Figma pages: `docs/pulse-usage-guide.md`. Foundations: `docs/pulse-foundations.md`.

## Coverage by Figma page

Legend: **done** = every variant reachable and checked against the spec; **partial** = built, with the gap listed.

### actions
Button, ButtonGroup, AdornmentButton (CloseButton), IconButton: **done** (all sizes, variants, colours incl. AI, interactions). `GradientButton` is not a component: use `Button color="ai"`.

### form
TextField, TextArea, Select (default / metadata / checkbox / chip / grouped), Search, SelectWithBorder, Autocomplete, InlineDropdown, PhoneNumber (+ country select), TallyCounter, HelperText, PasswordStrength, TextFormat, Checkbox, Radio, Switch, Slider / SliderWithLabel, ToggleButton / ToggleButtonGroup, SelectionCard (CheckboxCard, RadioCard), CheckboxGroup, RadioGroup, SwitchWithLabel, ColorPicker / ColorSelector, DatePicker, DateRangePicker, DateTimePicker, TimePicker, Calendar, FileUploader, RichTextEditor / Viewer, FormulaEditor: **done**.
Partial: Select/Autocomplete tree and accordion dropdown styles; DateRange popup and Select menu rows checked against the code, not measured.

### data-display
Chip, Status, Badge, Avatar / AvatarGroup, Divider, Link, KPICard, EmptyState, ProgressBar (all 84 + 36 + animations), Loader (spinner, dots, skeleton, 9 illustration loaders), Charts (legend, axes, bar, donut, pie, nightingale, circle, interactive node, header, values), CodeSnippet, Carousel, TreeView, ScrollBar, StatusFilterBar (statusFilterv2), TaskSwitcher, TrendLine, VersionCard, Highlighter, TableCell, AdvancedGridDropdown, DataGrid (cells, header, toolbar, 11 form cell types, double-line rows): **done**.
Partial: TransferList (Footer / Toaster / drag styles; Accordion and Table styles missing), DataGrid pagination and column menu (MUI X defaults restyled; no Figma set), `blinkingCursor` (not built), Gradient ProgressBar hint-text variants.

### navigation
Tabs, Breadcrumbs, Stepper (+ metadata, overflow), LeftNav (+ expand/collapse, search, suite block and panel, more button), SideNav, Header (real logo vectors), Footer, NavigationBar, NavigationRail, SidePanel, CanvasToolbar, DocumentToolbar, ZoomControl, ZoomSelect: **done**.

### feedback / containers / documents / patterns
Notification, Tooltip, Popover, Backdrop, Flyout, Modal; Accordion, Region, Section; ElectronicSignature, CommentSuggestionAI; WorkspaceCard, Workflow, DraggableListItem, Matrix, FormBuilder: **done**.
Partial: ElectronicSignature (AI icon buttons in the Comments row), FormBuilder (header-style and table-header sets).

### foundations
Icons (398), Equipment 104, Instrument 38, Subpart 35, ProcessLine 10, Arrow 192, Shape 56, FlagIcon 271: **done** (generated from Figma vectors, colours fixed to the Figma values).

## Not from Figma (kept deliberately)

- `src/templates/*`: 8 page panels from the Pulse app source plus `AppShell` (a layout helper). Figma's "Template Components" page is empty. The templates import nothing from `@mui/*` (lint-enforced) and use `TextHeading`, `TextContent`, `ButtonGroup`, `IconButton`, `DropdownMenu` and the Pulse icons.
- `form/DropdownMenu`: action menu built from the Figma dropdown ListItem rows (Figma has no standalone menu).
- `src/pages/*`: full pages built only from design-system components (first: ExecutionLifecycle). Every deviation from Figma is listed in `docs/figma-deviations.md`.
- `form/*` accessibility and behaviour props that Figma cannot express (`disabled` on InlineDropdown, `limit` on FormulaEditor, keyboard handling).
- `Charts/ChartTheme`: Figma chart values packaged for recharts consumers.

## Inferred or different from Figma (review)

- **Font:** the Typography page documents Inter; some master frames say Figtree at odd sizes. Inter is used everywhere.
- **Stale design-kit tokens:** `pulse-designkit.json` has form border colours (primary, warning) that differ from the .fig; RichTextEditor, FormulaEditor and fields use the .fig values (`_shared/fieldStyles`).
- Donut ring thickness (24/32/40) is estimated; Figma stores it only as vector paths.
- Figma paint slips followed as drawn or corrected, each noted in code: selected toggle text is white (Figma #02216E on #1E3A6E), Chip blue-stroke border is #bfdbfe, Status AI text is a gradient (Figma lists #0d9488), selected DataGrid row #eff6ff (Figma resolves to white).
- Placeholder text where the export has none: Workflow and FormBuilder field labels, DocumentToolbar demo icons, FormulaEditor button labels, country list in PhoneNumber (10 countries).
- TrendLine takes data (the Figma set has no path data).
- Liquid 1 loader is black because the source circles are black.
- Dark mode: not defined by Pulse, not provided.
- Icons: 393 come from the published `@pulse/icons`, 5 from Figma vectors.

- ExecutionChrome (navigation, NOT FROM FIGMA): SegmentedToggle, ChromeButton, ChromeIconButton, PillTabs, BarGroup, ChromeToast for the Electronic Execution bars. LeftNav, Header and Breadcrumbs gained an optional appearance="app" (see figma-deviations.md).
