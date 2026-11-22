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
import { Fold, Checklist, Shot, MobileGallery, DsCard, sentence } from '../components/audit/AuditBlocks';
import { imgSize } from '../data/imageSizes';
import { caresyncCaseStudy as cs } from '../data/caresyncCaseStudy';
import '../styles/audit-caresync.css';

const navItems = [
  { id: 'reframe', label: 'The reframe' },
  { id: 'snapshot', label: 'Project snapshot' },
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'goals', label: 'Goals' },
  { id: 'research', label: 'What shaped the design' },
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

const URL = 'care-sync-two-mu.vercel.app';
const WF_SHOWN = 2;
const DS_SHOWN = 3;

export default function CareSyncCaseStudyPage() {
  const wf = cs.wireframeImages;
  const ds = cs.designSystemImages;
  const dsAlt = (label: string) => `Design system documentation page: ${label}`;
  const wfAlt = (label: string) => `Low-fidelity wireframe. ${label}`;
  return (
    <>
      <Header />
      <main className="case-study-page af-page af-caresync">
        <CaseStudyHero
          title={cs.title}
          subtitle={cs.subtitle}
          tags={cs.tags}
          prototypeUrl={cs.prototypeUrl}
          githubUrl={cs.githubUrl}
          heroImage="/images/projects/caresync/desktop/dashboard.jpg"
          heroImageAlt="CareSync Shift Briefing: priority patients grouped as Now, Next and Later, with a lab result that needs review"
          prototypeUrlLabel={`${URL}/shift-briefing`}
          statusLabel="Working prototype"
          myPart="Product framing, UX/UI and visual design, and the React build. AI tools helped with implementation; the clinical framing, colour rules and review were mine."
          outcome="A live prototype with eight connected screens on mock data. It has not been tested with practising clinicians, and four screens still clip content at 390px."
        />

        <div className="cs-layout">
          <CaseStudyNav items={navItems} />
          <div className="cs-content">

            <section className="cs-section" id="reframe">
              <div className="af-lead">
                <p className="af-lead__kicker">The reframe</p>
                <h2 className="af-lead__title">{cs.reframe.title}</h2>
                <p className="cs-section__body">{cs.reframe.body}</p>
                <div className="af-lead__grid">
                  {cs.reframe.cells.map(c => (
                    <div key={c.label} className="af-lead__cell"><strong>{c.label}</strong>{c.body}</div>
                  ))}
                </div>
                <p className="cs-section__body" style={{ marginTop: 'var(--space-4)' }}>{cs.reframe.safety}</p>
              </div>
            </section>

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
              <h2 className="cs-section__title">What shaped the design</h2>
              <p className="cs-section__body">
                This was an assignment sprint without access to live hospital sessions. The direction came from a landscape audit of clinical SaaS tools, a heuristic review of dashboard anti-patterns, and one informal conversation with a practising physician (no notes or quotes are kept here). Six recurring patterns shaped the key decisions.
              </p>
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

            <section className="cs-section" id="early-structure">
              <h2 className="cs-section__title">Early structure: wireframes, IA, and flow mapping</h2>
              <p className="cs-section__body">{cs.earlyStructureIntro}</p>

              <h3 className="cs-section__subtitle">Clinician flow</h3>
              <p className="cs-section__body">{cs.userJourneyDescription}</p>
              <div className="journey-flow">
                {cs.userJourneySteps.map((step, i) => (
                  <div key={step} className="journey-flow__step">
                    <span className="journey-flow__label">{step}</span>
                    {i < cs.userJourneySteps.length - 1 && <span className="journey-flow__arrow" aria-hidden="true">&#x2192;</span>}
                  </div>
                ))}
              </div>

              <h3 className="cs-section__subtitle">Information architecture</h3>
              <p className="cs-section__body">{cs.iaDescription}</p>

              <h3 className="cs-section__subtitle">Wireframes</h3>
              <p className="cs-section__body">{cs.wireframesDescription}</p>
              <div className="af-wf-grid af-wf-grid--2">
                {wf.slice(0, WF_SHOWN).map(w => (
                  <figure key={w.label} className="af-wf">
                    <div className="af-wf__frame"><Img src={w.src} {...imgSize(w.src)} alt={wfAlt(w.label)} zoom /></div>
                    <figcaption>{w.label}. Click to enlarge.</figcaption>
                  </figure>
                ))}
              </div>
              <Fold title="The other wireframes" count={`${wf.length - WF_SHOWN} more`}>
                <div className="af-wf-grid af-wf-grid--2">
                  {wf.slice(WF_SHOWN).map(w => (
                    <figure key={w.label} className="af-wf">
                      <div className="af-wf__frame"><Img src={w.src} {...imgSize(w.src)} alt={wfAlt(w.label)} zoom /></div>
                      <figcaption>{w.label}</figcaption>
                    </figure>
                  ))}
                </div>
              </Fold>
            </section>

            <section className="cs-section" id="decisions">
              <h2 className="cs-section__title">Key UX decisions</h2>
              <p className="cs-section__body">Six decisions shaped the structure and clinical safety of the product.</p>
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

              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-8)' }}>Colour palette</h3>
              <div className="renewly-ds-palette">
                {[
                  { label: 'Brand: aubergine', scale: cs.brandScale },
                  { label: 'Warm neutral surfaces', scale: cs.surfaceScale },
                ].map(g => (
                  <div key={g.label} className="renewly-ds-palette-group">
                    <div className="renewly-ds-palette-group__label">{g.label}</div>
                    <div className="renewly-ds-swatch-row">
                      {g.scale.map(s => (
                        <div key={s.name} className="renewly-ds-swatch">
                          <div className="renewly-ds-swatch__box" style={{ background: s.hex, border: s.border ? '1px solid #CBC5C1' : 'none' }} />
                          <div className="renewly-ds-swatch__name">{s.name}</div>
                          <div className="renewly-ds-swatch__hex">{s.hex}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="renewly-ds-palette-group">
                  <div className="renewly-ds-palette-group__label">Clinical status: red means safety, nothing else</div>
                  <div className="renewly-ds-status-row">
                    {cs.statusChips.map(c => (
                      <div key={c.label} className="renewly-ds-status-chip" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                        {c.label}
                        <span className="renewly-ds-status-chip__hex">{c.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-8)' }}>Components in use</h3>
              <p className="cs-section__body">
                The prototype ships its own design system documentation page. These sheets are captured from it, so the components shown are the components in use rather than a separate spec that can drift. Click a sheet to enlarge it.
              </p>
              <div className="af-ds-grid">
                {ds.slice(0, DS_SHOWN).map(i => <DsCard key={i.label} src={i.src} label={i.label} alt={dsAlt(i.label)} />)}
              </div>

              <Fold title="More component sheets" count={`${ds.length - DS_SHOWN} sheets`}>
                <div className="af-ds-grid">
                  {ds.slice(DS_SHOWN).map(i => <DsCard key={i.label} src={i.src} label={i.label} alt={dsAlt(i.label)} />)}
                </div>
              </Fold>

              <Fold title="Typography scale" count={`${cs.typeScale.length} steps`}>
                <p className="cs-section__body">
                  An eight-step scale with clear role separation, so a clinician can read patient identity, status, source, and action in under two seconds per row. The largest element on any screen is a section heading, not a hero statement: this is a working interface, not a landing page.
                </p>
                <div className="af-type">
                  <div className="renewly-ds-type-scale">
                    {cs.typeScale.map(t => (
                      <div key={t.role} className="renewly-ds-type-row">
                        <div className="renewly-ds-type-row__role">{t.role}</div>
                        <div className="renewly-ds-type-row__example">{t.example}</div>
                        <div className="renewly-ds-type-row__meta">{t.meta}</div>
                        <div className="renewly-ds-type-row__usage">{t.usage}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Fold>

              <Fold title="Design decision notes" count={`${cs.designNotes.length} notes`}>
                <div className="renewly-ds-notes">
                  {cs.designNotes.map(n => (
                    <div key={n.title} className="renewly-ds-row">
                      <div className="renewly-ds-row__title">{n.title}</div>
                      <div className="renewly-ds-row__body">{n.body}</div>
                    </div>
                  ))}
                </div>
              </Fold>
            </section>

            <section className="cs-section" id="screenshots">
              <h2 className="cs-section__title">Desktop prototype screens</h2>
              <p className="cs-section__body">
                Nine screens from the built React prototype cover the full clinician workflow. They are routed, deep-linkable, and captured from the deployed build rather than mocked up. Each screen went through repeated audit and refinement rounds before I froze it. Click any screen to see it in full.
              </p>
              {cs.desktopScreenshots.map((s, i) => (
                <div key={s.title} className="renewly-screen-entry">
                  <div className="renewly-screen-entry__header">
                    <div className="renewly-screen-entry__meta">
                      <span className="renewly-screen-entry__counter">
                        {String(i + 1).padStart(2, '0')} / {String(cs.desktopScreenshots.length).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="renewly-screen-entry__title">{s.title}</h3>
                    <p className="renewly-screen-entry__purpose">{s.purpose}</p>
                    <div className="renewly-screen-entry__note">{s.uxNote}</div>
                  </div>
                  <Shot src={s.src} alt={`${s.title} screen, desktop. ${sentence(s.purpose)}`} url={URL} cap={640} />
                </div>
              ))}
            </section>

            <section className="cs-section" id="mobile-screens">
              <h2 className="cs-section__title">Mobile prototype screens</h2>
              <p className="cs-section__body">
                At 390px there is no page-level horizontal scroll. Below the desktop breakpoint the 232px sidebar becomes a bottom tab bar, and summary state moves above the list so counts are legible before scrolling. Three table screens keep their remaining columns inside a horizontal scroll container rather than truncating. Four other screens (Shift Briefing, patient profile, Operational Insights, and Settings) still clip content inside their containers at this width. They are documented under Responsive QA and in the limitations, and are not shown here as finished.
              </p>
              <MobileGallery
                label="CareSync mobile screens"
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
                A six-stage loop ran for every screen: prompt, generate, audit, refine, freeze, systematise. AI accelerated exploration and implementation. The clinical framing, the colour semantics, and the decision about what to suppress versus surface stayed mine.
              </p>
              <Fold title="The six stages and what stayed human" count={`${cs.aiWorkflow.length} stages`}>
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
                I walked the clinician workflow end to end myself before each share, at desktop width and then at mobile width. That is a self-review: there was no structured usability testing and no session with practising clinicians. Seven rounds then moved the product from a dashboard-first draft to a shift-first system, and each was a structural change, not a cosmetic one.
              </p>
              <IterationLog iterations={cs.iterations} />
              <Fold title="Questions to test with clinicians" count={`${cs.testingChecklist.length} questions`}>
                <p className="cs-section__body">The path I walked: {cs.testingFlow}. These are the questions the review asks. They are not a record of passed tests.</p>
                <Checklist items={cs.testingChecklist} mark="box" />
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
                <p className="cs-section__body">This is a portfolio prototype using mock clinical data. It does not include:</p>
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

              <Fold title="Self-check against the brief" count={`${cs.finalValidation.length} items`}>
                <p className="cs-section__body">{cs.finalValidationNote}</p>
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
            <h2 className="cs-cta__title">Explore the working prototype and project repository.</h2>
            <p className="cs-cta__sub">React, a hand-built clinical design system, and a documented product workflow from problem framing to a deployed prototype.</p>
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
      <NextProject />
      <Footer />
    </>
  );
}
