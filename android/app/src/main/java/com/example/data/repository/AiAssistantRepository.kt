package com.example.data.repository

import com.example.data.local.DemoKnowledgeBase
import com.example.data.model.ChatMessage
import com.example.data.model.Diagnosis
import com.example.data.model.Equipment
import com.example.data.model.MessageSender
import com.example.data.model.ProcedureStep
import com.example.data.reasoning.DiagnosticInput
import com.example.data.reasoning.DiagnosticOutput
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class AiAssistantRepository(
    private val settingsRepository: SettingsRepository
) {

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .build()

    suspend fun executeStructuredReasoning(input: DiagnosticInput): DiagnosticOutput = withContext(Dispatchers.IO) {
        val isOffline = settingsRepository.isOfflineDemoMode.value
        val apiKey = settingsRepository.geminiApiKey.value

        if (!isOffline && apiKey.isNotBlank()) {
            try {
                return@withContext queryGeminiStructuredReasoning(input, apiKey)
            } catch (e: Exception) {
                // Fallback to local structured reasoning pipeline engine
                return@withContext com.example.data.reasoning.DiagnosticReasoningEngine.processDiagnosis(input)
            }
        }

        // Local grounded diagnostic reasoning pipeline engine
        return@withContext com.example.data.reasoning.DiagnosticReasoningEngine.processDiagnosis(input)
    }

    private suspend fun queryGeminiStructuredReasoning(input: DiagnosticInput, apiKey: String): DiagnosticOutput {
        val systemPrompt = """
            You are the FieldMind AI Structured Diagnostic Reasoning Pipeline.
            You must evaluate the technician's input against the supplied simulated HVAC documentation library.
            
            RULES:
            1. Never invent equipment specifications or unsafe repair instructions.
            2. If information is insufficient to diagnose safely, set confidence to 0 and explicitly state that information is insufficient.
            3. Prioritize safety over completing the diagnosis. Step 1 must always be electrical Lockout/Tagout (LOTO) or pressure isolation.
            4. Include accurate citations/references to the supplied documentation.
            5. Output ONLY valid JSON matching this schema:
            {
              "equipment": "equipment model name",
              "issue": "detected issue title",
              "likelyCause": "root cause mechanism",
              "confidence": 95,
              "severity": "low" or "medium" or "high",
              "safetyWarning": "mandatory safety alert",
              "steps": ["step 1", "step 2", "step 3"],
              "documentation": ["Document Title, Section X"],
              "whenToEscalate": "escalation criteria"
            }
        """.trimIndent()

        val promptContent = """
            INPUT:
            - equipment type: ${input.equipmentType}
            - error code: ${input.errorCode}
            - equipment model: ${input.equipmentModel ?: "N/A"}
            - captured image metadata: ${input.capturedImageMetadata ?: "None"}
            - technician question: ${input.technicianQuestion}
            - relevant documentation: ${input.relevantDocumentation.joinToString("; ")}
            - safety constraints: ${input.safetyConstraints.joinToString("; ")}
        """.trimIndent()

        val jsonBody = JSONObject().apply {
            val contentsArray = JSONArray().apply {
                put(JSONObject().apply {
                    put("role", "user")
                    put("parts", JSONArray().apply {
                        put(JSONObject().put("text", "$systemPrompt\n\n$promptContent"))
                    })
                })
            }
            put("contents", contentsArray)
        }

        val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey"
        val request = Request.Builder()
            .url(url)
            .post(jsonBody.toString().toRequestBody("application/json".toMediaType()))
            .build()

        val response = httpClient.newCall(request).execute()
        val bodyString = response.body?.string() ?: ""
        if (!response.isSuccessful) {
            throw Exception("Gemini API call failed: ${response.code}")
        }

        val jsonResponse = JSONObject(bodyString)
        val candidates = jsonResponse.getJSONArray("candidates")
        val content = candidates.getJSONObject(0).getJSONObject("content")
        val text = content.getJSONArray("parts").getJSONObject(0).getString("text")

        // Clean markdown backticks if present
        val cleanJson = text.trim()
            .removePrefix("```json")
            .removePrefix("```")
            .removeSuffix("```")
            .trim()

        return DiagnosticOutput.fromJson(cleanJson)
    }

    suspend fun queryAssistant(
        userPrompt: String,
        equipment: Equipment,
        diagnosis: Diagnosis,
        currentStep: ProcedureStep? = null
    ): ChatMessage = withContext(Dispatchers.IO) {
        val isOffline = settingsRepository.isOfflineDemoMode.value
        val apiKey = settingsRepository.geminiApiKey.value
        val backendUrl = settingsRepository.backendUrl.value

        if (!isOffline && apiKey.isNotBlank()) {
            try {
                return@withContext queryGeminiApi(userPrompt, equipment, diagnosis, currentStep, apiKey)
            } catch (e: Exception) {
                // Graceful fallback to offline engine
                val fallbackResponse = generateOfflineResponse(userPrompt, equipment, diagnosis, currentStep)
                return@withContext ChatMessage(
                    sender = MessageSender.AI_ASSISTANT,
                    text = "[Cloud Timeout - Switched to Local Offline Engine]\n\n" + fallbackResponse.text,
                    isSafetyAlert = fallbackResponse.isSafetyAlert,
                    suggestions = fallbackResponse.suggestions
                )
            }
        } else if (!isOffline && backendUrl.isNotBlank() && !backendUrl.contains("example")) {
            try {
                return@withContext queryCustomBackend(userPrompt, equipment, diagnosis, currentStep, backendUrl)
            } catch (e: Exception) {
                val fallbackResponse = generateOfflineResponse(userPrompt, equipment, diagnosis, currentStep)
                return@withContext fallbackResponse
            }
        }

        // Default offline AI engine simulation with realistic typing delay
        delay(600)
        return@withContext generateOfflineResponse(userPrompt, equipment, diagnosis, currentStep)
    }

    private fun generateOfflineResponse(
        prompt: String,
        equipment: Equipment,
        diagnosis: Diagnosis,
        currentStep: ProcedureStep?
    ): ChatMessage {
        val lower = prompt.lowercase()
        val isSafetyAlert = lower.contains("safety") || lower.contains("danger") || lower.contains("hazard") || lower.contains("voltage")

        val responseText = when {
            lower.contains("why") && (lower.contains("occur") || lower.contains("cause") || lower.contains("error") || lower.contains("fail")) -> {
                """
                🔍 **Root Cause Analysis for ${diagnosis.errorCode}**:
                
                For this **${equipment.name} (${equipment.model})**, the detected issue is:
                *${diagnosis.detectedError}*
                
                **Primary Mechanism**:
                ${diagnosis.likelyCause}
                
                **Key Telemetry Indicators**:
                ${diagnosis.symptoms.joinToString("\n") { "• $it" }}
                
                **Recommendation**:
                ${diagnosis.recommendedAction}
                """.trimIndent()
            }

            lower.contains("next") || lower.contains("what should i do") || lower.contains("check next") -> {
                if (currentStep != null) {
                    """
                    📋 **Current Operational Step (${currentStep.stepNumber}/${currentStep.totalSteps})**:
                    **${currentStep.title}**
                    
                    **Detailed Action**:
                    ${currentStep.description}
                    
                    ${if (currentStep.toolRequired != null) "🔧 **Required Tool**: ${currentStep.toolRequired}\n" else ""}
                    ${if (currentStep.safetyCheck != null) "⚠️ **Safety Checkpoint**: ${currentStep.safetyCheck}\n" else ""}
                    
                    Once confirmed, tap **'Complete Step'** to advance.
                    """.trimIndent()
                } else {
                    """
                    👉 **Recommended Next Steps for ${equipment.name}**:
                    
                    1. Initiate the **5-step Guided Procedure** from the Diagnosis screen.
                    2. Enforce Lockout/Tagout (LOTO) protocols prior to opening the service enclosure.
                    3. Connect calibrated diagnostic instruments to verify baseline error code ${diagnosis.errorCode}.
                    4. Check sensor harness integrity for thermal or mechanical degradation.
                    """.trimIndent()
                }
            }

            lower.contains("safety") || lower.contains("hazard") || lower.contains("danger") || lower.contains("ppe") || lower.contains("loto") -> {
                """
                🛡️ **Mandatory Field Safety Protocols**:
                
                ${diagnosis.safetyWarning}
                
                **Essential Precautions**:
                • Wear certified Class 0 insulated gloves & ANSI Z87.1 eye protection.
                • Verify zero energy state across all disconnect terminals using a calibrated multimeter.
                • Ensure proper ventilation and keep a fire extinguisher accessible if handling thermal joints.
                • Secure mechanical locking bars on rotating components before servicing.
                """.trimIndent()
            }

            lower.contains("procedure") || lower.contains("explain") || lower.contains("how to fix") || lower.contains("steps") -> {
                val proc = DemoKnowledgeBase.getProcedureForEquipment(equipment.id)
                """
                📖 **Standard Operating Procedure Summary**:
                **${proc.title}**
                
                • **Estimated Duration**: ~${proc.estimatedMinutes} minutes
                • **Required Tooling**: ${proc.requiredTools.joinToString(", ")}
                
                **Procedure Outline**:
                ${proc.steps.joinToString("\n") { "• Step ${it.stepNumber}: ${it.title}" }}
                
                Tap **'Guided Procedure'** in the navigation bar to step through interactive checkpoints.
                """.trimIndent()
            }

            lower.contains("spec") || lower.contains("pressure") || lower.contains("voltage") || lower.contains("manual") || lower.contains("doc") -> {
                """
                📑 **OEM Technical Specifications**:
                **${equipment.name} (${equipment.model})**
                • Serial: `${equipment.serialNumber}`
                • Location: ${equipment.location}
                
                **Operating Parameters**:
                ${equipment.specifications.entries.joinToString("\n") { "• **${it.key}**: ${it.value}" }}
                
                **Documentation Reference**:
                ${diagnosis.technicalDocumentation}
                """.trimIndent()
            }

            else -> {
                """
                🤖 **FieldMind AI Operational Assistant**:
                
                Analyzing question for **${equipment.name}** [${diagnosis.errorCode}]:
                
                Based on the diagnostic knowledge base for *${equipment.model}*, ensure all baseline operating pressures and electrical connections conform to OEM specifications.
                
                • **Current Error State**: ${diagnosis.detectedError}
                • **Confidence Index**: ${diagnosis.confidence}%
                • **Action**: Follow the interactive guided procedure or ask for specific component testing parameters.
                """.trimIndent()
            }
        }

        val suggestions = when {
            currentStep != null -> listOf("What should I check next?", "Is this step safe to skip?", "Explain this procedure")
            else -> listOf("Why did this error occur?", "What should I check next?", "Explain this procedure", "Safety precautions")
        }

        return ChatMessage(
            sender = MessageSender.AI_ASSISTANT,
            text = "[FieldMind Local Offline Engine]\n\n" + responseText,
            isSafetyAlert = isSafetyAlert,
            suggestions = suggestions
        )
    }

    private suspend fun queryGeminiApi(
        prompt: String,
        equipment: Equipment,
        diagnosis: Diagnosis,
        currentStep: ProcedureStep?,
        apiKey: String
    ): ChatMessage {
        val systemInstruction = """
            You are FieldMind AI, an expert industrial field-operations diagnostic assistant.
            The field technician is currently working on:
            - Equipment: ${equipment.name} (${equipment.model})
            - Serial: ${equipment.serialNumber}
            - Detected Error: ${diagnosis.detectedError} (${diagnosis.errorCode})
            - Likely Cause: ${diagnosis.likelyCause}
            - Safety Alert: ${diagnosis.safetyWarning}
            ${if (currentStep != null) "- Active Step: Step ${currentStep.stepNumber}/${currentStep.totalSteps}: ${currentStep.title} - ${currentStep.description}" else ""}
            
            Provide direct, concise, high-contrast, technical advice formatted with markdown bullet points. Prioritize technician safety and step-by-step clarity. Keep response under 200 words.
        """.trimIndent()

        val jsonBody = JSONObject().apply {
            val contentsArray = JSONArray().apply {
                put(JSONObject().apply {
                    put("role", "user")
                    put("parts", JSONArray().apply {
                        put(JSONObject().put("text", "$systemInstruction\n\nTechnician Question: $prompt"))
                    })
                })
            }
            put("contents", contentsArray)
        }

        val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey"
        val request = Request.Builder()
            .url(url)
            .post(jsonBody.toString().toRequestBody("application/json".toMediaType()))
            .build()

        val response = httpClient.newCall(request).execute()
        val bodyString = response.body?.string() ?: ""
        if (!response.isSuccessful) {
            throw Exception("API call failed: ${response.code} $bodyString")
        }

        val jsonResponse = JSONObject(bodyString)
        val candidates = jsonResponse.getJSONArray("candidates")
        val content = candidates.getJSONObject(0).getJSONObject("content")
        val text = content.getJSONArray("parts").getJSONObject(0).getString("text")

        return ChatMessage(
            sender = MessageSender.AI_ASSISTANT,
            text = "[FieldMind AI Cloud]\n\n" + text.trim(),
            isSafetyAlert = prompt.lowercase().contains("safety") || text.contains("WARNING") || text.contains("HAZARD"),
            suggestions = listOf("What should I check next?", "Explain this procedure", "Safety precautions")
        )
    }

    private suspend fun queryCustomBackend(
        prompt: String,
        equipment: Equipment,
        diagnosis: Diagnosis,
        currentStep: ProcedureStep?,
        backendUrl: String
    ): ChatMessage {
        val jsonBody = JSONObject().apply {
            put("prompt", prompt)
            put("equipment_id", equipment.id)
            put("error_code", diagnosis.errorCode)
            put("current_step", currentStep?.stepNumber ?: 0)
        }

        val request = Request.Builder()
            .url("$backendUrl/chat")
            .post(jsonBody.toString().toRequestBody("application/json".toMediaType()))
            .build()

        val response = httpClient.newCall(request).execute()
        val bodyString = response.body?.string() ?: ""
        if (!response.isSuccessful) {
            throw Exception("Backend call failed: ${response.code}")
        }

        val jsonResponse = JSONObject(bodyString)
        val reply = jsonResponse.optString("response", jsonResponse.optString("reply", "No response received"))

        return ChatMessage(
            sender = MessageSender.AI_ASSISTANT,
            text = "[FieldMind Backend API]\n\n" + reply,
            suggestions = listOf("What should I check next?", "Explain this procedure")
        )
    }
}
