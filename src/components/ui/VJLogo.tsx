interface VJLogoProps {
  size?: number;
  variant?: 'dark' | 'light';
}

export default function VJLogo({ size = 36, variant = 'dark' }: VJLogoProps) {
  const bg = variant === 'dark' ? '#0B1627' : '#FFFFFF';
  const fg = variant === 'dark' ? '#FFFFFF' : '#0B1627';
  const borderColor = variant === 'light' ? 'rgba(255,255,255,0.15)' : 'transparent';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VJ logo"
    >
      <rect width="36" height="36" rx="8" fill={bg} stroke={borderColor} strokeWidth="1" />
      <text
        x="18"
        y="18"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="15"
        letterSpacing="-0.5"
        fill={fg}
      >
        VJ
      </text>
    </svg>
  );
}
