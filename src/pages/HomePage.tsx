import { useRef } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HomeHero from '../components/studio/HomeHero';
import WorkBento from '../components/studio/WorkBento';
import AboutBento from '../components/studio/AboutBento';
import ContactComposer from '../components/studio/ContactComposer';
import Trace from '../components/story/Trace';
import TwoReadings from '../components/story/TwoReadings';
import '../styles/bands.css';

/**
 * Home, in the order a hiring manager needs it: hero (who, one action), work (the proof), two readings (a short breather
 * that connects electronics to UX and leads into About), about (the person), contact (the one ask).
 * A trace down the left gutter lights up as you scroll, one stop per section, and ends at the footer LED.
 */
export default function HomePage() {
  const story = useRef<HTMLDivElement>(null);
  return (
    <>
      <Header />
      <div className="story" ref={story}>
        <Trace boundary={story} />
        <main className="home">
          <HomeHero />
          <WorkBento />
          <div className="band band--clay band--wipe">
            <TwoReadings />
            <AboutBento />
          </div>
          <ContactComposer />
        </main>
        <Footer />
      </div>
    </>
  );
}
