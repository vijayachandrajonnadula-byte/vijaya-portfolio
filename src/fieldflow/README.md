# FieldFlow — Offline-First Field Worker Task Management

> Work clearly. Prove completion.

FieldFlow is a portfolio case study and interactive prototype for a field-worker task management product. It was **designed as a native Android application** and **implemented as a mobile-first web prototype** for browser-based usability testing and portfolio demonstration.

---

## Portfolio Context

FieldFlow was designed following Android / Material Design 3 conventions: bottom navigation, status-driven primary actions, offline-first storage, checklist evidence capture, and customer signature workflows. For ease of sharing, testing, and portfolio presentation, the prototype is delivered as a responsive web application that closely reproduces native mobile interaction patterns.

**This project does not claim to be a published Android application.**

---

## Demo Credentials

| Field         | Value                  |
|---------------|------------------------|
| Employee ID   | `FF-1042`              |
| Password      | `demo123`              |

---

## Key Routes

| Path                                | Description                        |
|-------------------------------------|------------------------------------|
| `/projects/field-flow`              | Portfolio case study page          |
| `/field-flow`                       | Splash screen (auto-redirects)     |
| `/field-flow/welcome`               | Welcome / onboarding               |
| `/field-flow/login`                 | Login screen                       |
| `/field-flow/permissions`           | Device permissions setup           |
| `/field-flow/app/home`              | Technician home dashboard          |
| `/field-flow/app/tasks`             | Task list (Today / Upcoming / Done)|
| `/field-flow/app/tasks/:id`         | Task detail + status actions       |
| `/field-flow/app/tasks/:id/check-in`| GPS check-in flow                  |
| `/field-flow/app/tasks/:id/checklist`| Task checklist                    |
| `/field-flow/app/tasks/:id/evidence`| Evidence capture                  |
| `/field-flow/app/tasks/:id/materials`| Materials used                    |
| `/field-flow/app/tasks/:id/notes`   | Notes + simulated voice notes      |
| `/field-flow/app/tasks/:id/pause`   | Pause task flow                    |
| `/field-flow/app/tasks/:id/signature`| Customer signature                |
| `/field-flow/app/tasks/:id/review`  | Pre-submission review              |
| `/field-flow/app/tasks/:id/complete`| Completion screen                 |
| `/field-flow/app/scan`              | QR/barcode scanner                 |
| `/field-flow/app/activity`          | Activity timeline                  |
| `/field-flow/app/profile`           | Technician profile                 |
| `/field-flow/app/settings`          | App settings                       |
| `/field-flow/app/notifications`     | Notification centre                |
| `/field-flow/app/sync-centre`       | Offline sync queue                 |
| `/field-flow/app/supervisor`        | Supervisor simulation panel        |

---

## Technology Stack

| Layer           | Technology                                      |
|-----------------|-------------------------------------------------|
| Framework       | React 18 + TypeScript                           |
| Build           | Vite 5                                          |
| UI Library      | Material UI (MUI) v9 — Material Design 3        |
| Routing         | React Router DOM v6                             |
| State           | Zustand (with localStorage persistence)         |
| Animation       | Framer Motion                                   |
| Charts          | Recharts                                        |
| Dates           | Day.js                                          |
| Forms           | React Hook Form + Zod                           |
| Signatures      | react-signature-canvas                          |
| QR Scanning     | html5-qrcode (graceful fallback)                |
| PWA             | vite-plugin-pwa + Workbox                       |
| Icons           | MUI Icons Material                              |

---

## Features

- Complete task lifecycle: Assign → Accept → Travel → Check-in → Checklist → Evidence → Materials → Notes → Signature → Review → Submit
- Offline-first: all task data persists locally, sync queue retries on reconnect
- Location check-in with demo simulation controls
- Checklist with required/optional items, measurements, evidence linking
- Evidence capture via camera/file upload with gallery viewer
- Customer signature canvas
- QR/barcode scanner with asset lookup and demo scan buttons
- Sync centre with pending/failed/synced queue management
- Supervisor simulation panel for demo approval/rejection flows
- Dark mode + persistent theme preference
- Notification centre with unread badges
- Activity timeline grouped by date
- PWA installable — adds to home screen on Android/iOS

---

## Offline Simulation

The app includes a **Demo Controls** bar visible on the home screen and in Settings:

- Toggle "Simulate Offline" to test offline states across all screens
- The offline banner appears across the app when offline
- Checklist, notes, evidence, and materials all save locally when offline
- The Sync Centre shows the pending queue and allows manual retry

---

## Running Locally

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## Production Build

```bash
npm run build
npm run preview
```

## Deployment (Vercel)

The project includes `vercel.json` for SPA routing. Deploy by pushing to a connected GitHub repository or running `vercel deploy`.

---

## Known Limitations

- Location is simulated via browser controls, not verified server-side
- Camera uses browser `<input type="file" capture>` — not a native camera SDK
- QR scanning requires browser camera permission; demo scan buttons always available
- Signatures are stored in localStorage/Zustand, not a secure backend
- No real supervisor system — the Supervisor Panel is a demo simulation tool
- Offline sync is prototyped with timeouts; no real backend exists
- Notifications are mock data; no push notification service is connected

---

## Future Android Implementation

A production version would use:
- Kotlin + Jetpack Compose (Material 3)
- Room + WorkManager for true offline sync
- CameraX for evidence capture
- Fused Location Provider for GPS verification
- Firebase Cloud Messaging for push notifications
- Secure organisation SSO (SAML/OIDC)
- ERP/CMMS integration APIs
