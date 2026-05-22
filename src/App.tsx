import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CaseStudyPage from './pages/CaseStudyPage';
import RenewlyCaseStudyPage from './pages/RenewlyCaseStudyPage';
import WorkflowCaseStudyPage from './pages/WorkflowCaseStudyPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/riverside-general" element={<CaseStudyPage />} />
        <Route path="/projects/renewly" element={<RenewlyCaseStudyPage />} />
        <Route path="/projects/ai-assisted-product-workflow" element={<WorkflowCaseStudyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
