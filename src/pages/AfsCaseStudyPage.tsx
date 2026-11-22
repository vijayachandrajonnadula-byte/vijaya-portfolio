import type { ReactNode } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import NextProject from '../components/case-study/NextProject';
import CaseStudyHero from '../components/case-study/CaseStudyHero';
import CaseStudyNav from '../components/case-study/CaseStudyNav';
import Button from '../components/ui/Button';
import Img from '../components/case-study/Img';
import { imgSize } from '../data/imageSizes';
import { afsCaseStudy as cs } from '../data/afsCaseStudy';
import '../styles/audit-afs.css';

const afsNavItems = [
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

// ─── Reconstruction sketches (decorative, labeled) ────────────────────────
function renderSketch(key: string) {
  switch (key) {
    case 'csv':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span /><span /><span /></div>
            <div className="afs-wf-breadcrumb">Account Fit Score (AFS) / Configure (file)</div>
            <div className="afs-wf-actions"><span className="afs-wf-btn-ghost">Cancel</span><span className="afs-wf-btn-primary">Save Configuration</span></div>
          </div>
          <div className="afs-wf-body">
            <div className="afs-wf-content afs-wf-content--full">
              <div className="afs-wf-heading">Configure Account Fit Score (AFS)</div>
              <div className="afs-wf-upload-area">
                <div className="afs-wf-upload-icon">☁</div>
                <div className="afs-wf-upload-label">Drag and drop a file here<br />or browse files</div>
              </div>
              <div className="afs-wf-toggle-row">Auto-update AFS model <span className="afs-wf-toggle">●</span></div>
            </div>
          </div>
        </div>
      );
    case 'datasource':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span /><span /><span /></div>
            <div className="afs-wf-breadcrumb">Change data source</div>
          </div>
          <div className="afs-wf-body">
            <div className="afs-wf-content afs-wf-content--full">
              <div className="afs-wf-heading">Change data source</div>
              <div className="afs-wf-option-cards">
                <div className="afs-wf-option" style={{ border: '1.5px solid #1B7AFF', background: '#EFF6FF' }}>
                  <div className="afs-wf-option__icon">CRM</div>
                  <div className="afs-wf-option__label">Salesforce</div>
                </div>
                <div className="afs-wf-option">
                  <div className="afs-wf-option__icon">CSV</div>
                  <div className="afs-wf-option__label">Upload a file</div>
                </div>
              </div>
              <div className="afs-wf-actions-center">
                <span className="afs-wf-btn-ghost">Cancel</span>
                <span className="afs-wf-btn-primary">Confirm</span>
              </div>
            </div>
          </div>
        </div>
      );
    case 'error':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span /><span /><span /></div>
            <div className="afs-wf-breadcrumb">Account Fit Score (AFS) / Configure</div>
          </div>
          <div className="afs-wf-body">
            <div className="afs-wf-content afs-wf-content--full">
              <div className="afs-wf-empty-state">
                <div className="afs-wf-empty-icon">⚠</div>
                <div className="afs-wf-empty-title">Salesforce not integrated</div>
                <div className="afs-wf-empty-body">Explanation and next step go here.</div>
                <div className="afs-wf-btn-primary afs-wf-btn-center">Primary action</div>
              </div>
            </div>
          </div>
        </div>
      );
    case 'retrain':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span /><span /><span /></div>
            <div className="afs-wf-breadcrumb">Retrain model</div>
          </div>
          <div className="afs-wf-body">
            <div className="afs-wf-content afs-wf-content--full">
              <div className="afs-wf-heading">Retrain AFS model</div>
              <div className="afs-wf-info-list">
                <div className="afs-wf-info-row">Last trained: [date]</div>
                <div className="afs-wf-info-row">Conditions: [n]</div>
                <div className="afs-wf-info-row">Data source: [source]</div>
              </div>
              <div className="afs-wf-actions-row">
                <span className="afs-wf-btn-ghost">Cancel</span>
                <span className="afs-wf-btn-primary">Start retraining</span>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

const sketches = [
  { key: 'csv', label: 'File source: configure', purpose: 'The canvas has a separate "AFS Configuration (CSV)" group. Layout here is a guess at the same shell with an upload area.' },
  { key: 'datasource', label: 'Change data source', purpose: 'The canvas has a "Change Data Source" group, and the row menu on screen 12 offers this action.' },
  { key: 'error', label: 'Salesforce not integrated', purpose: 'The canvas has a "Salesforce not integrated" group. Copy here is placeholder.' },
  { key: 'retrain', label: 'Retrain model', purpose: 'Screen 11 has a Retrain Model button, and the canvas has a "Retrain Model" group.' },
];

// ─── Page component ────────────────────────────────────────────────────────
export default function AfsCaseStudyPage() {
  const keyDecisions = cs.decisions.slice(0, 3);
  const otherDecisions = cs.decisions.slice(3);

  return (
    <>
      <Header />
      <main className="case-study-page aud-afs">
        <CaseStudyHero
          title={cs.title}
          subtitle={cs.subtitle}
          tags={cs.tags}
          heroImage="/images/projects/afs/screens/afs-screen-01.png"
          heroImageAlt="Configure Account Fit Score screen in the Admin Portal: a condition row, an info banner and an auto-update toggle, with the account preview still loading on the right."
          prototypeUrlLabel="ZoomInfo Admin Portal"
          label="Enterprise case study"
          myPart={cs.myPart}
          outcome={cs.outcome}
          statusLabel={cs.statusLabel}
        />

        <div className="cs-layout">
          <CaseStudyNav items={afsNavItems} />
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
              <aside className="aud-note" aria-labelledby="afs-reading">
                <h3 className="aud-note__title" id="afs-reading">{cs.readingNote.title}</h3>
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
                <ol className="journey-flow aud-flow">
                  {cs.userFlowSteps.map((step, i) => (
                    <li key={step} className="journey-flow__step">
                      <span className="journey-flow__label">{step}</span>
                      {i < cs.userFlowSteps.length - 1 && <span className="journey-flow__arrow" aria-hidden="true">→</span>}
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
                The twelve final screens in flow order. Select a screen to open it at full size.
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
              <p className="cs-section__body">What a developer would need answered that the screens do not show.</p>
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
                      <span className="limitations-item__dot" />
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

              <Appendix title="Information architecture" count="2 outlines">
                <p className="cs-section__body">{cs.iaDescription}</p>
                <h3 className="cs-section__subtitle">Admin Portal navigation</h3>
                <div className="afs-feature-tree">
                  {cs.iaTree.map(item => (
                    <div key={item.label} className={`afs-feature-tree__item afs-feature-tree__item--indent-${item.indent}`}>
                      <span className="afs-feature-tree__dot" aria-hidden="true" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
                <h3 className="cs-section__subtitle">AFS feature structure, from frame names</h3>
                <div className="afs-feature-tree">
                  {cs.afsIaTree.map(item => (
                    <div
                      key={item.label}
                      className={`afs-feature-tree__item afs-feature-tree__item--indent-${item.indent}${item.active ? ' afs-feature-tree__item--active' : ''}`}
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
                        <div className="afs-ds-type-h">Configure Account Fit Score</div>
                        <div className="afs-ds-type-sub">Account Fit Score (AFS) / Configure</div>
                        <div className="afs-ds-type-body">Account Fit Score predicts how well an account matches your ideal customer profile.</div>
                        <div className="afs-ds-type-chip">Account Type</div>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Type roles: heading, breadcrumb, body, chip.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div className="afs-ds-nav">
                        <div className="afs-ds-nav-row">Overview</div>
                        <div className="afs-ds-nav-row afs-ds-nav-row--group">Go-to-Market</div>
                        <div className="afs-ds-nav-row afs-ds-nav-row--sub">Set Up</div>
                        <div className="afs-ds-nav-row afs-ds-nav-row--deepsub afs-ds-nav-row--active">Account Fit Score (AFS)</div>
                        <div className="afs-ds-nav-row afs-ds-nav-row--deepsub">Buying Committees</div>
                        <div className="afs-ds-nav-row afs-ds-nav-row--sub">General</div>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Left navigation: collapsible groups with an active row.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div className="cd-condition-row">
                        <span className="cd-chip cd-chip--field">Account Type</span>
                        <span className="cd-chip cd-chip--op">Is</span>
                        <span className="cd-chip cd-chip--value">Customer</span>
                        <span className="cd-menu">···</span>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Condition row: field, operator and value, with a row menu.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div className="cd-banner" style={{ width: '100%' }}>
                        <span className="cd-banner__icon">ℹ</span>
                        <span className="cd-banner__text">This is a default condition. You can edit or add more conditions as required.</span>
                        <span className="cd-banner__close">✕</span>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Info banner: inline guidance with a dismiss icon.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div className="cd-radio-group">
                        <div className="cd-radio cd-radio--selected"><div className="cd-radio__dot" />Account Object</div>
                        <div className="cd-radio"><div className="cd-radio__dot" />Opportunity Object</div>
                      </div>
                      <div className="cd-toggle-row" style={{ maxWidth: '220px' }}>
                        <span className="cd-toggle-label">Auto-update AFS model</span>
                        <div className="cd-toggle"><div className="cd-toggle__knob" /></div>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Radio options and a toggle.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div className="cd-btn-pair">
                        <span className="cd-btn-ghost">Cancel</span>
                        <span className="cd-btn-primary">Save Configuration</span>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Action pair: outlined secondary, filled primary.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                        <div style={{ fontSize: '9px', color: '#64748B' }}>Account Fit Score (AFS) / Configure</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Configure Account Fit Score (AFS)</div>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Page header: breadcrumb and title.</figcaption>
                  </figure>

                  <figure className="afs-ds-tile">
                    <Decorative className="afs-ds-tile__body">
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, background: '#FFEDD5', color: '#9A3412', padding: '3px 10px', borderRadius: '10px' }}>Processing</span>
                        <span style={{ fontSize: '10px', fontWeight: 600, background: '#DCFCE7', color: '#166534', padding: '3px 10px', borderRadius: '10px' }}>Active</span>
                      </div>
                    </Decorative>
                    <figcaption className="afs-ds-tile__label">Status badges: Processing and Active.</figcaption>
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

              <Appendix title="Reconstructed sketches" count={`${sketches.length} sketches`}>
                <p className="cs-section__body">
                  Reconstruction: not a shipped screen. These states exist as frames in the Figma canvas but are not in my reference set, so the sketches below only show a plausible layout and use placeholder copy.
                </p>
                <div className="afs-wireframes-grid">
                  {sketches.map(s => (
                    <figure key={s.key} className="afs-wireframe-card">
                      <Decorative>{renderSketch(s.key)}</Decorative>
                      <figcaption>
                        <strong className="aud-sketch__label">{s.label}</strong>
                        <span className="aud-sketch__tag">Reconstruction: not a shipped screen</span>
                        <span className="aud-sketch__purpose">{s.purpose}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </Appendix>
            </section>

            <div className="cs-cta-section">
              <h3 className="cs-cta-section__title">Explore more product and process work</h3>
              <p className="cs-cta-section__body">Other case studies cover design decisions, prototypes and the build workflow.</p>
              <div className="cs-cta-section__actions">
                <Button href="/projects/riverside-general">Riverside General case study</Button>
                <Button href="/projects/renewly" variant="ghost">Renewly case study</Button>
                <Button href="/projects/ai-assisted-product-workflow" variant="ghost">AI workflow process</Button>
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
