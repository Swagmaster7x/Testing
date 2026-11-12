package com.personal.mealgym.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import com.personal.mealgym.ui.theme.LocalLook
import com.personal.mealgym.ui.theme.LocalMotion
import com.personal.mealgym.ui.theme.Look
import com.personal.mealgym.ui.theme.Looks
import com.personal.mealgym.ui.theme.Tones
import kotlin.math.cos
import kotlin.math.sin

/** Brand-free Y2K colours for Ashley's Side. */
object GlamColors {
    val HotPink = Color(0xFFFF2E93)
    val DeepPink = Color(0xFFB00A5F)
    val Lilac = Color(0xFFB58CFF)
    val Chrome = Color(0xFFC9CED6)
    val BabyBlue = Color(0xFF8FD3FF)
    val Lime = Color(0xFFC6F432)
}

/** The look's decoration colour: lilac for Y2K glam, otherwise the scheme's tertiary. */
@Composable
fun Look.accentColor(): Color = accent ?: MaterialTheme.colorScheme.tertiary

/**
 * The main filled button: the standard button, or for glossy looks a pill with a white shine
 * across the top third (hot pink on Y2K glam, the look's own colour elsewhere).
 */
@Composable
fun AppButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    contentPadding: PaddingValues = ButtonDefaults.ContentPadding,
    content: @Composable RowScope.() -> Unit,
) {
    val look = LocalLook.current
    if (!look.glossyButtons) {
        Button(onClick = onClick, modifier = modifier, enabled = enabled, contentPadding = contentPadding, content = content)
        return
    }
    val pill = RoundedCornerShape(50)
    val glam = look.key == Looks.Glam.key
    val scheme = MaterialTheme.colorScheme
    val glow = if (glam) GlamColors.HotPink else scheme.primary
    val gloss = when {
        glam && enabled -> listOf(GlamColors.HotPink, Color(0xFFD7197A), GlamColors.DeepPink)
        glam -> listOf(Color(0xFFD9A3C0), Color(0xFFC995B2))
        enabled -> listOf(Tones.mix(scheme.primary, Color.White, 0.12f), scheme.primary, Tones.mix(scheme.primary, Color.Black, 0.12f))
        else -> listOf(scheme.onSurface.copy(alpha = 0.18f), scheme.onSurface.copy(alpha = 0.12f))
    }
    val textColor = if (glam) Color.White else scheme.onPrimary
    Button(
        onClick = onClick,
        modifier = modifier
            .shadow(if (enabled) 6.dp else 0.dp, pill, ambientColor = glow, spotColor = glow)
            .clip(pill)
            .drawBehind { drawGloss(gloss) },
        enabled = enabled,
        shape = pill,
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.Transparent,
            contentColor = textColor,
            disabledContainerColor = Color.Transparent,
            disabledContentColor = if (glam) Color.White.copy(alpha = 0.8f) else scheme.onSurface.copy(alpha = 0.6f),
        ),
        contentPadding = contentPadding,
        content = content,
    )
}

/** Y2K glam's gradient is deep enough at the middle that white text stays above 4.5:1. */
private fun DrawScope.drawGloss(colors: List<Color>) {
    drawRect(Brush.verticalGradient(colors))
    val shineHeight = size.height / 3f
    drawRoundRect(
        brush = Brush.verticalGradient(listOf(Color.White.copy(alpha = 0.55f), Color.White.copy(alpha = 0.08f)), endY = shineHeight),
        topLeft = Offset(size.height / 4f, 2f),
        size = Size(size.width - size.height / 2f, shineHeight),
        cornerRadius = CornerRadius(shineHeight / 2f),
    )
}

/** A row of small dots in the look's colour, under section titles. */
@Composable
fun DotRule(modifier: Modifier = Modifier) {
    val color = MaterialTheme.colorScheme.primary.copy(alpha = 0.55f)
    Canvas(modifier.fillMaxWidth().height(6.dp)) {
        val step = 9.dp.toPx()
        var x = 2.dp.toPx()
        while (x < size.width) {
            drawCircle(color, 1.4.dp.toPx(), Offset(x, size.height / 2f))
            x += step
        }
    }
}

/** A line of little chrome and pink rhinestones, used under section titles on Ashley's Side. */
@Composable
fun Rhinestones(modifier: Modifier = Modifier) {
    val pink = MaterialTheme.colorScheme.primary
    Canvas(modifier.fillMaxWidth().height(8.dp)) {
        val step = 10.dp.toPx()
        var x = 3.dp.toPx()
        var i = 0
        while (x < size.width) {
            val color = if (i % 3 == 1) pink else GlamColors.Chrome
            val r = if (i % 3 == 1) 2.6.dp.toPx() else 2.dp.toPx()
            drawCircle(color, r, Offset(x, size.height / 2f))
            drawCircle(Color.White.copy(alpha = 0.8f), r / 3f, Offset(x - r / 3f, size.height / 2f - r / 3f))
            x += step
            i++
        }
    }
}

/**
 * A short sparkle burst over this element whenever [key] changes (a set ticked, a meal picked).
 * Only on Ashley's Side with Motion on; it plays once and stops.
 */
fun Modifier.sparkleOn(key: Any?): Modifier = composed {
    val look = LocalLook.current
    if (!look.sparkles || !LocalMotion.current) return@composed this
    val progress = remember { Animatable(1f) }
    val first = remember { booleanArrayOf(true) }
    LaunchedEffect(key) {
        if (first[0]) {
            first[0] = false
        } else {
            progress.snapTo(0f)
            progress.animateTo(1f, tween(650, easing = FastOutSlowInEasing))
        }
    }
    val scheme = MaterialTheme.colorScheme
    val colors = if (look.key == Looks.Glam.key) {
        listOf(GlamColors.HotPink, GlamColors.Lilac, GlamColors.BabyBlue, GlamColors.Lime)
    } else {
        listOf(scheme.primary, scheme.secondary, scheme.tertiary, look.accentColor())
    }
    drawWithContent {
        drawContent()
        val p = progress.value
        if (p >= 1f) return@drawWithContent
        val center = Offset(size.width / 2f, size.height / 2f)
        val reach = size.minDimension * 0.75f + 24.dp.toPx()
        for (i in 0 until 10) {
            val angle = Math.toRadians(i * 36.0 + 12.0)
            val d = reach * (0.25f + 0.75f * p)
            val pos = center + Offset((cos(angle) * d).toFloat(), (sin(angle) * d).toFloat())
            drawSparkle(pos, (7.dp.toPx() * (1f - p * 0.5f)), colors[i % colors.size].copy(alpha = 1f - p))
        }
    }
}

/** A four-point sparkle centred on [center]. */
fun DrawScope.drawSparkle(center: Offset, radius: Float, color: Color) {
    val r = radius
    val w = radius * 0.28f
    val path = Path().apply {
        moveTo(center.x, center.y - r)
        quadraticTo(center.x + w, center.y - w, center.x + r, center.y)
        quadraticTo(center.x + w, center.y + w, center.x, center.y + r)
        quadraticTo(center.x - w, center.y + w, center.x - r, center.y)
        quadraticTo(center.x - w, center.y - w, center.x, center.y - r)
        close()
    }
    drawPath(path, color)
}

/** A title with a gentle light sweep (two passes when the screen opens) on Ashley's Side. */
@Composable
fun ShimmerTitle(text: String, style: TextStyle, modifier: Modifier = Modifier) {
    val base = MaterialTheme.colorScheme.primary
    val sparkly = LocalLook.current.sparkles
    if (!sparkly || !LocalMotion.current) {
        Text(text, style = style, color = if (sparkly) base else Color.Unspecified, modifier = modifier)
        return
    }
    val sweep = remember { Animatable(-0.4f) }
    LaunchedEffect(Unit) {
        repeat(2) {
            sweep.snapTo(-0.4f)
            sweep.animateTo(1.4f, tween(1400, easing = LinearEasing))
        }
    }
    val x = sweep.value * 600f
    val brush = Brush.linearGradient(
        colors = listOf(base, Color.White, base),
        start = Offset(x - 120f, 0f),
        end = Offset(x + 120f, 60f),
    )
    Text(text, style = style.copy(brush = brush), modifier = modifier)
}

/** A small row of the look's motifs, used as a footer flourish. */
@Composable
fun MotifStrip(modifier: Modifier = Modifier) {
    val look = LocalLook.current
    val icons = look.motifs
    if (icons.isEmpty()) return
    val accent = look.accentColor()
    androidx.compose.foundation.layout.Row(
        modifier.fillMaxWidth(),
        horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(14.dp, androidx.compose.ui.Alignment.CenterHorizontally),
    ) {
        icons.forEachIndexed { i, icon ->
            androidx.compose.material3.Icon(
                androidx.compose.ui.res.painterResource(icon),
                contentDescription = null,
                tint = if (i % 2 == 0) accent else MaterialTheme.colorScheme.primary.copy(alpha = 0.7f),
                modifier = androidx.compose.ui.Modifier.size(18.dp),
            )
        }
    }
}
