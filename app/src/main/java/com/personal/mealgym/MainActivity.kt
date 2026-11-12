package com.personal.mealgym

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.remember
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.compose.ui.Modifier
import com.personal.mealgym.ui.LocalCopy
import com.personal.mealgym.ui.MealGymNavHost
import com.personal.mealgym.ui.SideCopy
import com.personal.mealgym.ui.SideChooserScreen
import com.personal.mealgym.ui.people.FirstPersonScreen
import com.personal.mealgym.ui.theme.MealGymTheme
import com.personal.mealgym.ui.theme.ThemedBackground
import com.personal.mealgym.ui.themeFor
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.map

class MainActivity : ComponentActivity() {

    /** A screen to jump to, e.g. from the sauna notification. */
    private val pendingOpen = MutableStateFlow<String?>(null)

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        if (savedInstanceState == null) pendingOpen.value = intent?.getStringExtra(EXTRA_OPEN)
        val container = (application as MealGymApp).container
        container.monetization.onActivityCreated(this)
        setContent {
            val opening by container.opening.collectAsStateWithLifecycle()
            when (val o = opening) {
                Opening.Loading -> MealGymTheme { ThemedBackground { Box(Modifier.fillMaxSize()) } }
                Opening.FirstPerson -> FirstPersonScreen()
                is Opening.Choose -> MealGymTheme { SideChooserScreen(o.people, onChoose = container::chooseSide) }
                // Keyed by person, so switching starts every screen afresh on the other person's data.
                // Edits to the same person (look, snack slot...) apply in place.
                is Opening.Open -> key(o.profile.id) {
                    val profile = o.profile
                    val motion by remember(profile.id) { container.settings.settings(profile.id).map { it.motion } }
                        .collectAsStateWithLifecycle(initialValue = true)
                    MealGymTheme(side = themeFor(profile), motion = motion) {
                        CompositionLocalProvider(LocalCopy provides SideCopy.forProfile(profile)) {
                            MealGymNavHost(
                                profile = profile,
                                banner = { container.monetization.Banner(it) },
                                pendingOpen = pendingOpen,
                                onOpenHandled = { pendingOpen.value = null },
                            )
                        }
                    }
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        intent.getStringExtra(EXTRA_OPEN)?.let { pendingOpen.value = it }
    }

    companion object {
        const val EXTRA_OPEN = "open"
        const val OPEN_SAUNA = "sauna"
    }
}
