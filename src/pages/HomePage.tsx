import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import CredibilityStrip from '../components/home/CredibilityStrip';
import WhyMeSection from '../components/home/WhyMeSection';
import FeaturedWork from '../components/home/FeaturedWork';
import ProcessSection from '../components/home/ProcessSection';
import AiWorkflowSection from '../components/home/AiWorkflowSection';
import ValidationSection from '../components/home/ValidationSection';
import AboutSection from '../components/home/AboutSection';
import ContactSection from '../components/home/ContactSection';
import Reveal from '../components/motion/Reveal';

// The hero animates on mount; everything below reveals as it enters view.
// <main> is normal block flow, so an extra wrapper element is layout-safe here.
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Reveal y={14}><CredibilityStrip /></Reveal>
        <Reveal><WhyMeSection /></Reveal>
        <Reveal><FeaturedWork /></Reveal>
        <Reveal><ProcessSection /></Reveal>
        <Reveal><AiWorkflowSection /></Reveal>
        <Reveal><ValidationSection /></Reveal>
        <Reveal><AboutSection /></Reveal>
        <Reveal><ContactSection /></Reveal>
      </main>
      <Footer />
    </>
  );
}
