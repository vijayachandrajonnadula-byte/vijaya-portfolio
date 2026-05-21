import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CaseStudyHero from '../components/case-study/CaseStudyHero';
import SnapshotGrid from '../components/case-study/SnapshotGrid';
import CaseStudyNav from '../components/case-study/CaseStudyNav';
import Timeline from '../components/case-study/Timeline';
import ScreenshotGallery from '../components/case-study/ScreenshotGallery';
import IterationLog from '../components/case-study/IterationLog';
import ResponsiveQA from '../components/case-study/ResponsiveQA';
import Button from '../components/ui/Button';
import { riversideCaseStudy as cs } from '../data/caseStudies';

function Checklist({ items }: { items: string[] }) {
  return (
    <div className="cs-checklist">
      {items.map(i => (
        <div key={i} className="cs-checklist__item">
          <span className="cs-checklist__icon">&#x2713;</span>
          <span>{i}</span>
        </div>
      ))}
    </div>
  );
}

export default function CaseStudyPage() {
  return (
    <>
      <Header />
      <main className="case-study-page">
        <CaseStudyHero
          title={cs.title}
          subtitle={cs.subtitle}
          tags={cs.tags}
          prototypeUrl={cs.prototypeUrl}
          githubUrl={cs.githubUrl}
        />

        <div className="cs-layout">
          <CaseStudyNav />
          <div className="cs-content">

            {/* 1. PROJECT SNAPSHOT */}
            <section className="cs-section" id="snapshot">
              <h2 className="cs-section__title">Project snapshot</h2>
              <SnapshotGrid snapshot={cs.snapshot} />
            </section>

            {/* 2. WHAT THIS DEMONSTRATES */}
            <section className="cs-section" id="demonstrates">
              <h2 className="cs-section__title">What this case study demonstrates</h2>
              <p className="cs-section__body">A quick scan for recruiters — the skills and mindset shown across this project.</p>
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

            {/* 4. PROBLEM */}
            <section className="cs-section" id="problem">
              <h2 className="cs-section__title">Problem</h2>
              <p className="cs-section__body">{cs.problem}</p>
              <div className="problem-highlight">{cs.problemHighlight}</div>
            </section>

            {/* 5. GOALS */}
            <section className="cs-section" id="goals">
              <h2 className="cs-section__title">Goals</h2>
              <div className="cs-cards-grid">
                {cs.goals.map((g, i) => (
                  <div key={g.title} className="cs-card">
                    <div className="cs-card__number">{String(i + 1).padStart(2, '0')}</div>
                    <div className="cs-card__title">{g.title}</div>
                    <p className="cs-card__body">{g.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. RESEARCH INSIGHTS */}
            <section className="cs-section" id="research">
              <h2 className="cs-section__title">Research insights</h2>
              <p className="cs-section__body">Three recurring patterns shaped the key UX decisions for this project.</p>
              <div className="cs-cards-grid">
                {cs.researchInsights.map((r, i) => (
                  <div key={r.title} className="cs-card cs-card--insight">
                    <div className="cs-card__number">{String(i + 1).padStart(2, '0')}</div>
                    <div className="cs-card__title">{r.title}</div>
                    <div className="cs-insight-row cs-insight-row--issue">
                      <span className="cs-insight-label">Issue</span>
                      <p className="cs-card__body">{r.issue}</p>
                    </div>
                    <div className="cs-insight-row cs-insight-row--response">
                      <span className="cs-insight-label cs-insight-label--green">Design response</span>
                      <p className="cs-card__body">{r.response}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. EARLY STRUCTURE: WIREFRAMES, IA, AND FLOW MAPPING */}
            <section className="cs-section" id="early-structure">
              <h2 className="cs-section__title">Early structure: wireframes, IA, and flow mapping</h2>
              <p className="cs-section__body">{cs.earlyStructureIntro}</p>

              <h3 className="cs-section__subtitle">User flow</h3>
              <p className="cs-section__body">{cs.userJourneyDescription}</p>
              <div className="journey-flow">
                {cs.userJourneySteps.map((step, i) => (
                  <div key={step} className="journey-flow__step">
                    <span className="journey-flow__label">{step}</span>
                    {i < cs.userJourneySteps.length - 1 && (
                      <span className="journey-flow__arrow">&#x2192;</span>
                    )}
                  </div>
                ))}
              </div>
              {cs.flowImage && (
                <div className="cs-image-wrap" style={{ marginTop: 'var(--space-6)' }}>
                  <img
                    src={cs.flowImage}
                    alt="User flow diagram"
                    className="cs-image"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}

              <h3 className="cs-section__subtitle">Information architecture</h3>
              <p className="cs-section__body">{cs.iaDescription}</p>
              {cs.iaImage && (
                <div className="cs-image-wrap">
                  <img
                    src={cs.iaImage}
                    alt="Information architecture diagram"
                    className="cs-image"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="ia-structure">
                <div className="ia-col">
                  <div className="ia-col__label">Main navigation</div>
                  {['Home', 'Find Doctors', 'Departments', 'Manage Appointment', 'Help'].map(item => (
                    <div key={item} className="ia-col__item">{item}</div>
                  ))}
                </div>
                <div className="ia-col">
                  <div className="ia-col__label">Booking flow</div>
                  {['Home', 'Find Doctors', 'Doctor Profile', 'Book Appointment', 'Confirmation', 'Manage Appointment'].map(item => (
                    <div key={item} className="ia-col__item">{item}</div>
                  ))}
                </div>
              </div>

              <h3 className="cs-section__subtitle">Wireframes</h3>
              <p className="cs-section__body">{cs.wireframesDescription}</p>
              {cs.wireframeImages.length > 0 && (
                <div className="wireframes-grid">
                  {cs.wireframeImages.map(img => (
                    <div key={img.label} className="wireframe-item">
                      <div className="wireframe-item__frame">
                        <img
                          src={img.src}
                          alt={img.label}
                          className="wireframe-item__img"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                      <span className="wireframe-item__label">{img.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 10. KEY UX DECISIONS */}
            <section className="cs-section" id="decisions">
              <h2 className="cs-section__title">Key UX decisions</h2>
              <p className="cs-section__body">Five decisions shaped the structure and clarity of the booking experience.</p>
              <div className="cs-cards-grid cs-cards-grid--decisions">
                {cs.uxDecisions.map((d, i) => (
                  <div key={d.title} className="cs-card">
                    <div className="cs-card__number">{String(i + 1).padStart(2, '0')}</div>
                    <div className="cs-card__title">{d.title}</div>
                    <p className="cs-card__body">{d.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 11. DESIGN SYSTEM */}
            <section className="cs-section" id="design-system">
              <h2 className="cs-section__title">Design system</h2>
              <p className="cs-section__body">{cs.designSystemDescription}</p>
              <div className="design-system-grid">
                {cs.designSystemImages.map(img => (
                  <div key={img.label} className="design-system-img">
                    <img
                      src={img.src}
                      alt={img.label}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="design-system-img__label">{img.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 12. DESKTOP PROTOTYPE SCREENS */}
            <section className="cs-section" id="screenshots">
              <h2 className="cs-section__title">Desktop prototype screens</h2>
              <p className="cs-section__body">
                Screens from the built React prototype covering every step of the booking journey — deployed to Vercel and functional end-to-end, not static mockups. Each screen was refined through multiple critique and iteration rounds.
              </p>
              <ScreenshotGallery images={cs.desktopScreenshots} />
            </section>

            {/* 13. MOBILE PROTOTYPE SCREENS */}
            <section className="cs-section" id="mobile-screens">
              <h2 className="cs-section__title">Mobile prototype screens</h2>
              <p className="cs-section__body">
                Responsive screens validated at 430px and 390px. Single-column layout, stacked forms, tappable slot picker, compact progress indicator, and bottom tab navigation. Each screen was reviewed for usable touch targets, readable text, and no horizontal overflow.
              </p>
              <ScreenshotGallery images={cs.mobileScreenshots} mobile />
            </section>

            {/* 14. AI-ASSISTED WORKFLOW */}
            <section className="cs-section" id="ai-workflow">
              <h2 className="cs-section__title">AI-assisted workflow</h2>
              <p className="cs-section__body">
                This project used AI as a workflow accelerator, not as an automatic design replacement. Human judgement stayed responsible for product decisions, UX critique, responsive QA, and final acceptance at every stage.
              </p>
              <div className="cs-ai-workflow-grid">
                {cs.aiWorkflow.map(w => (
                  <div key={w.stage} className="cs-ai-card">
                    <span className="cs-ai-card__stage">{w.stage}</span>
                    <div className="cs-ai-card__title">{w.title}</div>
                    <p className="cs-ai-card__body">{w.body}</p>
                    <p className="cs-ai-card__note">{w.note}</p>
                  </div>
                ))}
              </div>
              <div className="cs-ai-highlight">
                AI accelerated the workflow. It did not replace UX judgement, product decisions, or responsive QA.
              </div>
            </section>

            {/* 15. TECHNICAL IMPLEMENTATION */}
            <section className="cs-section" id="technical">
              <h2 className="cs-section__title">Technical implementation</h2>
              <p className="cs-section__body">{cs.technicalDescription}</p>
              <Checklist items={cs.technicalPoints} />
            </section>

            {/* 16. PR WORKFLOW */}
            <section className="cs-section" id="pr-workflow">
              <h2 className="cs-section__title">Repository and PR workflow</h2>
              <p className="cs-section__body">{cs.prWorkflowDescription}</p>
              <Timeline items={cs.prWorkflow} />
            </section>

            {/* 17. TESTING */}
            <section className="cs-section" id="testing">
              <h2 className="cs-section__title">Testing and usability review</h2>
              <p className="cs-section__body">
                The full booking flow was tested end-to-end before each share. Manual testing followed the complete user path:
              </p>
              <div className="journey-flow" style={{ marginBottom: 'var(--space-6)' }}>
                {cs.testingFlow.split(' → ').map((step, i, arr) => (
                  <div key={step} className="journey-flow__step">
                    <span className="journey-flow__label">{step}</span>
                    {i < arr.length - 1 && <span className="journey-flow__arrow">&#x2192;</span>}
                  </div>
                ))}
              </div>
              <Checklist items={cs.testingChecklist} />
            </section>

            {/* 18. ITERATIONS */}
            <section className="cs-section" id="iterations">
              <h2 className="cs-section__title">Feedback and iteration log</h2>
              <p className="cs-section__body">Seven iteration rounds addressed specific UX and responsiveness issues found during testing.</p>
              <IterationLog iterations={cs.iterations} />
            </section>

            {/* 19. RESPONSIVE QA */}
            <section className="cs-section" id="responsive-qa">
              <h2 className="cs-section__title">Responsive QA</h2>
              <p className="cs-section__body">{cs.responsiveQADescription}</p>
              <ResponsiveQA items={cs.responsiveQA} />
            </section>

            {/* 20. ACCESSIBILITY */}
            <section className="cs-section" id="accessibility">
              <h2 className="cs-section__title">Accessibility</h2>
              <Checklist items={cs.accessibilityChecklist} />
            </section>

            {/* 21. TECH STACK */}
            <section className="cs-section" id="tech-stack">
              <h2 className="cs-section__title">Technical stack</h2>
              <div className="tech-stack-grid">
                {cs.techStack.map(t => (
                  <div key={t.label} className="tech-stack-card">
                    <div className="tech-stack-card__label">{t.label}</div>
                    <div className="tech-stack-card__value">{t.value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 22. LIMITATIONS + NEXT STEPS */}
            <section className="cs-section" id="limitations">
              <h2 className="cs-section__title">Limitations and next steps</h2>
              <p className="cs-section__body">This is a portfolio prototype using mock data. It does not include:</p>
              <div className="limitations-next-grid">
                <div className="limitations-box">
                  <div className="limitations-box__heading">Current limitations</div>
                  <div className="limitations-list">
                    {cs.limitations.map(l => (
                      <div key={l} className="limitations-item">
                        <span className="limitations-item__dot" />
                        <span>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="next-steps-box">
                  <div className="next-steps-box__heading">If taken further</div>
                  <div className="limitations-list">
                    {cs.nextSteps.map(s => (
                      <div key={s} className="limitations-item">
                        <span className="limitations-item__arrow">&#x2192;</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 23. FINAL VALIDATION */}
            <section className="cs-section" id="validation">
              <h2 className="cs-section__title">Final validation</h2>
              <Checklist items={cs.finalValidation} />
            </section>

            {/* 24. REFLECTION */}
            <section className="cs-section" id="reflection">
              <h2 className="cs-section__title">Reflection</h2>
              <p className="cs-section__body">{cs.reflection}</p>
            </section>

          </div>
        </div>

        <section className="cs-cta">
          <div className="container">
            <h2 className="cs-cta__title">Explore the working prototype and project repository.</h2>
            <p className="cs-cta__sub">Built with React, TypeScript, and a repeatable product workflow.</p>
            <div className="cs-cta__actions">
              <Button href={cs.prototypeUrl} variant="dark" external size="lg">
                View live prototype &#x2197;
              </Button>
              <Button href={cs.githubUrl} variant="dark-outline" external size="lg">
                View GitHub repository &#x2197;
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
