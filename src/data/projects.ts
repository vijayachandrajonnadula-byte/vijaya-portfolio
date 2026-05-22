export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  status: 'complete' | 'coming-soon' | 'in-progress' | 'process-showcase';
  featured: boolean;
  href: string;
  prototypeUrl?: string;
  githubUrl?: string;
  image: string;
  category: string;
  year: string;
  sprint?: string;
}

export const projects: Project[] = [
  {
    id: 'riverside-general',
    title: 'Riverside General — Hospital Appointment Booking Platform',
    subtitle: 'Healthcare · Responsive web app',
    description: 'A healthcare booking case study: how patients find doctors, compare availability, select a slot, and confirm an appointment — built end-to-end as a working React prototype.',
    tags: ['UX/UI Design', 'Healthcare', 'Product Flow', 'Design System', 'Testing & Iteration', 'React Prototype', 'AI-assisted Workflow'],
    status: 'complete',
    featured: true,
    href: '/projects/riverside-general',
    prototypeUrl: 'https://hospital-booking-portfolio.vercel.app/',
    githubUrl: 'https://github.com/vijayachandrajonnadula-byte/hospital-booking-portfolio',
    image: '/images/projects/riverside/clean/desktop-home.png',
    category: 'Healthcare',
    year: '2026',
    sprint: '14-day sprint',
  },
  {
    id: 'renewly',
    title: 'Renewly — SaaS Renewal Management',
    subtitle: 'SaaS · Responsive · Finance/Admin',
    description: 'A SaaS renewal management case study for finance teams — subscription overview, renewal risk, approval decisions, and savings opportunities across desktop and mobile.',
    tags: ['UX/UI Design', 'SaaS Dashboard', 'Responsive Product Design', 'Design System', 'Product Flow', 'React Prototype', 'AI-assisted Workflow'],
    status: 'complete',
    featured: false,
    href: '/projects/renewly',
    prototypeUrl: 'https://renewly-ux.vercel.app/',
    githubUrl: 'https://github.com/vijayachandrajonnadula-byte/renewly-ux',
    image: '/images/projects/renewly/clean/desktop-dashboard.png',
    category: 'SaaS / Product',
    year: '2026',
    sprint: 'Portfolio sprint',
  },
  {
    id: 'ai-workflow',
    title: 'AI-Assisted Product Build Workflow',
    subtitle: 'Process showcase · Workflow documentation',
    description: 'A process showcase documenting how I move from research and UI references to a working prototype — VS Code, AI coding agents, GitHub PRs, CI checks, and Vercel deployment, all documented end-to-end.',
    tags: ['Product Workflow', 'AI-assisted Build', 'VS Code', 'GitHub PRs', 'CI/CD', 'React Prototype', 'Documentation', 'Handoff'],
    status: 'process-showcase',
    featured: false,
    href: '/projects/ai-assisted-product-workflow',
    image: '/images/projects/ai-workflow/cover.png',
    category: 'Process / Workflow',
    year: '2026',
    sprint: 'Process showcase',
  },
  {
    id: 'northbeam',
    title: 'Northbeam — Logistics Operator Console',
    subtitle: 'Internal tool · B2B · Data dense',
    description: 'Operator UI for a small fleet logistics team — replacing 14 tabs of spreadsheets with a single live dispatch view.',
    tags: ['Internal tool', 'B2B', 'Data dense'],
    status: 'coming-soon',
    featured: false,
    href: '#',
    image: '',
    category: 'Internal tools',
    year: '2026',
  },
  {
    id: 'bramble',
    title: 'Bramble — Reading Habit App',
    subtitle: 'Mobile · Consumer · iOS · Web',
    description: 'Streak-light reading companion — tracks pages without making the user feel watched.',
    tags: ['Mobile', 'Consumer', 'iOS', 'Web'],
    status: 'coming-soon',
    featured: false,
    href: '#',
    image: '',
    category: 'Consumer apps',
    year: '2026',
  },
];
