package com.example.data.repository

import com.example.data.local.AppDatabase
import com.example.data.local.DemoKnowledgeBase
import com.example.data.model.Diagnosis
import com.example.data.model.Equipment
import com.example.data.model.GuidedProcedure
import com.example.data.model.JobOrder
import com.example.data.model.ServiceReport
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class FieldRepository(private val database: AppDatabase) {

    val allReports: Flow<List<ServiceReport>> = database.reportDao().getAllReports()
    val allJobs: Flow<List<JobOrder>> = database.jobDao().getAllJobs()

    // Shared session state for current diagnosis workflow
    private val _selectedEquipment = MutableStateFlow<Equipment>(DemoKnowledgeBase.demoEquipments.first())
    val selectedEquipment: StateFlow<Equipment> = _selectedEquipment.asStateFlow()

    private val _capturedImageUri = MutableStateFlow<String?>(null)
    val capturedImageUri: StateFlow<String?> = _capturedImageUri.asStateFlow()

    fun selectEquipment(equipment: Equipment) {
        _selectedEquipment.value = equipment
    }

    fun selectEquipmentById(equipmentId: String) {
        val equipment = DemoKnowledgeBase.getEquipmentById(equipmentId)
        if (equipment != null) {
            _selectedEquipment.value = equipment
        }
    }

    fun setCapturedImageUri(uri: String?) {
        _capturedImageUri.value = uri
    }

    fun getEquipmentList(): List<Equipment> = DemoKnowledgeBase.demoEquipments

    fun getDiagnosis(equipmentId: String): Diagnosis =
        DemoKnowledgeBase.getDiagnosisForEquipment(equipmentId)

    fun getProcedure(equipmentId: String): GuidedProcedure =
        DemoKnowledgeBase.getProcedureForEquipment(equipmentId)

    suspend fun saveReport(report: ServiceReport): Long =
        database.reportDao().insertReport(report)

    suspend fun deleteReport(id: Long) =
        database.reportDao().deleteReportById(id)

    suspend fun updateJobStatus(jobId: String, status: String) =
        database.jobDao().updateJobStatus(jobId, status)

    suspend fun getJobById(jobId: String): JobOrder? =
        database.jobDao().getJobById(jobId)
}
