import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CaseStudyHero from '../components/case-study/CaseStudyHero';
import SnapshotGrid from '../components/case-study/SnapshotGrid';
import CaseStudyNav from '../components/case-study/CaseStudyNav';
import IterationLog from '../components/case-study/IterationLog';
import ResponsiveQA from '../components/case-study/ResponsiveQA';
import Button from '../components/ui/Button';
import { caresyncCaseStudy as cs } from '../data/caresyncCaseStudy';

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

export default function CareSyncCaseStudyPage() {
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
          heroImage="/images/projects/caresync/desktop/dashboard.png"
          heroImageAlt="CareSync shift briefing, the clinical command centre"
          prototypeUrlLabel="care-sync-two-mu.vercel.app/shift-briefing"
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
              <p className="cs-section__body">A quick scan for recruiters. The skills and mindset shown across this project.</p>
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
              <p className="cs-section__body">
                This was an assignment sprint without access to live hospital sessions, so the direction came from a
                landscape audit of clinical SaaS tools, a heuristic review of dashboard anti-patterns, and an informal
                conversation with a practising physician. Six recurring patterns shaped the key UX decisions.
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

            {/* 7. EARLY STRUCTURE: WIREFRAMES, IA, AND FLOW MAPPING */}
            <section className="cs-section" id="early-structure">
              <h2 className="cs-section__title">Early structure: wireframes, IA, and flow mapping</h2>
              <p className="cs-section__body">{cs.earlyStructureIntro}</p>

              <h3 className="cs-section__subtitle">Clinician flow</h3>
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

              <h3 className="cs-section__subtitle">Information architecture</h3>
              <p className="cs-section__body">{cs.iaDescription}</p>

              <h3 className="cs-section__subtitle">Wireframes</h3>
              <p className="cs-section__body">{cs.wireframesDescription}</p>
              {cs.wireframeImages.length > 0 && (
                <div className="wireframes-grid wireframes-grid--2col">
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

            {/* 8. KEY UX DECISIONS */}
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

            {/* 9. DESIGN SYSTEM */}
            <section className="cs-section" id="design-system">
              <h2 className="cs-section__title">Design system</h2>
              <p className="cs-section__body">{cs.designSystemDescription}</p>

              {/* Colour palette */}
              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-8)' }}>Colour palette</h3>
              <div className="renewly-ds-palette">
                <div className="renewly-ds-palette-group">
                  <div className="renewly-ds-palette-group__label">Brand — aubergine</div>
                  <div className="renewly-ds-swatch-row">
                    {cs.brandScale.map(s => (
                      <div key={s.name} className="renewly-ds-swatch">
                        <div className="renewly-ds-swatch__box" style={{ background: s.hex, border: s.border ? '1px solid #CBC5C1' : 'none' }} />
                        <div className="renewly-ds-swatch__name">{s.name}</div>
                        <div className="renewly-ds-swatch__hex">{s.hex}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="renewly-ds-palette-group">
                  <div className="renewly-ds-palette-group__label">Warm neutral surfaces</div>
                  <div className="renewly-ds-swatch-row">
                    {cs.surfaceScale.map(s => (
                      <div key={s.name} className="renewly-ds-swatch">
                        <div className="renewly-ds-swatch__box" style={{ background: s.hex, border: s.border ? '1px solid #CBC5C1' : 'none' }} />
                        <div className="renewly-ds-swatch__name">{s.name}</div>
                        <div className="renewly-ds-swatch__hex">{s.hex}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="renewly-ds-palette-group">
                  <div className="renewly-ds-palette-group__label">Clinical status — red means safety, nothing else</div>
                  <div className="renewly-ds-status-row">
                    {cs.statusChips.map(c => (
                      <div
                        key={c.label}
                        className="renewly-ds-status-chip"
                        style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                      >
                        {c.label}
                        <span className="renewly-ds-status-chip__hex">{c.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Typography */}
              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-8)' }}>Typography</h3>
              <p className="cs-section__body">
                An eight-step scale with clear role separation, so a clinician can read patient identity, status, source,
                and action in under two seconds per row. The largest element on any screen is a section heading, not a
                hero statement — this is a working interface, not a landing page.
              </p>
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

              {/* Design decisions */}
              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-8)' }}>Design decision notes</h3>
              <div className="renewly-ds-notes">
                {cs.designNotes.map(n => (
                  <div key={n.title} className="renewly-ds-row">
                    <div className="renewly-ds-row__title">{n.title}</div>
                    <div className="renewly-ds-row__body">{n.body}</div>
                  </div>
                ))}
              </div>

              {/* Component documentation captured from the product itself */}
              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-8)' }}>Components</h3>
              <p className="cs-section__body">
                The prototype ships its own design system documentation page. These are captured from it, so the
                components shown are the components in use rather than a separate spec that can drift.
              </p>
              <div className="design-system-grid">
                {cs.designSystemImages.map(img => (
                  <div key={img.label} className="design-system-img">
                    <img
                      src={img.src}
                      alt={img.label}
                      loading="lazy"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="design-system-img__label">{img.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 10. DESKTOP PROTOTYPE SCREENS */}
            <section className="cs-section" id="screenshots">
              <h2 className="cs-section__title">Desktop prototype screens</h2>
              <p className="cs-section__body">
                Nine screens from the built React prototype covering the full clinician workflow. Routed, deep-linkable,
                and functional end to end, captured from the deployed build rather than mocked up. Each screen was
                refined through repeated audit and refinement rounds before being frozen.
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
                  <div className="renewly-browser-chrome">
                    <div className="renewly-browser-bar">
                      <span className="renewly-browser-dot" />
                      <span className="renewly-browser-dot" />
                      <span className="renewly-browser-dot" />
                      <span className="renewly-browser-url-bar">care-sync-two-mu.vercel.app</span>
                    </div>
                    <div className="renewly-browser-body renewly-browser-body--full">
                      <img src={s.src} alt={s.title} className="renewly-browser-img" loading="lazy"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* 11. MOBILE PROTOTYPE SCREENS */}
            <section className="cs-section" id="mobile-screens">
              <h2 className="cs-section__title">Mobile prototype screens</h2>
              <p className="cs-section__body">
                Validated at 390px. Below the desktop breakpoint the 232px sidebar is replaced by a bottom tab bar, and
                summary state moves above the list so counts are legible before scrolling. On the three table screens the
                remaining columns sit inside a horizontal scroll container rather than truncating. Four further screens —
                Shift Briefing, patient profile, Operational Insights, and Settings — still clip content at this width
                and are documented under Responsive QA and limitations rather than shown here as finished.
              </p>
              <div className="renewly-mobile-gallery renewly-mobile-gallery--3col">
                {cs.mobileScreenshots.map(s => (
                  <div key={s.title} className="renewly-mobile-item">
                    <div className="renewly-mobile-caption">
                      <div className="renewly-mobile-caption__title">{s.title}</div>
                      <div className="renewly-mobile-caption__note">{s.uxNote}</div>
                    </div>
                    <div className="renewly-mobile-frame">
                      <img src={s.src} alt={s.title} className="renewly-mobile-img" loading="lazy"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 12. AI-ASSISTED WORKFLOW */}
            <section className="cs-section" id="ai-workflow">
              <h2 className="cs-section__title">AI-assisted workflow</h2>
              <p className="cs-section__body">
                A six-stage loop ran for every screen: prompt, generate, audit, refine, freeze, systematise. AI
                accelerated exploration and implementation, but the clinical framing, the colour semantics, and the
                decision about what to suppress versus surface stayed mine.
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
                I used AI as a design critic and implementation partner, not as a replacement for design judgement.
                Every screen was audited section by section against clinical credibility, token consistency, and
                accessibility compliance, and revised until it was right.
              </div>
            </section>

            {/* 13. TECHNICAL IMPLEMENTATION */}
            <section className="cs-section" id="technical">
              <h2 className="cs-section__title">Technical implementation</h2>
              <p className="cs-section__body">{cs.technicalDescription}</p>
              <Checklist items={cs.technicalPoints} />
            </section>

            {/* 14. TESTING */}
            <section className="cs-section" id="testing">
              <h2 className="cs-section__title">Testing and usability review</h2>
              <p className="cs-section__body">
                The full clinician workflow was walked end to end before each share, at desktop width and then at mobile
                width:
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

            {/* 16. ITERATIONS */}
            <section className="cs-section" id="iterations">
              <h2 className="cs-section__title">Feedback and iteration log</h2>
              <p className="cs-section__body">
                Seven iteration rounds moved the product from a dashboard-first draft to a shift-first system. Each one
                was a structural change, not a cosmetic one.
              </p>
              <IterationLog iterations={cs.iterations} />
            </section>

            {/* 17. RESPONSIVE QA */}
            <section className="cs-section" id="responsive-qa">
              <h2 className="cs-section__title">Responsive QA</h2>
              <p className="cs-section__body">{cs.responsiveQADescription}</p>
              <ResponsiveQA items={cs.responsiveQA} />
            </section>

            {/* 18. ACCESSIBILITY */}
            <section className="cs-section" id="accessibility">
              <h2 className="cs-section__title">Accessibility</h2>
              <Checklist items={cs.accessibilityChecklist} />
            </section>

            {/* 19. TECH STACK */}
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

            {/* 20. LIMITATIONS + NEXT STEPS */}
            <section className="cs-section" id="limitations">
              <h2 className="cs-section__title">Limitations and next steps</h2>
              <p className="cs-section__body">This is a portfolio prototype using mock clinical data. It does not include:</p>
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

            {/* 21. FINAL VALIDATION */}
            <section className="cs-section" id="validation">
              <h2 className="cs-section__title">Final validation</h2>
              <Checklist items={cs.finalValidation} />
            </section>

            {/* 22. REFLECTION */}
            <section className="cs-section" id="reflection">
              <h2 className="cs-section__title">Reflection</h2>
              <p className="cs-section__body">{cs.reflection}</p>
            </section>

          </div>
        </div>

        <section className="cs-cta">
          <div className="container">
            <h2 className="cs-cta__title">Explore the working prototype and project repository.</h2>
            <p className="cs-cta__sub">React, a hand-built clinical design system, and a documented product workflow from problem framing to shipped prototype.</p>
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
