package com.example.data.reasoning

import com.squareup.moshi.JsonClass
import org.json.JSONArray
import org.json.JSONObject

/**
 * Structured input to the FieldMind Diagnostic Reasoning Pipeline.
 */
data class DiagnosticInput(
    val equipmentType: String,
    val errorCode: String,
    val capturedImageMetadata: String? = null,
    val technicianQuestion: String = "",
    val relevantDocumentation: List<String> = emptyList(),
    val safetyConstraints: List<String> = emptyList(),
    val equipmentModel: String? = null,
    val observedSymptoms: List<String> = emptyList()
)

/**
 * Structured Output JSON required by FieldMind AI:
 * {
 *   "equipment": "",
 *   "issue": "",
 *   "likelyCause": "",
 *   "confidence": 0,
 *   "severity": "low|medium|high",
 *   "safetyWarning": "",
 *   "steps": [],
 *   "documentation": [],
 *   "whenToEscalate": ""
 * }
 */
@JsonClass(generateAdapter = true)
data class DiagnosticOutput(
    val equipment: String,
    val issue: String,
    val likelyCause: String,
    val confidence: Int, // 0 to 100
    val severity: String, // "low", "medium", "high"
    val safetyWarning: String,
    val steps: List<String>,
    val documentation: List<String>,
    val whenToEscalate: String
) {
    fun toJson(): String {
        val jsonObject = JSONObject().apply {
            put("equipment", equipment)
            put("issue", issue)
            put("likelyCause", likelyCause)
            put("confidence", confidence)
            put("severity", severity)
            put("safetyWarning", safetyWarning)
            
            val stepsArray = JSONArray()
            steps.forEach { stepsArray.put(it) }
            put("steps", stepsArray)
            
            val docArray = JSONArray()
            documentation.forEach { docArray.put(it) }
            put("documentation", docArray)
            
            put("whenToEscalate", whenToEscalate)
        }
        return jsonObject.toString(2)
    }

    companion object {
        fun fromJson(jsonString: String): DiagnosticOutput {
            val obj = JSONObject(jsonString)
            val stepsList = mutableListOf<String>()
            val stepsArray = obj.optJSONArray("steps")
            if (stepsArray != null) {
                for (i in 0 until stepsArray.length()) {
                    stepsList.add(stepsArray.getString(i))
                }
            }
            val docList = mutableListOf<String>()
            val docArray = obj.optJSONArray("documentation")
            if (docArray != null) {
                for (i in 0 until docArray.length()) {
                    docList.add(docArray.getString(i))
                }
            }
            return DiagnosticOutput(
                equipment = obj.optString("equipment", ""),
                issue = obj.optString("issue", ""),
                likelyCause = obj.optString("likelyCause", ""),
                confidence = obj.optInt("confidence", 0),
                severity = obj.optString("severity", "medium"),
                safetyWarning = obj.optString("safetyWarning", ""),
                steps = stepsList,
                documentation = docList,
                whenToEscalate = obj.optString("whenToEscalate", "")
            )
        }
    }
}
