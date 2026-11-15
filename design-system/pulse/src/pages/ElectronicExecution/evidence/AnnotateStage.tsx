/**
 * NOT FROM FIGMA. The picture stage of the sample screenshot tool (reference #ssStage, 480x300): a generated control-panel
 * picture (or a pasted image) with crop, mask and highlight tools and a text watermark. Everything is drawn as SVG in the
 * picture's own 480x300 coordinates, so the same markup is shown on screen and exported to a PNG when the item is attached.
 * Sample data: the control panel is generated, nothing is read from a screen.
 */
import { useRef, useState } from 'react';
import { Box } from '../../../components/mui';
import { fw } from '../../../theme/typography';
import { ref } from '../refTheme';
import { ev } from './evRef';

export const BASE_W = 480;
export const BASE_H = 300;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface Anno extends Rect {
  kind: 'mask' | 'highlight';
}
export type WmPos = 'br' | 'bl' | 'tr' | 'tl' | 'c';
export interface Watermark {
  on: boolean;
  color: string;
  pos: WmPos;
  text: string;
}
export type Source = { type: 'sample'; seed: number } | { type: 'image'; url: string };
export type Tool = 'crop' | 'mask' | 'highlight' | null;

const FULL: Rect = { x: 0, y: 0, w: BASE_W, h: BASE_H };
const norm = (a: { x: number; y: number }, b: { x: number; y: number }): Rect => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) });

/** Generated sample control panel (dark HMI look). The speed reading varies a little with the seed. */
function SamplePicture({ seed }: { seed: number }) {
  const rpm = (5 + ((seed * 7) % 9) / 100).toFixed(2);
  const mono = 'ui-monospace, Menlo, Consolas, monospace';
  return (
    <g fontFamily="Arial, Helvetica, sans-serif">
      <rect width={BASE_W} height={BASE_H} fill="#0B1322" />
      <rect x="0" y="12" width="480" height="30" fill="#14315C" />
      <text x="14" y="32" fontSize="13" fontWeight={fw.bold} fill="#9CC2FF">EQ-001 · Control panel (sample)</text>
      <rect x="24" y="58" width="206" height="196" rx="10" fill="#0E1A30" stroke="#24467F" strokeWidth="1.5" />
      <text x="127" y="82" fontSize="10" fill="#6F9AD8" textAnchor="middle">MEASURED SPEED</text>
      <text x="127" y="150" fontSize="48" fontWeight={fw.bold} fill="#2BD08E" textAnchor="middle" fontFamily={mono}>{rpm}</text>
      <text x="127" y="176" fontSize="13" fill="#9CC2FF" textAnchor="middle">RPM</text>
      <circle cx="96" cy="218" r="6" fill="#2BD08E" />
      <text x="108" y="222" fontSize="11" fill="#2BD08E">RUNNING</text>
      <rect x="250" y="58" width="206" height="90" rx="10" fill="#0E1A30" stroke="#24467F" strokeWidth="1.5" />
      <text x="262" y="78" fontSize="9" fill="#6F9AD8">SETPOINT</text>
      <text x="262" y="108" fontSize="22" fill="#E6EEFF" fontFamily={mono}>5.00 RPM</text>
      <text x="262" y="132" fontSize="9" fill="#6F9AD8">Acceptance ±5%</text>
      <rect x="250" y="164" width="206" height="90" rx="10" fill="#0E1A30" stroke="#24467F" strokeWidth="1.5" />
      <text x="262" y="184" fontSize="9" fill="#6F9AD8">RESULT</text>
      <text x="262" y="214" fontSize="17" fontWeight={fw.bold} fill="#2BD08E">WITHIN RANGE</text>
      <text x="262" y="238" fontSize="9" fill="#6F9AD8">Stabilised · 2 min</text>
    </g>
  );
}

function wmBox(w: Watermark, vb: Rect, k: number): { x: number; y: number; width: number; height: number; fs: number } {
  const fs = 13 * k;
  const width = (w.text.length * 7.2 + 12) * k;
  const height = 18.9 * k;
  const m = 8 * k;
  const left = w.pos === 'bl' || w.pos === 'tl';
  const top = w.pos === 'tl' || w.pos === 'tr';
  if (w.pos === 'c') return { x: vb.x + (vb.w - width) / 2, y: vb.y + (vb.h - height) / 2, width, height, fs };
  return { x: left ? vb.x + m : vb.x + vb.w - width - m, y: top ? vb.y + m : vb.y + vb.h - height - m, width, height, fs };
}

export interface PictureProps {
  source: Source;
  annos: Anno[];
  crop: Rect | null;
  wm: Watermark;
  /** Display box (px). The svg keeps the crop's aspect ratio inside it. */
  box?: { w: number; h: number };
  /** Export size (px); when set the svg carries explicit width and height and no on-screen box. */
  exportSize?: { w: number; h: number };
}

/** The picture itself: scene + annotations + watermark. Used for the stage and (through renderToStaticMarkup) the export. */
export function Picture({ source, annos, crop, wm, box = { w: BASE_W, h: BASE_H }, exportSize, svgRef }: PictureProps & { svgRef?: React.Ref<SVGSVGElement> }) {
  const vb = crop ?? FULL;
  const k = vb.w / BASE_W;
  const dispW = exportSize ? exportSize.w : Math.min(box.w, (box.h * vb.w) / vb.h);
  const dispH = exportSize ? exportSize.h : (dispW * vb.h) / vb.w;
  const b = wmBox(wm, vb, k);
  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" width={dispW} height={dispH} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} role="img" aria-label="Captured screenshot (sample picture)" style={{ display: 'block', borderRadius: exportSize ? 0 : 6 }}>
      <rect x="0" y="0" width={BASE_W} height={BASE_H} fill="#0B1322" />
      {source.type === 'sample' ? <SamplePicture seed={source.seed} /> : <image href={source.url} x="0" y="0" width={BASE_W} height={BASE_H} preserveAspectRatio="xMidYMid meet" />}
      {annos.map((a, i) => (a.kind === 'mask' ? <rect key={i} x={a.x} y={a.y} width={a.w} height={a.h} fill="#000" /> : <rect key={i} x={a.x} y={a.y} width={a.w} height={a.h} fill="#FFE14D" fillOpacity="0.4" stroke="#F5B800" strokeWidth={1.5 * k} />))}
      {wm.on && (
        <g fontFamily="Arial, Helvetica, sans-serif">
          <rect x={b.x} y={b.y} width={b.width} height={b.height} rx={4 * k} fill="#000" fillOpacity="0.34" />
          <text x={b.x + 6 * k} y={b.y + b.height - 5 * k} fontSize={b.fs} fontWeight={fw.semiBold} fill={wm.color}>
            {wm.text}
          </text>
        </g>
      )}
    </svg>
  );
}

/** Interactive stage: the picture plus a pointer layer for the active tool. */
export function AnnotateStage({ source, annos, crop, wm, tool, pending, onAnno, onPending }: { source: Source; annos: Anno[]; crop: Rect | null; wm: Watermark; tool: Tool; pending: Rect | null; onAnno: (a: Anno) => void; onPending: (r: Rect | null) => void }) {
  const layer = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ a: { x: number; y: number }; b: { x: number; y: number } } | null>(null);
  // While the crop tool is active the whole picture is shown so a new area can be chosen.
  const shownCrop = tool === 'crop' ? null : crop;
  const vb = shownCrop ?? FULL;
  const dispW = Math.min(BASE_W, (BASE_H * vb.w) / vb.h);
  const dispH = (dispW * vb.h) / vb.w;

  const point = (e: React.PointerEvent): { x: number; y: number } => {
    const r = layer.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    const cl = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    return { x: vb.x + cl((e.clientX - r.left) / r.width, 0, 1) * vb.w, y: vb.y + cl((e.clientY - r.top) / r.height, 0, 1) * vb.h };
  };
  const down = (e: React.PointerEvent) => {
    if (!tool) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = point(e);
    setDrag({ a: p, b: p });
    if (tool === 'crop') onPending(null);
  };
  const move = (e: React.PointerEvent) => {
    if (!drag) return;
    const b = point(e);
    setDrag({ ...drag, b });
    if (tool === 'crop') onPending(norm(drag.a, b));
  };
  const up = () => {
    if (!drag || !tool) return;
    const r = norm(drag.a, drag.b);
    setDrag(null);
    if (r.w < 6 || r.h < 6) {
      if (tool === 'crop') onPending(null);
      return;
    }
    if (tool === 'crop') onPending(r);
    else onAnno({ kind: tool, ...r });
  };

  const live = drag && tool && tool !== 'crop' ? norm(drag.a, drag.b) : null;
  const dim = pending && tool === 'crop' ? pending : null;
  return (
    <Box data-spec="ss-stage" sx={{ position: 'relative', width: dispW, height: dispH, flexShrink: 0 }}>
      <Picture source={source} annos={annos} crop={shownCrop} wm={wm} box={{ w: BASE_W, h: BASE_H }} />
      <Box
        ref={layer}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => setDrag(null)}
        sx={{ position: 'absolute', inset: 0, borderRadius: '6px', overflow: 'hidden', cursor: tool ? 'crosshair' : 'default', touchAction: 'none', background: tool === 'crop' ? 'rgba(10,20,40,.35)' : 'transparent' }}
      >
        <svg width={dispW} height={dispH} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{ display: 'block', pointerEvents: 'none' }} aria-hidden="true">
          {dim && <rect x={dim.x} y={dim.y} width={dim.w} height={dim.h} fill="#fff" fillOpacity="0.15" stroke={ref.white} strokeWidth={vb.w / BASE_W * 1.5} strokeDasharray={`${4 * (vb.w / BASE_W)} ${3 * (vb.w / BASE_W)}`} />}
          {live && <rect x={live.x} y={live.y} width={live.w} height={live.h} fill={tool === 'mask' ? '#000' : '#FFE14D'} fillOpacity={tool === 'mask' ? 0.7 : 0.4} stroke={ref.white} strokeWidth={vb.w / BASE_W} />}
        </svg>
        {tool === 'crop' && !pending && (
          <Box component="span" sx={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', p: '3px 10px', borderRadius: '12px', background: 'rgba(0,0,0,.7)', color: ref.white, fontSize: 11, lineHeight: '15.95px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
            Drag to select the area to keep
          </Box>
        )}
      </Box>
    </Box>
  );
}

export const STAGE_BG = ev.captureStage;
