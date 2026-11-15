import { useEffect, useId, useRef } from 'react';
import '../../styles/electro.css';

/**
 * Clay: an original felt-textured mascot drawn in SVG. Poses move the arms; the eyes follow the
 * pointer on devices that have one; it blinks and breathes only while it is on screen and the
 * user has not asked for reduced motion (see site.css).
 */
export type Pose = 'rest' | 'wave' | 'point' | 'hold' | 'think';
export type Prop = 'none' | 'blocks' | 'dial' | 'spark' | 'calendar';

const ARMS: Record<Pose, { l: number; r: number }> = {
  rest: { l: 9, r: -9 },
  wave: { l: 9, r: -158 },
  point: { l: 9, r: -104 },
  hold: { l: -46, r: 46 },
  think: { l: 9, r: -142 },
};

function PropArt({ prop }: { prop: Prop }) {
  switch (prop) {
    case 'blocks':
      return (
        <g>
          <rect x="78" y="150" width="44" height="12" rx="4" fill="#f7efe6" stroke="#d9c9b8" />
          <rect x="82" y="140" width="40" height="12" rx="4" fill="#fff" stroke="#d9c9b8" />
          <rect x="80" y="130" width="42" height="12" rx="4" fill="#1e3a6e" />
        </g>
      );
    case 'dial':
      return (
        <g>
          <circle cx="100" cy="148" r="22" fill="#fff" stroke="#cfc3b4" strokeWidth="2" />
          <path d="M100 148 112 136" stroke="#1e3a6e" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="148" r="3.5" fill="#1e3a6e" />
          <path d="M84 156a18 18 0 0 1 32 0" stroke="#e2705a" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'spark':
      return (
        <g>
          <rect x="80" y="130" width="40" height="40" rx="10" fill="#fff" stroke="#cfc3b4" strokeWidth="2" />
          <path d="M100 138v24M88 150h24M92 142l16 16M108 142 92 158" stroke="#1e3a6e" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      );
    case 'calendar':
      return (
        <g>
          <rect x="76" y="130" width="48" height="42" rx="8" fill="#fff" stroke="#cfc3b4" strokeWidth="2" />
          <path d="M76 142h48v-4a8 8 0 0 0-8-8H84a8 8 0 0 0-8 8Z" fill="#1e3a6e" />
          {[0, 1, 2].map(r => [0, 1, 2, 3].map(c => <circle key={`${r}${c}`} cx={86 + c * 9} cy={150 + r * 7.5} r="2" fill={r === 1 && c === 2 ? '#e2705a' : '#cfc3b4'} />))}
        </g>
      );
    default:
      return null;
  }
}

export default function Character({
  pose = 'rest', prop = 'none', size = 160, track = false, peek = false, className = '', label, power = 'on', boot = false,
}: { pose?: Pose; prop?: Prop; size?: number; track?: boolean; peek?: boolean; className?: string; label?: string;
  /** The eye LEDs: faint halo (on), brighter (bright), or dark (off). */
  power?: 'on' | 'bright' | 'off';
  /** Play the one-time power-on flicker when it mounts. Reduced motion: it is simply on. */
  boot?: boolean }) {
  const id = useId().replace(/:/g, '');
  const root = useRef<HTMLDivElement>(null);
  const pupils = useRef<SVGGElement>(null);
  const arms = ARMS[pose];
  const showProp = pose === 'hold' && prop !== 'none';

  // eyes follow the pointer (fine pointers only), written straight to the DOM so nothing re-renders
  useEffect(() => {
    if (!track) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = root.current; if (!el || !pupils.current) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.32);
        const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260) * 3.4;
        pupils.current.style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k}px)`;
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); if (raf) cancelAnimationFrame(raf); };
  }, [track]);

  // breathing and blinking only while visible
  useEffect(() => {
    const el = root.current; if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => el.setAttribute('data-paused', String(!e!.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const arm = (x: number, deg: number, side: 'l' | 'r') => (
    <g transform={`translate(${x} 104)`}>
      <g className={`clay__arm clay__arm--${side}${pose === 'wave' && side === 'r' ? ' is-waving' : ''}`} style={{ transform: `rotate(${deg}deg)` }}>
        <rect x="-11" y="-8" width="22" height="78" rx="11" fill={`url(#${id}b)`} />
        <circle cx="0" cy="66" r="12" fill={`url(#${id}b)`} />
      </g>
    </g>
  );

  return (
    <div ref={root} data-power={power} className={`clay${peek ? ' clay--peek' : ''}${boot ? ' clay--boot' : ''} ${className}`.trim()} style={{ width: size }} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <svg viewBox="0 0 200 260" width="100%" focusable="false">
        <defs>
          <radialGradient id={`${id}b`} cx="0.35" cy="0.25" r="0.9">
            <stop offset="0" stopColor="#f29a86" />
            <stop offset="0.55" stopColor="#e2705a" />
            <stop offset="1" stopColor="#c45a45" />
          </radialGradient>
          <radialGradient id={`${id}h`}>
            <stop offset="0.25" stopColor="#fff1d6" stopOpacity="1" />
            <stop offset="0.6" stopColor="#ffd9a0" stopOpacity="0.65" />
            <stop offset="1" stopColor="#ffc98a" stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}n`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="t" />
            <feColorMatrix in="t" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 -0.35" />
          </filter>
          <clipPath id={`${id}c`}>
            <path d="M58 76C58 28 142 28 142 76L148 188C148 220 52 220 52 188Z" />
          </clipPath>
        </defs>
        <ellipse cx="100" cy="246" rx="52" ry="8" fill="rgba(20,16,12,0.16)" />
        <rect x="68" y="196" width="28" height="46" rx="14" fill={`url(#${id}b)`} />
        <rect x="104" y="196" width="28" height="46" rx="14" fill={`url(#${id}b)`} />
        {arm(60, arms.l, 'l')}
        <g className="clay__body">
          <path d="M58 76C58 28 142 28 142 76L148 188C148 220 52 220 52 188Z" fill={`url(#${id}b)`} />
          <rect x="40" y="20" width="120" height="210" filter={`url(#${id}n)`} opacity="0.5" clipPath={`url(#${id}c)`} />
          <path d="M72 52c8-10 22-14 34-12" stroke="rgba(255,255,255,0.35)" strokeWidth="5" strokeLinecap="round" fill="none" />
          <g className="clay__ant" aria-hidden="true">
            <path d="M100 48V30" stroke="#e2705a" strokeWidth="4.4" strokeLinecap="round" />
            <circle cx="100" cy="26" r="5.4" fill="#f29a86" />
            <circle cx="98.4" cy="24.4" r="1.6" fill="#fff" opacity="0.75" />
          </g>
          <g ref={pupils} className="clay__look">
            <g className="clay__eye"><circle className="clay__halo" cx="86" cy="80" r="15" fill={`url(#${id}h)`} /><ellipse cx="86" cy="80" rx="5.2" ry="6.6" fill="#2a1511" /><circle cx="84.4" cy="77.6" r="1.6" fill="#fff" opacity="0.85" /></g>
            <g className="clay__eye"><circle className="clay__halo" cx="114" cy="80" r="15" fill={`url(#${id}h)`} /><ellipse cx="114" cy="80" rx="5.2" ry="6.6" fill="#2a1511" /><circle cx="112.4" cy="77.6" r="1.6" fill="#fff" opacity="0.85" /></g>
          </g>
        </g>
        {arm(140, arms.r, 'r')}
        <g className="clay__prop" style={{ opacity: showProp ? 1 : 0 }}><PropArt prop={prop} /></g>
      </svg>
    </div>
  );
}
