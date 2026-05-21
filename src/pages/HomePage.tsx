import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import CredibilityStrip from '../components/home/CredibilityStrip';
import FeaturedWork from '../components/home/FeaturedWork';
import ProcessSection from '../components/home/ProcessSection';
import AiWorkflowSection from '../components/home/AiWorkflowSection';
import ValidationSection from '../components/home/ValidationSection';
import AboutSection from '../components/home/AboutSection';
import ContactSection from '../components/home/ContactSection';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CredibilityStrip />
        <FeaturedWork />
        <ProcessSection />
        <AiWorkflowSection />
        <ValidationSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
