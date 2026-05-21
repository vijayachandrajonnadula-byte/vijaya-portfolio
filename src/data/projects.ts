export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  status: 'complete' | 'coming-soon' | 'in-progress';
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
    description: 'A healthcare booking case study exploring how patients find doctors, compare availability, select an appointment slot, enter patient details, and manage visits through a clearer product flow.',
    tags: ['UX/UI Design', 'Healthcare', 'Product Flow', 'Design System', 'Testing & Iteration', 'React Prototype', 'AI-assisted Workflow'],
    status: 'complete',
    featured: true,
    href: '/projects/riverside-general',
    prototypeUrl: 'https://hospital-booking-portfolio.vercel.app/',
    githubUrl: 'https://github.com/vijayachandrajonnadula',
    image: '/images/projects/riverside/home.png',
    category: 'Healthcare',
    year: '2026',
    sprint: '14-day sprint',
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
