package com.personal.mealgym.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.shape.CutCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.personal.mealgym.R

/*
 * Dark-fantasy theme: black iron and blood red at night, aged parchment and ink by day.
 * Headings are set in Cinzel (SIL Open Font License, see licenses/Cinzel-OFL.txt), bundled so
 * the app stays offline. Cards have cut corners like armour plates.
 */

/** Carved, Roman-capital display face for headings. */
val Cinzel = FontFamily(
    Font(R.font.cinzel_400, FontWeight.Normal),
    Font(R.font.cinzel_700, FontWeight.Bold),
)

/** Iron and blood: the night theme. */
private val IronColors = darkColorScheme(
    primary = Color(0xFFD23A30),
    onPrimary = Color(0xFFFFF3EE),
    primaryContainer = Color(0xFF5C100C),
    onPrimaryContainer = Color(0xFFFFDAD3),
    inversePrimary = Color(0xFF9A1F17),
    secondary = Color(0xFFB0A89E),
    onSecondary = Color(0xFF221F1C),
    secondaryContainer = Color(0xFF35302B),
    onSecondaryContainer = Color(0xFFE8DFD3),
    tertiary = Color(0xFFDDA85E),
    onTertiary = Color(0xFF3A2400),
    tertiaryContainer = Color(0xFF4B2F10),
    onTertiaryContainer = Color(0xFFFFDDB2),
    background = Color(0xFF0E0C0B),
    onBackground = Color(0xFFEAE1D3),
    surface = Color(0xFF12100E),
    onSurface = Color(0xFFEAE1D3),
    surfaceVariant = Color(0xFF2A2521),
    onSurfaceVariant = Color(0xFFBBAF9F),
    surfaceTint = Color(0xFFD23A30),
    inverseSurface = Color(0xFFEAE1D3),
    inverseOnSurface = Color(0xFF221F1C),
    error = Color(0xFFFF8A7A),
    onError = Color(0xFF4A0A04),
    errorContainer = Color(0xFF6E140C),
    onErrorContainer = Color(0xFFFFDAD3),
    outline = Color(0xFF746A60),
    outlineVariant = Color(0xFF3E3833),
    scrim = Color(0xFF000000),
    surfaceBright = Color(0xFF3A3430),
    surfaceDim = Color(0xFF0E0C0B),
    surfaceContainerLowest = Color(0xFF090807),
    surfaceContainerLow = Color(0xFF161311),
    surfaceContainer = Color(0xFF1C1916),
    surfaceContainerHigh = Color(0xFF25211E),
    surfaceContainerHighest = Color(0xFF302B27),
)

/** Parchment and ink: the day theme. */
private val ParchmentColors = lightColorScheme(
    primary = Color(0xFF8E1B16),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFF0C8C0),
    onPrimaryContainer = Color(0xFF3B0604),
    inversePrimary = Color(0xFFFFB4A8),
    secondary = Color(0xFF5B534B),
    onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = Color(0xFFDCD0BC),
    onSecondaryContainer = Color(0xFF241E18),
    tertiary = Color(0xFF7A4D12),
    onTertiary = Color(0xFFFFFFFF),
    tertiaryContainer = Color(0xFFF2D5AA),
    onTertiaryContainer = Color(0xFF2A1700),
    background = Color(0xFFEDE3CF),
    onBackground = Color(0xFF1D1915),
    surface = Color(0xFFF2EADA),
    onSurface = Color(0xFF1D1915),
    surfaceVariant = Color(0xFFE0D4BF),
    onSurfaceVariant = Color(0xFF4D443A),
    surfaceTint = Color(0xFF8E1B16),
    inverseSurface = Color(0xFF332E29),
    inverseOnSurface = Color(0xFFF5EDE0),
    error = Color(0xFFB3261E),
    onError = Color(0xFFFFFFFF),
    errorContainer = Color(0xFFF9DEDC),
    onErrorContainer = Color(0xFF410E0B),
    outline = Color(0xFF85796B),
    outlineVariant = Color(0xFFC9BCA6),
    scrim = Color(0xFF000000),
    surfaceBright = Color(0xFFF7F0E3),
    surfaceDim = Color(0xFFDDD2BD),
    surfaceContainerLowest = Color(0xFFFAF5EB),
    surfaceContainerLow = Color(0xFFF3EBDC),
    surfaceContainer = Color(0xFFEBE1CE),
    surfaceContainerHigh = Color(0xFFE4D9C4),
    surfaceContainerHighest = Color(0xFFDCD0BA),
)

private val base = Typography()

private fun TextStyle.carved(weight: FontWeight = FontWeight.Bold, spacing: Float = 0.5f) =
    copy(fontFamily = Cinzel, fontWeight = weight, letterSpacing = spacing.sp)

/** Cinzel for big headings and screen titles; the system face for everything you read at a glance. */
private val AppTypography = Typography(
    displayLarge = base.displayLarge.carved(FontWeight.Normal, 0f),
    displayMedium = base.displayMedium.carved(FontWeight.Normal, 0f),
    displaySmall = base.displaySmall.carved(FontWeight.Normal, 0f),
    headlineLarge = base.headlineLarge.carved(),
    headlineMedium = base.headlineMedium.carved(),
    headlineSmall = base.headlineSmall.carved(),
    titleLarge = base.titleLarge.carved(),
    titleMedium = base.titleMedium,
    titleSmall = base.titleSmall,
    bodyLarge = base.bodyLarge,
    bodyMedium = base.bodyMedium,
    bodySmall = base.bodySmall,
    labelLarge = base.labelLarge,
    labelMedium = base.labelMedium,
    labelSmall = base.labelSmall,
)

/** Cut corners, like plates of armour. */
private val AppShapes = Shapes(
    extraSmall = CutCornerShape(2.dp),
    small = CutCornerShape(4.dp),
    medium = CutCornerShape(8.dp),
    large = CutCornerShape(12.dp),
    extraLarge = CutCornerShape(16.dp),
)

/** Small carved heading, e.g. section titles and card labels. */
val MaterialThemeCarvedLabel: TextStyle
    @Composable get() = MaterialTheme.typography.titleSmall.carved(spacing = 1f)

private val LocalIsDark = staticCompositionLocalOf { false }

/** Light and dark follow the system setting. */
@Composable
fun MealGymTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    CompositionLocalProvider(LocalIsDark provides darkTheme) {
        MaterialTheme(
            colorScheme = if (darkTheme) IronColors else ParchmentColors,
            typography = AppTypography,
            shapes = AppShapes,
            content = content,
        )
    }
}

/**
 * The backdrop behind every screen: a faint red glow from the top fading into the dark
 * (or into the edges of the parchment by day).
 */
@Composable
fun ThemedBackground(modifier: Modifier = Modifier, content: @Composable BoxScope.() -> Unit) {
    val colors = MaterialTheme.colorScheme
    val dark = LocalIsDark.current
    val glowColor = colors.primary.copy(alpha = if (dark) 0.16f else 0.07f)
    val fade = listOf(
        colors.surfaceContainerLow,
        colors.background,
        colors.surfaceContainerLowest.copy(alpha = if (dark) 1f else 0.6f),
    )
    Box(
        modifier
            .fillMaxSize()
            .drawBehind {
                drawRect(Brush.verticalGradient(fade))
                drawRect(
                    Brush.radialGradient(
                        colors = listOf(glowColor, Color.Transparent),
                        center = Offset(size.width / 2f, -size.height * 0.1f),
                        radius = size.maxDimension * 0.75f,
                    ),
                )
            },
        content = content,
    )
}
