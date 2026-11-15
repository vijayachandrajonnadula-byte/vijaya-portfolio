// Implements Figma page "LeftNav": sets "LeftNav" (Default / Secondary Level), ".leftNavButtonItems", ".Logos", ".Search", "ExpandCollapse", ".leftNav-SecondaryLevelMenus".
import { fw } from '../../../theme/typography';
import { LeftNavLogo } from './LeftNavMark';
import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Badge from '@mui/material/Badge';
import InputBase from '@mui/material/InputBase';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import { ArrowLeft01Icon, ArrowRight01Icon, CheckmarkCircle02Icon, DashboardSquare02Icon, MoreHorizontalIcon, Search01Icon } from '../../../icons';
import { AdornmentButton } from '../../actions/Button/AdornmentButton';
import { Chip } from '../../data-display/Chip/Chip';
import { focusRing, pt, textStyle } from '../../../theme/pulseTokens';

export interface LeftNavSecondMenu {
  id: string;
  name: string;
  icon?: ReactNode;
  link?: string;
  notification?: number;
  /** Third level: renders this entry as an accordion header. */
  children?: LeftNavSecondMenu[];
}

export interface LeftNavMenu {
  id: string;
  name: string;
  icon: ReactNode;
  link?: string;
  notification?: number;
  children?: LeftNavSecondMenu[];
}

export interface LeftNavSelection {
  firstLevelMenu: string;
  secondLevelMenu: string;
  link?: string;
}

export interface LeftNavProps {
  menus: LeftNavMenu[];
  /** id of the selected first-level menu. */
  selectedMenu?: string;
  /** id of the selected second-level menu. */
  selectedSecondMenu?: string;
  handleSubMenu?: (item: LeftNavSelection) => void;
  /** Called when a first-level menu without children is picked. */
  onMenuClick?: (menu: LeftNavMenu) => void;
  /** Search box (shown in the secondary menu). Provide `onChange` to enable it. */
  searchValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  /** Secondary panel visible (expanded). @default true */
  open?: boolean;
  /** Expand/collapse circle clicked. */
  onOpen?: () => void;
  /** Brand logo node for the 52px header. */
  logo?: ReactNode;
  /** Heading in the secondary menu. Defaults to the selected menu name. */
  title?: string;
  /** Suites listed in the suite panel; the logo becomes a SWITCH button that opens it. */
  suites?: LeftNavSuite[];
  /** id of the active suite. */
  selectedSuite?: string;
  onSuiteChange?: (suite: LeftNavSuite) => void;
  /** Heading of the suite panel. */
  suitePanelTitle?: string;
  /** Shows the .leftNav-moreBtn at the bottom of the rail. */
  onMoreClick?: () => void;
  /**
   * NOT FROM FIGMA. figma: the Figma spec (white icons, 12px labels). app: the live Pulse application: idle icons and labels slate #94a3b8,
   * 9px labels, the active module white on #3c5176 with no edge bar. Logged in docs/figma-deviations.md. @default "figma"
   */
  appearance?: 'figma' | 'app';
}

export interface LeftNavSuite {
  id: string;
  name: string;
  /** Meta data line under the name. */
  description?: string;
  /** Chip next to the name (e.g. Beta). */
  chip?: string;
  icon?: ReactNode;
}

const ln = pt.uiElements.leftNav;
const NAV_BG = '#19325e'; // Figma uiElements/leftNav/navbar/defaultBackground
const sm = ln.button.color.secondaryMenu;
const WHITE = '#fff';

export interface LeftNavExpandCollapseProps {
  /** Figma Variant: the arrow direction. Left collapses the secondary panel, right expands it. @default "left" */
  variant?: 'left' | 'right';
  onClick?: () => void;
  sx?: object;
}

/** Round 24px collapse/expand control on the edge of the secondary panel (Figma set "ExpandCollapse"). */
export function LeftNavExpandCollapse({ variant = 'left', onClick, sx }: LeftNavExpandCollapseProps) {
  const Arrow = variant === 'left' ? ArrowLeft01Icon : ArrowRight01Icon;
  return (
    <ButtonBase
      aria-label={variant === 'left' ? 'Collapse navigation' : 'Expand navigation'}
      onClick={onClick}
      data-spec="leftnav expand-collapse"
      sx={{ width: 24, height: 24, boxSizing: 'border-box', borderRadius: '1000px', background: ln.expandCollapseIcon.defaultBackground, border: `1px solid ${ln.expandCollapseIcon.defaultBorder}`, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.2)', color: '#0f172a', zIndex: 2, '&.Mui-focusVisible': { boxShadow: focusRing }, ...sx }}
    >
      <Arrow size={16} />
    </ButtonBase>
  );
}

export interface LeftNavSearchProps {
  /** Figma Variant. collapsed: 32px icon button. expand: 216px input. @default "expand" */
  variant?: 'collapsed' | 'expand';
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onClick?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

/** Translucent search field for the dark rail (Figma ".Building Blocks/Search", hover = lighter fill + white border). */
export function LeftNavSearch({ variant = 'expand', value = '', onChange, onClear, onClick, placeholder = 'Search', autoFocus }: LeftNavSearchProps) {
  const base = { boxSizing: 'border-box', height: 32, borderRadius: '4px', padding: '4px 8px', background: 'rgba(255,255,255,0.25)', border: '1px solid #f1f5f9', color: WHITE, display: 'flex', alignItems: 'center', gap: '4px', '&:hover, &:focus-within': { background: 'rgba(255,255,255,0.30)', borderColor: WHITE } } as const;
  if (variant === 'collapsed') {
    return (
      <ButtonBase aria-label="Search" onClick={onClick} data-spec="leftnav search collapsed" sx={{ ...base, width: 32, justifyContent: 'center', '&.Mui-focusVisible': { boxShadow: focusRing } }}>
        <Search01Icon size={16} />
      </ButtonBase>
    );
  }
  return (
    <Box data-spec="leftnav search expand" sx={{ ...base, width: 216 }}>
      <Search01Icon size={16} />
      <InputBase
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        inputProps={{ 'aria-label': 'Search menu' }}
        sx={{ flex: 1, minWidth: 0, color: WHITE, ...textStyle('textM', 'regular'), '& input': { padding: 0, height: 20 }, '& input::placeholder': { color: WHITE, opacity: 0.8 } }}
      />
      {value && <AdornmentButton size="xxs" variant="light" aria-label="Clear search" onClick={onClear} />}
    </Box>
  );
}

export interface LeftNavSuiteBlockProps {
  name: string;
  description?: string;
  chip?: string;
  icon?: ReactNode;
  /** Figma Interaction=Active (current suite): blue icon tile and a check mark. Hover is the :hover state. */
  active?: boolean;
  onClick?: () => void;
}

/** One suite row (Figma ".buildingBlock/SuiteBlock": Default / Hover / Active). */
export function LeftNavSuiteBlock({ name, description, chip, icon, active, onClick }: LeftNavSuiteBlockProps) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      data-spec="leftnav suite-block"
      sx={{ width: '100%', height: 52, boxSizing: 'border-box', padding: '8px', gap: '8px', borderRadius: '8px', justifyContent: 'flex-start', textAlign: 'left', background: '#fff', '&:hover': { background: '#eef3fb', '& .PulseSuite-icon': { background: '#1e3a6e' } }, '&.Mui-focusVisible': { boxShadow: focusRing } }}
    >
      <Box className="PulseSuite-icon" sx={{ width: 36, height: 36, borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: WHITE, background: active ? '#3b82f6' : '#1e3a6e' }}>
        {icon ?? <DashboardSquare02Icon size={20} />}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', height: 20 }}>
          <Box component="span" sx={{ ...textStyle('textM', 'semiBold'), color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</Box>
          {chip && <Chip label={chip} size="xxsmall" color="blue" />}
        </Box>
        {description && <Box component="span" sx={{ fontFamily: 'Figtree, sans-serif', fontSize: 12, lineHeight: '18px', color: '#566680', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{description}</Box>}
      </Box>
      {active && <CheckmarkCircle02Icon size={16} color="#1e3a6e" />}
    </ButtonBase>
  );
}

export interface LeftNavSuitePanelProps {
  title?: string;
  suites: LeftNavSuite[];
  selectedSuite?: string;
  onSelect?: (suite: LeftNavSuite) => void;
}

/** Suite switcher card (Figma component "Suite Panel", 256px wide). */
export function LeftNavSuitePanel({ title, suites, selectedSuite, onSelect }: LeftNavSuitePanelProps) {
  return (
    <Box role="dialog" aria-label={title ?? 'Suites'} data-spec="leftnav suite-panel" sx={{ width: 256, borderRadius: '8px', background: '#fff', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      {title && <Box sx={{ padding: '6px 8px', boxShadow: 'inset 0 -1px 0 0 #e2e8f0', ...textStyle('textM', 'regular'), color: '#566680' }}>{title}</Box>}
      <Box sx={{ padding: '8px', display: 'flex', flexDirection: 'column' }}>
        {suites.map((s) => <LeftNavSuiteBlock key={s.id} name={s.name} description={s.description} chip={s.chip} icon={s.icon} active={s.id === selectedSuite} onClick={() => onSelect?.(s)} />)}
      </Box>
    </Box>
  );
}

export interface LeftNavMoreButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

/** 48x24 "more" button at the foot of the rail (Figma ".Building Blocks/leftNav-moreBtn": Default / Hover / Disabled). */
export function LeftNavMoreButton({ onClick, disabled }: LeftNavMoreButtonProps) {
  return (
    <ButtonBase aria-label="More" onClick={onClick} disabled={disabled} data-spec="leftnav more" sx={{ width: 48, height: 24, color: '#d9dbdd', background: 'rgba(255,255,255,0.01)', '&:hover': { background: 'rgba(255,255,255,0.05)', color: WHITE }, '&.Mui-disabled': { opacity: 0.38 }, '&.Mui-focusVisible': { boxShadow: 'inset 0 0 0 2px #3B82F6' } }}>
      <MoreHorizontalIcon size={20} />
    </ButtonBase>
  );
}

/** Logo cell (Figma ".Building Blocks/Logos"): the brand mark; hover shows the SWITCH affordance when suites exist. */
function LogoCell({ logo, switchable, open, onClick }: { logo?: ReactNode; switchable: boolean; open: boolean; onClick: () => void }) {
  if (!switchable) return <>{logo ?? <LeftNavLogo />}</>;
  return (
    <ButtonBase onClick={onClick} aria-label="Switch suite" aria-expanded={open} data-spec="leftnav logo" sx={{ width: '100%', height: '100%', flexDirection: 'column', gap: '2px', color: WHITE, '& .PulseLogo-switch': { display: 'none' }, '&:hover, &.Mui-focusVisible': { '& .PulseLogo-mark': { display: 'none' }, '& .PulseLogo-switch': { display: 'flex' } } }}>
      <Box className="PulseLogo-mark" sx={{ display: 'flex' }}>{logo ?? <LeftNavLogo />}</Box>
      <Box className="PulseLogo-switch" sx={{ flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        <DashboardSquare02Icon size={20} />
        <Box component="span" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: fw.medium, fontSize: 9, lineHeight: '16px' }}>SWITCH</Box>
      </Box>
    </ButtonBase>
  );
}
/** First-level rail button (72x52: 20px icon over a 12px label). */
function RailButton({ menu, active, selected, onClick, app }: { menu: LeftNavMenu; active: boolean; selected: boolean; onClick: () => void; app?: boolean }) {
  const idle = app ? '#94a3b8' : WHITE;
  return (
    <ButtonBase
      onClick={onClick}
      aria-current={selected ? 'page' : undefined}
      data-spec="leftnav button"
      sx={{
        width: '100%',
        height: 52,
        flexDirection: 'column',
        gap: '2px',
        padding: '0 4px',
        justifyContent: 'center',
        color: app ? (active || selected ? WHITE : idle) : WHITE,
        boxSizing: 'border-box',
        background: active || selected ? (app ? '#3c5176' : ln.button.color.activeBackground) : 'transparent',
        boxShadow: active && !app ? 'inset 2px 0 0 0 rgba(255,255,255,0.7)' : 'none',
        '& .PulseNav-label': { ...textStyle('textS', active ? 'semiBold' : 'medium'), fontSize: app ? 9 : 12, lineHeight: app ? '14px' : '16px', ...(app ? { transform: 'translateY(-2px)' } : {}), width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: active ? WHITE : app ? idle : '#d9e1eb' },
        '&:hover': { background: ln.button.color.hoverBackground, color: app ? WHITE : undefined, '& .PulseNav-label': { color: WHITE } },
        '&.Mui-focusVisible': { boxShadow: 'inset 0 0 0 2px #3B82F6' },
      }}
    >
      <Badge color="error" variant={menu.notification ? 'dot' : undefined} sx={{ '& .MuiBadge-dot': { width: 6, height: 6, minWidth: 6, background: '#ef4444' }, '& svg': { fontSize: 20 }, display: 'inline-flex' }}>
        {menu.icon}
      </Badge>
      <span className="PulseNav-label">{menu.name}</span>
    </ButtonBase>
  );
}

const itemText = { ...textStyle('textM', 'medium'), fontSize: 14, lineHeight: '20px' } as const;

function SecondItem({ item, active, header, indent, open, onClick }: { item: LeftNavSecondMenu; active: boolean; header?: boolean; indent?: boolean; open?: boolean; onClick: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      aria-expanded={header ? open : undefined}
      data-spec={header ? 'leftnav accordion-header' : 'leftnav second-item'}
      sx={{
        width: '100%',
        height: 32,
        boxSizing: 'border-box',
        justifyContent: 'flex-start',
        gap: '8px',
        padding: indent ? '0 8px 0 40px' : '0 8px 0 16px',
        color: active ? sm.secondaryActiveMenuText : sm.secondaryMenuText,
        background: header ? sm.accordionHeaderBg : active ? sm.secondaryActiveMenuBg : 'transparent',
        boxShadow: active && !header ? 'inset 2px 0 0 0 #19325e' : 'none',
        ...itemText,
        textAlign: 'left',
        '& .PulseNav-icon': { display: 'inline-flex', color: sm.secondaryMenuIcon, '& svg': { fontSize: 16 } },
        '&:hover': { background: header ? sm.accordionHeaderHoverBg : indent ? sm.accordionMenuHoverBg : sm.secondaryHoverMenuBg },
        '&.Mui-focusVisible': { boxShadow: `inset 0 0 0 2px #3B82F6` },
      }}
    >
      {item.icon && <span className="PulseNav-icon">{item.icon}</span>}
      <Box component="span" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</Box>
      {header && (open ? <KeyboardArrowUpRounded sx={{ fontSize: 16 }} /> : <KeyboardArrowDownRounded sx={{ fontSize: 16 }} />)}
    </ButtonBase>
  );
}

/**
 * Application left navigation. A 72px dark rail of first-level menus; the selected menu's children appear in a
 * 240px secondary panel (search, accordion groups) with an expand/collapse circle on its edge.
 */
export function LeftNav({ menus, selectedMenu, selectedSecondMenu, handleSubMenu, onMenuClick, searchValue, onChange, onClear, open = true, onOpen, logo, title, suites, selectedSuite, onSuiteChange, suitePanelTitle, onMoreClick, appearance = 'figma' }: LeftNavProps) {
  const [suiteOpen, setSuiteOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | undefined>(selectedMenu);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const activeId = openMenuId ?? selectedMenu;
  const activeMenu = menus.find((m) => m.id === activeId);
  const children = activeMenu?.children;
  const showSecondary = open && Boolean(children?.length);
  const q = (searchValue ?? '').trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!children) return [];
    if (!q) return children;
    return children
      .map((c) => (c.children ? { ...c, children: c.children.filter((g) => g.name.toLowerCase().includes(q)) } : c))
      .filter((c) => (c.children ? c.children.length > 0 : c.name.toLowerCase().includes(q)));
  }, [children, q]);

  const pick = (second: LeftNavSecondMenu) => {
    if (!activeMenu) return;
    handleSubMenu?.({ firstLevelMenu: activeMenu.id, secondLevelMenu: second.id, link: second.link });
  };

  return (
    <Box component="nav" ref={rootRef} aria-label="Main navigation" onKeyDown={(e) => { if (e.key === 'Escape') { setSuiteOpen(false); setSearchOpen(false); } }} sx={{ display: 'flex', height: '100%', position: 'relative', flexShrink: 0 }}>
      {/* rail */}
      <Box sx={{ width: 72, flexShrink: 0, background: NAV_BG, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }} data-spec="leftnav rail">
        <Box sx={{ height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 -1px 0 0 ${ln.navBar.defaultDivider}` }}><LogoCell logo={logo} switchable={Boolean(suites?.length)} open={suiteOpen} onClick={() => setSuiteOpen((o) => !o)} /></Box>
        {onChange && <Box sx={{ display: 'flex', justifyContent: 'center', pt: '6px' }}><LeftNavSearch variant="collapsed" onClick={() => setSearchOpen((o) => !o)} /></Box>}
        <Box sx={{ py: '6px', overflowY: 'auto', flex: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
          {menus.map((m) => (
            <RailButton
              key={m.id}
              menu={m}
              app={appearance === 'app'}
              active={m.id === selectedMenu && !m.children?.length}
              selected={m.id === activeId && Boolean(m.children?.length)}
              onClick={() => {
                setOpenMenuId(m.id);
                if (!m.children?.length) onMenuClick?.(m);
              }}
            />
          ))}
        </Box>
        {onMoreClick && <Box sx={{ display: 'flex', justifyContent: 'center', pb: '6px' }}><LeftNavMoreButton onClick={onMoreClick} /></Box>}
        {!showSecondary && onOpen && <LeftNavExpandCollapse variant="right" onClick={onOpen} sx={{ position: 'absolute', right: -12, top: 'calc(50% - 12px)' }} />}
      </Box>
      {suiteOpen && suites && (
        <Box sx={{ position: 'absolute', left: 80, top: 8, zIndex: 20 }}>
          <LeftNavSuitePanel title={suitePanelTitle} suites={suites} selectedSuite={selectedSuite} onSelect={(s) => { onSuiteChange?.(s); setSuiteOpen(false); }} />
        </Box>
      )}
      {searchOpen && onChange && (
        <Box sx={{ position: 'absolute', left: 72, top: 52, zIndex: 20, width: 240, boxSizing: 'border-box', padding: '12px', background: NAV_BG, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.15)' }}>
          <LeftNavSearch variant="expand" value={searchValue} onChange={onChange} onClear={onClear} autoFocus />
        </Box>
      )}
      {/* secondary panel */}
      {showSecondary && (
        <Box sx={{ width: 240, background: ln.secondaryMenu.background, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 0 }} data-spec="leftnav secondary">
          <Box sx={{ height: 52, flexShrink: 0, boxSizing: 'border-box', px: '16px', display: 'flex', alignItems: 'center', background: ln.secondaryMenu.title.titleBackground, boxShadow: 'inset 0 -1px 0 0 #e2e8f0', ...textStyle('textL', 'bold'), color: ln.secondaryMenu.title.textColor }}>{title ?? activeMenu?.name}</Box>
          <Box role="menu" sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', py: '6px' }}>
            {filtered.map((c) =>
              c.children ? (
                <Box key={c.id} sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <SecondItem item={c} header active={false} open={openGroups[c.id] ?? c.children.some((g) => g.id === selectedSecondMenu)} onClick={() => setOpenGroups((s) => ({ ...s, [c.id]: !(s[c.id] ?? c.children!.some((g) => g.id === selectedSecondMenu)) }))} />
                  {(openGroups[c.id] ?? c.children.some((g) => g.id === selectedSecondMenu) ) && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', background: sm.accordionBodyBG }}>
                      {c.children.map((g) => <SecondItem key={g.id} item={g} indent active={g.id === selectedSecondMenu} onClick={() => pick(g)} />)}
                    </Box>
                  )}
                </Box>
              ) : (
                <SecondItem key={c.id} item={c} active={c.id === selectedSecondMenu} onClick={() => pick(c)} />
              ),
            )}
          </Box>
          {onOpen && <LeftNavExpandCollapse variant="left" onClick={onOpen} sx={{ position: 'absolute', right: -12, top: 'calc(50% - 12px)' }} />}
        </Box>
      )}
    </Box>
  );
}



export { LeftNavLogo };
