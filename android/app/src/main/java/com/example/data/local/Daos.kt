package com.example.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.model.JobOrder
import com.example.data.model.ServiceReport
import kotlinx.coroutines.flow.Flow

@Dao
interface ReportDao {
    @Query("SELECT * FROM service_reports ORDER BY timestamp DESC")
    fun getAllReports(): Flow<List<ServiceReport>>

    @Query("SELECT * FROM service_reports WHERE id = :id")
    suspend fun getReportById(id: Long): ServiceReport?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReport(report: ServiceReport): Long

    @Delete
    suspend fun deleteReport(report: ServiceReport)

    @Query("DELETE FROM service_reports WHERE id = :id")
    suspend fun deleteReportById(id: Long)
}

@Dao
interface JobDao {
    @Query("SELECT * FROM job_orders ORDER BY id ASC")
    fun getAllJobs(): Flow<List<JobOrder>>

    @Query("SELECT * FROM job_orders WHERE id = :id")
    suspend fun getJobById(id: String): JobOrder?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertJobs(jobs: List<JobOrder>)

    @Update
    suspend fun updateJob(job: JobOrder)

    @Query("UPDATE job_orders SET status = :status WHERE id = :id")
    suspend fun updateJobStatus(id: String, status: String)
}
