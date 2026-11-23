import { useEffect, useRef } from 'react';
import { IconStyleProvider } from '../../icons';
import { Box } from '../../components/mui';
import { LeftNav } from '../../components/navigation/LeftNav/LeftNav';
import { AppShell } from '../../templates';
import DocumentView from './DocumentView';
import ExecutionHeader from './ExecutionHeader';
import ExecutionPanel, { recordFlow } from './ExecutionPanel';
import { EvidencePaneSlot } from './evidence/EvidencePane';
import MediaBar from './MediaBar';
import Overlays from './Overlays';
import { docRef, fonts, ref, size } from './refTheme';
import { EXECUTION_MENUS } from './shell/navMenus';
import { executionStore, useExecution } from './store';
import { isQuietSelect, ui, useUi } from './ui';

/**
 * "Electronic Execution" page. NOT FROM FIGMA (composed from design-system components, sized from the real Pulse application screenshot).
 * AppShell with the LeftNav (72px rail) and the page column: Header (52px) and breadcrumb row (44px), the status bar (48px), then the
 * work area: the execution panel (a 48px collapsed strip by default, 420px when expanded), the document column (toolbar 48px, document
 * card) and the Evidence & Activity pane (about 712px, open by default).
 * The page itself never scrolls on a desktop; the panel body and the document scroll inside their own areas. The panel can be
 * docked left (default), right, top or bottom, collapsed or shown full screen. In the Inline layout the panel is hidden and
 * steps are edited in the document cells. Domain rules live in store.ts, UI state in ui.ts; overlays are mounted by Overlays.
 */
export default function ElectronicExecutionPage() {
  const s = useExecution();
  const u = useUi();

  // Opening state: panel collapsed to its strip on the left, evidence pane open, a viewer joins (toast).
  useEffect(() => {
    ui.set({ dock: 'left', panelCollapsed: true, panelFullscreen: false });
    if (!ui.isOpen('evidence')) ui.open('evidence');
    const st = executionStore.getState();
    if (st.viewers.some((v) => v.userId !== st.currentUserId)) ui.toast('success', 'A viewer is now viewing this execution'); // never a name
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Picking another step (a document row or cell) expands the collapsed panel so the flow keeps working. Stepping through
  // tables and rows with the toolbar steppers does not: those select quietly (see quietSelect in ui.ts).
  const prevStep = useRef(s.selectedStepId);
  useEffect(() => {
    if (s.selectedStepId && s.selectedStepId !== prevStep.current && !isQuietSelect() && ui.getState().panelCollapsed && ui.getState().layout === 'panel') ui.set({ panelCollapsed: false });
    prevStep.current = s.selectedStepId;
  }, [s.selectedStepId]);

  const horizontal = u.dock === 'left' || u.dock === 'right';
  const panelFirst = u.dock === 'left' || u.dock === 'top';
  const showPanel = u.layout === 'panel';
  const collapsed = showPanel && u.panelCollapsed;
  const fullscreen = showPanel && u.panelFullscreen && !collapsed;

  const panelTrack = collapsed ? (horizontal ? `${size.strip}px` : 'auto') : `${horizontal ? size.panel : size.panelH}px`;
  const tracks = !showPanel || fullscreen ? '1fr' : panelFirst ? `${panelTrack} 1fr` : `1fr ${panelTrack}`;
  const fr = (t: string) => (t === '1fr' ? 'minmax(0, 1fr)' : t);

  const record = (id: string) => {
    const errs = recordFlow(id);
    if (errs.length) ui.toast('error', errs.join(' '));
  };

  return (
    <IconStyleProvider value="sharp">
    <AppShell
      sx={{
        height: { xs: 'auto', md: '100vh' },
        minHeight: '100vh',
        minWidth: 0,
        overflowX: 'hidden',
        overflowY: { xs: 'auto', md: 'hidden' },
        background: ref.bg,
        fontFamily: fonts.shell,
        fontSize: 14,
        lineHeight: 1.45,
        color: ref.ink,
        '& > div:last-of-type': { minHeight: 0 },
      }}
      nav={
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexShrink: 0 }}>
          <LeftNav appearance="app" menus={EXECUTION_MENUS} selectedMenu="execution" onMenuClick={(m) => m.id !== 'execution' && ui.toast('warn', `${m.name} is not part of this sample.`)} />
        </Box>
      }
      header={<ExecutionHeader />}
    >
      <MediaBar onRecord={record} />
      <Box
        className="work"
        sx={{
          flex: { md: '1 1 0' },
          display: 'grid',
          minHeight: 0,
          minWidth: 0,
          position: 'relative',
          background: docRef.canvas,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: horizontal ? tracks.split(' ').map(fr).join(' ') : 'minmax(0, 1fr)' },
          gridTemplateRows: { xs: 'auto', md: horizontal ? 'minmax(0, 1fr)' : tracks.split(' ').map(fr).join(' ') },
        }}
      >
        {showPanel && (
          <Box
            sx={{
              order: panelFirst ? 0 : 1,
              minWidth: 0,
              minHeight: 0,
              // the collapsed strip's round chevron overhangs the strip edge
              overflow: collapsed ? 'visible' : 'hidden',
              zIndex: collapsed ? 3 : 'auto',
              height: { xs: collapsed ? 'auto' : '60vh', md: 'auto' },
              display: 'flex',
              '& > aside': { width: '100%', height: '100%', borderRadius: 0 },
            }}
          >
            <ExecutionPanel />
          </Box>
        )}
        {!fullscreen && (
          <Box sx={{ order: panelFirst ? 1 : 0, minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
            <DocumentView side={<EvidencePaneSlot />} />
          </Box>
        )}
      </Box>
      <Overlays />
    </AppShell>
    </IconStyleProvider>
  );
}
