import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CaseStudyHero from '../components/case-study/CaseStudyHero';
import CaseStudyNav from '../components/case-study/CaseStudyNav';
import Button from '../components/ui/Button';
import { workflowCaseStudy as cs } from '../data/workflowCaseStudy';

const wfNavItems = [
  { id: 'snapshot', label: 'Project snapshot' },
  { id: 'demonstrates', label: 'What this demonstrates' },
  { id: 'overview', label: 'Overview' },
  { id: 'why', label: 'Why document this?' },
  { id: 'tool-stack', label: 'Tool stack' },
  { id: 'phase-research', label: 'Phase 1 — Research' },
  { id: 'phase-design', label: 'Phase 2 — Design' },
  { id: 'phase-repo', label: 'Phase 3 — Repo setup' },
  { id: 'phase-vscode', label: 'Phase 4 — VS Code & AI agents' },
  { id: 'phase-structure', label: 'Phase 5 — File structure' },
  { id: 'phase-branches', label: 'Phase 6 — Feature branches' },
  { id: 'phase-pr', label: 'Phase 7 — PR workflow' },
  { id: 'phase-ci', label: 'Phase 8 — CI validation' },
  { id: 'phase-merge', label: 'Phase 9 — Merge & conflicts' },
  { id: 'phase-preview', label: 'Phase 10 — Local preview' },
  { id: 'phase-rqa', label: 'Phase 11 — Responsive QA' },
  { id: 'phase-deploy', label: 'Phase 12 — Deployment' },
  { id: 'phase-handoff', label: 'Phase 13 — Handoff' },
  { id: 'what-worked', label: 'What worked well' },
  { id: 'what-id-change', label: "What I'd change" },
  { id: 'tech-stack', label: 'Tech stack' },
  { id: 'reflection', label: 'Reflection' },
];

const phaseIds = [
  'phase-research',
  'phase-design',
  'phase-repo',
  'phase-vscode',
  'phase-structure',
  'phase-branches',
  'phase-pr',
  'phase-ci',
  'phase-merge',
  'phase-preview',
  'phase-rqa',
  'phase-deploy',
  'phase-handoff',
];

export default function WorkflowCaseStudyPage() {
  return (
    <>
      <Header />
      <main className="case-study-page">
        <CaseStudyHero
          title={cs.title}
          subtitle={cs.subtitle}
          tags={cs.tags}
          prototypeUrl=""
          githubUrl="https://github.com/vijayachandrajonnadula-byte"
          heroImageAlt="AI-assisted product build workflow process showcase"
        />

        <div className="cs-layout">
          <CaseStudyNav items={wfNavItems} />
          <div className="cs-content">

            {/* 1. SNAPSHOT */}
            <section className="cs-section" id="snapshot">
              <h2 className="cs-section__title">Project snapshot</h2>
              <div className="snapshot-grid snapshot-grid--5">
                {[
                  { label: 'Role', value: cs.snapshot.role },
                  { label: 'Scope', value: cs.snapshot.timeline },
                  { label: 'Platform', value: cs.snapshot.platform },
                  { label: 'Tools', value: cs.snapshot.tools },
                  { label: 'Focus', value: cs.snapshot.focus },
                ].map(item => (
                  <div key={item.label} className="snapshot-card">
                    <div className="snapshot-card__label">{item.label}</div>
                    <div className="snapshot-card__value">{item.value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. DEMONSTRATES */}
            <section className="cs-section" id="demonstrates">
              <h2 className="cs-section__title">What this demonstrates</h2>
              <p className="cs-section__body">A quick scan for recruiters — the skills and mindset shown across this process showcase.</p>
              <div className="demonstrates-cards-grid">
                {cs.demonstrates.map(d => (
                  <div key={d.title} className="demonstrates-card">
                    <div className="demonstrates-card__check">&#x2713;</div>
                    <div className="demonstrates-card__content">
                      <div className="demonstrates-card__title">{d.title}</div>
                      <p className="demonstrates-card__body">{d.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. OVERVIEW */}
            <section className="cs-section" id="overview">
              <h2 className="cs-section__title">Overview</h2>
              <p className="cs-section__body">{cs.overview}</p>
            </section>

            {/* 4. WHY DOCUMENT */}
            <section className="cs-section" id="why">
              <h2 className="cs-section__title">Why document this workflow?</h2>
              <p className="cs-section__body">{cs.whyDocument}</p>
              <div className="wf-why-callout">
                <div className="wf-why-callout__icon">→</div>
                <p className="wf-why-callout__text">This is not a tutorial on how to use AI tools. It is a record of the decisions and discipline required to use them well in a real delivery context.</p>
              </div>
            </section>

            {/* 5. TOOL STACK */}
            <section className="cs-section" id="tool-stack">
              <h2 className="cs-section__title">Tool stack</h2>
              <p className="cs-section__body cs-section__body--mb">Each tool category had a defined role in the workflow. Tools were selected for what they accelerate — not for breadth.</p>
              <div className="wf-tool-stack-grid">
                {cs.toolStack.map(cat => (
                  <div key={cat.category} className="wf-tool-category">
                    <div className="wf-tool-category__name">{cat.category}</div>
                    <div className="wf-tool-category__pills">
                      {cat.tools.map(t => (
                        <span key={t} className="wf-tool-pill">{t}</span>
                      ))}
                    </div>
                    <p className="wf-tool-category__purpose">{cat.purpose}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 6–18. PHASES */}
            {cs.phases.map((phase, idx) => (
              <section className="cs-section wf-phase-section" id={phaseIds[idx]} key={phase.id}>
                <div className="wf-phase-header">
                  <div className="wf-phase-num">{phase.num}</div>
                  <div className="wf-phase-header__right">
                    <h2 className="cs-section__title cs-section__title--no-mb">{phase.title}</h2>
                    <div className="wf-human-led-badge">
                      <span className="wf-human-led-badge__label">Human-led:</span>
                      <span className="wf-human-led-badge__value">{phase.humanLed}</span>
                    </div>
                  </div>
                </div>

                <p className="cs-section__body cs-section__body--mb">{phase.description}</p>

                <div className="wf-phase-tools">
                  {phase.tools.map(t => <span key={t} className="wf-tool-pill wf-tool-pill--sm">{t}</span>)}
                </div>

                {phase.activities && (
                  <ul className="wf-activities">
                    {phase.activities.map(a => (
                      <li key={a} className="wf-activities__item">
                        <span className="wf-activities__dot" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {phase.commands && (
                  <div className="wf-command-block">
                    <div className="wf-command-block__bar">
                      <span className="wf-command-block__dot" />
                      <span className="wf-command-block__dot" />
                      <span className="wf-command-block__dot" />
                      <span className="wf-command-block__label">Terminal</span>
                    </div>
                    <pre className="wf-command-block__body">
                      {phase.commands.map((cmd, i) => (
                        <div key={i} className={`wf-command-line${cmd.startsWith('#') ? ' wf-command-line--comment' : ''}`}>
                          {!cmd.startsWith('#') && cmd.trim() !== '' && <span className="wf-command-prompt">$ </span>}
                          {cmd}
                        </div>
                      ))}
                    </pre>
                  </div>
                )}

                {phase.fileTree && (
                  <div className="wf-file-tree">
                    <div className="wf-file-tree__label">Project file structure</div>
                    <pre className="wf-file-tree__body">{phase.fileTree}</pre>
                  </div>
                )}

                {phase.prChecklist && (
                  <div className="wf-pr-checklist">
                    <div className="wf-pr-checklist__title">Pre-merge checklist</div>
                    {phase.prChecklist.map(item => (
                      <div key={item} className="wf-pr-item">
                        <span className="wf-pr-item__check">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {phase.ciCards && (
                  <div className="wf-ci-cards">
                    {phase.ciCards.map(card => (
                      <div key={card.label} className={`wf-ci-card wf-ci-card--${card.status}`}>
                        <div className="wf-ci-card__header">
                          <span className={`wf-ci-badge wf-ci-badge--${card.status}`}>
                            {card.status === 'pass' ? '✓ PASS' : '✗ FAIL'}
                          </span>
                          <span className="wf-ci-card__label">{card.label}</span>
                        </div>
                        <div className="wf-ci-card__issue">{card.issue}</div>
                        <div className="wf-ci-card__fix">{card.fix}</div>
                      </div>
                    ))}
                  </div>
                )}

                {phase.breakpoints && (
                  <div className="wf-breakpoints">
                    <div className="wf-breakpoints__title">Tested breakpoints</div>
                    <div className="wf-bp-table">
                      {phase.breakpoints.map(bp => (
                        <div key={bp.width} className="wf-bp-row">
                          <div className="wf-bp-row__width">{bp.width}</div>
                          <div className="wf-bp-row__label">{bp.label}</div>
                          <div className="wf-bp-row__notes">{bp.notes}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}

            {/* 19. WHAT WORKED */}
            <section className="cs-section" id="what-worked">
              <h2 className="cs-section__title">What worked well</h2>
              <div className="wf-lessons-grid">
                {cs.whatWorked.map(l => (
                  <div key={l.title} className="wf-lesson-card wf-lesson-card--positive">
                    <div className="wf-lesson-card__icon">+</div>
                    <div className="wf-lesson-card__title">{l.title}</div>
                    <p className="wf-lesson-card__body">{l.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 20. WHAT I'D CHANGE */}
            <section className="cs-section" id="what-id-change">
              <h2 className="cs-section__title">What I'd do differently</h2>
              <div className="wf-lessons-grid">
                {cs.whatIdChange.map(l => (
                  <div key={l.title} className="wf-lesson-card wf-lesson-card--improve">
                    <div className="wf-lesson-card__icon">↑</div>
                    <div className="wf-lesson-card__title">{l.title}</div>
                    <p className="wf-lesson-card__body">{l.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 21. TECH STACK */}
            <section className="cs-section" id="tech-stack">
              <h2 className="cs-section__title">Tech stack</h2>
              <div className="cs-tech-stack">
                {cs.techStack.map(item => (
                  <div key={item.label} className="cs-tech-stack__row">
                    <span className="cs-tech-stack__label">{item.label}</span>
                    <span className="cs-tech-stack__value">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 22. REFLECTION */}
            <section className="cs-section" id="reflection">
              <h2 className="cs-section__title">Reflection</h2>
              <p className="cs-section__body">{cs.reflection}</p>

              <div className="cs-cta-section">
                <h3 className="cs-cta-section__title">See the prototypes this workflow produced</h3>
                <p className="cs-cta-section__body">Both case studies document the design decisions behind each project. The live prototypes are deployed and ready to test.</p>
                <div className="cs-cta-section__actions">
                  <Button href="/projects/riverside-general">Riverside General case study</Button>
                  <Button href="/projects/renewly" variant="ghost">Renewly case study</Button>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
