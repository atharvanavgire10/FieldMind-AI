package com.example.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val CleanMinimalLightColorScheme = lightColorScheme(
    primary = CleanBrandPrimary,
    onPrimary = Color.White,
    primaryContainer = CleanBrandContainer,
    onPrimaryContainer = CleanBrandOnContainer,
    secondary = SafetyOrange,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFFFDBCF),
    onSecondaryContainer = Color(0xFF380D00),
    tertiary = PastelGreenIcon,
    onTertiary = Color.White,
    background = CleanBgLight,
    onBackground = CleanTextPrimary,
    surface = CleanSurfaceLight,
    onSurface = CleanTextPrimary,
    surfaceVariant = CleanSurfaceAlt,
    onSurfaceVariant = CleanTextSecondary,
    outline = CleanBorder,
    outlineVariant = CleanBorderSubtle,
    error = SafetyRed,
    onError = Color.White
)

private val CleanMinimalDarkColorScheme = darkColorScheme(
    primary = Color(0xFF9ECAFF),
    onPrimary = Color(0xFF003258),
    primaryContainer = Color(0xFF00497D),
    onPrimaryContainer = Color(0xFFD1E4FF),
    secondary = SafetyOrange,
    onSecondary = Color(0xFF451900),
    secondaryContainer = Color(0xFF632B00),
    onSecondaryContainer = Color(0xFFFFDBCF),
    tertiary = Color(0xFF86D88B),
    onTertiary = Color(0xFF00390E),
    background = Color(0xFF101418),
    onBackground = Color(0xFFE1E2E8),
    surface = Color(0xFF1B2024),
    onSurface = Color(0xFFE1E2E8),
    surfaceVariant = Color(0xFF2E353B),
    onSurfaceVariant = Color(0xFFC0C7D0),
    outline = Color(0xFF404850),
    error = SafetyRed,
    onError = Color.White
)

@Composable
fun FieldMindTheme(
    darkTheme: Boolean = false, // Clean Minimalism default is crisp light aesthetic
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) CleanMinimalDarkColorScheme else CleanMinimalLightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            window.navigationBarColor = colorScheme.surface.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
            WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = false,
    content: @Composable () -> Unit
) {
    FieldMindTheme(darkTheme = darkTheme, content = content)
}


