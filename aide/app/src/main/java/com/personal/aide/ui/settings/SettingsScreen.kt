@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.settings

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TimePicker
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberTimePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.personal.aide.ai.AideModel
import com.personal.aide.data.ThemeChoice
import com.personal.aide.ui.components.AideCard
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.Banner
import com.personal.aide.ui.components.ListRow
import com.personal.aide.ui.components.SectionHeader
import com.personal.aide.ui.components.Tone
import com.personal.aide.ui.components.Working
import java.util.Locale

class SettingsActions(
    val onBack: () -> Unit = {},
    val onSaveKey: (String, Boolean) -> Unit = { _, _ -> },
    val onRemoveKey: () -> Unit = {},
    val onClearKeyDialog: () -> Unit = {},
    val onClearMessage: () -> Unit = {},
    val onModel: (AideModel) -> Unit = {},
    val onLanguage: (String) -> Unit = {},
    val onPreferOnDevice: (Boolean) -> Unit = {},
    val onAutoSummarize: (Boolean) -> Unit = {},
    val onLearningMode: (Boolean) -> Unit = {},
    val onMuteChimes: (Boolean) -> Unit = {},
    val onBrief: (Boolean, Int) -> Unit = { _, _ -> },
    val onCalendar: (Boolean) -> Unit = {},
    val onPrep: (Boolean) -> Unit = {},
    val onNudges: (Boolean) -> Unit = {},
    val onAllowNotifications: () -> Unit = {},
    val onTheme: (ThemeChoice) -> Unit = {},
    val onExport: () -> Unit = {},
    val onRestore: () -> Unit = {},
    val onErase: () -> Unit = {},
    val onGetKey: () -> Unit = {},
    val onProfile: () -> Unit = {},
)

/** Languages offered for speech recognition; the phone's recognizer decides which it really supports. */
val speechLanguages: List<String> = listOf(
    "", "en-US", "en-GB", "en-AU", "en-CA", "en-IN", "es-ES", "es-MX", "es-US", "fr-FR", "fr-CA", "de-DE", "it-IT",
    "pt-BR", "pt-PT", "nl-NL", "sv-SE", "da-DK", "nb-NO", "fi-FI", "pl-PL", "cs-CZ", "ro-RO", "el-GR", "tr-TR",
    "ru-RU", "uk-UA", "he-IL", "ar-SA", "hi-IN", "id-ID", "vi-VN", "th-TH", "ja-JP", "ko-KR", "zh-CN", "zh-TW",
)

fun languageName(tag: String): String =
    if (tag.isBlank()) "The phone's language" else Locale.forLanguageTag(tag).let { it.getDisplayName(Locale.getDefault()).replaceFirstChar { c -> c.uppercase() } }

fun timeLabel(minutes: Int): String {
    val hour = minutes / 60
    val minute = minutes % 60
    val hour12 = if (hour % 12 == 0) 12 else hour % 12
    return "$hour12:${minute.toString().padStart(2, '0')} ${if (hour < 12) "AM" else "PM"}"
}

@Composable
fun SettingsScreen(state: SettingsState, appVersion: String, actions: SettingsActions, notificationsAllowed: Boolean = true) {
    val settings = state.settings
    // Briefs and reminders that are switched on but can't be shown: worth saying, since nothing else will.
    val silenced = !notificationsAllowed && (settings.briefEnabled || settings.nudgesEnabled || (settings.prepEnabled && settings.calendarEnabled))
    var keyDialog by remember { mutableStateOf(false) }
    var modelDialog by remember { mutableStateOf(false) }
    var languageDialog by remember { mutableStateOf(false) }
    var timeDialog by remember { mutableStateOf(false) }
    var eraseDialog by remember { mutableStateOf(false) }
    var restoreDialog by remember { mutableStateOf(false) }
    val snackbar = remember { SnackbarHostState() }

    LaunchedEffect(state.message) {
        state.message?.let {
            snackbar.showSnackbar(it)
            actions.onClearMessage()
        }
    }
    LaunchedEffect(state.keySaved) {
        if (state.keySaved) {
            keyDialog = false
            actions.onClearKeyDialog()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings") },
                navigationIcon = { IconButton(onClick = actions.onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back") } },
            )
        },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            item(key = "claude-header") { SectionHeader("Claude") }
            item(key = "claude") {
                AideCard(padding = 0.dp) {
                    ListRow(
                        title = "API key",
                        detail = if (state.hasKey) "Connected. Stored encrypted on this phone." else "Not set. Aide can transcribe, but can't write notes or answer questions.",
                        icon = AideIcons.Key,
                        onClick = { keyDialog = true },
                    ) { Text(if (state.hasKey) "Change" else "Add", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.primary) }
                    Divider()
                    ListRow(title = "Model", detail = settings.model.label + ". " + settings.model.blurb, icon = AideIcons.Sparkle, onClick = { modelDialog = true })
                }
            }

            item(key = "transcription-header") { SectionHeader("Transcription") }
            item(key = "transcription") {
                AideCard(padding = 0.dp) {
                    ListRow(title = "Meeting language", detail = languageName(settings.language), icon = AideIcons.Mic, onClick = { languageDialog = true })
                    Divider()
                    SwitchRow(
                        "Keep speech recognition on the phone",
                        "Uses the phone's own recognizer when it has your language, so audio doesn't leave the device. Off allows the network recognizer, which some phones do better with.",
                        settings.preferOnDevice,
                        actions.onPreferOnDevice,
                    )
                    Divider()
                    SwitchRow("Write notes when a recording stops", "Sends the transcript to Claude straight away. Off waits for you to ask.", settings.autoSummarize, actions.onAutoSummarize)
                    Divider()
                    SwitchRow(
                        "Silence the listening chime",
                        "Some phones beep each time the recognizer starts. This mutes media sound while recording.",
                        settings.muteChimes,
                        actions.onMuteChimes,
                    )
                }
            }

            item(key = "assistant-header") { SectionHeader("Assistant") }
            if (silenced) {
                item(key = "silenced") {
                    Banner(
                        "Aide isn't allowed to show notifications, so its briefs and reminders stay silent.",
                        tone = Tone.WARN,
                        action = "Allow",
                        onAction = actions.onAllowNotifications,
                    )
                }
            }
            item(key = "assistant") {
                AideCard(padding = 0.dp) {
                    ListRow(title = "Your work profile", detail = "What Aide knows about your job", icon = AideIcons.Knowledge, onClick = actions.onProfile)
                    Divider()
                    SwitchRow(
                        "Let Aide ask questions",
                        "After a meeting, Aide asks about names and terms it couldn't place. More often during your first five meetings.",
                        settings.learningMode,
                        actions.onLearningMode,
                    )
                    Divider()
                    SwitchRow("Show my calendar", "Read-only. Names recordings after the meeting you're in and shows the day on Today.", settings.calendarEnabled, actions.onCalendar)
                    if (settings.calendarEnabled) {
                        Divider()
                        SwitchRow(
                            "Brief me before meetings",
                            "Ten minutes before a calendar meeting: what was decided last time and what is still open with the people in it.",
                            settings.prepEnabled,
                            actions.onPrep,
                        )
                    }
                    Divider()
                    SwitchRow(
                        "Morning brief",
                        "A notification with what's due and what's on. Worked out on the phone; no Claude call.",
                        settings.briefEnabled,
                    ) { actions.onBrief(it, settings.briefMinutes) }
                    if (settings.briefEnabled) {
                        Divider()
                        ListRow(title = "Brief time", detail = timeLabel(settings.briefMinutes), icon = AideIcons.Clock, onClick = { timeDialog = true })
                    }
                    Divider()
                    SwitchRow(
                        "Afternoon reminders",
                        "Around 2 pm: what is still due today, and a nudge when something you're waiting on has gone quiet for five days.",
                        settings.nudgesEnabled,
                        actions.onNudges,
                    )
                }
            }

            item(key = "look-header") { SectionHeader("Appearance") }
            item(key = "look") {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    FilterChip(selected = settings.theme == ThemeChoice.SYSTEM, onClick = { actions.onTheme(ThemeChoice.SYSTEM) }, label = { Text("Follow the phone") })
                    FilterChip(selected = settings.theme == ThemeChoice.LIGHT, onClick = { actions.onTheme(ThemeChoice.LIGHT) }, label = { Text("Light") })
                    FilterChip(selected = settings.theme == ThemeChoice.DARK, onClick = { actions.onTheme(ThemeChoice.DARK) }, label = { Text("Dark") })
                }
            }

            item(key = "data-header") { SectionHeader("Your data") }
            item(key = "data") {
                AideCard(padding = 0.dp) {
                    ListRow(title = "Save a backup", detail = "Everything except the API key, as one file", onClick = actions.onExport)
                    Divider()
                    ListRow(title = "Restore from a backup", detail = "Replaces what is on this phone", onClick = { restoreDialog = true })
                    Divider()
                    ListRow(title = "Erase everything", detail = "Meetings, tasks, knowledge, conversations and your profile", onClick = { eraseDialog = true })
                }
            }

            item(key = "privacy-header") { SectionHeader("Privacy") }
            item(key = "privacy") {
                AideCard {
                    Text(
                        "Everything Aide stores lives on this phone and is left out of cloud backups. Audio is never saved: speech is turned into text as it is heard. " +
                            "When Aide writes notes, plans or answers, the transcript and the relevant parts of your tasks and knowledge base are sent to Claude " +
                            "(Anthropic's API) with your own key, and nowhere else. Let people know when you are transcribing a meeting; in many places the law requires it.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            item(key = "version") {
                Text("Aide $appVersion", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.outline, modifier = Modifier.padding(8.dp))
            }
        }
    }

    if (keyDialog) {
        KeyDialog(
            state = state,
            onDismiss = { keyDialog = false; actions.onClearKeyDialog() },
            onSave = actions.onSaveKey,
            onRemove = { actions.onRemoveKey(); keyDialog = false },
            onGetKey = actions.onGetKey,
        )
    }
    if (modelDialog) {
        AlertDialog(
            onDismissRequest = { modelDialog = false },
            title = { Text("Model") },
            text = {
                Column {
                    for (model in AideModel.entries) {
                        Row(
                            Modifier.fillMaxWidth().clickable { actions.onModel(model); modelDialog = false }.padding(vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            RadioButton(selected = settings.model == model, onClick = { actions.onModel(model); modelDialog = false })
                            Column {
                                Text(model.label, style = MaterialTheme.typography.bodyLarge)
                                Text(model.blurb, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    }
                }
            },
            confirmButton = { TextButton(onClick = { modelDialog = false }) { Text("Close") } },
        )
    }
    if (languageDialog) {
        AlertDialog(
            onDismissRequest = { languageDialog = false },
            title = { Text("Meeting language") },
            text = {
                LazyColumn(Modifier.heightIn(max = 420.dp)) {
                    items(speechLanguages, key = { it.ifEmpty { "default" } }) { tag ->
                        Row(
                            Modifier.fillMaxWidth().clickable { actions.onLanguage(tag); languageDialog = false }.padding(vertical = 2.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            RadioButton(selected = settings.language == tag, onClick = { actions.onLanguage(tag); languageDialog = false })
                            Text(languageName(tag), style = MaterialTheme.typography.bodyLarge)
                        }
                    }
                }
            },
            confirmButton = { TextButton(onClick = { languageDialog = false }) { Text("Close") } },
        )
    }
    if (timeDialog) {
        val picker = rememberTimePickerState(initialHour = settings.briefMinutes / 60, initialMinute = settings.briefMinutes % 60)
        AlertDialog(
            onDismissRequest = { timeDialog = false },
            title = { Text("Brief time") },
            text = { TimePicker(state = picker) },
            confirmButton = {
                TextButton(onClick = { actions.onBrief(true, picker.hour * 60 + picker.minute); timeDialog = false }) { Text("OK") }
            },
            dismissButton = { TextButton(onClick = { timeDialog = false }) { Text("Cancel") } },
        )
    }
    if (eraseDialog) {
        AlertDialog(
            onDismissRequest = { eraseDialog = false },
            title = { Text("Erase everything?") },
            text = { Text("All meetings, transcripts, tasks, knowledge, conversations and your work profile are deleted from this phone. This can't be undone. Your API key and settings stay.") },
            confirmButton = { TextButton(onClick = { eraseDialog = false; actions.onErase() }) { Text("Erase", color = MaterialTheme.colorScheme.error) } },
            dismissButton = { TextButton(onClick = { eraseDialog = false }) { Text("Cancel") } },
        )
    }
    if (restoreDialog) {
        AlertDialog(
            onDismissRequest = { restoreDialog = false },
            title = { Text("Restore from a backup?") },
            text = { Text("Everything on this phone is replaced with what is in the backup file.") },
            confirmButton = { TextButton(onClick = { restoreDialog = false; actions.onRestore() }) { Text("Choose file") } },
            dismissButton = { TextButton(onClick = { restoreDialog = false }) { Text("Cancel") } },
        )
    }
}

@Composable
private fun Divider() = HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)

@Composable
private fun SwitchRow(title: String, detail: String, checked: Boolean, onChange: (Boolean) -> Unit) {
    ListRow(title = title, detail = detail, onClick = { onChange(!checked) }) { Switch(checked = checked, onCheckedChange = onChange) }
}

@Composable
private fun KeyDialog(state: SettingsState, onDismiss: () -> Unit, onSave: (String, Boolean) -> Unit, onRemove: () -> Unit, onGetKey: () -> Unit) {
    var key by remember { mutableStateOf("") }
    var visible by remember { mutableStateOf(false) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Claude API key") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(
                    "Aide talks to Claude with your own key from the Claude Console. Usage is billed to that account, separately from any Claude subscription.",
                    style = MaterialTheme.typography.bodyMedium,
                )
                OutlinedTextField(
                    value = key,
                    onValueChange = { key = it.trim() },
                    label = { Text("sk-ant-…") },
                    singleLine = true,
                    isError = state.keyError != null,
                    supportingText = state.keyError?.let { message -> { Text(message) } },
                    visualTransformation = if (visible) VisualTransformation.None else PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password, autoCorrectEnabled = false),
                    trailingIcon = { TextButton(onClick = { visible = !visible }) { Text(if (visible) "Hide" else "Show") } },
                    modifier = Modifier.fillMaxWidth(),
                )
                if (state.checkingKey) Working("Checking with Claude…")
                Row(verticalAlignment = Alignment.CenterVertically) {
                    TextButton(onClick = onGetKey, contentPadding = PaddingValues(0.dp)) { Text("Get a key") }
                    if (state.keyError != null && key.isNotBlank()) {
                        TextButton(onClick = { onSave(key, true) }) { Text("Save anyway") }
                    }
                    if (state.hasKey) TextButton(onClick = onRemove) { Text("Remove key", color = MaterialTheme.colorScheme.error) }
                }
            }
        },
        confirmButton = { TextButton(onClick = { onSave(key, false) }, enabled = key.isNotBlank() && !state.checkingKey) { Text("Check & save") } },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
    )
}
