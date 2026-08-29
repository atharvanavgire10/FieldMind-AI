package com.example.ui.screens.procedure

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DoneAll
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
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
import com.example.ui.components.FieldMindTopBar
import com.example.ui.components.LargePrimaryFieldButton
import com.example.ui.components.LargeSecondaryFieldButton
import com.example.ui.components.SafetyWarningCard
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
import com.example.ui.theme.SafetyGreen

@Composable
fun ProcedureScreen(
    fieldRepository: FieldRepository,
    settingsRepository: SettingsRepository,
    onNavigateBack: () -> Unit,
    onNavigateToChatWithStep: (Int) -> Unit,
    onProceedToCompletion: () -> Unit
) {
    val isOfflineMode by settingsRepository.isOfflineDemoMode.collectAsStateWithLifecycle()
    val equipment by fieldRepository.selectedEquipment.collectAsStateWithLifecycle()
    val procedure = fieldRepository.getProcedure(equipment.id)

    var currentStepIndex by remember { mutableIntStateOf(0) }
    val currentStep = procedure.steps.getOrElse(currentStepIndex) { procedure.steps.first() }
    val totalSteps = procedure.steps.size
    val progress = (currentStepIndex + 1).toFloat() / totalSteps.toFloat()

    Scaffold(
        topBar = {
            FieldMindTopBar(
                title = "Guided Procedure",
                subtitle = "Step ${currentStepIndex + 1} of $totalSteps",
                onBackClick = onNavigateBack,
                onChatClick = { onNavigateToChatWithStep(currentStepIndex + 1) },
                isOfflineMode = isOfflineMode
            )
        },
        containerColor = CleanBgLight
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(20.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                modifier = Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Progress Bar Header
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .border(1.dp, CleanBorder, RoundedCornerShape(20.dp)),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = CleanSurfaceLight),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "STEP ${currentStepIndex + 1} / $totalSteps",
                                style = MaterialTheme.typography.labelMedium.copy(
                                    color = CleanBrandPrimary,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.8.sp,
                                    fontSize = 11.sp
                                )
                            )
                            Text(
                                text = "${(progress * 100).toInt()}% COMPLETED",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = SafetyGreen,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 11.sp
                                )
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        LinearProgressIndicator(
                            progress = { progress },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp)
                                .clip(RoundedCornerShape(4.dp)),
                            color = CleanBrandPrimary,
                            trackColor = CleanSurfaceAlt
                        )
                    }
                }

                // Animated Active Step Card
                AnimatedContent(
                    targetState = currentStepIndex,
                    transitionSpec = {
                        if (targetState > initialState) {
                            slideInHorizontally { width -> width } + fadeIn() togetherWith
                                slideOutHorizontally { width -> -width } + fadeOut()
                        } else {
                            slideInHorizontally { width -> -width } + fadeIn() togetherWith
                                slideOutHorizontally { width -> width } + fadeOut()
                        }
                    },
                    label = "step_transition"
                ) { targetIndex ->
                    val step = procedure.steps[targetIndex]
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
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(38.dp)
                                        .clip(CircleShape)
                                        .background(CleanBrandContainer),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "${step.stepNumber}",
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            color = CleanBrandPrimary,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 16.sp
                                        )
                                    )
                                }
                                Spacer(modifier = Modifier.width(14.dp))
                                Text(
                                    text = step.title,
                                    style = MaterialTheme.typography.titleLarge.copy(
                                        color = CleanTextPrimary,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 18.sp
                                    )
                                )
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            Text(
                                text = step.description,
                                style = MaterialTheme.typography.bodyLarge.copy(
                                    color = CleanTextPrimary,
                                    lineHeight = 24.sp,
                                    fontSize = 15.sp
                                )
                            )

                            if (step.toolRequired != null) {
                                Spacer(modifier = Modifier.height(16.dp))
                                Row(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(PastelBlueBg)
                                        .padding(horizontal = 12.dp, vertical = 8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Build,
                                        contentDescription = null,
                                        tint = PastelBlueIcon,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "Tool: ${step.toolRequired}",
                                        style = MaterialTheme.typography.labelMedium.copy(
                                            color = PastelBlueIcon,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 12.sp
                                        )
                                    )
                                }
                            }
                        }
                    }
                }

                // Step Safety Checkpoint if present
                if (currentStep.safetyCheck != null) {
                    SafetyWarningCard(warningText = currentStep.safetyCheck)
                }

                // Warning / Precaution Notes
                if (currentStep.warningNotes != null) {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(18.dp))
                            .border(1.dp, Color(0xFFFDE68A), RoundedCornerShape(18.dp)),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF3C7))
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Info,
                                contentDescription = null,
                                tint = Color(0xFF92400E),
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(
                                text = currentStep.warningNotes,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = Color(0xFF78350F),
                                    lineHeight = 20.sp,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            )
                        }
                    }
                }
            }

            // Bottom Navigation Buttons (One-Handed Field Friendly)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 14.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Primary Action: Complete Step or Finalize Job
                if (currentStepIndex < totalSteps - 1) {
                    LargePrimaryFieldButton(
                        text = "Complete Step ${currentStepIndex + 1}",
                        icon = Icons.Default.CheckCircle,
                        onClick = {
                            currentStepIndex++
                        },
                        containerColor = CleanBrandPrimary,
                        testTag = "complete_step_button"
                    )
                } else {
                    LargePrimaryFieldButton(
                        text = "All Steps Done - Complete Job",
                        icon = Icons.Default.DoneAll,
                        onClick = onProceedToCompletion,
                        containerColor = CleanBrandPrimary,
                        testTag = "finish_procedure_button"
                    )
                }

                // Secondary Row: Ask AI and Previous Step
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    LargeSecondaryFieldButton(
                        text = "Ask AI",
                        icon = Icons.Default.Psychology,
                        onClick = { onNavigateToChatWithStep(currentStepIndex + 1) },
                        modifier = Modifier.weight(1f),
                        testTag = "procedure_ask_ai_button"
                    )

                    if (currentStepIndex > 0) {
                        LargeSecondaryFieldButton(
                            text = "Previous",
                            icon = Icons.AutoMirrored.Filled.ArrowBack,
                            onClick = {
                                currentStepIndex--
                            },
                            modifier = Modifier.weight(1f),
                            testTag = "procedure_previous_button"
                        )
                    }
                }
            }
        }
    }
}
