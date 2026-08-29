package com.example.data.local

import com.example.data.model.Diagnosis
import com.example.data.model.Equipment
import com.example.data.model.GuidedProcedure
import com.example.data.model.JobOrder
import com.example.data.model.ProcedureStep

object DemoKnowledgeBase {

    val demoEquipments = listOf(
        Equipment(
            id = "eq_hvac_a",
            name = "HVAC Unit A",
            model = "Trane Voyager II (12.5 Ton Packaged RTU)",
            serialNumber = "TRN-2024-8841-A",
            location = "Building 4, Rooftop Sector North",
            category = "Commercial HVAC",
            status = "Low Pressure Alarm Active",
            specifications = mapOf(
                "Refrigerant" to "R-410A (9.8 lbs)",
                "Supply Voltage" to "460V / 3 Phase / 60Hz",
                "Compressor Type" to "Dual 3D Scroll",
                "Operating Pressure (Suction)" to "118 PSI nominal"
            )
        ),
        Equipment(
            id = "eq_hvac_b",
            name = "HVAC Unit B",
            model = "Carrier AquaSnap 30MP (Chilled Water Chiller)",
            serialNumber = "CAR-30MP-7729-B",
            location = "Plant Room B2, Mechanical Bay 1",
            category = "Commercial Chiller",
            status = "Discharge Overheat Alert",
            specifications = mapOf(
                "Cooling Capacity" to "50 Tons",
                "Refrigerant" to "R-410A",
                "Full Load Amps" to "82 A",
                "Max Discharge Temp" to "115°C (240°F)"
            )
        ),
        Equipment(
            id = "eq_cooling_c",
            name = "Cooling System C",
            model = "BAC Series 3000 (Crossflow Cooling Tower)",
            serialNumber = "BAC-3000-4102-C",
            location = "Central Utility Plant Exterior Deck",
            category = "Cooling Tower",
            status = "Vibration Warning (VIB-205)",
            specifications = mapOf(
                "Fan Diameter" to "84 inches (6-Blade)",
                "Drive Type" to "ENDURADRIVE Belt Reduction",
                "Motor Power" to "25 HP VFD Controlled",
                "Max Vibration Spec" to "< 4.5 mm/s RMS"
            )
        ),
        Equipment(
            id = "eq_pump_d",
            name = "Pump Unit D",
            model = "Grundfos Hydro MPC (Multi-Stage Booster Pump)",
            serialNumber = "GRF-MPC-9033-D",
            location = "Basement Water Distribution Vault",
            category = "Hydraulic Booster",
            status = "Cavitation & Low Flow Alert",
            specifications = mapOf(
                "Design Flow" to "350 GPM @ 120 PSI",
                "Operating Pumps" to "3 x CR-45 Vertical Multistage",
                "Impeller Material" to "316 Stainless Steel",
                "Max Inlet Pressure" to "16 Bar (232 PSI)"
            )
        ),
        Equipment(
            id = "eq_compressor_e",
            name = "Compressor E",
            model = "Atlas Copco GA-75 (Oil-Injected Rotary Screw)",
            serialNumber = "ATC-GA75-6619-E",
            location = "Air Generation Bay - Workshop 3",
            category = "Industrial Air Compressor",
            status = "High Oil Temp & Delta-P Trip",
            specifications = mapOf(
                "Free Air Delivery" to "465 CFM @ 8.5 bar",
                "Motor Rating" to "75 kW (100 HP) TEFC",
                "Lube Capacity" to "32 Liters Roto-Inject",
                "Max Outlet Temp" to "100°C Trip Threshold"
            )
        )
    )

    val demoDiagnoses = mapOf(
        "eq_hvac_a" to Diagnosis(
            id = "diag_hvac_a",
            equipmentId = "eq_hvac_a",
            equipmentName = "HVAC Unit A - Trane Voyager II",
            detectedError = "Low Suction Pressure / Refrigerant Circuit Starvation",
            errorCode = "ERR-402-LP",
            likelyCause = "Thermal Expansion Valve (TXV) sensing bulb lost thermal contact or loose Schrader valve core at low-side suction service port causing gradual micro-leak and loss of subcooling.",
            confidence = 94,
            severity = "medium",
            safetyWarning = "HIGH VOLTAGE & PRESSURIZED REFRIGERANT: Lockout/Tagout 460V 3-phase disconnect before removing electrical access panel. Wear ANSI Z87.1 safety goggles and cryogenic thermal gloves when attaching manifold hoses.",
            technicalDocumentation = "Trane Voyager II Technical Service Guide (Doc #RT-SVX34F-EN), Section 4.8: 'Refrigerant Circuit Pressure Diagnostic Matrix & Superheat Verification'",
            symptoms = listOf(
                "Suction pressure reading 74 PSI (normal: 118-125 PSI for R-410A)",
                "Evaporator coil frosting on bottom circuit",
                "High superheat measured at 26°F (spec: 10-14°F)",
                "Low compressor amperage draw (14.2A vs 21.0A RLA)"
            ),
            recommendedAction = "Perform electrical Lockout/Tagout, inspect TXV bulb clamp, execute electronic refrigerant sniffer scan, and verify superheat after servicing.",
            recommendedSteps = listOf(
                "Isolate 460V 3-phase electrical power using Lockout/Tagout (LOTO) and verify 0V with calibrated multimeter.",
                "Attach R-410A manifold gauges to low-side and high-side service ports to record static baseline pressure.",
                "Inspect TXV sensing bulb position at 2 or 10 o'clock on horizontal suction line; verify clean copper contact and thermal insulation.",
                "Execute electronic refrigerant sniffer sweep (1 in/sec) across suction Schrader port, braze joints, and distributor tubes.",
                "Torque loose valve core, seal service cap, re-energize unit, and verify target subcooling of 10.5°F ± 2°F after 15 min runtime."
            ),
            sourceDocumentation = listOf(
                "Trane Voyager II Technical Service Guide (Doc #RT-SVX34F-EN), Section 4.8: 'Refrigerant Circuit Pressure Diagnostic Matrix & Superheat Verification'",
                "Trane Safety & Environmental Protocols (Doc #RT-SAF-02), Section 1.4: 'Pressurized R-410A Handling & Zero-Energy LOTO Standards'"
            ),
            whenToEscalate = "Escalate to Senior Chiller Specialist if suction pressure remains below 80 PSI after TXV clamp replacement or if electronic sniffer detects non-repairable coil micro-fracture exceeding 15 lbs R-410A loss."
        ),
        "eq_hvac_b" to Diagnosis(
            id = "diag_hvac_b",
            equipmentId = "eq_hvac_b",
            equipmentName = "HVAC Unit B - Carrier AquaSnap 30MP",
            detectedError = "Compressor Discharge High Temperature Excursion",
            errorCode = "ERR-710-HDT",
            likelyCause = "Condenser heat exchanger air intake restriction from dust matting or thermistor sensor thermal drift reading 18°C higher than thermocouple probe.",
            confidence = 91,
            severity = "high",
            safetyWarning = "THERMAL BURN HAZARD: Discharge piping surface temperature exceeds 115°C (240°F). Allow 15 min cool-down period. Use thermal infrared probe to verify safe surface temperature before touching lines.",
            technicalDocumentation = "Carrier AquaSnap 30MP Control & Troubleshooting Manual (OM-30MP-03), Chapter 6: 'Discharge Overheat Interlocks and Sensor Calibration'",
            symptoms = listOf(
                "Discharge temperature peaked at 118°C (limit: 115°C)",
                "Condenser coil airflow restricted by dust matting",
                "Discharge pressure elevated at 410 PSI",
                "Thermal overload cutout tripped on Circuit 1"
            ),
            recommendedAction = "Switch control to Local Stop, blow out condenser fins with compressed nitrogen, test thermistor resistance curve, and test run under partial load.",
            recommendedSteps = listOf(
                "Switch Carrier ComfortLink controller to Local Stop to ramp down compressor speed safely.",
                "Clean aluminum microchannel condenser coil face with soft fin brush and low-pressure dry nitrogen.",
                "Unplug discharge thermistor lead connector and measure resistance (10.0 kΩ at 25°C / 77°F standard).",
                "Restart chiller via Local Start and confirm discharge temperature stabilizes below 92°C under partial load."
            ),
            sourceDocumentation = listOf(
                "Carrier AquaSnap 30MP Control & Troubleshooting Manual (OM-30MP-03), Chapter 6: 'Discharge Overheat Interlocks and Sensor Calibration'",
                "Carrier Heat Exchanger Maintenance Standards (OM-HX-12), Section 3.1: 'Microchannel Coil Cleaning Protocols'"
            ),
            whenToEscalate = "Escalate if compressor discharge temperature continues to spike above 112°C despite clean coils and calibrated sensor, indicating internal scroll bypass valve failure."
        ),
        "eq_cooling_c" to Diagnosis(
            id = "diag_cooling_c",
            equipmentId = "eq_cooling_c",
            equipmentName = "Cooling System C - BAC Series 3000",
            detectedError = "Excessive Fan Drive Vibration & Dynamic Imbalance",
            errorCode = "ERR-205-VIB",
            likelyCause = "Drive belt tension loss and uneven pitch wear causing harmonic resonance exceeding ISO 10816 vibration severity limits (5.8 mm/s vs 4.5 mm/s limit).",
            confidence = 89,
            severity = "medium",
            safetyWarning = "ROTATING MACHINERY HAZARD: Zero-energy isolation required on 25 HP VFD. Mechanically lock fan blades with safety locking bar before entering plenum chamber.",
            technicalDocumentation = "Baltimore Aircoil Maintenance Protocol (BAC-MAN-3000), Section 7: 'Mechanical Drive Assembly, Belt Alignment, and Vibration Limits'",
            symptoms = listOf(
                "Triaxial vibration sensor reporting 5.8 mm/s RMS (threshold: 4.5 mm/s)",
                "Belt squeal noted on VFD acceleration ramps",
                "Mild grease ejection from upper pillow-block bearing",
                "Strobe check indicates belt flutter at 1450 RPM"
            ),
            recommendedAction = "Isolate VFD supply, pin fan blades, measure belt deflection tension, re-grease bearings with Mobilith SHC 100, and run vibration test.",
            recommendedSteps = listOf(
                "Isolate 25 HP VFD supply breaker and apply LOTO padlock; test terminals for 0V.",
                "Insert mechanical fan blade locking bar through inspection port to prevent windmilling rotation.",
                "Measure belt deflection with tension gauge (target: 12 mm under 45 N force) and adjust motor base jack screws.",
                "Clean zerk fittings and pump 4 shots (12g) of Mobilith SHC 100 synthetic grease into each pillow-block bearing.",
                "Remove locking bar, restore power, ramp VFD to 60Hz, and confirm RMS vibration is below 3.2 mm/s."
            ),
            sourceDocumentation = listOf(
                "Baltimore Aircoil Maintenance Protocol (BAC-MAN-3000), Section 7: 'Mechanical Drive Assembly, Belt Alignment, and Vibration Limits'",
                "ISO 10816-3 Mechanical Vibration Standard: 'Industrial Fan Vibration Evaluation Classes'"
            ),
            whenToEscalate = "Escalate to Millwright / Vibration Analyst if triaxial vibration remains above 4.5 mm/s after belt tensioning and re-greasing, indicating fan hub eccentric shaft bend or blade pitch mismatch."
        ),
        "eq_pump_d" to Diagnosis(
            id = "diag_pump_d",
            equipmentId = "eq_pump_d",
            equipmentName = "Pump Unit D - Grundfos Hydro MPC",
            detectedError = "Impeller Cavitation & Low Suction Flow Alert",
            errorCode = "ERR-531-CAV",
            likelyCause = "Suction side Y-strainer screen occluded with scale and sediment buildup, dropping suction pressure to 4.2 PSI, well below Net Positive Suction Head Required (NPSHR).",
            confidence = 96,
            severity = "high",
            safetyWarning = "HIGH PRESSURE & WATER SPRAY HAZARD: System operating at 120 PSI. Isolate suction and discharge ball valves and open manual pressure bleed cock to 0 PSI before loosening bonnet.",
            technicalDocumentation = "Grundfos Hydro MPC Service Instructions (Doc #98432289), Section 9: 'Hydraulic Cavitation Diagnostic Protocol & Filter Maintenance'",
            symptoms = listOf(
                "Popping gravel acoustic signature in pump housing 2",
                "Inlet pressure transducer reads 4.2 PSI (nominal: > 18 PSI)",
                "Discharge pressure fluctuating by ±15 PSI",
                "Pump 2 drawing 18% higher amps with reduced flow"
            ),
            recommendedAction = "Isolate pump electrically and hydraulically, verify zero pressure, extract 316 stainless strainer basket, clean debris, and purge air before restart.",
            recommendedSteps = listOf(
                "Isolate pump electrically via panel switch and hydraulically via 4-inch butterfly valves.",
                "Open manual 1/4\" bleed cock slowly into catch bucket until pressure gauge confirms 0 PSI.",
                "Unbolt Y-strainer bottom cap and extract 316 stainless steel mesh strainer basket.",
                "Flush debris and rust scale with clean water; inspect basket for mesh structural collapse.",
                "Reassemble with lubricated EPDM O-ring, vent air through bleed cock, and restore AUTO mode."
            ),
            sourceDocumentation = listOf(
                "Grundfos Hydro MPC Service Instructions (Doc #98432289), Section 9: 'Hydraulic Cavitation Diagnostic Protocol & Filter Maintenance'",
                "Hydraulic Institute Standard (ANSI/HI 9.6.1): 'NPSH Margin and Cavitation Damage Mitigation'"
            ),
            whenToEscalate = "Escalate if cavitation acoustic noise persists with clean strainer and inlet pressure > 20 PSI, indicating suction check valve flapper detachment or impeller eye erosion."
        ),
        "eq_compressor_e" to Diagnosis(
            id = "diag_compressor_e",
            equipmentId = "eq_compressor_e",
            equipmentName = "Compressor E - Atlas Copco GA-75",
            detectedError = "High Oil Temperature Trip & Separator Delta-P Exceeded",
            errorCode = "ERR-880-OIL",
            likelyCause = "Thermostatic oil bypass valve element stuck in partial bypass mode combined with high differential pressure across the oil separator cartridge (>0.85 bar).",
            confidence = 92,
            severity = "high",
            safetyWarning = "STORED PNEUMATIC ENERGY HAZARD: Air receiver holds 8.5 bar compressed air. Push Emergency Stop, open manual blowdown valve, and confirm tank pressure gauge reads 0.0 bar before loosening any oil plug.",
            technicalDocumentation = "Atlas Copco GA-75 Instruction Book (2920 7100 00), Section 4: 'Lube Circuit Thermostatic Regulators and Air-Oil Separator Element Servicing'",
            symptoms = listOf(
                "Element discharge temperature reached 98.4°C (trip: 100°C)",
                "Oil separator delta-P sensor triggered warning at 0.88 bar",
                "Oil cooler temperature drop across radiator only 4°C",
                "Oil level glass indicator low during unload cycle"
            ),
            recommendedAction = "Depressurize receiver to 0.0 bar, inspect thermostatic valve thermostat cartridge, test separator differential pressure, and top up Roto-Inject fluid.",
            recommendedSteps = listOf(
                "Press Elektronikon E-stop button and open manual blowdown valve until pressure gauge reads 0.0 bar.",
                "Lock out main 75kW supply breaker with LOTO padlock and test terminals with voltage probe.",
                "Unbolt thermostatic bypass valve housing, remove wax capsule, clean passage, and verify 71°C stroke.",
                "Unbolt oil separator cover plate, install new OEM separator cartridge, and verify electrical grounding staple bonding.",
                "Top up Roto-Inject fluid, close blowdown valve, reset service timer, and run on load for 15 min."
            ),
            sourceDocumentation = listOf(
                "Atlas Copco GA-75 Instruction Book (2920 7100 00), Section 4: 'Lube Circuit Thermostatic Regulators and Air-Oil Separator Element Servicing'",
                "Compressed Air and Gas Institute (CAGI) Safety Guideline: 'Pneumatic Pressure Vessel Servicing Protocols'"
            ),
            whenToEscalate = "Escalate immediately if metallic flakes or burnt varnish odor are detected in the oil sample, indicating rotary screw airend bearing galling."
        )
    )

    val demoProcedures = mapOf(
        "eq_hvac_a" to GuidedProcedure(
            id = "proc_hvac_a",
            equipmentId = "eq_hvac_a",
            title = "HVAC Unit A - ERR-402-LP Diagnostic & Resolution Procedure",
            estimatedMinutes = 20,
            requiredTools = listOf("Digital Multimeter", "R-410A Manifold Gauges", "Electronic Refrigerant Leak Detector", "1/4\" Nut Driver", "Lockout/Tagout Kit"),
            steps = listOf(
                ProcedureStep(
                    stepNumber = 1,
                    totalSteps = 5,
                    title = "Isolate Electrical Power (Lockout / Tagout)",
                    description = "Switch off the main 460V 3-phase fused disconnect switch located beside the rooftop unit. Apply your personal padlock and tagout card. Verify zero voltage across L1-L2-L3 with an insulated digital multimeter.",
                    safetyCheck = "Verify multimeter function on known live circuit before and after testing the RTU terminals.",
                    warningNotes = "Do not touch capacitors until discharged with a 500-ohm resistor.",
                    toolRequired = "Digital Multimeter + LOTO Kit"
                ),
                ProcedureStep(
                    stepNumber = 2,
                    totalSteps = 5,
                    title = "Connect Manifold Gauges to Suction & Discharge Ports",
                    description = "Remove brass port caps on the suction (low side) and liquid line (high side) service valves. Attach zero-loss low side blue hose to suction port and high side red hose to liquid port. Record static pressure.",
                    safetyCheck = "Wear eye protection and cryogenic safety gloves to prevent liquid refrigerant flash burns.",
                    warningNotes = "Ensure gauge manifold valves are fully closed before threading hoses onto Schroeder ports.",
                    toolRequired = "R-410A Manifold Gauges"
                ),
                ProcedureStep(
                    stepNumber = 3,
                    totalSteps = 5,
                    title = "Inspect TXV Sensing Bulb Clamp & Insulation",
                    description = "Open the evaporator access door. Inspect the Thermal Expansion Valve (TXV) sensing bulb. Confirm the copper bulb is positioned at 2 o'clock or 10 o'clock on a clean horizontal suction line, tightly clamped, and wrapped with waterproof thermal insulation.",
                    safetyCheck = "Avoid bending capillary tube sharply to prevent kinking or cracking.",
                    warningNotes = "Corrosion between suction pipe and sensing bulb causes inaccurate superheat modulation.",
                    toolRequired = "Flashlight & 5/16\" Wrench"
                ),
                ProcedureStep(
                    stepNumber = 4,
                    totalSteps = 5,
                    title = "Perform Electronic Refrigerant Leak Sniffer Scan",
                    description = "Power on the calibrated electronic sniffer leak detector. Probe suction service valve stem, Schroeder cores, braze joints, and evaporator U-bends at a slow sweep rate of 1 inch/second. Check for beep alert signal.",
                    safetyCheck = "No open flames allowed in RTU testing vicinity.",
                    warningNotes = "A loose Schroeder core on the suction test port is the primary cause for micro-leaks in this chassis.",
                    toolRequired = "Electronic Leak Detector"
                ),
                ProcedureStep(
                    stepNumber = 5,
                    totalSteps = 5,
                    title = "Tighten Valve Stem, Re-energize & Verify Subcooling",
                    description = "Snug the Schroeder core with a valve core tool and torque service port cap with copper washer. Remove LOTO padlock, restore 460V power, call for cooling, and measure target subcooling (10°F ± 2°F) on the digital gauge manifold.",
                    safetyCheck = "Keep clear of condensing fan blades when unit re-energizes.",
                    warningNotes = "Allow compressor to run 10 minutes continuously before taking final temperature stabilization readings.",
                    toolRequired = "Valve Core Tool & Digital Thermocouple"
                )
            )
        ),
        "eq_hvac_b" to GuidedProcedure(
            id = "proc_hvac_b",
            equipmentId = "eq_hvac_b",
            title = "Carrier Chiller B - ERR-710 Overheat Remediation",
            estimatedMinutes = 15,
            requiredTools = listOf("Soft Fin Comb", "Compressed Nitrogen Nozzle", "IR Thermometer", "Insulated Gloves"),
            steps = listOf(
                ProcedureStep(
                    stepNumber = 1,
                    totalSteps = 4,
                    title = "Switch Chiller Controller to Local Stop",
                    description = "On the Carrier ComfortLink keypad, press the Local Stop button to safely ramp down compressor speed. Wait for pump-down cycle to complete before opening maintenance panel.",
                    safetyCheck = "Do not perform emergency disconnect while compressor is running at 100% capacity unless in immediate danger.",
                    warningNotes = "Allow 10 minutes for oil return sequence.",
                    toolRequired = "Keypad Controller"
                ),
                ProcedureStep(
                    stepNumber = 2,
                    totalSteps = 4,
                    title = "Clean Condenser Coil Face & Straighten Bent Fins",
                    description = "Using a soft fin brush and fin comb, remove debris and lint matting from the aluminum microchannel condenser coil face. Use low pressure dry air or nitrogen blown from inside out.",
                    safetyCheck = "Wear safety goggles and dust mask when dislodging particulate matter.",
                    warningNotes = "Do not use high-pressure water blasting directly against fragile microchannel tubes.",
                    toolRequired = "Fin Comb & Nitrogen Air Blow Nozzle"
                ),
                ProcedureStep(
                    stepNumber = 3,
                    totalSteps = 4,
                    title = "Verify Discharge Thermistor Resistance",
                    description = "Unplug discharge thermistor lead connector and measure resistance across pins. Cross-reference ohms with Carrier temperature-resistance lookup chart to ensure no thermal drift.",
                    safetyCheck = "Ensure circuit board power is isolated before taking resistance measurements.",
                    warningNotes = "Nominal resistance at 25°C (77°F) is 10.0 kΩ.",
                    toolRequired = "Digital Multimeter"
                ),
                ProcedureStep(
                    stepNumber = 4,
                    totalSteps = 4,
                    title = "Restart Chiller & Verify Discharge Temp < 95°C",
                    description = "Press Local Start on ComfortLink controller. Monitor discharge temperature as compressor stages up. Confirm discharge temperature stabilizes below 92°C with good condenser delta-T.",
                    safetyCheck = "Keep hands away from fan cowl guards during automatic speed ramp.",
                    warningNotes = "Log temperature trend in service report.",
                    toolRequired = "IR Thermometer"
                )
            )
        ),
        "eq_cooling_c" to GuidedProcedure(
            id = "proc_cooling_c",
            equipmentId = "eq_cooling_c",
            title = "Cooling System C - Vibration & Belt Alignment Procedure",
            estimatedMinutes = 25,
            requiredTools = listOf("Vibration Meter", "Belt Tension Gauge", "Grease Gun with Mobilith SHC 100", "Mechanical Blade Locking Bar", "LOTO Kit"),
            steps = listOf(
                ProcedureStep(
                    stepNumber = 1,
                    totalSteps = 5,
                    title = "VFD Power Isolation & LOTO",
                    description = "Isolate the 25 HP VFD circuit breaker in the motor control center. Lock and tag the breaker. Verify zero voltage on the VFD output terminals.",
                    safetyCheck = "VFD internal DC bus capacitors retain charge for up to 5 minutes after disconnection.",
                    warningNotes = "Always test with calibrated voltage detector before entering fan plenum.",
                    toolRequired = "LOTO Kit & Voltage Detector"
                ),
                ProcedureStep(
                    stepNumber = 2,
                    totalSteps = 5,
                    title = "Insert Mechanical Fan Blade Locking Bar",
                    description = "Insert the aluminum locking bar through the fan hub inspection port to physically prevent the fan from windmill rotation caused by natural wind drafts.",
                    safetyCheck = "Windmilling fan blades can cause severe crush injury even with power disconnected.",
                    warningNotes = "Ensure locking bar has bright orange warning streamer attached.",
                    toolRequired = "Locking Bar"
                ),
                ProcedureStep(
                    stepNumber = 3,
                    totalSteps = 5,
                    title = "Check Belt Deflection & Adjust Motor Base Tension",
                    description = "Use the belt tension gauge at the center of the belt span. Target deflection is 12 mm under 45 N force. Turn the motor base adjusting screw to tighten loose belt.",
                    safetyCheck = "Avoid pinching fingers between pulley sheaves and V-belt.",
                    warningNotes = "Over-tightening belts leads to premature motor bearing failure.",
                    toolRequired = "Belt Tension Gauge & Ratchet"
                ),
                ProcedureStep(
                    stepNumber = 4,
                    totalSteps = 5,
                    title = "Lubricate Fan Shaft Pillow-Block Bearings",
                    description = "Clean grease zerk fittings. Pump 4 shots (approx 12g) of synthetic Mobilith SHC 100 grease into each fan shaft bearing housing.",
                    safetyCheck = "Wipe off purged grease to avoid water contamination.",
                    warningNotes = "Do not mix petroleum and synthetic lithium complex greases.",
                    toolRequired = "Grease Gun"
                ),
                ProcedureStep(
                    stepNumber = 5,
                    totalSteps = 5,
                    title = "Remove Blade Lock, Power On & Measure Vibration",
                    description = "Remove mechanical blade locking bar. Restore breaker power. Ramp VFD to 100% (60Hz) and measure triaxial vibration with the magnetic sensor probe.",
                    safetyCheck = "Stand outside plenum door before starting fan motor.",
                    warningNotes = "Verify RMS vibration is below 3.2 mm/s across full speed range.",
                    toolRequired = "Digital Vibration Meter"
                )
            )
        ),
        "eq_pump_d" to GuidedProcedure(
            id = "proc_pump_d",
            equipmentId = "eq_pump_d",
            title = "Pump Unit D - Cavitation & Y-Strainer Cleaning Procedure",
            estimatedMinutes = 15,
            requiredTools = listOf("Adjustable Flange Wrench", "Strainer Mesh Cleaner Brush", "Catch Bucket", "Replacement EPDM Gasket", "Safety Face Shield"),
            steps = listOf(
                ProcedureStep(
                    stepNumber = 1,
                    totalSteps = 4,
                    title = "Isolate Pump Station Electrically & Hydraulically",
                    description = "Turn Pump 2 rotary selector switch to OFF on control panel. Close the 4-inch suction butterfly isolating valve and discharge check valve completely.",
                    safetyCheck = "Ensure pumps 1 and 3 are managing baseline building pressure safely.",
                    warningNotes = "Tag suction valve handle as CLOSED - DO NOT OPERATE.",
                    toolRequired = "Valve Lever Handle"
                ),
                ProcedureStep(
                    stepNumber = 2,
                    totalSteps = 4,
                    title = "Depressurize Strainer Housing via Bleed Cock",
                    description = "Place catch bucket under drain port. Open manual 1/4\" bleed cock slowly until water flow stops and pressure gauge confirms 0 PSI.",
                    safetyCheck = "Wear face shield and waterproof apron to protect against pressurized fluid spray.",
                    warningNotes = "Do not loosen bonnet bolts if bleed valve continues to discharge continuous stream.",
                    toolRequired = "Catch Bucket & Face Shield"
                ),
                ProcedureStep(
                    stepNumber = 3,
                    totalSteps = 4,
                    title = "Extract & Clean 316SS Strainer Basket",
                    description = "Unscrew the Y-strainer bottom cap. Extract the stainless steel mesh basket. Remove rust scale, pipe sealant debris, and flush mesh under clean water.",
                    safetyCheck = "Inspect mesh basket for tears or collapsed cylinder ribs.",
                    warningNotes = "Replace bonnet gasket with new lubricated EPDM O-ring.",
                    toolRequired = "Flange Wrench & Nylon Brush"
                ),
                ProcedureStep(
                    stepNumber = 4,
                    totalSteps = 4,
                    title = "Reassemble, Vent Air Pocket & Test Flow",
                    description = "Reinstall strainer basket and torque bonnet cap. Crack open suction valve slowly to vent trapped air out of bleed cock until steady water emerges. Close bleed cock, open suction and discharge valves fully, and set pump to AUTO.",
                    safetyCheck = "Inspect bonnet joint for water weeping at 120 PSI.",
                    warningNotes = "Acoustic gravel noise must cease immediately upon restart.",
                    toolRequired = "Torque Wrench"
                )
            )
        ),
        "eq_compressor_e" to GuidedProcedure(
            id = "proc_compressor_e",
            equipmentId = "eq_compressor_e",
            title = "Atlas Copco GA-75 - Oil Thermal Circuit & Separator Service",
            estimatedMinutes = 25,
            requiredTools = listOf("Blowdown Valve Key", "Hex Bit Socket Set", "Oil Filter Strap Wrench", "Roto-Inject Fluid (5L)", "Safety Goggles"),
            steps = listOf(
                ProcedureStep(
                    stepNumber = 1,
                    totalSteps = 5,
                    title = "Depressurize Air Receiver Tank & Lube Reservoir",
                    description = "Press the red Emergency Stop mushroom button on the Elektronikon controller. Open the manual air receiver blowdown valve. Wait until pressure gauge reads exactly 0.0 bar.",
                    safetyCheck = "Verify zero stored pressure before touching any pressurized oil circuit fittings.",
                    warningNotes = "Hot oil under pressure can cause severe thermal and injection injuries.",
                    toolRequired = "Blowdown Key & Pressure Gauge"
                ),
                ProcedureStep(
                    stepNumber = 2,
                    totalSteps = 5,
                    title = "Lock Out Main 75kW Breaker",
                    description = "Turn off breaker at compressor sub-panel. Attach padlock and tag to prevent automated startup from remote plant supervisory controller.",
                    safetyCheck = "Test circuit terminals with non-contact voltage probe.",
                    warningNotes = "Elektronikon controller memory holds diagnostics without mains power.",
                    toolRequired = "LOTO Padlock & Voltage Probe"
                ),
                ProcedureStep(
                    stepNumber = 3,
                    totalSteps = 5,
                    title = "Inspect & Clean Thermostatic Bypass Valve Spool",
                    description = "Unbolt the thermostatic valve housing on the oil filter manifold. Extract the wax thermostat capsule. Clean spool passage and check spring tension.",
                    safetyCheck = "Inspect housing O-rings for thermal hardening or cracks.",
                    warningNotes = "Test capsule opening in hot water bath (should stroke open at 71°C).",
                    toolRequired = "Hex Socket Set"
                ),
                ProcedureStep(
                    stepNumber = 4,
                    totalSteps = 5,
                    title = "Replace Oil Separator Cartridge & Top Up Lube",
                    description = "Unbolt oil separator cover plate. Remove old separator element and install new OEM cartridge. Top up Roto-Inject fluid until level reaches center of sight glass.",
                    safetyCheck = "Ensure grounding staple on separator flange makes metal-to-metal contact to prevent static discharge.",
                    warningNotes = "Static electricity inside separator can ignite oil aerosol without proper bonding.",
                    toolRequired = "Separator Cartridge & Roto-Inject Oil"
                ),
                ProcedureStep(
                    stepNumber = 5,
                    totalSteps = 5,
                    title = "Reset Elektronikon Service Timer & Run Thermal Test",
                    description = "Close blowdown valve. Restore breaker power and twist-release E-stop button. Reset oil service counter on Elektronikon. Run compressor on load for 15 min and verify oil temp stabilizes at 82°C.",
                    safetyCheck = "Inspect all oil line fittings for seepage during 8.5 bar full load run.",
                    warningNotes = "Confirm separator delta-P remains below 0.25 bar.",
                    toolRequired = "Elektronikon Panel & IR Temp Probe"
                )
            )
        )
    )

    val demoJobs = listOf(
        JobOrder(
            id = "JOB-1049",
            title = "HVAC-A Low Suction Pressure Alarm",
            equipmentId = "eq_hvac_a",
            equipmentName = "HVAC Unit A (Trane Voyager II)",
            location = "Building 4, Rooftop Sector North",
            priority = "Critical",
            status = "Pending",
            assignedDate = "Today, 08:30 AM",
            description = "BMS triggered Low Refrigerant Pressure code ERR-402-LP. Cooling output degraded across 3rd floor executive offices."
        ),
        JobOrder(
            id = "JOB-1050",
            title = "Carrier Chiller B Discharge Overheat Alert",
            equipmentId = "eq_hvac_b",
            equipmentName = "HVAC Unit B (Carrier AquaSnap 30MP)",
            location = "Plant Room B2, Mechanical Bay 1",
            priority = "High",
            status = "Pending",
            assignedDate = "Today, 10:15 AM",
            description = "Compressor discharge temperature exceeded 115°C threshold. Unit cycling on high thermal limit interlock."
        ),
        JobOrder(
            id = "JOB-1051",
            title = "Cooling Tower C Fan Vibration Inspection",
            equipmentId = "eq_cooling_c",
            equipmentName = "Cooling System C (BAC Series 3000)",
            location = "Central Utility Plant Exterior Deck",
            priority = "Medium",
            status = "In Progress",
            assignedDate = "Today, 11:45 AM",
            description = "Vibration sensor detected 5.8 mm/s RMS vibration harmonic. Belt squeal noted during morning load ramp."
        ),
        JobOrder(
            id = "JOB-1052",
            title = "Hydro MPC Booster Pump Cavitation Noise",
            equipmentId = "eq_pump_d",
            equipmentName = "Pump Unit D (Grundfos Hydro MPC)",
            location = "Basement Water Distribution Vault",
            priority = "High",
            status = "Pending",
            assignedDate = "Yesterday, 04:20 PM",
            description = "Suction flow deficit causing gravel acoustic signature. Low pressure on high-rise domestic water risers."
        ),
        JobOrder(
            id = "JOB-1053",
            title = "GA-75 Air Compressor High Oil Temp Trip",
            equipmentId = "eq_compressor_e",
            equipmentName = "Compressor E (Atlas Copco GA-75)",
            location = "Air Generation Bay - Workshop 3",
            priority = "Medium",
            status = "Completed",
            assignedDate = "Yesterday, 02:00 PM",
            description = "Oil separator differential pressure warning and thermal bypass valve inspection completed."
        )
    )

    fun getEquipmentById(id: String): Equipment? {
        return demoEquipments.find { it.id == id } ?: demoEquipments.firstOrNull()
    }

    fun getDiagnosisForEquipment(equipmentId: String): Diagnosis {
        return demoDiagnoses[equipmentId] ?: demoDiagnoses["eq_hvac_a"]!!
    }

    fun getProcedureForEquipment(equipmentId: String): GuidedProcedure {
        return demoProcedures[equipmentId] ?: demoProcedures["eq_hvac_a"]!!
    }
}
