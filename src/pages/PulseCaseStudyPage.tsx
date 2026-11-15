import { useEffect, useState, type ReactNode } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import NextProject from '../components/case-study/NextProject';
import {
  Bullets, CaseHero, CaseShell, Cards3, Grid4, Layered, Panel, Sec, Stats, Timeline, type Section,
} from '../components/pulse/PulseKit';
import {
  AssistantCompare, AtomicBuilder, CodePanel, ControlsPlayground, FlowDiagram, IntentChooser, LayersDiagram, ScreenHotspots, ScreenShowcase,
  TabCompare, TokenExplorer,
} from '../components/pulse/PulseInteractive';
import metrics from '../data/pulse-metrics.json';
import { pulseImages as im } from '../data/pulseImages';
import {
  aiLayers, findings, galleryUrl, guards, intentExample, limits, nextSteps, shellPanels, storybookUrl,
} from '../data/pulseCaseStudy';

/** The sections, in order. The ids drive the side navigation. */
const sections: Section[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'The problem' },
  { id: 'audit', label: 'What I found' },
  { id: 'approach', label: 'Approach' },
  { id: 'components', label: 'Components' },
  { id: 'storybook', label: 'Storybook' },
  { id: 'templates', label: 'Micro templates' },
  { id: 'decisions', label: 'Decision layer' },
  { id: 'rules', label: 'Rules and governance' },
  { id: 'product', label: 'In the product' },
  { id: 'results', label: 'Results and reflection' },
];

const n = (v: number) => v.toLocaleString('en-US');

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

export default function PulseCaseStudyPage() {
  const { code, ai, figma } = metrics;
  const bc = code.byCategory as Record<string, number>;
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
          kicker="Case study · Design system"
          minutes={minutes}
          title="PULSE: making a design system an AI can actually use"
          summary="PULSE is the design system behind enterprise software for life-science teams. It lived in Figma, and nothing a machine could read. After I joined, I made it AI-readable, so product screens can be built faster and stay on-system."
          meta={[
            { k: 'Role', v: 'Senior UX Designer' },
            { k: 'Year', v: '2026 to now' },
            { k: 'Platform', v: 'Figma, React, MUI, Storybook' },
            { k: 'Focus', v: 'AI-readable design systems' },
          ]}
          actions={
            <>
              <a className="btn-c" href={storybookUrl} target="_blank" rel="noopener noreferrer">Open the Storybook</a>
              <a className="btn-c btn-c--ghost" href={galleryUrl} target="_blank" rel="noopener noreferrer">Component gallery</a>
            </>
          }
        />

        <CaseShell
          sections={sections}
          side={[
            { k: 'Role', v: 'Senior UX Designer, joined 2026' },
            { k: 'Built with', v: 'A developer, on the React components and the AI layer' },
            { k: 'Status', v: 'Shipped, and used to build product screens' },
          ]}
        >
          {/* 01 */}
          <Sec
            id="overview" n={1} label="Overview" title="A design system that people and AI assistants can both build with"
            intro={
              <>
                <p>
                  PULSE already had a Figma library and product teams building on it. What it lacked was anything a machine could read: no list of
                  components, no record of which one fits which job, no written rules. An AI assistant given a screenshot could only guess.
                </p>
                <p>
                  When I joined as Senior UX Designer, I made the system readable. I did not redesign it. I built the missing layers around it.
                </p>
              </>
            }
          >
            <Cards3 cards={[
              { icon: 'search', title: 'The problem', items: ['A Figma library no program could read', 'No rule for which component fits which job', 'Assistants guessed, and plausible guesses are costly in regulated software'] },
              { icon: 'layers', title: 'What I did', items: ['React components built from the Figma spec', 'Micro templates for repeating page regions', 'Rules in markdown, a decision layer and governance'] },
              { icon: 'check', title: 'Where it stands', items: ['Screens built this way have shipped', 'The team builds with the library', 'Every difference from Figma is on record'] },
            ]} />
            <Stats items={[
              { v: code.components, l: 'components' },
              { v: code.stories, l: 'Storybook stories' },
              { v: ai.intents, l: 'intents mapping a job to a component' },
              { v: n(figma.variants), l: 'Figma variants behind them' },
            ]} />
          </Sec>

          {/* 02 */}
          <Sec
            id="problem" n={2} label="The problem" title="An assistant can’t use what it can’t read"
            intro={
              <p>
                Hand an assistant a screenshot and a library with nothing written about it, and it picks plausible parts. It reaches for a chip where a
                status belongs, guesses the spacing, and imports the UI library straight into the page. Each choice looks fine on its own, and the screen
                drifts from the design. Use the switch to see what changes when the assistant has something to read.
              </p>
            }
          >
            <AssistantCompare intents={ai.intents} templates={shellPanels.length} />
            <Grid4 items={[
              { title: 'Readable', body: 'Every component, prop and default exists in a form a machine can read, not only in a Figma file.' },
              { title: 'Correct', body: 'What the code does matches what the file says, state by state, and any difference is on record.' },
              { title: 'Governed', body: 'Someone owns the rules, and a change has a path that does not depend on memory.' },
              { title: 'Used', body: 'Product screens are built from it. A readable system nobody builds with is only a document.' },
            ]} />
          </Sec>

          {/* 03 */}
          <Sec id="audit" n={3} label="What I found" title="I read the system closely before building anything" intro={<p>I compared the Figma file, the published tokens and the live product side by side. They disagreed in places, which is normal for a system that has been in use for years. Each disagreement became a decision about which source wins.</p>}>
            <Cards3 cards={[
              { icon: 'search', title: 'How I checked', items: ['Compared extracted values with the live product', 'Treated every mismatch as evidence', 'Wrote down what wins when sources disagree'] },
              { icon: 'layers', title: 'What turned up', items: ['State values that looked swapped', 'Published tokens older than the file', 'Details the export could not see'] },
              { icon: 'unlock', title: 'What it changed', items: ['The Figma file wins over older tokens', 'A value that looks backwards is checked against the product', 'Each fix became a written rule'] },
            ]} />
            <Table label="Findings from comparing the source with the live product" head={['Finding', 'The source says', 'In reality', 'Response']} rows={findings.map(f => [f.title, f.source, f.reality, f.response])} />
          </Sec>

          {/* 04 */}
          <Sec id="approach" n={4} label="Approach" title="Six moves, from a Figma-only system to one an assistant can read" intro={<p>Some ran in sequence and some in parallel. The last two are still going. Together they form the layers below, which an assistant reads before it builds anything.</p>}>
            <Timeline steps={[
              { title: 'Read and verify', body: `I started from the Figma file: ${figma.componentPages} component pages and ${n(figma.variables)} variables. It was a strong source, but nothing else about the system was written down for a machine.` },
              { title: 'Turn the file into specs', body: 'I extracted sizes, spacing, colour and text style for every variant into data a program can read. Nothing is typed from memory, and the build runs offline.' },
              { title: 'Build the components', body: `With a developer: ${code.components} React components, each built from its spec, each with a demo of every variant and state, and a Storybook story for each.` },
              { title: 'Write the micro templates', body: `An app shell and ${shellPanels.length - 1} panels for the regions every enterprise page repeats, so a page is assembled, not invented.` },
              { title: 'Write the rules and the decision layer', body: `Rules in markdown, ${ai.intents} intents that map a job on the screen to a component, and five page recipes.`, tag: 'Ongoing' },
              { title: 'Add governance and bring it into the product', body: 'Checks that fail the build, a log of every difference from Figma, and product pages that import the library and nothing else.', tag: 'Ongoing' },
            ]} />
            <h3 className="pk-h3">The five layers an assistant reads</h3>
            <p className="pk-p">Pick a layer to see what it holds.</p>
            <LayersDiagram layers={aiLayers} />
          </Sec>

          {/* 05 */}
          <Sec id="components" n={5} label="Components" title={`${code.components} components, built to match the file`} intro={<p>The components mirror the Figma file: same sizes, same states, same names. They are built in React on MUI 9, in {code.categories} categories. Read against atomic design, they fall into four levels, from the smallest parts to whole page regions (this grouping is mine; the code keeps the categories).</p>}>
            <AtomicBuilder counts={{ atoms: bc.foundations + bc.actions, molecules: bc.form + bc.feedback, organisms: bc['data-display'] + bc.navigation + bc.containers + bc.documents, templates: bc.patterns }} />
            <h3 className="pk-h3">Everything comes from variables</h3>
            <p className="pk-p">Type, spacing and colour already came from variables in Figma, so I kept them and made them reachable from code. Nothing in a component is typed by hand when a variable exists. If a value has no variable, the variable changes, not the component.</p>
            <TokenExplorer />
            <Stats items={[
              { v: n(code.icons), l: 'icons from Figma vectors' },
              { v: n(code.symbols), l: 'domain symbols: equipment, instruments, flags' },
              { v: code.fontWeightRoles, l: 'named font-weight roles' },
              { v: figma.componentSets, l: 'Figma component sets' },
            ]} />
          </Sec>

          {/* 06 */}
          <Sec id="storybook" n={6} label="Storybook" title="Every state of every component, in one place" intro={<p>A component library nobody can browse does not get used. {code.stories} Storybook stories carry the demos, generated from the components so the catalogue cannot go stale. A designer compares default, hover, focus, disabled and error against the Figma variant, and a developer copies the props they need.</p>}>
            <Bullets items={[
              <><a className="pk-link" href={storybookUrl} target="_blank" rel="noopener noreferrer">Open the Storybook</a>, the real library running.</>,
              <>The lighter <a className="pk-link" href={galleryUrl} target="_blank" rel="noopener noreferrer">component gallery</a> shows one demo at a time.</>,
            ]} />
            <h3 className="pk-h3">Try the controls</h3>
            <p className="pk-p">This is the idea behind the Storybook controls, shown with a button.</p>
            <ControlsPlayground />
            <Panel slot={im.buttonStory} />
            <Panel slot={im.datagrid} />
          </Sec>

          {/* 07 */}
          <Sec id="templates" n={7} label="Micro templates" title="Micro templates for the regions every page repeats" intro={<p>Components alone still leave an assistant to invent the page around them. Figma’s template page was empty, so I pulled the repeating regions out of the product app’s own page structure into a small set of templates: an app shell and {shellPanels.length - 1} panels.</p>}>
            <Grid4 items={shellPanels.map(p => ({ title: p.name, body: p.job }))} />
            <Bullets items={[
              <>The page body owns the scroll region; the header and footer panels stay fixed.</>,
              <>Templates import nothing from the underlying UI library. A lint rule enforces it.</>,
              <>They are marked <strong>not from Figma</strong> in the code and in the deviations log, because Figma has no template page for them.</>,
            ]} />
          </Sec>

          {/* 08 */}
          <Sec id="decisions" n={8} label="Decision layer" title="A map from a job on the screen to the component to use" intro={<p>A component list says what exists. It does not say what to use for a job. I wrote {ai.intents} intents by hand, naming {ai.intentComponentsNamed} components between them, plus five page recipes. The value is in the traps: parts that look alike but mean different things. Choose what is on the screen to see the answer.</p>}>
            <IntentChooser />
            <h3 className="pk-h3">How an assistant uses it</h3>
            <FlowDiagram />
            <h3 className="pk-h3">Five page recipes</h3>
            <Layered rows={[
              { step: '01', kicker: 'Recipe', title: 'List page', body: 'Shell, context bar, list header with tools and a primary action, tabs with status filters, then a region holding the data grid.' },
              { step: '02', kicker: 'Recipe', title: 'Wizard or create flow', body: 'Stepper header, a body of sections with fields, and footer actions with back and next.' },
              { step: '03', kicker: 'Recipe', title: 'Detail with a side panel', body: 'A list page plus a flyout for view and edit, a modal for confirmations, a snackbar for success.' },
              { step: '04', kicker: 'Recipe', title: 'Form section', body: 'A section holding a grid of fields, with choices grouped and hints and validation on the field itself.' },
              { step: '05', kicker: 'Recipe', title: 'Dashboard', body: 'KPI cards, charts with legends, trend lines in table cells and an empty state for empty widgets.' },
            ]} />
            <h3 className="pk-h3">What one intent looks like</h3>
            <pre className="pk-code" tabIndex={0} aria-label="Example intent"><code>{intentExample}</code></pre>
          </Sec>

          {/* 09 */}
          <Sec id="rules" n={9} label="Rules and governance" title="Rules written down, and checks that fail the build" intro={<p>A rule that lives in someone’s head, or only in a document, gets ignored. So I wrote the rules in files an assistant reads before it acts, and put a check behind each important one. Governance is what keeps all of it true as the system changes.</p>}>
            <Table label="The markdown files and what each one is for" head={['File', 'What it is for']} rows={[
              ['CLAUDE.md', 'The rules that never bend: Figma is the source of truth, never invent a value, pages use only system components, fix the component not the page, log every difference.'],
              ['The build-from-design procedure', 'How to turn a screenshot, a request or a Figma frame into a screen: split into regions, match cues to intents, read the contract, compose.'],
              ['The AI index and page recipes', 'A readable index of every component and the five page recipes, region by region.'],
              ['The component conventions and usage guide', 'How a component is built, how Figma states map to code, and what every demo must show.'],
              ['The deviations log', `Every place the code differs from Figma, with the Figma value, the reason and who asked (${ai.deviationsLogged} entries).`],
            ]} />
            <h3 className="pk-h3">The checks behind the rules</h3>
            <Layered rows={guards.map((g, i) => ({ step: String(i + 1).padStart(2, '0'), kicker: 'Check', title: g.title, body: g.body }))} />
            <h3 className="pk-h3">How a change travels</h3>
            <Timeline steps={[
              { title: 'A screen looks wrong', body: 'Someone compares a built page with Figma or the live product and spots a difference.' },
              { title: 'Fix the component, not the page', body: 'The cause is a wrong component, so the fix goes into the library and every screen that uses it is fixed.' },
              { title: 'Log it', body: 'The difference goes in the deviations log with the Figma value beside it and the reason.' },
              { title: 'Write the rule', body: 'If the mistake could repeat, it becomes a written rule or a check, so it cannot come back.' },
            ]} />
            <p className="pk-p">Here is one real correction. Drag the handle to compare unselected tabs as the export read them and as the live product draws them.</p>
            <TabCompare />
            <h3 className="pk-h3">What wins when sources disagree</h3>
            <Bullets items={[
              <>The Figma file, then the per-variant specs read from it.</>,
              <>Then the published tokens, which can be stale.</>,
              <>Then screenshots of the live product, to settle a value that looks wrong.</>,
              <>Then the product owner’s review comments.</>,
            ]} />
          </Sec>

          {/* 10 */}
          <Sec id="product" n={10} label="In the product" title="Into the product repo, and into real screens" intro={<p>A readable system earns its place when screens get built from it. After the components were documented, they went into the product repo, and product pages started composing them instead of rebuilding them. The screens built this way have shipped, and the team has adopted it.</p>}>
            <Layered rows={[
              { step: '01', kicker: 'Rule', title: 'Pages use the system, and only the system', body: 'Pages import design-system components and micro templates. They cannot import the underlying UI library.' },
              { step: '02', kicker: 'Rule', title: 'A missing part becomes a component first', body: 'If a page needs something the library lacks, it is built as a component, with a demo, before any page uses it.' },
              { step: '03', kicker: 'Result', title: 'Screens shipped, and the team adopted it', body: 'Building with the library is now how new screens get made.' },
            ]} />
            <CodePanel />
            <h3 className="pk-h3">Anatomy of one shipped screen</h3>
            <p className="pk-p">Every region of a list page is a component or a micro template. Hover a region to see which.</p>
            <ScreenHotspots />
            <h3 className="pk-h3">More screens built the same way</h3>
            <p className="pk-p">Public copies of shipped screens, rebuilt from the system with generic names and made-up figures.</p>
            <ScreenShowcase screens={[
              { name: 'Capability dashboard', slot: im.screenCapability! },
              { name: 'Parameter monitoring', slot: im.screenParameters! },
              { name: 'Quality trends', slot: im.screenTrends! },
              { name: 'Annual review', slot: im.screenReview! },
              { name: 'Projects, cards', slot: im.screenCards! },
              { name: 'Projects, list', slot: im.screenList! },
            ]} />
            <Panel slot={im.screen} />
          </Sec>

          {/* 11 */}
          <Sec id="results" n={11} label="Results and reflection" title="What exists today, what I would change" intro={<p>The system is in use and the screens built from it have shipped. These are the things you can open and count. I have not measured the time saved against the old process, and this page does not claim a number for it.</p>}>
            <Stats items={[
              { v: code.components, l: 'components' },
              { v: code.stories, l: 'Storybook stories' },
              { v: ai.deviationsLogged, l: 'logged differences from Figma' },
              { v: ai.intents, l: 'intents for assistants' },
            ]} />
            <Cards3 cards={[
              { icon: 'check', title: 'What worked', items: ['Reading the file instead of redrawing it', 'Fixing the component, never the page', 'Checks that fail the build, not reminders', 'Logging every difference with the Figma value'] },
              { icon: 'cross', title: 'What was hard', items: ['Exports miss anything that is not a fill or a text style', 'A value that looks backwards is not always wrong', 'Keeping written rules and code in step', limits[0] ?? 'Measuring the effect'] },
              { icon: 'arrow', title: 'What I would do next', items: nextSteps.slice(0, 4) },
            ]} />
            <h3 className="pk-h3">Still open</h3>
            <Bullets items={[
              'A few parts are partial: the transfer list, the data grid’s pagination and column menu, and one text-cursor animation.',
              'Two design questions are unanswered and the page does not claim an answer: which surface sits behind a table, and whether grid headers are regular or semibold.',
            ]} />
          </Sec>
        </CaseShell>
      </main>
      <NextProject />
      <Footer />
    </>
  );
}
