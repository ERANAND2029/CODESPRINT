# Snap2Solve (गाजियाबाद)
> **"Snap it. Report it. Fix it."**  
> *Automated Civic Grievance Protocol with a 7-Day Statutory Escalation Clock.*  
> Built for the Civic Tech Hackathon by **Team Tech Astra, ABES Engineering College**.  
> Repository: [github.com/ERANAND2029/CODESPRINT](https://github.com/ERANAND2029/CODESPRINT)

---

## 🏛️ The Problem & Our Solution
In Indian municipalities (such as Nagar Nigam Ghaziabad), civic grievances—potholes, overflowing garbage dumps, broken streetlights, and sewer waterlogging—linger for weeks because complaints filed on generic portals lack statutory enforceability and citizen co-verification.

**Snap2Solve** transforms an ordinary smartphone snapshot into a legally-binding administrative grievance:
1. **Snap**: Citizen takes a geo-tagged photograph of the issue.
2. **AI Classification**: Vision model identifies the category (Garbage, Pothole, Lighting, Waterlogging) and maps it to governing civic bylaws (e.g. *Solid Waste Management Rules 2016, UP Municipal Corporation Act 1959*).
3. **Formal Statutory Notice**: Generates an official, bilingual (English & Hindi) municipal letter addressed to the exact Zonal Officer and Ward Engineer.
4. **7-Day Escalation Clock**: Automatically starts an uncompromising 7-day countdown. If the ward team fails to remediate the defect within 7 days, the ticket escalates directly to the Municipal Commissioner and queues a Section 6(1) RTI inquiry.
5. **Open Public Registry**: Logged on an interactive open map where neighbors can co-sign and verify before/after fixes.

---

## 🎨 Visual Identity & Design Principles
- **Aesthetic**: Municipal-notice board crossed with Indian Railways transit signage. Confident, plain, slightly gritty, high contrast.
- **Palette**:
  - Background warm grey `#E0DCD9` with subtle paper grain
  - Surface white `#FFFFFF`
  - Ink black `#141414`
  - Primary red accent `#E31E2D` (used sparingly)
  - Dark panel charcoal `#2B2F36`
  - Status indicators: Resolved `#2F7D4F`, Pending `#C98A00`, Escalated `#E31E2D`
- **Typography**: Archivo (tight, bold, condensed headers), Roboto (body), Noto Sans Devanagari (Hindi support), JetBrains Mono (complaint IDs & stamps).
- **Stamps**: Monospace badge tilted at -2.5° for statuses like `ESCALATED TO JE`, `RECEIVED · 7-DAY CLOCK STARTED`, `DAY 4 OF 7`.
- **Mobile-first**: Designed at 390px viewport width, seamlessly scaling to desktop.

---

## 🗺️ Routes & Features
- `/` – **Home Screen**: Live municipal audit counter (reported, fixed, escalated), primary "Photo kheencho / Snap a photo" action, transit-line "How it works" timeline, live mini-map preview, recent verified complaints feed.
- `/report` – **3-Step Report Flow**:
  - *Step 1: Capture*: Camera/file upload with live preview, 4 one-click hackathon test presets, GPS auto-capture, AI scanning simulation with category override.
  - *Step 2: Draft*: Paper-textured official notice letter with live English/Hindi translation toggle, editable remarks, WhatsApp (`wa.me`) and Email (`mailto`) dispatch buttons.
  - *Step 3: Done*: Animated stamp impact, permanent complaint ID (e.g. `S2S-GZB-004217`), 7-day target countdown bar.
- `/map` – **Public Interactive Map**: Fullscreen Leaflet + OpenStreetMap (no API key required), category filter chips, status filter, locality quick jump, and bottom drawer / side panel showing photos and citizen co-signers.
- `/c/[id]` – **Complaint Dossier**: Geotagged evidence photo, vertical 14-day escalation timeline (Day 0 → Day 3 → Day 7 → Day 14 RTI), formal letterhead, and **"Before / After Check"** community audit voting.
- `/wards` – **Ward Report Card**: Public municipal leaderboard ranking 8 Ghaziabad wards with grades (A+ to F), solve rates, and average days to fix.
- `/open` – **Open Data & Extensibility**: JSON schema specification for adding new cities via Pull Request, MIT License details, raw audit dataset download.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/ERANAND2029/CODESPRINT.git
cd CODESPRINT

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deploy on Render (Step-by-Step)
1. Go to **[dashboard.render.com](https://dashboard.render.com/)** and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`TejasviRana-AIML/Hackathon-Project`).
3. Render will auto-detect `render.yaml`. If configuring manually:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Node Version:** `20.18.0` (set in Environment Variables: `NODE_VERSION = 20.18.0`)
4. Click **Deploy Web Service**. Render will build and deploy the app at `https://snap2solve.onrender.com`.

---

## 🔌 Architecture & Backend Pluggability
All data operations are encapsulated in `/lib/api.ts` behind typed functions:
- `getReports(filter)`
- `getReportById(id)`
- `getWardStats()`
- `submitReport(input)`
- `detectIssueFromImage(file)`
- `confirmReportFix(id, stillBroken)`

This layer simulates realistic 600–1200ms network delay. To connect the live FastAPI backend, simply replace the internal functions in `/lib/api.ts` with your API endpoints—no UI components require modification.

---

## 👥 Authors
- **Team Tech Astra** · ABES Engineering College, Ghaziabad
- Open source under the **MIT License**.
