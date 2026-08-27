import React from 'react';
import { ViewMode } from '../types';
import {
  Wrench,
  Sparkles,
  ShieldCheck,
  BookOpen,
  LayoutDashboard,
  Zap,
  RotateCcw,
  Smartphone,
  CheckCircle2,
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            id="nav-logo-btn"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left transition hover:opacity-90 focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-600 shadow-sm shadow-blue-500/20 text-white">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                  Field<span className="text-blue-600">Mind</span> <span className="text-cyan-600">AI</span>
                </span>
                <span className="hidden rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200 sm:inline-block">
                  Field Copilot MVP
                </span>
              </div>
              <p className="hidden text-[11px] text-slate-500 font-medium sm:block">AI-Powered Field Technician Assistant</p>
            </div>
          </button>
        </div>

        {/* View Nav Links */}
        <nav className="hidden items-center gap-1.5 md:flex">
          <button
            id="nav-landing-btn"
            onClick={() => onNavigate('landing')}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              currentView === 'landing'
                ? 'bg-slate-100 text-blue-700 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            Product Overview
          </button>

          <button
            id="nav-tech-btn"
            onClick={() => onNavigate('technician')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              currentView === 'technician'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Smartphone className="h-4 w-4 text-slate-500" />
            Technician App
          </button>

          <button
            id="nav-diag-btn"
            onClick={() => onNavigate('diagnosis' as any)}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              currentView === 'diagnose' || (currentView as string) === 'diagnosis'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Sparkles className={`h-4 w-4 ${currentView === 'diagnose' || (currentView as string) === 'diagnosis' ? 'text-white' : 'text-blue-600'}`} />
            AI Diagnosis Flow
          </button>

          <button
            id="nav-supervisor-btn"
            onClick={() => onNavigate('supervisor')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              currentView === 'supervisor'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 text-slate-500" />
            Supervisor Hub
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* AI Status Badge */}
          <div
            className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-700 lg:flex"
            title="Gemini AI Server-Side Engine Status"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isAiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-600'
              }`}
            />
            <span className="font-mono text-[11px] font-semibold text-slate-600">Gemini 3.7 Engine</span>
          </div>

          {/* Reset Demo Data if handler given */}
          {onResetDemo && (
            <button
              id="nav-reset-demo-btn"
              onClick={onResetDemo}
              title="Reset test jobs & reports to default state"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-xs transition hover:bg-slate-50 hover:text-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          {/* 1-Click Judge Demo CTA */}
          {triggerDemo && (
            <button
              id="nav-start-demo-btn"
              onClick={triggerDemo}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/30 transition hover:bg-blue-700 active:scale-95"
            >
              <Zap className="h-3.5 w-3.5 fill-white text-white" />
              <span>Launch Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile view bar */}
      <div className="flex items-center justify-around border-t border-slate-200 bg-white px-2 py-2 md:hidden">
        <button
          onClick={() => onNavigate('landing')}
          className={`flex flex-col items-center text-[10px] font-semibold ${
            currentView === 'landing' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <span>Overview</span>
        </button>
        <button
          onClick={() => onNavigate('technician')}
          className={`flex flex-col items-center text-[10px] font-semibold ${
            currentView === 'technician' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Smartphone className="h-4 w-4 mb-0.5" />
          <span>Tech App</span>
        </button>
        <button
          onClick={() => onNavigate('diagnose' as any)}
          className={`flex flex-col items-center text-[10px] font-semibold ${
            currentView === 'diagnose' || (currentView as string) === 'diagnosis' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Sparkles className="h-4 w-4 mb-0.5 text-blue-600" />
          <span>AI Diagnose</span>
        </button>
        <button
          onClick={() => onNavigate('supervisor')}
          className={`flex flex-col items-center text-[10px] font-semibold ${
            currentView === 'supervisor' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="h-4 w-4 mb-0.5" />
          <span>Supervisor</span>
        </button>
      </div>
    </header>
  );
};

