import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useOnScreen } from '../../motion/useOnScreen';
import { FuseSym } from './Symbols';

/* Six tiny demos. Each one is self-contained local state: no network, no storage. */

type Opt<T extends string> = { value: T; label: string };

/** A two-option switch, built from real buttons so it works by keyboard, touch and screen reader. */
function Seg<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Opt<T>[]; onChange: (v: T) => void }) {
  return (
    <div className="pd-seg" role="group" aria-label={label}>
      {options.map(o => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

/* ---------- 1. Pull-up resistor -> sensible defaults ---------- */

const GROUPS = [
  { id: 'plan', label: 'Plan', opts: ['Monthly', 'Yearly'], rec: 0 },
  { id: 'ship', label: 'Delivery', opts: ['Standard', 'Express'], rec: 0 },
  { id: 'mail', label: 'Receipts', opts: ['By email', 'None'], rec: 0 },
];

export function DefaultsDemo() {
  const uid = useId();
  const [mode, setMode] = useState<'without' | 'with'>('with');
  const fresh = (m: 'without' | 'with') => Object.fromEntries(GROUPS.map(g => [g.id, m === 'with' ? g.rec : -1])) as Record<string, number>;
  const [picks, setPicks] = useState(() => fresh('with'));
  const left = GROUPS.filter(g => picks[g.id]! < 0).length;
  const steps = left + 1;
  const change = (m: 'without' | 'with') => { setMode(m); setPicks(fresh(m)); };
  return (
    <div className="pd">
      <Seg label="Form mode" value={mode} onChange={change} options={[{ value: 'without', label: 'Without a default' }, { value: 'with', label: 'With a default' }]} />
      <div className="pd-form">
        {GROUPS.map(g => (
          <fieldset key={g.id} className="pd-field">
            <legend>{g.label}</legend>
            <div className="pd-radios">
              {g.opts.map((o, i) => (
                <label key={o} className="pd-radio">
                  <input type="radio" name={`${uid}-${g.id}`} checked={picks[g.id] === i} onChange={() => setPicks(p => ({ ...p, [g.id]: i }))} />
                  <span>{o}{mode === 'with' && i === g.rec ? <em className="pd-tag">Suggested</em> : null}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <div className="pd-foot">
          <div className="pd-big" aria-live="polite"><b>{steps}</b><span>{steps === 1 ? 'step to finish' : 'steps to finish'}</span></div>
          <button type="button" className="pd-btn" aria-disabled={left > 0} onClick={() => { /* demo only */ }}>Continue</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- 2. Fuse -> undo instead of "Are you sure?" ---------- */

export function UndoDemo() {
  const [mode, setMode] = useState<'undo' | 'ask'>('undo');
  const [gone, setGone] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const delBtn = useRef<HTMLButtonElement>(null);
  const undoBtn = useRef<HTMLButtonElement>(null);
  const cancelBtn = useRef<HTMLButtonElement>(null);
  const timer = useRef(0);
  const [toast, setToast] = useState(false);
  const reset = useCallback(() => { window.clearTimeout(timer.current); setGone(false); setConfirm(false); setToast(false); }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => { if (confirm) cancelBtn.current?.focus(); }, [confirm]);
  useEffect(() => { if (toast) undoBtn.current?.focus(); }, [toast]);

  const del = () => {
    if (mode === 'ask') { setConfirm(true); return; }
    setGone(true);
    window.clearTimeout(timer.current);
    setToast(true);
    timer.current = window.setTimeout(() => setToast(false), 7000);
  };
  const undo = () => { reset(); window.setTimeout(() => delBtn.current?.focus(), 0); };
  const closeConfirm = () => { setConfirm(false); window.setTimeout(() => delBtn.current?.focus(), 0); };
  const sure = () => { setConfirm(false); setGone(true); };

  return (
    <div className="pd">
      <Seg label="Delete behaviour" value={mode} onChange={m => { setMode(m); reset(); }} options={[{ value: 'ask', label: 'Ask “Are you sure?”' }, { value: 'undo', label: 'Do it, offer Undo' }]} />
      <div className="pd-stage pd-stage--undo">
        <div className="pd-fuse"><FuseSym className={gone ? 'is-blown' : ''} blown={gone} /><span>{gone ? 'blown' : 'intact'}</span></div>
        {!gone ? (
          <div className="pd-file">
            <span className="pd-file__ic" aria-hidden="true" />
            <span className="pd-file__n">Q3-report.pdf</span>
            <button ref={delBtn} type="button" className="pd-btn pd-btn--ghost" onClick={del}>Delete item</button>
          </div>
        ) : mode === 'ask' ? (
          <div className="pd-empty">
            <p>Gone for good.</p>
            <button type="button" className="pd-btn pd-btn--ghost" onClick={reset}>Reset demo</button>
          </div>
        ) : (
          <div className="pd-empty">
            <p>Nothing left in the list.</p>
            {!toast ? <button type="button" className="pd-btn pd-btn--ghost" onClick={reset}>Reset demo</button> : null}
          </div>
        )}
        {confirm ? (
          <div className="pd-modal" role="alertdialog" aria-labelledby="pd-modal-t" onKeyDown={e => { if (e.key === 'Escape') closeConfirm(); }}>
            <p id="pd-modal-t">Delete Q3-report.pdf? This cannot be undone.</p>
            <div>
              <button ref={cancelBtn} type="button" className="pd-btn pd-btn--ghost" onClick={closeConfirm}>Cancel</button>
              <button type="button" className="pd-btn" onClick={sure}>Yes, delete</button>
            </div>
          </div>
        ) : null}
        {toast && mode === 'undo' ? (
          <div className="pd-toast" role="status">
            <span>Deleted Q3-report.pdf</span>
            <button ref={undoBtn} type="button" onClick={undo}>Undo</button>
          </div>
        ) : null}
      </div>
      <p className="pd-note">{mode === 'ask' ? 'Two clicks, an interruption, and still no way back.' : 'One click, no interruption, and a way back.'}</p>
    </div>
  );
}

/* ---------- 3. Debounce -> prevent double submits ---------- */

export function DebounceDemo() {
  const [on, setOn] = useState(true);
  const [raw, setRaw] = useState(0);
  const [ok, setOk] = useState(0);
  const [busy, setBusy] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const press = () => {
    setRaw(r => r + 1);
    if (on && busy) return;
    setOk(c => c + 1);
    if (on) { setBusy(true); timer.current = window.setTimeout(() => setBusy(false), 1000); }
  };
  const reset = () => { window.clearTimeout(timer.current); setRaw(0); setOk(0); setBusy(false); };
  const flip = (v: boolean) => { setOn(v); reset(); };
  return (
    <div className="pd">
      <div className="pd-row">
        <label className="pd-switch">
          <input type="checkbox" role="switch" checked={on} onChange={e => flip(e.target.checked)} />
          <span className="pd-switch__t" aria-hidden="true"><i /></span>
          <span>Debounce {on ? 'on' : 'off'}</span>
        </label>
        <button type="button" className="pd-link" onClick={reset}>Reset counters</button>
      </div>
      <div className="pd-stage pd-stage--pay">
        <button type="button" className="pd-btn pd-btn--lg" aria-disabled={on && busy} onClick={press}>
          {on && busy ? <><span className="pd-spin" aria-hidden="true" />Paying…</> : 'Pay ₹499'}
        </button>
        <p className="pd-hint">Mash it.</p>
      </div>
      <div className="pd-counts">
        <div><b>{raw}</b><span>presses</span></div>
        <div className={ok > 1 ? 'is-bad' : ''}><b>{ok}</b><span>payments sent</span></div>
      </div>
      <p className="pd-note" aria-live="polite">{ok > 1 ? `Charged ${ok} times for one purchase. Ouch.` : on ? 'However hard you press, one purchase is one payment.' : 'Debounce is off, so every press goes through.'}</p>
    </div>
  );
}

/* ---------- 4. Low-pass filter -> signal over noise ---------- */

const CW = 480, CH = 150, CN = 60;

function table(n: number, seed: number) {
  let s = seed;
  return Array.from({ length: n }, () => { s = (s * 16807) % 2147483647; return (s / 2147483647) * 2 - 1; });
}

export function SmoothDemo() {
  const uid = useId();
  const [v, setV] = useState(0);
  const reduced = !!useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const raw = useRef<SVGPathElement>(null);
  const shown = useRef<SVGPathElement>(null);
  const onScreen = useOnScreen(box);
  const vRef = useRef(v); vRef.current = v;
  const t0 = useRef(0);
  const jag = useMemo(() => table(CN, 11), []);
  const ph = useMemo(() => table(CN, 29).map(p => p * Math.PI), []);

  const draw = useCallback((t: number) => {
    const r = Math.round((vRef.current / 100) * 9);
    const y = Array.from({ length: CN }, (_, i) => {
      const trend = CH * 0.68 - (i / (CN - 1)) * CH * 0.34 + Math.sin((i / CN) * Math.PI * 2) * 8;
      return trend + jag[i]! * 22 * Math.sin(t * 1.4 + ph[i]!) + jag[(i * 7) % CN]! * 8;
    });
    const sm = y.map((_, i) => {
      let s = 0, c = 0;
      for (let k = Math.max(0, i - r); k <= Math.min(CN - 1, i + r); k++) { s += y[k]!; c++; }
      return s / c;
    });
    const path = (a: number[]) => a.map((yy, i) => `${i ? 'L' : 'M'}${((i / (CN - 1)) * CW).toFixed(1)} ${yy.toFixed(1)}`).join('');
    raw.current?.setAttribute('d', path(y));
    shown.current?.setAttribute('d', path(sm));
  }, [jag, ph]);

  useEffect(() => { draw(t0.current); }, [v, draw]);
  useEffect(() => {
    if (reduced || !onScreen) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      if (!document.hidden) { t0.current += (now - last) / 1000; draw(t0.current); }
      last = now; raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, onScreen, draw]);

  const word = v < 8 ? 'raw readings' : v < 60 ? 'getting clearer' : 'the trend';
  return (
    <div className="pd" ref={box}>
      <svg className="pd-chart" viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none" role="img" aria-label={`Line chart of a noisy reading. Smoothing is at ${v} percent, showing ${word}.`}>
        <line x1="0" x2={CW} y1={CH - 8} y2={CH - 8} className="pd-chart__ax" />
        <path ref={raw} className="pd-chart__raw" d="" />
        <path ref={shown} className="pd-chart__line" d="" />
      </svg>
      <div className="pd-legend" aria-hidden="true"><span><i className="k-raw" />raw readings</span><span><i className="k-line" />what you see</span></div>
      <div className="pd-ctl">
        <label htmlFor={`${uid}-s`}>Smoothing</label>
        <input id={`${uid}-s`} type="range" min={0} max={100} step={1} value={v} onChange={e => setV(Number(e.target.value))} style={{ ['--v' as string]: `${v}%` }} aria-valuetext={`${v} percent, showing ${word}`} />
        <output htmlFor={`${uid}-s`}>{v}%</output>
      </div>
      <p className="pd-note">Show the trend first, the detail on demand.</p>
    </div>
  );
}

/* ---------- 5. Feedback LED -> immediate state feedback ---------- */

export function FeedbackDemo() {
  const [fast, setFast] = useState<'idle' | 'saved'>('idle');
  const [ripple, setRipple] = useState(0);
  const [slow, setSlow] = useState<'idle' | 'pending' | 'saved'>('idle');
  const [clicks, setClicks] = useState(0);
  const t1 = useRef(0), t2 = useRef(0), t3 = useRef(0);
  useEffect(() => () => { window.clearTimeout(t1.current); window.clearTimeout(t2.current); window.clearTimeout(t3.current); }, []);
  const doFast = () => { setFast('saved'); setRipple(r => r + 1); window.clearTimeout(t1.current); t1.current = window.setTimeout(() => setFast('idle'), 2400); };
  const doSlow = () => {
    setClicks(c => c + 1);
    if (slow !== 'idle') return;
    setSlow('pending');
    t2.current = window.setTimeout(() => {
      setSlow('saved');
      t3.current = window.setTimeout(() => { setSlow('idle'); setClicks(0); }, 2400);
    }, 1500);
  };
  return (
    <div className="pd">
      <div className="pd-pair">
        <div className="pd-card">
          <p className="pd-card__h">Answers at once</p>
          <button type="button" className={`pd-btn pd-btn--lg pd-press${fast === 'saved' ? ' is-done' : ''}`} onClick={doFast}>
            {ripple ? <span key={ripple} className="pd-ripple" aria-hidden="true" /> : null}
            {fast === 'saved' ? '✓ Saved' : 'Save'}
          </button>
          <p className="pd-card__s" role="status"><span className={`led led--sm${fast === 'saved' ? ' is-on' : ''}`} aria-hidden="true" />{fast === 'saved' ? 'Saved just now' : 'Not saved yet'}</p>
        </div>
        <div className="pd-card">
          <p className="pd-card__h">Stays silent for 1.5 s</p>
          <button type="button" className={`pd-btn pd-btn--lg pd-btn--plain${slow === 'saved' ? ' is-done' : ''}`} onClick={doSlow}>{slow === 'saved' ? '✓ Saved' : 'Save'}</button>
          <p className="pd-card__s" role="status"><span className={`led led--sm${slow === 'saved' ? ' is-on' : ''}`} aria-hidden="true" />
            {slow === 'saved' ? 'Saved, eventually' : clicks > 1 ? `Clicked ${clicks} times. Did it work?` : slow === 'pending' ? 'Did that work?' : 'Not saved yet'}
          </p>
        </div>
      </div>
      <p className="pd-note">Press both. Same result, very different confidence.</p>
    </div>
  );
}

/* ---------- 6. Tolerance -> forgiving inputs ---------- */

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const monthOf = (w: string) => (w.length >= 3 ? MONTHS.findIndex(m => m.startsWith(w)) : -1);

function build(d: number, m: number, y: number | null, today: Date): Date | null {
  if (m < 0 || m > 11 || d < 1 || d > 31) return null;
  let year = y ?? today.getFullYear();
  if (y !== null && y < 100) year += 2000;
  let dt = new Date(year, m, d);
  if (dt.getMonth() !== m) return null;
  if (y === null && dt < today) { dt = new Date(year + 1, m, d); if (dt.getMonth() !== m) return null; }
  return dt;
}

export function parseDate(input: string, today = new Date()): Date | null {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const s = input.trim().toLowerCase().replace(/[,.]/g, ' ').replace(/(\d)(st|nd|rd|th)\b/g, '$1').replace(/\s+/g, ' ');
  if (!s) return null;
  if (s === 'today') return t;
  if (s === 'tomorrow') return new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1);
  let m = /^(\d{1,2})[/\-](\d{1,2})(?:[/\-](\d{2,4}))?$/.exec(s);
  if (m) return build(+m[1]!, +m[2]! - 1, m[3] ? +m[3] : null, t);
  m = /^(\d{1,2}) ?([a-z]+)(?: (\d{2,4}))?$/.exec(s);
  if (m) return build(+m[1]!, monthOf(m[2]!), m[3] ? +m[3] : null, t);
  m = /^([a-z]+) ?(\d{1,2})(?: (\d{2,4}))?$/.exec(s);
  if (m) return build(+m[2]!, monthOf(m[1]!), m[3] ? +m[3] : null, t);
  return null;
}

const strictParse = (s: string) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s.trim());
  if (!m) return null;
  const dt = new Date(+m[3]!, +m[2]! - 1, +m[1]!);
  return dt.getMonth() === +m[2]! - 1 ? dt : null;
};

const fmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

export function ForgivingDemo() {
  const uid = useId();
  const [mode, setMode] = useState<'forgiving' | 'strict'>('forgiving');
  const [text, setText] = useState('5/3');
  const res = text.trim() ? (mode === 'forgiving' ? parseDate(text) : strictParse(text)) : null;
  const msg = !text.trim() ? 'Type a date, or tap an example.'
    : res ? `Interpreted as ${fmt.format(res).replace(',', '')}`
    : mode === 'strict' ? 'Rejected. Use DD/MM/YYYY, exactly.' : 'Hmm, I could not read that as a date.';
  return (
    <div className="pd">
      <Seg label="Input behaviour" value={mode} onChange={setMode} options={[{ value: 'strict', label: 'Strict' }, { value: 'forgiving', label: 'Forgiving' }]} />
      <div className="pd-field2">
        <label htmlFor={`${uid}-d`}>Delivery date</label>
        <input id={`${uid}-d`} type="text" inputMode="text" autoComplete="off" spellCheck={false} value={text} onChange={e => setText(e.target.value)} aria-describedby={`${uid}-r`} aria-invalid={!!text.trim() && !res} placeholder={mode === 'strict' ? 'DD/MM/YYYY' : 'any way you like'} />
        <p id={`${uid}-r`} className={`pd-result${res ? ' is-ok' : text.trim() ? ' is-bad' : ''}`} aria-live="polite">{res ? <span aria-hidden="true">✓ </span> : text.trim() ? <span aria-hidden="true">✕ </span> : null}{msg}</p>
      </div>
      <div className="pd-chips" role="group" aria-label="Examples">
        {['5/3', '5 mar', 'march 5', 'tomorrow'].map(x => (
          <button key={x} type="button" className={text === x ? 'is-on' : ''} onClick={() => setText(x)}>{x}</button>
        ))}
      </div>
    </div>
  );
}
