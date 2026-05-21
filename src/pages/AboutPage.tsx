import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AboutSection from '../components/home/AboutSection';
import ContactSection from '../components/home/ContactSection';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="page-wrap">
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
