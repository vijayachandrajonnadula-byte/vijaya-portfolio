import { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark' | 'dark-outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  external?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  external = false,
  onClick,
  children,
  className = '',
}: ButtonProps) {
  const cls = `btn btn--${variant} btn--${size} ${className}`.trim();
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button className={cls} onClick={onClick} type="button">
      {children}
    </button>
  );
}
