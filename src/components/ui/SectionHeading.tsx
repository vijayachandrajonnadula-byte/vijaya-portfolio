interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  dark?: boolean;
}

export default function SectionHeading({ label, title, subtitle, align = 'left', dark = false }: SectionHeadingProps) {
  const base = `section-heading${align === 'center' ? ' section-heading--center' : ''}`;
  return (
    <div className={base}>
      {label && <span className={`section-heading__label${dark ? ' section-heading__label--dark' : ''}`}>{label}</span>}
      <h2 className={`section-heading__title${dark ? ' section-heading__title--dark' : ''}`}>{title}</h2>
      {subtitle && <p className={`section-heading__subtitle${dark ? ' section-heading__subtitle--dark' : ''}`}>{subtitle}</p>}
    </div>
  );
}
