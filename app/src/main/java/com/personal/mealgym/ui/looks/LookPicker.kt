@file:OptIn(ExperimentalLayoutApi::class)

package com.personal.mealgym.ui.looks

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Slider
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.personal.mealgym.R
import com.personal.mealgym.ui.components.AppButton
import com.personal.mealgym.ui.components.Badge
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.settings.SwitchRow
import com.personal.mealgym.ui.theme.Backdrop
import com.personal.mealgym.ui.theme.Corners
import com.personal.mealgym.ui.theme.CustomLook
import com.personal.mealgym.ui.theme.Look
import com.personal.mealgym.ui.theme.Looks
import com.personal.mealgym.ui.theme.MaterialThemeCarvedLabel
import com.personal.mealgym.ui.theme.MealGymTheme
import com.personal.mealgym.ui.theme.Mode
import com.personal.mealgym.ui.theme.ThemedBackground
import com.personal.mealgym.ui.theme.Tones
import com.personal.mealgym.ui.theme.TypeStyle
import com.personal.mealgym.ui.theme.headingFamily

/**
 * Every ready-made look as a small card drawn in that look, two to a row, then "Your own look".
 * [custom] is the person's saved creation, if any.
 */
@Composable
fun LookGrid(selectedKey: String, custom: CustomLook?, onPick: (String) -> Unit, modifier: Modifier = Modifier) {
    val cards: List<Pair<String, Look>> = Looks.builtIn.map { it.key to it } +
        (Looks.CUSTOM to Looks.custom(custom ?: CustomLook()))
    // Two to a row, or one when the phone's text size is turned up so names don't break mid-word.
    val perRow = if (LocalDensity.current.fontScale >= 1.3f) 1 else 2
    Column(modifier, verticalArrangement = Arrangement.spacedBy(10.dp)) {
        cards.chunked(perRow).forEach { row ->
            // Both cards in a row take the taller one's height, so big text never gets cut off.
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth().height(IntrinsicSize.Min)) {
                row.forEach { (key, look) ->
                    LookCard(
                        look = look,
                        title = if (key == Looks.CUSTOM) (if (custom == null) "Create your own" else "Your own look") else look.name,
                        blurb = if (key == Looks.CUSTOM) "Pick colours, fonts and more" else look.blurb,
                        selected = key == selectedKey,
                        onClick = { onPick(key) },
                        modifier = Modifier.weight(1f).fillMaxHeight(),
                    )
                }
                if (row.size < perRow) Spacer(Modifier.weight(1f))
            }
        }
    }
}

/** A look card: its backdrop, icon, colours and name in its own heading face. */
@Composable
fun LookCard(look: Look, title: String, blurb: String, selected: Boolean, onClick: () -> Unit, modifier: Modifier = Modifier) {
    val ring = MaterialTheme.colorScheme.primary
    val quiet = MaterialTheme.colorScheme.outlineVariant
    MealGymTheme(look = look) {
        Surface(
            shape = MaterialTheme.shapes.medium,
            border = BorderStroke(if (selected) 3.dp else 1.dp, if (selected) ring else quiet),
            modifier = modifier
                .heightIn(min = 116.dp)
                // The card's own text (name and description) is what a screen reader says.
                .selectable(selected = selected, role = Role.RadioButton, onClick = onClick),
        ) {
            ThemedBackground {
                Column(Modifier.fillMaxWidth().padding(12.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            painterResource(look.icon),
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(26.dp),
                        )
                        Spacer(Modifier.weight(1f))
                        Swatch(MaterialTheme.colorScheme.primary)
                        Swatch(MaterialTheme.colorScheme.secondary)
                        Swatch(MaterialTheme.colorScheme.tertiary)
                    }
                    Spacer(Modifier.height(8.dp))
                    Text(
                        title,
                        style = MaterialThemeCarvedLabel,
                        color = MaterialTheme.colorScheme.onBackground,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                    )
                    Text(
                        blurb,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            }
        }
    }
}

@Composable
private fun Swatch(color: Color) {
    Box(
        Modifier
            .padding(start = 4.dp)
            .size(12.dp)
            .clip(CircleShape)
            .background(color)
            .border(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.4f), CircleShape),
    )
}

/**
 * How a look will feel: a screen title, a section, a meal card, a button and a badge, by day and
 * by night (or just one, for looks that are always light or dark).
 */
@Composable
fun LookPreview(look: Look, modifier: Modifier = Modifier) {
    val modes = when (look.mode) {
        Mode.FOLLOW -> listOf(false, true)
        Mode.LIGHT -> listOf(false)
        Mode.DARK -> listOf(true)
    }
    // A picture, not controls: screen readers hear one description, and the sample button can't be mistaken for a real one.
    Row(
        modifier.fillMaxWidth().height(IntrinsicSize.Min).clearAndSetSemantics { contentDescription = "Preview of this look" },
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        modes.forEach { dark ->
            MealGymTheme(look = look, darkTheme = dark) {
                Surface(
                    shape = MaterialTheme.shapes.large,
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                    modifier = Modifier.weight(1f).fillMaxHeight().heightIn(min = 250.dp),
                ) {
                    ThemedBackground {
                        Column(Modifier.padding(12.dp)) {
                            Text(
                                if (modes.size == 2) (if (dark) "Night" else "Day") else "Today",
                                style = MaterialTheme.typography.titleLarge,
                                color = MaterialTheme.colorScheme.onBackground,
                            )
                            SectionHeader("Lunch")
                            ElevatedCard(Modifier.fillMaxWidth()) {
                                Column(Modifier.padding(10.dp)) {
                                    Text("Teriyaki bowl", style = MaterialTheme.typography.titleMedium, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                    Text("1 bowl", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                            Spacer(Modifier.height(10.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                AppButton(onClick = {}) { Text("Button") }
                                Spacer(Modifier.width(6.dp))
                                Badge("makes 4")
                            }
                            TextButton(onClick = {}) { Text("Link") }
                        }
                    }
                }
            }
        }
    }
}

/** Colours offered in the creator, with the names screen readers say. The hue slider fine-tunes any of them. */
private val Swatches = listOf(
    0xFFD62828 to "Red", 0xFFE2621B to "Orange", 0xFFE6B800 to "Yellow", 0xFF8DB600 to "Lime",
    0xFF2E8B3E to "Green", 0xFF0B7A8A to "Teal", 0xFF20A4C8 to "Sky blue", 0xFF2B6CB0 to "Blue",
    0xFF1F3A93 to "Navy", 0xFF6E44C9 to "Purple", 0xFFB5179E to "Magenta", 0xFFFF2E93 to "Hot pink",
    0xFFC24D7A to "Rose", 0xFF8E1B16 to "Crimson", 0xFF7A4A2A to "Brown", 0xFF5A7D2A to "Olive",
    0xFF23324A to "Ink", 0xFF5E5E5E to "Grey",
)

/** The look creator's controls. Every change shows at once in a [LookPreview]. */
@Composable
fun CustomLookEditor(value: CustomLook, onChange: (CustomLook) -> Unit, modifier: Modifier = Modifier) {
    Column(modifier) {
        ColourChoice("Main colour", "Buttons, titles and highlights.", value.primary) { onChange(value.copy(primary = it)) }
        ColourChoice("Second colour", "Badges and accents.", value.accent) { onChange(value.copy(accent = it)) }

        SectionHeader("Background")
        Choices(CustomLook.BACKGROUNDS.map { it.first }, value.background, { key -> CustomLook.BACKGROUNDS.first { it.first == key }.second }) {
            onChange(value.copy(background = it))
        }
        Text("Day or night", style = MaterialTheme.typography.bodyLarge, modifier = Modifier.padding(top = 8.dp))
        // Chips wrap onto a second line with large text, where a segmented row would cut the labels off.
        Choices(Mode.entries.map { it.name }, value.mode, { Mode.valueOf(it).label }) { onChange(value.copy(mode = it)) }
        Text("Behind each screen", style = MaterialTheme.typography.bodyLarge, modifier = Modifier.padding(top = 4.dp))
        Choices(listOf(Backdrop.EMBER, Backdrop.WASH, Backdrop.FLAT).map { it.name }, value.backdrop, { Backdrop.valueOf(it).label }) {
            onChange(value.copy(backdrop = it))
        }

        SectionHeader("Headings")
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            TypeStyle.entries.filter { it != TypeStyle.GLAM }.forEach { type ->
                FilterChip(
                    selected = value.type == type.name,
                    onClick = { onChange(value.copy(type = type.name)) },
                    label = { Text(type.label, fontFamily = headingFamily(type)) },
                )
            }
        }

        SectionHeader("Corners")
        Choices(Corners.entries.map { it.name }, value.corners, { Corners.valueOf(it).label }) { onChange(value.copy(corners = it)) }

        SectionHeader("Extras")
        SwitchRow("Glossy buttons", "A shine across the main buttons.", value.glossy) { onChange(value.copy(glossy = it)) }
        SwitchRow("Sparkles", "Sparkle bursts when you tick a set or pick a meal, and gem dividers.", value.sparkles) {
            onChange(value.copy(sparkles = it))
        }
        SwitchRow("Fun icons and wording", "Cute tab icons, little motifs and upbeat messages.", value.playful) {
            onChange(value.copy(playful = it))
        }
    }
}

@Composable
private fun Choices(keys: List<String>, selected: String, label: (String) -> String, onPick: (String) -> Unit) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
        keys.forEach { key ->
            FilterChip(selected = selected == key, onClick = { onPick(key) }, label = { Text(label(key)) })
        }
    }
}

@Composable
private fun ColourChoice(title: String, body: String, argb: Long, onPick: (Long) -> Unit) {
    SectionHeader(title)
    Text(body, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(2.dp),
        modifier = Modifier.padding(vertical = 4.dp),
    ) {
        Swatches.forEach { (option, name) ->
            val chosen = option == argb
            // A 48dp touch target around a 36dp swatch; screen readers hear the name and whether it's chosen.
            Box(
                Modifier
                    .size(48.dp)
                    .selectable(selected = chosen, role = Role.RadioButton) { onPick(option) }
                    .semantics { contentDescription = name },
                contentAlignment = Alignment.Center,
            ) {
                Box(
                    Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(Color(option.toInt()))
                        .border(if (chosen) 3.dp else 1.dp, if (chosen) MaterialTheme.colorScheme.onBackground else MaterialTheme.colorScheme.outlineVariant, CircleShape),
                ) {
                    if (chosen) {
                        Icon(
                            painterResource(R.drawable.ic_sparkle),
                            contentDescription = null,
                            tint = if (Tones.contrast(Color(option.toInt()), Color.White) >= 3f) Color.White else Color.Black,
                            modifier = Modifier.align(Alignment.Center).size(16.dp),
                        )
                    }
                }
            }
        }
    }
    val (hue, sat, light) = Tones.hsl(Color(argb.toInt()))
    Text("Fine-tune the shade", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    Slider(
        value = hue,
        onValueChange = { h -> onPick(Color.hsl(h.coerceIn(0f, 359.9f), sat.coerceAtLeast(0.35f), light.coerceIn(0.3f, 0.6f)).toArgb().toLong() and 0xFFFFFFFFL) },
        valueRange = 0f..359.9f,
        modifier = Modifier.semantics { contentDescription = "$title hue" },
    )
}
