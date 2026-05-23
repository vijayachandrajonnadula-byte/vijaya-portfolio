import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CaseStudyHero from '../components/case-study/CaseStudyHero';
import CaseStudyNav from '../components/case-study/CaseStudyNav';
import Button from '../components/ui/Button';
import { afsCaseStudy as cs } from '../data/afsCaseStudy';

const afsNavItems = [
  { id: 'snapshot', label: 'Project snapshot' },
  { id: 'confidentiality', label: 'Confidentiality note' },
  { id: 'demonstrates', label: 'What this demonstrates' },
  { id: 'overview', label: 'Product overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'users', label: 'Users and tasks' },
  { id: 'ia', label: 'Information architecture' },
  { id: 'user-flow', label: 'User flow' },
  { id: 'wireframes', label: 'Wireframe reconstruction' },
  { id: 'decisions', label: 'Key UX decisions' },
  { id: 'design-system', label: 'Design system' },
  { id: 'screens', label: 'UI screen walkthrough' },
  { id: 'components', label: 'Component patterns' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'handoff', label: 'Handoff thinking' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'reflection', label: 'Reflection' },
];

export default function AfsCaseStudyPage() {
  return (
    <>
      <Header />
      <main className="case-study-page">
        <CaseStudyHero
          title={cs.title}
          subtitle={cs.subtitle}
          tags={cs.tags}
          heroImage="/images/projects/afs/screens/afs-screen-01.png"
          heroImageAlt="Account Fit Score configuration screen in ZoomInfo Admin Portal"
          prototypeUrlLabel="ZoomInfo Admin Portal"
          label="Enterprise case study"
        />

        <div className="cs-layout">
          <CaseStudyNav items={afsNavItems} />
          <div className="cs-content">

            {/* 1. PROJECT SNAPSHOT */}
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
            </section>

            {/* 2. CONFIDENTIALITY NOTE */}
            <section className="cs-section" id="confidentiality">
              <h2 className="cs-section__title">Confidentiality note</h2>
              <div className="afs-confidentiality-note">
                <div className="afs-confidentiality-note__icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 9v5M10 6.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="afs-confidentiality-note__content">
                  <div className="afs-confidentiality-note__title">Company project — details handled carefully</div>
                  <p className="afs-confidentiality-note__body">{cs.confidentialityNote}</p>
                </div>
              </div>
            </section>

            {/* 3. WHAT THIS DEMONSTRATES */}
            <section className="cs-section" id="demonstrates">
              <h2 className="cs-section__title">What this case study demonstrates</h2>
              <p className="cs-section__body">A quick scan for recruiters. The skills and thinking shown across this enterprise project.</p>
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

            {/* 4. PRODUCT OVERVIEW */}
            <section className="cs-section" id="overview">
              <h2 className="cs-section__title">Product overview</h2>
              <p className="cs-section__body">{cs.overview}</p>
              <div className="afs-product-context">
                <div className="afs-product-context__row">
                  <span className="afs-product-context__label">Product</span>
                  <span className="afs-product-context__value">Account Fit Score (AFS) — AI-powered account scoring configuration</span>
                </div>
                <div className="afs-product-context__row">
                  <span className="afs-product-context__label">Platform</span>
                  <span className="afs-product-context__value">ZoomInfo Admin Portal, enterprise web application</span>
                </div>
                <div className="afs-product-context__row">
                  <span className="afs-product-context__label">Audience</span>
                  <span className="afs-product-context__value">RevOps and Sales Operations teams in enterprise workspaces</span>
                </div>
                <div className="afs-product-context__row">
                  <span className="afs-product-context__label">Status</span>
                  <span className="afs-product-context__value">Ready for Dev, Q4/2023</span>
                </div>
              </div>
            </section>

            {/* 5. PROBLEM */}
            <section className="cs-section" id="problem">
              <h2 className="cs-section__title">Problem</h2>
              <p className="cs-section__body">{cs.problem.main}</p>
              <p className="cs-section__body">{cs.problem.detail}</p>
              <div className="afs-highlight-callout">
                <div className="afs-highlight-callout__arrow">→</div>
                <p className="afs-highlight-callout__text">{cs.problem.highlight}</p>
              </div>
            </section>

            {/* 6. USERS AND TASKS */}
            <section className="cs-section" id="users">
              <h2 className="cs-section__title">Users and tasks</h2>
              <p className="cs-section__body">Inferred from visible UI structure, navigation context, and the product description visible in the configure screen.</p>
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
                          <span className="afs-user-card__task-dot" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. INFORMATION ARCHITECTURE */}
            <section className="cs-section" id="ia">
              <h2 className="cs-section__title">Information architecture</h2>
              <p className="cs-section__body">{cs.iaDescription}</p>

              <h3 className="cs-section__subtitle">Admin Portal navigation structure</h3>
              <p className="cs-section__body" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                Reconstructed from left navigation visible in the configure screen.
              </p>
              <div className="afs-ia-portal">
                <div className="afs-ia-root">Admin Portal</div>
                <div className="afs-ia-level1">
                  <div className="afs-ia-node">Overview</div>
                  <div className="afs-ia-node afs-ia-node--parent">
                    Go-to-Market
                    <div className="afs-ia-level2">
                      <div className="afs-ia-node afs-ia-node--parent">
                        Set Up
                        <div className="afs-ia-level3">
                          {['Target Accounts','Intent','Account Fit Score (AFS)','Buying Committees','WebSights','FormComplete','Go-to-Market Plays'].map(item => (
                            <div key={item} className={`afs-ia-leaf${item === 'Account Fit Score (AFS)' ? ' afs-ia-leaf--active' : ''}`}>{item}</div>
                          ))}
                        </div>
                      </div>
                      <div className="afs-ia-node afs-ia-node--parent">
                        General
                        <div className="afs-ia-level3">
                          {['Analytics','User Management','Configurations','Privacy','Integrations','Enrich'].map(item => (
                            <div key={item} className="afs-ia-leaf">{item}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-10)' }}>AFS feature structure</h3>
              <p className="cs-section__body" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                Reconstructed from Figma frame names and visible screen states.
              </p>
              <div className="afs-feature-tree">
                {cs.afsIaTree.map((item, i) => (
                  <div
                    key={i}
                    className={`afs-feature-tree__item afs-feature-tree__item--indent-${item.indent}${item.active ? ' afs-feature-tree__item--active' : ''}`}
                  >
                    <span className="afs-feature-tree__dot" />
                    <span>{item.label}</span>
                    {item.active && <span className="afs-feature-tree__badge">Configure screen visible</span>}
                  </div>
                ))}
              </div>
            </section>

            {/* 8. USER FLOW */}
            <section className="cs-section" id="user-flow">
              <h2 className="cs-section__title">User flow</h2>
              <p className="cs-section__body">{cs.userFlowDescription}</p>

              <div className="afs-flow-section">
                <div className="afs-flow-label">Primary path: CRM configuration</div>
                <div className="journey-flow">
                  {cs.userFlowSteps.map((step, i) => (
                    <div key={step} className="journey-flow__step">
                      <span className="journey-flow__label">{step}</span>
                      {i < cs.userFlowSteps.length - 1 && <span className="journey-flow__arrow">→</span>}
                    </div>
                  ))}
                </div>

                <div className="afs-flow-label" style={{ marginTop: 'var(--space-6)' }}>Alternative path: CSV configuration</div>
                <div className="journey-flow">
                  {[...cs.userFlowSteps.slice(0, 5), ...cs.userFlowCsvBranch].map((step, i, arr) => (
                    <div key={`${step}-${i}`} className="journey-flow__step">
                      <span className={`journey-flow__label${i >= 5 ? ' journey-flow__label--alt' : ''}`}>{step}</span>
                      {i < arr.length - 1 && <span className="journey-flow__arrow">→</span>}
                    </div>
                  ))}
                </div>

                <div className="afs-flow-note">
                  The two paths diverge at "Select data source" and converge again at the model training step. CRM path uses condition builder logic; CSV path uses file upload and column mapping.
                </div>
              </div>
            </section>

            {/* 9. WIREFRAME RECONSTRUCTION */}
            <section className="cs-section" id="wireframes">
              <h2 className="cs-section__title">Wireframe reconstruction</h2>
              <p className="cs-section__body">Wireframes reconstructed by abstracting layout and component structure from final UI screens. These represent the screen's purpose and layout logic, not the original wireframing process.</p>
              <p className="cs-section__body" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                Wireframe reconstruction from final UI screens.
              </p>

              <div className="afs-wireframes-grid">

                {/* Wireframe 1: Main Configure Screen */}
                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">Configure AFS (CRM source)</div>
                  <div className="afs-wireframe-card__purpose">Main configuration screen for defining scoring conditions using CRM data</div>
                  <div className="afs-wireframe">
                    <div className="afs-wf-header">
                      <div className="afs-wf-dots"><span/><span/><span/></div>
                      <div className="afs-wf-breadcrumb">AFS / Configure</div>
                      <div className="afs-wf-actions"><span className="afs-wf-btn-ghost">Cancel</span><span className="afs-wf-btn-primary">Save</span></div>
                    </div>
                    <div className="afs-wf-body">
                      <div className="afs-wf-sidebar">
                        <div className="afs-wf-nav-item">Overview</div>
                        <div className="afs-wf-nav-group">Go-to-Market</div>
                        <div className="afs-wf-nav-item afs-wf-nav-item--active">AFS ←</div>
                        <div className="afs-wf-nav-item">Analytics</div>
                        <div className="afs-wf-nav-item">Integrations</div>
                      </div>
                      <div className="afs-wf-content">
                        <div className="afs-wf-heading">Configure Account Fit Score (AFS)</div>
                        <div className="afs-wf-desc">Description text</div>
                        <div className="afs-wf-radio-group">
                          <span className="afs-wf-radio afs-wf-radio--selected">Account Object</span>
                          <span className="afs-wf-radio">Opportunity Object</span>
                        </div>
                        <div className="afs-wf-banner">ℹ Default condition — editable</div>
                        <div className="afs-wf-condition">[Account Type] [Is] [Customer] •••</div>
                        <div className="afs-wf-add-row">+ Add Condition &nbsp;<span className="afs-wf-count">1/10</span></div>
                        <div className="afs-wf-toggle-row">Auto-update AFS model <span className="afs-wf-toggle">●</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wireframe 2: Data Source Selection */}
                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">Change Data Source</div>
                  <div className="afs-wireframe-card__purpose">Flow allowing admins to switch between CRM integration and CSV upload paths</div>
                  <div className="afs-wireframe">
                    <div className="afs-wf-header">
                      <div className="afs-wf-dots"><span/><span/><span/></div>
                      <div className="afs-wf-breadcrumb">AFS / Data Source</div>
                    </div>
                    <div className="afs-wf-body">
                      <div className="afs-wf-content afs-wf-content--full">
                        <div className="afs-wf-heading">Select data source</div>
                        <div className="afs-wf-option-cards">
                          <div className="afs-wf-option">
                            <div className="afs-wf-option__icon">CRM</div>
                            <div className="afs-wf-option__label">CRM Integration</div>
                            <div className="afs-wf-option__sub">Use Salesforce account data</div>
                          </div>
                          <div className="afs-wf-option">
                            <div className="afs-wf-option__icon">CSV</div>
                            <div className="afs-wf-option__label">CSV Upload</div>
                            <div className="afs-wf-option__sub">Upload historical deal data</div>
                          </div>
                        </div>
                        <div className="afs-wf-warning">Changing data source will reset current configuration</div>
                        <div className="afs-wf-actions-center"><span className="afs-wf-btn-ghost">Cancel</span><span className="afs-wf-btn-primary">Confirm</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wireframe 3: Salesforce Not Integrated */}
                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">Salesforce not integrated</div>
                  <div className="afs-wireframe-card__purpose">Error/info state shown when CRM path is chosen but Salesforce connection is missing</div>
                  <div className="afs-wireframe">
                    <div className="afs-wf-header">
                      <div className="afs-wf-dots"><span/><span/><span/></div>
                      <div className="afs-wf-breadcrumb">AFS / Configure</div>
                    </div>
                    <div className="afs-wf-body">
                      <div className="afs-wf-content afs-wf-content--full">
                        <div className="afs-wf-heading">Configure Account Fit Score</div>
                        <div className="afs-wf-empty-state">
                          <div className="afs-wf-empty-icon">⚠</div>
                          <div className="afs-wf-empty-title">Salesforce not connected</div>
                          <div className="afs-wf-empty-body">Connect Salesforce to use CRM data for scoring</div>
                          <div className="afs-wf-btn-primary afs-wf-btn-center">Connect Salesforce</div>
                          <div className="afs-wf-link">Or use CSV upload instead</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wireframe 4: Retrain Model */}
                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">Retrain Model</div>
                  <div className="afs-wireframe-card__purpose">Action screen for manually triggering model retraining after conditions change</div>
                  <div className="afs-wireframe">
                    <div className="afs-wf-header">
                      <div className="afs-wf-dots"><span/><span/><span/></div>
                      <div className="afs-wf-breadcrumb">AFS / Retrain Model</div>
                    </div>
                    <div className="afs-wf-body">
                      <div className="afs-wf-content afs-wf-content--full">
                        <div className="afs-wf-heading">Retrain AFS model</div>
                        <div className="afs-wf-desc">Retrain your model to apply updated conditions to all accounts</div>
                        <div className="afs-wf-info-list">
                          <div className="afs-wf-info-row">Last trained: [date]</div>
                          <div className="afs-wf-info-row">Conditions: [n] active</div>
                          <div className="afs-wf-info-row">Estimated time: [n] minutes</div>
                        </div>
                        <div className="afs-wf-banner afs-wf-banner--warning">You will be notified by email when retraining is complete</div>
                        <div className="afs-wf-actions-row"><span className="afs-wf-btn-ghost">Cancel</span><span className="afs-wf-btn-primary">Start retraining</span></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* 10. KEY UX DECISIONS */}
            <section className="cs-section" id="decisions">
              <h2 className="cs-section__title">Key UX decisions</h2>
              <p className="cs-section__body">Design decisions inferred from the visible UI structure, component choices, and screen organisation. Each decision reflects a deliberate trade-off in how the product handles enterprise complexity.</p>
              <div className="cs-cards-grid cs-cards-grid--decisions">
                {cs.decisions.map(d => (
                  <div key={d.num} className="cs-card">
                    <div className="cs-card__num">{d.num}</div>
                    <div className="cs-card__title">{d.title}</div>
                    <p className="cs-card__body">{d.body}</p>
                    <div className="afs-decision-why">
                      <span className="afs-decision-why__label">Why it matters</span>
                      <p className="afs-decision-why__text">{d.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 11. DESIGN SYSTEM */}
            <section className="cs-section" id="design-system">
              <h2 className="cs-section__title">Design system extraction</h2>
              <p className="cs-section__body">{cs.designSystemDescription}</p>

              <h3 className="cs-section__subtitle">Colour palette (extracted from screenshots)</h3>
              <div className="afs-color-grid">
                {cs.designSystemColors.map(color => (
                  <div key={color.name} className="afs-color-swatch">
                    <div className={`afs-color-swatch__block afs-color-swatch__block--${color.name.toLowerCase().replace(/\s/g,'-')}`} />
                    <div className="afs-color-swatch__name">{color.name}</div>
                    <div className="afs-color-swatch__usage">{color.usage}</div>
                  </div>
                ))}
              </div>

              <h3 className="cs-section__subtitle" style={{ marginTop: 'var(--space-10)' }}>Component library (extracted from visible UI)</h3>
              <div className="cs-cards-grid">
                {cs.designSystemComponents.map(comp => (
                  <div key={comp.name} className="cs-card">
                    <div className="cs-card__title">{comp.name}</div>
                    <p className="cs-card__body">{comp.description}</p>
                    <div className="afs-comp-usage">
                      <span className="afs-comp-usage__label">Usage</span>
                      <span className="afs-comp-usage__text">{comp.usage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 12. UI SCREEN WALKTHROUGH */}
            <section className="cs-section" id="screens">
              <h2 className="cs-section__title">UI screen walkthrough</h2>
              <p className="cs-section__body">Walkthrough of the major screens in the AFS workflow. Screen 01 is from a direct Figma export. Screens 02–06 are reconstructed from Figma frame names with descriptions inferred from the visible design language.</p>

              {cs.screens.map(screen => (
                <div key={screen.num} className="afs-screen-entry">
                  <div className="afs-screen-entry__header">
                    <span className="afs-screen-entry__num">{screen.num}</span>
                    <div>
                      <div className="afs-screen-entry__title">{screen.title}</div>
                      <div className="afs-screen-entry__purpose">{screen.purpose}</div>
                    </div>
                    {!screen.src && (
                      <span className="afs-screen-entry__badge">Screenshot pending</span>
                    )}
                  </div>

                  {screen.src && (
                    <div className="afs-screen-frame">
                      <div className="afs-screen-frame__bar">
                        <span className="afs-screen-frame__dot" />
                        <span className="afs-screen-frame__dot" />
                        <span className="afs-screen-frame__dot" />
                        <span className="afs-screen-frame__url">ZoomInfo Admin Portal</span>
                        <span className="afs-screen-frame__confidential">client identifier visible — company project</span>
                      </div>
                      <div className="afs-screen-frame__body">
                        <img
                          src={screen.src}
                          alt={screen.title}
                          className="afs-screen-frame__img"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="afs-screen-entry__details">
                    <div className="afs-screen-entry__elements">
                      <div className="afs-screen-entry__elements-label">Key elements</div>
                      <ul className="afs-screen-entry__elements-list">
                        {screen.keyElements.map(el => (
                          <li key={el} className="afs-screen-entry__element">
                            <span className="afs-screen-entry__element-dot" />
                            <span>{el}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="afs-screen-entry__ux-note">
                      <div className="afs-screen-entry__ux-note-label">UX note</div>
                      <p className="afs-screen-entry__ux-note-text">{screen.uxNote}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* 13. COMPONENT PATTERNS */}
            <section className="cs-section" id="components">
              <h2 className="cs-section__title">Component patterns</h2>
              <p className="cs-section__body">Recurring patterns identified from the visible UI. These components appear to be part of a shared Admin Portal design system, reused across multiple configuration screens.</p>
              <div className="cs-cards-grid">
                {cs.componentPatterns.map(comp => (
                  <div key={comp.name} className="cs-card">
                    <div className="cs-card__title">{comp.name}</div>
                    <p className="cs-card__body">{comp.description}</p>
                    <div className="afs-comp-usage" style={{ marginTop: 'auto', paddingTop: 'var(--space-3)' }}>
                      <span className="afs-comp-usage__label">Pattern reason</span>
                      <span className="afs-comp-usage__text">{comp.usage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 14. ACCESSIBILITY */}
            <section className="cs-section" id="accessibility">
              <h2 className="cs-section__title">Accessibility and usability considerations</h2>
              <p className="cs-section__body">Based on the visible UI. Items marked "Recommended" are not visible in the available screenshots and represent standard implementation checks for this type of configuration interface.</p>
              <div className="limitations-box">
                <div className="limitations-list">
                  {cs.accessibility.map(item => (
                    <div key={item} className={`limitations-item${item.startsWith('Recommended') ? ' limitations-item--recommended' : ''}`}>
                      <span className={item.startsWith('Recommended') ? 'limitations-item__arrow' : 'limitations-item__dot'}>
                        {item.startsWith('Recommended') ? '→' : ''}
                        {!item.startsWith('Recommended') && <span className="limitations-item__dot-inner" />}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 15. HANDOFF */}
            <section className="cs-section" id="handoff">
              <h2 className="cs-section__title">Handoff and implementation thinking</h2>
              <p className="cs-section__body">The Figma file shows "Ready for Dev" status with Jira, PRD, and video documentation linked. These notes capture the implementation considerations visible from the design and screen structure.</p>
              <div className="cs-cards-grid cs-cards-grid--2">
                {cs.handoff.map(card => (
                  <div key={card.title} className="cs-card">
                    <div className="cs-card__title">{card.title}</div>
                    <p className="cs-card__body">{card.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 16. LIMITATIONS */}
            <section className="cs-section" id="limitations">
              <h2 className="cs-section__title">Limitations</h2>
              <p className="cs-section__body">Honest documentation of what this case study can and cannot show, given the available material and confidentiality constraints.</p>
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

            {/* 17. REFLECTION */}
            <section className="cs-section" id="reflection">
              <h2 className="cs-section__title">Reflection</h2>
              <p className="cs-section__body">{cs.reflection}</p>

              <div className="cs-cta-section">
                <h3 className="cs-cta-section__title">Explore more product and process work</h3>
                <p className="cs-cta-section__body">Two other case studies document the design decisions, prototypes, and full build workflow for portfolio projects.</p>
                <div className="cs-cta-section__actions">
                  <Button href="/projects/riverside-general">Riverside General case study</Button>
                  <Button href="/projects/renewly" variant="ghost">Renewly case study</Button>
                  <Button href="/projects/ai-assisted-product-workflow" variant="ghost">AI workflow process</Button>
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
