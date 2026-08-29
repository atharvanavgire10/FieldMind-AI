package com.example.ui.screens.chat

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
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
import com.example.data.model.ChatMessage
import com.example.data.model.MessageSender
import com.example.data.repository.AiAssistantRepository
import com.example.data.repository.FieldRepository
import com.example.data.repository.SettingsRepository
import com.example.ui.components.FieldMindTopBar
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
import kotlinx.coroutines.launch

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun AiChatScreen(
    fieldRepository: FieldRepository,
    aiAssistantRepository: AiAssistantRepository,
    settingsRepository: SettingsRepository,
    initialStepNumber: Int? = null,
    onNavigateBack: () -> Unit,
    onNavigateToVoice: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()
    val isOfflineMode by settingsRepository.isOfflineDemoMode.collectAsStateWithLifecycle()
    val equipment by fieldRepository.selectedEquipment.collectAsStateWithLifecycle()
    val diagnosis = fieldRepository.getDiagnosis(equipment.id)
    val procedure = fieldRepository.getProcedure(equipment.id)

    val currentStep = initialStepNumber?.let { stepNum ->
        procedure.steps.find { it.stepNumber == stepNum }
    }

    var inputText by remember { mutableStateOf("") }
    var isAwaitingReply by remember { mutableStateOf(false) }

    val messages = remember {
        mutableStateListOf(
            ChatMessage(
                sender = MessageSender.AI_ASSISTANT,
                text = if (currentStep != null) {
                    """
                    Hello Technician! I have loaded context for **${equipment.name}** [Step ${currentStep.stepNumber}/${currentStep.totalSteps}: ${currentStep.title}].
                    
                    How can I assist you with this step or alarm **${diagnosis.errorCode}**?
                    """.trimIndent()
                } else {
                    """
                    Hello Technician! I am your FieldMind AI expert.
                    Active Equipment: **${equipment.name} (${equipment.model})**
                    Detected Alarm: **${diagnosis.errorCode} - ${diagnosis.detectedError}**
                    
                    Ask me anything about diagnostics, safety protocols, or step-by-step procedures.
                    """.trimIndent()
                },
                suggestions = listOf(
                    "Why did this error occur?",
                    "What should I check next?",
                    "Explain this procedure.",
                    "What safety precautions are required?"
                )
            )
        )
    }

    val listState = rememberLazyListState()

    fun sendMessage(text: String) {
        if (text.isBlank()) return
        val userMsg = ChatMessage(sender = MessageSender.USER, text = text)
        messages.add(userMsg)
        inputText = ""
        isAwaitingReply = true

        coroutineScope.launch {
            listState.animateScrollToItem(messages.size - 1)
            val reply = aiAssistantRepository.queryAssistant(
                userPrompt = text,
                equipment = equipment,
                diagnosis = diagnosis,
                currentStep = currentStep
            )
            messages.add(reply)
            isAwaitingReply = false
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    Scaffold(
        topBar = {
            FieldMindTopBar(
                title = "FieldMind AI Chat",
                subtitle = "${equipment.name} (${diagnosis.errorCode})",
                onBackClick = onNavigateBack,
                onVoiceClick = onNavigateToVoice,
                isOfflineMode = isOfflineMode
            )
        },
        containerColor = CleanBgLight
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Chat message list
            LazyColumn(
                state = listState,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                contentPadding = PaddingValues(vertical = 14.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(messages) { message ->
                    ChatMessageItem(message = message)
                }

                if (isAwaitingReply) {
                    item {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .clip(RoundedCornerShape(16.dp))
                                .background(CleanSurfaceLight)
                                .border(1.dp, CleanBorder, RoundedCornerShape(16.dp))
                                .padding(horizontal = 14.dp, vertical = 10.dp)
                        ) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                strokeWidth = 2.dp,
                                color = CleanBrandPrimary
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "FieldMind AI is thinking...",
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = CleanBrandPrimary,
                                    fontWeight = FontWeight.Medium
                                )
                            )
                        }
                    }
                }
            }

            // Quick Question Chips Row
            val latestSuggestions = messages.lastOrNull()?.suggestions ?: emptyList()
            if (latestSuggestions.isNotEmpty()) {
                FlowRow(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(CleanSurfaceAlt)
                        .padding(horizontal = 14.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    latestSuggestions.forEach { suggestion ->
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(16.dp))
                                .background(CleanSurfaceLight)
                                .border(1.dp, CleanBorder, RoundedCornerShape(16.dp))
                                .clickable { sendMessage(suggestion) }
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                                .testTag("chat_quick_suggestion_${suggestion.take(8)}")
                        ) {
                            Text(
                                text = suggestion,
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = CleanBrandPrimary,
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 11.sp
                                )
                            )
                        }
                    }
                }
            }

            // Bottom Input Bar (One-Handed & Minimal Typing Friendly)
            Surface(
                color = CleanSurfaceLight,
                tonalElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column {
                    HorizontalDivider(color = CleanBorder, thickness = 1.dp)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(
                            onClick = onNavigateToVoice,
                            modifier = Modifier.testTag("chat_voice_shortcut_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Mic,
                                contentDescription = "Voice Input",
                                tint = CleanBrandPrimary
                            )
                        }

                        OutlinedTextField(
                            value = inputText,
                            onValueChange = { inputText = it },
                            modifier = Modifier
                                .weight(1f)
                                .padding(horizontal = 6.dp)
                                .testTag("chat_input_textfield"),
                            placeholder = {
                                Text(
                                    text = "Ask diagnostic query...",
                                    style = MaterialTheme.typography.bodySmall.copy(color = CleanTextMuted)
                                )
                            },
                            shape = RoundedCornerShape(24.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = CleanBrandPrimary,
                                unfocusedBorderColor = CleanBorder,
                                focusedTextColor = CleanTextPrimary,
                                unfocusedTextColor = CleanTextPrimary,
                                focusedContainerColor = CleanSurfaceAlt,
                                unfocusedContainerColor = CleanSurfaceAlt
                            ),
                            maxLines = 3
                        )

                        IconButton(
                            onClick = { sendMessage(inputText) },
                            enabled = inputText.isNotBlank(),
                            modifier = Modifier.testTag("chat_send_button")
                        ) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.Send,
                                contentDescription = "Send Message",
                                tint = if (inputText.isNotBlank()) CleanBrandPrimary else CleanTextMuted
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ChatMessageItem(
    message: ChatMessage
) {
    val isUser = message.sender == MessageSender.USER

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = if (isUser) Alignment.End else Alignment.Start
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(bottom = 4.dp)
        ) {
            if (!isUser) {
                Box(
                    modifier = Modifier
                        .size(20.dp)
                        .clip(CircleShape)
                        .background(PastelBlueBg),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Psychology,
                        contentDescription = null,
                        tint = PastelBlueIcon,
                        modifier = Modifier.size(12.dp)
                    )
                }
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "FieldMind AI",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = CleanBrandPrimary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp
                    )
                )
            } else {
                Text(
                    text = "You",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = CleanTextSecondary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp
                    )
                )
            }
        }

        Card(
            modifier = Modifier
                .widthIn(max = 320.dp)
                .border(
                    1.dp,
                    if (isUser) Color.Transparent else CleanBorder,
                    RoundedCornerShape(
                        topStart = 18.dp,
                        topEnd = 18.dp,
                        bottomStart = if (isUser) 18.dp else 4.dp,
                        bottomEnd = if (isUser) 4.dp else 18.dp
                    )
                ),
            shape = RoundedCornerShape(
                topStart = 18.dp,
                topEnd = 18.dp,
                bottomStart = if (isUser) 18.dp else 4.dp,
                bottomEnd = if (isUser) 4.dp else 18.dp
            ),
            colors = CardDefaults.cardColors(
                containerColor = if (isUser) CleanBrandPrimary else CleanSurfaceLight
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Text(
                    text = message.text,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = if (isUser) Color.White else CleanTextPrimary,
                        lineHeight = 21.sp,
                        fontSize = 14.sp
                    )
                )
            }
        }
    }
}
