# CleanStreet — Community-Powered Sanitation Reporting Platform

> **Civic Social-Impact Initiative**: A lightweight, accessible, mobile-first web application enabling neighborhood residents to document local sanitation problems (overflowing dustbins, litter, blocked drains, illegal dumping) and community coordinators to review, verify, track, and escalate them transparently.

---

## 🏛️ Civic & Social Mission

In many urban and semi-urban communities, residents encounter overflowing garbage bins, broken drainage culverts, and littered streets every day. However, individuals often face three obstacles:
1. **Lack of Documentation**: Problems are discussed informally (or on chat groups) without a central record or reference ID.
2. **Zero Status Visibility**: Residents don't know whether someone has already reported the issue, whether action is scheduled, or who is following up.
3. **Confusion About Official Channels**: Many citizens are unaware of statutory grievance mechanisms (such as the national Swachhata-MoHUA app or municipal ward numbers).

**CleanStreet bridges this gap** by providing a structured, community-level tracking platform. 

> [!IMPORTANT]
> **Civic Transparency Disclaimer**: CleanStreet is an independent community coordination tool. It does **not** claim to replace municipal grievance redressal systems, nor does it guarantee municipal action. Instead, it provides organized documentation that neighborhood committees (RWAs) can use when engaging municipal ward officers.

---

## 🚀 Key Features Implemented

### 1. Public Sanitation Reporting Form
- **Sanitation Categories**:
  - 🗑️ Garbage Overflow
  - 🚯 Litter in Public Spaces
  - 🌊 Blocked Drain / Silt / Stagnant Water
  - 🚚 Illegal Dumping (C&D debris, commercial waste)
  - ⚠️ Other Sanitation Issues
- **Privacy-Preserving Geolocation**: Residents can detect approximate coordinates (automatically rounded to ~100m for residential privacy) or simply type a nearby landmark.
- **Safe Photograph Upload**: Client-side validation strictly limits files to standard images (`image/jpeg`, `image/png`, `image/webp`) under 5 MB.
- **Urgency Classification**: Normal, High (blocks public paths), Critical (near schools, hospitals, or drinking water points).
- **Zero Mandatory Personal Disclosure**: Citizens do not have to provide phone numbers or home addresses to report.

### 2. Live Neighborhood Dashboard & Metrics
- **Summary KPI Cards**: Real-time counts of Total Reports, Awaiting Review, In Progress, and Resolved reports.
- **Multi-Filter System**: Instant filtering by problem category, status, urgency, and live keyword search (by title, landmark, or report ID).
- **Sorting**: Order by newest, oldest, or highest urgency.
- **Empty States & Guidance**: Helpful prompts when no reports match search criteria.

### 3. Status Tracking & Timestamped Audit Trail
- **Supported Statuses**:
  1. `Submitted` (Initial citizen report)
  2. `Under Review` (Inspected/acknowledged by coordinator)
  3. `Action Planned` (Sanitation workers scheduled or escalated to ward)
  4. `Resolved` (Cleaned with verification note & proof photo)
  5. `Unable to Resolve` (Requires specialized civil engineering or private property resolution)
- **Immutable Timeline**: Every change logs the timestamp, actor role (`resident` vs `coordinator`), previous status, new status, and mandatory action description.
- **Outcome Verification**: Prevents frivolous status updates by enforcing an action note and supporting optional resolution proof photographs.

### 4. Protected Coordinator Administration Portal
- **Passcode Authentication**: Access requires entering the coordinator passcode (Demo Default: `CLEAN2026`).
- **Administrative Operations**:
  - Review pending queues awaiting action.
  - Update status with mandatory transparency notes.
  - Mark duplicate submissions and cross-reference the original report ID.
  - Flag inappropriate or misleading submissions.
  - Add internal, staff-only follow-up notes (e.g., call logs with the Ward Sanitary Inspector).
  - **Export Reports to CSV**: One-click download for sharing in Ward Committee or Resident Welfare Association (RWA) meetings.

### 5. Community Awareness & Civic Guidance
- **Official Grievance Guide**: Direct verified links to the central Swachhata-MoHUA portal, CPGRAMS PGPortal, and guidance on how to find your local Municipal Corporation contact (GHMC, BBMP, etc.).
- **Waste Segregation Guide**: Visual instructions on sorting Wet Waste (Green Bin), Dry Recyclables (Blue Bin), and Domestic Hazardous/Sanitary Waste.

### 6. Bilingual Support (English & Telugu - తెలుగు)
- Full architectural support for local languages with instant toggling between **English** and **Telugu (తెలుగు)** across all categories, statuses, forms, and guidance notes.

---

## 🛠️ Technology Stack & Decisions

- **Frontend Framework**: React 18 with TypeScript for type-safety and robust component state.
- **Build Tool**: Vite 5 for instant development reloading and optimized bundling.
- **Styling**: Mobile-first responsive CSS design system with accessible contrast ratios, touch targets (≥44px), and clear focus indicators.
- **Icons**: Accessible inline SVGs and Unicode civic symbols (zero external icon dependency overhead).
- **Persistent Storage**: `StorageService` abstraction with `localStorage` persistence and realistic neighborhood seed data.

---

## 💻 Installation & Setup Instructions

### Prerequisites
- Node.js (version 18 or later recommended)
- npm or yarn

### Step 1: Install Dependencies
Open a terminal in the project directory and run:
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173` to explore CleanStreet.

### Step 3: Run Automated Verification Tests
```bash
npm test
```
This executes the automated test suite in `test-runner.js`, verifying data models, validation rules, status transitions, audit history, coordinator security, duplicate linking, and CSV export.

### Step 4: Production Build
```bash
npm run build
```
Generates production-ready, minified static files in the `dist/` directory.

---

## 🛡️ Demo Coordinator Passcode
To test administrative features (updating statuses, adding internal notes, flagging duplicates, exporting data):
- Click **"🔒 Coordinator Panel"** in the top navigation.
- Enter passcode: `CLEAN2026`

---

## 📋 What is Required Before a Real Community Can Deploy This?

Before rolling CleanStreet out to an entire neighborhood or municipal ward:
1. **Shared Multi-User Backend**:
   - The current prototype uses a structured client-side storage service (`StorageService`) with persistent browser storage.
   - For multi-resident and multi-coordinator synchronization across different devices, plug the `StorageService` methods into a lightweight backend (such as Node.js/Express + SQLite or PostgreSQL).
2. **Server-Side Authentication**:
   - Replace the demo PIN passcode with secure token-based authentication (JWT or OAuth with SMS/Email OTP) for verified resident coordinators.
3. **Cloud Storage for Images**:
   - Store high-resolution cleanup photographs in a secure object storage bucket (e.g., S3/Cloud Storage) with virus scanning and automated image downsampling.
4. **Community Moderator Team**:
   - Appoint 2–3 trusted local residents or RWA volunteers as community coordinators to review submissions daily.

---

## 🧪 How to Conduct a Small Pilot & Measure Success

### Recommended 4-Week Neighborhood Pilot Plan:
- **Week 1 (Setup)**: Select 1–2 residential streets or housing blocks (approx. 50–100 households). Print flyers with a QR code linking to the CleanStreet site.
- **Week 2 (Reporting)**: Encourage residents to log any uncollected bins or drain blockages during their morning walks.
- **Week 3 (Coordination)**: The designated coordinator reviews reports, marks any duplicates, and presents the exported CSV report to the local Ward Sanitary Inspector during their weekly rounds.
- **Week 4 (Review & Outcome Measurement)**:
  - **Metric 1 (Resolution Time)**: Measure the average number of days between `Submitted` and `Resolved`.
  - **Metric 2 (Resident Adoption)**: Count the number of unique reports submitted by community members.
  - **Metric 3 (Accountability Impact)**: Compare how many issues were acknowledged or attended to compared to prior informal word-of-mouth complaints.
