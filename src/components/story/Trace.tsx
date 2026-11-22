import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { useCalm } from '../../lib/calm';
import './../../styles/story.css';
import { setCircuit, useCircuit } from './circuitStore';

type Pt = { x: number; y: number };
type Geo = { d: string; nodes: Pt[]; end: Pt | null; w: number; h: number };

const CHAMFER = 14; // 45 degree corner size
const JOG = 14; // sideways step between nodes

/**
 * "The Trace": one SVG path down the left gutter of the home page, lit by scroll position.
 * Geometry is measured from the real positions of every [data-node] inside `boundary`, plus the
 * contact switch (the last node: the trace ends at the thing you are meant to press). Per-frame work touches only motion values and one circle's attributes; React state
 * changes only when the number of reached nodes changes.
 */
export default function Trace({ boundary }: { boundary: RefObject<HTMLElement> }) {
  const reduced = !!useCalm();
  const [geo, setGeo] = useState<Geo>({ d: '', nodes: [], end: null, w: 0, h: 0 });
  const [reached, setReached] = useState(0);
  const [zap, setZap] = useState(-1);
  const packet = useRef<SVGGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);
  const tab = useRef({ ys: [] as number[], len: [] as number[], total: 1, top: 0, nodesY: [] as number[], nodeLen: [] as number[], ledY: Infinity });
  const labels = useRef<Element[]>([]);
  const sw = useRef<HTMLElement | null>(null);
  const { closed } = useCircuit();

  const { scrollY } = useScroll();
  const lit = useMotionValue(0);
  const spring = useSpring(lit, { stiffness: 90, damping: 24, mass: 0.7, restDelta: 0.4 });

  const progress = useTransform(spring, y => {
    const t = tab.current;
    if (!t.ys.length) return 0;
    if (y <= t.ys[0]!) return 0;
    for (let i = 1; i < t.ys.length; i++) {
      const y0 = t.ys[i - 1]!, y1 = t.ys[i]!;
      if (y1 === y0) continue;
      if (y <= y1) return (t.len[i - 1]! + ((y - y0) / (y1 - y0)) * (t.len[i]! - t.len[i - 1]!)) / t.total;
    }
    return 1;
  });

  // where on the page the "lit" line sits: 55% down the viewport, easing to the very bottom at the end
  const updateLit = useCallback(() => {
    const t = tab.current;
    const vh = window.innerHeight;
    const max = Math.max(1, document.documentElement.scrollHeight - vh);
    const s = Math.min(1, Math.max(0, window.scrollY / max));
    const a = 0.55 + 0.45 * s * s * s;
    lit.set(window.scrollY + vh * a - t.top);
  }, [lit]);

  const measure = useCallback(() => {
    const wrap = boundary.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    const w = wr.width, h = wrap.offsetHeight;
    const els = Array.from(wrap.querySelectorAll('[data-node]'));
    labels.current = els;
    const gx = Math.max(10, w / 2 - 620 - 40);
    // offset-based so reveal transforms (translateY) do not skew the measurement
    const yIn = (el: Element) => {
      let y = 0, n: HTMLElement | null = el as HTMLElement;
      while (n && n !== wrap) { y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
      return y + (el as HTMLElement).offsetHeight / 2;
    };
    const nodes: Pt[] = els.map((el, i) => ({ x: gx + (i % 2 ? JOG : 0), y: yIn(el) }));
    const led = wrap.querySelector<HTMLElement>('[data-switch]');
    if (!nodes.length || !led) return;
    sw.current = (led.closest('.cts') as HTMLElement | null) ?? led;
    const lr = led.getBoundingClientRect();
    const ledY = yIn(led);
    const endX = lr.left - wr.left - 14;

    const pts: Pt[] = [nodes[0]!];
    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i]!, b = nodes[i + 1]!;
      const mid = (a.y + b.y) / 2, dx = b.x - a.x, c = Math.abs(dx);
      pts.push({ x: a.x, y: mid - c / 2 }, { x: b.x, y: mid + c / 2 }, b);
    }
    const last = nodes[nodes.length - 1]!;
    pts.push({ x: last.x, y: ledY - CHAMFER }, { x: last.x + CHAMFER, y: ledY }, { x: endX, y: ledY });

    let d = `M${pts[0]!.x.toFixed(1)} ${pts[0]!.y.toFixed(1)}`;
    const ys = [pts[0]!.y], len = [0];
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i]!, q = pts[i - 1]!;
      d += `L${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      ys.push(p.y);
      len.push(len[i - 1]! + Math.hypot(p.x - q.x, p.y - q.y));
    }
    tab.current = { ys, len, total: len[len.length - 1]! || 1, top: wr.top + window.scrollY, nodesY: nodes.map(n => n.y), nodeLen: nodes.map((_, i) => len[i * 3] ?? 0), ledY };
    setGeo({ d, nodes, end: { x: endX, y: ledY }, w, h });
    updateLit();
  }, [boundary, updateLit]);

  // measure now, and again whenever size, fonts or lazy images change the layout
  useEffect(() => {
    const wrap = boundary.current;
    if (!wrap) return;
    let raf = 0;
    const queue = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    queue();
    const ro = new ResizeObserver(queue);
    ro.observe(wrap);
    window.addEventListener('resize', queue);
    document.fonts?.ready.then(queue);
    const late = window.setTimeout(queue, 1200);
    setCircuit({ active: true });
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('resize', queue); clearTimeout(late); setCircuit({ active: false }); sw.current?.style.removeProperty('--glow'); sw.current = null; };
  }, [boundary, measure]);

  useMotionValueEvent(scrollY, 'change', updateLit);

  // the leading "signal" dot, the filled pads, the lit chapter labels and the LED
  const follow = useCallback((p: number) => {
    const t = tab.current;
    const el = path.current, g = head.current;
    if (g && el && !reduced) {
      try {
        const pt = el.getPointAtLength(p * el.getTotalLength());
        g.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
        g.style.opacity = p > 0.002 && p < 0.998 ? '1' : '0';
      } catch { /* svg is display:none on narrow screens */ }
    }
    const litY = (() => { const s = spring.get(); return s; })();
    let n = 0;
    t.nodesY.forEach((y, i) => { const on = litY >= y; if (on) n = i + 1; labels.current[i]?.classList.toggle('is-lit', on); });
    setReached(r => (r === n ? r : n));
    // goal gradient: the nearer the lit line gets to the switch, the more the switch glows (0 to 1, eased)
    const s = sw.current;
    if (s) { const g = Math.min(1, Math.max(0, 1 - (t.ledY - litY) / 650)); s.style.setProperty('--glow', (g * g).toFixed(3)); }
  }, [reduced, spring]);
  useMotionValueEvent(progress, 'change', follow);
  useEffect(() => { follow(progress.get()); }, [geo, follow, progress]);

  // signal packet: when the header (or the hero button) asks for Work, About or Contact, a small clay dot rides the
  // same path to that node and lights it. Only while the trace is visible (>= 1200px); skipped under reduced motion.
  useEffect(() => {
    if (reduced) return;
    const CH: Record<string, string> = { work: '03', about: '04', contact: '05' };
    let raf = 0, clear = 0;
    const stop = () => { cancelAnimationFrame(raf); clearTimeout(clear); if (packet.current) packet.current.style.opacity = '0'; };
    const onAnchor = (ev: Event) => {
      const target = (ev as CustomEvent<{ target?: string }>).detail?.target;
      const el = path.current, g = packet.current;
      const ch = target ? CH[target] : undefined;
      if (!el || !g || !ch) return;
      const svg = el.ownerSVGElement;
      if (!svg || svg.getBoundingClientRect().width === 0 || getComputedStyle(svg).display === 'none') return;
      const idx = labels.current.findIndex(n => (n as HTMLElement).dataset.chapter === ch);
      if (idx < 0) return;
      stop();
      const total = el.getTotalLength();
      const from = Math.min(total, Math.max(0, progress.get() * total));
      const to = Math.min(total, Math.max(0, tab.current.nodeLen[idx] ?? 0));
      const dur = Math.round(500 + Math.min(1, Math.abs(to - from) / Math.max(1, tab.current.total)) * 400);
      const t0 = performance.now();
      g.style.opacity = '1';
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        try { const pt = el.getPointAtLength(from + (to - from) * e); g.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`); } catch { /* hidden */ }
        if (k < 1) raf = requestAnimationFrame(step);
        else { g.style.opacity = '0'; setZap(idx); clear = window.setTimeout(() => setZap(-1), 900); }
      };
      raf = requestAnimationFrame(step);
    };
    window.addEventListener('vj:anchor', onAnchor);
    return () => { window.removeEventListener('vj:anchor', onAnchor); stop(); };
  }, [reduced, progress]);

  // pause the pulse while the tab is hidden
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const f = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', f);
    return () => document.removeEventListener('visibilitychange', f);
  }, []);

  if (!geo.d) return null;
  return (
    <svg className={`trace${hidden ? ' is-paused' : ''}`} width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true" focusable="false">
      <path ref={path} d={geo.d} className="trace__track" />
      <motion.path d={geo.d} className="trace__lit" style={{ pathLength: reduced ? 1 : progress }} />
      {geo.nodes.map((n, i) => (
        <g key={i} transform={`translate(${n.x} ${n.y})`} className={`trace__pad${i < reached ? ' is-on' : ''}${i === zap ? ' is-zap' : ''}`}>
          <circle r="5" className="trace__ring" />
          <circle r="2.5" className="trace__dot" />
        </g>
      ))}
      {geo.end ? (
        <g transform={`translate(${geo.end.x} ${geo.end.y})`} className={`trace__pad trace__pad--end${closed ? ' is-on' : ''}`}>
          <circle r="5" className="trace__ring" />
          <circle r="2.5" className="trace__dot" />
        </g>
      ) : null}
      {!reduced && (
        <g ref={packet} className="trace__packet" style={{ opacity: 0 }}>
          <circle r="7" className="trace__pk-halo" />
          <circle r="3.5" className="trace__spark" />
        </g>
      )}
      {!reduced && (
        <g ref={head} className="trace__head" style={{ opacity: 0 }}>
          <circle r="7" className="trace__halo" />
          <circle r="3" className="trace__spark" />
        </g>
      )}
    </svg>
  );
}
