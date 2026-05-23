import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CaseStudyHero from '../components/case-study/CaseStudyHero';
import CaseStudyNav from '../components/case-study/CaseStudyNav';
import Button from '../components/ui/Button';
import { scheduleCaseStudy as cs } from '../data/scheduleCaseStudy';

const scheduleNavItems = [
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
    case 'availability':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span/><span/><span/></div>
            <div className="afs-wf-breadcrumb">Calendar Settings / Manage Default Availability</div>
            <div className="afs-wf-actions">
              <span className="afs-wf-btn-ghost">Cancel</span>
              <span className="afs-wf-btn-primary">Save</span>
            </div>
          </div>
          <div className="afs-wf-content afs-wf-content--full" style={{padding:'10px 14px',display:'flex',flexDirection:'column',gap:'8px'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'#0F172A'}}>Manage Default Availability</div>
            <div style={{fontSize:'8px',color:'var(--color-text-muted)'}}>Time Zone</div>
            <div style={{fontSize:'8px',background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'4px',padding:'3px 6px',color:'#374151'}}>(GMT -4:00) Eastern Time - New York ▾</div>
            <div style={{fontSize:'8px',fontWeight:600,color:'#374151',marginTop:'4px'}}>Work Hours Availability</div>
            <div className="sch-wf-day-pills">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i) => (
                <span key={d} className={`sch-wf-day-pill${[1,2,3,4,5].includes(i) ? ' sch-wf-day-pill--active' : ''}`}>{d}</span>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'40px 1fr 1fr 20px',gap:'3px',alignItems:'center',fontSize:'7px',color:'var(--color-text-muted)',borderBottom:'1px solid #E5E7EB',paddingBottom:'2px'}}>
              <span>Day</span><span>Start Time</span><span>End Time</span><span></span>
            </div>
            {['Mon','Tue','Wed','Thu','Fri'].map(d => (
              <div key={d} style={{display:'grid',gridTemplateColumns:'40px 1fr 1fr 20px',gap:'3px',alignItems:'center',fontSize:'7px'}}>
                <span style={{fontWeight:600,color:'#374151'}}>{d}</span>
                <span style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'3px',padding:'2px 4px',color:'#374151'}}>9:00 AM ▾</span>
                <span style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'3px',padding:'2px 4px',color:'#374151'}}>5:00 PM ▾</span>
                <span style={{color:'#1B7AFF',fontSize:'9px',textAlign:'center'}}>+</span>
              </div>
            ))}
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'4px',padding:'4px 6px',background:'#F9FAFB',borderRadius:'4px',fontSize:'7px'}}>
              <span style={{fontWeight:600,color:'#374151'}}>Buffer time</span>
              <span style={{marginLeft:'auto',background:'#1B7AFF',borderRadius:'10px',padding:'1px 6px',color:'white',fontSize:'6px'}}>ON</span>
              <span style={{color:'#374151'}}>24 Hours</span>
            </div>
          </div>
        </div>
      );

    case 'splitShift':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span/><span/><span/></div>
            <div className="afs-wf-breadcrumb">Manage Default Availability — split shifts</div>
            <div className="afs-wf-actions">
              <span className="afs-wf-btn-ghost">Cancel</span>
              <span className="afs-wf-btn-primary">Save</span>
            </div>
          </div>
          <div className="afs-wf-content afs-wf-content--full" style={{padding:'10px 14px',display:'flex',flexDirection:'column',gap:'4px'}}>
            <div className="sch-wf-day-pills" style={{marginBottom:'4px'}}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i) => (
                <span key={d} className={`sch-wf-day-pill${[1,2,3,4,5].includes(i) ? ' sch-wf-day-pill--active' : ''}`}>{d}</span>
              ))}
            </div>
            {['Mon','Tue','Wed'].map(d => (
              <div key={d}>
                <div style={{display:'grid',gridTemplateColumns:'40px 1fr 1fr 20px 20px',gap:'3px',alignItems:'center',fontSize:'7px'}}>
                  <span style={{fontWeight:600,color:'#374151'}}>{d}</span>
                  <span style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'3px',padding:'2px 4px'}}>9:00 AM ▾</span>
                  <span style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'3px',padding:'2px 4px'}}>12:00 PM ▾</span>
                  <span style={{color:'#1B7AFF',textAlign:'center'}}>+</span>
                  <span style={{color:'#94A3B8',textAlign:'center'}}>🗑</span>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'40px 1fr 1fr 20px 20px',gap:'3px',alignItems:'center',fontSize:'7px',marginTop:'2px'}}>
                  <span></span>
                  <span style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'3px',padding:'2px 4px'}}>2:00 PM ▾</span>
                  <span style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'3px',padding:'2px 4px'}}>5:00 PM ▾</span>
                  <span style={{color:'#1B7AFF',textAlign:'center'}}>+</span>
                  <span style={{color:'#94A3B8',textAlign:'center'}}>🗑</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'createMeeting':
      return (
        <div className="afs-wireframe">
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span/><span/><span/></div>
            <div className="afs-wf-breadcrumb">Calendar Settings / Create Meeting Type</div>
            <div className="afs-wf-actions">
              <span className="afs-wf-btn-ghost">Cancel</span>
              <span className="afs-wf-btn-primary">Save</span>
            </div>
          </div>
          <div className="afs-wf-content afs-wf-content--full" style={{padding:'10px 14px',display:'flex',flexDirection:'column',gap:'8px'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'#0F172A'}}>Create Meeting Type</div>
            <div style={{border:'1px solid #E5E7EB',borderRadius:'6px',padding:'8px',background:'white'}}>
              <div style={{fontSize:'8px',fontWeight:600,marginBottom:'4px',color:'#374151'}}>Basic Settings</div>
              <div style={{fontSize:'7px',color:'var(--color-text-muted)',marginBottom:'2px'}}>*Meeting Title</div>
              <div style={{border:'1px solid #1B7AFF',borderRadius:'4px',padding:'3px 6px',fontSize:'7px',color:'#94A3B8',marginBottom:'4px'}}>Enter Title</div>
              <div style={{fontSize:'7px',color:'var(--color-text-muted)',marginBottom:'2px'}}>Meeting Description</div>
              <div style={{border:'1px solid #E5E7EB',borderRadius:'4px',padding:'3px 6px',fontSize:'7px',height:'20px',color:'#94A3B8',marginBottom:'4px'}}>Enter Description</div>
              <div style={{fontSize:'7px',color:'var(--color-text-muted)',marginBottom:'2px'}}>*Select Video Conferencing</div>
              <div style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'4px',padding:'3px 6px',fontSize:'7px',color:'#94A3B8'}}>Select ▾</div>
            </div>
            <div style={{border:'1px solid #E5E7EB',borderRadius:'6px',padding:'8px',background:'white'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2px'}}>
                <div style={{fontSize:'8px',fontWeight:600,color:'#374151'}}>Email Reminders</div>
                <div style={{background:'#1B7AFF',borderRadius:'10px',padding:'1px 8px',color:'white',fontSize:'6px'}}>ON</div>
              </div>
              <div style={{fontSize:'7px',color:'#1B7AFF',marginBottom:'4px'}}>Adding a reminder can reduce no-shows up to 60%</div>
              <div style={{display:'flex',alignItems:'center',gap:'3px',fontSize:'7px',color:'#374151',padding:'3px 4px',background:'#F9FAFB',borderRadius:'4px'}}>
                <span>Send email</span>
                <span style={{background:'white',border:'1px solid #E5E7EB',padding:'1px 4px',borderRadius:'3px'}}>30</span>
                <span style={{background:'white',border:'1px solid #E5E7EB',padding:'1px 4px',borderRadius:'3px'}}>Minutes ▾</span>
                <span>before</span>
                <span style={{marginLeft:'auto',color:'#1B7AFF'}}>Edit email</span>
              </div>
              <div style={{fontSize:'7px',color:'#1B7AFF',marginTop:'3px'}}>+ Add new reminder</div>
            </div>
            <div style={{border:'1px solid #E5E7EB',borderRadius:'6px',padding:'8px',background:'white'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontSize:'8px',fontWeight:600,color:'#374151'}}>Availability</div>
                <div style={{fontSize:'7px',color:'#1B7AFF'}}>Edit default availability</div>
              </div>
              <div style={{fontSize:'7px',color:'var(--color-text-muted)',marginTop:'2px'}}>You can customize the availability specific to this meeting type</div>
            </div>
          </div>
        </div>
      );

    case 'emailEditor':
      return (
        <div className="afs-wireframe" style={{minHeight:'240px'}}>
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span/><span/><span/></div>
            <div className="afs-wf-breadcrumb">Customize Reminder Email</div>
            <div className="afs-wf-actions"><span style={{fontSize:'10px',color:'var(--color-text-muted)'}}>✕</span></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'200px'}}>
            <div style={{padding:'8px 10px',borderRight:'1px solid #E5E7EB',display:'flex',flexDirection:'column',gap:'5px'}}>
              <div style={{fontSize:'7px',color:'var(--color-text-muted)'}}>Subject</div>
              <div style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'4px',padding:'3px 6px',fontSize:'7px',display:'flex',gap:'3px',flexWrap:'wrap'}}>
                <span style={{background:'#DBEAFE',color:'#1D4ED8',padding:'0 3px',borderRadius:'3px',fontSize:'6px'}}>Meeting_Title</span>
              </div>
              <div style={{background:'white',border:'1px solid #E5E7EB',borderRadius:'4px',padding:'4px',flex:1,fontSize:'7px',color:'#94A3B8',minHeight:'80px'}}>
                You have an upcoming meeting in [time]...
              </div>
              <div style={{display:'flex',gap:'3px',fontSize:'8px',color:'var(--color-text-muted)'}}>
                <span style={{background:'#F9FAFB',padding:'1px 4px',borderRadius:'2px'}}>B</span>
                <span style={{background:'#F9FAFB',padding:'1px 4px',borderRadius:'2px',fontStyle:'italic'}}>I</span>
                <span style={{background:'#F9FAFB',padding:'1px 4px',borderRadius:'2px'}}>🔗</span>
              </div>
              <div style={{fontSize:'6px',color:'#1B7AFF'}}>Reset to suggested default</div>
            </div>
            <div style={{padding:'8px 10px',background:'#F9FAFB',display:'flex',flexDirection:'column',gap:'4px'}}>
              <div style={{fontSize:'7px',fontWeight:600,color:'#374151'}}>Preview</div>
              <div style={{background:'white',border:'1px solid #E5E7EB',borderRadius:'4px',padding:'6px',fontSize:'6px',color:'#374151'}}>
                <div style={{fontWeight:700,marginBottom:'2px'}}>ZI Schedule Demo</div>
                <div style={{color:'var(--color-text-muted)'}}>Mon, Jan 1 · 10:00 - 10:30 AM</div>
                <div style={{color:'#1B7AFF',marginTop:'2px'}}>Join Google Meet</div>
                <div style={{marginTop:'4px',color:'var(--color-text-muted)'}}>You have an upcoming meeting in 1 hour.</div>
                <div style={{marginTop:'4px',fontWeight:600}}>Participants</div>
              </div>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',gap:'6px',padding:'6px 10px',borderTop:'1px solid #E5E7EB'}}>
            <span className="afs-wf-btn-ghost" style={{fontSize:'7px',padding:'3px 8px'}}>Cancel</span>
            <span className="afs-wf-btn-primary" style={{fontSize:'7px',padding:'3px 8px'}}>Save</span>
          </div>
        </div>
      );

    case 'discard':
      return (
        <div className="afs-wireframe" style={{background:'rgba(15,23,42,0.06)'}}>
          <div className="afs-wf-header">
            <div className="afs-wf-dots"><span/><span/><span/></div>
            <div className="afs-wf-breadcrumb">Create Meeting Type</div>
          </div>
          <div style={{padding:'20px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{background:'white',border:'1px solid #E5E7EB',borderRadius:'8px',padding:'16px',maxWidth:'220px',width:'100%',boxShadow:'0 4px 20px rgba(0,0,0,0.12)'}}>
              <div style={{fontSize:'9px',fontWeight:700,color:'#0F172A',marginBottom:'4px'}}>ℹ Discard Meeting Type?</div>
              <div style={{fontSize:'7px',color:'#374151',marginBottom:'10px',lineHeight:'1.5'}}>The changes you have made in the meeting type won't be saved. Are you still sure you want to discard?</div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:'6px'}}>
                <span className="afs-wf-btn-ghost" style={{fontSize:'7px',padding:'3px 8px'}}>Cancel</span>
                <span style={{background:'#1B7AFF',color:'white',fontSize:'7px',padding:'3px 8px',borderRadius:'4px',cursor:'pointer'}}>Discard</span>
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
export default function ScheduleCaseStudyPage() {
  return (
    <>
      <Header />
      <main className="case-study-page">
        <CaseStudyHero
          title={cs.title}
          subtitle={cs.subtitle}
          tags={cs.tags}
          heroImage="/images/projects/schedule/screens/schedule-07-create-filled.png"
          heroImageAlt="ZoomInfo Schedule — Create Meeting Type fully filled out"
          heroImage2="/images/projects/schedule/screens/schedule-03-availability-split.png"
          heroImageAlt2="ZoomInfo Schedule — Manage Default Availability with split shifts"
          prototypeUrlLabel="ZoomInfo Marketing"
          label="Enterprise case study"
        />

        <div className="cs-layout">
          <CaseStudyNav items={scheduleNavItems} />
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
              <p className="cs-section__body">Skills and thinking visible across this enterprise scheduling project.</p>
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
                  <span className="afs-product-context__value">ZoomInfo Schedule — native scheduling embedded in ZoomInfo Marketing</span>
                </div>
                <div className="afs-product-context__row">
                  <span className="afs-product-context__label">Comparable to</span>
                  <span className="afs-product-context__value">Calendly, Chili Piper — purpose-built within the ZoomInfo platform</span>
                </div>
                <div className="afs-product-context__row">
                  <span className="afs-product-context__label">Audience</span>
                  <span className="afs-product-context__value">Sales reps, account executives, RevOps teams in enterprise workspaces</span>
                </div>
                <div className="afs-product-context__row">
                  <span className="afs-product-context__label">Location</span>
                  <span className="afs-product-context__value">Settings / Calendar Settings within ZoomInfo Marketing</span>
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
              <p className="cs-section__body">Two user types interact with ZoomInfo Schedule: the sales rep configuring their own scheduling page, and the operations team managing scheduling at a team or workflow level.</p>
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

              <h3 className="cs-section__subtitle">ZoomInfo Marketing — navigation and settings structure</h3>
              <p className="cs-section__body" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                Reconstructed from the visible top navigation and Settings tab structure. Calendar Settings is the entry point for the scheduling feature.
              </p>

              <div className="afs-feature-tree">
                {cs.iaTree.map((item, i) => (
                  <div
                    key={i}
                    className={`afs-feature-tree__item afs-feature-tree__item--indent-${Math.min(item.level, 5)}${(item as any).active ? ' afs-feature-tree__item--active' : ''}`}
                  >
                    <span className="afs-feature-tree__dot" />
                    <span>{item.label}</span>
                    {(item as any).active && item.level >= 3 && (
                      <span className="afs-feature-tree__badge">Feature entry point</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 8. USER FLOW */}
            <section className="cs-section" id="user-flow">
              <h2 className="cs-section__title">User flow</h2>
              <p className="cs-section__body">{cs.userFlowDescription}</p>

              <div className="afs-flow-section">
                <div className="afs-flow-label">Path A: Manage availability</div>
                <div className="journey-flow">
                  {cs.userFlowAvailability.map((step, i) => (
                    <div key={`a-${i}`} className="journey-flow__step">
                      <span className="journey-flow__label">{step}</span>
                      {i < cs.userFlowAvailability.length - 1 && <span className="journey-flow__arrow">→</span>}
                    </div>
                  ))}
                </div>

                <div className="afs-flow-label" style={{ marginTop: 'var(--space-6)' }}>Path B: Create meeting type</div>
                <div className="journey-flow">
                  {cs.userFlowCreateMeeting.map((step, i) => (
                    <div key={`b-${i}`} className="journey-flow__step">
                      <span className={`journey-flow__label${i >= 5 ? ' journey-flow__label--alt' : ''}`}>{step}</span>
                      {i < cs.userFlowCreateMeeting.length - 1 && <span className="journey-flow__arrow">→</span>}
                    </div>
                  ))}
                </div>

                <div className="afs-flow-note">
                  Path A and Path B both start from Calendar Settings. Path A can be completed independently before Path B, or users can skip directly to Path B if default availability works for them. The two paths converge at the Meeting Type Card, which exposes the booking URL needed to complete the user goal.
                </div>
              </div>
            </section>

            {/* 9. WIREFRAME RECONSTRUCTION */}
            <section className="cs-section" id="wireframes">
              <h2 className="cs-section__title">Wireframe reconstruction</h2>
              <p className="cs-section__body">Structural wireframes breaking down the layout logic and component hierarchy of the key scheduling screens. These CSS reconstructions show how the interface is composed at a structural level, based on the real Figma screens in the UI walkthrough section.</p>

              <div className="afs-wireframes-grid">
                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">01 — Manage Availability (single slot)</div>
                  <div className="afs-wireframe-card__purpose">Day toggle pills + time slot table + buffer settings. Default Mon-Fri 9–5 state.</div>
                  {renderWireframe('availability')}
                </div>

                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">02 — Manage Availability (split shifts)</div>
                  <div className="afs-wireframe-card__purpose">Multiple time slots stacked per day. Add/remove controls on each individual slot row.</div>
                  {renderWireframe('splitShift')}
                </div>

                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">03 — Create Meeting Type</div>
                  <div className="afs-wireframe-card__purpose">Basic Settings, Email Reminders, and Availability sections. Save disabled until required fields are filled.</div>
                  {renderWireframe('createMeeting')}
                </div>

                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">04 — Customize Reminder Email</div>
                  <div className="afs-wireframe-card__purpose">Split editor/preview modal. Editor left, live rendered email preview right. Reset-to-default safety net.</div>
                  {renderWireframe('emailEditor')}
                </div>

                <div className="afs-wireframe-card">
                  <div className="afs-wireframe-card__label">05 — Discard Meeting Type</div>
                  <div className="afs-wireframe-card__purpose">Confirmation modal on Cancel. Explicit Cancel/Discard buttons with unambiguous labels.</div>
                  {renderWireframe('discard')}
                </div>
              </div>
            </section>

            {/* 10. KEY UX DECISIONS */}
            <section className="cs-section" id="decisions">
              <h2 className="cs-section__title">Key UX decisions</h2>
              <p className="cs-section__body">Design decisions visible from the UI structure and component choices. Each reflects a deliberate trade-off between simplicity, flexibility, and guidance.</p>
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
                      {cs.designSystemColors.map(c => (
                        <div key={c.hex} style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                          <div className="afs-ds-swatch" style={{background:c.hex,border:c.hex==='#F9FAFB'?'1px solid #E5E7EB':undefined}} />
                          <div className="afs-ds-swatch-hex">{c.hex}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Colour palette — 8 tokens</div>
                </div>

                {/* Tile 2: Typography */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body" style={{alignItems:'flex-start',padding:'var(--space-4) var(--space-5)'}}>
                    <div className="afs-ds-type-stack">
                      <div className="afs-ds-type-h">Manage Default Availability</div>
                      <div className="afs-ds-type-sub">Calendar Settings / Manage Default Availability</div>
                      <div className="afs-ds-type-body">These available hours will be displayed to potential clients for scheduling appointments with you.</div>
                      <div className="afs-ds-type-chip">Work Hours Availability</div>
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Typography — heading, breadcrumb, body, label</div>
                </div>

                {/* Tile 3: Top navigation */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body" style={{alignItems:'flex-start',padding:'var(--space-3) var(--space-4)'}}>
                    <div style={{width:'100%'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'4px',marginBottom:'6px'}}>
                        <div style={{width:'16px',height:'16px',background:'#1B7AFF',borderRadius:'3px',flexShrink:0}} />
                        <span style={{fontSize:'9px',fontWeight:700,color:'#0F172A'}}>Marketing</span>
                      </div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:'4px 10px'}}>
                        {['Dashboard','Audiences','Advertising','Buying Signals','Conversion','Workflows','Lists'].map(item => (
                          <span key={item} style={{fontSize:'7px',color:'#374151',whiteSpace:'nowrap'}}>{item}</span>
                        ))}
                      </div>
                      <div style={{marginTop:'6px',borderTop:'1px solid #E5E7EB',paddingTop:'4px',display:'flex',gap:'8px'}}>
                        {['My Account','Integrations','Customisation','Calendar Settings'].map((tab,i) => (
                          <span key={tab} style={{fontSize:'6px',color:i===3?'#1B7AFF':'#6B7280',fontWeight:i===3?700:400,borderBottom:i===3?'1.5px solid #1B7AFF':'none',paddingBottom:'2px',whiteSpace:'nowrap'}}>{tab}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Marketing nav + Settings tabs — two-level header</div>
                </div>

                {/* Tile 4: Day toggle pills */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body" style={{gap:'var(--space-3)'}}>
                    <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'center'}}>
                      {[{d:'Sun',a:false},{d:'Mon',a:true},{d:'Tue',a:true},{d:'Wed',a:true},{d:'Thu',a:true},{d:'Fri',a:true},{d:'Sat',a:false}].map(({d,a}) => (
                        <div key={d} style={{width:'28px',height:'28px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'8px',fontWeight:600,background:a?'#1B7AFF':'white',color:a?'white':'#9CA3AF',border:a?'none':'1px solid #D1D5DB'}}>{d}</div>
                      ))}
                    </div>
                    <div style={{fontSize:'8px',color:'#6B7280',textAlign:'center'}}>Active: Mon–Fri · Inactive: Sun, Sat</div>
                  </div>
                  <div className="afs-ds-tile__label">Day toggle pills — availability active days</div>
                </div>

                {/* Tile 5: Time slot row */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body" style={{gap:'var(--space-2)',padding:'var(--space-3) var(--space-4)'}}>
                    <div style={{display:'grid',gridTemplateColumns:'32px 1fr 1fr 16px 16px',gap:'4px',alignItems:'center',width:'100%'}}>
                      <span style={{fontSize:'8px',fontWeight:600,color:'#374151'}}>Mon</span>
                      <div style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'4px',padding:'3px 6px',fontSize:'8px',color:'#374151'}}>9:00 AM ▾</div>
                      <div style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'4px',padding:'3px 6px',fontSize:'8px',color:'#374151'}}>12:00 PM ▾</div>
                      <span style={{fontSize:'12px',color:'#1B7AFF',textAlign:'center',cursor:'pointer'}}>+</span>
                      <span style={{fontSize:'10px',color:'#9CA3AF',textAlign:'center'}}>🗑</span>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'32px 1fr 1fr 16px 16px',gap:'4px',alignItems:'center',width:'100%'}}>
                      <span></span>
                      <div style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'4px',padding:'3px 6px',fontSize:'8px',color:'#374151'}}>2:00 PM ▾</div>
                      <div style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'4px',padding:'3px 6px',fontSize:'8px',color:'#374151'}}>5:00 PM ▾</div>
                      <span style={{fontSize:'12px',color:'#1B7AFF',textAlign:'center',cursor:'pointer'}}>+</span>
                      <span style={{fontSize:'10px',color:'#9CA3AF',textAlign:'center'}}>🗑</span>
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Time slot row — split shift with add/remove controls</div>
                </div>

                {/* Tile 6: Reminder row */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body" style={{gap:'var(--space-2)',padding:'var(--space-3) var(--space-4)'}}>
                    <div style={{fontSize:'9px',color:'#1B7AFF',marginBottom:'2px'}}>Adding a reminder can reduce no-shows up to 60%</div>
                    {[{n:'30',u:'Minutes'},{n:'01',u:'Hour'}].map((r,i) => (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:'4px',background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'4px',padding:'3px 6px',width:'100%',fontSize:'8px'}}>
                        <span style={{color:'#374151'}}>Send email</span>
                        <span style={{background:'white',border:'1px solid #E5E7EB',padding:'1px 4px',borderRadius:'3px',color:'#374151'}}>{r.n}</span>
                        <span style={{background:'white',border:'1px solid #E5E7EB',padding:'1px 4px',borderRadius:'3px',color:'#374151'}}>{r.u} ▾</span>
                        <span style={{color:'#374151'}}>before</span>
                        <span style={{marginLeft:'auto',color:'#1B7AFF',fontSize:'7px'}}>Edit email</span>
                        <span style={{fontSize:'9px',color:'#9CA3AF'}}>🗑</span>
                      </div>
                    ))}
                    <div style={{fontSize:'8px',color:'#9CA3AF',opacity:0.6}}>+ Add new reminder</div>
                    <div style={{fontSize:'7px',background:'#1F2937',color:'white',padding:'2px 6px',borderRadius:'3px'}}>Only 3 reminders are possible</div>
                  </div>
                  <div className="afs-ds-tile__label">Reminder rows — nudge, constraint tooltip at limit</div>
                </div>

                {/* Tile 7: Toggle + checkbox + buttons */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body" style={{gap:'var(--space-3)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',width:'100%',maxWidth:'200px'}}>
                      <span style={{fontSize:'9px',color:'#374151',flex:1}}>Email Reminders</span>
                      <div style={{width:'28px',height:'16px',background:'#1B7AFF',borderRadius:'8px',position:'relative'}}>
                        <div style={{position:'absolute',right:'2px',top:'2px',width:'12px',height:'12px',background:'white',borderRadius:'50%'}} />
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'6px',width:'100%',maxWidth:'200px'}}>
                      <div style={{width:'12px',height:'12px',background:'#1B7AFF',borderRadius:'2px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <span style={{color:'white',fontSize:'8px'}}>✓</span>
                      </div>
                      <span style={{fontSize:'8px',color:'#374151'}}>Include cancel and reschedule links</span>
                    </div>
                    <div className="cd-btn-pair">
                      <button className="cd-btn-ghost">Cancel</button>
                      <button className="cd-btn-primary">Save</button>
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Toggle, checkbox + action button pair</div>
                </div>

                {/* Tile 8: Meeting type card */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body" style={{padding:'var(--space-3) var(--space-4)'}}>
                    <div style={{border:'1px solid #E5E7EB',borderRadius:'8px',padding:'10px',background:'white',width:'100%',maxWidth:'240px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'3px'}}>
                        <span style={{fontSize:'9px',fontWeight:700,color:'#0F172A'}}>Product Related Queries</span>
                        <span style={{fontSize:'12px',color:'#9CA3AF',cursor:'pointer'}}>···</span>
                      </div>
                      <div style={{fontSize:'7px',color:'#6B7280',marginBottom:'6px',lineHeight:'1.4'}}>This is a value prop for Salesforce...</div>
                      <div style={{display:'flex',gap:'6px',marginBottom:'8px',flexWrap:'wrap'}}>
                        {['Zoom','3 Reminders','30 Mins'].map(chip => (
                          <span key={chip} style={{fontSize:'6px',color:'#6B7280',display:'flex',alignItems:'center',gap:'2px'}}>
                            <span style={{width:'6px',height:'6px',background:'#E5E7EB',borderRadius:'50%',display:'inline-block'}} />
                            {chip}
                          </span>
                        ))}
                      </div>
                      <div style={{display:'flex',gap:'6px',borderTop:'1px solid #E5E7EB',paddingTop:'6px'}}>
                        <span style={{fontSize:'7px',color:'#1B7AFF'}}>Share slots</span>
                        <span style={{fontSize:'7px',background:'#F3F4F6',color:'#374151',padding:'1px 6px',borderRadius:'10px',border:'1px solid #E5E7EB'}}>Copy booking URL ▾</span>
                      </div>
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Meeting type card — summary, chips, sharing actions</div>
                </div>

                {/* Tile 9: Toast + modal patterns */}
                <div className="afs-ds-tile">
                  <div className="afs-ds-tile__body" style={{gap:'var(--space-3)'}}>
                    <div style={{background:'#1F2937',borderRadius:'6px',padding:'6px 10px',display:'flex',alignItems:'center',gap:'6px',width:'100%',maxWidth:'220px'}}>
                      <span style={{color:'#16A34A',fontSize:'12px'}}>✓</span>
                      <span style={{fontSize:'8px',color:'white',flex:1}}>Default Availability has been changed successfully</span>
                      <span style={{color:'#9CA3AF',fontSize:'10px'}}>✕</span>
                    </div>
                    <div style={{background:'white',border:'1px solid #E5E7EB',borderRadius:'6px',padding:'8px 10px',width:'100%',maxWidth:'220px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
                      <div style={{fontSize:'8px',fontWeight:700,color:'#0F172A',marginBottom:'3px'}}>ℹ Discard Meeting Type?</div>
                      <div style={{fontSize:'7px',color:'#374151',marginBottom:'6px'}}>Changes won't be saved. Are you sure?</div>
                      <div style={{display:'flex',justifyContent:'flex-end',gap:'4px'}}>
                        <span style={{fontSize:'7px',border:'1px solid #E5E7EB',padding:'2px 6px',borderRadius:'3px',color:'#374151'}}>Cancel</span>
                        <span style={{fontSize:'7px',background:'#1B7AFF',color:'white',padding:'2px 6px',borderRadius:'3px'}}>Discard</span>
                      </div>
                    </div>
                  </div>
                  <div className="afs-ds-tile__label">Dark toast + confirmation modal pattern</div>
                </div>

              </div>
            </section>

            {/* 12. UI SCREEN WALKTHROUGH */}
            <section className="cs-section" id="screens">
              <h2 className="cs-section__title">UI screen walkthrough</h2>
              <p className="cs-section__body">All 12 screens below are real Figma exports from the ZoomInfo Schedule project. They cover the complete workflow in two phases: managing default availability (screens 01-04) and creating a meeting type end-to-end including email customisation, discard confirmation, and the final meeting type card (screens 05-12).</p>
              <div className="afs-confidentiality-note" style={{marginBottom:'var(--space-6)'}}>
                <div className="afs-confidentiality-note__icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 9v5M10 6.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="afs-confidentiality-note__content">
                  <div className="afs-confidentiality-note__title">Prototype data visible in these screens</div>
                  <p className="afs-confidentiality-note__body">"Product Related Queries", "Chennai", "ZI Schedule Demo", and "JD" are test values entered during prototype design — not real customer or business data. The meeting description text in Screen 12 is placeholder copy.</p>
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
                  </div>

                  <div className="afs-screen-frame">
                    <div className="afs-screen-frame__bar">
                      <span className="afs-screen-frame__dot" />
                      <span className="afs-screen-frame__dot" />
                      <span className="afs-screen-frame__dot" />
                      <span className="afs-screen-frame__url">ZoomInfo Marketing</span>
                      <span className="afs-screen-frame__confidential">prototype data — company project</span>
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
              <p className="cs-section__body">Recurring patterns identified from the visible UI. These components form the building blocks of the scheduling configuration experience.</p>
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
              <p className="cs-section__body">Based on the visible UI patterns. Items marked "Recommended" represent standard implementation checks for this type of configuration interface.</p>
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
              <p className="cs-section__body">Implementation considerations visible from the design and screen structure. These notes surface the questions that would need answers before development begins.</p>
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
                      <span className="limitations-item__dot"><span className="limitations-item__dot-inner" /></span>
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
                <p className="cs-cta-section__body">Other case studies document enterprise configuration design, design-to-prototype workflows, and illustrated brand work.</p>
                <div className="cs-cta-section__actions">
                  <Button href="/projects/afs-enterprise-workflow">AFS enterprise case study</Button>
                  <Button href="/projects/riverside-general" variant="ghost">Riverside General</Button>
                  <Button href="/projects/renewly" variant="ghost">Renewly SaaS</Button>
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
