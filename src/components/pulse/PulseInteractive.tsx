import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { Panel } from './PulseKit';
import type { Slot } from '../../data/pulseImages';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ============================================================
   1. TOKEN EXPLORER (Identity)
   Four tabs over the real foundations: type, space, colour, focus.
   ============================================================ */
const typeRows: [string, number, number][] = [
  ['Display XL', 72, 90], ['Heading 1', 48, 60], ['Heading 3', 36, 44], ['Heading 6', 18, 28], ['Text 2XL', 14, 24], ['Text L', 12, 20], ['Text XS', 9, 16],
];
const spaceRows: [string, number][] = [['xxxs', 1], ['xxs', 2], ['xs', 4], ['s', 6], ['m', 8], ['l', 10], ['xl', 12], ['xxl', 14], ['xxxl', 16]];
const brand: [string, string][] = [['25', '#F6F8FC'], ['50', '#EEF3FB'], ['75', '#E3EBF8'], ['100', '#D3E0F2'], ['200', '#B5C9E7'], ['300', '#87A8D3'], ['400', '#4E73A8'], ['500', '#1E3A6E'], ['600', '#19325E'], ['700', '#152A4F'], ['800', '#10213F'], ['900', '#0A162A'], ['950', '#050B15']];
const neutral: [string, string][] = [['25', '#FCFCFD'], ['50', '#F8FAFC'], ['75', '#F4F7FA'], ['100', '#F1F5F9'], ['200', '#E2E8F0'], ['300', '#CBD5E1'], ['400', '#94A3B8'], ['500', '#64748B'], ['600', '#475569'], ['700', '#334155'], ['800', '#1E293B'], ['900', '#0F172A'], ['950', '#020617']];
const accents: [string, string][] = [['Red', '#EF4444'], ['Orange', '#F59E0B'], ['Yellow', '#EAB308'], ['Green', '#22C55E'], ['Teal', '#14B8A6'], ['Cyan', '#06B6D4'], ['Blue', '#3B82F6'], ['Purple', '#8B5CF6']];

export function TokenExplorer() {
  const tabs = ['Type', 'Space', 'Colour', 'Focus'] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>('Type');
  const [pick, setPick] = useState<string>('Brand 500 · #1E3A6E');
  const reduced = useReducedMotion();

  const tx = (d = 0) => ({ initial: reduced ? false : { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: EASE, delay: d } });

  return (
    <div className="ix ix--dark">
      <div className="ix__tabs" role="tablist" aria-label="Token groups">
        <LayoutGroup id="tx-tabs">
          {tabs.map(t => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'is-on' : undefined} onClick={() => setTab(t)}>
              {tab === t && <motion.span layoutId="tx-pill" className="ix__pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span>{t}</span>
            </button>
          ))}
        </LayoutGroup>
      </div>

      <div className="ix__stage ix__stage--tx" role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            {tab === 'Type' && (
              <div className="tx-type">
                <p className="tx-note">Inter, 16 text styles. Each row is set at its own size, capped at 44px here.</p>
                {typeRows.map(([name, size, lh], i) => (
                  <motion.div key={name} className="tx-type__row" {...tx(i * 0.05)}>
                    <span className="tx-type__label">{name}<small>{size}/{lh}</small></span>
                    <span className="tx-type__sample" style={{ fontSize: Math.min(size, 44), lineHeight: 1.1 }}>Every state, in one place</span>
                  </motion.div>
                ))}
              </div>
            )}
            {tab === 'Space' && (
              <div className="tx-space">
                <p className="tx-note">35 spacing tokens, 1:1 with the Figma variables. The small end of the scale:</p>
                {spaceRows.map(([name, px], i) => (
                  <div key={name} className="tx-space__row">
                    <span>{name}</span>
                    <motion.i initial={reduced ? false : { width: 0 }} animate={{ width: px * 14 }} transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }} />
                    <em>{px}px</em>
                  </div>
                ))}
              </div>
            )}
            {tab === 'Colour' && (
              <div className="tx-colour">
                <p className="tx-note">Thirteen-step ramps for brand and neutral, and eight accent families. Hover or focus a swatch.</p>
                {([['Brand', brand], ['Neutral', neutral]] as const).map(([label, ramp], r) => (
                  <div key={label} className="tx-ramp" role="group" aria-label={`${label} ramp`}>
                    {ramp.map(([step, hex], i) => (
                      <motion.button
                        key={step}
                        type="button"
                        aria-label={`${label} ${step}, ${hex}`}
                        style={{ background: hex }}
                        initial={reduced ? false : { opacity: 0, scaleY: 0.2 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.45, ease: EASE, delay: r * 0.15 + i * 0.03 }}
                        onMouseEnter={() => setPick(`${label} ${step} · ${hex}`)}
                        onFocus={() => setPick(`${label} ${step} · ${hex}`)}
                      />
                    ))}
                  </div>
                ))}
                <div className="tx-accents" role="group" aria-label="Accent families">
                  {accents.map(([name, hex], i) => (
                    <motion.button
                      key={name}
                      type="button"
                      aria-label={`${name} 500, ${hex}`}
                      style={{ background: hex }}
                      initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.5 + i * 0.04 }}
                      onMouseEnter={() => setPick(`${name} 500 · ${hex}`)}
                      onFocus={() => setPick(`${name} 500 · ${hex}`)}
                    />
                  ))}
                </div>
                <p className="tx-pick" aria-live="polite">{pick}</p>
              </div>
            )}
            {tab === 'Focus' && (
              <div className="tx-focus">
                <p className="tx-note">One focus ring on every focusable component, shown only for the keyboard. Press Tab to move through these.</p>
                <div className="tx-focus__row">
                  <button type="button" className="tx-btn">Button</button>
                  <button type="button" className="tx-btn tx-btn--line">Outlined</button>
                  <label className="tx-check"><input type="checkbox" /><span aria-hidden="true" />Checkbox</label>
                  <button type="button" className="tx-tab">Tab</button>
                  <button type="button" className="tx-btn" disabled>Disabled</button>
                </div>
                <p className="tx-pick">Focus uses :focus-visible, never plain :focus. Disabled controls are not focusable and sit at 38% opacity.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================
   2. ATOMIC BUILDER (Structure)
   A list page that assembles itself, level by level.
   ============================================================ */
interface El { l: number; x: number; y: number; w: number; h: number; k: string; label?: string }
const els: El[] = [
  // level 1: atoms
  ...[0, 1, 2, 3, 4].map(i => ({ l: 1, x: 2.4, y: 12 + i * 8, w: 3.2, h: 5, k: 'ico' })),
  { l: 1, x: 93, y: 1.6, w: 4, h: 5, k: 'circ' },
  { l: 1, x: 10, y: 3, w: 10, h: 2, k: 'ink' },
  { l: 1, x: 10, y: 16, w: 18, h: 2.4, k: 'ink' },
  { l: 1, x: 10, y: 20.4, w: 30, h: 1.6, k: 'soft' },
  { l: 1, x: 77, y: 16.5, w: 3.2, h: 5, k: 'ico' },
  { l: 1, x: 81, y: 16.5, w: 3.2, h: 5, k: 'ico' },
  { l: 1, x: 86, y: 16.2, w: 12, h: 5.4, k: 'btn' },
  // level 2: molecules
  { l: 2, x: 10, y: 10.2, w: 22, h: 1.8, k: 'soft' },
  { l: 2, x: 52, y: 16.5, w: 20, h: 5, k: 'field' },
  { l: 2, x: 10, y: 29, w: 6, h: 2, k: 'tab on' },
  { l: 2, x: 18, y: 29, w: 6, h: 2, k: 'tab' },
  { l: 2, x: 26, y: 29, w: 6, h: 2, k: 'tab' },
  ...[0, 1, 2, 3, 4].map(i => ({ l: 2, x: 52 + i * 8, y: 28.4, w: 7, h: 3.6, k: 'chip' })),
  // level 3: organisms
  { l: 3, x: 10, y: 36, w: 88, h: 4.4, k: 'gridhead' },
  ...[0, 1, 2, 3, 4].map(i => ({ l: 3, x: 10, y: 41.4 + i * 4.2, w: 88, h: 3.6, k: 'row' })),
  // level 4: templates (dashed regions)
  { l: 4, x: 0, y: 0, w: 8, h: 62, k: 'panel', label: 'Left nav' },
  { l: 4, x: 8, y: 0, w: 92, h: 8, k: 'panel', label: 'Header' },
  { l: 4, x: 8, y: 8, w: 92, h: 6, k: 'panel', label: 'Context bar' },
  { l: 4, x: 8, y: 14, w: 92, h: 12, k: 'panel', label: 'List header' },
  { l: 4, x: 8, y: 26, w: 92, h: 8, k: 'panel', label: 'Tabs and status' },
  { l: 4, x: 8, y: 34, w: 92, h: 28, k: 'panel', label: 'Page body' },
  // level 5: screens (real content)
  ...[0, 1, 2, 3, 4].map(i => ({ l: 5, x: 80, y: 42 + i * 4.2, w: 11, h: 2.2, k: `status s${i % 4}` })),
  ...[0, 1, 2, 3, 4].map(i => ({ l: 5, x: 12, y: 42.4 + i * 4.2, w: 9, h: 1.6, k: 'link' })),
  ...[0, 1, 2, 3, 4].map(i => ({ l: 5, x: 30, y: 42.4 + i * 4.2, w: 26 + (i % 3) * 5, h: 1.6, k: 'soft' })),
];

export function AtomicBuilder({ counts }: { counts: { atoms: number; molecules: number; organisms: number; templates: number } }) {
  const levels = [
    { name: 'Atoms', body: 'The smallest parts: icons, symbols, buttons, icon buttons.', n: counts.atoms },
    { name: 'Molecules', body: 'Parts that only make sense together: a field with its label, a tab, a chip.', n: counts.molecules },
    { name: 'Organisms', body: 'Whole working regions: the data grid with its header and rows.', n: counts.organisms },
    { name: 'Templates', body: 'The page regions that repeat: shell, context bar, list header, tabs, body.', n: counts.templates },
    { name: 'Screens', body: 'A real page, filled with real content.', n: 0 },
  ];
  const [lv, setLv] = useState(1);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  const play = () => {
    if (playing) return;
    setPlaying(true); setLv(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1; setLv(i);
      if (i >= 5) { window.clearInterval(id); setPlaying(false); }
    }, reduced ? 250 : 1100);
  };

  const cur = levels[Math.max(0, lv - 1)];

  return (
    <div className="ix ab">
      <div className="ab__side">
        <div role="radiogroup" aria-label="Level"><ol>
          {levels.map((l, i) => (
            <li key={l.name}>
              <button type="button" role="radio" aria-checked={lv === i + 1} className={lv >= i + 1 ? 'is-on' : undefined} onClick={() => { setPlaying(false); setLv(i + 1); }}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span>{l.name}</span>
                {l.n > 0 && <em>{l.n}</em>}
              </button>
            </li>
          ))}
        </ol></div>
        <button type="button" className="ab__play" onClick={play} disabled={playing}>{playing ? 'Building…' : 'Build it from nothing'}</button>
      </div>
      <div className="ab__stage">
        <div className="ab__canvas" role="img" aria-label={`A list page wireframe at the ${cur?.name ?? 'first'} level`}>
          <AnimatePresence>
            {els.filter(e => e.l <= lv).map((e, i) => (
              <motion.div
                key={`${e.k}-${e.x}-${e.y}-${e.l}-${i}`}
                className={`ab__el ab__el--${e.k.split(' ').join(' ab__el--')}`}
                style={{ left: `${e.x}%`, top: `${(e.y / 62) * 100}%`, width: `${e.w}%`, height: `${(e.h / 62) * 100}%` }}
                initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: reduced ? 0 : (e.l === lv ? (i % 14) * 0.03 : 0) }}
              >
                {e.label && <span>{e.label}</span>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <p className="ab__cap"><strong>{cur?.name}.</strong> {cur?.body}</p>
      </div>
    </div>
  );
}

/* ============================================================
   3. CONTROLS PLAYGROUND (Storybook)
   ============================================================ */
const colourMap: Record<string, string> = {
  primary: '#1E3A6E', error: '#EF4444', success: '#22C55E', warning: '#F59E0B', ai: 'linear-gradient(45deg, #BD06BE 0%, #653FDA 50%, #158EEF 100%)',
};
const heights: Record<string, number> = { xsmall: 24, small: 32, medium: 40, large: 48, xlarge: 56 };

function Seg({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="pg__row">
      <span id={`pg-${label}`}>{label}</span>
      <div className="pg__seg" role="radiogroup" aria-labelledby={`pg-${label}`}>
        {options.map(o => (
          <button key={o} type="button" role="radio" aria-checked={value === o} className={value === o ? 'is-on' : undefined} onClick={() => onChange(o)}>{o}</button>
        ))}
      </div>
    </div>
  );
}

export function ControlsPlayground() {
  const [variant, setVariant] = useState('contained');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [label, setLabel] = useState('Save changes');
  const [disabled, setDisabled] = useState(false);
  const [copied, setCopied] = useState(false);

  const bg = colourMap[color] ?? '#1E3A6E';
  const solid = color === 'ai' ? '#653FDA' : bg;
  const style: React.CSSProperties = {
    height: heights[size], padding: `0 ${Math.round((heights[size] ?? 40) * 0.5)}px`, fontSize: size === 'xsmall' || size === 'small' ? 12 : size === 'medium' ? 14 : 16,
    background: variant === 'contained' ? bg : 'transparent', color: variant === 'contained' ? '#fff' : solid,
    border: variant === 'outlined' ? `1.5px solid ${solid}` : '1.5px solid transparent', opacity: disabled ? 0.38 : 1,
  };
  const code = `<Button${variant !== 'contained' ? ` variant="${variant}"` : ''}${color !== 'primary' ? ` color="${color}"` : ''}${size !== 'medium' ? ` size="${size}"` : ''}${disabled ? ' disabled' : ''}>${label || 'Button'}</Button>`;
  const copy = async () => { try { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1600); } catch { /* the snippet is selectable */ } };

  return (
    <div className="ix pg">
      <div className="pg__preview">
        <motion.button type="button" className="pg__btn" style={style} disabled={disabled} layout transition={{ type: 'spring', stiffness: 300, damping: 26 }} aria-label={label || 'Button'}>
          {label || 'Button'}
        </motion.button>
        <p className="pg__note">Illustrative preview. The real component is in the Storybook.</p>
      </div>
      <div className="pg__controls">
        <Seg label="variant" value={variant} options={['contained', 'outlined', 'text']} onChange={setVariant} />
        <Seg label="color" value={color} options={['primary', 'error', 'success', 'warning', 'ai']} onChange={setColor} />
        <Seg label="size" value={size} options={['xsmall', 'small', 'medium', 'large', 'xlarge']} onChange={setSize} />
        <div className="pg__row">
          <label htmlFor="pg-label">children</label>
          <input id="pg-label" value={label} onChange={e => setLabel(e.target.value)} maxLength={28} />
        </div>
        <div className="pg__row">
          <span id="pg-disabled">disabled</span>
          <button type="button" role="switch" aria-checked={disabled} aria-labelledby="pg-disabled" className={`pg__switch${disabled ? ' is-on' : ''}`} onClick={() => setDisabled(d => !d)}><i /></button>
        </div>
        <div className="pg__code">
          <code>{code}</code>
          <button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   4. INTENT CHOOSER (Patterns)
   ============================================================ */
const intents = [
  { cue: 'A coloured pill that says Approved', use: 'Status', not: 'A hand-coloured chip', note: 'The status of one record. A pill with text, or a dot with text.', demo: <span className="in-pill in-pill--green">Approved</span> },
  { cue: 'Count pills that filter a list', use: 'StatusFilterBar', not: 'A row of chips', note: 'Filtering a list by status, with a count on each.', demo: <span className="in-bar"><b>Total 19</b><i>5 Approved</i><i>3 Draft</i><i>3 Rejected</i></span> },
  { cue: 'A tag or label on a record', use: 'Chip', not: 'Status', note: 'A tag is a label, not a state. It carries no workflow meaning.', demo: <span className="in-pill in-pill--line">Life sciences</span> },
  { cue: 'A number or dot on an icon', use: 'Badge', not: 'A circle drawn on the page', note: 'Counts and dots that sit on an icon.', demo: <span className="in-badge"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15L6 17ZM10 21h4" /></svg><em>4</em></span> },
  { cue: 'A button with a chevron attached', use: 'ButtonGroup', not: 'A button plus an icon', note: 'A split button. Its menu is a DropdownMenu.', demo: <span className="in-split"><b>Create</b><i aria-hidden="true">▾</i></span> },
  { cue: 'The AI action', use: 'Button color="ai"', not: 'A custom gradient', note: 'The AI action is the button’s own colour, so it is the same everywhere.', demo: <span className="in-ai">Ask AI</span> },
];

export function IntentChooser() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const cur = intents[i] ?? intents[0]!;
  return (
    <div className="ix in">
      <div className="in__cues" role="radiogroup" aria-label="What is on the screen?">
        <p className="in__h">What is on the screen?</p>
        {intents.map((it, k) => (
          <button key={it.cue} type="button" role="radio" aria-checked={i === k} className={i === k ? 'is-on' : undefined} onClick={() => setI(k)}>{it.cue}</button>
        ))}
      </div>
      <div className="in__out" aria-live="polite">
        <p className="in__h">Use</p>
        <AnimatePresence mode="wait">
          <motion.div key={cur.use} initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
            <div className="in__demo">{cur.demo}</div>
            <p className="in__use">{cur.use}</p>
            <p className="in__note">{cur.note}</p>
            <p className="in__not"><span>Not</span> {cur.not}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================
   5. SCREEN HOTSPOTS (Adoption)
   ============================================================ */
const regions = [
  { id: 'frame', name: 'Frame', comp: 'App shell, left navigation and header' },
  { id: 'crumb', name: 'Breadcrumb', comp: 'Context bar panel' },
  { id: 'head', name: 'Title, tools, primary action', comp: 'List header panel, grid toolbar, button group' },
  { id: 'tabs', name: 'Tabs and status filter', comp: 'Tabs and status filter panel' },
  { id: 'body', name: 'Body', comp: 'Page body panel, region, data grid' },
  { id: 'cells', name: 'Cells', comp: 'Link, text, avatar, status chip and action cells' },
];

export function ScreenHotspots() {
  const [on, setOn] = useState<string | null>('body');
  const dim = (id: string) => (on && on !== id ? ' is-dim' : on === id ? ' is-on' : '');
  return (
    <div className="ix hs">
      <div className="hs__shot" onMouseLeave={() => setOn(null)}>
        <div className="hs__page" role="img" aria-label="A list page wireframe with six labelled regions">
          <div className={`hs__r hs__nav${dim('frame')}`} onMouseEnter={() => setOn('frame')} />
          <div className={`hs__r hs__top${dim('frame')}`} onMouseEnter={() => setOn('frame')}><i /><b /></div>
          <div className={`hs__r hs__crumb${dim('crumb')}`} onMouseEnter={() => setOn('crumb')}><i /></div>
          <div className={`hs__r hs__head${dim('head')}`} onMouseEnter={() => setOn('head')}><i /><em /><u /></div>
          <div className={`hs__r hs__tabs${dim('tabs')}`} onMouseEnter={() => setOn('tabs')}><i /><i /><i /><s /><s /><s /></div>
          <div className={`hs__r hs__body${dim('body')}`} onMouseEnter={() => setOn('body')}>
            <div className="hs__gh" />
            {[0, 1, 2, 3, 4].map(r => <div key={r} className="hs__row" />)}
          </div>
          <div className={`hs__r hs__cells${dim('cells')}`} onMouseEnter={() => setOn('cells')}>
            {[0, 1, 2, 3, 4].map(r => <span key={r} />)}
          </div>
        </div>
      </div>
      <ul className="hs__list">
        {regions.map(r => (
          <li key={r.id}>
            <button type="button" className={on === r.id ? 'is-on' : undefined} onMouseEnter={() => setOn(r.id)} onFocus={() => setOn(r.id)} onClick={() => setOn(r.id)}>
              <span>{r.name}</span>
              <em>{r.comp}</em>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
   6. TAB COMPARE (Evolution)
   Drag the handle: as extracted, then as corrected.
   ============================================================ */
function TabBar({ fixed }: { fixed: boolean }) {
  return (
    <div className={`tc__bar${fixed ? ' is-fixed' : ''}`} aria-hidden="true">
      {['Create', 'Review', 'Approve', 'Archive'].map((t, i) => <span key={t} className={i === 0 ? 'on' : undefined}>{t}</span>)}
    </div>
  );
}

export function TabCompare() {
  const [v, setV] = useState(50);
  return (
    <div className="ix tc">
      <div className="tc__stage" style={{ ['--v' as string]: `${v}%` }}>
        <div className="tc__layer tc__layer--a"><TabBar fixed={false} /></div>
        <div className="tc__layer tc__layer--b"><TabBar fixed /></div>
        <div className="tc__handle" aria-hidden="true"><i /></div>
        <span className="tc__tag tc__tag--a">As extracted</span>
        <span className="tc__tag tc__tag--b">As corrected</span>
      </div>
      <label className="tc__range">
        <span className="sr-only">Compare the tabs as extracted and as corrected</span>
        <input type="range" min={0} max={100} value={v} onChange={e => setV(Number(e.target.value))} />
      </label>
      <p className="tc__cap">Left of the handle: unselected tabs as the extract read them, dark and heavy. Right: how the live product draws them, muted and darker on hover, with the selected tab semibold on a baseline underline.</p>
    </div>
  );
}


/* ============================================================
   7. ASSISTANT COMPARE (Context)
   The same request, with and without the AI-readable layer. Illustrative, and labelled so.
   ============================================================ */
export function AssistantCompare({ intents, templates }: { intents: number; templates: number }) {
  const [after, setAfter] = useState(false);
  const reduced = useReducedMotion();
  const side = after
    ? {
        has: ['A registry of every component, prop and default', intents + ' intents: a cue on the screen to the component to use', 'Five page recipes and ' + templates + ' micro templates', 'Rules in markdown, and checks that fail the build'],
        out: ['Uses Status for the status of a record', 'Uses the list header, tabs and body templates for the page', 'Takes padding and weights from tokens and named roles', 'Cannot import the UI library into a page: the lint rule stops it'],
      }
    : {
        has: ['A screenshot', 'A Figma file it cannot open', 'No list of components or props', 'No rule for which component fits which job'],
        out: ['Reaches for a chip where a status belongs', 'Guesses the padding, 14 where the file says 16', 'Colours a pill by hand', 'Imports the UI library straight into the page'],
      };
  return (
    <div className="ix ac">
      <div className="ac__head">
        <p className="ac__prompt"><span>Request</span> Build a list page with a status column</p>
        <div className="pg__seg" role="radiogroup" aria-label="Which setup">
          <button type="button" role="radio" aria-checked={!after} className={!after ? 'is-on' : undefined} onClick={() => setAfter(false)}>Before</button>
          <button type="button" role="radio" aria-checked={after} className={after ? 'is-on' : undefined} onClick={() => setAfter(true)}>After</button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={String(after)} className="ac__cols" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
          <div>
            <p className="in__h">What the assistant has</p>
            <ul>{side.has.map(x => <li key={x}>{x}</li>)}</ul>
          </div>
          <div>
            <p className="in__h">{after ? 'What it can do' : 'What goes wrong'}</p>
            <ul className={after ? 'is-ok' : 'is-bad'}>{side.out.map(x => <li key={x}>{x}</li>)}</ul>
          </div>
        </motion.div>
      </AnimatePresence>
      <p className="ac__note">Illustrative: it shows what each setup makes possible, not a recorded run.</p>
    </div>
  );
}


/* ============================================================
   8. SCREEN SHOWCASE (Adoption)
   Product screens built from the system, one at a time.
   ============================================================ */
export function ScreenShowcase({ screens }: { screens: { name: string; slot: Slot }[] }) {
  const [i, setI] = useState(0);
  const cur = screens[i] ?? screens[0]!;
  return (
    <div className="ss">
      <div className="ss__tabs" role="tablist" aria-label="Screens built from the system">
        <LayoutGroup id="ss-tabs">
          {screens.map((s, k) => (
            <button key={s.name} type="button" role="tab" aria-selected={i === k} className={i === k ? 'is-on' : undefined} onClick={() => setI(k)}>
              {i === k && <motion.span layoutId="ss-pill" className="ss__pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span>{s.name}</span>
            </button>
          ))}
        </LayoutGroup>
      </div>
      <div role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div key={cur.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            <Panel slot={cur.slot} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}


/* ============================================================
   9. LAYERS DIAGRAM (Approach)
   What an assistant reads before it builds, as five layers.
   ============================================================ */
export function LayersDiagram({ layers }: { layers: { name: string; body: string }[] }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const kind = (k: number) => (k === 0 || k === layers.length - 1 ? 'Control' : 'Knowledge');
  return (
    <div className="ix ld">
      <div role="radiogroup" aria-label="Layers an assistant reads"><ol className="ld__stack">
        {layers.map((l, k) => (
          <motion.li
            key={l.name}
            initial={reduced ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE, delay: k * 0.08 }}
          >
            <button type="button" role="radio" aria-checked={i === k} className={i === k ? 'is-on' : undefined} onClick={() => setI(k)} onMouseEnter={() => setI(k)} onFocus={() => setI(k)}>
              <b>{String(k + 1).padStart(2, '0')}</b>
              <span>{l.name}</span>
              <em>{kind(k)}</em>
            </button>
          </motion.li>
        ))}
      </ol></div>
      <div className="ld__out" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: EASE }}>
            <p className="in__h">{kind(i)} layer</p>
            <p className="ld__name">{layers[i]?.name}</p>
            <p className="ld__body">{layers[i]?.body}</p>
          </motion.div>
        </AnimatePresence>
        <p className="ld__note">Control layers say what must and must not happen. Knowledge layers say what exists.</p>
      </div>
    </div>
  );
}

/* ============================================================
   10. FLOW DIAGRAM (Decision layer)
   Three ways in, one path to a composed screen.
   ============================================================ */
export function FlowDiagram() {
  const reduced = useReducedMotion();
  const step = (d: number) => ({ initial: reduced ? false : { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.5 }, transition: { duration: 0.6, ease: EASE, delay: d } } as const);
  return (
    <div className="ix fd">
      <ul className="fd__in" aria-label="Ways in">
        <motion.li {...step(0)}><b>A screenshot</b><span>What you want, drawn or captured</span></motion.li>
        <motion.li {...step(0.08)}><b>A written request</b><span>“A list page with a status column”</span></motion.li>
        <motion.li {...step(0.16)}><b>A Figma frame</b><span>Skips matching: a map names each part’s component</span></motion.li>
      </ul>
      <span className="fd__arrow" aria-hidden="true" />
      <motion.div className="fd__step" {...step(0.24)}><i>1</i><b>Match</b><span>Split the input into regions. Match each cue to an intent.</span></motion.div>
      <span className="fd__arrow" aria-hidden="true" />
      <motion.div className="fd__step" {...step(0.32)}><i>2</i><b>Read the contract</b><span>Look up the component’s props, defaults and demo in the registry.</span></motion.div>
      <span className="fd__arrow" aria-hidden="true" />
      <motion.div className="fd__step fd__step--out" {...step(0.4)}><i>3</i><b>Compose</b><span>Assemble a screen from components and micro templates, then run the checks.</span></motion.div>
    </div>
  );
}

/* ============================================================
   11. CODE PANEL (Product)
   A real page, and the rule that guards it.
   ============================================================ */
const pageCode = `import { AppShell, ContextBarPanel, ListHeaderPanel, TabStatusFilterPanel, PageBodyContentPanel } from '../../templates';
import { Region } from '../../components/containers/Region/Region';
import { DataGrid } from '../../components/data-display/DataGrid/DataGrid';
import { Status } from '../../components/data-display/Status/Status';

export default function ExecutionLifecyclePage() {
  return (
    <AppShell nav={<LeftNav menus={menus} />} header={<Header />}>
      <ContextBarPanel breadcrumbs={breadcrumbs} />
      <ListHeaderPanel title="Execution Lifecycle" primaryAction={{ label: 'Create' }} />
      <TabStatusFilterPanel tabs={tabs} statusFilter={statusFilter} />
      <PageBodyContentPanel>
        <Region>
          <DataGrid filledHeader columns={columns} rows={rows} />
        </Region>
      </PageBodyContentPanel>
    </AppShell>
  );
}`;
const ruleCode = `// Pages and templates may only import design-system parts.
//
//   allowed    ../../components/*   ../../templates   ../../icons
//   forbidden  @mui/*               (the underlying UI library)
//
// A lint rule fails the build on a forbidden import. If a page needs
// something the library does not have, the component is built first,
// with a demo, and only then used on the page.
//
// A second check fails the build on a numeric font weight outside the
// typography file, and a third validates the intents against the code.`;

export function CodePanel() {
  const [tab, setTab] = useState<'page' | 'rule'>('page');
  const [copied, setCopied] = useState(false);
  const code = tab === 'page' ? pageCode : ruleCode;
  const copy = async () => { try { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1600); } catch { /* the code is selectable */ } };
  return (
    <div className="ix cp">
      <div className="cp__bar">
        <div className="pg__seg" role="tablist" aria-label="Code">
          <button type="button" role="tab" aria-selected={tab === 'page'} className={tab === 'page' ? 'is-on' : undefined} onClick={() => setTab('page')}>A page</button>
          <button type="button" role="tab" aria-selected={tab === 'rule'} className={tab === 'rule' ? 'is-on' : undefined} onClick={() => setTab('rule')}>The rule that guards it</button>
        </div>
        <button type="button" className="cp__copy" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <pre className="cp__code" tabIndex={0} aria-label={tab === 'page' ? 'A page built only from design-system parts' : 'The import rule'}><code>{code}</code></pre>
    </div>
  );
}
