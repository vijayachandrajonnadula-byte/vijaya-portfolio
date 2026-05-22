export interface DemonstratesItem {
  title: string;
  body: string;
}

export interface ResearchInsight {
  title: string;
  issue: string;
  response: string;
}

export interface Iteration {
  num: string;
  title: string;
  issue: string;
  fix: string;
  why: string;
}

export const riversideCaseStudy = {
  id: "riverside-general",
  title: "Riverside General — Hospital Appointment Booking Platform",
  subtitle: "A healthcare UX/UI case study covering how patients find doctors, compare availability, select a slot, and confirm an appointment — designed as a working React prototype.",
  tags: ["UX/UI Design", "Healthcare", "React Prototype", "Design System", "Testing & Iteration", "AI-assisted Workflow", "Responsive QA"],
  prototypeUrl: "https://hospital-booking-portfolio.vercel.app/",
  githubUrl: "https://github.com/vijayachandrajonnadula-byte/hospital-booking-portfolio",

  snapshot: {
    role: "UX/UI Designer, product thinker, prototype builder",
    timeline: "14-day portfolio sprint",
    platform: "Responsive web app",
    tools: "Figma, Claude Design, React, TypeScript, MUI, GitHub, Vercel",
    focus: "Healthcare booking flow, doctor discovery, slot selection, and confirmation clarity",
  },

  demonstrates: [
    {
      title: "Product thinking",
      body: "Defined a focused healthcare booking problem and separated discovery, selection, booking, and confirmation into clear screen responsibilities. Avoided overloading any single page with multiple jobs.",
    },
    {
      title: "UX decision-making",
      body: "Removed non-actionable slot chips from the listing page, clarified each screen's core purpose, and placed appointment selection on the doctor profile where user intent is already established.",
    },
    {
      title: "AI-assisted delivery",
      body: "Used ChatGPT, Claude, Roo Code, Cline, and Codex to accelerate research framing, visual exploration, and prototype implementation while keeping product judgement and UX critique human-led throughout.",
    },
    {
      title: "Build and shipping mindset",
      body: "Created a working React prototype using feature branches and PR-style iteration, tested the complete flow end-to-end across screen sizes, and deployed a shareable live demo on Vercel.",
    },
    {
      title: "Testing and iteration",
      body: "Improved the interface through multiple critique rounds covering mobile navigation, stepper behaviour, date selector layout, confirmation completeness, and doctor listing clarity.",
    },
    {
      title: "Responsive QA",
      body: "Tested at 1440, 1024, 768, 430, and 390px. No horizontal overflow. Header, forms, cards, and screenshot galleries all adapt cleanly across breakpoints.",
    },
  ] as DemonstratesItem[],

  overview:
    "Riverside General is a responsive hospital appointment booking prototype designed to help patients find doctors, compare availability, select an appointment slot, enter patient details, and receive a clear confirmation online. The project focuses on a common healthcare UX problem: patients arrive at hospital websites with a simple goal — book an appointment — but are forced to navigate competing pathways before they can complete it. The prototype covers the full journey from the homepage through to appointment management, with each screen carrying a single clear responsibility. The project was built as a working React prototype and deployed to Vercel so recruiters can test the live flow directly.",

  problem:
    "Hospital websites often contain competing content: departments, emergency information, visitor guidance, locations, health resources, patient portals, and appointment options. For a patient who simply wants to book an appointment, this creates unnecessary friction. The user must decide which pathway leads to booking before the task has even started. This problem is compounded when doctor availability is hidden behind multiple steps, or when the booking form appears before the user has confirmed that a suitable slot even exists.",

  problemHighlight:
    "The user does not want to browse a hospital website. The user wants to find the right doctor and book with confidence.",

  goals: [
    {
      title: "Make doctor discovery easier",
      body: "Help patients find relevant doctors by specialty, availability, and location without navigating hospital department listings. The Find Doctors page should answer the question: who can I see, and when is the soonest appointment?",
    },
    {
      title: "Show availability before commitment",
      body: "Surface date and slot availability on the doctor profile, before the user commits to a booking form. Seeing availability first reduces hesitation and increases confidence that the booking will succeed.",
    },
    {
      title: "Confirm clearly and reduce uncertainty",
      body: "Provide a booking reference, full appointment summary, before-visit checklist, and useful actions immediately after confirmation. The user should leave the confirmation page with no open questions.",
    },
  ],

  researchInsights: [
    {
      title: "Users need a clear booking entry point",
      issue:
        "Hospital homepages compete with departments, emergency information, and visitor guidance. Users with a single goal — booking — must scan through unrelated content before finding the path forward. Competing navigation items force a decision before the primary task has started.",
      response:
        "Surface a single prominent booking action at the homepage level. Reduce navigation competition on the primary task path and eliminate intermediary pages before the user reaches the Find Doctors flow.",
    },
    {
      title: "Availability should appear before commitment",
      issue:
        "Showing a booking form before surfacing slot availability forces users to commit to a process before confirming their preferred time exists. This increases form abandonment and erodes trust in the booking system.",
      response:
        "Move slot selection to the doctor profile page. Users should see available dates and times before entering any personal details. This makes the commitment feel informed rather than blind.",
    },
    {
      title: "Doctor listings should support comparison, not scheduling",
      issue:
        "Overloading the doctor listing page with slot chips and quick-book options increases cognitive load and discourages comparison. When every card tries to complete the booking, none of them do it well.",
      response:
        "Design the listing page around comparison: specialty, location, availability summary, and trust signals. Move full slot selection to the doctor profile where the user has more context to commit.",
    },
  ] as ResearchInsight[],

  userJourneySteps: ["Home", "Find Doctors", "Doctor Profile", "Select Slot", "Book Appointment", "Confirmation", "Manage Appointment"],
  userJourneyDescription:
    "The early flow separated the experience into discovery, evaluation, booking, confirmation, and post-booking management. This helped avoid overloading the doctor listing page with full scheduling controls. Each stage has a single primary action, and passing state forward — selected doctor, date, and time — ensures the user never has to re-enter choices they already made.",

  uxDecisions: [
    {
      title: "Find Doctors is for comparison",
      body: "The doctor listing page originally risked becoming overloaded with slot chips and scheduling options. It was refined to focus on comparison: department, doctor information, trust signals, and next available summary. Slot booking happens on the doctor profile page, not in the list. This separation makes the listing scannable and prevents scheduling decisions from interrupting the comparison stage.",
    },
    {
      title: "Doctor Profile supports real slot selection",
      body: "The profile page became the place where users evaluate the doctor and select a slot. This makes the interaction feel intentional and closer to real appointment booking behaviour. Users choose date and time after reviewing the doctor and their credentials, not before. The slot picker sits naturally below the doctor summary, making the sequence read top to bottom.",
    },
    {
      title: "Booking confirms the selected appointment",
      body: "The booking page should not make users rediscover availability. It confirms the selected doctor, date, and time at the top, then collects patient details below. The selected slot is always visible during form entry, so the user never loses track of what they are booking. This reduces errors and increases confidence before submission.",
    },
    {
      title: "Confirmation reduces uncertainty",
      body: "The confirmation screen provides a booking reference number, full appointment summary, before-visit checklist, copy and download actions, add-to-calendar option, and a clear path to the Manage Appointment screen. The goal is to leave the user with zero open questions. A confirmation screen should function as proof — not just a receipt page.",
    },
    {
      title: "Manage Appointment gives control",
      body: "The manage flow supports post-booking confidence by allowing users to look up, reschedule, or cancel appointments from a dedicated screen. It is discoverable from the confirmation page and reinforces that the user has ongoing control after committing to the booking.",
    },
  ],

  designSystemDescription:
    "The design system kept the prototype visually consistent while screens were being rebuilt and refined through multiple iterations. Reusable tokens for colour, spacing, and typography were defined early and applied consistently. Components were built to be composable so that the booking flow could be assembled from shared parts rather than custom-coded per screen.",

  earlyStructureIntro:
    "Before any visual decisions were made, the booking experience was structured around three questions: what is the user trying to do, in what order should the screens appear, and what is each screen responsible for. The user flow mapped the end-to-end journey. The information architecture separated browsing from booking. The wireframes defined page layout and content responsibility — not how anything looked.",

  iaDescription:
    "The IA separated general hospital navigation (Find Doctors, Departments) from the focused appointment booking flow (Doctor Profile → Book → Confirm → Manage). The booking journey is kept linear and focused. The IA keeps the appointment path separate from general hospital content so users are never pulled out of the task flow mid-booking.",

  wireframesDescription:
    "Early wireframes explored page responsibility, layout hierarchy, and booking flow structure before any visual design decisions were made. The goal was to establish what each screen should do and in what order, not how it should look. Find Doctors was designed for comparison. Doctor Profile handled evaluation and slot selection. Booking collected patient details. Confirmation reduced uncertainty.",

  designSystemImages: [
    { src: "/images/projects/riverside/design-system/00-cover.png", label: "Design system overview" },
    { src: "/images/projects/riverside/design-system/01-color-palette.png", label: "Colour palette" },
    { src: "/images/projects/riverside/design-system/02-typography.png", label: "Typography" },
    { src: "/images/projects/riverside/design-system/03-buttons.png", label: "Buttons" },
    { src: "/images/projects/riverside/design-system/04-form-fields.png", label: "Form fields" },
    { src: "/images/projects/riverside/design-system/05-alerts.png", label: "Alerts" },
    { src: "/images/projects/riverside/design-system/06-stepper.png", label: "Stepper / progress" },
    { src: "/images/projects/riverside/design-system/07-doctor-card.png", label: "Doctor card" },
    { src: "/images/projects/riverside/design-system/08-appointment-summary.png", label: "Appointment summary" },
  ],

  aiWorkflow: [
    {
      stage: "Problem framing",
      title: "Structured the brief with AI",
      body: "ChatGPT and Claude helped challenge assumptions, explore competitor patterns, and structure the product problem. The AI framing helped define what the project was and was not trying to solve, and kept the scope from drifting.",
      note: "Human task: Define scope, validate the problem statement, and decide what to cut",
    },
    {
      stage: "Visual exploration",
      title: "Explored layout directions",
      body: "Claude Design and reference screenshots were used to explore layout directions, component hierarchy, and visual density. Multiple directions were generated and critiqued before selecting a path forward. None were accepted without manual review.",
      note: "Human task: Select direction, critique layout, and identify hierarchy issues",
    },
    {
      stage: "Prototype implementation",
      title: "Built with AI-assisted tools",
      body: "Claude, Roo Code, Cline, Codex, React, and TypeScript supported scoped prototype implementation. Each AI output was reviewed manually before acceptance. Scope was kept tight per session to prevent drift and keep quality reviewable.",
      note: "Human task: Scope each session, review all outputs, and accept or reject changes",
    },
    {
      stage: "Review and iteration",
      title: "Manual UX and UI critique",
      body: "Manual review identified layout issues, mobile responsiveness problems, date selection bugs, stepper clarity issues, and confirmation completeness gaps. These were triaged and fixed in targeted iteration rounds.",
      note: "Human task: Identify issues, triage priority, test on real screen sizes",
    },
    {
      stage: "Deployment and sharing",
      title: "GitHub and Vercel workflow",
      body: "GitHub branches and PRs structured the build. Vercel deployment made the prototype shareable with recruiters as a live, testable link. The deploy process was tested to confirm SPA routing worked correctly after production build.",
      note: "Human task: Review each PR, merge to main, confirm Vercel preview and production",
    },
  ],

  technicalDescription:
    "The project was implemented as a React and TypeScript application built with Vite. Mock doctor and appointment data was used to simulate the full booking journey without a real backend. Routes supported Home, Find Doctors, Doctor Profile, Booking, Confirmation, and Manage Appointment. Reusable components were created for buttons, cards, forms, appointment slot selectors, booking summaries, dialogs, and stepper or progress behaviour. CSS custom properties were used throughout for consistent spacing, colour, and typography tokens. The project was deployed as a live portfolio demo on Vercel so recruiters can test the complete working flow directly from a shareable link.",

  technicalPoints: [
    "GitHub repository with feature branches and PR-style merge workflow",
    "React + TypeScript + Vite project with module-based file structure",
    "Feature-based component folders separating pages, layout, and UI",
    "Design-system CSS tokens for colour, spacing, and typography",
    "React Router v6 for SPA navigation with deep-linkable routes",
    "Mock doctor and appointment data with typed TypeScript interfaces",
    "Reusable card, form, stepper, selector, and summary components",
    "Build validation: tsc type-check and vite build must pass before merge",
    "Vercel deployment with SPA rewrite rule for client-side routing",
  ],

  prWorkflowDescription:
    "The workflow used focused branches and PR-style changes to avoid broad unfocused edits. Each improvement targeted a specific UX concern such as date selector layout, mobile header behaviour, stepper label clarity, or confirmation completeness. This kept the diff reviewable and the improvement traceable.",

  prWorkflow: [
    { pr: "PR-001", label: "Project setup and base structure" },
    { pr: "PR-002", label: "Design system wrapper and tokens" },
    { pr: "PR-003", label: "Home page and routing" },
    { pr: "PR-004", label: "Doctor search and filters" },
    { pr: "PR-005", label: "Doctor profile and slot selection" },
    { pr: "PR-006", label: "Booking flow and patient form" },
    { pr: "PR-007", label: "Confirmation and manage appointment" },
    { pr: "PR-008", label: "UX and UI refinement" },
    { pr: "PR-009", label: "Mobile responsive fixes" },
    { pr: "PR-010", label: "Deployment polish" },
  ],

  testingFlow: "Home → Find Doctors → Doctor Profile → Book Appointment → Confirmation → Manage Appointment",

  testingChecklist: [
    "Could the user find the main booking action from the home page without searching?",
    "Could the user compare two doctors on the listing page by specialty and availability?",
    "Was slot availability shown before the user entered any personal details?",
    "Did the selected date and time carry correctly into the booking form?",
    "Did the appointment summary in the booking form match the selected slot?",
    "Did patient form validation trigger clearly on empty or invalid fields?",
    "Did the confirmation screen provide a reference number and actionable next steps?",
    "Was Manage Appointment reachable from the confirmation screen?",
    "Did the mobile layout remain fully usable at 390px without horizontal overflow?",
  ],

  iterations: [
    {
      num: "01",
      title: "Doctor listing clarity",
      issue: "Doctor cards showed too many non-actionable slot chips, making the listing page feel like a premature scheduling screen rather than a comparison view.",
      fix: "Simplified listing to show comparison data: specialty, next available summary, location, and trust signals. Removed inline scheduling from list cards.",
      why: "Users need to compare doctors before committing to a slot. Mixing scheduling into the listing confused where the real booking step was and discouraged comparison.",
    },
    {
      num: "02",
      title: "Slot selection flow",
      issue: "The selected slot from the doctor profile did not carry into the booking page. Users were forced to re-enter their time preference on the booking form.",
      fix: "Selected doctor, date, and time now pass into the Booking page and are shown as a confirmed summary at the top of the form.",
      why: "Users should not re-confirm choices already made. Showing the selected slot in booking reinforces confidence, reduces re-entry errors, and speeds up form completion.",
    },
    {
      num: "03",
      title: "Confirmation reassurance",
      issue: "The confirmation page felt empty. There was no booking reference, no summary of what was booked, and no clear next step for the user.",
      fix: "Added booking reference number, full appointment summary, before-visit checklist, copy and download actions, and an add-to-calendar option.",
      why: "A confirmation screen must answer: did this work, and what do I do next? Users need something tangible to refer to before leaving the page.",
    },
    {
      num: "04",
      title: "Mobile responsiveness",
      issue: "The mobile layout felt like a compressed desktop at all breakpoints. Navigation items, form fields, and cards did not adapt to single-column layout.",
      fix: "Refined header to hamburger menu, added compact progress indicator, stacked cards vertically, and rewrote form layout for single-column mobile use.",
      why: "A significant portion of users access healthcare sites on mobile devices. The mobile experience needed to feel designed for that context, not shrunken from desktop.",
    },
    {
      num: "05",
      title: "Typography and spacing",
      issue: "Some UI elements were oversized, too heavy, or visually competing with the primary actions on each page.",
      fix: "Refined the typography scale, spacing rhythm, button sizing, and card hierarchy across the prototype.",
      why: "Visual clarity directly supports the ability to scan and act. Oversized secondary elements draw attention away from the primary task on each screen.",
    },
    {
      num: "06",
      title: "Date selector repair",
      issue: "The date and time picker had touch-target problems on mobile. Slot items were too small to tap reliably, and the layout broke at 390px.",
      fix: "Rebuilt the horizontal slot picker with larger touch targets, a scrollable row layout on mobile, and correct responsive clipping behaviour.",
      why: "Slot selection is the most critical interaction in the entire booking flow. Touch-target failures at this step would directly block users from completing the booking.",
    },
    {
      num: "07",
      title: "Stepper and progress refinement",
      issue: "The booking stepper labels were too long on small screens, causing wrapping and misalignment that made the progress indicator harder to read than the form itself.",
      fix: "Simplified stepper labels to short keywords and switched to a compact dot-style indicator on mobile rather than a full labelled stepper.",
      why: "Progress indicators are supporting context, not primary content. They should reassure without dominating the available vertical space on mobile.",
    },
  ] as Iteration[],

  responsiveQADescription:
    "Responsive QA focused on preventing horizontal overflow at all target breakpoints, making the header usable on small screens, keeping the date and time slot picker tappable on mobile, stacking forms cleanly in a single column, and making appointment summaries readable at minimum sizes.",

  responsiveQA: [
    { breakpoint: "1440px", label: "Wide desktop", status: "Tested" },
    { breakpoint: "1024px", label: "Laptop", status: "Tested" },
    { breakpoint: "768px", label: "Tablet", status: "Tested" },
    { breakpoint: "430px", label: "Mobile L", status: "Tested" },
    { breakpoint: "390px", label: "iPhone 14", status: "Tested" },
  ],

  desktopScreenshots: [
    {
      src: "/images/projects/riverside/clean/desktop-home.png",
      caption: "Home",
      title: "Home",
      purpose: "Introduce the booking service, surface the primary action immediately, and provide quick department navigation without burying the patient in hospital content.",
      uxNote: "Single prominent CTA above the fold competes with nothing. The hero card shows today's appointment schedule as a live product signal.",
    },
    {
      src: "/images/projects/riverside/clean/desktop-find-doctors.png",
      caption: "Find Doctors",
      title: "Find Doctors",
      purpose: "Allow patients to browse and compare available doctors by specialty, availability, location, and rating before opening a full profile.",
      uxNote: "Listing designed for comparison — specialty, next available slot, location, and rating shown together. Full slot selection is intentionally deferred to the profile page.",
    },
    {
      src: "/images/projects/riverside/clean/desktop-doctor-profile.png",
      caption: "Doctor Profile",
      title: "Doctor Profile",
      purpose: "Give patients the context needed to evaluate a specific doctor and select a time slot in a single, linear top-to-bottom interaction.",
      uxNote: "Credentials and availability shown together. Slot picker sits directly below the doctor summary so selection follows evaluation, not the reverse.",
    },
    {
      src: "/images/projects/riverside/clean/desktop-booking.png",
      caption: "Book Appointment",
      title: "Book Appointment",
      purpose: "Collect patient details to complete the booking, with the appointment summary kept persistently visible to reduce second-guessing mid-form.",
      uxNote: "Persistent booking summary stays in view throughout form entry. A progress indicator shows the patient exactly where they are in the booking flow.",
    },
    {
      src: "/images/projects/riverside/clean/desktop-confirmation.png",
      caption: "Confirmation",
      title: "Booking Confirmation",
      purpose: "Resolve all post-booking uncertainty by providing a complete appointment summary, a before-visit checklist, and immediate next-step actions in one place.",
      uxNote: "Reference number, date, doctor, location, checklist, and options to add to calendar or manage the booking — everything the patient needs, nothing more.",
    },
    {
      src: "/images/projects/riverside/clean/desktop-manage.png",
      caption: "Manage Appointment",
      title: "Manage Appointment",
      purpose: "Allow patients to retrieve, review, reschedule, or cancel an existing appointment from a single focused screen reachable from confirmation or main navigation.",
      uxNote: "Reschedule and cancel actions are clearly separated. Cancel is guarded by an explicit confirmation step to prevent accidental loss of a booked appointment.",
    },
  ],

  mobileScreenshots: [
    {
      src: "/images/projects/riverside/clean/mobile-home.png",
      caption: "Home",
      title: "Home",
      uxNote: "Header collapses to hamburger. Department icons scroll horizontally. Primary CTA remains prominent at the top of the single-column layout.",
    },
    {
      src: "/images/projects/riverside/clean/mobile-find-doctors.png",
      caption: "Find Doctors",
      title: "Find Doctors",
      uxNote: "Single-column listing with tappable cards. Specialty, next available, and rating visible without opening the profile. Filters accessible via a sticky chip row.",
    },
    {
      src: "/images/projects/riverside/clean/mobile-doctor-profile.png",
      caption: "Doctor Profile",
      title: "Doctor Profile",
      uxNote: "Slot picker adapts to a vertical scrollable date and time selection. Book button anchored to the bottom of the screen for reliable one-thumb reach.",
    },
    {
      src: "/images/projects/riverside/clean/mobile-booking.png",
      caption: "Book Appointment",
      title: "Book Appointment",
      uxNote: "Appointment summary shown as a compact card above the form. All fields are full-width with 44px minimum tap height throughout.",
    },
    {
      src: "/images/projects/riverside/clean/mobile-confirmation.png",
      caption: "Confirmation",
      title: "Booking Confirmation",
      uxNote: "Actions rendered as full-width 48px buttons. Reference number displayed prominently. Before-visit checklist stacks cleanly below the appointment summary.",
    },
    {
      src: "/images/projects/riverside/clean/mobile-manage.png",
      caption: "Manage",
      title: "Manage Appointment",
      uxNote: "Reschedule and cancel are clearly separated. Cancel requires confirmation before proceeding to prevent accidental appointment removal.",
    },
  ],

  wireframeImages: [
    { src: "/images/projects/riverside/wireframes/wireframe-home.png", label: "Home — layout exploration" },
    { src: "/images/projects/riverside/wireframes/wireframe-find-doctors.png", label: "Find Doctors — comparison layout" },
    { src: "/images/projects/riverside/wireframes/wireframe-booking-flow.png", label: "Booking flow — page structure" },
  ],

  iaImage: "/images/projects/riverside/wireframes/ia-map.png",
  flowImage: "/images/projects/riverside/wireframes/flow-map.png",

  accessibilityChecklist: [
    "Visible form labels on all inputs — no placeholder-only labelling",
    "Inline validation messages triggered on blur and on submit",
    "Keyboard-navigable focus states on all interactive elements",
    "Selected and disabled states clearly distinguished on slot picker",
    "Confirmation dialog shown before appointment cancellation action",
    "Large tap targets on mobile — minimum 44x44px touch areas",
    "Readable mobile typography — minimum 14px body text size",
  ],

  techStack: [
    { label: "Frontend", value: "React 18, TypeScript 5, Vite 5" },
    { label: "UI library", value: "MUI components, custom CSS, design tokens" },
    { label: "Data", value: "Mock doctor and appointment data — no backend" },
    { label: "Routing", value: "React Router v6 — multi-page SPA with deep links" },
    { label: "Version control", value: "GitHub — feature branches and PR workflow" },
    { label: "Deployment", value: "Vercel — live portfolio demo, SPA routing configured" },
  ],

  limitations: [
    "Mock data only — no real hospital scheduling backend or live API",
    "No authentication or real patient account management",
    "No payment processing or insurance verification",
    "No real email or SMS confirmation delivery",
    "No doctor dashboards, admin panels, or scheduling management tools",
    "No real-time slot availability from an external scheduling system",
  ],

  nextSteps: [
    "Connect to a real scheduling API for live doctor slot availability",
    "Add user authentication and patient account management",
    "Implement email and SMS appointment confirmation on booking",
    "Build a hospital admin workflow for managing and rescheduling bookings",
    "Add analytics and event tracking to measure booking flow drop-offs",
    "Conduct real usability testing with actual patients and healthcare users",
  ],

  finalValidation: [
    "Home page gives a clear, single booking entry point",
    "Find Doctors supports comparison across specialties and availability",
    "Doctor Profile supports slot selection before any commitment",
    "Selected date and time carry through to the Booking page without re-entry",
    "Booking summary always matches the selected appointment",
    "Patient form includes field-level validation with clear error messages",
    "Confirmation provides a reference number, summary, and actionable next steps",
    "Manage Appointment is reachable from the confirmation screen",
    "Core pages load correctly after Vercel deployment",
    "Live prototype link is shareable and testable by recruiters",
  ],

  reflection:
    "The strongest learning from this project was that visual polish alone does not solve the UX problem. Several versions of the prototype looked better visually but still had unclear screen responsibilities and confusing booking flows. The biggest improvements came from two places: first, defining exactly what each screen should do and removing everything that did not serve that specific goal; second, testing the complete end-to-end journey on real screen sizes rather than only in design tools. The mobile issues — broken date selector, overlong stepper labels, compressed navigation — were invisible until tested on an actual device. AI tools accelerated research framing, layout exploration, and prototype implementation significantly. The product decisions, critique rounds, responsive QA, and final acceptance all required human judgement that could not be delegated.",
};
