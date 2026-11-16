import type { ReactNode } from 'react';

/** Small schematic symbols, drawn with currentColor so they follow the theme. */
function Sym({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 36" width="72" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

export function ResistorSym({ className }: { className?: string }) {
  return <Sym className={className}><path d="M2 18H14L18 9L26 27L34 9L42 27L50 9L54 18H70" /></Sym>;
}

export function FuseSym({ className, blown = false }: { className?: string; blown?: boolean }) {
  return (
    <Sym className={className}>
      <path d="M2 18H14M58 18H70" />
      <rect x="14" y="9" width="44" height="18" rx="5" />
      {blown ? <path d="M22 18H32M42 18H50" /> : <path d="M22 18H50" />}
      {blown ? <path d="M35 14L37 22" className="parts-spark" /> : null}
    </Sym>
  );
}

export function SwitchSym({ className }: { className?: string }) {
  return (
    <Sym className={className}>
      <path d="M2 24H16M56 24H70" />
      <circle cx="19" cy="24" r="3" />
      <circle cx="53" cy="24" r="3" />
      <path d="M21 22L50 8" />
      <path d="M58 8l3 -3M62 12l4 -2" opacity=".6" />
    </Sym>
  );
}

export function CapacitorSym({ className }: { className?: string }) {
  return (
    <Sym className={className}>
      <path d="M2 18H30M42 18H70" />
      <path d="M30 6V30M42 6V30" />
    </Sym>
  );
}

export function LedSym({ className }: { className?: string }) {
  return (
    <Sym className={className}>
      <path d="M2 22H22M44 22H70" />
      <path d="M22 11V33L44 22Z" />
      <path d="M44 11V33" />
      <path d="M32 8L40 1M38 11L46 4" />
    </Sym>
  );
}

export function ToleranceSym({ className }: { className?: string }) {
  return (
    <Sym className={className}>
      <path d="M2 18H14M58 18H70" />
      <rect x="14" y="9" width="44" height="18" rx="6" />
      <path d="M24 9V27M31 9V27M38 9V27" />
      <path d="M49 9V27" strokeWidth="3.5" className="parts-band" />
    </Sym>
  );
}
