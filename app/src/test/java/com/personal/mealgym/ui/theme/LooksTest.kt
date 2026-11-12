package com.personal.mealgym.ui.theme

import androidx.compose.material3.ColorScheme
import androidx.compose.ui.graphics.Color
import com.personal.mealgym.data.db.Profile
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertSame
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.random.Random

/**
 * Every look is readable: text colours reach WCAG AA (4.5:1) on every surface they're used on,
 * by day and by night, for the ready-made looks and for anything the look creator can make.
 */
class LooksTest {

    /** Text-on-background pairs the screens actually use. */
    private fun textPairs(c: ColorScheme): List<Triple<String, Color, Color>> {
        val surfaces = listOf(
            "background" to c.background, "surface" to c.surface, "lowest" to c.surfaceContainerLowest,
            "low" to c.surfaceContainerLow, "container" to c.surfaceContainer, "high" to c.surfaceContainerHigh,
            "highest" to c.surfaceContainerHighest,
        )
        return surfaces.flatMap { (name, back) ->
            listOf(
                Triple("onSurface on $name", c.onSurface, back),
                Triple("onSurfaceVariant on $name", c.onSurfaceVariant, back),
                Triple("primary on $name", c.primary, back),
            )
        } + listOf(
            Triple("onBackground on background", c.onBackground, c.background),
            Triple("onPrimary on primary", c.onPrimary, c.primary),
            Triple("onPrimaryContainer on primaryContainer", c.onPrimaryContainer, c.primaryContainer),
            Triple("onSecondaryContainer on secondaryContainer", c.onSecondaryContainer, c.secondaryContainer),
            Triple("onTertiaryContainer on tertiaryContainer", c.onTertiaryContainer, c.tertiaryContainer),
            Triple("onSecondary on secondary", c.onSecondary, c.secondary),
            Triple("onTertiary on tertiary", c.onTertiary, c.tertiary),
        )
    }

    private fun failures(look: Look, dark: Boolean): List<String> =
        textPairs(look.scheme(dark)).filter { (_, fg, bg) -> Tones.contrast(fg, bg) < 4.5f }
            .map { (name, fg, bg) -> "${look.name} ${if (dark) "night" else "day"}: $name is %.2f:1".format(Tones.contrast(fg, bg)) }

    @Test
    fun fifteenLooksWithUniqueKeysAndNames() {
        assertEquals(15, Looks.builtIn.size)
        assertEquals(15, Looks.builtIn.map { it.key }.toSet().size)
        assertEquals(15, Looks.builtIn.map { it.name }.toSet().size)
        assertEquals(listOf("IRON", "GLAM"), Looks.builtIn.take(2).map { it.key })
    }

    @Test
    fun everyNewLookIsReadableDayAndNight() {
        val problems = Looks.builtIn.drop(2).flatMap { failures(it, false) + failures(it, true) }
        assertTrue(problems.joinToString("\n"), problems.isEmpty())
    }

    @Test
    fun anythingTheCreatorMakesIsReadable() {
        val random = Random(42)
        val problems = (1..300).flatMap {
            val c = CustomLook(
                primary = 0xFF000000L or random.nextLong(0, 0xFFFFFF),
                accent = 0xFF000000L or random.nextLong(0, 0xFFFFFF),
                background = CustomLook.BACKGROUNDS.random(random).first,
            )
            val look = Looks.custom(c)
            failures(look, false) + failures(look, true)
        }
        assertTrue(problems.take(20).joinToString("\n"), problems.isEmpty())
    }

    @Test
    fun extremeCreatorColoursStillWork() {
        for (argb in listOf(0xFFFFFFFF, 0xFF000000, 0xFFFFFF00, 0xFF00FFFF, 0xFF808080, 0xFFFF0000)) {
            val look = Looks.custom(CustomLook(primary = argb, accent = argb))
            assertTrue(failures(look, false) + failures(look, true) == emptyList<String>())
        }
    }

    @Test
    fun customLooksRoundTripAndToleratePartialOrBadData() {
        val c = CustomLook(primary = 0xFF6E44C9, type = TypeStyle.SPORT.name, corners = Corners.PILL.name, sparkles = true)
        assertEquals(c, CustomLook.decode(c.encode()))
        assertNull(CustomLook.decode("not json"))
        assertNull(CustomLook.decode(null))
        // A future font name this version doesn't know falls back instead of failing.
        val future = Looks.custom(CustomLook(type = "HOLOGRAM", corners = "WOBBLY", mode = "SOMETIMES"))
        assertEquals(TypeStyle.CLEAN, future.type)
        assertEquals(Corners.ROUNDED, future.corners)
        assertEquals(Mode.FOLLOW, future.mode)
        assertSame(Looks.custom(c), Looks.custom(c.copy()))
        // Every choice is written, defaults included, so changing a default later can't change saved looks.
        val saved = CustomLook().encode()
        for (field in listOf("primary", "accent", "background", "mode", "type", "corners", "backdrop", "glossy")) {
            assertTrue(field, saved.contains("\"$field\""))
        }
    }

    @Test
    fun aPersonGetsTheirLookAndUnknownKeysFallBack() {
        assertSame(Looks.Glam, Looks.of(Profile(2, "Ashley", "GLAM")))
        assertSame(Looks.Iron, Looks.of(Profile(1, "Swag", "IRON")))
        assertSame(Looks.Iron, Looks.of(Profile(3, "Old phone", "SOMETHING_NEWER")))
        assertEquals("Deep sea", Looks.of(Profile(4, "Sam", "OCEAN")).name)
        val mine = Looks.of(Profile(5, "Jo", Looks.CUSTOM, customLook = CustomLook(sparkles = true).encode()))
        assertTrue(mine.sparkles && mine.key == Looks.CUSTOM)
        // Picked "custom" but nothing saved yet: the creator's starting point.
        assertEquals(Looks.custom(CustomLook()), Looks.of(Profile(6, "Al", Looks.CUSTOM)))
    }

    @Test
    fun alwaysDarkLooksIgnoreThePhoneSetting() {
        val neon = Looks.byKey("NEON")!!
        assertTrue(neon.isDark(systemDark = false))
        assertTrue(Looks.Iron.isDark(true) && !Looks.Iron.isDark(false))
    }
}
