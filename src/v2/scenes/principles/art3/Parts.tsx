import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';

/** The bench toys. Drag and fling (framer-motion drag + inertia, kept inside the bench); arrow keys nudge, Shift+arrow throws. */
export interface PartDef { id: string; label: string; tilt: number; body: (on: boolean) => ReactNode; toggles?: boolean }

export const PARTS: PartDef[] = [
  { id: 'btn', label: 'button', tilt: -3, body: () => <><i className="p-lbl" /></> },
  { id: 'sld', label: 'slider', tilt: 2, body: () => <><i className="p-rail" /><i className="p-thumb" /></> },
  { id: 'tog', label: 'toggle', tilt: 3, toggles: true, body: on => <i className={`p-knob${on ? ' is-on' : ''}`} /> },
  { id: 'crd', label: 'card', tilt: -2, body: () => <><i className="p-img" /><i className="p-ln" /><i className="p-ln p-ln--s" /></> },
  { id: 'tst', label: 'toast', tilt: 1.5, body: () => <><i className="p-dot" /><span><i className="p-ln" /><i className="p-ln p-ln--s" /></span><i className="p-x" /></> },
];

export function Part({ def, boxRef, nonce, active, onTouch }: { def: PartDef; boxRef: RefObject<HTMLDivElement>; nonce: number; active: boolean; onTouch: () => void }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const el = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!nonce) return;
    const s = { type: 'spring', stiffness: 160, damping: 14 } as const;
    const a = animate(x, 0, s), b = animate(y, 0, s);
    return () => { a.stop(); b.stop(); };
  }, [nonce, x, y]);

  const move = (dx: number, dy: number, fling: boolean) => {
    const e = el.current, box = boxRef.current;
    if (!e || !box) return;
    const r = e.getBoundingClientRect(), b = box.getBoundingClientRect();
    const loX = b.left - r.left, hiX = b.right - r.right, loY = b.top - r.top, hiY = b.bottom - r.bottom;
    const spring = { type: 'spring', stiffness: 380, damping: 26 } as const;
    onTouch();
    if (!fling) { animate(x, x.get() + Math.min(Math.max(dx * 22, loX), hiX), spring); animate(y, y.get() + Math.min(Math.max(dy * 22, loY), hiY), spring); return; }
    // a throw: glide towards where the speed would carry it, stopped by the wall (critically damped, so it never leaves the bench)
    const inert = (mv: typeof x, vel: number, lo: number, hi: number) => animate(mv, mv.get() + Math.min(Math.max(vel * 0.4, lo), hi), { type: 'spring', velocity: vel, stiffness: 70, damping: 17, restDelta: 0.5 });
    if (dx) inert(x, dx * 1500, loX, hiX); if (dy) inert(y, dy * 1500, loY, hiY);
  };

  const key = (ev: KeyboardEvent) => {
    const d: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const v = d[ev.key];
    if (v) { ev.preventDefault(); move(v[0], v[1], ev.shiftKey); }
    else if ((ev.key === 'Enter' || ev.key === ' ') && def.toggles) { ev.preventDefault(); setOn(o => !o); onTouch(); }
  };

  return (
    <motion.div
      ref={el} className={`a3-p p-${def.id}`} style={{ x, y, rotate: def.tilt }}
      role="button" tabIndex={active ? 0 : -1}
      aria-label={`${def.label} part. Drag to throw it, or use the arrow keys to nudge it and shift plus arrow to throw it.`}
      drag dragConstraints={boxRef} dragElastic={0.16} dragMomentum
      dragTransition={{ power: 0.55, timeConstant: 360, bounceStiffness: 280, bounceDamping: 16 }}
      whileDrag={{ scale: 1.07, rotate: 0, zIndex: 6 }} whileTap={{ scale: 1.03 }}
      onDragStart={onTouch} onTap={() => { if (def.toggles) { setOn(o => !o); onTouch(); } }} onKeyDown={key}
    >
      {def.body(on)}
    </motion.div>
  );
}
