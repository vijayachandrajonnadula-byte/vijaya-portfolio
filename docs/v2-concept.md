# V2: VIJAY.md (the film)

An experiment on branch `feat/portfolio-v2-human`. The home page (`/`) is a working brief written as a file, delivered as a short film of flat coloured chapters. It takes principles from the reference (one accent, one protagonist, chapters as colours, a real article underneath, a keyboard conductor, an index of cards). It takes no text, images, code or brand from it.

## Go back to v1

- In the browser: `/classic` is the untouched v1 home. Its header links (`/classic#work`, `#about`, `#contact`) and every "see the work" link on `/ask` and the case studies point there.
- In git: `git checkout portfolio-v1-checkpoint` (tag).

## Concept

- **Form mirrors content.** The page is a design brief: headings keep their markdown marks (`#`, `##`, `###`), prompts start with `>` in mono, the title is `VIJAY.md` with a blinking caret.
- **One accent: clay `#E2705A`.** Fills only (mascot, dots, selection). Text uses the darker per-chapter variant (`--acc`), e.g. `#B3402B` on paper (5.42:1).
- **Protagonist: Clay.** In every scene, in the pose and with the prop the data gives it. Its glowing eye is the "dot" (it becomes the full stop in the sign-off).
- **Chapters are flat colours** (`src/v2/tokens.css`). Each case study owns the colour of its design system: AFS violet, PULSE blue, Electronic execution navy and green, AI workflow green, Schedule amber, CareSync plum, Renewly teal. Plus clay, warm paper and ink.
- **Type trio.** Voice: Bricolage Grotesque variable at 800 (already in `node_modules/@fontsource-variable`, lazy-loaded with the v2 chunk). Feeling: Newsreader italic for `_emotion words_` (index.html now also loads the italic cut). Machine: the system mono stack.
- **Native scroll, sticky scenes.** Each beat is a section `length` viewports tall with one sticky `100svh` stage. Progress comes from `useScroll`. No wheel or touch interception, no Lenis. Anchors, find-in-page and the scrollbar work. Page length is about 19 viewports.
- **Always a real article underneath.** One `h1`, `h2` per section, `h3` per principle. In the film it is visually hidden (read aloud, searchable, its links out of the tab order). In reading mode it is the page.
- **Reading mode.** `prefers-reduced-motion: reduce`, or `?read` in the address. A full alternative, same data and colours, no sticky scenes. "Switch to the film" removes `?read` (hidden when the system asks for reduced motion). The film has "Read the plain version".

## Colour pairs (measured, light only)

Body ink on the chapter, the dimmed (unlit) word colour, and accent text. All at least 4.5:1.

| chapter | fill | ink | ink : fill | dim : fill | accent text : fill |
| --- | --- | --- | --- | --- | --- |
| paper | `#FAF9F7` | `#17171A` | 17.0 | 4.76 | `#B3402B` 5.42 |
| clay | `#EE8670` | `#17171A` | 7.05 | 4.72 | ink 7.05 |
| violet (AFS) | `#4A2FC0` | `#FFFFFF` | 8.54 | 4.69 | `#FFC2B2` |
| pulse | `#1844C4` | `#FFFFFF` | 7.89 | 4.78 | `#FFC2B2` |
| exec | `#0F2A4A` | `#F3F0EA` | 12.73 | 4.75 | `#7BE0A8` 9.01 |
| ai | `#34C07C` | `#08170F` | 7.88 | 4.68 | ink |
| amber (Schedule) | `#F5B83D` | `#17171A` | 10.06 | 4.71 | ink |
| plum (CareSync) | `#5B2A4E` | `#FFFFFF` | 11.13 | 4.73 | `#FFB9A8` |
| teal (Renewly) | `#0B6470` | `#FFFFFF` | 6.84 | 4.70 | `#FFD0C4` |
| ink | `#17171A` | `#F3F0EA` | 15.73 | 4.74 | `#F4A090` |

`node scripts/dev/v2-contrast.mjs` (dev server on :5173, Edge installed) scrolls to every beat and prints any text node below AA (3:1 for large text). Last run: 774 text nodes, 13 chapters, 0 failures.

## Architecture

```
src/v2/
  data/brief.ts          the ONE content model (Beat[]), toMarkdown(), toPlainArticle(), lastEdited
  tokens.css, v2.css     chapter colours, type scale, all v2 styles
  film.ts                current-beat store, goTo/next/prev (native window.scrollTo)
  V2App.tsx              the page; maps beat.kind -> scene; film vs reading mode; overlays
  components/
    Beat.tsx             <Beat>, useBeat(), <Words>, <Reveal>, <Take>, <ChapterWash>, ranges()
    HUD.tsx              file pill, index pill (burger to X), breadcrumb, footer links, key hint
    IndexOverlay.tsx     circular clip-path reveal, tilted cards, roving arrows, focus trap
    RawFile.tsx          terminal window: raw markdown, copy, download (Blob), focus trap
    ReadingMode.tsx, Article.tsx   plain page; Article is also the hidden copy in the film
    useConductor.ts      keyboard conductor
    useDialog.ts         focus trap + Esc + restore focus
    bits.tsx             Caret, Grain, SkipLink
    SceneBits.tsx        ClayActor, MarkGlyph, Mark (shared by scenes)
  scenes/                TitleScene StatementScene PrincipleScene ListScene ContactScene SignoffScene, types.ts
```

Routing (`src/App.tsx`): `/` lazy-loads `V2App`; `/classic` is `HomePage`. The v1 skip link, scroll progress, cursor label, smooth-scroll switch and Guide are not mounted on `/`. The v2 page pins the light theme for the contact widget while mounted and restores the saved theme when you leave.

## Data shape

```ts
Beat { id, kind: 'title'|'statement'|'principle'|'list'|'contact'|'signoff',
  section, h2?, h2Intro?, heading, level, mark, chapter, n?, paragraphs[], prompts?, items?,
  meta?, proof?: {id,label,href}, analogy?, links?, pose, prop?, cardLine, words, length }
```

`words` and `length` are derived (length = 1.1 + words/190 viewports, clamped to 1.3 to 3). `_word_` marks an emotion word. The same data feeds the scenes, the hidden article, the reading page, the raw `.md`, the index cards and the route meta (`src/data/meta.ts` holds the `/` title and description).

## Scene contract

A scene gets `{ beat, index, total }` (`src/v2/scenes/types.ts`) and is rendered inside `<Beat>`. `useBeat()` returns three 0..1 motion values and a flag:

- `enter`: the beat arriving. The chapter colour washes in here (circle growing out of the previous colour).
- `read`: a paced reading ramp (starts while arriving, ends just before leaving). `<Words>` follows it.
- `progress`: the pinned part only. Use it for things that happen while pinned. `<Take>` follows it.
- `active`: on screen. Gate continuous animation on it.

Rules: decorative text is `aria-hidden` (the article carries the real text); real links stay focusable; fill the 100svh stage; nothing wider than 390px; no wheel or touch handling; colours come from `--bg --ink --dim --acc`.

## File ownership

- Foundation (this work): everything in `src/v2/` except the six scene files, `scripts/dev/v2-contrast.mjs`, the routing edits in `src/App.tsx`, `src/data/meta.ts`, the `/classic` link edits (`Header.tsx`, `knowledge.ts`, `Answer.tsx`, `NextProject.tsx`, `NotFoundPage.tsx`, `Guide.tsx`).
- Scene agents: `src/v2/scenes/*.tsx` only. The mapping stays in `V2App.tsx`.

## How to add a beat

1. Add a draft to `drafts` in `src/v2/data/brief.ts` (pick `kind`, `chapter`, `pose`, `cardLine`; for a principle also `n`, `analogy`, `proof: proofOf('<project id>')`).
2. If it needs a new colour, add `--bg-x --ink-x --dim-x --acc-x` and a `[data-chapter='x']` rule in `tokens.css`, add the key to `ChapterKey`, and run the contrast script.
3. If it needs a new scene, add the kind to `BeatKind`, a file in `scenes/`, and a line in `SCENES` in `V2App.tsx`.
4. Everything else (article, raw file, index card, breadcrumb, conductor) follows from the data. Keep the page under about 20 viewports (`totalViewports` in `brief.ts`).

## Keys

Space, PageDown, ArrowDown: next beat. Shift+Space, PageUp, ArrowUp: previous. Home, End: first, last. `i`: index. `r`: raw file. Esc: close. Ignored while typing, in dialogs, on key repeat, and Space is left alone on buttons and links.

## Pitfall

Never set `overflow` on `html` while the film is mounted (a scroll lock does this): it breaks `position: sticky` for every scene.
