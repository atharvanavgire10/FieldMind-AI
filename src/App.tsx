import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { TechnicianDashboard } from './components/TechnicianDashboard';
import { DiagnosisFlow } from './components/DiagnosisFlow';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { AiChatDrawer } from './components/AiChatDrawer';
import { ServiceReportModal } from './components/ServiceReportModal';
import { FieldMindMark, FieldMindWordmark } from './components/BrandMark';
import { SIMULATED_EQUIPMENT, SIMULATED_ERROR_CODES } from './data/knowledgeBase';
import { SAMPLE_INITIAL_JOBS, SAMPLE_INITIAL_REPORTS } from './data/sampleJobs';
import { Job, ServiceReport, Equipment, ErrorCodeInfo } from './types';
import { MessageSquare, RotateCcw, CheckCircle2 } from 'lucide-react';

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

  // Sample data reset notification
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

  // Handler: Open FieldMind Assistant with contextual prompt
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

  // Restore all sample jobs and reports to their initial state
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
    <div className="min-h-screen bg-deck-100 text-ink-900 flex flex-col font-sans">
      {/* System status strip */}
      <div className="border-b border-chassis-700 bg-chassis-950 px-4 py-1.5 no-print">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="h-3 w-[2px] shrink-0 bg-signal-500" aria-hidden="true" />
            <span className="fm-label text-deck-50/80 whitespace-nowrap">Field Operations Console</span>
            <span className="hidden sm:inline h-3 w-px bg-chassis-600" aria-hidden="true" />
            <span className="hidden sm:block truncate text-[11px] text-deck-50/55">
              Commercial HVAC maintenance &amp; diagnostics
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={handleResetDemo}
              className="flex items-center gap-1.5 rounded-plate px-1.5 py-0.5 text-[11px] font-medium text-deck-50/60 transition hover:text-signal-400"
              title="Restore sample jobs and reports to their initial state"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset sample data</span>
            </button>

            <span className="hidden sm:inline fm-label text-deck-50/40">Rev 1.0</span>
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

      {/* Persistent FieldMind Assistant trigger */}
      {currentView !== 'landing' && (
        <div className="fixed bottom-5 right-5 z-40 no-print">
          <button
            id="floating-ai-copilot-trigger"
            onClick={() => setIsChatOpen(!isChatOpen)}
            aria-label="Ask FieldMind"
            className="group flex items-center gap-2.5 rounded-panel border border-chassis-600 bg-chassis-900 py-3 pl-3 pr-4 text-xs font-semibold text-deck-50 shadow-lg shadow-chassis-900/25 transition hover:border-signal-500/60 hover:bg-chassis-800 active:translate-y-px"
          >
            <span className="flex items-center gap-2.5">
              <span className="h-4 w-[2px] bg-signal-500" aria-hidden="true" />
              <MessageSquare className="h-4 w-4 text-signal-500" />
            </span>
            <span className="hidden sm:inline tracking-wide">Ask FieldMind</span>
          </button>
        </div>
      )}

      {/* FieldMind Assistant Drawer */}
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
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-panel border border-chassis-600 bg-chassis-900 px-4 py-2.5 text-xs text-deck-50 shadow-2xl flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4 text-verified-500" />
          <span>Sample jobs and reports restored to their initial state.</span>
        </div>
      )}

      {/* Global Footer */}
      <footer className="border-t border-chassis-700 bg-chassis-950 px-4 py-8 sm:px-8 no-print">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-plate bg-chassis-800 text-deck-50 ring-1 ring-chassis-600">
              <FieldMindMark size={19} />
            </span>
            <div>
              <FieldMindWordmark tone="onDark" className="text-sm" />
              <p className="mt-1 text-[11px] leading-relaxed text-deck-50/50">
                AI assistance for the physical world.
                <br />
                Built for the iQOO AI Hackathon.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-deck-50/45">
            <span>Sample HVAC knowledge base</span>
            <span className="hidden sm:inline h-3 w-px bg-chassis-600" aria-hidden="true" />
            <span>Grounded in OEM documentation</span>
            <span className="hidden sm:inline h-3 w-px bg-chassis-600" aria-hidden="true" />
            <button
              onClick={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-semibold text-signal-500 transition hover:text-signal-400"
            >
              Product overview
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
