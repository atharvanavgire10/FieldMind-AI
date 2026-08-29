package com.example.ui.screens.completion

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AssignmentTurnedIn
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.EditNote
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.model.ServiceReport
import com.example.data.repository.FieldRepository
import com.example.data.repository.SettingsRepository
import com.example.ui.components.FieldMindTopBar
import com.example.ui.components.LargePrimaryFieldButton
import com.example.ui.theme.CleanBgLight
import com.example.ui.theme.CleanBorder
import com.example.ui.theme.CleanBrandContainer
import com.example.ui.theme.CleanBrandPrimary
import com.example.ui.theme.CleanSurfaceAlt
import com.example.ui.theme.CleanSurfaceLight
import com.example.ui.theme.CleanTextMuted
import com.example.ui.theme.CleanTextPrimary
import com.example.ui.theme.CleanTextSecondary
import com.example.ui.theme.PastelBlueBg
import com.example.ui.theme.PastelBlueIcon
import com.example.ui.theme.PastelGreenBg
import com.example.ui.theme.PastelGreenIcon
import com.example.ui.theme.SafetyGreen
import kotlinx.coroutines.launch

@Composable
fun JobCompletionScreen(
    fieldRepository: FieldRepository,
    settingsRepository: SettingsRepository,
    onNavigateBack: () -> Unit,
    onReportGenerated: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()
    val isOfflineMode by settingsRepository.isOfflineDemoMode.collectAsStateWithLifecycle()
    val technicianName by settingsRepository.technicianName.collectAsStateWithLifecycle()
    val equipment by fieldRepository.selectedEquipment.collectAsStateWithLifecycle()
    val diagnosis = fieldRepository.getDiagnosis(equipment.id)
    val procedure = fieldRepository.getProcedure(equipment.id)

    var resolutionStatus by remember { mutableStateOf("RESOLVED - Fully Operational Within OEM Specs") }
    var technicianNotes by remember {
        mutableStateOf("Replaced damaged valve core and tightened suction service cap. Target subcooling measured at 10.5°F. No vibration or leakage noted.")
    }
    var finalMeasurements by remember {
        mutableStateOf("Suction: 118 PSI | Head: 375 PSI | Subcooling: 10.5°F | Superheat: 12°F")
    }
    var safetySignOff by remember { mutableStateOf(true) }

    Scaffold(
        topBar = {
            FieldMindTopBar(
                title = "Job Completion",
                subtitle = equipment.name,
                onBackClick = onNavigateBack,
                isOfflineMode = isOfflineMode
            )
        },
        containerColor = CleanBgLight
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(20.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Equipment Resolution Summary Header
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .border(1.dp, CleanBorder, RoundedCornerShape(20.dp)),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CleanSurfaceLight),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Row(
                    modifier = Modifier.padding(18.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(CircleShape)
                            .background(PastelGreenBg),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = null,
                            tint = PastelGreenIcon,
                            modifier = Modifier.size(26.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(14.dp))
                    Column {
                        Text(
                            text = "MARK ISSUE AS RESOLVED",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = PastelGreenIcon,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.6.sp,
                                fontSize = 11.sp
                            )
                        )
                        Text(
                            text = "${equipment.name} (${diagnosis.errorCode})",
                            style = MaterialTheme.typography.titleMedium.copy(
                                color = CleanTextPrimary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                        )
                        Text(
                            text = "All ${procedure.steps.size} guided checkpoints completed",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = CleanTextSecondary,
                                fontSize = 12.sp
                            )
                        )
                    }
                }
            }

            // Resolution Status Picker
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .border(1.dp, CleanBorder, RoundedCornerShape(20.dp)),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CleanSurfaceLight),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = "RESOLUTION STATUS",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = CleanBrandPrimary,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.6.sp,
                            fontSize = 11.sp
                        )
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    listOf(
                        "RESOLVED - Fully Operational Within OEM Specs",
                        "RESOLVED - Temporary Bypass (Follow-up Scheduled)",
                        "MONITORING - Under Observation"
                    ).forEach { status ->
                        val isSelected = resolutionStatus == status
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(if (isSelected) CleanBrandContainer else CleanSurfaceAlt)
                                .border(
                                    1.dp,
                                    if (isSelected) CleanBrandPrimary else CleanBorder,
                                    RoundedCornerShape(12.dp)
                                )
                                .clickable { resolutionStatus = status }
                                .padding(horizontal = 14.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(16.dp)
                                    .clip(CircleShape)
                                    .background(if (isSelected) CleanBrandPrimary else CleanBorder)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(
                                text = status,
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    color = if (isSelected) CleanBrandPrimary else CleanTextPrimary,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    fontSize = 13.sp
                                )
                            )
                        }
                    }
                }
            }

            // Final Operating Telemetry Measurements
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .border(1.dp, CleanBorder, RoundedCornerShape(20.dp)),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CleanSurfaceLight),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .clip(CircleShape)
                                .background(PastelBlueBg),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Speed,
                                contentDescription = null,
                                tint = PastelBlueIcon,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "FINAL OPERATING MEASUREMENTS",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = CleanBrandPrimary,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.6.sp,
                                fontSize = 11.sp
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = finalMeasurements,
                        onValueChange = { finalMeasurements = it },
                        modifier = Modifier.fillMaxWidth().testTag("measurements_input"),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CleanBrandPrimary,
                            unfocusedBorderColor = CleanBorder,
                            focusedTextColor = CleanTextPrimary,
                            unfocusedTextColor = CleanTextPrimary,
                            focusedContainerColor = CleanSurfaceAlt,
                            unfocusedContainerColor = CleanSurfaceAlt
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )
                }
            }

            // Technician Notes
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .border(1.dp, CleanBorder, RoundedCornerShape(20.dp)),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CleanSurfaceLight),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .clip(CircleShape)
                                .background(PastelGreenBg),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.EditNote,
                                contentDescription = null,
                                tint = PastelGreenIcon,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "TECHNICIAN SERVICE NOTES",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = CleanBrandPrimary,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.6.sp,
                                fontSize = 11.sp
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = technicianNotes,
                        onValueChange = { technicianNotes = it },
                        modifier = Modifier.fillMaxWidth().testTag("technician_notes_input"),
                        minLines = 3,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CleanBrandPrimary,
                            unfocusedBorderColor = CleanBorder,
                            focusedTextColor = CleanTextPrimary,
                            unfocusedTextColor = CleanTextPrimary,
                            focusedContainerColor = CleanSurfaceAlt,
                            unfocusedContainerColor = CleanSurfaceAlt
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )
                }
            }

            // Safety Sign-off Checkbox
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .border(1.dp, CleanBorder, RoundedCornerShape(20.dp)),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CleanSurfaceLight),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Row(
                    modifier = Modifier
                        .padding(16.dp)
                        .clickable { safetySignOff = !safetySignOff },
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = safetySignOff,
                        onCheckedChange = { safetySignOff = it },
                        colors = CheckboxDefaults.colors(
                            checkedColor = CleanBrandPrimary,
                            uncheckedColor = CleanBorder,
                            checkmarkColor = Color.White
                        ),
                        modifier = Modifier.testTag("safety_signoff_checkbox")
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = "Safety LOTO Released & Verified",
                            style = MaterialTheme.typography.titleSmall.copy(
                                color = CleanTextPrimary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                        )
                        Text(
                            text = "I confirm zero-energy verification was observed and barrier panels are reattached.",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = CleanTextSecondary,
                                fontSize = 12.sp
                            )
                        )
                    }
                }
            }

            // Generate Service Report Action Button
            LargePrimaryFieldButton(
                text = "Generate & Save Service Report",
                icon = Icons.Default.AssignmentTurnedIn,
                onClick = {
                    coroutineScope.launch {
                        val report = ServiceReport(
                            equipmentName = equipment.name,
                            modelNumber = equipment.model,
                            detectedIssue = "${diagnosis.errorCode} - ${diagnosis.detectedError}",
                            diagnosisSummary = diagnosis.likelyCause,
                            stepsCompletedText = "Completed all ${procedure.steps.size} guided checkpoints: ${procedure.steps.joinToString(", ") { "Step ${it.stepNumber} (${it.title})" }}",
                            resolutionStatus = resolutionStatus,
                            technicianNotes = technicianNotes,
                            safetyNotes = "Safety sign-off verified by $technicianName. LOTO removed after inspection.",
                            technicianName = technicianName,
                            timestamp = System.currentTimeMillis(),
                            measurements = finalMeasurements
                        )
                        fieldRepository.saveReport(report)
                        onReportGenerated()
                    }
                },
                containerColor = CleanBrandPrimary,
                testTag = "generate_service_report_button"
            )

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}
