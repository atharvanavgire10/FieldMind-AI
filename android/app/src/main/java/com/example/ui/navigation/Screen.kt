package com.example.ui.navigation

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Scan : Screen("scan")
    object Diagnosis : Screen("diagnosis")
    object GuidedProcedure : Screen("procedure")
    object VoiceAssistant : Screen("voice")
    object AiChat : Screen("chat")
    object JobCompletion : Screen("completion")
    object ServiceReport : Screen("report")
    object MyJobs : Screen("jobs")
    object RecentReports : Screen("recent_reports")
    object Settings : Screen("settings")
}
