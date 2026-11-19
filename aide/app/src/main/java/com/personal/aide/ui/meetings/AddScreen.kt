@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.meetings

import android.graphics.BitmapFactory
import android.net.Uri
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.ai.IntakeState
import com.personal.aide.data.DocumentException
import com.personal.aide.data.Material
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.domain.wordCount
import com.personal.aide.ui.components.AideCard
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.Banner
import com.personal.aide.ui.components.Tone
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File

/** What the user says they are adding, which decides how Aide reads it. */
enum class AddKind { MEETING, REFERENCE }

data class AddState(
    val kind: AddKind = AddKind.MEETING,
    val materials: List<Material> = emptyList(),
    /** A file is being opened on the phone. */
    val opening: Boolean = false,
    val intake: IntakeState = IntakeState.Idle,
    val error: String? = null,
    val hasKey: Boolean = true,
) {
    /** Pictures and PDF pages, which Claude has to read. */
    val pageCount: Int get() = materials.sumOf { if (it is Material.Pages) it.files.size else 0 }
    val working: Boolean get() = intake is IntakeState.Working
}

/** Adds [added] to the list, letting photographs taken one after another collect into one set. */
fun joinMaterial(materials: List<Material>, added: Material): List<Material> {
    val last = materials.lastOrNull()
    return if (added is Material.Pages && added.photos && last is Material.Pages && last.photos) {
        materials.dropLast(1) + Material.Pages("Photos", last.files + added.files, photos = true)
    } else {
        materials + added
    }
}

class AddViewModel(private val container: AppContainer, kind: AddKind) : ViewModel() {
    private data class Local(val kind: AddKind, val materials: List<Material> = emptyList(), val opening: Boolean = false, val error: String? = null)

    private val local = MutableStateFlow(Local(kind))

    val state: StateFlow<AddState> = combine(local, container.intake.state, container.secrets.hasKey) { local, intake, hasKey ->
        AddState(local.kind, local.materials, local.opening, intake, local.error, hasKey)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), AddState(kind = kind))

    init {
        // A result left over from something added earlier belongs to that screen, not this one.
        if (container.intake.state.value is IntakeState.Done) container.intake.acknowledge()
    }

    fun setKind(kind: AddKind) = local.update { it.copy(kind = kind) }

    fun addFiles(uris: List<Uri>) {
        if (uris.isEmpty()) return
        local.update { it.copy(opening = true, error = null) }
        viewModelScope.launch {
            val problems = ArrayList<String>()
            for (uri in uris) {
                try {
                    val material = container.documents.read(uri)
                    local.update { it.copy(materials = joinMaterial(it.materials, material)) }
                } catch (e: DocumentException) {
                    problems += e.message.orEmpty()
                }
            }
            local.update { it.copy(opening = false, error = problems.joinToString("\n").ifBlank { null }) }
        }
    }

    /** A file for the camera to fill, and the address to give the camera app. */
    fun newPhoto(): Pair<File, Uri> = container.documents.newPhoto()

    fun photoTaken(file: File, saved: Boolean) {
        if (!saved) {
            file.delete()
            return
        }
        local.update { it.copy(opening = true, error = null) }
        viewModelScope.launch {
            try {
                val material = container.documents.photo(file)
                local.update { it.copy(materials = joinMaterial(it.materials, material), opening = false) }
            } catch (e: DocumentException) {
                local.update { it.copy(opening = false, error = e.message) }
            }
        }
    }

    fun remove(index: Int) {
        val material = local.value.materials.getOrNull(index) ?: return
        container.documents.discard(material)
        local.update { it.copy(materials = it.materials.filterIndexed { at, _ -> at != index }) }
    }

    fun save(title: String, typed: String) {
        val current = local.value
        if (typed.isBlank() && current.materials.isEmpty()) return
        val pages = current.materials.any { it is Material.Pages }
        if (pages && !state.value.hasKey) {
            local.update { it.copy(error = "Pictures and PDFs are read by Claude. Add your API key in Settings first, or type the notes in.") }
            return
        }
        local.update { it.copy(error = null) }
        val source = if (current.kind == AddKind.REFERENCE) MeetingSource.DOCUMENT else MeetingSource.IMPORT
        if (!container.intake.submit(title, typed, current.materials, source)) {
            local.update { it.copy(error = "Aide is still reading the last thing you added. Try again when it has finished.") }
        }
    }

    /** The saved result has been shown; the pictures behind it are gone, so the list starts again. */
    fun finished() {
        local.update { it.copy(materials = emptyList()) }
        container.intake.acknowledge()
    }

    fun dismissError() {
        local.update { it.copy(error = null) }
        if (container.intake.state.value is IntakeState.Failed) container.intake.acknowledge()
    }

    override fun onCleared() {
        // While they are being read the pictures must stay; whatever is left over is cleared when the app next starts.
        if (container.intake.state.value !is IntakeState.Working) local.value.materials.forEach(container.documents::discard)
    }
}

class AddActions(
    val onBack: () -> Unit = {},
    val onKind: (AddKind) -> Unit = {},
    val onTakePhoto: () -> Unit = {},
    val onChoosePhotos: () -> Unit = {},
    val onChooseFiles: () -> Unit = {},
    val onRemove: (Int) -> Unit = {},
    val onSave: (title: String, typed: String) -> Unit = { _, _ -> },
    val onDismissError: () -> Unit = {},
    val onSettings: () -> Unit = {},
)

/** A rough cost of having Claude read [pages] pictures with the default model, for the user to see before they send them. */
fun readingCost(pages: Int): String {
    val cents = pages * 2.5
    return when {
        cents < 10 -> "a few cents"
        cents < 100 -> "roughly ${(cents / 5).toInt() * 5} cents"
        else -> "roughly $" + "%.2f".format(cents / 100)
    }
}

fun materialDetail(material: Material): String = when (material) {
    is Material.Words -> wordCount(material.text).let { if (it == 1) "1 word" else "%,d words".format(it) }
    is Material.Pages -> when {
        material.photos -> if (material.files.size == 1) "1 photo" else "${material.files.size} photos"
        else -> if (material.files.size == 1) "1 page" else "${material.files.size} pages"
    }
}

/**
 * Where the user brings things in by hand: notes they type or paste, files, photographs of
 * notes or a whiteboard. They say whether it is an account of a meeting or something to know.
 */
@Composable
fun AddScreen(state: AddState, initialText: String, actions: AddActions) {
    var title by rememberSaveable { mutableStateOf("") }
    var text by rememberSaveable { mutableStateOf(initialText) }
    val reference = state.kind == AddKind.REFERENCE
    val intake = state.intake

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Add to Aide") },
                navigationIcon = { IconButton(onClick = actions.onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back") } },
            )
        },
    ) { padding ->
        Column(
            Modifier.fillMaxSize().padding(padding).imePadding().verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(selected = !reference, onClick = { actions.onKind(AddKind.MEETING) }, enabled = !state.working, label = { Text("Notes from a meeting") })
                FilterChip(selected = reference, onClick = { actions.onKind(AddKind.REFERENCE) }, enabled = !state.working, label = { Text("Something to know") })
            }
            Text(
                if (reference) {
                    "A brief, a handbook, an org chart, your notes on a subject. Aide reads it closely and files what matters in the knowledge base. It makes no tasks unless the document assigns some."
                } else {
                    "Your notes, a transcript from Zoom, Teams or Meet, or photos of what you wrote down. Aide writes it up like a meeting it sat in on: summary, decisions, who is doing what."
                },
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text(if (reference) "Name (optional)" else "Meeting name (optional)") },
                singleLine = true,
                enabled = !state.working,
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
            )
            OutlinedTextField(
                value = text,
                onValueChange = { text = it },
                label = { Text("Type or paste") },
                minLines = 5,
                enabled = !state.working,
                supportingText = if (text.isBlank()) null else { { Text(wordCount(text).let { if (it == 1) "1 word" else "$it words" }) } },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
            )

            if (state.materials.isNotEmpty()) {
                AideCard(padding = 0.dp) {
                    state.materials.forEachIndexed { index, material ->
                        if (index > 0) HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                        MaterialRow(material, removable = !state.working, onRemove = { actions.onRemove(index) })
                    }
                }
            }

            Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                AddButton("Take a photo", AideIcons.Camera, !state.working, actions.onTakePhoto)
                AddButton("Photos", AideIcons.Image, !state.working, actions.onChoosePhotos)
                AddButton("File", AideIcons.Document, !state.working, actions.onChooseFiles)
            }
            if (state.opening) {
                Text("Opening…", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            } else if (state.materials.isEmpty()) {
                Text(
                    "Files can be PDFs, Word documents, text files or pictures.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }

            val problem = state.error ?: (intake as? IntakeState.Failed)?.message
            if (problem != null) Banner(problem, tone = Tone.BAD, action = "OK", onAction = actions.onDismissError)

            if (state.pageCount > 0 && !state.working) {
                Text(
                    (if (state.pageCount == 1) "1 page for Claude to read" else "${state.pageCount} pages for Claude to read") +
                        ", " + readingCost(state.pageCount) + " with the default model. The pictures are turned into text and not kept.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }

            if (intake is IntakeState.Working) {
                AideCard(container = MaterialTheme.colorScheme.tertiaryContainer) {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(
                            when {
                                intake.total == 0 -> "Saving…"
                                intake.done >= intake.total -> "Read all ${intake.total} pages. Saving…"
                                else -> "Reading page ${intake.done + 1} of ${intake.total}…"
                            },
                            style = MaterialTheme.typography.titleSmall,
                            color = MaterialTheme.colorScheme.onTertiaryContainer,
                        )
                        if (intake.total > 0) {
                            LinearProgressIndicator(progress = { intake.done.toFloat() / intake.total }, modifier = Modifier.fillMaxWidth())
                        } else {
                            LinearProgressIndicator(Modifier.fillMaxWidth())
                        }
                        Text(
                            "You can leave this screen. Aide carries on and the result turns up under Meetings.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onTertiaryContainer,
                        )
                    }
                }
            } else {
                Button(
                    onClick = { actions.onSave(title, text) },
                    enabled = (text.isNotBlank() || state.materials.isNotEmpty()) && !state.opening,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text(
                        when {
                            !state.hasKey -> "Save"
                            reference -> "Save and file what matters"
                            else -> "Save and write the notes"
                        },
                    )
                }
                if (!state.hasKey) {
                    Banner(
                        "Without a Claude API key Aide can keep what you type, but can't read pictures or write notes.",
                        tone = Tone.ASSISTANT,
                        icon = AideIcons.Key,
                        action = "Set up",
                        onAction = actions.onSettings,
                    )
                }
            }
            Spacer(Modifier.height(8.dp))
        }
    }
}

@Composable
private fun AddButton(label: String, icon: androidx.compose.ui.graphics.vector.ImageVector, enabled: Boolean, onClick: () -> Unit) {
    OutlinedButton(onClick = onClick, enabled = enabled, contentPadding = PaddingValues(horizontal = 14.dp, vertical = 8.dp)) {
        Icon(icon, contentDescription = null, modifier = Modifier.size(18.dp))
        Spacer(Modifier.width(8.dp))
        Text(label)
    }
}

@Composable
private fun MaterialRow(material: Material, removable: Boolean, onRemove: () -> Unit) {
    Column(Modifier.fillMaxWidth().padding(start = 16.dp, end = 4.dp, top = 8.dp, bottom = 8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Icon(
                when {
                    material is Material.Pages && material.photos -> AideIcons.Image
                    else -> AideIcons.Document
                },
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(22.dp),
            )
            Column(Modifier.weight(1f)) {
                Text(material.name, style = MaterialTheme.typography.bodyLarge, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Text(materialDetail(material), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            if (removable) {
                IconButton(onClick = onRemove) { Icon(Icons.Filled.Close, contentDescription = "Remove ${material.name}") }
            }
        }
        if (material is Material.Pages) {
            // Enough to recognise what was added; the full pictures are only for Claude.
            Row(Modifier.horizontalScroll(rememberScrollState()).padding(end = 12.dp), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                for (file in material.files.take(12)) Thumbnail(file)
                if (material.files.size > 12) {
                    Box(Modifier.size(width = 54.dp, height = 72.dp), contentAlignment = Alignment.Center) {
                        Text("+${material.files.size - 12}", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }
    }
}

@Composable
private fun Thumbnail(file: File) {
    val bitmap by produceState<android.graphics.Bitmap?>(initialValue = null, file) {
        value = withContext(Dispatchers.IO) {
            runCatching { BitmapFactory.decodeFile(file.path, BitmapFactory.Options().apply { inSampleSize = 8 }) }.getOrNull()
        }
    }
    val shape = MaterialTheme.shapes.small
    val shown = bitmap
    if (shown != null) {
        Image(
            shown.asImageBitmap(),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.size(width = 54.dp, height = 72.dp).clip(shape),
        )
    } else {
        Box(Modifier.size(width = 54.dp, height = 72.dp).clip(shape).background(MaterialTheme.colorScheme.surfaceContainerHigh))
    }
}
