package com.example.ui.screens.jobs

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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.LocationOn
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.model.JobOrder
import com.example.data.repository.FieldRepository
import com.example.data.repository.SettingsRepository
import com.example.ui.components.FieldMindTopBar
import com.example.ui.theme.CleanBgLight
import com.example.ui.theme.CleanBorder
import com.example.ui.theme.CleanBrandContainer
import com.example.ui.theme.CleanBrandPrimary
import com.example.ui.theme.CleanSurfaceLight
import com.example.ui.theme.CleanTextMuted
import com.example.ui.theme.CleanTextPrimary
import com.example.ui.theme.CleanTextSecondary
import com.example.ui.theme.PastelRedBg
import com.example.ui.theme.PastelRedIcon
import com.example.ui.theme.SafetyAmber
import com.example.ui.theme.SafetyGreen

@Composable
fun MyJobsScreen(
    fieldRepository: FieldRepository,
    settingsRepository: SettingsRepository,
    onNavigateBack: () -> Unit,
    onJobSelected: (String) -> Unit
) {
    val isOfflineMode by settingsRepository.isOfflineDemoMode.collectAsStateWithLifecycle()
    val jobs by fieldRepository.allJobs.collectAsStateWithLifecycle(initialValue = emptyList())

    Scaffold(
        topBar = {
            FieldMindTopBar(
                title = "My Assigned Jobs",
                subtitle = "${jobs.size} Active Work Orders",
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
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "DISPATCH QUEUE - TAP TO START DIAGNOSIS",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = CleanBrandPrimary,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.6.sp,
                        fontSize = 11.sp
                    )
                )
            }

            items(jobs) { job ->
                JobOrderItemCard(
                    job = job,
                    onClick = {
                        fieldRepository.selectEquipmentById(job.equipmentId)
                        onJobSelected(job.equipmentId)
                    }
                )
            }

            item {
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
private fun JobOrderItemCard(
    job: JobOrder,
    onClick: () -> Unit
) {
    val (priorityBg, priorityText) = when (job.priority) {
        "CRITICAL" -> Pair(PastelRedBg, PastelRedIcon)
        "HIGH" -> Pair(Color(0xFFFFEDD5), Color(0xFFC2410C))
        "MEDIUM" -> Pair(Color(0xFFFEF3C7), Color(0xFF92400E))
        else -> Pair(CleanBrandContainer, CleanBrandPrimary)
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .border(1.dp, CleanBorder, RoundedCornerShape(20.dp))
            .clickable(onClick = onClick)
            .testTag("job_item_${job.id}"),
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
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(priorityBg)
                            .padding(horizontal = 8.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = job.priority,
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = priorityText,
                                fontWeight = FontWeight.Bold,
                                fontSize = 10.sp
                            )
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = job.id,
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = CleanTextSecondary,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 11.sp
                        )
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(
                            if (job.status == "COMPLETED") Color(0xFFDCFCE7)
                            else CleanBrandContainer
                        )
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = job.status,
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = if (job.status == "COMPLETED") Color(0xFF166534) else CleanBrandPrimary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 10.sp
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = job.equipmentName,
                style = MaterialTheme.typography.titleMedium.copy(
                    color = CleanTextPrimary,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = job.description,
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = CleanTextSecondary,
                    lineHeight = 20.sp,
                    fontSize = 13.sp
                )
            )

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = null,
                        tint = CleanBrandPrimary,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = job.location,
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = CleanTextSecondary,
                            fontSize = 12.sp
                        )
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Open Workflow",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = CleanBrandPrimary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                        contentDescription = null,
                        tint = CleanBrandPrimary,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }
        }
    }
}
