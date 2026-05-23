export interface WfDemonstratesItem { title: string; body: string; }
export interface WfToolCategory { category: string; tools: string[]; purpose: string; }
export interface WfActivity { label: string; }
export interface WfPhase {
  num: string;
  id: string;
  title: string;
  description: string;
  activities: string[];
  tools: string[];
  commands?: string[];
  fileTree?: string;
  prChecklist?: string[];
  ciCards?: { status: 'fail' | 'pass'; label: string; issue: string; fix: string; }[];
  breakpoints?: { width: string; label: string; notes: string; }[];
  humanLed: string;
}
export interface WfLesson { title: string; body: string; }

export const workflowCaseStudy = {
  id: 'ai-workflow',
  title: 'AI-Assisted Product Build Workflow',
  subtitle: 'A behind-the-scenes look at how both portfolio projects were built. From problem framing to deployed prototype, with VS Code, AI coding agents, GitHub PRs, and CI checks all documented.',
  tags: ['Product Workflow', 'AI-assisted Build', 'VS Code', 'GitHub PRs', 'CI/CD', 'React Prototype', 'Documentation', 'Handoff'],

  snapshot: {
    role: 'UX/UI Designer + Product Builder',
    timeline: 'Applied across both portfolio projects',
    platform: 'VS Code, GitHub, Vercel',
    tools: 'Claude, Roo Code, Cline, Codex, GitHub, Vercel, React, TypeScript',
    focus: 'Full delivery from problem framing to deployed prototype',
  },

  demonstrates: [
    {
      title: 'Structured delivery workflow',
      body: 'Each project followed a clear process from problem framing to live deployment. This documents the decisions behind that structure and why the phases were ordered the way they were.',
    },
    {
      title: 'AI tools with a review step',
      body: 'Claude, Roo Code, Cline, and Codex were used for implementation support. This documents what I gave them, what I kept for myself, and what the review process looked like before anything got accepted.',
    },
    {
      title: 'GitHub PR discipline',
      body: 'Every significant change lived on its own feature branch. PRs had scoped diffs, short descriptions, and a build check before merge. The exact structure used across both projects is documented here.',
    },
    {
      title: 'CI and build hygiene',
      body: 'TypeScript checks and Vite builds ran before every merge. When they failed, I read the output, fixed it locally, and re-validated before pushing. Real failure examples from the build are included.',
    },
    {
      title: 'Deployment and live sharing',
      body: 'Both prototypes were deployed to Vercel with SPA routing and tested on the preview URL before going live. I verified the links were shareable before adding them to the portfolio.',
    },
    {
      title: 'Documentation as handoff',
      body: "AGENTS.md covers project conventions so anyone picking up the repo can orient quickly. The case studies themselves are the handoff record.",
    },
  ] as WfDemonstratesItem[],

  overview: "This is a behind-the-scenes look at how Riverside General and Renewly were built. It covers every stage from the initial problem brief through research, design exploration, repo setup, coding with AI agents, feature branches, PR review, CI, deployment, and sharing. The goal isn't to explain how the tools work. It's to show how the workflow was structured so design decisions stayed mine while AI helped with the parts it's actually useful for.",

  whyDocument: "Most portfolios show the finished screens. This one also shows how I got there. A designer who can go from a problem brief to a live, tested prototype with a documented workflow is showing something different from polished screens in a PDF. That's what this is.",

  toolStack: [
    { category: 'Research & framing', tools: ['ChatGPT', 'Claude', 'Perplexity', 'Miro'], purpose: 'Used to understand the problem space, challenge assumptions, and map out what matters before design starts.' },
    { category: 'Design & exploration', tools: ['Figma', 'Claude Design', 'FigJam'], purpose: 'Layout direction, component structure, and visual language before any code gets written.' },
    { category: 'AI coding agents', tools: ['Roo Code', 'Cline', 'Codex', 'Claude'], purpose: 'Scoped implementation tasks: component scaffolding, responsive fixes, and CSS changes. Every output reviewed before use.' },
    { category: 'Build & dev', tools: ['VS Code', 'React', 'TypeScript', 'Vite'], purpose: 'The core build environment. TypeScript catches structural issues early, Vite keeps the dev loop fast.' },
    { category: 'Version control', tools: ['Git', 'GitHub'], purpose: 'Feature branches for every meaningful change. Small, reviewable PRs with a build check before merge.' },
    { category: 'Deployment', tools: ['Vercel'], purpose: 'Preview URLs for testing before anything goes live. SPA routing configured from day one.' },
  ] as WfToolCategory[],

  phases: [
    {
      num: '01',
      id: 'research',
      title: 'Research & framing',
      description: 'Each project started with a clear problem statement before any visual work. AI research tools were used to challenge assumptions and identify known patterns in the problem domain. The output was a scoped brief, not a spec, but a short document answering: what are we solving, who is affected, and what does success look like for this prototype.',
      activities: [
        'Defined the core UX problem in one sentence',
        'Used ChatGPT and Perplexity to survey competitor patterns and known UX issues in the domain',
        'Used Claude to challenge assumptions and test the problem framing',
        'Listed what the prototype would and would not attempt to solve',
        'Identified 3 research insights that would influence key design decisions',
      ],
      tools: ['ChatGPT', 'Claude', 'Perplexity'],
      humanLed: 'Problem definition, scope boundary decisions, deciding which research insights matter',
    },
    {
      num: '02',
      id: 'design',
      title: 'Design exploration',
      description: 'Layout directions were explored before committing to an implementation approach. Claude Design and Figma were used to generate and critique layout options quickly. Multiple directions were generated and compared before a path forward was selected. No layout direction was accepted without manual review against the UX requirements and user journey.',
      activities: [
        'Generated layout options for key screens using Claude Design and Figma',
        'Critiqued each direction against user journey and screen responsibilities from research',
        'Identified hierarchy and density issues in generated layouts',
        'Selected the direction that best supported the primary task flow',
        'Defined design tokens for colour, spacing, and typography before writing any code',
      ],
      tools: ['Figma', 'Claude Design', 'FigJam'],
      humanLed: 'Direction selection, UX critique, hierarchy decisions, token definition',
    },
    {
      num: '03',
      id: 'repo-setup',
      title: 'Repository setup',
      description: 'Both projects started with a clean Vite + React + TypeScript scaffold. The repository structure was defined before writing any feature code. Routes, data files, components, styles, and public assets each had their place established upfront. An AGENTS.md file was added to document working conventions so AI coding agents could orient to the project without re-explanation each session.',
      activities: [
        'Scaffolded project with npm create vite, react-ts template',
        'Defined folder structure: src/pages, src/components, src/data, src/styles, public/images',
        'Added React Router and configured SPA routes',
        'Created design token file as CSS custom properties',
        'Wrote AGENTS.md to document project context, conventions, and AI working rules',
        'Initial commit and GitHub repository created before any feature work',
      ],
      tools: ['VS Code', 'Git', 'GitHub', 'Vite'],
      commands: [
        'npm create vite@latest project-name -- --template react-ts',
        'cd project-name && npm install',
        'npm install react-router-dom',
        'git init',
        'git add . && git commit -m "feat: initial scaffold"',
        'git remote add origin https://github.com/user/project',
        'git push -u origin main',
      ],
      humanLed: 'Architecture decisions, folder structure, route planning, AGENTS.md content',
    },
    {
      num: '04',
      id: 'vscode-agents',
      title: 'VS Code & AI coding agents',
      description: 'VS Code was the primary implementation environment. Roo Code, Cline, and Codex handled scoped implementation tasks: component generation, responsive fixes, CSS adjustments, data structure changes. Each AI session was kept to a narrow, well-defined scope to keep outputs reviewable. Every AI output was read and accepted or rejected before continuing to the next task.',
      activities: [
        'Roo Code used for multi-file edits and component scaffolding',
        'Cline used for targeted single-file changes and CSS fixes',
        'Codex used for TypeScript type definitions and data structure work',
        'Claude used for architecture decisions and UX critique during implementation',
        'Each AI session scoped to one task, never open-ended requests',
        'All AI outputs reviewed before acceptance, no auto-commit without inspection',
      ],
      tools: ['VS Code', 'Roo Code', 'Cline', 'Codex', 'Claude'],
      humanLed: 'Session scoping, output review, accept or reject decisions, UX critique of generated code',
    },
    {
      num: '05',
      id: 'file-structure',
      title: 'File structure & architecture',
      description: 'Content was kept separate from presentation throughout both projects. Data files in src/data held all case study content as TypeScript objects. Page components in src/pages assembled sections using shared components. Reusable components in src/components were shared across pages. This separation meant content updates never required touching layout code.',
      activities: [
        'All case study copy lives in src/data, editable without touching components',
        'Page components assemble sections from data, not contain inline content',
        'Shared components (CaseStudyHero, CaseStudyNav, Timeline) reused across all case studies',
        'CSS custom properties define all tokens, one place to change a colour or spacing value',
        'public/images organised by project and category, no flat image dump',
      ],
      tools: ['VS Code', 'TypeScript'],
      fileTree: `src/
├── data/
│   ├── caseStudies.ts          ← Riverside content
│   ├── renewlyCaseStudy.ts     ← Renewly content
│   ├── workflowCaseStudy.ts    ← This showcase content
│   └── projects.ts             ← Homepage project index
├── pages/
│   ├── HomePage.tsx
│   ├── CaseStudyPage.tsx       ← Riverside
│   ├── RenewlyCaseStudyPage.tsx
│   └── WorkflowCaseStudyPage.tsx
├── components/
│   ├── layout/                 ← Header, Footer
│   ├── case-study/             ← CaseStudyHero, CaseStudyNav, Timeline...
│   ├── home/                   ← FeaturedWork, AboutSection...
│   └── ui/                     ← Button, Tag, SectionHeading...
├── styles/
│   └── global.css              ← All styles, design tokens
└── App.tsx                     ← Route config`,
      humanLed: 'Architecture design, separation of concerns, naming conventions, token definitions',
    },
    {
      num: '06',
      id: 'branches',
      title: 'Feature branches & commits',
      description: 'Every significant change lived on its own feature branch. Branch names described the work clearly. This kept main branch always in a working state and made each change reviewable in isolation. Commits were kept small, one logical change per commit where possible. A commit message should describe the what and the why in the same line.',
      activities: [
        'Named branches by type and scope: feat/, fix/, refactor/, content/',
        'Created branches from latest main before starting any new work',
        'Kept commits scoped to one logical change',
        'Never committed directly to main',
        'Ran build check before opening a PR',
      ],
      tools: ['Git', 'GitHub'],
      commands: [
        'git checkout main && git pull origin main',
        'git checkout -b feat/case-study-hero',
        '# ... make changes ...',
        'git add src/components/case-study/CaseStudyHero.tsx',
        'git add src/styles/global.css',
        'git commit -m "feat: add hero section with browser chrome preview"',
        'git push origin feat/case-study-hero',
      ],
      humanLed: 'Branch scope decisions, commit message quality, when to branch vs inline edit',
    },
    {
      num: '07',
      id: 'pr-workflow',
      title: 'PR workflow',
      description: 'Pull requests were opened for every feature branch before merging. Each PR had a short description of what changed and why. Before merging, a review checklist was run manually. PRs were kept small. A large PR is harder to review and harder to roll back if something goes wrong.',
      activities: [
        'Opened PR with short title describing the change',
        'Added 2-3 line description: what changed, why, what to test',
        'Ran the pre-merge checklist before merging',
        'Reviewed the diff in GitHub before clicking merge',
        'Deleted the branch after successful merge',
      ],
      tools: ['Git', 'GitHub'],
      prChecklist: [
        'TypeScript check passes: tsc --noEmit',
        'Vite build passes: vite build or npm run build',
        'No console errors on affected pages',
        'Mobile layout correct at 390px',
        'No horizontal overflow introduced',
        'Content displays correctly, no placeholder text remaining',
        'Links and routes work correctly',
        'No unrelated files changed in the diff',
      ],
      humanLed: 'PR review, merge decision, checklist evaluation, diff reading',
    },
    {
      num: '08',
      id: 'ci',
      title: 'CI validation & build checks',
      description: 'TypeScript type checking and Vite production builds ran before every merge. Build failures were treated as blockers. No merge while CI was red. This caught type errors, missing imports, broken paths, and responsive issues before they reached main. Below are real failure types encountered and the fix pattern applied in each case.',
      activities: [
        'Ran tsc --noEmit to catch type errors before building',
        'Ran vite build to catch import and bundling issues',
        'Both must pass before a PR can be merged',
        'Error messages read carefully. Most failures have a clear line number and reason.',
        'Fixed locally, rebuilt to confirm, then pushed the fix commit',
      ],
      tools: ['TypeScript', 'Vite', 'GitHub'],
      commands: [
        'node node_modules/typescript/bin/tsc --noEmit',
        'node node_modules/vite/bin/vite.js build',
        '# Or using npm scripts:',
        'npm run build',
      ],
      ciCards: [
        {
          status: 'fail',
          label: 'TypeScript type error',
          issue: "Property 'focus' does not exist on type 'Snapshot'",
          fix: "Added optional focus?: string to the Snapshot interface in SnapshotGrid.tsx. TypeScript flagged every consumer of the type that needed updating.",
        },
        {
          status: 'fail',
          label: 'Missing component import',
          issue: "Cannot find module '../components/case-study/IterationLog'",
          fix: "Created the IterationLog.tsx component file with the correct export. The import path was right but the file hadn't been created yet.",
        },
        {
          status: 'fail',
          label: 'Unused import warning as error',
          issue: "'ScreenshotGallery' is defined but never used (tsconfig: noUnusedLocals)",
          fix: "Removed the unused import from the affected page component after the section was refactored to a different layout.",
        },
        {
          status: 'pass',
          label: 'Clean build after all fixes',
          issue: 'tsc --noEmit: 0 errors, 0 warnings',
          fix: "vite build: dist/assets/index.css 58.46 kB, dist/assets/index.js 286.18 kB. Build passed, ready to merge.",
        },
      ],
      humanLed: 'Interpreting error output, choosing the right fix, deciding what is a blocker vs warning',
    },
    {
      num: '09',
      id: 'merge',
      title: 'Merge & conflict resolution',
      description: 'Conflicts were rare due to small, scoped PRs, but they did happen when two branches both touched global.css or a shared data file. The resolution process: identify the conflict blocks, understand what each side was trying to do, and write the merged version that satisfies both intentions. Never blindly accept one side over the other.',
      activities: [
        'Pull latest main before rebasing or merging any branch',
        'Read both conflict sides before deciding, never auto-accept HEAD or incoming blindly',
        'When both sides added CSS rules, keep both and order them logically',
        'When two branches changed the same data field, reconcile intent first',
        'Test the merged result with a fresh build before pushing',
      ],
      tools: ['Git', 'VS Code'],
      commands: [
        'git checkout feat/my-branch',
        'git fetch origin && git rebase origin/main',
        '# VS Code merge editor opens on conflict',
        '# Resolve manually, read both sides',
        'git add src/styles/global.css',
        'git rebase --continue',
        'npm run build  # verify merged result builds cleanly',
      ],
      humanLed: 'Conflict interpretation, merge intent resolution, post-merge build verification',
    },
    {
      num: '10',
      id: 'local-preview',
      title: 'Local dev & live preview',
      description: 'The local dev server ran continuously during development. Changes appeared instantly via Vite HMR without full page reloads. Browser DevTools were used for responsive testing before committing. Significant responsive issues were treated as bugs and fixed before pushing, not deferred to a later pass.',
      activities: [
        'npm run dev, local dev server on localhost:5173',
        'Vite HMR updates component changes without full reload',
        'Browser DevTools device toolbar for quick breakpoint sanity checks',
        'Mobile bar set to 390px (iPhone 14) as the minimum supported width',
        'Console kept open during testing, runtime errors caught before commit',
        'overflow-x: hidden on body catches layout escapes early',
      ],
      tools: ['VS Code', 'Vite', 'Chrome DevTools'],
      commands: [
        'npm run dev',
        '# Opens http://localhost:5173',
        '# Vite HMR active, save a file to see changes instantly',
      ],
      humanLed: 'What to test, which breakpoints matter, when a layout issue is a blocker vs acceptable',
    },
    {
      num: '11',
      id: 'responsive-qa',
      title: 'Responsive QA',
      description: 'Responsive QA happened at two levels: quick DevTools checks during development, and a structured pass before each PR merge. The structured pass checked every significant page at five breakpoints, confirmed no horizontal overflow, tested touch targets on interactive elements, and verified text remained readable at minimum sizes.',
      activities: [
        'Five breakpoints tested per meaningful change: 1440, 1024, 768, 430, 390px',
        'No horizontal overflow at any breakpoint, body overflow-x hidden as baseline',
        'Navigation readable and usable at all sizes',
        'All text minimum 14px at 390px, no unreadable small text',
        'Interactive elements minimum 44px touch target on mobile',
        'Forms single-column and full-width on mobile',
      ],
      tools: ['Chrome DevTools', 'VS Code'],
      breakpoints: [
        { width: '1440px', label: 'Wide desktop', notes: 'Max-width container kicks in, full grid layout used' },
        { width: '1024px', label: 'Laptop', notes: 'Navigation still horizontal, grid collapses to 2-col' },
        { width: '768px', label: 'Tablet', notes: 'First breakpoint to check for overflow and nav wrapping' },
        { width: '430px', label: 'Mobile L', notes: 'Common Android viewport, single-column layout required' },
        { width: '390px', label: 'iPhone 14', notes: 'Minimum tested width, all layouts must work here' },
      ],
      humanLed: 'Identifying layout regressions, deciding what is acceptable at each breakpoint',
    },
    {
      num: '12',
      id: 'deploy',
      title: 'Vercel deployment',
      description: 'Both prototypes were deployed to Vercel with SPA routing configured. The first deploy step was always a preview environment. Checked the live URL before the production alias was set. React Router requires a vercel.json rewrite rule so direct URL access does not return a 404 on page refresh. This caught the routing issue on first deploy and was fixed before production promotion.',
      activities: [
        'Connected GitHub repository to Vercel project, auto-deploy on push to main',
        'Build command: npm run build, output directory: dist',
        'Added vercel.json with SPA routing rewrite rule',
        'Checked preview deploy URL before promoting to production alias',
        'Tested all routes on the preview URL: home, case study, about, 404',
        'Confirmed prototype link is shareable before adding to portfolio',
      ],
      tools: ['Vercel', 'GitHub'],
      commands: [
        '# vercel.json, required for React Router SPA routing:',
        '{',
        '  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]',
        '}',
        '',
        '# After pushing to main, Vercel auto-deploys',
        '# Preview URL available within ~60 seconds',
      ],
      humanLed: 'Deploy configuration, routing verification, preview review before production promotion',
    },
    {
      num: '13',
      id: 'handoff',
      title: 'Sharing & handoff',
      description: "The deliverable for each project was a shareable live link: a working prototype any recruiter can open and test without setup. Prototype URLs and GitHub repository links are visible on every portfolio card and case study hero. AGENTS.md in the portfolio repo documents working rules for any future collaborator or AI agent. The case studies themselves are the handoff artefact.",
      activities: [
        'Prototype URLs verified shareable from any browser, no auth required',
        'GitHub repositories set to public, readable by recruiters',
        'Portfolio cards show prototype URL in the browser bar chrome element',
        'Case study heroes include clickable prototype and GitHub links in the CTA row',
        'AGENTS.md updated after each project with any new conventions discovered',
      ],
      tools: ['Vercel', 'GitHub'],
      humanLed: 'Deciding what to share, with whom, and in what format',
    },
  ] as WfPhase[],

  whatWorked: [
    {
      title: 'Scoped AI sessions',
      body: 'Keeping each AI session to a single, well-defined task made outputs reviewable and errors easy to catch. Open-ended sessions produce large, hard-to-review diffs. Narrow sessions produce small, auditable changes that can be accepted or rejected cleanly.',
    },
    {
      title: 'AGENTS.md as orientation document',
      body: 'Writing AGENTS.md early in each project meant any new AI session could pick up context quickly without re-explaining conventions. It also prevented scope drift by stating what the project was and was not trying to do.',
    },
    {
      title: 'TypeScript as a change propagation assistant',
      body: 'Type errors caught broken data structures before runtime. Adding a new field to a data interface surfaced all the places it needed to be handled. The type system acted as a passive reviewer that caught things before the build did.',
    },
    {
      title: 'Feature branches per concern',
      body: "Small, named branches made the delivery history readable. A branch called fix/mobile-overflow tells a clear story. A branch called feat/updates does not. Branch discipline made rollback and code review practical throughout.",
    },
    {
      title: 'Build gate before merge',
      body: 'Running tsc --noEmit and vite build before every merge blocked most regressions at the source. A passing build does not guarantee correct UX. A failing build is always a blocker, and catching it locally is faster than catching it after push.',
    },
  ] as WfLesson[],

  whatIdChange: [
    {
      title: 'Earlier design token definition',
      body: 'Some tokens were added mid-project when new components needed values not yet in the system. Defining a more complete token set upfront would have reduced ad-hoc additions and kept the token file as the authoritative source from day one.',
    },
    {
      title: 'Storybook for shared components',
      body: 'Shared components (cards, tags, buttons, galleries) were built directly in page context. Using Storybook from the start would have made component variants more visible and reduced duplicated CSS rules across sections.',
    },
    {
      title: 'Structured breakpoint snapshot tests',
      body: 'Responsive QA was manual throughout. Adding visual snapshot tests for key breakpoints would have caught regressions automatically rather than relying on a manual check pass before each PR merge.',
    },
  ] as WfLesson[],

  techStack: [
    { label: 'Frontend', value: 'React 18, TypeScript 5, Vite 5' },
    { label: 'Styling', value: 'Plain CSS with custom properties, no external CSS framework' },
    { label: 'Routing', value: 'React Router v6, multi-page SPA with deep-linkable routes' },
    { label: 'AI agents', value: 'Claude, Roo Code, Cline, Codex, scoped implementation support' },
    { label: 'Version control', value: 'Git + GitHub, feature branch and PR workflow throughout' },
    { label: 'Deployment', value: 'Vercel, preview and production environments, SPA routing configured' },
  ],

  reflection: "The thing I learned most clearly doing this: AI tools work well when you give them a specific, narrow task. They fall apart when you let them run open-ended. Research, layout exploration, and coding all got faster. The product decisions, the UX critique, and what actually ships did not get handed over. Every time something went wrong, it was because I accepted AI output without reading it carefully first. When I kept sessions focused and reviewed everything, the work came out clean. That's the pattern this documents.",
};
