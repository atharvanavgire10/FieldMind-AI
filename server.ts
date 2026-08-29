import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  runEquipmentDiagnosis,
  askAiCopilot,
  generateServiceReportAi,
  testAll10DiagnosticCases,
} from './server/geminiService';
import {
  SIMULATED_EQUIPMENT,
  SIMULATED_ERROR_CODES,
  DEMO_SAMPLE_PHOTOS,
} from './src/data/knowledgeBase';
import { INITIAL_JOBS, INITIAL_SERVICE_REPORTS } from './src/data/sampleJobs';
import { Job, ServiceReport } from './src/types';

dotenv.config();

// In-memory data store for live state changes across Technician and Supervisor views
let jobsStore: Job[] = JSON.parse(JSON.stringify(INITIAL_JOBS));
let reportsStore: ServiceReport[] = JSON.parse(JSON.stringify(INITIAL_SERVICE_REPORTS));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'FieldMind AI Server',
      geminiConnected: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      time: new Date().toISOString(),
    });
  });

  // Knowledge Base: Equipment
  app.get('/api/equipment', (req, res) => {
    res.json(SIMULATED_EQUIPMENT);
  });

  // Knowledge Base: Error Codes
  app.get('/api/error-codes', (req, res) => {
    res.json(SIMULATED_ERROR_CODES);
  });

  // Knowledge Base: Demo Sample Photos
  app.get('/api/sample-photos', (req, res) => {
    res.json(DEMO_SAMPLE_PHOTOS);
  });

  // Jobs: List
  app.get('/api/jobs', (req, res) => {
    res.json(jobsStore);
  });

  // Jobs: Create
  app.post('/api/jobs', (req, res) => {
    const newJob: Job = {
      id: `job-${Date.now().toString().slice(-4)}`,
      title: req.body.title || 'Diagnostic Service Call',
      equipmentId: req.body.equipmentId || SIMULATED_EQUIPMENT[0].id,
      equipmentName: req.body.equipmentName || SIMULATED_EQUIPMENT[0].name,
      location: req.body.location || SIMULATED_EQUIPMENT[0].location,
      priority: req.body.priority || 'high',
      status: req.body.status || 'In Progress',
      errorCode: req.body.errorCode || 'E04',
      technicianName: req.body.technicianName || 'Alex Mercer (Lead Tech)',
      assignedAt: new Date().toISOString(),
      aiAssisted: true,
      notes: req.body.notes || '',
      diagnosticResult: req.body.diagnosticResult,
    };
    jobsStore.unshift(newJob);
    res.status(201).json(newJob);
  });

  // Jobs: Update
  app.put('/api/jobs/:id', (req, res) => {
    const { id } = req.params;
    const index = jobsStore.findIndex((j) => j.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Job not found' });
    }
    jobsStore[index] = {
      ...jobsStore[index],
      ...req.body,
    };
    res.json(jobsStore[index]);
  });

  // Reports: List
  app.get('/api/reports', (req, res) => {
    res.json(reportsStore);
  });

  // Reports: Save / Submit
  app.post('/api/reports', (req, res) => {
    const reportData = req.body;
    const newReport: ServiceReport = {
      id: reportData.id || `rep-${Date.now().toString().slice(-4)}`,
      jobId: reportData.jobId || `job-${Date.now().toString().slice(-4)}`,
      equipmentId: reportData.equipmentId || SIMULATED_EQUIPMENT[0].id,
      equipmentName: reportData.equipmentName || SIMULATED_EQUIPMENT[0].name,
      modelNumber: reportData.modelNumber || SIMULATED_EQUIPMENT[0].model,
      serialNumber: reportData.serialNumber || SIMULATED_EQUIPMENT[0].serialNumber,
      location: reportData.location || SIMULATED_EQUIPMENT[0].location,
      technicianName: reportData.technicianName || 'Alex Mercer (Lead Tech)',
      technicianId: reportData.technicianId || 'TECH-101',
      reportedIssue: reportData.reportedIssue || 'Service Resolution',
      errorCode: reportData.errorCode || 'E04',
      aiDiagnosisSummary: reportData.aiDiagnosisSummary || '',
      rootCause: reportData.rootCause || '',
      confidenceScore: reportData.confidenceScore || 92,
      stepsCompleted: reportData.stepsCompleted || [],
      resolutionSummary: reportData.resolutionSummary || '',
      partsReplaced: reportData.partsReplaced || [],
      safetyProtocolFollowed: reportData.safetyProtocolFollowed ?? true,
      safetyNotes: reportData.safetyNotes || '',
      technicianNotes: reportData.technicianNotes || '',
      timestamp: reportData.timestamp || new Date().toISOString(),
      durationMinutes: reportData.durationMinutes || 40,
      status: reportData.status || 'Submitted',
    };

    reportsStore.unshift(newReport);

    // Also update associated job if it exists
    if (newReport.jobId) {
      const jobIdx = jobsStore.findIndex((j) => j.id === newReport.jobId);
      if (jobIdx !== -1) {
        jobsStore[jobIdx].status = 'Completed';
        jobsStore[jobIdx].completedAt = newReport.timestamp;
        jobsStore[jobIdx].serviceReportId = newReport.id;
        jobsStore[jobIdx].serviceReport = newReport;
      }
    }

    res.status(201).json(newReport);
  });

  // AI Endpoint: Diagnose Equipment & Error with Structured Pipeline
  app.post('/api/diagnose', async (req, res) => {
    try {
      const {
        equipmentId,
        equipmentType,
        errorCode,
        userNotes,
        technicianQuestion,
        capturedImageMetadata,
        relevantDocumentation,
        safetyConstraints,
        photoUrl,
      } = req.body;

      if (!equipmentId && !equipmentType) {
        return res.status(400).json({ error: 'equipmentId or equipmentType is required' });
      }
      if (!errorCode) {
        return res.status(400).json({ error: 'errorCode is required' });
      }

      const diagnosis = await runEquipmentDiagnosis({
        equipmentId: equipmentId || equipmentType,
        equipmentType,
        errorCode,
        userNotes,
        technicianQuestion,
        capturedImageMetadata,
        relevantDocumentation,
        safetyConstraints,
        photoUrl,
      });
      res.json(diagnosis);
    } catch (err: any) {
      console.error('Error in /api/diagnose:', err);
      res.status(500).json({ error: err.message || 'Internal AI diagnosis error' });
    }
  });

  // Verification Endpoint: Run 10 Demo Diagnostic Test Cases
  app.get('/api/test-diagnostic-pipeline', async (req, res) => {
    try {
      const results = await testAll10DiagnosticCases();
      res.json(results);
    } catch (err: any) {
      console.error('Error in /api/test-diagnostic-pipeline:', err);
      res.status(500).json({ error: err.message || 'Internal test suite error' });
    }
  });

  // AI Endpoint: Interactive Copilot Chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { question, equipmentId, errorCode, currentStepIndex, history } = req.body;
      if (!question) {
        return res.status(400).json({ error: 'question is required' });
      }
      const response = await askAiCopilot({
        question,
        equipmentId,
        errorCode,
        currentStepIndex,
        history,
      });
      res.json(response);
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      res.status(500).json({ error: err.message || 'Internal AI chat error' });
    }
  });

  // AI Endpoint: Automated Service Report Generator
  app.post('/api/generate-report', async (req, res) => {
    try {
      const {
        equipmentId,
        errorCode,
        stepsCompleted,
        technicianNotes,
        partsReplaced,
        durationMinutes,
        technicianName,
      } = req.body;

      const generated = await generateServiceReportAi({
        equipmentId,
        errorCode,
        stepsCompleted: stepsCompleted || [],
        technicianNotes,
        partsReplaced,
        durationMinutes,
        technicianName,
      });
      res.json(generated);
    } catch (err: any) {
      console.error('Error in /api/generate-report:', err);
      res.status(500).json({ error: err.message || 'Internal report generation error' });
    }
  });

  // Reset Demo to pristine state
  app.post('/api/reset-demo', (req, res) => {
    jobsStore = JSON.parse(JSON.stringify(INITIAL_JOBS));
    reportsStore = JSON.parse(JSON.stringify(INITIAL_SERVICE_REPORTS));
    res.json({ status: 'reset_success', jobsCount: jobsStore.length, reportsCount: reportsStore.length });
  });

  // --- Vite Middleware / Static Files ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FieldMind AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
