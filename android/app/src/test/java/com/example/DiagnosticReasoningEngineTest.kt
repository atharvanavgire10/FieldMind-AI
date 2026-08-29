package com.example

import com.example.data.reasoning.DiagnosticInput
import com.example.data.reasoning.DiagnosticOutput
import com.example.data.reasoning.DiagnosticReasoningEngine
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Comprehensive test suite verifying the FieldMind AI Structured Diagnostic Reasoning Pipeline.
 * Tests at least 10 demo cases against the supplied simulated HVAC documentation library.
 */
class DiagnosticReasoningEngineTest {

    private fun assertValidJsonSchema(output: DiagnosticOutput) {
        val jsonStr = output.toJson()
        val jsonObj = JSONObject(jsonStr)
        assertTrue("JSON must have equipment key", jsonObj.has("equipment"))
        assertTrue("JSON must have issue key", jsonObj.has("issue"))
        assertTrue("JSON must have likelyCause key", jsonObj.has("likelyCause"))
        assertTrue("JSON must have confidence key", jsonObj.has("confidence"))
        assertTrue("JSON must have severity key", jsonObj.has("severity"))
        assertTrue("JSON must have safetyWarning key", jsonObj.has("safetyWarning"))
        assertTrue("JSON must have steps key", jsonObj.has("steps"))
        assertTrue("JSON must have documentation key", jsonObj.has("documentation"))
        assertTrue("JSON must have whenToEscalate key", jsonObj.has("whenToEscalate"))

        val severity = jsonObj.getString("severity")
        assertTrue("Severity must be low, medium, or high", severity in listOf("low", "medium", "high"))
    }

    // CASE 1: Trane Voyager II RTU - Low Suction Pressure (ERR-402-LP)
    @Test
    fun testCase01_TraneVoyager_LowSuctionPressure() {
        val input = DiagnosticInput(
            equipmentType = "Commercial HVAC",
            equipmentModel = "Trane Voyager II (12.5 Ton Packaged RTU)",
            errorCode = "ERR-402-LP",
            capturedImageMetadata = "Viewfinder shows frost buildup on lower circuit; oil sheen on suction Schrader port",
            technicianQuestion = "Why is the suction pressure dropping to 74 PSI?",
            safetyConstraints = listOf("Lockout/Tagout 460V 3-phase required", "Cryogenic refrigerant PPE")
        )

        val output = DiagnosticReasoningEngine.processDiagnosis(input)

        assertTrue(output.equipment.contains("Trane Voyager"))
        assertTrue(output.issue.contains("ERR-402-LP"))
        assertTrue(output.likelyCause.contains("TXV") || output.likelyCause.contains("Schrader"))
        assertTrue("Confidence should be high (>90)", output.confidence >= 90)
        assertTrue(output.safetyWarning.contains("Lockout/Tagout") || output.safetyWarning.contains("HIGH VOLTAGE"))
        assertTrue("Steps should include LOTO as step 1", output.steps.first().contains("LOTO") || output.steps.first().contains("Isolate"))
        assertTrue("Must cite simulated Trane manual", output.documentation.any { it.contains("RT-SVX34F") })
        assertTrue("Must include escalation guidelines", output.whenToEscalate.isNotBlank())
        assertValidJsonSchema(output)
    }

    // CASE 2: Carrier AquaSnap 30MP - Compressor Discharge Overheat (ERR-710-HDT)
    @Test
    fun testCase02_CarrierAquaSnap_DischargeOverheat() {
        val input = DiagnosticInput(
            equipmentType = "Commercial Chiller",
            equipmentModel = "Carrier AquaSnap 30MP (Chilled Water Chiller)",
            errorCode = "ERR-710-HDT",
            capturedImageMetadata = "Thermal camera indicates 118C discharge pipe surface temperature and dust matting on fins",
            technicianQuestion = "Is it safe to touch the discharge line? Why is it overheating?"
        )

        val output = DiagnosticReasoningEngine.processDiagnosis(input)

        assertTrue(output.equipment.contains("Carrier AquaSnap"))
        assertTrue(output.issue.contains("ERR-710-HDT"))
        assertTrue(output.likelyCause.contains("Condenser") || output.likelyCause.contains("thermistor"))
        assertEquals("high", output.severity)
        assertTrue(output.safetyWarning.contains("THERMAL BURN") || output.safetyWarning.contains("115°C"))
        assertTrue("Must cite Carrier 30MP manual", output.documentation.any { it.contains("OM-30MP-03") })
        assertValidJsonSchema(output)
    }

    // CASE 3: BAC Series 3000 Cooling Tower - Fan Vibration (ERR-205-VIB)
    @Test
    fun testCase03_BACSeries3000_FanVibration() {
        val input = DiagnosticInput(
            equipmentType = "Cooling Tower",
            equipmentModel = "BAC Series 3000 (Crossflow Cooling Tower)",
            errorCode = "ERR-205-VIB",
            capturedImageMetadata = "Belt flutter observed; 5.8 mm/s RMS vibration recorded",
            technicianQuestion = "What causes the harmonic vibration and belt squeal?"
        )

        val output = DiagnosticReasoningEngine.processDiagnosis(input)

        assertTrue(output.equipment.contains("BAC Series 3000"))
        assertTrue(output.issue.contains("ERR-205-VIB"))
        assertTrue(output.likelyCause.contains("belt") || output.likelyCause.contains("ISO 10816"))
        assertTrue(output.safetyWarning.contains("ROTATING MACHINERY") || output.safetyWarning.contains("locking bar"))
        assertTrue(output.steps.any { it.contains("locking bar") })
        assertTrue("Must cite BAC manual", output.documentation.any { it.contains("BAC-MAN-3000") })
        assertValidJsonSchema(output)
    }

    // CASE 4: Grundfos Hydro MPC - Impeller Cavitation (ERR-531-CAV)
    @Test
    fun testCase04_GrundfosHydroMPC_Cavitation() {
        val input = DiagnosticInput(
            equipmentType = "Hydraulic Booster",
            equipmentModel = "Grundfos Hydro MPC (Multi-Stage Booster Pump)",
            errorCode = "ERR-531-CAV",
            capturedImageMetadata = "Inlet gauge reads 4.2 PSI; acoustic popping sound heard",
            technicianQuestion = "Why is pump 2 rattling and losing suction pressure?"
        )

        val output = DiagnosticReasoningEngine.processDiagnosis(input)

        assertTrue(output.equipment.contains("Grundfos Hydro MPC"))
        assertTrue(output.issue.contains("ERR-531-CAV"))
        assertTrue(output.likelyCause.contains("Y-strainer") || output.likelyCause.contains("NPSHR"))
        assertEquals("high", output.severity)
        assertTrue(output.safetyWarning.contains("HIGH PRESSURE") || output.safetyWarning.contains("120 PSI"))
        assertTrue("Must cite Grundfos service doc", output.documentation.any { it.contains("98432289") })
        assertValidJsonSchema(output)
    }

    // CASE 5: Atlas Copco GA-75 Air Compressor - High Oil Temp & Delta-P (ERR-880-OIL)
    @Test
    fun testCase05_AtlasCopcoGA75_OilTempTrip() {
        val input = DiagnosticInput(
            equipmentType = "Industrial Air Compressor",
            equipmentModel = "Atlas Copco GA-75 (Oil-Injected Rotary Screw)",
            errorCode = "ERR-880-OIL",
            capturedImageMetadata = "Delta-P sensor reads 0.88 bar; oil temperature reads 98.4C",
            technicianQuestion = "Why did the oil temperature trip occur?"
        )

        val output = DiagnosticReasoningEngine.processDiagnosis(input)

        assertTrue(output.equipment.contains("Atlas Copco GA-75"))
        assertTrue(output.issue.contains("ERR-880-OIL"))
        assertTrue(output.likelyCause.contains("Thermostatic") || output.likelyCause.contains("separator"))
        assertEquals("high", output.severity)
        assertTrue(output.safetyWarning.contains("STORED PNEUMATIC ENERGY") || output.safetyWarning.contains("8.5 bar"))
        assertTrue("Must cite Atlas Copco instruction book", output.documentation.any { it.contains("2920 7100 00") })
        assertValidJsonSchema(output)
    }

    // CASE 6: Trane Voyager II RTU - High Head Pressure Trip (ERR-104-HP)
    @Test
    fun testCase06_TraneVoyager_HighHeadPressure() {
        val input = DiagnosticInput(
            equipmentType = "Commercial HVAC",
            equipmentModel = "Trane Voyager II (12.5 Ton Packaged RTU)",
            errorCode = "ERR-104-HP",
            capturedImageMetadata = "Capacitance meter reads 1.2 uF on 15 uF fan capacitor",
            technicianQuestion = "High pressure switch tripped at 428 PSI; outdoor fan motor stopped"
        )

        val output = DiagnosticReasoningEngine.processDiagnosis(input)

        assertTrue(output.equipment.contains("Trane Voyager"))
        assertTrue(output.issue.contains("ERR-104-HP"))
        assertTrue(output.likelyCause.contains("capacitor") || output.likelyCause.contains("fan"))
        assertEquals("high", output.severity)
        assertTrue(output.safetyWarning.contains("CAPACITOR") || output.safetyWarning.contains("460V"))
        assertTrue("Must cite Trane service guide", output.documentation.any { it.contains("RT-SVX34F") })
        assertValidJsonSchema(output)
    }

    // CASE 7: Carrier AquaSnap 30MP - Evaporator Freeze Protection / Low Flow (ERR-302-FL)
    @Test
    fun testCase07_CarrierAquaSnap_FreezeProtectionLowFlow() {
        val input = DiagnosticInput(
            equipmentType = "Commercial Chiller",
            equipmentModel = "Carrier AquaSnap 30MP (Chilled Water Chiller)",
            errorCode = "ERR-302-FL",
            technicianQuestion = "Chiller tripped on code 302 with leaving water temperature 36F"
        )

        val output = DiagnosticReasoningEngine.processDiagnosis(input)

        assertTrue(output.equipment.contains("Carrier AquaSnap"))
        assertTrue(output.issue.contains("ERR-302-FL"))
        assertTrue(output.likelyCause.contains("differential") || output.likelyCause.contains("flow"))
        assertTrue(output.safetyWarning.contains("CHILLED WATER") || output.safetyWarning.contains("freeze"))
        assertTrue("Must cite Carrier Chapter 7 manual", output.documentation.any { it.contains("OM-30MP-03") })
        assertValidJsonSchema(output)
    }

    // CASE 8: Daikin Rebel Packaged RTU - Inverter Overcurrent (ERR-E3-OVR)
    @Test
    fun testCase08_DaikinRebel_InverterOvercurrent() {
        val input = DiagnosticInput(
            equipmentType = "Commercial HVAC",
            equipmentModel = "Daikin Rebel DPS (Inverter Scroll RTU)",
            errorCode = "ERR-E3-OVR",
            capturedImageMetadata = "Thermal hotspot 42C at compressor V-phase terminal lug",
            technicianQuestion = "Inverter trips on E3 instantaneous overcurrent during acceleration"
        )

        val output = DiagnosticReasoningEngine.processDiagnosis(input)

        assertTrue(output.equipment.contains("Daikin Rebel"))
        assertTrue(output.issue.contains("ERR-E3-OVR"))
        assertTrue(output.likelyCause.contains("Inverter") || output.likelyCause.contains("phase"))
        assertEquals("high", output.severity)
        assertTrue(output.safetyWarning.contains("DC BUS VOLTAGE") || output.safetyWarning.contains("650VDC"))
        assertTrue("Must cite Daikin manual", output.documentation.any { it.contains("DK-REB-2024") })
        assertValidJsonSchema(output)
    }

    // CASE 9: Lennox Landmark RTU - Gas Heat Ignition Lockout (ERR-68-IGN)
    @Test
    fun testCase09_LennoxLandmark_GasIgnitionLockout() {
        val input = DiagnosticInput(
            equipmentType = "Commercial Gas Heating RTU",
            equipmentModel = "Lennox Landmark LGM (Gas/Electric Packaged Unit)",
            errorCode = "ERR-68-IGN",
            technicianQuestion = "Burner lights for 4 seconds then shuts off with 3 red flashes"
        )

        val output = DiagnosticReasoningEngine.processDiagnosis(input)

        assertTrue(output.equipment.contains("Lennox Landmark"))
        assertTrue(output.issue.contains("ERR-68-IGN"))
        assertTrue(output.likelyCause.contains("flame") || output.likelyCause.contains("rectification"))
        assertEquals("high", output.severity)
        assertTrue(output.safetyWarning.contains("EXPLOSION") || output.safetyWarning.contains("GAS"))
        assertTrue("Must cite Lennox combustion guide", output.documentation.any { it.contains("LNX-LMK-504") })
        assertValidJsonSchema(output)
    }

    // CASE 10: York YLAA Scroll Chiller - Electronic Expansion Valve Stepper Fault (ERR-08-ECH)
    @Test
    fun testCase10_YorkYLAA_EEVStepperFault() {
        val input = DiagnosticInput(
            equipmentType = "Air-Cooled Scroll Chiller",
            equipmentModel = "York YLAA 0070-0175 (Air-Cooled Scroll Chiller)",
            errorCode = "ERR-08-ECH",
            technicianQuestion = "EEV drive alarm; superheat fluctuating wildly between 4F and 38F"
        )

        val output = DiagnosticReasoningEngine.processDiagnosis(input)

        assertTrue(output.equipment.contains("York YLAA"))
        assertTrue(output.issue.contains("ERR-08-ECH"))
        assertTrue(output.likelyCause.contains("EEV") || output.likelyCause.contains("stepper"))
        assertTrue(output.safetyWarning.contains("CRYOGENIC") || output.safetyWarning.contains("R-410A"))
        assertTrue("Must cite York manual", output.documentation.any { it.contains("YORK-FORM-150") })
        assertValidJsonSchema(output)
    }

    // CASE 11: Insufficient Information Safety Constraint (Unknown Error Code / Missing Specs)
    @Test
    fun testCase11_InsufficientInformation_SafetyFirst() {
        val input = DiagnosticInput(
            equipmentType = "Generic Rooftop Unit",
            errorCode = "UNKNOWN-999",
            technicianQuestion = "How do I fix this unit?"
        )

        val output = DiagnosticReasoningEngine.processDiagnosis(input)

        assertEquals("Confidence must be 0 for undocumented code", 0, output.confidence)
        assertTrue("Must state information is insufficient", output.likelyCause.contains("Information is insufficient"))
        assertTrue("Must warn against proceeding without OEM manual", output.safetyWarning.contains("DO NOT PROCEED") || output.safetyWarning.contains("SAFETY FIRST"))
        assertValidJsonSchema(output)
    }

    // CASE 12: Emergency Flammable Gas Leak Priority Check
    @Test
    fun testCase12_EmergencyGasLeak_SafetyPriority() {
        val input = DiagnosticInput(
            equipmentType = "Commercial Gas Heating RTU",
            errorCode = "ERR-68-IGN",
            technicianQuestion = "Strong gas smell detected near heating section"
        )

        val output = DiagnosticReasoningEngine.processDiagnosis(input)

        assertEquals("high", output.severity)
        assertTrue(output.issue.contains("EMERGENCY") || output.issue.contains("Gas Leak"))
        assertTrue(output.safetyWarning.contains("EXPLOSION HAZARD"))
        assertTrue(output.steps.first().contains("gas supply") || output.steps.first().contains("shutoff"))
        assertValidJsonSchema(output)
    }
}
