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
  Sparkles,
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
  Bot,
  Zap,
  Check,
} from 'lucide-react';
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
    <div className="min-h-screen bg-[#F1F5F9] px-4 py-8 sm:px-6 lg:px-8 text-slate-800">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Step Progress Tracker */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
              Interactive AI Diagnostic Workflow
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Step {currentStep} of 6
            </span>
          </div>

          {/* Stepper Dots & Labels */}
          <div className="grid grid-cols-6 gap-2">
            {[
              { num: 1, label: '1. Scan Photo' },
              { num: 2, label: '2. Select Code' },
              { num: 3, label: '3. AI Analysis' },
              { num: 4, label: '4. Guided Fix' },
              { num: 5, label: '5. Complete' },
              { num: 6, label: '6. Report' },
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
                  className={`flex flex-col items-center gap-1 rounded-xl py-2 px-1 text-center transition cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-50 border border-blue-300 text-blue-700 font-bold shadow-xs'
                      : isPassed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium'
                      : 'bg-slate-50 text-slate-400 border border-slate-200'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
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
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-blue-700 text-xs font-mono uppercase font-bold">
                <Camera className="h-4 w-4" />
                <span>Step 1: Visual Capture & Optical Input</span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
                Select or Upload Equipment Photo
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Capture the control panel alarm display, equipment serial plate, or mechanical issue using your phone camera.
              </p>
            </div>

            {/* Realistic Pre-loaded Test Photos */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Simulated Hackathon Test Images (or Upload Custom)
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
                      className={`group relative overflow-hidden rounded-xl border text-left transition cursor-pointer shadow-xs ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/40'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="h-28 w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="rounded-md bg-red-50 border border-red-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-red-700">
                            Alarm: {photo.errorCode}
                          </span>
                          {isSelected && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        <h4 className="mt-1.5 text-xs font-bold text-slate-900 line-clamp-1">
                          {photo.title}
                        </h4>
                        <p className="mt-0.5 text-[10px] text-slate-500 line-clamp-2">
                          {photo.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Upload Dropzone */}
            <div className="rounded-xl border border-dashed border-slate-300 bg-[#F8FAFC] p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-slate-400" />
              <div className="mt-2 text-xs font-bold text-slate-800">
                Upload custom equipment photo or camera snapshot
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Supports PNG, JPG, WEBP from mobile camera capture
              </p>
              <label className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 shadow-xs">
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
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                id="diag-step1-next-btn"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 cursor-pointer"
              >
                <span>Continue to Equipment & Error Code</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT EQUIPMENT & ERROR CODE */}
        {currentStep === 2 && (
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-blue-700 text-xs font-mono uppercase font-bold">
                <Wrench className="h-4 w-4" />
                <span>Step 2: Model & Alarm Selection</span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
                Select Simulated Equipment Type & Error Code
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                For reliable MVP demonstration, select the target equipment and reported alarm code from the simulated knowledge base.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Equipment Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Target Equipment
                </label>
                <select
                  id="diag-equipment-select"
                  value={selectedEquipmentId}
                  onChange={(e) => setSelectedEquipmentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-xs"
                >
                  {equipmentList.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} ({eq.model})
                    </option>
                  ))}
                </select>

                {/* Selected Equipment Snapshot */}
                <div className="mt-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5 space-y-2 text-xs">
                  <div className="font-bold text-slate-900">{selectedEquipment.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>Capacity: <span className="text-slate-900 font-semibold">{selectedEquipment.tonnage}</span></div>
                    <div>Voltage: <span className="text-slate-900 font-semibold">{selectedEquipment.voltage}</span></div>
                    <div>Refrigerant: <span className="text-slate-900 font-semibold">{selectedEquipment.refrigerant}</span></div>
                    <div>Location: <span className="text-slate-900 font-semibold">{selectedEquipment.location}</span></div>
                  </div>
                  <div className="border-t border-slate-200 pt-2 text-[10px] text-blue-700 font-semibold flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>OEM Manual: {selectedEquipment.manualTitle}</span>
                  </div>
                </div>
              </div>

              {/* Error Code Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Reported Error Code
                </label>
                <select
                  id="diag-error-select"
                  value={selectedErrorCode}
                  onChange={(e) => setSelectedErrorCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-xs"
                >
                  {errorCodes.map((err) => (
                    <option key={err.code} value={err.code}>
                      {err.code} - {err.title} ({err.severity.toUpperCase()})
                    </option>
                  ))}
                </select>

                {/* Selected Error Snapshot */}
                <div className="mt-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-700">Alarm {selectedError.code}: {selectedError.title}</span>
                    <span className="rounded-md bg-red-50 border border-red-200 px-1.5 py-0.5 text-[10px] font-bold text-red-700 uppercase">
                      {selectedError.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{selectedError.likelyCause}</p>
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-[10px] text-amber-800 flex items-start gap-1.5 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
                    <span>{selectedError.safetyWarning}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Notes Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Technician On-Site Observations (Optional Prompt Context)
              </label>
              <textarea
                rows={2}
                value={technicianFieldNotes}
                onChange={(e) => setTechnicianFieldNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-xs"
                placeholder="e.g. Compressor casing hot to touch, fan running at half speed, visual dust on return grilles..."
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                id="diag-step2-run-btn"
                onClick={handleRunDiagnosis}
                disabled={isDiagnosing}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                {isDiagnosing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Gemini AI Analyzing Telemetry & Manuals...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-blue-200" />
                    <span>Run AI Diagnosis Engine</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SHOW AI ANALYSIS */}
        {currentStep === 3 && diagnosticResult && (
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            {/* Insufficient Information Banner if Detected */}
            {diagnosticResult.isInsufficientInfo && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 sm:p-5 text-amber-900">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                      Safety Alert: Insufficient Diagnostic Information
                    </h3>
                    <p className="mt-1 text-xs text-amber-900 leading-relaxed">
                      {diagnosticResult.insufficientInfoNotice ||
                        'The supplied equipment parameters or error code were not found in the verified simulated OEM knowledge base. FieldMind AI prioritizes technician safety and will not invent equipment specifications or unsafe repair procedures.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Diagnostic Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-blue-700 text-xs font-mono uppercase font-bold">
                  <Sparkles className="h-4 w-4" />
                  <span>Step 3: Structured AI Diagnostic Reasoning</span>
                </div>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
                  {diagnosticResult.equipment || diagnosticResult.equipmentName}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-red-50 border border-red-200 px-2 py-0.5 font-mono text-xs font-bold text-red-700">
                    {diagnosticResult.issue || `${diagnosticResult.errorCode} - ${diagnosticResult.errorTitle}`}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      diagnosticResult.severity === 'critical'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : diagnosticResult.severity === 'high'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : diagnosticResult.severity === 'medium'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    Severity: {diagnosticResult.severity || 'HIGH'}
                  </span>
                </div>
              </div>

              {/* Confidence Gauge Badge */}
              <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5">
                <div className="text-right">
                  <div className="text-[10px] text-blue-700 uppercase font-mono font-bold">Confidence Score</div>
                  <div className="text-xl font-extrabold text-blue-900">
                    {diagnosticResult.confidence ?? diagnosticResult.confidenceScore}%
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                  <Zap className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Safety Warning Card (Highest Priority) */}
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white shadow-xs">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Mandatory Safety Protocol (OSHA 1910.147 LOTO)
                  </h4>
                  <p className="mt-1 text-xs text-amber-800 leading-relaxed font-medium">
                    {diagnosticResult.safetyWarning}
                  </p>
                </div>
              </div>
            </div>

            {/* Root Cause & Diagnostic Findings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Likely Cause Card */}
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 space-y-2">
                <span className="text-[11px] font-mono uppercase text-blue-700 font-bold">
                  Likely Cause
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {diagnosticResult.likelyCause}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {diagnosticResult.rootCauseAnalysis}
                </p>
              </div>

              {/* When To Escalate Card */}
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-5 space-y-2">
                <span className="text-[11px] font-mono uppercase text-indigo-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>When to Escalate to Senior Specialist</span>
                </span>
                <h3 className="text-xs font-bold text-slate-900">
                  Escalation Threshold Criteria:
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {diagnosticResult.whenToEscalate ||
                    'Escalate to Tier-3 Refrigeration Engineer if sensor readings remain out of tolerance after verifying standard physical checklist.'}
                </p>
              </div>
            </div>

            {/* Recommended Steps Overview */}
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 space-y-3">
              <span className="text-[11px] font-mono uppercase text-blue-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Recommended Actionable Steps</span>
              </span>
              <div className="space-y-2">
                {(diagnosticResult.steps || diagnosticResult.recommendedSteps?.map((s) => s.instruction) || []).map(
                  (stepText: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-xs"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-slate-800 font-medium leading-relaxed">{stepText}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Source Documentation & Citations */}
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-blue-700 font-bold">
                <BookOpen className="h-4 w-4" />
                <span>Source Documentation & Verified Citations</span>
              </div>

              {diagnosticResult.documentation && diagnosticResult.documentation.length > 0 ? (
                <div className="space-y-3">
                  {diagnosticResult.documentation.map((doc, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4 space-y-2 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">{doc.document}</span>
                        {doc.section && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-700 font-semibold">
                            {doc.section}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                        <span>Citation:</span>
                        <span className="text-slate-800 font-normal">{doc.citation}</span>
                      </div>
                      {doc.excerpt && (
                        <blockquote className="border-l-2 border-blue-600 bg-slate-50 p-2.5 text-xs italic text-slate-700 leading-relaxed rounded-r-md">
                          "{doc.excerpt}"
                        </blockquote>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2">
                  <div className="text-xs font-bold text-slate-900">{diagnosticResult.oemManualReference}</div>
                  <blockquote className="border-l-2 border-blue-600 bg-slate-50 p-2.5 text-xs italic text-slate-700 leading-relaxed rounded-r-md">
                    "{diagnosticResult.manualExcerpt}"
                  </blockquote>
                </div>
              )}
            </div>

            {/* Simulated Live Telemetry Snapshot */}
            {diagnosticResult.telemetrySnapshot && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                <span className="text-[11px] font-mono uppercase text-slate-500 font-bold mb-3 block">
                  Simulated Operating Transducer Readings
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-500">Discharge Temp</div>
                    <div className="font-mono text-xs font-bold text-red-600 mt-0.5">
                      {diagnosticResult.telemetrySnapshot.dischargeTemp}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-500">Suction Pressure</div>
                    <div className="font-mono text-xs font-bold text-slate-900 mt-0.5">
                      {diagnosticResult.telemetrySnapshot.suctionPressure}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-500">Ambient Temp</div>
                    <div className="font-mono text-xs font-bold text-slate-900 mt-0.5">
                      {diagnosticResult.telemetrySnapshot.ambientTemp}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-500">Subcooling</div>
                    <div className="font-mono text-xs font-bold text-blue-700 mt-0.5">
                      {diagnosticResult.telemetrySnapshot.subcooling}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-500">Superheat</div>
                    <div className="font-mono text-xs font-bold text-blue-700 mt-0.5">
                      {diagnosticResult.telemetrySnapshot.superheat}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Required Tools & Est Time */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 text-xs">
              <div>
                <span className="text-slate-500">Required Tools: </span>
                <span className="text-slate-900 font-bold">{diagnosticResult.requiredTools?.join(' • ')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                <Clock className="h-4 w-4" />
                <span>Est. Resolution: {diagnosticResult.estimatedTimeMinutes} min</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
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
                  className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Ask AI Copilot</span>
                </button>

                <button
                  id="diag-step3-proceed-btn"
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 cursor-pointer"
                >
                  <span>Proceed to Guided Repair Procedure</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: GUIDED REPAIR PROCEDURE */}
        {currentStep === 4 && (
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-blue-700 text-xs font-mono uppercase font-bold">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Step 4: Interactive Guided Repair Procedure</span>
                </div>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
                  Step-by-Step Resolution: {selectedEquipment.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Follow each safety-verified checklist item. Mark complete as you verify on physical equipment.
                </p>
              </div>

              {/* Progress Count */}
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-right">
                <div className="text-[10px] text-slate-500 uppercase font-mono font-bold">Progress</div>
                <div className="text-sm font-bold text-slate-900">
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
                    className={`rounded-xl border p-4 sm:p-5 transition ${
                      isActive
                        ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/50 shadow-xs'
                        : isDone
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-slate-200 bg-white opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => handleToggleStepCompleted(idx)}
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition cursor-pointer ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : isActive
                              ? 'border-blue-600 text-blue-700 bg-white'
                              : 'border-slate-300 text-slate-500 bg-slate-50'
                          }`}
                        >
                          {isDone ? <Check className="h-4 w-4 stroke-[3]" /> : idx + 1}
                        </button>

                        <div className="space-y-1.5">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">
                            {step.instruction}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {step.details}
                          </p>

                          {step.safetyCheck && (
                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
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
                          title="Ask AI regarding this specific step"
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-slate-50 cursor-pointer shadow-xs"
                        >
                          <Bot className="h-3.5 w-3.5" />
                          <span>Ask AI</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveStepIndex(idx);
                            handleToggleStepCompleted(idx);
                          }}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer shadow-xs ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
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
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Diagnosis</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  id="diag-step4-next-step-btn"
                  onClick={handleNextRepairStep}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 cursor-pointer"
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
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-mono uppercase font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Step 5: Job Verification & Signoff</span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
                Complete Job & Record Verification Readings
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Confirm post-service readings, parts used, and technician sign-off notes before generating the official service report.
              </p>
            </div>

            {/* Post-repair Telemetry Verification */}
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 block">
                Post-Service Operating Verification Readings
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Discharge Temp (Normal)</label>
                  <input
                    type="text"
                    value={finalReadings.dischargeTemp}
                    onChange={(e) => setFinalReadings({ ...finalReadings, dischargeTemp: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Suction Pressure (PSIG)</label>
                  <input
                    type="text"
                    value={finalReadings.suctionPressure}
                    onChange={(e) => setFinalReadings({ ...finalReadings, suctionPressure: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Motor Amperage Draw</label>
                  <input
                    type="text"
                    value={finalReadings.runningAmps}
                    onChange={(e) => setFinalReadings({ ...finalReadings, runningAmps: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Ambient Temp (°F)</label>
                  <input
                    type="text"
                    value={finalReadings.ambientTemp}
                    onChange={(e) => setFinalReadings({ ...finalReadings, ambientTemp: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Parts Replaced */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Parts & Materials Utilized
              </label>
              <input
                type="text"
                value={partsReplacedInput}
                onChange={(e) => setPartsReplacedInput(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-xs"
              />
            </div>

            {/* Final Technician Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Technician Resolution Summary & Field Log
              </label>
              <textarea
                rows={3}
                value={technicianSignoffNotes}
                onChange={(e) => setTechnicianSignoffNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-xs"
              />
            </div>

            {/* Signoff Checkbox */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-900">
                <span className="font-bold">Technician Verification: </span>
                All 5 safety inspection procedures were executed per OEM guidelines. The E04 thermal alarm was cleared, and the system is verified operating safely within OEM thermal bounds.
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Procedures</span>
              </button>

              <button
                id="diag-step5-gen-report-btn"
                onClick={handleGenerateServiceReport}
                disabled={isGeneratingReport}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
              >
                {isGeneratingReport ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Compiling AI Service Report...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 fill-white" />
                    <span>Generate Structured Service Report</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: STRUCTURED SERVICE REPORT */}
        {currentStep === 6 && generatedReport && (
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 no-print">
              <div>
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-mono uppercase font-bold">
                  <FileText className="h-4 w-4" />
                  <span>Step 6: Official Service Documentation</span>
                </div>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
                  FieldMind AI Service Report
                </h2>
                <p className="text-xs text-slate-500">
                  Report ID: <span className="text-blue-700 font-mono font-bold">{generatedReport.id}</span> • Generated {new Date(generatedReport.timestamp).toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  id="report-download-btn"
                  onClick={handleDownloadReport}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 cursor-pointer shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download / Print Report</span>
                </button>

                <button
                  id="report-save-btn"
                  onClick={handleSaveToFleet}
                  disabled={isReportSaved}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer shadow-xs ${
                    isReportSaved
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
                  }`}
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isReportSaved ? 'Saved to Supervisor Hub ✓' : 'Save Report to Fleet'}</span>
                </button>

                <button
                  id="report-supervisor-view-btn"
                  onClick={onViewSupervisor}
                  className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer shadow-xs"
                >
                  <span>Open Supervisor Hub</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* The Formal Document Paper Layout */}
            <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8 space-y-6 text-xs text-slate-700 shadow-xs">
              {/* Report Letterhead */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-xs shadow-xs">
                      F
                    </div>
                    <span className="text-base font-extrabold text-slate-900">FIELDMIND AI // FIELD SERVICE REPORT</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Enterprise HVAC & Industrial Maintenance System</p>
                </div>

                <div className="text-left sm:text-right font-mono text-[11px]">
                  <div className="text-slate-500">REPORT NO: <span className="text-blue-700 font-bold">{generatedReport.id}</span></div>
                  <div className="text-slate-500">STATUS: <span className="text-emerald-700 font-bold uppercase">{generatedReport.status}</span></div>
                </div>
              </div>

              {/* Meta Grid: Equipment & Tech */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl bg-white p-4 border border-slate-200 shadow-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-mono block">Equipment</span>
                  <span className="font-bold text-slate-900 text-xs block truncate">{generatedReport.equipmentName}</span>
                  <span className="text-[11px] text-slate-500">{generatedReport.modelNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-mono block">Location</span>
                  <span className="font-bold text-slate-900 text-xs block">{generatedReport.location}</span>
                  <span className="text-[11px] text-slate-500">Serial: {generatedReport.serialNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-mono block">Technician</span>
                  <span className="font-bold text-slate-900 text-xs block">{generatedReport.technicianName}</span>
                  <span className="text-[11px] text-slate-500">ID: {generatedReport.technicianId}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-mono block">Reported Alarm</span>
                  <span className="font-bold text-red-600 text-xs block">{generatedReport.reportedIssue}</span>
                  <span className="text-[11px] text-blue-700 font-semibold">Confidence: {generatedReport.confidenceScore}%</span>
                </div>
              </div>

              {/* AI Diagnosis & Root Cause */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
                  1. AI Diagnosis & Root Cause Analysis
                </h4>
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs">
                  <p className="font-bold text-slate-900">{generatedReport.aiDiagnosisSummary}</p>
                  <p className="text-slate-600 leading-relaxed text-xs">{generatedReport.rootCause}</p>
                </div>
              </div>

              {/* Steps Performed */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
                  2. Safety Steps & Corrective Procedures Executed
                </h4>
                <div className="space-y-2">
                  {generatedReport.stepsCompleted.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3 shadow-xs"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">Step {step.stepNumber}: {step.description}</div>
                        {step.notes && <div className="text-[11px] text-slate-500 mt-0.5">{step.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Narrative & Parts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
                    3. Final Resolution Narrative
                  </h4>
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-700 leading-relaxed shadow-xs">
                    {generatedReport.resolutionSummary}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
                    4. Parts Replaced & Safety Compliance
                  </h4>
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-xs">
                    <div>
                      <span className="text-slate-500">Parts Used: </span>
                      <span className="font-bold text-slate-900">{generatedReport.partsReplaced.join(', ') || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Safety Verified: </span>
                      <span className="font-bold text-emerald-700">OSHA LOTO 1910.147 Compliant</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{generatedReport.safetyNotes}</p>
                  </div>
                </div>
              </div>

              {/* Signoff Stamp */}
              <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-500">
                <div>
                  <span className="font-bold text-slate-700">Technician Signature: </span>
                  <span className="font-mono text-blue-700 font-bold">/s/ {generatedReport.technicianName} ({generatedReport.technicianId})</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Service Duration: </span>
                  <span className="font-semibold text-slate-900">{generatedReport.durationMinutes} Minutes</span>
                </div>
              </div>
            </div>

            {/* Bottom Demo Finish Banner */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div>
                <h4 className="text-sm font-bold text-blue-950">
                  Diagnosis & Resolution Complete!
                </h4>
                <p className="text-xs text-blue-800 mt-0.5">
                  The service report has been generated and queued for supervisor sign-off in the Supervisor Hub.
                </p>
              </div>

              <button
                onClick={onViewSupervisor}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                <span>Go to Supervisor Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
