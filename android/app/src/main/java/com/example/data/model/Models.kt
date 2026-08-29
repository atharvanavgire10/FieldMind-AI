package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.squareup.moshi.JsonClass
import com.squareup.moshi.Moshi
import com.squareup.moshi.Types

data class Equipment(
    val id: String,
    val name: String,
    val model: String,
    val serialNumber: String,
    val location: String,
    val category: String,
    val status: String = "Operating with Alert",
    val specifications: Map<String, String> = emptyMap()
)

data class Diagnosis(
    val id: String,
    val equipmentId: String,
    val equipmentName: String,
    val detectedError: String,
    val errorCode: String,
    val likelyCause: String,
    val confidence: Int, // e.g. 94%
    val severity: String = "medium", // "low", "medium", "high"
    val safetyWarning: String,
    val technicalDocumentation: String,
    val symptoms: List<String>,
    val recommendedAction: String,
    val recommendedSteps: List<String> = emptyList(),
    val sourceDocumentation: List<String> = emptyList(),
    val whenToEscalate: String = "",
    val isDemoResult: Boolean = true
)

data class ProcedureStep(
    val stepNumber: Int,
    val totalSteps: Int,
    val title: String,
    val description: String,
    val safetyCheck: String? = null,
    val warningNotes: String? = null,
    val toolRequired: String? = null,
    val isCompleted: Boolean = false
)

data class GuidedProcedure(
    val id: String,
    val equipmentId: String,
    val title: String,
    val estimatedMinutes: Int,
    val requiredTools: List<String>,
    val steps: List<ProcedureStep>
)

@Entity(tableName = "job_orders")
data class JobOrder(
    @PrimaryKey val id: String,
    val title: String,
    val equipmentId: String,
    val equipmentName: String,
    val location: String,
    val priority: String, // High, Critical, Medium, Low
    val status: String, // Pending, In Progress, Completed
    val assignedDate: String,
    val description: String
)

@Entity(tableName = "service_reports")
data class ServiceReport(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val equipmentName: String,
    val modelNumber: String,
    val detectedIssue: String,
    val diagnosisSummary: String,
    val stepsCompletedText: String,
    val resolutionStatus: String,
    val technicianNotes: String,
    val safetyNotes: String,
    val technicianName: String = "Field Tech (You)",
    val timestamp: Long = System.currentTimeMillis(),
    val measurements: String = "Normal range verified"
)

enum class MessageSender {
    USER, AI_ASSISTANT, SYSTEM
}

data class ChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val sender: MessageSender,
    val text: String,
    val timestamp: Long = System.currentTimeMillis(),
    val isSafetyAlert: Boolean = false,
    val stepReference: Int? = null,
    val suggestions: List<String> = emptyList()
)
