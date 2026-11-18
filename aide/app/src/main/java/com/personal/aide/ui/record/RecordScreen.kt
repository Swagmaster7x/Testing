@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.record

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import com.personal.aide.data.db.SegmentEntity
import com.personal.aide.data.db.SegmentKind
import com.personal.aide.domain.Days
import com.personal.aide.transcribe.RecorderState
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.LevelMeter
import com.personal.aide.ui.theme.AideTheme

class RecordActions(
    val onBack: () -> Unit = {},
    val onPause: () -> Unit = {},
    val onResume: () -> Unit = {},
    val onStop: () -> Unit = {},
    val onFlag: () -> Unit = {},
    val onNote: (String) -> Unit = {},
    val onRename: (String) -> Unit = {},
)

@Composable
fun RecordScreen(state: RecorderState, segments: List<SegmentEntity>, now: Long, actions: RecordActions) {
    val paused = state.phase == RecorderState.Phase.PAUSED
    var noting by remember { mutableStateOf(false) }
    var flagged by remember { mutableStateOf(false) }

    // A phone on the table should stay awake while it listens.
    val view = LocalView.current
    DisposableEffect(view) {
        view.keepScreenOn = true
        onDispose { view.keepScreenOn = false }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (paused) "Paused" else "Recording") },
                navigationIcon = {
                    IconButton(onClick = actions.onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back. The recording keeps going.")
                    }
                },
            )
        },
        bottomBar = {
            Surface(color = MaterialTheme.colorScheme.surfaceContainer) {
                Row(
                    Modifier.fillMaxWidth().navigationBarsPadding().padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    FilledTonalIconButton(onClick = { actions.onFlag(); flagged = true }, modifier = Modifier.size(52.dp)) {
                        Icon(AideIcons.Flag, contentDescription = "Flag this moment as important")
                    }
                    FilledTonalIconButton(onClick = { noting = true }, modifier = Modifier.size(52.dp)) {
                        Icon(AideIcons.Note, contentDescription = "Add a note")
                    }
                    FilledTonalIconButton(onClick = if (paused) actions.onResume else actions.onPause, modifier = Modifier.size(52.dp)) {
                        Icon(if (paused) AideIcons.Play else AideIcons.Pause, contentDescription = if (paused) "Resume" else "Pause")
                    }
                    Button(
                        onClick = actions.onStop,
                        modifier = Modifier.weight(1f).height(52.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = AideTheme.colors.recording, contentColor = MaterialTheme.colorScheme.surfaceContainerLowest),
                    ) {
                        Icon(AideIcons.Stop, contentDescription = null, modifier = Modifier.size(20.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Stop & save")
                    }
                }
            }
        },
    ) { padding ->
        Column(Modifier.fillMaxSize().padding(padding)) {
            Column(Modifier.padding(horizontal = 20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text(
                        Days.clock(state.elapsed(now)),
                        // Equal-width digits, so the clock doesn't jiggle as it counts.
                        style = MaterialTheme.typography.displaySmall.copy(fontFeatureSettings = "tnum"),
                    )
                    LevelMeter(level = state.level, active = !paused)
                    Text(
                        state.notice ?: if (paused) "Not listening" else "Listening",
                        style = MaterialTheme.typography.bodyMedium,
                        color = if (state.notice != null) AideTheme.colors.warn else MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.weight(1f),
                    )
                }
                TitleField(state.title, actions.onRename)
            }
            Spacer(Modifier.height(8.dp))
            Transcript(segments, state.partial, Modifier.weight(1f))
        }
    }

    if (noting) {
        NoteDialog(onDismiss = { noting = false }, onSave = { actions.onNote(it); noting = false })
    }
    if (flagged) {
        LaunchedEffect(Unit) {
            kotlinx.coroutines.delay(1200)
            flagged = false
        }
    }
}

@Composable
private fun TitleField(title: String, onRename: (String) -> Unit) {
    var text by rememberSaveable(title) { mutableStateOf(title) }
    OutlinedTextField(
        value = text,
        onValueChange = { text = it },
        label = { Text("Meeting name (optional)") },
        singleLine = true,
        modifier = Modifier.fillMaxWidth().onFocusChanged { if (!it.isFocused && text.isNotBlank()) onRename(text) },
        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences, imeAction = ImeAction.Done),
        keyboardActions = KeyboardActions(onDone = { if (text.isNotBlank()) onRename(text) }),
    )
}

@Composable
private fun Transcript(segments: List<SegmentEntity>, partial: String, modifier: Modifier = Modifier) {
    val listState = rememberLazyListState()
    val rows = segments.size + if (partial.isNotBlank()) 1 else 0
    // Follow the conversation: keep the newest words in view.
    LaunchedEffect(rows, partial.length / 40) {
        if (rows > 0) listState.animateScrollToItem(rows - 1)
    }
    if (rows == 0) {
        Column(modifier.fillMaxWidth().padding(horizontal = 28.dp, vertical = 24.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Words appear here as people speak.", style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(
                "Put the phone where it can hear everyone, and let people know the meeting is being transcribed. You can lock the screen; Aide keeps listening.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        return
    }
    LazyColumn(
        modifier.fillMaxWidth(),
        state = listState,
        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 8.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        items(segments, key = { it.id }) { segment -> SegmentRow(segment) }
        if (partial.isNotBlank()) {
            item(key = "partial") {
                Text(
                    partial,
                    style = MaterialTheme.typography.bodyLarge.copy(fontStyle = FontStyle.Italic),
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(start = 52.dp),
                )
            }
        }
    }
}

/** One line of a transcript: when it was said, and the words; notes and flags stand out. */
@Composable
fun SegmentRow(segment: SegmentEntity, modifier: Modifier = Modifier) {
    Row(modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        Text(
            Days.clock(segment.offsetMs),
            style = MaterialTheme.typography.labelMedium.copy(fontFeatureSettings = "tnum"),
            color = MaterialTheme.colorScheme.outline,
            modifier = Modifier.width(42.dp).padding(top = 4.dp),
        )
        when (segment.kind) {
            SegmentKind.SPEECH -> Text(segment.text, style = MaterialTheme.typography.bodyLarge, modifier = Modifier.weight(1f))
            SegmentKind.NOTE -> Row(
                Modifier.weight(1f).background(MaterialTheme.colorScheme.tertiaryContainer, MaterialTheme.shapes.small).padding(horizontal = 12.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Icon(AideIcons.Note, contentDescription = "Your note", tint = MaterialTheme.colorScheme.onTertiaryContainer, modifier = Modifier.size(18.dp))
                Text(segment.text, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onTertiaryContainer)
            }
            SegmentKind.FLAG -> Row(Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Icon(AideIcons.Flag, contentDescription = null, tint = AideTheme.colors.warn, modifier = Modifier.size(16.dp))
                Text("Flagged as important", style = MaterialTheme.typography.labelLarge, color = AideTheme.colors.warn)
            }
        }
    }
}

@Composable
private fun NoteDialog(onDismiss: () -> Unit, onSave: (String) -> Unit) {
    var text by remember { mutableStateOf("") }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add a note") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    "Aide trusts what you type over what it heard. Good for names, numbers, and who took a task.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                OutlinedTextField(
                    value = text,
                    onValueChange = { text = it },
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 3,
                    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                )
            }
        },
        confirmButton = { TextButton(onClick = { onSave(text) }, enabled = text.isNotBlank()) { Text("Add") } },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
    )
}
