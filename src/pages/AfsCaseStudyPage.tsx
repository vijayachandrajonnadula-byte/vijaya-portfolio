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

// ─── Wireframe render helper ───────────────────────────────────────────────
function renderWireframe(key: string) {
  switch (key) {
    case 'crm':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span/><span/><span/></div>
            <div className="afs-wf-breadcrumb">Account Fit Score (AFS) / Configure</div>
            <div className="afs-wf-actions"><span className="afs-wf-btn-ghost">Cancel</span><span className="afs-wf-btn-primary">Save Configuration</span></div>
          </div>
          <div className="afs-wf-body">
            <div className="afs-wf-sidebar">
              <div className="afs-wf-nav-item">Overview</div>
              <div className="afs-wf-nav-group">Go-to-Market</div>
              <div className="afs-wf-nav-item" style={{paddingLeft:'6px',fontSize:'8px',color:'var(--color-text-muted)'}}>Set Up</div>
              <div className="afs-wf-nav-item afs-wf-nav-item--active">AFS ←</div>
              <div className="afs-wf-nav-item" style={{paddingLeft:'6px',fontSize:'8px'}}>Intent</div>
              <div className="afs-wf-nav-item" style={{paddingLeft:'6px',fontSize:'8px'}}>Buying Committees</div>
              <div className="afs-wf-nav-item" style={{fontSize:'8px',color:'var(--color-text-muted)'}}>General</div>
              <div className="afs-wf-nav-item">Analytics</div>
              <div className="afs-wf-nav-item">Integrations</div>
            </div>
            <div className="afs-wf-content">
              <div className="afs-wf-heading">Configure Account Fit Score (AFS)</div>
              <div className="afs-wf-desc">Account Fit Score predicts how well an account matches your ideal customer profile using CRM deal data and firmographics.</div>
              <div style={{fontSize:'8px',fontWeight:700,color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:'2px'}}>CRM Object and Conditions</div>
              <div className="afs-wf-radio-group">
                <span className="afs-wf-radio afs-wf-radio--selected">● Account Object</span>
                <span className="afs-wf-radio">○ Opportunity Object</span>
              </div>
              <div className="afs-wf-banner">ℹ This is a default condition. You can edit or add more conditions as required. <span style={{float:'right',cursor:'pointer'}}>✕</span></div>
              <div className="afs-wf-condition">[Account Type] [Is] [Customer] <span style={{float:'right'}}>•••</span></div>
              <div className="afs-wf-add-row">+ Add Condition &nbsp;<span className="afs-wf-count">1/10 conditions added</span></div>
              <div className="afs-wf-toggle-row">Auto-update AFS model <span className="afs-wf-toggle">●</span> <span style={{fontSize:'8px',color:'var(--color-text-muted)'}}>ⓘ</span></div>
            </div>
          </div>
        </div>
      );

    case 'csv':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span/><span/><span/></div>
            <div className="afs-wf-breadcrumb">Account Fit Score (AFS) / Configure (CSV)</div>
            <div className="afs-wf-actions"><span className="afs-wf-btn-ghost">Cancel</span><span className="afs-wf-btn-primary">Save Configuration</span></div>
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
              <div className="afs-wf-desc">Upload a CSV with historical deal data to train the scoring model.</div>
              <div style={{fontSize:'8px',fontWeight:700,color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:'2px'}}>Upload data file</div>
              <div className="afs-wf-upload-area">
                <div className="afs-wf-upload-icon">☁</div>
                <div className="afs-wf-upload-label">Drag and drop CSV file here<br/>or click to browse files</div>
              </div>
              <div style={{fontSize:'8px',fontWeight:700,color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:'4px'}}>Column mapping</div>
              <div className="afs-wf-col-map">
                <div className="afs-wf-col-row"><span className="afs-wf-col-label">Deal outcome</span><span>→</span><div className="afs-wf-col-input" /></div>
                <div className="afs-wf-col-row"><span className="afs-wf-col-label">Account name</span><span>→</span><div className="afs-wf-col-input" /></div>
                <div className="afs-wf-col-row"><span className="afs-wf-col-label">Company size</span><span>→</span><div className="afs-wf-col-input" /></div>
              </div>
              <div className="afs-wf-toggle-row">Auto-update AFS model <span className="afs-wf-toggle">●</span></div>
            </div>
          </div>
        </div>
      );

    case 'default':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span/><span/><span/></div>
            <div className="afs-wf-breadcrumb">Account Fit Score (AFS)</div>
          </div>
          <div className="afs-wf-body">
            <div className="afs-wf-sidebar">
              <div className="afs-wf-nav-item">Overview</div>
              <div className="afs-wf-nav-group">Go-to-Market</div>
              <div className="afs-wf-nav-item afs-wf-nav-item--active">AFS ←</div>
              <div className="afs-wf-nav-item">Analytics</div>
            </div>
            <div className="afs-wf-content">
              <div className="afs-wf-heading">Account Fit Score (AFS)</div>
              <div><span className="afs-wf-status-badge">Default configuration active</span></div>
              <div className="afs-wf-desc">Using ZoomInfo default ICP conditions. Customise to improve scoring accuracy for your workspace.</div>
              <div style={{fontSize:'8px',fontWeight:700,color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:'2px'}}>Current conditions (read-only)</div>
              <div className="afs-wf-readonly-conditions">
                <div className="afs-wf-readonly-condition">[Account Type] [Is] [Customer]</div>
                <div className="afs-wf-readonly-condition">[Company Size] [Greater than] [100]</div>
                <div className="afs-wf-readonly-condition">[Industry] [Is any of] [Technology]</div>
              </div>
              <div className="afs-wf-edit-cta">Edit Configuration</div>
            </div>
          </div>
        </div>
      );

    case 'datasource':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span/><span/><span/></div>
            <div className="afs-wf-breadcrumb">Account Fit Score (AFS) / Change Data Source</div>
          </div>
          <div className="afs-wf-body">
            <div className="afs-wf-content afs-wf-content--full">
              <div className="afs-wf-heading">Change data source</div>
              <div className="afs-wf-desc">Select where your AFS model gets its training data. Current source: CRM Integration.</div>
              <div className="afs-wf-option-cards">
                <div className="afs-wf-option" style={{border:'1.5px solid #1B7AFF',background:'#EFF6FF'}}>
                  <div className="afs-wf-option__icon">CRM</div>
                  <div className="afs-wf-option__label">CRM Integration</div>
                  <div className="afs-wf-option__sub">Use Salesforce account or opportunity objects and conditions</div>
                  <div style={{fontSize:'7px',color:'#1B7AFF',marginTop:'2px',fontWeight:600}}>Current source</div>
                </div>
                <div className="afs-wf-option">
                  <div className="afs-wf-option__icon">CSV</div>
                  <div className="afs-wf-option__label">CSV Upload</div>
                  <div className="afs-wf-option__sub">Upload historical deal data as a file</div>
                </div>
              </div>
              <div className="afs-wf-warning">⚠ Switching data source will reset your current scoring conditions and require model retraining</div>
              <div className="afs-wf-actions-center">
                <span className="afs-wf-btn-ghost">Cancel</span>
                <span className="afs-wf-btn-primary">Confirm change</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'error':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span/><span/><span/></div>
            <div className="afs-wf-breadcrumb">Account Fit Score (AFS) / Configure</div>
          </div>
          <div className="afs-wf-body">
            <div className="afs-wf-sidebar">
              <div className="afs-wf-nav-item">Overview</div>
              <div className="afs-wf-nav-group">Go-to-Market</div>
              <div className="afs-wf-nav-item afs-wf-nav-item--active">AFS ←</div>
              <div className="afs-wf-nav-item">Integrations</div>
            </div>
            <div className="afs-wf-content">
              <div className="afs-wf-heading">Configure Account Fit Score (AFS)</div>
              <div className="afs-wf-empty-state">
                <div className="afs-wf-empty-icon">⚠</div>
                <div className="afs-wf-empty-title">Salesforce is not connected</div>
                <div className="afs-wf-empty-body">CRM data is unavailable. Connect Salesforce to use condition-based scoring, or switch to CSV upload instead.</div>
                <div className="afs-wf-btn-primary afs-wf-btn-center">Connect Salesforce</div>
                <div className="afs-wf-link">Or use CSV upload instead →</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'retrain':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span/><span/><span/></div>
            <div className="afs-wf-breadcrumb">Account Fit Score (AFS) / Retrain Model</div>
          </div>
          <div className="afs-wf-body">
            <div className="afs-wf-content afs-wf-content--full">
              <div className="afs-wf-heading">Retrain AFS model</div>
              <div className="afs-wf-desc">Apply your updated conditions to all accounts in the workspace. Scores will be recalculated using the new model.</div>
              <div className="afs-wf-info-list">
                <div className="afs-wf-info-row">Last trained: [date]</div>
                <div className="afs-wf-info-row">Active conditions: [n] conditions defined</div>
                <div className="afs-wf-info-row">Data source: CRM Integration (Salesforce)</div>
                <div className="afs-wf-info-row">Estimated time: [n] minutes</div>
              </div>
              <div className="afs-wf-banner afs-wf-banner--warning">You will be notified by email when retraining is complete. Existing scores remain active until the new model is ready.</div>
              <div className="afs-wf-actions-row">
                <span className="afs-wf-btn-ghost">Cancel</span>
                <span className="afs-wf-btn-primary">Start retraining</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'email':
      return (
        <div className="afs-wireframe" style={{display:'flex',flexDirection:'column'}}>
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span/><span/><span/></div>
            <div className="afs-wf-breadcrumb">Email notification — model ready</div>
          </div>
          <div className="afs-wf-email-logo-bar">ZOOMINFO</div>
          <div className="afs-wf-email-body">
            <div className="afs-wf-email-subject">Your Account Fit Score is ready</div>
            <div className="afs-wf-email-greeting">Hi [Name],</div>
            <div className="afs-wf-email-text">
              Your AFS model has finished training. Account scores are now active across your workspace.
              Your team can start using scores to prioritise outreach in Salesforce and ZoomInfo.
            </div>
            <div className="afs-wf-email-cta">Go to Admin Portal →</div>
            <div className="afs-wf-email-text">
              It may take a few minutes for scores to appear on all accounts.
              If you have questions, contact your account manager or visit the Help Centre.
            </div>
          </div>
          <div className="afs-wf-email-footer">
            ZoomInfo Technologies Inc. · Unsubscribe · Privacy Policy · Help Centre
          </div>
        </div>
      );

    case 'condition':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span/><span/><span/></div>
            <div className="afs-wf-breadcrumb">AFS / Configure / Add Condition</div>
          </div>
          <div className="afs-wf-body" style={{background:'rgba(15,23,42,0.05)'}}>
            <div className="afs-wf-modal-overlay">
              <div className="afs-wf-modal">
                <div className="afs-wf-modal-title">Add condition</div>
                <div className="afs-wf-modal-subtitle">Define a field, operator, and value to filter accounts for scoring</div>
                <div className="afs-wf-field-row">
                  <div className="afs-wf-select">Account Type</div>
                  <div className="afs-wf-field-divider">is</div>
                  <div className="afs-wf-select">Customer</div>
                </div>
                <div style={{fontSize:'8px',color:'var(--color-text-muted)',marginTop:'4px'}}>
                  Select from available CRM field values
                </div>
                <div className="afs-wf-modal-footer">
                  <span className="afs-wf-btn-ghost">Cancel</span>
                  <span className="afs-wf-btn-primary">Add condition</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ─── Page component ────────────────────────────────────────────────────────
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
              <p className="cs-section__body">A quick scan for recruiters. The skills and thinking visible across this enterprise project.</p>
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
                  <span className="afs-product-context__label">Quarter</span>
                  <span className="afs-product-context__value">Q4 / 2023 — Ready for Dev status at time of Figma export</span>
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
              <p className="cs-section__body">Inferred from the visible UI structure, navigation context, and the product description visible in the configure screen. Two distinct user types interact with AFS: the team configuring the model, and the IT owner managing the integrations that make the model possible.</p>
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
                Reconstructed from the left navigation visible in the configure screen. Active item highlighted in blue.
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
                Reconstructed from Figma frame names and canvas organisation. Each item represents a distinct screen or modal state in the Figma file.
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
                  The two paths diverge at "Select data source" and converge at the model training step. CRM path uses condition builder logic; CSV path uses file upload and column mapping. Both paths end with async model training and an email notification when the model is ready.
                </div>
              </div>
            </section>

            {/* 9. WIREFRAME RECONSTRUCTION */}
            <section className="cs-section" id="wireframes">
              <h2 className="cs-section__title">Wireframe reconstruction</h2>
              <p className="cs-section__body">Six screens reconstructed from the Figma file's canvas structure, frame names, and the single available screenshot. These represent the screen's layout logic and component purpose — not the original wireframing process, which was not available for this portfolio case study.</p>
              <p className="cs-section__body" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                Screen 01 (Configure CRM) is the only screen reconstructed from a real Figma screenshot. Screens 02–06 are inferred from frame names, metadata, and the Admin Portal design language visible in Screen 01.
              </p>

              <div className="afs-wireframes-grid">

                {/* Wireframe 1: Configure CRM */}
                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">01 — Configure AFS (CRM source)</div>
                  <div className="afs-wireframe-card__purpose">Main configuration screen. Condition builder for CRM-based scoring. Based on Figma screenshot.</div>
                  {renderWireframe('crm')}
                </div>

                {/* Wireframe 2: Configure CSV */}
                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">02 — Configure AFS (CSV source)</div>
                  <div className="afs-wireframe-card__purpose">CSV upload path. Same structural shell as CRM, with file upload and column mapping replacing the condition builder.</div>
                  {renderWireframe('csv')}
                </div>

                {/* Wireframe 3: Default AFS */}
                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">03 — Default AFS view</div>
                  <div className="afs-wireframe-card__purpose">Read-only state before customisation. Shows default conditions with a clear entry point to Edit Configuration.</div>
                  {renderWireframe('default')}
                </div>

                {/* Wireframe 4: Change Data Source */}
                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">04 — Change Data Source</div>
                  <div className="afs-wireframe-card__purpose">Option cards for switching between CRM and CSV. Warning and confirmation step protect against accidental model reset.</div>
                  {renderWireframe('datasource')}
                </div>

                {/* Wireframe 5: Salesforce not integrated */}
                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">05 — Salesforce not integrated</div>
                  <div className="afs-wireframe-card__purpose">Error/guidance state when CRM path is chosen but the integration is missing. Offers two resolution paths.</div>
                  {renderWireframe('error')}
                </div>

                {/* Wireframe 6: Add Condition modal */}
                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">06 — Add / Edit Condition</div>
                  <div className="afs-wireframe-card__purpose">Modal for defining a single condition. Three-field layout (Field, Operator, Value) exposed in a focused overlay.</div>
                  {renderWireframe('condition')}
                </div>

              </div>

              {/* Wireframes row 2: Retrain + Email */}
              <div className="afs-wireframes-grid" style={{ marginTop: 'var(--space-4)' }}>

                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">07 — Retrain Model</div>
                  <div className="afs-wireframe-card__purpose">Manually trigger model retraining after condition changes. Shows last-trained date, condition count, and email-on-complete banner.</div>
                  {renderWireframe('retrain')}
                </div>

                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">08 — AFS ready email</div>
                  <div className="afs-wireframe-card__purpose">Email notification when training completes. Closes the async loop — users receive confirmation without staying on the page.</div>
                  {renderWireframe('email')}
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
              <h2 className="cs-section__title">Design system</h2>
              <p className="cs-section__body">{cs.designSystemDescription}</p>

              <div className="afs-ds-grid">

                {/* Tile 1: Colour palette */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body">
                    <div className="afs-ds-palette" style={{width:'100%'}}>
                      {[
                        { hex: '#1B7AFF', label: '#1B7AFF' },
                        { hex: '#FFFFFF', label: '#FFFFFF' },
                        { hex: '#F7F9FC', label: '#F7F9FC' },
                        { hex: '#E2E8F0', label: '#E2E8F0' },
                        { hex: '#0F172A', label: '#0F172A' },
                        { hex: '#64748B', label: '#64748B' },
                      ].map(c => (
                        <div key={c.hex} style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                          <div className="afs-ds-swatch" style={{background:c.hex}} />
                          <div className="afs-ds-swatch-hex">{c.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Colour palette — 6 tokens</div>
                </div>

                {/* Tile 2: Typography */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body" style={{alignItems:'flex-start',padding:'var(--space-4) var(--space-5)'}}>
                    <div className="afs-ds-type-stack">
                      <div className="afs-ds-type-h">Configure Account Fit Score</div>
                      <div className="afs-ds-type-sub">Account Fit Score (AFS) / Configure</div>
                      <div className="afs-ds-type-body">Account Fit Score predicts how well an account matches your ideal customer profile using CRM deal data.</div>
                      <div className="afs-ds-type-chip">Account Type</div>
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Typography — heading, breadcrumb, body, chip</div>
                </div>

                {/* Tile 3: Sidebar navigation */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body">
                    <div className="afs-ds-nav">
                      <div className="afs-ds-nav-row">Overview</div>
                      <div className="afs-ds-nav-row afs-ds-nav-row--group">Go-to-Market</div>
                      <div className="afs-ds-nav-row afs-ds-nav-row--sub">Set Up</div>
                      <div className="afs-ds-nav-row afs-ds-nav-row--deepsub afs-ds-nav-row--active">Account Fit Score (AFS)</div>
                      <div className="afs-ds-nav-row afs-ds-nav-row--deepsub">Buying Committees</div>
                      <div className="afs-ds-nav-row afs-ds-nav-row--deepsub">WebSights</div>
                      <div className="afs-ds-nav-row afs-ds-nav-row--sub">General</div>
                      <div className="afs-ds-nav-row afs-ds-nav-row--deepsub">Integrations</div>
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Left sidebar — collapsible sections, active state</div>
                </div>

                {/* Tile 4: Condition row */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body" style={{gap:'var(--space-2)'}}>
                    <div className="cd-condition-row">
                      <span className="cd-chip cd-chip--field">Account Type</span>
                      <span className="cd-chip cd-chip--op">Is</span>
                      <span className="cd-chip cd-chip--value">Customer</span>
                      <span className="cd-menu">···</span>
                    </div>
                    <div className="cd-condition-row" style={{opacity:0.5}}>
                      <span className="cd-chip cd-chip--field">Company Size</span>
                      <span className="cd-chip cd-chip--op">greater than</span>
                      <span className="cd-chip cd-chip--value">100</span>
                      <span className="cd-menu">···</span>
                    </div>
                    <div style={{fontSize:'9px',color:'#1B7AFF',marginTop:'2px'}}>+ Add Condition &nbsp;<span style={{background:'#EFF6FF',padding:'1px 6px',borderRadius:'10px',border:'1px solid rgba(27,122,255,0.15)',fontSize:'8px'}}>1/10</span></div>
                  </div>
                  <div className="afs-ds-tile__label">Condition builder — [Field][Operator][Value] rows</div>
                </div>

                {/* Tile 5: Info banner */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body">
                    <div className="cd-banner" style={{width:'100%'}}>
                      <span className="cd-banner__icon">ℹ</span>
                      <span className="cd-banner__text">This is a default condition. You can edit or add more conditions as required.</span>
                      <span className="cd-banner__close">✕</span>
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Info banner — inline guidance, dismissible</div>
                </div>

                {/* Tile 6: Toggle + radio group */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body" style={{gap:'var(--space-4)'}}>
                    <div className="cd-radio-group">
                      <div className="cd-radio cd-radio--selected"><div className="cd-radio__dot" />Account Object</div>
                      <div className="cd-radio"><div className="cd-radio__dot" />Opportunity Object</div>
                    </div>
                    <div className="cd-toggle-row" style={{width:'100%',maxWidth:'220px'}}>
                      <span className="cd-toggle-label">Auto-update AFS model</span>
                      <div className="cd-toggle"><div className="cd-toggle__knob" /></div>
                      <span className="cd-info-icon">ⓘ</span>
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Radio group + toggle — selection and control</div>
                </div>

                {/* Tile 7: Action buttons */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body">
                    <div className="cd-btn-pair">
                      <button className="cd-btn-ghost">Cancel</button>
                      <button className="cd-btn-primary">Save Configuration</button>
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Action buttons — ghost secondary, filled primary</div>
                </div>

                {/* Tile 8: Breadcrumb + page header */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body" style={{alignItems:'flex-start',padding:'var(--space-4) var(--space-5)'}}>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px',width:'100%'}}>
                      <div style={{fontSize:'9px',color:'#94A3B8'}}>Account Fit Score (AFS) <span style={{margin:'0 4px'}}>/</span> Configure</div>
                      <div style={{fontSize:'14px',fontWeight:700,color:'#0F172A'}}>Configure Account Fit Score (AFS)</div>
                      <div style={{fontSize:'9px',color:'#64748B',lineHeight:'1.5'}}>Account Fit Score predicts how well an account matches your ideal customer profile...</div>
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Page header — breadcrumb, title, description</div>
                </div>

                {/* Tile 9: Status / badge system */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body" style={{gap:'var(--space-3)'}}>
                    <div style={{display:'flex',gap:'var(--space-2)',flexWrap:'wrap',justifyContent:'center'}}>
                      <span style={{fontSize:'10px',fontWeight:600,background:'#DBEAFE',color:'#1D4ED8',padding:'3px 10px',borderRadius:'10px',border:'1px solid rgba(29,78,216,0.2)'}}>Ready for Dev</span>
                      <span style={{fontSize:'10px',fontWeight:600,background:'#DCFCE7',color:'#166534',padding:'3px 10px',borderRadius:'10px',border:'1px solid rgba(22,101,52,0.2)'}}>Scores active</span>
                      <span style={{fontSize:'10px',fontWeight:600,background:'#FEF9C3',color:'#854D0E',padding:'3px 10px',borderRadius:'10px',border:'1px solid rgba(133,77,14,0.2)'}}>Training</span>
                      <span style={{fontSize:'10px',fontWeight:600,background:'#FEE2E2',color:'#B91C1C',padding:'3px 10px',borderRadius:'10px',border:'1px solid rgba(185,28,28,0.2)'}}>Not connected</span>
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Status badges — state system across workflow</div>
                </div>

              </div>
            </section>

            {/* 12. UI SCREEN WALKTHROUGH */}
            <section className="cs-section" id="screens">
              <h2 className="cs-section__title">UI screen walkthrough</h2>
              <p className="cs-section__body">The screens below walk through the full AFS workflow from first-time setup to model retraining. Screen 01 is a real Figma export — the main configuration screen. Screens 02–06 are wireframe reconstructions inferred from the Figma canvas structure, frame names, and the Admin Portal design language visible in Screen 01.</p>
              <div className="afs-confidentiality-note" style={{marginBottom:'var(--space-6)'}}>
                <div className="afs-confidentiality-note__icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 9v5M10 6.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="afs-confidentiality-note__content">
                  <div className="afs-confidentiality-note__title">Why only one real screenshot?</div>
                  <p className="afs-confidentiality-note__body">The Figma MCP used to access this file runs on a Starter plan with rate limits. Only two screenshots could be downloaded before the limit was reached — the configure screen (used here) and the project cover (contains team names, omitted from portfolio). All other screens are wireframe reconstructions from Figma metadata: canvas coordinates, frame names, and node IDs from a full XML parse of the file. The reconstructions reflect the actual Figma canvas structure, not guesswork.</p>
                </div>
              </div>

              {cs.screens.map(screen => (
                <div key={screen.num} className="afs-screen-entry">
                  <div className="afs-screen-entry__header">
                    <span className="afs-screen-entry__num">{screen.num}</span>
                    <div>
                      <div className="afs-screen-entry__title">{screen.title}</div>
                      <div className="afs-screen-entry__purpose">{screen.purpose}</div>
                    </div>
                    {!screen.src && (
                      <span className="afs-screen-entry__badge">Wireframe reconstruction</span>
                    )}
                  </div>

                  {/* Real screenshot — screen 01 */}
                  {screen.src && (
                    <>
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

                      {/* Annotated screenshot */}
                      <div style={{ marginTop: 'var(--space-8)' }}>
                        <h3 className="cs-section__subtitle">Annotated: key UI elements identified</h3>
                        <p className="cs-section__body" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                          Numbered callouts identify the key components and patterns visible in the configure screen.
                        </p>
                        <div className="afs-annotated">
                          <img
                            src={screen.src}
                            alt="Configure AFS screen with numbered callout annotations"
                          />
                          {cs.annotationCallouts.map(c => (
                            <div
                              key={c.id}
                              className="afs-annotated__dot"
                              style={{ left: c.left, top: c.top }}
                              title={c.label}
                            >
                              {c.id}
                            </div>
                          ))}
                        </div>
                        <div className="afs-annotation-legend">
                          {cs.annotationCallouts.map(c => (
                            <div key={c.id} className="afs-annotation-legend__item">
                              <div className="afs-annotation-legend__num">{c.id}</div>
                              <div>
                                <span className="afs-annotation-legend__label">{c.label}</span>
                                <span className="afs-annotation-legend__desc">{c.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Inline wireframe — screens 02–06 */}
                  {!screen.src && screen.wireframeKey && (
                    <div className="afs-screen-entry__wireframe-wrap">
                      {renderWireframe(screen.wireframeKey)}
                      <p className="afs-screen-entry__wireframe-note">
                        Wireframe reconstruction — inferred from Figma frame name and Admin Portal design language
                      </p>
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
              <p className="cs-section__body">Recurring patterns identified from the visible UI. These components appear to be part of a shared Admin Portal design system, reused across multiple configuration screens within the Go-to-Market setup flow.</p>
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
              <p className="cs-section__body">Based on the visible UI. Items marked "Recommended" are not visible in the available screenshots and represent standard implementation checks for this type of configuration interface in an enterprise context.</p>
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
              <p className="cs-section__body">The Figma file shows "Ready for Dev" status with Jira, PRD, and video documentation linked from the project cover frame. These notes capture the implementation considerations visible from the design and screen structure.</p>
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
