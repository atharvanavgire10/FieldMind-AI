import React, { useState } from 'react';
import { ServiceReport } from '../types';
import {
  X,
  Download,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Building,
  User,
  Wrench,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ServiceReportModalProps {
  report: ServiceReport | null;
  onClose: () => void;
  onApproveReport?: (reportId: string) => void;
}

export const ServiceReportModal: React.FC<ServiceReportModalProps> = ({
  report,
  onClose,
  onApproveReport,
}) => {
  const [isApproved, setIsApproved] = useState(
    report?.status === 'Supervisor Approved'
  );

  React.useEffect(() => {
    setIsApproved(report?.status === 'Supervisor Approved');
  }, [report]);

  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleApprove = () => {
    setIsApproved(true);
    if (onApproveReport) {
      onApproveReport(report.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-300 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-blue-700 font-bold">
              VERIFIED FIELD SERVICE REPORT
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                isApproved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {isApproved ? 'Supervisor Approved' : report.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>

            {!isApproved && onApproveReport && (
              <button
                onClick={handleApprove}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Approve Report</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-7 space-y-6 text-xs text-slate-700">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-xs shadow-xs">
                  F
                </div>
                <span className="text-base font-bold text-slate-900">FIELDMIND AI ENTERPRISE</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Automated Field Diagnostic & Resolution Log</p>
            </div>
            <div className="text-left sm:text-right font-mono text-[11px] text-slate-500">
              <div>REPORT ID: <span className="text-blue-700 font-bold">{report.id}</span></div>
              <div>DATE: {new Date(report.timestamp).toLocaleDateString()} {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          {/* Metadata Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl bg-white p-4 border border-slate-200 shadow-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Equipment</span>
              <span className="font-bold text-slate-900 text-xs block">{report.equipmentName}</span>
              <span className="text-[11px] text-slate-500">{report.modelNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Location</span>
              <span className="font-bold text-slate-900 text-xs block">{report.location}</span>
              <span className="text-[11px] text-slate-500">Serial: {report.serialNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Technician</span>
              <span className="font-bold text-slate-900 text-xs block">{report.technicianName}</span>
              <span className="text-[11px] text-slate-500">ID: {report.technicianId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Alarm / Issue</span>
              <span className="font-bold text-red-600 text-xs block">{report.reportedIssue}</span>
              <span className="text-[11px] text-blue-700 font-semibold">Confidence: {report.confidenceScore}%</span>
            </div>
          </div>

          {/* Section 1: AI Diagnosis */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              1. AI Diagnostic Synthesis & Root Cause
            </h4>
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5 shadow-xs">
              <div className="font-bold text-slate-900">{report.aiDiagnosisSummary}</div>
              <p className="text-slate-600 text-xs leading-relaxed">{report.rootCause}</p>
            </div>
          </div>

          {/* Section 2: Steps Executed */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              2. Verified Guided Steps Executed
            </h4>
            <div className="space-y-1.5">
              {report.stepsCompleted.map((step) => (
                <div
                  key={step.stepNumber}
                  className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Step {step.stepNumber}: </span>
                    <span className="text-slate-700">{step.description}</span>
                    {step.notes && <div className="text-[11px] text-slate-500 mt-0.5">{step.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Resolution & Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
                3. Corrective Action
              </h4>
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-700 leading-relaxed shadow-xs">
                {report.resolutionSummary}
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
                4. Parts & Safety Signoff
              </h4>
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1 text-xs shadow-xs">
                <div>
                  <span className="text-slate-500">Parts Used: </span>
                  <span className="text-slate-900 font-semibold">{report.partsReplaced.join(', ') || 'None'}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{report.safetyNotes}</div>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between gap-4 text-[11px] text-slate-500">
            <div>
              <span className="font-bold text-slate-700">Field Technician: </span>
              <span className="font-mono text-blue-700 font-semibold">{report.technicianName} ({report.technicianId})</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">Supervisor Review: </span>
              <span className="font-mono text-emerald-700 font-semibold">
                {isApproved
                  ? 'Sarah Jenkins, P.E. (Chief Facilities Engineer) - APPROVED'
                  : 'Pending Final Audit'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
