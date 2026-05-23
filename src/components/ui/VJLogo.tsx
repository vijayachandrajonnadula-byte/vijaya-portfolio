interface VJLogoProps {
  size?: number;
  variant?: 'dark' | 'light';
}

export default function VJLogo({ size = 36, variant = 'dark' }: VJLogoProps) {
  const bg = variant === 'light' ? '#FFFFFF' : '#0B1627';
  const letterStroke = variant === 'light' ? '#0B1627' : '#FFFFFF';
  const borderColor = variant === 'light' ? 'rgba(11,22,39,0.12)' : 'rgba(255,255,255,0.07)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VJ logo"
    >
      {/* Background rounded square */}
      <rect width="40" height="40" rx="10" fill={bg} stroke={borderColor} strokeWidth="1" />

      {/*
        Connected V·J monogram — the right arm of V flows directly
        into the vertical stem of J, then curves into the J hook.
        Reading path: V left arm → V right arm → J stem → J hook
      */}
      <path
        d="M 7 11 L 19.5 29.5 L 32 11 L 32 27 Q 32 35 23.5 35"
        stroke={letterStroke}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Accent dot — visual anchor at the V base / designer's mark */}
      <circle cx="19.5" cy="29.5" r="2.4" fill="#2563EB" />
    </svg>
  );
}
