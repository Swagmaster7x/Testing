package com.personal.aide.data.db

import androidx.room.testing.MigrationTestHelper
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

/** A phone that has an earlier version of the app installed must keep its data when it updates. */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35])
class MigrationTest {
    @get:Rule
    val helper = MigrationTestHelper(InstrumentationRegistry.getInstrumentation(), AppDatabase::class.java)

    @Test
    fun `a version 1 database upgrades to version 2 and keeps its meetings and tasks`() {
        helper.createDatabase(NAME, 1).use { db ->
            db.execSQL(
                "INSERT INTO meetings (id, title, titleIsAuto, startedAt, source, status, attendees, meetingType, tldr, analysisJson, error, rating, wordCount, model) " +
                    "VALUES (1, 'Standup', 0, 1000, 'LIVE', 'READY', '[\"Dana\"]', 'standup', 'Short.', '', '', 1, 12, 'claude-opus-5-5')",
            )
            db.execSQL(
                "INSERT INTO tasks (id, title, details, owner, ownership, dueDay, priority, status, origin, meetingId, createdAt, evidence, edited) " +
                    "VALUES (7, 'Send the deck', '', '', 'MINE', 20777, 2, 'OPEN', 'AI', 1, 2000, 'Sam said so', 0)",
            )
        }

        val upgraded = helper.runMigrationsAndValidate(NAME, 2, true)

        upgraded.query("SELECT title, dueDay, priority, meetingId, suggestedTitle, kept FROM tasks WHERE id = 7").use { row ->
            assertTrue(row.moveToFirst())
            assertEquals("Send the deck", row.getString(0))
            assertEquals(20777L, row.getLong(1))
            assertEquals(2, row.getInt(2))
            assertEquals(1L, row.getLong(3))
            // The new columns start empty: nothing is known about how an old task came to be worded.
            assertEquals("", row.getString(4))
            assertEquals(0, row.getInt(5))
        }
        upgraded.query("SELECT title, rating FROM meetings WHERE id = 1").use { row ->
            assertTrue(row.moveToFirst())
            assertEquals("Standup", row.getString(0))
            assertEquals(1, row.getInt(1))
        }
        upgraded.close()
    }

    private companion object {
        const val NAME = "migration-test.db"
    }
}
