# AFS Figma Screen Audit

## Phase 1 audit document
Generated: May 2026  
Case study: Account Fit Score (AFS) — Enterprise Workflow Experience

---

## Figma files inspected

| File | Key | URL |
|------|-----|-----|
| AFS (standalone) | I75uKsygnnKe12L7nMyWhq | https://www.figma.com/design/I75uKsygnnKe12L7nMyWhq/AFS |
| ZI-Projects (company file) | CcrILz2sY38eqdlBd7QiwJ | https://www.figma.com/design/CcrILz2sY38eqdlBd7QiwJ/ZI-Projects?node-id=141-5724 |

Access method: Figma MCP (claude.ai Figma, authenticated)  
Limitation: Starter plan rate limit reached after 2 screenshots. Remaining screens reconstructed from Figma metadata XML.

---

## Pages found

**AFS file (I75uKsygnnKe12L7nMyWhq):**
- Page 0:1 — AFS (single page, canvas 44523 × 19993px)

**ZI-Projects file (CcrILz2sY38eqdlBd7QiwJ):**
- Metadata too large (469,608 characters) to fully parse in this session.

---

## Canvas structure (AFS file)

The AFS canvas is organised into horizontal rows at different y-coordinate bands. Each row represents a separate configuration flow or screen group.

| Y position | Width | Screen group |
|-----------|-------|--------------|
| y=0 | 39,129px | AFS Configuration (CRM) — primary CRM flow |
| y=2318 | ~11,000px | Condition Set up, Renaming |
| y=4797 | 23,182px | AFS Configuration (CSV) — CSV data source flow |
| y=7320 | 14,291px | Default AFS — default/view-only state |
| y=9924 | varies | Change Data Source, Salesforce not integrated, Edit View, Retrain Model |

Each 1440px-wide frame within these rows represents one screen in the flow.

---

## Screen inventory (from Figma frame names)

| Frame name | Node ID | Screen type | Status |
|------------|---------|-------------|--------|
| File details 2.0 | 2003:47851 | Cover/project info | Screenshot downloaded |
| AFS (configure, CRM row) | 2003:47918 | Configuration screen | Screenshot downloaded |
| AFS (multiple screens, CRM row) | 2003:47927–48307 | Configuration steps | Metadata only |
| AFS (configure, CSV row) | 2003:48361+ | Configuration screen | Metadata only |
| AFS ready email | 2003:48166 | Email notification | Metadata only |
| Default AFS | at y=7320 | View-only state | Metadata only |
| Change Data Source | at y=9924 | Modal/action flow | Metadata only |
| Salesforce not integrated | at y=9924 | Error/info state | Metadata only |
| Edit View | at y=9924 | Edit existing config | Metadata only |
| Retrain Model | at y=9924 | Model retraining | Metadata only |
| Condition Set up | y=2318 | Condition configuration | Metadata only |
| Renaming | y=2318 | Rename AFS | Metadata only |

---

## File details frame (2003:47851) — content extracted from screenshot

From the downloaded screenshot of the project cover frame:

- **Task status:** Ready for Dev (blue badge)
- **Title:** AFS Configuration
- **Dev team:** MOS Integrations
- **Quarter:** Q4 / 2023
- **Product Team:** [anonymised in portfolio — names omitted]
- **Documentation:** Jira, PRD, Video (Slack link)
- **Overview text:** "AFS is an indication of how well an account matches to your ideal customer profile based on your past deals."

**Confidentiality notes:**
- Team member names from this frame are not included in the portfolio case study.
- Client-specific context is described at a high level only.

---

## Main AFS configure screen (2003:47918) — content from screenshot

From the downloaded screenshot (1440×790px, full fidelity):

### Platform context
- Product: **ZoomInfo Admin Portal** (logo top left)
- Workspace label: [client identifier — omitted from portfolio]
- User avatar: Top right, with notification bell and app grid

### Navigation structure (left sidebar)
```
Overview
Go-to-Market
  Set Up
    Target Accounts
    Intent
    Account Fit Score (AFS) ← active
    Buying Committees
    WebSights
    FormComplete
    Go-to-Market Plays
  General
    Analytics
    User Management
    Configurations
    Privacy
    Integrations
    Enrich
```

### Page content
- **Breadcrumb:** Account Fit Score (AFS) / Configure
- **Section title:** Configure Account Fit Score (AFS)
- **Description:** "Account Fit Score predicts how well an account matches your ideal customer profile using CRM deal data and our advanced firmographics."
- **CRM Object and Conditions** (section label)
  - Radio: Account Object (selected) | Opportunity Object
  - Help link: "How to add/edit conditions?"
  - Blue info banner: "This is a default condition. You can edit or add more conditions as required." [X dismiss]
  - Condition row: [Account Type] [Is] [Customer] with "..." context menu
  - "+ Add Condition" with "1/10 conditions added"
  - Toggle: "Auto-update AFS model" with (i) info icon
- **Actions (top right):** Cancel (outline) | Save Configuration (blue filled)

---

## Screen type audit table

| Screen / Figma frame | What it appears to do | Screen type | Main components | User goal | Portfolio use | Confidentiality notes |
|---------------------|----------------------|-------------|-----------------|-----------|---------------|----------------------|
| File details 2.0 | Project cover with status, team, docs | Cover/info | Status badge, team list, doc links | N/A (designer artefact) | Reference only, not shown | Team names omitted, client context generalised |
| Configure AFS (CRM) | Main CRM-based scoring configuration | Configuration screen | Left nav, breadcrumb, radio group, condition builder, toggle, action buttons | Define scoring conditions using CRM data | Hero image, screen walkthrough | Client workspace identifier visible, noted in case study |
| Configure AFS (CSV) | CSV-based scoring configuration | Configuration screen | Left nav, file upload interface | Configure scoring from uploaded CSV | Described only (screenshot pending) | Same as CRM screen |
| Condition Set up | Manage individual conditions | Form/action flow | Condition builder, add/edit/remove | Add and configure scoring conditions | Described in wireframe reconstruction | None specifically identified |
| Default AFS | View default configuration state | Detail page | Read-only condition display | Understand default before customising | Described only | None specifically identified |
| Change Data Source | Switch between CRM and CSV | Modal/action flow | Option cards, confirmation step | Change the data powering the model | Wireframe reconstruction | None specifically identified |
| Salesforce not integrated | Error state when CRM not connected | Empty/error state | Error message, resolution CTA | Understand why CRM path is unavailable | Wireframe reconstruction | None specifically identified |
| Edit View | Edit existing configuration | Form/action flow | Condition builder in edit mode | Modify existing scoring conditions | Described only | None specifically identified |
| Retrain Model | Trigger model retraining | Action flow | Retraining status, confirm action | Refresh model with updated conditions | Wireframe reconstruction | None specifically identified |
| Renaming | Rename the AFS configuration | Modal/action flow | Text input, confirm | Change the name of the AFS | Described only | None specifically identified |
| AFS ready email | Email notification when model is ready | Email template | ZoomInfo header, body text, CTA | Close feedback loop on async training | Described in screen walkthrough | Company contact data visible in email preview — omitted |

---

## Navigation patterns identified

1. **Left sidebar with section collapse** — Go-to-Market expands to show Set Up and General sub-sections. Each sub-section collapses independently.
2. **Breadcrumb in page header** — Two-level path (Section / Current action) visible on all configure screens.
3. **Row actions** — "..." contextual menu on condition rows for edit/delete operations.
4. **Inline add pattern** — "+Add Condition" lives inline within the form, not as a separate page or modal.
5. **Action buttons top-right** — Cancel/Save pair positioned in the header area of the configure section, not at page bottom.

---

## Repeated components

From the visible screen and metadata analysis:

- Left sidebar navigation (consistent across all AFS screens)
- Breadcrumb header (Account Fit Score (AFS) / [step])
- Condition row pattern: [Field] [Operator] [Value] + "..." menu
- Blue info banner (dismissible)
- Toggle switch with label + info icon
- Radio group (horizontal, two options)
- Action button pair (Cancel outline + CTA filled)
- Avatar/notification/grid cluster (top right header, persistent)
- Status badge (Ready for Dev on cover frame)
- "Table" component (appears in some AFS screens for data display, from metadata)

---

## Data display patterns

- Condition table: Tag-style chips showing field/operator/value in a row
- Add counter: "1/10 conditions added" — shows progress against a constraint limit
- Status badge: Coloured tag for task/feature status

---

## Possible workflow (reconstructed from screen names and layout)

```
First-time setup:
Admin Portal → Go-to-Market → Set Up → Account Fit Score (AFS)
→ Choose data source (CRM / CSV)
  → [CRM] Select Account/Opportunity Object → Add/edit conditions → Toggle auto-update → Save
  → [CSV] Upload file → Map columns → Save
→ Model trains (async)
→ AFS ready email notification
→ Return to AFS → scores active

Returning user (modify):
AFS → Edit View → Modify conditions → Save / Retrain Model → AFS ready email
```

---

## Sensitive / confidential items to anonymise

| Item | Location | Treatment |
|------|----------|-----------|
| Client workspace name | Top left of configure screen, below "Admin Portal" | Noted in case study confidentiality section, not blurred digitally |
| Team member names | File details 2.0 frame | Omitted from case study entirely |
| Jira/PRD/Video links | File details 2.0 frame | Not linked or reproduced |
| Specific condition values | Condition row shows [Account Type] [Is] [Customer] | Included as representative example, not business-sensitive |
| Specific scoring weights/model logic | Not visible in UI | Not applicable |

---

## Images downloaded

| File | Path | Source |
|------|------|--------|
| afs-file-details.png | public/images/projects/afs/screens/afs-file-details.png | Figma MCP screenshot, node 2003:47851 |
| afs-screen-01.png | public/images/projects/afs/screens/afs-screen-01.png | Figma MCP screenshot, node 2003:47918 |
| afs-cover.png | public/images/projects/afs/afs-cover.png | Copy of afs-screen-01.png for project card |

---

## Missing details and assumptions

1. **CSV flow screens** — Inferred from screen name "AFS Configuration (CSV)". Actual layout assumed to follow same shell as CRM screen with file upload replacing condition builder.
2. **Change Data Source** — Assumed to be a modal or step-based flow based on the name. Layout reconstructed as wireframe.
3. **Retrain Model** — Assumed to show retraining confirmation and status. Wireframe reconstruction based on standard enterprise async-action patterns.
4. **Salesforce not integrated** — Assumed to be an error/guidance state with a CTA to resolve the integration gap.
5. **Exact token values** — Hex colours and spacing values not extracted. Described at a pattern level.
6. **Original wireframes** — Not available. Wireframes in case study are reconstructed from final screens.
7. **Research artefacts** — Not available. Problem framing based on visible product description text.

---

*Audit created from Figma MCP tools (get_metadata, get_screenshot) and metadata file analysis.*
