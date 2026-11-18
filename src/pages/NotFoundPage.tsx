import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Character from '../components/studio/Character';
import { quirks } from '../data/quirks';
import '../styles/electro.css';

const q = quirks.notFound;

/** An open circuit. Close the switch and the LED lights, and Clay's eyes brighten. */
export default function NotFoundPage() {
  const [closed, setClosed] = useState(false);
  return (
    <>
      <Header />
      <main className="page-wrap">
        <div className="not-found el-nf" data-closed={closed}>
          <Character size={132} pose={closed ? 'wave' : 'rest'} power={closed ? 'bright' : 'on'} boot track label="Clay, the site’s mascot" />
          <div className="not-found__code">{q.code}</div>
          <p className="el-nf__kicker">{q.kicker}</p>
          <h1 className="not-found__title">{q.title}</h1>
          <p className="not-found__body">{q.body}</p>

          <button type="button" role="switch" aria-checked={closed} className="el-circuit" onClick={() => setClosed(c => !c)}>
            <svg viewBox="0 0 260 110" width="260" height="110" aria-hidden="true" focusable="false">
              <g className="el-circuit__wire" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M30 52V22H84" className="el-circuit__r" />
                <path d="M136 22H200V42" className="el-circuit__r" />
                <path d="M200 70V90H30V62" className="el-circuit__r" />
              </g>
              <g className="el-circuit__bat" strokeWidth="3" strokeLinecap="round">
                <path d="M19 52h22" />
                <path d="M24 60h12" />
              </g>
              <circle cx="84" cy="22" r="4" className="el-circuit__pin" />
              <circle cx="136" cy="22" r="4" className="el-circuit__pin" />
              <line x1="84" y1="22" x2="132" y2="22" className="el-circuit__lever" />
              <circle cx="200" cy="56" r="14" className="el-circuit__halo" />
              <circle cx="200" cy="56" r="10" className="el-circuit__led" />
            </svg>
            <span className="el-circuit__label">{closed ? q.switchClosed : q.switchOpen}</span>
          </button>
          <p className="el-nf__state" role="status">{closed ? q.closed : q.open}</p>

          <div className="el-nf__cta">
            <Button href="/" size="lg">{q.home}</Button>
            <Button href="/#work" size="lg" variant="secondary">{q.work}</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
