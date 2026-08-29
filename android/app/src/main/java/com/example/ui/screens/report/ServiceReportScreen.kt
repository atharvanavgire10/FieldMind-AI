package com.example.ui.screens.report

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AssignmentTurnedIn
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
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
import com.example.ui.components.LargeSecondaryFieldButton
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
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun ServiceReportScreen(
    fieldRepository: FieldRepository,
    settingsRepository: SettingsRepository,
    onNavigateHome: () -> Unit,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val isOfflineMode by settingsRepository.isOfflineDemoMode.collectAsStateWithLifecycle()
    val allReports by fieldRepository.allReports.collectAsStateWithLifecycle(initialValue = emptyList())
    val report = allReports.firstOrNull()

    val formattedDate = if (report != null) {
        SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(Date(report.timestamp))
    } else {
        SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(Date())
    }

    val formattedReportText = """
    ========================================================
                   FIELDMIND AI SERVICE REPORT
    ========================================================
    Report Date/Time: $formattedDate
    Technician: ${report?.technicianName ?: "Lead Field Tech"}
    
    [EQUIPMENT DETAILS]
    Name: ${report?.equipmentName ?: "HVAC Unit A"}
    Model/Serial: ${report?.modelNumber ?: "Trane Voyager II"}
    
    [DETECTED ISSUE]
    ${report?.detectedIssue ?: "ERR-402-LP - Low Refrigerant Pressure"}
    
    [DIAGNOSIS & ROOT CAUSE]
    ${report?.diagnosisSummary ?: "TXV bulb loss of contact and valve core micro-leak."}
    
    [STEPS COMPLETED]
    ${report?.stepsCompletedText ?: "All 5 guided checkpoints executed."}
    
    [TELEMETRY & MEASUREMENTS]
    ${report?.measurements ?: "Nominal operating pressures restored."}
    
    [RESOLUTION STATUS]
    ${report?.resolutionStatus ?: "RESOLVED - Operating within OEM spec"}
    
    [TECHNICIAN NOTES]
    ${report?.technicianNotes ?: "Service completed in compliance with maintenance protocols."}
    
    [SAFETY CONFIRMATION]
    ${report?.safetyNotes ?: "LOTO verified and released."}
    ========================================================
    Generated by FieldMind AI Mobile Platform
    """.trimIndent()

    fun shareReport() {
        val sendIntent = Intent().apply {
            action = Intent.ACTION_SEND
            putExtra(Intent.EXTRA_TEXT, formattedReportText)
            putExtra(Intent.EXTRA_SUBJECT, "FieldMind AI Service Report - ${report?.equipmentName}")
            type = "text/plain"
        }
        val shareIntent = Intent.createChooser(sendIntent, "Share FieldMind Service Report")
        context.startActivity(shareIntent)
    }

    fun copyReportToClipboard() {
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("FieldMind Service Report", formattedReportText)
        clipboard.setPrimaryClip(clip)
        Toast.makeText(context, "Report copied to clipboard", Toast.LENGTH_SHORT).show()
    }

    Scaffold(
        topBar = {
            FieldMindTopBar(
                title = "Field Service Report",
                subtitle = "Audit Verified",
                onBackClick = onNavigateBack,
                isOfflineMode = isOfflineMode
            )
        },
        containerColor = CleanBgLight
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(4.dp))
                // Top Success Header
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
                                imageVector = Icons.Default.AssignmentTurnedIn,
                                contentDescription = null,
                                tint = PastelGreenIcon,
                                modifier = Modifier.size(26.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(14.dp))
                        Column {
                            Text(
                                text = "DIGITAL SERVICE REPORT GENERATED",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = PastelGreenIcon,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.6.sp,
                                    fontSize = 11.sp
                                )
                            )
                            Text(
                                text = "Ref ID: #FMR-${(report?.id ?: 1) + 1040}",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    color = CleanTextPrimary,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp
                                )
                            )
                            Text(
                                text = formattedDate,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = CleanTextSecondary,
                                    fontSize = 12.sp
                                )
                            )
                        }
                    }
                }
            }

            // High Contrast Report Document Preview Card
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .border(1.dp, CleanBorder, RoundedCornerShape(20.dp)),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = CleanSurfaceLight),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "SERVICE SUMMARY",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = CleanBrandPrimary,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.6.sp,
                                    fontSize = 11.sp
                                )
                            )
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(PastelGreenBg)
                                    .padding(horizontal = 8.dp, vertical = 3.dp)
                            ) {
                                Text(
                                    text = "VERIFIED",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = PastelGreenIcon,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 10.sp
                                    )
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))
                        HorizontalDivider(color = CleanBorder, thickness = 1.dp)
                        Spacer(modifier = Modifier.height(12.dp))

                        // Field Pairs
                        ReportFieldPair(label = "Equipment", value = report?.equipmentName ?: "HVAC Unit A")
                        ReportFieldPair(label = "Model / Asset Tag", value = report?.modelNumber ?: "Trane Voyager II")
                        ReportFieldPair(label = "Detected Issue", value = report?.detectedIssue ?: "ERR-402-LP")
                        ReportFieldPair(label = "Diagnosis", value = report?.diagnosisSummary ?: "TXV loss of contact and service port leak.")
                        ReportFieldPair(label = "Steps Completed", value = report?.stepsCompletedText ?: "All 5 checkpoints completed.")
                        ReportFieldPair(label = "Measurements", value = report?.measurements ?: "Suction 118 PSI, Superheat 12°F")
                        ReportFieldPair(label = "Resolution", value = report?.resolutionStatus ?: "RESOLVED", isHighlight = true)
                        ReportFieldPair(label = "Technician Notes", value = report?.technicianNotes ?: "Service executed per protocol.")
                        ReportFieldPair(label = "Safety Confirmation", value = report?.safetyNotes ?: "LOTO verified and released.")
                        ReportFieldPair(label = "Certified By", value = report?.technicianName ?: "Lead Field Tech")
                    }
                }
            }

            // Export & Share Actions
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 4.dp, bottom = 24.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    LargePrimaryFieldButton(
                        text = "Share Service Report",
                        icon = Icons.Default.Share,
                        onClick = { shareReport() },
                        containerColor = CleanBrandPrimary,
                        testTag = "share_service_report_button"
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        LargeSecondaryFieldButton(
                            text = "Copy Text",
                            icon = Icons.Default.ContentCopy,
                            onClick = { copyReportToClipboard() },
                            modifier = Modifier.weight(1f),
                            testTag = "copy_report_button"
                        )

                        LargeSecondaryFieldButton(
                            text = "Done & Home",
                            icon = Icons.Default.Home,
                            onClick = onNavigateHome,
                            modifier = Modifier.weight(1f),
                            testTag = "return_home_button"
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ReportFieldPair(
    label: String,
    value: String,
    isHighlight: Boolean = false
) {
    Column(modifier = Modifier.padding(vertical = 5.dp)) {
        Text(
            text = label.uppercase(),
            style = MaterialTheme.typography.labelSmall.copy(
                color = CleanTextSecondary,
                fontWeight = FontWeight.Bold,
                fontSize = 10.sp,
                letterSpacing = 0.5.sp
            )
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium.copy(
                color = if (isHighlight) SafetyGreen else CleanTextPrimary,
                fontWeight = if (isHighlight) FontWeight.Bold else FontWeight.Normal,
                lineHeight = 20.sp,
                fontSize = 13.sp
            )
        )
    }
}
