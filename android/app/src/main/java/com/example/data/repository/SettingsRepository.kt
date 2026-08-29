package com.example.data.repository

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class SettingsRepository(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences("fieldmind_settings", Context.MODE_PRIVATE)

    private val _backendUrl = MutableStateFlow(
        prefs.getString(KEY_BACKEND_URL, "https://api.fieldmind.ai/v1") ?: "https://api.fieldmind.ai/v1"
    )
    val backendUrl: StateFlow<String> = _backendUrl.asStateFlow()

    private val _geminiApiKey = MutableStateFlow(
        prefs.getString(KEY_GEMINI_API_KEY, "") ?: ""
    )
    val geminiApiKey: StateFlow<String> = _geminiApiKey.asStateFlow()

    private val _isOfflineDemoMode = MutableStateFlow(
        prefs.getBoolean(KEY_OFFLINE_DEMO_MODE, true)
    )
    val isOfflineDemoMode: StateFlow<Boolean> = _isOfflineDemoMode.asStateFlow()

    private val _isTtsEnabled = MutableStateFlow(
        prefs.getBoolean(KEY_TTS_ENABLED, true)
    )
    val isTtsEnabled: StateFlow<Boolean> = _isTtsEnabled.asStateFlow()

    private val _technicianName = MutableStateFlow(
        prefs.getString(KEY_TECH_NAME, "Alex Rivera (Lead Field Tech)") ?: "Alex Rivera (Lead Field Tech)"
    )
    val technicianName: StateFlow<String> = _technicianName.asStateFlow()

    fun setBackendUrl(url: String) {
        prefs.edit().putString(KEY_BACKEND_URL, url).apply()
        _backendUrl.value = url
    }

    fun setGeminiApiKey(key: String) {
        prefs.edit().putString(KEY_GEMINI_API_KEY, key).apply()
        _geminiApiKey.value = key
    }

    fun setOfflineDemoMode(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_OFFLINE_DEMO_MODE, enabled).apply()
        _isOfflineDemoMode.value = enabled
    }

    fun setTtsEnabled(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_TTS_ENABLED, enabled).apply()
        _isTtsEnabled.value = enabled
    }

    fun setTechnicianName(name: String) {
        prefs.edit().putString(KEY_TECH_NAME, name).apply()
        _technicianName.value = name
    }

    companion object {
        private const val KEY_BACKEND_URL = "backend_url"
        private const val KEY_GEMINI_API_KEY = "gemini_api_key"
        private const val KEY_OFFLINE_DEMO_MODE = "offline_demo_mode"
        private const val KEY_TTS_ENABLED = "tts_enabled"
        private const val KEY_TECH_NAME = "technician_name"
    }
}
