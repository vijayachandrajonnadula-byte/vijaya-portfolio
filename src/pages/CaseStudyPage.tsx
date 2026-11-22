import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import NextProject from '../components/case-study/NextProject';
import CaseStudyHero from '../components/case-study/CaseStudyHero';
import SnapshotGrid from '../components/case-study/SnapshotGrid';
import CaseStudyNav from '../components/case-study/CaseStudyNav';
import IterationLog from '../components/case-study/IterationLog';
import ResponsiveQA from '../components/case-study/ResponsiveQA';
import Button from '../components/ui/Button';
import Img from '../components/case-study/Img';
import { Fold, Checklist, Shot, MobileGallery, Diagram, DsCard, sentence } from '../components/audit/AuditBlocks';
import { imgSize } from '../data/imageSizes';
import { riversideCaseStudy as cs } from '../data/caseStudies';
import '../styles/audit-riverside.css';

const navItems = [
  { id: 'snapshot', label: 'Project snapshot' },
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'goals', label: 'Goals' },
  { id: 'research', label: 'Assumptions' },
  { id: 'early-structure', label: 'Early structure' },
  { id: 'decisions', label: 'Key UX decisions' },
  { id: 'design-system', label: 'Design system' },
  { id: 'screenshots', label: 'Desktop screens' },
  { id: 'mobile-screens', label: 'Mobile screens' },
  { id: 'ai-workflow', label: 'AI-assisted workflow' },
  { id: 'iterations', label: 'Testing and iterations' },
  { id: 'details', label: 'Details' },
  { id: 'reflection', label: 'Reflection' },
];

const URL = 'hospital-booking-portfolio.vercel.app';

export default function CaseStudyPage() {
  const dsAlt = (label: string) => `Design system sheet: ${label}`;
  return (
    <>
      <Header />
      <main className="case-study-page af-page af-riverside">
        <CaseStudyHero
          title={cs.title}
          subtitle={cs.subtitle}
          tags={cs.tags}
          prototypeUrl={cs.prototypeUrl}
          heroImage="/images/projects/riverside/clean/desktop-home.jpg"
          heroImageAlt="Riverside General homepage: a booking headline, a search bar, and a card of today's appointments"
          prototypeUrlLabel={URL}
          statusLabel="Working prototype"
          myPart="UX/UI design, product framing and the React prototype build. AI tools helped with exploration and implementation; the decisions and reviews were mine."
          outcome="A live prototype you can click through end to end, on mock data. I checked it myself at five widths; it has not been tested with patients."
        />

        <div className="cs-layout">
          <CaseStudyNav items={navItems} />
          <div className="cs-content">

            <section className="cs-section" id="snapshot">
              <h2 className="cs-section__title">Project snapshot</h2>
              <SnapshotGrid snapshot={cs.snapshot} />
            </section>

            <section className="cs-section" id="overview">
              <h2 className="cs-section__title">Overview</h2>
              <p className="cs-section__body">{cs.overview}</p>
            </section>

            <section className="cs-section" id="problem">
              <h2 className="cs-section__title">Problem</h2>
              <p className="cs-section__body">{cs.problem}</p>
              <div className="problem-highlight">{cs.problemHighlight}</div>
            </section>

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

            <section className="cs-section" id="research">
              <h2 className="cs-section__title">Assumptions</h2>
              <p className="cs-section__body">{cs.assumptionsIntro}</p>
              <div className="cs-cards-grid">
                {cs.researchInsights.map((r, i) => (
                  <div key={r.title} className="cs-card cs-card--insight">
                    <div className="cs-card__number">{String(i + 1).padStart(2, '0')}</div>
                    <div className="cs-card__title">{r.title}</div>
                    <div className="cs-insight-row cs-insight-row--issue">
                      <span className="cs-insight-label">Assumption</span>
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

            <section className="cs-section" id="early-structure">
              <h2 className="cs-section__title">Early structure: wireframes, IA, and flow mapping</h2>
              <p className="cs-section__body">{cs.earlyStructureIntro}</p>

              <h3 className="cs-section__subtitle">User flow</h3>
              <p className="cs-section__body">{cs.userJourneyDescription}</p>
              {cs.flowImage && (
                <Diagram
                  src={cs.flowImage}
                  alt="Flow diagram of the booking journey from Home through Find Doctors, Doctor Profile, slot selection and booking to Confirmation and Manage Appointment"
                  caption="Click the diagram to enlarge it. The same flow as text:"
                  steps={cs.userJourneySteps}
                />
              )}

              <h3 className="cs-section__subtitle">Information architecture</h3>
              <p className="cs-section__body">{cs.iaDescription}</p>
              {cs.iaImage && (
                <Diagram
                  src={cs.iaImage}
                  alt="Information architecture map separating general hospital navigation from the focused appointment booking flow"
                  caption="Click the map to enlarge it. In text, two groups:"
                  steps={[
                    'Browse: Find Doctors and Departments (general hospital content)',
                    'Book: Doctor Profile, then Book, then Confirm, then Manage (one linear path, kept separate from browsing)',
                  ]}
                />
              )}

              <h3 className="cs-section__subtitle">Wireframes</h3>
              <p className="cs-section__body">{cs.wireframesDescription}</p>
              <div className="af-wf-grid">
                {cs.wireframeImages.map(img => (
                  <figure key={img.label} className="af-wf">
                    <div className="af-wf__frame">
                      <Img src={img.src} {...imgSize(img.src)} alt={`Low-fidelity wireframe. ${img.label}`} zoom />
                    </div>
                    <figcaption>{img.label}. Click to enlarge.</figcaption>
                  </figure>
                ))}
              </div>
            </section>

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

            <section className="cs-section" id="design-system">
              <h2 className="cs-section__title">Design system</h2>
              <p className="cs-section__body">{cs.designSystemDescription}</p>
              <div className="af-ds-grid">
                {cs.designSystemImages.slice(0, 3).map(img => (
                  <DsCard key={img.label} src={img.src} label={img.label} alt={dsAlt(img.label)} />
                ))}
              </div>
              <Fold title="More design system sheets" count={`${cs.designSystemImages.length - 3} sheets`}>
                <div className="af-ds-grid">
                  {cs.designSystemImages.slice(3).map(img => (
                    <DsCard key={img.label} src={img.src} label={img.label} alt={dsAlt(img.label)} />
                  ))}
                </div>
              </Fold>
            </section>

            <section className="cs-section" id="screenshots">
              <h2 className="cs-section__title">Desktop prototype screens</h2>
              <p className="cs-section__body">
                Six screens from the React prototype, one for each step of the booking journey. It is deployed to Vercel and works end to end on mock data. Each screen went through several critique and iteration rounds. Click any screen to see it in full.
              </p>
              {cs.desktopScreenshots.map((s, i) => (
                <div key={s.title} className="renewly-screen-entry">
                  <div className="renewly-screen-entry__header">
                    <div className="renewly-screen-entry__meta">
                      <span className="renewly-screen-entry__counter">{String(i + 1).padStart(2, '0')} / {String(cs.desktopScreenshots.length).padStart(2, '0')}</span>
                    </div>
                    <h3 className="renewly-screen-entry__title">{s.title}</h3>
                    <p className="renewly-screen-entry__purpose">{s.purpose}</p>
                    <div className="renewly-screen-entry__note">{s.uxNote}</div>
                  </div>
                  <Shot src={s.src} alt={`${s.title} screen, desktop. ${sentence(s.purpose)}`} url={URL} cap={760} />
                </div>
              ))}
            </section>

            <section className="cs-section" id="mobile-screens">
              <h2 className="cs-section__title">Mobile prototype screens</h2>
              <p className="cs-section__body">
                The same journey at 430px and 390px widths: single-column layout, stacked forms, a tappable slot picker, a compact progress indicator, and bottom tab navigation.
              </p>
              <MobileGallery
                label="Riverside General mobile screens"
                cols={3}
                items={cs.mobileScreenshots.map(s => ({
                  src: s.src, title: s.title, note: s.uxNote,
                  alt: `${s.title} screen on a phone. ${sentence(s.uxNote)}`,
                }))}
              />
            </section>

            <section className="cs-section" id="ai-workflow">
              <h2 className="cs-section__title">AI-assisted workflow</h2>
              <p className="cs-section__body">
                I used AI tools for research prompts, critique, implementation planning, and code review. Every product decision, UX call, and QA check was mine. The tools accelerated the work; they did not make the calls.
              </p>
              <Fold title="The five stages and what stayed human" count={`${cs.aiWorkflow.length} stages`}>
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
              </Fold>
            </section>

            <section className="cs-section" id="iterations">
              <h2 className="cs-section__title">Testing and iterations</h2>
              <p className="cs-section__body">
                I clicked through the full booking flow myself before each share. This was a self-review, not a usability test with patients, and no participants were recruited. Seven rounds fixed the issues I found.
              </p>
              <IterationLog iterations={cs.iterations} />
              <Fold title="The review path and the questions I asked" count={`${cs.testingChecklist.length} questions`}>
                <p className="cs-section__body">{cs.testingFlow}</p>
                <Checklist items={cs.testingChecklist} mark="dot" />
              </Fold>
              <Fold title="Responsive QA" count={`${cs.responsiveQA.length} widths`}>
                <p className="cs-section__body">{cs.responsiveQADescription}</p>
                <ResponsiveQA items={cs.responsiveQA} />
              </Fold>
            </section>

            <section className="cs-section" id="details">
              <h2 className="cs-section__title">Details</h2>
              <p className="cs-section__body">Reference material, folded so the story above reads quickly.</p>

              <Fold title="What this case study demonstrates" count={`${cs.demonstrates.length} points`}>
                <ul className="af-list">
                  {cs.demonstrates.map(d => (
                    <li key={d.title} className="af-list__item"><span className="af-mark af-mark--dot" aria-hidden="true" /><span><strong>{d.title}.</strong> {d.body}</span></li>
                  ))}
                </ul>
              </Fold>

              <Fold title="Technical implementation" count={`${cs.technicalPoints.length} points`}>
                <p className="cs-section__body">{cs.technicalDescription}</p>
                <Checklist items={cs.technicalPoints} mark="dot" />
              </Fold>

              <Fold title="Technical stack" count={`${cs.techStack.length} items`}>
                <div className="tech-stack-grid">
                  {cs.techStack.map(t => (
                    <div key={t.label} className="tech-stack-card">
                      <div className="tech-stack-card__label">{t.label}</div>
                      <div className="tech-stack-card__value">{t.value}</div>
                    </div>
                  ))}
                </div>
              </Fold>

              <Fold title="Accessibility notes" count={`${cs.accessibilityChecklist.length} notes`}>
                <p className="cs-section__body">{cs.accessibilityNote}</p>
                <Checklist items={cs.accessibilityChecklist} mark="dot" />
              </Fold>

              <Fold title="Limitations and next steps" count={`${cs.limitations.length} limits, ${cs.nextSteps.length} next steps`}>
                <p className="cs-section__body">This is a portfolio prototype using mock data. It does not include:</p>
                <div className="limitations-next-grid">
                  <div className="limitations-box">
                    <div className="limitations-box__heading">Current limitations</div>
                    <div className="limitations-list">
                      {cs.limitations.map(l => (
                        <div key={l} className="limitations-item"><span className="limitations-item__dot" /><span>{l}</span></div>
                      ))}
                    </div>
                  </div>
                  <div className="next-steps-box">
                    <div className="next-steps-box__heading">If taken further</div>
                    <div className="limitations-list">
                      {cs.nextSteps.map(s => (
                        <div key={s} className="limitations-item"><span className="limitations-item__arrow">&#x2192;</span><span>{s}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </Fold>

              <Fold title="Self-check before sharing" count={`${cs.finalValidation.length} items`}>
                <p className="cs-section__body">What I looked for in the running build before sharing the link. It is my own review, not an independent test.</p>
                <Checklist items={cs.finalValidation} mark="dot" />
              </Fold>
            </section>

            <section className="cs-section" id="reflection">
              <h2 className="cs-section__title">Reflection</h2>
              <p className="cs-section__body">{cs.reflection}</p>
            </section>

          </div>
        </div>

        <section className="cs-cta">
          <div className="container">
            <h2 className="cs-cta__title">Explore the working prototype.</h2>
            <p className="cs-cta__sub">React and TypeScript, built through a documented product workflow from problem framing to a shareable prototype.</p>
            <div className="cs-cta__actions">
              <Button href={cs.prototypeUrl} variant="dark" external size="lg">
                View live prototype &#x2197;
              </Button>
            </div>
          </div>
        </section>
      </main>
      <NextProject />
      <Footer />
    </>
  );
}
