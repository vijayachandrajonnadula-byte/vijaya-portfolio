// Implements Figma page "Header": set "Header" (Variant: Desktop / Tablet / Mobile). Prop names follow the Pulse app's <Header .../> call.
import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowDownSharp from '@mui/icons-material/KeyboardArrowDownSharp';
import MenuRounded from '@mui/icons-material/MenuRounded';
import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import AppsRounded from '@mui/icons-material/AppsRounded';
import MoreVertRounded from '@mui/icons-material/MoreVertRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import PublicRounded from '@mui/icons-material/PublicRounded';
import { focusRing, pt, textStyle } from '../../../theme/pulseTokens';
import { Avatar } from '../../data-display/Avatar/Avatar';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Globe02Icon } from '../../../icons';
import { ProductLogoVector } from './Logos';

export interface HeaderOption {
  value: string;
}

export interface HeaderRegion {
  value: string;
  /** Meta line under the region name, e.g. a local time. */
  time?: string;
  handleSelect?: (value: string) => void;
  options?: HeaderOption[];
}

export interface HeaderProfile {
  name: string;
  fullName?: string;
  /** Meta line under the name (job / role). */
  job?: string;
  meta?: string;
  value?: string;
  /** Avatar image. Falls back to initials. */
  photo?: string;
  /** NOT FROM FIGMA: green presence dot on the avatar (the live Pulse application shows it). */
  online?: boolean;
  options?: HeaderOption[];
  handleSelect?: (value: string) => void;
}

export interface HeaderProps {
  /** Replaces the default PULSE wordmark. */
  customElement?: ReactNode;
  /** Desktop shows everything; tablet / mobile add a menu button and shrink the user blocks. @default "desktop" */
  variant?: 'desktop' | 'tablet' | 'mobile';
  showRegion?: boolean;
  showProfile?: boolean;
  showAvatar?: boolean;
  showNotification?: boolean;
  showNotificationBadge?: boolean;
  /** Suite (app switcher) and actions icon buttons. */
  showSuite?: boolean;
  showActions?: boolean;
  /** Centered search button (mobile / tablet) or slot (desktop). */
  searchSlot?: ReactNode;
  region?: HeaderRegion;
  profile?: HeaderProfile;
  onMenuClick?: () => void;
  onSuiteClick?: () => void;
  onNotificationClick?: () => void;
  onActionsClick?: () => void;
  /**
   * NOT FROM FIGMA. figma: the Figma spec (12/18 meta line, filled globe). app: the live Pulse application: name 12/16 semibold, meta line
   * 10/14, outline globe. Logged in docs/figma-deviations.md. @default "figma"
   */
  appearance?: 'figma' | 'app';
}

const BG = '#f6f8fc'; // uiElements/header/Color/backgroundColor
const BORDER = '#e2e8f0';

/** Application wordmark (115x18). Generic in this copy. */
export function ProductLogo() {
  return <ProductLogoVector data-spec="header logo" aria-label="PULSE" />;
}

function UserBlock({ title, meta, avatar, compact, options, onSelect, label, app }: { title: string; meta?: string; avatar: ReactNode; compact: boolean; options?: HeaderOption[]; onSelect?: (v: string) => void; label: string; app?: boolean }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const interactive = Boolean(options?.length);
  return (
    <>
      <ButtonBase
        aria-label={label}
        aria-haspopup={interactive ? 'menu' : undefined}
        onClick={(e) => interactive && setAnchor(e.currentTarget)}
        sx={{ gap: '8px', borderRadius: pt.radius.xs, textAlign: 'left', '&.Mui-focusVisible': { boxShadow: focusRing } }}
      >
        {avatar}
        {!compact && (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ ...textStyle('textM', 'semiBold'), ...(app ? { fontSize: 12, lineHeight: '16px' } : {}), color: '#0f172a', whiteSpace: 'nowrap', mb: app ? 0 : '-4px' }}>{title}</Box>
              {meta && <Box sx={{ fontFamily: pt.typographyStyles.textM.regular.fontFamily, fontSize: app ? 10 : 12, lineHeight: app ? '14px' : '18px', color: app ? '#64748b' : '#566680', whiteSpace: 'nowrap' }}>{meta}</Box>}
            </Box>
            {interactive && (app ? <KeyboardArrowDownSharp sx={{ fontSize: 14, color: '#0f172a' }} /> : <KeyboardArrowDownRounded sx={{ fontSize: 14, color: '#0f172a' }} />)}
          </>
        )}
      </ButtonBase>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} slotProps={{ list: { dense: true } }}>
        {options?.map((o) => (
          <MenuItem key={o.value} onClick={() => { onSelect?.(o.value); setAnchor(null); }} sx={{ ...textStyle('textM', 'regular'), textTransform: 'capitalize' }}>{o.value}</MenuItem>
        ))}
      </Menu>
    </>
  );
}

/** Application header: 52px bar, #F6F8FC with a 1px bottom divider; logo left, action buttons / region / profile right. */
export function Header({
  customElement,
  variant = 'desktop',
  showRegion = false,
  showProfile = false,
  showAvatar = true,
  showNotification = false,
  showNotificationBadge = false,
  showSuite = false,
  showActions = false,
  searchSlot,
  region,
  profile,
  onMenuClick,
  onSuiteClick,
  onNotificationClick,
  onActionsClick,
  appearance = 'figma',
}: HeaderProps) {
  const desktop = variant === 'desktop';
  const mobile = variant === 'mobile';
  const initials = (profile?.fullName ?? profile?.name ?? '?').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <Box
      component="header"
      data-spec={`header ${variant}`}
      sx={{ display: 'flex', alignItems: 'center', gap: '16px', height: 52, boxSizing: 'border-box', padding: '0 16px', background: BG, boxShadow: `inset 0 -1px 0 0 ${BORDER}`, flexShrink: 0, width: '100%' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
        {!desktop && (
          // Figma tablet / mobile: IconButton Small, Square, Contained, Primary
          <IconButton ariaLabel="Open menu" variant="contained" size="small" onClick={onMenuClick}>
            <MenuRounded />
          </IconButton>
        )}
        {customElement ?? <ProductLogo />}
      </Box>
      {searchSlot ?? (!desktop && (
        <IconButton ariaLabel="Search" size="small"><SearchRounded /></IconButton>
      ))}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: mobile ? '8px' : '16px', justifyContent: 'flex-end' }}>
        {showSuite && <IconButton ariaLabel="Applications" size="small" onClick={onSuiteClick}><AppsRounded /></IconButton>}
        {showNotification && (
          <IconButton ariaLabel="Notifications" size="small" onClick={onNotificationClick} badge={showNotificationBadge ? '#ef4444' : undefined}>
            <NotificationsNoneRounded />
          </IconButton>
        )}
        {showActions && <IconButton ariaLabel="Actions" size="small" onClick={onActionsClick}><MoreVertRounded /></IconButton>}
        {showRegion && region && (
          <UserBlock
            label="Region"
            title={region.value}
            meta={region.time}
            compact={mobile}
            options={region.options}
            onSelect={region.handleSelect}
            app={appearance === 'app'}
            avatar={<Avatar size="small" backgroundColor="#e7f0ff" textColor="#212324">{appearance === 'app' ? <Globe02Icon size={16} type="sharp" /> : <PublicRounded sx={{ fontSize: 16 }} />}</Avatar>}
          />
        )}
        {showProfile && profile && (
          <UserBlock
            label="Profile"
            title={profile.name}
            meta={profile.job ?? profile.meta}
            compact={mobile}
            options={profile.options}
            onSelect={profile.handleSelect}
            app={appearance === 'app'}
            avatar={showAvatar ? <Avatar size="small" src={profile.photo} alt={profile.name} backgroundColor="#e7f0ff" textColor="#1e3a6e" badge={profile.online}>{initials}</Avatar> : <span />}
          />
        )}
      </Box>
    </Box>
  );
}

