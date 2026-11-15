/**
 * NOT FROM FIGMA. These come from the Pulse app source (pulse/src/components/micro-templates): the pulse-2.0 Figma
 * file has no page-template components ("Template Components" is an empty page), so they are kept as the app's own
 * page-chrome layer, built only from design-system components.
 *
 * Micro-templates: the page-chrome panels of the Pulse app (context bar, list header, toolbars,
 * stepper header, body, footer). Recovered from pulse/src/components/micro-templates and rebuilt on
 * the design-system components. Props are unchanged, except:
 *  - ContextBarPanel no longer navigates by itself (no router dependency): pass `onBreadcrumbClick`.
 *  - ListHeaderPanel's split button is built here (the Pulse Button's `dropdownOptions` prop is not part of this Button).
 */
import { useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { Box } from '../components/mui';
import type { SxProps, Theme } from '../components/mui';
import { DropdownMenu } from '../components/form/DropdownMenu/DropdownMenu';
import { DataGridToolbar } from '../components/data-display/DataGrid/DataGrid';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs/Breadcrumbs';
import type { BreadcrumbNode } from '../components/navigation/Breadcrumbs/Breadcrumbs';
import { Button } from '../components/actions/Button/Button';
import { ButtonGroup } from '../components/actions/Button/ButtonGroup';
import { ArrowDown01Icon, ArrowExpand01Icon, ArrowLeft01Icon, ArrowRight01Icon, FilterIcon, Layout3ColumnIcon, Menu01Icon, MoreVerticalIcon } from '../icons';
import { Chip } from '../components/data-display/Chip/Chip';
import type { ChipColor } from '../components/data-display/Chip/Chip';
import { IconButton } from '../components/actions/IconButton/IconButton';
import { Search } from '../components/form/Search/Search';
import { StatusFilterBar } from '../components/data-display/StatusFilterBar/StatusFilterBar';
import type { StatusFilterItem, StatusFilterSize } from '../components/data-display/StatusFilterBar/StatusFilterBar';
import { Stepper } from '../components/navigation/Stepper/Stepper';
import type { StepperProps } from '../components/navigation/Stepper/Stepper';
import { Tab, Tabs } from '../components/navigation/Tabs/Tabs';
import { ToggleButtonGroup } from '../components/form/ToggleButtonGroup/ToggleButtonGroup';
import { pt, surfaceBg } from '../theme/pulseTokens';

const surface = pt.colors.base.white;
const divider = pt.colors.neutral[100];
const border = (on: boolean) => (on ? `1px solid ${divider}` : 'none');
const merge = (base: object, sx?: SxProps<Theme>) => [base, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>;

/* ----------------------------------------------------------- ContextBarPanel */

export type ContextBarBreadcrumb = BreadcrumbNode;
export type ContextBarChipColor = ChipColor;
export interface ContextBarStatusChip {
  label: string;
  color?: ContextBarChipColor;
  onClick?: () => void;
}
export interface ContextBarPanelProps {
  /** Breadcrumb trail on the left. Ignored when `left` is given. */
  breadcrumbs?: ContextBarBreadcrumb[];
  onBreadcrumbClick?: (node: ContextBarBreadcrumb) => void;
  showHomeIcon?: boolean;
  separatorVariant?: 'arrow' | 'slice';
  /** Custom left content; replaces the breadcrumbs. */
  left?: ReactNode;
  /** Status legend chips on the right. */
  statusChips?: ContextBarStatusChip[];
  /** Free-form right slot (buttons, menus), after the chips. */
  actions?: ReactNode;
  /** Bottom border. @default true */
  divider?: boolean;
  sx?: SxProps<Theme>;
}

/** Panel 1: page context bar. Breadcrumbs on the left, status legend and actions on the right. */
export function ContextBarPanel({ breadcrumbs, onBreadcrumbClick, showHomeIcon = true, separatorVariant = 'arrow', left, statusChips, actions, divider: showDivider = true, sx }: ContextBarPanelProps) {
  const hasRight = Boolean(statusChips?.length) || Boolean(actions);
  return (
    <Box sx={merge({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', minHeight: 40, px: '24px', py: '8px', bgcolor: surface, borderBottom: border(showDivider) }, sx)}>
      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
        {left ?? (breadcrumbs?.length ? <Breadcrumbs nodes={breadcrumbs} separatorVariant={separatorVariant} showHomeIcon={showHomeIcon} onMenuClick={onBreadcrumbClick} /> : null)}
      </Box>
      {hasRight && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '8px', flexShrink: 0 }}>
          {statusChips?.map((c) => <Chip key={c.label} label={c.label} color={c.color ?? 'gray'} variant="strokeLight" shape="pill" size="xsmall" showBadge onClick={c.onClick} />)}
          {actions}
        </Box>
      )}
    </Box>
  );
}

/* --------------------------------------------------------- FooterActionsPanel */

export interface FooterActionsPanelProps {
  /** Secondary or exit actions, left. */
  leftActions?: ReactNode;
  /** Navigation, save, submit or primary actions, right. */
  rightActions?: ReactNode;
  /** Top border. @default true */
  divider?: boolean;
  sx?: SxProps<Theme>;
}

/** Bottom action region with independent left and right groups. */
export function FooterActionsPanel({ leftActions, rightActions, divider: showDivider = true, sx }: FooterActionsPanelProps) {
  return (
    <Box sx={merge({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', minHeight: 56, px: '24px', py: '8px', bgcolor: surface, borderTop: border(showDivider) }, sx)}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{leftActions}</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '8px' }}>{rightActions}</Box>
    </Box>
  );
}

/* --------------------------------------------------------- StepperHeaderPanel */

export interface StepperHeaderPanelProps {
  steps: StepperProps['steps'];
  activeStep?: number;
  /** Makes steps clickable; receives the clicked index. */
  onStepClick?: (stepIndex: number) => void;
  rightActions?: ReactNode;
  sx?: SxProps<Theme>;
}

/** Header with a centred stepper and utility actions. */
export function StepperHeaderPanel({ steps, activeStep = 0, onStepClick, rightActions, sx }: StepperHeaderPanelProps) {
  return (
    <Box sx={merge({ bgcolor: surface, borderBottom: border(true) }, sx)}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', minHeight: 52, px: '24px', py: '8px' }}>
        <Box sx={{ width: 32, flexShrink: 0 }} />
        <Box sx={{ minWidth: 0, display: 'flex', justifyContent: 'center', width: '75%', margin: '0 auto' }}>
          <Stepper variant="outlined" activeStep={activeStep} steps={steps} showStatusText={false} onStepClick={onStepClick} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>{rightActions}</Box>
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------ TabStatusFilterPanel */

export interface TabStatusFilterTab {
  label: string;
  disabled?: boolean;
}
export interface TabStatusFilterConfig {
  items: StatusFilterItem[];
  activeStatus: string | null;
  onStatusChange: (status: string | null) => void;
  totalCount?: number;
  totalLabel?: string;
  showTotal?: boolean;
  size?: StatusFilterSize;
}
export interface TabStatusFilterPanelProps {
  tabs: TabStatusFilterTab[];
  activeTab: number;
  onTabChange: (tabIndex: number) => void;
  statusFilter?: TabStatusFilterConfig;
  rightSlot?: ReactNode;
  divider?: boolean;
  sx?: SxProps<Theme>;
}

/** Tab navigation paired with a right-aligned status count filter. */
export function TabStatusFilterPanel({ tabs, activeTab, onTabChange, statusFilter, rightSlot, divider: showDivider = true, sx }: TabStatusFilterPanelProps) {
  const hasRight = Boolean(statusFilter) || Boolean(rightSlot);
  return (
    // The tab row's baseline runs edge to edge (Figma Tabs: 1px #e3ebf8 at the bottom). Tabs sit on the bottom edge and overlap that line by 1px,
    // so the selected tab's indicator is flush with it. 12px of space under the tab labels lifts them to the status filter's centre line. The status filter sits on the same row with 8px between its bottom edge and the baseline.
    <Box sx={merge({ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', minHeight: 44, pt: '12px', px: '24px', bgcolor: surface, borderBottom: showDivider ? `1px solid ${pt.uiElements.tabs.color.normalBorder}` : 'none' }, sx)}>
      <Box sx={{ minWidth: 0, mb: showDivider ? '-1px' : 0, position: 'relative', zIndex: 1, '& .MuiTabs-root .MuiTab-root': { pb: '12px' } }}>
        <Tabs variation="underline" size="small" value={activeTab} handleChange={(_, i) => onTabChange(i)} isScrollable={false}>
          {tabs.map((t, i) => <Tab key={t.label} index={i} label={t.label} size="small" disabled={t.disabled} />)}
        </Tabs>
      </Box>
      {hasRight && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', flexShrink: 0, alignSelf: 'flex-end', mb: '8px' }}>
          {statusFilter && <StatusFilterBar {...statusFilter} size={statusFilter.size ?? 'small'} />}
          {rightSlot}
        </Box>
      )}
    </Box>
  );
}

/* ------------------------------------------------------- PageBodyContentPanel */

export interface PageBodyContentPanelProps {
  children?: ReactNode;
  /** Surface background behind the page content. @default surfaceBg.canvas (Figma templates/color/surfaceBGCanvas) */
  bgcolor?: string;
  /** @default "16px" */
  padding?: string | number;
  /** Fill the space between the surrounding panels. @default true */
  grow?: boolean;
  /** Scroll long content instead of pushing the footer out of view. @default true */
  scroll?: boolean;
  scrollX?: boolean;
  /** Constrain and centre the content. */
  maxWidth?: string | number;
  divider?: boolean;
  sx?: SxProps<Theme>;
}

/** Page body: owns the scroll region so header and footer panels stay fixed. */
export function PageBodyContentPanel({ children, bgcolor = surfaceBg.canvas, padding = '16px', grow = true, scroll = true, scrollX = false, maxWidth, divider: showDivider = false, sx }: PageBodyContentPanelProps) {
  return (
    <Box sx={merge({ flex: grow ? 1 : '0 0 auto', minHeight: 0, p: padding, bgcolor, borderTop: border(showDivider), overflowY: scroll ? 'auto' : 'visible', overflowX: scrollX ? 'auto' : 'hidden' }, sx)}>
      {maxWidth ? <Box sx={{ maxWidth, mx: 'auto', width: '100%' }}>{children}</Box> : children}
    </Box>
  );
}

/* ---------------------------------------------------------- ListHeaderPanel */

export type ListHeaderGridActionType = 'filter' | 'columns' | 'density' | 'expand' | 'more';
export interface ListHeaderGridAction {
  type: ListHeaderGridActionType;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  icon?: ReactNode;
  ariaLabel?: string;
}
export interface ListHeaderDropdownOption {
  label: string | number;
  value: string | number;
  startAdornment?: ReactNode;
  disabled?: boolean;
}
export interface ListHeaderPrimaryAction {
  label: string;
  onClick?: () => void;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** Renders a split button with a dropdown. */
  dropdownOptions?: ListHeaderDropdownOption[];
  onOptionSelect?: (option: ListHeaderDropdownOption) => void;
  disabled?: boolean;
}
export interface ListHeaderPanelProps {
  title: string;
  /** Supporting line under the title. */
  metaData?: string;
  leadingSlot?: ReactNode;
  actionsStartSlot?: ReactNode;
  /** Outlined icon buttons on the right; shorthand type or object. `more` always renders last. */
  gridActions?: (ListHeaderGridActionType | ListHeaderGridAction)[];
  primaryAction?: ListHeaderPrimaryAction;
  /** Free-form right slot, after the primary action. */
  actionSlot?: ReactNode;
  divider?: boolean;
  sx?: SxProps<Theme>;
}

// The Pulse icon set (src/icons), as the original Pulse app template used.
const gridIcons: Record<ListHeaderGridActionType, ReactNode> = {
  filter: <FilterIcon size={16} />,
  columns: <Layout3ColumnIcon size={16} />,
  density: <Menu01Icon size={16} />,
  expand: <ArrowExpand01Icon size={16} />,
  more: <MoreVerticalIcon size={16} />,
};
const gridLabels: Record<ListHeaderGridActionType, string> = { filter: 'Filter', columns: 'Columns', density: 'Density', expand: 'Expand', more: 'More actions' };

/** The primary action: a Button, or the design system's ButtonGroup (split button, Figma Button > ButtonGroup) with a menu. */
function PrimaryAction({ action }: { action: ListHeaderPrimaryAction }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const options = action.dropdownOptions;
  if (!options) {
    return (
      <Button variant="contained" color="primary" size="small" startIcon={action.startIcon} endIcon={action.endIcon} disabled={action.disabled} onClick={action.onClick}>
        {action.label}
      </Button>
    );
  }
  return (
    <>
      <ButtonGroup
        size="small"
        startIcon={action.startIcon}
        disabled={action.disabled}
        onClick={action.onClick}
        icon={<ArrowDown01Icon size={16} />}
        onIconClick={(e) => setAnchor(e.currentTarget)}
      >
        {action.label}
      </ButtonGroup>
      <DropdownMenu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} align="right" options={options.map((o) => ({ label: o.label, value: o.value, disabled: o.disabled, icon: o.startAdornment }))} onSelect={(o) => action.onOptionSelect?.(options.find((x) => x.value === o.value)!)} />
    </>
  );
}

/**
 * Panel 3: list/page header, built on the design system's DataGridToolbar (Figma DatagridToolbar, Quick Filter off):
 * title + meta on the left, Filter / Columns / Density tools, then the primary action. `actionsStartSlot` and `actionSlot`
 * render inside the toolbar's action area (after the tools); `expand` and `more` are plain icon buttons there too.
 */
export function ListHeaderPanel({ title, metaData, leadingSlot, actionsStartSlot, gridActions, primaryAction, actionSlot, divider: showDivider = true, sx }: ListHeaderPanelProps) {
  const actions = (gridActions ?? []).map((a): ListHeaderGridAction => (typeof a === 'string' ? { type: a } : a));
  const get = (type: ListHeaderGridActionType) => actions.find((a) => a.type === type);
  const call = (a?: ListHeaderGridAction) => (anchor: HTMLElement) => a?.onClick?.({ currentTarget: anchor } as unknown as MouseEvent<HTMLElement>);
  const extra = (type: 'expand' | 'more') => {
    const a = get(type);
    return a ? (
      <IconButton key={type} variant="plain" size="small" ariaLabel={a.ariaLabel ?? gridLabels[type]} disabled={a.disabled} onClick={a.onClick as never}>
        {a.icon ?? gridIcons[type]}
      </IconButton>
    ) : null;
  };
  return (
    <Box sx={merge({ display: 'flex', alignItems: 'center', gap: '12px', px: '24px', py: '12px', bgcolor: surface, borderBottom: border(showDivider) }, sx)}>
      {leadingSlot}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <DataGridToolbar
          size="small"
          title={title}
          metadata={metaData}
          showFilter={Boolean(get('filter'))}
          showColumns={Boolean(get('columns'))}
          showDensity={Boolean(get('density'))}
          onFilterClick={call(get('filter'))}
          onColumnsClick={call(get('columns'))}
          onDensityClick={call(get('density'))}
          actionSlot={
            <>
              {actionsStartSlot}
              {extra('expand')}
              {primaryAction && <PrimaryAction action={primaryAction} />}
              {actionSlot}
              {extra('more')}
            </>
          }
        />
      </Box>
    </Box>
  );
}
/* -------------------------------------------------------- FilterToolbarPanel */

export interface FilterToolbarStatusFilter extends TabStatusFilterConfig {}
export interface FilterToolbarSearch {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: number | string;
}
export interface FilterToolbarViewOption {
  value: string;
  label: ReactNode;
  contentType?: 'icon' | 'text';
}
export interface FilterToolbarViewToggle {
  value: string;
  onChange: (value: string) => void;
  options: FilterToolbarViewOption[];
}
export interface FilterToolbarPanelProps {
  /** Status count filter (Total + per-status counts). */
  statusFilter?: FilterToolbarStatusFilter;
  /** @default "left" */
  statusFilterPlacement?: 'left' | 'right';
  search?: FilterToolbarSearch;
  /** @default "right" */
  searchPlacement?: 'left' | 'right';
  /** Grid/List style toggle, last on the right. */
  viewToggle?: FilterToolbarViewToggle;
  leftSlot?: ReactNode;
  /** Extra right content, before the view toggle. */
  rightSlot?: ReactNode;
  divider?: boolean;
  sx?: SxProps<Theme>;
}

const toolbarSearch = (c: FilterToolbarSearch) => (
  <Box sx={{ width: c.width ?? 280 }}>
    <Search size="small" placeholder={c.placeholder ?? 'Search'} value={c.value} onChange={(e) => c.onChange(e.target.value)} handleClear={() => c.onChange('')} showSearchIcon showCloseIcon={Boolean(c.value)} />
  </Box>
);

/** Panel 8: filter toolbar. Status filter and search can each sit left or right; optional view toggle. */
export function FilterToolbarPanel({ statusFilter, statusFilterPlacement = 'left', search, searchPlacement = 'right', viewToggle, leftSlot, rightSlot, divider: showDivider = false, sx }: FilterToolbarPanelProps) {
  const status = (c: FilterToolbarStatusFilter) => <StatusFilterBar {...c} size={c.size ?? 'small'} />;
  const leftStatus = statusFilter && statusFilterPlacement === 'left' ? statusFilter : undefined;
  const rightStatus = statusFilter && statusFilterPlacement === 'right' ? statusFilter : undefined;
  return (
    <Box sx={merge({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', px: '24px', py: '8px', bgcolor: surface, borderBottom: border(showDivider) }, sx)}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: leftStatus ? 1 : '0 1 auto' }}>
        {leftStatus && status(leftStatus)}
        {search && searchPlacement === 'left' && toolbarSearch(search)}
        {leftSlot}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {search && searchPlacement === 'right' && toolbarSearch(search)}
        {rightStatus && status(rightStatus)}
        {rightSlot}
        {viewToggle && (
          <ToggleButtonGroup
            size="small"
            exclusive
            value={viewToggle.value}
            onChange={(_, v) => v && viewToggle.onChange(v)}
            buttonList={viewToggle.options.map((o) => ({ value: o.value, label: o.label, contentType: o.contentType ?? 'icon' }))}
          />
        )}
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------- SearchToolbarPanel */

export interface SearchToolbarSearch {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: number | string;
}
export interface SearchToolbarToggleOption {
  value: string;
  label: ReactNode;
  contentType?: 'icon' | 'text';
}
export interface SearchToolbarToggle {
  value: string;
  onChange: (value: string) => void;
  options: SearchToolbarToggleOption[];
}
export interface SearchToolbarPanelProps {
  /** Left section header (tabs, title, actions). */
  headerSlot?: ReactNode;
  /** Left section body (tree, list). Scrolls on overflow. */
  body?: ReactNode;
  /** @default 240 */
  leftWidth?: number | string;
  /** Collapse button on the section divider. @default true */
  collapsible?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  toggle?: SearchToolbarToggle;
  search?: SearchToolbarSearch;
  divider?: boolean;
  sx?: SxProps<Theme>;
}

/** Panel 2: split toolbar. Toggle left, search right; optional collapsible left section. */
export function SearchToolbarPanel({ headerSlot, body, leftWidth = 240, collapsible = true, collapsed, defaultCollapsed = false, onCollapsedChange, toggle, search, divider: showDivider = true, sx }: SearchToolbarPanelProps) {
  const [internal, setInternal] = useState(defaultCollapsed);
  const isCollapsed = collapsed ?? internal;
  const hasLeft = Boolean(headerSlot || body);
  const flip = () => {
    const next = !isCollapsed;
    if (collapsed === undefined) setInternal(next);
    onCollapsedChange?.(next);
  };
  return (
    <Box sx={merge({ position: 'relative', display: 'flex', alignItems: 'stretch', flex: body ? 1 : '0 0 auto', minHeight: 0, bgcolor: surface, borderBottom: border(showDivider) }, sx)}>
      {hasLeft && (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexShrink: 0, width: isCollapsed ? 0 : leftWidth, borderRight: isCollapsed ? 'none' : `1px solid ${divider}`, overflow: 'hidden', transition: 'width 200ms ease' }}>
          {headerSlot && <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', px: '16px', borderBottom: `1px solid ${divider}` }}>{headerSlot}</Box>}
          {body && <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: '16px', py: '8px' }}>{body}</Box>}
        </Box>
      )}
      {hasLeft && collapsible && (
        <IconButton variant="contained" shape="circle" size="xsmall" ariaLabel={isCollapsed ? 'Expand panel' : 'Collapse panel'} onClick={flip} sx={{ position: 'absolute', top: '50%', left: isCollapsed ? 0 : leftWidth, transform: 'translate(-50%, -50%)', zIndex: 1 }}>
          {isCollapsed ? <ArrowRight01Icon size={14} /> : <ArrowLeft01Icon size={14} />}
        </IconButton>
      )}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flex: 1, minWidth: 0, px: '16px', py: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          {toggle && (
            <ToggleButtonGroup size="small" exclusive value={toggle.value} onChange={(_, v) => v && toggle.onChange(v)} buttonList={toggle.options.map((o) => ({ value: o.value, label: o.label, contentType: o.contentType ?? 'text' }))} />
          )}
        </Box>
        {search && (
          <Box sx={{ width: search.width ?? 'auto', flexShrink: 0 }}>
            <Search size="small" placeholder={search.placeholder ?? 'Search'} value={search.value} onChange={(e) => search.onChange(e.target.value)} handleClear={() => search.onChange('')} showSearchIcon showCloseIcon={Boolean(search.value)} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
