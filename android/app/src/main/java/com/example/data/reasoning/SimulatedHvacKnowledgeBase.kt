package com.example.data.reasoning

/**
 * Simulated HVAC Documentation Knowledge Base.
 * Ground truth technical manuals, service guides, and safety procedures.
 * The reasoning pipeline uses strictly this documentation to prevent hallucinations.
 */
object SimulatedHvacKnowledgeBase {

    data class HvacManualEntry(
        val documentId: String,
        val documentTitle: String,
        val equipmentType: String,
        val equipmentModel: String,
        val errorCode: String,
        val issueTitle: String,
        val likelyCause: String,
        val defaultConfidence: Int,
        val defaultSeverity: String, // "low", "medium", "high"
        val safetyWarning: String,
        val mandatoryPpe: List<String>,
        val documentedSymptoms: List<String>,
        val diagnosticSteps: List<String>,
        val citations: List<String>,
        val whenToEscalate: String
    )

    val documentationLibrary: List<HvacManualEntry> = listOf(
        // 1. Trane Voyager II - Low Suction Pressure (ERR-402-LP)
        HvacManualEntry(
            documentId = "DOC-TRN-SVX34F-EN",
            documentTitle = "Trane Voyager II Technical Service Guide (Doc #RT-SVX34F-EN)",
            equipmentType = "Commercial HVAC / Packaged RTU",
            equipmentModel = "Trane Voyager II (12.5 Ton Packaged RTU)",
            errorCode = "ERR-402-LP",
            issueTitle = "Low Suction Pressure / Refrigerant Circuit Starvation",
            likelyCause = "Thermal Expansion Valve (TXV) sensing bulb lost thermal contact or loose Schrader valve core at low-side suction service port causing gradual micro-leak and loss of subcooling.",
            defaultConfidence = 94,
            defaultSeverity = "medium",
            safetyWarning = "HIGH VOLTAGE & PRESSURIZED REFRIGERANT: Lockout/Tagout 460V 3-phase disconnect before removing electrical panel. Wear ANSI Z87.1 safety goggles and cryogenic thermal gloves when connecting gauge manifold.",
            mandatoryPpe = listOf("ANSI Z87.1 Safety Goggles", "Cryogenic Thermal Gloves", "Class 0 Voltage-Rated Gloves"),
            documentedSymptoms = listOf(
                "Suction pressure reading 74 PSI (normal: 118-125 PSI for R-410A)",
                "Evaporator coil frosting on bottom circuit",
                "High superheat measured at 26°F (spec: 10-14°F)",
                "Low compressor amperage draw (14.2A vs 21.0A RLA)"
            ),
            diagnosticSteps = listOf(
                "Isolate 460V 3-phase electrical power using Lockout/Tagout (LOTO) and verify 0V with calibrated multimeter.",
                "Attach R-410A manifold gauges to low-side and high-side service ports to record static baseline pressure.",
                "Inspect TXV sensing bulb position at 2 or 10 o'clock on horizontal suction line; verify clean copper contact and thermal insulation.",
                "Execute electronic refrigerant sniffer sweep (1 in/sec) across suction Schrader port, braze joints, and distributor tubes.",
                "Torque loose valve core, seal service cap, re-energize unit, and verify target subcooling of 10.5°F ± 2°F after 15 min runtime."
            ),
            citations = listOf(
                "Trane Voyager II Technical Service Guide (Doc #RT-SVX34F-EN), Section 4.8: 'Refrigerant Circuit Pressure Diagnostic Matrix & Superheat Verification'",
                "Trane Safety & Environmental Protocols (Doc #RT-SAF-02), Section 1.4: 'Pressurized R-410A Handling & Zero-Energy LOTO Standards'"
            ),
            whenToEscalate = "Escalate to Senior Chiller Specialist if suction pressure remains below 80 PSI after TXV clamp replacement or if electronic sniffer detects non-repairable coil micro-fracture exceeding 15 lbs R-410A loss."
        ),

        // 2. Carrier AquaSnap 30MP - Discharge Overheat (ERR-710-HDT)
        HvacManualEntry(
            documentId = "DOC-CAR-OM-30MP-03",
            documentTitle = "Carrier AquaSnap 30MP Control & Troubleshooting Manual (OM-30MP-03)",
            equipmentType = "Commercial Chiller / Water Chiller",
            equipmentModel = "Carrier AquaSnap 30MP (Chilled Water Chiller)",
            errorCode = "ERR-710-HDT",
            issueTitle = "Compressor Discharge High Temperature Excursion",
            likelyCause = "Condenser heat exchanger air intake restriction from dust matting or thermistor sensor thermal drift reading 18°C higher than thermocouple probe.",
            defaultConfidence = 91,
            defaultSeverity = "high",
            safetyWarning = "THERMAL BURN HAZARD: Discharge piping surface temperature exceeds 115°C (240°F). Allow 15 min cool-down period. Use thermal infrared probe to verify safe surface temperature before touching lines.",
            mandatoryPpe = listOf("Heat-Resistant Gloves", "ANSI Safety Glasses", "Thermal IR Temp Gun"),
            documentedSymptoms = listOf(
                "Discharge temperature peaked at 118°C (trip threshold: 115°C)",
                "Condenser coil airflow restricted by dust/lint matting",
                "Discharge pressure elevated at 410 PSI",
                "Thermal overload cutout tripped on Circuit 1"
            ),
            diagnosticSteps = listOf(
                "Switch Carrier ComfortLink controller to Local Stop to ramp down compressor speed safely.",
                "Clean aluminum microchannel condenser coil face with soft fin brush and low-pressure dry nitrogen.",
                "Unplug discharge thermistor lead connector and measure resistance (10.0 kΩ at 25°C / 77°F standard).",
                "Restart chiller via Local Start and confirm discharge temperature stabilizes below 92°C under partial load."
            ),
            citations = listOf(
                "Carrier AquaSnap 30MP Control & Troubleshooting Manual (OM-30MP-03), Chapter 6: 'Discharge Overheat Interlocks and Sensor Calibration'",
                "Carrier Heat Exchanger Maintenance Standards (OM-HX-12), Section 3.1: 'Microchannel Coil Cleaning Protocols'"
            ),
            whenToEscalate = "Escalate if compressor discharge temperature continues to spike above 112°C despite clean coils and calibrated sensor, indicating internal scroll bypass valve failure."
        ),

        // 3. BAC Series 3000 - Fan Drive Vibration (ERR-205-VIB)
        HvacManualEntry(
            documentId = "DOC-BAC-MAN-3000",
            documentTitle = "Baltimore Aircoil Maintenance Protocol (BAC-MAN-3000)",
            equipmentType = "Cooling Tower",
            equipmentModel = "BAC Series 3000 (Crossflow Cooling Tower)",
            errorCode = "ERR-205-VIB",
            issueTitle = "Excessive Fan Drive Vibration & Dynamic Imbalance",
            likelyCause = "Drive belt tension loss and uneven pitch wear causing harmonic resonance exceeding ISO 10816 vibration severity limits (5.8 mm/s vs 4.5 mm/s limit).",
            defaultConfidence = 89,
            defaultSeverity = "medium",
            safetyWarning = "ROTATING MACHINERY HAZARD: Zero-energy isolation required on 25 HP VFD. Mechanically lock fan blades with aluminum safety locking bar before entering plenum chamber to prevent windmilling rotation.",
            mandatoryPpe = listOf("Mechanical Blade Locking Bar", "Hard Hat", "High-Visibility Vest", "Safety Boots"),
            documentedSymptoms = listOf(
                "Triaxial vibration sensor reporting 5.8 mm/s RMS (threshold: 4.5 mm/s)",
                "Belt squeal noted on VFD acceleration ramps",
                "Mild grease ejection from upper pillow-block bearing",
                "Strobe check indicates belt flutter at 1450 RPM"
            ),
            diagnosticSteps = listOf(
                "Isolate 25 HP VFD supply breaker and apply LOTO padlock; test terminals for 0V.",
                "Insert mechanical fan blade locking bar through inspection port to prevent windmilling rotation.",
                "Measure belt deflection with tension gauge (target: 12 mm under 45 N force) and adjust motor base jack screws.",
                "Clean zerk fittings and pump 4 shots (12g) of Mobilith SHC 100 synthetic grease into each pillow-block bearing.",
                "Remove locking bar, restore power, ramp VFD to 60Hz, and confirm RMS vibration is below 3.2 mm/s."
            ),
            citations = listOf(
                "Baltimore Aircoil Maintenance Protocol (BAC-MAN-3000), Section 7: 'Mechanical Drive Assembly, Belt Alignment, and Vibration Limits'",
                "ISO 10816-3 Mechanical Vibration Standard: 'Industrial Fan Vibration Evaluation Classes'"
            ),
            whenToEscalate = "Escalate to Millwright / Vibration Analyst if triaxial vibration remains above 4.5 mm/s after belt tensioning and re-greasing, indicating fan hub eccentric shaft bend or blade pitch mismatch."
        ),

        // 4. Grundfos Hydro MPC - Impeller Cavitation (ERR-531-CAV)
        HvacManualEntry(
            documentId = "DOC-GRF-HYDRO-98432289",
            documentTitle = "Grundfos Hydro MPC Service Instructions (Doc #98432289)",
            equipmentType = "Hydraulic Booster / Water Pump",
            equipmentModel = "Grundfos Hydro MPC (Multi-Stage Booster Pump)",
            errorCode = "ERR-531-CAV",
            issueTitle = "Impeller Cavitation & Low Suction Flow Alert",
            likelyCause = "Suction side Y-strainer screen occluded with scale and sediment buildup, dropping suction pressure to 4.2 PSI, well below Net Positive Suction Head Required (NPSHR).",
            defaultConfidence = 96,
            defaultSeverity = "high",
            safetyWarning = "HIGH PRESSURE WATER SPRAY HAZARD: System operating at 120 PSI. Isolate suction and discharge butterfly valves and open manual pressure bleed cock until gauge reads 0 PSI before loosening bonnet bolts.",
            mandatoryPpe = listOf("Full Face Shield", "Waterproof Apron", "Slip-Resistant Steel-Toe Boots"),
            documentedSymptoms = listOf(
                "Acoustic popping/gravel signature in pump housing 2",
                "Inlet pressure transducer reads 4.2 PSI (nominal: > 18 PSI)",
                "Discharge pressure fluctuating by ±15 PSI",
                "Pump 2 drawing 18% higher amps with reduced flow"
            ),
            diagnosticSteps = listOf(
                "Isolate pump electrically via panel switch and hydraulically via 4-inch butterfly valves.",
                "Open manual 1/4\" bleed cock slowly into catch bucket until pressure gauge confirms 0 PSI.",
                "Unbolt Y-strainer bottom cap and extract 316 stainless steel mesh strainer basket.",
                "Flush debris and rust scale with clean water; inspect basket for mesh structural collapse.",
                "Reassemble with lubricated EPDM O-ring, vent air through bleed cock, and restore AUTO mode."
            ),
            citations = listOf(
                "Grundfos Hydro MPC Service Instructions (Doc #98432289), Section 9: 'Hydraulic Cavitation Diagnostic Protocol & Filter Maintenance'",
                "Hydraulic Institute Standard (ANSI/HI 9.6.1): 'NPSH Margin and Cavitation Damage Mitigation'"
            ),
            whenToEscalate = "Escalate if cavitation acoustic noise persists with clean strainer and inlet pressure > 20 PSI, indicating suction check valve flapper detachment or impeller eye erosion."
        ),

        // 5. Atlas Copco GA-75 - High Oil Temp & Delta-P (ERR-880-OIL)
        HvacManualEntry(
            documentId = "DOC-ATC-GA75-2920",
            documentTitle = "Atlas Copco GA-75 Instruction Book (2920 7100 00)",
            equipmentType = "Industrial Air Compressor / Screw Compressor",
            equipmentModel = "Atlas Copco GA-75 (Oil-Injected Rotary Screw)",
            errorCode = "ERR-880-OIL",
            issueTitle = "High Oil Temperature Trip & Separator Delta-P Exceeded",
            likelyCause = "Thermostatic oil bypass valve capsule stuck in partial bypass position combined with saturated air-oil separator element generating 0.88 bar differential pressure.",
            defaultConfidence = 92,
            defaultSeverity = "high",
            safetyWarning = "STORED PNEUMATIC ENERGY HAZARD: Air receiver holds 8.5 bar compressed air. Press E-Stop mushroom button, open manual blowdown valve, and confirm receiver pressure gauge reads 0.0 bar before loosening any oil plug.",
            mandatoryPpe = listOf("Safety Goggles", "Thermal Oil-Resistant Gloves", "Grounding Strap"),
            documentedSymptoms = listOf(
                "Element discharge temperature reached 98.4°C (trip limit: 100°C)",
                "Oil separator delta-P sensor triggered warning at 0.88 bar (limit: 0.85 bar)",
                "Oil cooler temperature drop across radiator only 4°C",
                "Oil level glass indicator low during unload cycle"
            ),
            diagnosticSteps = listOf(
                "Press Elektronikon E-stop button and open manual blowdown valve until pressure gauge reads 0.0 bar.",
                "Lock out main 75kW supply breaker with LOTO padlock and test terminals with voltage probe.",
                "Unbolt thermostatic bypass valve housing, remove wax capsule, clean passage, and verify 71°C stroke.",
                "Unbolt oil separator cover plate, install new OEM separator cartridge, and verify electrical grounding staple bonding.",
                "Top up Roto-Inject fluid, close blowdown valve, reset service timer, and run on load for 15 min."
            ),
            citations = listOf(
                "Atlas Copco GA-75 Instruction Book (2920 7100 00), Section 4: 'Lube Circuit Thermostatic Regulators and Air-Oil Separator Element Servicing'",
                "Compressed Air and Gas Institute (CAGI) Safety Guideline: 'Pneumatic Pressure Vessel Servicing Protocols'"
            ),
            whenToEscalate = "Escalate immediately if metallic flakes or burnt varnish odor are detected in the oil sample, indicating rotary screw airend bearing galling."
        ),

        // 6. Trane Voyager II - High Head Pressure Trip (ERR-104-HP)
        HvacManualEntry(
            documentId = "DOC-TRN-SVX34F-HP",
            documentTitle = "Trane Voyager II Technical Service Guide (Doc #RT-SVX34F-EN)",
            equipmentType = "Commercial HVAC / Packaged RTU",
            equipmentModel = "Trane Voyager II (12.5 Ton Packaged RTU)",
            errorCode = "ERR-104-HP",
            issueTitle = "High Head / Discharge Pressure Limit Exceeded",
            likelyCause = "Condenser fan motor run capacitor open circuit (reading 1.2 µF vs 15.0 µF rating) causing outdoor fan stall and rapid discharge pressure buildup exceeding 425 PSI cut-out.",
            defaultConfidence = 95,
            defaultSeverity = "high",
            safetyWarning = "STORED CAPACITOR CHARGE & 460V POWER: Disconnect main power. Discharge motor run capacitors using 20kΩ 5W resistor probe before handling terminals.",
            mandatoryPpe = listOf("Class 0 Insulated Gloves", "Insulated Capacitor Discharge Probe", "Safety Glasses"),
            documentedSymptoms = listOf(
                "High pressure cutout switch open at 428 PSI",
                "Outdoor condenser fan motor humming but stationary",
                "Condenser coil surface hot to touch (>75°C)",
                "Compressor thermal protector cycling on internal overload"
            ),
            diagnosticSteps = listOf(
                "Lock out 460V 3-phase RTU disconnect switch and verify 0V.",
                "Discharge condenser fan run capacitor with insulated 20kΩ resistor probe.",
                "Disconnect capacitor wires and measure capacitance with DMM (spec: 15 µF ± 5%).",
                "Replace degraded capacitor with rated 440VAC 15 µF metalized film capacitor.",
                "Re-energize unit, verify condenser fan spins at rated RPM, and monitor high side pressure (normal: 320-360 PSI)."
            ),
            citations = listOf(
                "Trane Voyager II Service Guide (Doc #RT-SVX34F-EN), Section 5.2: 'Condenser Fan Motor & Capacitor Diagnostic Circuitry'",
                "NFPA 70E Standard for Electrical Safety in the Workplace: 'Capacitor De-energization Protocols'"
            ),
            whenToEscalate = "Escalate if new capacitor does not restore fan rotation and motor winding resistance measures open or grounded, requiring crane for complete motor replacement."
        ),

        // 7. Carrier AquaSnap 30MP - Evaporator Freeze Protection / Low Flow (ERR-302-FL)
        HvacManualEntry(
            documentId = "DOC-CAR-OM-30MP-07",
            documentTitle = "Carrier AquaSnap 30MP Control & Troubleshooting Manual (OM-30MP-03)",
            equipmentType = "Commercial Chiller / Water Chiller",
            equipmentModel = "Carrier AquaSnap 30MP (Chilled Water Chiller)",
            errorCode = "ERR-302-FL",
            issueTitle = "Low Evaporator Water Flow & Freeze Protection Lockout",
            likelyCause = "Chilled water loop differential pressure switch tripped due to closed balancing valve or primary chilled water circulation pump deadhead.",
            defaultConfidence = 93,
            defaultSeverity = "high",
            safetyWarning = "CHILLED WATER LOOP EXPANSION: Verify isolation valves before servicing flow switch. Do not bypass freeze protection sensor; operating with low flow risks rupturing brazed plate evaporator tubes.",
            mandatoryPpe = listOf("ANSI Safety Glasses", "Thermal Protective Sleeves"),
            documentedSymptoms = listOf(
                "Evaporator entering/leaving water delta-T > 18°F (normal: 10°F)",
                "Leaving chilled water temp dropped to 36°F (freeze limit: 34°F)",
                "Flow paddle differential switch contact open",
                "Compressor locked out on Safety Code 302"
            ),
            diagnosticSteps = listOf(
                "Verify primary chilled water circulation pump is energized and generating minimum 25 PSI differential.",
                "Inspect building loop motorized 2-way balancing valves for 100% open actuator position.",
                "Inspect paddle flow switch paddle for mechanical deflection and clean magnetic switch contacts.",
                "Bleed air from evaporator top air vent valve until solid water streams.",
                "Reset ComfortLink alarm and verify minimum 2.4 GPM/ton water flow rate."
            ),
            citations = listOf(
                "Carrier AquaSnap 30MP Control & Troubleshooting Manual (OM-30MP-03), Chapter 7: 'Evaporator Freeze Protection & Water Flow Safety Interlocks'",
                "ASHRAE Guideline 22: 'Instrumentation for Monitoring Central Chilled-Water Plant Efficiency'"
            ),
            whenToEscalate = "Escalate immediately if leaving water temperature falls below 32°F or if internal brazed plate heat exchanger shows signs of cross-circuit freeze expansion."
        ),

        // 8. Daikin Rebel - Inverter Overcurrent Trip (ERR-E3-OVR)
        HvacManualEntry(
            documentId = "DOC-DKN-REB-2024",
            documentTitle = "Daikin Rebel Packaged Rooftop Inverter Service Manual (DK-REB-2024)",
            equipmentType = "Commercial HVAC / Inverter RTU",
            equipmentModel = "Daikin Rebel DPS (Inverter Scroll RTU)",
            errorCode = "ERR-E3-OVR",
            issueTitle = "Inverter Compressor Instantaneous Overcurrent Protection",
            likelyCause = "Inverter Variable Frequency Drive (VFD) output phase imbalance or loose U-V-W terminal lugs causing localized voltage drop and excessive current surge during acceleration ramp.",
            defaultConfidence = 90,
            defaultSeverity = "high",
            safetyWarning = "LETHAL DC BUS VOLTAGE: VFD internal DC capacitors store 650VDC. After disconnecting AC power, wait minimum 10 minutes and measure DC bus terminals (+ and -) to verify voltage is under 10VDC before touching connections.",
            mandatoryPpe = listOf("Class 1 1000V Rated Gloves", "Arc-Rated Face Shield (Cal/cm² 8)", "CAT IV Multimeter"),
            documentedSymptoms = listOf(
                "VFD fault code E3 displayed on inverter digital readout",
                "Thermal imaging shows 42°C hotspot at compressor terminal 'V' lug",
                "Phase-to-phase output current imbalance measured at 14%",
                "Compressor shuts down within 3 seconds of speed ramp"
            ),
            diagnosticSteps = listOf(
                "Disconnect 460V 3-phase main power; apply LOTO padlock.",
                "Wait 10 minutes for VFD DC bus discharge; measure + and - bus to confirm < 10VDC.",
                "Inspect compressor U-V-W power terminals; re-torque lug screws to OEM specification (45 in-lbs).",
                "Measure compressor motor winding resistance with milliohm meter (spec: 0.42 Ω between all phases ±3%).",
                "Power on, configure inverter to 20Hz test mode, and verify balanced 3-phase current draw."
            ),
            citations = listOf(
                "Daikin Rebel Inverter Service Manual (DK-REB-2024), Section 8: 'Inverter Compressor Overcurrent & VFD Phase Loss Diagnostics'",
                "IEEE Standard 1584: 'Guide for Performing Arc-Flash Hazard Calculations'"
            ),
            whenToEscalate = "Escalate to Daikin Factory Service if compressor winding phase-to-ground insulation resistance measures < 5 MΩ on 1000V Megohmmeter test, indicating motor stator burnout."
        ),

        // 9. Lennox Landmark - Gas Heat Ignition Lockout (ERR-68-IGN)
        HvacManualEntry(
            documentId = "DOC-LNX-LMK-504",
            documentTitle = "Lennox Landmark Rooftop Unit Combustion Guide (LNX-LMK-504)",
            equipmentType = "Commercial Gas Heating RTU",
            equipmentModel = "Lennox Landmark LGM (Gas/Electric Packaged Unit)",
            errorCode = "ERR-68-IGN",
            issueTitle = "Gas Heating Ignition Failure & Flame Sense Lockout",
            likelyCause = "Flame rectification sensor rod coated with insulating carbon/silica oxidation film, causing flame rectification signal to drop below 1.0 µA microamp threshold.",
            defaultConfidence = 96,
            defaultSeverity = "high",
            safetyWarning = "EXPLOSION & FLAMMABLE GAS HAZARD: If gas odor is present, immediately shut off manual yellow quarter-turn gas cock. Do not operate electrical switches. Ventilate rooftop area.",
            mandatoryPpe = listOf("Calibrated Combustible Gas Sniffer", "Safety Glasses", "Flame-Resistant Clothing"),
            documentedSymptoms = listOf(
                "Ignition control board LED flashes 3 red pulses (Ignition Lockout)",
                "Burner lights for 4 seconds then immediately shuts down",
                "Flame sense current reading 0.3 µA DC (spec: 1.5 - 4.0 µA)",
                "Visible white silica deposits on flame rod electrode"
            ),
            diagnosticSteps = listOf(
                "Shut off manual gas supply cock and electrical power to RTU; inspect area with combustible gas sniffer.",
                "Unscrew flame rectification sensor bracket from burner vestibule.",
                "Polish flame rod gently with ultra-fine steel wool (0000 grade) to remove silica glaze.",
                "Inspect spark igniter gap (spec: 1/8\" / 3.2 mm) and high-voltage ignition cable insulation.",
                "Reinstall sensor, open gas cock, restore power, and measure steady flame signal (> 2.0 µA DC)."
            ),
            citations = listOf(
                "Lennox Landmark Combustion Service Manual (LNX-LMK-504), Section 6: 'Direct Spark Ignition & Flame Rectification Diagnostics'",
                "NFPA 54 National Fuel Gas Code: 'Burner Flame Safeguard & Venting Standards'"
            ),
            whenToEscalate = "Escalate if gas manifold pressure drops below 3.5\" W.C. natural gas rating or if heat exchanger inspection reveals cracked burner tubes or carbon monoxide leakage."
        ),

        // 10. York YLAA - EEV Subcooling Fault (ERR-08-ECH)
        HvacManualEntry(
            documentId = "DOC-YORK-YLAA-150",
            documentTitle = "York YLAA Air-Cooled Scroll Chiller Service Manual (YORK-FORM-150.28-NM1)",
            equipmentType = "Air-Cooled Scroll Chiller",
            equipmentModel = "York YLAA 0070-0175 (Air-Cooled Scroll Chiller)",
            errorCode = "ERR-08-ECH",
            issueTitle = "Electronic Expansion Valve (EEV) Stepper Motor Fault",
            likelyCause = "EEV stepper motor actuator stator coil open circuit on phase B, locking expansion valve at 22% fixed position and preventing proper subcooling modulation.",
            defaultConfidence = 92,
            defaultSeverity = "medium",
            safetyWarning = "CRYOGENIC REFRIGERANT HAZARD: R-410A liquid under pressure. Never loosen EEV body bolts without recovering refrigerant to 0.0 PSIG per EPA Section 608 guidelines.",
            mandatoryPpe = listOf("Cryogenic Safety Gloves", "ANSI Safety Goggles", "Long-Sleeve Work Shirt"),
            documentedSymptoms = listOf(
                "OptiView control center displays 'EEV Drive Alarm Circuit 1'",
                "Suction superheat fluctuating between 4°F and 38°F",
                "Stepper motor clicks rapidly without valve needle movement",
                "EEV coil resistance test shows phase B open (> 100 kΩ vs 46 Ω spec)"
            ),
            diagnosticSteps = listOf(
                "Lock out 460V chiller power supply; confirm zero electrical potential.",
                "Disconnect 5-pin EEV harness plug at micro-computer board.",
                "Measure resistance between center common pin and each stator coil pin (spec: 46 Ω ± 3 Ω at 20°C).",
                "Unclip defective stepper motor coil from brass valve body without breaking refrigerant seal.",
                "Snap new OEM stepper coil into indexing groove, reconnect harness, and run controller auto-calibration stroke test."
            ),
            citations = listOf(
                "York YLAA Scroll Chiller Manual (YORK-FORM-150.28-NM1), Section 11: 'Electronic Expansion Valve (EEV) Calibration & Stepper Motor Diagnostics'",
                "EPA Clean Air Act Section 608: 'Commercial Refrigeration Servicing Regulations'"
            ),
            whenToEscalate = "Escalate if new stepper coil fails to stroke valve needle, indicating debris or mechanical seizure inside the hermetic valve body requiring refrigerant recovery and torch brazing."
        )
    )

    fun findManualByErrorCode(errorCode: String): HvacManualEntry? {
        val cleanCode = errorCode.trim().uppercase()
        return documentationLibrary.find { 
            it.errorCode.equals(cleanCode, ignoreCase = true) ||
            cleanCode.contains(it.errorCode, ignoreCase = true)
        }
    }

    fun findManualByEquipmentAndCode(equipmentTypeOrModel: String, errorCode: String): HvacManualEntry? {
        val cleanCode = errorCode.trim().uppercase()
        val cleanEq = equipmentTypeOrModel.trim().lowercase()
        return documentationLibrary.find {
            (it.errorCode.equals(cleanCode, ignoreCase = true) || cleanCode.contains(it.errorCode, ignoreCase = true)) &&
            (cleanEq.contains(it.equipmentType.lowercase()) || it.equipmentType.lowercase().contains(cleanEq) ||
             cleanEq.contains(it.equipmentModel.lowercase()) || it.equipmentModel.lowercase().contains(cleanEq))
        } ?: findManualByErrorCode(errorCode)
    }
}
