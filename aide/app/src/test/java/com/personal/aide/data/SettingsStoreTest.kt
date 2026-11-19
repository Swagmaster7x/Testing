package com.personal.aide.data

import android.app.Application
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.ai.AideModel
import com.personal.aide.testing.MemoryDataStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.cancelAndJoin
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import java.io.File

@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class SettingsStoreTest {
    @get:Rule
    val folder = TemporaryFolder()

    private val prefs: DataStore<Preferences> = MemoryDataStore()
    private val store = SettingsStore(prefs)

    // -------------------------------------------------------------------------------------------
    // Settings

    @Test
    fun `a fresh install has the documented defaults`(): Unit = runBlocking {
        val settings = store.current()
        assertEquals(Settings(), settings)
        assertFalse(settings.onboarded)
        assertEquals(AideModel.OPUS, settings.model)
        assertEquals("", settings.language)
        assertTrue(settings.preferOnDevice)
        assertTrue(settings.autoSummarize)
        assertTrue(settings.learningMode)
        assertFalse(settings.muteChimes)
        assertFalse(settings.briefEnabled)
        assertEquals(8 * 60, settings.briefMinutes)
        assertFalse(settings.calendarEnabled)
        assertTrue("briefs before meetings are on until turned off", settings.prepEnabled)
        assertTrue("so is the afternoon check-in", settings.nudgesEnabled)
        assertEquals(ThemeChoice.SYSTEM, settings.theme)
    }

    @Test
    fun `every setting can be changed and read back`(): Unit = runBlocking {
        store.setOnboarded(true)
        store.setModel(AideModel.HAIKU)
        store.setLanguage("en-GB")
        store.setPreferOnDevice(false)
        store.setAutoSummarize(false)
        store.setLearningMode(false)
        store.setMuteChimes(true)
        store.setBrief(enabled = true, minutes = 7 * 60 + 15)
        store.setCalendarEnabled(true)
        store.setPrepEnabled(false)
        store.setNudgesEnabled(false)
        store.setTheme(ThemeChoice.DARK)

        assertEquals(
            Settings(
                onboarded = true,
                model = AideModel.HAIKU,
                language = "en-GB",
                preferOnDevice = false,
                autoSummarize = false,
                learningMode = false,
                muteChimes = true,
                briefEnabled = true,
                briefMinutes = 7 * 60 + 15,
                calendarEnabled = true,
                prepEnabled = false,
                nudgesEnabled = false,
                theme = ThemeChoice.DARK,
            ),
            store.current(),
        )
    }

    @Test
    fun `the two reminders are switched off and on separately`(): Unit = runBlocking {
        store.setPrepEnabled(false)
        assertEquals(Settings(prepEnabled = false), store.current())

        store.setNudgesEnabled(false)
        store.setPrepEnabled(true)
        assertEquals(Settings(nudgesEnabled = false), store.current())

        store.setNudgesEnabled(true)
        assertEquals(Settings(), store.current())
    }

    @Test
    fun `the meeting briefs keep their own switch, apart from the calendar and the morning brief`(): Unit = runBlocking {
        store.setCalendarEnabled(true)
        store.setBrief(enabled = true, minutes = 8 * 60)
        store.setPrepEnabled(false)

        assertEquals(Settings(calendarEnabled = true, briefEnabled = true, prepEnabled = false), store.current())

        // Disconnecting the calendar doesn't forget that the user wanted briefs.
        store.setPrepEnabled(true)
        store.setCalendarEnabled(false)
        assertTrue(store.current().prepEnabled)
    }

    @Test
    fun `settings saved before the reminders existed read with both on`(): Unit = runBlocking {
        // What an earlier version left behind: its own keys and nothing about reminders.
        prefs.edit {
            it[stringPreferencesKey("model")] = "claude-sonnet-5-5"
            it[stringPreferencesKey("theme")] = "DARK"
        }

        assertEquals(Settings(model = AideModel.SONNET, theme = ThemeChoice.DARK, prepEnabled = true, nudgesEnabled = true), store.current())
    }

    @Test
    fun `changing one setting leaves the others alone`(): Unit = runBlocking {
        store.setModel(AideModel.SONNET)
        store.setLearningMode(false)
        store.setModel(AideModel.OPUS)
        assertEquals(Settings(learningMode = false), store.current())
    }

    @Test
    fun `each model can be chosen`(): Unit = runBlocking {
        for (model in AideModel.entries) {
            store.setModel(model)
            assertEquals(model, store.current().model)
        }
    }

    @Test
    fun `the brief time is kept within the day`(): Unit = runBlocking {
        store.setBrief(true, 2_000)
        assertEquals(24 * 60 - 1, store.current().briefMinutes)
        store.setBrief(true, -5)
        assertEquals(0, store.current().briefMinutes)
        store.setBrief(false, 9 * 60)
        assertEquals(Settings(briefEnabled = false, briefMinutes = 9 * 60), store.current())
    }

    @Test
    fun `a stored model or theme this version does not know falls back to the default`(): Unit = runBlocking {
        prefs.edit {
            it[stringPreferencesKey("model")] = "claude-retired-model"
            it[stringPreferencesKey("theme")] = "SEPIA"
        }
        assertEquals(AideModel.OPUS, store.current().model)
        assertEquals(ThemeChoice.SYSTEM, store.current().theme)
    }

    @Test
    fun `the model is stored by its API id`(): Unit = runBlocking {
        store.setModel(AideModel.SONNET)
        assertEquals("claude-sonnet-5-5", prefs.data.first()[stringPreferencesKey("model")])
        assertEquals(AideModel.SONNET, AideModel.of("claude-sonnet-5-5"))
        assertEquals(AideModel.OPUS, AideModel.of(""))
        assertEquals(AideModel.OPUS, AideModel.of("claude-opus-5-5"))
        assertEquals(AideModel.HAIKU, AideModel.of("claude-haiku-5-5"))
    }

    // -------------------------------------------------------------------------------------------
    // The work profile

    private val sam = WorkProfile(name = "Sam Rivera", role = "Product Manager", goals = listOf("Launch self-serve quoting"))

    @Test
    fun `there is no profile to begin with`(): Unit = runBlocking {
        assertEquals(WorkProfile(), store.currentProfile())
        assertTrue(store.currentProfile().isEmpty)
    }

    @Test
    fun `the profile is saved whole`(): Unit = runBlocking {
        store.setProfile(sam)
        assertEquals(sam, store.currentProfile())
        store.setProfile(WorkProfile())
        assertTrue(store.currentProfile().isEmpty)
    }

    @Test
    fun `an update builds on the profile as it stands`(): Unit = runBlocking {
        store.setProfile(sam)
        store.updateProfile { it.merge(ProfilePatch(company = "Northwind", goals = listOf("Hire a designer"))) }
        store.updateProfile { it.copy(manager = "Priya Nair") }

        assertEquals(
            sam.copy(company = "Northwind", manager = "Priya Nair", goals = listOf("Launch self-serve quoting", "Hire a designer")),
            store.currentProfile(),
        )
    }

    @Test
    fun `an update on an empty profile starts one`(): Unit = runBlocking {
        store.updateProfile { it.merge(ProfilePatch(name = "Sam")) }
        assertEquals(WorkProfile(name = "Sam"), store.currentProfile())
    }

    @Test
    fun `a damaged stored profile reads as empty instead of crashing`(): Unit = runBlocking {
        prefs.edit { it[stringPreferencesKey("profile")] = "{not json" }
        assertEquals(WorkProfile(), store.currentProfile())
        store.updateProfile { it.copy(name = "Sam") }
        assertEquals(WorkProfile(name = "Sam"), store.currentProfile())
    }

    @Test
    fun `the profile and the settings do not disturb each other`(): Unit = runBlocking {
        store.setProfile(sam)
        store.setModel(AideModel.HAIKU)
        store.setProfile(sam.copy(role = "Director"))

        assertEquals(Settings(model = AideModel.HAIKU), store.current())
        assertEquals("Director", store.currentProfile().role)
    }

    @Test
    fun `clearing returns everything to a fresh install`(): Unit = runBlocking {
        store.setProfile(sam)
        store.setOnboarded(true)
        store.setModel(AideModel.HAIKU)
        store.setPrepEnabled(false)
        store.setNudgesEnabled(false)
        store.clear()

        assertEquals(Settings(), store.current())
        assertEquals(WorkProfile(), store.currentProfile())
    }

    // -------------------------------------------------------------------------------------------
    // On disk

    @Test
    fun `what is saved is still there when the app starts again`(): Unit = runBlocking {
        val file = File(folder.newFolder(), "aide_settings.preferences_pb")

        val firstRun = Job()
        val first = SettingsStore(PreferenceDataStoreFactory.create(scope = CoroutineScope(Dispatchers.IO + firstRun)) { file })
        first.setModel(AideModel.SONNET)
        first.setBrief(true, 6 * 60 + 45)
        first.setTheme(ThemeChoice.LIGHT)
        first.setNudgesEnabled(false)
        first.setProfile(sam)
        // The process ends; only the file is left.
        firstRun.cancelAndJoin()

        val secondRun = Job()
        try {
            val second = SettingsStore(PreferenceDataStoreFactory.create(scope = CoroutineScope(Dispatchers.IO + secondRun)) { file })
            assertEquals(
                Settings(model = AideModel.SONNET, briefEnabled = true, briefMinutes = 6 * 60 + 45, theme = ThemeChoice.LIGHT, nudgesEnabled = false),
                second.current(),
            )
            assertEquals(sam, second.currentProfile())
        } finally {
            secondRun.cancelAndJoin()
        }
    }
}
