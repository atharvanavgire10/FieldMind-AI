import React from 'react';
import { ViewMode } from '../types';
import { FieldMindMark } from './BrandMark';
import {
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
  Activity,
  BookOpen,
  ScanLine,
  Stethoscope,
  MessageSquare,
  ListChecks,
  ClipboardCheck,
  Lock,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate?: (view: ViewMode) => void;
  onStartDemo?: () => void;
  onExploreDemo?: () => void;
  onLaunchDiagnosis?: (equipmentId?: string, errorCode?: string) => void;
}

const WORKFLOW = [
  {
    key: 'SEE',
    icon: Camera,
    title: 'Capture what the technician is looking at',
    body:
      'Point the phone at the nameplate or the alarm panel. The unit, model and fault code are identified from the photo, so nothing has to be typed in on a ladder.',
  },
  {
    key: 'UNDERSTAND',
    icon: Stethoscope,
    title: 'Read the fault against the manual',
    body:
      'FieldMind correlates the fault code, the unit telemetry and the OEM service documentation into a ranked likely cause, with a stated confidence level rather than a guess.',
  },
  {
    key: 'GUIDE',
    icon: ListChecks,
    title: 'Walk the repair one step at a time',
    body:
      'A procedure built for the panel in front of you: de-energization and lockout first, then the test points, the expected readings and the tools each step needs.',
  },
  {
    key: 'VERIFY',
    icon: CheckCircle2,
    title: 'Confirm each step on the spot',
    body:
      'Steps are checked off as they are completed. If a reading looks wrong mid-repair, ask FieldMind in place and keep the equipment context.',
  },
  {
    key: 'REPORT',
    icon: FileText,
    title: 'Close the job with a real document',
    body:
      'Equipment, issue, diagnosis, actions performed, resolution and safety notes assemble into a structured service report, ready for supervisor sign-off.',
  },
];

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
    <div className="flex min-h-screen flex-col bg-deck-100 text-ink-900">
      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden bg-chassis-950 pt-14 pb-16 lg:pt-20 lg:pb-24">
        <div className="fm-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_75%_60%_at_35%_0%,#000_55%,transparent_100%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
            {/* Left: proposition */}
            <div className="lg:col-span-7">
              <div className="fm-reveal flex items-center gap-2.5">
                <span className="h-3.5 w-[2px] bg-signal-500" aria-hidden="true" />
                <span className="fm-label text-deck-50/60">
                  Field service intelligence &middot; Commercial HVAC
                </span>
              </div>

              <h1 className="fm-reveal mt-6" style={{ animationDelay: '60ms' }}>
                <span className="fm-display block text-5xl leading-[0.92] text-deck-50 sm:text-6xl lg:text-7xl">
                  FIELDMIND<span className="text-signal-500"> AI</span>
                </span>
                <span className="mt-6 block max-w-xl text-xl font-normal leading-snug text-deck-50/85 sm:text-2xl">
                  An AI expert in every field worker&rsquo;s pocket.
                </span>
              </h1>

              <p
                className="fm-reveal mt-4 max-w-xl text-sm leading-relaxed text-deck-50/55 sm:text-base"
                style={{ animationDelay: '120ms' }}
              >
                See the problem. Understand the cause. Get guided through the fix.
              </p>

              <div
                className="fm-reveal mt-9 flex flex-wrap items-center gap-3"
                style={{ animationDelay: '180ms' }}
              >
                <button
                  id="hero-start-demo-btn"
                  onClick={handleStart}
                  className="flex cursor-pointer items-center gap-2 rounded-plate bg-signal-500 px-6 py-4 text-sm font-bold tracking-wide text-chassis-950 transition hover:bg-signal-400 active:translate-y-px"
                >
                  <ScanLine className="h-4 w-4" />
                  <span>Start Diagnosis</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>

                <button
                  id="hero-open-app-btn"
                  onClick={() => handleNav('technician')}
                  className="flex cursor-pointer items-center gap-2 rounded-plate border border-chassis-600 bg-chassis-800 px-5 py-4 text-sm font-semibold text-deck-50 transition hover:border-chassis-500 hover:bg-chassis-700"
                >
                  <Smartphone className="h-4 w-4 text-deck-50/60" />
                  <span>Explore FieldMind</span>
                </button>

                <button
                  id="hero-supervisor-btn"
                  onClick={() => handleNav('supervisor')}
                  className="cursor-pointer rounded-plate px-3 py-4 text-sm font-semibold text-deck-50/55 underline-offset-4 transition hover:text-deck-50 hover:underline"
                >
                  Supervisor Hub
                </button>
              </div>

              {/* Grounding row */}
              <dl className="mt-11 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-chassis-700 pt-7 sm:grid-cols-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-px h-4 w-4 shrink-0 text-verified-500" />
                  <div>
                    <dt className="text-xs font-semibold text-deck-50/90">Safety first, every time</dt>
                    <dd className="mt-0.5 text-[11px] leading-relaxed text-deck-50/45">
                      Lockout/tagout checkpoints ahead of any intervention
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <BookOpen className="mt-px h-4 w-4 shrink-0 text-signal-500" />
                  <div>
                    <dt className="text-xs font-semibold text-deck-50/90">Grounded in OEM manuals</dt>
                    <dd className="mt-0.5 text-[11px] leading-relaxed text-deck-50/45">
                      Answers cite the documentation they came from
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Lock className="mt-px h-4 w-4 shrink-0 text-deck-50/60" />
                  <div>
                    <dt className="text-xs font-semibold text-deck-50/90">Reasoning stays server-side</dt>
                    <dd className="mt-0.5 text-[11px] leading-relaxed text-deck-50/45">
                      No credentials are ever sent to the browser
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Right: product readout */}
            <div className="lg:col-span-5">
              <div
                className="fm-reveal mx-auto max-w-md rounded-panel border border-chassis-600 bg-chassis-900 shadow-2xl shadow-chassis-950/60"
                style={{ animationDelay: '220ms' }}
              >
                {/* Instrument header */}
                <div className="flex items-center justify-between border-b border-chassis-700 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FieldMindMark size={16} className="text-deck-50" />
                    <span className="fm-label text-deck-50/70">Active diagnosis</span>
                  </div>
                  <span className="font-mono text-[10px] font-semibold text-deck-50/40">JOB-4417</span>
                </div>

                {/* Fault banner */}
                <div className="border-b border-chassis-700 bg-chassis-800/60 px-4 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded-plate bg-alarm-600 px-2 py-1 font-mono text-[11px] font-bold text-white">
                        E04
                      </span>
                      <span className="text-xs font-semibold text-deck-50">
                        Compressor thermal trip
                      </span>
                    </div>
                    <span className="fm-label text-alarm-500">Critical</span>
                  </div>
                </div>

                {/* Equipment data plate */}
                <div className="divide-y divide-chassis-700/70 border-b border-chassis-700 px-4 py-1">
                  {[
                    ['Unit', 'HVAC Unit A'],
                    ['Model', 'TitanAir RTU-10X'],
                    ['Location', 'Building 4 — Roof'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-2.5">
                      <span className="fm-label text-deck-50/40">{k}</span>
                      <span className="font-mono text-[11px] text-deck-50/90">{v}</span>
                    </div>
                  ))}
                </div>

                {/* FieldMind analysis */}
                <div className="space-y-3 px-4 py-4">
                  <div className="flex items-baseline justify-between">
                    <span className="fm-label text-signal-500">FieldMind analysis</span>
                    <span className="font-mono text-[11px] font-bold text-deck-50">92%</span>
                  </div>

                  {/* Segmented confidence gauge */}
                  <div className="flex gap-[3px]" aria-hidden="true">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-[1px] ${
                          i < 11 ? 'bg-signal-500' : 'bg-chassis-600'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs leading-relaxed text-deck-50/70">
                    Thermal protection tripped by return-airflow starvation with condenser fin
                    restriction — not a failed compressor.
                  </p>

                  <div className="rounded-plate border border-signal-500/25 bg-signal-500/[0.07] p-3">
                    <div className="fm-label text-signal-400">Before you start</div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-deck-50/75">
                      Open the 460 V main disconnect and apply your lockout device before removing
                      any panel.
                    </p>
                  </div>

                  <div className="flex items-start gap-2 rounded-plate border border-chassis-700 bg-chassis-800/70 p-3">
                    <span className="mt-px font-mono text-[10px] font-bold text-signal-500">01</span>
                    <span className="text-[11px] leading-relaxed text-deck-50/80">
                      Verify zero energy at the compressor contactor terminals with a meter.
                    </span>
                  </div>

                  <button
                    onClick={handleStart}
                    className="w-full cursor-pointer rounded-plate border border-chassis-600 bg-chassis-800 py-3 text-xs font-bold tracking-wide text-deck-50 transition hover:border-signal-500/60 hover:bg-chassis-700"
                  >
                    Open the guided repair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ THE PROBLEM ============================ */}
      <section className="border-b border-deck-300 bg-deck-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="h-3.5 w-[2px] bg-signal-500" aria-hidden="true" />
              <span className="fm-label">What the job actually looks like</span>
            </div>
            <h2 className="fm-display mt-4 text-3xl leading-tight text-ink-900 sm:text-4xl">
              Complex equipment, scattered knowledge
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-500 sm:text-base">
              A technician on a rooftop gets a two-character fault code and a machine that will not
              run. The answer exists — in a service manual back at the shop, in a forum thread, or in
              the head of a senior colleague who is not picking up. Meanwhile the equipment stays
              down.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-panel border border-deck-300 bg-deck-300 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Clock,
                tone: 'text-alarm-600',
                title: 'Equipment stays down',
                body:
                  'Critical plant sits idle while a fault code gets decoded by trial and error.',
              },
              {
                icon: AlertTriangle,
                tone: 'text-signal-600',
                title: 'Safety steps get skipped',
                body:
                  'Working an energized panel without lockout, or guessing at refrigerant limits, is how people get hurt.',
              },
              {
                icon: Layers,
                tone: 'text-info-600',
                title: 'Experience walks out the door',
                body:
                  'When a veteran mechanic retires, decades of hard-won troubleshooting leaves with them.',
              },
              {
                icon: FileText,
                tone: 'text-ink-500',
                title: 'Paperwork arrives incomplete',
                body:
                  'Readings remembered hours later make for weak warranty claims and thin audit trails.',
              },
            ].map((card, i) => (
              <div key={card.title} className="bg-deck-50 p-6">
                <div className="flex items-center justify-between">
                  <span className="fm-label">{String(i + 1).padStart(2, '0')}</span>
                  <card.icon className={`h-[18px] w-[18px] ${card.tone}`} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-ink-900">{card.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== HOW IT WORKS ========================== */}
      <section className="border-b border-deck-300 bg-deck-100 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="h-3.5 w-[2px] bg-signal-500" aria-hidden="true" />
                <span className="fm-label">The FieldMind loop</span>
              </div>
              <h2 className="fm-display mt-4 text-3xl leading-tight text-ink-900 sm:text-4xl">
                Five stages, start to sign-off
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-500 sm:text-base">
                One continuous flow for the technician on the roof, in the plant, or down in the
                mechanical room — from the first photo to a filed service report.
              </p>
            </div>

            {/* Stage rail */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
              {WORKFLOW.map((s, i) => (
                <React.Fragment key={s.key}>
                  <span className="fm-display rounded-plate border border-deck-300 bg-deck-50 px-2.5 py-1.5 text-[11px] tracking-wider text-ink-700">
                    {s.key}
                  </span>
                  {i < WORKFLOW.length - 1 && (
                    <span className="text-signal-500" aria-hidden="true">
                      &rarr;
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <ol className="mt-12 space-y-px overflow-hidden rounded-panel border border-deck-300 bg-deck-300">
            {WORKFLOW.map((stage, i) => (
              <li
                key={stage.key}
                className="grid grid-cols-1 gap-4 bg-deck-50 p-6 sm:grid-cols-12 sm:items-start sm:gap-6 lg:p-7"
              >
                <div className="flex items-center gap-3 sm:col-span-3">
                  <span className="font-mono text-xs font-bold text-signal-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-plate bg-chassis-900 text-deck-50">
                    <stage.icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="fm-display text-lg tracking-wide text-ink-900">{stage.key}</span>
                </div>

                <div className="sm:col-span-9">
                  <h3 className="text-sm font-bold text-ink-900">{stage.title}</h3>
                  <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-ink-500 sm:text-[13px]">
                    {stage.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =========================== CAPABILITIES =========================== */}
      <section className="border-b border-deck-300 bg-deck-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="h-3.5 w-[2px] bg-signal-500" aria-hidden="true" />
              <span className="fm-label">Built for mechanical work</span>
            </div>
            <h2 className="fm-display mt-4 text-3xl leading-tight text-ink-900 sm:text-4xl">
              Designed around the panel, not the desk
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: MessageSquare,
                title: 'Ask FieldMind, mid-repair',
                body: (
                  <>
                    Questions like{' '}
                    <span className="font-medium text-ink-800">&ldquo;what should I check first?&rdquo;</span>{' '}
                    or{' '}
                    <span className="font-medium text-ink-800">&ldquo;why did this fault occur?&rdquo;</span>{' '}
                    are answered against the unit, the fault code and the step you are standing on.
                  </>
                ),
              },
              {
                icon: ShieldCheck,
                title: 'Safety written into the procedure',
                body: (
                  <>
                    De-energization, arc-flash boundaries and refrigerant handling appear as required
                    steps ahead of any mechanical intervention — not as a footnote.
                  </>
                ),
              },
              {
                icon: Activity,
                title: 'Supervisors can see the work',
                body: (
                  <>
                    Jobs in progress, completed reports, technician status and equipment health roll
                    up into one hub, with report approval in the same place.
                  </>
                ),
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-panel border border-deck-300 bg-deck-100 p-6 transition hover:border-deck-400"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-plate bg-chassis-900 text-deck-50">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-sm font-bold text-ink-900">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= WALKTHROUGH SCENARIO ======================= */}
      <section className="border-b border-deck-300 bg-deck-100 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-11 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="h-3.5 w-[2px] bg-signal-500" aria-hidden="true" />
                <span className="fm-label">Walkthrough</span>
              </div>
              <h2 className="fm-display mt-4 text-3xl leading-tight text-ink-900">
                HVAC Unit A &middot; Fault code E04
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                Run the full diagnostic sequence end to end on a sample rooftop unit, exactly as a
                technician would in the field.
              </p>
            </div>
            <button
              onClick={handleStart}
              className="inline-flex cursor-pointer items-center gap-2 self-start rounded-plate bg-chassis-900 px-5 py-3.5 text-xs font-bold tracking-wide text-deck-50 transition hover:bg-chassis-800"
            >
              <ScanLine className="h-4 w-4 text-signal-500" />
              <span>Run the E04 diagnosis</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                phase: 'Phase 1 — Intake',
                title: 'Equipment and code',
                body:
                  'Pick the 10-ton TitanAir rooftop unit and the E04 thermal protection trip from the built-in knowledge base, or upload your own panel photo.',
              },
              {
                phase: 'Phase 2 — Repair',
                title: 'Guided resolution',
                body:
                  'Work five verified steps: electrical lockout, airflow inspection, condenser coil cleaning, run capacitor check and restart validation.',
              },
              {
                phase: 'Phase 3 — Handover',
                title: 'Report and sign-off',
                body:
                  'Generate the structured service report and watch it appear in the supervisor hub for review and approval.',
              },
            ].map((p) => (
              <div key={p.phase} className="rounded-panel border border-deck-300 bg-deck-50 p-6">
                <div className="fm-label text-signal-600">{p.phase}</div>
                <h4 className="mt-3 text-sm font-bold text-ink-900">{p.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== WHY THE PHONE MATTERS ====================== */}
      <section className="border-b border-deck-300 bg-deck-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="h-3.5 w-[2px] bg-signal-500" aria-hidden="true" />
                <span className="fm-label">Why the phone</span>
              </div>
              <h2 className="fm-display mt-4 text-3xl leading-tight text-ink-900 sm:text-4xl">
                The only computer that comes up the ladder
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-500">
                <p>
                  Field technicians work on ladders, inside cramped boiler rooms and on sun-baked
                  rooftops. Nobody is opening three browser tabs on a laptop while holding a meter
                  lead.
                </p>
                <p>
                  So FieldMind is built for one hand and a gloved thumb: large touch targets,
                  high-contrast type that survives direct sunlight, tap-to-confirm checklists and the
                  camera as the primary input.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-panel border border-deck-300 bg-deck-100 p-4">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-ink-500" />
                    <span className="text-xs font-bold text-ink-900">Gloves-friendly controls</span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-ink-500">
                    Oversized targets and high-contrast states for rugged phones and field tablets.
                  </p>
                </div>
                <div className="rounded-panel border border-deck-300 bg-deck-100 p-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-verified-600" />
                    <span className="text-xs font-bold text-ink-900">Degrades safely</span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-ink-500">
                    When the signal drops, the built-in knowledge base still answers from cache.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-panel border border-deck-300 bg-deck-100 p-6 sm:p-7">
              <div className="flex items-center justify-between border-b border-deck-300 pb-4">
                <h3 className="text-sm font-bold text-ink-900">What FieldMind knows</h3>
                <Cpu className="h-4 w-4 text-ink-400" />
              </div>
              <div className="mt-4 space-y-3">
                {[
                  {
                    title: '5 commercial HVAC equipment types',
                    detail: 'RTU-10X, modular chillers, VRF heat pumps, AHUs and VAV boxes',
                    tag: 'Loaded',
                    tone: 'text-info-700 border-info-600/30 bg-info-100',
                  },
                  {
                    title: '10 fault codes with OEM references',
                    detail: 'E01 through E10, each with its troubleshooting tree',
                    tag: 'Indexed',
                    tone: 'text-signal-700 border-signal-600/30 bg-signal-100',
                  },
                  {
                    title: 'Lockout/tagout safety protocols',
                    detail: 'OSHA 1910.147 de-energization checkpoints per procedure',
                    tag: 'Enforced',
                    tone: 'text-verified-700 border-verified-600/30 bg-verified-100',
                  },
                ].map((row) => (
                  <div
                    key={row.title}
                    className="flex items-start justify-between gap-3 rounded-plate border border-deck-300 bg-deck-50 p-3.5"
                  >
                    <div>
                      <div className="text-xs font-bold text-ink-900">{row.title}</div>
                      <div className="mt-0.5 text-[11px] text-ink-500">{row.detail}</div>
                    </div>
                    <span
                      className={`shrink-0 rounded-plate border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${row.tone}`}
                    >
                      {row.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== ARCHITECTURE ========================== */}
      <section className="border-b border-deck-300 bg-deck-100 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="h-3.5 w-[2px] bg-signal-500" aria-hidden="true" />
              <span className="fm-label">Under the hood</span>
            </div>
            <h2 className="fm-display mt-4 text-3xl leading-tight text-ink-900 sm:text-4xl">
              How FieldMind is put together
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-500 sm:text-base">
              A full-stack TypeScript application: a React field client, an Express service layer,
              and all model reasoning executed on the server.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-panel border border-deck-300 bg-deck-50 p-6">
              <div className="fm-label text-signal-600">Reasoning layer</div>
              <h3 className="mt-3 text-sm font-bold text-ink-900">Structured diagnosis</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-500">
                Fault codes, equipment telemetry, technician observations and OEM manual extracts are
                reasoned over together, returning a typed result: cause, confidence, severity, safety
                constraints and ordered repair steps.
              </p>
            </div>

            <div className="rounded-panel border border-deck-300 bg-deck-50 p-6">
              <div className="fm-label text-signal-600">Service layer</div>
              <h3 className="mt-3 text-sm font-bold text-ink-900">Server-side execution</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-500">
                Every model call runs behind Express routes —{' '}
                <code className="rounded-[2px] bg-deck-200 px-1 font-mono text-[11px] text-ink-800">
                  /api/diagnose
                </code>
                ,{' '}
                <code className="rounded-[2px] bg-deck-200 px-1 font-mono text-[11px] text-ink-800">
                  /api/chat
                </code>{' '}
                and{' '}
                <code className="rounded-[2px] bg-deck-200 px-1 font-mono text-[11px] text-ink-800">
                  /api/generate-report
                </code>{' '}
                — so API credentials never reach the client bundle.
              </p>
            </div>

            <div className="rounded-panel border border-deck-300 bg-deck-50 p-6">
              <div className="fm-label text-signal-600">Data layer</div>
              <h3 className="mt-3 text-sm font-bold text-ink-900">Sample HVAC telemetry</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-500">
                Suction and discharge pressures, superheat and subcooling, amp draw and coil
                temperatures, plus a shared job and report store that keeps the technician and
                supervisor views in sync.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ CLOSING CTA ============================ */}
      <section className="bg-chassis-950 py-16 text-center lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 inline-flex items-center gap-2.5 rounded-plate border border-chassis-700 bg-chassis-900 px-3.5 py-2">
            <FieldMindMark size={15} className="text-deck-50" />
            <span className="fm-label text-deck-50/60">Built for the iQOO AI Hackathon</span>
          </div>

          <h2 className="fm-display text-3xl leading-tight text-deck-50 sm:text-5xl">
            Put an expert in the technician&rsquo;s pocket
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-deck-50/60 sm:text-base">
            Walk the whole loop yourself — capture a fault, read the diagnosis, work the guided
            steps, and file the service report.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              id="cta-start-demo-btn"
              onClick={handleStart}
              className="flex cursor-pointer items-center gap-2 rounded-plate bg-signal-500 px-7 py-4 text-sm font-bold tracking-wide text-chassis-950 transition hover:bg-signal-400 active:translate-y-px"
            >
              <ScanLine className="h-4 w-4" />
              <span>Start Diagnosis</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>

            <button
              onClick={() => handleNav('technician')}
              className="cursor-pointer rounded-plate border border-chassis-600 bg-chassis-800 px-6 py-4 text-sm font-semibold text-deck-50 transition hover:border-chassis-500 hover:bg-chassis-700"
            >
              Explore FieldMind
            </button>
          </div>
        </div>
      </section>

      {/* ========================== SAFETY NOTICE ========================== */}
      <section className="bg-deck-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-panel border border-signal-600/25 bg-signal-100/60 p-4">
            <ClipboardCheck className="mt-px h-4 w-4 shrink-0 text-signal-700" />
            <p className="text-[11px] leading-relaxed text-ink-700">
              <span className="font-bold text-ink-900">Field safety notice.</span> FieldMind AI runs
              against a sample commercial HVAC knowledge base and is intended to assist a qualified
              technician, not to replace one. Always follow your site&rsquo;s lockout/tagout
              procedure and OSHA 1910.147 before servicing energized equipment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
