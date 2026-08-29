# FieldMind AI

**An AI expert in every field worker's pocket.**

See the problem. Understand the cause. Get guided through the fix.

FieldMind AI is a field-service assistant for HVAC and industrial maintenance
technicians. A technician photographs the equipment and its fault code, and
FieldMind returns a grounded diagnosis, a confidence reading, the safety
protocol that applies, a step-by-step repair procedure, and — once the job is
closed — a structured service report ready for supervisor sign-off.

Built for the iQOO AI Hackathon.

## What's inside

| Surface | What it does |
| --- | --- |
| Landing page | Explains the workflow: See → Understand → Guide → Verify → Report |
| Technician Dashboard | Active shift, assigned jobs, equipment fleet, fault-code knowledge base |
| Guided Diagnostic | Capture → Analyze → Understand → Guide → Complete → Report |
| FieldMind Assistant | Grounded Q&A drawer scoped to the current equipment and alarm |
| Supervisor Hub | Service reports, job queue, technician roster, fleet health |
| Service Report | Printable field-service document (Print / PDF) |

## Architecture

- **Frontend** — Vite + React + TypeScript + Tailwind CSS
- **Backend** — Express (`server.ts`), which serves the API and, in development,
  mounts Vite as middleware
- **Model access** — all model calls happen server-side in
  `server/geminiService.ts`. The browser never sees an API key; it only talks to
  `/api/*` routes on the Express server.
- **Data** — jobs and reports are held in in-memory stores on the server and can
  be reset via `POST /api/reset-demo`. Equipment, fault codes, and the OEM
  documentation excerpts live in `src/data/`.

## Run locally

**Prerequisites:** Node.js 20+

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file in the project root (see `.env.example` for the full
   list of variables) and set your model API key:

   ```
   GEMINI_API_KEY="your-api-key-here"
   ```

   The server loads this file with `dotenv` at startup. `.env` files are
   git-ignored — never commit a real key.

3. Start the app:

   ```
   npm run dev
   ```

   The app is served at http://localhost:3000.

If `GEMINI_API_KEY` is absent, the app still runs: the diagnostic and assistant
routes fall back to the local knowledge base instead of failing.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Express server with Vite middleware |
| `npm run build` | Build the client and bundle the server into `dist/` |
| `npm start` | Serve the built bundle from `dist/` |
| `npm run lint` | Type-check the project with `tsc --noEmit` |

## Notes

This is a hackathon prototype. Job, report, technician, and equipment records are
sample data intended to demonstrate the workflow end to end — it is not a
commercially deployed service, and none of the figures shown should be read as
measured production results.
