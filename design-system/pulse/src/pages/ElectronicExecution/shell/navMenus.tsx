import type { LeftNavMenu } from '../../../components/navigation/LeftNav/LeftNav';
import {
  ArrowDataTransferHorizontalIcon, ChartLineData02Icon, CleanIcon, Configuration01Icon, Doc02Icon, ExceptionIcon, GatewayIcon, Home01Icon, Layers01Icon, LabsIcon, OperationsIcon, ProcessVerificationIcon,
  QualityReviewIcon, ScheduleFrameworkIcon, Settings05Icon, SlidersHorizontalIcon, UserSettings02Icon, ValidationApprovalIcon,
} from '../../../icons';

const icon = (Icon: typeof Home01Icon) => <Icon size={24} />;

/**
 * NOT FROM FIGMA. First-level menus of the left navigation on this screen: generic module names with outline icons from src/icons,
 * in the order of the real application (Execution is the active module, 13th of 18).
 */
export const EXECUTION_MENUS: LeftNavMenu[] = [
  { id: 'home', name: 'Home', icon: icon(Home01Icon) },
  { id: 'admin', name: 'Administration', icon: icon(UserSettings02Icon) },
  { id: 'quality', name: 'Quality', icon: icon(QualityReviewIcon as typeof Home01Icon) },
  { id: 'config', name: 'Configuration', icon: icon(Configuration01Icon) },
  { id: 'document', name: 'Document', icon: icon(Doc02Icon) },
  { id: 'exception', name: 'Exception', icon: icon(ExceptionIcon as typeof Home01Icon) },
  { id: 'operations', name: 'Operations', icon: icon(OperationsIcon as typeof Home01Icon) },
  { id: 'gateway', name: 'Gateway', icon: icon(GatewayIcon as typeof Home01Icon) },
  { id: 'cleaning', name: 'Cleaning', icon: icon(CleanIcon) },
  { id: 'manufacturing', name: 'Manufacturing', icon: icon(LabsIcon) },
  { id: 'verification', name: 'Verification', icon: icon(ProcessVerificationIcon as typeof Home01Icon) },
  { id: 'inventory', name: 'Inventory', icon: icon(Layers01Icon) },
  { id: 'execution', name: 'Execution', icon: icon(Settings05Icon) },
  { id: 'validation', name: 'Validation', icon: icon(ValidationApprovalIcon) },
  { id: 'reports', name: 'Reports', icon: icon(ChartLineData02Icon) },
  { id: 'schedule', name: 'Schedule Management', icon: icon(ScheduleFrameworkIcon as typeof Home01Icon) },
  { id: 'setup', name: 'System Setup', icon: icon(SlidersHorizontalIcon) },
  { id: 'transfer', name: 'Transfer', icon: icon(ArrowDataTransferHorizontalIcon as typeof Home01Icon) },
];
