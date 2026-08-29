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
    <div className="min-h-screen bg-deck-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Supervisor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-deck-300 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-[2px] bg-signal-500" aria-hidden="true" />
              <span className="fm-label">Supervisor Hub &middot; Campus Operations</span>
            </div>
            <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold text-ink-900">
              Operations &amp; Service Oversight
            </h1>
            <p className="text-xs sm:text-sm text-ink-500">
              Campus Central Mechanical Infrastructure • Live Field Operations Telemetry
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-panel border border-deck-300 bg-deck-50 px-4 py-2 text-right text-xs shadow-xs">
              <span className="text-ink-500">Chief Engineer: </span>
              <span className="font-bold text-ink-900">Sarah Jenkins, P.E.</span>
            </div>
          </div>
        </div>

        {/* 4 Operations KPI Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-panel border border-deck-300 bg-deck-50 p-4 shadow-xs">
            <div className="flex items-center justify-between text-ink-500 text-xs font-medium">
              <span>Mean Time to Resolution</span>
              <Clock className="h-4 w-4 text-signal-700" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-ink-900">41.5 min</div>
            <div className="mt-1 text-[11px] text-ink-500 font-medium">
              Across sample filed reports
            </div>
          </div>

          <div className="rounded-panel border border-deck-300 bg-deck-50 p-4 shadow-xs">
            <div className="flex items-center justify-between text-ink-500 text-xs font-medium">
              <span>First-Time Fix Rate</span>
              <CheckCircle2 className="h-4 w-4 text-verified-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-ink-900">93.2%</div>
            <div className="mt-1 text-[11px] text-verified-600 font-medium">Above target (90%)</div>
          </div>

          <div className="rounded-panel border border-deck-300 bg-deck-50 p-4 shadow-xs">
            <div className="flex items-center justify-between text-ink-500 text-xs font-medium">
              <span>Active Field Technicians</span>
              <Users className="h-4 w-4 text-signal-700" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-ink-900">4 / 4</div>
            <div className="mt-1 text-[11px] text-signal-700 font-medium">All shifts covered</div>
          </div>

          <div className="rounded-panel border border-deck-300 bg-deck-50 p-4 shadow-xs">
            <div className="flex items-center justify-between text-ink-500 text-xs font-medium">
              <span>FieldMind Reports</span>
              <FileText className="h-4 w-4 text-info-700" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-ink-900">{reports.length}</div>
            <div className="mt-1 text-[11px] text-info-700 font-medium">Structured and ready for sign-off</div>
          </div>
        </div>

        {/* Tab Controls & Search Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-deck-300 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('reports')}
              className={`rounded-plate px-3.5 py-2 text-xs font-semibold transition ${
                activeTab === 'reports'
                  ? 'bg-chassis-900 text-white shadow-xs'
                  : 'text-ink-500 hover:bg-deck-300/60 hover:text-ink-900'
              }`}
            >
              Service Reports ({reports.length})
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`rounded-plate px-3.5 py-2 text-xs font-semibold transition ${
                activeTab === 'jobs'
                  ? 'bg-chassis-900 text-white shadow-xs'
                  : 'text-ink-500 hover:bg-deck-300/60 hover:text-ink-900'
              }`}
            >
              Active Jobs Queue ({activeJobs.length})
            </button>

            <button
              onClick={() => setActiveTab('technicians')}
              className={`rounded-plate px-3.5 py-2 text-xs font-semibold transition ${
                activeTab === 'technicians'
                  ? 'bg-chassis-900 text-white shadow-xs'
                  : 'text-ink-500 hover:bg-deck-300/60 hover:text-ink-900'
              }`}
            >
              Technician Roster (4)
            </button>

            <button
              onClick={() => setActiveTab('equipment')}
              className={`rounded-plate px-3.5 py-2 text-xs font-semibold transition ${
                activeTab === 'equipment'
                  ? 'bg-chassis-900 text-white shadow-xs'
                  : 'text-ink-500 hover:bg-deck-300/60 hover:text-ink-900'
              }`}
            >
              Equipment Fleet ({equipmentList.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search reports, equipment, technicians..."
              className="w-full rounded-plate border border-deck-300 bg-deck-50 pl-8 pr-3 py-1.5 text-xs text-ink-900 placeholder-ink-400 focus:border-signal-500 focus:ring-1 focus:ring-signal-500 focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* TAB 1: SERVICE REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="rounded-panel border border-deck-300 bg-deck-50 shadow-xs overflow-hidden">
              {/* Horizontal scroll keeps the full record readable on phones and tablets */}
              <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-xs">
                <thead className="border-b border-deck-300 bg-deck-100 text-[11px] font-semibold text-ink-500">
                  <tr>
                    <th className="p-3.5">Report ID</th>
                    <th className="p-3.5">Equipment / Location</th>
                    <th className="p-3.5">Alarm / Issue</th>
                    <th className="p-3.5">Technician</th>
                    <th className="p-3.5">Confidence</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-deck-200">
                  {filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-deck-100 transition cursor-pointer"
                      onClick={() => onOpenReportModal(report)}
                    >
                      <td className="p-3.5 font-mono font-bold text-signal-700">{report.id}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-ink-900">{report.equipmentName}</div>
                        <div className="text-[11px] text-ink-500">{report.location}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-ink-800">{report.reportedIssue}</div>
                        <div className="text-[11px] text-ink-500 truncate max-w-xs">{report.rootCause}</div>
                      </td>
                      <td className="p-3.5 text-ink-700 font-medium">{report.technicianName}</td>
                      <td className="p-3.5">
                        <span className="rounded-plate bg-signal-100 border border-signal-600/30 px-2 py-0.5 text-[10px] font-mono font-bold text-signal-700">
                          {report.confidenceScore}%
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`rounded-plate px-2 py-0.5 text-[10px] font-bold uppercase ${
                            report.status === 'Supervisor Approved'
                              ? 'bg-verified-100 text-verified-700 border border-verified-600/30'
                              : 'bg-signal-100 text-signal-700 border border-signal-600/30'
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
                          className="rounded-plate border border-deck-300 bg-deck-50 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-deck-100 inline-flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="h-3.5 w-3.5 text-ink-500" />
                          <span>View Report</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
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
                  className="rounded-panel border border-deck-300 bg-deck-50 p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-plate px-2 py-0.5 text-[10px] font-bold uppercase ${
                        job.priority === 'urgent'
                          ? 'bg-alarm-100 text-alarm-700 border border-alarm-600/30'
                          : 'bg-signal-100 text-signal-700 border border-signal-600/30'
                      }`}
                    >
                      {job.priority} priority
                    </span>
                    <span className="font-mono text-xs text-ink-500">Assigned: {new Date(job.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-ink-900">{job.title}</h3>
                    <p className="text-xs text-ink-500 mt-0.5">{job.location} • Tech: {job.technicianName}</p>
                  </div>

                  {job.notes && (
                    <div className="rounded-plate bg-deck-100 border border-deck-200 p-2.5 text-xs text-ink-700">
                      {job.notes}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-deck-200 pt-3">
                    <span className="text-[11px] text-ink-500">Status: <span className="text-ink-900 font-semibold">{job.status}</span></span>
                    <button
                      onClick={() => onStartDiagnosisForJob(job.equipmentId, job.errorCode)}
                      className="rounded-plate bg-signal-100 border border-signal-600/30 px-3 py-1 text-xs font-semibold text-signal-700 hover:bg-signal-100"
                    >
                      Open in FieldMind →
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
                className="rounded-panel border border-deck-300 bg-deck-50 p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-signal-700 font-bold">{t.id}</span>
                  <span className="flex h-2 w-2 rounded-full bg-verified-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink-900">{t.name}</h4>
                  <p className="text-xs text-verified-700 font-semibold">{t.status}</p>
                </div>
                <div className="rounded-plate bg-deck-100 border border-deck-200 p-2.5 text-xs space-y-1">
                  <div className="text-ink-500 text-[11px]">Current Task:</div>
                  <div className="text-ink-800 font-medium truncate">{t.currentJob}</div>
                </div>
                <div className="flex items-center justify-between text-xs text-ink-500 border-t border-deck-200 pt-2">
                  <span>First-Fix: <span className="text-ink-900 font-bold">{t.firstTimeFixRate}</span></span>
                  <span>Today: <span className="text-ink-900 font-bold">{t.completedToday} jobs</span></span>
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
                className="rounded-panel border border-deck-300 bg-deck-50 p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={eq.imageUrl}
                    alt={eq.name}
                    className="h-16 w-16 rounded-panel object-cover border border-deck-300 shrink-0"
                  />
                  <div>
                    <span className="rounded-plate bg-signal-100 border border-signal-600/30 px-1.5 py-0.5 text-[10px] font-mono text-signal-700 font-bold">
                      {eq.healthScore}% Health
                    </span>
                    <h4 className="mt-1 text-xs font-bold text-ink-900">{eq.name}</h4>
                    <p className="text-[11px] text-ink-500">{eq.location}</p>
                  </div>
                </div>

                <div className="rounded-plate bg-deck-100 border border-deck-200 p-2.5 text-[11px] text-ink-500 space-y-1">
                  <div>Model: <span className="text-ink-800 font-mono font-medium">{eq.model}</span></div>
                  <div>Voltage: <span className="text-ink-800 font-medium">{eq.voltage}</span></div>
                  <div>Refrigerant: <span className="text-ink-800 font-medium">{eq.refrigerant}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

