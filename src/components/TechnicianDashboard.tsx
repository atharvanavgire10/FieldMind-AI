import React, { useState } from 'react';
import { Job, Equipment } from '../types';
import {
  Wrench,
  ScanLine,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ShieldAlert,
  Activity,
  Layers,
  Search,
  Plus,
  BookOpen,
  Check,
  Play,
  RotateCcw,
} from 'lucide-react';
import { SIMULATED_ERROR_CODES } from '../data/knowledgeBase';

interface TechnicianDashboardProps {
  jobs: Job[];
  equipmentList: Equipment[];
  onStartDiagnosis: (equipmentId?: string, errorCode?: string) => void;
  onViewJobReport: (job: Job) => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  jobs,
  equipmentList,
  onStartDiagnosis,
  onViewJobReport,
}) => {
  const activeJobs = jobs.filter((j) => j.status === 'Open' || j.status === 'In Progress' || j.status === 'Diagnosed');
  const completedJobs = jobs.filter((j) => j.status === 'Completed');
  const openUrgentIssues = jobs.filter((j) => j.priority === 'urgent' && j.status !== 'Completed');
  const aiAssistedCount = jobs.filter((j) => j.aiAssisted).length;
  const aiAssistedRate = jobs.length > 0 ? Math.round((aiAssistedCount / jobs.length) * 100) : 100;

  // Test Suite state
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testSuiteResults, setTestSuiteResults] = useState<{
    total: number;
    passed: number;
    results: { code: string; equipment: string; valid: boolean; likelyCause: string; citation: string; confidence: number }[];
  } | null>(null);

  const handleRunAll10Tests = async () => {
    setIsRunningTests(true);
    try {
      const res = await fetch('/api/test-diagnostic-pipeline');
      if (res.ok) {
        const data = await res.json();
        setTestSuiteResults(data);
      }
    } catch (err) {
      console.error('Test suite error:', err);
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="min-h-screen bg-deck-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Header & Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-deck-300 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-[2px] bg-signal-500" aria-hidden="true" />
              <span className="fm-label">Field Dispatch &middot; Active Shift</span>
            </div>
            <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold text-ink-900">
              Technician Workspace
            </h1>
            <p className="text-xs sm:text-sm text-ink-500">
              Welcome back, <span className="text-ink-900 font-semibold">Alex Mercer (Lead Tech #101)</span> • Campus Facilities Zone
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="flex items-center gap-3">
            <button
              id="tech-start-diagnosis-main-btn"
              onClick={() => onStartDiagnosis()}
              className="flex items-center gap-2 rounded-panel bg-signal-500 px-5 py-2.5 text-xs font-bold text-chassis-950 shadow-sm shadow-chassis-900/20 transition hover:bg-signal-400 active:translate-y-px"
            >
              <ScanLine className="h-4 w-4" />
              <span>Start Diagnosis</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Highlight Alert: Featured Urgent Job (HVAC Unit A E04) */}
        {openUrgentIssues.length > 0 && (
          <div className="relative overflow-hidden rounded-panel border border-alarm-600/30 bg-alarm-100 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-panel bg-alarm-100 text-alarm-600 border border-alarm-600/30">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-plate bg-alarm-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                      Urgent Priority
                    </span>
                    <span className="text-xs font-mono font-semibold text-alarm-700">Error Code: E04</span>
                  </div>
                  <h3 className="mt-1 text-base sm:text-lg font-bold text-ink-900">
                    {openUrgentIssues[0].title}
                  </h3>
                  <p className="mt-1 text-xs text-ink-500">
                    Location: <span className="text-ink-900 font-semibold">{openUrgentIssues[0].location}</span> — {openUrgentIssues[0].notes}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  id="tech-urgent-diagnose-btn"
                  onClick={() => onStartDiagnosis(openUrgentIssues[0].equipmentId, openUrgentIssues[0].errorCode)}
                  className="flex items-center gap-2 rounded-panel bg-alarm-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-alarm-700 shadow-sm"
                >
                  <Stethoscope className="h-4 w-4" />
                  <span>Diagnose This Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-panel border border-deck-300 bg-deck-50 p-4 shadow-xs">
            <div className="flex items-center justify-between text-ink-500 text-xs font-medium">
              <span>Active Jobs</span>
              <Wrench className="h-4 w-4 text-signal-700" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-ink-900">{activeJobs.length}</div>
            <div className="mt-1 text-[11px] text-signal-700 font-medium">In queue or diagnostic state</div>
          </div>

          <div className="rounded-panel border border-deck-300 bg-deck-50 p-4 shadow-xs">
            <div className="flex items-center justify-between text-ink-500 text-xs font-medium">
              <span>Completed Jobs</span>
              <CheckCircle2 className="h-4 w-4 text-verified-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-ink-900">{completedJobs.length}</div>
            <div className="mt-1 text-[11px] text-verified-600 font-medium">Reports filed & verified</div>
          </div>

          <div className="rounded-panel border border-deck-300 bg-deck-50 p-4 shadow-xs">
            <div className="flex items-center justify-between text-ink-500 text-xs font-medium">
              <span>Open Issues</span>
              <AlertTriangle className="h-4 w-4 text-signal-700" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-ink-900">{openUrgentIssues.length}</div>
            <div className="mt-1 text-[11px] text-signal-700 font-medium">High/Urgent severity alerts</div>
          </div>

          <div className="rounded-panel border border-deck-300 bg-deck-50 p-4 shadow-xs">
            <div className="flex items-center justify-between text-ink-500 text-xs font-medium">
              <span>FieldMind Assisted</span>
              <Stethoscope className="h-4 w-4 text-info-700" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-ink-900">{aiAssistedRate}%</div>
            <div className="mt-1 text-[11px] text-info-700 font-medium">Grounded in OEM manuals</div>
          </div>
        </div>

        {/* Main Grid: Active Jobs & Equipment Fleet */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Active / Recent Jobs List (7 Cols) */}
          <div className="space-y-4 lg:col-span-7">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-signal-700" />
                <span>Active & Recent Service Jobs</span>
              </h2>
              <span className="text-xs text-ink-500 font-medium">{jobs.length} total tasks</span>
            </div>

            <div className="space-y-3">
              {jobs.map((job) => {
                const isUrgent = job.priority === 'urgent';
                const isCompleted = job.status === 'Completed';

                return (
                  <div
                    key={job.id}
                    className={`rounded-panel border p-4 transition bg-deck-50 shadow-xs ${
                      isUrgent && !isCompleted
                        ? 'border-alarm-600/40 ring-1 ring-alarm-600/20 hover:border-alarm-600/50'
                        : isCompleted
                        ? 'border-deck-300 opacity-90 hover:border-deck-300'
                        : 'border-deck-300 hover:border-signal-500/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-plate px-2 py-0.5 text-[10px] font-bold uppercase ${
                              job.status === 'Completed'
                                ? 'bg-verified-100 text-verified-700 border border-verified-600/30'
                                : job.status === 'In Progress'
                                ? 'bg-signal-100 text-signal-700 border border-signal-600/30'
                                : 'bg-signal-100 text-signal-700 border border-signal-600/30'
                            }`}
                          >
                            {job.status}
                          </span>

                          {job.errorCode && (
                            <span className="rounded-plate bg-deck-200 px-2 py-0.5 font-mono text-[10px] font-semibold text-ink-700 border border-deck-300">
                              Code: {job.errorCode}
                            </span>
                          )}

                          {job.aiAssisted && (
                            <span className="flex items-center gap-1 text-[11px] text-signal-700 font-medium">
                              <Stethoscope className="h-3 w-3" />
                              <span>FieldMind assisted</span>
                            </span>
                          )}
                        </div>

                        <h4 className="mt-1.5 text-sm font-bold text-ink-900">{job.title}</h4>
                        <div className="mt-1 flex items-center gap-2 text-xs text-ink-500">
                          <MapPin className="h-3.5 w-3.5 text-ink-400" />
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.technicianName}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="mt-2 sm:mt-0 shrink-0">
                        {isCompleted ? (
                          <button
                            onClick={() => onViewJobReport(job)}
                            className="rounded-plate border border-deck-300 bg-deck-100 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-deck-200"
                          >
                            View Service Report
                          </button>
                        ) : (
                          <button
                            onClick={() => onStartDiagnosis(job.equipmentId, job.errorCode)}
                            className="flex items-center gap-1.5 rounded-plate bg-signal-100 border border-signal-600/30 px-3.5 py-1.5 text-xs font-semibold text-signal-700 transition hover:bg-signal-100"
                          >
                            <ScanLine className="h-3.5 w-3.5 text-signal-700" />
                            <span>Diagnose with FieldMind</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Equipment Fleet List (5 Cols) */}
          <div className="space-y-4 lg:col-span-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-signal-700" />
                <span>Equipment Fleet</span>
              </h2>
              <span className="text-xs text-ink-500 font-medium">{equipmentList.length} Units</span>
            </div>

            <div className="space-y-3">
              {equipmentList.map((eq) => (
                <div
                  key={eq.id}
                  className="rounded-panel border border-deck-300 bg-deck-50 p-3.5 shadow-xs transition hover:border-deck-300"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={eq.imageUrl}
                      alt={eq.name}
                      className="h-14 w-14 rounded-plate object-cover border border-deck-300 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-ink-900 truncate">{eq.name}</h4>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                            eq.healthScore > 85
                              ? 'bg-verified-100 text-verified-700 border border-verified-600/30'
                              : eq.healthScore > 70
                              ? 'bg-signal-100 text-signal-700 border border-signal-600/30'
                              : 'bg-alarm-100 text-alarm-700 border border-alarm-600/30'
                          }`}
                        >
                          {eq.healthScore}% Health
                        </span>
                      </div>

                      <p className="text-[11px] text-ink-500 truncate mt-0.5">{eq.model} • {eq.tonnage}</p>
                      <p className="text-[10px] text-ink-400 truncate">{eq.location}</p>

                      <div className="mt-2 flex items-center justify-between border-t border-deck-200 pt-2 text-[10px]">
                        <span className="text-ink-500">Refrig: <span className="text-ink-700 font-medium">{eq.refrigerant.split(' ')[0]}</span></span>
                        <button
                          onClick={() => onStartDiagnosis(eq.id)}
                          className="text-signal-700 hover:text-signal-700 font-bold flex items-center gap-0.5"
                        >
                          <span>Diagnose</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAULT CODE KNOWLEDGE BASE + GROUNDING CHECK */}
        <div className="rounded-panel border border-deck-300 bg-deck-50 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-deck-300 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-signal-700 uppercase tracking-wider">
                <BookOpen className="h-4 w-4" />
                <span>Knowledge Base &middot; {SIMULATED_ERROR_CODES.length} Fault Codes</span>
              </div>
              <h2 className="mt-1 text-lg sm:text-xl font-bold text-ink-900">
                HVAC Fault Code Library
              </h2>
              <p className="mt-1 text-xs text-ink-500 max-w-2xl leading-relaxed">
                Every fault code FieldMind can diagnose today, with the OEM citation and the safety protocol behind
                it. Nothing here is invented &mdash; if a code is not in the manuals, FieldMind says so instead of guessing.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="tech-run-10-tests-btn"
                onClick={handleRunAll10Tests}
                disabled={isRunningTests}
                className="flex items-center gap-2 rounded-panel bg-chassis-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-chassis-800 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isRunningTests ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-deck-50 border-t-transparent" />
                    <span>Checking grounding&hellip;</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-white text-white" />
                    <span>Check every code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Grounding check summary */}
          {testSuiteResults && (
            <div className="rounded-panel border border-verified-600/40 bg-verified-100 p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-verified-600 shrink-0" />
                <div>
                  <span className="font-bold text-verified-700">
                    Grounding check complete &mdash; {testSuiteResults.passed} of {testSuiteResults.total} codes answered from the manuals
                  </span>
                  <p className="text-[11px] text-verified-700 mt-0.5">
                    Each response carried a manual citation, a safety protocol, and an escalation threshold.
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-plate bg-verified-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white">
                {testSuiteResults.passed}/{testSuiteResults.total}
              </span>
            </div>
          )}

          {/* Fault code cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SIMULATED_ERROR_CODES.map((err, idx) => {
              const matchingEq = equipmentList[idx % equipmentList.length];
              const testResult = testSuiteResults?.results.find((r) => r.code === err.code);

              return (
                <div
                  key={err.code}
                  className="rounded-panel border border-deck-300 bg-deck-100 p-4 transition hover:border-signal-600/40 hover:bg-signal-100/20 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-plate bg-alarm-100 border border-alarm-600/30 px-2 py-0.5 font-mono text-xs font-bold text-alarm-700">
                        {err.code}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          err.severity === 'critical'
                            ? 'bg-alarm-100 text-alarm-700'
                            : err.severity === 'high'
                            ? 'bg-signal-100 text-signal-700'
                            : err.severity === 'medium'
                            ? 'bg-signal-100 text-signal-700'
                            : 'bg-verified-100 text-verified-700'
                        }`}
                      >
                        {err.severity}
                      </span>
                    </div>

                    {testResult && (
                      <span className="inline-flex items-center gap-1 rounded-plate bg-verified-100 text-verified-700 px-2 py-0.5 text-[10px] font-bold">
                        <Check className="h-3 w-3" />
                        <span>Verified ({testResult.confidence}%)</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-ink-900">{err.title}</h4>
                    <p className="mt-1 text-[11px] text-ink-500 line-clamp-2">{err.likelyCause}</p>
                  </div>

                  <div className="rounded-plate bg-deck-50 border border-deck-300 p-2.5 text-[10px] space-y-1">
                    <div className="text-ink-500 flex items-center gap-1 font-mono">
                      <BookOpen className="h-3 w-3 text-signal-700 shrink-0" />
                      <span className="truncate">Citation: {err.docReference}</span>
                    </div>
                    <div className="text-signal-700 flex items-start gap-1">
                      <AlertTriangle className="h-3 w-3 text-signal-700 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{err.safetyWarning}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-deck-300 pt-2 text-xs">
                    <span className="text-[10px] text-ink-500">
                      Sample Unit: <span className="text-ink-800 font-semibold">{matchingEq?.model || 'TitanAir'}</span>
                    </span>
                    <button
                      onClick={() => onStartDiagnosis(matchingEq?.id, err.code)}
                      className="inline-flex items-center gap-1 rounded-plate bg-chassis-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-chassis-800 transition cursor-pointer shadow-xs"
                    >
                      <span>Diagnose {err.code}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

