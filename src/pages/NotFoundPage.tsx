import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Character from '../components/studio/Character';
import '../styles/electro.css';
import '../styles/ask.css';

const COPY = {
  chip: 'Error 404',
  title: 'That page isn’t here.',
  body: 'The link may be old or mistyped. Go back home, or look at the work.',
  home: 'Back to home',
  work: 'See the work',
  switchLabel: 'Flip the switch',
  switchOn: 'Clay’s eyes are brighter. The page is still missing.',
};

/**
 * 404: one primary action (home), one secondary (the work). The small switch is an optional bit of fun, kept quiet and
 * below the actions; closing it lights Clay's eyes. It is a real switch (role=switch, Space/Enter) and announces its result.
 */
export default function NotFoundPage() {
  const [closed, setClosed] = useState(false);
  const h1 = useRef<HTMLHeadingElement>(null);
  // a mistyped URL lands here without a route change from a link, so put the screen-reader cursor on the message
  useEffect(() => { document.title = '404 · Page not found · Vijaya Chandra Jonnadula'; h1.current?.focus({ preventScroll: true }); }, []);
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="ask2-nf">
        <div className="ask2-nf__col">
          <Character size={104} pose={closed ? 'wave' : 'rest'} power={closed ? 'bright' : 'on'} boot track />
          <p className="ask2-nf__chip">{COPY.chip}</p>
          <h1 ref={h1} tabIndex={-1} className="ask2-nf__h">{COPY.title}</h1>
          <p className="ask2-nf__p">{COPY.body}</p>
          <div className="ask2-nf__cta">
            <Link to="/" className="ask2-btn ask2-btn--lg">{COPY.home}</Link>
            <Link to="/#work" className="ask2-btn ask2-btn--lg ask2-btn--secondary">{COPY.work}</Link>
          </div>
          <div className="ask2-nf__fun">
            <button type="button" role="switch" aria-checked={closed} className="ask2-sw" onClick={() => setClosed(c => !c)}>
              <span className="ask2-sw__track" aria-hidden="true"><i /></span>
              <span>{COPY.switchLabel}</span>
            </button>
            <p className="ask2-nf__state" role="status">{closed ? COPY.switchOn : ''}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
