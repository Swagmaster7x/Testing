package com.personal.mealgym

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.personal.mealgym.ui.MealGymNavHost
import com.personal.mealgym.ui.theme.MealGymTheme
import kotlinx.coroutines.flow.MutableStateFlow

class MainActivity : ComponentActivity() {

    /** A screen to jump to, e.g. from the sauna notification. */
    private val pendingOpen = MutableStateFlow<String?>(null)

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        if (savedInstanceState == null) pendingOpen.value = intent?.getStringExtra(EXTRA_OPEN)
        setContent {
            MealGymTheme {
                MealGymNavHost(
                    pendingOpen = pendingOpen,
                    onOpenHandled = { pendingOpen.value = null },
                )
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
