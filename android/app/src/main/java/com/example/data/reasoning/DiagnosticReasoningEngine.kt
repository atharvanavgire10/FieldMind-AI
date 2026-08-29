package com.example.data.reasoning

/**
 * FieldMind Structured Diagnostic Reasoning Pipeline.
 *
 * Implements strict, grounded reasoning over simulated HVAC documentation:
 * - Never invents equipment specifications or unsafe instructions.
 * - Flags insufficient information clearly when input data is missing or out-of-scope.
 * - Prioritizes technician safety above all else (LOTO, PPE, hazard isolation).
 * - Generates structured output conforming strictly to the required JSON schema.
 * - Attaches verifiable citations/references to the simulated documentation.
 */
object DiagnosticReasoningEngine {

    /**
     * Executes the structured diagnostic reasoning pipeline.
     */
    fun processDiagnosis(input: DiagnosticInput): DiagnosticOutput {
        val cleanEqType = input.equipmentType.trim()
        val cleanErrorCode = input.errorCode.trim().uppercase()
        val question = input.technicianQuestion.trim().lowercase()

        // 1. Validate Input Completeness
        if (cleanEqType.isBlank() || cleanErrorCode.isBlank() || cleanErrorCode == "UNKNOWN" || cleanErrorCode == "N/A") {
            return DiagnosticOutput(
                equipment = if (cleanEqType.isNotBlank()) cleanEqType else "Unknown Equipment",
                issue = "Insufficient Information to Diagnose",
                likelyCause = "Information is insufficient to determine cause safely without verified equipment model and active fault code. FieldMind does not speculate or invent specifications.",
                confidence = 0,
                severity = "low",
                safetyWarning = "SAFETY FIRST: Do not energize, dismantle, or attempt repairs without verifying equipment nameplate specifications and electrical voltage ratings.",
                steps = listOf(
                    "Inspect equipment nameplate to record exact manufacturer, model number, and serial number.",
                    "Access control panel diagnostics to retrieve active alphanumeric fault codes.",
                    "Verify supply voltage and execute Lockout/Tagout (LOTO) before opening any electrical enclosure."
                ),
                documentation = listOf(
                    "FieldMind Safety Standard (Doc #FMD-SAF-01), Section 1.2: 'Minimum Required Diagnostic Data & Spec Verification'"
                ),
                whenToEscalate = "Escalate to lead systems engineer if equipment nameplate is missing or controller error logs cannot be confirmed."
            )
        }

        // 2. Immediate Critical Safety Check in input context / technician question
        val isGasLeakRisk = question.contains("gas smell") || question.contains("gas leak") || question.contains("odor")
        val isArcFlashRisk = question.contains("arcing") || question.contains("sparking") || question.contains("smoke")

        if (isGasLeakRisk) {
            return DiagnosticOutput(
                equipment = cleanEqType,
                issue = "EMERGENCY: Suspected Flammable Gas Leak",
                likelyCause = "Combustible gas leak detected in heating section or supply piping manifold.",
                confidence = 98,
                severity = "high",
                safetyWarning = "EXPLOSION HAZARD: Immediately close manual yellow quarter-turn gas shutoff cock. Do not operate any electrical switches or devices. Evacuate area immediately.",
                steps = listOf(
                    "Immediately close main yellow gas supply shutoff valve.",
                    "Do not toggle any electrical switches or power breakers.",
                    "Evacuate maintenance personnel from rooftop / mechanical space.",
                    "Notify facility safety manager and call emergency utility response."
                ),
                documentation = listOf(
                    "NFPA 54 National Fuel Gas Code: 'Emergency Gas Leak Isolation Protocols'",
                    "FieldMind Emergency Safety Directive (ESD-01): 'Flammable Gas Hazard Response'"
                ),
                whenToEscalate = "Escalate immediately to Fire Department and Gas Utility Emergency Dispatch."
            )
        }

        if (isArcFlashRisk) {
            return DiagnosticOutput(
                equipment = cleanEqType,
                issue = "EMERGENCY: Electrical Arcing / Insulation Breakdown",
                likelyCause = "Catastrophic phase-to-ground or phase-to-phase arc fault in high voltage electrical vestibule.",
                confidence = 99,
                severity = "high",
                safetyWarning = "ARC FLASH & ELECTROCUTION HAZARD: Stand clear of electrical enclosure. Immediately trip main upstream distribution breaker. Do not open panel door while energized.",
                steps = listOf(
                    "Trip main upstream branch circuit breaker from safe distance.",
                    "Apply Lockout/Tagout padlock to main power source.",
                    "Verify zero electrical potential across all phases using CAT IV insulated multimeter with arc-rated PPE.",
                    "Inspect wiring harnesses for phase insulation burnout and thermal charring."
                ),
                documentation = listOf(
                    "NFPA 70E Standard for Electrical Safety in the Workplace: 'Arc Flash Hazard Boundaries & De-energization'",
                    "FieldMind Electrical Safety Directive (ESD-02): 'High-Voltage Incident Isolation'"
                ),
                whenToEscalate = "Escalate immediately to Senior Electrical Engineer / Master Electrician."
            )
        }

        // 3. Match against Supplied Simulated HVAC Documentation Library
        val manualEntry = SimulatedHvacKnowledgeBase.findManualByEquipmentAndCode(
            equipmentTypeOrModel = if (input.equipmentModel.isNullOrBlank()) cleanEqType else input.equipmentModel,
            errorCode = cleanErrorCode
        )

        if (manualEntry == null) {
            return DiagnosticOutput(
                equipment = cleanEqType,
                issue = "Unverified Fault Code: $cleanErrorCode",
                likelyCause = "Information is insufficient. Error code '$cleanErrorCode' is not documented in the supplied simulated HVAC knowledge base. To maintain strict safety compliance, FieldMind does not invent repair procedures.",
                confidence = 0,
                severity = "medium",
                safetyWarning = "DO NOT PROCEED WITHOUT AUTHORIZED OEM MANUAL: Servicing equipment without authorized manufacturer specifications risks electrical shock, refrigerant venting, or mechanical failure.",
                steps = listOf(
                    "Consult physical equipment schematic diagram located inside unit access door.",
                    "Confirm exact alphanumeric code displayed on main control interface.",
                    "Check baseline supply voltage and pressure transducers safely.",
                    "Contact factory authorized technical support for $cleanEqType."
                ),
                documentation = listOf(
                    "FieldMind Diagnostic Standard #101: 'Unverified Equipment Diagnostic Isolation Standard'"
                ),
                whenToEscalate = "Escalate to manufacturer authorized technical service representative for model '$cleanEqType'."
            )
        }

        // 4. Grounded Reasoning with Image Metadata & Safety Rules
        var calculatedConfidence = manualEntry.defaultConfidence
        var adjustedLikelyCause = manualEntry.likelyCause

        // Image Metadata Enrichment (if provided)
        val imageMeta = input.capturedImageMetadata
        if (!imageMeta.isNullOrBlank()) {
            val lowerMeta = imageMeta.lowercase()
            if (lowerMeta.contains("frost") || lowerMeta.contains("leak") || lowerMeta.contains("hotspot") || 
                lowerMeta.contains("capacitor") || lowerMeta.contains("oil") || lowerMeta.contains("vibration") ||
                lowerMeta.contains("corrosion") || lowerMeta.contains("debris")) {
                calculatedConfidence = (calculatedConfidence + 3).coerceAtMost(98)
                adjustedLikelyCause = "$adjustedLikelyCause [Visual Analysis: $imageMeta]"
            }
        }

        // Generate final output
        return DiagnosticOutput(
            equipment = manualEntry.equipmentModel,
            issue = "${manualEntry.errorCode} - ${manualEntry.issueTitle}",
            likelyCause = adjustedLikelyCause,
            confidence = calculatedConfidence,
            severity = manualEntry.defaultSeverity,
            safetyWarning = manualEntry.safetyWarning,
            steps = manualEntry.diagnosticSteps,
            documentation = manualEntry.citations,
            whenToEscalate = manualEntry.whenToEscalate
        )
    }
}
