import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { isCalm, useCalm } from './lib/calm';
import HomePage from './pages/HomePage';
import CaseStudyPage from './pages/CaseStudyPage';
import RenewlyCaseStudyPage from './pages/RenewlyCaseStudyPage';
import WorkflowCaseStudyPage from './pages/WorkflowCaseStudyPage';
import IllustrationCaseStudyPage from './pages/IllustrationCaseStudyPage';
import AfsCaseStudyPage from './pages/AfsCaseStudyPage';
import ScheduleCaseStudyPage from './pages/ScheduleCaseStudyPage';
import CareSyncCaseStudyPage from './pages/CareSyncCaseStudyPage';
import NotFoundPage from './pages/NotFoundPage';
import PulseCaseStudyPage from './pages/PulseCaseStudyPage';
import ExecutionCaseStudyPage from './pages/ExecutionCaseStudyPage';
import AskPage from './pages/AskPage';
import Guide from './components/studio/Guide';
import SmoothScroll from './components/motion/SmoothScroll';
import ScrollProgress from './components/motion/ScrollProgress';
import CursorLabel from './components/motion/CursorLabel';
import { getRouteMeta } from './data/meta';
import './styles/a11y.css';

// Per-route title, description, Open Graph tags, canonical and robots.
function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) { el = create(); document.head.appendChild(el); }
  el.setAttribute(attr, value);
}
const metaTag = (key: 'name' | 'property', k: string) => () => { const m = document.createElement('meta'); m.setAttribute(key, k); return m; };

// Applies the page meta, gives the first <main> an id for the skip link, moves focus to the page heading after
// a route change (without scrolling), and announces the new page politely.
function RouteMeta() {
  const { pathname, hash } = useLocation();
  const first = useRef('');
  const [announce, setAnnounce] = useState('');
  useEffect(() => {
    const m = getRouteMeta(pathname);
    document.title = m.title;
    setTag('meta[name="description"]', metaTag('name', 'description'), 'content', m.description);
    setTag('meta[property="og:title"]', metaTag('property', 'og:title'), 'content', m.title);
    setTag('meta[property="og:description"]', metaTag('property', 'og:description'), 'content', m.description);
    setTag('meta[property="og:type"]', metaTag('property', 'og:type'), 'content', pathname === '/' || pathname === '/classic' ? 'website' : 'article');
    setTag('meta[property="og:url"]', metaTag('property', 'og:url'), 'content', window.location.origin + pathname);
    setTag('meta[name="twitter:card"]', metaTag('name', 'twitter:card'), 'content', 'summary');
    setTag('link[rel="canonical"]', () => { const l = document.createElement('link'); l.rel = 'canonical'; return l; }, 'href', window.location.origin + pathname);
    if (m.noindex) setTag('meta[name="robots"]', metaTag('name', 'robots'), 'content', 'noindex');
    else document.head.querySelector('meta[name="robots"]')?.remove();

    const main = document.querySelector('main');
    if (main) { main.id = 'main'; main.setAttribute('tabindex', '-1'); }
    // only after a real navigation (not the first paint, and not the StrictMode re-run of the same path)
    const prev = first.current;
    first.current = pathname;
    if (prev === pathname || prev === '') return;
    if (hash) return; // an in-page link: ScrollToHash handles it
    const h1 = document.querySelector<HTMLElement>('main h1');
    const target = h1 || main;
    if (target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    setAnnounce(m.title);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div className="vj-live" role="status" aria-live="polite" aria-atomic="true">{announce}</div>;
}

function SkipLink() {
  return (
    <a
      className="skip-link"
      href="#main"
      onClick={e => {
        const main = document.getElementById('main') || document.querySelector<HTMLElement>('main');
        if (!main) return;
        e.preventDefault();
        main.focus({ preventScroll: true });
        main.scrollIntoView({ block: 'start' });
      }}
    >
      Skip to main content
    </a>
  );
}

// Scrolls to the hash section whenever the URL hash or navigation key changes.
// location.key changes on every navigation, so clicking the same link twice scrolls twice.
// Retries once after 80ms to handle cross-page nav where the target
// section isn't in the DOM until React has finished rendering the new page.
function ScrollToHash() {
  const { hash, pathname, key } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    // Prefer Lenis when active so native smooth-scroll does not fight it.
    const go = (el: HTMLElement) => {
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72 });
      else el.scrollIntoView({ behavior: isCalm() ? 'auto' : 'smooth' });
    };
    const el = document.getElementById(id);
    if (el) {
      go(el);
      return;
    }
    // Target not in DOM yet — wait one render cycle then retry
    const t = setTimeout(() => {
      const late = document.getElementById(id);
      if (late) go(late);
    }, 80);
    return () => clearTimeout(t);
  }, [hash, pathname, key]);
  return null;
}

// Tells the stylesheet which kind of page this is. Home and the ask page follow the theme; the PULSE and Electronic execution case studies follow the theme, the other case studies are light only for now.
function PageMode() {
  const { pathname } = useLocation();
  useEffect(() => { document.documentElement.dataset.page = pathname.startsWith('/projects/') && pathname !== '/projects/pulse-design-system' && pathname !== '/projects/electronic-execution' ? 'case' : 'home'; }, [pathname]);
  return null;
}

// A short cross-fade on route change. Keyed on pathname so each page fades in
// on its own; there is no exit animation, so navigation never feels delayed.
function RouteFade({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const reduced = useCalm();
  return (
    <motion.div
      key={pathname}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// The v2 film (VIJAY.md) at `/` brings its own chrome: its own skip link, HUD and scroll handling. The v1 chrome
// (skip link, scroll progress, cursor label, Guide, smooth-scroll switch) stays on /classic, /ask and the case studies.
function V1Chrome({ part }: { part: 'top' | 'guide' }) {
  const { pathname } = useLocation();
  if (pathname === '/') return null;
  return part === 'top'
    ? <><SkipLink /><SmoothScroll /><ScrollProgress /><CursorLabel /></>
    : <Guide />;
}

const V2App = lazy(() => import('./v2/V2App'));

export default function App() {
  // Calm mode (header switch, or the system's reduced-motion setting): every framer-motion component behaves as reduced motion.
  const calm = useCalm();
  return (
    <MotionConfig reducedMotion={calm ? 'always' : 'user'}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <V1Chrome part="top" />
      <RouteMeta />
      <PageMode />
      <ScrollToHash />
      <RouteFade>
      <Routes>
        <Route path="/" element={<Suspense fallback={<div style={{ minHeight: '100vh', background: '#FAF9F7' }} />}><V2App /></Suspense>} />
        <Route path="/classic" element={<HomePage />} />
        <Route path="/ask" element={<AskPage />} />
        <Route path="/projects/riverside-general" element={<CaseStudyPage />} />
        <Route path="/projects/renewly" element={<RenewlyCaseStudyPage />} />
        <Route path="/projects/ai-assisted-product-workflow" element={<WorkflowCaseStudyPage />} />
        <Route path="/projects/illustration-systems" element={<IllustrationCaseStudyPage />} />
        <Route path="/projects/afs-enterprise-workflow" element={<AfsCaseStudyPage />} />
        <Route path="/projects/zoominfo-schedule" element={<ScheduleCaseStudyPage />} />
        <Route path="/projects/caresync" element={<CareSyncCaseStudyPage />} />
        <Route path="/projects/pulse-design-system" element={<PulseCaseStudyPage />} />
        <Route path="/projects/electronic-execution" element={<ExecutionCaseStudyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </RouteFade>
      <V1Chrome part="guide" />
    </BrowserRouter>
    </MotionConfig>
  );
}
