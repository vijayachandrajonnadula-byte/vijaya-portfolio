import { useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import CaseStudyHero from '../../components/case-study/CaseStudyHero';
import CaseStudyNav from '../../components/case-study/CaseStudyNav';
import Button from '../../components/ui/Button';

const fieldflowNavItems = [
  { id: 'snapshot', label: 'Project snapshot' },
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'why-matters', label: 'Why this matters' },
  { id: 'research', label: 'Research approach' },
  { id: 'competitive', label: 'Competitive analysis' },
  { id: 'personas', label: 'Personas' },
  { id: 'jtbd', label: 'Jobs to be done' },
  { id: 'journey', label: 'User journey' },
  { id: 'hmw', label: 'How might we' },
  { id: 'principles', label: 'Product principles' },
  { id: 'ia', label: 'Information architecture' },
  { id: 'flows', label: 'User flows' },
  { id: 'concepts', label: 'Early concepts' },
  { id: 'design-system', label: 'Design system' },
  { id: 'decisions', label: 'Key UX decisions' },
  { id: 'mobile-thinking', label: 'Mobile design thinking' },
  { id: 'screens', label: 'UI screen walkthrough' },
  { id: 'offline', label: 'Offline-first experience' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'testing', label: 'Usability test plan' },
  { id: 'impact', label: 'Expected impact' },
  { id: 'success-metrics', label: 'Success metrics' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'roadmap', label: 'Future roadmap' },
  { id: 'reflection', label: 'Reflection' },
];

// ── Minimal table helpers ────────────────────────────────────────────────────
const TH = { padding: '8px 12px', textAlign: 'left' as const, fontWeight: 600, fontSize: 12, background: 'var(--color-bg-subtle)', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-primary)' };
const TD = { padding: '8px 12px', borderBottom: '1px solid var(--color-border)', fontSize: 13, verticalAlign: 'top' as const, lineHeight: 1.5, color: 'var(--color-text-secondary)' };
const TABLE: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };

// ── Phone screen wireframes ──────────────────────────────────────────────────

const phoneBase: React.CSSProperties = { position: 'absolute', inset: 0, background: '#F7F8FC', fontFamily: 'system-ui,-apple-system,sans-serif', overflow: 'hidden' };
const sbar: React.CSSProperties = { background: '#2457D6', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 10px', fontSize: 8, fontWeight: 600 };
const abar = (extra?: React.CSSProperties): React.CSSProperties => ({ background: '#2457D6', color: '#fff', padding: '8px 10px', ...extra });
const chip = (bg: string, fg: string): React.CSSProperties => ({ background: bg, color: fg, fontSize: 6, fontWeight: 700, padding: '1px 5px', borderRadius: 10, whiteSpace: 'nowrap' as const });

function ScreenHome() {
  return (
    <div style={phoneBase}>
      <div style={sbar}><span>9:41</span><span>●● ▮▮▮</span></div>
      <div style={abar()}>
        <div style={{ fontSize: 7, opacity: 0.7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>SHIFT ACTIVE · FF-1042</div>
        <div style={{ fontWeight: 700, fontSize: 11, marginTop: 2 }}>Good morning, Arjun</div>
        <div style={{ fontSize: 7.5, opacity: 0.8, marginTop: 1 }}>4 tasks today · 1 in progress</div>
      </div>
      <div style={{ padding: '7px 8px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[
          { title: 'HVAC Unit Maintenance', sub: 'WO-2024-0781 · Northside Industrial · 09:00–12:00', chipBg: '#DBEAFE', chipFg: '#1E40AF', chipLabel: 'IN PROGRESS', border: '#00639B' },
          { title: 'Generator Service', sub: 'WO-2024-0782 · Central Hospital · 08:00–10:00', chipBg: '#FFDAD6', chipFg: '#BA1A1A', chipLabel: 'OVERDUE', border: '#BA1A1A' },
          { title: 'Solar Panel Inspection', sub: 'WO-2024-0783 · Greenfield Farm · 14:00–17:00', chipBg: '#FFF3E0', chipFg: '#A06400', chipLabel: 'ACCEPTED', border: '#A06400' },
        ].map(t => (
          <div key={t.title} style={{ background: '#fff', borderRadius: 6, padding: '5px 7px', borderLeft: `3px solid ${t.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
              <div style={{ fontWeight: 700, fontSize: 8.5, color: '#0F172A', flex: 1, marginRight: 4 }}>{t.title}</div>
              <div style={chip(t.chipBg, t.chipFg)}>{t.chipLabel}</div>
            </div>
            <div style={{ fontSize: 7, color: '#64748B' }}>{t.sub}</div>
          </div>
        ))}
        <div style={{ background: '#6B4E16', color: '#fff', borderRadius: 4, padding: '3px 7px', fontSize: 7, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>☁</span><span>Offline · 3 items queued to sync</span>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-around', padding: '4px 0 2px' }}>
        {(['Home', 'Tasks', '', 'Activity', 'Profile'] as const).map((label, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1 }}>
            {i === 2
              ? <div style={{ background: '#2457D6', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, marginTop: -8, boxShadow: '0 2px 8px rgba(36,87,214,0.4)' }}>+</div>
              : <>
                  <div style={{ fontSize: 10, color: i === 0 ? '#2457D6' : '#94A3B8' }}>{'⊞☑♟☻'.charAt(i < 2 ? i : i - 1)}</div>
                  <div style={{ fontSize: 6, color: i === 0 ? '#2457D6' : '#94A3B8', fontWeight: i === 0 ? 700 : 400 }}>{label}</div>
                </>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenTaskDetail() {
  return (
    <div style={phoneBase}>
      <div style={sbar}><span>9:41</span><span>●● ▮▮▮</span></div>
      <div style={abar({ display: 'flex', alignItems: 'center', gap: 6 })}>
        <span style={{ fontSize: 12 }}>←</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 7, opacity: 0.7 }}>WO-2024-0781</div>
          <div style={{ fontWeight: 700, fontSize: 10 }}>HVAC Unit Maintenance</div>
        </div>
        <div style={{ ...chip('rgba(255,255,255,0.18)', '#fff'), padding: '2px 6px', fontSize: 7 }}>IN PROGRESS</div>
      </div>
      <div style={{ padding: '8px' }}>
        <div style={{ background: '#fff', borderRadius: 7, padding: '7px', marginBottom: 5, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 8.5, color: '#0F172A', marginBottom: 2 }}>Northside Industrial</div>
          <div style={{ fontSize: 7, color: '#64748B' }}>Suite 4B, 123 Trade Park Drive</div>
          <div style={{ fontSize: 7, color: '#64748B', marginTop: 1 }}>James Chen · 09:00–12:00 · 2.4 km</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 7, padding: '7px', marginBottom: 7, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 7.5, color: '#374151', lineHeight: 1.5 }}>Routine preventative maintenance on HVAC unit 3, east wing. Check filters, clean coils, log refrigerant levels.</div>
        </div>
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: 8 }}>
          {['Checklist', 'Evidence', 'Materials', 'Notes', 'Sign'].map((t, i) => (
            <div key={t} style={{ background: i === 0 ? '#2457D6' : '#fff', color: i === 0 ? '#fff' : '#64748B', fontSize: 7, padding: '2px 7px', borderRadius: 10, border: `1px solid ${i === 0 ? '#2457D6' : '#E2E8F0'}`, fontWeight: i === 0 ? 700 : 400 }}>{t}</div>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 8, right: 8 }}>
        <div style={{ background: '#2457D6', color: '#fff', borderRadius: 8, padding: '8px', textAlign: 'center', fontWeight: 700, fontSize: 10 }}>CHECK IN →</div>
      </div>
    </div>
  );
}

function ScreenChecklist() {
  const items = [
    { label: 'Inspect air filters — check for blockage', done: true },
    { label: 'Clean condenser coils with coil cleaner', done: true },
    { label: 'Check refrigerant pressure — log reading', done: true },
    { label: 'Inspect electrical connections', done: false },
    { label: 'Run 10-min operational test', done: false },
  ];
  return (
    <div style={phoneBase}>
      <div style={sbar}><span>9:41</span><span>●● ▮▮▮</span></div>
      <div style={abar({ paddingBottom: 10 })}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 12 }}>←</span>
          <div style={{ fontWeight: 700, fontSize: 10 }}>Task Checklist</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 3, height: 4, marginBottom: 3 }}>
          <div style={{ background: '#fff', width: '60%', height: '100%', borderRadius: 3 }} />
        </div>
        <div style={{ fontSize: 7.5, opacity: 0.8 }}>3 of 5 complete</div>
      </div>
      <div style={{ padding: '7px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 6, padding: '5px 7px', display: 'flex', alignItems: 'flex-start', gap: 5, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 13, height: 13, borderRadius: '50%', border: `2px solid ${item.done ? '#147A45' : '#CBD5E1'}`, background: item.done ? '#147A45' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              {item.done && <span style={{ color: '#fff', fontSize: 8, fontWeight: 700, lineHeight: 1 }}>✓</span>}
            </div>
            <div style={{ fontSize: 7.5, color: item.done ? '#94A3B8' : '#0F172A', textDecoration: item.done ? 'line-through' : 'none', lineHeight: 1.4 }}>{item.label}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 8, right: 8 }}>
        <div style={{ background: '#2457D6', color: '#fff', borderRadius: 8, padding: '7px', textAlign: 'center', fontWeight: 700, fontSize: 10 }}>CONTINUE →</div>
      </div>
    </div>
  );
}

function ScreenEvidence() {
  return (
    <div style={phoneBase}>
      <div style={sbar}><span>9:41</span><span>●● ▮▮▮</span></div>
      <div style={abar({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12 }}>←</span>
          <div style={{ fontWeight: 700, fontSize: 10 }}>Evidence</div>
        </div>
        <div style={{ fontSize: 7.5, opacity: 0.8 }}>3 / 5 photos</div>
      </div>
      <div style={{ padding: '8px' }}>
        <div style={{ background: '#1A2A3A', borderRadius: 8, height: 85, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 8 }}>
          <div style={{ fontSize: 22 }}>📷</div>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 7.5 }}>Tap to capture evidence photo</div>
        </div>
        <div style={{ fontSize: 7.5, fontWeight: 600, color: '#0F172A', marginBottom: 5 }}>Captured (3)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, marginBottom: 7 }}>
          {[{ label: 'Before', bg: '#E8F0FE' }, { label: 'Unit open', bg: '#E6F4EA' }, { label: 'Filter', bg: '#FFF3E0' }].map(p => (
            <div key={p.label} style={{ background: p.bg, borderRadius: 6, aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 14 }}>🖼</div>
              <div style={{ fontSize: 6.5, color: '#64748B', marginTop: 2 }}>{p.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 6, padding: '5px 8px', border: '1px solid #E2E8F0', fontSize: 7.5, color: '#94A3B8' }}>Add caption to selected photo…</div>
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 8, right: 8 }}>
        <div style={{ background: '#2457D6', color: '#fff', borderRadius: 8, padding: '7px', textAlign: 'center', fontWeight: 700, fontSize: 10 }}>TAKE PHOTO</div>
      </div>
    </div>
  );
}

function ScreenSignature() {
  return (
    <div style={phoneBase}>
      <div style={sbar}><span>9:41</span><span>●● ▮▮▮</span></div>
      <div style={abar({ display: 'flex', alignItems: 'center', gap: 6 })}>
        <span style={{ fontSize: 12 }}>←</span>
        <div style={{ fontWeight: 700, fontSize: 10 }}>Customer Sign-off</div>
      </div>
      <div style={{ padding: '8px' }}>
        <div style={{ background: '#fff', borderRadius: 7, padding: '7px', marginBottom: 7, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 8.5, color: '#0F172A', marginBottom: 2 }}>James Chen · Northside Industrial</div>
          <div style={{ fontSize: 7, color: '#64748B' }}>HVAC Maintenance · 3 items · 3 photos</div>
          <div style={{ fontSize: 7, color: '#147A45', marginTop: 2 }}>All checklist items complete ✓</div>
        </div>
        <div style={{ background: '#fff', border: '2px dashed #CBD5E1', borderRadius: 8, height: 75, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, marginBottom: 7 }}>
          <svg width="90" height="28" viewBox="0 0 90 28">
            <path d="M5 22 Q18 4 30 18 Q44 32 58 10 Q70 -4 85 14" fill="none" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
          </svg>
          <div style={{ fontSize: 7, color: '#94A3B8' }}>Signature canvas</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 6, padding: '5px 8px', display: 'flex', gap: 5, alignItems: 'center', marginBottom: 5 }}>
          <span style={{ fontSize: 9 }}>✎</span>
          <div style={{ fontSize: 7.5, color: '#64748B' }}>James Chen</div>
        </div>
        <div style={{ fontSize: 7, color: '#94A3B8', textAlign: 'center' }}>Signed: 11:47 AM · 11 Jun 2024</div>
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 8, right: 8 }}>
        <div style={{ background: '#147A45', color: '#fff', borderRadius: 8, padding: '7px', textAlign: 'center', fontWeight: 700, fontSize: 10 }}>CONFIRM SIGNATURE ✓</div>
      </div>
    </div>
  );
}

function ScreenSyncCentre() {
  const queueItems = [
    { icon: '⏳', label: 'WO-0781 · 3 photos (2.1 MB)', status: 'Queued', bg: '#FFF9F0', c: '#A06400', retry: false },
    { icon: '⏳', label: 'WO-0781 · Signature (42 KB)', status: 'Queued', bg: '#FFF9F0', c: '#A06400', retry: false },
    { icon: '⚠', label: 'WO-0779 · Checklist data', status: 'RETRY', bg: '#FFF5F5', c: '#BA1A1A', retry: true },
    { icon: '✓', label: 'WO-0778 · Materials log', status: 'Synced', bg: '#F0FDF4', c: '#147A45', retry: false },
    { icon: '✓', label: 'WO-0778 · Evidence photos', status: 'Synced', bg: '#F0FDF4', c: '#147A45', retry: false },
  ];
  return (
    <div style={phoneBase}>
      <div style={{ background: '#6B4E16', color: '#fff', padding: '3px 10px', fontSize: 7, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>☁</span><span>Offline (simulated) · 3 items queued</span>
      </div>
      <div style={abar({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
        <div style={{ fontWeight: 700, fontSize: 10 }}>Sync Centre</div>
        <div style={{ fontSize: 7.5, opacity: 0.8 }}>Last: 09:23</div>
      </div>
      <div style={{ padding: '7px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, marginBottom: 3 }}>
          {[{ n: '2', label: 'Pending', bg: '#FFF3E0', text: '#A06400' }, { n: '1', label: 'Failed', bg: '#FFDAD6', text: '#BA1A1A' }, { n: '5', label: 'Synced', bg: '#E6F4EA', text: '#147A45' }].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 6, padding: '4px', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: s.text }}>{s.n}</div>
              <div style={{ fontSize: 6.5, color: s.text }}>{s.label}</div>
            </div>
          ))}
        </div>
        {queueItems.map((item, i) => (
          <div key={i} style={{ background: item.bg, borderRadius: 5, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ fontSize: 8.5, color: item.c, flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1, fontSize: 7, color: '#0F172A', lineHeight: 1.3 }}>{item.label}</div>
            <div style={{ background: item.retry ? '#BA1A1A' : 'transparent', color: item.retry ? '#fff' : item.c, fontSize: 6.5, padding: '1px 5px', borderRadius: 3, fontWeight: 600, flexShrink: 0 }}>{item.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="renewly-mobile-item">
      <div className="renewly-mobile-frame">{children}</div>
      <p className="wireframe-item__label">{label}</p>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function FieldFlowCaseStudyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <>
      <Header />

      <CaseStudyHero
        label="Case study"
        title="FieldFlow"
        subtitle="Offline-first task management for field service technicians. Work clearly. Prove completion."
        tags={['UX Design', 'Mobile-First', 'Field Service', 'Android Concept', 'React Prototype']}
        prototypeUrl="/field-flow"
        prototypeLabel="View interactive prototype →"
        prototypeUrlLabel="FieldFlow prototype"
      />

      <div className="cs-layout" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-20)' }}>
        <CaseStudyNav items={fieldflowNavItems} />

        <main className="cs-content">

          {/* ── SNAPSHOT ─────────────────────────────────────────── */}
          <section className="cs-section" id="snapshot">
            <h2 className="cs-section__title">Project snapshot</h2>
            <div className="snapshot-grid">
              {[
                { label: 'Role', value: 'UX Designer · Interaction Designer · Prototype engineer' },
                { label: 'Timeline', value: '4–6 week concept project' },
                { label: 'Platform', value: 'Android UX concept · Mobile-first web prototype' },
                { label: 'Tools', value: 'Figma (concept) · MUI v9 · React · Zustand' },
              ].map(m => (
                <div key={m.label} className="cs-card">
                  <div className="cs-card__title">{m.label}</div>
                  <div className="cs-card__body">{m.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 'var(--space-5)', background: 'var(--color-accent-light)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--color-accent)' }}>
              <strong>Platform note:</strong> FieldFlow was designed as a native Android application following Material Design 3 conventions. For portfolio demonstration, it was implemented as a mobile-first web prototype with full offline-first behaviour. Demo credentials: <strong>FF-1042 / demo123</strong>
            </div>
          </section>

          {/* ── OVERVIEW ─────────────────────────────────────────── */}
          <section className="cs-section" id="overview">
            <h2 className="cs-section__title">Project overview</h2>
            <p className="cs-section__body">
              FieldFlow is a task management system designed for field technicians who spend most of their working day away from a desk,
              often in locations with poor or no mobile connectivity. The project began with a straightforward observation:
              despite the availability of enterprise work-order systems, many field teams still coordinate via WhatsApp messages,
              paper checklists, and follow-up phone calls because the available software is too slow, too complex, or simply unusable offline.
            </p>
            <p className="cs-section__body">
              This concept project explores how a purpose-built mobile application — designed around the real constraints of field work —
              could replace fragmented coordination workflows with a single, reliable, offline-capable tool. The design prioritises speed
              (critical actions reachable in two taps), clarity (unambiguous task status at a glance), and resilience (every core function
              works without a network connection).
            </p>
            <p className="cs-section__body">
              The prototype delivers 25+ screens covering the complete task lifecycle: splash, onboarding, login, home dashboard,
              task list and detail, GPS check-in, checklist, evidence capture, materials log, notes, customer signature, review,
              completion, sync centre, supervisor panel, and settings.
            </p>
          </section>

          {/* ── PROBLEM ──────────────────────────────────────────── */}
          <section className="cs-section" id="problem">
            <h2 className="cs-section__title">The problem</h2>
            <p className="cs-section__body">
              Field service operations involve moving parts: a dispatcher creates a work order, a technician receives the assignment,
              travels to a site, carries out diagnostics and repairs, collects evidence, obtains customer sign-off, and reports back.
              In practice, this chain breaks at almost every handoff — WhatsApp for assignments, paper for checklists, phone calls for status.
            </p>
            <p className="cs-section__body">
              The result is a workflow that is simultaneously over-communicated (constant phone calls) and under-documented (no reliable
              audit trail). The core design problem is not a lack of tools — it is a lack of tools that field workers actually trust and
              use under real field conditions.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={TABLE}>
                <thead>
                  <tr>
                    <th style={TH}>Workflow area</th>
                    <th style={{ ...TH, background: '#FFF5F5', color: '#C62828' }}>Old way (fragmented)</th>
                    <th style={{ ...TH, background: '#F0FDF4', color: '#166534' }}>FieldFlow approach</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Task assignment', 'WhatsApp message + verbal confirmation', 'Push notification + task card with full context'],
                    ['Offline access', 'Paper printout or memory', 'Full task detail cached locally, available offline'],
                    ['Status updates', 'Technician calls supervisor to report progress', 'Tap-to-update status syncs automatically when connected'],
                    ['Evidence', 'Phone photos saved to personal gallery, shared later', 'In-app camera attaches geotagged photos directly to task'],
                    ['Sign-off', 'Physical signature on paper form, scanned later', 'Digital signature captured on-site, stored with task record'],
                    ['End-of-day sync', 'Manual data entry from paper notes', 'Background sync uploads all captured data on reconnect'],
                  ].map(([area, old, next]) => (
                    <tr key={area}>
                      <td style={{ ...TD, fontWeight: 600, color: 'var(--color-text-primary)' }}>{area}</td>
                      <td style={{ ...TD, background: '#FFF5F5', color: '#C62828' }}>{old}</td>
                      <td style={{ ...TD, background: '#F0FDF4', color: '#166534' }}>{next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── WHY THIS MATTERS ─────────────────────────────────── */}
          <section className="cs-section" id="why-matters">
            <h2 className="cs-section__title">Why this problem matters</h2>
            <p className="cs-section__body">Poor field-service coordination has measurable consequences for every role in the service chain.</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={TABLE}>
                <thead>
                  <tr>
                    <th style={TH}>Stakeholder</th>
                    <th style={TH}>Day-to-day pain</th>
                    <th style={TH}>Business consequence</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Technicians', 'Unclear priorities, missing site info, no reliable offline access', 'Repeat site visits, wasted travel time, end-of-day paperwork backlog'],
                    ['Supervisors', 'No real-time visibility; must phone technicians for updates', 'Reactive management, inability to redeploy staff when tasks shift'],
                    ['Customers', 'Missed time windows, no ETA visibility, inconsistent documentation', 'Erosion of trust, increased support calls, churn risk'],
                    ['Operations teams', 'Incomplete audit trail, manual data reconciliation from paper', 'Compliance risk, inability to analyse performance, reporting delays'],
                  ].map(([role, pain, consequence]) => (
                    <tr key={role}>
                      <td style={{ ...TD, fontWeight: 700, color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>{role}</td>
                      <td style={TD}>{pain}</td>
                      <td style={{ ...TD, color: '#C62828' }}>{consequence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── RESEARCH ─────────────────────────────────────────── */}
          <section className="cs-section" id="research">
            <h2 className="cs-section__title">Research approach</h2>
            <p className="cs-section__body">
              As a concept project, primary research was not available. The approach relied on secondary sources: industry reports on
              mobile workforce management, app store reviews of competing products, support forum discussions, and publicly available
              service operations playbooks — supplemented with structured competitor analysis and assumption mapping.
            </p>
            <div className="cs-cards-grid cs-cards-grid--2" style={{ marginTop: 'var(--space-5)' }}>
              <div className="cs-card">
                <div className="cs-card__title">5 Research questions</div>
                {[
                  'How do technicians receive, track, and close work orders in the field?',
                  'What happens to task workflows when connectivity is lost or unreliable?',
                  'What evidence and documentation do technicians need to capture on-site?',
                  'How do supervisors monitor field team progress and intervene when needed?',
                  'What consumer app interaction patterns do field workers already rely on?',
                ].map((q, i) => (
                  <div key={i} className="cs-card__body" style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-accent)', flexShrink: 0 }}>Q{i + 1}</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="cs-card">
                  <div className="cs-card__title">3 Key assumptions</div>
                  {[
                    'Technicians prefer a task-first view, not a calendar, as primary navigation',
                    'Offline-first architecture is a hard requirement, not a nice-to-have',
                    'Photo evidence capture is the most friction-prone step in current workflows',
                  ].map((a, i) => (
                    <div key={i} className="cs-card__body" style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-accent)', flexShrink: 0 }}>A{i + 1}</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
                <div className="cs-card" style={{ borderLeft: '3px solid #A06400', background: '#FFFBEB' }}>
                  <div className="cs-card__title" style={{ color: '#92400E' }}>2 Key limitations</div>
                  <div className="cs-card__body">No primary field research — all insights are secondary and assumption-based.</div>
                  <div className="cs-card__body">Prototype tests interactions but cannot validate real-world offline edge cases.</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── COMPETITIVE ANALYSIS ─────────────────────────────── */}
          <section className="cs-section" id="competitive">
            <h2 className="cs-section__title">Competitive analysis</h2>
            <p className="cs-section__body">
              Field service management is a crowded but vertically fragmented market. Enterprise platforms offer broad feature sets
              but poor mobile UX. Consumer task apps offer smooth mobile experiences but lack field-service domain features.
              Most teams end up stitching together WhatsApp and spreadsheets.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ ...TABLE, minWidth: 680 }}>
                <thead>
                  <tr>
                    <th style={TH}>Criterion</th>
                    <th style={TH}>Enterprise FSM</th>
                    <th style={TH}>Work order apps</th>
                    <th style={TH}>Generic task apps</th>
                    <th style={TH}>WhatsApp + Sheets</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Offline-first', 'Partial / unreliable', 'Limited', 'None', 'None'],
                    ['Mobile UX quality', 'Poor — desktop port', 'Moderate', 'Good', 'Consumer-grade'],
                    ['Task-centric nav', 'Mixed with CRM', 'Moderate', 'Yes', 'Manual'],
                    ['Photo + evidence', 'Available, complex', 'Available', 'No', 'No'],
                    ['Digital signature', 'Available', 'Available', 'No', 'No'],
                    ['Supervisor view', 'Yes', 'Limited', 'No', 'No'],
                    ['Onboarding friction', 'Very high', 'Moderate', 'Low', 'None'],
                  ].map(([criterion, ...cells]) => (
                    <tr key={criterion}>
                      <td style={{ ...TD, fontWeight: 600, color: 'var(--color-text-primary)' }}>{criterion}</td>
                      {cells.map((c, i) => (
                        <td key={i} style={{
                          ...TD,
                          background: c.startsWith('Yes') || c === 'Good' || c === 'Low' ? '#F0FDF4' : c === 'None' || c.startsWith('No') || c.includes('Poor') || c.includes('Very high') ? '#FFF5F5' : 'transparent',
                          color: c.startsWith('Yes') || c === 'Good' || c === 'Low' ? '#166534' : c === 'None' || c.startsWith('No') || c.includes('Poor') || c.includes('Very high') ? '#C62828' : 'var(--color-text-secondary)',
                        }}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── PERSONAS ─────────────────────────────────────────── */}
          <section className="cs-section" id="personas">
            <h2 className="cs-section__title">Personas</h2>
            <p className="cs-section__body">Two personas anchored design decisions throughout the project.</p>
            <div className="cs-cards-grid cs-cards-grid--2" style={{ marginTop: 'var(--space-5)' }}>
              {[
                {
                  name: 'Arjun Sharma', role: 'Field Technician (Primary)', age: 34,
                  context: 'Maintenance technician at a utilities company, 6 years in the field. Travels between 5–8 sites daily.',
                  goals: ['Complete all tasks without rework', 'Access full task context before arriving on site', 'Avoid end-of-day paperwork backlog'],
                  pains: ['App crashes when connectivity drops mid-task', 'Missing info means extra calls to the office', 'Photo upload fails silently, causing review rejections'],
                  quote: '"I just need the app to work. I don\'t care about fancy features."',
                  accent: '#2457D6',
                },
                {
                  name: 'Priya Mehta', role: 'Field Supervisor (Secondary)', age: 42,
                  context: 'Operations supervisor managing a team of 12 technicians. Office-based, accountable for SLA compliance.',
                  goals: ['Real-time view of team task status without calling everyone', 'Early warning when tasks are delayed or at risk', 'Clean audit trail for compliance and reporting'],
                  pains: ['Spends 2+ hours daily chasing status updates by phone', 'Incomplete evidence means she cannot formally close jobs', 'No way to see which technician is closest to a new urgent task'],
                  quote: '"I need to know what\'s happening without interrupting everyone to ask."',
                  accent: '#006A60',
                },
              ].map(p => (
                <div key={p.name} className="cs-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ background: `${p.accent}12`, borderBottom: `2px solid ${p.accent}`, padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, background: p.accent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>{p.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{p.role} · Age {p.age}</div>
                    </div>
                  </div>
                  <div style={{ padding: 'var(--space-5)' }}>
                    <p className="cs-card__body">{p.context}</p>
                    <div style={{ marginBottom: 'var(--space-3)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Goals</div>
                      {p.goals.map(g => <div key={g} className="cs-card__body" style={{ marginBottom: 2 }}>+ {g}</div>)}
                    </div>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: '#C62828', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Pain points</div>
                      {p.pains.map(pain => <div key={pain} className="cs-card__body" style={{ marginBottom: 2 }}>– {pain}</div>)}
                    </div>
                    <div style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)', borderLeft: `3px solid ${p.accent}`, fontSize: 'var(--text-sm)', fontStyle: 'italic', color: 'var(--color-text-primary)' }}>{p.quote}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── JTBD ─────────────────────────────────────────────── */}
          <section className="cs-section" id="jtbd">
            <h2 className="cs-section__title">Jobs to be done</h2>
            <p className="cs-section__body">JTBD framing shifts focus from features to outcomes. Each statement defines what a user is trying to achieve, the context that triggers it, and the outcome they need.</p>
            <div className="cs-cards-grid" style={{ marginTop: 'var(--space-5)' }}>
              {[
                { when: 'When I arrive at a new site', i: 'review everything I need to know about this task', so: 'I can begin work immediately without calling the office for clarification' },
                { when: 'When I\'m in a basement or rural area with no signal', i: 'have all my tasks and reference materials available offline', so: 'poor connectivity never blocks me from doing my job' },
                { when: 'When I complete a repair and need to document', i: 'capture photos, complete a checklist, and get a signature in one flow', so: 'all evidence is attached to the right task without manual sorting later' },
                { when: 'When a task is taking longer than expected', i: 'log a delay reason with one tap and notify my supervisor automatically', so: 'my supervisor can manage customer expectations without me stopping to call' },
                { when: 'When I finish my last task of the day', i: 'have all my offline-captured data sync automatically', so: 'my work is recorded correctly and I can close out without extra admin' },
              ].map((j, i) => (
                <div key={i} className="cs-card" style={{ borderTop: '3px solid var(--color-accent)' }}>
                  <div className="cs-card__number">{String(i + 1).padStart(2, '0')}</div>
                  <div className="cs-card__body" style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>{j.when}…</div>
                  <div className="cs-card__title">"{j.i}"</div>
                  <div className="cs-card__body"><strong>So that:</strong> {j.so}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── USER JOURNEY ─────────────────────────────────────── */}
          <section className="cs-section" id="journey">
            <h2 className="cs-section__title">User journey map</h2>
            <p className="cs-section__body">The journey follows Arjun through a complete field service day — from receiving his first task through end-of-day sync.</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ ...TABLE, minWidth: 800, fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Step', 'Action', 'Thoughts', 'Pain point', 'Design opportunity', 'Emotion'].map(h => <th key={h} style={TH}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Wake up', 'Checks phone for task assignments', '"How many tasks? Where am I going first?"', 'Task list buried in email or chat', 'Push notification with task count and first site distance', '😐'],
                    ['Travel', 'Opens map directions from task card', '"Is all the info here before I lose signal?"', 'App needs data to load task details', 'Full task detail pre-cached on notification receipt', '😟'],
                    ['Arrive', 'Reads task brief and equipment list', '"Do I have the right parts?"', 'Incomplete context means a call to dispatch', 'Rich task cards with site notes, contact, parts list', '😐'],
                    ['Check in', 'Taps Check In — GPS recorded automatically', '"Good, they know I\'m here."', 'Separate check-in system requires manual entry', 'One-tap check-in with auto-timestamp and GPS', '🙂'],
                    ['Work', 'Works through task checklist offline', '"Am I following the right steps?"', 'Paper checklist — easy to skip items', 'Interactive digital checklist with required-field gating', '😐'],
                    ['Evidence', 'Takes before/after photos in-app', '"Will these photos upload later?"', 'Photos saved to personal gallery, not attached to task', 'In-app camera directly attaches photos to task', '😟'],
                    ['Sign-off', 'Customer signs on phone screen', '"I hope the signature saves properly."', 'Paper forms get lost; customer must be present', 'Digital signature with timestamp, emailed to customer', '🙂'],
                    ['Complete', 'Marks task complete, sees sync status', '"Did everything save?"', 'No clear end state — just close the app', 'Completion summary with sync queue status and next task', '😊'],
                  ].map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--color-bg-subtle)' }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ ...TD, fontWeight: j === 0 ? 600 : 400, color: j === 4 ? 'var(--color-accent)' : j === 3 ? '#C62828' : 'var(--color-text-secondary)', fontSize: j === 5 ? 18 : 12 }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── HMW ──────────────────────────────────────────────── */}
          <section className="cs-section" id="hmw">
            <h2 className="cs-section__title">How might we</h2>
            <p className="cs-section__body">Six HMW questions translate the journey pain points into design challenges that frame the solution space.</p>
            <div className="cs-cards-grid" style={{ marginTop: 'var(--space-5)' }}>
              {[
                'How might we make all task information available before a technician loses mobile signal?',
                'How might we make photo evidence capture feel as natural as taking a photo with a personal phone?',
                'How might we give supervisors real-time task visibility without interrupting technicians?',
                'How might we make end-of-day sync transparent and trustworthy so technicians feel confident their work is recorded?',
                'How might we reduce the steps to log materials used on-site without sacrificing accuracy?',
                'How might we allow technicians to flag unexpected issues while staying focused on the primary task?',
              ].map((q, i) => (
                <div key={i} className="cs-card" style={{ borderLeft: '3px solid var(--color-accent)', background: 'var(--color-bg-subtle)' }}>
                  <div className="cs-card__number" style={{ background: 'var(--color-accent)' }}>HMW {String(i + 1).padStart(2, '0')}</div>
                  <div className="cs-card__body" style={{ fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 'var(--leading-relaxed)' }}>{q}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── PRODUCT PRINCIPLES ───────────────────────────────── */}
          <section className="cs-section" id="principles">
            <h2 className="cs-section__title">Product principles</h2>
            <p className="cs-section__body">Eight principles guided every design decision. Any feature that violated them was redesigned or cut.</p>
            <div className="cs-cards-grid cs-cards-grid--4" style={{ marginTop: 'var(--space-5)' }}>
              {[
                { num: '01', title: 'Offline by default', body: 'Every core function must work without a network connection. Online features are enhancements, not requirements.' },
                { num: '02', title: 'Thumb reachable', body: 'All primary actions are in the bottom third of the screen. No stretching for critical controls.' },
                { num: '03', title: 'Two taps to act', body: 'A technician should reach any critical action from the home screen in two taps or fewer.' },
                { num: '04', title: 'Status is always visible', body: 'Current task status, sync state, and connectivity indicator are always visible, never hidden in menus.' },
                { num: '05', title: 'Never block on upload', body: 'Photo uploads and data sync happen in the background. A failed upload never blocks task completion.' },
                { num: '06', title: 'Capture once, attach automatically', body: 'Evidence captured in the app is automatically attached to the correct task. No manual filing.' },
                { num: '07', title: 'Trust the technician', body: 'The app supports the technician\'s judgment. It provides context and prompts; it does not override decisions.' },
                { num: '08', title: 'Errors are recoverable', body: 'Every destructive action can be undone. Offline actions are queued, not lost. Errors have clear recovery paths.' },
              ].map(p => (
                <div key={p.num} className="cs-card">
                  <div className="cs-card__number">{p.num}</div>
                  <div className="cs-card__title">{p.title}</div>
                  <div className="cs-card__body">{p.body}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── IA ───────────────────────────────────────────────── */}
          <section className="cs-section" id="ia">
            <h2 className="cs-section__title">Information architecture</h2>
            <p className="cs-section__body">The IA organises the app around five navigation pillars. A pre-app onboarding flow handles authentication and device permissions separately to keep the main app uncluttered.</p>
            <div className="cs-cards-grid" style={{ marginTop: 'var(--space-5)' }}>
              {[
                { label: 'Home', screens: ['Task list (status-grouped)', 'In-progress banner', 'Next task prompt', 'Demo controls'] },
                { label: 'Task detail', screens: ['Task brief', 'Check-in', 'Checklist', 'Evidence', 'Materials', 'Notes', 'Pause', 'Signature', 'Review', 'Complete'] },
                { label: 'Activity', screens: ['All tasks log', 'Filter / search', 'Activity timeline'] },
                { label: 'Scan', screens: ['QR / barcode scanner', 'Asset lookup', 'Demo scan buttons'] },
                { label: 'Profile', screens: ['Account info', 'Settings', 'Sync Centre', 'Notifications', 'Supervisor Panel'] },
              ].map(tab => (
                <div key={tab.label} className="cs-card" style={{ borderTop: '3px solid var(--color-accent)' }}>
                  <div className="cs-card__title">{tab.label}</div>
                  {tab.screens.map(s => <div key={s} className="cs-card__body" style={{ marginBottom: 2, fontSize: 'var(--text-xs)' }}>· {s}</div>)}
                </div>
              ))}
            </div>
          </section>

          {/* ── USER FLOWS ───────────────────────────────────────── */}
          <section className="cs-section" id="flows">
            <h2 className="cs-section__title">User flows</h2>
            <p className="cs-section__body">Six critical flows define the core interaction paths.</p>
            {[
              { title: 'Core task execution', steps: ['Receive notification', 'Open task', 'Read brief', 'Check In', 'Work + checklist', 'Evidence', 'Signature', 'Complete', 'Auto-sync'] },
              { title: 'Offline task access', steps: ['Connectivity lost', 'Open app', 'Access cached tasks', 'Complete work', 'Capture offline photos', 'Reconnect', 'Background sync', 'Sync confirmation'] },
              { title: 'Evidence capture', steps: ['Open task', 'Tap Evidence tab', 'Launch in-app camera', 'Take photo(s)', 'Add caption', 'Photo attached to task', 'Upload on sync'] },
              { title: 'Customer sign-off', steps: ['Tap Signature tab', 'Customer reviews summary', 'Customer signs on screen', 'Signature confirmed', 'PDF generated', 'Task marked complete'] },
              { title: 'Delay escalation', steps: ['Task running long', 'Tap Pause', 'Select delay reason', 'Add optional note', 'Supervisor notified', 'Task: Paused', 'Resume when ready'] },
              { title: 'Supervisor oversight', steps: ['Open Supervisor Panel', 'View all team tasks live', 'Filter by status', 'Tap technician for detail', 'Send priority update', 'Technician notified'] },
            ].map(flow => (
              <div key={flow.title} style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', marginBottom: 8 }}>{flow.title}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, alignItems: 'center' }}>
                  {flow.steps.map((step, i) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ background: i === 0 ? '#1A2A6C' : i === flow.steps.length - 1 ? '#F0FDF4' : 'var(--color-bg-subtle)', color: i === 0 ? '#fff' : i === flow.steps.length - 1 ? '#166534' : 'var(--color-text-secondary)', border: `1px solid ${i === 0 ? '#1A2A6C' : i === flow.steps.length - 1 ? '#BBF7D0' : 'var(--color-border)'}`, borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: i === 0 || i === flow.steps.length - 1 ? 600 : 400, whiteSpace: 'nowrap', margin: '3px 0' }}>{step}</div>
                      {i < flow.steps.length - 1 && <span style={{ color: 'var(--color-text-muted)', margin: '0 3px', fontSize: 12 }}>→</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* ── EARLY CONCEPTS ───────────────────────────────────── */}
          <section className="cs-section" id="concepts">
            <h2 className="cs-section__title">Early concepts</h2>
            <p className="cs-section__body">Three navigation approaches were explored before settling on the bottom tab + task list model.</p>
            <div className="cs-cards-grid" style={{ marginTop: 'var(--space-5)' }}>
              {[
                { label: 'Concept A — Map-first', status: 'Discarded', statusColor: '#C62828', statusBg: '#FFF5F5', desc: 'Home screen centred on a map showing nearby task sites. Discarded: too complex for one-handed use, overemphasised location vs. task priority.' },
                { label: 'Concept B — Calendar-first', status: 'Discarded', statusColor: '#C62828', statusBg: '#FFF5F5', desc: 'Daily/weekly calendar view. Discarded: field workers think in tasks, not time blocks. Calendar metaphor added cognitive load without benefit.' },
                { label: 'Concept C — Task list + bottom nav', status: 'Selected', statusColor: '#166534', statusBg: '#F0FDF4', desc: 'Scrollable task list grouped by status with fixed bottom navigation. Selected: familiar pattern, works one-handed, task status is immediately visible.' },
              ].map(c => (
                <div key={c.label} className="cs-card" style={{ borderTop: `3px solid ${c.statusColor}` }}>
                  <div style={{ display: 'inline-block', background: c.statusBg, color: c.statusColor, fontSize: 'var(--text-xs)', fontWeight: 700, padding: '2px 10px', borderRadius: 'var(--radius-full)', marginBottom: 4 }}>{c.status}</div>
                  <div className="cs-card__title">{c.label}</div>
                  <div style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', border: '1px dashed var(--color-border)', marginBottom: 8 }}>Concept sketch</div>
                  <div className="cs-card__body">{c.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── DESIGN SYSTEM ────────────────────────────────────── */}
          <section className="cs-section" id="design-system">
            <h2 className="cs-section__title">Design system</h2>
            <p className="cs-section__body">FieldFlow uses a purposeful, restrained design system. The palette prioritises readability in bright outdoor light. Components follow Material Design 3 patterns with field-service-specific customisations.</p>

            <h3 className="cs-section__subtitle">Colour palette</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 'var(--space-8)' }}>
              {[
                { name: 'Primary', hex: '#2457D6' }, { name: 'Secondary', hex: '#006A60' },
                { name: 'In Progress', hex: '#FF9800' }, { name: 'Complete', hex: '#4CAF50' },
                { name: 'Overdue / Alert', hex: '#F44336' }, { name: 'Offline', hex: '#6B4E16' },
                { name: 'Surface', hex: '#F7F8FC', border: true }, { name: 'Background', hex: '#FFFFFF', border: true },
              ].map(c => (
                <div key={c.hex} style={{ textAlign: 'center', width: 90 }}>
                  <div style={{ background: c.hex, height: 44, borderRadius: 8, marginBottom: 5, border: (c as { border?: boolean }).border ? '1px solid var(--color-border)' : 'none' }} />
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-primary)' }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{c.hex}</div>
                </div>
              ))}
            </div>

            <h3 className="cs-section__subtitle">Component inventory</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Task card', 'Status chip', 'Offline banner', 'Bottom navigation', 'App shell', 'Check-in confirmation', 'Evidence capture panel', 'Photo thumbnail grid', 'Materials item row', 'Checklist item', 'Notes input', 'Pause dialog', 'Signature pad', 'Review summary', 'Complete animation', 'Sync progress indicator', 'Notification item', 'Supervisor task row', 'Filter chips', 'Empty state', 'Error state', 'Loading skeleton'].map(c => (
                <span key={c} style={{ background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: 'var(--color-text-secondary)' }}>{c}</span>
              ))}
            </div>
          </section>

          {/* ── KEY UX DECISIONS ─────────────────────────────────── */}
          <section className="cs-section" id="decisions">
            <h2 className="cs-section__title">Key UX decisions</h2>
            <p className="cs-section__body">Ten decisions shaped the final design. Each reflects a deliberate trade-off between competing needs.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}>
              {[
                { d: 'Bottom navigation with 4 tabs instead of a hamburger menu', r: 'Field technicians use phones with gloves or one hand. Bottom navigation keeps all primary destinations thumb-reachable. The hamburger adds a hidden layer that increases cognitive load and tap count.' },
                { d: 'Status-grouped task list instead of chronological list', r: 'Grouping tasks by status (In Progress, Today, Upcoming, Completed) mirrors how technicians think about their day — not by time slot but by what needs attention first.' },
                { d: 'Persistent offline status banner at the top of every screen', r: 'Technicians need to know at all times whether they are online or offline. The banner is intentionally prominent — missing a sync window costs real time.' },
                { d: 'In-app camera instead of system gallery picker', r: 'Asking technicians to open the system camera then find and attach photos later creates friction and errors. An in-app camera captures photos directly attached to the correct task.' },
                { d: 'Tab bar within task detail instead of a linear wizard', r: 'Technicians may need to jump back to Notes while taking evidence photos. A tab bar allows non-linear navigation while maintaining task context.' },
                { d: 'Digital signature collected on-device using a canvas element', r: 'Paper signature forms are the primary cause of job-closure delays. An on-device signature eliminates the physical form and generates a timestamped record.' },
                { d: 'Background sync with explicit queue visibility instead of silent auto-sync', r: 'Silent sync failures erode trust. The Sync Centre gives technicians explicit visibility into what is uploading, what is queued, and what failed — with one-tap retry.' },
                { d: 'Optimistic UI updates for task status changes', r: 'Waiting for a server response before updating the UI felt broken on slow connections. Optimistic updates show the new state immediately while sync happens in the background.' },
                { d: 'Structured delay reasons instead of a free-text delay note', r: 'Structured reasons (Parts missing / Site access issue / Waiting for customer) enable supervisor dashboards and SLA analysis. Free text is not queryable.' },
                { d: 'Supervisor Panel role-gated inside the same app', r: 'A separate supervisor app doubles maintenance burden. A role-gated screen within the same app allows supervisors who are occasionally in the field to use the same interface with elevated visibility.' },
              ].map((d, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 'var(--space-4)', padding: 'var(--space-5)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                  <div style={{ width: 36, height: 36, background: '#1A2A6C', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', marginBottom: 4 }}>{d.d}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{d.r}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── MOBILE DESIGN THINKING ───────────────────────────── */}
          <section className="cs-section" id="mobile-thinking">
            <h2 className="cs-section__title">Native mobile design thinking</h2>
            <div className="cs-cards-grid cs-cards-grid--2" style={{ marginTop: 'var(--space-5)' }}>
              <div className="cs-card">
                <div className="cs-card__title">Android patterns applied</div>
                {[
                  ['Bottom Navigation Bar', 'Material 3 bottom navigation with 4 primary destinations, following Google\'s recommendation for 3–5 top-level destinations.'],
                  ['Swipe actions', 'Horizontal swipe on task cards reveals quick actions (complete, pause) without opening the detail view.'],
                  ['FAB positioning', 'The Floating Action Button is positioned bottom-right, thumb-zone optimised for right-handed use.'],
                  ['System font rendering', 'Using Roboto ensures text renders at native quality without a web font load delay.'],
                  ['Haptic feedback', 'Designed with haptic feedback integration points: task completion, signature confirmation, offline toggle.'],
                ].map(([title, body]) => (
                  <div key={title} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8, marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', marginBottom: 2 }}>{title}</div>
                    <div className="cs-card__body">{body}</div>
                  </div>
                ))}
              </div>
              <div className="cs-card">
                <div className="cs-card__title">Web prototype implementation</div>
                <div style={{ background: 'var(--color-accent-light)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-accent)', lineHeight: 'var(--leading-relaxed)' }}>
                  The prototype is a mobile-first React web app that runs at 390px wide, mimicking Android interaction patterns as closely as the web platform allows.
                </div>
                {[
                  ['Zustand state management', 'Offline state, task store, and sync queue use Zustand — behaves identically to a native state manager for prototype fidelity.'],
                  ['React Router nested routing', 'App navigation mirrors Android\'s back-stack model with nested routes and a custom back-button handler.'],
                  ['MUI Material 3', 'Material UI v9 provides Android-native component patterns (Bottom Navigation, FAB, Chips, Snackbars) out of the box.'],
                  ['100dvh viewport units', 'Prevents browser chrome resize from breaking mobile layouts.'],
                ].map(([title, body]) => (
                  <div key={title} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8, marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', marginBottom: 2 }}>{title}</div>
                    <div className="cs-card__body">{body}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── UI SCREENS ───────────────────────────────────────── */}
          <section className="cs-section" id="screens">
            <h2 className="cs-section__title">UI screen walkthrough</h2>
            <p className="cs-section__body">
              The prototype delivers 25+ screens covering the complete task lifecycle. Six key screens below illustrate the primary interaction touchpoints. Open the interactive prototype on a phone or at 390px viewport width for the full experience.
            </p>

            <div className="renewly-mobile-gallery renewly-mobile-gallery--3col">
              <MobileFrame label="Home — status-grouped task list">
                <ScreenHome />
              </MobileFrame>
              <MobileFrame label="Task detail — brief, sub-tabs, actions">
                <ScreenTaskDetail />
              </MobileFrame>
              <MobileFrame label="Checklist — required-item gating">
                <ScreenChecklist />
              </MobileFrame>
            </div>

            <div className="renewly-mobile-gallery renewly-mobile-gallery--3col" style={{ marginTop: 'var(--space-5)' }}>
              <MobileFrame label="Evidence capture — in-app camera">
                <ScreenEvidence />
              </MobileFrame>
              <MobileFrame label="Customer sign-off — canvas signature">
                <ScreenSignature />
              </MobileFrame>
              <MobileFrame label="Sync centre — upload queue management">
                <ScreenSyncCentre />
              </MobileFrame>
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
              <Button href="/field-flow" size="lg">View interactive prototype →</Button>
            </div>
          </section>

          {/* ── OFFLINE-FIRST ─────────────────────────────────────── */}
          <section className="cs-section" id="offline">
            <h2 className="cs-section__title">Offline-first experience</h2>
            <p className="cs-section__body">Offline-first means designing for no connectivity as the default, not as an edge case. Every FieldFlow feature was designed offline first, then connectivity features were layered in.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, marginTop: 'var(--space-6)', marginBottom: 'var(--space-6)', overflowX: 'auto' }}>
              {[
                { phase: 'Online', border: '#166534', color: '#166534', bg: '#F0FDF4', actions: ['Tasks sync from server', 'Photos upload immediately', 'Supervisor view live', 'Notifications delivered'] },
                { phase: 'Going offline', border: '#A06400', color: '#A06400', bg: '#FFFBEB', actions: ['Offline banner appears', 'Last sync shown', 'Cached tasks available', 'Upload queue pauses'] },
                { phase: 'Fully offline', border: '#C62828', color: '#C62828', bg: '#FFF5F5', actions: ['All tasks accessible', 'Photos saved to queue', 'Signatures captured', 'Changes stored locally'] },
                { phase: 'Reconnecting', border: '#1E40AF', color: '#1E40AF', bg: '#EFF6FF', actions: ['Auto-detect connectivity', 'Sync queue begins', 'Progress indicator', 'Conflicts flagged'] },
                { phase: 'Synced', border: '#166534', color: '#166534', bg: '#F0FDF4', actions: ['Upload complete notice', 'Banner clears', 'Sync log entry created', 'Server state updated'] },
              ].map(p => (
                <div key={p.phase} style={{ display: 'flex', flexDirection: 'column', minWidth: 120 }}>
                  <div style={{ background: p.bg, color: p.color, padding: '10px 12px', borderTop: `3px solid ${p.border}`, fontWeight: 700, fontSize: 12, textAlign: 'center', border: '1px solid var(--color-border)', borderTopColor: p.border }}>{p.phase}</div>
                  <div style={{ background: '#fff', border: '1px solid var(--color-border)', flex: 1, padding: '10px 12px' }}>
                    {p.actions.map(a => <div key={a} style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 5, paddingLeft: 10, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: p.color }}>·</span>{a}</div>)}
                  </div>
                </div>
              ))}
            </div>
            <div className="cs-card">
              <div className="cs-card__title">What is stored offline</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, marginTop: 8 }}>
                {['Assigned task list + full task detail', 'Site notes and equipment docs', 'Checklist steps and completion state', 'Captured photos (compressed, queued)', 'Materials logged and quantities', 'Task notes and issue flags', 'Customer signature (canvas bitmap)', 'GPS check-in coordinates and timestamps'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ color: '#166534', fontWeight: 700, flexShrink: 0 }}>✓</span><span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── ACCESSIBILITY ────────────────────────────────────── */}
          <section className="cs-section" id="accessibility">
            <h2 className="cs-section__title">Accessibility</h2>
            <p className="cs-section__body">Field service apps serve a wide range of users, including those operating in challenging environments — bright sunlight, gloves, moving vehicles. Six principles guided accessibility decisions.</p>
            <div className="cs-cards-grid" style={{ marginTop: 'var(--space-5)' }}>
              {[
                { title: 'Minimum 48px touch targets', body: 'All interactive elements meet Android\'s minimum 48×48dp touch target requirement, with additional spacing for frequently used actions.' },
                { title: 'Colour + label status indicators', body: 'Task status is communicated by both colour chip and text label. Colour alone is never the only status indicator.' },
                { title: 'WCAG AA contrast ratios', body: 'All text/background combinations achieve a minimum 4.5:1 contrast ratio. The dark navy primary achieves 12:1 against white.' },
                { title: 'Screen reader content descriptions', body: 'All interactive elements include content descriptions for TalkBack compatibility. Icons include labelled text equivalents.' },
                { title: 'Large-text reflow', body: 'Layouts are tested at 150% and 200% font scaling. No content is clipped or overlapping at increased text sizes.' },
                { title: 'Glove-mode interaction design', body: 'All swipe gestures have equivalent tap-to-access alternatives. No functionality requires multi-finger gestures.' },
              ].map(a => (
                <div key={a.title} className="cs-card" style={{ borderLeft: '3px solid #1A2A6C' }}>
                  <div className="cs-card__title">{a.title}</div>
                  <div className="cs-card__body">{a.body}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── USABILITY TEST PLAN ──────────────────────────────── */}
          <section className="cs-section" id="testing">
            <h2 className="cs-section__title">Usability test plan</h2>
            <p className="cs-section__body">The following test plan outlines the methodology for a moderated usability study. This plan has not yet been executed — it represents the next phase of the project.</p>
            <h3 className="cs-section__subtitle">Test tasks</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={TABLE}>
                <thead>
                  <tr>
                    <th style={TH}>#</th><th style={TH}>Task description</th><th style={TH}>Success criteria</th><th style={TH}>Metric</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['T1', 'Open the app and find today\'s most urgent task', 'Opens correct task within 30 seconds', 'Time on task, error count'],
                    ['T2', 'Check in and complete the site checklist', 'All required items completed, check-in confirmed', 'Completion rate, hesitation points'],
                    ['T3', 'Capture 2 evidence photos and add captions', 'Photos attached with captions in under 60 seconds', 'Time on task, attach success rate'],
                    ['T4', 'Log 3 materials used with quantities', 'All 3 materials correctly logged to task record', 'Error rate, time on task'],
                    ['T5', 'Collect customer signature and complete task', 'Signature captured, task marked complete', 'Completion rate, drop-off points'],
                    ['T6', 'Locate the Sync Centre and identify one pending upload', 'Finds Sync Centre and identifies item without prompt', 'Findability score, time on task'],
                  ].map(([num, desc, success, metric]) => (
                    <tr key={num}>
                      <td style={{ ...TD, fontWeight: 700, color: 'var(--color-accent)' }}>{num}</td>
                      <td style={TD}>{desc}</td>
                      <td style={{ ...TD, color: '#166534' }}>{success}</td>
                      <td style={{ ...TD, color: 'var(--color-text-muted)' }}>{metric}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── EXPECTED IMPACT ──────────────────────────────────── */}
          <section className="cs-section" id="impact">
            <h2 className="cs-section__title">Expected impact</h2>
            <p className="cs-section__body">The outcomes below are projected hypotheses based on industry benchmarks and secondary research. They are not measured results — FieldFlow is a portfolio concept project.</p>
            <div className="snapshot-grid snapshot-grid--5" style={{ marginTop: 'var(--space-5)' }}>
              {[
                { metric: '40%', label: 'Reduction in task coordination phone calls', context: 'Structured status updates replace verbal check-ins' },
                { metric: '60%', label: 'Reduction in end-of-day paperwork time', context: 'Digital evidence and checklists replace manual notes' },
                { metric: '25%', label: 'Improvement in first-time task completion rate', context: 'Richer pre-task context reduces return visits' },
                { metric: '0', label: 'Task data loss events due to connectivity drop', context: 'Offline-first architecture eliminates connectivity-related loss' },
                { metric: '90%', label: 'Evidence capture compliance rate', context: 'In-app camera with task attachment removes manual filing' },
              ].map(m => (
                <div key={m.metric} className="cs-card" style={{ textAlign: 'center', borderTop: '3px solid var(--color-accent)' }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#1A2A6C', margin: '8px 0 6px' }}>{m.metric}</div>
                  <div className="cs-card__title" style={{ fontSize: 'var(--text-xs)' }}>{m.label}</div>
                  <div className="cs-card__body" style={{ fontSize: 'var(--text-xs)' }}>{m.context}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#A06400', background: '#FFFBEB', padding: '2px 8px', borderRadius: 20, display: 'inline-block', marginTop: 6 }}>EXPECTED</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SUCCESS METRICS ──────────────────────────────────── */}
          <section className="cs-section" id="success-metrics">
            <h2 className="cs-section__title">Success metrics</h2>
            <p className="cs-section__body">If FieldFlow were deployed to a live team, these metrics would form the measurement framework for the first 90 days.</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={TABLE}>
                <thead>
                  <tr>
                    <th style={TH}>Metric</th><th style={TH}>Target (90-day)</th><th style={TH}>How measured</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Daily active technicians', '≥ 80% of assigned field staff use app daily', 'App session analytics'],
                    ['Task completion rate', '≥ 95% of tasks completed digitally end-to-end', 'Task records with full evidence and sign-off'],
                    ['Offline usage proportion', '≥ 30% of task work completed in offline mode', 'Sync queue analysis — offline-originated records'],
                    ['Evidence capture rate', '≥ 90% of tasks include at least one photo', 'Photo attachment rate per closed task'],
                    ['System Usability Scale', '≥ 75 (Good) in first usability round', 'Post-session SUS questionnaire'],
                    ['Sync failure rate', '< 1% of offline records fail to sync', 'Sync Centre error log analysis'],
                  ].map(([metric, target, method]) => (
                    <tr key={metric}>
                      <td style={{ ...TD, fontWeight: 600, color: 'var(--color-text-primary)' }}>{metric}</td>
                      <td style={{ ...TD, color: '#166534', fontWeight: 600 }}>{target}</td>
                      <td style={{ ...TD, color: 'var(--color-text-muted)' }}>{method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── LIMITATIONS ──────────────────────────────────────── */}
          <section className="cs-section" id="limitations">
            <h2 className="cs-section__title">Limitations</h2>
            <p className="cs-section__body">Honest acknowledgement of what this project does and does not demonstrate.</p>
            <div className="cs-cards-grid" style={{ marginTop: 'var(--space-5)' }}>
              {[
                { title: 'No primary research', body: 'All personas, pain points, and assumptions are based on secondary research. User validation has not been conducted.' },
                { title: 'Mock data only', body: 'The prototype runs on hard-coded mock data. It does not connect to a real backend or live task management system.' },
                { title: 'Web prototype, not native app', body: 'This is a React web app, not an Android APK. Haptic feedback, system notifications, and background sync are simulated.' },
                { title: 'Simulated offline mode', body: 'Offline mode is toggled through a Zustand store. Real IndexedDB caching and service-worker-level network interruption are not implemented.' },
                { title: 'GPS and camera via browser', body: 'Geolocation and camera require browser permissions. Native deployment would use system APIs with more reliable access.' },
                { title: 'Untested at scale', body: 'Performance with large task lists (100+ items), long sync queues, or low-spec Android devices has not been tested.' },
              ].map(l => (
                <div key={l.title} className="cs-card" style={{ borderLeft: '3px solid #F44336', background: '#FFFBFB' }}>
                  <div className="cs-card__title" style={{ color: '#C62828' }}>{l.title}</div>
                  <div className="cs-card__body">{l.body}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FUTURE ROADMAP ───────────────────────────────────── */}
          <section className="cs-section" id="roadmap">
            <h2 className="cs-section__title">Future roadmap</h2>
            <p className="cs-section__body">Features and improvements prioritised for a production version of FieldFlow, sequenced by value and build complexity.</p>
            <div className="cs-cards-grid" style={{ marginTop: 'var(--space-5)' }}>
              {[
                { phase: 'P0 — Production foundation', items: ['Native Android APK with full offline support (IndexedDB + service workers)', 'Real backend API with task assignment engine', 'Push notification delivery via FCM'] },
                { phase: 'P1 — Core field features', items: ['Barcode / QR scan for parts log entry', 'Voice-to-text note dictation for hands-free capture', 'ETA sharing: estimated arrival time sent to customer SMS'] },
                { phase: 'P2 — Supervisor capabilities', items: ['Real-time team map with live technician locations', 'SLA breach alerts for overdue tasks', 'Shift handover summary auto-generated at day end'] },
                { phase: 'P3 — Intelligence layer', items: ['Predictive task duration from historical patterns', 'Auto-routing for multi-stop day optimisation', 'Customer satisfaction micro-survey post-task completion'] },
              ].map(phase => (
                <div key={phase.phase} className="cs-card">
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{phase.phase}</div>
                  {phase.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                      <span style={{ color: '#1A2A6C', fontWeight: 700, flexShrink: 0 }}>→</span><span>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* ── REFLECTION ───────────────────────────────────────── */}
          <section className="cs-section" id="reflection">
            <h2 className="cs-section__title">Reflection</h2>
            <p className="cs-section__body">
              FieldFlow was the most technically constrained design project I have worked on, and the constraints were the most useful part of the process. Designing for offline-first meant I could not defer the hard questions about data architecture and state management to a backend engineer. I had to understand what needed to be stored locally, what could be deferred, and how conflicts would be resolved when connectivity returned — because those decisions directly shaped what the UI could promise users. That forced me to think like a product designer rather than just a screen designer.
            </p>
            <p className="cs-section__body">
              Working without primary research was a real limitation, and I wanted to be honest about it throughout this case study. The personas, pain points, and assumptions are educated inferences from secondary sources, not validated observations. In a real product engagement, I would have spent the first two weeks doing contextual inquiry in the field — riding along with technicians, watching how they actually use their phones on site, noting the workarounds they have built around inadequate tools.
            </p>
            <p className="cs-section__body">
              The prototype implementation taught me to respect the gap between a Figma screen and a working interaction. Patterns that looked clean in the design — the offline banner appearing and dismissing, the signature pad canvas, the sync queue animations — required careful thought about state, timing, and fallback behaviour to feel right in code. The result is a prototype I can actually hand to someone on a phone and say: try it. That tangibility matters.
            </p>
            <p className="cs-section__body">
              If I were to take FieldFlow further, my first priority would be field research — not to validate the interface, but to understand whether I have framed the problem correctly. The greatest risk in a concept project is building a polished solution to a problem that field technicians have already solved in ways I did not imagine. The prototype is a starting point for that conversation, not a conclusion.
            </p>
          </section>

        </main>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="cs-cta">
        <h2 className="cs-cta__title">See it working in your browser.</h2>
        <p className="cs-cta__sub">The full FieldFlow prototype is interactive. Open it on a mobile device or resize your browser to 390px for the full experience. Demo: FF-1042 / demo123</p>
        <div className="cs-cta__actions">
          <Button href="/field-flow" size="lg">View Interactive Prototype →</Button>
          <Button href="/" variant="ghost" size="lg">Back to Portfolio</Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
