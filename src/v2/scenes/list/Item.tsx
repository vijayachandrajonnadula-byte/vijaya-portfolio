import { useLayoutEffect, useRef, useState } from 'react';

export interface Line { x0: number; x1: number; y: number; h: number }

/** Wobbly hand-drawn line: points every ~26px nudged by a seeded jitter, smoothed with quadratic midpoints. */
function wobble(x0: number, x1: number, y: number, seed: number): string {
  const pts: [number, number][] = [];
  const n = Math.max(2, Math.round((x1 - x0) / 26));
  for (let i = 0; i <= n; i++) {
    const j = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
    pts.push([x0 + ((x1 - x0) * i) / n, y + ((j - Math.floor(j)) - 0.5) * 5]);
  }
  let d = `M${pts[0]![0].toFixed(1)} ${pts[0]![1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i]!, [qx, qy] = pts[i + 1]!;
    d += `Q${px.toFixed(1)} ${py.toFixed(1)} ${((px + qx) / 2).toFixed(1)} ${((py + qy) / 2).toFixed(1)}`;
  }
  const e = pts[pts.length - 1]!;
  return `${d}L${e[0].toFixed(1)} ${e[1].toFixed(1)}`;
}

/** One list line: real words (measured per wrapped line), a strike or highlighter per line, a tick, a pencil. Driven by --l and --s. */
export default function Item({ text, i, stop, onLines }: { text: string; i: number; stop: boolean; onLines: (i: number, l: Line[]) => void }) {
  const li = useRef<HTMLLIElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const words = text.split(' ');

  useLayoutEffect(() => {
    const el = li.current; if (!el) return;
    let key = '';
    const measure = () => {
      const ws = Array.from(el.querySelectorAll<HTMLElement>('.s2b-w'));
      const out: Line[] = [];
      for (const w of ws) {
        const last = out[out.length - 1];
        const x1 = w.offsetLeft + w.offsetWidth - 5; // drop the trailing space
        if (last && Math.abs(last.y - w.offsetTop) < 6) last.x1 = Math.max(last.x1, x1);
        else out.push({ x0: w.offsetLeft, x1, y: w.offsetTop, h: w.offsetHeight });
      }
      const k = JSON.stringify(out);
      if (k === key) return;
      key = k; setLines(out); onLines(i, out);
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => ro?.disconnect();
  }, [text, i, onLines]);

  const nl = Math.max(1, lines.length);
  return (
    <li ref={li} className="s2b-it" style={{ '--nl': nl } as never}>
      <span className="s2b-it__sign">{stop ? '−' : '+'}</span>
      <span className="s2b-t">{words.map((w, k) => <span key={k} className="s2b-w">{w} </span>)}</span>
      <svg className="s2b-ov" width="100%" height="100%" aria-hidden="true">
        {lines.map((l, k) => stop
          ? <path key={k} className="s2b-strike" pathLength={1} style={{ '--k': k } as never} d={wobble(l.x0 - 6, l.x1 + 6, l.y + l.h * 0.56, i * 7 + k + 1)} />
          : <rect key={k} className="s2b-hl" style={{ '--k': k, transformOrigin: `${l.x0 - 4}px 0` } as never} x={l.x0 - 4} y={l.y + l.h * 0.22} width={l.x1 - l.x0 + 8} height={l.h * 0.66} rx={3} />)}
        {!stop && lines.length ? (
          <path className="s2b-tick" pathLength={1} d={`M${lines[lines.length - 1]!.x1 + 16} ${lines[lines.length - 1]!.y + lines[lines.length - 1]!.h * 0.5}l6 7l12 -15`} />
        ) : null}
      </svg>
      <i className="s2b-pen" />
    </li>
  );
}
