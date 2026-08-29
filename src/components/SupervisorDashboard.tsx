import React, { useState } from 'react';
import { Job, ServiceReport, Equipment } from '../types';
import {
  LayoutDashboard,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  Search,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building,
  Filter,
  Eye,
  Check,
} from 'lucide-react';

interface SupervisorDashboardProps {
  jobs: Job[];
  reports: ServiceReport[];
  equipmentList: Equipment[];
  onOpenReportModal: (report: ServiceReport) => void;
  onStartDiagnosisForJob: (equipmentId: string, errorCode?: string) => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  jobs,
  reports,
  equipmentList,
  onOpenReportModal,
  onStartDiagnosisForJob,
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'jobs' | 'technicians' | 'equipment'>('reports');
  const [searchFilter, setSearchFilter] = useState('');

  const activeJobs = jobs.filter((j) => j.status !== 'Completed');
  const resolvedReports = reports;

  const technicians = [
    {
      id: 'TECH-101',
      name: 'Alex Mercer (Lead Tech)',
      status: 'On Site (Bldg 4 Roof)',
      currentJob: 'HVAC Unit A - Code E04',
      completedToday: 2,
      firstTimeFixRate: '94%',
    },
    {
      id: 'TECH-312',
      name: 'Elena Rostova',
      status: 'En Route (Bldg 3)',
      currentJob: 'HVAC Unit C - AHU Inspection',
      completedToday: 3,
      firstTimeFixRate: '92%',
    },
    {
      id: 'TECH-409',
      name: 'Marcus Vance',
      status: 'Stationary (Central Plant)',
      currentJob: 'HVAC Unit B - Modular Chiller',
      completedToday: 1,
      firstTimeFixRate: '96%',
    },
    {
      id: 'TECH-205',
      name: 'David Kim',
      status: 'On Site (Bldg 2 Platform)',
      currentJob: 'HVAC Unit D - VRF DC Link',
      completedToday: 2,
      firstTimeFixRate: '89%',
    },
  ];

  const filteredReports = resolvedReports.filter(
    (r) =>
      r.equipmentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.reportedIssue.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.technicianName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.id.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Supervisor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              <span className="text-xs font-mono font-semibold text-blue-700 uppercase">FACILITIES SUPERVISOR COMMAND HUB</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Operations & Service Oversight
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Campus Central Mechanical Infrastructure • Live Field Operations Telemetry
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-right text-xs shadow-xs">
              <span className="text-slate-500">Chief Engineer: </span>
              <span className="font-bold text-slate-900">Sarah Jenkins, P.E.</span>
            </div>
          </div>
        </div>

        {/* 4 Operations KPI Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Mean Time to Resolution</span>
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">41.5 min</div>
            <div className="mt-1 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>28% faster with FieldMind AI</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>First-Time Fix Rate</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">93.2%</div>
            <div className="mt-1 text-[11px] text-emerald-600 font-medium">Above target (90%)</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Active Field Technicians</span>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">4 / 4</div>
            <div className="mt-1 text-[11px] text-blue-600 font-medium">All shifts covered</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>AI Service Reports</span>
              <FileText className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">{reports.length}</div>
            <div className="mt-1 text-[11px] text-indigo-600 font-medium">Auto-formatted & audited</div>
          </div>
        </div>

        {/* Tab Controls & Search Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('reports')}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                activeTab === 'reports'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              AI-Generated Reports ({reports.length})
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                activeTab === 'jobs'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              Active Jobs Queue ({activeJobs.length})
            </button>

            <button
              onClick={() => setActiveTab('technicians')}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                activeTab === 'technicians'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              Technician Roster (4)
            </button>

            <button
              onClick={() => setActiveTab('equipment')}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                activeTab === 'equipment'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              Equipment Fleet ({equipmentList.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search reports or equipment..."
              className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* TAB 1: AI GENERATED SERVICE REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
                  <tr>
                    <th className="p-3.5">Report ID</th>
                    <th className="p-3.5">Equipment / Location</th>
                    <th className="p-3.5">Alarm / Issue</th>
                    <th className="p-3.5">Technician</th>
                    <th className="p-3.5">AI Confidence</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-50 transition cursor-pointer"
                      onClick={() => onOpenReportModal(report)}
                    >
                      <td className="p-3.5 font-mono font-bold text-blue-700">{report.id}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{report.equipmentName}</div>
                        <div className="text-[11px] text-slate-500">{report.location}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{report.reportedIssue}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{report.rootCause}</div>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">{report.technicianName}</td>
                      <td className="p-3.5">
                        <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-700">
                          {report.confidenceScore}%
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                            report.status === 'Supervisor Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenReportModal(report);
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                          <span>View Report</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE JOBS QUEUE */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                        job.priority === 'urgent'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {job.priority} priority
                    </span>
                    <span className="font-mono text-xs text-slate-500">Assigned: {new Date(job.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{job.location} • Tech: {job.technicianName}</p>
                  </div>

                  {job.notes && (
                    <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-xs text-slate-700">
                      {job.notes}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-[11px] text-slate-500">Status: <span className="text-slate-900 font-semibold">{job.status}</span></span>
                    <button
                      onClick={() => onStartDiagnosisForJob(job.equipmentId, job.errorCode)}
                      className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Inspect in Copilot →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TECHNICIAN ROSTER */}
        {activeTab === 'technicians' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {technicians.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-700 font-bold">{t.id}</span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs text-emerald-700 font-semibold">{t.status}</p>
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-xs space-y-1">
                  <div className="text-slate-500 text-[11px]">Current Task:</div>
                  <div className="text-slate-800 font-medium truncate">{t.currentJob}</div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
                  <span>First-Fix: <span className="text-slate-900 font-bold">{t.firstTimeFixRate}</span></span>
                  <span>Today: <span className="text-slate-900 font-bold">{t.completedToday} jobs</span></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: EQUIPMENT FLEET */}
        {activeTab === 'equipment' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipmentList.map((eq) => (
              <div
                key={eq.id}
                className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={eq.imageUrl}
                    alt={eq.name}
                    className="h-16 w-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <span className="rounded-md bg-blue-50 border border-blue-200 px-1.5 py-0.5 text-[10px] font-mono text-blue-700 font-bold">
                      {eq.healthScore}% Health
                    </span>
                    <h4 className="mt-1 text-xs font-bold text-slate-900">{eq.name}</h4>
                    <p className="text-[11px] text-slate-500">{eq.location}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-[11px] text-slate-500 space-y-1">
                  <div>Model: <span className="text-slate-800 font-mono font-medium">{eq.model}</span></div>
                  <div>Voltage: <span className="text-slate-800 font-medium">{eq.voltage}</span></div>
                  <div>Refrigerant: <span className="text-slate-800 font-medium">{eq.refrigerant}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

