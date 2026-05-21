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

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CredibilityStrip />
        <WhyMeSection />
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
