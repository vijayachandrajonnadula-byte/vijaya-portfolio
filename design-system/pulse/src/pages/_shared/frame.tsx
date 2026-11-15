import { useState, type ReactNode } from 'react';
import { Header } from '../../components/navigation/Header/Header';
import { LeftNav } from '../../components/navigation/LeftNav/LeftNav';
import type { LeftNavMenu } from '../../components/navigation/LeftNav/LeftNav';
import {
  QualityReviewIcon, ChartLineData02Icon, CleanIcon, Configuration01Icon, Doc02Icon, ExceptionIcon,
  GatewayIcon, Home01Icon, ProcessVerificationIcon, OperationsIcon, LabsIcon, Layers01Icon, ScheduleFrameworkIcon, Settings05Icon,
  SlidersHorizontalIcon, UserSettings02Icon, ValidationApprovalIcon,
} from '../../icons';
import { AppShell } from '../../templates';

const icon = (Icon: typeof Home01Icon) => <Icon size={24} />;
const menus: LeftNavMenu[] = [
  { id: 'home', name: 'Home', icon: icon(Home01Icon) },
  { id: 'admin', name: 'Administration', icon: icon(UserSettings02Icon) },
  { id: 'quality', name: 'Quality review', icon: icon(QualityReviewIcon as typeof Home01Icon) },
  { id: 'config', name: 'Configuration', icon: icon(Configuration01Icon) },
  { id: 'document', name: 'Document', icon: icon(Doc02Icon) },
  { id: 'exception', name: 'Exception', icon: icon(ExceptionIcon as typeof Home01Icon) },
  { id: 'execution', name: 'Execution', icon: icon(Settings05Icon) },
  { id: 'gateway', name: 'Gateway', icon: icon(GatewayIcon as typeof Home01Icon) },
  { id: 'cleaning', name: 'Cleaning', icon: icon(CleanIcon) },
  { id: 'manufacturing', name: 'Manufacturing', icon: icon(LabsIcon) },
  { id: 'verification', name: 'Verification', icon: icon(ProcessVerificationIcon as typeof Home01Icon) },
  { id: 'inventory', name: 'Inventory', icon: icon(Layers01Icon) },
  { id: 'operations', name: 'Operations', icon: icon(OperationsIcon as typeof Home01Icon) },
  { id: 'validation', name: 'Validation', icon: icon(ValidationApprovalIcon) },
  { id: 'reports', name: 'Reports', icon: icon(ChartLineData02Icon) },
  { id: 'schedule', name: 'Schedule Management', icon: icon(ScheduleFrameworkIcon as typeof Home01Icon) },
  { id: 'setup', name: 'System Setup', icon: icon(SlidersHorizontalIcon) },
];

/** The shell every sample page shares: the left navigation and the header, with generic labels. */
export function Frame({ active, children }: { active: string; children: ReactNode }) {
  const [menu, setMenu] = useState(active);
  return (
    <AppShell
      nav={<LeftNav menus={menus} selectedMenu={menu} onMenuClick={(m) => setMenu(m.id)} />}
      header={
        <Header
          showRegion
          showProfile
          showAvatar
          region={{ value: 'Chennai', time: '12:00 AM IST', options: [{ value: 'Chennai' }, { value: 'New Jersey' }] }}
          profile={{ name: 'Administrator', job: 'Quality site', options: [{ value: 'Settings' }, { value: 'Log out' }] }}
        />
      }
    >
      {children}
    </AppShell>
  );
}
