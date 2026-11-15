import { useState } from 'react';
import type { ReactNode } from 'react';
import { Box } from '../../components/mui';
import { Flyout } from '../../components/feedback/Flyout/Flyout';
import { ActionList } from '../../components/navigation/ActionList/ActionList';
import type { ActionListGroup } from '../../components/navigation/ActionList/ActionList';
import { Breadcrumbs } from '../../components/navigation/Breadcrumbs/Breadcrumbs';
import { ChromeButton, ChromeIconButton } from '../../components/navigation/ExecutionChrome/ExecutionChrome';
import { Header } from '../../components/navigation/Header/Header';
import {
  AiMagicIcon, Alert02Icon, ArrowDataTransferHorizontalIcon, Attachment01Icon, CancelCircleIcon, ChartColumnIcon, CheckmarkCircle01Icon, CheckmarkSquare01Icon, Copy01Icon, Edit02Icon,
  InformationCircleIcon, Layout01Icon, Notebook01Icon, Route01Icon, ShieldUserIcon, SplitIcon, Task01Icon, ViewIcon,
} from '../../icons';
import { fw } from '../../theme/typography';
import { docRef } from './refTheme';
import { executionActions, useExecution } from './store';
import { ui } from './ui';
import type { OverlayName } from './ui';

/**
 * Actions flyout: the reference's three groups (View, Execute, Route & Transfer) with its 16 items, plus three page extras (Execution
 * Status, AI Agent, Copy Result). `needsStep` opens the surface for the selected step; `off` items are not in this sample and stay disabled.
 */
interface ActionItem {
  label: string;
  icon: ReactNode;
  overlay?: OverlayName;
  payload?: Record<string, unknown>;
  off?: boolean;
  needsStep?: boolean;
}
const I = { size: 20 } as const;
const ACTION_GROUPS: { label: string; items: ActionItem[] }[] = [
  {
    label: 'View',
    items: [
      { label: 'Details', icon: <InformationCircleIcon {...I} />, overlay: 'details' },
      { label: 'Metrics', icon: <ChartColumnIcon {...I} />, overlay: 'metrics' },
      { label: 'Annotation Report', icon: <Notebook01Icon {...I} />, overlay: 'annotations' },
      { label: 'View Discrepancy', icon: <ViewIcon {...I} />, overlay: 'discrepancies' },
      { label: 'Verify Mapping', icon: <CheckmarkSquare01Icon {...I} />, off: true },
      { label: 'Execution Status', icon: <Task01Icon {...I} />, overlay: 'status' },
    ],
  },
  {
    label: 'Execute',
    items: [
      { label: 'Form', icon: <Layout01Icon {...I} />, off: true },
      { label: 'Edit Document', icon: <Edit02Icon {...I} />, overlay: 'editDocument' },
      { label: 'Create Discrepancy', icon: <Alert02Icon {...I} />, overlay: 'discrepancies', payload: { create: true } },
      { label: 'Split Execution', icon: <SplitIcon {...I} />, overlay: 'split' },
      { label: 'Verification', icon: <ShieldUserIcon {...I} />, overlay: 'verifyAssign' },
      { label: 'Mark as N/A', icon: <CancelCircleIcon {...I} />, overlay: 'markNA', needsStep: true },
      { label: 'Add Attachments', icon: <Attachment01Icon {...I} />, overlay: 'evidence', needsStep: true },
      { label: 'AI Agent', icon: <AiMagicIcon {...I} />, overlay: 'aiAgent' },
    ],
  },
  {
    label: 'Route & Transfer',
    items: [
      { label: 'Route to Peer Review', icon: <Route01Icon {...I} />, overlay: 'route', payload: { to: 'peer' } },
      { label: 'Route to Review', icon: <CheckmarkCircle01Icon {...I} />, overlay: 'route', payload: { to: 'review' } },
      { label: 'Route to Approval', icon: <CheckmarkCircle01Icon {...I} />, overlay: 'route', payload: { to: 'approval' } },
      { label: 'Task Transfer', icon: <ArrowDataTransferHorizontalIcon {...I} />, overlay: 'taskTransfer' },
      { label: 'Copy Result', icon: <Copy01Icon {...I} />, overlay: 'copyResult' },
    ],
  },
];
const ACTIONS: ActionItem[] = ACTION_GROUPS.flatMap((g) => g.items);
const LIST_GROUPS: ActionListGroup[] = ACTION_GROUPS.map((g) => ({
  label: g.label,
  items: g.items.map((a) => ({ value: a.label, label: a.label, icon: a.icon, disabled: a.off, reason: a.off ? 'Not in this sample' : undefined })),
}));

const VIEW_AS = 'View as ';
const SPECTATOR = 'Spectator mode';
const EXECUTOR = 'Executor mode';

/** Local time of the sample site, taken once (the screen shows a time next to the site name). */
const siteTime = (): string => `${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} local`;

/**
 * Page header: the Pulse Header (52px: app title, site selector, user block) and the breadcrumb row (44px): home > Execution > id at
 * the left; at the right the AI agent icon button and the Actions button, which opens the Actions flyout.
 * The working-as user and Spectator / Executor mode are reachable only through the profile (user) menu of the Header.
 */
export default function ExecutionHeader() {
  const s = useExecution();
  const [actionsOpen, setActionsOpen] = useState(false);
  const [time] = useState(siteTime);
  const p = s.protocol;
  const me = s.users.find((u) => u.id === s.currentUserId);
  const spectator = s.mode === 'spectator';
  const userLabel = (u: { name: string; role: string }) => `${u.name}${u.name === u.role ? '' : ` (${u.role})`}`;

  const choose = (label: string) => {
    const a = ACTIONS.find((x) => x.label === label);
    if (!a?.overlay) return;
    setActionsOpen(false);
    if (a.needsStep && !s.selectedStepId) return ui.toast('warn', 'Select a step first.');
    ui.open(a.overlay, a.needsStep ? (a.overlay === 'markNA' ? { stepIds: [s.selectedStepId] } : { stepId: s.selectedStepId }) : a.payload);
  };

  return (
    <>
      <Header
        appearance="app"
        showRegion
        showProfile
        showAvatar
        customElement={
          <Box component="span" sx={{ fontSize: 22.5, lineHeight: '32px', fontWeight: fw.semiBold, color: docRef.brandTitle, whiteSpace: 'nowrap' }}>
            Pulse
          </Box>
        }
        region={{ value: p.site, time, options: [{ value: p.site }] }}
        profile={{
          name: me?.name ?? '',
          job: me && me.name === me.role ? 'System Admin' : me?.role,
          online: true,
          options: [...s.users.map((u) => ({ value: `${VIEW_AS}${userLabel(u)}` })), { value: spectator ? EXECUTOR : SPECTATOR }],
          handleSelect: (v) => {
            if (v === SPECTATOR || v === EXECUTOR) {
              executionActions.setMode(v === SPECTATOR ? 'spectator' : 'executor');
              return;
            }
            const u = s.users.find((x) => `${VIEW_AS}${userLabel(x)}` === v);
            if (!u) return;
            const r = executionActions.setCurrentUser(u.id);
            if (r.ok) ui.toast('success', `Now working as ${u.name}`);
          },
        }}
      />
      <Box
        data-spec="breadcrumb-row"
        sx={{ display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box', height: { md: 44 }, minHeight: 44, flexWrap: { xs: 'wrap', md: 'nowrap' }, py: { xs: '6px', md: 0 }, px: '16px', background: '#fff', boxShadow: 'inset 0 -1px 0 0 #e2e8f0', flexShrink: 0 }}
      >
        <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
          <Breadcrumbs appearance="app" nodes={[{ node: 'Execution', link: '/execution' }, { node: p.id, link: '' }]} />
        </Box>
        <ChromeIconButton ariaLabel="AI Agent" title="AI Agent" onClick={() => ui.open('aiAgent')}>
          <AiMagicIcon size={16} color={docRef.aiPurple} />
        </ChromeIconButton>
        <ChromeButton ariaHasPopup="dialog" ariaExpanded={actionsOpen} onClick={() => setActionsOpen(true)}>
          Actions
        </ChromeButton>
      </Box>
      <Flyout open={actionsOpen} onClose={() => setActionsOpen(false)} width={400} headerProps={{ title: 'Actions' }}>
        <ActionList ariaLabel="Actions" groups={LIST_GROUPS} onSelect={(it) => choose(it.value)} autoFocus />
      </Flyout>
    </>
  );
}
