// Implements Figma page "ColorPicker": colorPicker (Color Picker / Color Selector With Border / Color Selector),
// Color Mode (RGB, HEX, HSB), ColorPointer, EyeDropper, SwatchOptions.
import { fw } from '../../../theme/typography';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import { HexAlphaColorPicker } from 'react-colorful';
import { Button } from '../../actions/Button/Button';
import { focusRing, pt } from '../../../theme/pulseTokens';

const tk = pt.uiElements.colorPicker;
const font = "'Inter Variable', Inter, sans-serif";
const popupShadow = '0 2px 8px rgba(0,0,0,0.2)';
const BORDER = '#D3E0F2';
const ACCENT = '#9751F2'; // colorDropperBackground / pointer

/* ---------- colour maths (hex <-> rgb <-> hsb) ---------- */
interface Rgba { r: number; g: number; b: number; a: number }
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function parseHex(hex: string): Rgba {
  let h = hex.replace('#', '').trim();
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(h)) return { r: 0, g: 0, b: 0, a: 1 };
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
}
export function toHex({ r, g, b, a }: Rgba): string {
  const p = (n: number) => Math.round(clamp(n, 0, 255)).toString(16).padStart(2, '0');
  return `#${p(r)}${p(g)}${p(b)}${a < 1 ? p(a * 255) : ''}`;
}
function rgbToHsb({ r, g, b }: Rgba) {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B);
  const d = max - Math.min(R, G, B);
  let h = 0;
  if (d) h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
  return { h: Math.round(((h * 60 + 360) % 360)), s: Math.round(max ? (d / max) * 100 : 0), b: Math.round(max * 100) };
}
function hsbToRgb(h: number, s: number, v: number, a: number): Rgba {
  const S = s / 100;
  const V = v / 100;
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return (V - V * S * Math.max(0, Math.min(k, 4 - k, 1))) * 255;
  };
  return { r: f(5), g: f(3), b: f(1), a };
}
/** Black or white, whichever reads on the swatch. */
const tickColor = (hex: string) => {
  const { r, g, b } = parseHex(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b > 160 ? '#000' : '#fff';
};

/* ---------- Swatches (ColorSelector) ---------- */
export interface ColorSelectorProps {
  colors: string[];
  value?: string;
  onChange?: (color: string) => void;
  /** @default "square" */
  shape?: 'square' | 'circle';
  /** Coloured outline per swatch (Figma "Color Selector With Border"). */
  bordered?: boolean;
  /** Swatch edge in px. Spec: 20 in the selector, 24 in the picker's recent list. @default 20 */
  swatchSize?: number;
  /** @default 4 */
  gap?: number;
  /** Render inside the white elevated container (Figma frame). @default true */
  elevated?: boolean;
  ariaLabel?: string;
}

/** Grid of colour swatches with a tick on the selected one. */
export function ColorSelector({ colors, value, onChange, shape = 'square', bordered, swatchSize = 20, gap = 4, elevated = true, ariaLabel = 'Colors' }: ColorSelectorProps) {
  const grid = (
    <Box role="listbox" aria-label={ariaLabel} sx={{ display: 'flex', flexWrap: 'wrap', gap: `${gap}px`, alignContent: 'flex-start' }}>
      {colors.map((c) => {
        const on = value?.toLowerCase() === c.toLowerCase();
        return (
          <Box
            key={c}
            component="button"
            type="button"
            role="option"
            aria-selected={on}
            aria-label={c}
            data-spec={on ? 'swatch selected' : 'swatch'}
            onClick={() => onChange?.(c)}
            sx={{
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 0,
              width: swatchSize,
              height: swatchSize,
              cursor: 'pointer',
              backgroundColor: c,
              borderRadius: shape === 'circle' ? '50%' : '2px',
              border: bordered ? `0.5px solid ${tickColor(c) === '#fff' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)'}` : `0.5px solid ${pt.colors.neutral[200]}`,
              outline: 'none',
              '&:focus-visible': { boxShadow: focusRing },
            }}
          >
            {on && (
              <svg width={swatchSize * 0.8} height={swatchSize * 0.8} viewBox="0 0 16 16" fill="none" stroke={tickColor(c)} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
              </svg>
            )}
          </Box>
        );
      })}
    </Box>
  );
  if (!elevated) return grid;
  return <Box sx={{ display: 'inline-block', p: '8px', borderRadius: tk.radius.container, backgroundColor: tk.color.containerBackground, boxShadow: popupShadow, maxWidth: 228 }}>{grid}</Box>;
}

/* ---------- Picker ---------- */
type Mode = 'RGB' | 'HEX' | 'HSB';

const inputSx = {
  boxSizing: 'border-box',
  width: '100%',
  height: 32,
  p: '4px 8px',
  fontFamily: font,
  fontSize: 12,
  lineHeight: '20px',
  color: pt.colors.neutral[900],
  backgroundColor: '#fff',
  border: `1.5px solid ${BORDER}`,
  borderRadius: '4px',
  outline: 'none',
  '&:hover': { borderColor: '#B5C9E7' }, // atomTextField Hover border (fieldColors.primary.hover)
  '&:focus': { borderColor: '#1E3A6E' },
} as const;

// The mode dropdown: same box as the inputs, with a Pulse chevron instead of the browser's native arrow.
const chevron = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#090909" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')}")`;
const selectSx = { appearance: 'none', cursor: 'pointer', pr: '22px', backgroundImage: chevron, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center', backgroundSize: '14px 14px' } as const;

function Field({ label, value, onCommit, flex = 1 }: { label: string; value: string | number; onCommit: (v: string) => void; flex?: number }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', flex, minWidth: 0 }}>
      <Box component="span" sx={{ fontFamily: font, fontSize: 10, lineHeight: '18px', color: pt.colors.neutral[500] }}>{label}</Box>
      <Box
        component="input"
        aria-label={label}
        value={draft ?? String(value)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== null) onCommit(draft);
          setDraft(null);
        }}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        sx={inputSx}
      />
    </Box>
  );
}

export interface ColorPickerProps {
  /** Hex colour, `#rrggbb` or `#rrggbbaa`. */
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  /** Recent colour swatches (24px). Omit for none. */
  recentColors?: string[];
  /** Footer Cancel / Apply buttons. */
  onApply?: (hex: string) => void;
  onCancel?: () => void;
  /** Eyedropper button (needs the browser EyeDropper API; stays visible but inert otherwise). @default true */
  eyeDropper?: boolean;
  /** Manual value entry row. @default true */
  showInputs?: boolean;
  /** Initial entry mode. @default "RGB" */
  mode?: Mode;
  /** Shape of the recent swatches. @default "square" */
  swatchShape?: 'square' | 'circle';
}

type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> };

/** Full colour picker (Figma "Color Picker"): saturation area, hue and alpha sliders, value entry, recent colours, footer actions. */
export function ColorPicker({ value, defaultValue = '#9751F2', onChange, recentColors, onApply, onCancel, eyeDropper = true, showInputs = true, mode: initialMode = 'RGB', swatchShape = 'square' }: ColorPickerProps) {
  const [inner, setInner] = useState(defaultValue);
  const [mode, setMode] = useState<Mode>(initialMode);
  const hex = value ?? inner;
  const rgba = parseHex(hex);
  const hsb = rgbToHsb(rgba);
  const set = (next: string) => {
    setInner(next);
    onChange?.(next);
  };
  const setRgba = (patch: Partial<Rgba>) => set(toHex({ ...rgba, ...patch }));
  const num = (v: string, max: number) => clamp(parseInt(v, 10) || 0, 0, max);
  const setHsb = (patch: Partial<typeof hsb>) => {
    const n = { ...hsb, ...patch };
    set(toHex(hsbToRgb(n.h, n.s, n.b, rgba.a)));
  };
  const pickEye = async () => {
    const Eye = (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper;
    if (!Eye) return;
    try {
      const r = await new Eye().open();
      set(toHex({ ...parseHex(r.sRGBHex), a: rgba.a }));
    } catch {
      /* cancelled */
    }
  };
  const alpha = (
    <Field label="Alpha" flex={0} value={`${Math.round(rgba.a * 100)}%`} onCommit={(v) => setRgba({ a: num(v.replace('%', ''), 100) / 100 })} />
  );

  return (
    <Box
      data-spec="color picker"
      sx={{
        boxSizing: 'border-box',
        width: 296,
        p: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderRadius: tk.radius.container,
        backgroundColor: tk.color.containerBackground,
        boxShadow: popupShadow,
        // react-colorful: 280x174 saturation area, 10px hue + alpha bars indented 28px for the eyedropper (spec: 24px button, 4px gap).
        '& .react-colorful': { width: '100%', height: 'auto', gap: 0, position: 'relative' },
        '& .react-colorful__saturation': { height: 174, borderRadius: '4px', borderBottom: 0, marginBottom: '8px' },
        '& .react-colorful__hue, & .react-colorful__alpha': { height: 10, marginLeft: eyeDropper ? '28px' : 0, borderRadius: '5px' },
        '& .react-colorful__alpha': { marginTop: '4px' },
        '& .react-colorful__hue': { borderRadius: '5px' },
        '& .react-colorful__alpha-gradient': { borderRadius: '5px' },
        '& .react-colorful__pointer': { width: 12, height: 12, border: '1px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
        '& .react-colorful__interactive:focus .react-colorful__pointer': { boxShadow: focusRing },
        '& .react-colorful__saturation-pointer, & .react-colorful__hue-pointer, & .react-colorful__alpha-pointer': { width: 12, height: 12 },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Box sx={{ position: 'relative' }}>
          <HexAlphaColorPicker color={hex.length === 7 ? `${hex}ff` : hex} onChange={(c) => set(c.toLowerCase().endsWith('ff') && c.length === 9 ? c.slice(0, 7) : c)} />
          {eyeDropper && (
            <Box
              component="button"
              type="button"
              aria-label="Pick color from screen"
              onClick={pickEye}
              sx={{ position: 'absolute', left: 0, bottom: 0, width: 24, height: 24, p: '6px', border: 0, borderRadius: '4px', backgroundColor: ACCENT, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', '&:focus-visible': { outline: 'none', boxShadow: focusRing } }}
            >
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m2 22 1-1h3l9-9M3 21v-3l9-9" />
                <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
              </svg>
            </Box>
          )}
        </Box>
        {showInputs && (
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', width: 64, flexShrink: 0 }}>
              <Box component="span" sx={{ fontFamily: font, fontSize: 10, lineHeight: '18px', color: pt.colors.neutral[500] }}>Mode</Box>
              <Box
                component="select"
                aria-label="Color mode"
                value={mode}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setMode(e.target.value as Mode)}
                sx={{ ...inputSx, ...selectSx }}
              >
                {(['RGB', 'HEX', 'HSB'] as const).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </Box>
            </Box>
            {mode === 'HEX' && <Field label="Hex" value={toHex({ ...rgba, a: 1 }).toUpperCase()} onCommit={(v) => set(toHex({ ...parseHex(v), a: rgba.a }))} flex={3} />}
            {mode === 'RGB' && (
              <>
                <Field label="R" value={Math.round(rgba.r)} onCommit={(v) => setRgba({ r: num(v, 255) })} />
                <Field label="G" value={Math.round(rgba.g)} onCommit={(v) => setRgba({ g: num(v, 255) })} />
                <Field label="B" value={Math.round(rgba.b)} onCommit={(v) => setRgba({ b: num(v, 255) })} />
              </>
            )}
            {mode === 'HSB' && (
              <>
                <Field label="H" value={hsb.h} onCommit={(v) => setHsb({ h: num(v, 360) })} />
                <Field label="S" value={hsb.s} onCommit={(v) => setHsb({ s: num(v, 100) })} />
                <Field label="B" value={hsb.b} onCommit={(v) => setHsb({ b: num(v, 100) })} />
              </>
            )}
            <Box sx={{ width: 56, flexShrink: 0 }}>{alpha}</Box>
          </Box>
        )}
      </Box>
      {recentColors && recentColors.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Box component="span" sx={{ fontFamily: font, fontSize: 12, lineHeight: '20px', fontWeight: fw.medium, color: pt.colors.neutral[500] }}>Recent colors</Box>
          <ColorSelector colors={recentColors} value={hex} onChange={set} swatchSize={24} gap={8} elevated={false} shape={swatchShape} ariaLabel="Recent colors" />
        </Box>
      )}
      {(onApply || onCancel) && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '9px' }}>
          <Button size="small" variant="text" onClick={onCancel}>Cancel</Button>
          <Button size="small" variant="outlined" onClick={() => onApply?.(hex)}>Apply</Button>
        </Box>
      )}
    </Box>
  );
}
