import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { TechnicianDashboard } from './components/TechnicianDashboard';
import { DiagnosisFlow } from './components/DiagnosisFlow';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { AiChatDrawer } from './components/AiChatDrawer';
import { ServiceReportModal } from './components/ServiceReportModal';
import { SIMULATED_EQUIPMENT, SIMULATED_ERROR_CODES } from './data/knowledgeBase';
import { SAMPLE_INITIAL_JOBS, SAMPLE_INITIAL_REPORTS } from './data/sampleJobs';
import { Job, ServiceReport, Equipment, ErrorCodeInfo } from './types';
import {
  Sparkles,
  Bot,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Info,
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'technician' | 'diagnose' | 'supervisor'>('landing');

  // Application Data States
  const [jobs, setJobs] = useState<Job[]>(SAMPLE_INITIAL_JOBS);
  const [reports, setReports] = useState<ServiceReport[]>(SAMPLE_INITIAL_REPORTS);
  const [equipmentList] = useState<Equipment[]>(SIMULATED_EQUIPMENT);
  const [errorCodes] = useState<ErrorCodeInfo[]>(SIMULATED_ERROR_CODES);

  // Active Diagnosis context
  const [activeDiagEquipmentId, setActiveDiagEquipmentId] = useState<string>('eq-hvac-a');
  const [activeDiagErrorCode, setActiveDiagErrorCode] = useState<string>('E04');

  // Chat Drawer State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatEquipmentId, setChatEquipmentId] = useState<string>('eq-hvac-a');
  const [chatErrorCode, setChatErrorCode] = useState<string>('E04');
  const [chatStepIndex, setChatStepIndex] = useState<number>(0);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');

  // Service Report Modal State
  const [selectedModalReport, setSelectedModalReport] = useState<ServiceReport | null>(null);

  // Demo reset notification
  const [showResetToast, setShowResetToast] = useState(false);

  // Fetch initial data from server if available
  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setJobs(data);
      })
      .catch(() => console.log('Using local jobs state'));

    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setReports(data);
      })
      .catch(() => console.log('Using local reports state'));
  }, []);

  // Handler: Start Diagnosis Flow
  const handleStartDiagnosis = (equipmentId?: string, errorCode?: string) => {
    if (equipmentId) {
      setActiveDiagEquipmentId(equipmentId);
      setChatEquipmentId(equipmentId);
    }
    if (errorCode) {
      setActiveDiagErrorCode(errorCode);
      setChatErrorCode(errorCode);
    }
    setCurrentView('diagnose');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Open AI Copilot Chat with contextual prompt
  const handleOpenChatWithContext = (
    equipmentId: string,
    errorCode: string,
    stepIndex: number = 0,
    prompt?: string
  ) => {
    setChatEquipmentId(equipmentId);
    setChatErrorCode(errorCode);
    setChatStepIndex(stepIndex);
    if (prompt) setChatInitialPrompt(prompt);
    setIsChatOpen(true);
  };

  // Handler: Save New Service Report
  const handleSaveReport = (newReport: ServiceReport) => {
    setReports((prev) => {
      const exists = prev.some((r) => r.id === newReport.id);
      if (exists) {
        return prev.map((r) => (r.id === newReport.id ? newReport : r));
      }
      return [newReport, ...prev];
    });

    // Update job status if matching
    setJobs((prev) =>
      prev.map((j) =>
        j.equipmentId === newReport.equipmentId && j.errorCode === newReport.errorCode
          ? { ...j, status: 'Completed', serviceReportId: newReport.id, serviceReport: newReport }
          : j
      )
    );
  };

  // Handler: Approve Report in Supervisor
  const handleApproveReport = async (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: 'Supervisor Approved' } : r
      )
    );
  };

  // 1-Click Reset Demo for Judges / Evaluators
  const handleResetDemo = async () => {
    try {
      await fetch('/api/reset-demo', { method: 'POST' });
    } catch (e) {
      // local fallback
    }
    setJobs(SAMPLE_INITIAL_JOBS);
    setReports(SAMPLE_INITIAL_REPORTS);
    setActiveDiagEquipmentId('eq-hvac-a');
    setActiveDiagErrorCode('E04');
    setShowResetToast(true);
    setTimeout(() => setShowResetToast(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-900">
      {/* Top Hackathon Demo Bar & Reset Button */}
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-1.5 text-xs text-slate-300 no-print">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold text-cyan-300">
              Student Innovation Hackathon MVP
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-300">
              Domain: Commercial HVAC Maintenance & Diagnostics
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDemo}
              className="flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-cyan-300 transition"
              title="Reset sample jobs and data to initial state"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Demo State</span>
            </button>

            <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-[10px] text-cyan-300 font-bold">
              Gemini 3.7 Flash
            </span>
          </div>
        </div>
      </div>

      {/* Main App Navigation */}
      <Navbar
        currentView={currentView === 'diagnose' ? ('diagnosis' as any) : currentView}
        onNavigate={(view) => {
          if ((view as string) === 'diagnosis' || (view as string) === 'diagnose') {
            setCurrentView('diagnose');
          } else {
            setCurrentView(view as any);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartDiagnosis={() => handleStartDiagnosis('eq-hvac-a', 'E04')}
        onStartDemo={() => handleStartDiagnosis('eq-hvac-a', 'E04')}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={(view) => {
              if ((view as string) === 'diagnosis' || (view as string) === 'diagnose') {
                setCurrentView('diagnose');
              } else {
                setCurrentView(view as any);
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartDemo={() => handleStartDiagnosis('eq-hvac-a', 'E04')}
            onExploreDemo={() => {
              setCurrentView('technician');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLaunchDiagnosis={(eqId, errCode) => handleStartDiagnosis(eqId, errCode)}
          />
        )}

        {currentView === 'technician' && (
          <TechnicianDashboard
            jobs={jobs}
            equipmentList={equipmentList}
            onStartDiagnosis={(eqId, errCode) => handleStartDiagnosis(eqId, errCode)}
            onViewJobReport={(job) => {
              const matched = reports.find((r) => r.equipmentId === job.equipmentId) || reports[0];
              setSelectedModalReport(matched);
            }}
          />
        )}

        {currentView === 'diagnose' && (
          <DiagnosisFlow
            initialEquipmentId={activeDiagEquipmentId}
            initialErrorCode={activeDiagErrorCode}
            equipmentList={equipmentList}
            errorCodes={errorCodes}
            onOpenChatWithContext={handleOpenChatWithContext}
            onSaveReport={handleSaveReport}
            onViewSupervisor={() => {
              setCurrentView('supervisor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'supervisor' && (
          <SupervisorDashboard
            jobs={jobs}
            reports={reports}
            equipmentList={equipmentList}
            onOpenReportModal={(report) => setSelectedModalReport(report)}
            onStartDiagnosisForJob={(eqId, errCode) => handleStartDiagnosis(eqId, errCode)}
          />
        )}
      </main>

      {/* Persistent Floating AI Copilot Trigger */}
      {currentView !== 'landing' && (
        <div className="fixed bottom-5 right-5 z-40 no-print">
          <button
            id="floating-ai-copilot-trigger"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="flex items-center gap-2.5 rounded-full bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/30 transition hover:bg-blue-700 active:scale-95 border border-blue-400/40"
          >
            <div className="relative">
              <Bot className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            </div>
            <span className="hidden sm:inline">Ask AI Assistant</span>
          </button>
        </div>
      )}

      {/* AI Assistant Chat Drawer */}
      <AiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        equipmentId={chatEquipmentId}
        errorCode={chatErrorCode}
        currentStepIndex={chatStepIndex}
        initialPrompt={chatInitialPrompt}
      />

      {/* Full Service Report Modal */}
      <ServiceReportModal
        report={selectedModalReport}
        onClose={() => setSelectedModalReport(null)}
        onApproveReport={handleApproveReport}
      />

      {/* Toast Notification on Reset */}
      {showResetToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 shadow-2xl text-xs text-white flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Demo state successfully restored to initial hackathon defaults.</span>
        </div>
      )}

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-8 text-xs text-slate-500 no-print">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-[11px]">
              F
            </div>
            <span className="font-bold text-slate-900">FieldMind AI</span>
            <span className="text-slate-500">— AI Copilot for Field Technicians</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Simulated HVAC Knowledge Base</span>
            <span>•</span>
            <span>Grounded OEM Documentation</span>
            <span>•</span>
            <button
              onClick={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              Product Overview
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
