import React, { useState, useEffect } from 'react';
import {
  Equipment,
  ErrorCodeInfo,
  DiagnosticResult,
  RepairStep,
  ServiceReport,
} from '../types';
import {
  Camera,
  Upload,
  ScanLine,
  Stethoscope,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Wrench,
  FileText,
  Clock,
  Download,
  Save,
  MessageSquare,
  Check,
} from 'lucide-react';
import { FieldMindMark } from './BrandMark';
import { DEMO_SAMPLE_PHOTOS } from '../data/knowledgeBase';

interface DiagnosisFlowProps {
  initialEquipmentId?: string;
  initialErrorCode?: string;
  equipmentList: Equipment[];
  errorCodes: ErrorCodeInfo[];
  onOpenChatWithContext: (equipmentId: string, errorCode: string, stepIndex?: number, prompt?: string) => void;
  onSaveReport: (report: ServiceReport) => void;
  onViewSupervisor: () => void;
}

export const DiagnosisFlow: React.FC<DiagnosisFlowProps> = ({
  initialEquipmentId,
  initialErrorCode,
  equipmentList,
  errorCodes,
  onOpenChatWithContext,
  onSaveReport,
  onViewSupervisor,
}) => {
  // Current active step (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Image selection / upload
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>(
    DEMO_SAMPLE_PHOTOS[0].url
  );
  const [isCustomUpload, setIsCustomUpload] = useState<boolean>(false);

  // Step 2: Equipment and Error Code selection
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>(
    initialEquipmentId || equipmentList[0]?.id || 'eq-hvac-a'
  );
  const [selectedErrorCode, setSelectedErrorCode] = useState<string>(
    initialErrorCode || 'E04'
  );
  const [technicianFieldNotes, setTechnicianFieldNotes] = useState<string>(
    'Technician on site: Zone 401 thermostat alert. Visual inspection shows E04 alarm blinking on master RTU controller.'
  );

  // AI Loading & Result state
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  // Step 4: Guided Procedure Execution
  const [repairSteps, setRepairSteps] = useState<RepairStep[]>(() => {
    const error = errorCodes.find((e) => e.code === (initialErrorCode || 'E04')) || errorCodes[0];
    return (error?.defaultSteps || []).map((stepText, idx) => ({
      id: `step-${idx + 1}`,
      stepNumber: idx + 1,
      title: `Step ${idx + 1}: Diagnostic Verification`,
      instruction: stepText,
      safetyCheck: idx === 0 ? 'OSHA Lock-Out / Tag-Out (LOTO) 1910.147 verified' : undefined,
      requiredTool: idx === 0 ? 'Fluke True-RMS Multimeter' : 'Digital Manifold Gauges',
      completed: false,
    }));
  });
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Step 5: Resolution & Completion Inputs
  const [partsReplacedInput, setPartsReplacedInput] = useState<string>(
    'MERV-13 High-Capacity Air Filter Panel (24x24x2), Condenser Coil Foaming Wash'
  );
  const [finalReadings, setFinalReadings] = useState({
    dischargeTemp: '186°F (Normal < 210°F)',
    suctionPressure: '118 PSIG',
    ambientTemp: '92°F',
    runningAmps: '13.8A (Balanced)',
  });
  const [technicianSignoffNotes, setTechnicianSignoffNotes] = useState<string>(
    'Cleared severe dust blockage on return air filter rack. Thoroughly rinsed microchannel condenser coils. Verified fan run capacitor at 44.8 uF (rated 45 uF). Cleared E04 alarm, system cooling normally.'
  );

  // Step 6: Generated Service Report
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [generatedReport, setGeneratedReport] = useState<ServiceReport | null>(null);
  const [isReportSaved, setIsReportSaved] = useState<boolean>(false);

  // Sync if initial props change
  useEffect(() => {
    if (initialEquipmentId) setSelectedEquipmentId(initialEquipmentId);
    if (initialErrorCode) setSelectedErrorCode(initialErrorCode);
  }, [initialEquipmentId, initialErrorCode]);

  // Current equipment & error info
  const selectedEquipment =
    equipmentList.find((e) => e.id === selectedEquipmentId) || equipmentList[0];
  const selectedError =
    errorCodes.find((e) => e.code === selectedErrorCode) || errorCodes[0];

  // Handler: Run AI Diagnosis (Step 2 -> Step 3)
  const handleRunDiagnosis = async () => {
    setIsDiagnosing(true);
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: selectedEquipmentId,
          equipmentType: `${selectedEquipment.name} (${selectedEquipment.model})`,
          errorCode: selectedErrorCode,
          userNotes: technicianFieldNotes,
          technicianQuestion: technicianFieldNotes || `Diagnose ${selectedErrorCode} for ${selectedEquipment.model}`,
          capturedImageMetadata: selectedPhotoUrl
            ? {
                photoUrl: selectedPhotoUrl,
                photoTitle: `${selectedEquipment.name} Photo Scan`,
                photoDescription: `Inspection photo associated with alarm ${selectedErrorCode}`,
              }
            : undefined,
          relevantDocumentation: [selectedEquipment.manualTitle, selectedError.docReference],
          safetyConstraints: ['OSHA 1910.147 LOTO', 'EPA 608 Refrigerant Certification', 'Zero Energy Multimeter Check'],
          photoUrl: selectedPhotoUrl,
        }),
      });

      if (!res.ok) throw new Error('Failed to run diagnosis');
      const data: DiagnosticResult = await res.json();
      setDiagnosticResult(data);
      setRepairSteps(data.recommendedSteps || []);
      setCurrentStep(3);
    } catch (err) {
      console.error('Diagnosis error:', err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Step 4: Toggle step completed
  const handleToggleStepCompleted = (stepIndex: number) => {
    const updated = [...repairSteps];
    updated[stepIndex].completed = !updated[stepIndex].completed;
    setRepairSteps(updated);
  };

  // Step 4: Advance to next repair step
  const handleNextRepairStep = () => {
    // Mark current completed if not already
    const updated = [...repairSteps];
    updated[activeStepIndex].completed = true;
    setRepairSteps(updated);

    if (activeStepIndex < repairSteps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      // All steps done -> move to Step 5
      setCurrentStep(5);
    }
  };

  // Handler: Generate Service Report (Step 5 -> Step 6)
  const handleGenerateServiceReport = async () => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: selectedEquipmentId,
          errorCode: selectedErrorCode,
          stepsCompleted: repairSteps.map((s, idx) => ({
            stepNumber: idx + 1,
            description: s.instruction,
            notes: s.details,
          })),
          technicianNotes: technicianSignoffNotes,
          partsReplaced: partsReplacedInput.split(',').map((p) => p.trim()).filter(Boolean),
          durationMinutes: 42,
          technicianName: 'Alex Mercer (Lead Field Technician #101)',
        }),
      });

      const aiData = await res.json();

      const newReport: ServiceReport = {
        id: `rep-${Date.now().toString().slice(-4)}`,
        jobId: `job-${Date.now().toString().slice(-4)}`,
        equipmentId: selectedEquipment.id,
        equipmentName: selectedEquipment.name,
        modelNumber: selectedEquipment.model,
        serialNumber: selectedEquipment.serialNumber,
        location: selectedEquipment.location,
        technicianName: 'Alex Mercer (Lead Field Technician)',
        technicianId: 'TECH-101',
        reportedIssue: `${selectedError.code}: ${selectedError.title}`,
        errorCode: selectedError.code,
        aiDiagnosisSummary: aiData.aiDiagnosisSummary || diagnosticResult?.likelyCause || '',
        rootCause: aiData.rootCause || diagnosticResult?.rootCauseAnalysis || '',
        confidenceScore: diagnosticResult?.confidenceScore || 92,
        stepsCompleted: repairSteps.map((s, idx) => ({
          stepNumber: idx + 1,
          description: s.instruction,
          notes: s.completed ? 'Verified and signed off on-site' : 'Inspected',
        })),
        resolutionSummary: aiData.resolutionSummary || technicianSignoffNotes,
        partsReplaced: partsReplacedInput.split(',').map((p) => p.trim()).filter(Boolean),
        safetyProtocolFollowed: true,
        safetyNotes: aiData.safetyNotes || diagnosticResult?.safetyWarning || 'OSHA LOTO 1910.147 verified.',
        technicianNotes: technicianSignoffNotes,
        timestamp: new Date().toISOString(),
        durationMinutes: 42,
        status: 'Submitted',
      };

      setGeneratedReport(newReport);
      setCurrentStep(6);
      setIsReportSaved(true);
      onSaveReport(newReport);
      fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      }).catch((e) => console.error('Auto-save report error:', e));
    } catch (err) {
      console.error('Report generation error:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Step 6: Save report to server & supervisor queue
  const handleSaveToFleet = async () => {
    if (!generatedReport) return;
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedReport),
      });
      setIsReportSaved(true);
      onSaveReport(generatedReport);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  // Step 6: Print / Download Report
  const handleDownloadReport = () => {
    window.print();
  };

  // Quick photo upload simulator
  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhotoUrl(reader.result as string);
        setIsCustomUpload(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-deck-100 px-4 py-8 sm:px-6 lg:px-8 text-ink-800">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Step Progress Tracker */}
        <div className="rounded-panel border border-deck-300 bg-deck-50 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-ink-700">
              <span className="h-3 w-[2px] bg-signal-500" aria-hidden="true" />
              Guided Diagnostic Procedure
            </span>
            <span className="text-xs text-ink-500 font-semibold">
              Step {currentStep} of 6
            </span>
          </div>

          {/* Stepper Dots & Labels */}
          <div className="grid grid-cols-6 gap-2">
            {[
              { num: 1, label: 'Capture' },
              { num: 2, label: 'Analyze' },
              { num: 3, label: 'Understand' },
              { num: 4, label: 'Guide' },
              { num: 5, label: 'Complete' },
              { num: 6, label: 'Report' },
            ].map((step) => {
              const isPassed = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => {
                    // Allow jumping backwards or forward if data exists
                    if (step.num <= currentStep || (step.num === 3 && diagnosticResult)) {
                      setCurrentStep(step.num);
                    }
                  }}
                  className={`flex flex-col items-center gap-1 rounded-panel py-2 px-1 text-center transition cursor-pointer ${
                    isCurrent
                      ? 'bg-signal-100 border border-signal-600/40 text-signal-700 font-bold shadow-xs'
                      : isPassed
                      ? 'bg-verified-100 text-verified-700 border border-verified-600/30 font-medium'
                      : 'bg-deck-100 text-ink-400 border border-deck-300'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-chassis-900 text-white'
                        : isPassed
                        ? 'bg-verified-600 text-white'
                        : 'bg-deck-300 text-ink-500'
                    }`}
                  >
                    {isPassed ? '✓' : step.num}
                  </div>
                  <span className="hidden sm:inline-block text-[11px] truncate w-full">
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 1: SELECT OR UPLOAD EQUIPMENT IMAGE */}
        {currentStep === 1 && (
          <div className="space-y-6 rounded-panel border border-deck-300 bg-deck-50 p-6 sm:p-8 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-signal-700 text-xs font-mono uppercase font-bold">
                <Camera className="h-4 w-4" />
                <span>Step 1 &mdash; Capture</span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-ink-900">
                Select or Upload Equipment Photo
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-ink-500">
                Capture the control panel alarm display, equipment serial plate, or mechanical issue using your phone camera.
              </p>
            </div>

            {/* Realistic Pre-loaded Test Photos */}
            <div>
              <label className="text-xs font-bold text-ink-700 uppercase tracking-wide">
                Sample equipment photos &mdash; or upload your own
              </label>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {DEMO_SAMPLE_PHOTOS.map((photo) => {
                  const isSelected = selectedPhotoUrl === photo.url;
                  return (
                    <button
                      key={photo.id}
                      onClick={() => {
                        setSelectedPhotoUrl(photo.url);
                        setSelectedEquipmentId(photo.equipmentId);
                        setSelectedErrorCode(photo.errorCode);
                        setIsCustomUpload(false);
                      }}
                      className={`group relative overflow-hidden rounded-panel border text-left transition cursor-pointer shadow-xs ${
                        isSelected
                          ? 'border-signal-500 ring-2 ring-signal-500/30 bg-signal-100/40'
                          : 'border-deck-300 bg-deck-50 hover:border-deck-300'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="h-28 w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="rounded-plate bg-alarm-100 border border-alarm-600/30 px-1.5 py-0.5 font-mono text-[10px] font-bold text-alarm-700">
                            Alarm: {photo.errorCode}
                          </span>
                          {isSelected && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-chassis-900 text-white text-[10px] font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        <h4 className="mt-1.5 text-xs font-bold text-ink-900 line-clamp-1">
                          {photo.title}
                        </h4>
                        <p className="mt-0.5 text-[10px] text-ink-500 line-clamp-2">
                          {photo.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Upload Dropzone */}
            <div className="rounded-panel border border-dashed border-deck-300 bg-deck-100 p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-ink-400" />
              <div className="mt-2 text-xs font-bold text-ink-800">
                Upload custom equipment photo or camera snapshot
              </div>
              <p className="text-[11px] text-ink-500 mt-0.5">
                Supports PNG, JPG, WEBP from mobile camera capture
              </p>
              <label className="mt-3 inline-flex items-center gap-2 rounded-panel bg-deck-50 border border-deck-300 px-4 py-2 text-xs font-semibold text-ink-700 cursor-pointer hover:bg-deck-100 shadow-xs">
                <span>Browse / Take Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Navigation Button */}
            <div className="flex justify-end pt-4 border-t border-deck-300">
              <button
                id="diag-step1-next-btn"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 rounded-panel bg-chassis-900 px-6 py-3 text-xs font-bold text-white shadow-md shadow-chassis-900/20 transition hover:bg-chassis-800 cursor-pointer"
              >
                <span>Continue to Equipment & Error Code</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT EQUIPMENT & ERROR CODE */}
        {currentStep === 2 && (
          <div className="space-y-6 rounded-panel border border-deck-300 bg-deck-50 p-6 sm:p-8 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-signal-700 text-xs font-mono uppercase font-bold">
                <Wrench className="h-4 w-4" />
                <span>Step 2 &mdash; Analyze</span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-ink-900">
                Confirm the Equipment and the Fault Code
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-ink-500">
                FieldMind reads the fault against the manual for this exact model, so the equipment and reported alarm code need to be right before analysis runs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Equipment Selector */}
              <div>
                <label className="block text-xs font-bold text-ink-700 uppercase tracking-wide mb-2">
                  Target Equipment
                </label>
                <select
                  id="diag-equipment-select"
                  value={selectedEquipmentId}
                  onChange={(e) => setSelectedEquipmentId(e.target.value)}
                  className="w-full rounded-panel border border-deck-300 bg-deck-50 p-3 text-sm text-ink-900 focus:border-signal-500 focus:ring-1 focus:ring-signal-500 focus:outline-none shadow-xs"
                >
                  {equipmentList.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} ({eq.model})
                    </option>
                  ))}
                </select>

                {/* Selected Equipment Snapshot */}
                <div className="mt-3 rounded-panel border border-deck-300 bg-deck-100 p-3.5 space-y-2 text-xs">
                  <div className="font-bold text-ink-900">{selectedEquipment.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-ink-500">
                    <div>Capacity: <span className="text-ink-900 font-semibold">{selectedEquipment.tonnage}</span></div>
                    <div>Voltage: <span className="text-ink-900 font-semibold">{selectedEquipment.voltage}</span></div>
                    <div>Refrigerant: <span className="text-ink-900 font-semibold">{selectedEquipment.refrigerant}</span></div>
                    <div>Location: <span className="text-ink-900 font-semibold">{selectedEquipment.location}</span></div>
                  </div>
                  <div className="border-t border-deck-300 pt-2 text-[10px] text-signal-700 font-semibold flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>OEM Manual: {selectedEquipment.manualTitle}</span>
                  </div>
                </div>
              </div>

              {/* Error Code Selector */}
              <div>
                <label className="block text-xs font-bold text-ink-700 uppercase tracking-wide mb-2">
                  Reported Error Code
                </label>
                <select
                  id="diag-error-select"
                  value={selectedErrorCode}
                  onChange={(e) => setSelectedErrorCode(e.target.value)}
                  className="w-full rounded-panel border border-deck-300 bg-deck-50 p-3 text-sm text-ink-900 focus:border-signal-500 focus:ring-1 focus:ring-signal-500 focus:outline-none shadow-xs"
                >
                  {errorCodes.map((err) => (
                    <option key={err.code} value={err.code}>
                      {err.code} - {err.title} ({err.severity.toUpperCase()})
                    </option>
                  ))}
                </select>

                {/* Selected Error Snapshot */}
                <div className="mt-3 rounded-panel border border-deck-300 bg-deck-100 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-alarm-700">Alarm {selectedError.code}: {selectedError.title}</span>
                    <span className="rounded-plate bg-alarm-100 border border-alarm-600/30 px-1.5 py-0.5 text-[10px] font-bold text-alarm-700 uppercase">
                      {selectedError.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-500">{selectedError.likelyCause}</p>
                  <div className="rounded-plate bg-signal-100 border border-signal-600/30 p-2 text-[10px] text-signal-700 flex items-start gap-1.5 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-signal-700" />
                    <span>{selectedError.safetyWarning}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Notes Input */}
            <div>
              <label className="block text-xs font-bold text-ink-700 uppercase tracking-wide mb-2">
                Technician On-Site Observations (Optional)
              </label>
              <textarea
                rows={2}
                value={technicianFieldNotes}
                onChange={(e) => setTechnicianFieldNotes(e.target.value)}
                className="w-full rounded-panel border border-deck-300 bg-deck-50 p-3 text-xs text-ink-900 placeholder-ink-400 focus:border-signal-500 focus:ring-1 focus:ring-signal-500 focus:outline-none shadow-xs"
                placeholder="e.g. Compressor casing hot to touch, fan running at half speed, visual dust on return grilles..."
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-deck-300">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 rounded-panel border border-deck-300 bg-deck-50 px-4 py-2.5 text-xs font-semibold text-ink-700 hover:bg-deck-100 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                id="diag-step2-run-btn"
                onClick={handleRunDiagnosis}
                disabled={isDiagnosing}
                className="flex items-center gap-2 rounded-panel bg-signal-500 px-6 py-3 text-xs font-bold text-chassis-950 shadow-md shadow-chassis-900/20 transition hover:bg-signal-400 disabled:opacity-60 cursor-pointer active:translate-y-px"
              >
                {isDiagnosing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-chassis-950 border-t-transparent" />
                    <span>Reading the fault against the manual&hellip;</span>
                  </>
                ) : (
                  <>
                    <ScanLine className="h-4 w-4" />
                    <span>Analyze with FieldMind</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SHOW AI ANALYSIS */}
        {currentStep === 3 && diagnosticResult && (
          <div className="space-y-6 rounded-panel border border-deck-300 bg-deck-50 p-6 sm:p-8 shadow-xs">
            {/* Insufficient Information Banner if Detected */}
            {diagnosticResult.isInsufficientInfo && (
              <div className="rounded-panel border border-signal-600/40 bg-signal-100 p-4 sm:p-5 text-signal-700">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-signal-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-signal-700 uppercase tracking-wide">
                      Safety Alert: Insufficient Diagnostic Information
                    </h3>
                    <p className="mt-1 text-xs text-signal-700 leading-relaxed">
                      {diagnosticResult.insufficientInfoNotice ||
                        'The supplied equipment parameters or error code were not found in the verified OEM knowledge base. FieldMind prioritizes technician safety and will not invent equipment specifications or unsafe repair procedures.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Diagnostic Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-deck-300 pb-4">
              <div>
                <div className="flex items-center gap-2 text-signal-700 text-xs font-mono uppercase font-bold">
                  <Stethoscope className="h-4 w-4" />
                  <span>Step 3 &mdash; Understand</span>
                </div>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold text-ink-900">
                  {diagnosticResult.equipment || diagnosticResult.equipmentName}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-plate bg-alarm-100 border border-alarm-600/30 px-2 py-0.5 font-mono text-xs font-bold text-alarm-700">
                    {diagnosticResult.issue || `${diagnosticResult.errorCode} - ${diagnosticResult.errorTitle}`}
                  </span>
                  <span
                    className={`rounded-plate px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      diagnosticResult.severity === 'critical'
                        ? 'bg-alarm-100 text-alarm-700 border border-alarm-600/40'
                        : diagnosticResult.severity === 'high'
                        ? 'bg-signal-100 text-signal-700 border border-signal-600/40'
                        : diagnosticResult.severity === 'medium'
                        ? 'bg-signal-100 text-signal-700 border border-signal-600/40'
                        : 'bg-verified-100 text-verified-700 border border-verified-600/40'
                    }`}
                  >
                    Severity: {diagnosticResult.severity || 'HIGH'}
                  </span>
                </div>
              </div>

              {/* Confidence Gauge Badge */}
              <div className="flex shrink-0 items-center gap-3 rounded-panel border border-deck-300 bg-deck-100 px-4 py-2.5">
                <div className="text-right">
                  <div className="fm-label">Confidence</div>
                  <div className="mt-0.5 font-mono text-xl font-bold text-ink-900">
                    {diagnosticResult.confidence ?? diagnosticResult.confidenceScore}%
                  </div>
                </div>
                <div className="flex h-9 items-end gap-[3px]" aria-hidden="true">
                  {Array.from({ length: 8 }).map((_, i) => {
                    const pct = Number(diagnosticResult.confidence ?? diagnosticResult.confidenceScore ?? 0);
                    const lit = (i + 1) * 12.5 <= pct;
                    return (
                      <span
                        key={i}
                        className={lit ? 'w-1.5 bg-signal-500' : 'w-1.5 bg-deck-300'}
                        style={{ height: `${34 + i * 8}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Safety Warning Card (Highest Priority) */}
            <div className="rounded-panel border border-signal-600/40 bg-signal-100 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-plate bg-signal-600 text-white shadow-xs">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-signal-700 uppercase tracking-wide">
                    Mandatory Safety Protocol (OSHA 1910.147 LOTO)
                  </h4>
                  <p className="mt-1 text-xs text-signal-700 leading-relaxed font-medium">
                    {diagnosticResult.safetyWarning}
                  </p>
                </div>
              </div>
            </div>

            {/* Root Cause & Diagnostic Findings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Likely Cause Card */}
              <div className="rounded-panel border border-deck-300 bg-deck-100 p-5 space-y-2">
                <span className="text-[11px] font-mono uppercase text-signal-700 font-bold">
                  FieldMind Analysis
                </span>
                <h3 className="text-sm font-bold text-ink-900">
                  {diagnosticResult.likelyCause}
                </h3>
                <p className="text-xs text-ink-500 leading-relaxed">
                  {diagnosticResult.rootCauseAnalysis}
                </p>
              </div>

              {/* When To Escalate Card */}
              <div className="rounded-panel border border-info-600/30 bg-info-100/60 p-5 space-y-2">
                <span className="text-[11px] font-mono uppercase text-info-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>When to Escalate to Senior Specialist</span>
                </span>
                <h3 className="text-xs font-bold text-ink-900">
                  Escalation Threshold Criteria:
                </h3>
                <p className="text-xs text-ink-700 leading-relaxed">
                  {diagnosticResult.whenToEscalate ||
                    'Escalate to Tier-3 Refrigeration Engineer if sensor readings remain out of tolerance after verifying standard physical checklist.'}
                </p>
              </div>
            </div>

            {/* Recommended Steps Overview */}
            <div className="rounded-panel border border-deck-300 bg-deck-100 p-5 space-y-3">
              <span className="text-[11px] font-mono uppercase text-signal-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Recommended Actions</span>
              </span>
              <div className="space-y-2">
                {(diagnosticResult.steps || diagnosticResult.recommendedSteps?.map((s) => s.instruction) || []).map(
                  (stepText: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-plate border border-deck-300 bg-deck-50 p-3 text-xs shadow-xs"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-chassis-900 text-[10px] font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-ink-800 font-medium leading-relaxed">{stepText}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Source Documentation & Citations */}
            <div className="rounded-panel border border-deck-300 bg-deck-100 p-5 space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-signal-700 font-bold">
                <BookOpen className="h-4 w-4" />
                <span>Relevant Information &mdash; OEM Documentation</span>
              </div>

              {diagnosticResult.documentation && diagnosticResult.documentation.length > 0 ? (
                <div className="space-y-3">
                  {diagnosticResult.documentation.map((doc, idx) => (
                    <div key={idx} className="rounded-plate border border-deck-300 bg-deck-50 p-4 space-y-2 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-ink-900">{doc.document}</span>
                        {doc.section && (
                          <span className="rounded-plate bg-deck-200 px-2 py-0.5 text-[10px] font-mono text-ink-700 font-semibold">
                            {doc.section}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-semibold text-signal-700 flex items-center gap-1">
                        <span>Citation:</span>
                        <span className="text-ink-800 font-normal">{doc.citation}</span>
                      </div>
                      {doc.excerpt && (
                        <blockquote className="border-l-2 border-signal-500 bg-deck-100 p-2.5 text-xs italic text-ink-700 leading-relaxed rounded-r-md">
                          "{doc.excerpt}"
                        </blockquote>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-plate border border-deck-300 bg-deck-50 p-4 space-y-2">
                  <div className="text-xs font-bold text-ink-900">{diagnosticResult.oemManualReference}</div>
                  <blockquote className="border-l-2 border-signal-500 bg-deck-100 p-2.5 text-xs italic text-ink-700 leading-relaxed rounded-r-md">
                    "{diagnosticResult.manualExcerpt}"
                  </blockquote>
                </div>
              )}
            </div>

            {/* Live Telemetry Snapshot */}
            {diagnosticResult.telemetrySnapshot && (
              <div className="rounded-panel border border-deck-300 bg-deck-100 p-4">
                <span className="text-[11px] font-mono uppercase text-ink-500 font-bold mb-3 block">
                  Operating Transducer Readings
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  <div className="rounded-plate bg-deck-50 p-2.5 border border-deck-300 shadow-xs">
                    <div className="text-[10px] text-ink-500">Discharge Temp</div>
                    <div className="font-mono text-xs font-bold text-alarm-600 mt-0.5">
                      {diagnosticResult.telemetrySnapshot.dischargeTemp}
                    </div>
                  </div>
                  <div className="rounded-plate bg-deck-50 p-2.5 border border-deck-300 shadow-xs">
                    <div className="text-[10px] text-ink-500">Suction Pressure</div>
                    <div className="font-mono text-xs font-bold text-ink-900 mt-0.5">
                      {diagnosticResult.telemetrySnapshot.suctionPressure}
                    </div>
                  </div>
                  <div className="rounded-plate bg-deck-50 p-2.5 border border-deck-300 shadow-xs">
                    <div className="text-[10px] text-ink-500">Ambient Temp</div>
                    <div className="font-mono text-xs font-bold text-ink-900 mt-0.5">
                      {diagnosticResult.telemetrySnapshot.ambientTemp}
                    </div>
                  </div>
                  <div className="rounded-plate bg-deck-50 p-2.5 border border-deck-300 shadow-xs">
                    <div className="text-[10px] text-ink-500">Subcooling</div>
                    <div className="font-mono text-xs font-bold text-signal-700 mt-0.5">
                      {diagnosticResult.telemetrySnapshot.subcooling}
                    </div>
                  </div>
                  <div className="rounded-plate bg-deck-50 p-2.5 border border-deck-300 shadow-xs">
                    <div className="text-[10px] text-ink-500">Superheat</div>
                    <div className="font-mono text-xs font-bold text-signal-700 mt-0.5">
                      {diagnosticResult.telemetrySnapshot.superheat}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Required Tools & Est Time */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-panel border border-deck-300 bg-deck-100 p-4 text-xs">
              <div>
                <span className="text-ink-500">Required Tools: </span>
                <span className="text-ink-900 font-bold">{diagnosticResult.requiredTools?.join(' • ')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-signal-700 font-bold">
                <Clock className="h-4 w-4" />
                <span>Est. Resolution: {diagnosticResult.estimatedTimeMinutes} min</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-deck-300">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-1.5 rounded-panel border border-deck-300 bg-deck-50 px-4 py-2.5 text-xs font-semibold text-ink-700 hover:bg-deck-100 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Modify Parameters</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    onOpenChatWithContext(
                      selectedEquipmentId,
                      selectedErrorCode,
                      0,
                      'What should I check first for this alarm?'
                    )
                  }
                  className="flex items-center gap-1.5 rounded-panel border border-signal-600/30 bg-signal-100 px-4 py-2.5 text-xs font-bold text-signal-700 hover:bg-signal-100 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Ask FieldMind</span>
                </button>

                <button
                  id="diag-step3-proceed-btn"
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-2 rounded-panel bg-chassis-900 px-6 py-3 text-xs font-bold text-white shadow-md shadow-chassis-900/20 transition hover:bg-chassis-800 cursor-pointer"
                >
                  <span>Start the guided repair</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: GUIDED REPAIR PROCEDURE */}
        {currentStep === 4 && (
          <div className="space-y-6 rounded-panel border border-deck-300 bg-deck-50 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-deck-300 pb-4">
              <div>
                <div className="flex items-center gap-2 text-signal-700 text-xs font-mono uppercase font-bold">
                  <ShieldCheck className="h-4 w-4 text-verified-600" />
                  <span>Step 4 &mdash; Guide</span>
                </div>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold text-ink-900">
                  Guided Repair: {selectedEquipment.name}
                </h2>
                <p className="text-xs text-ink-500">
                  Follow each safety-verified checklist item. Mark complete as you verify on physical equipment.
                </p>
              </div>

              {/* Progress Count */}
              <div className="rounded-panel border border-deck-300 bg-deck-100 px-4 py-2 text-right">
                <div className="text-[10px] text-ink-500 uppercase font-mono font-bold">Progress</div>
                <div className="text-sm font-bold text-ink-900">
                  {repairSteps.filter((s) => s.completed).length} / {repairSteps.length} Steps Done
                </div>
              </div>
            </div>

            {/* The 5 Guided Steps List */}
            <div className="space-y-4">
              {repairSteps.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                const isDone = step.completed;

                return (
                  <div
                    key={step.id}
                    className={`rounded-panel border p-4 sm:p-5 transition ${
                      isActive
                        ? 'border-signal-500 bg-signal-100/40 ring-1 ring-signal-500/50 shadow-xs'
                        : isDone
                        ? 'border-verified-600/30 bg-verified-100/50'
                        : 'border-deck-300 bg-deck-50 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => handleToggleStepCompleted(idx)}
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-plate border text-xs font-bold transition cursor-pointer ${
                            isDone
                              ? 'bg-verified-600 border-verified-600 text-white'
                              : isActive
                              ? 'border-signal-500 text-signal-700 bg-deck-50'
                              : 'border-deck-300 text-ink-500 bg-deck-100'
                          }`}
                        >
                          {isDone ? <Check className="h-4 w-4 stroke-[3]" /> : idx + 1}
                        </button>

                        <div className="space-y-1.5">
                          <h4 className="text-sm sm:text-base font-bold text-ink-900">
                            {step.instruction}
                          </h4>
                          <p className="text-xs text-ink-500 leading-relaxed">
                            {step.details}
                          </p>

                          {step.safetyCheck && (
                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-plate bg-signal-100 border border-signal-600/30 px-2.5 py-1 text-[11px] font-bold text-signal-700">
                              <AlertTriangle className="h-3.5 w-3.5 text-signal-700" />
                              <span>{step.safetyCheck}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Step Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            onOpenChatWithContext(
                              selectedEquipmentId,
                              selectedErrorCode,
                              idx,
                              `What should I check for step ${idx + 1}: ${step.instruction}?`
                            )
                          }
                          title="Ask FieldMind about this step"
                          className="flex items-center gap-1 rounded-plate border border-deck-300 bg-deck-50 px-2.5 py-1.5 text-[11px] font-bold text-signal-700 hover:bg-deck-100 cursor-pointer shadow-xs"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Ask FieldMind</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveStepIndex(idx);
                            handleToggleStepCompleted(idx);
                          }}
                          className={`rounded-plate px-3 py-1.5 text-xs font-bold transition cursor-pointer shadow-xs ${
                            isDone
                              ? 'bg-verified-100 text-verified-700 border border-verified-600/40 hover:bg-verified-100'
                              : 'bg-chassis-900 text-white hover:bg-chassis-800'
                          }`}
                        >
                          {isDone ? 'Completed ✓' : 'Mark Step Complete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Guided Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-deck-300">
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-1.5 rounded-panel border border-deck-300 bg-deck-50 px-4 py-2.5 text-xs font-semibold text-ink-700 hover:bg-deck-100 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Diagnosis</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  id="diag-step4-next-step-btn"
                  onClick={handleNextRepairStep}
                  className="flex items-center gap-2 rounded-panel bg-chassis-900 px-6 py-3 text-xs font-bold text-white shadow-md shadow-chassis-900/20 transition hover:bg-chassis-800 cursor-pointer"
                >
                  <span>
                    {activeStepIndex < repairSteps.length - 1
                      ? `Next Step (${activeStepIndex + 2}/${repairSteps.length})`
                      : 'Complete Guided Steps'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: COMPLETE THE JOB */}
        {currentStep === 5 && (
          <div className="space-y-6 rounded-panel border border-deck-300 bg-deck-50 p-6 sm:p-8 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-verified-700 text-xs font-mono uppercase font-bold">
                <CheckCircle2 className="h-4 w-4 text-verified-600" />
                <span>Step 5 &mdash; Complete</span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-ink-900">
                Complete Job & Record Verification Readings
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-ink-500">
                Confirm post-service readings, parts used, and technician sign-off notes before generating the official service report.
              </p>
            </div>

            {/* Post-repair Telemetry Verification */}
            <div className="rounded-panel border border-deck-300 bg-deck-100 p-4">
              <span className="text-xs font-bold text-ink-900 uppercase tracking-wide mb-3 block">
                Post-Service Operating Verification Readings
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-ink-500">Discharge Temp (Normal)</label>
                  <input
                    type="text"
                    value={finalReadings.dischargeTemp}
                    onChange={(e) => setFinalReadings({ ...finalReadings, dischargeTemp: e.target.value })}
                    className="mt-1 w-full rounded-plate border border-deck-300 bg-deck-50 p-2 text-xs text-ink-900 focus:border-signal-500 focus:outline-none shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-ink-500">Suction Pressure (PSIG)</label>
                  <input
                    type="text"
                    value={finalReadings.suctionPressure}
                    onChange={(e) => setFinalReadings({ ...finalReadings, suctionPressure: e.target.value })}
                    className="mt-1 w-full rounded-plate border border-deck-300 bg-deck-50 p-2 text-xs text-ink-900 focus:border-signal-500 focus:outline-none shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-ink-500">Motor Amperage Draw</label>
                  <input
                    type="text"
                    value={finalReadings.runningAmps}
                    onChange={(e) => setFinalReadings({ ...finalReadings, runningAmps: e.target.value })}
                    className="mt-1 w-full rounded-plate border border-deck-300 bg-deck-50 p-2 text-xs text-ink-900 focus:border-signal-500 focus:outline-none shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-ink-500">Ambient Temp (°F)</label>
                  <input
                    type="text"
                    value={finalReadings.ambientTemp}
                    onChange={(e) => setFinalReadings({ ...finalReadings, ambientTemp: e.target.value })}
                    className="mt-1 w-full rounded-plate border border-deck-300 bg-deck-50 p-2 text-xs text-ink-900 focus:border-signal-500 focus:outline-none shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Parts Replaced */}
            <div>
              <label className="block text-xs font-bold text-ink-700 uppercase tracking-wide mb-2">
                Parts & Materials Utilized
              </label>
              <input
                type="text"
                value={partsReplacedInput}
                onChange={(e) => setPartsReplacedInput(e.target.value)}
                className="w-full rounded-panel border border-deck-300 bg-deck-50 p-3 text-xs text-ink-900 placeholder-ink-400 focus:border-signal-500 focus:ring-1 focus:ring-signal-500 focus:outline-none shadow-xs"
              />
            </div>

            {/* Final Technician Notes */}
            <div>
              <label className="block text-xs font-bold text-ink-700 uppercase tracking-wide mb-2">
                Technician Resolution Summary & Field Log
              </label>
              <textarea
                rows={3}
                value={technicianSignoffNotes}
                onChange={(e) => setTechnicianSignoffNotes(e.target.value)}
                className="w-full rounded-panel border border-deck-300 bg-deck-50 p-3 text-xs text-ink-900 placeholder-ink-400 focus:border-signal-500 focus:ring-1 focus:ring-signal-500 focus:outline-none shadow-xs"
              />
            </div>

            {/* Signoff Checkbox */}
            <div className="rounded-panel border border-verified-600/30 bg-verified-100 p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-verified-600 shrink-0" />
              <div className="text-xs text-verified-700">
                <span className="font-bold">Technician Verification: </span>
                All 5 safety inspection procedures were executed per OEM guidelines. The E04 thermal alarm was cleared, and the system is verified operating safely within OEM thermal bounds.
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-deck-300">
              <button
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-1.5 rounded-panel border border-deck-300 bg-deck-50 px-4 py-2.5 text-xs font-semibold text-ink-700 hover:bg-deck-100 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Procedures</span>
              </button>

              <button
                id="diag-step5-gen-report-btn"
                onClick={handleGenerateServiceReport}
                disabled={isGeneratingReport}
                className="flex items-center gap-2 rounded-panel bg-verified-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-chassis-900/20 transition hover:bg-verified-700 disabled:opacity-60 cursor-pointer"
              >
                {isGeneratingReport ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-deck-50 border-t-transparent" />
                    <span>Compiling service report&hellip;</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 fill-white" />
                    <span>Generate FieldMind Service Report</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: STRUCTURED SERVICE REPORT */}
        {currentStep === 6 && generatedReport && (
          <div className="space-y-6 rounded-panel border border-deck-300 bg-deck-50 p-6 sm:p-8 shadow-xs">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-deck-300 pb-4 no-print">
              <div>
                <div className="flex items-center gap-2 text-verified-700 text-xs font-mono uppercase font-bold">
                  <FileText className="h-4 w-4" />
                  <span>Step 6 &mdash; Report</span>
                </div>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold text-ink-900">
                  FieldMind Service Report
                </h2>
                <p className="text-xs text-ink-500">
                  Report ID: <span className="text-signal-700 font-mono font-bold">{generatedReport.id}</span> • Generated {new Date(generatedReport.timestamp).toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  id="report-download-btn"
                  onClick={handleDownloadReport}
                  className="flex items-center gap-1.5 rounded-panel border border-deck-300 bg-deck-50 px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:bg-deck-100 cursor-pointer shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download / Print Report</span>
                </button>

                <button
                  id="report-save-btn"
                  onClick={handleSaveToFleet}
                  disabled={isReportSaved}
                  className={`flex items-center gap-1.5 rounded-panel px-4 py-2 text-xs font-bold transition cursor-pointer shadow-xs ${
                    isReportSaved
                      ? 'bg-verified-100 text-verified-700 border border-verified-600/40'
                      : 'bg-chassis-900 text-white hover:bg-chassis-800 shadow-md shadow-chassis-900/20'
                  }`}
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isReportSaved ? 'Saved to Supervisor Hub ✓' : 'Save Report to Fleet'}</span>
                </button>

                <button
                  id="report-supervisor-view-btn"
                  onClick={onViewSupervisor}
                  className="flex items-center gap-1.5 rounded-panel border border-signal-600/30 bg-signal-100 px-3.5 py-2 text-xs font-bold text-signal-700 hover:bg-signal-100 cursor-pointer shadow-xs"
                >
                  <span>Open Supervisor Hub</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* The Formal Document Paper Layout */}
            <div className="fm-doc rounded-panel border border-deck-300 bg-deck-100 p-6 sm:p-8 space-y-6 text-xs text-ink-700 shadow-xs">
              {/* Report Letterhead */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-deck-300 pb-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-plate bg-chassis-900 text-deck-50 shadow-xs">
                      <FieldMindMark size={19} />
                    </span>
                    <span className="fm-display text-lg text-ink-900">
                      Field Service Report
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-ink-500">
                    FieldMind AI &middot; Commercial HVAC &amp; industrial maintenance
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono text-[11px]">
                  <div className="text-ink-500">REPORT NO: <span className="text-signal-700 font-bold">{generatedReport.id}</span></div>
                  <div className="text-ink-500">STATUS: <span className="text-verified-700 font-bold uppercase">{generatedReport.status}</span></div>
                </div>
              </div>

              {/* Meta Grid: Equipment & Tech */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-panel bg-deck-50 p-4 border border-deck-300 shadow-xs">
                <div>
                  <span className="text-[10px] uppercase text-ink-400 font-mono block">Equipment</span>
                  <span className="font-bold text-ink-900 text-xs block truncate">{generatedReport.equipmentName}</span>
                  <span className="text-[11px] text-ink-500">{generatedReport.modelNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-ink-400 font-mono block">Location</span>
                  <span className="font-bold text-ink-900 text-xs block">{generatedReport.location}</span>
                  <span className="text-[11px] text-ink-500">Serial: {generatedReport.serialNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-ink-400 font-mono block">Technician</span>
                  <span className="font-bold text-ink-900 text-xs block">{generatedReport.technicianName}</span>
                  <span className="text-[11px] text-ink-500">ID: {generatedReport.technicianId}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-ink-400 font-mono block">Reported Alarm</span>
                  <span className="font-bold text-alarm-600 text-xs block">{generatedReport.reportedIssue}</span>
                  <span className="text-[11px] text-signal-700 font-semibold">Confidence: {generatedReport.confidenceScore}%</span>
                </div>
              </div>

              {/* Diagnosis & Root Cause */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-signal-700 uppercase tracking-wider font-mono">
                  1. FieldMind Diagnosis & Root Cause
                </h4>
                <div className="rounded-panel border border-deck-300 bg-deck-50 p-4 space-y-2 shadow-xs">
                  <p className="font-bold text-ink-900">{generatedReport.aiDiagnosisSummary}</p>
                  <p className="text-ink-500 leading-relaxed text-xs">{generatedReport.rootCause}</p>
                </div>
              </div>

              {/* Steps Performed */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-signal-700 uppercase tracking-wider font-mono">
                  2. Safety Steps & Corrective Procedures Executed
                </h4>
                <div className="space-y-2">
                  {generatedReport.stepsCompleted.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="flex items-start gap-2.5 rounded-plate border border-deck-300 bg-deck-50 p-3 shadow-xs"
                    >
                      <CheckCircle2 className="h-4 w-4 text-verified-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-ink-900">Step {step.stepNumber}: {step.description}</div>
                        {step.notes && <div className="text-[11px] text-ink-500 mt-0.5">{step.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Narrative & Parts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-signal-700 uppercase tracking-wider font-mono">
                    3. Final Resolution Narrative
                  </h4>
                  <div className="rounded-panel border border-deck-300 bg-deck-50 p-3.5 text-xs text-ink-700 leading-relaxed shadow-xs">
                    {generatedReport.resolutionSummary}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-signal-700 uppercase tracking-wider font-mono">
                    4. Parts Replaced & Safety Compliance
                  </h4>
                  <div className="rounded-panel border border-deck-300 bg-deck-50 p-3.5 space-y-2 shadow-xs">
                    <div>
                      <span className="text-ink-500">Parts Used: </span>
                      <span className="font-bold text-ink-900">{generatedReport.partsReplaced.join(', ') || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-ink-500">Safety Verified: </span>
                      <span className="font-bold text-verified-700">OSHA LOTO 1910.147 Compliant</span>
                    </div>
                    <p className="text-[11px] text-ink-500">{generatedReport.safetyNotes}</p>
                  </div>
                </div>
              </div>

              {/* Signoff Stamp */}
              <div className="border-t border-deck-300 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-ink-500">
                <div>
                  <span className="font-bold text-ink-700">Technician Signature: </span>
                  <span className="font-mono text-signal-700 font-bold">/s/ {generatedReport.technicianName} ({generatedReport.technicianId})</span>
                </div>
                <div>
                  <span className="font-bold text-ink-700">Service Duration: </span>
                  <span className="font-semibold text-ink-900">{generatedReport.durationMinutes} Minutes</span>
                </div>
              </div>
            </div>

            {/* Completion banner */}
            <div className="rounded-panel border border-chassis-700 bg-chassis-900 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-9 w-[2px] shrink-0 bg-signal-500" aria-hidden="true" />
                <div>
                  <h4 className="text-sm font-bold text-deck-50">
                    Job closed and documented
                  </h4>
                  <p className="mt-0.5 text-xs text-deck-50/60">
                    The service report is queued for supervisor sign-off in the Supervisor Hub.
                  </p>
                </div>
              </div>

              <button
                onClick={onViewSupervisor}
                className="rounded-panel bg-signal-500 px-5 py-2.5 text-xs font-bold text-chassis-950 transition hover:bg-signal-400 flex items-center gap-1.5 shrink-0 cursor-pointer active:translate-y-px"
              >
                <span>Go to Supervisor Hub</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
