package com.personal.mealgym.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.shape.CutCornerShape
import androidx.compose.foundation.shape.RoundedCornerShape
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

/** Rounded, bubbly face for Ashley's Side (SIL Open Font License, see licenses/Fredoka-OFL.txt). */
val Fredoka = FontFamily(
    Font(R.font.fredoka_400, FontWeight.Normal),
    Font(R.font.fredoka_500, FontWeight.Medium),
    Font(R.font.fredoka_600, FontWeight.SemiBold),
    Font(R.font.fredoka_700, FontWeight.Bold),
)

/** Script face for Ashley's side titles and flourishes only (SIL OFL, see licenses/Pacifico-OFL.txt). */
val Pacifico = FontFamily(Font(R.font.pacifico_400, FontWeight.Normal))

// Display faces for the other looks, all bundled so the app stays offline (licences in licenses/).
val DmSerifDisplay = FontFamily(Font(R.font.dm_serif_display_400, FontWeight.Normal))
val BebasNeue = FontFamily(Font(R.font.bebas_neue_400, FontWeight.Normal))
val SpaceMono = FontFamily(Font(R.font.space_mono_400, FontWeight.Normal), Font(R.font.space_mono_700, FontWeight.Bold))
val SpecialElite = FontFamily(Font(R.font.special_elite_400, FontWeight.Normal))
val Righteous = FontFamily(Font(R.font.righteous_400, FontWeight.Normal))

/** Iron and blood: the night theme. */
internal val IronColors = darkColorScheme(
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
internal val ParchmentColors = lightColorScheme(
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

/** Ashley's Side by day: soft pink to lilac, hot pink, chrome. Pink text uses a deeper shade for 4.5:1 contrast. */
internal val GlamDayColors = lightColorScheme(
    primary = Color(0xFFC8106E),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFFFD1E8),
    onPrimaryContainer = Color(0xFF3B0A2A),
    inversePrimary = Color(0xFFFF8AC2),
    secondary = Color(0xFF6E44C9),
    onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = Color(0xFFEBD9FF),
    onSecondaryContainer = Color(0xFF2A0F4F),
    tertiary = Color(0xFF1B6E9E),
    onTertiary = Color(0xFFFFFFFF),
    tertiaryContainer = Color(0xFFD3EEFF),
    onTertiaryContainer = Color(0xFF0B3550),
    background = Color(0xFFFFE4F1),
    onBackground = Color(0xFF3B0A2A),
    surface = Color(0xFFFFF5FA),
    onSurface = Color(0xFF3B0A2A),
    surfaceVariant = Color(0xFFF6DDEB),
    onSurfaceVariant = Color(0xFF6B3A5A),
    surfaceTint = Color(0xFFFF2E93),
    inverseSurface = Color(0xFF3B0A2A),
    inverseOnSurface = Color(0xFFFFEAF4),
    error = Color(0xFFB3261E),
    onError = Color(0xFFFFFFFF),
    errorContainer = Color(0xFFF9DEDC),
    onErrorContainer = Color(0xFF410E0B),
    outline = Color(0xFF9C8A97),
    outlineVariant = Color(0xFFC9CED6),
    scrim = Color(0xFF000000),
    surfaceBright = Color(0xFFFFFFFF),
    surfaceDim = Color(0xFFF3D3E4),
    surfaceContainerLowest = Color(0xFFFFFFFF),
    surfaceContainerLow = Color(0xFFFFFBFD),
    surfaceContainer = Color(0xFFFFF3F9),
    surfaceContainerHigh = Color(0xFFFFEAF4),
    surfaceContainerHighest = Color(0xFFFBE0EE),
)

/** Ashley's Side at night: deep plum with the same pink and lilac. */
internal val GlamNightColors = darkColorScheme(
    primary = Color(0xFFFF7AB8),
    onPrimary = Color(0xFF4A0028),
    primaryContainer = Color(0xFF7A0E4A),
    onPrimaryContainer = Color(0xFFFFD9EA),
    inversePrimary = Color(0xFFC8106E),
    secondary = Color(0xFFCDB2FF),
    onSecondary = Color(0xFF2E1260),
    secondaryContainer = Color(0xFF4B2F7A),
    onSecondaryContainer = Color(0xFFEBDDFF),
    tertiary = Color(0xFF8FD3FF),
    onTertiary = Color(0xFF00344F),
    tertiaryContainer = Color(0xFF184A66),
    onTertiaryContainer = Color(0xFFD3EEFF),
    background = Color(0xFF2A0A22),
    onBackground = Color(0xFFFFE9F4),
    surface = Color(0xFF2F0D27),
    onSurface = Color(0xFFFFE9F4),
    surfaceVariant = Color(0xFF4A2441),
    onSurfaceVariant = Color(0xFFE6C2D8),
    surfaceTint = Color(0xFFFF2E93),
    inverseSurface = Color(0xFFFFE9F4),
    inverseOnSurface = Color(0xFF2A0A22),
    error = Color(0xFFFFB4AB),
    onError = Color(0xFF690005),
    errorContainer = Color(0xFF93000A),
    onErrorContainer = Color(0xFFFFDAD6),
    outline = Color(0xFFA88A9D),
    outlineVariant = Color(0xFF7A6573),
    scrim = Color(0xFF000000),
    surfaceBright = Color(0xFF55234A),
    surfaceDim = Color(0xFF2A0A22),
    surfaceContainerLowest = Color(0xFF1F0619),
    surfaceContainerLow = Color(0xFF35112D),
    surfaceContainer = Color(0xFF3C1534),
    surfaceContainerHigh = Color(0xFF461A3D),
    surfaceContainerHighest = Color(0xFF512047),
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

/** Soft and rounded for Ashley's Side. */
private val GlamShapes = Shapes(
    extraSmall = RoundedCornerShape(8.dp),
    small = RoundedCornerShape(12.dp),
    medium = RoundedCornerShape(24.dp),
    large = RoundedCornerShape(24.dp),
    extraLarge = RoundedCornerShape(28.dp),
)

/** Cut corners, like plates of armour. */
private val AppShapes = Shapes(
    extraSmall = CutCornerShape(2.dp),
    small = CutCornerShape(4.dp),
    medium = CutCornerShape(8.dp),
    large = CutCornerShape(12.dp),
    extraLarge = CutCornerShape(16.dp),
)

private fun TextStyle.rounded(weight: FontWeight) = copy(fontFamily = Fredoka, fontWeight = weight)

/** Fredoka throughout for readability; Pacifico for screen titles. */
private val GlamTypography = Typography(
    displayLarge = base.displayLarge.rounded(FontWeight.SemiBold),
    displayMedium = base.displayMedium.rounded(FontWeight.SemiBold),
    displaySmall = base.displaySmall.rounded(FontWeight.SemiBold),
    headlineLarge = base.headlineLarge.rounded(FontWeight.SemiBold),
    headlineMedium = base.headlineMedium.rounded(FontWeight.SemiBold),
    headlineSmall = base.headlineSmall.rounded(FontWeight.SemiBold),
    titleLarge = base.titleLarge.copy(fontFamily = Pacifico, fontWeight = FontWeight.Normal, fontSize = 24.sp, lineHeight = 34.sp),
    titleMedium = base.titleMedium.rounded(FontWeight.Medium),
    titleSmall = base.titleSmall.rounded(FontWeight.SemiBold),
    bodyLarge = base.bodyLarge.rounded(FontWeight.Normal),
    bodyMedium = base.bodyMedium.rounded(FontWeight.Normal),
    bodySmall = base.bodySmall.rounded(FontWeight.Normal),
    labelLarge = base.labelLarge.rounded(FontWeight.SemiBold),
    labelMedium = base.labelMedium.rounded(FontWeight.Medium),
    labelSmall = base.labelSmall.rounded(FontWeight.Medium),
)

/** Rounded corners for the extra-round looks. */
private val PillShapes = Shapes(
    extraSmall = RoundedCornerShape(10.dp),
    small = RoundedCornerShape(16.dp),
    medium = RoundedCornerShape(28.dp),
    large = RoundedCornerShape(32.dp),
    extraLarge = RoundedCornerShape(36.dp),
)

/** Nearly square, for the crisp looks. */
private val SquareShapes = Shapes(
    extraSmall = RoundedCornerShape(2.dp),
    small = RoundedCornerShape(2.dp),
    medium = RoundedCornerShape(4.dp),
    large = RoundedCornerShape(4.dp),
    extraLarge = RoundedCornerShape(6.dp),
)

private fun shapesFor(corners: Corners) = when (corners) {
    Corners.CUT -> AppShapes
    Corners.ROUNDED -> GlamShapes
    Corners.PILL -> PillShapes
    Corners.SQUARE -> SquareShapes
}

/** The heading face of a type style, e.g. for the look creator's font choices. */
fun headingFamily(type: TypeStyle): FontFamily = headingFace(type).first

/** The heading face and weight for a type style that keeps the system face for body text. */
private fun headingFace(type: TypeStyle): Pair<FontFamily, FontWeight> = when (type) {
    TypeStyle.CARVED -> Cinzel to FontWeight.Bold
    TypeStyle.GLAM, TypeStyle.ROUNDED -> Fredoka to FontWeight.SemiBold
    TypeStyle.SERIF -> DmSerifDisplay to FontWeight.Normal
    TypeStyle.CLEAN -> FontFamily.Default to FontWeight.SemiBold
    TypeStyle.MONO -> SpaceMono to FontWeight.Bold
    TypeStyle.SPORT -> BebasNeue to FontWeight.Normal
    TypeStyle.TYPEWRITER -> SpecialElite to FontWeight.Normal
    TypeStyle.RETRO -> Righteous to FontWeight.Normal
}

/** Display faces with one weight; Bebas Neue is tall and narrow, so it is set larger. */
private fun TextStyle.heading(type: TypeStyle): TextStyle {
    val (family, weight) = headingFace(type)
    val scaled = if (type == TypeStyle.SPORT) copy(fontSize = fontSize * 1.2f, lineHeight = lineHeight * 1.1f, letterSpacing = 1.sp) else this
    return scaled.copy(fontFamily = family, fontWeight = weight)
}

private fun typographyFor(type: TypeStyle): Typography = when (type) {
    TypeStyle.CARVED -> AppTypography
    TypeStyle.GLAM -> GlamTypography
    TypeStyle.ROUNDED -> GlamTypography.copy(
        titleLarge = base.titleLarge.rounded(FontWeight.SemiBold),
    )
    else -> Typography(
        displayLarge = base.displayLarge.heading(type),
        displayMedium = base.displayMedium.heading(type),
        displaySmall = base.displaySmall.heading(type),
        headlineLarge = base.headlineLarge.heading(type),
        headlineMedium = base.headlineMedium.heading(type),
        headlineSmall = base.headlineSmall.heading(type),
        titleLarge = base.titleLarge.heading(type),
        titleMedium = base.titleMedium,
        titleSmall = base.titleSmall,
        bodyLarge = base.bodyLarge,
        bodyMedium = base.bodyMedium,
        bodySmall = base.bodySmall,
        labelLarge = base.labelLarge,
        labelMedium = base.labelMedium,
        labelSmall = base.labelSmall,
    )
}

/** Small heading for section titles and card labels, in the look's heading face. */
val MaterialThemeCarvedLabel: TextStyle
    @Composable get() {
        val type = LocalLook.current.type
        return when (type) {
            TypeStyle.CARVED -> MaterialTheme.typography.titleSmall.carved(spacing = 1f)
            TypeStyle.GLAM, TypeStyle.ROUNDED, TypeStyle.CLEAN ->
                MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
            TypeStyle.SPORT -> MaterialTheme.typography.titleSmall.copy(fontFamily = BebasNeue, fontWeight = FontWeight.Normal, fontSize = 20.sp, letterSpacing = 1.2.sp)
            else -> MaterialTheme.typography.titleSmall.copy(fontSize = 16.sp).heading(type)
        }
    }

private val LocalIsDark = staticCompositionLocalOf { false }

/** The look in use, for the components that draw differently per look. */
val LocalLook = staticCompositionLocalOf { Looks.Iron }

/** False when the person's "Motion" setting is off: no sparkles or shimmer. */
val LocalMotion = staticCompositionLocalOf { true }

/** Light and dark follow the system setting, unless the look is always one or the other. */
@Composable
fun MealGymTheme(
    look: Look = Looks.Iron,
    darkTheme: Boolean = isSystemInDarkTheme(),
    motion: Boolean = true,
    content: @Composable () -> Unit,
) {
    val dark = look.isDark(darkTheme)
    CompositionLocalProvider(LocalIsDark provides dark, LocalLook provides look, LocalMotion provides motion) {
        MaterialTheme(
            colorScheme = look.scheme(dark),
            typography = typographyFor(look.type),
            shapes = shapesFor(look.corners),
            content = content,
        )
    }
}

/**
 * The backdrop behind every screen: for dark fantasy, a faint red glow from the top fading into
 * the dark (or into the edges of the parchment by day); other looks have their own.
 */
@Composable
fun ThemedBackground(modifier: Modifier = Modifier, content: @Composable BoxScope.() -> Unit) {
    val colors = MaterialTheme.colorScheme
    val dark = LocalIsDark.current
    val backdrop = LocalLook.current.backdrop
    val glowColor = when (backdrop) {
        Backdrop.GLAM -> Color(0xFFFFFFFF).copy(alpha = if (dark) 0.06f else 0.55f)
        Backdrop.WASH -> if (dark) colors.primary.copy(alpha = 0.1f) else Color.White.copy(alpha = 0.45f)
        Backdrop.FLAT -> Color.Transparent
        Backdrop.EMBER -> colors.primary.copy(alpha = if (dark) 0.16f else 0.07f)
    }
    val fade = when (backdrop) {
        // Soft pink fading to lilac, or deep plum to violet at night.
        Backdrop.GLAM -> if (dark) {
            listOf(Color(0xFF2A0A22), Color(0xFF241030), Color(0xFF1E0A2E))
        } else {
            listOf(Color(0xFFFFE4F1), Color(0xFFF6DEF8), Color(0xFFEBD9FF))
        }
        Backdrop.WASH -> listOf(
            Tones.mix(colors.background, colors.primaryContainer, if (dark) 0.35f else 0.45f),
            colors.background,
            Tones.mix(colors.background, colors.secondaryContainer, if (dark) 0.35f else 0.45f),
        )
        Backdrop.FLAT -> listOf(colors.background, colors.background)
        Backdrop.EMBER -> listOf(
            colors.surfaceContainerLow,
            colors.background,
            colors.surfaceContainerLowest.copy(alpha = if (dark) 1f else 0.6f),
        )
    }
    Box(
        modifier
            .fillMaxSize()
            .drawBehind {
                drawRect(Brush.verticalGradient(fade))
                if (backdrop != Backdrop.FLAT) {
                    drawRect(
                        Brush.radialGradient(
                            colors = listOf(glowColor, Color.Transparent),
                            center = Offset(size.width / 2f, -size.height * 0.1f),
                            radius = size.maxDimension * 0.75f,
                        ),
                    )
                }
            },
        content = content,
    )
}
