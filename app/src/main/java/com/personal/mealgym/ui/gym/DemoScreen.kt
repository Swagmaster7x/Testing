package com.personal.mealgym.ui.gym

import android.content.ActivityNotFoundException
import android.content.Intent
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.keyframes
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.produceState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.core.net.toUri
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.AppContainer
import com.personal.mealgym.BuildConfig
import com.personal.mealgym.data.Demo
import com.personal.mealgym.data.DemoRepository
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.theme.LocalMotion
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class DemoViewModel(private val c: AppContainer, handle: SavedStateHandle) : MessageViewModel() {
    val demo: Demo = c.demos.demoFor(handle.get<String>("name").orEmpty())

    fun frame(path: String): ImageBitmap? = c.demos.frame(path)
}

/** Loads a bundled frame off the main thread. */
@Composable
fun rememberFrame(path: String?, load: (String) -> ImageBitmap?): ImageBitmap? {
    val bitmap by produceState<ImageBitmap?>(null, path) {
        value = path?.let { withContext(Dispatchers.IO) { load(it) } }
    }
    return bitmap
}

/**
 * The two-frame demo: start and end positions cross-fading about once a second, with the
 * written instructions underneath. With Motion off the two frames sit side by side.
 */
@Composable
fun DemoScreen(nav: AppNavigator, vm: DemoViewModel = viewModel(factory = AppViewModels.Factory)) {
    val demo = vm.demo
    val context = LocalContext.current
    val watch: () -> Unit = {
        try {
            context.startActivity(Intent(Intent.ACTION_VIEW, DemoRepository.searchUrl(demo.exerciseName).toUri()))
        } catch (_: ActivityNotFoundException) {
            // No browser on the phone: nothing else to do.
        }
    }

    AppScaffold(topBar = { DetailTopBar(title = demo.exerciseName, onBack = nav::back) }) { padding ->
        Column(
            Modifier.fillMaxSize().padding(padding).verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            when (demo) {
                is Demo.Photos -> {
                    val start = rememberFrame(demo.frames[0], vm::frame)
                    val end = rememberFrame(demo.frames[1], vm::frame)
                    if (LocalMotion.current) FlipBook(start, end) else SideBySide(start, end)
                    SectionHeader("How to do it")
                    demo.instructions.forEachIndexed { i, step ->
                        Row {
                            Text("${i + 1}.", modifier = Modifier.width(28.dp), fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.primary)
                            Text(step, style = MaterialTheme.typography.bodyLarge)
                        }
                    }
                    Text(
                        "Photos and steps: free-exercise-db (public domain), shown as \"${demo.datasetName}\".",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                is Demo.Cues -> {
                    Text(
                        if (BuildConfig.STORE) "Three quick form cues." else "No photo for this one, so here are three quick form cues.",
                        style = MaterialTheme.typography.bodyLarge,
                    )
                    demo.cues.forEachIndexed { i, cue ->
                        Row {
                            Text("${i + 1}.", modifier = Modifier.width(28.dp), fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.primary)
                            Text(cue, style = MaterialTheme.typography.bodyLarge)
                        }
                    }
                }
                is Demo.None -> Text("There's no demo saved for this exercise.", style = MaterialTheme.typography.bodyLarge)
            }
            OutlinedButton(onClick = watch, modifier = Modifier.fillMaxWidth()) { Text("Watch a demo (opens a web search)") }
        }
    }
}

@Composable
private fun FlipBook(start: ImageBitmap?, end: ImageBitmap?) {
    // Hold the start, fade to the end, hold, fade back: one full flip every two seconds.
    val endAlpha by rememberInfiniteTransition(label = "flip").animateFloat(
        initialValue = 0f,
        targetValue = 0f,
        animationSpec = infiniteRepeatable(
            keyframes {
                durationMillis = 2000
                0f at 0 using LinearEasing
                0f at 700 using LinearEasing
                1f at 1000 using LinearEasing
                1f at 1700 using LinearEasing
                0f at 2000
            },
            repeatMode = RepeatMode.Restart,
        ),
        label = "end",
    )
    Box(
        Modifier
            .fillMaxWidth()
            .aspectRatio(1f)
            .clip(MaterialTheme.shapes.large)
            .background(MaterialTheme.colorScheme.surfaceContainerHigh),
        contentAlignment = Alignment.Center,
    ) {
        start?.let { Image(it, contentDescription = "Start position", contentScale = ContentScale.Fit, modifier = Modifier.fillMaxSize()) }
        end?.let { Image(it, contentDescription = "End position", contentScale = ContentScale.Fit, modifier = Modifier.fillMaxSize().alpha(endAlpha)) }
    }
}

@Composable
private fun SideBySide(start: ImageBitmap?, end: ImageBitmap?) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        listOf(start to "Start", end to "End").forEach { (bitmap, label) ->
            Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
                Box(
                    Modifier.fillMaxWidth().aspectRatio(1f).clip(MaterialTheme.shapes.medium)
                        .background(MaterialTheme.colorScheme.surfaceContainerHigh),
                ) {
                    bitmap?.let { Image(it, contentDescription = "$label position", contentScale = ContentScale.Fit, modifier = Modifier.fillMaxSize()) }
                }
                Text(label, style = MaterialTheme.typography.labelLarge, modifier = Modifier.padding(top = 4.dp))
            }
        }
    }
}
