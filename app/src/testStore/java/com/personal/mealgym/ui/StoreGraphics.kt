package com.personal.mealgym.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.github.takahirom.roborazzi.captureRoboImage
import com.personal.mealgym.R
import com.personal.mealgym.ui.theme.MealGymTheme
import com.personal.mealgym.ui.theme.SideTheme
import com.personal.mealgym.ui.theme.ThemedBackground
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

/** The Play listing's hi-res icon (512 x 512) and feature graphic (1024 x 500), drawn from the app's own artwork. */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
class StoreGraphics {

    @get:Rule
    val compose = createComposeRule()

    @Test
    @Config(sdk = [35], qualifiers = "w512dp-h512dp-mdpi")
    fun icon() {
        compose.setContent {
            // Full square; Google Play rounds the corners itself.
            Box(Modifier.size(512.dp).background(Color(0xFF120F0D)).testTag("art")) {
                Image(
                    painterResource(R.drawable.ic_launcher_foreground),
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize().scale(1.3f),
                )
            }
        }
        compose.onNodeWithTag("art").captureRoboImage("build/outputs/roborazzi/play-icon-512.png")
    }

    @Test
    @Config(sdk = [35], qualifiers = "w1024dp-h500dp-night-mdpi")
    fun featureGraphic() {
        compose.setContent {
            MealGymTheme(side = SideTheme.IRON, darkTheme = true) {
                Box(Modifier.size(1024.dp, 500.dp).testTag("art")) {
                    ThemedBackground {
                        Row(
                            Modifier.fillMaxSize().padding(horizontal = 56.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Box(Modifier.size(220.dp).background(Color(0xFF120F0D), RoundedCornerShape(48.dp))) {
                                Image(
                                    painterResource(R.drawable.ic_launcher_foreground),
                                    contentDescription = null,
                                    modifier = Modifier.fillMaxSize().scale(1.3f),
                                )
                            }
                            Spacer(Modifier.width(48.dp))
                            Column(Modifier.weight(1f)) {
                                Text(
                                    "Meal & Gym",
                                    style = MaterialTheme.typography.displayMedium.copy(fontSize = 64.sp, lineHeight = 70.sp),
                                    color = MaterialTheme.colorScheme.onBackground,
                                )
                                Spacer(Modifier.height(12.dp))
                                Text(
                                    "Plan your meals. Shop once. Log every set.",
                                    style = MaterialTheme.typography.titleLarge.copy(fontSize = 26.sp, lineHeight = 34.sp),
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                                Spacer(Modifier.height(28.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                                    LookChip(SideTheme.IRON, "Dark fantasy", R.drawable.ic_launcher_monochrome)
                                    LookChip(SideTheme.GLAM, "Y2K glam", R.drawable.ic_star)
                                }
                            }
                        }
                    }
                }
            }
        }
        compose.onNodeWithTag("art").captureRoboImage("build/outputs/roborazzi/play-feature-graphic.png")
    }

    @Composable
    private fun LookChip(look: SideTheme, label: String, icon: Int) {
        MealGymTheme(side = look, darkTheme = look == SideTheme.IRON) {
            Surface(shape = RoundedCornerShape(28.dp), color = MaterialTheme.colorScheme.primaryContainer) {
                Row(Modifier.padding(horizontal = 20.dp, vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(painterResource(icon), contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(26.dp))
                    Spacer(Modifier.width(10.dp))
                    Text(label, style = MaterialTheme.typography.titleMedium.copy(fontSize = 20.sp), color = MaterialTheme.colorScheme.onPrimaryContainer)
                }
            }
        }
    }
}
