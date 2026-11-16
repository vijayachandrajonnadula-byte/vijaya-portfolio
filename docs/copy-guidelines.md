# Copy guidelines

Voice: plain first, wit second. A stranger must understand every line in one read.
The electronics theme stays, but it lives in the styling and in jokes under a clear label, never in the label itself.

## Rules

1. Clarity before cleverness. If a line needs decoding, rewrite it.
2. Lead with the useful fact. The first sentence of every answer answers the question.
3. Plain verbs, short sentences, no filler. Aim for 8 to 14 words a sentence.
4. One name per thing (see the vocabulary below).
5. Electronics references are welcome only when the meaning is obvious without electronics knowledge,
   or the line is fully understandable without the pun ("Same drawing. Two readings.").
6. Keep the datasheet motif, but make every label plain ("Based in", not "Package").
7. Jokes are fine only under a clear label ("Quirks, honestly" above "Coffee: Until the build passes").
8. Never invent facts, numbers, outcomes or anecdotes. The resume, `profile.ts`, `home.ts` and `projects.ts` are the sources of truth.
9. The ask box is retrieval, not AI. Do not call it AI or a chatbot. Answers are pre-written.
10. Fiction stays labelled as fiction (parables and tall tales). No phone numbers anywhere.
11. Buttons and links never get a joke for a label.

## Before and after (the 15 that matter most)

| Where | Before | After | Why |
| --- | --- | --- | --- |
| About spec | Package: Hyderabad, India | Based in: Hyderabad, India | "Package" is chip jargon (the trigger for this pass) |
| About spec | Operating experience | Experience | Same meaning, no jargon |
| About spec | Core function / Interfaces | Focus / Tools | "Interfaces" meant tools, which reads as UI |
| About block | Absolute maximum ratings | Quirks, honestly | Understood in one glance, keeps the jokes honest |
| About block | Recommended operating conditions | Works best with | Plain, and says what the block is for |
| About block | Revision history / Full parts list | Experience / Skills | Matches the resume wording |
| About block | Bill of materials | Tools | Recruiters know "tools" |
| About header | Datasheet / Rev 2026 | About Vijay, as a datasheet / Updated 2026 | Plain words first, motif second |
| Tagline | Low-noise, high-gain, human-friendly. Hyderabad package. | Low noise, high clarity, human-friendly. | Drops the confusing "package", keeps the tone |
| Chapter labels | 03 prototypes / work | 03 work / prototypes | The plain word leads, matching the nav |
| Two readings | A circuit is an interface nobody sees. An interface is a circuit everybody uses. | A circuit board and an app screen can share one layout. Drag to read one drawing both ways. | Says what the section is and what to do |
| Hero aside | Ex-electronics. Still thinks in signals, and lowers the noise. | I studied electronics, so I cut the noise and keep the signal. | A full sentence, same idea |
| Contact | Circuit open: nothing flows yet. Press the switch. | Circuit open. Press the switch to start an email. | Says what the switch does |
| Ask box | Try: how do you debounce a messy brief? | Try: what did electronics teach you about design? | A nudge that a real answer exists for |
| 404 | Open circuit. Nothing is connected here. | Page not found. That page isn't here. | The error is stated first; the switch is labelled "just for fun" |

Also changed: "pick a door" became "pick a question"; "signal chain" and "node" became "timeline" and "step" in the ask page copy; "Take me to the switch" became "Go to the switch"; the home page card summaries and project descriptions were tightened without changing facts.

## Vocabulary

| Use | Avoid |
| --- | --- |
| Based in | Package |
| Experience | Operating experience, Revision history |
| Focus | Core function |
| Tools | Interfaces, Bill of materials |
| Skills | Full parts list |
| Quirks, honestly | Absolute maximum ratings |
| Works best with | Recommended operating conditions |
| Timeline, step | Signal chain, node |
| Question | Door |
| Case study | Write-up, story (for a project) |
| Prototype | Build, artefact |
| Email me / email app | Mail me, mail client |
| Answers come from my notes | AI answers, chatbot |
| Mascot (Clay) | Robot, bot |

## Where the copy lives

- `src/data/quirks.ts`: datasheet, nudges, guide lines, 404, footer lines
- `src/data/home.ts`: card lines, work previews, experience, skills
- `src/data/projects.ts`: project descriptions (first sentence feeds the page meta description)
- `src/data/knowledge.ts`: Q&A answers (keep `id`, `kind`, `keys`; extend `keys` if you reword a question)
- `src/data/meta.ts`: titles and descriptions
- After editing Q&A, run the paraphrase test and make sure it still passes in full.
