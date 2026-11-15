import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { profile } from '../../data/profile';
import { experience, skillGroups } from '../../data/home';
import { quirks } from '../../data/quirks';
import MagicSmoke from '../electro/MagicSmoke';
import ResistorBands from '../electro/ResistorBands';
import SpecTable from '../electro/SpecTable';
import BomFilter from '../home/BomFilter';

const clock = () => new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', second: '2-digit' }).format(new Date());

function Tile({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`atile ${className}`}
      initial={reduced ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

const d = quirks.datasheet;

/**
 * About as a friendly datasheet for Vijay: header, description, specifications (real values), features,
 * absolute maximum ratings (jokes), recommended operating conditions, a bill of materials of tools,
 * revision history (the timeline) and the full parts list (skills). Content is in src/data/quirks.ts
 * and src/data/home.ts. The pun is the frame; every spec value is a true statement.
 */
export default function AboutBento() {
  const [now, setNow] = useState(clock);
  useEffect(() => { const id = window.setInterval(() => setNow(clock()), 1000); return () => window.clearInterval(id); }, []);

  return (
    <section className="about el-about" id="about" aria-labelledby="about-h">
      <div className="about__in">
        <div className="el-grid">
          <Tile className="el-t el-t--head">
            <p className="atile__k">{d.kicker}</p>
            <div className="el-head">
              <div className="el-head__title">
                <MagicSmoke label={d.part} />
                <span className="el-head__dot" aria-hidden="true">·</span>
                <h2 id="about-h">{d.title}</h2>
              </div>
              <span className="el-rev">{d.rev}</span>
            </div>
            <p className="el-head__tag">{d.tagline}</p>
            <ResistorBands className="el-head__bands" />
          </Tile>

          <Tile className="el-t el-t--story" delay={0.05}>
            <p className="atile__k">Description</p>
            {d.story.map(p => <p key={p} className="el-story">{p}</p>)}
            <p className="atile__k el-gap">Features</p>
            <ul className="el-feat">{d.features.map(f => <li key={f}>{f}</li>)}</ul>
            <p className="atile__k el-gap">Applications</p>
            <p className="el-story">{profile.aboutBody}</p>
          </Tile>

          <Tile className="atile--clock" delay={0.1}>
            <p className="atile__k">Right now in Hyderabad</p>
            <p className="atile__time" aria-label={`Local time ${now}`}>{now}</p>
            <p className="atile__s"><span aria-hidden="true" />{profile.status}</p>
          </Tile>

          <Tile className="atile--photo" delay={0.15}>
            <img src="/images/profile.jpg" alt={`Portrait of ${profile.name}`} loading="lazy" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </Tile>

          <Tile className="el-t el-t--half">
            <p className="atile__k">Specifications</p>
            <SpecTable rows={d.specs} />
          </Tile>

          <Tile className="el-t el-t--half" delay={0.05}>
            <p className="atile__k">Absolute maximum ratings</p>
            <p className="el-note">Stress beyond these may release magic smoke.</p>
            <SpecTable rows={d.ratings} />
          </Tile>

          <Tile className="el-t el-t--half">
            <p className="atile__k">Recommended operating conditions</p>
            <SpecTable rows={d.conditions} />
          </Tile>

          <Tile className="el-t el-t--half" delay={0.05}>
            <p className="atile__k">Bill of materials</p>
            <BomFilter />
          </Tile>

          <Tile className="el-t el-t--wide atile--time">
            <p className="atile__k">Revision history</p>
            <ul className="jobs">
              {experience.map(e => (
                <li key={e.company}>
                  <span className="jobs__co">{e.company}</span>
                  <span className="jobs__role">{e.role}</span>
                  <span className="jobs__when">{e.period}</span>
                </li>
              ))}
            </ul>
          </Tile>

          <Tile className="el-t el-t--wide atile--skills">
            <p className="atile__k">Full parts list</p>
            <dl>
              {skillGroups.map(g => <div key={g.label}><dt>{g.label}</dt><dd>{g.skills.join(', ')}</dd></div>)}
            </dl>
            <ResistorBands className="el-foot-bands" />
          </Tile>
        </div>
      </div>
    </section>
  );
}
