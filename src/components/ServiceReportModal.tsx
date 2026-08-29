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
} from 'lucide-react';
import { FieldMindMark } from './BrandMark';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-chassis-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-panel border border-deck-300 bg-deck-50 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-deck-300 pb-4 no-print">
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-[2px] bg-signal-500" aria-hidden="true" />
            <span className="fm-label">Field Service Report</span>
            <span
              className={`rounded-plate px-2 py-0.5 text-[10px] font-bold uppercase ${
                isApproved
                  ? 'bg-verified-100 text-verified-700 border border-verified-600/30'
                  : 'bg-signal-100 text-signal-700 border border-signal-600/30'
              }`}
            >
              {isApproved ? 'Supervisor Approved' : report.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-plate border border-deck-300 bg-deck-50 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-deck-100 shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>

            {!isApproved && onApproveReport && (
              <button
                onClick={handleApprove}
                className="flex items-center gap-1.5 rounded-plate bg-verified-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-verified-700 shadow-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Approve Report</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-plate p-1.5 text-ink-400 hover:bg-deck-200 hover:text-ink-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="fm-doc rounded-panel border border-deck-300 bg-deck-100 p-6 sm:p-7 space-y-6 text-xs text-ink-700">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-deck-300 pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-plate bg-chassis-900 text-deck-50 shadow-xs">
                  <FieldMindMark size={19} />
                </span>
                <span className="fm-display text-lg text-ink-900">Field Service Report</span>
              </div>
              <p className="text-[11px] text-ink-500 mt-1.5">
                FieldMind AI &middot; Diagnostic &amp; resolution log
              </p>
            </div>
            <div className="text-left sm:text-right font-mono text-[11px] text-ink-500">
              <div>REPORT ID: <span className="text-signal-700 font-bold">{report.id}</span></div>
              <div>DATE: {new Date(report.timestamp).toLocaleDateString()} {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          {/* Metadata Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-panel bg-deck-50 p-4 border border-deck-300 shadow-xs">
            <div>
              <span className="text-[10px] text-ink-400 uppercase font-mono block">Equipment</span>
              <span className="font-bold text-ink-900 text-xs block">{report.equipmentName}</span>
              <span className="text-[11px] text-ink-500">{report.modelNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-ink-400 uppercase font-mono block">Location</span>
              <span className="font-bold text-ink-900 text-xs block">{report.location}</span>
              <span className="text-[11px] text-ink-500">Serial: {report.serialNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-ink-400 uppercase font-mono block">Technician</span>
              <span className="font-bold text-ink-900 text-xs block">{report.technicianName}</span>
              <span className="text-[11px] text-ink-500">ID: {report.technicianId}</span>
            </div>
            <div>
              <span className="text-[10px] text-ink-400 uppercase font-mono block">Alarm / Issue</span>
              <span className="font-bold text-alarm-600 text-xs block">{report.reportedIssue}</span>
              <span className="text-[11px] text-signal-700 font-semibold">Confidence: {report.confidenceScore}%</span>
            </div>
          </div>

          {/* Section 1: FieldMind Diagnosis */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-signal-700 uppercase tracking-wider font-mono">
              1. FieldMind Diagnosis &amp; Root Cause
            </h4>
            <div className="rounded-panel border border-deck-300 bg-deck-50 p-4 space-y-1.5 shadow-xs">
              <div className="font-bold text-ink-900">{report.aiDiagnosisSummary}</div>
              <p className="text-ink-500 text-xs leading-relaxed">{report.rootCause}</p>
            </div>
          </div>

          {/* Section 2: Steps Executed */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-signal-700 uppercase tracking-wider font-mono">
              2. Verified Guided Steps Executed
            </h4>
            <div className="space-y-1.5">
              {report.stepsCompleted.map((step) => (
                <div
                  key={step.stepNumber}
                  className="flex items-start gap-2 rounded-plate border border-deck-300 bg-deck-50 p-3 shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4 text-verified-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-ink-900">Step {step.stepNumber}: </span>
                    <span className="text-ink-700">{step.description}</span>
                    {step.notes && <div className="text-[11px] text-ink-500 mt-0.5">{step.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Resolution & Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-signal-700 uppercase tracking-wider font-mono">
                3. Corrective Action
              </h4>
              <div className="rounded-panel border border-deck-300 bg-deck-50 p-3.5 text-xs text-ink-700 leading-relaxed shadow-xs">
                {report.resolutionSummary}
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-signal-700 uppercase tracking-wider font-mono">
                4. Parts & Safety Signoff
              </h4>
              <div className="rounded-panel border border-deck-300 bg-deck-50 p-3.5 space-y-1 text-xs shadow-xs">
                <div>
                  <span className="text-ink-500">Parts Used: </span>
                  <span className="text-ink-900 font-semibold">{report.partsReplaced.join(', ') || 'None'}</span>
                </div>
                <div className="text-[11px] text-ink-500 mt-1">{report.safetyNotes}</div>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="border-t border-deck-300 pt-4 flex flex-col sm:flex-row justify-between gap-4 text-[11px] text-ink-500">
            <div>
              <span className="font-bold text-ink-700">Field Technician: </span>
              <span className="font-mono text-signal-700 font-semibold">{report.technicianName} ({report.technicianId})</span>
            </div>
            <div>
              <span className="font-bold text-ink-700">Supervisor Review: </span>
              <span className="font-mono text-verified-700 font-semibold">
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
