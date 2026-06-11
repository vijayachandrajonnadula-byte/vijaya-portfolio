import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import CaseStudyPage from './pages/CaseStudyPage';
import RenewlyCaseStudyPage from './pages/RenewlyCaseStudyPage';
import WorkflowCaseStudyPage from './pages/WorkflowCaseStudyPage';
import IllustrationCaseStudyPage from './pages/IllustrationCaseStudyPage';
import AfsCaseStudyPage from './pages/AfsCaseStudyPage';
import ScheduleCaseStudyPage from './pages/ScheduleCaseStudyPage';
import FieldFlowCaseStudyPage from './fieldflow/pages/FieldFlowCaseStudyPage';
import FieldFlowApp from './fieldflow/FieldFlowApp';
import NotFoundPage from './pages/NotFoundPage';

// Scrolls to the hash section whenever the URL hash or pathname changes.
// Retries once after 80ms to handle cross-page nav where the target
// section isn't in the DOM until React has finished rendering the new page.
function ScrollToHash() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    // Target not in DOM yet — wait one render cycle then retry
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
    return () => clearTimeout(t);
  }, [hash, pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/riverside-general" element={<CaseStudyPage />} />
        <Route path="/projects/renewly" element={<RenewlyCaseStudyPage />} />
        <Route path="/projects/ai-assisted-product-workflow" element={<WorkflowCaseStudyPage />} />
        <Route path="/projects/illustration-systems" element={<IllustrationCaseStudyPage />} />
        <Route path="/projects/afs-enterprise-workflow" element={<AfsCaseStudyPage />} />
        <Route path="/projects/zoominfo-schedule" element={<ScheduleCaseStudyPage />} />
        <Route path="/projects/field-flow" element={<FieldFlowCaseStudyPage />} />
        <Route path="/field-flow/*" element={<FieldFlowApp />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
