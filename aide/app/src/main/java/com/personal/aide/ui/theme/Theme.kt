package com.personal.aide.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.personal.aide.data.ThemeChoice

// Ink blue on warm paper, with amber for the assistant's own voice. One calm palette, day and night.
private val Light = lightColorScheme(
    primary = Color(0xFF2B3A67),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFDDE3FA),
    onPrimaryContainer = Color(0xFF101B3D),
    secondary = Color(0xFF555B6E),
    onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = Color(0xFFE4E6EE),
    onSecondaryContainer = Color(0xFF1A1D29),
    tertiary = Color(0xFF8A5100),
    onTertiary = Color(0xFFFFFFFF),
    tertiaryContainer = Color(0xFFFFE3B8),
    onTertiaryContainer = Color(0xFF2C1800),
    background = Color(0xFFF7F6F2),
    onBackground = Color(0xFF1B1C20),
    surface = Color(0xFFF7F6F2),
    onSurface = Color(0xFF1B1C20),
    surfaceVariant = Color(0xFFE6E4DD),
    onSurfaceVariant = Color(0xFF51555F),
    surfaceContainerLowest = Color(0xFFFFFFFF),
    surfaceContainerLow = Color(0xFFFFFFFF),
    surfaceContainer = Color(0xFFF0EFEA),
    surfaceContainerHigh = Color(0xFFEAE9E3),
    surfaceContainerHighest = Color(0xFFE3E2DC),
    outline = Color(0xFF80838E),
    outlineVariant = Color(0xFFDAD9D3),
    error = Color(0xFFB3261E),
    onError = Color(0xFFFFFFFF),
    errorContainer = Color(0xFFF9DEDC),
    onErrorContainer = Color(0xFF410E0B),
)

private val Dark = darkColorScheme(
    primary = Color(0xFFB4C2F8),
    onPrimary = Color(0xFF142052),
    primaryContainer = Color(0xFF2F3E6E),
    onPrimaryContainer = Color(0xFFDDE3FA),
    secondary = Color(0xFFC3C6D4),
    onSecondary = Color(0xFF2C303C),
    secondaryContainer = Color(0xFF363B49),
    onSecondaryContainer = Color(0xFFE0E2EE),
    tertiary = Color(0xFFF4B860),
    onTertiary = Color(0xFF432C00),
    tertiaryContainer = Color(0xFF553A00),
    onTertiaryContainer = Color(0xFFFFDDAE),
    background = Color(0xFF12151C),
    onBackground = Color(0xFFE4E5EA),
    surface = Color(0xFF12151C),
    onSurface = Color(0xFFE4E5EA),
    surfaceVariant = Color(0xFF3A3F4B),
    onSurfaceVariant = Color(0xFFC2C5D2),
    surfaceContainerLowest = Color(0xFF0D0F14),
    surfaceContainerLow = Color(0xFF1A1E27),
    surfaceContainer = Color(0xFF1F232D),
    surfaceContainerHigh = Color(0xFF292D38),
    surfaceContainerHighest = Color(0xFF333845),
    outline = Color(0xFF8B8F9C),
    outlineVariant = Color(0xFF353A46),
    error = Color(0xFFF2B8B5),
    onError = Color(0xFF601410),
    errorContainer = Color(0xFF8C1D18),
    onErrorContainer = Color(0xFFF9DEDC),
)

/** Colours with a meaning Material's scheme has no slot for. */
@Immutable
data class AideColors(
    val good: Color,
    val goodContainer: Color,
    val onGoodContainer: Color,
    val warn: Color,
    val warnContainer: Color,
    val onWarnContainer: Color,
    /** The red of a live recording. */
    val recording: Color,
    /** The one hue data marks are drawn in; checked for contrast and saturation on both surfaces. */
    val chart: Color,
)

private val LightExtras = AideColors(
    good = Color(0xFF1B6E45),
    goodContainer = Color(0xFFD3F0E0),
    onGoodContainer = Color(0xFF05301B),
    warn = Color(0xFF8A5100),
    warnContainer = Color(0xFFFFE3B8),
    onWarnContainer = Color(0xFF2C1800),
    recording = Color(0xFFC9302C),
    chart = Color(0xFF2A78D6),
)

private val DarkExtras = AideColors(
    good = Color(0xFF7FD8A8),
    goodContainer = Color(0xFF0F4A2D),
    onGoodContainer = Color(0xFFC6F2DA),
    warn = Color(0xFFF4B860),
    warnContainer = Color(0xFF553A00),
    onWarnContainer = Color(0xFFFFDDAE),
    recording = Color(0xFFFF6B66),
    chart = Color(0xFF3987E5),
)

val LocalAideColors = staticCompositionLocalOf { LightExtras }

private val AideShapes = Shapes(
    extraSmall = RoundedCornerShape(6.dp),
    small = RoundedCornerShape(10.dp),
    medium = RoundedCornerShape(16.dp),
    large = RoundedCornerShape(22.dp),
    extraLarge = RoundedCornerShape(28.dp),
)

private fun typography(): Typography {
    val base = Typography()
    return base.copy(
        headlineLarge = base.headlineLarge.copy(fontWeight = FontWeight.SemiBold, letterSpacing = (-0.5).sp),
        headlineMedium = base.headlineMedium.copy(fontWeight = FontWeight.SemiBold, letterSpacing = (-0.3).sp),
        headlineSmall = base.headlineSmall.copy(fontWeight = FontWeight.SemiBold, letterSpacing = (-0.2).sp),
        titleLarge = base.titleLarge.copy(fontWeight = FontWeight.SemiBold),
        titleMedium = base.titleMedium.copy(fontWeight = FontWeight.SemiBold),
        titleSmall = base.titleSmall.copy(fontWeight = FontWeight.SemiBold),
        bodyLarge = base.bodyLarge.copy(lineHeight = 24.sp),
        bodyMedium = base.bodyMedium.copy(lineHeight = 21.sp),
        labelLarge = base.labelLarge.copy(fontWeight = FontWeight.SemiBold),
    )
}

@Composable
fun AideTheme(choice: ThemeChoice = ThemeChoice.SYSTEM, content: @Composable () -> Unit) {
    val dark = when (choice) {
        ThemeChoice.SYSTEM -> isSystemInDarkTheme()
        ThemeChoice.LIGHT -> false
        ThemeChoice.DARK -> true
    }
    val scheme: ColorScheme = if (dark) Dark else Light
    CompositionLocalProvider(LocalAideColors provides if (dark) DarkExtras else LightExtras) {
        MaterialTheme(colorScheme = scheme, typography = typography(), shapes = AideShapes, content = content)
    }
}

object AideTheme {
    val colors: AideColors
        @Composable get() = LocalAideColors.current
}
