# Page patterns (recipes)

Each recipe lists the regions top to bottom and the component for each. Props shown are real; check `ai/components.json` for the rest.
All pages sit in `AppShell` (`nav={<LeftNav .../>}`, `header={<Header .../>}`) and import only from `src/components`, `src/templates` and `src/icons`.

## 1. List page (table of records)  — built: `src/pages/ExecutionLifecycle`
| Region | Component |
|---|---|
| Frame | `AppShell` + `LeftNav` + `Header` |
| Breadcrumb | `ContextBarPanel breadcrumbs={[{ node, link }]}` |
| Title, subtitle, tools, primary action | `ListHeaderPanel title metaData gridActions={['filter','columns','density']} primaryAction={{ label, dropdownOptions }}` (renders `DataGridToolbar`, `ButtonGroup`, `DropdownMenu`) |
| Tabs + status filter | `TabStatusFilterPanel tabs activeTab statusFilter={{ items:[{status,count,color}], activeStatus, onStatusChange }} divider` (renders `Tabs`, `StatusFilterBar`) |
| Body | `PageBodyContentPanel` > `Region` > `DataGrid hideToolbar filledHeader columns rows` |
| Cells | id: `DataGridLinkCell` · text: `DataGridTextCell` · person: `DataGridTextCell icon={<Avatar/>}` · status: `Status type="chip" color` · actions: `DataGridActionsCell` + `IconButton` |

## 2. Wizard / create flow
`StepperHeaderPanel steps activeStep onStepClick` → `PageBodyContentPanel` (steps' content: `Section` blocks with `TextField`, `Select`, `RadioGroup`...) → `FooterActionsPanel leftActions rightActions` (`Button variant="outlined"` back, `Button` next).

## 3. Detail with side panel
List page + `Flyout open onClose headerProps={{ title }} tabs footer` for view/edit; `Modal` for confirmations; `Notification isSnackbar` for success toasts.

## 4. Form section
`Section title` > grid of `TextField` / `Select` / `DatePicker`; group choices with `CheckboxGroup` / `RadioGroup`; hints via the field's `hint`; validation via `error`.

## 5. Dashboard
`PageBodyContentPanel` > row of `KPICard` · cards (`Region`) holding `ChartBar` / `ChartDonut` with `ChartLegend` · `TrendLine` in table cells · `EmptyState` for empty widgets.

## Rules that apply to every pattern
- Status of one record = `Status`; filtering by status = `StatusFilterBar`; never a hand-coloured chip.
- A button with an attached chevron = `ButtonGroup`; its menu = `DropdownMenu`.
- The AI action = `Button color="ai"`.
- Surface colour behind cards = `PageBodyContentPanel` (Figma `surfaceBGCanvas`), 16px padding.
- Text weights come from roles (`src/theme/typography.ts`), never numbers.
