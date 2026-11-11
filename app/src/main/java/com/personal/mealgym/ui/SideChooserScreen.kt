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
import com.personal.mealgym.R
import com.personal.mealgym.data.Profiles
import com.personal.mealgym.ui.theme.MealGymTheme
import com.personal.mealgym.ui.theme.SideTheme
import com.personal.mealgym.ui.theme.ThemedBackground

fun themeFor(profileId: Long): SideTheme = if (profileId == Profiles.ASHLEY) SideTheme.GLAM else SideTheme.IRON

/** First launch: two doors, one per side. The choice is remembered on this phone. */
@Composable
fun SideChooserScreen(onChoose: (Long) -> Unit) {
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
                "Whose phone is this?",
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
            Row(
                Modifier.fillMaxWidth().weight(1f),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                Door(Profiles.SWAG, R.drawable.ic_launcher_monochrome, onChoose, Modifier.weight(1f))
                Door(Profiles.ASHLEY, R.drawable.ic_star, onChoose, Modifier.weight(1f))
            }
            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun Door(profileId: Long, icon: Int, onChoose: (Long) -> Unit, modifier: Modifier = Modifier) {
    MealGymTheme(side = themeFor(profileId)) {
        val shape = RoundedCornerShape(topStart = 200.dp, topEnd = 200.dp, bottomStart = 6.dp, bottomEnd = 6.dp)
        val glam = profileId == Profiles.ASHLEY
        Surface(
            shape = shape,
            border = BorderStroke(3.dp, if (glam) Color(0xFFC9CED6) else Color(0xFF5A4F48)),
            modifier = modifier
                .fillMaxHeight()
                .clip(shape)
                .clickable(role = Role.Button) { onChoose(profileId) },
        ) {
            ThemedBackground {
                Column(
                    Modifier.fillMaxSize().padding(horizontal = 12.dp, vertical = 28.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    Icon(
                        painterResource(icon),
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(if (glam) 64.dp else 96.dp),
                    )
                    Spacer(Modifier.height(16.dp))
                    Text(
                        Profiles.sideName(profileId),
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
                        .background(if (glam) Color(0xFFC9CED6) else Color(0xFF8F877C)),
                )
            }
        }
    }
}
