package com.nooredarood.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = GoldPrimary,
    onPrimary = BlackBg,
    secondary = EmeraldAccent,
    onSecondary = TextLight,
    background = BlackBg,
    onBackground = TextLight,
    surface = SurfaceDark,
    onSurface = TextLight
)

@Composable
fun NoorEdaroodTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
