package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.data.model.JobOrder
import com.example.data.model.ServiceReport
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [ServiceReport::class, JobOrder::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun reportDao(): ReportDao
    abstract fun jobDao(): JobDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "fieldmind_database"
                )
                .addCallback(DatabaseCallback(scope))
                .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        // Pre-populate jobs
                        database.jobDao().insertJobs(DemoKnowledgeBase.demoJobs)

                        // Pre-populate initial sample completed service report
                        val sampleReport = ServiceReport(
                            id = 0,
                            equipmentName = "Atlas Copco GA-75 Rotary Screw",
                            modelNumber = "ATC-GA75-6619-E",
                            detectedIssue = "High Oil Temp & Separator Delta-P Exceeded (ERR-880-OIL)",
                            diagnosisSummary = "Thermostatic bypass valve inspected and oil separator cartridge replaced. Fluid topped up.",
                            stepsCompletedText = "Completed 5 of 5 steps: Depressurized receiver, LOTO applied, valve cleaned, cartridge replaced, thermal test verified.",
                            resolutionStatus = "RESOLVED - Operational Within Tolerance",
                            technicianNotes = "Running smoothly at 82°C. Delta-P measured at 0.18 bar. Ready for full plant air load.",
                            safetyNotes = "Pneumatic blowdown completed prior to service. LOTO protocol logged.",
                            technicianName = "Alex Rivera (Lead Field Tech)",
                            timestamp = System.currentTimeMillis() - 86400000L,
                            measurements = "Oil Temp: 82°C | Delta-P: 0.18 bar | System: 8.5 bar"
                        )
                        database.reportDao().insertReport(sampleReport)
                    }
                }
            }
        }
    }
}
