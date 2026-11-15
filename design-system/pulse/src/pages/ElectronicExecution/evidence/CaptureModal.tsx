/**
 * NOT FROM FIGMA. The three sample capture modals of the media bar (reference .modal.lg, 720px, S\ref\overlays\spec.md
 * "cap-screenshot", "cap-snapshot", "cap-video"): Capture Screenshot (generated control-panel picture with crop, mask,
 * highlight and watermark), Take Snapshot (generated still) and Record Video Evidence (simulated recording).
 * SAMPLE DATA: nothing is read from the screen, camera or microphone. The result is a generated picture linked to the
 * selected step with addEvidence; a screenshot is exported to a PNG with the edits applied.
 */
import { useMemo, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CompactDialog } from '../../../components/feedback/CompactDialog/CompactDialog';
import { Box } from '../../../components/mui';
import { ArrowExpandIcon, ArrowShrinkIcon, Camera01Icon, Copy01Icon, CropIcon, Image01Icon, PaintBrush03Icon, RectangularIcon, RecordIcon, StopIcon, Tag01Icon, Video02Icon } from '../../../icons';
import { panelRole } from '../../../theme/typography';
import EvidenceThumb from '../dialogs/EvidenceThumb';
import type { EvidenceKind } from '../model';
import { ref } from '../refTheme';
import { executionActions, useExecution } from '../store';
import { ui } from '../ui';
import { AnnotateStage, BASE_H, BASE_W, Picture } from './AnnotateStage';
import type { Anno, Rect, Source, Tool, Watermark, WmPos } from './AnnotateStage';
import { EvBtn, EvSelect, EvSq } from './EvControls';
import { useEvPopover } from './EvFilter';
import { setEvidenceImage } from './evidenceMeta';
import { ev, stamp } from './evRef';

export type CaptureKind = 'screenshot' | 'snapshot' | 'video';

const META: Record<CaptureKind, { title: string; sub: string; icon: React.ReactNode; ext: string; prefix: string; evKind: EvidenceKind; attach: string }> = {
  screenshot: { title: 'Capture Screenshot', sub: 'Sample capture: a generated picture, nothing is read from your screen', icon: <Image01Icon size={18} />, ext: 'png', prefix: 'Screenshot', evKind: 'screenshot', attach: 'Attach' },
  snapshot: { title: 'Take Snapshot', sub: 'Sample capture: a generated still, no camera is used', icon: <Camera01Icon size={18} />, ext: 'jpg', prefix: 'Snapshot', evKind: 'snapshot', attach: 'Attach' },
  video: { title: 'Record Video Evidence', sub: 'Sample capture: a simulated recording, no screen or microphone is used', icon: <Video02Icon size={18} />, ext: 'mp4', prefix: 'Capture', evKind: 'video', attach: 'Save & Attach' },
};

function tzName(d: Date): string {
  return new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).formatToParts(d).find((p) => p.type === 'timeZoneName')?.value ?? '';
}
const stampText = (d = new Date()) => `${stamp(d)} ${tzName(d)}`.trim();

const svgUrl = (markup: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
const thumbSvg = (kind: EvidenceKind, name: string) => svgUrl(renderToStaticMarkup(<EvidenceThumb item={{ kind, name, aiCaptured: false }} />).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace('width="100%" height="100%"', 'width="640" height="400"'));

/** Draw an SVG string to a PNG data URL. */
function toPng(svg: string, w: number, h: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const g = c.getContext('2d');
      if (!g) return reject(new Error('Canvas is not available'));
      g.drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Could not render the picture'));
    img.src = svgUrl(svg);
  });
}

const STAGE = { background: ev.mediaStage, borderRadius: '12px', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' } as const;

function Toolbtn({ on, icon, label, onClick }: { on: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      aria-pressed={on}
      onClick={onClick}
      sx={{
        display: 'flex', alignItems: 'center', gap: '5px', p: '5px 9px', m: 0, border: 0, borderRadius: '7px', cursor: 'pointer', fontFamily: ev.font, fontSize: 12, lineHeight: 'normal', fontWeight: panelRole.emphasis,
        background: on ? ref.navy2 : 'transparent', color: on ? ref.white : ref.ink, '&:hover': { background: on ? ref.navy2 : ref.white }, '&:focus-visible': { outline: `2px solid ${ref.blue4}`, outlineOffset: 1 },
      }}
    >
      {icon}
      {label}
    </Box>
  );
}

const field = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: 12, lineHeight: '17.4px', fontWeight: panelRole.emphasis, color: ref.ink } as const;

function WatermarkPopover({ wm, onChange }: { wm: Watermark; onChange: (w: Watermark) => void }) {
  const pop = useEvPopover();
  return (
    <Box ref={pop.ref} component="span" sx={{ position: 'relative', display: 'flex' }}>
      <Box
        component="button"
        type="button"
        aria-label="Watermark settings"
        aria-haspopup="dialog"
        aria-expanded={pop.open}
        onClick={() => pop.setOpen(!pop.open)}
        sx={{ display: 'flex', alignItems: 'center', p: '5px 8px', m: 0, border: 0, borderRadius: '7px', cursor: 'pointer', background: pop.open ? ref.white : 'transparent', color: ref.ink, '&:hover': { background: ref.white }, '&:focus-visible': { outline: `2px solid ${ref.blue4}`, outlineOffset: 1 } }}
      >
        <Tag01Icon size={14} />
      </Box>
      {pop.open && (
        <Box role="dialog" aria-label="Watermark" sx={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, zIndex: 5, width: 220, boxSizing: 'border-box', p: '11px 12px', display: 'flex', flexDirection: 'column', gap: '9px', background: ref.white, border: `1px solid ${ref.line}`, borderRadius: '10px', boxShadow: ev.popShadow }}>
          <Box sx={{ fontSize: 11, lineHeight: '15.95px', fontWeight: panelRole.heavy, color: ref.blue3 }}>Watermark</Box>
          <Box component="label" sx={field}>
            Show
            <input type="checkbox" checked={wm.on} onChange={(e) => onChange({ ...wm, on: e.target.checked })} style={{ accentColor: ref.blue3 }} />
          </Box>
          <Box component="label" sx={field}>
            Color
            <Box component="input" type="color" value={wm.color} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...wm, color: e.target.value })} sx={{ width: 30, height: 24, p: 0, border: `1px solid ${ref.line}`, borderRadius: '4px', background: ref.white, cursor: 'pointer' }} />
          </Box>
          <Box component="label" sx={field}>
            Position
            <EvSelect label="Position" width={138} value={wm.pos} onChange={(v) => onChange({ ...wm, pos: v as WmPos })} options={[{ value: 'br', label: 'Bottom right' }, { value: 'bl', label: 'Bottom left' }, { value: 'tr', label: 'Top right' }, { value: 'tl', label: 'Top left' }, { value: 'c', label: 'Centre' }]} sx={{ height: 27 }} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function CaptureModal({ kind }: { kind: CaptureKind }) {
  const m = META[kind];
  const s = useExecution();
  const step = s.selectedStepId ? s.protocol.steps[s.selectedStepId] : undefined;
  const blocked = !step ? 'Select a step first.' : step.evidence === null ? 'Evidence does not apply to this step.' : step.state === 'recorded' ? 'This step is recorded and locked.' : '';
  const [wide, setWide] = useState(false);
  const [busy, setBusy] = useState(false);
  const [count0] = useState(s.evidence.length);

  // screenshot
  const [source, setSource] = useState<Source | null>(null);
  const [tool, setTool] = useState<Tool>(null);
  const [annos, setAnnos] = useState<Anno[]>([]);
  const [crop, setCrop] = useState<Rect | null>(null);
  const [pending, setPending] = useState<Rect | null>(null);
  const [wm, setWm] = useState<Watermark>({ on: true, color: '#FFFFFF', pos: 'br', text: stampText() });
  // snapshot
  const [camera, setCamera] = useState('cam1');
  const [still, setStill] = useState(false);
  // video
  const [rec, setRec] = useState<'idle' | 'recording' | 'done'>('idle');
  const [secs, setSecs] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const name = useMemo(() => `${m.prefix}_${step?.id ?? 'step'}_${String(count0 + 1).padStart(3, '0')}.${m.ext}`, [m, step?.id]);
  const close = () => {
    window.clearInterval(timer.current);
    ui.close('capture');
  };
  const hasResult = kind === 'screenshot' ? !!source : kind === 'snapshot' ? still : rec === 'done';

  const capture = () => {
    setSource({ type: 'sample', seed: count0 + 1 + (annos.length ? 1 : 0) });
    setAnnos([]);
    setCrop(null);
    setPending(null);
    setTool(null);
    setWm((w) => ({ ...w, text: stampText() }));
  };
  const paste = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const it of items) {
        const type = it.types.find((t) => t.startsWith('image/'));
        if (!type) continue;
        const blob = await it.getType(type);
        const url = await new Promise<string>((res) => {
          const r = new FileReader();
          r.onload = () => res(String(r.result));
          r.readAsDataURL(blob);
        });
        setSource({ type: 'image', url });
        setAnnos([]);
        setCrop(null);
        setTool(null);
        setWm((w) => ({ ...w, text: stampText() }));
        return;
      }
      ui.toast('warn', 'There is no image on the clipboard.');
    } catch {
      ui.toast('warn', 'Paste is not available here. Use Capture for a sample picture.');
    }
  };
  const clear = () => {
    setSource(null);
    setAnnos([]);
    setCrop(null);
    setPending(null);
    setTool(null);
  };
  const applyCrop = () => {
    if (!pending) return;
    setCrop(pending);
    setPending(null);
    setTool(null);
  };

  const startRec = () => {
    setRec('recording');
    setSecs(0);
    timer.current = window.setInterval(() => setSecs((v) => v + 1), 1000);
  };
  const stopRec = () => {
    window.clearInterval(timer.current);
    setRec('done');
  };

  const attach = async () => {
    if (!step || blocked) return;
    setBusy(true);
    try {
      let dataUrl: string;
      let sizeKb: number;
      if (kind === 'screenshot') {
        const vb = crop ?? { x: 0, y: 0, w: BASE_W, h: BASE_H };
        const w = Math.round(vb.w * 2);
        const h = Math.round(vb.h * 2);
        const svg = renderToStaticMarkup(<Picture source={source as Source} annos={annos} crop={crop} wm={wm} exportSize={{ w, h }} />);
        dataUrl = await toPng(svg, w, h);
        sizeKb = Math.max(8, Math.round((dataUrl.length * 3) / 4 / 1024));
      } else {
        dataUrl = thumbSvg(m.evKind, name);
        sizeKb = kind === 'video' ? Math.max(120, secs * 380) : 140;
      }
      const r = executionActions.addEvidence(step.id, { kind: m.evKind, name, sizeKb });
      if (!r.ok || !r.id) {
        ui.toast('error', r.errors[0] ?? 'Could not add evidence.');
        return;
      }
      setEvidenceImage(r.id, dataUrl);
      ui.toast('success', `${name} added (sample capture)`);
      close();
    } catch {
      ui.toast('error', 'Could not create the picture.');
    } finally {
      setBusy(false);
    }
  };

  const maxBtn = (
    <EvSq bare size={26} aria-label={wide ? 'Restore size' : 'Maximise'} title={wide ? 'Restore size' : 'Maximise'} onClick={() => setWide(!wide)} sx={{ width: 23, borderRadius: '5px' }}>
      {wide ? <ArrowShrinkIcon size={14} /> : <ArrowExpandIcon size={14} />}
    </EvSq>
  );
  const ctx = step ? `linked to Table ${step.table} / Row ${step.row}` : 'no step selected';

  return (
    <CompactDialog
      open
      onClose={close}
      width={wide ? 1100 : 720}
      icon={m.icon}
      title={m.title}
      subtitle={`${m.sub} · ${ctx}`}
      dense
      headerActions={maxBtn}
      footerStart={blocked ? <Box role="alert" sx={{ fontSize: 11, lineHeight: '15.95px', color: ref.failFg }}>{blocked}</Box> : undefined}
      secondaryAction={{ label: 'Cancel', onClick: close }}
      primaryAction={{ label: busy ? 'Working...' : m.attach, onClick: attach, disabled: !hasResult || !!blocked || busy }}
    >
      {kind === 'screenshot' && (
        <>
          <Box
            data-spec="ss-preview"
            sx={{ boxSizing: 'border-box', p: '8px', border: `1px dashed ${ref.line}`, borderRadius: '10px', background: ev.captureStage, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', height: source ? 318 : 260 }}
          >
            {source ? (
              <AnnotateStage source={source} annos={annos} crop={crop} wm={wm} tool={tool} pending={pending} onAnno={(a) => setAnnos((v) => [...v, a])} onPending={setPending} />
            ) : (
              <Box data-spec="ss-ph" sx={{ textAlign: 'center', color: ev.phSub }}>
                <Image01Icon size={32} />
                <Box sx={{ m: '8px 0 0', fontSize: 12.5, lineHeight: '18.125px', color: ev.phTitle }}>No screenshot yet</Box>
                <Box sx={{ m: '3px 0 0', fontSize: 11, lineHeight: '15.95px' }}>
                  Click <b style={{ fontWeight: panelRole.strong }}>Capture</b> for a generated sample, or <b style={{ fontWeight: panelRole.strong }}>Paste image</b>
                </Box>
              </Box>
            )}
          </Box>
          <Box data-spec="ss-actions" sx={{ display: 'flex', alignItems: 'center', gap: '8px', m: '12px 0 0', flexWrap: 'wrap' }}>
            <EvBtn primary onClick={capture}>
              <Image01Icon size={12} />
              Capture
            </EvBtn>
            <EvBtn onClick={paste} aria-label="Paste image from the clipboard">
              <Copy01Icon size={12} />
              Paste image
            </EvBtn>
            {source && (
              <>
                <Box aria-hidden component="span" sx={{ width: '1px', height: 31, m: '0 2px', background: ref.line }} />
                <Box role="group" aria-label="Edit tools" data-spec="ss-toolgroup" sx={{ display: 'flex', alignItems: 'center', gap: '2px', p: '2px', boxSizing: 'border-box', border: `1px solid ${ref.line}`, borderRadius: '9px', background: ev.toolGroup, height: 31 }}>
                  <Toolbtn on={tool === 'crop'} icon={<CropIcon size={12} />} label="Crop" onClick={() => setTool(tool === 'crop' ? null : 'crop')} />
                  <Toolbtn on={tool === 'mask'} icon={<RectangularIcon size={12} />} label="Mask" onClick={() => setTool(tool === 'mask' ? null : 'mask')} />
                  <Toolbtn on={tool === 'highlight'} icon={<PaintBrush03Icon size={12} />} label="Highlight" onClick={() => setTool(tool === 'highlight' ? null : 'highlight')} />
                  <WatermarkPopover wm={wm} onChange={setWm} />
                </Box>
                <EvBtn onClick={clear}>Clear</EvBtn>
              </>
            )}
          </Box>
          {source && tool === 'crop' && (
            <Box data-spec="ss-toolsettings" sx={{ display: 'flex', alignItems: 'center', gap: '12px', m: '9px 0 0', p: '9px 12px', boxSizing: 'border-box', border: `1px solid ${ref.line}`, borderRadius: '9px', background: ev.toolSettings }}>
              <Box component="span" sx={{ p: '0 2px 0 0', fontSize: 12, lineHeight: '17.4px', fontWeight: panelRole.heavy, color: ref.navy2, letterSpacing: '0.24px' }}>Crop</Box>
              <EvBtn primary sm disabled={!pending} onClick={applyCrop}>Apply crop</EvBtn>
              <EvBtn sm onClick={() => { setPending(null); setTool(null); }}>Done</EvBtn>
            </Box>
          )}
          {source && !tool && (annos.length > 0 || crop) && (
            <Box role="status" sx={{ m: '8px 0 0', fontSize: 11, lineHeight: '15.95px', color: ref.muted }}>
              {crop ? 'Cropped. ' : ''}
              {annos.length ? `${annos.length} mask / highlight area${annos.length === 1 ? '' : 's'}.` : ''} Edits are applied to the picture when you attach it.
            </Box>
          )}
        </>
      )}

      {kind === 'snapshot' && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', m: '0 0 10px' }}>
            <Box component="label" htmlFor="ee-snap-cam" sx={{ fontSize: 12, lineHeight: '17.4px', fontWeight: panelRole.strong }}>Video Source</Box>
            <Box sx={{ '& select': { height: 29, width: 360, borderColor: '#C8D0E2', p: '5px 8px' } }}>
              <EvSelect label="Video Source" value={camera} onChange={setCamera} options={[{ value: 'cam1', label: 'Sample camera 1 (generated)' }, { value: 'cam2', label: 'Sample camera 2 (generated)' }]} />
            </Box>
          </Box>
          <Box data-spec="snap-stage" sx={STAGE}>
            {still ? (
              <EvidenceThumb item={{ kind: 'snapshot', name: `${name}-${camera}`, aiCaptured: false }} label="Captured sample still" />
            ) : (
              <Box sx={{ p: '0 20px', textAlign: 'center', color: ref.white, fontSize: 14, lineHeight: '20.3px', fontWeight: panelRole.regular }}>
                <b style={{ fontWeight: panelRole.strong }}>Sample camera.</b> No camera is used: Capture takes a generated picture.
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '8px', m: '12px 0 0' }}>
            <EvBtn primary onClick={() => setStill(true)}>
              <Camera01Icon size={12} />
              {still ? 'Capture again' : 'Capture'}
            </EvBtn>
          </Box>
        </>
      )}

      {kind === 'video' && (
        <>
          <Box data-spec="vid-stage" sx={STAGE}>
            {rec === 'idle' && (
              <Box sx={{ p: '0 20px', textAlign: 'center', color: ref.white, fontSize: 14, lineHeight: '20.3px', fontWeight: panelRole.regular }}>
                <b style={{ fontWeight: panelRole.strong }}>Start Recording</b>: this is a simulated recording. No screen, window or microphone is captured; a generated sample video is attached.
              </Box>
            )}
            {rec === 'recording' && (
              <Box role="timer" aria-live="off" sx={{ display: 'flex', alignItems: 'center', gap: '10px', color: ref.white, fontSize: 14, lineHeight: '20.3px' }}>
                <Box aria-hidden sx={{ width: 10, height: 10, borderRadius: '50%', background: ref.live, '@keyframes eeRec': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.35 } }, animation: 'eeRec 1.2s infinite', '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }} />
                Recording (sample) {String(Math.floor(secs / 60)).padStart(2, '0')}:{String(secs % 60).padStart(2, '0')}
              </Box>
            )}
            {rec === 'done' && <EvidenceThumb item={{ kind: 'video', name, aiCaptured: false }} label="Sample recording" />}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '8px', m: '12px 0 0' }}>
            {rec === 'idle' && (
              <EvBtn primary onClick={startRec}>
                <RecordIcon size={12} />
                Start Recording
              </EvBtn>
            )}
            {rec === 'recording' && (
              <EvBtn primary onClick={stopRec}>
                <StopIcon size={12} />
                Stop Recording
              </EvBtn>
            )}
            {rec === 'done' && <EvBtn onClick={() => { setRec('idle'); setSecs(0); }}>Record again ({Math.max(1, secs)} s)</EvBtn>}
          </Box>
        </>
      )}
    </CompactDialog>
  );
}
