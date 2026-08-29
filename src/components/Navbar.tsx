import React from 'react';
import { ViewMode } from '../types';
import { FieldMindMark, FieldMindWordmark } from './BrandMark';
import {
  Stethoscope,
  LayoutDashboard,
  ScanLine,
  RotateCcw,
  Smartphone,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onStartDiagnosis?: () => void;
  onStartDemo?: () => void;
  onResetDemo?: () => void;
  isAiConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onStartDiagnosis,
  onStartDemo,
  onResetDemo,
  isAiConnected = true,
}) => {
  const triggerDemo = onStartDiagnosis || onStartDemo;
  const isDiagnosis = currentView === 'diagnose' || (currentView as string) === 'diagnosis';

  const linkClass = (active: boolean) =>
    [
      'flex items-center gap-1.5 rounded-plate px-3 py-2 text-xs font-semibold tracking-wide transition',
      active
        ? 'bg-chassis-700 text-deck-50 ring-1 ring-chassis-500/70'
        : 'text-deck-50/60 hover:bg-chassis-800 hover:text-deck-50',
    ].join(' ');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-chassis-700 bg-chassis-900 no-print">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          id="nav-logo-btn"
          onClick={() => onNavigate('landing')}
          className="flex shrink-0 items-center gap-2.5 text-left transition hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-plate bg-chassis-800 text-deck-50 ring-1 ring-chassis-600">
            <FieldMindMark size={21} />
          </span>
          <span className="hidden sm:block">
            <FieldMindWordmark tone="onDark" className="text-lg" />
            <span className="mt-0.5 block text-[11px] font-medium text-deck-50/45">
              An AI expert in every field worker&rsquo;s pocket
            </span>
          </span>
          <span className="sm:hidden">
            <FieldMindWordmark tone="onDark" className="text-base" />
          </span>
        </button>

        {/* View Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <button
            id="nav-landing-btn"
            onClick={() => onNavigate('landing')}
            className={linkClass(currentView === 'landing')}
          >
            Overview
          </button>

          <button
            id="nav-tech-btn"
            onClick={() => onNavigate('technician')}
            className={linkClass(currentView === 'technician')}
          >
            <Smartphone className="h-4 w-4 opacity-70" />
            Technician App
          </button>

          <button
            id="nav-diag-btn"
            onClick={() => onNavigate('diagnosis' as any)}
            className={linkClass(isDiagnosis)}
          >
            <Stethoscope className={`h-4 w-4 ${isDiagnosis ? 'text-signal-500' : 'opacity-70'}`} />
            Diagnosis
          </button>

          <button
            id="nav-supervisor-btn"
            onClick={() => onNavigate('supervisor')}
            className={linkClass(currentView === 'supervisor')}
          >
            <LayoutDashboard className="h-4 w-4 opacity-70" />
            Supervisor Hub
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Diagnostic engine status */}
          <div
            className="hidden items-center gap-2 rounded-plate border border-chassis-600 bg-chassis-800 px-2.5 py-1.5 lg:flex"
            title="FieldMind diagnostic engine status"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isAiConnected ? 'bg-verified-500' : 'bg-signal-500'
              }`}
            />
            <span className="fm-label text-deck-50/60">
              {isAiConnected ? 'Engine online' : 'Engine offline'}
            </span>
          </div>

          {/* Restore sample data if handler given */}
          {onResetDemo && (
            <button
              id="nav-reset-demo-btn"
              onClick={onResetDemo}
              title="Restore sample jobs and reports to their initial state"
              aria-label="Restore sample data"
              className="flex h-9 w-9 items-center justify-center rounded-plate border border-chassis-600 bg-chassis-800 text-deck-50/60 transition hover:border-chassis-500 hover:text-deck-50"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          {/* Primary CTA */}
          {triggerDemo && (
            <button
              id="nav-start-demo-btn"
              onClick={triggerDemo}
              className="flex items-center gap-1.5 rounded-plate bg-signal-500 px-3.5 py-2.5 text-xs font-bold tracking-wide text-chassis-950 transition hover:bg-signal-400 active:translate-y-px"
            >
              <ScanLine className="h-4 w-4" />
              <span>Start Diagnosis</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile view bar */}
      <div className="flex items-stretch justify-around border-t border-chassis-700 bg-chassis-950 px-2 py-1.5 md:hidden">
        <button
          onClick={() => onNavigate('landing')}
          className={`flex flex-1 flex-col items-center gap-0.5 rounded-plate py-1.5 text-[10px] font-semibold tracking-wide ${
            currentView === 'landing' ? 'bg-chassis-800 text-signal-500' : 'text-deck-50/55'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => onNavigate('technician')}
          className={`flex flex-1 flex-col items-center gap-0.5 rounded-plate py-1.5 text-[10px] font-semibold tracking-wide ${
            currentView === 'technician' ? 'bg-chassis-800 text-signal-500' : 'text-deck-50/55'
          }`}
        >
          <Smartphone className="h-4 w-4" />
          <span>Jobs</span>
        </button>
        <button
          onClick={() => onNavigate('diagnose' as any)}
          className={`flex flex-1 flex-col items-center gap-0.5 rounded-plate py-1.5 text-[10px] font-semibold tracking-wide ${
            isDiagnosis ? 'bg-chassis-800 text-signal-500' : 'text-deck-50/55'
          }`}
        >
          <Stethoscope className="h-4 w-4" />
          <span>Diagnose</span>
        </button>
        <button
          onClick={() => onNavigate('supervisor')}
          className={`flex flex-1 flex-col items-center gap-0.5 rounded-plate py-1.5 text-[10px] font-semibold tracking-wide ${
            currentView === 'supervisor' ? 'bg-chassis-800 text-signal-500' : 'text-deck-50/55'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Supervisor</span>
        </button>
      </div>
    </header>
  );
};
