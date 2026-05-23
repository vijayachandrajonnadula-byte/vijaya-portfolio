export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  status: 'complete' | 'coming-soon' | 'in-progress' | 'process-showcase' | 'creative-showcase';
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
    title: 'Riverside General Hospital Booking',
    subtitle: 'Healthcare · Responsive web app',
    description: 'An end-to-end healthcare booking case study. Patients search for doctors, check availability, pick a slot, and confirm an appointment. Designed and built as a working React prototype you can open and test.',
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
    title: 'Renewly SaaS Renewal Management',
    subtitle: 'SaaS · Responsive · Finance/Admin',
    description: 'A SaaS case study for finance teams managing software renewals. Covers the subscription dashboard, renewal risk view, approval flow, and savings tracker. Tested across desktop and mobile.',
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
    description: 'A behind-the-scenes look at how both portfolio projects were built. Goes from problem framing and Figma design through to a deployed React prototype, with the GitHub workflow, CI checks, and handoff all documented.',
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
    id: 'afs-enterprise-workflow',
    title: 'Account Fit Score (AFS)',
    subtitle: 'Enterprise UX · Admin Portal · ZoomInfo',
    description: 'A confidentiality-aware enterprise case study for an AI-powered account scoring configuration tool built within ZoomInfo\'s Admin Portal. Reconstructed from final Figma UI screens covering the condition builder, data source management, and model retraining workflow.',
    tags: ['Enterprise UX', 'Workflow Design', 'Admin Portal', 'B2B SaaS', 'Configuration UI', 'ZoomInfo', 'Information Architecture', 'Design System'],
    status: 'complete',
    featured: false,
    href: '/projects/afs-enterprise-workflow',
    image: '/images/projects/afs/screens/afs-screen-01.png',
    category: 'Enterprise / B2B',
    year: '2023',
    sprint: 'Company project',
  },
  {
    id: 'illustration-systems',
    title: 'Illustration Systems & Vector Portraits',
    subtitle: 'Creative showcase · Vector illustration',
    description: 'A collection of vector portrait illustrations I have been making for work and personal projects. Company birthday cards, WPAP portraits, and Illustrator artwork, all drawn by hand in Figma and Adobe Illustrator.',
    tags: ['Vector Illustration', 'Figma', 'Adobe Illustrator', 'WPAP', 'Portrait Systems', 'Brand Personality', 'Team Culture', 'Pen Tool Craft'],
    status: 'creative-showcase',
    featured: false,
    href: '/projects/illustration-systems',
    image: '/images/projects/illustration/cover.png',
    category: 'Creative / Illustration',
    year: '2024',
    sprint: 'Creative showcase',
  },
  {
    id: 'northbeam',
    title: 'Northbeam Logistics Console',
    subtitle: 'Internal tool · B2B · Data dense',
    description: 'Operator UI for a small fleet logistics team. Replaces 14 spreadsheet tabs with a single live dispatch view.',
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
    title: 'Bramble Reading App',
    subtitle: 'Mobile · Consumer · iOS · Web',
    description: 'A lightweight reading companion app. Tracks pages read without streaks or pressure.',
    tags: ['Mobile', 'Consumer', 'iOS', 'Web'],
    status: 'coming-soon',
    featured: false,
    href: '#',
    image: '',
    category: 'Consumer apps',
    year: '2026',
  },
];
