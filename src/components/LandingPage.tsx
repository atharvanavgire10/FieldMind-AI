import React from 'react';
import { ViewMode } from '../types';
import {
  Sparkles,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  Cpu,
  Camera,
  Zap,
  Activity,
  Bot,
  BookOpen,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate?: (view: ViewMode) => void;
  onStartDemo?: () => void;
  onExploreDemo?: () => void;
  onLaunchDiagnosis?: (equipmentId?: string, errorCode?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onStartDemo,
  onExploreDemo,
  onLaunchDiagnosis,
}) => {
  const handleNav = (view: ViewMode) => {
    if (onNavigate) {
      onNavigate(view);
    } else if (onExploreDemo && (view === 'technician' || view === 'diagnosis')) {
      onExploreDemo();
    }
  };

  const handleStart = () => {
    if (onStartDemo) {
      onStartDemo();
    } else if (onLaunchDiagnosis) {
      onLaunchDiagnosis('eq-hvac-a', 'E04');
    } else if (onNavigate) {
      onNavigate('diagnosis');
    } else if (onExploreDemo) {
      onExploreDemo();
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-[#F1F5F9] text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Next-Gen Field Service Copilot for Industrial HVAC & Machinery</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
                An AI expert in every field worker's pocket.
              </h1>

              <p className="mt-5 text-lg font-normal text-slate-600 sm:text-xl max-w-2xl leading-relaxed">
                See the problem. Understand the cause. Get guided through the fix.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  id="hero-start-demo-btn"
                  onClick={handleStart}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-95 cursor-pointer"
                >
                  <Zap className="h-4 w-4 fill-white" />
                  <span>Launch 1-Click Demo Flow</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>

                <button
                  id="hero-open-app-btn"
                  onClick={() => handleNav('technician')}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                >
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <span>Open Technician App</span>
                </button>

                <button
                  id="hero-supervisor-btn"
                  onClick={() => handleNav('supervisor')}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
                >
                  <span>Supervisor Hub</span>
                </button>
              </div>

              {/* Trust & Safety Pills */}
              <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-slate-200 pt-6 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>OSHA 1910.147 LOTO Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span>OEM Manual Grounding</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-slate-600" />
                  <span>Server-Side Gemini 3.7 Engine</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup Preview */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50">
                {/* Mobile Device Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-mono text-blue-700 font-bold">FIELD COPILOT // ACTIVE RUNTIME</span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                </div>

                {/* Mock Visual Diagnostics Screen */}
                <div className="mt-4 space-y-3.5">
                  {/* Simulated Image Scan Banner */}
                  <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                      alt="Equipment Panel"
                      className="h-36 w-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5 rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                      ALARM DETECTED: E04
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white">
                      <span className="font-semibold">HVAC Unit A (TitanAir RTU-10X)</span>
                      <span className="rounded-md bg-slate-900/90 border border-slate-700 px-2 py-0.5 font-mono text-[10px] text-cyan-300 font-bold">
                        92% AI CONFIDENCE
                      </span>
                    </div>
                  </div>

                  {/* AI Root Cause Card */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span>Likely Root Cause</span>
                    </div>
                    <p className="mt-1 text-xs text-amber-900 leading-relaxed font-medium">
                      Compressor thermal protection trip caused by severe return airflow starvation and microchannel condenser fin restriction.
                    </p>
                  </div>

                  {/* Step Guided Snippet */}
                  <div className="space-y-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs">
                    <div className="text-[11px] font-semibold text-slate-500">Next Actionable Safety Step:</div>
                    <div className="flex items-start gap-2 text-slate-800 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>1. Switch off 460V main disconnect and apply LOTO padlock before opening chassis.</span>
                    </div>
                  </div>

                  {/* CTA inside mockup */}
                  <button
                    onClick={handleStart}
                    className="w-full rounded-xl bg-blue-50 border border-blue-200 py-2.5 text-center text-xs font-bold text-blue-700 transition hover:bg-blue-100 cursor-pointer shadow-xs"
                  >
                    Click to Test Guided Repair Demo →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE PROBLEM */}
      <section className="border-b border-slate-200 bg-[#F8FAFC] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">Industry Challenge</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Field technicians face complex equipment with fragmented knowledge.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              When industrial machinery breaks down, technicians spend 40% of their service window digging through 400-page PDF binders, searching obscure forums, or waiting on hold for senior supervisors.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 mb-4 border border-red-100">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Costly Equipment Downtime</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Critical HVAC & industrial systems sitting idle while technicians manually decode obscure error flashes.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 mb-4 border border-amber-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Safety & Compliance Risks</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Skipping Lock-Out/Tag-Out (LOTO) or guessing refrigerant limits can lead to electrical arc flash or compressor burst.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-4 border border-blue-100">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Tribal Knowledge Bottlenecks</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Veteran master mechanics retire, taking 30 years of field troubleshooting expertise with them.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 mb-4 border border-cyan-100">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Messy Manual Reports</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Handwritten notes and forgotten telemetry readings lead to warranty claim rejections and poor auditing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW FIELDMIND WORKS */}
      <section className="border-b border-slate-200 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">Intelligent Pipeline</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How FieldMind AI transforms the repair workflow
            </h2>
            <p className="mt-4 text-base text-slate-600">
              A 4-step AI loop purpose-built for the technician on the roof, in the plant, or down in the mechanical room.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                  01
                </span>
                <Camera className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Visual Equipment Capture</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Technician points phone camera at the equipment nameplate or LED alarm panel to identify model specs and error codes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                  02
                </span>
                <Cpu className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Contextual Gemini Reasoning</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Server-side AI correlates telemetry, error history, and OEM maintenance manuals to pinpoint root cause with confidence scoring.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
                  03
                </span>
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Safe Step-by-Step Procedure</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Step-by-step checklist enforces LOTO, specifies multimeter test points, and adapts dynamically if anomalies are discovered.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                  04
                </span>
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Instant Service Report</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                One-tap generation of professional PDF service reports with parts logged, digital signoff, and automatic supervisor dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE FEATURES */}
      <section className="border-b border-slate-200 bg-[#F8FAFC] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">Capability Matrix</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Engineered for real-world mechanical environments
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Built from the ground up for industrial field technicians, maintenance leads, and facility managers.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-5 border border-blue-100">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Contextual Copilot Chat</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Technicians can ask questions like <span className="text-blue-700 font-medium">"What should I check first?"</span> or <span className="text-blue-700 font-medium">"Why did this error occur?"</span> and receive grounded, safe answers.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-5 border border-emerald-100">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">OSHA-First Safety Guardrails</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                De-energization steps, Arc Flash boundaries, and EPA 608 refrigerant compliance are embedded before every mechanical intervention.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-5 border border-indigo-100">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Supervisor Operations Command</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Live dashboard tracking Mean Time to Resolution (MTTR), first-time fix rates, equipment health indices, and instant report approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PRODUCT WORKFLOW */}
      <section className="border-b border-slate-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">Interactive Walkthrough</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Simulated HVAC Domain Demo Scenario
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Experience the exact end-to-end diagnostic sequence for HVAC Unit A (Code E04).
              </p>
            </div>
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-blue-700 shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-white" />
              <span>Test E04 Diagnosis Demo Now</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 shadow-xs">
              <div className="text-xs font-mono font-bold text-blue-700 mb-2">PHASE 1 // INTAKE</div>
              <h4 className="text-sm font-bold text-slate-900">Equipment & Code Selection</h4>
              <p className="mt-2 text-xs text-slate-600">
                Select 10-Ton TitanAir Rooftop Unit + E04 Thermal Protection Trip from the built-in knowledge base.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 shadow-xs">
              <div className="text-xs font-mono font-bold text-indigo-700 mb-2">PHASE 2 // REPAIR</div>
              <h4 className="text-sm font-bold text-slate-900">Step-by-Step Resolution</h4>
              <p className="mt-2 text-xs text-slate-600">
                Execute 5 guided safety checks: LOTO electrical disconnect, inspect airflow, clean condenser coils, and check run capacitor.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 shadow-xs">
              <div className="text-xs font-mono font-bold text-emerald-700 mb-2">PHASE 3 // DISPATCH</div>
              <h4 className="text-sm font-bold text-slate-900">Report & Supervisor Sign-off</h4>
              <p className="mt-2 text-xs text-slate-600">
                Generate structured digital service report and view in the supervisor command hub in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY PHONE-FIRST AI */}
      <section className="border-b border-slate-200 bg-[#F8FAFC] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">Designed for the Field</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Why Phone-First AI is essential for industrial workers
              </h2>
              <div className="mt-6 space-y-4 text-xs text-slate-600 leading-relaxed">
                <p>
                  Industrial field technicians work on ladders, inside cramped boiler rooms, and on sun-baked rooftops. They do not have time to sit at a laptop with three browser tabs open.
                </p>
                <p>
                  FieldMind AI is designed around a mobile-first workflow: big high-contrast buttons, quick-tap checklists, clear audio-ready guidance, and camera integration.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="font-bold text-blue-700 text-xs">Gloves-Friendly UI</div>
                  <div className="text-[11px] text-slate-500 mt-1">High-contrast touch targets for rugged field tablets.</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="font-bold text-emerald-700 text-xs">Offline-Safe Fallback</div>
                  <div className="text-[11px] text-slate-500 mt-1">Local cached knowledge base when cell signals drop.</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Simulated Field Knowledge Base</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">5 Simulated Commercial HVAC Types</div>
                    <div className="text-[11px] text-slate-500">RTU-10X, Modular Chillers, VRF Heat Pumps, AHUs, VAVs</div>
                  </div>
                  <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] text-blue-700 font-mono font-bold">
                    ONLINE
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">10 Error Codes & OEM Manuals</div>
                    <div className="text-[11px] text-slate-500">E01 through E10 full fault tree troubleshooting matrices</div>
                  </div>
                  <span className="rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] text-indigo-700 font-mono font-bold">
                    INDEXED
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">Safety & LOTO Protocols</div>
                    <div className="text-[11px] text-slate-500">OSHA 1910.147 de-energization checkpoints</div>
                  </div>
                  <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] text-emerald-700 font-mono font-bold">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TECHNOLOGY */}
      <section className="border-b border-slate-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">System Architecture</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Server-Side AI Architecture
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Built with full-stack TypeScript, Express backend routes, Google Gemini reasoning models, and zero client-side key exposure.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-xs">
              <div className="font-mono text-xs text-blue-700 font-bold mb-2">GEMINI 3.7 FLASH</div>
              <h3 className="text-base font-bold text-slate-900">Multimodal Reasoning</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Processes error codes, equipment telemetry, technician observation notes, and OEM technical manuals to synthesize actionable diagnoses.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-xs">
              <div className="font-mono text-xs text-indigo-700 font-bold mb-2">SECURE PROXY API</div>
              <h3 className="text-base font-bold text-slate-900">Server-Side Execution</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                All AI reasoning calls execute server-side via Express routes (<code className="text-blue-700 font-mono bg-blue-50 px-1 rounded">/api/diagnose</code>, <code className="text-blue-700 font-mono bg-blue-50 px-1 rounded">/api/chat</code>) protecting credentials.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-xs">
              <div className="font-mono text-xs text-emerald-700 font-bold mb-2">REAL-TIME TELEMETRY</div>
              <h3 className="text-base font-bold text-slate-900">Simulated HVAC Data</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Realistic pressure transducers, temperature sensors, subcooling calculators, and live supervisor synchronization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: DEMO CTA */}
      <section className="bg-slate-900 py-16 lg:py-24 text-center text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/60 px-4 py-1.5 text-xs font-semibold text-blue-300 mb-6">
            <Zap className="h-4 w-4" />
            <span>Student Innovation Hackathon MVP</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
            Ready to test FieldMind AI?
          </h2>

          <p className="mt-4 text-base text-slate-300 max-w-2xl mx-auto">
            Experience how an AI copilot empowers field technicians to fix complex equipment safely and generate reports instantly.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              id="cta-start-demo-btn"
              onClick={handleStart}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/30 transition hover:bg-blue-700 active:scale-95 cursor-pointer"
            >
              <Zap className="h-5 w-5 fill-white" />
              <span>Launch 1-Click Judge Demo</span>
              <ArrowRight className="h-5 w-5 ml-1" />
            </button>

            <button
              onClick={() => handleNav('technician')}
              className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-4 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 cursor-pointer"
            >
              Open Technician Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8: FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white font-bold text-xs">
                F
              </div>
              <span className="font-bold text-slate-900">FieldMind AI</span>
              <span className="text-slate-500">— AI Field Service Copilot</span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-[11px] text-amber-700 font-medium">
                ⚠️ Hackathon Demo Notice: Simulated HVAC domain for demonstration. Always follow OSHA 1910.147 LOTO protocols.
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                Powered by Google Gemini 3.7 & full-stack TypeScript.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
