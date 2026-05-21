interface TagProps {
  children: string;
  variant?: 'default' | 'dark' | 'subtle';
}

export default function Tag({ children, variant = 'default' }: TagProps) {
  const cls = variant === 'dark' ? 'tag tag--dark' : variant === 'subtle' ? 'tag tag--subtle' : 'tag';
  return <span className={cls}>{children}</span>;
}
