package com.personal.aide.ai

import com.personal.aide.data.Material
import com.personal.aide.data.MeetingStore
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.domain.intakeText
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface IntakeState {
    data object Idle : IntakeState

    /** Pages are being read by Claude: [done] of [total] so far. */
    data class Working(val done: Int, val total: Int) : IntakeState

    /** Nothing was saved. */
    data class Failed(val message: String) : IntakeState

    /** Saved as this meeting or document; its notes are written next, like any other's. */
    data class Done(val meetingId: Long) : IntakeState
}

/**
 * Takes in what the user adds by hand (typed notes, files, photographs) and saves it as a
 * meeting's notes or as a document. Pictures are read into text by Claude first. One at a time,
 * and it carries on if the user leaves the screen they started it from.
 */
class Intake(
    private val scope: CoroutineScope,
    private val assistant: Assistant,
    private val meetings: MeetingStore,
    /** Called once the text is saved, to have its notes written. */
    private val onSaved: suspend (meetingId: Long) -> Unit,
    /** Called when the page images are no longer needed, whether or not reading them worked. */
    private val onFinished: (materials: List<Material>, saved: Boolean) -> Unit = { _, _ -> },
) {
    private val _state = MutableStateFlow<IntakeState>(IntakeState.Idle)
    val state: StateFlow<IntakeState> = _state.asStateFlow()

    /** Starts taking the material in. False if something is already being taken in. */
    fun submit(title: String, typed: String, materials: List<Material>, source: MeetingSource): Boolean {
        if (_state.value is IntakeState.Working) return false
        val total = materials.sumOf { if (it is Material.Pages) it.files.size else 0 }
        _state.value = IntakeState.Working(0, total)
        scope.launch {
            var saved = false
            try {
                var before = 0
                val sections = ArrayList<Pair<String, String>>()
                for (material in materials) {
                    when (material) {
                        is Material.Words -> sections += material.name to material.text
                        is Material.Pages -> {
                            val start = before
                            sections += material.name to assistant.readPages(material.name, material.files) { done, _ ->
                                _state.value = IntakeState.Working(start + done, total)
                            }
                            before += material.files.size
                        }
                    }
                }
                val text = intakeText(typed, sections)
                if (text.isBlank()) {
                    _state.value = IntakeState.Failed("There was nothing to save.")
                    return@launch
                }
                val id = meetings.importText(title, text, source = source)
                saved = true
                _state.value = IntakeState.Done(id)
                onSaved(id)
            } catch (e: CancellationException) {
                _state.value = IntakeState.Idle
                throw e
            } catch (e: LlmException) {
                _state.value = IntakeState.Failed(e.message ?: "The pages couldn't be read.")
            } catch (e: Exception) {
                _state.value = IntakeState.Failed("That couldn't be saved. Try again.")
            } finally {
                onFinished(materials, saved)
            }
        }
        return true
    }

    /** The result has been seen; ready for the next thing. */
    fun acknowledge() {
        if (_state.value !is IntakeState.Working) _state.value = IntakeState.Idle
    }
}
