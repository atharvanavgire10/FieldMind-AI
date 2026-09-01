# FieldMind AI

> **AI help for people who fix things.**

<div align="center">
  <img src="docs/screenshots/hero.jpg" alt="FieldMind AI Technician Copilot" width="800px" style="border-radius: 12px; margin: 16px 0;" />
</div>

FieldMind AI is an on-site AI copilot for field workers who diagnose, repair, maintain, and service physical equipment.

```
Problem ──▶ Capture ──▶ Understand ──▶ Find ──▶ Diagnose ──▶ Guide ──▶ Verify ──▶ Report
```

When critical machinery breaks down, technicians often have to flip through 200+ page manuals, decode cryptic error codes, or wait for senior phone support. FieldMind puts technical intelligence directly into the technician's pocket—guiding them from visual symptom capture to step-by-step repair and automated service documentation.

---

## The Problem

Field technicians stand directly in front of malfunctioning equipment under tight deadlines. Finding the right fix is slow and fragmented:

- **Buried Knowledge**: Crucial troubleshooting procedures are hidden inside dense PDF manuals.
- **Cryptic Alarms**: Alphanumeric error codes vary across models, revisions, and manufacturers.
- **Worn Identification**: Damaged nameplates and complex wiring diagrams slow down identification.
- **Disconnected Records**: Past service history and technician notes are locked away in back-office systems.

Searching for answers takes valuable time while critical equipment remains offline.

---

## The Solution

**FieldMind puts an AI copilot in the field worker's pocket.**

FieldMind is not just a question-and-answer chatbot—it is an end-to-end operational copilot built for physical field service:

- **Captures** equipment symptoms via photos, fault codes, model selectors, and voice input.
- **Grounds** diagnostic reasoning in verified manufacturer manuals, fault trees, and safety specifications.
- **Guides** technicians through structured, sequential repair checklists with required tools.
- **Enforces Safety** with mandatory Lock-Out / Tag-Out (LOTO) alerts and zero-assumption guardrails.
- **Generates** commercial service reports automatically upon job completion.

> *FieldMind helps a field worker go from a physical equipment problem to a completed service job.*

---

## How FieldMind Works

```
       ┌────────────────────────┐
       │        PROBLEM         │  Equipment fails on-site
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │        CAPTURE         │  Photo, Model, Alarm Code, Voice, or Notes
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │       UNDERSTAND       │  Synthesizes operating context & symptoms
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │          FIND          │  Retrieves OEM specs, wiring data & fault matrices
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │        DIAGNOSE        │  AI reasoning determines root cause & confidence
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │         GUIDE          │  Actionable repair checklist with required tools
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │         VERIFY         │  Technician confirms readings (Delta-T, Amps, PSI)
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │         REPORT         │  Auto-generates signed service ticket & PDF
       └───────────┬────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  OFFLINE WORKFLOW & LOCAL RECOVERY   │  Local knowledge fallback when disconnected
└──────────────────────────────────────┘
```

### 1. Capture
The worker captures the issue on-site using the mobile app or web workspace: select the machine model, snap a component photo, pick an alarm code (e.g., `E04`), or describe symptoms via voice/text.

### 2. Understand
FieldMind correlates the visual inspection, alarm code, unit specifications, and technician observations to establish full equipment context.

### 3. Find
The system retrieves relevant technical specifications, fault tables, and safety warnings from its equipment knowledge base.

### 4. Diagnose
The AI reasoning engine evaluates symptoms against known failure modes, computes a diagnostic confidence score, pinpoints probable root causes, and issues OSHA safety alerts.

### 5. Guide
FieldMind presents an actionable, step-by-step repair procedure detailing required physical tasks, cited manual sections, and needed tools (e.g., True-RMS Multimeter, digital manifold gauges).

### 6. Verify
The technician performs physical checks, measures operating telemetry, and confirms safe operation.
> *AI assists. The trained worker remains responsible for physical work, safety protocols, and final repair decisions.*

### 7. Report
With one click, FieldMind synthesizes completed checklist steps, verified telemetry readings, replaced parts, and technician notes into a standardized commercial service ticket.

---

## Why FieldMind?

> **Most AI tools give you an answer. FieldMind is designed to help a field worker complete a job.**

```
   ┌────────────────────────────────────────────────────────┐
   │                     FIELDMIND AI                       │
   │                                                        │
   │   AI Assistance          Technical Knowledge           │
   │         +                         +                    │
   │   Field Workflow         Step-by-Step Guidance         │
   │                           +                            │
   │                 Service Documentation                  │
   └────────────────────────────────────────────────────────┘
```

- **Workflow-Driven**: Connects initial fault capture to final signed ticket without switching apps.
- **Safety-First**: Halts recommendations with safety holds when equipment data is ambiguous.
- **Grounded in OEM Data**: Every diagnostic step cites specific manual sections and required tooling.
- **Human-in-the-Loop**: The certified technician verifies all telemetry and retains physical authority.

---

## Built for the Field

Field work frequently occurs in basements, mechanical rooms, remote substations, and rooftops with poor or nonexistent cellular connectivity.

```
ONLINE MODE:
Problem ──▶ Gemini 3.7 Flash Cloud Reasoning ──▶ Dynamic Guidance ──▶ AI Report

LIMITED CONNECTIVITY MODE:
Problem ──▶ Local Knowledge Fallback ──▶ Safety Guardrails ──▶ In-Session State
```

- **Deterministic Local Fallback**: If internet connectivity or Gemini API access is unavailable, FieldMind serves verified baseline procedures, tool requirements, and safety warnings from local knowledge.
- **Zero-Assumption Safety Holds**: When disconnected and inputs lack sufficient model data, FieldMind refuses to guess and directs technicians to verify physical nameplates.
- **In-Session State Retention**: Active job checklists, recorded measurements, and draft reports stay preserved locally during field sessions.

*(Note: Live generative AI reasoning via Gemini requires an active network connection).*

---

## Key Features

| Feature | Description |
| :--- | :--- |
| **AI Equipment Diagnosis** | Generates root causes, confidence scores, and safety alerts using Gemini 3.7 Flash in JSON Schema mode. |
| **Multimodal Inspection** | Inspects photos of components, nameplates, or wiring alongside preset failure samples (e.g., coil frost, burnt terminals). |
| **Fault Code Matrix** | Rapid resolution of industrial and commercial alarm codes (`E01`–`E10`) with zero-hallucination guardrails. |
| **AI Copilot Drawer** | Slide-out technician assistant with automatic injection of active equipment context, error codes, and step indices. |
| **Step-by-Step Guidance** | Structured repair checklists specifying exact tools, safety precautions, and OEM manual citations. |
| **Auto Report Generation** | Automatically synthesizes completed repair steps, telemetry logs, parts replaced, and notes into formal tickets. |
| **Technician Workspace** | Mobile-ready dispatch interface for managing assigned tickets and running 6-step guided diagnostic flows. |
| **Supervisor Portal** | Central hub for fleet managers to review field tickets, verify recorded telemetry, and record sign-offs. |
| **Benchmark Test Runner** | Built-in automated suite testing 10 simulated HVAC error scenarios against the diagnostic engine with live results. |

---

## Applications & Platforms

### 1. Android Application (`/android`)
Native mobile app built in Kotlin and Jetpack Compose for rugged one-handed field use:
- **Home Screen (`HomeScreen.kt`)**: Active job cards, priority indicators, and quick-launch diagnostics.
- **Diagnosis Screen (`DiagnosisScreen.kt`)**: Step-by-step diagnostic workflow with live confidence scores.
- **Camera Scan (`ScanScreen.kt`)**: CameraX integration for photographing nameplates and damaged components.
- **Voice Assistant (`VoiceAssistantScreen.kt`)**: Hands-free speech interface for technicians wearing gloves.
- **Copilot & Reports**: Contextual troubleshooting drawer and past service history logs.

### 2. Web Application (`/src`)
Full-featured responsive web portal for technicians and back-office dispatchers:
- **Technician Workspace**: Dispatch queue, 6-step guided diagnosis modal, and live AI Copilot drawer.
- **Supervisor Dashboard**: Fleet-wide ticket monitoring, telemetry log auditing, and supervisor sign-offs.
- **Printable Service Reports**: Formal commercial report modal with print and PDF export styling.

---

## AI & Knowledge Architecture

```
 Technician Input (Photo + Model + Alarm Code + Notes)
                         │
                         ▼
             FieldMind Express Backend
                         │
                         ▼
        Grounding Context (OEM Fault Matrices)
                         │
                         ▼
      Google Gemini 3.7 Flash (@google/genai SDK)
                         │
                         ▼
     Structured Outputs via JSON Schema Mode
                         │
                         ▼
 Validated Diagnostic Object (Causes, Steps, Tools, Safety Warnings)
```

- **Model**: `gemini-3.7-flash` via the official `@google/genai` TypeScript SDK.
- **Strict Schema Enforcement**: Guarantees typed outputs matching `DiagnosticResult` and `ServiceReport` interfaces.
- **Grounding Data**: Curated technical specifications for commercial equipment (*TitanAir RTU-10X*, *AquaPulse Chiller 300*, *AeroVent AHU-05*, *Vortex VRF*, *ZoneMaster VAV*).

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Mobile (Android)** | Kotlin, Jetpack Compose, CameraX, Android SDK 26+ |
| **Web Frontend** | React 19, TypeScript (~5.8), Tailwind CSS v4, Motion (`motion/react`), Lucide React, Vite 6 |
| **Backend / API** | Node.js, Express 4.21, TypeScript, `tsx` (dev), `esbuild` (production CJS bundle) |
| **AI & LLM** | Google GenAI SDK (`@google/genai` v2.4.0), Gemini 3.7 Flash (JSON Schema mode) |
| **Data & Storage** | Simulated OEM Knowledge Base, RESTful In-Memory Job & Report Store |
| **Deployment** | Single-container Cloud Run architecture (port 3000 hosting Express API + static SPA) |

---

## API Reference

The backend exposes the following verified REST API endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and Gemini API connectivity check |
| `GET` | `/api/equipment` | Retrieve simulated equipment profiles |
| `GET` | `/api/error-codes` | Retrieve simulated error code registry (`E01`–`E10`) |
| `GET` | `/api/sample-photos` | Retrieve preset visual inspection samples |
| `GET` | `/api/jobs` | List active and completed dispatch jobs |
| `POST` | `/api/jobs` | Create a new dispatch job |
| `PUT` | `/api/jobs/:id` | Update an existing job's status or details |
| `GET` | `/api/reports` | List all submitted service reports |
| `POST` | `/api/reports` | Save a new service report |
| `POST` | `/api/diagnose` | Run AI diagnostic reasoning pipeline |
| `POST` | `/api/chat` | Interactive AI copilot chat with equipment context |
| `POST` | `/api/generate-report` | AI service report generator from completed steps |
| `GET` | `/api/test-diagnostic-pipeline` | Execute 10-case automated benchmark test suite |
| `POST` | `/api/reset-demo` | Reset jobs and reports store to initial baseline |

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0+ (v20+ recommended)
- **npm** or **bun**
- **Google Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/) *(optional for local fallback mode, required for live AI reasoning)*

### 1. Clone & Install
```bash
git clone https://github.com/atharvanavgire10/FieldMind-AI.git
cd FieldMind-AI
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Edit `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> *Never commit `.env` or secret keys to version control.*

### 3. Run Development Server
```bash
npm run dev
```
Open **http://localhost:3000** in your browser.

### 4. Production Build
```bash
npm run build
npm start
```

---

## Demo Walkthrough

Experience the full technician flow in 2 minutes:

1. Open **http://localhost:3000** and click **"Launch Demo Flow"**.
2. Select sample photo *Compressor Overload Terminal*, choose unit **TitanAir RTU-10X**, and pick Alarm **E04 (Compressor High Thermal Trip)**.
3. Click **"Run AI Diagnostic Reasoning"** to view the root-cause analysis, confidence rating, and OSHA LOTO alerts.
4. Review the cited OEM manual section and required tools (True-RMS Multimeter, Manifold Gauges).
5. Open the **AI Copilot Drawer** and ask a follow-up question (e.g., *"What is the correct winding resistance?"*).
6. Check off the repair steps and record live telemetry readings.
7. Click **"Generate AI Service Report"** to create the finalized service ticket.
8. Switch to the **Supervisor Dashboard** to review and sign off.

---

## Current Status

### Implemented (MVP)
- [x] Full-stack web application (React 19 + TypeScript + Tailwind CSS v4).
- [x] Express backend with Gemini 3.7 Flash structured diagnostic pipeline.
- [x] 6-step guided diagnostic flow from photo capture to final report.
- [x] Simulated OEM knowledge base with 5 commercial HVAC models and 10 alarm codes.
- [x] Slide-out contextual AI copilot drawer.
- [x] Automated AI service report generation with print/PDF styling.
- [x] Supervisor dashboard with report inspection and sign-off.
- [x] Automated 10-case diagnostic benchmark test suite (`/api/test-diagnostic-pipeline`).
- [x] Deterministic local fallback and Insufficient Information safety guardrails.
- [x] Native Android mobile architecture in `/android` (Kotlin, Jetpack Compose, CameraX).

### Planned
- [ ] On-device Small Language Models (SLMs) for full offline inference.
- [ ] Dynamic RAG pipeline ingesting real-world OEM PDF manuals via vector search.
- [ ] Direct Bluetooth (BLE) telemetry streaming from digital gauges and thermal cameras.
- [ ] Live bi-directional cloud sync between Android local storage and central database.

---

## Safety & Limitations

- **Professional Review**: FieldMind AI provides operational assistance; recommendations must be reviewed and verified by qualified, certified technicians before performing physical actions.
- **Physical Hazards**: High-voltage electrical systems, pressurized refrigerants, rotating machinery, and gas lines present severe hazards. Technicians must always adhere to OSHA 1910.147 Lock-Out / Tag-Out (LOTO) protocols.
- **Authoritative Precedence**: AI output does not replace official manufacturer manuals or local building codes.
- **Connectivity**: Live generative reasoning requires an active connection to the Gemini API. Offline mode uses preloaded rule-based data and safety holds.

---

## Vision

### Start with HVAC. Build for every field worker.

```
       HVAC & Refrigeration
               │
               ▼
   Electrical & Power Systems
               │
               ▼
 Industrial Maintenance & Robotics
               │
               ▼
  Automotive & Heavy Equipment
               │
               ▼
    Manufacturing Plant Ops
```

> **AI expertise in the field — wherever the work takes you.**

---

## Disclaimer

FieldMind AI is a prototype designed for demonstration and assistive purposes. It does not replace certified professional judgment, official manufacturer documentation, or standard safety procedures. Always follow all applicable safety codes, electrical isolation standards (OSHA 1910.147 LOTO), and environmental regulations.
