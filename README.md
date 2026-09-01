# FieldMind AI

> AI help for people who fix things.

FieldMind AI is an AI copilot for field workers who diagnose, repair, maintain, and service physical equipment on-site.

When a technician arrives at a job site to fix a broken machine, they often face complex mechanical or electrical faults. Finding the exact repair procedure usually requires searching through hundreds of pages of equipment manuals, looking up cryptic fault codes, or calling a senior technician for guidance.

FieldMind brings technical intelligence directly into the field worker's hands. By capturing equipment details, photos, or error codes, the worker receives structured AI diagnosis, step-by-step repair checklists, and automatic service report generation—enabling faster, safer, and higher-quality field repairs.

---

## 1. The Problem

A machine or critical piece of equipment fails on-site.

The field worker has to figure out what is wrong, identify the root cause, and complete the repair safely and efficiently. Today, the information needed to solve the problem is fragmented across:

- Lengthy 200+ page manufacturer PDF manuals that are hard to navigate on mobile devices.
- Unclear alphanumeric error and alarm codes that differ by model, manufacturer, and firmware revision.
- Worn, unreadable equipment nameplates and complex wiring schematics.
- Past maintenance notes and service histories locked in separate back-office databases.
- Unwritten technician experience and specialized tribal knowledge.

Searching for the right answer takes time. The field worker is standing beside the machine and needs immediate, accurate, and actionable guidance without delay.

---

## 2. The Solution

FieldMind AI is an AI copilot that stays with the field worker throughout the entire service job.

Instead of acting as a generic question-and-answer chatbot, FieldMind supports the full operational workflow:

$$\text{Show the Problem} \longrightarrow \text{Understand Context} \longrightarrow \text{Find Knowledge} \longrightarrow \text{Diagnose} \longrightarrow \text{Guide} \longrightarrow \text{Verify} \longrightarrow \text{Report}$$

FieldMind helps a field worker go from a physical equipment problem to a completed service job.

---

## 3. How FieldMind Works

### Step 1 — Capture
The field worker captures the problem on-site using the available application inputs:
- Equipment model selection or nameplate inspection.
- Fault or alarm codes (e.g., `E01` through `E10`).
- Component photos (e.g., damaged compressor terminals, clogged condenser coils, loose drive belts).
- Natural language symptom descriptions and observations.
- Voice query input (supported in the Android application).

### Step 2 — Understand
FieldMind processes the visual symptoms, error code, unit specifications, and technician notes to understand the exact operating context of the machine.

### Step 3 — Find
FieldMind searches its technical knowledge base and equipment documentation to retrieve manufacturer specifications, fault code tables, and safety warnings.

### Step 4 — Diagnose
FieldMind evaluates the symptoms against known failure modes, determines the most probable root cause, computes a diagnostic confidence score, and checks for critical safety hazards (such as OSHA Lock-Out / Tag-Out requirements).

### Step 5 — Guide
FieldMind provides structured, sequential repair steps. Each step details the required physical action, essential tools (e.g., True-RMS Multimeter, digital manifold gauges), and specific manufacturer manual citations.

### Step 6 — Verify
The field worker reviews and verifies the recommendations.

> **Safety Standard**: AI assists. The trained worker remains responsible for the physical work, safety protocols, and final repair decisions.

### Step 7 — Report
FieldMind synthesizes completed repair steps, measured operating telemetry (e.g., Delta-T, motor amp draw, refrigerant subcooling), replaced parts, and technician notes into a standardized commercial service report ready for supervisor review and PDF export.

### Step 8 — Offline / Limited Connectivity
FieldMind provides deterministic local knowledge fallbacks and safety guardrails when offline. When cloud connectivity is unavailable, the application serves verified baseline procedures from local data and enforces safety holds if data is insufficient.

---

## 4. Complete Workflow

```
       ┌────────────────────────┐
       │        PROBLEM         │
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │        CAPTURE         │  • Photo, Error Code, Model, Voice
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │       UNDERSTAND       │  • Operating Context & Symptom Analysis
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │          FIND          │  • Technical Manuals & Fault Matrices
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │        DIAGNOSE        │  • Probable Root Cause & Safety Alerts
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │         GUIDE          │  • Step-by-Step Actions & Tool List
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │         VERIFY         │  • Physical Checks & Telemetry Readings
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │         REPORT         │  • Structured Ticket & PDF Generation
       └───────────┬────────────┘
                   ▼
┌──────────────────────────────────────┐
│  SYNC / CONTINUE OFFLINE (WHERE SUPPORTED) │
└──────────────────────────────────────┘
```

> **From a broken machine to a completed service job.**

---

## 5. Key Features

- **AI Equipment Diagnosis**: Server-side diagnostic engine powered by Gemini 3.7 Flash using JSON Schema mode to generate root cause analysis, confidence ratings, and safety warnings.
- **Multimodal & Image Analysis**: Photo upload and optical symptom inspection with sample failure state presets (e.g., coil blockages, terminal burns, belt wear).
- **Error-Code Diagnosis**: Rapid lookup and fault tree resolution for industrial and commercial alarm codes (`E01`–`E10`).
- **Interactive AI Copilot**: Context-aware slide-out chat drawer that dynamically injects active equipment context, error codes, and step indices into technician conversations.
- **Technical Knowledge Retrieval**: Grounded documentation references linking diagnostic steps directly to manufacturer manual sections and excerpt quotations.
- **Step-by-Step Diagnostic Guidance**: Sequential repair checklists with explicit tool requirements and safety instructions.
- **Service Report Generation**: Automated AI compilation of completed checklist steps, telemetry snapshots, parts replaced, and technician notes.
- **Technician Workspace**: Web and mobile interface for managing assigned dispatch jobs and progressing through the 6-step guided diagnostic flow.
- **Supervisor Dashboard**: Central management portal for reviewing submitted field tickets, verifying telemetry readings, and recording supervisor sign-offs.
- **Job & Report Management**: In-memory REST API data layer for creating, filtering, updating, and exporting service tickets.
- **Diagnostic Benchmark Test Suite**: Built-in automated test runner that verifies all 10 HVAC error codes against the diagnostic pipeline with real-time pass/fail validation.
- **Offline / Local Data Support**: Deterministic fallback engine that serves verified procedures and safety warnings without requiring an active cloud connection.
- **Camera Scanning & Voice Input**: Mobile interfaces in the Android app for capturing equipment photos and speaking natural language queries.

---

## 6. Why FieldMind Is Different

> Most AI tools give you an answer. FieldMind is designed to help a field worker complete a job.

FieldMind connects the entire field repair lifecycle rather than stopping at a conversational text response:

$$\begin{matrix} \textbf{AI Assistance} \\ + \\ \textbf{Technical Knowledge} \\ + \\ \textbf{Field Workflow} \\ + \\ \textbf{Step-by-Step Guidance} \\ + \\ \textbf{Service Documentation} \end{matrix}$$

Instead of giving a technician a block of generic advice, FieldMind keeps the technician organized, grounded in OEM data, safe from equipment hazards, and documented for billing and compliance.

---

## 7. Who Is It For?

### Current Use Case: Commercial & Residential HVAC
HVAC is the starting demonstration use case. FieldMind models commercial rooftop units (RTUs), modular chillers, central air handling units (AHUs), VRF heat recovery systems, and VAV terminal boxes to illustrate complex diagnostic workflows, thermal calculations, and electrical checks.

### Future Expansion: Broader Field-Service Industries
The underlying diagnostic and reporting workflow extends directly to any equipment-centric field service domain:
- **Electrical & Power Distribution**: Switchgear, transformers, MCC panels, and motor starters.
- **Industrial Maintenance & Automation**: PLC cabinets, hydraulic pumps, pneumatic lines, and conveyor drives.
- **Commercial Machinery & Refrigeration**: Supermarket rack systems, walk-in coolers, and industrial compressors.
- **Automotive & Heavy Equipment**: Fleet diesel diagnostics, agricultural machinery, and hydraulic excavators.
- **Manufacturing Plant Operations**: CNC machines, robotic cells, injection molding systems, and air compressors.

---

## 8. Offline-First / Field-Ready Design

Field work does not always happen with a reliable internet connection. Technicians frequently work in basements, reinforced mechanical rooms, remote substations, and rooftop enclosures where cellular connectivity is intermittent or unavailable.

```
ONLINE MODE:
Problem → Gemini Cloud AI Reasoning → Dynamic Guidance → Report Generation

LIMITED CONNECTIVITY MODE:
Problem → Deterministic Local Knowledge → Safety Hold Verification → Local Session State → Resume / Sync
```

### What Is Currently Implemented:
- **Deterministic Local Fallback**: When running without an internet connection or without a Gemini API key, the server uses a built-in technical knowledge base to provide verified baseline procedures, tool requirements, and safety warnings.
- **Zero-Assumption Safety Holds**: If offline input lacks sufficient equipment data, FieldMind refuses to guess and directs the worker to verify physical nameplates and schematics.
- **Session State Persistence**: All job updates, checklists, and generated reports persist in memory during the active session, allowing uninterrupted navigation across technician and supervisor views.

*(Note: Live generative AI reasoning with Gemini requires an active internet connection).*

---

## 9. Application Workflow

A field technician uses FieldMind through a straightforward 10-step workflow:

1. **Open FieldMind**: Launch the web dashboard or Android mobile app.
2. **Select Assigned Job**: Choose an active ticket from the dispatch queue or start a new diagnostic session.
3. **Capture Equipment Data**: Select the equipment model or take a photo of the unit nameplate/component.
4. **Enter Error or Problem**: Select or scan the alarm code (e.g., `E04`) or enter observed symptoms.
5. **Run AI Diagnosis**: Generate structured root-cause analysis, confidence score, and OSHA safety warnings.
6. **Review Technical Guidance**: Check required tools and read citations from the OEM manual.
7. **Consult AI Copilot**: Ask follow-up questions in the slide-out chat drawer with automatic equipment context.
8. **Complete & Verify Steps**: Check off sequential repair tasks and record live telemetry readings.
9. **Generate Service Report**: Click to synthesize all diagnostic findings, replaced parts, and notes into a formal report.
10. **Review in Supervisor Portal**: Dispatchers and supervisors review the submitted report and sign off on completion.

---

## 10. Android Application

The `/android` directory contains a native Android application built with modern Kotlin and Jetpack Compose:

- **Home Screen (`HomeScreen.kt`)**: Displays active service jobs, urgent alerts, equipment quick-selectors, and quick diagnostic actions.
- **Diagnosis Screen (`DiagnosisScreen.kt`)**: Implements the step-by-step diagnostic flow with root cause cards, confidence badges, and guided checklists.
- **Scan Screen (`ScanScreen.kt`)**: Utilizes CameraX for photographing equipment nameplates, error displays, and damaged components.
- **Voice Assistant Screen (`VoiceAssistantScreen.kt`)**: Enables hands-free voice interaction for technicians wearing work gloves.
- **AI Copilot Drawer (`AiAssistantRepository.kt`)**: Connects to the diagnostic backend for contextual technical assistance.
- **Reports Screen**: Displays past service records and job completion summaries.
- **Settings Screen (`SettingsScreen.kt`)**: Configures API endpoints and offline fallback preferences.

---

## 11. Web Dashboard

The web application provides a responsive workspace for field technicians and back-office supervisors:

- **Technician Workspace (`TechnicianDashboard.tsx`)**:
  - Filterable dispatch job list (`All`, `Pending`, `In Progress`, `Completed`).
  - Emergency priority badges (`Critical`, `High`, `Medium`, `Low`).
  - Automated 10-case diagnostic benchmark runner.
- **6-Step Guided Diagnosis Flow (`DiagnosisFlow.tsx`)**:
  - Optical inspection with sample failure presets.
  - Alphanumeric alarm code selector with safety guardrails.
  - Root cause breakdown with OEM manual excerpts.
  - Interactive repair checklist and telemetry recorder.
- **Supervisor Portal (`SupervisorDashboard.tsx`)**:
  - Fleet-wide dispatch queue and technician assignment view.
  - Comprehensive service report inspector with full telemetry logs.
  - Supervisor sign-off toggle and one-click demo data reset.
- **Service Report Modal (`ServiceReportModal.tsx`)**:
  - Clean commercial service report layout with print/PDF styling.

---

## 12. AI Architecture

FieldMind uses a structured, safety-first AI pipeline:

```
Technician Input (Photo + Model + Alarm Code + Notes)
                      ↓
           FieldMind Express Backend
                      ↓
  Grounding Context (OEM Manuals & Fault Tables)
                      ↓
   Google Gemini 3.7 Flash (@google/genai SDK)
                      ↓
   JSON Schema Mode (Strict Structured Output)
                      ↓
Validated Diagnostic Object (Root Cause, Steps, Tools, Safety Warnings)
```

- **Model**: `gemini-3.7-flash` via the official `@google/genai` TypeScript SDK.
- **JSON Schema Enforcement**: Guarantees that AI outputs match strict TypeScript interfaces (`DiagnosticResult`, `ServiceReport`).
- **Insufficient Information Guardrails**: Triggers a safety hold when provided information is ambiguous or unverified, preventing hallucinations on dangerous physical equipment.

---

## 13. Knowledge Base

FieldMind grounds its AI reasoning with curated technical data:

- **Simulated OEM Equipment Profiles**: Detailed specifications, cooling capacities, refrigerant types, electrical ratings, and maintenance schedules for commercial equipment (e.g., *TitanAir RTU-10X*, *AquaPulse Chiller 300*, *AeroVent AHU-05*, *Vortex VRF-HeatRecovery*, *ZoneMaster VAV-Box*).
- **Error Code Registry (`E01`–`E10`)**: Standardized fault code matrices covering high-pressure cutouts, low superheat, sensor faults, compressor thermal overloads, inverter DC link errors, and flame failures.
- **Manual Citations & Required Tools**: Exact section references (e.g., Section 4.2.1, Section 8.3) and specific tool requirements (e.g., 500V Megohmmeter, Dual-Port Digital Manometer).
- **Sample Inspection Presets**: Visual inspection samples covering common physical failure modes.

---

## 14. Technology Stack

### Android
- **Language**: Kotlin
- **UI Toolkit**: Jetpack Compose
- **Camera**: CameraX API
- **Architecture**: MVVM with Repository Pattern
- **Target Platform**: Android SDK 26+

### Web Frontend
- **Framework**: React 19 (`react`, `react-dom`)
- **Language**: TypeScript (~5.8)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animations**: Motion (`motion/react`)
- **Icons**: Lucide React (`lucide-react`)
- **Build Tool**: Vite 6

### Backend & Server
- **Runtime**: Node.js (TypeScript)
- **Framework**: Express 4.21
- **Dev Runner**: `tsx`
- **Production Bundler**: `esbuild` (standalone `dist/server.cjs`)
- **Configuration**: `dotenv`

### AI & Reasoning
- **SDK**: Google GenAI SDK (`@google/genai` v2.4.0)
- **Model**: `gemini-3.7-flash`
- **Output Mode**: Structured Outputs via JSON Schema

### Data Layer
- **Knowledge Base**: Curated OEM fault matrices and technical specifications (`src/data/knowledgeBase.ts`)
- **State Store**: In-memory job queue and service report store with RESTful CRUD endpoints (`src/data/sampleJobs.ts`)

### Build & Deployment
- **Architecture**: Single-container Cloud Run deployment serving both backend API routes and static frontend assets on port 3000.

---

## 15. API

The Express server exposes the following verified REST API endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and Gemini API connectivity check |
| `GET` | `/api/equipment` | Retrieve simulated equipment profiles |
| `GET` | `/api/error-codes` | Retrieve simulated error code registry (`E01`–`E10`) |
| `GET` | `/api/sample-photos` | Retrieve preset optical inspection samples |
| `GET` | `/api/jobs` | List all active and completed dispatch jobs |
| `POST` | `/api/jobs` | Create a new dispatch job |
| `PUT` | `/api/jobs/:id` | Update an existing job's status or details |
| `GET` | `/api/reports` | List all submitted service reports |
| `POST` | `/api/reports` | Save and store a new service report |
| `POST` | `/api/diagnose` | Execute the structured AI diagnostic reasoning pipeline |
| `POST` | `/api/chat` | Interactive AI copilot chat with equipment context |
| `POST` | `/api/generate-report` | AI service report generator from completed steps |
| `GET` | `/api/test-diagnostic-pipeline` | Run automated 10-case benchmark test suite |
| `POST` | `/api/reset-demo` | Reset jobs and reports store to initial demo state |

---

## 16. Project Structure

```
FieldMind-AI/
├── .env.example              # Environment variable template
├── .gitignore                # Git ignore configuration
├── index.html                # HTML entry point
├── metadata.json             # Applet metadata and capabilities
├── package.json              # Web & server dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite bundler configuration
├── server.ts                 # Express API server and static asset serving
├── android/                  # Native Android application
│   ├── app/                  # Android application module (Kotlin / Compose)
│   │   └── src/main/java/    # Android source code & screens
│   ├── build.gradle.kts      # Android Gradle build script
│   └── settings.gradle.kts   # Android Gradle settings
├── server/
│   └── geminiService.ts      # Gemini AI diagnostic engine & test suite
└── src/
    ├── main.tsx              # React application entry point
    ├── App.tsx               # Main routing and modal state coordinator
    ├── types.ts              # TypeScript interfaces and data models
    ├── index.css             # Tailwind CSS global styles
    ├── data/
    │   ├── knowledgeBase.ts  # OEM equipment data and error code registry
    │   └── sampleJobs.ts     # Dispatch jobs and initial service reports
    └── components/
        ├── LandingPage.tsx          # Product overview and demo launcher
        ├── TechnicianDashboard.tsx  # Technician job queue and benchmark runner
        ├── DiagnosisFlow.tsx        # 6-step guided diagnostic procedure
        ├── AiChatDrawer.tsx         # Slide-out interactive AI copilot
        ├── SupervisorDashboard.tsx  # Supervisor review queue and approvals
        ├── ServiceReportModal.tsx   # Printable service ticket modal
        └── Navbar.tsx               # Top navigation bar
```

---

## 17. Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **bun**
- **Google Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/) *(optional for local fallback mode, required for live AI reasoning)*

### Clone Repository
```bash
git clone https://github.com/atharvanavgire10/FieldMind-AI.git
cd FieldMind-AI
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Security Note**: Never commit your `.env` file or real API keys to version control. The `.env` file is excluded in `.gitignore`.

### Run Development Server
```bash
npm run dev
```
The application will start at `http://localhost:3000`.

### Android Setup (Optional)
Open the `/android` directory in **Android Studio** (Hedgehog or newer), sync Gradle dependencies, and run on an Android device or emulator running SDK 26+.

---

## 18. Environment Variables

Create `.env` using `.env.example`:

```env
# Required for live server-side Gemini AI features
GEMINI_API_KEY=your_gemini_api_key_here
```

- For Android development, environment settings can be placed in `android/.env.example` as needed.
- **Never commit your `.env` file or API keys to GitHub.**

---

## 19. Production Build / Deployment

FieldMind is structured for single-command production compilation:

```bash
# Compile frontend assets and bundle the backend server with esbuild
npm run build

# Launch production server
npm start
```

The production build generates static web assets in `dist/` and a standalone CommonJS backend bundle at `dist/server.cjs`.

---

## 20. Demo

Experience the full technician workflow:

1. **Open FieldMind** at `http://localhost:3000` and click **"Launch Demo Flow"**.
2. **Select Equipment**: Choose sample photo *Compressor Overload Terminal*, select unit **TitanAir RTU-10X**, and pick Alarm **E04 (Compressor High Thermal Trip)**.
3. **Run Diagnosis**: Click **"Run AI Diagnostic Reasoning"** to review root cause analysis and OSHA warnings.
4. **Review Guidance**: Check the required tools and cited OEM manual sections.
5. **Ask AI Copilot**: Open the chat drawer and ask for specific multimeter test points.
6. **Verify Steps & Telemetry**: Check off the guided repair steps and verify operating readings.
7. **Generate Report**: Create the final service ticket and submit it.
8. **Supervisor Approval**: Switch to the Supervisor Dashboard to review and sign off.

---

## 21. Safety and Limitations

- **Assistive Tool Only**: FieldMind AI provides operational assistance and does not replace certified professional training.
- **Physical Safety Hazards**: Working on physical equipment involves high-voltage electricity, pressurized refrigerants, rotating machinery, and combustible gases. Technicians must always observe OSHA 1910.147 Lock-Out / Tag-Out (LOTO) procedures.
- **Manufacturer Documentation Precedence**: AI recommendations must never override official manufacturer service manuals or engineering bulletins.
- **Image & Sensor Limits**: Optical analysis can be influenced by lighting conditions, camera angles, or obscured nameplates.
- **Connectivity Requirements**: Real-time generative reasoning requires an active connection to the Gemini API. Offline mode uses preloaded rule-based data and safety holds.

---

## 22. Current Status

### Implemented (MVP)
- [x] Full-stack web application (React 19, TypeScript, Tailwind CSS v4).
- [x] Express backend with Gemini 3.7 Flash diagnostic pipeline.
- [x] 6-step guided diagnostic flow from photo capture to report.
- [x] Simulated OEM knowledge base with 5 commercial equipment profiles and 10 alarm codes.
- [x] Contextual slide-out AI copilot drawer.
- [x] Automated AI service report generation with print/PDF styling.
- [x] Supervisor dispatch hub with report inspection and sign-off.
- [x] Automated 10-case diagnostic benchmark test suite (`/api/test-diagnostic-pipeline`).
- [x] Deterministic local fallback and Insufficient Information safety guardrails.
- [x] Native Android mobile architecture in `/android` (Kotlin, Jetpack Compose, CameraX).

### Planned
- [ ] On-device Small Language Models (SLMs) for local inference directly on mobile hardware.
- [ ] Dynamic RAG pipeline ingesting real-world OEM PDF manuals via vector search.
- [ ] Bluetooth / BLE telemetry ingestion from digital gauges, clamp meters, and thermal cameras.
- [ ] Voice-to-text / speech interface for hands-free operation in noisy field environments.
- [ ] Bi-directional sync between Android mobile local storage and cloud database.

---

## 23. Roadmap

- **Phase 1 (Current MVP)**: Full-stack diagnostic pipeline, guided repair workflow, supervisor portal, simulated OEM knowledge base, and automated report generation.
- **Phase 2 (Advanced AI & Retrieval)**: Dynamic multi-document RAG with PDF manual parsing, vector search, and hands-free voice interaction.
- **Phase 3 (Physical Integration)**: Direct BLE connectivity with digital field tools (multimeters, pressure gauges) and IoT building automation systems (BAS).
- **Phase 4 (Enterprise Integration)**: Field-service management system integrations (ServiceTitan, ProCore, SAP FSM) and augmented reality (AR) schematic overlays.

---

## 24. Vision

> Start with HVAC. Build for every field worker.

FieldMind aims to bring accessible technical intelligence to everyone who works with physical equipment, wherever the job takes them.

**AI expertise in the field — wherever the work takes you.**

---

## Disclaimer

FieldMind AI is a prototype designed for demonstration and assistive purposes. It does not replace certified professional judgment, official manufacturer documentation, or standard safety procedures. Always follow all applicable safety codes, electrical isolation standards (OSHA 1910.147 LOTO), and environmental regulations.
