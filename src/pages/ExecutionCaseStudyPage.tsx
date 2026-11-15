import { useEffect, useState, type ReactNode } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import NextProject from '../components/case-study/NextProject';
import {
  Bullets, CaseHero, CaseShell, Cards3, Grid4, Layered, Panel, Sec, Stats, Timeline, type Section,
} from '../components/pulse/PulseKit';
import { ScreenShowcase } from '../components/pulse/PulseInteractive';
import {
  appUrl, componentMap, decisions, eeImages as im, executionSteps, galleryUrl, limits, nextSteps, rules, stepStates,
} from '../data/executionCaseStudy';

const sections: Section[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'work', label: 'The work' },
  { id: 'decisions', label: 'Design decisions' },
  { id: 'recording', label: 'Recording and signing' },
  { id: 'exceptions', label: 'Verification and exceptions' },
  { id: 'ai', label: 'The AI agent' },
  { id: 'oversight', label: 'Oversight' },
  { id: 'system', label: 'Built on PULSE' },
  { id: 'limits', label: 'Limits and next steps' },
];

/** A small scrollable table in the page's style. */
function Table({ label, head, rows }: { label: string; head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="pk-table" role="region" aria-label={`${label}, scrollable`} tabIndex={0}>
      <table>
        <caption className="sr-only">{label}</caption>
        <thead><tr>{head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ExecutionCaseStudyPage() {
  const [minutes, setMinutes] = useState<number | null>(null);
  useEffect(() => {
    const words = (document.querySelector('.pk-main')?.textContent ?? '').trim().split(/\s+/).filter(Boolean).length;
    setMinutes(words ? Math.max(1, Math.round(words / 220)) : null);
  }, []);

  return (
    <>
      <Header />
      <main className="pk">
        <CaseHero
          kicker="Case study · Regulated software"
          minutes={minutes}
          title="Electronic execution: running a validation protocol on screen"
          summary="In regulated life-science work, a test protocol is carried out step by step, and every step has to be recorded, signed and checked by someone else. I took a prototype of that experience and rebuilt it, with every function working, from the PULSE design system."
          meta={[
            { k: 'Role', v: 'Senior UX Designer' },
            { k: 'Year', v: '2026' },
            { k: 'Built with', v: 'PULSE components, React, TypeScript' },
            { k: 'Focus', v: 'Execution, e-signature, review' },
          ]}
          actions={
            <>
              <a className="btn-c" href={appUrl} target="_blank" rel="noopener noreferrer">Open the working app</a>
              <a className="btn-c btn-c--ghost" href={galleryUrl} target="_blank" rel="noopener noreferrer">Component gallery</a>
            </>
          }
        />

        <CaseShell
          sections={sections}
          side={[
            { k: 'Role', v: 'Senior UX Designer' },
            { k: 'Starting point', v: 'A single-file HTML prototype of the experience' },
            { k: 'Status', v: 'Working prototype, not a validated system' },
          ]}
        >
          {/* 01 */}
          <Sec
            id="overview" n={1} label="Overview" title="Doing the work and proving it, on one screen"
            intro={
              <>
                <p>
                  A validation protocol is a document of numbered steps. Someone performs each step, writes down what happened, says whether it passed and
                  attaches evidence. In regulated work that record has to be attributable, dated and checked, so the interface carries as much weight as the
                  work itself.
                </p>
                <p>
                  The brief was to carry the whole experience over to our own design system: not a picture of it, but an app where recording, signing,
                  verifying, raising a discrepancy and reviewing all work, and where the rules are enforced in the logic, not only drawn.
                </p>
              </>
            }
          >
            <Cards3 cards={[
              { icon: 'search', title: 'The problem', items: ['Steps, results, evidence and signatures live in different places', 'A mistake caught late means redoing the step', 'Reviewers need the trail, not just the answer'] },
              { icon: 'layers', title: 'What I built', items: ['One screen: the protocol and the step in hand', 'Recording, e-signature, verification and discrepancies', 'Status, metrics, audit trail, split and an AI assistant'] },
              { icon: 'check', title: 'Where it stands', items: ['Every function works end to end', 'Built only from PULSE components', 'A prototype: not validated, not tested with users'] },
            ]} />
            <Panel slot={im.execution!} />
          </Sec>

          {/* 02 */}
          <Sec id="work" n={2} label="The work" title="What carrying out a protocol involves" intro={<p>I read the original prototype end to end and wrote down every function before drawing anything. The job reduces to six moments, and each one has a rule behind it.</p>}>
            <Timeline steps={executionSteps} />
            <h3 className="pk-h3">The life of one step</h3>
            <p className="pk-p">A step is always in exactly one state, and what you can do depends on which.</p>
            <Grid4 items={stepStates.map(s => ({ title: s.state, body: s.body }))} />
          </Sec>

          {/* 03 */}
          <Sec id="decisions" n={3} label="Design decisions" title="Six decisions that shape the screen" intro={<p>Most of the interface follows from a few choices about what must be hard to get wrong.</p>}>
            <Layered rows={decisions.map((d, i) => ({ step: String(i + 1).padStart(2, '0'), kicker: 'Decision', title: d.title, body: d.body }))} />
          </Sec>

          {/* 04 */}
          <Sec id="recording" n={4} label="Recording and signing" title="Recording a step is a signed statement" intro={<p>Pressing Record checks the step first. Anything missing is listed in place: no result, no verdict, or evidence the step requires. Only then does the e-signature open, with the signer and time at the top, then the reason, credentials and an explicit accept.</p>}>
            <Panel slot={im.sign!} />
            <Bullets items={[
              'Control steps use a checkbox, radio or dropdown, and the result is derived from the choice, so it cannot disagree with it.',
              'Marking a step N/A asks for a justification and its own signature.',
              'Editing a recorded step asks for a reason, creates a new version and keeps the old one in the step’s history.',
              'Moving to another step with unsaved changes opens a guard: discard, save as a draft, or stay.',
            ]} />
            <h3 className="pk-h3">Rules the logic enforces</h3>
            <p className="pk-p">These live in the state logic, and the app carries a self-check that exercises them. I ran it and every check passed (25 checks).</p>
            <Table label="Rules the app enforces and why" head={['Rule', 'Why']} rows={rules.map(r => [r.rule, r.why])} />
          </Sec>

          {/* 05 */}
          <Sec id="exceptions" n={5} label="Verification and exceptions" title="A second person checks, and a failure is never quiet" intro={<p>Each table is verified by someone other than the person who recorded it, once every step in it is recorded. If a step fails, the prompt that follows asks for a discrepancy, and the discrepancy has its own life.</p>}>
            <Panel slot={im.discrepancy!} />
            <Bullets items={[
              'A discrepancy moves from under assessment to pending review to closed. Terminating or making one obsolete needs a comment.',
              'Verification can be assigned per table, and the screen warns when the chosen verifier also recorded steps there.',
              'A later table can be gated behind the verification of an earlier one, and the lock is shown on the table.',
            ]} />
          </Sec>

          {/* 06 */}
          <Sec id="ai" n={6} label="The AI agent" title="The assistant proposes, the person records" intro={<p>The original prototype had an agent that fills in steps. I kept the idea and set one rule in the design: the assistant never signs. Its output is a draft, with a name and a colour of its own, until the executor reviews it and records it.</p>}>
            <Panel slot={im.ai!} />
            <Bullets items={[
              'The banner says it plainly: the result is a draft you must review and record.',
              'Each proposal shows the expected result beside the proposed one, and a mismatch is called out in red.',
              'Recording an AI-filled step is the executor’s action, and the signature reads “AI-assisted result accepted”.',
              'It still respects the rules: steps in a gated table are skipped, and a Fail still prompts a discrepancy.',
            ]} />
            <p className="pk-p">The output is scripted sample data and the panel is labelled as such. The point of this build is the interaction and the accountability, not the model.</p>
          </Sec>

          {/* 07 */}
          <Sec id="oversight" n={7} label="Oversight" title="The same picture for the executor and the reviewer" intro={<p>Status, metrics, the audit trail and the split plan sit one step away from the work, so the person running the protocol sees what a reviewer will.</p>}>
            <ScreenShowcase screens={[
              { name: 'Execution status', slot: im.status! },
              { name: 'Metrics', slot: im.metrics! },
              { name: 'Audit trail', slot: im.audit! },
              { name: 'Split execution', slot: im.split! },
            ]} />
            <Bullets items={[
              'Every action appends an audit entry: time, user, role, action and target, and the reason where one was given.',
              'Spectators follow a run read-only, and no write action is accepted from them.',
              'Split execution gives tables or rows to different executors, and rejects overlaps with a message that says which rule was broken.',
            ]} />
          </Sec>

          {/* 08 */}
          <Sec id="system" n={8} label="Built on PULSE" title="Built from the system, and only from the system" intro={<p>The point of building this on PULSE was to find out whether a product this dense can be assembled from the library without reaching around it. Mostly it can. Where it could not, the gap went into the library as a component, not into the page. The screen itself was matched to the real product design, measured region by region against a screenshot, with generic names and roles in place of the product’s own.</p>}>
            <Stats items={[
              { v: 21, l: 'PULSE components used directly' },
              { v: 57, l: 'files in the app' },
              { v: 52, l: 'store actions and selectors' },
              { v: 25, l: 'rule checks, all passing' },
            ]} />
            <Table label="What each need uses" head={['Need', 'Component']} rows={componentMap.map(c => [c.need, c.component])} />
            <h3 className="pk-h3">What the system lacked</h3>
            <Bullets items={[
              'The library’s dialog title is 24px, and this product’s small confirmations use 14px. I added a CompactDialog and a compact mode on the e-signature, instead of overriding sizes on the page.',
              'Side panels, a full-screen gallery and a slide-over had no component, so I built SideSurface, FullScreenSurface and SlidePanel, each with a demo.',
              'A rich-text editor dense enough for a 420px panel, a document card, and a small set of chrome components for the status bar and toolbar were also built, from PULSE tokens.',
              'The rule held throughout: when a page needed something the library did not have, I changed the library and logged the difference.',
            ]} />
          </Sec>

          {/* 09 */}
          <Sec id="limits" n={9} label="Limits and next steps" title="What this is, and what it is not" intro={<p>This is a working prototype of the interface and its rules. It is easy to overstate, so here is what it does not do.</p>}>
            <Cards3 cards={[
              { icon: 'cross', title: 'Limits', items: limits.slice(0, 3) },
              { icon: 'cross', title: 'Not built yet', items: limits.slice(3, 6) },
              { icon: 'arrow', title: 'What I would do next', items: nextSteps.slice(0, 3) },
            ]} />
            <Bullets items={[limits[6] ?? '', nextSteps[3] ?? '']} />
          </Sec>
        </CaseShell>
      </main>
      <NextProject />
      <Footer />
    </>
  );
}
