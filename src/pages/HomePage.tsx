import { useRef } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HomeHero from '../components/studio/HomeHero';
import WorkBento from '../components/studio/WorkBento';
import AboutBento from '../components/studio/AboutBento';
import ContactComposer from '../components/studio/ContactComposer';
import Trace from '../components/story/Trace';
import ChapterLabel from '../components/story/ChapterLabel';
import TwoReadings from '../components/story/TwoReadings';

/**
 * Home reads as one circuit: power on (hero), translate (parts to patterns), prototypes (work), datasheet (about),
 * pinout (contact). A trace down the left gutter lights up as you scroll and ends at the footer LED.
 */
export default function HomePage() {
  const story = useRef<HTMLDivElement>(null);
  return (
    <>
      <Header />
      <div className="story" ref={story}>
        <Trace boundary={story} />
        <main className="home">
          <div className="story-hero">
            <HomeHero />
            <div className="story-hero__label"><ChapterLabel n="01" name="power on" align="center" /></div>
          </div>
          <TwoReadings />
          <WorkBento />
          <div className="story-about" id="datasheet">
            <div className="story-about__label"><ChapterLabel n="04" name="datasheet" /></div>
            <AboutBento />
          </div>
          <ContactComposer />
        </main>
        <Footer />
      </div>
    </>
  );
}
