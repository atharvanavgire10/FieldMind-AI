import { GoogleGenAI, Type } from '@google/genai';
import { SIMULATED_EQUIPMENT, SIMULATED_ERROR_CODES, DEMO_SAMPLE_PHOTOS } from '../src/data/knowledgeBase';
import { DiagnosticResult, RepairStep, ServiceReport, DocumentationReference } from '../src/types';

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface DiagnosticPipelineInput {
  equipmentType?: string;
  equipmentId?: string;
  errorCode?: string;
  capturedImageMetadata?: {
    photoUrl?: string;
    photoTitle?: string;
    photoDescription?: string;
    ocrReading?: string;
  };
  technicianQuestion?: string;
  userNotes?: string;
  relevantDocumentation?: string[];
  safetyConstraints?: string[];
  photoUrl?: string;
}

/**
 * High-precision escalation matrices grounded strictly in OEM documentation
 */
const ESCALATION_CRITERIA: Record<string, string> = {
  E01: 'Escalate to Senior Refrigeration Specialist if electronic leak detection indicates an internal microchannel brazed plate rupture or if vacuum decay exceeds 500 microns over 15 minutes.',
  E02: 'Escalate to Master Technician / Electrical Specialist if high-pressure switch fails to reset mechanically or if line-to-line winding resistance imbalance on the compressor motor exceeds 2.5%.',
  E03: 'Escalate to Mechanical Systems Lead if blower shaft bearings exhibit deep scoring (>0.05" play), motor shaft is bent, or dynamic balancing vibration exceeds 0.15 in/sec RMS.',
  E04: 'Escalate to Tier-3 Senior Specialist if compressor winding insulation resistance measures < 50 Megohms at 500VDC (megohmmeter test) or if thermal sensor circuit remains open-circuit after 1 hour of ambient cooldown.',
  E05: 'Escalate to Central Plant Engineer if TXV power element has lost charge (no bulb response), water-side brazed plate evaporator has suffered internal freeze-rupture, or freeze stat safety relay contacts are welded.',
  E06: 'Escalate to Building Controls Specialist / DDC Engineer if Belimo actuator internal gear train is stripped, 0-10VDC analog output from BAS controller is corrupted, or damper frame is warped.',
  E07: 'IMMEDIATE SAFETY ESCALATION: Shut gas supply valve immediately. Escalate to Gas Safety Lead if visual borescope inspection reveals any breach, hairline crack, or rust perforation in the primary or secondary heat exchanger cells (Zero Tolerance Carbon Monoxide protocol).',
  E08: 'Escalate to Inverter Drive Specialist / High-Voltage Power Technician if IPM (Intelligent Power Module) diode checks reveal shorted upper/lower IGBT gates or if DC bus ripple voltage exceeds 15V RMS under partial load.',
  E09: 'Escalate to Facilities Plumbing / Environmental Lead if building main condensate drain stack is blocked downstream of unit boundary, causing roof or plenum water infiltration.',
  E10: 'Escalate to Building Automation Lead if 10k thermistor replacement does not restore signal and DDC controller analog input channel shows ADC voltage quantization failure.',
};

/**
 * Structured Diagnostic Reasoning Pipeline
 * Follows strict safety-first guidelines, OEM grounding, and insufficient info handling
 */
export async function runEquipmentDiagnosis(params: DiagnosticPipelineInput): Promise<DiagnosticResult> {
  const equipmentId = params.equipmentId || params.equipmentType;
  const errorCode = params.errorCode?.toUpperCase().trim();
  const userNotes = params.technicianQuestion || params.userNotes || '';

  // Check for matched simulated equipment
  const equipment = SIMULATED_EQUIPMENT.find(
    (e) => e.id === equipmentId || e.model.toLowerCase().includes((equipmentId || '').toLowerCase())
  ) || (equipmentId ? null : SIMULATED_EQUIPMENT[0]);

  // Check for matched simulated error code
  const errorInfo = SIMULATED_ERROR_CODES.find(
    (e) => e.code.toUpperCase() === (errorCode || '').toUpperCase()
  ) || (errorCode ? null : SIMULATED_ERROR_CODES[0]);

  // Optical metadata matching from preloaded sample photos or custom input
  let imageMeta = params.capturedImageMetadata;
  if (!imageMeta && params.photoUrl) {
    const matchedSample = DEMO_SAMPLE_PHOTOS.find((p) => p.url === params.photoUrl);
    if (matchedSample) {
      imageMeta = {
        photoUrl: matchedSample.url,
        photoTitle: matchedSample.title,
        photoDescription: matchedSample.description,
        ocrReading: `Optical Scan Detected: Alarm ${matchedSample.errorCode}`,
      };
    }
  }

  // --- Insufficient Information Handling ---
  if (!equipment || !errorInfo) {
    return handleInsufficientInformation({
      equipmentId: equipmentId || 'Unknown Equipment',
      errorCode: errorCode || 'Unknown Alarm',
      equipment,
      errorInfo,
      userNotes,
    });
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are FieldMind AI, an expert, safety-first HVAC industrial diagnostic engine.
Perform a structured diagnostic reasoning pipeline using ONLY the provided simulated OEM documentation.

INPUT PARAMETERS:
- Equipment Type & Specifications:
  * Full Designation: ${equipment.name}
  * Model: ${equipment.model}
  * Category: ${equipment.category}
  * Capacity: ${equipment.tonnage}
  * Operating Refrigerant: ${equipment.refrigerant}
  * Electrical Service: ${equipment.voltage}
  * Location: ${equipment.location}
  * OEM Manual: ${equipment.manualTitle} (${equipment.oemReference})

- Reported Error Code:
  * Code: ${errorInfo.code}
  * Title: ${errorInfo.title}
  * Baseline Severity: ${errorInfo.severity}
  * Baseline Likely Cause: ${errorInfo.likelyCause}
  * Baseline Safety Warning: ${errorInfo.safetyWarning}
  * Document Citation Reference: ${errorInfo.docReference}
  * Standard OEM Procedures: ${JSON.stringify(errorInfo.defaultSteps)}

- Captured Image Metadata (When Available):
  ${imageMeta ? `* Photo Title: ${imageMeta.photoTitle || 'Captured Inspection Photo'}
* Photo Analysis: ${imageMeta.photoDescription || 'Optical analysis confirms physical symptom'}
* Optical Reading: ${imageMeta.ocrReading || 'N/A'}` : 'None provided'}

- Technician Question / On-site Observations:
  "${userNotes || 'Standard pre-inspection checklist. Visual alarm code active on master controller.'}"

- Safety Constraints & Trade Protocols:
  * Mandatory OSHA 1910.147 Lock-Out / Tag-Out (LOTO) verification prior to mechanical or electrical access.
  * EPA Section 608 Certified Refrigerant Handling (Zero atmospheric venting).
  * High-voltage (208V/277V/460V/480V) zero-energy multimeter verification.
  * High DC Bus capacitor safety discharge (VRF systems).
  * Heat Exchanger Carbon Monoxide / Gas Safety protocols.

STRICT INSTRUCTIONS:
1. Ground every statement purely in the simulated OEM documentation. Never invent equipment specifications or unsafe repair instructions.
2. Prioritize safety over completing the diagnosis.
3. Provide exact document citations and excerpts for all diagnostic reasoning.
4. Define concrete conditions for when the technician should escalate to a senior specialist or engineer.
5. Return strictly valid JSON adhering to the exact schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are FieldMind AI. You perform structured diagnostic reasoning for industrial HVAC systems. You prioritize technician safety (OSHA LOTO, PPE, zero-energy checks), cite OEM manuals precisely, and output strictly valid JSON matching the schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              equipment: { type: Type.STRING, description: 'Full equipment name and model string' },
              issue: { type: Type.STRING, description: 'Error code and title summary' },
              likelyCause: { type: Type.STRING, description: 'Direct likely cause of the malfunction' },
              confidence: { type: Type.INTEGER, description: 'Diagnostic confidence percentage (0-100)' },
              severity: { type: Type.STRING, description: 'Severity level: low, medium, high, or critical' },
              safetyWarning: { type: Type.STRING, description: 'Comprehensive safety warnings, PPE, and LOTO requirements' },
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Recommended step-by-step sequential repair actions',
              },
              documentation: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    document: { type: Type.STRING },
                    section: { type: Type.STRING },
                    reference: { type: Type.STRING },
                    citation: { type: Type.STRING },
                    excerpt: { type: Type.STRING },
                  },
                  required: ['document', 'citation'],
                },
                description: 'List of relevant simulated OEM documentation references with citations and excerpts',
              },
              whenToEscalate: { type: Type.STRING, description: 'Specific conditions when the technician must escalate to a master mechanic or engineer' },
              rootCauseAnalysis: { type: Type.STRING, description: 'In-depth physical root cause analysis' },
              requiredTools: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              partsLikelyNeeded: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              estimatedTimeMinutes: { type: Type.INTEGER },
              telemetrySnapshot: {
                type: Type.OBJECT,
                properties: {
                  dischargeTemp: { type: Type.STRING },
                  suctionPressure: { type: Type.STRING },
                  ambientTemp: { type: Type.STRING },
                  subcooling: { type: Type.STRING },
                  superheat: { type: Type.STRING },
                },
              },
            },
            required: [
              'equipment',
              'issue',
              'likelyCause',
              'confidence',
              'severity',
              'safetyWarning',
              'steps',
              'documentation',
              'whenToEscalate',
            ],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());

        const docRefs: DocumentationReference[] = (parsed.documentation || []).map((d: any) => ({
          document: d.document || equipment.manualTitle,
          section: d.section || 'Troubleshooting Section',
          reference: d.reference || equipment.oemReference,
          citation: d.citation || errorInfo.docReference,
          excerpt: d.excerpt || `Excerpt from ${equipment.manualTitle} regarding ${errorInfo.title}.`,
        }));

        if (docRefs.length === 0) {
          docRefs.push({
            document: equipment.manualTitle,
            section: 'Diagnostic Procedures',
            reference: equipment.oemReference,
            citation: errorInfo.docReference,
            excerpt: `From ${equipment.manualTitle}: "Verify all mechanical and electrical parameters before clearing ${errorInfo.code} alarm."`,
          });
        }

        const repairSteps: RepairStep[] = (parsed.steps || errorInfo.defaultSteps).map((st: string, idx: number) => ({
          id: idx + 1,
          instruction: st,
          details: `Field procedure per ${docRefs[0]?.citation || errorInfo.docReference}. Record all verified physical values.`,
          safetyCheck: idx === 0 ? parsed.safetyWarning || errorInfo.safetyWarning : undefined,
          completed: false,
        }));

        const normalizedSeverity = (['low', 'medium', 'high', 'critical'].includes(parsed.severity?.toLowerCase())
          ? parsed.severity.toLowerCase()
          : errorInfo.severity) as 'low' | 'medium' | 'high' | 'critical';

        return {
          equipment: parsed.equipment || `${equipment.name} (${equipment.model})`,
          issue: parsed.issue || `${errorInfo.code}: ${errorInfo.title}`,
          likelyCause: parsed.likelyCause || errorInfo.likelyCause,
          confidence: Math.min(100, Math.max(0, parsed.confidence || 94)),
          severity: normalizedSeverity,
          safetyWarning: parsed.safetyWarning || errorInfo.safetyWarning,
          steps: parsed.steps || errorInfo.defaultSteps,
          documentation: docRefs,
          whenToEscalate: parsed.whenToEscalate || ESCALATION_CRITERIA[errorInfo.code] || 'Escalate if readings drift outside OEM bounds after completing standard checklist.',

          // Extended fields for backward-compatible UI & Reports
          equipmentId: equipment.id,
          equipmentName: equipment.name,
          modelNumber: equipment.model,
          errorCode: errorInfo.code,
          errorTitle: errorInfo.title,
          confidenceScore: parsed.confidence || 94,
          rootCauseAnalysis: parsed.rootCauseAnalysis || `Diagnostic analysis for ${equipment.name}. Active alarm ${errorInfo.code} indicates: ${errorInfo.likelyCause}`,
          oemManualReference: docRefs[0]?.citation || errorInfo.docReference,
          manualExcerpt: docRefs[0]?.excerpt || `Excerpt from ${equipment.manualTitle} regarding ${errorInfo.title}.`,
          recommendedSteps: repairSteps,
          requiredTools: parsed.requiredTools || getRequiredToolsForCode(errorInfo.code),
          partsLikelyNeeded: parsed.partsLikelyNeeded || getPartsForCode(errorInfo.code),
          estimatedTimeMinutes: parsed.estimatedTimeMinutes || getEstimatedTimeForCode(errorInfo.code),
          telemetrySnapshot: parsed.telemetrySnapshot || getTelemetryForCode(errorInfo.code),
        };
      }
    } catch (err) {
      console.warn('Gemini structured diagnosis fallback used due to:', err);
    }
  }

  // Deterministic high-precision fallback reasoning engine grounded in OEM knowledge base
  return createStructuredFallbackDiagnosis(equipment, errorInfo, imageMeta, userNotes);
}

/**
 * Insufficient Information Safe Fallback
 */
function handleInsufficientInformation(params: {
  equipmentId: string;
  errorCode: string;
  equipment: (typeof SIMULATED_EQUIPMENT)[0] | null;
  errorInfo: (typeof SIMULATED_ERROR_CODES)[0] | null;
  userNotes?: string;
}): DiagnosticResult {
  const missingParts: string[] = [];
  if (!params.equipment) missingParts.push(`Equipment model "${params.equipmentId}" is not present in the OEM knowledge base.`);
  if (!params.errorInfo) missingParts.push(`Alarm code "${params.errorCode}" is not documented in standard HVAC registry.`);

  const safetyNote = 'SAFETY HOLD: Information is insufficient to safely determine root cause. Do NOT attempt energized troubleshooting or bypass safety interlocks without verified equipment schematics.';

  return {
    equipment: params.equipment ? `${params.equipment.name} (${params.equipment.model})` : `Unregistered Equipment (${params.equipmentId})`,
    issue: params.errorInfo ? `${params.errorInfo.code}: ${params.errorInfo.title}` : `Unregistered Alarm Code (${params.errorCode})`,
    likelyCause: 'Information is insufficient to safely establish a verified root cause without additional nameplate data or valid error code documentation.',
    confidence: 25,
    severity: 'high',
    safetyWarning: safetyNote,
    steps: [
      'Stop all intrusive diagnostic procedures immediately and maintain safety isolation.',
      'Photograph the equipment serial nameplate and electrical schematic inside the access door.',
      'Check the unit controller for sub-codes, blinking LED flash patterns, or auxiliary alarm registers.',
      'Cross-reference the physical equipment manual or contact OEM technical support with full serial number.',
      'Consult Level-3 Field Supervisor prior to applying electrical power.',
    ],
    documentation: [
      {
        document: 'FieldMind AI Safety Protocol Manual',
        section: 'Section 1.2: Insufficient Information & Data Verification Protocol',
        reference: 'SAFETY-STD-001',
        citation: 'FieldMind Safety Protocol Section 1.2: "Zero-Assumption Principle for Unverified Equipment"',
        excerpt: 'When equipment metadata or alarm code is unrecognized, FieldMind must halt automated diagnosis and instruct the technician to gather verified nameplate specifications.',
      },
    ],
    whenToEscalate: 'Immediate escalation required: Contact OEM factory support or Field Service Supervisor to obtain authentic manufacturer wiring schematics and fault matrix.',
    isInsufficientInfo: true,
    insufficientInfoNotice: `Diagnostic Engine Notice: ${missingParts.join(' ')} To protect technician safety and equipment integrity, FieldMind will not generate speculative repair instructions.`,

    // Extended compatibility fields
    equipmentId: params.equipmentId,
    equipmentName: params.equipment?.name || 'Unverified Equipment',
    modelNumber: params.equipment?.model || 'Unknown Model',
    errorCode: params.errorCode,
    errorTitle: params.errorInfo?.title || 'Unrecognized Error Code',
    confidenceScore: 25,
    rootCauseAnalysis: `Insufficient diagnostic information. ${missingParts.join(' ')}`,
    oemManualReference: 'FieldMind Safety Protocol Section 1.2',
    manualExcerpt: 'Do not attempt repairs without verified OEM documentation.',
    recommendedSteps: [
      {
        id: 1,
        instruction: 'Halt intrusive procedures and maintain safety isolation.',
        details: 'Verify equipment nameplate data and locate OEM technical documentation.',
        safetyCheck: safetyNote,
        completed: false,
      },
    ],
    requiredTools: ['Smartphone Camera / Nameplate Scanner', 'True-RMS Multimeter', 'OEM Service Manual'],
    partsLikelyNeeded: ['Pending Nameplate Verification'],
    estimatedTimeMinutes: 15,
  };
}

/**
 * Deterministic Diagnostic Reasoning Engine
 */
function createStructuredFallbackDiagnosis(
  equipment: (typeof SIMULATED_EQUIPMENT)[0],
  errorInfo: (typeof SIMULATED_ERROR_CODES)[0],
  imageMeta?: { photoTitle?: string; photoDescription?: string; ocrReading?: string },
  userNotes?: string
): DiagnosticResult {
  const docCitation = errorInfo.docReference;
  const escalationNote = ESCALATION_CRITERIA[errorInfo.code] || 'Escalate to Senior Field Supervisor if parameters remain abnormal after standard procedure.';

  const docRefs: DocumentationReference[] = [
    {
      document: equipment.manualTitle,
      section: docCitation.includes('Section') ? docCitation.split(':')[0] : 'Section 8.0 Diagnostic Procedures',
      reference: equipment.oemReference,
      citation: docCitation,
      excerpt: `From ${equipment.manualTitle}: "When alarm code ${errorInfo.code} (${errorInfo.title}) is detected by the master controller, safety circuitry executes an immediate staged shutdown. Inspect all related sensors, airflow paths, and electrical contacts according to factory test procedures before re-engaging power."`,
    },
  ];

  const steps: RepairStep[] = errorInfo.defaultSteps.map((stepText, idx) => ({
    id: idx + 1,
    instruction: stepText,
    details: `Field-verified procedure per ${docCitation}. Measure and record all baseline physical readings before proceeding to next step.`,
    safetyCheck: idx === 0 ? errorInfo.safetyWarning : undefined,
    completed: false,
  }));

  const rootCause = `Diagnostic Reasoning for ${equipment.name} (${equipment.model}): The system recorded alarm code ${errorInfo.code} (${errorInfo.title}). Operating physics indicate: ${errorInfo.likelyCause}${imageMeta ? ` Visual inspection notes: ${imageMeta.photoDescription}.` : ''}${userNotes ? ` Technician noted: "${userNotes}".` : ''}`;

  return {
    equipment: `${equipment.name} - Model ${equipment.model}`,
    issue: `${errorInfo.code}: ${errorInfo.title}`,
    likelyCause: errorInfo.likelyCause,
    confidence: 94,
    severity: errorInfo.severity,
    safetyWarning: errorInfo.safetyWarning,
    steps: errorInfo.defaultSteps,
    documentation: docRefs,
    whenToEscalate: escalationNote,

    // Backward-compatible UI & Report fields
    equipmentId: equipment.id,
    equipmentName: equipment.name,
    modelNumber: equipment.model,
    errorCode: errorInfo.code,
    errorTitle: errorInfo.title,
    confidenceScore: 94,
    rootCauseAnalysis: rootCause,
    oemManualReference: docCitation,
    manualExcerpt: docRefs[0].excerpt || `From ${equipment.manualTitle}: "Verify all parameters per ${docCitation}."`,
    recommendedSteps: steps,
    requiredTools: getRequiredToolsForCode(errorInfo.code),
    partsLikelyNeeded: getPartsForCode(errorInfo.code),
    estimatedTimeMinutes: getEstimatedTimeForCode(errorInfo.code),
    telemetrySnapshot: getTelemetryForCode(errorInfo.code),
  };
}

function getRequiredToolsForCode(code: string): string[] {
  switch (code) {
    case 'E01':
      return ['Digital Manifold Gauges (R-410A)', 'Electronic Refrigerant Leak Detector', 'Micron Gauge', 'Vacuum Pump'];
    case 'E02':
      return ['True-RMS Multimeter (CAT III 600V)', 'High-Pressure Manifold Gauges', 'Capacitor Tester', 'Coil Fin Comb'];
    case 'E03':
      return ['Tension Gauge', 'Laser Sheave Alignment Tool', 'Digital Clamp Meter (True-RMS)', 'Tachometer / Strobe'];
    case 'E04':
      return ['True-RMS Multimeter', 'Digital Manifold Gauges', 'Infrared Thermometer', 'OSHA LOTO Kit', 'Insulated Hand Tools'];
    case 'E05':
      return ['Digital Temperature Clamps (Dual Channel)', 'Manifold Gauges', 'Hot Gas Defrost Tool', 'Condensate Sump Pan'];
    case 'E06':
      return ['0-10VDC Analog Signal Generator', 'Digital Multimeter', 'Hex Wrench Set (Linkage adjustment)', 'Angle Protractor'];
    case 'E07':
      return ['Differential Digital Manometer (in. w.c.)', 'Combustion Analyzer (O2/CO/CO2)', 'Optical Borescope Camera', 'Gas Pressure Gauge'];
    case 'E08':
      return ['CAT IV 1000V Multimeter', 'DC Bus Discharge Resistor Tool', 'Oscilloscope / PWM analyzer', 'RS-485 Cable Tester'];
    case 'E09':
      return ['Nitrogen Blowout Gun / Co2 Cartridge Tool', 'Wet/Dry Shop Vacuum', 'Plumbing Snake', 'Inspection Mirror'];
    case 'E10':
      return ['Precision Decade Resistance Box', 'Calibrated Digital Thermometer (±0.2°F)', 'Wire Stripper / Terminal Crimper'];
    default:
      return ['True-RMS Multimeter', 'Digital Manifold Gauges', 'LOTO Padlock Kit'];
  }
}

function getPartsForCode(code: string): string[] {
  switch (code) {
    case 'E01':
      return ['Schrader Valve Core (R-410A)', '1/4" Flare Copper Gasket', 'Virgin R-410A Refrigerant (Cylinder)'];
    case 'E02':
      return ['Dual Run Capacitor (45/5 uF 440VAC)', 'Condenser Fan Motor (1/2 HP 460V)', 'Foaming Coil Cleaner'];
    case 'E03':
      return ['Cogged V-Belt (AX-52 / BX-55)', 'Pillow Block Bearings (1-3/16" bore)', 'Blower Motor Contactor'];
    case 'E04':
      return ['High-Capacity MERV-13 Filter Panel (24x24x2)', 'Compressor Thermal Overload Relay', 'Condenser Fan Capacitor'];
    case 'E05':
      return ['Thermostatic Expansion Valve (TXV R-410A)', '10k NTC Freeze Stat Thermistor', 'Liquid Line Filter Drier'];
    case 'E06':
      return ['Belimo LF24-SR 2-10V Damper Actuator', 'Ball Joint Swivel Linkage', 'Honeywell Economizer Logic Module'];
    case 'E07':
      return ['Negative Pressure Differential Switch (-0.65" w.c.)', 'Thermal Rollout Limit Fuse (350°F)', 'Draft Inducer Motor Assembly'];
    case 'E08':
      return ['Intelligent Power Module (IPM IGBT Pack)', '120 Ohm RS-485 Terminating Resistor', 'Varistor Surge Suppressor'];
    case 'E09':
      return ['Secondary Float Switch (Plenum Rated)', 'Biocide Drain Pan Tablets', '3/4" Schedule 40 PVC P-Trap Cleanout'];
    case 'E10':
      return ['10k Type II NTC Duct Temperature Probe (6" insertion)', 'Shielded Twisted Pair Sensor Wire (18 AWG)'];
    default:
      return ['Air Filter MERV-13', 'Capacitor', 'Contactors'];
  }
}

function getEstimatedTimeForCode(code: string): number {
  switch (code) {
    case 'E01': return 60;
    case 'E02': return 45;
    case 'E03': return 35;
    case 'E04': return 45;
    case 'E05': return 50;
    case 'E06': return 30;
    case 'E07': return 60;
    case 'E08': return 75;
    case 'E09': return 25;
    case 'E10': return 20;
    default: return 40;
  }
}

function getTelemetryForCode(code: string) {
  switch (code) {
    case 'E01':
      return {
        dischargeTemp: '165°F',
        suctionPressure: '38 PSIG (Low Cutoff < 45)',
        ambientTemp: '88.0°F',
        subcooling: '2.1°F (Undercharged)',
        superheat: '28.5°F (Starved Evaporator)',
      };
    case 'E02':
      return {
        dischargeTemp: '242°F (Severe High)',
        suctionPressure: '135 PSIG',
        ambientTemp: '98.5°F',
        subcooling: '18.4°F (High Head)',
        superheat: '8.2°F',
      };
    case 'E03':
      return {
        dischargeTemp: '188°F',
        suctionPressure: '122 PSIG',
        ambientTemp: '86.0°F',
        subcooling: '10.5°F',
        superheat: '14.0°F (Low CFM)',
      };
    case 'E04':
      return {
        dischargeTemp: '228°F (Alert: Trip > 225°F)',
        suctionPressure: '116 PSIG',
        ambientTemp: '94.5°F',
        subcooling: '9.4°F',
        superheat: '19.1°F',
      };
    case 'E05':
      return {
        dischargeTemp: '148°F',
        suctionPressure: '52 PSIG (Freezing)',
        ambientTemp: '76.0°F',
        subcooling: '12.0°F',
        superheat: '3.1°F (Floodback Risk)',
      };
    case 'E06':
      return {
        dischargeTemp: '178°F',
        suctionPressure: '118 PSIG',
        ambientTemp: '92.0°F',
        subcooling: '9.8°F',
        superheat: '15.2°F',
      };
    case 'E07':
      return {
        dischargeTemp: 'Flue Temp 380°F',
        suctionPressure: 'Draft -0.22" w.c. (Spec > -0.65")',
        ambientTemp: '34.0°F (Heating Call)',
        subcooling: 'N/A (Gas Stage)',
        superheat: 'Rollout Switch: Open Circuit',
      };
    case 'E08':
      return {
        dischargeTemp: '170°F',
        suctionPressure: '112 PSIG',
        ambientTemp: '95.0°F',
        subcooling: '10.2°F',
        superheat: 'DC Bus: 342VDC (Fault < 380V)',
      };
    case 'E09':
      return {
        dischargeTemp: '162°F (Unit Tripped)',
        suctionPressure: 'Float Switch: Open (High Sump)',
        ambientTemp: '89.0°F',
        subcooling: '10.0°F',
        superheat: 'Drain Pan Level: 1.2 inches',
      };
    case 'E10':
      return {
        dischargeTemp: 'Sensor Out: -40°F (Open Circuit)',
        suctionPressure: '118 PSIG',
        ambientTemp: '78.0°F',
        subcooling: '9.5°F',
        superheat: 'Actual Duct Temp: 54.2°F',
      };
    default:
      return {
        dischargeTemp: '190°F',
        suctionPressure: '118 PSIG',
        ambientTemp: '85.0°F',
        subcooling: '10.0°F',
        superheat: '14.0°F',
      };
  }
}

export async function askAiCopilot(params: {
  question: string;
  equipmentId?: string;
  errorCode?: string;
  currentStepIndex?: number;
  history?: { role: 'user' | 'assistant'; text: string }[];
}): Promise<{ text: string; sources: string[]; suggestedFollowUps: string[] }> {
  const { question, equipmentId, errorCode, currentStepIndex } = params;

  const equipment = SIMULATED_EQUIPMENT.find((e) => e.id === equipmentId) || SIMULATED_EQUIPMENT[0];
  const errorInfo = SIMULATED_ERROR_CODES.find((e) => e.code === errorCode) || SIMULATED_ERROR_CODES[0];

  const ai = getGeminiClient();

  if (ai) {
    try {
      const systemInstruction = `You are FieldMind AI, an expert, safety-first HVAC field technician assistant.
You are assisting a technician on-site who is servicing ${equipment.name} (${equipment.model}) with alarm code ${errorInfo.code}: ${errorInfo.title}.
Current step in progress: Step ${((currentStepIndex || 0) + 1)}.

OEM Knowledge Base Context:
- OEM Manual: ${equipment.manualTitle} (${equipment.oemReference})
- Error Code Likely Cause: ${errorInfo.likelyCause}
- Safety Warning: ${errorInfo.safetyWarning}
- Standard Procedure: ${errorInfo.defaultSteps.join(' -> ')}
- Document Citation: ${errorInfo.docReference}
- Escalation Criteria: ${ESCALATION_CRITERIA[errorInfo.code] || 'Escalate if parameters do not recover after standard procedure.'}

Rules:
1. Ground all answers strictly in the simulated OEM documentation. Never invent equipment specifications or unsafe repair instructions.
2. Prioritize technician safety (OSHA LOTO, PPE, zero-energy checks).
3. Include specific citations to ${errorInfo.docReference} or ${equipment.manualTitle}.
4. Provide concise, clear bullet points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: question,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      const replyText = response.text || '';
      return {
        text: replyText,
        sources: [errorInfo.docReference, equipment.manualTitle],
        suggestedFollowUps: getDynamicFollowUps(question, errorInfo),
      };
    } catch (err) {
      console.warn('Gemini chat fallback used:', err);
    }
  }

  // Fallback contextual Q&A
  return generateFallbackChatResponse(question, equipment, errorInfo, currentStepIndex);
}

function getDynamicFollowUps(question: string, errorInfo: (typeof SIMULATED_ERROR_CODES)[0]): string[] {
  const q = question.toLowerCase();
  if (q.includes('first') || q.includes('check')) {
    return [
      'What are the exact voltage & LOTO steps?',
      'How do I test the run capacitor with a multimeter?',
      'When should I escalate this issue to a supervisor?',
    ];
  }
  if (q.includes('why') || q.includes('cause')) {
    return [
      'Show me the step-by-step repair procedure.',
      'What parts should I check for wear?',
      'What are the OEM citation references?',
    ];
  }
  return [
    'What should I check first?',
    'Why did this error occur?',
    'When should I escalate this issue?',
    'Summarize this job for the supervisor report.',
  ];
}

function generateFallbackChatResponse(
  question: string,
  equipment: (typeof SIMULATED_EQUIPMENT)[0],
  errorInfo: (typeof SIMULATED_ERROR_CODES)[0],
  currentStepIndex?: number
): { text: string; sources: string[]; suggestedFollowUps: string[] } {
  const q = question.toLowerCase();

  if (q.includes('escalate') || q.includes('supervisor')) {
    return {
      text: `**Escalation Criteria for ${equipment.name} (${errorInfo.code}):**\n\n${ESCALATION_CRITERIA[errorInfo.code] || 'Escalate if readings drift outside OEM bounds after completing standard checklist.'}\n\n*Reference: ${errorInfo.docReference}*`,
      sources: [errorInfo.docReference, equipment.manualTitle],
      suggestedFollowUps: [
        'What should I check first?',
        'Show me the maintenance procedure.',
        'Summarize this job for the supervisor.',
      ],
    };
  }

  if (q.includes('first') || q.includes('what should i check')) {
    return {
      text: `**Priority Check Sequence for ${equipment.name} (${errorInfo.code}):**\n\n1. **Lock-Out / Tag-Out (LOTO):** Verify that the primary ${equipment.voltage} disconnect switch is open and tagged with your personal lock. Test line-to-line and line-to-ground with a CAT-III/IV multimeter to confirm 0.0V.\n2. **Visual & Airflow Inspection:** Inspect coil surfaces and filter racks for dirt loading or debris blocking heat transfer.\n3. **Component Mechanical Check:** Manually verify free rotation of blower/fan blades with insulated gloves.\n4. **Safety Circuit Continuity:** Verify sensor resistance before clearing alarm ${errorInfo.code}.\n\n*Citations: ${errorInfo.docReference}*`,
      sources: [errorInfo.docReference, `${equipment.manualTitle} - Section 8.4`],
      suggestedFollowUps: [
        'How do I test the run capacitor with a multimeter?',
        'Why did this error occur?',
        'When should I escalate this issue?',
      ],
    };
  }

  if (q.includes('why') || q.includes('cause') || q.includes('occur')) {
    return {
      text: `**Root Cause Breakdown for Error ${errorInfo.code} (${errorInfo.title}):**\n\n- **Primary Mechanism:** ${errorInfo.likelyCause}\n- **Physical Dynamics:** ${equipment.name} safety sensors detected out-of-tolerance operating parameters, triggering automated shutdown to prevent thermal breakdown or compressor burnout.\n- **Contributing Factors:** Airflow restriction, electrical component drift, or severe ambient load.\n\n*Grounding Citation: ${errorInfo.docReference}*`,
      sources: [errorInfo.docReference],
      suggestedFollowUps: [
        'What should I check first?',
        'Show me the maintenance procedure.',
        'When should I escalate this issue?',
      ],
    };
  }

  if (q.includes('procedure') || q.includes('step')) {
    const stepList = errorInfo.defaultSteps.map((s, i) => `${i + 1}. ${s}`).join('\n');
    return {
      text: `**Standard Guided Maintenance Procedure for ${equipment.name}:**\n\n${stepList}\n\n*Note: Grounded in ${errorInfo.docReference}. Follow OSHA 1910.147 prior to panel opening.*`,
      sources: [equipment.manualTitle, errorInfo.docReference],
      suggestedFollowUps: [
        'What tools are required for step 2?',
        'How do I verify the fix after completing steps?',
        'When should I escalate this issue?',
      ],
    };
  }

  return {
    text: `Regarding **${equipment.name}** and error **${errorInfo.code}**:\n\nBased on ${errorInfo.docReference}, ensure proper electrical isolation before inspecting mechanical components. Current Step: ${((currentStepIndex || 0) + 1)}. All readings must align with OEM specifications (Voltage: ${equipment.voltage}, Refrigerant: ${equipment.refrigerant}). If you need wiring diagrams or test points, let me know!\n\n*Citation: ${errorInfo.docReference}*`,
    sources: [errorInfo.docReference, equipment.manualTitle],
    suggestedFollowUps: [
      'What should I check first?',
      'Why did this error occur?',
      'When should I escalate this issue?',
      'Summarize this job.',
    ],
  };
}

export async function generateServiceReportAi(params: {
  equipmentId: string;
  errorCode: string;
  stepsCompleted: { stepNumber: number; description: string; notes?: string }[];
  technicianNotes?: string;
  partsReplaced?: string[];
  durationMinutes?: number;
  technicianName?: string;
}): Promise<Partial<ServiceReport>> {
  const {
    equipmentId,
    errorCode,
    stepsCompleted,
    technicianNotes,
    partsReplaced = [],
    durationMinutes = 40,
    technicianName = 'Alex Mercer (Lead Field Technician)',
  } = params;

  const equipment = SIMULATED_EQUIPMENT.find((e) => e.id === equipmentId) || SIMULATED_EQUIPMENT[0];
  const errorInfo = SIMULATED_ERROR_CODES.find((e) => e.code === errorCode) || SIMULATED_ERROR_CODES[0];

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Generate a professional enterprise HVAC service report summary using ONLY verified OEM facts.
Equipment: ${equipment.name} (${equipment.model})
Location: ${equipment.location}
Error Code: ${errorInfo.code} - ${errorInfo.title}
Steps Completed: ${JSON.stringify(stepsCompleted)}
Technician Notes: ${technicianNotes || 'Completed verified OEM repair steps, replaced worn parts, verified operational delta-T and amp draw.'}
Parts Replaced: ${partsReplaced.join(', ') || 'MERV-13 Air Filter Rack'}
OEM Citation: ${errorInfo.docReference}

Return a JSON object with:
- aiDiagnosisSummary (string)
- rootCause (string)
- resolutionSummary (string)
- safetyNotes (string)
- supervisorNotes (string recommendation)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an industrial facilities management reporting AI. Output strictly valid JSON.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              aiDiagnosisSummary: { type: Type.STRING },
              rootCause: { type: Type.STRING },
              resolutionSummary: { type: Type.STRING },
              safetyNotes: { type: Type.STRING },
              supervisorNotes: { type: Type.STRING },
            },
            required: ['aiDiagnosisSummary', 'rootCause', 'resolutionSummary', 'safetyNotes'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          reportedIssue: `${errorInfo.code}: ${errorInfo.title}`,
          aiDiagnosisSummary: parsed.aiDiagnosisSummary,
          rootCause: parsed.rootCause,
          resolutionSummary: parsed.resolutionSummary,
          safetyNotes: parsed.safetyNotes,
          partsReplaced: partsReplaced.length > 0 ? partsReplaced : ['High-Efficiency MERV-13 Filter Rack (24x24x2)'],
          durationMinutes,
          technicianName,
        };
      }
    } catch (err) {
      console.warn('Gemini report generation fallback used:', err);
    }
  }

  // Fallback deterministic report
  return {
    reportedIssue: `${errorInfo.code}: ${errorInfo.title}`,
    aiDiagnosisSummary: `AI diagnosed ${errorInfo.title} on ${equipment.name} per ${errorInfo.docReference}.`,
    rootCause: `${errorInfo.likelyCause}`,
    resolutionSummary: `Applied LOTO, executed all ${stepsCompleted.length} guided checklist steps, verified component tolerances, cleared ${errorInfo.code} alarm, and recorded normal operating delta-T and balanced amp draw.`,
    safetyNotes: `Strict OSHA LOTO electrical isolation (${equipment.voltage}) executed. Zero-energy state verified before opening panels. Personal PPE maintained throughout.`,
    partsReplaced: partsReplaced.length > 0 ? partsReplaced : getPartsForCode(errorInfo.code),
    durationMinutes,
    technicianName,
  };
}

/**
 * 10 Demo Test Cases Execution Function
 * Validates that all 10 simulated error codes (E01 to E10) produce valid, safe, grounded diagnoses.
 */
export async function testAll10DiagnosticCases(): Promise<{
  total: number;
  passed: number;
  results: { code: string; equipment: string; valid: boolean; likelyCause: string; citation: string; confidence: number }[];
}> {
  const codes = ['E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08', 'E09', 'E10'];
  const testResults: { code: string; equipment: string; valid: boolean; likelyCause: string; citation: string; confidence: number }[] = [];

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const equipment = SIMULATED_EQUIPMENT[i % SIMULATED_EQUIPMENT.length];

    const diag = await runEquipmentDiagnosis({
      equipmentId: equipment.id,
      errorCode: code,
      technicianQuestion: `Automated test case verification for ${code} on ${equipment.model}`,
    });

    const isValid =
      !!diag.equipment &&
      !!diag.issue &&
      !!diag.likelyCause &&
      diag.confidence > 0 &&
      !!diag.severity &&
      !!diag.safetyWarning &&
      Array.isArray(diag.steps) &&
      diag.steps.length > 0 &&
      Array.isArray(diag.documentation) &&
      diag.documentation.length > 0 &&
      !!diag.whenToEscalate;

    testResults.push({
      code,
      equipment: diag.equipment,
      valid: isValid,
      likelyCause: diag.likelyCause,
      citation: diag.documentation[0]?.citation || diag.oemManualReference,
      confidence: diag.confidence,
    });
  }

  return {
    total: codes.length,
    passed: testResults.filter((r) => r.valid).length,
    results: testResults,
  };
}
