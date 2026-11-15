/**
 * NOT FROM FIGMA. Square-cornered stand-ins for Pulse icons, used only where an `IconStyleProvider value="sharp"` is above the icon
 * (the Electronic Execution page) or the icon has `type="sharp"`. Key = Pulse icon name, value = the closest Material *Sharp /
 * *Outlined glyph. Icons not listed keep their Pulse drawing (with butt caps and mitre joins). Logged in docs/figma-deviations.md.
 */
import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import AddSharp from '@mui/icons-material/AddSharp';
import AltRouteSharp from '@mui/icons-material/AltRouteSharp';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import AssignmentTurnedInOutlined from '@mui/icons-material/AssignmentTurnedInOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import BarChartSharp from '@mui/icons-material/BarChartSharp';
import BuildOutlined from '@mui/icons-material/BuildOutlined';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import CallSplitSharp from '@mui/icons-material/CallSplitSharp';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import ChatBubbleOutlineSharp from '@mui/icons-material/ChatBubbleOutlineSharp';
import CheckBoxOutlined from '@mui/icons-material/CheckBoxOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import CleaningServicesOutlined from '@mui/icons-material/CleaningServicesOutlined';
import CloseFullscreenSharp from '@mui/icons-material/CloseFullscreenSharp';
import CloseSharp from '@mui/icons-material/CloseSharp';
import ContentCopySharp from '@mui/icons-material/ContentCopySharp';
import DesktopWindowsOutlined from '@mui/icons-material/DesktopWindowsOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import DragIndicatorSharp from '@mui/icons-material/DragIndicatorSharp';
import EditOutlined from '@mui/icons-material/EditOutlined';
import EventNoteOutlined from '@mui/icons-material/EventNoteOutlined';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import FolderOutlined from '@mui/icons-material/FolderOutlined';
import FormatListBulletedSharp from '@mui/icons-material/FormatListBulletedSharp';
import GridViewOutlined from '@mui/icons-material/GridViewOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import InsightsOutlined from '@mui/icons-material/InsightsOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import KeyboardArrowDownSharp from '@mui/icons-material/KeyboardArrowDownSharp';
import KeyboardArrowLeftSharp from '@mui/icons-material/KeyboardArrowLeftSharp';
import KeyboardArrowRightSharp from '@mui/icons-material/KeyboardArrowRightSharp';
import KeyboardArrowUpSharp from '@mui/icons-material/KeyboardArrowUpSharp';
import KeyboardDoubleArrowLeftSharp from '@mui/icons-material/KeyboardDoubleArrowLeftSharp';
import KeyboardDoubleArrowRightSharp from '@mui/icons-material/KeyboardDoubleArrowRightSharp';
import ListAltOutlined from '@mui/icons-material/ListAltOutlined';
import ManageAccountsOutlined from '@mui/icons-material/ManageAccountsOutlined';
import MenuSharp from '@mui/icons-material/MenuSharp';
import OpenInFullSharp from '@mui/icons-material/OpenInFullSharp';
import OpenInNewSharp from '@mui/icons-material/OpenInNewSharp';
import PhotoCameraOutlined from '@mui/icons-material/PhotoCameraOutlined';
import PrecisionManufacturingOutlined from '@mui/icons-material/PrecisionManufacturingOutlined';
import PublicOutlined from '@mui/icons-material/PublicOutlined';
import RemoveSharp from '@mui/icons-material/RemoveSharp';
import SettingsApplicationsOutlined from '@mui/icons-material/SettingsApplicationsOutlined';
import SwapHorizSharp from '@mui/icons-material/SwapHorizSharp';
import TuneSharp from '@mui/icons-material/TuneSharp';
import UploadSharp from '@mui/icons-material/UploadSharp';
import VerifiedOutlined from '@mui/icons-material/VerifiedOutlined';
import VerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined';
import VideocamOutlined from '@mui/icons-material/VideocamOutlined';
import ViewSidebarOutlined from '@mui/icons-material/ViewSidebarOutlined';
import ViewAgendaOutlined from '@mui/icons-material/ViewAgendaOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import LinkSharp from '@mui/icons-material/LinkSharp';
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined';

export const sharpIcons: Record<string, ComponentType<SvgIconProps>> = {
  // left navigation
  Home01Icon: HomeOutlined,
  UserSettings02Icon: ManageAccountsOutlined,
  QualityReviewIcon: FactCheckOutlined,
  Configuration01Icon: BuildOutlined,
  Doc02Icon: DescriptionOutlined,
  ExceptionIcon: AltRouteSharp,
  OperationsIcon: ListAltOutlined,
  GatewayIcon: DesktopWindowsOutlined,
  CleanIcon: CleaningServicesOutlined,
  LabsIcon: PrecisionManufacturingOutlined,
  ProcessVerificationIcon: VerifiedOutlined,
  Layers01Icon: Inventory2Outlined,
  Settings05Icon: SettingsApplicationsOutlined,
  ValidationApprovalIcon: AssignmentTurnedInOutlined,
  ChartLineData02Icon: InsightsOutlined,
  ScheduleFrameworkIcon: EventNoteOutlined,
  SlidersHorizontalIcon: TuneSharp,
  ArrowDataTransferHorizontalIcon: SwapHorizSharp,
  // bars, toolbar, evidence pane
  Globe02Icon: PublicOutlined,
  ArrowDown01Icon: KeyboardArrowDownSharp,
  ArrowUp01Icon: KeyboardArrowUpSharp,
  ArrowLeft01Icon: KeyboardArrowLeftSharp,
  ArrowRight01Icon: KeyboardArrowRightSharp,
  ArrowLeftDoubleIcon: KeyboardDoubleArrowLeftSharp,
  ArrowRightDoubleIcon: KeyboardDoubleArrowRightSharp,
  Cancel01Icon: CloseSharp,
  PlusSignIcon: AddSharp,
  MinusSignIcon: RemoveSharp,
  Menu01Icon: MenuSharp,
  Menu06Icon: MenuSharp,
  LayoutLeftIcon: ViewSidebarOutlined,
  SquareArrowUpRightIcon: OpenInNewSharp,
  AiMagicIcon: AutoAwesomeOutlined,
  DashboardSquare02Icon: GridViewOutlined,
  ListViewIcon: FormatListBulletedSharp,
  FilterIcon: FilterAltOutlined,
  ArrowExpandIcon: OpenInFullSharp,
  ArrowShrinkIcon: CloseFullscreenSharp,
  DragDropVerticalIcon: DragIndicatorSharp,
  Attachment01Icon: LinkSharp,
  Camera01Icon: PhotoCameraOutlined,
  Image01Icon: ImageOutlined,
  Video02Icon: VideocamOutlined,
  Chat01Icon: ChatBubbleOutlineSharp,
  Copy01Icon: ContentCopySharp,
  PencilEdit01Icon: EditOutlined,
  Edit02Icon: EditOutlined,
  Upload03Icon: UploadSharp,
  Upload04Icon: UploadSharp,
  Folder01Icon: FolderOutlined,
  Calendar01Icon: CalendarTodayOutlined,
  // actions flyout and panels
  InformationCircleIcon: InfoOutlined,
  ChartColumnIcon: BarChartSharp,
  Notebook01Icon: ArticleOutlined,
  ViewIcon: VisibilityOutlined,
  CheckmarkSquare01Icon: CheckBoxOutlined,
  CheckmarkCircle01Icon: CheckCircleOutlined,
  Task01Icon: AssignmentOutlined,
  Layout01Icon: ViewAgendaOutlined,
  Alert02Icon: WarningAmberOutlined,
  SplitIcon: CallSplitSharp,
  ShieldUserIcon: VerifiedUserOutlined,
  CancelCircleIcon: CancelOutlined,
  Route01Icon: AltRouteSharp,
};
