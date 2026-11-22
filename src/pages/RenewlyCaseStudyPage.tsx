import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import NextProject from '../components/case-study/NextProject';
import CaseStudyHero from '../components/case-study/CaseStudyHero';
import CaseStudyNav from '../components/case-study/CaseStudyNav';
import IterationLog from '../components/case-study/IterationLog';
import ResponsiveQA from '../components/case-study/ResponsiveQA';
import Button from '../components/ui/Button';
import Img from '../components/case-study/Img';
import { Fold, Checklist, Shot, MobileGallery, Diagram, sentence } from '../components/audit/AuditBlocks';
import { imgSize } from '../data/imageSizes';
import { renewlyCaseStudy as cs } from '../data/renewlyCaseStudy';
import '../styles/audit-renewly.css';

const renewlyNavItems = [
  { id: 'snapshot', label: 'Project snapshot' },
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
  { id: 'iterations', label: 'Design review and iterations' },
  { id: 'testing', label: 'Testing plan' },
  { id: 'details', label: 'Details' },
  { id: 'reflection', label: 'Reflection' },
];

const URL = 'renewly-ux.vercel.app';
const WF_SHOWN = [0, 3, 5];

const statusColours = [
  { label: 'High risk', bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
  { label: 'Medium risk', bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  { label: 'Low risk', bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  { label: 'Waiting finance', bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
  { label: 'Needs review', bg: '#F8FAFC', text: '#475569', border: '#CBD5E1' },
];

export default function RenewlyCaseStudyPage() {
  const wf = cs.wireframeImages;
  return (
    <>
      <Header />
      <main className="case-study-page af-page af-renewly">
        <CaseStudyHero
          title={cs.title}
          subtitle={cs.subtitle}
          tags={cs.tags}
          prototypeUrl={cs.prototypeUrl}
          githubUrl={cs.githubUrl}
          heroImage="/images/projects/renewly/clean/desktop-dashboard.jpg"
          heroImageAlt="Renewly dashboard: monthly spend, upcoming renewals, high-risk tools and savings in a SaaS renewal command centre"
          prototypeUrlLabel={URL}
          statusLabel="Working prototype"
          myPart="UX/UI design, product framing and the React and TypeScript prototype. AI tools supported critique and implementation planning; the decisions were mine."
          outcome="A live prototype with eight screens on mock data. It has not been usability tested: the issues below came from my own design review."
        />

        <div className="cs-layout">
          <CaseStudyNav items={renewlyNavItems} />
          <div className="cs-content">

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

            <section className="cs-section" id="overview">
              <h2 className="cs-section__title">Overview</h2>
              {cs.overviewParagraphs.map((p, i) => (
                <p key={i} className="cs-section__body">{p}</p>
              ))}
            </section>

            <section className="cs-section" id="problem">
              <h2 className="cs-section__title">Problem</h2>
              <p className="cs-section__body">{cs.problem}</p>
              <p className="cs-section__body" style={{ marginTop: 'var(--space-3)' }}>
                The design challenge was a clearer interface that helps users quickly answer:
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

            <section className="cs-section" id="assumptions">
              <h2 className="cs-section__title">Product assumptions from UX review</h2>
              <p className="cs-section__body">Five working assumptions shaped the key decisions. They come from my own review of how renewal work usually goes, not from interviews with finance users.</p>
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

            <section className="cs-section" id="product-flow">
              <h2 className="cs-section__title">Product flow</h2>
              <p className="cs-section__body">{cs.userJourneyDescription}</p>
              <Diagram
                src="/images/projects/renewly/wireframes/flow-map.jpg"
                alt="Flow diagram of the Renewly renewal decision, from the dashboard to a high-risk renewal, the detail screen, a decision, and tracking in the calendar, queue or reports"
                caption="Click the diagram to enlarge it. The same flow as text:"
                steps={cs.userJourneySteps}
              />
            </section>

            <section className="cs-section" id="ia">
              <h2 className="cs-section__title">Information architecture</h2>
              <p className="cs-section__body">{cs.iaDescription}</p>
              <Diagram
                src="/images/projects/renewly/wireframes/ia-map.jpg"
                alt="Information architecture map of Renewly: Dashboard, Subscriptions, Renewal Calendar, Approval Queue, Savings, and Reports and Settings, each with its contents"
                caption="Click the map to enlarge it. The six areas and what each holds:"
                steps={cs.iaColumns.map(c => `${c.label}: ${c.items.join(', ')}`)}
              />
            </section>

            <section className="cs-section" id="wireframes">
              <h2 className="cs-section__title">Wireframes</h2>
              <p className="cs-section__body">{cs.wireframesDescription}</p>
              <div className="af-wf-grid">
                {WF_SHOWN.map(i => (
                  <figure key={wf[i].label} className="af-wf">
                    <div className="af-wf__frame">
                      <Img src={wf[i].src} {...imgSize(wf[i].src)} alt={`Low-fidelity wireframe. ${wf[i].label}`} zoom />
                    </div>
                    <figcaption>{wf[i].label}. Click to enlarge.</figcaption>
                  </figure>
                ))}
              </div>
              <Fold title="The other wireframes" count={`${wf.length - WF_SHOWN.length} more`}>
                <div className="af-wf-grid">
                  {wf.filter((_, i) => !WF_SHOWN.includes(i)).map(w => (
                    <figure key={w.label} className="af-wf">
                      <div className="af-wf__frame">
                        <Img src={w.src} {...imgSize(w.src)} alt={`Low-fidelity wireframe. ${w.label}`} zoom />
                      </div>
                      <figcaption>{w.label}</figcaption>
                    </figure>
                  ))}
                </div>
              </Fold>
            </section>

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

            <section className="cs-section" id="design-system">
              <h2 className="cs-section__title">Design system</h2>
              <p className="cs-section__body">{cs.designSystemDescription}</p>

              <div className="renewly-ds-full-img" style={{ marginTop: 'var(--space-6)' }}>
                <Img
                  src="/images/projects/renewly/design-system/00-foundations.jpg" {...imgSize('/images/projects/renewly/design-system/00-foundations.jpg')}
                  alt="Design system foundations sheet showing the colours, type, buttons, status chips and cards used across Renewly"
                  zoom
                />
                <div className="design-system-img__label">Foundations and components. Click to enlarge.</div>
              </div>

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
                    {statusColours.map(s => (
                      <div key={s.label} className="renewly-ds-status-chip" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                        {s.label}
                        <span className="renewly-ds-status-chip__hex">{s.bg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-8)' }}>Status indicators</h3>
              <p className="cs-section__body">All risk and approval states include a text label alongside colour, never colour alone.</p>
              <div className="renewly-ds-chips-row">
                {[
                  ...statusColours.slice(0, 3),
                  { label: 'Approved', bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
                  statusColours[3],
                  { label: 'Needs owner review', bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
                  { label: 'Active', bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
                  { label: 'Under review', bg: '#F8FAFC', text: '#475569', border: '#CBD5E1' },
                ].map(c => (
                  <span key={c.label} className="renewly-ds-chip" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                    {c.label}
                  </span>
                ))}
              </div>

              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-8)' }}>Button variants</h3>
              <div className="af-specimen" role="group" aria-label="Button variants. A specimen for reference, not interactive.">
                <span className="af-specimen__tag">Specimen, not interactive</span>
                <div className="renewly-ds-buttons-row">
                  <span className="renewly-ds-btn renewly-ds-btn--primary">Approve renewal</span>
                  <span className="renewly-ds-btn renewly-ds-btn--secondary">Request changes</span>
                  <span className="renewly-ds-btn renewly-ds-btn--outline">View details</span>
                  <span className="renewly-ds-btn renewly-ds-btn--destructive">Mark for cancellation</span>
                  <span className="renewly-ds-btn renewly-ds-btn--disabled">Unavailable</span>
                </div>
              </div>

              <Fold title="Typography scale" count="5 roles">
                <div className="af-type">
                  <div className="renewly-ds-type-scale">
                    {[
                      { role: 'Dashboard metric', example: '$24,820', size: '28px, Bold', usage: 'KPI numbers, spend totals' },
                      { role: 'Page heading', example: 'Renewal Calendar', size: '20px, Semibold', usage: 'Section titles, screen names' },
                      { role: 'Card title', example: 'Forge Analytics', size: '15px, Semibold', usage: 'Subscription names, card headers' },
                      { role: 'Body text', example: 'Renews in 14 days · High risk · 48 of 60 seats used', size: '14px, Regular', usage: 'Descriptions, detail text' },
                      { role: 'Badge / caption', example: 'PENDING APPROVAL', size: '12px, Semibold, Uppercase', usage: 'Status labels, metadata, chips' },
                    ].map(t => (
                      <div key={t.role} className="renewly-ds-type-row">
                        <div className="renewly-ds-type-row__role">{t.role}</div>
                        <div className="renewly-ds-type-row__example">{t.example}</div>
                        <div className="renewly-ds-type-row__meta">{t.size}</div>
                        <div className="renewly-ds-type-row__usage">{t.usage}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Fold>

              <Fold title="Component inventory" count="24 components">
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
              </Fold>
            </section>

            <section className="cs-section" id="web-screens">
              <h2 className="cs-section__title">Web UI screens</h2>
              <p className="cs-section__body">
                Eight screens cover the renewal workflow, from the command-centre overview to decisions, reporting, and configuration. Click any screen to see it in full.
              </p>
              {cs.desktopScreenshots.map((s, i) => {
                const isDetail = s.title === 'Subscription Detail';
                return (
                  <div key={s.title} className="renewly-screen-entry">
                    <div className="renewly-screen-entry__header">
                      <div className="renewly-screen-entry__meta">
                        <span className="renewly-screen-entry__counter">{String(i + 1).padStart(2, '0')} / {String(cs.desktopScreenshots.length).padStart(2, '0')}</span>
                      </div>
                      <h3 className="renewly-screen-entry__title">{s.title}</h3>
                      <p className="renewly-screen-entry__purpose">{s.purpose}</p>
                      <div className="renewly-screen-entry__note">{s.uxNote}</div>
                    </div>
                    <Shot
                      src={s.src}
                      alt={`${s.title} screen, desktop. ${sentence(s.purpose)}`}
                      url={URL}
                      cap={640}
                      crop={isDetail ? { x: 260, y: 0, w: 1340, h: 1060 } : undefined}
                    />
                    {isDetail && <p className="af-shot__hint">Preview cropped to the header, key figures and the Decision panel. Click to open the whole page.</p>}
                  </div>
                );
              })}
            </section>

            <section className="cs-section" id="mobile-screens">
              <h2 className="cs-section__title">Mobile UI screens</h2>
              <p className="cs-section__body">
                The mobile screens adapt the same workflow into a stacked experience. Instead of compressing desktop tables, each screen leads with summary, status, and the main action.
              </p>
              <MobileGallery
                label="Renewly mobile screens"
                items={cs.mobileScreenshots.map(s => ({
                  src: s.src, title: s.title, note: s.responsiveDecision,
                  alt: `${s.title} screen on a phone. ${sentence(s.purpose)}`,
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
              <h2 className="cs-section__title">Design review and iterations</h2>
              <p className="cs-section__body">Six rounds addressed UX, layout, and responsive issues that I found in my own design review. No usability test was run.</p>
              <IterationLog iterations={cs.iterations} />
              <Fold title="Responsive QA" count={`${cs.responsiveQA.length} widths`}>
                <p className="cs-section__body">{cs.responsiveQADescription}</p>
                <ResponsiveQA items={cs.responsiveQA} />
              </Fold>
            </section>

            <section className="cs-section" id="testing">
              <h2 className="cs-section__title">Testing plan</h2>
              <p className="cs-section__body">
                Planned, not yet run. The next validation pass would test whether finance and admin users can understand the dashboard, find the high-risk renewals, open a detail page, review approval context, and complete a decision on desktop and mobile.
              </p>
              <Fold title="Questions to test" count={`${cs.testingChecklist.length} questions, none run yet`}>
                <p className="cs-section__body">{cs.testingFlow}</p>
                <Checklist items={cs.testingChecklist} mark="box" />
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

              <Fold title="Accessibility: built, measured, planned" count={`${cs.accessibilityChecklist.length} notes`}>
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

              <Fold title="Checked against the screens" count={`${cs.finalValidation.length} items`}>
                <p className="cs-section__body">{cs.finalValidationNote}</p>
                <Checklist items={cs.finalValidation} mark="check" />
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
            <h2 className="cs-cta__title">Explore more product case studies.</h2>
            <p className="cs-cta__sub">I built Renewly to show how I work: from product flows through Figma and on to a responsive React prototype that runs.</p>
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
      <NextProject />
      <Footer />
    </>
  );
}
