import type { ReactNode } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import NextProject from '../components/case-study/NextProject';
import CaseStudyHero from '../components/case-study/CaseStudyHero';
import CaseStudyNav from '../components/case-study/CaseStudyNav';
import Button from '../components/ui/Button';
import Img from '../components/case-study/Img';
import { imgSize } from '../data/imageSizes';
import { scheduleCaseStudy as cs } from '../data/scheduleCaseStudy';
import '../styles/audit-schedule.css';

const scheduleNavItems = [
  { id: 'snapshot', label: 'Snapshot and how to read' },
  { id: 'problem', label: 'Problem' },
  { id: 'user-flow', label: 'User flow' },
  { id: 'decisions', label: 'Key UX decisions' },
  { id: 'screens', label: 'Screen walkthrough' },
  { id: 'handoff', label: 'Open questions for build' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'reflection', label: 'Reflection' },
  { id: 'appendix', label: 'Appendix' },
];

// Decorative content: hidden from assistive tech and removed from the tab order.
const inertProps = { inert: '' } as Record<string, string>;

function Decorative({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={className} aria-hidden="true" {...inertProps}>
      {children}
    </div>
  );
}

function Appendix({ title, count, children }: { title: string; count: string; children: ReactNode }) {
  return (
    <details className="aud-details">
      <summary className="aud-details__summary">
        <span className="aud-details__title">{title}</span>
        <span className="aud-details__count">{count}</span>
      </summary>
      <div className="aud-details__body">{children}</div>
    </details>
  );
}

type Decision = (typeof cs.decisions)[number];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function DecisionCard({ d }: { d: Decision }) {
  return (
    <article className="aud-decision">
      <div className="aud-decision__head">
        <span className="aud-decision__num">{d.num}</span>
        <h3 className="aud-decision__title">{d.title}</h3>
      </div>
      <p className="aud-decision__basis">
        {d.basis === 'designed' ? 'Designed by Vijay' : 'Observed from the final screens'}
        <span className="aud-decision__screens"> · screens {d.screens}</span>
      </p>
      {d.crop && (
        <div className="aud-crop">
          <Img
            src={d.crop.src}
            alt={d.crop.alt}
            className="aud-crop__img"
            style={{ objectPosition: d.crop.pos }}
            zoom
          />
        </div>
      )}
      <dl className="aud-decision__list">
        <div>
          <dt>On the screens</dt>
          <dd>{d.saw}</dd>
        </div>
        <div>
          <dt>My reading</dt>
          <dd>{d.reading}</dd>
        </div>
        {d.alternative && (
          <div>
            <dt>Alternative</dt>
            <dd>{d.alternative}</dd>
          </div>
        )}
        <div>
          <dt>Instrument and risk</dt>
          <dd>{cap(d.instrument.replace(/^What I would instrument:\s*/, ''))}</dd>
        </div>
      </dl>
    </article>
  );
}

const pillBase = { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 600 } as const;
const selectBox = { background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '3px 6px', fontSize: '9px', color: '#374151' } as const;

// ─── Page component ────────────────────────────────────────────────────────
export default function ScheduleCaseStudyPage() {
  const keyDecisions = cs.decisions.slice(0, 3);
  const otherDecisions = cs.decisions.slice(3);

  return (
    <>
      <Header />
      <main className="case-study-page aud-sch">
        <CaseStudyHero
          title={cs.title}
          subtitle={cs.subtitle}
          tags={cs.tags}
          heroImage="/images/projects/schedule/screens/schedule-07-create-filled.png"
          heroImageAlt="Create Meeting Type form in ZoomInfo Marketing with a filled title, three email reminders and a tooltip explaining the reminder limit."
          prototypeUrlLabel="ZoomInfo Marketing"
          label="Enterprise case study"
          myPart={cs.myPart}
          outcome={cs.outcome}
          statusLabel={cs.statusLabel}
        />

        <div className="cs-layout">
          <CaseStudyNav items={scheduleNavItems} />
          <div className="cs-content">

            {/* 1. SNAPSHOT + the one confidentiality box */}
            <section className="cs-section" id="snapshot">
              <h2 className="cs-section__title">Project snapshot</h2>
              <div className="snapshot-grid snapshot-grid--3">
                {cs.snapshot.map(item => (
                  <div key={item.label} className="snapshot-card">
                    <div className="snapshot-card__label">{item.label}</div>
                    <div className="snapshot-card__value">{item.value}</div>
                  </div>
                ))}
              </div>
              <aside className="aud-note" aria-labelledby="sch-reading">
                <h3 className="aud-note__title" id="sch-reading">{cs.readingNote.title}</h3>
                <ul className="aud-note__list">
                  {cs.readingNote.items.map(i => <li key={i}>{i}</li>)}
                </ul>
              </aside>
            </section>

            {/* 2. PROBLEM */}
            <section className="cs-section" id="problem">
              <h2 className="cs-section__title">Problem</h2>
              <p className="cs-section__body">{cs.overview}</p>
              <p className="cs-section__body">{cs.problem.main}</p>
              <p className="cs-section__body">{cs.problem.detail}</p>
              <div className="afs-highlight-callout">
                <div className="afs-highlight-callout__arrow" aria-hidden="true">→</div>
                <p className="afs-highlight-callout__text">{cs.problem.highlight}</p>
              </div>
            </section>

            {/* 3. USER FLOW */}
            <section className="cs-section" id="user-flow">
              <h2 className="cs-section__title">User flow</h2>
              <p className="cs-section__body">{cs.userFlowDescription}</p>
              <div className="afs-flow-section">
                <div className="afs-flow-label">Path A: manage availability</div>
                <ol className="journey-flow aud-flow">
                  {cs.userFlowAvailability.map((step, i) => (
                    <li key={`a-${i}`} className="journey-flow__step">
                      <span className="journey-flow__label">{step}</span>
                      {i < cs.userFlowAvailability.length - 1 && <span className="journey-flow__arrow" aria-hidden="true">→</span>}
                    </li>
                  ))}
                </ol>
                <div className="afs-flow-label" style={{ marginTop: 'var(--space-6)' }}>Path B: create a meeting type</div>
                <ol className="journey-flow aud-flow">
                  {cs.userFlowCreateMeeting.map((step, i) => (
                    <li key={`b-${i}`} className="journey-flow__step">
                      <span className="journey-flow__label">{step}</span>
                      {i < cs.userFlowCreateMeeting.length - 1 && <span className="journey-flow__arrow" aria-hidden="true">→</span>}
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* 4. KEY DECISIONS */}
            <section className="cs-section" id="decisions">
              <h2 className="cs-section__title">Key UX decisions</h2>
              <p className="cs-section__body">
                Three decisions carry this flow. For each: what is on the screen, my reading of why, an alternative where the screens allow one, and what I would instrument. {otherDecisions.length} smaller decisions are in the appendix.
              </p>
              <div className="aud-decisions">
                {keyDecisions.map(d => <DecisionCard key={d.num} d={d} />)}
              </div>
            </section>

            {/* 5. SCREENS */}
            <section className="cs-section" id="screens">
              <h2 className="cs-section__title">Screen walkthrough</h2>
              <p className="cs-section__body">
                The {cs.screens.length} distinct final screens in flow order. Select a screen to open it at full size.
              </p>
              <div className="aud-screens">
                {cs.screens.map(screen => (
                  <figure key={screen.num} className="aud-screen">
                    <div className="aud-screen__frame">
                      <Img
                        src={screen.src}
                        {...imgSize(screen.src)}
                        alt={screen.alt}
                        className="aud-screen__img"
                        zoom
                      />
                    </div>
                    <figcaption className="aud-screen__caption">
                      <span className="aud-screen__num">{screen.num}</span>
                      <p className="aud-screen__text">
                        <strong>{screen.lead}</strong> {screen.body}
                      </p>
                      <details className="aud-mini">
                        <summary>Elements on this screen ({screen.keyElements.length})</summary>
                        <ul>
                          {screen.keyElements.map(el => <li key={el}>{el}</li>)}
                        </ul>
                      </details>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>

            {/* 6. HANDOFF */}
            <section className="cs-section" id="handoff">
              <h2 className="cs-section__title">Open questions for build</h2>
              <p className="cs-section__body">Questions the design raises that need answers before development, mostly about state, edge cases and backend behavior the screens do not show.</p>
              <div className="cs-cards-grid cs-cards-grid--2">
                {cs.handoff.map(card => (
                  <div key={card.title} className="cs-card">
                    <div className="cs-card__title">{card.title}</div>
                    <p className="cs-card__body">{card.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. LIMITATIONS */}
            <section className="cs-section" id="limitations">
              <h2 className="cs-section__title">Limitations</h2>
              <div className="limitations-box">
                <div className="limitations-list">
                  {cs.limitations.map(item => (
                    <div key={item} className="limitations-item">
                      <span className="limitations-item__dot"><span className="limitations-item__dot-inner" /></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 8. REFLECTION */}
            <section className="cs-section" id="reflection">
              <h2 className="cs-section__title">Reflection</h2>
              <p className="cs-section__body">{cs.reflection}</p>
            </section>

            {/* 9. APPENDIX */}
            <section className="cs-section" id="appendix">
              <h2 className="cs-section__title">Appendix</h2>
              <p className="cs-section__body">Supporting detail, collapsed. Everything here stays in the page and opens with the keyboard.</p>

              <Appendix title="Smaller decisions" count={`${otherDecisions.length} decisions`}>
                <div className="aud-decisions">
                  {otherDecisions.map(d => <DecisionCard key={d.num} d={d} />)}
                </div>
              </Appendix>

              <Appendix title="Users and tasks, inferred" count={`${cs.users.length} groups`}>
                <div className="afs-users-grid">
                  {cs.users.map(user => (
                    <div key={user.type} className="afs-user-card">
                      <div className="afs-user-card__type">{user.type} users</div>
                      <div className="afs-user-card__label">{user.label}</div>
                      <p className="afs-user-card__desc">{user.description}</p>
                      <div className="afs-user-card__tasks-label">Core tasks</div>
                      <ul className="afs-user-card__tasks">
                        {user.tasks.map(task => (
                          <li key={task} className="afs-user-card__task">
                            <span className="afs-user-card__task-dot" aria-hidden="true" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Appendix>

              <Appendix title="Information architecture" count="1 outline">
                <p className="cs-section__body">{cs.iaDescription}</p>
                <div className="afs-feature-tree">
                  {cs.iaTree.map(item => (
                    <div
                      key={item.label}
                      className={`afs-feature-tree__item afs-feature-tree__item--indent-${Math.min(item.level, 5)}${'active' in item && item.active ? ' afs-feature-tree__item--active' : ''}`}
                    >
                      <span className="afs-feature-tree__dot" aria-hidden="true" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </Appendix>

              <Appendix title="Design system tiles" count="9 tiles">
                <p className="cs-section__body">{cs.designSystemDescription} Each tile is a decorative redrawing, hidden from assistive technology, with a caption saying what it shows.</p>
                <div className="afs-ds-grid">

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div className="afs-ds-palette" style={{ width: '100%' }}>
                        {cs.designSystemColors.map(c => (
                          <div key={c.hex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="afs-ds-swatch" style={{ background: c.hex }} />
                            <div className="afs-ds-swatch-hex">{c.hex}</div>
                          </div>
                        ))}
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">
                      Approximate colors, estimated from screenshots, not extracted from Figma: {cs.designSystemColors.map(c => `${c.name} ${c.hex}`).join('; ')}.
                    </figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div className="afs-ds-type-stack">
                        <div className="afs-ds-type-h">Manage Default Availability</div>
                        <div className="afs-ds-type-sub">Calendar Settings / Manage Default Availability</div>
                        <div className="afs-ds-type-body">These available hours will be displayed to potential clients for scheduling appointments with you.</div>
                        <div className="afs-ds-type-chip">Work Hours Availability</div>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Type roles: heading, breadcrumb, body, label.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                          <div style={{ width: '16px', height: '16px', background: '#1E3A6E', borderRadius: '3px', flexShrink: 0 }} />
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#0F172A' }}>Marketing</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
                          {['Dashboard', 'Audiences', 'Advertising', 'Buying Signals', 'Conversion', 'Workflows', 'Lists'].map(item => (
                            <span key={item} style={{ fontSize: '8px', color: '#374151', whiteSpace: 'nowrap' }}>{item}</span>
                          ))}
                        </div>
                        <div style={{ marginTop: '6px', borderTop: '1px solid #E5E7EB', paddingTop: '4px', display: 'flex', gap: '8px' }}>
                          {['My Account', 'Integrations', 'Customisation', 'Calendar Settings'].map((tab, i) => (
                            <span key={tab} style={{ fontSize: '7px', color: i === 3 ? '#1B7AFF' : '#6B7280', fontWeight: i === 3 ? 700 : 400, borderBottom: i === 3 ? '1.5px solid #1B7AFF' : 'none', paddingBottom: '2px', whiteSpace: 'nowrap' }}>{tab}</span>
                          ))}
                        </div>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Two-level header: product navigation above Settings tabs.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[{ d: 'Sun', a: false }, { d: 'Mon', a: true }, { d: 'Tue', a: true }, { d: 'Wed', a: true }, { d: 'Thu', a: true }, { d: 'Fri', a: true }, { d: 'Sat', a: false }].map(({ d, a }) => (
                          <div key={d} style={{ ...pillBase, background: 'white', color: a ? '#1B7AFF' : '#6B7280', border: a ? '1px solid #1B7AFF' : '1px solid #D1D5DB' }}>{d}</div>
                        ))}
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Day pills: Monday to Friday active, Sunday and Saturday inactive.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 16px 16px', gap: '4px', alignItems: 'center', width: '100%' }}>
                        <span style={{ fontSize: '9px', fontWeight: 600, color: '#374151' }}>Mon</span>
                        <div style={selectBox}>9:00 AM ▾</div>
                        <div style={selectBox}>12:00 PM ▾</div>
                        <span style={{ fontSize: '12px', color: '#1B7AFF', textAlign: 'center' }}>+</span>
                        <span />
                        <span />
                        <div style={selectBox}>2:00 PM ▾</div>
                        <div style={selectBox}>5:00 PM ▾</div>
                        <span />
                        <span style={{ fontSize: '10px', color: '#6B7280', textAlign: 'center' }}>🗑</span>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Time slot rows: a split shift with add and remove controls.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '3px 6px', width: '100%', fontSize: '9px' }}>
                        <span style={{ color: '#374151' }}>Send email</span>
                        <span style={{ background: 'white', border: '1px solid #E5E7EB', padding: '1px 4px', borderRadius: '3px', color: '#374151' }}>30</span>
                        <span style={{ background: 'white', border: '1px solid #E5E7EB', padding: '1px 4px', borderRadius: '3px', color: '#374151' }}>Minutes ▾</span>
                        <span style={{ color: '#374151' }}>before</span>
                        <span style={{ marginLeft: 'auto', color: '#1B7AFF', fontSize: '8px' }}>Edit email</span>
                      </div>
                      <div className="aud-sch-disabled" style={{ fontSize: '9px' }}>+ Add new reminder</div>
                      <div style={{ fontSize: '8px', background: '#1F2937', color: 'white', padding: '2px 6px', borderRadius: '3px' }}>Only 3 reminders are possible</div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Reminder row, and the disabled add link with its limit tooltip.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '200px' }}>
                        <span style={{ fontSize: '10px', color: '#374151', flex: 1 }}>Email Reminders</span>
                        <div style={{ width: '28px', height: '16px', background: '#1B7AFF', borderRadius: '8px', position: 'relative' }}>
                          <div style={{ position: 'absolute', right: '2px', top: '2px', width: '12px', height: '12px', background: 'white', borderRadius: '50%' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', maxWidth: '200px' }}>
                        <div style={{ width: '12px', height: '12px', background: '#1B7AFF', borderRadius: '2px', flexShrink: 0 }} />
                        <span style={{ fontSize: '9px', color: '#374151' }}>Include cancel and reschedule links</span>
                      </div>
                      <div className="cd-btn-pair">
                        <span className="cd-btn-ghost">Cancel</span>
                        <span className="cd-btn-primary">Save</span>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Toggle, checkbox and the Cancel and Save pair.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px', background: 'white', width: '100%', maxWidth: '240px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#0F172A' }}>Product Related Queries</span>
                          <span style={{ fontSize: '12px', color: '#6B7280' }}>···</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', margin: '6px 0 8px', flexWrap: 'wrap' }}>
                          {['Zoom', '3 Reminders', '30 Mins'].map(chip => (
                            <span key={chip} style={{ fontSize: '8px', color: '#6B7280' }}>{chip}</span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid #E5E7EB', paddingTop: '6px' }}>
                          <span style={{ fontSize: '8px', color: '#1B7AFF' }}>Share slots</span>
                          <span style={{ fontSize: '8px', background: '#F3F4F6', color: '#374151', padding: '1px 6px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>Copy booking URL ▾</span>
                        </div>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Meeting type card: title, chips and sharing actions.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div style={{ background: '#1F2937', borderRadius: '6px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', maxWidth: '220px' }}>
                        <span style={{ color: '#4ADE80', fontSize: '12px' }}>✓</span>
                        <span style={{ fontSize: '9px', color: 'white', flex: 1 }}>Default Availability has been changed successfully</span>
                        <span style={{ color: '#D1D5DB', fontSize: '10px' }}>✕</span>
                      </div>
                      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '8px 10px', width: '100%', maxWidth: '220px' }}>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: '#0F172A', marginBottom: '3px' }}>Discard Meeting Type?</div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                          <span style={{ fontSize: '8px', border: '1px solid #E5E7EB', padding: '2px 6px', borderRadius: '3px', color: '#374151' }}>Cancel</span>
                          <span style={{ fontSize: '8px', background: '#1B7AFF', color: 'white', padding: '2px 6px', borderRadius: '3px' }}>Discard</span>
                        </div>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Dark toast and a confirmation modal.</figcaption>
                  </figure>
                </div>
              </Appendix>

              <Appendix title="Component patterns" count={`${cs.componentPatterns.length} patterns`}>
                <div className="cs-cards-grid">
                  {cs.componentPatterns.map(comp => (
                    <div key={comp.name} className="cs-card">
                      <div className="cs-card__title">{comp.name}</div>
                      <p className="cs-card__body">{comp.description}</p>
                      <div className="afs-comp-usage" style={{ marginTop: 'auto', paddingTop: 'var(--space-3)' }}>
                        <span className="afs-comp-usage__label">Used for</span>
                        <span className="afs-comp-usage__text">{comp.usage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Appendix>

              <Appendix title="Notes for build: accessibility" count={`${cs.notesForBuild.length} notes`}>
                <p className="cs-section__body">Checks to make when this is built. None of these is claimed as implemented.</p>
                <ul className="aud-notes">
                  {cs.notesForBuild.map(n => (
                    <li key={n.text}>
                      <span>{n.text}</span>
                      <span className="aud-notes__sc">{n.criteria}</span>
                    </li>
                  ))}
                </ul>
              </Appendix>
            </section>

            <div className="cs-cta-section">
              <h3 className="cs-cta-section__title">Explore more product and process work</h3>
              <p className="cs-cta-section__body">Other case studies cover enterprise configuration design and design-to-prototype workflows.</p>
              <div className="cs-cta-section__actions">
                <Button href="/projects/afs-enterprise-workflow">AFS enterprise case study</Button>
                <Button href="/projects/riverside-general" variant="ghost">Riverside General</Button>
                <Button href="/projects/renewly" variant="ghost">Renewly SaaS</Button>
              </div>
            </div>

          </div>
        </div>
      </main>
      <NextProject />
      <Footer />
    </>
  );
}
