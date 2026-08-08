import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CaseStudyHero from '../components/case-study/CaseStudyHero';
import CaseStudyNav from '../components/case-study/CaseStudyNav';
import IterationLog from '../components/case-study/IterationLog';
import ResponsiveQA from '../components/case-study/ResponsiveQA';
import Button from '../components/ui/Button';
import { renewlyCaseStudy as cs } from '../data/renewlyCaseStudy';

const renewlyNavItems = [
  { id: 'snapshot', label: 'Project snapshot' },
  { id: 'demonstrates', label: 'What this demonstrates' },
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'goals', label: 'Goals' },
  { id: 'assumptions', label: 'Product assumptions' },
  { id: 'product-flow', label: 'Product flow' },
  { id: 'ia', label: 'Information architecture' },
  { id: 'wireframes', label: 'Wireframes' },
  { id: 'decisions', label: 'Key UX decisions' },
  { id: 'design-system', label: 'Design system' },
  { id: 'web-screens', label: 'Web UI screens' },
  { id: 'mobile-screens', label: 'Mobile UI screens' },
  { id: 'ai-workflow', label: 'AI-assisted workflow' },
  { id: 'technical', label: 'Technical implementation' },
  { id: 'testing', label: 'Testing' },
  { id: 'iterations', label: 'Iterations' },
  { id: 'responsive-qa', label: 'Responsive QA' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'tech-stack', label: 'Tech stack' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'validation', label: 'Final validation' },
  { id: 'reflection', label: 'Reflection' },
];

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

export default function RenewlyCaseStudyPage() {
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
          heroImage="/images/projects/renewly/clean/desktop-dashboard.png"
          heroImageAlt="Renewly dashboard, SaaS renewal management"
          prototypeUrlLabel="renewly-ux.vercel.app"
        />

        <div className="cs-layout">
          <CaseStudyNav items={renewlyNavItems} />
          <div className="cs-content">

            {/* 1. PROJECT SNAPSHOT */}
            <section className="cs-section" id="snapshot">
              <h2 className="cs-section__title">Project snapshot</h2>
              <div className="snapshot-grid snapshot-grid--5">
                {[
                  { label: 'Role', value: cs.snapshot.role },
                  { label: 'Timeline', value: cs.snapshot.timeline },
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
              {cs.overviewParagraphs.map((p, i) => (
                <p key={i} className="cs-section__body">{p}</p>
              ))}
            </section>

            {/* 4. PROBLEM */}
            <section className="cs-section" id="problem">
              <h2 className="cs-section__title">Problem</h2>
              <p className="cs-section__body">{cs.problem}</p>
              <p className="cs-section__body" style={{ marginTop: 'var(--space-3)' }}>
                The design challenge was to create a clearer interface that helps users quickly answer:
              </p>
              <div className="cs-question-list">
                {cs.problemQuestions.map(q => (
                  <div key={q} className="cs-question-item">
                    <span className="cs-question-item__bullet">&#x2192;</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
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

            {/* 6. PRODUCT ASSUMPTIONS FROM UX REVIEW */}
            <section className="cs-section" id="assumptions">
              <h2 className="cs-section__title">Product assumptions from UX review</h2>
              <p className="cs-section__body">Five recurring patterns shaped the key UX decisions for this product.</p>
              <div className="cs-cards-grid">
                {cs.researchInsights.map((r, i) => (
                  <div key={r.title} className="cs-card cs-card--insight">
                    <div className="cs-card__number">{String(i + 1).padStart(2, '0')}</div>
                    <div className="cs-card__title">{r.title}</div>
                    <div className="cs-insight-row cs-insight-row--issue">
                      <span className="cs-insight-label">What this means</span>
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

            {/* 7. PRODUCT FLOW */}
            <section className="cs-section" id="product-flow">
              <h2 className="cs-section__title">Product flow</h2>
              <p className="cs-section__body">{cs.userJourneyDescription}</p>
              <div className="cs-image-wrap" style={{ marginTop: 'var(--space-6)' }}>
                <img
                  src="/images/projects/renewly/wireframes/flow-map.png"
                  alt="Renewly renewal decision flow"
                  className="cs-image"
                  style={{ maxHeight: 'none', objectFit: 'contain' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            </section>

            {/* 8. INFORMATION ARCHITECTURE */}
            <section className="cs-section" id="ia">
              <h2 className="cs-section__title">Information architecture</h2>
              <p className="cs-section__body">{cs.iaDescription}</p>
              <div className="cs-image-wrap" style={{ marginTop: 'var(--space-6)' }}>
                <img
                  src="/images/projects/renewly/wireframes/ia-map.png"
                  alt="Renewly information architecture"
                  className="cs-image"
                  style={{ maxHeight: 'none', objectFit: 'contain' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            </section>

            {/* 9. WIREFRAMES */}
            <section className="cs-section" id="wireframes">
              <h2 className="cs-section__title">Wireframes</h2>
              <p className="cs-section__body">{cs.wireframesDescription}</p>
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
            </section>

            {/* 10. KEY UX DECISIONS */}
            <section className="cs-section" id="decisions">
              <h2 className="cs-section__title">Key UX decisions</h2>
              <p className="cs-section__body">Seven decisions shaped the structure and clarity of the renewal management experience.</p>
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

              {/* Foundations screenshot */}
              <div className="renewly-ds-full-img" style={{ marginTop: 'var(--space-6)' }}>
                <img
                  src="/images/projects/renewly/design-system/00-foundations.png"
                  alt="Foundations and components"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="design-system-img__label">Foundations and components</div>
              </div>

              {/* Colour palette */}
              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-8)' }}>Colour palette</h3>
              <div className="renewly-ds-palette">
                <div className="renewly-ds-palette-group">
                  <div className="renewly-ds-palette-group__label">Foundation neutrals</div>
                  <div className="renewly-ds-swatch-row">
                    {[
                      { name: 'Page background', hex: '#F8FAFC', border: true },
                      { name: 'Card background', hex: '#FFFFFF', border: true },
                      { name: 'Border', hex: '#E2E8F0', border: true },
                      { name: 'Strong text', hex: '#0F172A', border: false },
                      { name: 'Secondary text', hex: '#475569', border: false },
                      { name: 'Muted text', hex: '#64748B', border: false },
                      { name: 'Primary action', hex: '#334155', border: false },
                    ].map(s => (
                      <div key={s.hex} className="renewly-ds-swatch">
                        <div className="renewly-ds-swatch__box" style={{ background: s.hex, border: s.border ? '1px solid #CBD5E1' : 'none' }} />
                        <div className="renewly-ds-swatch__name">{s.name}</div>
                        <div className="renewly-ds-swatch__hex">{s.hex}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="renewly-ds-palette-group">
                  <div className="renewly-ds-palette-group__label">Status colours</div>
                  <div className="renewly-ds-status-row">
                    {[
                      { label: 'High risk', bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
                      { label: 'Medium risk', bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
                      { label: 'Low risk', bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
                      { label: 'Waiting finance', bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
                      { label: 'Needs review', bg: '#F8FAFC', text: '#475569', border: '#CBD5E1' },
                    ].map(s => (
                      <div key={s.label} className="renewly-ds-status-chip" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                        {s.label}
                        <span className="renewly-ds-status-chip__hex">{s.bg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status indicators */}
              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-8)' }}>Status indicators</h3>
              <p className="cs-section__body">All risk and approval states include a text label alongside colour, never colour alone.</p>
              <div className="renewly-ds-chips-row">
                {[
                  { label: 'High risk', bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
                  { label: 'Medium risk', bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
                  { label: 'Low risk', bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
                  { label: 'Approved', bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
                  { label: 'Waiting finance', bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
                  { label: 'Needs owner review', bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
                  { label: 'Active', bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
                  { label: 'Under review', bg: '#F8FAFC', text: '#475569', border: '#CBD5E1' },
                ].map(c => (
                  <span key={c.label} className="renewly-ds-chip" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                    {c.label}
                  </span>
                ))}
              </div>

              {/* Button variants */}
              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-8)' }}>Button variants</h3>
              <div className="renewly-ds-buttons-row">
                <button className="renewly-ds-btn renewly-ds-btn--primary">Approve renewal</button>
                <button className="renewly-ds-btn renewly-ds-btn--secondary">Request changes</button>
                <button className="renewly-ds-btn renewly-ds-btn--outline">View details</button>
                <button className="renewly-ds-btn renewly-ds-btn--destructive">Mark for cancellation</button>
                <button className="renewly-ds-btn renewly-ds-btn--disabled" disabled>Unavailable</button>
              </div>

              {/* Typography */}
              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-8)' }}>Typography scale</h3>
              <div className="renewly-ds-type-scale">
                {[
                  { role: 'Dashboard metric', example: '$24,820', size: '28px · Bold', usage: 'KPI numbers, spend totals' },
                  { role: 'Page heading', example: 'Renewal Calendar', size: '20px · Semibold', usage: 'Section titles, screen names' },
                  { role: 'Card title', example: 'Forge Analytics', size: '15px · Semibold', usage: 'Subscription names, card headers' },
                  { role: 'Body text', example: 'Renews in 14 days · High risk · 48 of 60 seats used', size: '14px · Regular', usage: 'Descriptions, detail text' },
                  { role: 'Badge / caption', example: 'PENDING APPROVAL', size: '12px · Semibold · Uppercase', usage: 'Status labels, metadata, chips' },
                ].map(t => (
                  <div key={t.role} className="renewly-ds-type-row">
                    <div className="renewly-ds-type-row__role">{t.role}</div>
                    <div className="renewly-ds-type-row__example">{t.example}</div>
                    <div className="renewly-ds-type-row__meta">{t.size}</div>
                    <div className="renewly-ds-type-row__usage">{t.usage}</div>
                  </div>
                ))}
              </div>

              {/* Component inventory */}
              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-8)' }}>Component inventory</h3>
              <div className="renewly-ds-components-grid">
                {[
                  'Primary button', 'Secondary button', 'Destructive button', 'Disabled state',
                  'Status chip', 'Risk badge', 'Approval badge', 'Active badge',
                  'Summary metric card', 'Subscription table row', 'Mobile subscription card',
                  'Approval card', 'Savings card', 'Detail card', 'Report card',
                  'Desktop sidebar nav', 'Mobile bottom nav', 'Topbar / breadcrumb',
                  'Search input', 'Dropdown filter', 'Settings form field', 'Checkbox row',
                  'Mobile action sheet', 'Alert / warning state',
                ].map(c => (
                  <div key={c} className="renewly-ds-component-item">{c}</div>
                ))}
              </div>
            </section>

            {/* 12. WEB UI SCREENS */}
            <section className="cs-section" id="web-screens">
              <h2 className="cs-section__title">Web UI screens</h2>
              <p className="cs-section__body">
                Eight screens covering the full renewal management workflow, from command centre overview through to decision-making, reporting, and configuration.
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
                  <div className="renewly-browser-chrome">
                    <div className="renewly-browser-bar">
                      <span className="renewly-browser-dot" />
                      <span className="renewly-browser-dot" />
                      <span className="renewly-browser-dot" />
                      <span className="renewly-browser-url-bar">renewly-ux.vercel.app</span>
                    </div>
                    <div className="renewly-browser-body renewly-browser-body--full">
                      <img src={s.src} alt={s.title} className="renewly-browser-img"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* 13. MOBILE UI SCREENS */}
            <section className="cs-section" id="mobile-screens">
              <h2 className="cs-section__title">Mobile UI screens</h2>
              <p className="cs-section__body">
                The mobile screens adapt the same renewal workflow into a focused, stacked experience. Instead of compressing desktop tables, each screen prioritises summary, status, and the primary action for that context.
              </p>
              <div className="renewly-mobile-gallery">
                {cs.mobileScreenshots.map(screen => (
                  <div key={screen.title} className="renewly-mobile-item">
                    <div className="renewly-mobile-caption">
                      <div className="renewly-mobile-caption__title">{screen.title}</div>
                      <div className="renewly-mobile-caption__note">{screen.responsiveDecision}</div>
                    </div>
                    <div className="renewly-mobile-frame">
                      <img
                        src={screen.src}
                        alt={screen.title}
                        className="renewly-mobile-img"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 14. AI-ASSISTED WORKFLOW */}
            <section className="cs-section" id="ai-workflow">
              <h2 className="cs-section__title">AI-assisted workflow</h2>
              <p className="cs-section__body">
                I used AI tools throughout this project for research prompts, critique, implementation planning, and code review. Every product decision, UX call, and QA check was mine. The tools accelerated the work; they did not make the calls.
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
                AI accelerated critique, planning, and implementation preparation, but it did not replace UX judgement.
              </div>
            </section>

            {/* 15. TECHNICAL IMPLEMENTATION */}
            <section className="cs-section" id="technical">
              <h2 className="cs-section__title">Technical implementation</h2>
              <p className="cs-section__body">{cs.technicalDescription}</p>
              <Checklist items={cs.technicalPoints} />
            </section>

            {/* 16. TESTING AND REVIEW PLAN */}
            <section className="cs-section" id="testing">
              <h2 className="cs-section__title">Testing and review plan</h2>
              <p className="cs-section__body">
                The next validation pass would test whether finance and admin users can understand the dashboard, identify high-risk renewals, open a detail page, review approval context, and complete a decision on both desktop and mobile.
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
              <p className="cs-section__body">Six iteration rounds addressed specific UX, layout, and responsiveness issues found during testing and review.</p>
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
              <h2 className="cs-section__title">Accessibility considerations</h2>
              <p className="cs-section__body">
                Even at the portfolio prototype stage, accessibility considerations were treated as part of the product structure. Status, hierarchy, labels, and mobile tap targets should remain clear when the design is expanded into a production-ready prototype.
              </p>
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

            {/* 19. LIMITATIONS + NEXT STEPS */}
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

            {/* FINAL VALIDATION */}
            <section className="cs-section" id="validation">
              <h2 className="cs-section__title">Final validation</h2>
              <Checklist items={cs.finalValidation} />
            </section>

            {/* REFLECTION */}
            <section className="cs-section" id="reflection">
              <h2 className="cs-section__title">Reflection</h2>
              <p className="cs-section__body">{cs.reflection}</p>
            </section>

          </div>
        </div>

        {/* FINAL CTA */}
        <section className="cs-cta">
          <div className="container">
            <h2 className="cs-cta__title">Explore more product case studies.</h2>
            <p className="cs-cta__sub">I built Renewly to show how I work: from research and user flows through Figma and on to a responsive React prototype that actually runs.</p>
            <div className="cs-cta__actions">
              <Button href="/" variant="dark" size="lg">
                Back to selected work
              </Button>
              <Button href="/projects/riverside-general" variant="dark-outline" size="lg">
                View Riverside case study
              </Button>
              <Button href={cs.prototypeUrl} variant="dark-outline" external size="lg">
                View live Renewly prototype &#x2197;
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
