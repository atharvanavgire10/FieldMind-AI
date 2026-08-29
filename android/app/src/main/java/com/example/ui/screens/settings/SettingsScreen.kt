package com.example.ui.screens.settings

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Cloud
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
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

@Composable
fun SettingsScreen(
    settingsRepository: SettingsRepository,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val isOfflineMode by settingsRepository.isOfflineDemoMode.collectAsStateWithLifecycle()
    val isTtsEnabled by settingsRepository.isTtsEnabled.collectAsStateWithLifecycle()
    val backendUrlState by settingsRepository.backendUrl.collectAsStateWithLifecycle()
    val apiKeyState by settingsRepository.geminiApiKey.collectAsStateWithLifecycle()
    val techNameState by settingsRepository.technicianName.collectAsStateWithLifecycle()

    var backendUrlInput by remember(backendUrlState) { mutableStateOf(backendUrlState) }
    var apiKeyInput by remember(apiKeyState) { mutableStateOf(apiKeyState) }
    var techNameInput by remember(techNameState) { mutableStateOf(techNameState) }

    Scaffold(
        topBar = {
            FieldMindTopBar(
                title = "FieldMind Settings",
                subtitle = "Configuration & Endpoints",
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
            // Offline Demo Mode Card
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
                        Row(modifier = Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(PastelGreenBg),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.WifiOff,
                                    contentDescription = null,
                                    tint = PastelGreenIcon,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "Offline Demo Mode",
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        color = CleanTextPrimary,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp
                                    )
                                )
                                Text(
                                    text = "Uses on-device diagnostic rules & knowledge engine for instant hackathon reliability.",
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        color = CleanTextSecondary,
                                        fontSize = 12.sp,
                                        lineHeight = 16.sp
                                    )
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Switch(
                            checked = isOfflineMode,
                            onCheckedChange = { settingsRepository.setOfflineDemoMode(it) },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color.White,
                                checkedTrackColor = CleanBrandPrimary
                            ),
                            modifier = Modifier.testTag("settings_offline_switch")
                        )
                    }
                }
            }

            // Audio TTS Toggle
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
                        Row(modifier = Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(PastelBlueBg),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.VolumeUp,
                                    contentDescription = null,
                                    tint = PastelBlueIcon,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "Voice Audio Synthesis (TTS)",
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        color = CleanTextPrimary,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp
                                    )
                                )
                                Text(
                                    text = "Speaks AI diagnostic responses aloud for hands-free field operations.",
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        color = CleanTextSecondary,
                                        fontSize = 12.sp,
                                        lineHeight = 16.sp
                                    )
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Switch(
                            checked = isTtsEnabled,
                            onCheckedChange = { settingsRepository.setTtsEnabled(it) },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color.White,
                                checkedTrackColor = CleanBrandPrimary
                            ),
                            modifier = Modifier.testTag("settings_tts_switch")
                        )
                    }
                }
            }

            // Technician Profile Info
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
                                imageVector = Icons.Default.Person,
                                contentDescription = null,
                                tint = PastelBlueIcon,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "FIELD TECHNICIAN PROFILE",
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
                        value = techNameInput,
                        onValueChange = { techNameInput = it },
                        modifier = Modifier.fillMaxWidth().testTag("tech_name_input"),
                        label = { Text("Technician Name & Call Sign") },
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

            // Cloud AI & Backend Config
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
                                imageVector = Icons.Default.Cloud,
                                contentDescription = null,
                                tint = PastelGreenIcon,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "ENTERPRISE BACKEND CONFIGURATION",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = CleanBrandPrimary,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.6.sp,
                                fontSize = 11.sp
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "Connects to cloud FieldMind API server or direct Gemini model endpoint without bundling sensitive credentials in the APK.",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = CleanTextSecondary,
                            fontSize = 12.sp,
                            lineHeight = 16.sp
                        )
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    OutlinedTextField(
                        value = backendUrlInput,
                        onValueChange = { backendUrlInput = it },
                        modifier = Modifier.fillMaxWidth().testTag("backend_url_input"),
                        label = { Text("Backend Server URL") },
                        placeholder = { Text("https://api.fieldmind.ai/v1") },
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

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = apiKeyInput,
                        onValueChange = { apiKeyInput = it },
                        modifier = Modifier.fillMaxWidth().testTag("api_key_input"),
                        label = { Text("Gemini API Key (Optional)") },
                        placeholder = { Text("Enter user-supplied API key") },
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

            // Save Settings Button
            LargePrimaryFieldButton(
                text = "Save Configuration",
                icon = Icons.Default.Save,
                onClick = {
                    settingsRepository.setBackendUrl(backendUrlInput)
                    settingsRepository.setGeminiApiKey(apiKeyInput)
                    settingsRepository.setTechnicianName(techNameInput)
                    Toast.makeText(context, "Settings saved successfully", Toast.LENGTH_SHORT).show()
                    onNavigateBack()
                },
                containerColor = CleanBrandPrimary,
                testTag = "save_settings_button"
            )

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}
