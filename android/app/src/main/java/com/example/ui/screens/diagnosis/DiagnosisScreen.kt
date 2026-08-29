package com.example.ui.screens.diagnosis

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
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.automirrored.filled.MenuBook
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.filled.WarningAmber
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.repository.FieldRepository
import com.example.data.repository.SettingsRepository
import com.example.ui.components.ConfidenceMeter
import com.example.ui.components.FieldMindTopBar
import com.example.ui.components.LargePrimaryFieldButton
import com.example.ui.components.LargeSecondaryFieldButton
import com.example.ui.components.SafetyWarningCard
import com.example.ui.theme.CleanBgLight
import com.example.ui.theme.CleanBorder
import com.example.ui.theme.CleanBrandPrimary
import com.example.ui.theme.CleanSurfaceAlt
import com.example.ui.theme.CleanSurfaceLight
import com.example.ui.theme.CleanTextMuted
import com.example.ui.theme.CleanTextPrimary
import com.example.ui.theme.CleanTextSecondary
import com.example.ui.theme.PastelBlueBg
import com.example.ui.theme.PastelBlueIcon
import com.example.ui.theme.PastelRedBg
import com.example.ui.theme.PastelRedIcon

@Composable
fun DiagnosisScreen(
    fieldRepository: FieldRepository,
    settingsRepository: SettingsRepository,
    onNavigateBack: () -> Unit,
    onStartProcedure: () -> Unit,
    onNavigateToChat: () -> Unit,
    onNavigateToVoice: () -> Unit
) {
    val isOfflineMode by settingsRepository.isOfflineDemoMode.collectAsStateWithLifecycle()
    val equipment by fieldRepository.selectedEquipment.collectAsStateWithLifecycle()
    val diagnosis = fieldRepository.getDiagnosis(equipment.id)

    Scaffold(
        topBar = {
            FieldMindTopBar(
                title = "AI Diagnosis",
                subtitle = equipment.name,
                onBackClick = onNavigateBack,
                onVoiceClick = onNavigateToVoice,
                onChatClick = onNavigateToChat,
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
                // Equipment Header Card
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
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = equipment.name,
                                    style = MaterialTheme.typography.titleLarge.copy(
                                        color = CleanTextPrimary,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 18.sp
                                    )
                                )
                                Text(
                                    text = equipment.model,
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        color = CleanBrandPrimary,
                                        fontWeight = FontWeight.Medium
                                    )
                                )
                            }
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                // Severity Badge
                                val (sevBg, sevColor, sevText) = when (diagnosis.severity.lowercase()) {
                                    "high" -> Triple(PastelRedBg, PastelRedIcon, "HIGH")
                                    "low" -> Triple(Color(0xFFDCFCE7), Color(0xFF15803D), "LOW")
                                    else -> Triple(Color(0xFFFEF3C7), Color(0xFFB45309), "MED")
                                }
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(sevBg)
                                        .padding(horizontal = 8.dp, vertical = 4.dp)
                                ) {
                                    Text(
                                        text = sevText,
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            color = sevColor,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 10.sp
                                        )
                                    )
                                }
                                ConfidenceMeter(confidence = diagnosis.confidence)
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "S/N: ${equipment.serialNumber}",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = CleanTextSecondary,
                                    fontSize = 12.sp
                                )
                            )
                            Text(
                                text = equipment.location,
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = CleanTextSecondary,
                                    fontSize = 12.sp
                                )
                            )
                        }
                    }
                }
            }

            // Detected Error Alert Card
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .border(1.dp, Color(0xFFFECACA), RoundedCornerShape(20.dp)),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = PastelRedBg.copy(alpha = 0.5f)),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(PastelRedBg),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Error,
                                    contentDescription = null,
                                    tint = PastelRedIcon,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "DETECTED ERROR CODE",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = PastelRedIcon,
                                        fontWeight = FontWeight.Bold,
                                        letterSpacing = 0.8.sp,
                                        fontSize = 11.sp
                                    )
                                )
                                Text(
                                    text = diagnosis.errorCode,
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        color = CleanTextPrimary,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 16.sp
                                    )
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = diagnosis.detectedError,
                            style = MaterialTheme.typography.bodyLarge.copy(
                                color = CleanTextPrimary,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 14.sp
                            )
                        )
                    }
                }
            }

            // Likely Cause Card
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
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(PastelBlueBg),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Psychology,
                                    contentDescription = null,
                                    tint = PastelBlueIcon,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "LIKELY ROOT CAUSE (NEURAL DIAGNOSIS)",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = CleanBrandPrimary,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.6.sp,
                                    fontSize = 11.sp
                                )
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = diagnosis.likelyCause,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                color = CleanTextPrimary,
                                lineHeight = 22.sp,
                                fontSize = 14.sp
                            )
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = "Telemetry Symptoms Observed:",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = CleanTextSecondary,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 12.sp
                            )
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        diagnosis.symptoms.forEach { symptom ->
                            Row(
                                modifier = Modifier.padding(vertical = 3.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .clip(CircleShape)
                                        .background(CleanBrandPrimary)
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(
                                    text = symptom,
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        color = CleanTextPrimary,
                                        fontSize = 13.sp
                                    )
                                )
                            }
                        }
                    }
                }
            }

            // Safety Warning
            item {
                SafetyWarningCard(warningText = diagnosis.safetyWarning)
            }

            // Recommended Diagnostic Steps (from Structured Reasoning Pipeline)
            if (diagnosis.recommendedSteps.isNotEmpty()) {
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
                        Column(modifier = Modifier.padding(18.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(32.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(Color(0xFFDCFCE7)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Build,
                                        contentDescription = null,
                                        tint = Color(0xFF15803D),
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(
                                    text = "RECOMMENDED RESOLUTION STEPS",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = Color(0xFF15803D),
                                        fontWeight = FontWeight.Bold,
                                        letterSpacing = 0.6.sp,
                                        fontSize = 11.sp
                                    )
                                )
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            diagnosis.recommendedSteps.forEachIndexed { index, stepText ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 6.dp),
                                    verticalAlignment = Alignment.Top
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(24.dp)
                                            .clip(CircleShape)
                                            .background(CleanBrandPrimary),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "${index + 1}",
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                color = Color.White,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 11.sp
                                            )
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Text(
                                        text = stepText,
                                        style = MaterialTheme.typography.bodyMedium.copy(
                                            color = CleanTextPrimary,
                                            lineHeight = 20.sp,
                                            fontSize = 13.sp
                                        ),
                                        modifier = Modifier.weight(1f)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Source Documentation & Citations
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .border(1.dp, CleanBorder, RoundedCornerShape(20.dp)),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = CleanSurfaceAlt),
                    elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.MenuBook,
                                contentDescription = null,
                                tint = CleanBrandPrimary,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "SOURCE DOCUMENTATION & CITATIONS",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = CleanBrandPrimary,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.6.sp,
                                    fontSize = 11.sp
                                )
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        val citations = if (diagnosis.sourceDocumentation.isNotEmpty()) {
                            diagnosis.sourceDocumentation
                        } else {
                            listOf(diagnosis.technicalDocumentation)
                        }

                        citations.forEach { citation ->
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp),
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(containerColor = CleanSurfaceLight),
                                border = androidx.compose.foundation.BorderStroke(1.dp, CleanBorder)
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    verticalAlignment = Alignment.Top
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Description,
                                        contentDescription = null,
                                        tint = CleanTextSecondary,
                                        modifier = Modifier.size(16.dp).padding(top = 2.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = citation,
                                        style = MaterialTheme.typography.bodySmall.copy(
                                            color = CleanTextPrimary,
                                            lineHeight = 18.sp,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Medium
                                        )
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Escalation Criteria
            if (diagnosis.whenToEscalate.isNotBlank()) {
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(20.dp))
                            .border(1.dp, Color(0xFFFED7AA), RoundedCornerShape(20.dp)),
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF7ED)),
                        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
                    ) {
                        Column(modifier = Modifier.padding(18.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.WarningAmber,
                                    contentDescription = null,
                                    tint = Color(0xFFC2410C),
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "WHEN TO ESCALATE TO SENIOR SPECIALIST",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = Color(0xFFC2410C),
                                        fontWeight = FontWeight.Bold,
                                        letterSpacing = 0.6.sp,
                                        fontSize = 11.sp
                                    )
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = diagnosis.whenToEscalate,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = CleanTextPrimary,
                                    lineHeight = 20.sp,
                                    fontSize = 13.sp
                                )
                            )
                        }
                    }
                }
            }

            // Action Buttons
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp, bottom = 24.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    LargePrimaryFieldButton(
                        text = "Start Guided Procedure",
                        icon = Icons.AutoMirrored.Filled.ArrowForward,
                        onClick = onStartProcedure,
                        containerColor = CleanBrandPrimary,
                        testTag = "start_guided_procedure_button"
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        LargeSecondaryFieldButton(
                            text = "Ask AI Chat",
                            icon = Icons.Default.Psychology,
                            onClick = onNavigateToChat,
                            modifier = Modifier.weight(1f),
                            testTag = "diagnosis_ask_ai_button"
                        )

                        LargeSecondaryFieldButton(
                            text = "Voice Assistant",
                            icon = Icons.Default.Mic,
                            onClick = onNavigateToVoice,
                            modifier = Modifier.weight(1f),
                            testTag = "diagnosis_voice_button"
                        )
                    }
                }
            }
        }
    }
}
