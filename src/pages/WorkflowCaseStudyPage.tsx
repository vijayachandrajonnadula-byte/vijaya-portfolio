import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import NextProject from '../components/case-study/NextProject';
import CaseStudyHero from '../components/case-study/CaseStudyHero';
import CaseStudyNav from '../components/case-study/CaseStudyNav';
import Button from '../components/ui/Button';
import { Fold } from '../components/audit/AuditBlocks';
import { workflowCaseStudy as cs, type WfPhase } from '../data/workflowCaseStudy';
import '../styles/audit-workflow.css';

const groups = [
  { id: 'group-frame', title: 'Frame and design', blurb: 'Problem framing and layout exploration before any code.', range: [0, 2] },
  { id: 'group-setup', title: 'Set up the repo and agents', blurb: 'Scaffold, AI agent sessions, and file structure.', range: [2, 5] },
  { id: 'group-review', title: 'Branch, review, and merge', blurb: 'Feature branches, PRs, build checks, and conflicts.', range: [5, 9] },
  { id: 'group-ship', title: 'Preview, QA, and ship', blurb: 'Local preview, responsive checks, Vercel, and handoff.', range: [9, 13] },
];

const wfNavItems = [
  { id: 'snapshot', label: 'Project snapshot' },
  { id: 'catches', label: 'Three concrete catches' },
  { id: 'overview', label: 'Overview' },
  { id: 'why', label: 'Why document this?' },
  ...groups.map(g => ({ id: g.id, label: g.title })),
  { id: 'what-worked', label: 'What worked well' },
  { id: 'what-id-change', label: "What I'd change" },
  { id: 'details', label: 'Details' },
  { id: 'reflection', label: 'Reflection' },
];

function Phase({ phase }: { phase: WfPhase }) {
  return (
    <div className="af-phase" id={`phase-${phase.id}`}>
      <div className="wf-phase-header">
        <div className="wf-phase-num">{phase.num}</div>
        <div className="wf-phase-header__right">
          <h3 className="af-phase__title">{phase.title}</h3>
          <div className="wf-human-led-badge">
            <span className="wf-human-led-badge__label">Human-led:</span>
            <span className="wf-human-led-badge__value">{phase.humanLed}</span>
          </div>
        </div>
      </div>

      <p className="cs-section__body cs-section__body--mb">{phase.description}</p>

      {phase.activities && (
        <ul className="wf-activities">
          {phase.activities.map(a => (
            <li key={a} className="wf-activities__item">
              <span className="wf-activities__dot" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      )}

      {phase.commands && (
        <div className="wf-command-block">
          <div className="wf-command-block__bar">
            <span className="wf-command-block__dot" />
            <span className="wf-command-block__dot" />
            <span className="wf-command-block__dot" />
            <span className="wf-command-block__label">Terminal</span>
          </div>
          <pre className="wf-command-block__body af-region" tabIndex={0} role="region" aria-label={`Command block: ${phase.title}`}>
            {phase.commands.map((cmd, i) => (
              <div key={i} className={`wf-command-line${cmd.startsWith('#') ? ' wf-command-line--comment' : ''}`}>
                {!cmd.startsWith('#') && cmd.trim() !== '' && <span className="wf-command-prompt">$ </span>}
                {cmd}
              </div>
            ))}
          </pre>
        </div>
      )}

      {phase.fileTree && (
        <div className="wf-file-tree">
          <div className="wf-file-tree__label">Project file structure</div>
          <pre className="wf-file-tree__body af-region" tabIndex={0} role="region" aria-label={`File tree: ${phase.title}`}>{phase.fileTree}</pre>
        </div>
      )}

      {phase.prChecklist && (
        <div className="wf-pr-checklist">
          <div className="wf-pr-checklist__title">Pre-merge checklist (what I check before merging)</div>
          {phase.prChecklist.map(item => (
            <div key={item} className="wf-pr-item">
              <span className="wf-pr-item__check" aria-hidden="true">&#x2022;</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {phase.ciCards && (
        <div className="wf-ci-cards">
          {phase.ciCards.map(card => (
            <div key={card.label} className={`wf-ci-card wf-ci-card--${card.status}`}>
              <div className="wf-ci-card__header">
                <span className={`wf-ci-badge wf-ci-badge--${card.status}`}>
                  {card.status === 'pass' ? '✓ PASS' : '✗ FAIL'}
                </span>
                <span className="wf-ci-card__label">{card.label}</span>
              </div>
              <div className="wf-ci-card__issue">{card.issue}</div>
              <div className="wf-ci-card__fix">{card.fix}</div>
            </div>
          ))}
        </div>
      )}

      {phase.breakpoints && (
        <div className="wf-breakpoints">
          <div className="wf-breakpoints__title">Breakpoints I check</div>
          <div className="wf-bp-table">
            {phase.breakpoints.map(bp => (
              <div key={bp.width} className="wf-bp-row">
                <div className="wf-bp-row__width">{bp.width}</div>
                <div className="wf-bp-row__label">{bp.label}</div>
                <div className="wf-bp-row__notes">{bp.notes}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkflowCaseStudyPage() {
  return (
    <>
      <Header />
      <main className="case-study-page af-page af-workflow">
        <CaseStudyHero
          title={cs.title}
          subtitle={cs.subtitle}
          tags={cs.tags}
          prototypeUrl=""
          githubUrl="https://github.com/vijayachandrajonnadula-byte"
          heroImageAlt="AI-assisted product build workflow process showcase"
          statusLabel="Process write-up"
          myPart="I set up and ran this workflow on both portfolio builds: scoping every AI session, reviewing every output, running the build checks, and handling the Vercel deploy."
          outcome="Three concrete problems the process caught are below. This documents how I worked, not a benchmark of the tools."
        />

        <div className="cs-layout">
          <CaseStudyNav items={wfNavItems} />
          <div className="cs-content">

            <section className="cs-section" id="snapshot">
              <h2 className="cs-section__title">Project snapshot</h2>
              <div className="snapshot-grid snapshot-grid--5">
                {[
                  { label: 'Role', value: cs.snapshot.role },
                  { label: 'Scope', value: cs.snapshot.timeline },
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

            <section className="cs-section" id="catches">
              <h2 className="cs-section__title">Three concrete catches</h2>
              <p className="cs-section__body">What the workflow caught before it reached a visitor. Each one is documented in the phases below.</p>
              <div className="cs-cards-grid">
                {cs.catches.map((c, i) => (
                  <div key={c.title} className="cs-card">
                    <div className="cs-card__number">{String(i + 1).padStart(2, '0')}</div>
                    <div className="cs-card__title">{c.title}</div>
                    <p className="cs-card__body">{c.body}</p>
                    <p className="af-catch__where">{c.phase}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="cs-section" id="overview">
              <h2 className="cs-section__title">Overview</h2>
              <p className="cs-section__body">{cs.overview}</p>
            </section>

            <section className="cs-section" id="why">
              <h2 className="cs-section__title">Why document this workflow?</h2>
              <p className="cs-section__body">{cs.whyDocument}</p>
              <div className="wf-why-callout">
                <div className="wf-why-callout__icon" aria-hidden="true">&rarr;</div>
                <p className="wf-why-callout__text">This is not a how-to guide for AI tools. It is a record of how I used them on real projects and what I had to think about.</p>
              </div>
            </section>

            <section className="cs-section af-phases" id="workflow">
              <h2 className="cs-section__title">The workflow in 13 phases</h2>
              <p className="cs-section__body">Grouped into four stages. Open a stage to read its phases; the tools involved are shown once per stage.</p>
              {groups.map(g => {
                const phases = cs.phases.slice(g.range[0], g.range[1]);
                const tools = Array.from(new Set(phases.flatMap(p => p.tools)));
                return (
                  <div key={g.id} id={g.id}>
                    <Fold title={g.title} count={`Phases ${phases[0].num} to ${phases[phases.length - 1].num}`}>
                      <p className="cs-section__body">{g.blurb}</p>
                      <div className="af-group-tools" aria-label={`Tools in this stage: ${tools.join(', ')}`}>
                        {tools.map(t => <span key={t} className="wf-tool-pill wf-tool-pill--sm">{t}</span>)}
                      </div>
                      {phases.map(p => <Phase key={p.id} phase={p} />)}
                    </Fold>
                  </div>
                );
              })}
            </section>

            <section className="cs-section" id="what-worked">
              <h2 className="cs-section__title">What worked well</h2>
              <div className="wf-lessons-grid">
                {cs.whatWorked.map(l => (
                  <div key={l.title} className="wf-lesson-card wf-lesson-card--positive">
                    <div className="wf-lesson-card__icon" aria-hidden="true">+</div>
                    <div className="wf-lesson-card__title">{l.title}</div>
                    <p className="wf-lesson-card__body">{l.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="cs-section" id="what-id-change">
              <h2 className="cs-section__title">What I'd do differently</h2>
              <div className="wf-lessons-grid">
                {cs.whatIdChange.map(l => (
                  <div key={l.title} className="wf-lesson-card wf-lesson-card--improve">
                    <div className="wf-lesson-card__icon" aria-hidden="true">&uarr;</div>
                    <div className="wf-lesson-card__title">{l.title}</div>
                    <p className="wf-lesson-card__body">{l.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="cs-section" id="details">
              <h2 className="cs-section__title">Details</h2>
              <p className="cs-section__body">Reference material, folded so the story above reads quickly.</p>

              <Fold title="What this demonstrates" count={`${cs.demonstrates.length} points`}>
                <ul className="af-list">
                  {cs.demonstrates.map(d => (
                    <li key={d.title} className="af-list__item"><span className="af-mark af-mark--dot" aria-hidden="true" /><span><strong>{d.title}.</strong> {d.body}</span></li>
                  ))}
                </ul>
              </Fold>

              <Fold title="Tool stack" count={`${cs.toolStack.length} categories`}>
                <p className="cs-section__body">Each tool category had a defined role. Tools were selected for what they accelerate, not for breadth.</p>
                <div className="wf-tool-stack-grid">
                  {cs.toolStack.map(cat => (
                    <div key={cat.category} className="wf-tool-category">
                      <div className="wf-tool-category__name">{cat.category}</div>
                      <div className="wf-tool-category__pills">
                        {cat.tools.map(t => <span key={t} className="wf-tool-pill">{t}</span>)}
                      </div>
                      <p className="wf-tool-category__purpose">{cat.purpose}</p>
                    </div>
                  ))}
                </div>
              </Fold>

              <Fold title="Tech stack" count={`${cs.techStack.length} items`}>
                <div className="cs-tech-stack">
                  {cs.techStack.map(item => (
                    <div key={item.label} className="cs-tech-stack__row">
                      <span className="cs-tech-stack__label">{item.label}</span>
                      <span className="cs-tech-stack__value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Fold>
            </section>

            <section className="cs-section" id="reflection">
              <h2 className="cs-section__title">Reflection</h2>
              <p className="cs-section__body">{cs.reflection}</p>

              <div className="cs-cta-section">
                <h3 className="cs-cta-section__title">See the prototypes this workflow produced</h3>
                <p className="cs-cta-section__body">Both case studies document the design decisions behind each project. The live prototypes are deployed and ready to try.</p>
                <div className="cs-cta-section__actions">
                  <Button href="/projects/riverside-general">Riverside General case study</Button>
                  <Button href="/projects/renewly" variant="ghost">Renewly case study</Button>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      <NextProject />
      <Footer />
    </>
  );
}
