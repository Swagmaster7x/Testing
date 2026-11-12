package com.personal.mealgym.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.personal.mealgym.BuildConfig
import com.personal.mealgym.R
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.ui.theme.Look
import com.personal.mealgym.ui.theme.Looks
import com.personal.mealgym.ui.theme.MealGymTheme
import com.personal.mealgym.ui.theme.ThemedBackground

fun themeFor(profile: Profile): Look = Looks.of(profile)

/** One door per person, each in their own look. The choice is remembered on this phone. */
@Composable
fun SideChooserScreen(people: List<Profile>, onChoose: (Long) -> Unit) {
    Box(
        Modifier
            .fillMaxSize()
            .background(Color(0xFF17131A)),
    ) {
        Column(
            Modifier
                .fillMaxSize()
                .safeDrawingPadding()
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Spacer(Modifier.height(24.dp))
            Text(
                if (BuildConfig.STORE) "Who's using the app?" else "Whose phone is this?",
                style = MaterialTheme.typography.headlineSmall,
                color = Color(0xFFF3ECF2),
                textAlign = TextAlign.Center,
            )
            Text(
                "Pick a door. You can switch any time in Settings.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color(0xFFBDB3BC),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 6.dp, bottom = 28.dp),
            )
            // Two doors to a row; a household of more gets shorter doors.
            Column(Modifier.fillMaxWidth().weight(1f), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                people.chunked(2).forEach { pair ->
                    Row(Modifier.fillMaxWidth().weight(1f), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        pair.forEach { Door(it, onChoose, Modifier.weight(1f)) }
                        if (pair.size == 1 && people.size > 1) Spacer(Modifier.weight(1f))
                    }
                }
            }
            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun Door(profile: Profile, onChoose: (Long) -> Unit, modifier: Modifier = Modifier) {
    val look = themeFor(profile)
    MealGymTheme(look = look) {
        val shape = RoundedCornerShape(topStart = 200.dp, topEnd = 200.dp, bottomStart = 6.dp, bottomEnd = 6.dp)
        val glam = look.key == Looks.Glam.key
        val iron = look.key == Looks.Iron.key
        val trim = when {
            glam -> Color(0xFFC9CED6)
            iron -> Color(0xFF5A4F48)
            else -> MaterialTheme.colorScheme.outline
        }
        val knob = when {
            glam -> Color(0xFFC9CED6)
            iron -> Color(0xFF8F877C)
            else -> MaterialTheme.colorScheme.secondary
        }
        Surface(
            shape = shape,
            border = BorderStroke(3.dp, trim),
            modifier = modifier
                .fillMaxHeight()
                .clip(shape)
                .clickable(role = Role.Button) { onChoose(profile.id) },
        ) {
            ThemedBackground {
                Column(
                    Modifier.fillMaxSize().padding(horizontal = 12.dp, vertical = 28.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    Icon(
                        painterResource(look.icon),
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(if (glam) 64.dp else if (iron) 96.dp else 72.dp),
                    )
                    Spacer(Modifier.height(16.dp))
                    Text(
                        Sides.planName(profile),
                        style = MaterialTheme.typography.titleLarge,
                        color = MaterialTheme.colorScheme.onBackground,
                        textAlign = TextAlign.Center,
                    )
                }
                // Door knob.
                Box(
                    Modifier
                        .align(Alignment.CenterEnd)
                        .padding(end = 12.dp)
                        .size(12.dp)
                        .clip(CircleShape)
                        .background(knob),
                )
            }
        }
    }
}
