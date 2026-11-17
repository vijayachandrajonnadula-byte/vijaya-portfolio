import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '../../data/profile';
import { experience, skillGroups } from '../../data/home';
import { quirks } from '../../data/quirks';
import SpecTable from '../electro/SpecTable';
import ToolFilter from '../electro/ToolFilter';
import { useCalm } from '../../lib/calm';

const d = quirks.datasheet;
// Four facts, the ones a recruiter looks for first (Miller: one small chunk). "Daily tools" lives in the Tools group below.
const GLANCE = d.specs.filter(r => r.k !== 'Daily tools');

const clock = () => new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' }).format(new Date());

/** Quiet local time: minute resolution, no seconds, no pulsing dot (Selective Attention). Text only, so nothing needs a label. */
function LocalTime() {
  const [now, setNow] = useState(clock);
  useEffect(() => { const id = window.setInterval(() => setNow(clock()), 30000); return () => window.clearInterval(id); }, []);
  return <p className="ab-time">{now} in Hyderabad right now</p>;
}

/**
 * About, calmed down. Laws applied: Hick and Miller (two tiles and one button instead of ten tiles), Occam and
 * Tesler (the detail is still there, behind one disclosure, so the work is moved off the first read), Common region
 * (one tile style, one boundary per group), Proximity (24px+ between groups, 8-16px inside), Von Restorff (the
 * photo and the one button are the only emphasis), Pragnanz (plain rows, no hover effects on things that cannot be pressed).
 * 1. About tile: photo, a four-sentence story, four facts.  2. Experience: five rows.
 * 3. One button reveals the rest: works best with, quirks, tools (filter) and skills. Collapsed by default.
 * Content lives in src/data/quirks.ts and src/data/home.ts.
 */
export default function AboutBento() {
  const [open, setOpen] = useState(false);
  const calm = useCalm();
  const panelId = useId();

  return (
    <section className="abt" id="about" aria-labelledby="about-h">
      <div className="abt__in">
        <div className="ab-tile ab-about">
          <div className="ab-photo">
            <img src="/images/profile.jpg" alt={`Portrait of ${profile.name}`} loading="lazy" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div className="ab-about__text">
            <h2 id="about-h" className="ab-h">About me</h2>
            <p className="ab-story">{d.about}</p>
            <p className="ab-status">{profile.status}</p>
            <SpecTable rows={GLANCE} />
            <LocalTime />
          </div>
        </div>

        <div className="ab-tile ab-exp">
          <h3 className="ab-k">Experience</h3>
          <ul className="jobs">
            {experience.slice(0, 5).map(e => (
              <li key={e.company}>
                <span className="jobs__co">{e.company}</span>
                <span className="jobs__role">{e.role}</span>
                <span className="jobs__when">{e.period}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ab-more">
          <button type="button" className="ab-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(o => !o)}>
            <span>{open ? d.more.close : d.more.open}</span>
            <svg className="ab-toggle__chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                key="panel"
                className="ab-panel"
                initial={calm ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={calm ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                transition={calm ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="ab-tile ab-group">
                  <section aria-labelledby={`${panelId}-w`}>
                    <h3 className="ab-k" id={`${panelId}-w`}>Works best with</h3>
                    <SpecTable rows={d.conditions} />
                  </section>
                  <section aria-labelledby={`${panelId}-q`}>
                    <h3 className="ab-k" id={`${panelId}-q`}>Quirks, honestly</h3>
                    <p className="ab-note">Push past these and I get cranky.</p>
                    <SpecTable rows={d.ratings} />
                  </section>
                  <section aria-labelledby={`${panelId}-t`}>
                    <h3 className="ab-k" id={`${panelId}-t`}>Tools</h3>
                    <ToolFilter />
                  </section>
                  <section aria-labelledby={`${panelId}-s`}>
                    <h3 className="ab-k" id={`${panelId}-s`}>Skills</h3>
                    <dl className="ab-skills">
                      {skillGroups.map(g => <div key={g.label}><dt>{g.label}</dt><dd>{g.skills.join(', ')}</dd></div>)}
                    </dl>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
