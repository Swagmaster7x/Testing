package com.personal.mealgym.ui.theme

import androidx.compose.material3.ColorScheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.luminance
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min

/**
 * Colour maths for building a whole Material colour scheme from a few seed colours. Every text
 * colour is nudged lighter or darker until it reaches WCAG AA contrast (4.5:1) on every surface
 * it can sit on, so any seed (including ones picked in the look creator) stays readable.
 */
object Tones {
    const val TEXT = 4.5f
    const val GRAPHIC = 3f

    /** WCAG contrast ratio between two opaque colours, 1 to 21. */
    fun contrast(a: Color, b: Color): Float {
        val la = a.luminance()
        val lb = b.luminance()
        return (max(la, lb) + 0.05f) / (min(la, lb) + 0.05f)
    }

    /** Hue (0 to 360), saturation and lightness (0 to 1). */
    fun hsl(c: Color): FloatArray {
        val r = c.red
        val g = c.green
        val b = c.blue
        val hi = max(r, max(g, b))
        val lo = min(r, min(g, b))
        val l = (hi + lo) / 2f
        if (hi == lo) return floatArrayOf(0f, 0f, l)
        val d = hi - lo
        val s = if (l > 0.5f) d / (2f - hi - lo) else d / (hi + lo)
        val h = when (hi) {
            r -> ((g - b) / d + (if (g < b) 6f else 0f))
            g -> ((b - r) / d + 2f)
            else -> ((r - g) / d + 4f)
        } * 60f
        return floatArrayOf(h, s, l)
    }

    /** The seed's hue at another lightness; [maxSaturation] keeps pale and dark tones from turning neon. */
    fun tone(seed: Color, lightness: Float, maxSaturation: Float = 1f): Color {
        val (h, s, _) = hsl(seed)
        return Color.hsl(h, min(s, maxSaturation), lightness.coerceIn(0f, 1f))
    }

    /**
     * Moves [color] darker (or lighter) in small steps until it reaches [ratio] against every
     * colour in [against]. Falls back to black or white, which always clears 4.5:1 on the
     * light or dark surfaces this is used with.
     */
    fun ensure(color: Color, against: List<Color>, ratio: Float, darker: Boolean): Color {
        val (h, s, l0) = hsl(color)
        var l = l0
        repeat(60) {
            val c = Color.hsl(h, s, l.coerceIn(0f, 1f))
            if (against.all { contrast(c, it) >= ratio }) return c
            l += if (darker) -0.02f else 0.02f
            if (l < 0f || l > 1f) return if (darker) Color.Black else Color.White
        }
        return if (darker) Color.Black else Color.White
    }

    fun mix(a: Color, b: Color, t: Float) = Color(
        red = a.red + (b.red - a.red) * t,
        green = a.green + (b.green - a.green) * t,
        blue = a.blue + (b.blue - a.blue) * t,
        alpha = 1f,
    )

    /** True when two hues are within [degrees] of each other on the colour wheel. */
    fun nearHue(a: Float, b: Float, degrees: Float): Boolean {
        val d = abs(a - b) % 360f
        return min(d, 360f - d) <= degrees
    }
}

/** The colours a generated look is built from. Neutrals (backgrounds, text) take [neutralHue] lightly. */
data class Seeds(
    val primary: Color,
    val secondary: Color,
    val tertiary: Color,
    val neutralHue: Float,
    /** How much the backgrounds lean towards [neutralHue]: 0 is grey, 0.4 is clearly tinted. */
    val neutralTint: Float = 0.2f,
)

object Schemes {
    private fun lightError() = listOf(Color(0xFFB3261E), Color(0xFFFFFFFF), Color(0xFFF9DEDC), Color(0xFF410E0B))
    private fun darkError() = listOf(Color(0xFFFFB4AB), Color(0xFF690005), Color(0xFF93000A), Color(0xFFFFDAD6))

    fun light(s: Seeds): ColorScheme {
        val tint = s.neutralTint.coerceIn(0f, 0.6f)
        fun n(l: Float, sat: Float = tint) = Color.hsl(s.neutralHue, sat, l)
        val background = n(0.955f)
        val surface = n(0.975f)
        val lowest = n(0.99f)
        val low = n(0.965f)
        val container = n(0.94f)
        val high = n(0.915f)
        val highest = n(0.89f)
        val surfaceVariant = n(0.9f)
        val textBacks = listOf(background, surface, lowest, low, container, high, highest, surfaceVariant)
        val onSurface = Tones.ensure(n(0.13f, min(tint, 0.25f)), textBacks, 7f, darker = true)
        val onSurfaceVariant = Tones.ensure(n(0.34f, min(tint, 0.25f)), textBacks, Tones.TEXT, darker = true)
        fun accent(seed: Color) = Tones.ensure(Tones.tone(seed, 0.42f), textBacks + Color.White, Tones.TEXT, darker = true)
        fun container(seed: Color) = Tones.tone(seed, 0.88f, 0.75f)
        fun onContainer(seed: Color, back: Color) = Tones.ensure(Tones.tone(seed, 0.18f, 0.8f), listOf(back), Tones.TEXT, darker = true)
        val primary = accent(s.primary)
        val secondary = accent(s.secondary)
        val tertiary = accent(s.tertiary)
        val pc = container(s.primary)
        val sc = container(s.secondary)
        val tc = container(s.tertiary)
        val (error, onError, errorContainer, onErrorContainer) = lightError()
        return lightColorScheme(
            primary = primary,
            onPrimary = Color.White,
            primaryContainer = pc,
            onPrimaryContainer = onContainer(s.primary, pc),
            inversePrimary = Tones.tone(s.primary, 0.78f),
            secondary = secondary,
            onSecondary = Color.White,
            secondaryContainer = sc,
            onSecondaryContainer = onContainer(s.secondary, sc),
            tertiary = tertiary,
            onTertiary = Color.White,
            tertiaryContainer = tc,
            onTertiaryContainer = onContainer(s.tertiary, tc),
            background = background,
            onBackground = onSurface,
            surface = surface,
            onSurface = onSurface,
            surfaceVariant = surfaceVariant,
            onSurfaceVariant = onSurfaceVariant,
            surfaceTint = primary,
            inverseSurface = n(0.2f, min(tint, 0.25f)),
            inverseOnSurface = n(0.95f),
            error = error,
            onError = onError,
            errorContainer = errorContainer,
            onErrorContainer = onErrorContainer,
            outline = Tones.ensure(n(0.5f, min(tint, 0.2f)), listOf(background, surface), Tones.GRAPHIC, darker = true),
            outlineVariant = n(0.8f),
            scrim = Color.Black,
            surfaceBright = n(0.98f),
            surfaceDim = n(0.87f),
            surfaceContainerLowest = lowest,
            surfaceContainerLow = low,
            surfaceContainer = container,
            surfaceContainerHigh = high,
            surfaceContainerHighest = highest,
        )
    }

    fun dark(s: Seeds): ColorScheme {
        val tint = s.neutralTint.coerceIn(0f, 0.6f)
        fun n(l: Float, sat: Float = tint) = Color.hsl(s.neutralHue, sat, l)
        val background = n(0.065f)
        val surface = n(0.08f)
        val lowest = n(0.045f)
        val low = n(0.1f)
        val container = n(0.125f)
        val high = n(0.16f)
        val highest = n(0.2f)
        val surfaceVariant = n(0.2f)
        val textBacks = listOf(background, surface, lowest, low, container, high, highest, surfaceVariant)
        val onSurface = Tones.ensure(n(0.92f, min(tint, 0.3f)), textBacks, 7f, darker = false)
        val onSurfaceVariant = Tones.ensure(n(0.74f, min(tint, 0.3f)), textBacks, Tones.TEXT, darker = false)
        fun accent(seed: Color) = Tones.ensure(Tones.tone(seed, 0.68f), textBacks, Tones.TEXT, darker = false)
        fun onAccent(seed: Color, back: Color) = Tones.ensure(Tones.tone(seed, 0.12f, 0.8f), listOf(back), Tones.TEXT, darker = true)
        fun container(seed: Color) = Tones.tone(seed, 0.26f, 0.7f)
        fun onContainer(seed: Color, back: Color) = Tones.ensure(Tones.tone(seed, 0.9f, 0.8f), listOf(back), Tones.TEXT, darker = false)
        val primary = accent(s.primary)
        val secondary = accent(s.secondary)
        val tertiary = accent(s.tertiary)
        val pc = container(s.primary)
        val sc = container(s.secondary)
        val tc = container(s.tertiary)
        val (error, onError, errorContainer, onErrorContainer) = darkError()
        return darkColorScheme(
            primary = primary,
            onPrimary = onAccent(s.primary, primary),
            primaryContainer = pc,
            onPrimaryContainer = onContainer(s.primary, pc),
            inversePrimary = Tones.tone(s.primary, 0.4f),
            secondary = secondary,
            onSecondary = onAccent(s.secondary, secondary),
            secondaryContainer = sc,
            onSecondaryContainer = onContainer(s.secondary, sc),
            tertiary = tertiary,
            onTertiary = onAccent(s.tertiary, tertiary),
            tertiaryContainer = tc,
            onTertiaryContainer = onContainer(s.tertiary, tc),
            background = background,
            onBackground = onSurface,
            surface = surface,
            onSurface = onSurface,
            surfaceVariant = surfaceVariant,
            onSurfaceVariant = onSurfaceVariant,
            surfaceTint = primary,
            inverseSurface = n(0.9f, min(tint, 0.25f)),
            inverseOnSurface = n(0.15f),
            error = error,
            onError = onError,
            errorContainer = errorContainer,
            onErrorContainer = onErrorContainer,
            outline = Tones.ensure(n(0.5f, min(tint, 0.2f)), listOf(background, surface), Tones.GRAPHIC, darker = false),
            outlineVariant = n(0.28f),
            scrim = Color.Black,
            surfaceBright = n(0.24f),
            surfaceDim = background,
            surfaceContainerLowest = lowest,
            surfaceContainerLow = low,
            surfaceContainer = container,
            surfaceContainerHigh = high,
            surfaceContainerHighest = highest,
        )
    }
}
