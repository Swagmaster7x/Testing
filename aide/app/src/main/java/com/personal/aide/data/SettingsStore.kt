package com.personal.aide.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.personal.aide.ai.AideModel
import com.personal.aide.transcribe.Transcriber
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

enum class ThemeChoice { SYSTEM, LIGHT, DARK }

data class Settings(
    val onboarded: Boolean = false,
    val model: AideModel = AideModel.OPUS,
    /** A language tag such as "en-US" for speech recognition; blank follows the phone. */
    val language: String = "",
    /** Keep recognition on the phone when it can, rather than a network service. */
    val preferOnDevice: Boolean = true,
    /** Summarize as soon as a recording stops. */
    val autoSummarize: Boolean = true,
    /** Let the assistant ask follow-up questions after meetings. */
    val learningMode: Boolean = true,
    /** Silence the chime some phones play each time the recognizer starts listening. */
    val muteChimes: Boolean = false,
    /** How hard to work at hearing quiet voices; anything but PHONE has the app capture and boost the audio itself. */
    val sensitivity: Transcriber.Sensitivity = Transcriber.Sensitivity.BOOSTED,
    /** This phone's recognizer has refused boosted audio, so recordings use its own microphone handling. */
    val boostUnsupported: Boolean = false,
    val briefEnabled: Boolean = false,
    /** Minutes after midnight for the morning brief. */
    val briefMinutes: Int = 8 * 60,
    val calendarEnabled: Boolean = false,
    /** A reminder with a brief ten minutes before each calendar meeting. Needs the calendar. */
    val prepEnabled: Boolean = true,
    /** An afternoon reminder of what is still due today and which follow-ups have gone quiet. */
    val nudgesEnabled: Boolean = true,
    val theme: ThemeChoice = ThemeChoice.SYSTEM,
)

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "aide_settings")

/** Preferences and the work profile. The API key is not here; see [SecretStore]. */
class SettingsStore(private val store: DataStore<Preferences>) {
    constructor(context: Context) : this(context.applicationContext.dataStore)

    val settings: Flow<Settings> = store.data.map { prefs ->
        Settings(
            onboarded = prefs[ONBOARDED] ?: false,
            model = AideModel.of(prefs[MODEL].orEmpty()),
            language = prefs[LANGUAGE].orEmpty(),
            preferOnDevice = prefs[ON_DEVICE] ?: true,
            autoSummarize = prefs[AUTO_SUMMARIZE] ?: true,
            learningMode = prefs[LEARNING] ?: true,
            muteChimes = prefs[MUTE_CHIMES] ?: false,
            sensitivity = runCatching { Transcriber.Sensitivity.valueOf(prefs[SENSITIVITY].orEmpty()) }.getOrDefault(Transcriber.Sensitivity.BOOSTED),
            boostUnsupported = prefs[BOOST_UNSUPPORTED] ?: false,
            briefEnabled = prefs[BRIEF_ENABLED] ?: false,
            briefMinutes = prefs[BRIEF_MINUTES] ?: (8 * 60),
            calendarEnabled = prefs[CALENDAR] ?: false,
            prepEnabled = prefs[PREP] ?: true,
            nudgesEnabled = prefs[NUDGES] ?: true,
            theme = runCatching { ThemeChoice.valueOf(prefs[THEME].orEmpty()) }.getOrDefault(ThemeChoice.SYSTEM),
        )
    }.distinctUntilChanged()

    val profile: Flow<WorkProfile> = store.data.map { prefs -> decodeProfile(prefs[PROFILE]) }.distinctUntilChanged()

    suspend fun current(): Settings = settings.first()
    suspend fun currentProfile(): WorkProfile = profile.first()

    suspend fun setOnboarded(value: Boolean) = store.edit { it[ONBOARDED] = value }
    suspend fun setModel(model: AideModel) = store.edit { it[MODEL] = model.id }
    suspend fun setLanguage(tag: String) = store.edit { it[LANGUAGE] = tag }
    suspend fun setPreferOnDevice(value: Boolean) = store.edit { it[ON_DEVICE] = value }
    suspend fun setAutoSummarize(value: Boolean) = store.edit { it[AUTO_SUMMARIZE] = value }
    suspend fun setLearningMode(value: Boolean) = store.edit { it[LEARNING] = value }
    suspend fun setMuteChimes(value: Boolean) = store.edit { it[MUTE_CHIMES] = value }

    /** Choosing a level is also a request to try boosting again on a phone that once refused it. */
    suspend fun setSensitivity(value: Transcriber.Sensitivity) = store.edit {
        it[SENSITIVITY] = value.name
        it[BOOST_UNSUPPORTED] = false
    }
    suspend fun setBoostUnsupported(value: Boolean) = store.edit { it[BOOST_UNSUPPORTED] = value }
    suspend fun setBrief(enabled: Boolean, minutes: Int) = store.edit {
        it[BRIEF_ENABLED] = enabled
        it[BRIEF_MINUTES] = minutes.coerceIn(0, 24 * 60 - 1)
    }
    suspend fun setCalendarEnabled(value: Boolean) = store.edit { it[CALENDAR] = value }
    suspend fun setPrepEnabled(value: Boolean) = store.edit { it[PREP] = value }
    suspend fun setNudgesEnabled(value: Boolean) = store.edit { it[NUDGES] = value }
    suspend fun setTheme(theme: ThemeChoice) = store.edit { it[THEME] = theme.name }

    suspend fun setProfile(profile: WorkProfile) = store.edit {
        it[PROFILE] = AideJson.encodeToString(WorkProfile.serializer(), profile)
    }

    suspend fun updateProfile(change: (WorkProfile) -> WorkProfile) = store.edit {
        it[PROFILE] = AideJson.encodeToString(WorkProfile.serializer(), change(decodeProfile(it[PROFILE])))
    }

    suspend fun clear() = store.edit { it.clear() }

    private fun decodeProfile(json: String?): WorkProfile =
        if (json.isNullOrBlank()) WorkProfile()
        else runCatching { AideJson.decodeFromString(WorkProfile.serializer(), json) }.getOrDefault(WorkProfile())

    private companion object {
        val ONBOARDED = booleanPreferencesKey("onboarded")
        val MODEL = stringPreferencesKey("model")
        val LANGUAGE = stringPreferencesKey("language")
        val ON_DEVICE = booleanPreferencesKey("on_device")
        val AUTO_SUMMARIZE = booleanPreferencesKey("auto_summarize")
        val LEARNING = booleanPreferencesKey("learning_mode")
        val MUTE_CHIMES = booleanPreferencesKey("mute_chimes")
        val SENSITIVITY = stringPreferencesKey("sensitivity")
        val BOOST_UNSUPPORTED = booleanPreferencesKey("boost_unsupported")
        val BRIEF_ENABLED = booleanPreferencesKey("brief_enabled")
        val BRIEF_MINUTES = intPreferencesKey("brief_minutes")
        val CALENDAR = booleanPreferencesKey("calendar")
        val PREP = booleanPreferencesKey("prep")
        val NUDGES = booleanPreferencesKey("nudges")
        val THEME = stringPreferencesKey("theme")
        val PROFILE = stringPreferencesKey("profile")
    }
}
