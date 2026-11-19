package com.personal.aide.ui.settings

import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.ai.AideModel
import com.personal.aide.ai.KeyCheck
import com.personal.aide.data.Settings
import com.personal.aide.data.ThemeChoice
import com.personal.aide.notify.Brief
import com.personal.aide.notify.Reminders
import com.personal.aide.transcribe.Transcriber
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

data class SettingsState(
    val loaded: Boolean = false,
    val settings: Settings = Settings(),
    val hasKey: Boolean = false,
    val checkingKey: Boolean = false,
    /** Why the key just entered was not accepted. */
    val keyError: String? = null,
    /** Set when a key was saved, so the dialog can close. */
    val keySaved: Boolean = false,
    /** A one-line result to show the user, such as "Backup saved". */
    val message: String? = null,
)

class SettingsViewModel(private val container: AppContainer) : ViewModel() {
    private data class Transient(val checking: Boolean = false, val keyError: String? = null, val keySaved: Boolean = false, val message: String? = null)

    private val transient = MutableStateFlow(Transient())

    val state: StateFlow<SettingsState> = combine(container.settings.settings, container.secrets.hasKey, transient) { settings, hasKey, extra ->
        SettingsState(true, settings, hasKey, extra.checking, extra.keyError, extra.keySaved, extra.message)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), SettingsState())

    /** Checks the key with Claude and saves it if it works. [evenIfUnchecked] saves it regardless, for when the phone is offline. */
    fun saveKey(key: String, evenIfUnchecked: Boolean = false) {
        if (transient.value.checking) return
        transient.value = Transient(checking = true)
        viewModelScope.launch {
            val result = if (evenIfUnchecked) KeyCheck.Valid else container.llm.checkKey(key, container.settings.current().model)
            when (result) {
                KeyCheck.Valid -> transient.value = try {
                    container.secrets.setApiKey(key)
                    Transient(keySaved = true, message = if (evenIfUnchecked) "Key saved without checking it." else "Claude is connected.")
                } catch (e: Exception) {
                    Transient(keyError = "This phone couldn't store the key securely (${e.message ?: e.javaClass.simpleName}).")
                }
                is KeyCheck.Invalid -> transient.value = Transient(keyError = result.reason)
            }
        }
    }

    /** Tries the saved key against Claude from wherever the phone is now, and says what happened. */
    fun checkConnection() {
        if (transient.value.checking) return
        transient.value = Transient(checking = true)
        viewModelScope.launch {
            val key = runCatching { container.secrets.apiKey() }.getOrNull()
            val message = when {
                key.isNullOrBlank() -> "No API key is saved on this phone yet."
                else -> when (val result = container.llm.checkKey(key, container.settings.current().model)) {
                    KeyCheck.Valid -> "Claude can be reached from here, and your key works."
                    is KeyCheck.Invalid -> result.reason
                }
            }
            transient.value = Transient(message = message)
        }
    }

    fun removeKey() {
        viewModelScope.launch {
            container.secrets.setApiKey(null)
            transient.value = Transient(message = "API key removed from this phone.")
        }
    }

    fun clearKeyDialog() {
        transient.value = transient.value.copy(keyError = null, keySaved = false, checking = false)
    }

    fun clearMessage() {
        transient.value = transient.value.copy(message = null)
    }

    fun setModel(model: AideModel) = change { container.settings.setModel(model) }
    fun setLanguage(tag: String) = change { container.settings.setLanguage(tag) }
    fun setPreferOnDevice(on: Boolean) = change { container.settings.setPreferOnDevice(on) }
    fun setAutoSummarize(on: Boolean) = change { container.settings.setAutoSummarize(on) }
    fun setLearningMode(on: Boolean) = change { container.settings.setLearningMode(on) }
    fun setMuteChimes(on: Boolean) = change { container.settings.setMuteChimes(on) }
    fun setSensitivity(level: Transcriber.Sensitivity) = change { container.settings.setSensitivity(level) }
    fun setCalendar(on: Boolean) = change {
        container.settings.setCalendarEnabled(on)
        Reminders.sync(container)
    }

    fun setPrep(on: Boolean) = change {
        container.settings.setPrepEnabled(on)
        Reminders.sync(container)
    }

    fun setNudges(on: Boolean) = change {
        container.settings.setNudgesEnabled(on)
        Reminders.sync(container, restart = true)
    }
    fun setTheme(theme: ThemeChoice) = change { container.settings.setTheme(theme) }

    fun setBrief(enabled: Boolean, minutes: Int) = change {
        container.settings.setBrief(enabled, minutes)
        Brief.schedule(container.appContext, enabled, minutes)
    }

    private fun change(block: suspend () -> Unit) {
        viewModelScope.launch { block() }
    }

    fun exportTo(uri: Uri) {
        viewModelScope.launch {
            val message = runCatching {
                val json = container.backup.export()
                withContext(Dispatchers.IO) {
                    container.appContext.contentResolver.openOutputStream(uri)?.use { it.write(json.toByteArray(Charsets.UTF_8)) }
                        ?: error("Couldn't open that file.")
                }
                "Backup saved."
            }.getOrElse { "The backup couldn't be saved: ${it.message}" }
            transient.value = transient.value.copy(message = message)
        }
    }

    fun restoreFrom(uri: Uri) {
        if (recordingInTheWay()) return
        viewModelScope.launch {
            val message = runCatching {
                val json = withContext(Dispatchers.IO) {
                    container.appContext.contentResolver.openInputStream(uri)?.use { it.readBytes().toString(Charsets.UTF_8) }
                        ?: error("Couldn't open that file.")
                }
                container.backup.restore(json)
                "Backup restored."
            }.getOrElse { it.message ?: "That file couldn't be restored." }
            transient.value = transient.value.copy(message = message)
        }
    }

    /** Replacing or erasing everything would pull the meeting out from under a recording in progress. */
    private fun recordingInTheWay(): Boolean {
        if (!container.recorder.state.value.active) return false
        transient.value = transient.value.copy(message = "Stop the recording first.")
        return true
    }

    fun eraseEverything() {
        if (recordingInTheWay()) return
        viewModelScope.launch {
            container.backup.eraseEverything()
            transient.value = transient.value.copy(message = "Everything has been erased.")
        }
    }
}
