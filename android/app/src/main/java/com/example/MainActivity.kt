package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.data.local.AppDatabase
import com.example.data.repository.AiAssistantRepository
import com.example.data.repository.FieldRepository
import com.example.data.repository.SettingsRepository
import com.example.ui.navigation.Screen
import com.example.ui.screens.chat.AiChatScreen
import com.example.ui.screens.completion.JobCompletionScreen
import com.example.ui.screens.diagnosis.DiagnosisScreen
import com.example.ui.screens.home.HomeScreen
import com.example.ui.screens.jobs.MyJobsScreen
import com.example.ui.screens.procedure.ProcedureScreen
import com.example.ui.screens.report.ServiceReportScreen
import com.example.ui.screens.reports.RecentReportsScreen
import com.example.ui.screens.scan.ScanScreen
import com.example.ui.screens.settings.SettingsScreen
import com.example.ui.screens.voice.VoiceAssistantScreen
import com.example.ui.theme.FieldMindTheme
import com.example.ui.theme.FieldNavyDark

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            FieldMindTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    FieldMindApp()
                }
            }
        }
    }
}

@Composable
fun FieldMindApp() {
    val coroutineScope = rememberCoroutineScope()
    val navController = rememberNavController()

    val context = androidx.compose.ui.platform.LocalContext.current
    val database = remember { AppDatabase.getDatabase(context, coroutineScope) }
    val settingsRepository = remember { SettingsRepository(context) }
    val fieldRepository = remember { FieldRepository(database) }
    val aiAssistantRepository = remember { AiAssistantRepository(settingsRepository) }

    NavHost(
        navController = navController,
        startDestination = Screen.Home.route
    ) {
        // 1. HOME SCREEN
        composable(Screen.Home.route) {
            HomeScreen(
                fieldRepository = fieldRepository,
                settingsRepository = settingsRepository,
                onNavigateToScan = { navController.navigate(Screen.Scan.route) },
                onNavigateToVoice = { navController.navigate(Screen.VoiceAssistant.route) },
                onNavigateToChat = { navController.navigate(Screen.AiChat.route) },
                onNavigateToJobs = { navController.navigate(Screen.MyJobs.route) },
                onNavigateToReports = { navController.navigate(Screen.RecentReports.route) },
                onNavigateToSettings = { navController.navigate(Screen.Settings.route) }
            )
        }

        // 2. SCAN / CAMERA SCREEN
        composable(Screen.Scan.route) {
            ScanScreen(
                fieldRepository = fieldRepository,
                settingsRepository = settingsRepository,
                onNavigateBack = { navController.popBackStack() },
                onContinueToDiagnosis = { navController.navigate(Screen.Diagnosis.route) }
            )
        }

        // 3. DIAGNOSIS SCREEN
        composable(Screen.Diagnosis.route) {
            DiagnosisScreen(
                fieldRepository = fieldRepository,
                settingsRepository = settingsRepository,
                onNavigateBack = { navController.popBackStack() },
                onStartProcedure = { navController.navigate(Screen.GuidedProcedure.route) },
                onNavigateToChat = { navController.navigate(Screen.AiChat.route) },
                onNavigateToVoice = { navController.navigate(Screen.VoiceAssistant.route) }
            )
        }

        // 4. GUIDED PROCEDURE SCREEN
        composable(Screen.GuidedProcedure.route) {
            ProcedureScreen(
                fieldRepository = fieldRepository,
                settingsRepository = settingsRepository,
                onNavigateBack = { navController.popBackStack() },
                onNavigateToChatWithStep = { step ->
                    navController.navigate("${Screen.AiChat.route}?step=$step")
                },
                onProceedToCompletion = { navController.navigate(Screen.JobCompletion.route) }
            )
        }

        // 5. VOICE ASSISTANT SCREEN
        composable(Screen.VoiceAssistant.route) {
            VoiceAssistantScreen(
                fieldRepository = fieldRepository,
                aiAssistantRepository = aiAssistantRepository,
                settingsRepository = settingsRepository,
                onNavigateBack = { navController.popBackStack() },
                onNavigateToChat = { navController.navigate(Screen.AiChat.route) }
            )
        }

        // 6. AI CHAT SCREEN
        composable(
            route = "${Screen.AiChat.route}?step={step}",
            arguments = listOf(
                navArgument("step") {
                    type = NavType.IntType
                    defaultValue = -1
                }
            )
        ) { backStackEntry ->
            val stepArg = backStackEntry.arguments?.getInt("step")?.takeIf { it > 0 }
            AiChatScreen(
                fieldRepository = fieldRepository,
                aiAssistantRepository = aiAssistantRepository,
                settingsRepository = settingsRepository,
                initialStepNumber = stepArg,
                onNavigateBack = { navController.popBackStack() },
                onNavigateToVoice = { navController.navigate(Screen.VoiceAssistant.route) }
            )
        }

        // 7. JOB COMPLETION SCREEN
        composable(Screen.JobCompletion.route) {
            JobCompletionScreen(
                fieldRepository = fieldRepository,
                settingsRepository = settingsRepository,
                onNavigateBack = { navController.popBackStack() },
                onReportGenerated = {
                    navController.navigate(Screen.ServiceReport.route) {
                        popUpTo(Screen.Home.route) { inclusive = false }
                    }
                }
            )
        }

        // 8. SERVICE REPORT SCREEN
        composable(Screen.ServiceReport.route) {
            ServiceReportScreen(
                fieldRepository = fieldRepository,
                settingsRepository = settingsRepository,
                onNavigateHome = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Home.route) { inclusive = true }
                    }
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        // 9. MY JOBS SCREEN
        composable(Screen.MyJobs.route) {
            MyJobsScreen(
                fieldRepository = fieldRepository,
                settingsRepository = settingsRepository,
                onNavigateBack = { navController.popBackStack() },
                onJobSelected = { _ ->
                    navController.navigate(Screen.Diagnosis.route)
                }
            )
        }

        // 10. RECENT REPORTS ARCHIVE
        composable(Screen.RecentReports.route) {
            RecentReportsScreen(
                fieldRepository = fieldRepository,
                settingsRepository = settingsRepository,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        // 11. SETTINGS SCREEN
        composable(Screen.Settings.route) {
            SettingsScreen(
                settingsRepository = settingsRepository,
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}
