package com.personal.mealgym.ui.theme

import androidx.compose.material3.ColorScheme
import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color
import com.personal.mealgym.R
import com.personal.mealgym.data.db.Profile
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

/** The typeface pairing for headings (and, for some looks, body text). */
enum class TypeStyle(val label: String) {
    CARVED("Carved capitals"),
    GLAM("Rounded with a script"),
    ROUNDED("Rounded"),
    SERIF("Elegant serif"),
    CLEAN("Clean"),
    MONO("Monospace"),
    SPORT("Bold and tall"),
    TYPEWRITER("Typewriter"),
    RETRO("Retro"),
}

enum class Corners(val label: String) { CUT("Cut"), ROUNDED("Rounded"), PILL("Extra round"), SQUARE("Square") }

/** What's painted behind every screen. */
enum class Backdrop(val label: String) {
    /** A glow from the top fading into the background (dark fantasy). */
    EMBER("Glow"),

    /** Ashley's pink-to-lilac wash. */
    GLAM("Pink wash"),

    /** A soft wash from the primary tint at the top to the secondary tint at the bottom. */
    WASH("Wash"),
    FLAT("Plain"),
}

/** The line under section titles. */
enum class Divider { NONE, RHINESTONES, DOTS, RULE }

/** Light, dark, or whichever the phone is set to. */
enum class Mode(val label: String) { FOLLOW("Follow phone"), LIGHT("Always light"), DARK("Always dark") }

/**
 * One look: colours for day and night, typefaces, corners and the little decorations. Dark
 * fantasy and Y2K glam are hand-tuned; the others are generated from seed colours with
 * contrast checked (see [Schemes]).
 */
@Immutable
data class Look(
    val key: String,
    val name: String,
    val blurb: String,
    val light: ColorScheme,
    val dark: ColorScheme,
    val mode: Mode = Mode.FOLLOW,
    val type: TypeStyle,
    val corners: Corners,
    val backdrop: Backdrop,
    val divider: Divider = Divider.NONE,
    /** Glossy pill buttons with a shine across the top. */
    val glossyButtons: Boolean = false,
    /** Sparkle bursts on ticks, shimmering titles, and the Motion setting. */
    val sparkles: Boolean = false,
    /** Icon beside the main screen titles. */
    val titleIcon: Int? = null,
    /** A row of small motifs at the foot of Today. */
    val motifs: List<Int> = emptyList(),
    /** The cute tab icons (star, heart calendar, whisk, dumbbell with a bow). */
    val cuteTabs: Boolean = false,
    /** Short, upbeat wording ("Done and dusted"). */
    val playful: Boolean = false,
    /** Shown on doors, look cards and empty screens. */
    val icon: Int,
    val emptyIcon: Int? = null,
    /** Colour for decorations (title icon, motifs); the scheme's tertiary when null. */
    val accent: Color? = null,
) {
    fun isDark(systemDark: Boolean) = when (mode) {
        Mode.FOLLOW -> systemDark
        Mode.LIGHT -> false
        Mode.DARK -> true
    }

    fun scheme(dark: Boolean): ColorScheme = if (dark) this.dark else light
}

/**
 * A look someone made in the creator. Stored as JSON on the profile; names rather than enums
 * so an older app version reading a newer choice falls back instead of failing.
 */
@Serializable
data class CustomLook(
    val primary: Long = 0xFF2B6CB0,
    val accent: Long = 0xFFE2621B,
    /** NEUTRAL, TINTED, WARM or COOL. */
    val background: String = "TINTED",
    val mode: String = Mode.FOLLOW.name,
    val type: String = TypeStyle.CLEAN.name,
    val corners: String = Corners.ROUNDED.name,
    val backdrop: String = Backdrop.WASH.name,
    val glossy: Boolean = false,
    val sparkles: Boolean = false,
    val playful: Boolean = false,
) {
    fun encode(): String = json.encodeToString(serializer(), this)

    companion object {
        private val json = Json { ignoreUnknownKeys = true }

        fun decode(text: String?): CustomLook? = text?.let { runCatching { json.decodeFromString(serializer(), it) }.getOrNull() }

        val BACKGROUNDS = listOf("NEUTRAL" to "Grey", "TINTED" to "Tinted", "WARM" to "Warm", "COOL" to "Cool")
    }
}

object Looks {
    const val CUSTOM = "CUSTOM"

    private fun look(
        key: String,
        name: String,
        blurb: String,
        seeds: Seeds,
        type: TypeStyle,
        corners: Corners,
        backdrop: Backdrop,
        icon: Int,
        mode: Mode = Mode.FOLLOW,
        divider: Divider = Divider.NONE,
        glossy: Boolean = false,
    ) = Look(
        key = key,
        name = name,
        blurb = blurb,
        light = Schemes.light(seeds),
        dark = Schemes.dark(seeds),
        mode = mode,
        type = type,
        corners = corners,
        backdrop = backdrop,
        divider = divider,
        glossyButtons = glossy,
        icon = icon,
    )

    val Iron = Look(
        key = Profile.THEME_IRON,
        name = "Dark fantasy",
        blurb = "Iron, ember and old parchment",
        light = ParchmentColors,
        dark = IronColors,
        type = TypeStyle.CARVED,
        corners = Corners.CUT,
        backdrop = Backdrop.EMBER,
        icon = R.drawable.ic_launcher_monochrome,
    )

    val Glam = Look(
        key = Profile.THEME_GLAM,
        name = "Y2K glam",
        blurb = "Chrome, pink and sparkle",
        light = GlamDayColors,
        dark = GlamNightColors,
        type = TypeStyle.GLAM,
        corners = Corners.ROUNDED,
        backdrop = Backdrop.GLAM,
        divider = Divider.RHINESTONES,
        glossyButtons = true,
        sparkles = true,
        titleIcon = R.drawable.ic_butterfly,
        motifs = listOf(R.drawable.ic_heart, R.drawable.ic_lip_gloss, R.drawable.ic_star, R.drawable.ic_flip_phone, R.drawable.ic_butterfly),
        cuteTabs = true,
        playful = true,
        icon = R.drawable.ic_star,
        emptyIcon = R.drawable.ic_flip_phone,
        accent = Color(0xFFB58CFF),
    )

    private val generated = listOf(
        look(
            "OCEAN", "Deep sea", "Teal, navy and coral",
            Seeds(Color(0xFF0B7A8A), Color(0xFF1F4E8C), Color(0xFFE8734A), neutralHue = 195f, neutralTint = 0.3f),
            TypeStyle.ROUNDED, Corners.PILL, Backdrop.WASH, R.drawable.ic_look_wave,
        ),
        look(
            "FOREST", "Evergreen", "Pine, moss and bark",
            Seeds(Color(0xFF2F6B3A), Color(0xFF7A5C3E), Color(0xFFB8901C), neutralHue = 90f, neutralTint = 0.18f),
            TypeStyle.CARVED, Corners.ROUNDED, Backdrop.EMBER, R.drawable.ic_look_leaf, divider = Divider.RULE,
        ),
        look(
            "SUNSET", "Desert sunset", "Terracotta, sand and dusk",
            Seeds(Color(0xFFC4512B), Color(0xFF7A4E9C), Color(0xFFD9A030), neutralHue = 30f, neutralTint = 0.35f),
            TypeStyle.RETRO, Corners.ROUNDED, Backdrop.WASH, R.drawable.ic_look_sun,
        ),
        look(
            "NEON", "Neon arcade", "Magenta and cyan after dark",
            Seeds(Color(0xFFFF2BD6), Color(0xFF20E3FF), Color(0xFFB6FF3B), neutralHue = 250f, neutralTint = 0.4f),
            TypeStyle.MONO, Corners.SQUARE, Backdrop.EMBER, R.drawable.ic_look_bolt, mode = Mode.DARK, divider = Divider.DOTS,
        ),
        look(
            "PAPER", "Paper and ink", "Typewriter on cream paper",
            Seeds(Color(0xFF23324A), Color(0xFF5E5E5E), Color(0xFFA33B2B), neutralHue = 45f, neutralTint = 0.22f),
            TypeStyle.TYPEWRITER, Corners.SQUARE, Backdrop.FLAT, R.drawable.ic_look_pen, divider = Divider.RULE,
        ),
        look(
            "BLOSSOM", "Cherry blossom", "Petal pink and dark branches",
            Seeds(Color(0xFFC24D7A), Color(0xFF6E4B3A), Color(0xFF5E8C61), neutralHue = 340f, neutralTint = 0.35f),
            TypeStyle.SERIF, Corners.PILL, Backdrop.WASH, R.drawable.ic_look_flower, divider = Divider.DOTS,
        ),
        look(
            "MATCHA", "Matcha latte", "Green tea, oat milk and clay",
            Seeds(Color(0xFF5A7D2A), Color(0xFF8C6E4F), Color(0xFFC77D5A), neutralHue = 60f, neutralTint = 0.25f),
            TypeStyle.ROUNDED, Corners.ROUNDED, Backdrop.WASH, R.drawable.ic_whisk,
        ),
        look(
            "MIDNIGHT", "Starlight", "Gold stars on deep indigo",
            Seeds(Color(0xFFE2B04A), Color(0xFF8EA2FF), Color(0xFFC9B8FF), neutralHue = 240f, neutralTint = 0.45f),
            TypeStyle.SERIF, Corners.ROUNDED, Backdrop.EMBER, R.drawable.ic_look_moon, mode = Mode.DARK, divider = Divider.DOTS,
        ),
        look(
            "CITRUS", "Citrus burst", "Orange, lemon and lime",
            Seeds(Color(0xFFE2621B), Color(0xFF2E8B3E), Color(0xFFE6B800), neutralHue = 45f, neutralTint = 0.4f),
            TypeStyle.ROUNDED, Corners.PILL, Backdrop.WASH, R.drawable.ic_look_citrus, glossy = true,
        ),
        look(
            "LAVENDER", "Lavender fields", "Lilac, sage and soft light",
            Seeds(Color(0xFF7B5BB5), Color(0xFF6C8B6A), Color(0xFFC27BA0), neutralHue = 270f, neutralTint = 0.3f),
            TypeStyle.CLEAN, Corners.PILL, Backdrop.WASH, R.drawable.ic_look_sprig, divider = Divider.DOTS,
        ),
        look(
            "ESPRESSO", "Coffeehouse", "Espresso, caramel and cream",
            Seeds(Color(0xFF7A4A2A), Color(0xFFB5835A), Color(0xFFA6452E), neutralHue = 30f, neutralTint = 0.3f),
            TypeStyle.SERIF, Corners.ROUNDED, Backdrop.EMBER, R.drawable.ic_look_cup,
        ),
        look(
            "ATHLETIC", "Track day", "Bold red, navy and white",
            Seeds(Color(0xFFD62828), Color(0xFF1D3557), Color(0xFFF08A24), neutralHue = 220f, neutralTint = 0.1f),
            TypeStyle.SPORT, Corners.SQUARE, Backdrop.FLAT, R.drawable.ic_fitness, divider = Divider.RULE,
        ),
        look(
            "ARCTIC", "Glacier", "Ice blue and slate",
            Seeds(Color(0xFF2B6CB0), Color(0xFF3F8FA8), Color(0xFF6E7FA0), neutralHue = 205f, neutralTint = 0.3f),
            TypeStyle.CLEAN, Corners.ROUNDED, Backdrop.WASH, R.drawable.ic_look_snowflake,
        ),
    )

    /** Every ready-made look, in the order the picker shows them. */
    val builtIn: List<Look> = listOf(Iron, Glam) + generated

    private val byKey = builtIn.associateBy { it.key }

    fun byKey(key: String): Look? = byKey[key]

    private val customCache = HashMap<CustomLook, Look>()

    /** Builds (and remembers) the look for a creator choice. */
    fun custom(c: CustomLook): Look = synchronized(customCache) {
        customCache.getOrPut(c) {
            val primary = Color(c.primary.toInt())
            val accent = Color(c.accent.toInt())
            val (hue, tint) = when (c.background) {
                "NEUTRAL" -> Tones.hsl(primary)[0] to 0.04f
                "WARM" -> 35f to 0.3f
                "COOL" -> 210f to 0.25f
                else -> Tones.hsl(primary)[0] to 0.3f
            }
            val accentHue = Tones.hsl(accent)[0]
            val third = Color.hsl((accentHue + 150f) % 360f, 0.55f, 0.5f)
            val seeds = Seeds(primary, accent, third, hue, tint)
            Look(
                key = CUSTOM,
                name = "Your own look",
                blurb = "Made in the look creator",
                light = Schemes.light(seeds),
                dark = Schemes.dark(seeds),
                mode = enumOr(c.mode, Mode.FOLLOW),
                type = enumOr(c.type, TypeStyle.CLEAN),
                corners = enumOr(c.corners, Corners.ROUNDED),
                backdrop = enumOr(c.backdrop, Backdrop.WASH).let { if (it == Backdrop.GLAM) Backdrop.WASH else it },
                divider = if (c.sparkles) Divider.RHINESTONES else Divider.NONE,
                glossyButtons = c.glossy,
                sparkles = c.sparkles,
                titleIcon = if (c.sparkles) R.drawable.ic_sparkle else null,
                motifs = if (c.playful) Glam.motifs else emptyList(),
                cuteTabs = c.playful,
                playful = c.playful,
                icon = R.drawable.ic_look_palette,
            )
        }
    }

    /** The look a person uses: their custom one, a built-in, or dark fantasy if the key is unknown. */
    fun of(profile: Profile): Look = forKey(profile.themeKey, profile.customLook)

    fun forKey(key: String, customLook: String? = null): Look =
        if (key == CUSTOM) custom(CustomLook.decode(customLook) ?: CustomLook()) else byKey(key) ?: Iron

    private inline fun <reified E : Enum<E>> enumOr(name: String, fallback: E): E =
        runCatching { enumValueOf<E>(name) }.getOrDefault(fallback)
}
