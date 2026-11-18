package com.personal.aide.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ThumbUp
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.personal.aide.ui.theme.AideTheme

/** The app's one card: a white (or raised, at night) panel with a hairline edge and no shadow. */
@Composable
fun AideCard(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    container: Color = MaterialTheme.colorScheme.surfaceContainerLow,
    padding: Dp = 16.dp,
    content: @Composable ColumnScope.() -> Unit,
) {
    val shape = MaterialTheme.shapes.medium
    val border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
    if (onClick != null) {
        Surface(onClick = onClick, modifier = modifier.fillMaxWidth(), shape = shape, color = container, border = border) {
            Column(Modifier.padding(padding), content = content)
        }
    } else {
        Surface(modifier = modifier.fillMaxWidth(), shape = shape, color = container, border = border) {
            Column(Modifier.padding(padding), content = content)
        }
    }
}

@Composable
fun SectionHeader(title: String, modifier: Modifier = Modifier, action: String? = null, onAction: (() -> Unit)? = null) {
    Row(modifier.fillMaxWidth().padding(top = 8.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(
            title,
            style = MaterialTheme.typography.titleSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.weight(1f),
        )
        if (action != null && onAction != null) {
            TextButton(onClick = onAction) { Text(action) }
        }
    }
}

enum class Tone { NEUTRAL, INFO, GOOD, WARN, BAD, ASSISTANT }

@Composable
private fun toneColors(tone: Tone): Pair<Color, Color> {
    val scheme = MaterialTheme.colorScheme
    val extras = AideTheme.colors
    return when (tone) {
        Tone.NEUTRAL -> scheme.surfaceContainerHigh to scheme.onSurfaceVariant
        Tone.INFO -> scheme.primaryContainer to scheme.onPrimaryContainer
        Tone.GOOD -> extras.goodContainer to extras.onGoodContainer
        Tone.WARN -> extras.warnContainer to extras.onWarnContainer
        Tone.BAD -> scheme.errorContainer to scheme.onErrorContainer
        Tone.ASSISTANT -> scheme.tertiaryContainer to scheme.onTertiaryContainer
    }
}

/** A small rounded label: a status, a count, a date. */
@Composable
fun Pill(text: String, modifier: Modifier = Modifier, tone: Tone = Tone.NEUTRAL, icon: ImageVector? = null) {
    val (background, foreground) = toneColors(tone)
    Row(
        modifier.clip(RoundedCornerShape(50)).background(background).padding(horizontal = 9.dp, vertical = 3.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        if (icon != null) Icon(icon, contentDescription = null, tint = foreground, modifier = Modifier.size(13.dp))
        Text(text, style = MaterialTheme.typography.labelMedium, color = foreground, maxLines = 1, overflow = TextOverflow.Ellipsis)
    }
}

/** A message in the middle of a screen that has nothing to show yet. */
@Composable
fun EmptyState(
    icon: ImageVector,
    title: String,
    body: String,
    modifier: Modifier = Modifier,
    action: String? = null,
    onAction: (() -> Unit)? = null,
) {
    Column(
        modifier.fillMaxWidth().padding(horizontal = 32.dp, vertical = 40.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Box(
            Modifier.size(64.dp).clip(CircleShape).background(MaterialTheme.colorScheme.primaryContainer),
            contentAlignment = Alignment.Center,
        ) {
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.onPrimaryContainer, modifier = Modifier.size(30.dp))
        }
        Text(title, style = MaterialTheme.typography.titleMedium, textAlign = TextAlign.Center)
        Text(
            body,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
        )
        if (action != null && onAction != null) {
            Spacer(Modifier.height(4.dp))
            Button(onClick = onAction) { Text(action) }
        }
    }
}

/** A coloured strip for something the user should know or fix, with an optional button. */
@Composable
fun Banner(
    text: String,
    modifier: Modifier = Modifier,
    tone: Tone = Tone.INFO,
    icon: ImageVector? = null,
    action: String? = null,
    onAction: (() -> Unit)? = null,
) {
    val (background, foreground) = toneColors(tone)
    Surface(modifier = modifier.fillMaxWidth(), shape = MaterialTheme.shapes.medium, color = background) {
        Row(Modifier.padding(start = 14.dp, end = 6.dp, top = 8.dp, bottom = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            if (icon != null) {
                Icon(icon, contentDescription = null, tint = foreground, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(10.dp))
            }
            Text(text, style = MaterialTheme.typography.bodyMedium, color = foreground, modifier = Modifier.weight(1f).padding(vertical = 6.dp))
            if (action != null && onAction != null) {
                TextButton(onClick = onAction) { Text(action, color = foreground) }
            }
        }
    }
}

/**
 * A fixed first row for lists whose top rows come and go. A lazy list keeps whatever row is at
 * the top in place when rows are added above it, which would leave a new banner or card just out
 * of sight; with this always first, new rows appear below it, on screen.
 */
fun LazyListScope.topAnchor() {
    item(key = "top-anchor") { Spacer(Modifier.height(1.dp)) }
}

/** A spinner with a line saying what is being waited for. */
@Composable
fun Working(text: String, modifier: Modifier = Modifier) {
    Row(modifier, verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        CircularProgressIndicator(Modifier.size(18.dp), strokeWidth = 2.dp)
        Text(text, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

/** Thumbs up and down for something the assistant produced. Tapping the chosen one again clears it. */
@Composable
fun RatingRow(rating: Int, onRate: (Int) -> Unit, modifier: Modifier = Modifier, label: String? = null) {
    Row(modifier, verticalAlignment = Alignment.CenterVertically) {
        if (label != null) {
            Text(label, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.weight(1f))
        }
        IconButton(onClick = { onRate(if (rating > 0) 0 else 1) }) {
            Icon(
                Icons.Filled.ThumbUp,
                contentDescription = if (rating > 0) "Marked as good. Tap to clear." else "This was good",
                tint = if (rating > 0) AideTheme.colors.good else MaterialTheme.colorScheme.outline,
                modifier = Modifier.size(20.dp),
            )
        }
        IconButton(onClick = { onRate(if (rating < 0) 0 else -1) }) {
            Icon(
                AideIcons.ThumbDown,
                contentDescription = if (rating < 0) "Marked as wrong. Tap to clear." else "This was wrong",
                tint = if (rating < 0) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.outline,
                modifier = Modifier.size(20.dp),
            )
        }
    }
}

/** A titled list of short points, as used throughout meeting notes and reviews. */
@Composable
fun BulletSection(title: String, items: List<String>, modifier: Modifier = Modifier, tone: Tone = Tone.NEUTRAL) {
    if (items.isEmpty()) return
    val dot = when (tone) {
        Tone.GOOD -> AideTheme.colors.good
        Tone.WARN -> AideTheme.colors.warn
        Tone.BAD -> MaterialTheme.colorScheme.error
        Tone.ASSISTANT -> MaterialTheme.colorScheme.tertiary
        else -> MaterialTheme.colorScheme.primary
    }
    Column(modifier, verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(title, style = MaterialTheme.typography.titleSmall)
        for (item in items) Bullet(item, dot)
    }
}

@Composable
fun Bullet(text: String, dot: Color = MaterialTheme.colorScheme.primary, style: TextStyle = MaterialTheme.typography.bodyMedium) {
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        Box(Modifier.padding(top = 8.dp).size(6.dp).clip(CircleShape).background(dot))
        Text(inlineMarkdown(text), style = style, modifier = Modifier.weight(1f))
    }
}

/** Turns `**bold**` into bold text; everything else is left as written. */
fun inlineMarkdown(text: String): AnnotatedString = buildAnnotatedString {
    var index = 0
    while (index < text.length) {
        val open = text.indexOf("**", index)
        val close = if (open >= 0) text.indexOf("**", open + 2) else -1
        if (open < 0 || close < 0) {
            append(text.substring(index))
            break
        }
        append(text.substring(index, open))
        withStyle(SpanStyle(fontWeight = FontWeight.SemiBold)) { append(text.substring(open + 2, close)) }
        index = close + 2
    }
}

/**
 * Shows the assistant's prose: paragraphs, "- " and "1." lists and **bold**. Deliberately small,
 * since the assistant is asked to write for a phone screen and not to use tables or headings.
 */
@Composable
fun AssistantText(text: String, modifier: Modifier = Modifier, style: TextStyle = MaterialTheme.typography.bodyLarge) {
    Column(modifier, verticalArrangement = Arrangement.spacedBy(6.dp)) {
        for (line in text.trim().lines()) {
            val trimmed = line.trim()
            when {
                trimmed.isEmpty() -> Spacer(Modifier.height(2.dp))
                trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ") ->
                    Bullet(trimmed.drop(2).trim(), MaterialTheme.colorScheme.onSurfaceVariant, style)
                trimmed.startsWith("#") ->
                    Text(inlineMarkdown(trimmed.trimStart('#').trim()), style = style.copy(fontWeight = FontWeight.SemiBold))
                else -> Text(inlineMarkdown(trimmed), style = style)
            }
        }
    }
}

/** A row that reads as one tappable setting or link: title, optional detail, something at the end. */
@Composable
fun ListRow(
    title: String,
    modifier: Modifier = Modifier,
    detail: String? = null,
    icon: ImageVector? = null,
    onClick: (() -> Unit)? = null,
    trailing: @Composable RowScope.() -> Unit = {},
) {
    Row(
        modifier
            .fillMaxWidth()
            .then(if (onClick != null) Modifier.clickable(role = Role.Button, onClick = onClick) else Modifier)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        if (icon != null) Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(22.dp))
        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
            Text(title, style = MaterialTheme.typography.bodyLarge)
            if (!detail.isNullOrBlank()) {
                Text(detail, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        trailing()
    }
}

/** How loud the room is: five bars that fill from the left. */
@Composable
fun LevelMeter(level: Float, active: Boolean, modifier: Modifier = Modifier) {
    val on = if (active) AideTheme.colors.recording else MaterialTheme.colorScheme.outline
    val off = MaterialTheme.colorScheme.outlineVariant
    Row(
        modifier.semantics { contentDescription = if (active) "Listening" else "Not listening" },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(3.dp),
    ) {
        val heights = listOf(8, 14, 20, 14, 8)
        heights.forEachIndexed { index, height ->
            val lit = active && level * heights.size > index - 0.2f
            Box(Modifier.width(4.dp).height(height.dp).clip(RoundedCornerShape(2.dp)).background(if (lit) on else off))
        }
    }
}
