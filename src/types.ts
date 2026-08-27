export type ViewMode = 'landing' | 'technician' | 'diagnosis' | 'supervisor' | 'knowledge_base';

export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  category: string;
  location: string;
  tonnage: string;
  refrigerant: string;
  voltage: string;
  installDate: string;
  lastServiced: string;
  healthScore: number; // 0 - 100
  imageUrl: string;
  manualTitle: string;
  oemReference: string;
  description: string;
}

export interface ErrorCodeInfo {
  code: string;
  title: string;
  equipmentId?: string; // or applicable to all
  severity: 'low' | 'medium' | 'high' | 'critical';
  likelyCause: string;
  typicalSymptom: string;
  safetyWarning: string;
  defaultSteps: string[];
  docReference: string;
}

export interface RepairStep {
  id: number;
  instruction: string;
  details: string;
  safetyCheck?: string;
  completed: boolean;
  notes?: string;
  photoRequired?: boolean;
}

export interface DocumentationReference {
  document: string;
  section?: string;
  reference?: string;
  citation: string;
  excerpt?: string;
}

export interface DiagnosticResult {
  // Required structured reasoning pipeline output fields
  equipment: string;
  issue: string;
  likelyCause: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  safetyWarning: string;
  steps: string[];
  documentation: DocumentationReference[];
  whenToEscalate: string;

  // Insufficient information handling
  isInsufficientInfo?: boolean;
  insufficientInfoNotice?: string;

  // Extended fields for UI and reporting compatibility
  equipmentId: string;
  equipmentName: string;
  modelNumber: string;
  errorCode: string;
  errorTitle: string;
  confidenceScore: number;
  rootCauseAnalysis: string;
  oemManualReference: string;
  manualExcerpt: string;
  recommendedSteps: RepairStep[];
  requiredTools: string[];
  estimatedTimeMinutes: number;
  partsLikelyNeeded: string[];
  telemetrySnapshot?: {
    dischargeTemp: string;
    suctionPressure: string;
    ambientTemp: string;
    subcooling: string;
    superheat: string;
  };
}

export interface ServiceReport {
  id: string;
  jobId: string;
  equipmentId: string;
  equipmentName: string;
  modelNumber: string;
  serialNumber: string;
  location: string;
  technicianName: string;
  technicianId: string;
  reportedIssue: string;
  errorCode: string;
  aiDiagnosisSummary: string;
  rootCause: string;
  confidenceScore: number;
  stepsCompleted: { stepNumber: number; description: string; notes?: string }[];
  resolutionSummary: string;
  partsReplaced: string[];
  safetyProtocolFollowed: boolean;
  safetyNotes: string;
  technicianNotes: string;
  timestamp: string;
  durationMinutes: number;
  status: 'Draft' | 'Submitted' | 'Supervisor Approved';
  supervisorReview?: {
    approvedBy: string;
    approvedAt: string;
    notes: string;
  };
}

export interface Job {
  id: string;
  title: string;
  equipmentId: string;
  equipmentName: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'Open' | 'In Progress' | 'Diagnosed' | 'Completed';
  errorCode?: string;
  technicianName: string;
  assignedAt: string;
  completedAt?: string;
  aiAssisted: boolean;
  diagnosticResult?: DiagnosticResult;
  serviceReportId?: string;
  serviceReport?: ServiceReport;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedActions?: string[];
}
